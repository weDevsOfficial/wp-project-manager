<template>
    <div class="pm-notion-preview-card" :class="cardClass" tabindex="0" role="button" @click="openInNotion" @keydown.enter.prevent="openInNotion" @keydown.space.prevent="openInNotion">
        <!-- Loading State -->
        <div v-if="loading" class="pm-notion-preview-loading">
            <span class="pm-spinner"></span>
            <span class="pm-notion-preview-loading-text">{{ __( 'Loading preview...', 'wedevs-project-manager' ) }}</span>
        </div>

        <!-- Error / Access Denied State -->
        <div v-else-if="isErrorState" class="pm-notion-preview-error">
            <div class="pm-notion-preview-icon">
                <svg height="20" width="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M5.716 29.2178L2.27664 24.9331C1.44913 23.9023 1 22.6346 1 21.3299V5.81499C1 3.86064 2.56359 2.23897 4.58071 2.10125L20.5321 1.01218C21.691 0.933062 22.8428 1.24109 23.7948 1.8847L29.3992 5.67391C30.4025 6.35219 31 7.46099 31 8.64426V26.2832C31 28.1958 29.4626 29.7793 27.4876 29.9009L9.78333 30.9907C8.20733 31.0877 6.68399 30.4237 5.716 29.2178Z" fill="white"/>
                    <path d="M11.2481 13.5787V13.3756C11.2481 12.8607 11.6605 12.4337 12.192 12.3982L16.0633 12.1397L21.417 20.0235V13.1041L20.039 12.9204V12.824C20.039 12.303 20.4608 11.8732 20.9991 11.8456L24.5216 11.6652V12.1721C24.5216 12.41 24.3446 12.6136 24.1021 12.6546L23.2544 12.798V24.0037L22.1906 24.3695C21.3018 24.6752 20.3124 24.348 19.8036 23.5803L14.6061 15.7372V23.223L16.2058 23.5291L16.1836 23.6775C16.1137 24.1423 15.7124 24.4939 15.227 24.5155L11.2481 24.6926C11.1955 24.1927 11.5701 23.7456 12.0869 23.6913L12.6103 23.6363V13.6552L11.2481 13.5787Z" fill="#000000"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M20.6749 2.96678L4.72347 4.05585C3.76799 4.12109 3.02734 4.88925 3.02734 5.81499V21.3299C3.02734 22.1997 3.32676 23.0448 3.87843 23.7321L7.3178 28.0167C7.87388 28.7094 8.74899 29.0909 9.65435 29.0352L27.3586 27.9454C28.266 27.8895 28.9724 27.1619 28.9724 26.2832V8.64426C28.9724 8.10059 28.6979 7.59115 28.2369 7.27951L22.6325 3.49029C22.0613 3.10413 21.3702 2.91931 20.6749 2.96678ZM5.51447 6.057C5.29261 5.89274 5.3982 5.55055 5.6769 5.53056L20.7822 4.44711C21.2635 4.41259 21.7417 4.54512 22.1309 4.82088L25.1617 6.96813C25.2767 7.04965 25.2228 7.22563 25.0803 7.23338L9.08387 8.10336C8.59977 8.12969 8.12193 7.98747 7.73701 7.7025L5.51447 6.057ZM8.33357 10.8307C8.33357 10.311 8.75341 9.88177 9.29027 9.85253L26.203 8.93145C26.7263 8.90296 27.1667 9.30534 27.1667 9.81182V25.0853C27.1667 25.604 26.7484 26.0328 26.2126 26.0633L9.40688 27.0195C8.8246 27.0527 8.33357 26.6052 8.33357 26.0415V10.8307Z" fill="#000000"/>
                </svg>
            </div>
            <div class="pm-notion-preview-info">
                <div class="pm-notion-preview-header-text">
                    <span class="pm-notion-preview-type">{{ typeLabel }}</span>
                </div>
                <div class="pm-notion-preview-url-row">
                    <span class="pm-notion-preview-url">{{ shortUrl }}</span>
                    <span class="pm-notion-preview-warning" v-tooltip:top-center="errorMessage">
                        <svg height="14" width="14" viewBox="0 0 16 16" fill="#e69500">
                            <path fill-rule="evenodd" d="M8.22 1.754a.25.25 0 00-.44 0L1.698 13.132a.25.25 0 00.22.368h12.164a.25.25 0 00.22-.368L8.22 1.754zm-1.763-.707c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0114.082 15H1.918a1.75 1.75 0 01-1.543-2.575L6.457 1.047zM9 11a1 1 0 11-2 0 1 1 0 012 0zm-.25-5.25a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5z"></path>
                        </svg>
                    </span>
                </div>
            </div>
            <button class="pm-notion-preview-refresh" @click.stop="$emit('refresh')" :title="__( 'Refresh', 'wedevs-project-manager' )">
                <svg height="14" width="14" viewBox="0 0 16 16" fill="#586069">
                    <path fill-rule="evenodd" d="M8 2.5a5.487 5.487 0 00-4.131 1.869l1.204 1.204A.25.25 0 014.896 6H1.25A.25.25 0 011 5.75V2.104a.25.25 0 01.427-.177l1.38 1.38A7.002 7.002 0 0114.95 7.16a.75.75 0 11-1.49.178A5.5 5.5 0 008 2.5zM1.705 8.005a.75.75 0 01.834.656 5.5 5.5 0 009.592 2.97l-1.204-1.204a.25.25 0 01.177-.427h3.646a.25.25 0 01.25.25v3.646a.25.25 0 01-.427.177l-1.38-1.38A7.002 7.002 0 011.05 8.84a.75.75 0 01.656-.834z"></path>
                </svg>
            </button>
        </div>

        <!-- Success State -->
        <div v-else-if="previewData" class="pm-notion-preview-success">
            <div class="pm-notion-preview-icon">
                <span v-if="isEmoji" class="pm-notion-preview-emoji">{{ previewData.icon }}</span>
                <svg v-else height="24" width="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M5.716 29.2178L2.27664 24.9331C1.44913 23.9023 1 22.6346 1 21.3299V5.81499C1 3.86064 2.56359 2.23897 4.58071 2.10125L20.5321 1.01218C21.691 0.933062 22.8428 1.24109 23.7948 1.8847L29.3992 5.67391C30.4025 6.35219 31 7.46099 31 8.64426V26.2832C31 28.1958 29.4626 29.7793 27.4876 29.9009L9.78333 30.9907C8.20733 31.0877 6.68399 30.4237 5.716 29.2178Z" fill="white"/>
                    <path d="M11.2481 13.5787V13.3756C11.2481 12.8607 11.6605 12.4337 12.192 12.3982L16.0633 12.1397L21.417 20.0235V13.1041L20.039 12.9204V12.824C20.039 12.303 20.4608 11.8732 20.9991 11.8456L24.5216 11.6652V12.1721C24.5216 12.41 24.3446 12.6136 24.1021 12.6546L23.2544 12.798V24.0037L22.1906 24.3695C21.3018 24.6752 20.3124 24.348 19.8036 23.5803L14.6061 15.7372V23.223L16.2058 23.5291L16.1836 23.6775C16.1137 24.1423 15.7124 24.4939 15.227 24.5155L11.2481 24.6926C11.1955 24.1927 11.5701 23.7456 12.0869 23.6913L12.6103 23.6363V13.6552L11.2481 13.5787Z" fill="#000000"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M20.6749 2.96678L4.72347 4.05585C3.76799 4.12109 3.02734 4.88925 3.02734 5.81499V21.3299C3.02734 22.1997 3.32676 23.0448 3.87843 23.7321L7.3178 28.0167C7.87388 28.7094 8.74899 29.0909 9.65435 29.0352L27.3586 27.9454C28.266 27.8895 28.9724 27.1619 28.9724 26.2832V8.64426C28.9724 8.10059 28.6979 7.59115 28.2369 7.27951L22.6325 3.49029C22.0613 3.10413 21.3702 2.91931 20.6749 2.96678ZM5.51447 6.057C5.29261 5.89274 5.3982 5.55055 5.6769 5.53056L20.7822 4.44711C21.2635 4.41259 21.7417 4.54512 22.1309 4.82088L25.1617 6.96813C25.2767 7.04965 25.2228 7.22563 25.0803 7.23338L9.08387 8.10336C8.59977 8.12969 8.12193 7.98747 7.73701 7.7025L5.51447 6.057ZM8.33357 10.8307C8.33357 10.311 8.75341 9.88177 9.29027 9.85253L26.203 8.93145C26.7263 8.90296 27.1667 9.30534 27.1667 9.81182V25.0853C27.1667 25.604 26.7484 26.0328 26.2126 26.0633L9.40688 27.0195C8.8246 27.0527 8.33357 26.6052 8.33357 26.0415V10.8307Z" fill="#000000"/>
                </svg>
            </div>
            <div class="pm-notion-preview-info">
                <div class="pm-notion-preview-title-row">
                    <span class="pm-notion-preview-title" v-if="previewData.title">{{ previewData.title }}</span>
                    <span class="pm-notion-preview-type-badge" :class="'pm-notion-type-' + previewData.type">
                        {{ typeLabel }}
                    </span>
                </div>
                <div class="pm-notion-preview-meta">
                    <span v-if="previewData.last_edited_by && previewData.last_edited_by.name" class="pm-notion-preview-editor">
                        <img v-if="previewData.last_edited_by.avatar_url" :src="previewData.last_edited_by.avatar_url" class="pm-notion-preview-editor-avatar" :alt="previewData.last_edited_by.name" />
                        {{ __( 'Last edited by', 'wedevs-project-manager' ) }} {{ previewData.last_edited_by.name }}
                    </span>
                    <span v-if="previewData.last_edited_by && previewData.last_edited_time" class="pm-notion-preview-dot">&middot;</span>
                    <span v-if="previewData.last_edited_time" class="pm-notion-preview-date">{{ relativeTime }}</span>
                </div>
            </div>
            <button class="pm-notion-preview-refresh" @click.stop="$emit('refresh')" :title="__( 'Refresh', 'wedevs-project-manager' )">
                <svg height="14" width="14" viewBox="0 0 16 16" fill="#586069">
                    <path fill-rule="evenodd" d="M8 2.5a5.487 5.487 0 00-4.131 1.869l1.204 1.204A.25.25 0 014.896 6H1.25A.25.25 0 011 5.75V2.104a.25.25 0 01.427-.177l1.38 1.38A7.002 7.002 0 0114.95 7.16a.75.75 0 11-1.49.178A5.5 5.5 0 008 2.5zM1.705 8.005a.75.75 0 01.834.656 5.5 5.5 0 009.592 2.97l-1.204-1.204a.25.25 0 01.177-.427h3.646a.25.25 0 01.25.25v3.646a.25.25 0 01-.427.177l-1.38-1.38A7.002 7.002 0 011.05 8.84a.75.75 0 01.656-.834z"></path>
                </svg>
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'pm-notion-preview-card',

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
            if ( !this.previewData ) return __( 'Notion', 'wedevs-project-manager' );
            if ( this.previewData.type === 'database' ) {
                return __( 'Database', 'wedevs-project-manager' );
            }
            return __( 'Page', 'wedevs-project-manager' );
        },

        isEmoji: function () {
            if ( !this.previewData || !this.previewData.icon ) return false;
            // Emoji icons are short strings (1-4 chars), not URLs
            return this.previewData.icon.length <= 4 && !this.previewData.icon.match( /^https?:\/\// );
        },

        shortUrl: function () {
            if ( !this.url ) return '';
            try {
                var parsed = new URL( this.url );
                var path = parsed.pathname;
                if ( path.length > 50 ) {
                    path = path.substring( 0, 47 ) + '...';
                }
                return 'notion.so' + path;
            } catch ( e ) {
                return this.url;
            }
        },

        relativeTime: function () {
            if ( !this.previewData || !this.previewData.last_edited_time ) return '';

            var now = new Date();
            var edited = new Date( this.previewData.last_edited_time );
            var diffMs = now - edited;
            var diffSecs = Math.floor( diffMs / 1000 );
            var diffMins = Math.floor( diffSecs / 60 );
            var diffHours = Math.floor( diffMins / 60 );
            var diffDays = Math.floor( diffHours / 24 );
            var diffMonths = Math.floor( diffDays / 30 );
            var diffYears = Math.floor( diffDays / 365 );

            if ( diffYears > 0 ) return sprintf( _n( '%d year ago', '%d years ago', diffYears, 'wedevs-project-manager' ), diffYears );
            if ( diffMonths > 0 ) return sprintf( _n( '%d month ago', '%d months ago', diffMonths, 'wedevs-project-manager' ), diffMonths );
            if ( diffDays > 0 ) return sprintf( _n( '%d day ago', '%d days ago', diffDays, 'wedevs-project-manager' ), diffDays );
            if ( diffHours > 0 ) return sprintf( _n( '%d hour ago', '%d hours ago', diffHours, 'wedevs-project-manager' ), diffHours );
            if ( diffMins > 0 ) return sprintf( _n( '%d minute ago', '%d minutes ago', diffMins, 'wedevs-project-manager' ), diffMins );
            return __( 'just now', 'wedevs-project-manager' );
        }
    },

    methods: {
        openInNotion: function () {
            var targetUrl = this.url;
            if ( this.previewData && this.previewData.url ) {
                targetUrl = this.previewData.url;
            }
            if ( !targetUrl ) return;
            try {
                var parsed = new URL( targetUrl );
                if ( parsed.protocol !== 'https:' || !parsed.hostname.match( /^(www\.)?notion\.so$/ ) ) {
                    return;
                }
                window.open( targetUrl, '_blank', 'noopener,noreferrer' );
            } catch ( e ) {
                return;
            }
        }
    }
};
</script>

