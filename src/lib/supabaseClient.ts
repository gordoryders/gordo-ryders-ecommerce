import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wblhrsbqsnxfbjbluyvx.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_247FpzkxYwVZh49vbqiv-A_-yiY_And";

export const isSupabaseConfigured = (): boolean => {
  return (
    !!supabaseAnonKey &&
    supabaseAnonKey !== "tu_publishable_key_aqui" &&
    supabaseAnonKey.length > 20
  );
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const signInWithGoogle = async (redirectTo?: string) => {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const callbackUrl = redirectTo || `${origin}/auth/callback`;

  return await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: callbackUrl,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });
};

export const signOutUser = async () => {
  if (isSupabaseConfigured()) {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Error signing out:", err);
    }
  }
};
