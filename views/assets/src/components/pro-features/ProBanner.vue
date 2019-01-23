<template>
    <!-- start banner section -->
    <section
        class="pm-section pm-section-wrapper pm-banner-section"
        :style="
            'background: url(' +
                getAssetUrl('images/pro-feature/banner.png') +
                ')'
        "
    >
        <div class="pm-section-container">
            <div class="pm-banner-text pm-text-center">
                <p class="pm-welcome-to">
                    {{ __("Project Manager Pro", "wedevs-project-manager") }}
                </p>
                <h1 class="pm-project-title">
                    {{ __("Premium Features", "wedevs-project-manager") }}
                </h1>
                <p>
                    Lorem Ipsum is simply dummy text of the printing and<br />typesetting
                    industry. Lorem Ipsum has been.
                </p>
            </div>
        </div>
    </section>
    <!-- end banner section -->
</template>
<script>
export default {
    data() {
        return {};
    }
};
</script>

<style lang="less" scoped>
.pm-banner-section {
    min-height: 469px;
    background-size: cover !important;
    border-radius: 3px;
    padding: 80px 60px;
    color: #fff;
    font-weight: 300;
    margin-bottom: 0;
    @media (max-width: 767px) {
        padding: 60px 20px;
    }

    p {
        color: #e8d4f9;
        font-size: 16px;
        line-height: 25px;
        margin-bottom: 15px;
    }
    .pm-welcome-to {
        color: #f4b9ff;
        margin: 0 0 5px;
    }
    .pm-project-title {
        color: #fff;
        font-size: 30px;
    }
}
</style>
