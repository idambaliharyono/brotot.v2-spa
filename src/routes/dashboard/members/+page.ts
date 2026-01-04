import { supabase } from '$lib/helper';


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
