export interface Category {
  id: string;
  name: string;
  parentId?: string | null;
  children?: Category[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryRequest {
  name: string;
  parentId?: string | null;
}

export interface UpdateCategoryRequest {
  name?: string;
  parentId?: string | null;
}