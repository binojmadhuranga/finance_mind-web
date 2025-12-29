import { FormEvent, useState, useEffect } from "react";
import { Category, CategoryType } from "@/services/categoryService";

interface EditCategoryModalProps {
	category: Category | null;
	isOpen: boolean;
	onClose: () => void;
	onUpdate: (name: string, type: CategoryType) => Promise<void>;
	submitting: boolean;
}

export default function EditCategoryModal({ 
	category, 
	isOpen, 
	onClose, 
	onUpdate, 
	submitting 
}: EditCategoryModalProps) {
	const [categoryName, setCategoryName] = useState("");
	const [categoryType, setCategoryType] = useState<CategoryType>("expense");

	useEffect(() => {
		if (category) {
			setCategoryName(category.name);
			setCategoryType(category.type);
		}
	}, [category]);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		await onUpdate(categoryName, categoryType);
	};

	if (!isOpen || !category) return null;

	return (
		<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
			<div className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-700">
				<h2 className="text-2xl font-bold text-white mb-6">Edit Category</h2>
				
				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Category Name */}
					<div>
						<label className="block text-slate-300 mb-2 font-medium">
							Category Name
						</label>
						<input
							type="text"
							value={categoryName}
							onChange={(e) => setCategoryName(e.target.value)}
							className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="e.g., Food, Salary, Travel"
							required
						/>
					</div>

					{/* Category Type */}
					<div>
						<label className="block text-slate-300 mb-2 font-medium">
							Category Type
						</label>
						<div className="grid grid-cols-2 gap-3">
							<button
								type="button"
								onClick={() => setCategoryType("expense")}
								className={`px-4 py-2 rounded-lg font-medium transition-colors ${
									categoryType === "expense"
										? "bg-red-600 text-white"
										: "bg-slate-700 text-slate-300 hover:bg-slate-600"
								}`}
							>
								Expense
							</button>
							<button
								type="button"
								onClick={() => setCategoryType("income")}
								className={`px-4 py-2 rounded-lg font-medium transition-colors ${
									categoryType === "income"
										? "bg-green-600 text-white"
										: "bg-slate-700 text-slate-300 hover:bg-slate-600"
								}`}
							>
								Income
							</button>
						</div>
					</div>

					{/* Buttons */}
					<div className="flex gap-3 pt-4">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
							disabled={submitting}
						>
							Cancel
						</button>
						<button
							type="submit"
							className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							disabled={submitting}
						>
							{submitting ? "Updating..." : "Update Category"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
