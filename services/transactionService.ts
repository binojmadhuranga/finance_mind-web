import { apiClient } from "./apiClient";

export type TransactionType = "expense" | "income";

export interface CreateTransactionRequest {
  amount: number;
  type: TransactionType;
  date: string;
  note: string;
  categoryId: number;
}

export interface UpdateTransactionRequest {
  amount?: number;
  type?: TransactionType;
  date?: string;
  note?: string;
  categoryId?: number;
}

export interface Transaction {
  id: number;
  amount: string;
  type: TransactionType;
  date: string;
  note: string;
  categoryId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetTransactionsParams {
  type?: TransactionType;
  startDate?: string;
  endDate?: string;
  categoryId?: number;
  limit?: number;
  offset?: number;
}

export const transactionService = {
  /**
   * Create a new transaction
   */
  async createTransaction(data: CreateTransactionRequest): Promise<Transaction> {
    return apiClient.post<Transaction>("/transactions", data);
  },

  /**
   * Get all transactions with optional filters
   */
  async getTransactions(params?: GetTransactionsParams): Promise<Transaction[]> {
    const queryParams = new URLSearchParams();
    
    if (params?.type) queryParams.append("type", params.type);
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);
    if (params?.categoryId) queryParams.append("categoryId", params.categoryId.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.offset) queryParams.append("offset", params.offset.toString());

    const query = queryParams.toString();
    const endpoint = query ? `/transactions?${query}` : "/transactions";
    
    return apiClient.get<Transaction[]>(endpoint);
  },

  /**
   * Get a single transaction by ID
   */
  async getTransactionById(id: number): Promise<Transaction> {
    return apiClient.get<Transaction>(`/transactions/${id}`);
  },

  /**
   * Update a transaction
   */
  async updateTransaction(id: number, data: UpdateTransactionRequest): Promise<Transaction> {
    return apiClient.put<Transaction>(`/transactions/${id}`, data);
  },

  /**
   * Delete a transaction
   */
  async deleteTransaction(id: number): Promise<void> {
    return apiClient.delete<void>(`/transactions/${id}`);
  },

  /**
   * Get transaction statistics
   */
  async getTransactionStats(params?: { startDate?: string; endDate?: string }): Promise<{
    totalIncome: number;
    totalExpense: number;
    balance: number;
    incomeCount: number;
    expenseCount: number;
  }> {
    const queryParams = new URLSearchParams();
    
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);

    const query = queryParams.toString();
    const endpoint = query ? `/transactions/stats?${query}` : "/transactions/stats";
    
    return apiClient.get(endpoint);
  },
};
