<template>
    <div class="pm-notion-preview-container" v-if="previewsEnabled && notionUrls.length">
        <pm-notion-preview-card
            v-for="(urlItem, index) in notionUrls"
            :key="urlItem.url + '-' + index"
            :url="urlItem.url"
            :preview-data="previews[urlItem.url] || null"
            :loading="loadingUrls[urlItem.url] || false"
            @refresh="fetchPreview(urlItem.url, true)"
        ></pm-notion-preview-card>
    </div>
</template>

<script>
import NotionPreviewCard from './notion-preview-card.vue';

export default {
    name: 'pm-notion-preview-container',

    components: {
        'pm-notion-preview-card': NotionPreviewCard
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
            var setting = PM_Vars.settings && PM_Vars.settings.notion_enable_previews;
            return setting && setting !== 'false' && setting !== '0';
        },
        notionUrls: function () {
            if ( !this.previewsEnabled ) return [];
            return this.extractNotionUrls( this.content );
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
         * Extract Notion URLs from HTML content.
         */
        extractNotionUrls: function ( content ) {
            if ( !content ) return [];

            // Strip HTML tags to get raw text
            var text = content.replace( /<[^>]+>/g, ' ' );
            // Also extract from href attributes
            var hrefPattern = /href=["']([^"']*notion\.so[^"']*)["']/gi;
            var hrefMatches = [];
            var hrefMatch;
            while ( ( hrefMatch = hrefPattern.exec( content ) ) !== null ) {
                hrefMatches.push( hrefMatch[1] );
            }

            // Match Notion URLs with a 32-char hex ID (with or without dashes)
            var pattern = /https?:\/\/(?:www\.)?notion\.so\/(?:[^\s<"']*?[-\/])?([\da-f]{32}|[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})(?:[?\s#<"']|$)/gi;
            var urls = [];
            var seen = {};
            var match;

            // Search in plain text
            while ( ( match = pattern.exec( text ) ) !== null ) {
                var fullMatch = match[0].replace( /[\s<"']$/, '' );
                // Reconstruct the full URL up to the ID
                var url = this.extractFullNotionUrl( text, match.index );
                if ( url && !seen[url] ) {
                    seen[url] = true;
                    urls.push({ url: url });
                }
            }

            // Search in href attributes
            for ( var i = 0; i < hrefMatches.length; i++ ) {
                var href = hrefMatches[i];
                if ( this.isNotionUrl( href ) && !seen[href] ) {
                    seen[href] = true;
                    urls.push({ url: href });
                }
            }

            return urls;
        },

        /**
         * Extract full Notion URL from text starting at given position.
         */
        extractFullNotionUrl: function ( text, startIndex ) {
            var urlPattern = /https?:\/\/(?:www\.)?notion\.so\/[^\s<"']+/gi;
            urlPattern.lastIndex = startIndex;
            var match = urlPattern.exec( text );
            if ( match && match.index === startIndex ) {
                return match[0];
            }
            return null;
        },

        /**
         * Check if a URL is a valid Notion URL with an ID.
         */
        isNotionUrl: function ( url ) {
            if ( !url ) return false;
            return /^https?:\/\/(?:www\.)?notion\.so\/.+/i.test( url ) &&
                   /[\da-f]{32}|[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}/i.test( url );
        },

        /**
         * Fetch preview data for all detected URLs.
         */
        fetchAllPreviews: function () {
            var self = this;
            var urls = this.notionUrls;

            if ( !urls.length ) return;

            var urlsToFetch = [];
            for ( var i = 0; i < urls.length; i++ ) {
                var url = urls[i].url;
                if ( !self.previews[url] && !self.loadingUrls[url] ) {
                    urlsToFetch.push( url );
                }
            }

            if ( !urlsToFetch.length ) return;

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
                url: self.setPermalink( PM_Vars.api_base_url + '/pm/v2/notion/preview' ),
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
                        type: 'page',
                        id: 'unknown',
                        state: 'error',
                        error: 'Could not fetch preview',
                        url: url
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

            for ( var i = 0; i < urls.length; i++ ) {
                self.$set( self.loadingUrls, urls[i], true );
            }

            jQuery.ajax({
                url: self.setPermalink( PM_Vars.api_base_url + '/pm/v2/notion/batch-preview' ),
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
                                type: 'page',
                                id: 'unknown',
                                state: 'error',
                                error: 'Could not fetch preview',
                                url: url
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
        }
    }
};
</script>

<style lang="less">
.pm-notion-preview-container {
    margin: 8px 0;
}
</style>
