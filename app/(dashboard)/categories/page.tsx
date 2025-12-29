"use client";

import { useState, useEffect, FormEvent } from "react";
import Image from "next/image";
import { 
	categoryService, 
	Category, 
	CreateCategoryRequest,
	UpdateCategoryRequest,
	CategoryType 
} from "@/services/categoryService";
import CategoryCard from "@/components/CategoryCard";
import EditCategoryModal from "@/components/EditCategoryModal";

export default function CategoriesPage() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [showAddModal, setShowAddModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [editingCategory, setEditingCategory] = useState<Category | null>(null);
	const [submitting, setSubmitting] = useState(false);

	// Form states for add modal
	const [categoryName, setCategoryName] = useState("");
	const [categoryType, setCategoryType] = useState<CategoryType>("expense");

	// Fetch categories
	useEffect(() => {
		fetchCategories();
	}, []);

	const fetchCategories = async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await categoryService.getCategories();
			setCategories(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to fetch categories");
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		
		if (!categoryName.trim()) {
			setError("Category name is required");
			return;
		}

		try {
			setSubmitting(true);
			setError(null);

			const categoryData: CreateCategoryRequest = {
				name: categoryName,
				type: categoryType,
			};

			const response = await categoryService.createCategory(categoryData);
			
			// Check if category already exists
			if ("message" in response && response.message === "Category already exists") {
				setError("Category already exists");
				return;
			}
			
			// Reset form
			setCategoryName("");
			setCategoryType("expense");
			setShowAddModal(false);
			
			// Refresh categories
			fetchCategories();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to create category");
		} finally {
			setSubmitting(false);
		}
	};

	const handleEdit = (category: Category) => {
		setEditingCategory(category);
		setShowEditModal(true);
	};

	const handleUpdate = async (name: string, type: CategoryType) => {
		if (!editingCategory || !name.trim()) {
			setError("Category name is required");
			return;
		}

		try {
			setSubmitting(true);
			setError(null);

			const categoryData: UpdateCategoryRequest = {
				name,
				type,
			};

			await categoryService.updateCategory(editingCategory.id, categoryData);
			
			setEditingCategory(null);
			setShowEditModal(false);
			fetchCategories();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to update category");
		} finally {
			setSubmitting(false);
		}
	};

	const handleCloseEditModal = () => {
		setShowEditModal(false);
		setEditingCategory(null);
		setError(null);
	};

	const handleDelete = async (id: number, name: string) => {
		if (!confirm(`Are you sure you want to delete the category "${name}"?`)) return;
		
		try {
			setError(null);
			await categoryService.deleteCategory(id);
			fetchCategories();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to delete category");
		}
	};

	const expenseCategories = categories.filter(c => c.type === "expense");
	const incomeCategories = categories.filter(c => c.type === "income");

	return (
		<div className="space-y-6">
			{/* Hero Section with Background Image */}
			<div className="relative overflow-hidden rounded-2xl h-64 md:h-80">
				<Image
					src="/category.png"
					alt="Categories"
					fill
					className="object-cover brightness-50"
					priority
				/>
				<div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-purple-900/80 to-transparent z-10" />
				<div className="relative z-20 h-full flex flex-col justify-center px-8 md:px-12">
					<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
						Categories
					</h1>
					<p className="text-blue-100 text-lg md:text-xl max-w-2xl mb-6">
						Organize your finances. Create and manage categories for your income and expenses.
					</p>
					<button
						onClick={() => setShowAddModal(true)}
						className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg shadow-lg hover:bg-blue-50 transition-all transform hover:scale-105 w-fit"
					>
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
						</svg>
						Add Category
					</button>
				</div>
			</div>

			<div className="max-w-6xl mx-auto">{/* Error Message */}
				{error && (
					<div className="mb-6 bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
						{error}
					</div>
				)}

				{/* Loading State */}
				{loading ? (
					<div className="flex justify-center items-center py-12">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
					</div>
				) : (
					<div className="grid md:grid-cols-2 gap-8">
						{/* Expense Categories */}
						<div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
							<h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
								<span className="text-red-400">💸</span> Expense Categories
							</h2>
							{expenseCategories.length === 0 ? (
								<p className="text-slate-400 text-center py-8">No expense categories yet</p>
							) : (
								<div className="space-y-3">
									{expenseCategories.map((category) => (
										<CategoryCard
											key={category.id}
											category={category}
											onEdit={handleEdit}
											onDelete={handleDelete}
										/>
									))}
								</div>
							)}
						</div>

						{/* Income Categories */}
						<div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
							<h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
								<span className="text-green-400">💰</span> Income Categories
							</h2>
							{incomeCategories.length === 0 ? (
								<p className="text-slate-400 text-center py-8">No income categories yet</p>
							) : (
								<div className="space-y-3">
									{incomeCategories.map((category) => (
										<CategoryCard
											key={category.id}
											category={category}
											onEdit={handleEdit}
											onDelete={handleDelete}
										/>
									))}
								</div>
							)}
						</div>
					</div>
				)}

				{/* Add Category Modal */}
				{showAddModal && (
					<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
						<div className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-700">
							<h2 className="text-2xl font-bold text-white mb-6">Add New Category</h2>
							
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
										onClick={() => {
											setShowAddModal(false);
											setError(null);
											setCategoryName("");
											setCategoryType("expense");
										}}
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
										{submitting ? "Adding..." : "Add Category"}
									</button>
								</div>
							</form>
						</div>
					</div>
				)}

			{/* Edit Category Modal */}
			<EditCategoryModal
				category={editingCategory}
				isOpen={showEditModal}
				onClose={handleCloseEditModal}
				onUpdate={handleUpdate}
				submitting={submitting}
			/>
				</div>
	</div>
	);
}