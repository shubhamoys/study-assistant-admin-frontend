"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@apollo/client/react";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { formatPrice } from "@/lib/format-price";
import {
  ADMIN_COUPONS_QUERY,
  CREATE_COUPON_MUTATION,
  UPDATE_COUPON_MUTATION,
  type AdminCouponsQueryData,
  type Coupon,
  type CreateCouponMutationData,
  type CreateCouponMutationVars,
  type CouponInput,
  type UpdateCouponMutationData,
  type UpdateCouponMutationVars,
} from "../graphql";
import { couponSchema, type CouponFormValues } from "../schemas";
import styles from "./coupon-list.module.scss";

function getErrorMessage(error: unknown): string {
  if (CombinedGraphQLErrors.is(error)) {
    const code = error.errors[0]?.extensions?.code;
    if (code === "CONFLICT") return "A coupon with this code already exists.";
    if (code === "BAD_REQUEST")
      return error.errors[0]?.message ?? "Please check the highlighted fields.";
    if (code === "NOT_FOUND") return "This coupon no longer exists.";
  }
  return "Something went wrong. Please try again.";
}

/** Converts a CouponFormValues into the paise-denominated CouponInput the API expects — see schemas.ts's doc comment. */
function toInput(values: CouponFormValues): CouponInput {
  return {
    code: values.code,
    discountType: values.discountType,
    discountValue:
      values.discountType === "FIXED_AMOUNT"
        ? Math.round(values.discountValue * 100)
        : values.discountValue,
    expiresAt: values.expiresAt
      ? new Date(values.expiresAt).toISOString()
      : undefined,
    maxRedemptions: values.maxRedemptions,
    minOrderAmount:
      values.minOrderAmountRupees !== undefined
        ? Math.round(values.minOrderAmountRupees * 100)
        : undefined,
  };
}

