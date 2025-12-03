<script lang='ts'>
import { MembershipStatus, isLoading } from "$lib/globalState";
	import { supabase } from "$lib/helper";
	import { toast } from "svelte-sonner";

$effect(() => {
    console.log('isLoading:', $isLoading)
    console.log('$MembershipStatus:', $MembershipStatus)
    console.log('key:', Object.keys($MembershipStatus))
    console.log('content:', Object.values($MembershipStatus))
    console.log('type:', typeof $MembershipStatus)
})
let rawMembers = $derived(Object.values($MembershipStatus))
</script>
{#each rawMembers as member}
    <h1>{member.nick_name}</h1>    
    <p>{member.full_name}</p>

{/each}