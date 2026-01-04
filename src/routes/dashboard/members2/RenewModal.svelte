<script lang="ts">
	import { sendSMS, supabase } from "$lib/helper";
    import type { membership_status, Transaction } from "$lib/types";
	import { createEventDispatcher, onMount } from "svelte";
	import { toast } from "svelte-sonner";
	import { date } from "zod";

    // export let selectedMember:membership_status;
    let { selectedMember } = $props<{ selectedMember: membership_status}>()
    let modalRef : HTMLDialogElement;
    const dispatch = createEventDispatcher()
    onMount(() => {
        modalRef.showModal();
        modalRef.addEventListener("close", () => {
            dispatch("close")
        })
    })
    let paymentMethod: 'bank_transfer' | 'qris' | 'cash' = "cash"
    let note = "";
    let starDate = "";

    async function submitRenew(e: Event) {
        e.preventDefault();
        starDate = starDate.split("T")[0];
        const transactionId =`${starDate.replace(/-/g, '')}-${selectedMember.member_id}` 
        const transactionPayLoad:Transaction = {
            transaction_id: transactionId,
            member_id: selectedMember.member_id,
            membership_types_id: 1,
            transaction_type: "renewal",
            amount: 100,
            payment_method: paymentMethod,
            transaction_date: new Date(starDate), 
            note: note
        }
            const { data: trx, error:trxError } = await supabase.from('Transactions').insert(
            transactionPayLoad
        ).select().single()

        if(trxError || !trx){
            toast.error(`${trxError}`)
            return
        }
        toast.success(`${selectedMember.full_name}'s Membership is renewed'`)

        const{ data: renewMember, error: renewMemberError } = await supabase
                                                            .from('membership_status')
                                                            .select('*')
                                                            .eq("member_id", selectedMember.member_id)
                                                            .single();
        if(renewMemberError || !renewMember){
            toast.error('Falied refreshing member data. Please Refresh manually')
        }
        const smsDate = new Date(selectedMember.membership_expiration)
        const smsResponse = sendSMS(selectedMember.phone_number, selectedMember.nick_name, smsDate ,'renewal') 

        dispatch("updated", renewMember);
        dispatch("close");
    }

    
</script>
<dialog bind:this={modalRef} class="modal">
  <div class="modal-box">
    <div class="text-lg font-bold mb-5 text-center">
        <h3 class="">Membership Renewal Form </h3>
        <h3 class="text-lg">For: {selectedMember.nick_name}</h3>
    </div>
    <form class="flex flex-col text-black gap-y-3" on:submit={submitRenew}>
        <label for="startdate" class="text-white -mb-2 font-semibold">Start Date</label>
        <input type="date" class="input bg-blue-50 w-full" bind:value={starDate}>

        <label for="payment_method" class="text-white -mb-2 font-semibold">Payment Method</label>
        <select class="w-full" id="payment_method" bind:value={paymentMethod}>
            <option value="cash">Cash</option>
            <option value="qris">QRIS</option>
            <option value="bank_transfer">Bank Transfer</option>
        </select>
        <label for="note" class="text-white -mb-2 font-semibold">Note</label>
        <input type="text" class="w-full" bind:value={note}>

        <button type="submit" class="btn btn-accent mt-5 w-1/2 mx-auto">Submit</button>
    </form>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
    