function CouponForm({
  initial,
  submitLabel,
  showActiveToggle,
  onSubmit,
  onCancel,
}: {
  initial?: CouponFormValues;
  submitLabel: string;
  showActiveToggle?: boolean;
  onSubmit: (values: CouponFormValues) => Promise<void>;
  onCancel?: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: initial ?? {
      code: "",
      discountType: "PERCENTAGE",
      isActive: true,
    },
  });
  // A plain state mirror, not react-hook-form's watch() — watch() returns a
  // function React Compiler can't safely memoize (see the lint warning it
  // otherwise trips), and this only ever needs to flip one field's label.
  const [discountType, setDiscountType] = useState(
    initial?.discountType ?? "PERCENTAGE",
  );
  const codeField = register("code");
  const discountTypeField = register("discountType");

  return (
    <form
      className={styles.form}
      onSubmit={(event) => void handleSubmit(onSubmit)(event)}
      noValidate
    >
      <div className={styles.field}>
        <label className={styles.label}>Code</label>
        <Input
          aria-invalid={Boolean(errors.code)}
          {...codeField}
          onChange={(event) => {
            event.target.value = event.target.value.toUpperCase();
            void codeField.onChange(event);
          }}
        />
        {errors.code && (
          <span className={styles.fieldError}>{errors.code.message}</span>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Discount type</label>
        <Select
          {...discountTypeField}
          onChange={(event) => {
            void discountTypeField.onChange(event);
            setDiscountType(event.target.value as CouponFormValues["discountType"]);
          }}
        >
          <option value="PERCENTAGE">Percentage</option>
          <option value="FIXED_AMOUNT">Fixed amount</option>
        </Select>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>
          {discountType === "FIXED_AMOUNT"
            ? "Discount amount (₹)"
            : "Discount percentage (1-100)"}
        </label>
        <Input
          type="number"
          min={1}
          aria-invalid={Boolean(errors.discountValue)}
          {...register("discountValue")}
        />
        {errors.discountValue && (
          <span className={styles.fieldError}>
            {errors.discountValue.message}
          </span>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Expires on (optional)</label>
        <Input type="date" {...register("expiresAt")} />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Max total redemptions (optional)</label>
        <Input
          type="number"
          min={1}
          aria-invalid={Boolean(errors.maxRedemptions)}
          {...register("maxRedemptions")}
        />
        {errors.maxRedemptions && (
          <span className={styles.fieldError}>
            {errors.maxRedemptions.message}
          </span>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Minimum order (₹, optional)</label>
        <Input
          type="number"
          min={0}
          aria-invalid={Boolean(errors.minOrderAmountRupees)}
          {...register("minOrderAmountRupees")}
        />
        {errors.minOrderAmountRupees && (
          <span className={styles.fieldError}>
            {errors.minOrderAmountRupees.message}
          </span>
        )}
      </div>

      {showActiveToggle && (
        <label className={styles.checkboxField}>
          <input type="checkbox" {...register("isActive")} />
          Active
        </label>
      )}

      <div className={styles.formActions}>
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

export function CouponList() {
  const { data, loading, error, refetch } =
    useQuery<AdminCouponsQueryData>(ADMIN_COUPONS_QUERY);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const [createCoupon] = useMutation<
    CreateCouponMutationData,
    CreateCouponMutationVars
  >(CREATE_COUPON_MUTATION);
  const [updateCoupon] = useMutation<
    UpdateCouponMutationData,
    UpdateCouponMutationVars
  >(UPDATE_COUPON_MUTATION);

  async function handleCreate(values: CouponFormValues) {
    setMutationError(null);
    try {
      await createCoupon({ variables: { input: toInput(values) } });
      setShowCreate(false);
      await refetch();
    } catch (mutationErr) {
      setMutationError(getErrorMessage(mutationErr));
    }
  }

  async function handleUpdate(id: string, values: CouponFormValues) {
    setMutationError(null);
    try {
      await updateCoupon({
        variables: { id, input: { ...toInput(values), isActive: values.isActive } },
      });
      setEditingId(null);
      await refetch();
    } catch (mutationErr) {
      setMutationError(getErrorMessage(mutationErr));
    }
  }

  const editingCoupon = data?.adminCoupons.find((c) => c.id === editingId);

  function toFormValues(coupon: Coupon): CouponFormValues {
    return {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue:
        coupon.discountType === "FIXED_AMOUNT"
          ? coupon.discountValue / 100
          : coupon.discountValue,
      isActive: coupon.isActive,
      expiresAt: coupon.expiresAt ? coupon.expiresAt.slice(0, 10) : undefined,
      maxRedemptions: coupon.maxRedemptions ?? undefined,
      minOrderAmountRupees:
        coupon.minOrderAmount !== null ? coupon.minOrderAmount / 100 : undefined,
    };
  }

  return (
    <div>
      <div className={styles.header}>
        <Button type="button" onClick={() => setShowCreate(true)}>
          New coupon
        </Button>
      </div>

      <Dialog
        open={showCreate}
        onOpenChange={(open) => {
          setShowCreate(open);
          if (open) setMutationError(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New coupon</DialogTitle>
          </DialogHeader>
          {mutationError && (
            <p className={styles.statusError}>{mutationError}</p>
          )}
          <CouponForm submitLabel="Create" onSubmit={handleCreate} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={editingId !== null}
        onOpenChange={(open) => {
          if (!open) setEditingId(null);
          else setMutationError(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit coupon</DialogTitle>
          </DialogHeader>
          {mutationError && (
            <p className={styles.statusError}>{mutationError}</p>
          )}
          {editingCoupon && (
            <CouponForm
              initial={toFormValues(editingCoupon)}
              submitLabel="Save"
              showActiveToggle
              onSubmit={(values) => handleUpdate(editingCoupon.id, values)}
              onCancel={() => setEditingId(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {mutationError && !showCreate && editingId === null && (
        <p className={styles.statusError}>{mutationError}</p>
      )}
      {loading && <p className={styles.status}>Loading coupons…</p>}
      {error && (
        <p className={styles.statusError}>
          Couldn&apos;t load coupons — is the backend running?
        </p>
      )}
      {data && data.adminCoupons.length === 0 && (
        <p className={styles.status}>No coupons yet.</p>
      )}

      <div className={styles.grid}>
        {data?.adminCoupons.map((coupon) => (
          <div key={coupon.id} className={`${styles.item} index-card`}>
            <div className={styles.itemBody}>
              <div className={styles.itemTopRow}>
                <h3 className={styles.itemCode}>{coupon.code}</h3>
                <span className={coupon.isActive ? "tag" : styles.inactiveTag}>
                  {coupon.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <span className={styles.itemDiscount}>
                {coupon.discountType === "PERCENTAGE"
                  ? `${coupon.discountValue}% off`
                  : `${formatPrice(coupon.discountValue)} off`}
              </span>
              <span className={styles.itemMeta}>
                {coupon.redemptionsCount} used
                {coupon.maxRedemptions !== null && ` / ${coupon.maxRedemptions}`}
              </span>
              {coupon.expiresAt && (
                <span className={styles.itemMeta}>
                  Expires {new Date(coupon.expiresAt).toLocaleDateString()}
                </span>
              )}
              {coupon.minOrderAmount !== null && (
                <span className={styles.itemMeta}>
                  Min order {formatPrice(coupon.minOrderAmount)}
                </span>
              )}
            </div>
            <div className={styles.itemActions}>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setEditingId(coupon.id)}
              >
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
