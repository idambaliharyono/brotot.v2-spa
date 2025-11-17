<script lang="ts">
	import { supabase } from '$lib/helper';
	import { Toaster } from 'svelte-sonner';
	import "../app.css"

	let { children } = $props()

</script>
{@render children()}
<Toaster richColors position='top-center'/>