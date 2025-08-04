import { FaTurkishLiraSign } from "react-icons/fa6";
import { useEffect, useState, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IoCloudUploadOutline } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";
import supabase from "../../supabaseClient";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { GetSignedInUser } from "../../components/GetSignedInUser";
import Button from "../../components/Button";
import AuthPrompt from "../../components/AuthPrompt";
import Input from "../../components/Input";
import LoadingAnimation from "../../components/LoadingAnimation";
import ValidateMessage from "../../components/ValidateMessage";

function CreatePost() {
  const [timeoutReached, setTimeoutReached] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setTimeoutReached(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const {
    data: getSignedInUserData,
    error: getSignedInUserDataError,
    isLoading: getSignedInInUserDataLoading,
  } = useQuery({
    queryKey: ["getSignedInUser"],
    queryFn: GetSignedInUser,
  });

  const [selected, setSelected] = useState();
  const [postInsert, setPostInsert] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const uploadFoodRef = useRef(null);
  const uploadMenuRef = useRef(null);

  const handleSubmit = async (values) => {
    const {
      uploadFood,
      uploadMenuOrReceipt,
      header,
      description,
      category,
      price,
      date,
      city,
      district,
      place,
      taste,
      service,
      f_p,
    } = values;

    // 1. Fotoğrafı yükle (Storage'a)
    const { data: foodImageData, error: foodImageError } =
      await supabase.storage
        .from("uploads") // bucket adı
        .upload(`food/${Date.now()}_${uploadFood.name}`, uploadFood);

    if (foodImageError) {
      console.error("Food image upload error:", foodImageError.message);
      return;
    }

    const foodImageUrl = supabase.storage
      .from("uploads")
      .getPublicUrl(foodImageData.path).data.publicUrl;

    // 2. Menü/fatura fotoğrafı yükle
    const { data: menuImageData, error: menuImageError } =
      await supabase.storage
        .from("uploads")
        .upload(
          `menu/${Date.now()}_${uploadMenuOrReceipt.name}`,
          uploadMenuOrReceipt
        );

    if (menuImageError) {
      console.error("Menu image upload error:", menuImageError.message);
      return;
    }

    const menuOrReceiptImageUrl = supabase.storage
      .from("uploads")
      .getPublicUrl(menuImageData.path).data.publicUrl;

    const { data, error } = await supabase.from("posts").insert([
      {
        header,
        description,
        category,
        price,
        date: selected,
        city: city.toLowerCase("tr"),
        district: district.toLowerCase("tr"),
        place: place.toLowerCase("tr"),
        taste,
        service,
        f_p,
        food_image_url: foodImageUrl,
        menu_receipt_image_url: menuOrReceiptImageUrl,
        created_at: new Date().toISOString(),
        profile_id: getSignedInUserData?.id,
        //
      },
    ]);

    if (error) {
      setPostInsert(false);
      console.error("Veritabanı insert hatası:", error.message);
    } else {
      setPostInsert(true);
    }
  };

  const FILE_SIZE = 5 * 1024 * 1024; // 3MB
  const SUPPORTED_FORMATS = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
  ];

  const formik = useFormik({
    initialValues: {
      uploadFood: null,
      uploadMenuOrReceipt: null,
      header: "",
      description: "",
      category: "",
      price: "",
      date: null,
      taste: "",
      service: "",
      f_p: "",
      city: "",
      district: "",
      place: "",
    },
    onSubmit: (values) => {
      handleSubmit(values);
      setFormSubmitted(true);
      /* console.log(values);
      console.log("Formik gönderildi!"); */
    },
    validationSchema: Yup.object({
      uploadFood: Yup.mixed()
        .required("Fotoğraf yüklenmeli")
        .test(
          "fileSize",
          "Dosya boyutu 5MB'ı geçemez",
          (value) => value && value.size <= FILE_SIZE
        )
        .test(
          "fileType",
          "Sadece .jpeg, .jpg, .png veya .webp dosyaları yükleyin",
          (value) => value && SUPPORTED_FORMATS.includes(value.type)
        ),

      uploadMenuOrReceipt: Yup.mixed()
        .required("Fotoğraf yüklenmeli")
        .test(
          "fileSize",
          "Dosya boyutu 5MB'ı geçemez",
          (value) => value && value.size <= FILE_SIZE
        )
        .test(
          "fileType",
          "Sadece .jpeg, .jpg, .png veya .webp dosyaları yükleyin",
          (value) => value && SUPPORTED_FORMATS.includes(value.type)
        ),

      header: Yup.string()
        .required("Başlık alanı boş bırakılamaz")
        .min(5, "Başlık en az 5 karakter olmalı")
        .max(100, "Başlık en fazla 100 karakter olabilir"),

      description: Yup.string().max(
        1200,
        "Açıklama en fazla 1200 karakter olabilir"
      ),

      category: Yup.string().required("Kategori alanı boş bırakılamaz"),

      price: Yup.number()
        .typeError("Geçerli bir sayı girilmeli")
        .required("Fiyat alanı boş bırakılamaz")
        .min(1, "Fiyat 1 TL'den az olamaz")
        .max(999999, "Fiyat çok yüksek,bu kadar harcama yapmış olamazsınız."),

      date: Yup.date().required("Tarih seçmeniz gerekiyor"),

      city: Yup.string()
        .required("İl alanı boş bırakılamaz")
        .min(3, "İl en az 3 karakter içermeli")
        .max(14, "İl en fazla 14 karakter içermeli(bkz:Afyonkarahisar)"),
      district: Yup.string()
        .required("İlçe alanı boş bırakılamaz")
        .min(2, "İlçe en az 2 karakter içermeli(bkz:Of")
        .max(16, "İlçe en fazla 16 karakter içermeli(bkz:Mustafakemalpaşa)"),
      place: Yup.string()
        .required("Yer alanı boş bırakılamaz")
        .min(3, "Yer en az 3 karakter içermeli")
        .max(75, "Yer en fazla 75 karakter içermeli"),

      taste: Yup.number()
        .typeError("Geçerli bir sayı girilmeli")
        .required("Lezzet alanı boş bırakılamaz")
        .min(1, "En az 1 olmalı")
        .max(10, "En fazla 10 olabilir"),

      service: Yup.number()
        .typeError("Geçerli bir sayı girilmeli")
        .required("Servis alanı boş bırakılamaz")
        .min(1, "En az 1 olmalı")
        .max(10, "En fazla 10 olabilir"),

      f_p: Yup.number()
        .typeError("Geçerli bir sayı girilmeli")
        .required("Fiyat/performans alanı boş bırakılamaz")
        .min(1, "En az 1 olmalı")
        .max(10, "En fazla 10 olabilir"),
    }),
  });

  const removeUploadFood = () => {
    formik.setFieldValue("uploadFood", null);
    if (uploadFoodRef.current) uploadFoodRef.current.value = "";
  };

  const removeUploadMenu = () => {
    formik.setFieldValue("uploadMenuOrReceipt", null);
    if (uploadMenuRef.current) uploadMenuRef.current.value = "";
  };

  useEffect(() => {
    const calendar = document.querySelector("calendar-date");
    calendar?.addEventListener("change", (e) => {
      document.getElementById("cally1").innerText = e.target.value;
    });
  }, []);

  useEffect(() => {
    if (postInsert) {
      const timer = setTimeout(() => {
        setPostInsert(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [postInsert]);

  if (getSignedInInUserDataLoading && !timeoutReached) {
    return <LoadingAnimation loading={true} />;
  }
  if (!getSignedInUserData) {
    return <AuthPrompt />;
  }

  return (
    <>
      <form
        onSubmit={formik.handleSubmit}
        action=""
        className="w-full my-8 max-w-xl mx-auto p-8 bg-white border border-gray-200 rounded-2xl shadow-lg space-y-6"
      >
        {/* DOSYA YÜKLEME */}
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          id="uploadFood"
          name="uploadFood"
          className="hidden"
          ref={uploadFoodRef}
          onChange={(e) => {
            const file = e.currentTarget.files[0];
            formik.setFieldValue("uploadFood", file);
          }}
        />
        {formik.values.uploadFood ? (
          <div className="cursor-pointer flex flex-col items-center justify-center h-56 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 text-gray-700 px-4 py-2 gap-4 hover:bg-gray-100 transition">
            <img
              src={URL.createObjectURL(formik.values.uploadFood)}
              alt="Uploaded Food"
              className="border border-gray-300 rounded-xl bg-neutral-200 h-32 w-32 object-cover"
            />
            <div className="flex justify-center gap-2">
              <button
                type="button"
                className="flex items-center text-md text-gray-700 hover:text-white rounded-md px-3 py-2 bg-gray-400 hover:bg-blue-600 transition cursor-pointer"
                onClick={removeUploadFood}
              >
                Remove image
              </button>
              <label
                htmlFor="uploadFood"
                className="flex items-center text-md text-gray-700 rounded-md px-3 py-1 bg-gray-400 transition cursor-pointer hover:bg-blue-600 hover:text-white"
              >
                Change image
              </label>
            </div>
          </div>
        ) : (
          <label
            htmlFor="uploadFood"
            className="cursor-pointer flex flex-col items-center justify-center h-56 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 text-gray-700 px-4 py-2 gap-4 hover:bg-gray-100 transition"
          >
            <IoCloudUploadOutline className="w-16 h-16" />
            <p className="text-base text-center">
              Yemek veya gıda fotoğrafı yükle (Max 5MB ve png, jpeg, jpg, webp)
            </p>
          </label>
        )}
        {formik.errors.uploadFood && formik.touched.uploadFood && (
          <ValidateMessage message={formik.errors.uploadFood} />
        )}
        {/* uploadMenuOrReceipt */}
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          id="uploadMenuOrReceipt"
          name="uploadMenuOrReceipt"
          className="hidden"
          ref={uploadMenuRef}
          onChange={(e) => {
            const file = e.currentTarget.files[0];
            formik.setFieldValue("uploadMenuOrReceipt", file);
          }}
        />
        {formik.values.uploadMenuOrReceipt ? (
          <div className="cursor-pointer flex flex-col items-center justify-center h-56 border-2 border-dashed border-purple-300 rounded-xl bg-purple-50 text-gray-700 px-4 py-2 gap-4 hover:bg-purple-100 transition">
            <img
              src={URL.createObjectURL(formik.values.uploadMenuOrReceipt)}
              alt="Uploaded Menu/Receipt"
              className="border border-gray-300 rounded-xl bg-neutral-200 h-32 w-32 object-cover"
            />
            <div className="flex justify-center gap-2">
              <button
                type="button"
                className="flex items-center text-md text-gray-700 hover:text-white rounded-md px-3 py-1 bg-gray-400 hover:bg-purple-700 transition cursor-pointer"
                onClick={removeUploadMenu}
              >
                Remove image
              </button>
              <label
                htmlFor="uploadMenuOrReceipt"
                className="flex items-center text-md text-gray-700 rounded-md px-3 py-2 bg-gray-400 transition cursor-pointer hover:bg-purple-700 hover:text-white"
              >
                Change image
              </label>
            </div>
          </div>
        ) : (
          <label
            htmlFor="uploadMenuOrReceipt"
            className="cursor-pointer flex flex-col items-center justify-center h-56 border-2 border-dashed border-purple-300 rounded-xl bg-purple-50 text-gray-700 px-4 py-2 gap-4 hover:bg-purple-100 transition"
          >
            <IoCloudUploadOutline className="w-16 h-16" />
            <p className="text-base text-center">
              Menünün ya da fişin fotoğrafını yükle (Max 5MB ve png, jpeg, jpg,
              webp)
            </p>
          </label>
        )}
        {formik.errors.uploadMenuOrReceipt &&
          formik.touched.uploadMenuOrReceipt && (
            <ValidateMessage message={formik.errors.uploadMenuOrReceipt} />
          )}
        {/* BAŞLIK */}
        <input
          name="header"
          type="text"
          placeholder="Başlık"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={formik.values.header}
          onChange={formik.handleChange}
        />
        {formik.errors.header && formik.touched.header && (
          <ValidateMessage message={formik.errors.header} />
        )}
        {/* AÇIKLAMA */}
        <textarea
          rows={8}
          name="description"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Açıklama"
          value={formik.values.description}
          onChange={formik.handleChange}
        ></textarea>
        {formik.errors.description && formik.touched.description && (
          <ValidateMessage message={formik.errors.description} />
        )}
        {/* FİYAT */}
        <div className="relative">
          <input
            name="price"
            type="number"
            className="w-full pl-8 px-4 py-2 border border-gray-300 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Fiyat"
            value={formik.values.price}
            onChange={formik.handleChange}
          />
          <FaTurkishLiraSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
        {formik.errors.price && formik.touched.price && (
          <ValidateMessage message={formik.errors.price} />
        )}
        {/* KATEGORİ */}
        <div className="flex flex-col gap-3">
          <p className="font-bold text-gray-700 ">Kategori</p>
          <div className="flex items-center gap-2">
            <input
              name="category"
              type="radio"
              id="restoran"
              className="radio accent-blue-600"
              value="Restoran"
              checked={formik.values.category === "Restoran"}
              onChange={formik.handleChange}
            />
            <label htmlFor="restoran" className="text-gray-700">
              Restoran
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="kafe"
              name="category"
              className="radio accent-blue-600"
              value="Kafe"
              checked={formik.values.category === "Kafe"}
              onChange={formik.handleChange}
            />
            <label htmlFor="kafe" className="text-gray-700">
              Kafe
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="marketvegida"
              name="category"
              className="radio accent-blue-600"
              value="Market ve gıda"
              checked={formik.values.category === "Market ve gıda"}
              onChange={formik.handleChange}
            />
            <label htmlFor="marketvegida" className="text-gray-700">
              Market ve gıda ürünleri
            </label>
          </div>
        </div>
        {formik.errors.category && formik.touched.category && (
          <ValidateMessage message={formik.errors.category} />
        )}

        {/* KONUM */}
        <div className="flex flex-col md:flex-row justify-between gap-3">
          <div className="w-full md:w-1/3 flex flex-col gap-4">
            <Input
              name="city"
              type="text"
              placeholder="İl"
              value={formik.values.city}
              onChange={formik.handleChange}
            />
            {formik.errors.city && formik.touched.city && (
              <ValidateMessage message={formik.errors.city} />
            )}
          </div>
          <div className="w-full md:w-1/3 flex flex-col gap-4">
            <Input
              name="district"
              type="text"
              placeholder="İlçe"
              value={formik.values.district}
              onChange={formik.handleChange}
            />

            {formik.errors.district && formik.touched.district && (
              <ValidateMessage message={formik.errors.district} />
            )}
          </div>
          <div className="w-full md:w-1/3 flex flex-col gap-4">
            <Input
              name="place"
              type="text"
              placeholder="Yer"
              value={formik.values.place}
              onChange={formik.handleChange}
            />

            {formik.errors.place && formik.touched.place && (
              <ValidateMessage message={formik.errors.place} />
            )}
          </div>
        </div>
        {/* TARİH */}
        <p className="font-bold text-gray-700 mt-3">Gidilen/alınan tarih</p>
        <DayPicker
          mode="single"
          selected={selected}
          onSelect={(date) => {
            setSelected(date);
            formik.setFieldValue("date", date);
          }}
        />
        {formik.touched.date && formik.errors.date && (
          <ValidateMessage message={formik.errors.date} />
        )}

        {/* PUANLAMA */}
        <div className="flex flex-col md:flex-row justify-between gap-3">
          <div className="w-full md:w-1/3 flex flex-col gap-4">
            <Input
              name="taste"
              type="number"
              placeholder="Lezzet"
              value={formik.values.taste}
              onChange={formik.handleChange}
            />
            {formik.errors.taste && formik.touched.taste && (
              <ValidateMessage message={formik.errors.taste} />
            )}
          </div>
          <div className="w-full md:w-1/3 flex flex-col gap-4">
            <Input
              name="service"
              type="number"
              placeholder="Servis"
              value={formik.values.service}
              onChange={formik.handleChange}
            />

            {formik.errors.service && formik.touched.service && (
              <ValidateMessage message={formik.errors.service} />
            )}
          </div>
          <div className="w-full md:w-1/3 flex flex-col gap-4">
            <Input
              name="f_p"
              type="number"
              placeholder="F/P"
              value={formik.values.f_p}
              onChange={formik.handleChange}
            />

            {formik.errors.f_p && formik.touched.f_p && (
              <ValidateMessage message={formik.errors.f_p} />
            )}
          </div>
        </div>
        {/* PAYLAŞ */}

        <Button content="Paylaş" />
        {postInsert && (
          <div role="alert" className="alert alert-success w-3/4 mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Paylaşım oluşturuldu</span>
          </div>
        )}

        <div className="text-xs text-gray-500 text-left mt-2">
          F/P: Fiyat/Performans
        </div>
      </form>
    </>
  );
}

export default CreatePost;
