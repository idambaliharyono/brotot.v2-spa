<script lang="ts">
export let search: string;
export let memberColor: string;
</script>
    <div class="bg-base-100 shadow-sm flex justify-center mx-2 my-3 ">
    <label class="input">
  <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <g
      stroke-linejoin="round"
      stroke-linecap="round"
      stroke-width="2.5"
      fill="none"
      stroke="currentColor"
    >
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.3-4.3"></path>
    </g>
  </svg>
  <input type="search" 
  required 
  placeholder="Search" 
  bind:value={search} />
</label>
<div class="dropdown">
  <div tabindex="0" role="button" class="btn m-1">{memberColor}</div>
  <ul tabindex="-1" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
    <li><button onclick={() => memberColor = 'green'}>Green</button></li>
    <li><button onclick={() => memberColor = 'yellow'}>Yellow</button></li>
    <li><button onclick={() => memberColor = 'red'}>Red</button></li>
    <li><button onclick={() => memberColor = ''}>Show All</button></li>
  </ul>
</div>
    </div>