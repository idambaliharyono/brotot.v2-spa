<script lang="ts">
	import type { membership_status } from "$lib/types";
	import { BadgeAlert, CircleAlert, ClockAlert, PhoneCall, RefreshCcw, Settings } from "lucide-svelte";
	import { createEventDispatcher } from "svelte";

    export let member: membership_status;
    export let toWebp: (url: string | null) => string;

    const dispatch = createEventDispatcher();

    function openRenewModal(){
        dispatch("openrenewmodal", member)
    }
    function openEditModal(){
        dispatch("openeditmodal", member)
    }
</script>

    <div class="card card-side shadow-sm relative  ">
            <!-- <div class="absolute inset-1 rounded-xl shadow-[inset_0_0_0_2px_rgba(255,255,255,0.1)] pointer-events-none"></div> -->
        
        <div class="p-1.5 flex items-center gap-1">
            <figure class="w-32 shrink-0 relative">
                <div class="w-full aspect-square rounded-lg overflow-hidden">
                    <img
                    class="w-full h-full object-cover  "
                    class:grayscale-90={member.color != 'green'}
                    src={toWebp(member.photo_url)}
                    alt={member.nick_name}
                    /> 


                </div>
               <div class="absolute right-0 top-0 w-1/3 h-full bg-black/70"></div>
            </figure>
            <div class="card-body p-2 gap-5 -ml-12 z-10 flex justify-between h-full">
                    <h1 class="card-title font-family-primary text-xl tracking-tighter">
                        {member.nick_name}
                    </h1>
                <div class="flex gap-2">
                    <a href="https://wa.me/{member.phone_number}" target="_blank">
                    <PhoneCall class='w-4.5 h-4.5'/>
                    </a>
    
                    <button on:click={openRenewModal} class="relative">
                        <RefreshCcw class='w-4.5 h-4.5'/>
                        {#if member.color != 'green'}
                        <CircleAlert
                            class="absolute -top-1 -right-1 w-2.5 h-2.5 text-red-600"
                            strokeWidth={2.5}
                        />
                        {/if}
                    </button>
                    <button
                    class=""
                    on:click|preventDefault={openEditModal}
                    aria-label="Edit member">
                    <Settings class='w-4.5 h-4.5' />
                    </button>
                </div>
                {#if member.color != 'red'}
                    <p class="text-[8px]">Valid to: {member.membership_expiration}</p>
                {:else}
                    <p class="text-[8px] ">Valid to: Expired</p>
                {/if}
            </div>
            <div>
    
            </div>
        </div>
    </div>
