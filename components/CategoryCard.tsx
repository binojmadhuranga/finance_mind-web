import { Category } from "@/services/categoryService";

interface CategoryCardProps {
	category: Category;
	onEdit: (category: Category) => void;
	onDelete: (id: number, name: string) => void;
}

export default function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
	const isExpense = category.type === "expense";

	return (
		<div
			className={`bg-slate-700/50 rounded-lg p-4 border border-slate-600 hover:border-${isExpense ? 'red' : 'green'}-400 transition-colors`}
		>
			<div className="flex justify-between items-start">
				<div className="flex-1">
					<h3 className="text-white font-medium">{category.name}</h3>
					<p className={`text-${isExpense ? 'red' : 'green'}-400 text-lg font-semibold mt-1`}>
						${parseFloat(category.totalAmount).toFixed(2)}
					</p>
				</div>
				<div className="flex items-center gap-2">
					<span className={`px-3 py-1 bg-${isExpense ? 'red' : 'green'}-500/20 text-${isExpense ? 'red' : 'green'}-300 rounded-full text-sm`}>
						{isExpense ? 'Expense' : 'Income'}
					</span>
					<button
						onClick={() => onEdit(category)}
						className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
						title="Edit category"
					>
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
						</svg>
					</button>
					<button
						onClick={() => onDelete(category.id, category.name)}
						className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
						title="Delete category"
					>
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
						</svg>
					</button>
				</div>
			</div>
		</div>
	);
}
