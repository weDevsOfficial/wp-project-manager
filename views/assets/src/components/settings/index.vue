<template>
    <div>
        <router-view name="general"></router-view>
        <router-view name="email"></router-view>
    </div>
</template>

<script>
    import store from './store';
    import mixin from './mixin';

    export default {
        store,
    }

</script>