<style lang="less">
.pm-notion-preview-card {
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
        border-color: #37352f;
        box-shadow: 0 1px 3px rgba(55, 53, 47, 0.1);
    }

    &.is-loading {
        opacity: 0.8;
    }

    .pm-notion-preview-loading {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 10px 0;
    }

    .pm-notion-preview-error,
    .pm-notion-preview-success {
        display: flex;
        align-items: flex-start;
        gap: 12px;
    }

    .pm-notion-preview-icon {
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

    .pm-notion-preview-emoji {
        font-size: 24px;
        line-height: 1;
    }

    .pm-notion-preview-info {
        flex: 1;
        min-width: 0;
    }

    .pm-notion-preview-loading-text {
        font-size: 13px;
        color: #586069;
    }

    .pm-notion-preview-header-text {
        margin-bottom: 2px;
        .pm-notion-preview-type {
            font-size: 14px;
            font-weight: 600;
            color: #37352f;
        }
    }

    .pm-notion-preview-url {
        font-size: 12px;
        color: #787774;
        word-break: break-all;
    }

    .pm-notion-preview-url-row {
        display: inline-flex;
        align-items: center;
        gap: 6px;
    }

    .pm-notion-preview-warning {
        display: inline-flex;
        align-items: center;
        cursor: pointer;

        svg {
            flex-shrink: 0;
        }
    }

    // Success state styles
    .pm-notion-preview-title-row {
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        gap: 8px;
        margin-bottom: 4px;
    }

    .pm-notion-preview-title {
        font-size: 14px;
        font-weight: 600;
        color: #37352f;
        line-height: 1.4;
        word-break: break-word;
    }

    .pm-notion-preview-type-badge {
        display: inline-flex;
        align-items: center;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 500;
        white-space: nowrap;
        flex-shrink: 0;
    }

    .pm-notion-type-page {
        background-color: #e8f0fe;
        color: #1967d2;
    }

    .pm-notion-type-database {
        background-color: #f3e8ff;
        color: #7c3aed;
    }

    .pm-notion-preview-meta {
        font-size: 12px;
        color: #787774;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 4px;
    }

    .pm-notion-preview-editor {
        display: inline-flex;
        align-items: center;
        gap: 4px;
    }

    .pm-notion-preview-editor-avatar {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        display: inline-block;
        vertical-align: middle;
    }

    .pm-notion-preview-dot {
        color: #b4b4b0;
    }

    .pm-notion-preview-date {
        color: #b4b4b0;
    }

    // Refresh button
    .pm-notion-preview-refresh {
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

    &:hover .pm-notion-preview-refresh {
        opacity: 1;
    }
}
</style>
