<script lang='ts'>
	import { error } from "@sveltejs/kit";

    export let data;
    const { membershipPromise } = data

    async function handleRenewMembership() {
    }

    function toWebp(url: string | null){
        if(!url)return "";
        return url.replace("/upload/", "/upload/f_auto,q_auto,w_900/")
    }

    let modal: HTMLDialogElement;
    let note:string|null = null;
    let paymentMethod:'cash'|'trf'|null = null;
    let selectedMember: any

    function openModal(member: any) {
        selectedMember = member ;
        modal.showModal();
        console.log(selectedMember)
    }

</script>
{#await data.membershipPromise}
<div class="flex justify-center items-center min-h-screen">
    <div class="flex w-52 flex-col gap-4">
        <div class="skeleton h-32 w-full"></div>
        <div class="skeleton h-4 w-28"></div>
        <div class="skeleton h-4 w-full"></div>
        <div class="skeleton h-4 w-full"></div>
    </div>    

</div>
{:then membershipPromise} 

    <div class="flex flex-wrap gap-10 align-middle justify-center">
    {#each membershipPromise as member }

        <div class="card bg-black sm:w-1/3 lg:w-1/4 shadow-sm">
            <figure>
                <img
                loading="lazy"
                src={toWebp(member.photo_url)}
                alt={`${member.nick_name}'s photo`} 
                class="w-4/5 aspect-3/4 object-cover rounded-2xl mt-8"/>
            </figure>
            <div class="card-body">
                <h2 class="card-title justify-center">
                    {member.nick_name}
                    <span class="badge text-white"
                        class:bg-red-400={member.color === 'red'}
                        class:bg-yellow-400={member.color === 'yellow'}
                        class:bg-green-400={member.color === 'green'}
                        >
                        {member.days_left}
                    </span>
                </h2>
                <!-- <p class="text-center">{member.full_name}</p> -->
                <p class="text-center">Expire in: {member.membership_expiration}</p>
                <div class="card-actions justify-center">
                <button class="btn btn-primary" on:click|preventDefault={()=>openModal(member)}>Renew Membership</button>
                </div>
            </div>
        </div>

    {/each}
    </div>
{:catch err}
<p class="error">Error: {err.message}</p>
{/await}

<dialog bind:this={modal} class="modal">
    <div class="modal-box">
    <form method="dialog">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    </form>
        {#if selectedMember}
        <h2 class="">Membership Renewal Form for {selectedMember.nick_name}</h2>
        <form on:submit|preventDefault={handleRenewMembership}>
            <div class="flex flex-col mt-4">
            <input type="text" id="paymentmethod" bind:value={paymentMethod}>
            <input type="text" id="note" bind:value={note}>
            </div>
        </form>
        {/if}
    </div>
    <form class="modal-backdrop" method="dialog">
        <button>close</button>
    </form>
</dialog>