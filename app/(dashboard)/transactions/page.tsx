"use client";

import { useState, useEffect, FormEvent } from "react";
import Image from "next/image";
import { 
	transactionService, 
	Transaction, 
	CreateTransactionRequest,
	TransactionType as ApiTransactionType 
} from "@/services/transactionService";
import { categoryService, Category } from "@/services/categoryService";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";

type TransactionType = "all" | "income" | "expense";

export default function TransactionsPage() {
	const [filter, setFilter] = useState<TransactionType>("all");
	const [showAddModal, setShowAddModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [categories, setCategories] = useState<Category[]>([]);
	const [loadingCategories, setLoadingCategories] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [isSearching, setIsSearching] = useState(false);

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

	// Search transactions with debouncing
	useEffect(() => {
		if (searchQuery.trim() === "") {
			// If search is empty, fetch normal transactions
			fetchTransactions();
			return;
		}

		// Debounce search
		const timeoutId = setTimeout(() => {
			handleSearch(searchQuery);
		}, 500); // 500ms debounce

		return () => clearTimeout(timeoutId);
	}, [searchQuery]);

	// Fetch categories
	useEffect(() => {
		fetchCategories();
	}, []);

	const fetchCategories = async () => {
		try {
			setLoadingCategories(true);
			const data = await categoryService.getCategories();
			setCategories(data);
		} catch (err) {
			console.error("Failed to fetch categories:", err);
		} finally {
			setLoadingCategories(false);
		}
	};

	const fetchTransactions = async () => {
		try {
			setLoading(true);
			setError(null);
			setIsSearching(false);
			const params = filter !== "all" ? { type: filter as ApiTransactionType } : undefined;
			const data = await transactionService.getTransactions(params);
			setTransactions(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to fetch transactions");
		} finally {
			setLoading(false);
		}
	};

	const handleSearch = async (query: string) => {
		if (!query.trim()) {
			fetchTransactions();
			return;
		}

		try {
			setLoading(true);
			setError(null);
			setIsSearching(true);
			const data = await transactionService.searchTransactions(query);
			setTransactions(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to search transactions");
		} finally {
			setLoading(false);
		}
	};

	const handleSearchChange = (query: string) => {
		setSearchQuery(query);
		// If search is cleared, reset filter to "all"
		if (query.trim() === "" && isSearching) {
			setFilter("all");
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
			setTransactionType("expense");
			setAmount("");
			setNote("");
			setDate(new Date().toISOString().split("T")[0]);
			const expenseCategories = categories.filter(cat => cat.type === "expense");
			if (expenseCategories.length > 0) {
				setCategoryId(expenseCategories[0].id.toString());
			}
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

	const handleEdit = (transaction: Transaction) => {
		setEditingTransaction(transaction);
		setTransactionType(transaction.type);
		setAmount(transaction.amount);
		setDate(transaction.date.split('T')[0]); // Extract date part
		setNote(transaction.note);
		setCategoryId(transaction.categoryId.toString());
		setShowEditModal(true);
	};

	const handleUpdate = async (e: FormEvent) => {
		e.preventDefault();
		
		if (!editingTransaction) return;

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

			await transactionService.updateTransaction(editingTransaction.id, transactionData);
			
			// Reset form
			setTransactionType("expense");
			setAmount("");
			setNote("");
			setDate(new Date().toISOString().split("T")[0]);
			const expenseCategories = categories.filter(cat => cat.type === "expense");
			if (expenseCategories.length > 0) {
				setCategoryId(expenseCategories[0].id.toString());
			}
			setShowEditModal(false);
			setEditingTransaction(null);
			
			// Refresh transactions
			fetchTransactions();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to update transaction");
		} finally {
			setSubmitting(false);
		}
	};

	const resetForm = () => {
		setAmount("");
		setNote("");
		setDate(new Date().toISOString().split("T")[0]);
		setError(null);
		setTransactionType("expense");
		
		// Set default category based on transaction type
		const expenseCategories = categories.filter(cat => cat.type === "expense");
		if (expenseCategories.length > 0) {
			setCategoryId(expenseCategories[0].id.toString());
		} else {
			setCategoryId("");
		}
	};

	// Update category when transaction type changes
	useEffect(() => {
		const filteredCategories = categories.filter(cat => cat.type === transactionType);
		if (filteredCategories.length > 0 && !filteredCategories.find(cat => cat.id.toString() === categoryId)) {
			setCategoryId(filteredCategories[0].id.toString());
		}
	}, [transactionType, categories]);

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
					onClick={() => {
						setFilter("all");
						setSearchQuery("");
					}}
					className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
						filter === "all"
							? "bg-blue-600 text-white shadow-lg shadow-blue-600/50"
							: "bg-slate-800/50 text-slate-300 hover:bg-slate-700 border border-slate-700"
					}`}
				>
					All Transactions
				</button>
				<button
					onClick={() => {
						setFilter("income");
						setSearchQuery("");
					}}
					className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
						filter === "income"
							? "bg-green-600 text-white shadow-lg shadow-green-600/50"
							: "bg-slate-800/50 text-slate-300 hover:bg-slate-700 border border-slate-700"
					}`}
				>
					Income
				</button>
				<button
					onClick={() => {
						setFilter("expense");
						setSearchQuery("");
					}}
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
			<TransactionList
				transactions={transactions}
				categories={categories}
				loading={loading}
				error={error}
				onEdit={handleEdit}
				onDelete={handleDelete}
				onAddTransaction={() => setShowAddModal(true)}
				searchQuery={searchQuery}
				onSearchChange={handleSearchChange}
			/>

			{/* Add Transaction Modal */}
			{showAddModal && (
				<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
					<div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 max-w-md w-full shadow-2xl">
						<div className="flex items-center justify-between mb-6">
							<h3 className="text-2xl font-bold text-white">Add Transaction</h3>
							<button
								onClick={() => {
									setShowAddModal(false);
									resetForm();
								}}
								className="p-2 hover:bg-slate-700 rounded-lg transition"
								type="button"
							>
								<svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>

						<TransactionForm
							transactionType={transactionType}
							setTransactionType={setTransactionType}
							amount={amount}
							setAmount={setAmount}
							date={date}
							setDate={setDate}
							note={note}
							setNote={setNote}
							categoryId={categoryId}
							setCategoryId={setCategoryId}
							categories={categories}
							loadingCategories={loadingCategories}
							error={error}
							submitting={submitting}
							onSubmit={handleSubmit}
							onCancel={() => {
								setShowAddModal(false);
								resetForm();
							}}
						/>
					</div>
				</div>
			)}

			{/* Edit Transaction Modal */}
			{showEditModal && editingTransaction && (
				<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
					<div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 max-w-md w-full shadow-2xl">
						<div className="flex items-center justify-between mb-6">
							<h3 className="text-2xl font-bold text-white">Edit Transaction</h3>
							<button
								onClick={() => {
									setShowEditModal(false);
									setEditingTransaction(null);
									resetForm();
								}}
								className="p-2 hover:bg-slate-700 rounded-lg transition"
								type="button"
							>
								<svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>

						<TransactionForm
							transactionType={transactionType}
							setTransactionType={setTransactionType}
							amount={amount}
							setAmount={setAmount}
							date={date}
							setDate={setDate}
							note={note}
							setNote={setNote}
							categoryId={categoryId}
							setCategoryId={setCategoryId}
							categories={categories}
							loadingCategories={loadingCategories}
							error={error}
							submitting={submitting}
							onSubmit={handleUpdate}
							onCancel={() => {
								setShowEditModal(false);
								setEditingTransaction(null);
								resetForm();
							}}
							isEdit
						/>
					</div>
				</div>
			)}
		</div>
	);
}

