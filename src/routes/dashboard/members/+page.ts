import { supabase } from '$lib/helper';

// export async function load() {
// 	const { data: membershipStatus, error: membershipError } = await supabase
// 		.from('membership_status')
// 		.select('*');
// 	return { membershipStatus, membershipError };
// }

export function load() {
	const membershipPromise = supabase
		.from('membership_status')
		.select('*')
		.then(({ data, error }) => {
			if (error) throw error;
			return data;
		});
	return { membershipPromise };
}
