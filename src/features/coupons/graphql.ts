import { gql } from "@apollo/client";

export type CouponDiscountType = "PERCENTAGE" | "FIXED_AMOUNT";

export interface Coupon {
  id: string;
  code: string;
  discountType: CouponDiscountType;
  discountValue: number;
  isActive: boolean;
  expiresAt: string | null;
  maxRedemptions: number | null;
  redemptionsCount: number;
  minOrderAmount: number | null;
  createdAt: string;
}

const COUPON_FIELDS = `
  id
  code
  discountType
  discountValue
  isActive
  expiresAt
  maxRedemptions
  redemptionsCount
  minOrderAmount
  createdAt
`;

export const ADMIN_COUPONS_QUERY = gql`
  query AdminCoupons {
    adminCoupons {
      ${COUPON_FIELDS}
    }
  }
`;

export interface AdminCouponsQueryData {
  adminCoupons: Coupon[];
}

export interface CouponInput {
  code: string;
  discountType: CouponDiscountType;
  discountValue: number;
  expiresAt?: string;
  maxRedemptions?: number;
  minOrderAmount?: number;
}

export const CREATE_COUPON_MUTATION = gql`
  mutation CreateCoupon($input: CreateCouponInput!) {
    createCoupon(input: $input) {
      ${COUPON_FIELDS}
    }
  }
`;

export interface CreateCouponMutationData {
  createCoupon: Coupon;
}

export interface CreateCouponMutationVars {
  input: CouponInput;
}

export const UPDATE_COUPON_MUTATION = gql`
  mutation UpdateCoupon($id: ID!, $input: UpdateCouponInput!) {
    updateCoupon(id: $id, input: $input) {
      ${COUPON_FIELDS}
    }
  }
`;

export interface UpdateCouponMutationData {
  updateCoupon: Coupon;
}

export interface UpdateCouponMutationVars {
  id: string;
  input: Partial<CouponInput> & { isActive?: boolean };
}
