<template>
	<h2 class="pm-settings-nav-menu-wrap nav-tab-wrapper">
		<router-link class="nav-tab" :to="{name: 'general'}">
			General Settings
		</router-link>

		<router-link class="nav-tab" :to="{name: 'email'}">
			E-Mail Settings
		</router-link>
	</h2>
</template>

<style>
	.pm-settings-nav-menu-wrap .router-link-exact-active {
		margin-bottom: -1px;
		border-bottom: 1px solid #f1f1f1;
    	background: #f1f1f1;
	}
	    
</style>
