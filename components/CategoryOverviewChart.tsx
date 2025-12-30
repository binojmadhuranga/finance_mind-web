"use client";

import { Category } from "@/services/categoryService";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface CategoryOverviewChartProps {
	categories: Category[];
	loading?: boolean;
}

const EXPENSE_COLOR = "#ef4444";
const INCOME_COLOR = "#22c55e";

export default function CategoryOverviewChart({ categories, loading = false }: CategoryOverviewChartProps) {
	// Prepare data for bar chart
	const barChartData = categories.map(cat => ({
		name: cat.name,
		amount: parseFloat(cat.totalAmount),
		type: cat.type,
		fill: cat.type === "expense" ? EXPENSE_COLOR : INCOME_COLOR
	}));

	if (loading) {
		return (
			<div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
				<div className="animate-pulse space-y-4">
					<div className="h-6 bg-slate-700 rounded w-48"></div>
					<div className="h-64 bg-slate-700 rounded"></div>
				</div>
			</div>
		);
	}

	if (categories.length === 0) {
		return (
			<div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
				<h2 className="text-xl font-bold text-white mb-4">Category Overview</h2>
				<p className="text-slate-400 text-center py-8">No category data available</p>
			</div>
		);
	}

	return (
		<div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
			<h2 className="text-xl font-bold text-white mb-6">Category Overview</h2>
			<ResponsiveContainer width="100%" height={300}>
				<BarChart data={barChartData}>
					<CartesianGrid strokeDasharray="3 3" stroke="#334155" />
					<XAxis 
						dataKey="name" 
						stroke="#94a3b8"
						style={{ fontSize: '12px' }}
					/>
					<YAxis 
						stroke="#94a3b8"
						style={{ fontSize: '12px' }}
					/>
					<Tooltip 
						contentStyle={{ 
							backgroundColor: '#1e293b', 
							border: '1px solid #475569',
							borderRadius: '8px',
							color: '#fff'
						}}
						formatter={(value: number | undefined) => value !== undefined ? [`$${value.toFixed(2)}`, 'Amount'] : ['N/A', 'Amount']}
					/>
					<Legend 
						wrapperStyle={{ color: '#94a3b8' }}
						formatter={(value) => value === 'amount' ? 'Total Amount' : value}
					/>
					<Bar 
						dataKey="amount" 
						radius={[8, 8, 0, 0]}
					/>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}
