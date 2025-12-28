<script lang="ts">
    const { title, template } = $props<{ 
        title: string;
        template: string; }>()
        
    // async function handleLogout() {
    // console.log('Logging out:', $user?.email)
    
    // authChecking = true

	// 	await supabase.auth.signOut();
    // clearAllData()

    // setTimeout(() => {
    //   window.location.href = '/';
    // }, 100)
	// }
</script>
<nav class="w-full flex justify-between items-center
        bg-black backdrop-blur-2xl border-b-black sticky top-0 z-50">
    <h1 class="font-bold font-family-primary p-2 text-2xl">{title}</h1>
    <div class="flex gap-2">
        {#if title ==='DASHBOARD' }
        <button class=" btn btn-error text-white">logout</button>
           <!-- <button class="btn btn-error" onclick={handleLogout}>Logout</button>  -->
        {/if}
    </div>
</nav>