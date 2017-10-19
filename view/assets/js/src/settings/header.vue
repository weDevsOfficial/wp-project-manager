<template>
	<h2 class="pm-settings-nav-menu-wrap nav-tab-wrapper">
		<router-link class="nav-tab" :to="{name: 'general'}">
			{{text.general_settings}}
		</router-link>

		<router-link class="nav-tab" :to="{name: 'email'}">
			{{text.email_settings}}
		</router-link>
	</h2>
</template>
