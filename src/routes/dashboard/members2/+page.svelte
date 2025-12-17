<script lang="ts">

	import type { membership_status } from "$lib/types";
	import MemberSkeleton from "./MemberSkeleton.svelte";
	import MemberCard from "./MemberCard.svelte";
	import MemberNavigation from "./MemberNavigation.svelte";
	import RenewModal from "./RenewModal.svelte";
    import { MembershipStatus, isLoading, loadAllData } from "$lib/globalState";
	import EditModal from "./EditModal.svelte";
	import { onMount } from "svelte";
	import { pageTitle } from "$lib/stores/title";



    let loading = $derived($isLoading);
    let rawMembers = $derived(Object.values($MembershipStatus)) 
    let memberReady = $state(false)

    onMount(() => {
        pageTitle.set('MEMBERS')
        console.log('===Members Page Mounted==')
        console.log('MembershipStatus store:', $MembershipStatus)
        console.log('typeof:', typeof $MembershipStatus)
        console.log(Object.keys($MembershipStatus).length)
        const hasMembers = Object.keys($MembershipStatus).length > 0

        if (hasMembers) {
            memberReady = true
        } else {
            const checkInterval = setInterval(() => {
               if (Object.keys($MembershipStatus).length >0) {
                memberReady = true;
                clearInterval(checkInterval)
               } 
            }, 100);

            setTimeout(() => {
               clearInterval(checkInterval) 
               if (!memberReady) {
                console.error('failed loading data after 5s')
               }
            }, 5000)
        }
    })


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
    {#if Object.keys($MembershipStatus).length > 0}
       <div>
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
       </div>
    {:else}
           <MemberSkeleton />
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