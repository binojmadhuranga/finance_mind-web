"use client";

import { useState } from "react";
import Image from "next/image";

type TransactionType = "all" | "income" | "expense";

export default function TransactionsPage() {
	const [filter, setFilter] = useState<TransactionType>("all");
	const [showAddModal, setShowAddModal] = useState(false);

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
					<p className="text-3xl font-bold text-white">$0.00</p>
					<p className="text-green-100 text-sm mt-1">0 transactions</p>
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
					<p className="text-3xl font-bold text-white">$0.00</p>
					<p className="text-red-100 text-sm mt-1">0 transactions</p>
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
					<p className="text-3xl font-bold text-white">$0.00</p>
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

				{/* Empty State */}
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
			</div>

			{/* Add Transaction Modal Placeholder */}
			{showAddModal && (
				<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
					<div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 max-w-md w-full shadow-2xl">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-2xl font-bold text-white">Add Transaction</h3>
							<button
								onClick={() => setShowAddModal(false)}
								className="p-2 hover:bg-slate-700 rounded-lg transition"
							>
								<svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>
						<p className="text-slate-400 mb-4">Transaction form will be implemented here</p>
						<button
							onClick={() => setShowAddModal(false)}
							className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition"
						>
							Close
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

