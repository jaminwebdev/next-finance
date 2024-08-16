'use client';

import qs from 'query-string';
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts';
import { useGetSummary } from '@/features/summary/api/use-get-summary';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';

export const AccountFilter = () => {
	const router = useRouter();
	const pathname = usePathname();

	const params = useSearchParams();
	const accountId = params.get('accountid') || 'all';
	const from = params.get('from') || '';
	const to = params.get('to') || '';

	const { isLoading: isLoadingSummary } = useGetSummary();

	const { data: accounts, isLoading: isLoadingAccounts } = useGetAccounts();

	const onChange = (newValue: string) => {
		const query = {
			accountId: newValue,
			from,
			to
		};

		if (newValue === 'all') {
			query.accountId = '';
		}

		const url = qs.stringifyUrl(
			{
				url: pathname,
				query
			},
			{ skipNull: true, skipEmptyString: true }
		);

		router.push(url);
	};

	return (
		<Select
			value={accountId}
			onValueChange={onChange}
			disabled={isLoadingAccounts || isLoadingSummary}>
			<SelectTrigger className="lg:w-auto w-full h-9 rounded-md px-3 font-normal bg-sky-700/10 hover:bg-sky-700/20 hover:text-sky-700 border-none focus:ring-offset-0 focus:ring-transparent outline-none text-sky-700 focus:bg-sky-700/30 transition">
				<SelectValue placeholder="Select account" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="all">All accounts</SelectItem>
				{accounts?.map((account) => (
					<SelectItem key={account.id} value={account.id}>
						{account.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};
