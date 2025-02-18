export interface PaginatedData<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  page?: number | undefined;
  totalPages: number;
  offset: number;
  prevPage?: number | null | undefined;
  nextPage?: number | null | undefined;
  pagingCounter: number;
  meta?: any;
  sortField?: string;
  sortOrder?: "asc" | "desc";
}

export interface IPaginateBaseQuery {
  limit?: number;
  offset?: number;
  page?: number;
}
