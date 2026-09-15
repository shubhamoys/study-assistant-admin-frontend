import { z } from "zod";

// An empty <input type="number"> reaches react-hook-form as "", not
// undefined — z.coerce.number().optional() still runs "" through Number()
// (-> 0) rather than short-circuiting, since ZodOptional only skips on an
// actually-undefined value. This preprocesses "" (and null) to undefined
// first, so leaving an optional number field blank behaves as "not set"
// instead of silently coercing to 0 and then failing that field's own
// .min(...) bound with no visible error (neither field renders one below).
//
// z.preprocess's declared input type is always `unknown` (its ZodEffects
// wrapper doesn't carry the preprocess function's own type), which breaks
// @hookform/resolvers/zod's Resolver<TFieldValues> typing here since
// CouponForm's useForm<CouponFormValues> — matching this codebase's usual
// pattern of typing the form with the schema's *output* type — needs the
// resolver's input type to line up with that same output type. This only
// surfaces in `next build`'s type check, not `tsc --noEmit` run against
// this file alone. The cast is safe: at runtime react-hook-form only ever
// feeds this schema a raw DOM value, never relies on the declared input
// type, so unifying input/output here just fixes the resolver's typing.
function optionalNumber(schema: z.ZodNumber) {
  return z.preprocess(
    (val) => (val === "" || val === null ? undefined : val),
    schema.optional(),
  ) as unknown as z.ZodType<number | undefined, z.ZodTypeDef, number | undefined>;
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
