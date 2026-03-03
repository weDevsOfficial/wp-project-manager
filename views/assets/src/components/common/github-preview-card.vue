<template>
    <div class="pm-github-preview-card" :class="cardClass" tabindex="0" role="button" @click="openInGitHub" @keydown.enter.prevent="openInGitHub" @keydown.space.prevent="openInGitHub">
        <!-- Loading State -->
        <div v-if="loading" class="pm-github-preview-loading">
            <span class="pm-spinner"></span>
            <span class="pm-github-preview-loading-text">{{ __( 'Loading preview...', 'wedevs-project-manager' ) }}</span>
        </div>

        <!-- Error / Access Denied State -->
        <div v-else-if="isErrorState" class="pm-github-preview-error">
            <div class="pm-github-preview-icon">
                <svg height="20" width="20" viewBox="0 0 16 16" fill="#586069">
                    <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
            </div>
            <div class="pm-github-preview-info">
                <div class="pm-github-preview-header-text">
                    <span class="pm-github-preview-type">{{ typeLabel }} #{{ previewData.number }}</span>
                </div>
                <span class="pm-github-preview-repo">{{ repoName }}</span>
                <div class="pm-github-preview-warning-row">
                    <span class="pm-github-preview-warning">
                        <svg height="16" width="16" viewBox="0 0 16 16" fill="#e69500">
                            <path fill-rule="evenodd" d="M8.22 1.754a.25.25 0 00-.44 0L1.698 13.132a.25.25 0 00.22.368h12.164a.25.25 0 00.22-.368L8.22 1.754zm-1.763-.707c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0114.082 15H1.918a1.75 1.75 0 01-1.543-2.575L6.457 1.047zM9 11a1 1 0 11-2 0 1 1 0 012 0zm-.25-5.25a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5z"></path>
                        </svg>
                        <span>{{ errorMessage }}</span>
                    </span>
                </div>
            </div>
            <button class="pm-github-preview-refresh" @click.stop="$emit('refresh')" :title="__( 'Refresh', 'wedevs-project-manager' )">
                <svg height="14" width="14" viewBox="0 0 16 16" fill="#586069">
                    <path fill-rule="evenodd" d="M8 2.5a5.487 5.487 0 00-4.131 1.869l1.204 1.204A.25.25 0 014.896 6H1.25A.25.25 0 011 5.75V2.104a.25.25 0 01.427-.177l1.38 1.38A7.002 7.002 0 0114.95 7.16a.75.75 0 11-1.49.178A5.5 5.5 0 008 2.5zM1.705 8.005a.75.75 0 01.834.656 5.5 5.5 0 009.592 2.97l-1.204-1.204a.25.25 0 01.177-.427h3.646a.25.25 0 01.25.25v3.646a.25.25 0 01-.427.177l-1.38-1.38A7.002 7.002 0 011.05 8.84a.75.75 0 01.656-.834z"></path>
                </svg>
            </button>
        </div>

        <!-- Success State -->
        <div v-else-if="previewData" class="pm-github-preview-success">
            <div class="pm-github-preview-icon">
                <img v-if="previewData.author && previewData.author.avatar_url" 
                     :src="previewData.author.avatar_url" 
                     :alt="previewData.author.login"
                     class="pm-github-preview-avatar" />
                <svg v-else height="20" width="20" viewBox="0 0 16 16" fill="#586069">
                    <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
            </div>
            <div class="pm-github-preview-info">
                <div class="pm-github-preview-title-row">
                    <span class="pm-github-preview-title" v-if="previewData.title">{{ previewData.title }}</span>
                    <span class="pm-github-preview-status" :class="'pm-github-status-' + previewData.state">
                        <svg v-if="previewData.state === 'open'" height="12" width="12" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                            <path fill-rule="evenodd" d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"></path>
                        </svg>
                        <svg v-else-if="previewData.state === 'closed'" height="12" width="12" viewBox="0 0 16 16" fill="currentColor">
                            <path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path>
                        </svg>
                        <svg v-else-if="previewData.state === 'merged'" height="12" width="12" viewBox="0 0 16 16" fill="currentColor">
                            <path fill-rule="evenodd" d="M5 3.254V3.25v.005a.75.75 0 110-.005v.004zm.45 1.9a2.25 2.25 0 10-1.95.218v5.256a2.25 2.25 0 101.5 0V7.123A5.735 5.735 0 009.25 9h1.378a2.251 2.251 0 100-1.5H9.25a4.25 4.25 0 01-3.8-2.346zM12.75 9a.75.75 0 100-1.5.75.75 0 000 1.5zm-8.5 4.5a.75.75 0 100-1.5.75.75 0 000 1.5z"></path>
                        </svg>
                        {{ stateLabel }}
                    </span>
                </div>
                <div class="pm-github-preview-meta">
                    <span class="pm-github-preview-type-badge">{{ typeLabel }}</span>
                    <span class="pm-github-preview-number">#{{ previewData.number }}</span>
                    <span class="pm-github-preview-dot">&middot;</span>
                    <span class="pm-github-preview-author" v-if="previewData.author">{{ previewData.author.login }}</span>
                    <span class="pm-github-preview-dot" v-if="previewData.created_at">&middot;</span>
                    <span class="pm-github-preview-date" v-if="previewData.created_at">{{ relativeTime }}</span>
                </div>
                <div class="pm-github-preview-labels" v-if="previewData.labels && previewData.labels.length">
                    <span v-for="(label, index) in previewData.labels" 
                          :key="index" 
                          class="pm-github-label"
                          :style="labelStyle(label)">
                        {{ label.name }}
                    </span>
                </div>
            </div>
            <button class="pm-github-preview-refresh" @click.stop="$emit('refresh')" :title="__( 'Refresh', 'wedevs-project-manager' )">
                <svg height="14" width="14" viewBox="0 0 16 16" fill="#586069">
                    <path fill-rule="evenodd" d="M8 2.5a5.487 5.487 0 00-4.131 1.869l1.204 1.204A.25.25 0 014.896 6H1.25A.25.25 0 011 5.75V2.104a.25.25 0 01.427-.177l1.38 1.38A7.002 7.002 0 0114.95 7.16a.75.75 0 11-1.49.178A5.5 5.5 0 008 2.5zM1.705 8.005a.75.75 0 01.834.656 5.5 5.5 0 009.592 2.97l-1.204-1.204a.25.25 0 01.177-.427h3.646a.25.25 0 01.25.25v3.646a.25.25 0 01-.427.177l-1.38-1.38A7.002 7.002 0 011.05 8.84a.75.75 0 01.656-.834z"></path>
                </svg>
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'pm-github-preview-card',

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
            return this.previewData.error || 'Access denied';
        },

        typeLabel: function () {
            if ( !this.previewData ) return '';
            if ( this.previewData.type === 'pull_request' ) {
                return __( 'Pull Request', 'wedevs-project-manager' );
            }
            return __( 'Issue', 'wedevs-project-manager' );
        },

        stateLabel: function () {
            if ( !this.previewData ) return '';
            var state = this.previewData.state;
            if ( state === 'open' ) return __( 'Open', 'wedevs-project-manager' );
            if ( state === 'closed' ) return __( 'Closed', 'wedevs-project-manager' );
            if ( state === 'merged' ) return __( 'Merged', 'wedevs-project-manager' );
            return state;
        },

        repoName: function () {
            if ( !this.previewData || !this.previewData.repository ) return '';
            return this.previewData.repository.full_name || '';
        },

        relativeTime: function () {
            if ( !this.previewData || !this.previewData.created_at ) return '';

            var now = new Date();
            var created = new Date( this.previewData.created_at );
            var diffMs = now - created;
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
        openInGitHub: function () {
            var targetUrl = this.url;
            if ( this.previewData && this.previewData.html_url ) {
                targetUrl = this.previewData.html_url;
            }
            if ( !targetUrl ) return;
            try {
                var parsed = new URL( targetUrl );
                if ( parsed.protocol !== 'https:' || !parsed.hostname.match( /(^|\.)github\.com$/ ) ) {
                    return;
                }
                window.open( targetUrl, '_blank', 'noopener,noreferrer' );
            } catch ( e ) {
                return;
            }
        },

        labelStyle: function ( label ) {
            if ( !label.color ) return {};
            var hex = label.color;
            var r = parseInt( hex.substring(0, 2), 16 );
            var g = parseInt( hex.substring(2, 4), 16 );
            var b = parseInt( hex.substring(4, 6), 16 );
            // Calculate perceived brightness
            var brightness = ( r * 299 + g * 587 + b * 114 ) / 1000;
            var textColor = brightness > 128 ? '#24292e' : '#ffffff';
            return {
                backgroundColor: '#' + hex,
                color: textColor
            };
        }
    }
};
</script>

