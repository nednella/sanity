import { useLocation, useNavigate } from "@tanstack/react-router";

export type LoginState = Record<string, never>;

/**
 * Opens and closes the login dialog through the history state, so the URL
 * stays clean and the back button closes the dialog.
 */
export function useLoginDialog() {
  const login = useLocation({ select: (location) => location.state.login });
  const navigate = useNavigate();

  function open() {
    return navigate({
      search: true,
      state: { login: {} },
      to: "."
    });
  }

  function close() {
    return navigate({
      replace: true,
      search: true,
      state: {},
      to: "."
    });
  }

  return {
    close,
    login,
    open
  };
}
