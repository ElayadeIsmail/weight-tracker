import { AuthForm } from "@/components/auth";
import { Screen, ScreenHeader } from "@/components/ui";
import { LoadingState } from "@/components/ui/loading-state";
import { signUp } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { Redirect, router } from "expo-router";

export default function SignupScreen() {
  const initialized = useAuthStore((s) => s.initialized);
  const session = useAuthStore((s) => s.session);

  if (!initialized) {
    return <LoadingState flex />;
  }

  if (session) {
    return <Redirect href="/" />;
  }

  return (
    <Screen>
      <ScreenHeader
        eyebrow="Get started"
        title="Sign up"
        description="Create an account to keep your weight history private."
      />

      <AuthForm
        mode="signup"
        onSubmit={async ({ email, password, displayName }) => {
          const { requiresEmailConfirmation } = await signUp(
            email,
            password,
            displayName,
          );

          if (requiresEmailConfirmation) {
            router.replace({
              pathname: "/verify",
              params: { email },
            });
            return;
          }

          router.replace("/");
        }}
        onSwitch={() => {
          if (router.canGoBack()) {
            router.back();
            return;
          }
          router.replace("/login");
        }}
      />
    </Screen>
  );
}
