<script lang='ts'>
    import { Members, Transactions, MembershipStatus } from "$lib/globalState";
	import { pageTitle } from "$lib/stores/title";
	import { onMount } from "svelte";

    onMount(() => {
        pageTitle.set('DASHBOARD')
    })
</script>
<h1 class="">helo idam, how are you?</h1>
