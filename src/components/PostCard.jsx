import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlinePlace } from "react-icons/md";
import { CiCalendar } from "react-icons/ci";
import { FaRegMoneyBillAlt, FaSearch } from "react-icons/fa";
import { MdCategory, MdRoomService, MdStarRate } from "react-icons/md";
import { GiKnifeFork } from "react-icons/gi";
import { CiCircleRemove } from "react-icons/ci";
import AreYouSureModal from "./AreYouSureModal";

function PostCard({
  post,
  sameUser,
  setShowModal,
  showModal,
  setSelectedPostId,
  selectedPostId,
  deleteMutation,
  size,
  clickedPost,
}) {
  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  return (
    <div
      key={post?.id}
      className={`flex flex-col ${!showModal && "hover:scale-105"} ${
        size == "sm" ? "max-w-sm" : "max-w-2xl"
      } w-full 
         border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden  `}
    >
      <div
        className={`${
          size == "sm" ? "p-3 " : "p-6 gap-2"
        } flex flex-col bg-gray-100`}
      >
        <div
          className={`flex ${
            size == "sm" ? "justify-between" : ""
          } items-center `}
        >
          <h2
            className={`${
              size == "sm" ? "text-l" : "text-2xl"
            } font-bold text-gray-800  mb-2 cursor-pointer  hover:text-blue-600 transition`}
            onClick={() => {
              clickedPost(post);
            }}
          >
            {post?.header}
          </h2>
          {sameUser && (
            <button
              className="w-8 h-8 cursor-pointer hover:scale-105 transition duration-300"
              /* onClick={() => deleteMutation.mutate(post.id)} */
              onClick={() => {
                setShowModal(true);
                setSelectedPostId(post.id);
              }}
              disabled={deleteMutation.isLoading}
            >
              <CiCircleRemove className="w-full h-full" />
              {/* {deleteMutation.isLoading ? "Siliniyor..." : "Sil"} */}
            </button>
          )}
        </div>

        {showModal && (
          <AreYouSureModal
            question="Paylaşım silinsin mi?"
            onClick={() => {
              deleteMutation.mutate(selectedPostId);
              setShowModal(false);
            }}
            setState={setShowModal}
          />
        )}
        <div className="flex items-start justify-start gap-2 mb-2 flex-wrap">
          <Link
            to={`/${post?.profiles.username}`}
            className="flex items-start gap-2 cursor-pointer"
          >
            <img
              src={post?.profiles.avatar}
              alt="avatar"
              className={`${
                size == "sm" ? "w-12 h-12" : "w-16 h-16"
              } object-cover rounded-full border border-gray-200 shadow-sm`}
            />

            <div className="flex flex-col justify-center gap-1">
              <p
                className={`${
                  size == "sm" ? "text-sm" : "text-base"
                } text-gray-700 hover:text-gray-900 transition font-semibold`}
              >
                {post?.profiles.fullname}
              </p>
              <p
                className={`text-gray-500 ${
                  size == "sm" ? "text-xs" : "text-sm"
                } hover:text-gray-600 font-medium`}
              >
                @{post?.profiles.username}
              </p>
            </div>
          </Link>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <MdOutlinePlace
              className={`${size == "sm" ? "w-3 h-3" : "w-4 h-4"}`}
            />
            <span className={`${size == "sm" ? "text-xs" : "text-md"}`}>
              {capitalize(post?.city)},{" "}
            </span>
            <span className={`${size == "sm" ? "text-xs" : "text-md"}`}>
              {capitalize(post?.district)},{" "}
            </span>
            <span className={`${size == "sm" ? "text-xs" : "text-md"}`}>
              {capitalize(post?.place)}
            </span>
          </div>

          <div className={`flex gap-2 ${size == "lg" && "my-2"} items-center`}>
            <CiCalendar
              className={`-me-1 text-gray-400 ${
                size === "sm" ? "w-3 h-3" : "w-4 h-4"
              }`}
            />
            <span className="text-xs text-gray-400">
              {new Date(post.date).toLocaleDateString("tr-TR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-0 border-t border-b border-gray-100 bg-white">
        <div
          className="flex items-center justify-center cursor-pointer p-2 group relative overflow-hidden"
          onClick={() => {
            clickedPost(post);
          }}
        >
          <div
            className={`w-full ${
              size === "sm" ? "h-32" : "h-64"
            } bg-white rounded-xl border border-gray-200 shadow-sm flex items-center justify-center overflow-hidden`}
          >
            <img
              className={`w-full ${
                size === "sm" ? "h-32" : "h-64"
              } object-cover rounded-xl border border-gray-200 shadow-sm transform transition-transform duration-300 group-hover:scale-105`}
              src={post?.food_image_url}
              alt="Yemek görseli"
            />
          </div>
        </div>
        <div
          className="flex items-center justify-center cursor-pointer p-2 group relative overflow-hidden"
          onClick={() => {
            clickedPost(post);
          }}
        >
          <img
            className={`w-full ${
              size === "sm" ? "h-32" : "h-64"
            } object-cover rounded-xl border border-gray-200 shadow-sm transform transition-transform duration-300 group-hover:scale-105`}
            src={post?.menu_receipt_image_url}
            alt="Fiş görseli"
          />
        </div>
      </div>
      <div className={`${size == "sm" ? "p-3" : "p-6"}  flex flex-col gap-2 `}>
        <p
          className={`text-gray-700 text-center ${
            size === "sm"
              ? "text-sm line-clamp-2 min-h-[2.5rem]"
              : "text-base line-clamp-4 min-h-[4] mb-2"
          } `}
        >
          {post?.description}
        </p>
        <div
          className={`flex flex-wrap gap-6 text-base text-gray-700 justify-center ${
            size == "lg" && "mb-2"
          }`}
        >
          <span
            className={`flex items-center gap-1 ${
              size === "sm" ? "text-base" : "text-xl"
            } font-semibold`}
          >
            <FaRegMoneyBillAlt className="w-5 h-5 text-green-600" />
            {post?.price} ₺
          </span>
          <span
            className={`flex items-center gap-1 ${
              size === "sm" ? "text-base" : "text-xl"
            } font-semibold`}
          >
            <MdCategory className="w-5 h-5 text-blue-600" />
            {post?.category}
          </span>
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-gray-600 justify-center">
          <span
            className={`flex items-center gap-1 ${
              size === "sm" ? "text-sm" : "text-[18px]"
            }`}
          >
            <GiKnifeFork className="w-5 h-5 text-orange-500" />
            Lezzet: {post?.taste}
          </span>
          <span
            className={`flex items-center gap-1 ${
              size === "sm" ? "text-sm" : "text-[18px]"
            }`}
          >
            <MdRoomService className="w-5 h-5 text-purple-500" />
            Servis: {post?.service}
          </span>
          <span
            className={`flex items-center gap-1 ${
              size === "sm" ? "text-sm" : "text-[18px]"
            }`}
          >
            <MdStarRate className="w-5 h-5 text-yellow-500" />
            F/P: {post?.f_p}
          </span>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
