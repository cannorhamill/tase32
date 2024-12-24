import { supabase } from "./supabase";

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function setUserId(userId: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No user found" };

  const { data, error } = await supabase
    .from("users")
    .upsert({ id: user.id, user_id: userId })
    .select()
    .single();

  return { data, error };
}

export async function getUserId() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { data: null, error: "No user found" };

  const { data, error } = await supabase
    .from("users")
    .select("user_id")
    .eq("id", user.id)
    .single();

  return { data, error };
}
