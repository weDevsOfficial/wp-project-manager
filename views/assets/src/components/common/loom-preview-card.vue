<template>
    <div class="pm-loom-preview-card" :class="cardClass" tabindex="0" role="button" @click="openInLoom" @keydown.enter.prevent="openInLoom" @keydown.space.prevent="openInLoom">
        <!-- Loading State -->
        <div v-if="loading" class="pm-loom-preview-loading">
            <span class="pm-spinner"></span>
            <span class="pm-loom-preview-loading-text">{{ __( 'Loading preview...', 'wedevs-project-manager' ) }}</span>
        </div>

        <!-- Error / Access Denied State -->
        <div v-else-if="isErrorState" class="pm-loom-preview-error">
            <div class="pm-loom-preview-icon">
                <svg height="24" width="24" viewBox="0 0 62 62" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#625DF5" d="M62,27.6H43.9l15.7-9.1l-3.4-6l-15.7,9.1l9.1-15.7l-6-3.5l-9.1,15.7V0h-6.9v18.1L18.5,2.4l-6,3.4l9.1,15.7L5.9,12.5l-3.4,6l15.7,9.1H0v6.9h18.1L2.4,43.5l3.4,6l15.7-9.1l-9.1,15.7l6,3.4l9.1-15.7V62h6.9V43.9l9.1,15.7l6-3.4l-9.1-15.7l15.7,9.1l3.4-6l-15.7-9.1H62L62,27.6L62,27.6z M31,40.4c-5.2,0-9.4-4.2-9.4-9.4c0-5.2,4.2-9.4,9.4-9.4c5.2,0,9.4,4.2,9.4,9.4C40.4,36.2,36.2,40.4,31,40.4z"/>
                </svg>
            </div>
            <div class="pm-loom-preview-info">
                <div class="pm-loom-preview-header-text">
                    <span class="pm-loom-preview-type">{{ typeLabel }}</span>
                </div>
                <div class="pm-loom-preview-url-row">
                    <span class="pm-loom-preview-url">{{ shortUrl }}</span>
                    <span class="pm-loom-preview-warning" v-tooltip:top-center="errorMessage">
                        <svg height="14" width="14" viewBox="0 0 16 16" fill="#e69500">
                            <path fill-rule="evenodd" d="M8.22 1.754a.25.25 0 00-.44 0L1.698 13.132a.25.25 0 00.22.368h12.164a.25.25 0 00.22-.368L8.22 1.754zm-1.763-.707c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0114.082 15H1.918a1.75 1.75 0 01-1.543-2.575L6.457 1.047zM9 11a1 1 0 11-2 0 1 1 0 012 0zm-.25-5.25a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5z"></path>
                        </svg>
                    </span>
                </div>
            </div>
            <button class="pm-loom-preview-refresh" @click.stop="$emit('refresh')" :title="__( 'Refresh', 'wedevs-project-manager' )">
                <svg height="14" width="14" viewBox="0 0 16 16" fill="#586069">
                    <path fill-rule="evenodd" d="M8 2.5a5.487 5.487 0 00-4.131 1.869l1.204 1.204A.25.25 0 014.896 6H1.25A.25.25 0 011 5.75V2.104a.25.25 0 01.427-.177l1.38 1.38A7.002 7.002 0 0114.95 7.16a.75.75 0 11-1.49.178A5.5 5.5 0 008 2.5zM1.705 8.005a.75.75 0 01.834.656 5.5 5.5 0 009.592 2.97l-1.204-1.204a.25.25 0 01.177-.427h3.646a.25.25 0 01.25.25v3.646a.25.25 0 01-.427.177l-1.38-1.38A7.002 7.002 0 011.05 8.84a.75.75 0 01.656-.834z"></path>
                </svg>
            </button>
        </div>

        <!-- Success State -->
        <div v-else-if="previewData" class="pm-loom-preview-success">
            <div class="pm-loom-preview-thumbnail" v-if="previewData.thumbnail_url">
                <img :src="previewData.thumbnail_url" :alt="previewData.title" @error="onThumbnailError" />
                <div class="pm-loom-preview-play-overlay">
                    <svg height="32" width="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16" cy="16" r="16" fill="rgba(0,0,0,0.6)"/>
                        <path d="M13 10.5v11l9-5.5-9-5.5z" fill="#ffffff"/>
                    </svg>
                </div>
                <span v-if="formattedDuration" class="pm-loom-preview-duration">{{ formattedDuration }}</span>
            </div>
            <div class="pm-loom-preview-thumbnail pm-loom-preview-thumbnail-fallback" v-else>
                <svg height="32" width="32" viewBox="0 0 62 62" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#625DF5" d="M62,27.6H43.9l15.7-9.1l-3.4-6l-15.7,9.1l9.1-15.7l-6-3.5l-9.1,15.7V0h-6.9v18.1L18.5,2.4l-6,3.4l9.1,15.7L5.9,12.5l-3.4,6l15.7,9.1H0v6.9h18.1L2.4,43.5l3.4,6l15.7-9.1l-9.1,15.7l6,3.4l9.1-15.7V62h6.9V43.9l9.1,15.7l6-3.4l-9.1-15.7l15.7,9.1l3.4-6l-15.7-9.1H62L62,27.6L62,27.6z M31,40.4c-5.2,0-9.4-4.2-9.4-9.4c0-5.2,4.2-9.4,9.4-9.4c5.2,0,9.4,4.2,9.4,9.4C40.4,36.2,36.2,40.4,31,40.4z"/>
                </svg>
                <span v-if="formattedDuration" class="pm-loom-preview-duration">{{ formattedDuration }}</span>
            </div>
            <div class="pm-loom-preview-info">
                <div class="pm-loom-preview-title-row">
                    <span class="pm-loom-preview-title" v-if="previewData.title">{{ previewData.title }}</span>
                    <span class="pm-loom-preview-type-badge pm-loom-type-video">
                        <svg height="11" width="11" viewBox="0 0 62 62" xmlns="http://www.w3.org/2000/svg" style="margin-right: 3px;">
                            <path fill="#625DF5" d="M62,27.6H43.9l15.7-9.1l-3.4-6l-15.7,9.1l9.1-15.7l-6-3.5l-9.1,15.7V0h-6.9v18.1L18.5,2.4l-6,3.4l9.1,15.7L5.9,12.5l-3.4,6l15.7,9.1H0v6.9h18.1L2.4,43.5l3.4,6l15.7-9.1l-9.1,15.7l6,3.4l9.1-15.7V62h6.9V43.9l9.1,15.7l6-3.4l-9.1-15.7l15.7,9.1l3.4-6l-15.7-9.1H62L62,27.6L62,27.6z M31,40.4c-5.2,0-9.4-4.2-9.4-9.4c0-5.2,4.2-9.4,9.4-9.4c5.2,0,9.4,4.2,9.4,9.4C40.4,36.2,36.2,40.4,31,40.4z"/>
                        </svg>
                        {{ typeLabel }}
                    </span>
                </div>
                <div v-if="previewData.description" class="pm-loom-preview-description">
                    {{ previewData.description }}
                </div>
                <div class="pm-loom-preview-meta">
                    <span v-if="previewData.author_name" class="pm-loom-preview-author">
                        <svg height="12" width="12" viewBox="0 0 16 16" fill="#586069" style="margin-right: 2px;">
                            <path fill-rule="evenodd" d="M10.5 5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm.061 3.073a4 4 0 10-5.123 0 6.004 6.004 0 00-3.431 5.142.75.75 0 001.498.07 4.5 4.5 0 018.99 0 .75.75 0 101.498-.07 6.005 6.005 0 00-3.432-5.142z"></path>
                        </svg>
                        {{ previewData.author_name }}
                    </span>
                    <span v-if="formattedDuration" class="pm-loom-preview-meta-sep">·</span>
                    <span v-if="formattedDuration" class="pm-loom-preview-meta-duration">
                        {{ formattedDuration }}
                    </span>
                    <span v-if="previewData.width && previewData.height" class="pm-loom-preview-meta-sep">·</span>
                    <span v-if="previewData.width && previewData.height" class="pm-loom-preview-meta-dimensions">
                        {{ previewData.width }}×{{ previewData.height }}
                    </span>
                    <span class="pm-loom-preview-meta-sep">·</span>
                    <span class="pm-loom-preview-provider">
                        <svg height="12" width="12" viewBox="0 0 62 62" xmlns="http://www.w3.org/2000/svg" style="margin-right: 2px;">
                            <path fill="#625DF5" d="M62,27.6H43.9l15.7-9.1l-3.4-6l-15.7,9.1l9.1-15.7l-6-3.5l-9.1,15.7V0h-6.9v18.1L18.5,2.4l-6,3.4l9.1,15.7L5.9,12.5l-3.4,6l15.7,9.1H0v6.9h18.1L2.4,43.5l3.4,6l15.7-9.1l-9.1,15.7l6,3.4l9.1-15.7V62h6.9V43.9l9.1,15.7l6-3.4l-9.1-15.7l15.7,9.1l3.4-6l-15.7-9.1H62L62,27.6L62,27.6z M31,40.4c-5.2,0-9.4-4.2-9.4-9.4c0-5.2,4.2-9.4,9.4-9.4c5.2,0,9.4,4.2,9.4,9.4C40.4,36.2,36.2,40.4,31,40.4z"/>
                        </svg>
                        {{ previewData.provider_name || 'Loom' }}
                    </span>
                </div>
            </div>
            <button class="pm-loom-preview-refresh" @click.stop="$emit('refresh')" :title="__( 'Refresh', 'wedevs-project-manager' )">
                <svg height="14" width="14" viewBox="0 0 16 16" fill="#586069">
                    <path fill-rule="evenodd" d="M8 2.5a5.487 5.487 0 00-4.131 1.869l1.204 1.204A.25.25 0 014.896 6H1.25A.25.25 0 011 5.75V2.104a.25.25 0 01.427-.177l1.38 1.38A7.002 7.002 0 0114.95 7.16a.75.75 0 11-1.49.178A5.5 5.5 0 008 2.5zM1.705 8.005a.75.75 0 01.834.656 5.5 5.5 0 009.592 2.97l-1.204-1.204a.25.25 0 01.177-.427h3.646a.25.25 0 01.25.25v3.646a.25.25 0 01-.427.177l-1.38-1.38A7.002 7.002 0 011.05 8.84a.75.75 0 01.656-.834z"></path>
                </svg>
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'pm-loom-preview-card',

    props: {
        previewData: {
            type: Object,
            default: function () {
                return null;
            }
        },
        loading: {
            type: Boolean,
            default: false
        },
        url: {
            type: String,
            default: ''
        }
    },

    computed: {
        cardClass: function () {
            if ( this.loading ) return 'is-loading';
            if ( this.isErrorState ) return 'is-error';
            return 'is-success';
        },

        isErrorState: function () {
            if ( !this.previewData ) return false;
            var state = this.previewData.state;
            return state === 'access_denied' || state === 'error' || state === 'rate_limited';
        },

        errorMessage: function () {
            if ( !this.previewData ) return '';
            return this.previewData.error || __( 'Access denied', 'wedevs-project-manager' );
        },

        typeLabel: function () {
            return __( 'Video', 'wedevs-project-manager' );
        },

        shortUrl: function () {
            if ( !this.url ) return '';
            try {
                var parsed = new URL( this.url );
                var path = parsed.pathname;
                if ( path.length > 50 ) {
                    path = path.substring( 0, 47 ) + '...';
                }
                return 'loom.com' + path;
            } catch ( e ) {
                return this.url;
            }
        },

        formattedDuration: function () {
            if ( !this.previewData || !this.previewData.duration ) return '';
            var totalSeconds = Math.floor( this.previewData.duration );
            if ( totalSeconds <= 0 ) return '';

            var hours   = Math.floor( totalSeconds / 3600 );
            var minutes = Math.floor( ( totalSeconds % 3600 ) / 60 );
            var seconds = totalSeconds % 60;

            var pad = function ( num ) {
                return num < 10 ? '0' + num : '' + num;
            };

            if ( hours > 0 ) {
                return hours + ':' + pad( minutes ) + ':' + pad( seconds );
            }
            return minutes + ':' + pad( seconds );
        }
    },

    methods: {
        openInLoom: function () {
            var targetUrl = this.url;
            if ( this.previewData && this.previewData.url ) {
                targetUrl = this.previewData.url;
            }
            if ( !targetUrl ) return;
            try {
                var parsed = new URL( targetUrl );
                if ( parsed.protocol !== 'https:' || !parsed.hostname.match( /^(www\.)?loom\.com$/ ) ) {
                    return;
                }
                window.open( targetUrl, '_blank', 'noopener,noreferrer' );
            } catch ( e ) {
                return;
            }
        },

        onThumbnailError: function ( e ) {
            e.target.style.display = 'none';
        }
    }
};
</script>

