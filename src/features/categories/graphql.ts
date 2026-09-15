import { gql } from "@apollo/client";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export const CATEGORIES_QUERY = gql`
  query Categories {
    categories {
      id
      name
      slug
      description
    }
  }
`;

export interface CategoriesQueryData {
  categories: Category[];
}

export const CREATE_CATEGORY_MUTATION = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      id
      name
      slug
      description
    }
  }
`;

export interface CreateCategoryMutationData {
  createCategory: Category;
}

export interface CreateCategoryMutationVars {
  input: { name: string; description?: string };
}

export const UPDATE_CATEGORY_MUTATION = gql`
  mutation UpdateCategory($id: ID!, $input: UpdateCategoryInput!) {
    updateCategory(id: $id, input: $input) {
      id
      name
      slug
      description
    }
  }
`;

export interface UpdateCategoryMutationData {
  updateCategory: Category;
}

export interface UpdateCategoryMutationVars {
  id: string;
  input: { name?: string; description?: string };
}

export const DELETE_CATEGORY_MUTATION = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`;

export interface DeleteCategoryMutationData {
  deleteCategory: boolean;
}

export interface DeleteCategoryMutationVars {
  id: string;
}
