import { z } from "zod";

// Mirrors AdminCreateDeckInput/AdminUpdateDeckInput — categoryId and
// difficulty are both required here, unlike the main app's custom-deck form
// where they're optional/removed (see the Phase 3 decision-log entry).
// `priceRupees` is only actually required when `isFree` is false — enforced
// via `.refine()` below rather than making the field itself required, since
// it's legitimately absent/ignored for a free deck.
export const deckSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title cannot be empty")
      .max(255, "Title must be at most 255 characters long"),
    description: z
      .string()
      .max(2000, "Description must be at most 2000 characters long")
      .optional(),
    coverUrl: z.string().optional(),
    categoryId: z.string().min(1, "Choose a category"),
    difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"], {
      message: "Choose a difficulty",
    }),
    isFree: z.boolean(),
    priceRupees: z.coerce.number().optional(),
  })
  .refine(
    (data) =>
      data.isFree ||
      (data.priceRupees !== undefined && data.priceRupees >= 1),
    { message: "Enter a price of at least ₹1", path: ["priceRupees"] },
  );

export type DeckFormValues = z.infer<typeof deckSchema>;

export const flashcardSchema = z.object({
  front: z
    .string()
    .min(1, "Front cannot be empty")
    .max(5000, "Front must be at most 5000 characters long"),
  back: z
    .string()
    .min(1, "Back cannot be empty")
    .max(5000, "Back must be at most 5000 characters long"),
});

export type FlashcardFormValues = z.infer<typeof flashcardSchema>;
