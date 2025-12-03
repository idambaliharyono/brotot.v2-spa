<script lang="ts">
	import { user } from "$lib/globalState";

    $effect(() => {
        console.log('testing this page', $user?.email)
    })
</script>
<h1 class="text-4xl text-green-800">New Member Successfully Registered</h1>