"use client";

import { Category } from "@/services/categoryService";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface CategoryDistributionChartProps {
	categories: Category[];
	loading?: boolean;
}

const EXPENSE_COLORS = ["#ef4444", "#f87171", "#fca5a5", "#fecaca", "#fee2e2"];
const INCOME_COLORS = ["#22c55e", "#4ade80", "#86efac", "#bbf7d0", "#dcfce7"];

export default function CategoryDistributionChart({ categories, loading = false }: CategoryDistributionChartProps) {
	// Prepare data for pie charts
	const expenseData = categories
		.filter(cat => cat.type === "expense")
		.map(cat => ({
			name: cat.name,
			value: parseFloat(cat.totalAmount)
		}));

	const incomeData = categories
		.filter(cat => cat.type === "income")
		.map(cat => ({
			name: cat.name,
			value: parseFloat(cat.totalAmount)
		}));

	if (loading) {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
					<div className="animate-pulse space-y-4">
						<div className="h-6 bg-slate-700 rounded w-48"></div>
						<div className="h-64 bg-slate-700 rounded"></div>
					</div>
				</div>
				<div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
					<div className="animate-pulse space-y-4">
						<div className="h-6 bg-slate-700 rounded w-48"></div>
						<div className="h-64 bg-slate-700 rounded"></div>
					</div>
				</div>
			</div>
		);
	}

	if (categories.length === 0) {
		return (
			<div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
				<h2 className="text-xl font-bold text-white mb-4">Category Distribution</h2>
				<p className="text-slate-400 text-center py-8">No category data available</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			{/* Expense Pie Chart */}
			{expenseData.length > 0 && (
				<div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
					<h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
						<span className="text-red-400">💸</span> Expense Distribution
					</h3>
					<ResponsiveContainer width="100%" height={250}>
						<PieChart>
							<Pie
								data={expenseData}
								cx="50%"
								cy="50%"
								labelLine={false}
								label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
								outerRadius={80}
								fill="#8884d8"
								dataKey="value"
							>
								{expenseData.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />
								))}
							</Pie>
							<Tooltip 
								contentStyle={{ 
									backgroundColor: '#1e293b', 
									border: '1px solid #475569',
									borderRadius: '8px',
									color: '#fff'
								}}
								formatter={(value: number | undefined) => value !== undefined ? `$${value.toFixed(2)}` : 'N/A'}
							/>
						</PieChart>
					</ResponsiveContainer>
					<div className="mt-4 space-y-2">
						{expenseData.map((item, index) => (
							<div key={index} className="flex items-center justify-between text-sm">
								<div className="flex items-center gap-2">
									<div 
										className="w-3 h-3 rounded-full" 
										style={{ backgroundColor: EXPENSE_COLORS[index % EXPENSE_COLORS.length] }}
									></div>
									<span className="text-slate-300">{item.name}</span>
								</div>
								<span className="text-red-400 font-semibold">${item.value.toFixed(2)}</span>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Income Pie Chart */}
			{incomeData.length > 0 && (
				<div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
					<h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
						<span className="text-green-400">💰</span> Income Distribution
					</h3>
					<ResponsiveContainer width="100%" height={250}>
						<PieChart>
							<Pie
								data={incomeData}
								cx="50%"
								cy="50%"
								labelLine={false}
								label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
								outerRadius={80}
								fill="#8884d8"
								dataKey="value"
							>
								{incomeData.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={INCOME_COLORS[index % INCOME_COLORS.length]} />
								))}
							</Pie>
							<Tooltip 
								contentStyle={{ 
									backgroundColor: '#1e293b', 
									border: '1px solid #475569',
									borderRadius: '8px',
									color: '#fff'
								}}
								formatter={(value: number | undefined) => value !== undefined ? `$${value.toFixed(2)}` : 'N/A'}
							/>
						</PieChart>
					</ResponsiveContainer>
					<div className="mt-4 space-y-2">
						{incomeData.map((item, index) => (
							<div key={index} className="flex items-center justify-between text-sm">
								<div className="flex items-center gap-2">
									<div 
										className="w-3 h-3 rounded-full" 
										style={{ backgroundColor: INCOME_COLORS[index % INCOME_COLORS.length] }}
									></div>
									<span className="text-slate-300">{item.name}</span>
								</div>
								<span className="text-green-400 font-semibold">${item.value.toFixed(2)}</span>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
