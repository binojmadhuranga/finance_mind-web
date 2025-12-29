import { FormEvent } from "react";
import { TransactionType as ApiTransactionType } from "@/services/transactionService";
import { Category } from "@/services/categoryService";
import CategorySelect from "./CategorySelect";

interface TransactionFormProps {
	transactionType: ApiTransactionType;
	setTransactionType: (type: ApiTransactionType) => void;
	amount: string;
	setAmount: (amount: string) => void;
	date: string;
	setDate: (date: string) => void;
	note: string;
	setNote: (note: string) => void;
	categoryId: string;
	setCategoryId: (id: string) => void;
	categories: Category[];
	loadingCategories: boolean;
	error: string | null;
	submitting: boolean;
	onSubmit: (e: FormEvent) => void;
	onCancel: () => void;
	isEdit?: boolean;
}

export default function TransactionForm({
	transactionType,
	setTransactionType,
	amount,
	setAmount,
	date,
	setDate,
	note,
	setNote,
	categoryId,
	setCategoryId,
	categories,
	loadingCategories,
	error,
	submitting,
	onSubmit,
	onCancel,
	isEdit = false,
}: TransactionFormProps) {
	return (
		<form onSubmit={onSubmit} className="space-y-5">
			{/* Transaction Type Toggle */}
			<div>
				<label className="block text-sm font-medium text-slate-300 mb-3">
					Transaction Type
				</label>
				<div className="grid grid-cols-2 gap-3">
					<button
						type="button"
						onClick={() => setTransactionType("expense")}
						className={`py-3 px-4 rounded-lg font-semibold transition-all transform ${
							transactionType === "expense"
								? "bg-red-600 text-white shadow-lg shadow-red-600/50 scale-105"
								: "bg-slate-700 text-slate-300 hover:bg-slate-600"
						}`}
					>
						<div className="flex items-center justify-center gap-2">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
							</svg>
							Expense
						</div>
					</button>
					<button
						type="button"
						onClick={() => setTransactionType("income")}
						className={`py-3 px-4 rounded-lg font-semibold transition-all transform ${
							transactionType === "income"
								? "bg-green-600 text-white shadow-lg shadow-green-600/50 scale-105"
								: "bg-slate-700 text-slate-300 hover:bg-slate-600"
						}`}
					>
						<div className="flex items-center justify-center gap-2">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
							</svg>
							Income
						</div>
					</button>
				</div>
			</div>

			{/* Amount */}
			<div>
				<label className="block text-sm font-medium text-slate-300 mb-2">
					Amount
				</label>
				<div className="relative">
					<span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">$</span>
					<input
						type="number"
						step="0.01"
						required
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						className="w-full pl-9 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						placeholder="0.00"
					/>
				</div>
			</div>

			{/* Date */}
			<div>
				<label className="block text-sm font-medium text-slate-300 mb-2">
					Date
				</label>
				<input
					type="date"
					required
					value={date}
					onChange={(e) => setDate(e.target.value)}
					className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				/>
			</div>

			{/* Category */}
			<CategorySelect
				categories={categories}
				transactionType={transactionType}
				value={categoryId}
				onChange={setCategoryId}
				loading={loadingCategories}
				required
			/>

			{/* Note */}
			<div>
				<label className="block text-sm font-medium text-slate-300 mb-2">
					Note
				</label>
				<textarea
					required
					value={note}
					onChange={(e) => setNote(e.target.value)}
					rows={3}
					className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
					placeholder="What was this transaction for?"
				/>
			</div>

			{/* Error Display */}
			{error && (
				<div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
					<p className="text-red-400 text-sm">{error}</p>
				</div>
			)}

			{/* Submit Button */}
			<button
				type="submit"
				disabled={submitting}
				className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
					submitting
						? "bg-slate-600 text-slate-400 cursor-not-allowed"
						: "bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105"
				}`}
			>
				{submitting ? (isEdit ? "Updating..." : "Adding...") : (isEdit ? "Update Transaction" : "Add Transaction")}
			</button>
		</form>
	);
}
