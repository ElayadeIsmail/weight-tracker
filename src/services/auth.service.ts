import { AUTH_REDIRECT_URI } from "@/lib/auth-redirect";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/auth.store";

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) throw error;

  // Write session before navigation so route guards don't bounce to /login
  // while onAuthStateChange is still deferred (setTimeout).
  useAuthStore.getState().setSession(data.session);
}

export async function signUp(
  email: string,
  password: string,
  displayName?: string,
) {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      emailRedirectTo: AUTH_REDIRECT_URI,
      data: {
        display_name: displayName?.trim(),
      },
    },
  });

  if (error) throw error;

  if (data.session) {
    useAuthStore.getState().setSession(data.session);
  }

  return {
    requiresEmailConfirmation: !data.session,
  };
}

export async function resendConfirmationEmail(email: string) {
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: email.trim(),
    options: {
      emailRedirectTo: AUTH_REDIRECT_URI,
    },
  });

  if (error) throw error;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    // Remote revoke can fail offline; still drop the local session.
    const { error: localError } = await supabase.auth.signOut({
      scope: "local",
    });
    if (localError) throw localError;
  }
}
