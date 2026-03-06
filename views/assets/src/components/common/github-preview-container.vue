<template>
    <div class="pm-github-preview-container" v-if="previewsEnabled && githubUrls.length">
        <pm-github-preview-card
            v-for="(urlItem, index) in githubUrls"
            :key="urlItem.url + '-' + index"
            :url="urlItem.url"
            :preview-data="previews[urlItem.url] || null"
            :loading="loadingUrls[urlItem.url] || false"
            @refresh="fetchPreview(urlItem.url, true)"
        ></pm-github-preview-card>
    </div>
</template>

<script>
import GitHubPreviewCard from './github-preview-card.vue';

export default {
    name: 'pm-github-preview-container',

    components: {
        'pm-github-preview-card': GitHubPreviewCard
    },

    props: {
        content: {
            type: String,
            default: ''
        }
    },

    data: function () {
        return {
            previews: {},
            loadingUrls: {},
            contentDebounceTimer: null
        };
    },

    computed: {
        previewsEnabled: function () {
            var setting = PM_Vars.settings && PM_Vars.settings.github_enable_previews;
            return setting && setting !== 'false' && setting !== '0';
        },
        githubUrls: function () {
            if ( !this.previewsEnabled ) return [];
            return this.extractGitHubUrls( this.content );
        }
    },

    watch: {
        content: {
            handler: function () {
                var self = this;
                clearTimeout( self.contentDebounceTimer );
                self.contentDebounceTimer = setTimeout( function () {
                    self.fetchAllPreviews();
                }, 500 );
            },
            immediate: false
        }
    },

    mounted: function () {
        this.fetchAllPreviews();
    },

    methods: {
        /**
         * Extract GitHub issue/PR URLs from HTML content.
         */
        extractGitHubUrls: function ( content ) {
            if ( !content ) return [];

            // Strip HTML tags to get raw URLs
            var text = content.replace( /<[^>]+>/g, ' ' );
            // Also extract from href attributes
            var hrefPattern = /href=["']([^"']*github\.com[^"']*)["']/gi;
            var hrefMatches = [];
            var hrefMatch;
            while ( ( hrefMatch = hrefPattern.exec( content ) ) !== null ) {
                hrefMatches.push( hrefMatch[1] );
            }

            var pattern = /https?:\/\/github\.com\/([^\/\s]+)\/([^\/\s]+)\/(issues|pull)\/(\d+)/gi;
            var urls = [];
            var seen = {};
            var match;

            // Search in plain text
            while ( ( match = pattern.exec( text ) ) !== null ) {
                var url = match[0];
                if ( !seen[url] ) {
                    seen[url] = true;
                    urls.push({ url: url });
                }
            }

            // Search in href attributes
            for ( var i = 0; i < hrefMatches.length; i++ ) {
                var href = hrefMatches[i];
                var hrefRegex = /https?:\/\/github\.com\/([^\/\s]+)\/([^\/\s]+)\/(issues|pull)\/(\d+)/i;
                var hMatch = hrefRegex.exec( href );
                if ( hMatch ) {
                    var hUrl = hMatch[0];
                    if ( !seen[hUrl] ) {
                        seen[hUrl] = true;
                        urls.push({ url: hUrl });
                    }
                }
            }

            return urls;
        },

        /**
         * Fetch preview data for all detected URLs.
         */
        fetchAllPreviews: function () {
            var self = this;
            var urls = this.githubUrls;

            if ( !urls.length ) return;

            // Collect URLs that aren't already loaded
            var urlsToFetch = [];
            for ( var i = 0; i < urls.length; i++ ) {
                var url = urls[i].url;
                if ( !self.previews[url] && !self.loadingUrls[url] ) {
                    urlsToFetch.push( url );
                }
            }

            if ( !urlsToFetch.length ) return;

            // Use batch endpoint if multiple URLs
            if ( urlsToFetch.length > 1 ) {
                this.batchFetch( urlsToFetch );
            } else {
                this.fetchPreview( urlsToFetch[0], false );
            }
        },

        /**
         * Fetch preview for a single URL.
         */
        fetchPreview: function ( url, forceRefresh ) {
            var self = this;

            if ( !forceRefresh && self.previews[url] ) return;

            self.$set( self.loadingUrls, url, true );

            jQuery.ajax({
                url: self.setPermalink( PM_Vars.api_base_url + '/pm/v2/github/preview' ),
                type: 'POST',
                data: {
                    url: url,
                    is_admin: PM_Vars.is_admin,
                    force_refresh: forceRefresh ? 1 : 0
                },
                beforeSend: function ( xhr ) {
                    xhr.setRequestHeader( 'X-WP-Nonce', PM_Vars.permission );
                },
                success: function ( res ) {
                    if ( res && res.data ) {
                        self.$set( self.previews, url, res.data );
                    }
                },
                error: function () {
                    self.$set( self.previews, url, {
                        type: 'issue',
                        number: self.extractNumberFromUrl( url ),
                        state: 'error',
                        repository: self.extractRepoFromUrl( url ),
                        error: 'Could not fetch preview',
                        html_url: url
                    });
                },
                complete: function () {
                    self.$set( self.loadingUrls, url, false );
                }
            });
        },

        /**
         * Batch fetch previews for multiple URLs.
         */
        batchFetch: function ( urls ) {
            var self = this;

            // Set all as loading
            for ( var i = 0; i < urls.length; i++ ) {
                self.$set( self.loadingUrls, urls[i], true );
            }

            jQuery.ajax({
                url: self.setPermalink( PM_Vars.api_base_url + '/pm/v2/github/batch-preview' ),
                type: 'POST',
                data: {
                    urls: urls,
                    is_admin: PM_Vars.is_admin
                },
                beforeSend: function ( xhr ) {
                    xhr.setRequestHeader( 'X-WP-Nonce', PM_Vars.permission );
                },
                success: function ( res ) {
                    if ( res && res.data ) {
                        for ( var url in res.data ) {
                            if ( res.data.hasOwnProperty( url ) ) {
                                var item = res.data[url];
                                if ( item && item.data ) {
                                    self.$set( self.previews, url, item.data );
                                }
                            }
                        }
                    }
                },
                error: function () {
                    for ( var j = 0; j < urls.length; j++ ) {
                        var url = urls[j];
                        if ( !self.previews[url] ) {
                            self.$set( self.previews, url, {
                                type: 'issue',
                                number: self.extractNumberFromUrl( url ),
                                state: 'error',
                                repository: self.extractRepoFromUrl( url ),
                                error: 'Could not fetch preview',
                                html_url: url
                            });
                        }
                    }
                },
                complete: function () {
                    for ( var k = 0; k < urls.length; k++ ) {
                        self.$set( self.loadingUrls, urls[k], false );
                    }
                }
            });
        },

        /**
         * Build the permalink-compatible URL.
         */
        setPermalink: function ( url ) {
            url = url.replace( /([^:]\/)\/+/g, '$1' );
            return url;
        },

        /**
         * Extract issue/PR number from URL.
         */
        extractNumberFromUrl: function ( url ) {
            var match = url.match( /\/(issues|pull)\/(\d+)/ );
            return match ? parseInt( match[2] ) : 0;
        },

        /**
         * Extract repository info from URL.
         */
        extractRepoFromUrl: function ( url ) {
            var match = url.match( /github\.com\/([^\/]+)\/([^\/]+)\// );
            if ( match ) {
                return {
                    owner: match[1],
                    name: match[2],
                    full_name: match[1] + '/' + match[2]
                };
            }
            return { owner: '', name: '', full_name: '' };
        }
    }
};
</script>

<style lang="less">
.pm-github-preview-container {
    margin: 8px 0;
}
</style>
