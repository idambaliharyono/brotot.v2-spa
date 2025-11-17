<script lang="ts">
    import type { membership_status } from "$lib/types";
	import { createEventDispatcher, onMount } from "svelte";

    export let selectedMember:membership_status;
    let modalRef : HTMLDialogElement;
    
    const dispatch = createEventDispatcher()
    onMount(() => {
        modalRef.showModal();
        modalRef.addEventListener("close", () => {
            dispatch("close")
        })
    })
</script>
<dialog bind:this={modalRef} class="modal">
  <div class="modal-box">
    <h3 class="text-lg font-bold mb-5 text-center">Membership Renewal Form For: {selectedMember.nick_name}</h3>
    <form class="flex flex-col text-black gap-y-3">
        <label for="startdate">Start Date</label>
        <input type="date" class="input bg-blue-50 w-full">
        <label for="payment_method">Payment Method</label>
        <select class="w-full" id="payment_method">
            <option value="cash">Cash</option>
            <option value="qris">QRIS</option>
            <option value="bank_transfer">Bank Transfer</option>
        </select>
        <label for="note">Note</label>
        <input type="text" class="w-full">

        <button type="submit" class="btn btn-accent mt-5 w-1/2 mx-auto">Submit</button>
    </form>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
    