<script lang="ts">
	import { goto } from "$app/navigation";
	import { loadAllData } from "$lib/globalState";
	import { supabase } from "$lib/helper";
	import { toast } from "svelte-sonner";

	let email ='';
	let password ='';
	let message = '';

	async function handleLoginWithPassword() {
		 const { data, error } = await supabase.auth.signInWithPassword({ email, password });
		 if(error){
			message = error.message
			toast.error(message)
			return
		 }
		 message = 'Login Successfull'
		 toast.success(message)
	
		 await loadAllData()
		 goto('/dashboard')
	}
	async function handleLogout() {
		await supabase.auth.signOut();
		message = 'Logged Out';
	}

</script>
<div class="min-h-dvh flex flex-col justify-center items-center gap-1">
	<h1 class="font-family-primary text-5xl font-bold">WELCOME!</h1>
	<form on:submit|preventDefault={handleLoginWithPassword} class="max-w-sm mx-auto mt-10">
		<fieldset class="flex flex-col">
			<label class="pl-2.5 label font-family-secondary" for="email">Email</label>
			<input id='email' type="email" class="input-lg px-4 py-4 rounded-3xl" placeholder="Email" bind:value={email} />
		</fieldset>
		<fieldset class="flex flex-col mt-4">
			<label class="pl-2.5 label font-family-secondary" for="password">Password</label>
			<input id="password" type="password" class="input-lg px-4 py-4 rounded-3xl" placeholder="Password" bind:value={password} />
		</fieldset>
		<button class="mt-4 px-30 py-2 rounded-xl text-white font-bold font-family-primary
		 border-2 border-white bg-transparent hover:bg-white/10
		  active:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 transition" type="submit">Login</button>
	</form>
</div>
<!-- <div class="w-screen h-screen relative flex items-center justify-center">
	<div class="relative z-10">
		<form on:submit|preventDefault={handleLoginWithPassword} class="mt-40 max-w-sm mx-auto mt-10">
			<fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
				<legend class="fieldset-legend">Login</legend>
		
				<label class="label" for="email">Email</label>
				<input id='email' type="email" class="input" placeholder="Email" bind:value={email} />
		
				<label class="label" for="password">Password</label>
				<input id="password" type="password" class="input" placeholder="Password" bind:value={password} />
		
				<button class="btn btn-neutral mt-4" type="submit">Login</button>
			</fieldset>
		</form>
	</div>
</div> -->
