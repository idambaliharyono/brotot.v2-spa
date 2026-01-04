import { createClient, type User } from '@supabase/supabase-js';
import type { EnumLike } from 'zod/v3';

export const supabase = createClient(
	'https://ozvpzhfspbpepknvzuub.supabase.co',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96dnB6aGZzcGJwZXBrbnZ6dXViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MzU0NTIsImV4cCI6MjA3MDIxMTQ1Mn0.4QU452815wcp8T69PEH9d-ulX-R2Q44bR1favi3T9Kc'
);

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

export async function sendSMS(
	phone_number: string,
	nick_name: string,
	membership_expiration: Date,
	type: 'register' | 'renewal'
) {
	const token = '5119df15543fbf8a0efa6bbb93142756';
	const displayDate = membership_expiration.toLocaleDateString('id-ID', {
		timeZone: 'Asia/Jakarta',
		day: '2-digit',
		month: 'short',
		year: 'numeric'
	});
	const renewalMessage = `BROTOT-GYM: Hai ${nick_name.toUpperCase()}. Terimaksih sudah memperpanjang membership anda hingga: ${displayDate}`;
	const registeMessage = `BROTOT-GYM: Hai ${nick_name.toUpperCase()}. Terimaksih sudah bergabung di BROTOT GYM, membership anda berlaku hingga: ${displayDate}`;
	let message = type === 'renewal' ? renewalMessage : registeMessage;

	const url = `https://websms.co.id/api/smsgateway-otp?token=${token}&to=${phone_number}&msg=${message}`;

	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				Accept: 'application/json'
			}
		});
		const data = await response.json();
		return {
			success: response.ok,
			status: response.status,
			data: data
		};
	} catch (error) {
		console.log('[SMS] error', error);
		throw error;
	}
}
