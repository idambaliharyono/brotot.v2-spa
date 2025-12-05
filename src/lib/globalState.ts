import { supabase } from './helper';
import { toast } from 'svelte-sonner';
import type { User } from '@supabase/supabase-js';
import { writable } from 'svelte/store';
import type { Member, membership_status, Transaction } from './types';
import { _never } from 'zod/v4/core';
import { get } from 'svelte/store';

export const user = writable<User | null>(null);
export const Members = writable<Record<number, Member>>({});
export const Transactions = writable<Record<number, Transaction>>({});
export const MembershipStatus = writable<Record<number, membership_status>>({});
export const isLoading = writable(false);

let dataLoaded = false;
let initCount = 0;
let loadDataCount = 0;

let authInitialize = false;
export function initializeAuth() {
	initCount++;
	console.log(`initializeAuth called ${initCount} times`);
	if (authInitialize) {
		console.log('skipping auth init..');
		return;
	}
	authInitialize = true;
	supabase.auth.onAuthStateChange((_event, session) => {
		const currenUser = session?.user ?? null;
		user.set(currenUser);
		if (currenUser && _event === 'SIGNED_IN') {
			console.log(`user: ${session?.user.email}`);
		} else if (_event === 'SIGNED_OUT') {
			clearAllData();
		}
	});
}
export function clearAllData() {
	dataLoaded = false;
	authInitialize = false;
	Members.set({});
	Transactions.set({});
	MembershipStatus.set({});
}

export async function loadAllData(caller = 'unknown') {
	console.log('called by:', caller);
	console.log('initialize loading data');
	console.log(get(Members));
	console.log(get(Transactions));
	console.log(get(MembershipStatus));
	if (
		get(Members) &&
		get(Transactions) &&
		get(MembershipStatus) &&
		Object.keys(get(Members)).length > 0 &&
		Object.keys(get(Transactions)).length > 0 &&
		Object.keys(get(MembershipStatus)).length > 0
	) {
		console.log('data loaded..');
		return;
	}
	loadDataCount++;
	console.log(`data loaded ${loadDataCount} times`);
	isLoading.set(true);
	try {
		const [membersRes, transactionRes, statusRes] = await Promise.all([
			supabase.from('Members').select('*'),
			supabase.from('Transactions').select('*'),
			supabase.from('membership_status').select('*')
		]);

		console.log('raw data received', {
			members: membersRes.data?.length,
			trans: transactionRes.data?.length,
			status: statusRes.data?.length
		});

		if (membersRes.error) throw membersRes.error;
		if (transactionRes.error) throw transactionRes.error;
		if (statusRes.error) throw statusRes.error;

		Members.set(normalizeArray(membersRes.data || [], 'member_id'));
		Transactions.set(normalizeArray(transactionRes.data || [], 'transaction_id'));
		MembershipStatus.set(normalizeArray(statusRes.data || [], 'member_id'));
		console.log('success normalize all data');
		isLoading.set(false);
	} catch (error) {
		isLoading.set(false);
		console.log(`Failed to load data: ${error}`);
	} finally {
		isLoading.set(false);
		console.log('data loaded, loading finished');
	}
}

function normalizeArray<T>(array: T[], idField: string): Record<string, T> {
	const obj: Record<string, T> = {};
	array.forEach((item) => {
		const key = (item as any)[idField];
		if (key !== undefined && key !== null) {
			obj[key] = item;
		}
	});
	return obj;
}
