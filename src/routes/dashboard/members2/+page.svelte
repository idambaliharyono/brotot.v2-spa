<script lang="ts">
	import { supabase } from "$lib/helper";
	import type { membership_status } from "$lib/types";
	import { toast } from "svelte-sonner";
	import MemberSkeleton from "./MemberSkeleton.svelte";
	import MemberCard from "./MemberCard.svelte";
	import MemberNavigation from "./MemberNavigation.svelte";
	import RenewModal from "./RenewModal.svelte";


    let members = $state<membership_status[]>([]);
    let loading = $state(true);

    $effect(() => {(async () => {
        const { data, error } = await supabase
            .from("membership_status")
            .select('*')
            .order('days_left', { ascending: false });

        if (error) {toast.error('fail at supabase')};
        members = data ?? [];
        loading = false;
    })();
});
// renew membership modal
    let showModal = $state(false);
    let selectedMember = $state<membership_status | null>(null)

    function openModal(member: membership_status){
        selectedMember = member;
        showModal = true
    }

    function closeModal(){
        showModal = false
    }

    function toWebp(url: string | null){
        if(!url)return "";
        return url.replace("/upload/", "/upload/f_auto,q_auto,w_900/")
    }

</script>
<MemberNavigation />
{#if loading}
   <div>
       <MemberSkeleton /> 
   </div>
{:else}
<div class="grid grid-cols-1 lg:grid-cols-3 gap-x-5 justify-center mx-1 place-items-center">
        {#each members as member}
        <MemberCard
        {member}
        {toWebp}
        on:openmodal={(e) => openModal(e.detail)} />
        {/each}
</div>
{/if}

{#if showModal && selectedMember}
    <RenewModal
    {selectedMember}
    on:close={() => showModal = false}
     />
{/if}