<script lang="ts">
  import CustomDateInput from "$lib/components/CustomDateInput.svelte";
  import { CalendarDate, CalendarDateTime, now } from "@internationalized/date";
  
  // Start with undefined, not null (better for Bits UI)
  let myDate: Date | undefined;
  
  // Today's date
  let actualdate = new Date();
  
  // Convert safely - only when myDate has a value
  $effect(() => {
    if (myDate) {
      console.log("myDate changed:", myDate);
    }
  });
  
  // Helper function to convert safely
  function getConvertedDate() {
    if (!myDate) return "No date selected";
    
    // Check if it's a valid Date
    if (myDate instanceof Date && !isNaN(myDate.getTime())) {
      return myDate.toLocaleDateString();
    }
    return "Invalid Date";
  }
</script>

<CustomDateInput 
  bind:value={myDate}
  placeholder={new CalendarDate(2024, 8, 3)} 
/>

{#if myDate}
  <div class="mt-4 space-y-2">
    <p><strong>Selected Date (raw):</strong> {myDate?.toString()}</p>
    <p><strong>Selected Date (formatted):</strong> {myDate?.toLocaleDateString()}</p>
    <p><strong>Today's Date:</strong> {actualdate.toLocaleDateString()}</p>
    <p><strong>Converted Display:</strong> {getConvertedDate()}</p>
    
    <!-- Check if date is valid -->
    <p class="text-sm {isNaN(myDate.getTime()) ? 'text-red-500' : 'text-green-500'}">
      {isNaN(myDate.getTime()) ? '⚠️ Invalid Date' : '✅ Valid Date'}
    </p>
  </div>
{:else}
  <p class="mt-4 text-gray-500">No date selected yet</p>
{/if}