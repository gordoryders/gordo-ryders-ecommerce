import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wblhrsbqsnxfbjbluyvx.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = (): boolean => {
  return (
    !!supabaseAnonKey &&
    supabaseAnonKey !== "tu_publishable_key_aqui" &&
    supabaseAnonKey.length > 20
  );
};

// Safe fallback client to avoid crashes if keys aren't set yet
export const supabase = createClient(
  supabaseUrl,
  isSupabaseConfigured() ? supabaseAnonKey : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy"
);

export const signInWithGoogle = async (redirectTo?: string) => {
  if (!isSupabaseConfigured()) {
    console.warn("Supabase Anon Key no configurada. Usa el modo simulado o ingresa tus llaves.");
    return { data: null, error: new Error("SUPABASE_KEY_MISSING") };
  }

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
