import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { QueryProvider } from '@/providers/query-provider';
import { SheetProvider } from '@/providers/sheet-provider';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Finance Dashboard',
	description: 'Get insights on your finances today'
};

type Props = {
	children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
	return (
		<ClerkProvider afterSignOutUrl="/sign-in">
			<html lang="en">
				<body className={inter.className}>
					<QueryProvider>
						<SheetProvider />
						<Toaster />
						{children}
					</QueryProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
