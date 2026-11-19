import { AuthForm } from "@/components/auth";
import { Screen, ScreenHeader } from "@/components/ui";
import { LoadingState } from "@/components/ui/loading-state";
import { signIn } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { Redirect, router } from "expo-router";

export default function LoginScreen() {
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
        eyebrow="Welcome back"
        title="Log in"
        description="Your weight history stays private to your account."
      />

      <AuthForm
        mode="login"
        onSubmit={async ({ email, password }) => {
          await signIn(email, password);
          router.replace("/");
        }}
        onSwitch={() => router.push("/signup")}
      />
    </Screen>
  );
}
