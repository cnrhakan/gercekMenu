import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import supabase from "../../supabaseClient";
import Input from "../../components/Input";
import Button from "../../components/Button";
import ValidateMessage from "../../components/ValidateMessage";

function Login() {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("E-posta alanı boş bırakılamaz."),
      password: Yup.string().required("Şifre alanı boş bırakılamaz."),
    }),
    onSubmit: async (values) => {
      const { email, password } = values;

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoginError(true);
        console.error("Giriş hatası:", error.message);
      } else {
        setLoginError(false);
        navigate("/home"); // Giriş başarılıysa yönlendir
      }
    },
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Logo: Üstte (sm ve altı), solda (md ve üstü) */}
      <div className="flex md:hidden w-full items-center justify-center">
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
            Giriş Yap
          </h2>
          <Input
            name="email"
            type=""
            placeholder="E-posta adresi"
            value={formik.values.email}
            onChange={formik.handleChange}
          />
          {formik.touched.email && formik.errors.email && (
            <ValidateMessage message={formik.errors.email} />
          )}
          <Input
            name="password"
            type="password"
            placeholder="Şifre"
            value={formik.values.password}
            onChange={formik.handleChange}
          />
          {formik.touched.password && formik.errors.password && (
            <ValidateMessage message={formik.errors.password} />
          )}
          {loginError && (
            <p className="text-red-500 text-m text-left font-bold">
              E-posta adresi veya şifre hatalı.
            </p>
          )}
          <Button content="Giriş yap" />
        </form>
        <div className="mt-6 text-gray-700 text-sm w-full max-w-md text-center">
          <span>Hesabınız yok mu? </span>
          <Link
            to="/signup"
            className="text-blue-600 font-bold hover:underline"
          >
            Kayıt ol
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
