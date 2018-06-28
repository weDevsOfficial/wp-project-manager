<template>
    <div>
        <router-view name="milestones"></router-view>
        <router-view name="individual-milestone"></router-view>
    </div>
</template>

<script>
    import store from './store';
    import mixin from './mixin';
    
    export default {
        store,
    }
</script>