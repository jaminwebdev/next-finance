import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImportTable } from './import-table';
import { convertAmountToMiliUnits } from '@/lib/utils';
import { format, parse } from 'date-fns';

const dateFormat = 'yyyy-MM-dd HH:mm:ss';
const outputFormat = 'yyyy-MM-dd';

const requiredOptions = ['amount', 'date', 'payee'];

interface SelectedColumnsState {
	[key: string]: string | null;
}

type Props = {
	data: string[][];
	onCancel: () => void;
	onSubmit: (data: any) => void;
};

export const ImportCard = ({ data, onCancel, onSubmit }: Props) => {
	const [selectedColumns, setSelectedColumns] = useState<SelectedColumnsState>(
		{}
	);

	const [headers, ...body] = data;

	const onTableHeadSelectChange = (
		columnIndex: number,
		value: string | null
	) => {
		setSelectedColumns((prev) => {
			const newSelectedColumns = { ...prev };

			for (const key in newSelectedColumns) {
				if (newSelectedColumns[key] === value) {
					newSelectedColumns[key] = null;
				}
			}

			if (value === 'skip') {
				value = null;
			}

			newSelectedColumns[`column_${columnIndex}`] = value;
			return newSelectedColumns;
		});
	};

	const onContinue = () => {
		const getColumnIndex = (column: string) => column.split('_')[1];

		const data = {
			headers: headers.map((_header, index) => {
				const columnIndex = getColumnIndex(`column_${index}`);
				return selectedColumns[`column_${columnIndex}`] || null;
			}),
			body: body
				.map((row) => {
					const transformedRow = row.map((cell, index) => {
						const columnIndex = getColumnIndex(`column_${index}`);
						return selectedColumns[`column_${columnIndex}`] ? cell : null;
					});

					return transformedRow.every((item) => item === null)
						? []
						: transformedRow;
				})
				.filter((row) => row.length > 0)
		};

		const arrayOfData = data.body.map((row) => {
			return row.reduce((acc: any, cell, index) => {
				const header = data.headers[index];
				if (header !== null) {
					acc[header] = cell;
				}

				return acc;
			}, {});
		});

		const formattedData = arrayOfData.map((item) => ({
			...item,
			amount: convertAmountToMiliUnits(parseFloat(item.amount)),
			date: format(parse(item.date, dateFormat, new Date()), outputFormat)
		}));

		onSubmit(formattedData);
	};

	const progress = Object.values(selectedColumns).filter(Boolean).length;

	return (
		<div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-12">
			<Card className="border-none drop-shadow-sm">
				<CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
					<CardTitle className="text-xl line-clamp-1">
						Import transaction
					</CardTitle>
					<div className="flex flex-col lg:flex-row items-center gap-2">
						<Button size="sm" onClick={onCancel} className="w-full lg:w-auto">
							Cancel
						</Button>
						<Button
							onClick={onContinue}
							size="sm"
							disabled={progress < requiredOptions.length}
							className="w-full lg:w-auto">
							Continue ({progress} / {requiredOptions.length})
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<ImportTable
						headers={headers}
						body={body}
						selectedColumns={selectedColumns}
						onTableHeadSelectChange={onTableHeadSelectChange}
					/>
				</CardContent>
			</Card>
		</div>
	);
};
