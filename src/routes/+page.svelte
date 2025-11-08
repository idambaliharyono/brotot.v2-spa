<script lang="ts">
	import { goto } from "$app/navigation";
	import { supabase } from "$lib/helper";

	let email ='';
	let password ='';
	let message = '';

	async function handleLogin() {
		 const { data, error } = await supabase.auth.signInWithPassword({ email, password });
		 if(error){
			message = error.message
			alert(message)
			return
		 }
		 message = 'Login Successfull'
		 alert(message)
		 goto('/dashboard')
	}
	async function handleLogout() {
		await supabase.auth.signOut();
		message = 'Logged Out';
	}
</script>
<form on:submit|preventDefault={handleLogin} class="max-w-sm mx-auto mt-10">
    <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend class="fieldset-legend">Login</legend>

        <label class="label" for="email">Email</label>
        <input id='email' type="email" class="input" placeholder="Email" bind:value={email} />

        <label class="label" for="password">Password</label>
        <input id="password" type="password" class="input" placeholder="Password" bind:value={password} />

        <button class="btn btn-neutral mt-4" type="submit">Login</button>
    </fieldset>
</form>