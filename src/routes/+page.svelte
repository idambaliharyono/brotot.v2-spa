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
	
		 goto('/dashboard')
	}
	async function handleLogout() {
		await supabase.auth.signOut();
		message = 'Logged Out';
	}


</script>
<div class="w-screen h-screen flex justify-center">
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
