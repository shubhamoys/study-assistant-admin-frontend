import { z } from "zod";

// An empty <input type="number"> reaches react-hook-form as "", not
// undefined — z.coerce.number().optional() still runs "" through Number()
// (-> 0) rather than short-circuiting, since ZodOptional only skips on an
// actually-undefined value. This preprocesses "" (and null) to undefined
// first, so leaving an optional number field blank behaves as "not set"
// instead of silently coercing to 0 and then failing that field's own
// .min(...) bound with no visible error (neither field renders one below).
function optionalNumber(schema: z.ZodNumber) {
  return z.preprocess(
    (val) => (val === "" || val === null ? undefined : val),
    schema.optional(),
  );
}

// Mirrors CreateCouponInput/UpdateCouponInput. `discountValue` means a raw
// percentage (1-100) when discountType is PERCENTAGE, or whole rupees when
// FIXED_AMOUNT — CouponForm converts rupees to paise before submitting (the
// backend itself only ever stores/validates paise, unlike a fixed-unit field
// like Deck.price, since this one field's unit depends on discountType).
export const couponSchema = z
  .object({
    code: z
      .string()
      .min(3, "Code must be at least 3 characters")
      .max(30, "Code must be at most 30 characters"),
    discountType: z.enum(["PERCENTAGE", "FIXED_AMOUNT"]),
    discountValue: z.coerce.number().min(1, "Enter a value of at least 1"),
    isActive: z.boolean().optional(),
    expiresAt: z.string().optional(),
    maxRedemptions: optionalNumber(
      z.coerce.number().min(1, "Enter a value of at least 1"),
    ),
    minOrderAmountRupees: optionalNumber(
      z.coerce.number().min(0, "Enter a value of at least 0"),
    ),
  })
  .refine(
    (data) => data.discountType !== "PERCENTAGE" || data.discountValue <= 100,
    {
      message: "A percentage discount cannot exceed 100",
      path: ["discountValue"],
    },
  );

export type CouponFormValues = z.infer<typeof couponSchema>;
