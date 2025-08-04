import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useState } from "react";
import ValidateMessage from "../../components/ValidateMessage";

function SignUp() {
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState(null);
  const [usernameError, setUsernameError] = useState(null);

  const formik = useFormik({
    initialValues: {
      fullname: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      fullname: Yup.string().required("Ad soyad alanı boş bırakılamaz."),
      username: Yup.string()
        .required("Kullanıcı adı alanı boş bırakılamaz.")
        .min(3, "Kullanıcı adı en az 3 karakter içermelidir.")
        .max(40, "Kullanıcı adı en fazla 40 karakter içermelidir."),
      email: Yup.string()
        .email("Geçerli bir email adresi giriniz.")
        .required("E-posta alanı boş bırakılamaz."),
      password: Yup.string()
        .required("Şifre alanı boş bırakılamaz.")
        .min(8, "Şifre en az 8 karakter içermelidir."),
      confirmPassword: Yup.string()
        .required("Şifre (tekrar) alanı boş bırakılamaz.")
        .oneOf([Yup.ref("password")], "Şifreler eşleşmiyor."),
    }),
    onSubmit: async (values) => {
      const { email, password, username, fullname } = values;
      // Önce username kullanılabilir mi diye kontrol et
      const { data: existingUser } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username)
        .single();
      if (existingUser) {
        setUsernameError({ message: "Bu kullanıcı adı zaten alınmış." });
        return;
      } else {
        setUsernameError(null);
      }
      // 1. Kullanıcı kaydı (auth.users)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        setEmailError(error);
        console.error("Kayıt hatası:", error.message);
        return;
      } else {
        setEmailError(null);
      }
      // 2. profiles tablosuna ekleme
      const userId = data.user.id;
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: userId,
          username: username,
          fullname: fullname,
          email: email,
        },
      ]);
      if (profileError) {
        setUsernameError(profileError);
        console.error("Profil oluşturma hatası:", profileError.message);
      } else {
        setUsernameError(null);
        /* console.log("Profil başarıyla oluşturuldu"); */
        navigate("/home");
      }
    },
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sol: Sadece büyük logo */}
      <div className="flex md:hidden w-full items-center justify-center ">
        <img
          src="/gercekmenulogo.png"
          alt="Gerçek Menü Logo"
          className="w-[520px] max-w-full object-contain"
        />
      </div>
      <div className="hidden md:flex flex-1 items-center justify-center ">
        <img
          src="/gercekmenulogo.png"
          alt="Gerçek Menü Logo"
          className="w-[1040px] max-w-full object-contain "
        />
      </div>
      {/* Sağ: Form ve altındaki link */}
      <div className="flex flex-1 flex-col items-center justify-center mb-6">
        <form
          onSubmit={formik.handleSubmit}
          className="w-full max-w-md p-8 bg-white border border-gray-200 rounded-2xl shadow-lg space-y-4"
        >
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Kayıt Ol
          </h2>
          <Input
            name={"fullname"}
            type={"text"}
            placeholder={"Ad Soyad"}
            value={formik.values.fullname}
            onChange={formik.handleChange}
          />
          {formik.touched.fullname && formik.errors.fullname && (
            <ValidateMessage message={formik.errors.fullname} />
          )}
          <Input
            name={"username"}
            type={"text"}
            placeholder={"Kullanıcı adı"}
            value={formik.values.username}
            onChange={formik.handleChange}
          />
          {formik.touched.username && formik.errors.username && (
            <ValidateMessage message={formik.errors.username} />
          )}
          <Input
            name={"email"}
            type={""}
            placeholder={"E-posta adresi"}
            value={formik.values.email}
            onChange={formik.handleChange}
          />
          {formik.touched.email && formik.errors.email && (
            <ValidateMessage message={formik.errors.email} />
          )}
          <Input
            name={"password"}
            type={"password"}
            placeholder={"Şifre"}
            value={formik.values.password}
            onChange={formik.handleChange}
          />
          {formik.touched.password && formik.errors.password && (
            <ValidateMessage message={formik.errors.password} />
          )}
          <Input
            name={"confirmPassword"}
            type={"password"}
            placeholder={"Şifre (tekrar)"}
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <ValidateMessage message={formik.errors.confirmPassword} />
          )}
          {emailError ? (
            <ValidateMessage message="Bu email adresi zaten kullanılıyor,başka bir adres yazın." />
          ) : (
            ""
          )}
          {usernameError ? (
            <ValidateMessage message=" Bu kullanıcı adı zaten kullanılıyor,başka bir ad belirleyin." />
          ) : (
            ""
          )}
          <Button content="Kayıt ol" />
        </form>
        <div className="mt-6 text-gray-700 text-sm w-full max-w-md text-center">
          <span>Zaten hesabınız var mı? </span>
          <Link to="/login" className="text-blue-600 font-bold hover:underline">
            Giriş yap
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
