import supabase from "../supabaseClient";

export const GetSignedInUser = async () => {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    throw new Error("Kullanıcı oturumu bulunamadı");
  }

  return data.user;
};
