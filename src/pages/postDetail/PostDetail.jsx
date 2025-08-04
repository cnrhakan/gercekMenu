import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../../supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { MdCategory, MdRoomService, MdStarRate } from "react-icons/md";
import { GiKnifeFork } from "react-icons/gi";
import { Link } from "react-router-dom";
import { CiCalendar } from "react-icons/ci";
import { MdOutlinePlace } from "react-icons/md";
import SimpleCarousel from "../../components/Carousel";
import PostCard from "../../components/PostCard";
import HorizontalPostSlider from "../../components/HorizontalPostSlider";

function PostDetail() {
  const navigate = useNavigate();
  const { username, postId } = useParams();
  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  const {
    data: post,
    error: postDetailError,
    isLoading: postDetailLoading,
  } = useQuery({
    queryKey: ["postDetail", username, postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*, profiles(username, fullname,avatar)")
        .eq("id", postId)
        .eq("profiles.username", username)
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const { data: similarPosts } = useQuery({
    queryKey: ["similarPosts", post?.place, post?.district, post?.city],
    enabled: !!post, // post yüklendiyse bu sorgu aktif olur
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*, profiles(username, fullname, avatar)")
        .or(
          `place.ilike.%${post.place}%,district.ilike.%${post.district}%,city.ilike.%${post.city}%`
        )
        .neq("id", post.id)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data;
    },
  });
  /* console.log("similarPosts", similarPosts); */

  // Slider images array
  const images = post
    ? [
        {
          src: post.food_image_url,
          alt: "Yemek görseli",
        },
        {
          src: post.menu_receipt_image_url,
          alt: "Fiş görseli",
        },
      ]
    : [];

  const clickedPost = (post) => {
    console.log(post);
    return navigate(`/${post?.profiles.username}/${post?.id}`);
  };

  useEffect(() => {
    window.scrollTo(0, 90);
  }, [postId]);

  return (
    <>
      {postDetailError && (
        <div className="h-screen flex justify-center items-center px-4 mt-24">
          <p className="text-3xl font-bold text-red-600 text-center">
            Paylaşım yüklenirken hata oluştu: {postDetailError.message}
          </p>
        </div>
      )}
      {postDetailLoading && (
        <div className="h-screen flex justify-center items-center px-4 mt-24">
          <span className="loading loading-spinner text-info loading-xl"></span>
        </div>
      )}

      {post && (
        <div className="max-w-3xl w-full mx-auto mt-8 mb-24 flex flex-col gap-6 px-2 md:px-0">
          <h2 className="text-2xl font-bold text-gray-800  mb-2 cursor-pointer hover:text-blue-600 transition">
            {post.header}
          </h2>

          <div className="flex items-center gap-4 mb-2 flex-wrap">
            <Link to={`/${username}`} className="flex items-center gap-2">
              <img
                src={post?.profiles?.avatar}
                alt="Kullanıcı avatarı"
                className="w-16 h-16 object-cover rounded-full border border-gray-200 shadow-sm"
              />
              <div className="flex flex-col justify-between gap-1">
                <p className="font-medium text-gray-700 hover:text-gray-900 transition cursor-pointer">
                  {post?.profiles.fullname}
                </p>
                <p className="text-gray-500 hover:text-gray-600">
                  @{post?.profiles.username}
                </p>
              </div>
            </Link>
          </div>
          <SimpleCarousel
            images={images}
            linkFood={post?.food_image_url}
            linkMenuOrReceipt={post.menu_receipt_image_url}
          />
          <div className="flex flex-col gap-1 mb-2 ml-1 pl-1">
            <div className="flex items-center gap-1">
              <MdOutlinePlace className="w-4 h-4" />
              <span className="text-md">{capitalize(post?.city)}, </span>
              <span className="text-md">{capitalize(post?.district)}, </span>
              <span className="text-md">{capitalize(post?.place)}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <CiCalendar className="w-4 h-4 -me-1 text-gray-400" />
              <span className="text-xs text-gray-400">
                {new Date(post.date).toLocaleDateString("tr-TR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
          <p className="text-gray-700 text-base mb-2 whitespace-pre-line">
            {post?.description}
          </p>

          <div className="flex flex-wrap gap-6 text-base text-gray-700 justify-center mb-2">
            <span className="flex items-center gap-1 font-semibold text-xl">
              <FaRegMoneyBillAlt className="w-5 h-5 text-green-600" />
              {post?.price}₺
            </span>
            <span className="flex items-center gap-1 font-semibold text-xl">
              <MdCategory className="w-5 h-5 text-blue-600" />
              {post?.category}
            </span>
          </div>
          <div className="flex flex-wrap gap-6 text-base text-gray-600 justify-center">
            <span className="flex items-center gap-1 text-[18px]">
              <GiKnifeFork className="w-5 h-5 text-orange-500" />
              Lezzet: {post?.taste}
            </span>
            <span className="flex items-center gap-1 text-[18px]">
              <MdRoomService className="w-5 h-5 text-purple-500" />
              Servis: {post?.service}
            </span>
            <span className="flex items-center gap-1 text-[18px]">
              <MdStarRate className="w-5 h-5 text-yellow-500" />
              F/P: {post?.f_p}
            </span>
          </div>
          <h2 className="text-2xl font-bold mt-12 mb-16">
            Bu civardaki benzer paylaşımlar
          </h2>
          {similarPosts?.length > 0 ? (
            <HorizontalPostSlider
              posts={similarPosts}
              clickedPost={clickedPost}
            />
          ) : (
            <h3 className="text-xl font-bold text-center">
              Benzer bir paylaşım bulunamadı
            </h3>
          )}
        </div>
      )}
    </>
  );
}

export default PostDetail;
