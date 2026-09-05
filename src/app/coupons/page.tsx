"use client";

import { AdminShell } from "@/components/admin-shell/admin-shell";
import { useRequireAdmin } from "@/features/auth/use-require-admin";
import { CouponList } from "@/features/coupons/coupon-list/coupon-list";
import styles from "./coupons.module.scss";

export default function CouponsPage() {
  const { isReady } = useRequireAdmin();

  if (!isReady) {
    return null;
  }

  return (
    <AdminShell>
      <h1 className={styles.heading}>Coupons</h1>
      <p className={styles.subheading}>
        Coupons are never deleted, only deactivated — an order that used one
        keeps a permanent record of the code and discount applied.
      </p>
      <CouponList />
    </AdminShell>
  );
}