<style lang="less">
.pm-github-preview-card {
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
        border-color: #0366d6;
        box-shadow: 0 1px 3px rgba(3, 102, 214, 0.1);
    }

    &.is-loading {
        opacity: 0.8;
    }

    .pm-github-preview-loading {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 10px 0;
    }

    .pm-github-preview-error,
    .pm-github-preview-success {
        display: flex;
        align-items: flex-start;
        gap: 12px;
    }

    .pm-github-preview-icon {
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

    .pm-github-preview-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: block;
    }

    .pm-github-preview-info {
        flex: 1;
        min-width: 0;
    }

    .pm-github-preview-loading-text {
        font-size: 13px;
        color: #586069;
    }

    // Header text for error state
    .pm-github-preview-header-text {
        margin-bottom: 2px;
        .pm-github-preview-type {
            font-size: 14px;
            font-weight: 600;
            color: #24292e;
        }
    }

    .pm-github-preview-repo {
        font-size: 12px;
        color: #586069;
    }

    .pm-github-preview-warning-row {
        margin-top: 4px;
    }

    .pm-github-preview-warning {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        color: #856404;

        svg {
            flex-shrink: 0;
        }
    }

    // Success state styles
    .pm-github-preview-title-row {
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        gap: 8px;
        margin-bottom: 4px;
    }

    .pm-github-preview-title {
        font-size: 14px;
        font-weight: 600;
        color: #24292e;
        line-height: 1.4;
        word-break: break-word;
    }

    .pm-github-preview-status {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
        white-space: nowrap;
        flex-shrink: 0;
    }

    .pm-github-status-open {
        background-color: #dcffe4;
        color: #22863a;
    }

    .pm-github-status-closed {
        background-color: #ffdce0;
        color: #cb2431;
    }

    .pm-github-status-merged {
        background-color: #f1e5f9;
        color: #6f42c1;
    }

    .pm-github-preview-meta {
        font-size: 12px;
        color: #586069;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 4px;
    }

    .pm-github-preview-type-badge {
        color: #586069;
    }

    .pm-github-preview-number {
        color: #586069;
        font-weight: 500;
    }

    .pm-github-preview-dot {
        color: #959da5;
    }

    .pm-github-preview-author {
        color: #586069;
    }

    .pm-github-preview-date {
        color: #959da5;
    }

    .pm-github-preview-labels {
        margin-top: 6px;
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
    }

    .pm-github-label {
        display: inline-block;
        padding: 1px 6px;
        border-radius: 10px;
        font-size: 11px;
        font-weight: 500;
        line-height: 1.6;
    }

    // Refresh button
    .pm-github-preview-refresh {
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
            background-color: #f1f3f5;
            border-color: #e1e4e8;
        }
    }

    &:hover .pm-github-preview-refresh {
        opacity: 1;
    }
}
</style>
