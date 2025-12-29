import { Transaction } from "@/services/transactionService";
import { Category } from "@/services/categoryService";

interface TransactionListProps {
	transactions: Transaction[];
	categories: Category[];
	loading: boolean;
	error: string | null;
	onEdit: (transaction: Transaction) => void;
	onDelete: (id: number) => void;
	onAddTransaction: () => void;
	searchQuery: string;
	onSearchChange: (query: string) => void;
}

export default function TransactionList({
	transactions,
	categories,
	loading,
	error,
	onEdit,
	onDelete,
	onAddTransaction,
	searchQuery,
	onSearchChange,
}: TransactionListProps) {
	const getCategoryName = (categoryId: number) => {
		const category = categories.find(cat => cat.id === categoryId);
		return category ? category.name : `Category #${categoryId}`;
	};

	return (
		<div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl shadow-lg overflow-hidden">
			<div className="p-6 border-b border-slate-700">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
					<h2 className="text-xl font-bold text-white">Transaction History</h2>
					<div className="flex items-center gap-3">
						<div className="relative">
							<input
								type="text"
								placeholder="Search transactions..."
								value={searchQuery}
								onChange={(e) => onSearchChange(e.target.value)}
								className="w-full md:w-64 px-4 py-2 pl-10 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
							<svg className="w-5 h-5 text-slate-500 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
							</svg>
						</div>
					</div>
				</div>
			</div>

			{/* Error Message */}
			{error && (
				<div className="p-4 bg-red-500/10 border-b border-red-500/20">
					<p className="text-red-400 text-sm">{error}</p>
				</div>
			)}

			{/* Loading State */}
			{loading && (
				<div className="p-12 text-center">
					<div className="inline-block w-12 h-12 border-4 border-slate-600 border-t-blue-500 rounded-full animate-spin mb-4"></div>
					<p className="text-slate-400">Loading transactions...</p>
				</div>
			)}

			{/* Empty State */}
			{!loading && transactions.length === 0 && (
				<div className="p-12 text-center">
					<div className="inline-flex items-center justify-center w-20 h-20 bg-slate-700/50 rounded-full mb-4">
						<svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
						</svg>
					</div>
					<h3 className="text-xl font-semibold text-white mb-2">No transactions yet</h3>
					<p className="text-slate-400 mb-6 max-w-md mx-auto">
						Start tracking your finances by adding your first transaction. It only takes a few seconds!
					</p>
					<button
						onClick={onAddTransaction}
						className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105"
					>
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
						</svg>
						Add Your First Transaction
					</button>
				</div>
			)}

			{/* Transactions List */}
			{!loading && transactions.length > 0 && (
				<div className="divide-y divide-slate-700">
					{transactions.map((transaction) => (
						<div key={transaction.id} className="p-6 hover:bg-slate-700/30 transition">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-4 flex-1">
									<div className={`p-3 rounded-lg ${
										transaction.type === "income" 
											? "bg-green-500/10 text-green-400" 
											: "bg-red-500/10 text-red-400"
									}`}>
										{transaction.type === "income" ? (
											<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
											</svg>
										) : (
											<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
											</svg>
										)}
									</div>
									<div className="flex-1">
										<h4 className="text-white font-medium">{transaction.note}</h4>
										<p className="text-slate-400 text-sm">
											{new Date(transaction.date).toLocaleDateString("en-US", { 
												year: "numeric", 
												month: "short", 
												day: "numeric" 
											})}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-4">
									<div className="text-right">
										<p className={`text-xl font-bold ${
											transaction.type === "income" ? "text-green-400" : "text-red-400"
										}`}>
											{transaction.type === "income" ? "+" : "-"}${parseFloat(transaction.amount).toFixed(2)}
										</p>
										<p className="text-slate-500 text-sm">{getCategoryName(transaction.categoryId)}</p>
									</div>
									<button
										onClick={() => onEdit(transaction)}
										className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition"
										title="Edit transaction"
									>
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
										</svg>
									</button>
									<button
										onClick={() => onDelete(transaction.id)}
										className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
										title="Delete transaction"
									>
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
										</svg>
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
