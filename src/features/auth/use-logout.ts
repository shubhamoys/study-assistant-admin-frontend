import { useMutation } from "@apollo/client/react";
import { useAppDispatch } from "@/lib/redux-hooks";
import { getRefreshToken } from "@/lib/auth-token";
import { clearCredentials } from "./auth-slice";
import {
  LOGOUT_MUTATION,
  type LogoutMutationData,
  type LogoutMutationVars,
} from "./graphql";

export function useLogout() {
  const dispatch = useAppDispatch();
  const [logoutMutation] = useMutation<
    LogoutMutationData,
    LogoutMutationVars
  >(LOGOUT_MUTATION);

  return async function logout() {
    const refreshToken = getRefreshToken();
    try {
      if (refreshToken) {
        await logoutMutation({ variables: { refreshToken } });
      }
    } finally {
      // Always clear local state, even if the server call failed (offline,
      // token already expired, etc.) — the user's intent to log out locally
      // still wins.
      dispatch(clearCredentials());
    }
  };
}
