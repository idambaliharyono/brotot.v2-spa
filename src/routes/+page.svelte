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


</script>
<div class="min-h-dvh flex flex-col justify-center items-center gap-1">
	<h1 class="font-family-primary text-5xl font-bold">WELCOME!</h1>
	<form on:submit|preventDefault={handleLoginWithPassword} class="max-w-sm mx-auto mt-6">
		<fieldset class="flex flex-col">
			<label class="pl-2.5 label font-family-secondary" for="email">Email</label>
			<input id='email' type="email" class="input-lg px-4 py-4 rounded-3xl text-black" placeholder="Email" bind:value={email} />
		</fieldset>
		<fieldset class="flex flex-col mt-4">
			<label class="pl-2.5 label font-family-secondary " for="password">Password</label>
			<input id="password" type="password" class="input-lg px-4 py-4 rounded-3xl text-black" placeholder="Password" bind:value={password} />
		</fieldset>
		<button class="btn mt-4 px-30 py-2 rounded-xl font-bold font-family-secondary text-white
		 border-2 border-white bg-transparent hover:bg-white/10
		  active:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 transition" type="submit">LOGIN</button>
	</form>
</div>

