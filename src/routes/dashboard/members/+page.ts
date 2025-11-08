import { supabase } from '$lib/helper';

export async function load() {
	const { data: membershipStatus, error: membershipError } = await supabase
		.from('membership_status')
		.select('*');
	return { membershipStatus, membershipError };
}
