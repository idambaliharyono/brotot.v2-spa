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

    <div class="card card-side shadow-sm mb-5 relative  ">
        <div class="p-1.5 flex items-center gap-1">
            <figure class="w-32 shrink-0 relative">
                <div class="w-full aspect-square rounded-lg overflow-hidden">
                    <img
                    class="w-full h-full object-cover grayscale-50 "
                    src={toWebp(member.photo_url)}
                    alt={member.nick_name}
                    />
                </div>
               <div class="absolute right-0 top-0 w-1/3 h-full bg-black/70"></div>
            <div class="bg-black/50 w-[50%] inset-y-full absolute right-0"></div>
            </figure>
            <div class="card-body p-2 gap-5 -ml-12 z-10">
                <div class="flex flex-col">
                    <h2 class="card-title -mb-1">
                        <span>{member.nick_name}</span>
                    </h2>
                </div>
                <div class="flex gap-3">
                    <a href="https://wa.me/{member.phone_number}" target="_blank">
                    <PhoneCall class='w-5 h-5'/>
                    </a>
    
                    <button on:click={openRenewModal} class="relative">
                        <RefreshCcw class='w-5 h-5'/>
                        {#if member.color != 'green'}
                        <CircleAlert
                            class="absolute -top-1 -right-1 w-2 h-2 text-red-600"
                            strokeWidth={2.5}
                        />
                        {/if}
                    </button>
                    <button
                    class=""
                    on:click|preventDefault={openEditModal}
                    aria-label="Edit member">
                    <Settings class='w-5 h-5' />
                    </button>
                </div>
            {#if member.color != 'red'}
                <p class="text-[8px] ">Valid to: {member.membership_expiration}</p>
            {:else}
                <p class="text-[8px] ">Valid to: Expired</p>
            {/if}
            </div>
            <div>
    
            </div>
        </div>
    </div>
