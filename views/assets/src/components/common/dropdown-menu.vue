<template>
    <fragment>
        <pm-triangle-box popoverClass="pm-dorpdown-menu">
            <slot></slot>
            <fragment slot="popoverButton">
                <slot name="clickButton"></slot>
            </fragment>
        </pm-triangle-box>
    </fragment>
</template>

<style lang="less">
    .pm-dorpdown-menu {
        z-index: 99;
        .pm-dorpdown-menu-ul {
            padding: 0 !important;
            margin: 0 !important;

            .pm-dorpdown-menu-li {
                padding: 0 !important;
                margin: 0 !important;

                .pm-dorpdown-menu-link {
                    margin: 0 !important;
                    text-decoration: none;
                    box-shadow: none !important;
                    display: flex;
                    padding-bottom: 6px;
                    align-items: center;

                    .pm-dorpdown-menu-text {
                        font-size: 13px;
                        color: #444;
                    }

                    .pm-dorpdown-menu-icon {
                        padding: 0 !important;
                        margin: 0 !important;
                        width: 24px;

                        &:before {
                            padding: 0 !important;
                            margin: 0 !important;
                            font-size: 12px !important;
                        }

                        &:after {
                            padding: 0 !important;
                            margin: 0 !important;
                            font-size: 12px !important;
                        }
                    }
                }
            }

            .pm-dorpdown-menu-li.first {
                .pm-dorpdown-menu-link {
                    padding-top: 6px;
                }
            }
        }
    }
</style>
