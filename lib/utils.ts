import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { eachDayOfInterval, format, isSameDay, subDays } from 'date-fns';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const convertAmountToMiliUnits = (amount: number) =>
	Math.round(amount * 1000);

export const convertAmountFromMiliunits = (amount: number) =>
	Math.round(amount / 1000);

export const formatCurrency = (value: number) => {
	const finalValue = convertAmountFromMiliunits(value);
	return Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2
	}).format(finalValue);
};

export const calculatePercentageChange = (
	current: number,
	previous: number
) => {
	if (previous === 0) return current === 0 ? 0 : 100;
	return ((current - previous) / previous) * 100;
};

export const fillMissingDays = (
	activeDays: {
		date: Date;
		income: number;
		expenses: number;
	}[],
	startDate: Date,
	endDate: Date
) => {
	if (activeDays.length === 0) return [];

	const allDays = eachDayOfInterval({
		start: startDate,
		end: endDate
	});

	const transactionsByDay = allDays.map((day) => {
		const found = activeDays.find((d) => isSameDay(d.date, day));

		if (found) {
			return found;
		}

		return {
			date: day,
			income: 0,
			expenses: 0
		};
	});

	return transactionsByDay;
};

type Period = {
	from: string | Date | undefined;
	to: string | Date | undefined;
};

export const formatDateRange = (period?: Period) => {
	const defaultTo = new Date();
	const defaultFrom = subDays(defaultTo, 30);

	if (!period?.from) {
		return `${format(defaultFrom, 'LLL dd')} - ${format(defaultTo, 'LLL dd, y')}`;
	}

	if (period.to) {
		return `${format(period.from, 'LLL dd')} - ${format(period.to, 'LLL dd, y')}`;
	}

	return format(period.from, 'LLL dd, y');
};

export const formatPercentage = (
	value: number,
	options: { addPrefix?: boolean } = { addPrefix: false }
) => {
	const result = new Intl.NumberFormat('en-US', {
		style: 'percent'
	}).format(value / 100);

	if (options.addPrefix && value > 0) {
		return `+${result}`;
	}

	return result;
};
