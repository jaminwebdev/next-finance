'use client';

import { DataCharts } from '@/components/data-charts';
import { DataGrid } from '@/components/data-grid';
import { useEffect, useCallback, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { useGetSummary } from '@/features/summary/api/use-get-summary';
import { useGetCategories } from '@/features/categories/api/use-get-categories';
import { dummyTransactions, getRandomDateInLast30Days } from '@/db/dummy-data';
import { useBulkCreateTransactions } from '@/features/transactions/api/use-bulk-create-transactions';

export default function DashboardPage() {
	const { user } = useUser();
	const { data, isSuccess } = useGetSummary();
	const { data: categories } = useGetCategories();
	const createTransactions = useBulkCreateTransactions();
	const hasSeeded = useRef(false);

	const seedDatabase = useCallback(
		(categories: { id: string; name: string }[]) => {
			const seedData = dummyTransactions.map((transaction) => ({
				...transaction,
				date: getRandomDateInLast30Days(),
				categoryId: categories[Math.floor(Math.random() * categories.length)].id
			}));
			createTransactions.mutate(seedData);
		},
		[createTransactions]
	);

	useEffect(() => {
		if (
			!hasSeeded.current &&
			user?.emailAddresses?.[0]?.emailAddress === 'jaminwebdev@gmail.com' &&
			isSuccess &&
			(!data.remainingAmount || (Array.isArray(data) && data.length === 0)) &&
			categories
		) {
			console.log('seeding database');
			seedDatabase(categories);
			hasSeeded.current = true;
		}
	}, [isSuccess, data, user?.emailAddresses, categories, seedDatabase]);

	return (
		<div className="max-w-screen-2xl mx-auto w-full pb-10, -mt-10">
			<DataGrid />
			<DataCharts />
		</div>
	);
}
