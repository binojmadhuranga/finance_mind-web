"use client";

import { useState, useEffect, FormEvent } from "react";
import Image from "next/image";
import { 
	transactionService, 
	Transaction, 
	CreateTransactionRequest,
	TransactionType as ApiTransactionType 
} from "@/services/transactionService";

type TransactionType = "all" | "income" | "expense";

export default function TransactionsPage() {
	const [filter, setFilter] = useState<TransactionType>("all");
	const [showAddModal, setShowAddModal] = useState(false);
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Form states
	const [transactionType, setTransactionType] = useState<ApiTransactionType>("expense");
	const [amount, setAmount] = useState("");
	const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
	const [note, setNote] = useState("");
	const [categoryId, setCategoryId] = useState("1");
	const [submitting, setSubmitting] = useState(false);

	// Fetch transactions
	useEffect(() => {
		fetchTransactions();
	}, [filter]);

	const fetchTransactions = async () => {
		try {
			setLoading(true);
			setError(null);
			const params = filter !== "all" ? { type: filter as ApiTransactionType } : undefined;
			const data = await transactionService.getTransactions(params);
			setTransactions(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to fetch transactions");
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		
		try {
			setSubmitting(true);
			setError(null);

			const transactionData: CreateTransactionRequest = {
				amount: parseFloat(amount),
				type: transactionType,
				date,
				note,
				categoryId: parseInt(categoryId),
			};

			await transactionService.createTransaction(transactionData);
			
			// Reset form
			setAmount("");
			setNote("");
			setCategoryId("1");
			setTransactionType("expense");
			setShowAddModal(false);
			
			// Refresh transactions
			fetchTransactions();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to create transaction");
		} finally {
			setSubmitting(false);
		}
	};

	const handleDelete = async (id: number) => {
		if (!confirm("Are you sure you want to delete this transaction?")) return;
		
		try {
			await transactionService.deleteTransaction(id);
			fetchTransactions();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to delete transaction");
		}
	};

	// Calculate stats
	const stats = transactions.reduce(
		(acc, transaction) => {
			const amount = parseFloat(transaction.amount);
			if (transaction.type === "income") {
				acc.totalIncome += amount;
				acc.incomeCount++;
			} else {
				acc.totalExpense += amount;
				acc.expenseCount++;
			}
			return acc;
		},
		{ totalIncome: 0, totalExpense: 0, incomeCount: 0, expenseCount: 0 }
	);

	const netBalance = stats.totalIncome - stats.totalExpense;

	return (
		<div className="space-y-6">
			{/* Hero Section with Background Image */}
			<div className="relative overflow-hidden rounded-2xl h-64 md:h-80">
				<Image
					src="/transaction.png"
					alt="Transactions"
					fill
					className="object-cover brightness-50"
					priority
				/>
				<div className="absolute inset-0 bg-linear-to-r from-blue-900/90 via-purple-900/80 to-transparent z-10" />
				<div className="relative z-20 h-full flex flex-col justify-center px-8 md:px-12">
					<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
						Transactions
					</h1>
					<p className="text-blue-100 text-lg md:text-xl max-w-2xl mb-6">
						Track every penny. View, filter, and manage all your financial transactions in one place.
					</p>
					<button
						onClick={() => setShowAddModal(true)}
						className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg shadow-lg hover:bg-blue-50 transition-all transform hover:scale-105 w-fit"
					>
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
						</svg>
						Add Transaction
					</button>
				</div>
			</div>

			{/* Filter Tabs */}
			<div className="flex flex-wrap gap-3">
				<button
					onClick={() => setFilter("all")}
					className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
						filter === "all"
							? "bg-blue-600 text-white shadow-lg shadow-blue-600/50"
							: "bg-slate-800/50 text-slate-300 hover:bg-slate-700 border border-slate-700"
					}`}
				>
					All Transactions
				</button>
				<button
					onClick={() => setFilter("income")}
					className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
						filter === "income"
							? "bg-green-600 text-white shadow-lg shadow-green-600/50"
							: "bg-slate-800/50 text-slate-300 hover:bg-slate-700 border border-slate-700"
					}`}
				>
					Income
				</button>
				<button
					onClick={() => setFilter("expense")}
					className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
						filter === "expense"
							? "bg-red-600 text-white shadow-lg shadow-red-600/50"
							: "bg-slate-800/50 text-slate-300 hover:bg-slate-700 border border-slate-700"
					}`}
				>
					Expenses
				</button>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="bg-linear-to-br from-green-600 to-green-700 rounded-xl p-6 shadow-lg">
					<div className="flex items-center gap-3 mb-3">
						<div className="p-2 bg-white/20 rounded-lg">
							<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
							</svg>
						</div>
						<h3 className="text-white/90 text-sm font-medium">Total Income</h3>
					</div>
					<p className="text-3xl font-bold text-white">${stats.totalIncome.toFixed(2)}</p>
					<p className="text-green-100 text-sm mt-1">{stats.incomeCount} transactions</p>
				</div>

				<div className="bg-linear-to-br from-red-600 to-red-700 rounded-xl p-6 shadow-lg">
					<div className="flex items-center gap-3 mb-3">
						<div className="p-2 bg-white/20 rounded-lg">
							<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
							</svg>
						</div>
						<h3 className="text-white/90 text-sm font-medium">Total Expenses</h3>
					</div>
					<p className="text-3xl font-bold text-white">${stats.totalExpense.toFixed(2)}</p>
					<p className="text-red-100 text-sm mt-1">{stats.expenseCount} transactions</p>
				</div>

				<div className="bg-linear-to-br from-blue-600 to-blue-700 rounded-xl p-6 shadow-lg">
					<div className="flex items-center gap-3 mb-3">
						<div className="p-2 bg-white/20 rounded-lg">
							<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<h3 className="text-white/90 text-sm font-medium">Net Balance</h3>
					</div>
					<p className="text-3xl font-bold text-white">${netBalance.toFixed(2)}</p>
					<p className="text-blue-100 text-sm mt-1">Current period</p>
				</div>
			</div>

			{/* Transactions List */}
			<div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl shadow-lg overflow-hidden">
				<div className="p-6 border-b border-slate-700">
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
						<h2 className="text-xl font-bold text-white">Transaction History</h2>
						<div className="flex items-center gap-3">
							<div className="relative">
								<input
									type="text"
									placeholder="Search transactions..."
									className="w-full md:w-64 px-4 py-2 pl-10 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								/>
								<svg className="w-5 h-5 text-slate-500 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
								</svg>
							</div>
							<button className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition">
								<svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
								</svg>
							</button>
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
							onClick={() => setShowAddModal(true)}
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
											<p className="text-slate-500 text-sm">Category #{transaction.categoryId}</p>
										</div>
										<button
											onClick={() => handleDelete(transaction.id)}
											className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
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

			{/* Add Transaction Modal */}
			{showAddModal && (
				<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
					<div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 max-w-md w-full shadow-2xl">
						<div className="flex items-center justify-between mb-6">
							<h3 className="text-2xl font-bold text-white">Add Transaction</h3>
							<button
								onClick={() => setShowAddModal(false)}
								className="p-2 hover:bg-slate-700 rounded-lg transition"
								type="button"
							>
								<svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>

						<form onSubmit={handleSubmit} className="space-y-5">
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
							<div>
								<label className="block text-sm font-medium text-slate-300 mb-2">
									Category ID
								</label>
								<input
									type="number"
									required
									value={categoryId}
									onChange={(e) => setCategoryId(e.target.value)}
									className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									placeholder="1"
								/>
							</div>

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
								{submitting ? "Adding..." : "Add Transaction"}
							</button>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}

