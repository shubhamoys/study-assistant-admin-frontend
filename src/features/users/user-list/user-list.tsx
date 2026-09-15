"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useDebouncedValue } from "@/hooks/use-debounce";
import { useAuth } from "@/features/auth/use-auth";
import { formatRole } from "@/lib/format-role";
import { AddAdminForm } from "../add-admin-form/add-admin-form";
import {
  ADMIN_UPDATE_USER_ROLE_MUTATION,
  ADMIN_USERS_QUERY,
  type AdminUpdateUserRoleMutationData,
  type AdminUpdateUserRoleMutationVars,
  type AdminUsersQueryData,
  type AdminUsersQueryVars,
  type UserRole,
} from "../graphql";
import styles from "./user-list.module.scss";

const PAGE_SIZE = 20;

export function UserList() {
  const { user: currentUser, isSuperAdmin } = useAuth();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<UserRole | "">("");
  const [page, setPage] = useState(1);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const debouncedSearch = useDebouncedValue(search, 300);

  const { data, loading, error, refetch } = useQuery<
    AdminUsersQueryData,
    AdminUsersQueryVars
  >(ADMIN_USERS_QUERY, {
    variables: {
      search: debouncedSearch || undefined,
      role: role || undefined,
      page,
      limit: PAGE_SIZE,
    },
  });

  const [updateRole, { loading: updatingRole }] = useMutation<
    AdminUpdateUserRoleMutationData,
    AdminUpdateUserRoleMutationVars
  >(ADMIN_UPDATE_USER_ROLE_MUTATION);

  async function handleToggleRole(id: string, currentRole: UserRole) {
    const nextRole: UserRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    try {
      await updateRole({ variables: { id, role: nextRole } });
      await refetch();
    } catch {
      // No dedicated error banner for this — the row's role just won't
      // change, same low-stakes-retry treatment as other list actions.
    }
  }

  const userPage = data?.adminUsers;

  return (
    <div>
      <div className={styles.controls}>
        <Input
          type="search"
          placeholder="Search by email or name…"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          className={styles.search}
          aria-label="Search users"
        />
        <Select
          value={role}
          onChange={(event) => {
            setRole(event.target.value as UserRole | "");
            setPage(1);
          }}
          className={styles.roleFilter}
          aria-label="Filter by role"
        >
          <option value="">All roles</option>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
          <option value="SUPER_ADMIN">Super Admin</option>
        </Select>
        {isSuperAdmin && (
          <Button type="button" onClick={() => setShowAddAdmin(true)}>
            Add admin
          </Button>
        )}
      </div>

      {isSuperAdmin && (
        <Dialog open={showAddAdmin} onOpenChange={setShowAddAdmin}>
          <DialogContent>
            <AddAdminForm
              onCreated={() => {
                setShowAddAdmin(false);
                void refetch();
              }}
              onCancel={() => setShowAddAdmin(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {loading && <p className={styles.status}>Loading users…</p>}
      {error && (
        <p className={styles.statusError}>
          Couldn&apos;t load users. Please check your connection and try again.
        </p>
      )}

      {userPage && (
        <>
          <div className={`${styles.tableWrap} index-card`}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Verified</th>
                  <th>Joined</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {userPage.items.map((item) => {
                  const isSelf = item.id === currentUser?.id;
                  const isSuperAdminRow = item.role === "SUPER_ADMIN";
                  return (
                    <tr key={item.id}>
                      <td>{item.displayName ?? "—"}</td>
                      <td>{item.email}</td>
                      <td>
                        <span className="tag">{formatRole(item.role)}</span>
                      </td>
                      <td>{item.isEmailVerified ? "Yes" : "No"}</td>
                      <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td>
                        {isSuperAdmin && !isSuperAdminRow && (
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            disabled={updatingRole || isSelf}
                            title={
                              isSelf
                                ? "You can't change your own admin access"
                                : undefined
                            }
                            onClick={() =>
                              void handleToggleRole(item.id, item.role)
                            }
                          >
                            {item.role === "ADMIN" ? "Demote" : "Promote"}
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className={styles.pagination}>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={userPage.page <= 1}
              onClick={() => setPage((current) => current - 1)}
            >
              ← Previous
            </Button>
            <span className={styles.pageInfo}>
              Page {userPage.page} of {userPage.totalPages} (
              {userPage.totalCount}{" "}
              {userPage.totalCount === 1 ? "user" : "users"})
            </span>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={userPage.page >= userPage.totalPages}
              onClick={() => setPage((current) => current + 1)}
            >
              Next →
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
