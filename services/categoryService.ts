import { apiClient } from "./apiClient";

export type CategoryType = "expense" | "income";

export interface Category {
  id: number;
  name: string;
  type: CategoryType;
  totalAmount: string;
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryRequest {
  name: string;
  type: CategoryType;
}

export interface CreateCategoryResponse {
  id: number;
  name: string;
  type: CategoryType;
  userId: number;
  updatedAt: string;
  createdAt: string;
}

export interface CategoryExistsResponse {
  message: string;
}

export interface UpdateCategoryRequest {
  name: string;
  type: CategoryType;
}

export interface UpdateCategoryResponse {
  id: number;
  name: string;
  type: CategoryType;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface DeleteCategoryResponse {
  message: string;
}

export const categoryService = {
  /**
   * Get all categories
   */
  async getCategories(): Promise<Category[]> {
    return apiClient.get<Category[]>("/categories");
  },

  /**
   * Create a new category
   */
  async createCategory(data: CreateCategoryRequest): Promise<CreateCategoryResponse | CategoryExistsResponse> {
    return apiClient.post<CreateCategoryResponse | CategoryExistsResponse>("/categories", data);
  },

  /**
   * Update a category
   */
  async updateCategory(id: number, data: UpdateCategoryRequest): Promise<UpdateCategoryResponse> {
    return apiClient.put<UpdateCategoryResponse>(`/categories/${id}`, data);
  },

  /**
   * Delete a category
   */
  async deleteCategory(id: number): Promise<DeleteCategoryResponse> {
    return apiClient.delete<DeleteCategoryResponse>(`/categories/${id}`);
  },
};
