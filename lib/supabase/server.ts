import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";

export function supabaseServer() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const store = await cookies();
          return store.get(name)?.value;
        },
        async set(name: string, value: string, options: any) {
          try {
            const store = await cookies();
            store.set({ name, value, ...options });
          } catch (e) {
            // ignore for edge runtime
          }
        },
        async remove(name: string, options: any) {
          try {
            const store = await cookies();
            store.set({ name, value: "", ...options });
          } catch (e) {
            // ignore
          }
        },
      },
    }
  );
}
