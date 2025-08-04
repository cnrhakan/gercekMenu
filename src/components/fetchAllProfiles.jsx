import supabase from "../supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const fetchAllProfiles = async () => {
  const { data, error } = await supabase.from("profiles").select("*");

  if (error) throw new Error("Kullanıcı bilgisi alınamadı");
  return data;
};
