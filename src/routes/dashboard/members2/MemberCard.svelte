<script lang="ts">
	import type { membership_status } from "$lib/types";
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

    <!-- <div class="card card-side bg-black shadow-sm mb-5 w-[95vw] ">
        <div class="p-1.5 flex">
            <figure class="w-32 shrink-0">
                <div class="w-full aspect-square rounded-3xl overflow-hidden">
                    <img
                    class="w-full h-full object-cover grayscale-25 opacity-60"
                    src={toWebp(member.photo_url)}
                    alt={member.nick_name} />
                </div>
            </figure>
            <div class="card-body">
                <h2 class="card-title">
                    <span>{member.nick_name}</span> 
                </h2>
                <div class="text-[10px] -mt-2">({member.full_name})</div>
                <p class="text-xs">Expired on: {member.membership_expiration} </p>
                <div class="card-actions justify-end">
                    <button class="mt-5 btn btn-primary"
                    on:click|preventDefault={openEditModal}
                    >Edit</button>

                    <button class="mt-5 btn btn-primary"
                    on:click|preventDefault={openRenewModal}
                    >Renew</button>
                </div>
            </div>
            <div class="flex">
                ** gear icon
            </div>
        </div>
    </div> -->
<div class="card card-side bg-black shadow-sm mb-5 w-[95vw] ">
    <div class="p-1.5 flex items-center gap-3">
        <figure class="w-32 shrink-0">
            <div class="w-full aspect-square rounded-3xl overflow-hidden">
                <img
                class="w-full h-full object-cover grayscale-25 opacity-60"
                src={toWebp(member.photo_url)}
                alt={member.nick_name}
                />
            </div>
        </figure>
        <div class="card-body p-2">
            <h2 class="card-title">
                <span>{member.nick_name}</span>
            </h2>

            <div class="text-[10px] -mt-2">({member.full_name})</div>
            <p class="text-xs">Expired on: {member.membership_expiration}</p>

            <div class="card-actions justify-end">
                <button class="mt-5 btn btn-primary" on:click|preventDefault={openRenewModal}>
                Renew
                </button>
            </div>
        </div> 
            <button
            class="absolute top-2 right-2 btn btn-ghost btn-sm p-2"
            on:click|preventDefault={openEditModal}
            aria-label="Edit member">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
       viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M11.983 13.794a1.812 1.812 0 100-3.624 1.812 1.812 0 000 3.624z" />
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33
         1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51
         1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06
         a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09
         a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06
         a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33h.01
         a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51
         1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06
         a1.65 1.65 0 00-.33 1.82v.01a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09
         a1.65 1.65 0 00-1.51 1z" />
  </svg>
        </button>
    </div>
</div>
