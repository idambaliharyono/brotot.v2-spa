export interface membership_status {
	member_id: number;
	nick_name: string;
	full_name: string;
	phone_number: string;
	membership_expiration: Date;
	days_left: number;
	color: 'red' | 'green' | 'yellow' | null;
	photo_url: string;
}

export interface Transaction {
	transaction_id: string;
	member_id: number;
	membership_types_id: 1;
	transaction_type: 'renewal' | 'register' | 'sales';
	amount: number;
	payment_method: 'bank_transfer' | 'qris' | 'cash';
	transaction_date: Date;
	note: string;
}
