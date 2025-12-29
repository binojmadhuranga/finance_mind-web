import { Category } from "@/services/categoryService";

interface CategorySelectProps {
	categories: Category[];
	transactionType: "income" | "expense";
	value: string;
	onChange: (value: string) => void;
	loading?: boolean;
	required?: boolean;
}

export default function CategorySelect({
	categories,
	transactionType,
	value,
	onChange,
	loading = false,
	required = false,
}: CategorySelectProps) {
	const filteredCategories = categories.filter(cat => cat.type === transactionType);

	return (
		<div>
			<label className="block text-sm font-medium text-slate-300 mb-2">
				Category
			</label>
			{loading ? (
				<div className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-400">
					Loading categories...
				</div>
			) : filteredCategories.length > 0 ? (
				<select
					required={required}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				>
					{filteredCategories.map((category) => (
						<option key={category.id} value={category.id}>
							{category.name}
						</option>
					))}
				</select>
			) : (
				<div className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-400">
					No {transactionType} categories available
				</div>
			)}
		</div>
	);
}
