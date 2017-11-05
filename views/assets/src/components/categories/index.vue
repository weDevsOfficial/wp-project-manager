<template>
    <div>
        <router-view name="categories"></router-view>
    </div>
</template>

<script>
    import mixin from './mixin';
    import store from './store';

    export default {
        store
    }
</script>