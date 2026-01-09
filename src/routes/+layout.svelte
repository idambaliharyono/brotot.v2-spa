<script lang="ts">
	import { Toaster } from 'svelte-sonner';
	import "../app.css"
	import { onMount } from 'svelte';
	import { initializeAuth, user } from '$lib/globalState';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let { children } = $props()
	let authInitialize = false

	$effect(() => {
		if (authInitialize) return
		else {
			initializeAuth()
			authInitialize = true;
		}
	})
	$effect(() => {
	
		if (!authInitialize || $user === undefined) return;		


		if ($page.url.pathname === '/' && $user ) {
			goto('/dashboard')
		} else if ($page.url.pathname.startsWith('/dashboard') && !$user) {
			goto('/')
		}
	})
</script>
<div class="relative">
	<div class="fixed inset-0 bg-[url(/bg2.webp)] bg-cover bg-center"></div>
	<div class="fixed inset-0 z-10 bg-black/90"></div>
	<div class="relative inset-0 z-20">
		{@render children()}
	</div>
</div>
<Toaster richColors position='top-center'/>