<style lang="less">
.pm-loom-preview-card {
    border: 1px solid #e1e4e8;
    border-radius: 6px;
    padding: 12px 16px;
    margin: 8px 0;
    background: #ffffff;
    cursor: pointer;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    position: relative;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;

    &:hover {
        border-color: #625df5;
        box-shadow: 0 1px 3px rgba(98, 93, 245, 0.15);
    }

    &.is-loading {
        opacity: 0.8;
    }

    .pm-loom-preview-loading {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 10px 0;
    }

    .pm-loom-preview-error,
    .pm-loom-preview-success {
        display: flex;
        align-items: flex-start;
        gap: 12px;
    }

    .pm-loom-preview-icon {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        margin-top: 2px;

        svg {
            display: block;
        }
    }

    .pm-loom-preview-info {
        flex: 1;
        min-width: 0;
    }

    .pm-loom-preview-loading-text {
        font-size: 13px;
        color: #586069;
    }

    .pm-loom-preview-header-text {
        margin-bottom: 2px;
        .pm-loom-preview-type {
            font-size: 14px;
            font-weight: 600;
            color: #37352f;
        }
    }

    .pm-loom-preview-url {
        font-size: 12px;
        color: #787774;
        word-break: break-all;
    }

    .pm-loom-preview-url-row {
        display: inline-flex;
        align-items: center;
        gap: 6px;
    }

    .pm-loom-preview-warning {
        display: inline-flex;
        align-items: center;
        cursor: pointer;

        svg {
            flex-shrink: 0;
        }
    }

    // Thumbnail styles
    .pm-loom-preview-thumbnail {
        position: relative;
        flex-shrink: 0;
        width: 140px;
        height: 79px;
        border-radius: 4px;
        overflow: hidden;
        background: #1a1a2e;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }
    }

    .pm-loom-preview-thumbnail-fallback {
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f0efff;
    }

    .pm-loom-preview-play-overlay {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 0.9;
        transition: opacity 0.2s;
    }

    &:hover .pm-loom-preview-play-overlay {
        opacity: 1;
    }

    .pm-loom-preview-duration {
        position: absolute;
        bottom: 4px;
        right: 4px;
        background: rgba(0, 0, 0, 0.75);
        color: #ffffff;
        font-size: 11px;
        padding: 1px 5px;
        border-radius: 3px;
        font-weight: 500;
        line-height: 1.4;
    }

    // Success state styles
    .pm-loom-preview-title-row {
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        gap: 8px;
        margin-bottom: 4px;
    }

    .pm-loom-preview-title {
        font-size: 14px;
        font-weight: 600;
        color: #37352f;
        line-height: 1.4;
        word-break: break-word;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .pm-loom-preview-type-badge {
        display: inline-flex;
        align-items: center;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 500;
        white-space: nowrap;
        flex-shrink: 0;
    }

    .pm-loom-type-video {
        background-color: #f0efff;
        color: #625df5;
    }

    .pm-loom-preview-description {
        font-size: 12px;
        color: #586069;
        margin-bottom: 4px;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .pm-loom-preview-meta {
        font-size: 12px;
        color: #787774;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 4px;
    }

    .pm-loom-preview-meta-sep {
        color: #c8c8c8;
        font-size: 10px;
    }

    .pm-loom-preview-meta-duration,
    .pm-loom-preview-meta-dimensions {
        font-size: 12px;
        color: #787774;
    }

    .pm-loom-preview-author,
    .pm-loom-preview-provider {
        display: inline-flex;
        align-items: center;
        gap: 2px;
    }

    // Refresh button
    .pm-loom-preview-refresh {
        position: absolute;
        top: 8px;
        right: 8px;
        background: none;
        border: 1px solid transparent;
        border-radius: 4px;
        padding: 4px;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s, background-color 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
            background-color: #f1f1ef;
            border-color: #e1e4e8;
        }
    }

    &:hover .pm-loom-preview-refresh {
        opacity: 1;
    }
}
</style>
