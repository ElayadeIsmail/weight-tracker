import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/auth.store";
import { useEffect } from "react";

export function useAuthBootstrap() {
  const setSession = useAuthStore((s) => s.setSession);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      const { data } = await supabase.auth.getSession();

      if (mounted) {
        setSession(data.session);
      }
    }

    bootstrap();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => {
        if (mounted) {
          setSession(session);
        }
      }, 0);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [setSession]);
}
