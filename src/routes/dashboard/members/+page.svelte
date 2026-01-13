

<script lang='ts'>
	import CustomDateInput from "$lib/components/CustomDateInput.svelte";

    let selectedDate: Date | undefined;
    let placeholder = "DD/MM/YYYY"

</script>
<CustomDateInput 
bind:value={selectedDate} 
bind:placeholder={placeholder}
labelText="Birh Date"
/>
{#if selectedDate}
   <p>{selectedDate}</p> 
   {:else}
   <p>You haven't pick a date</p>
{/if}