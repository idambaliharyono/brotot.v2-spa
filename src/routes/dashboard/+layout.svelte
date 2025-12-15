<script>
	import { goto } from "$app/navigation";
	import { supabase } from "$lib/helper";
  import { page } from "$app/stores"
	import { clearAllData, initializeAuth, isLoading, loadAllData, user } from "$lib/globalState";
  import { Members, Transactions, MembershipStatus } from "$lib/globalState";
	import { get } from "svelte/store";
	import { error } from "@sveltejs/kit";
	import { onMount } from "svelte";

    let { children } = $props();
    let dataLoaded = $state(false)
    let authChecking = $state(false)
    $effect(() => {
      if($isLoading || authChecking) return
     
      console.log('auth check, is user exist?',!!$user?.email)
      
      if(!$user) {
        console.log('no user detected')
        goto('/')
      }
    })

    $effect(() => {
        // if (!$user) {
        //   goto('/')
        // } 
        if ($isLoading || !$user || dataLoaded || authChecking) return
        
        console.log('loading data for user:', $user?.email)

        if (!$Members) {
          dataLoaded = true
          console.log('data already exist')
            dataLoaded = false 
            return
          } 
        loadAllData('dashboard/layout').then(() => {
          console.log('data loaded Successfully')
          dataLoaded = true
        }).catch(error => {
          console.log('failed loading data', error)
        });
    })

	async function handleLogout() {
    console.log('Logging out:', $user?.email)
    
    authChecking = true

		await supabase.auth.signOut();
    clearAllData()

    setTimeout(() => {
      window.location.href = '/';
    }, 100)
	}
</script>


<!-- <div class="drawer lg:drawer-open">
  <input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content flex flex-col ">
    <main>
      {#if dataLoaded && $user}
        {@render children()}
      {:else}
        <h1>loading data</h1>
      {/if}
    </main>
  </div>
  <div class="drawer-side">
    <label for="my-drawer-3" aria-label="close sidebar" class="drawer-overlay"></label>
    <div class="flex flex-col bg-base-200 min-h-full w-80  p-4">
    <ul class="menu flex-1 ">
      <li><a href="/dashboard">Home</a></li>
      <li><a href="/dashboard/register">Register new member</a></li>
      <li><a href="/dashboard/members2">Memberlist</a></li>
    </ul>
    <button class="btn btn-error mt-4 w-3/4 mx-auto" onclick={()=>handleLogout()}>Logout</button>
    </div>
  </div>
</div> -->

<!-- <div class="dock bg-neutral text-neutral-content lg:hidden">
</div> -->
{#if dataLoaded && $user}
  <!-- Desktop: Drawer layout -->
  <div class="hidden lg:flex">
    <div class="drawer lg:drawer-open">
      <!-- ... desktop drawer ... -->
    </div>
  </div>
  
  <!-- Mobile: Simple layout without drawer -->
  <div class="lg:hidden">
    <div class="p-4">
      <!-- Simple mobile header -->
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-xl font-bold">Dashboard</h1>
        <button class="btn btn-sm" onclick={() => handleLogout()}>Logout</button>
      </div>
      
      <!-- Mobile content -->
      <main>{@render children()}</main>
      
      <!-- Mobile bottom nav (your dock) -->
      <div class="dock bg-neutral text-neutral-content fixed bottom-0 left-0 right-0">
        <!-- ... your dock buttons ... -->
  <button onclick={()=>goto('/dashboard/')} class:dock-active={$page.url.pathname === '/dashboard'}>
    <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="currentColor" stroke-linejoin="miter" stroke-linecap="butt"><polyline points="1 11 12 2 23 11" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="2"></polyline><path d="m5,13v7c0,1.105.895,2,2,2h10c1.105,0,2-.895,2-2v-7" fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></path><line x1="12" y1="22" x2="12" y2="18" fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></line></g></svg>
    <span class="dock-label">Home</span>
  </button>
  
  <button onclick={()=>goto('/dashboard/register')} class:dock-active={$page.url.pathname === '/dashboard/register'}>
    <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="currentColor" stroke-linejoin="miter" stroke-linecap="butt"><polyline points="3 14 9 14 9 17 15 17 15 14 21 14" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="2"></polyline><rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></rect></g></svg>
    <span class="dock-label">Sign-up</span>
  </button>
  
  <button onclick={()=>goto('/dashboard/members2')} class:dock-active={$page.url.pathname === '/dashboard/members'}>
    <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="currentColor" stroke-linejoin="miter" stroke-linecap="butt"><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></circle><path d="m22,13.25v-2.5l-2.318-.966c-.167-.581-.395-1.135-.682-1.654l.954-2.318-1.768-1.768-2.318.954c-.518-.287-1.073-.515-1.654-.682l-.966-2.318h-2.5l-.966,2.318c-.581.167-1.135.395-1.654.682l-2.318-.954-1.768,1.768.954,2.318c-.287.518-.515,1.073-.682,1.654l-2.318.966v2.5l2.318.966c.167.581.395,1.135.682,1.654l-.954,2.318,1.768,1.768,2.318-.954c.518.287,1.073.515,1.654.682l.966,2.318h2.5l.966-2.318c.581-.167,1.135-.395,1.654-.682l2.318.954,1.768-1.768-.954-2.318c.287-.518.515-1.073.682-1.654l2.318-.966Z" fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></path></g></svg>
    <span class="dock-label">Members</span>
  </button>

  <button onclick={()=> handleLogout()}>
    <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="currentColor" stroke-linejoin="miter" stroke-linecap="butt"><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></circle><path d="m22,13.25v-2.5l-2.318-.966c-.167-.581-.395-1.135-.682-1.654l.954-2.318-1.768-1.768-2.318.954c-.518-.287-1.073-.515-1.654-.682l-.966-2.318h-2.5l-.966,2.318c-.581.167-1.135.395-1.654.682l-2.318-.954-1.768,1.768.954,2.318c-.287.518-.515,1.073-.682,1.654l-2.318.966v2.5l2.318.966c.167.581.395,1.135.682,1.654l-.954,2.318,1.768,1.768,2.318-.954c.518.287,1.073.515,1.654.682l.966,2.318h2.5l.966-2.318c.581-.167,1.135-.395,1.654-.682l2.318.954,1.768-1.768-.954-2.318c.287-.518.515-1.073.682-1.654l2.318-.966Z" fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></path></g></svg>
    <span class="dock-label">Cashflow</span>
  </button>
      </div>
    </div>
  </div>
{:else}
  <!-- Loading -->
{/if}