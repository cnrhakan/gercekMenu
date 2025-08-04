import supabase from "../supabaseClient";

export const getAllPostsWithAllProfiles = async () => {
  const { data, error } = await supabase
    .from("posts")
    .select("*,profiles(*)")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};
