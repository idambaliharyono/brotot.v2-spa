import { createClient, type User } from '@supabase/supabase-js';
import { error } from '@sveltejs/kit';
import { writable } from 'svelte/store';

export const supabase = createClient(
	'https://ozvpzhfspbpepknvzuub.supabase.co',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96dnB6aGZzcGJwZXBrbnZ6dXViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MzU0NTIsImV4cCI6MjA3MDIxMTQ1Mn0.4QU452815wcp8T69PEH9d-ulX-R2Q44bR1favi3T9Kc'
);

export const user = writable<User | false | null>(null);

supabase.auth.getSession().then(({ data }) => {
	user.set(data.session?.user ?? false);
});

supabase.auth.onAuthStateChange((_event, session) => {
	user.set(session?.user ?? false);
});

export async function uploadToCloudinary(file: File) {
	const cloudinaryUrl = `https://api.cloudinary.com/v1_1/de1urkv4r/image/upload`;
	const formData = new FormData();

	formData.append('file', file);
	formData.append('upload_preset', 'unsigned_preset');

	const res = await fetch(cloudinaryUrl, { method: 'POST', body: formData });
	const text = await res.text();

	if (!res.ok) {
		console.error('cloudinary upload failed:', res.status, text);
		throw new Error();
	}
	try {
		return JSON.parse(text);
	} catch {
		throw new Error('invalid JSON from cloudinary:' + text);
	}
}
