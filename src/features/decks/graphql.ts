import { gql } from "@apollo/client";

export type Difficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface DeckSummary {
  id: string;
  authorId: string;
  title: string;
  description: string | null;
  coverUrl: string | null;
  difficulty: Difficulty | null;
  isFree: boolean;
  price: number;
  cardCount: number;
  downloadsCount: number;
  ratingAverage: number;
  ratingCount: number;
  category: Category | null;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  orderIndex: number;
  createdAt: string;
}

export const CATEGORIES_QUERY = gql`
  query Categories {
    categories {
      id
      name
      slug
    }
  }
`;

export interface CategoriesQueryData {
  categories: Category[];
}

export const ADMIN_DECKS_QUERY = gql`
  query AdminDecks($search: String, $categoryId: ID) {
    adminDecks(search: $search, categoryId: $categoryId) {
      id
      authorId
      title
      description
      coverUrl
      difficulty
      isFree
      price
      cardCount
      downloadsCount
      ratingAverage
      ratingCount
      category {
        id
        name
        slug
      }
    }
  }
`;

export interface AdminDecksQueryData {
  adminDecks: DeckSummary[];
}

export interface AdminDecksQueryVars {
  search?: string;
  categoryId?: string;
}

// The public `deck(id)` query — reused for fetching one deck's current
// values before editing, rather than adding a redundant admin-only
// single-deck query. A public deck is visible to any authenticated viewer,
// admin or not.
export const DECK_QUERY = gql`
  query Deck($id: ID!) {
    deck(id: $id) {
      id
      authorId
      title
      description
      coverUrl
      difficulty
      isFree
      price
      category {
        id
        name
        slug
      }
    }
  }
`;

export interface DeckDetail {
  id: string;
  authorId: string;
  title: string;
  description: string | null;
  coverUrl: string | null;
  difficulty: Difficulty | null;
  isFree: boolean;
  price: number;
  category: Category | null;
}

export interface DeckQueryData {
  deck: DeckDetail;
}

export interface DeckQueryVars {
  id: string;
}

export interface DeckInput {
  title: string;
  description?: string;
  coverUrl?: string;
  categoryId: string;
  difficulty: Difficulty;
  isFree: boolean;
  /** Whole rupees (e.g. 499) — the backend converts to paise. Required when isFree is false. */
  priceRupees?: number;
}

export const ADMIN_CREATE_DECK_MUTATION = gql`
  mutation AdminCreateDeck($input: AdminCreateDeckInput!) {
    adminCreateDeck(input: $input) {
      id
    }
  }
`;

export interface AdminCreateDeckMutationData {
  adminCreateDeck: { id: string };
}

export interface AdminCreateDeckMutationVars {
  input: DeckInput;
}

export const ADMIN_UPDATE_DECK_MUTATION = gql`
  mutation AdminUpdateDeck($id: ID!, $input: AdminUpdateDeckInput!) {
    adminUpdateDeck(id: $id, input: $input) {
      id
    }
  }
`;

export interface AdminUpdateDeckMutationData {
  adminUpdateDeck: { id: string };
}

export interface AdminUpdateDeckMutationVars {
  id: string;
  input: Partial<DeckInput>;
}

export const ADMIN_DELETE_DECK_MUTATION = gql`
  mutation AdminDeleteDeck($id: ID!) {
    adminDeleteDeck(id: $id)
  }
`;

export interface AdminDeleteDeckMutationData {
  adminDeleteDeck: boolean;
}

export interface AdminDeleteDeckMutationVars {
  id: string;
}

export const ADMIN_DECK_FLASHCARDS_QUERY = gql`
  query AdminDeckFlashcards($deckId: ID!) {
    adminDeckFlashcards(deckId: $deckId) {
      id
      front
      back
      orderIndex
      createdAt
    }
  }
`;

export interface AdminDeckFlashcardsQueryData {
  adminDeckFlashcards: Flashcard[];
}

export interface AdminDeckFlashcardsQueryVars {
  deckId: string;
}

export interface FlashcardInput {
  front: string;
  back: string;
  orderIndex?: number;
}

export const ADMIN_CREATE_FLASHCARD_MUTATION = gql`
  mutation AdminCreateFlashcard($input: CreateFlashcardInput!) {
    adminCreateFlashcard(input: $input) {
      id
      front
      back
      orderIndex
      createdAt
    }
  }
`;

export interface AdminCreateFlashcardMutationData {
  adminCreateFlashcard: Flashcard;
}

export interface AdminCreateFlashcardMutationVars {
  input: FlashcardInput & { deckId: string };
}

export const ADMIN_UPDATE_FLASHCARD_MUTATION = gql`
  mutation AdminUpdateFlashcard($id: ID!, $input: UpdateFlashcardInput!) {
    adminUpdateFlashcard(id: $id, input: $input) {
      id
      front
      back
      orderIndex
      createdAt
    }
  }
`;

export interface AdminUpdateFlashcardMutationData {
  adminUpdateFlashcard: Flashcard;
}

export interface AdminUpdateFlashcardMutationVars {
  id: string;
  input: Partial<FlashcardInput>;
}

export const ADMIN_DELETE_FLASHCARD_MUTATION = gql`
  mutation AdminDeleteFlashcard($id: ID!) {
    adminDeleteFlashcard(id: $id)
  }
`;

export interface AdminDeleteFlashcardMutationData {
  adminDeleteFlashcard: boolean;
}

export interface AdminDeleteFlashcardMutationVars {
  id: string;
}
