<script lang="ts">
	import type { membership_status } from "$lib/types";
	import { PhoneCall, RefreshCcw, Settings } from "lucide-svelte";
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

<div class="card card-side shadow-sm mb-5 w-[80vw]  relative">
    <div class="p-1.5 flex items-center gap-3">
        <figure class="w-32 shrink-0">
            <div class="w-full aspect-square rounded-lg overflow-hidden">
                <img
                class="w-full h-full object-cover grayscale-50 "
                src={toWebp(member.photo_url)}
                alt={member.nick_name}
                />
            </div>
        </figure>
        <div class="card-body p-2 justify-between h-full">
            <div class="flex flex-col">
                <h2 class="card-title">
                    <span>{member.nick_name}</span>
                </h2>
                <div class="text-[10px]">({member.full_name})</div>

            </div>

            
            <div class="flex gap-5 mb-6">
                <a href="https://wa.me/{member.phone_number}" target="_blank">
                <PhoneCall class='w-5 h-5'/>
                </a>

                <button on:click={openRenewModal}>
                    <RefreshCcw class='w-5 h-5'/>
                </button>
            <button
            class=""
            on:click|preventDefault={openEditModal}
            aria-label="Edit member">
            <Settings class='w-5 h-5' />
        </button>

            </div>

        </div> 
        <div>

        </div>
        
        <p class="text-[8px] absolute bottom-2 right-2">Expired: {member.membership_expiration}</p>
    </div>
</div>
