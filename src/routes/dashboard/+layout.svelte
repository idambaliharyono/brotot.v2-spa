<script>
	import { goto } from "$app/navigation";
	import { supabase, user } from "$lib/helper";
    let { children } = $props();
    
    $effect(() => {
    if ($user === false) goto('/')
    })

	async function handleLogout() {
		await supabase.auth.signOut();
	}
</script>

<div class="drawer lg:drawer-open">
  <input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content flex flex-col items-center justify-center">
    <label for="my-drawer-3" class="btn drawer-button lg:hidden">
      Open drawer
    </label>
    <!-- Page content here -->
    {@render children()}
  </div>
  <div class="drawer-side">
    <label for="my-drawer-3" aria-label="close sidebar" class="drawer-overlay"></label>
    <div class="flex flex-col bg-base-200 min-h-full w-80  p-4">
    <ul class="menu flex-1 ">
      <!-- Sidebar content here -->
      <li><a href="/dashboard">Home</a></li>
      <li><a href="/dashboard/register">Register new member</a></li>
      <li><a href="/dashboard/members">Memberlist</a></li>
    </ul>
    <button class="btn btn-error mt-4 w-3/4 mx-auto" onclick={handleLogout}>Logout</button>
    </div>
  </div>
</div>