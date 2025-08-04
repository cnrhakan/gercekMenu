import supabase from "../supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const fetchAuthUserProfile = async () => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) throw new Error("Kullanıcı bilgisi alınamadı");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError) throw new Error(profileError.message);

  return profile;
};
