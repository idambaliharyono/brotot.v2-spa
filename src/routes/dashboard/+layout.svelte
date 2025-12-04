<script>
	import { goto } from "$app/navigation";
	import { supabase } from "$lib/helper";
  import { page } from "$app/stores"
	import { clearAllData, initializeAuth, isLoading, loadAllData, user } from "$lib/globalState";
  import { Members, Transactions, MembershipStatus } from "$lib/globalState";
	import { get } from "svelte/store";

    export const ssr = false;
    export const csr = true;
    let { children } = $props();
    let dataLoaded = false
    $effect(() => {
      if ($isLoading) return
      console.log('user email', $user?.email)
      if (!$user) {
        goto('/')
      } 
      if (!dataLoaded){
        loadAllData('dashboard/+layout'); 
        dataLoaded = true
      } else {console.log('data loaded')}
    })

	async function handleLogout() {
		await supabase.auth.signOut();
    clearAllData()
    goto('/')

	}
</script>


<div class="drawer lg:drawer-open">
  <input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content flex flex-col ">
    <!-- <label for="my-drawer-3" class="btn drawer-button lg:hidden">
      Open drawer
    </label> -->
    <!-- Page content here -->
    <main>{@render children()}</main>
  </div>
  <div class="drawer-side">
    <label for="my-drawer-3" aria-label="close sidebar" class="drawer-overlay"></label>
    <div class="flex flex-col bg-base-200 min-h-full w-80  p-4">
    <ul class="menu flex-1 ">
      <!-- Sidebar content here -->
      <li><a href="/dashboard">Home</a></li>
      <li><a href="/dashboard/register">Register new member</a></li>
      <li><a href="/dashboard/members2">Memberlist</a></li>
    </ul>
    <button class="btn btn-error mt-4 w-3/4 mx-auto" onclick={()=>handleLogout()}>Logout</button>
    </div>
  </div>
</div>
<div class="dock bg-neutral text-neutral-content lg:hidden">
  <button onclick={()=>goto('/dashboard/')} class:dock-active={$page.url.pathname === '/dashboard'}>
    <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="currentColor" stroke-linejoin="miter" stroke-linecap="butt"><polyline points="1 11 12 2 23 11" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="2"></polyline><path d="m5,13v7c0,1.105.895,2,2,2h10c1.105,0,2-.895,2-2v-7" fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></path><line x1="12" y1="22" x2="12" y2="18" fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></line></g></svg>
    <span class="dock-label">Home</span>
  </button>
  
  <button onclick={()=>goto('/dashboard/register')} class:dock-active={$page.url.pathname === '/dashboard/register'}>
    <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="currentColor" stroke-linejoin="miter" stroke-linecap="butt"><polyline points="3 14 9 14 9 17 15 17 15 14 21 14" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="2"></polyline><rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></rect></g></svg>
    <span class="dock-label">Sign-up</span>
  </button>
  
  <button onclick={()=>goto('/dashboard/test2')} class:dock-active={$page.url.pathname === '/dashboard/members'}>
    <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="currentColor" stroke-linejoin="miter" stroke-linecap="butt"><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></circle><path d="m22,13.25v-2.5l-2.318-.966c-.167-.581-.395-1.135-.682-1.654l.954-2.318-1.768-1.768-2.318.954c-.518-.287-1.073-.515-1.654-.682l-.966-2.318h-2.5l-.966,2.318c-.581.167-1.135.395-1.654.682l-2.318-.954-1.768,1.768.954,2.318c-.287.518-.515,1.073-.682,1.654l-2.318.966v2.5l2.318.966c.167.581.395,1.135.682,1.654l-.954,2.318,1.768,1.768,2.318-.954c.518.287,1.073.515,1.654.682l.966,2.318h2.5l.966-2.318c.581-.167,1.135-.395,1.654-.682l2.318.954,1.768-1.768-.954-2.318c.287-.518.515-1.073.682-1.654l2.318-.966Z" fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></path></g></svg>
    <span class="dock-label">Members</span>
  </button>

  <button onclick={()=> handleLogout()}>
    <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="currentColor" stroke-linejoin="miter" stroke-linecap="butt"><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></circle><path d="m22,13.25v-2.5l-2.318-.966c-.167-.581-.395-1.135-.682-1.654l.954-2.318-1.768-1.768-2.318.954c-.518-.287-1.073-.515-1.654-.682l-.966-2.318h-2.5l-.966,2.318c-.581.167-1.135.395-1.654.682l-2.318-.954-1.768,1.768.954,2.318c-.287.518-.515,1.073-.682,1.654l-2.318.966v2.5l2.318.966c.167.581.395,1.135.682,1.654l-.954,2.318,1.768,1.768,2.318-.954c.518.287,1.073.515,1.654.682l.966,2.318h2.5l.966-2.318c.581-.167,1.135-.395,1.654-.682l2.318.954,1.768-1.768-.954-2.318c.287-.518.515-1.073.682-1.654l2.318-.966Z" fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></path></g></svg>
    <span class="dock-label">Cashflow</span>
  </button>
</div>