import type { UserRole } from "@/features/auth/auth-slice";

const ROLE_LABELS: Record<UserRole, string> = {
  USER: "User",
  ADMIN: "Admin",
  SUPER_ADMIN: "Super Admin",
};

/** `UserRole` is a shouty enum string on the wire ("SUPER_ADMIN") — never render it as-is, non-technical users read the underscore as a typo. */
export function formatRole(role: UserRole): string {
  return ROLE_LABELS[role];
}
