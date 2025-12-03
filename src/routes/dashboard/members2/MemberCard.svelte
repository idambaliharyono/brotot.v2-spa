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

    <div class="card card-side bg-black shadow-sm mb-5 w-full">
    <figure>
        <img
        class="rounded-xl aspect-square object-cover w-43 p-1.5 "
        src={toWebp(member.photo_url)}
        alt={member.nick_name} />
    </figure>
    <div class="card-body">
        <h2 class="card-title">{member.nick_name}
            <div class="badge text-white text-xs" 
                        class:bg-red-400={member.color === 'red'}
                        class:bg-yellow-400={member.color === 'yellow'}
                        class:bg-green-400={member.color === 'green'}
            >{member.days_left} days left
            </div>
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
</div>