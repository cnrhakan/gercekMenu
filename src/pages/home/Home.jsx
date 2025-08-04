import { useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient";
import { useQuery } from "@tanstack/react-query";

import { getAllPostsWithAllProfiles } from "../../components/getAllPostsWithAllProfiles";

import LoadingAnimation from "../../components/LoadingAnimation";
import ErrorMessage from "../../components/ErrorMessage";

import PostCard from "../../components/PostCard";
function Home() {
  /* const chLimit = 250; */

  const {
    data: allPostsWithAllProfilesData,
    error: allPostsWithAllProfilesDataError,
    isLoading: allPostsWithAllProfilesDataLoading,
  } = useQuery({
    queryKey: ["getAllPostsWithAllProfiles"],
    queryFn: getAllPostsWithAllProfiles,
  });

  const navigate = useNavigate();

  const clickedPost = (post) => {
    /* console.log(post); */
    return navigate(`/${post?.profiles.username}/${post?.id}`);
  };

  return (
    <>
      {allPostsWithAllProfilesDataError && (
        <ErrorMessage errorMessage="Postlar yüklenirken hata oluştu" />
      )}
      <LoadingAnimation loading={allPostsWithAllProfilesDataLoading} />
      <div className="flex flex-wrap justify-center md:px-0 my-8 gap-12">
        {allPostsWithAllProfilesData &&
          allPostsWithAllProfilesData.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              sameUser={false}
              size="lg"
              clickedPost={clickedPost}
            />
          ))}
      </div>
    </>
  );
}
export default Home;
