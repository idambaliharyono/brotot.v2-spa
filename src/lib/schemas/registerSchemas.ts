import { z } from 'zod';

export const registerSchema = z.object({
	nick_name: z.string().min(1, 'Nickname required'),

	full_name: z.string().min(1, 'Full name required'),

	gender: z.enum(['Male', 'Female'], { error: 'Invalid Gender' }),
	// Validate string "1999-12-01"
	birth_date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date format'),

	phone_number: z.preprocess(
		(val) => String(val).replace(/\D/g, ''), // remove formatting
		z
			.string()
			.refine((v) => v.startsWith('62'), {
				message: 'Phone number must start with 62 (e.g. 628xxxxxxx)'
			})
			.refine((v) => v.length >= 11 && v.length <= 15, {
				message: 'Invalid phone number length'
			})
	),

	medical_info: z.string().min(1, 'Please fill this field'),
	fitness_goal: z.string().min(1, 'Please fill this field'),

	prefered_workout_time: z.string().min(1, 'Please fill this field'),

	photo_url: z.string().url('Must be a valid URL').optional() // 👌 allow empty if you want
});
