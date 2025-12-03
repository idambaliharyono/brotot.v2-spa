<script lang="ts">

	import type { membership_status } from "$lib/types";
	import MemberSkeleton from "./MemberSkeleton.svelte";
	import MemberCard from "./MemberCard.svelte";
	import MemberNavigation from "./MemberNavigation.svelte";
	import RenewModal from "./RenewModal.svelte";
    import { MembershipStatus, isLoading, loadAllData } from "$lib/globalState";
	import { string } from "zod";
	import EditModal from "./EditModal.svelte";

    export const ssr = false;
    export const prerender = false;


    let loading = $derived($isLoading);
    let rawMembers = $derived(Object.values($MembershipStatus)) 



// renew membership modal
    let showRenewModal = $state(false);
    let selectedMember = $state<membership_status | null>(null)

    function openRenewModal(member: membership_status){
        selectedMember = member;
        showRenewModal = true
    }

    function UpdateLocalMember(updated: membership_status) {
        rawMembers = rawMembers.map(m => m.member_id === updated.member_id ? updated : m)
    }

// edit member modal
    let showEditModal = $state(false);

    function openEditModal(member: membership_status){
        selectedMember = member;
        showEditModal = true
    }

    function EditLocalMember(updated: membership_status) {
        rawMembers = rawMembers.map(m => m.member_id === updated.member_id ? updated : m)
    }

// helper
    function toWebp(url: string | null){
        if(!url)return "";
        return url.replace("/upload/", "/upload/f_auto,q_auto,w_900/")
    }

    let search = $state<string>("")
    let memberColor = $state<"red" | "green" | "blue">("green")
    
    let members3 = $derived.by(() => {
        let filteredByName = rawMembers.filter( m => {
            const q = search.toLocaleLowerCase();
            const full = String(m.full_name ?? "").toLocaleLowerCase();
            const nick =(m.nick_name ?? "").toLocaleLowerCase();

            return full.includes(q) || nick.includes(q); 
        
        })
        
        let filteredByColor = filteredByName.filter( m => {
            if (!memberColor) return true ;
            const color = String(m.color ?? "").toLocaleLowerCase();
            
            return color.includes(memberColor.toLocaleLowerCase())
})
    return filteredByColor
    })
</script>



    <MemberNavigation bind:search bind:memberColor/>
    {#if loading}
       <div>
           <MemberSkeleton />
       </div>
    {:else}
<div class="flex flex-col items-center justify-center">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-x-5 justify-center mx-1 place-items-center">
            {#each members3 as member}
            <MemberCard
            {member}
            {toWebp}
            on:openrenewmodal={(e) => openRenewModal(e.detail)}
            on:openeditmodal={(e) => openEditModal(e.detail)} />
            {/each}
    </div>
</div>
    {/if}
    
    {#if showRenewModal && selectedMember}
        <RenewModal
        {selectedMember}
        on:close={() => showRenewModal = false}
        on:updated={(e) => UpdateLocalMember(e.detail)}
         />
    {/if}
    {#if showEditModal && selectedMember}
        <EditModal
        {selectedMember}
        on:close={() => showEditModal = false}
        on:updated={(e) => EditLocalMember(e.detail)}
         />
    {/if}