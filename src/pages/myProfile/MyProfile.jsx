import supabase from "../../supabaseClient";
import { fetchAuthUserProfile } from "../../components/fetchAuthUserProfile";
import { getAllPostsWithAllProfiles } from "../../components/getAllPostsWithAllProfiles";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import ErrorMessage from "../../components/ErrorMessage";
import { fetchAllProfiles } from "../../components/fetchAllProfiles";
import LoadingAnimation from "../../components/LoadingAnimation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { FaPlus } from "react-icons/fa";
import PostCard from "../../components/PostCard";

function MyProfile() {
  const [timeoutReached, setTimeoutReached] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setTimeoutReached(true), 2000);
    return () => clearTimeout(timer);
  }, []);
  const [showModal, setShowModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const queryClient = useQueryClient();
  const { username } = useParams();
  const inputFileRef = useRef(null);

  const handleClick = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  // Supabase Storage'a dosya yükleme fonksiyonu
  const uploadAvatar = async (file) => {
    if (!file) throw new Error("Dosya seçilmedi");

    const fileExt = file.name.split(".").pop();
    const fileName = `${username}-${Date.now()}.${fileExt}`;

    const { data: avatarData, error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      alert("Avatar yüklenirken hata oluştu");
    }

    const { data: urlData, error: urlError } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    if (urlError) throw urlError;

    return urlData.publicUrl;
  };

  // profiles tablosuna avatar URL ekleme
  const addAvatarUrlToProfile = async (avatarUrl) => {
    const { error } = await supabase
      .from("profiles")
      .update({ avatar: avatarUrl })
      .eq("username", username);

    if (error) throw error;
  };

  // React Query mutasyonu
  const mutation = useMutation({
    mutationFn: async (file) => {
      const url = await uploadAvatar(file);
      await addAvatarUrlToProfile(url);
      return url;
    },
    onSuccess: (url) => {
      setAvatarUrl(url);
      alert("Avatar başarıyla yüklendi");
    },
    onError: (error) => {
      alert("Avatar yüklenirken hata oluştu" + error.message);
    },
  });

  // Dosya seçildiğinde yükleme işlemi başlar
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      mutation.mutate(file);
    }
  };
  const navigate = useNavigate();

  const {
    data: allProfilesData,
    error: allProfilesDataError,
    isLoading: allProfilesDataLoading,
  } = useQuery({
    queryKey: ["fetchAllProfiles"],
    queryFn: fetchAllProfiles,
  });

  const [sameUser, setSameUser] = useState(false);

  const {
    data: signedInProfileData,
    error: signedInProfileDataError,
    isLoading: signedInProfileDataLoading,
  } = useQuery({
    queryKey: ["fetchAuthUserProfile"],
    queryFn: fetchAuthUserProfile,
  });

  const {
    data: allPostsWithAllProfilesData,
    error: allPostsWithAllProfilesDataError,
    isLoading: allPostsWithAllProfilesDataLoading,
  } = useQuery({
    queryKey: ["allPostsWithAllProfilesData"],
    queryFn: getAllPostsWithAllProfiles,
  });

  // Silme mutasyonu
  const deleteMutation = useMutation({
    mutationFn: async (postId) => {
      const { data, error } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
    onError: (error) => {
      alert("Silme hatası: " + error.message);
    },
  });

  const [avatarUrl, setAvatarUrl] = useState(signedInProfileData?.avatar);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setSameUser(username === signedInProfileData?.username);
  }, [username, signedInProfileData]);

  useEffect(() => {
    setAvatarUrl(signedInProfileData?.avatar);
  }, [avatarUrl]);

  // Hata varsa

  const clickedPost = (post) => {
    /* console.log(post); */
    navigate(`/${post?.profiles?.username}/${post?.id}`);
  };

  const userPostsWithProfile = allPostsWithAllProfilesData?.filter(
    (post) => post.profiles?.username == username
  );

  const userProfile = allProfilesData?.find(
    (user) => user.username == username
  );
  if (allPostsWithAllProfilesDataError) {
    console.log(1);
    return <ErrorMessage errorMessage="Bir hata oluştu." />;
  }

  /* if (
    signedInProfileDataLoading 
  ) {
    return <LoadingAnimation loading={signedInProfileDataLoading} />;
  } */

  if (signedInProfileDataLoading && !timeoutReached) {
    return <LoadingAnimation loading={signedInProfileDataLoading} />;
  }

  if (
    allProfilesData &&
    !allProfilesData.find((p) => p?.username === username)
  ) {
    console.log(3);

    return <ErrorMessage errorMessage="Böyle bir kullanıcı bulunamadı" />;
  }

  return (
    <>
      <div className="flex items-start  px-6 gap-6 my-6">
        {/* Avatar ve artı ikonu */}
        <div className="relative w-28 h-28 flex-shrink-0">
          <div
            className="w-full h-full rounded-full bg-white flex items-center justify-center cursor-pointer overflow-hidden"
            title="Avatar seçmek için tıklayın"
          >
            <img
              src={userProfile?.avatar}
              alt="avatar"
              className="w-28 h-28 rounded-full object-cover hover:scale-105 transition"
            />
          </div>
          {sameUser && (
            <div
              onClick={handleClick}
              className="absolute -top-2 -right-5 bg-blue-600 text-white rounded-full p-1 w-5 h-5 flex items-center hover:scale-105 transition justify-center text-xs shadow cursor-pointer"
            >
              <FaPlus />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            ref={inputFileRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Fullname, username ve katılım tarihi */}
        <div className="flex flex-col justify-center gap-2 mt-2">
          <span className="font-semibold text-gray-700 hover:text-gray-900 transition text-2xl">
            {userProfile?.fullname}
          </span>
          <span className="text-gray-500 hover:text-gray-600 transition font-medium text-xl">
            @{userProfile?.username}
          </span>
        </div>
      </div>
      {userProfile?.created_at && (
        <span className="text-[16px] text-gray-400 px-6">
          {new Date(userProfile?.created_at).toLocaleDateString("tr-TR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}{" "}
          tarihinde katıldı.
        </span>
      )}
      {allPostsWithAllProfilesDataError && (
        <ErrorMessage errorMessage="Post bilgileri alınırken hata oluştu" />
      )}

      {/* {signedInProfileDataError && (
        <ErrorMessage errorMessage=" Profil bilgileri alınırken hata oluştu" />
      )} */}

      <h2 className="font-bold text-3xl px-6 mt-16 mb-24">
        {sameUser ? "Paylaşımların" : `${username} paylaşımları`}
      </h2>
      <div className="flex flex-wrap justify-center my-10 gap-6">
        {userPostsWithProfile?.length === 0 ? (
          <h3 className="text-3xl font-bold ">
            {sameUser
              ? "Hiç paylaşımın yok :("
              : "Bu kullanıcıya ait hiç paylaşım yok"}
          </h3>
        ) : (
          userPostsWithProfile?.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              sameUser={sameUser}
              clickedPost={clickedPost}
              setShowModal={setShowModal}
              showModal={showModal}
              setSelectedPostId={setSelectedPostId}
              selectedPostId={selectedPostId}
              deleteMutation={deleteMutation}
              size="sm"
            />
          ))
        )}
      </div>
    </>
  );
}

export default MyProfile;
