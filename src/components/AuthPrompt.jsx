import { Link } from "react-router-dom";
import Button from "./Button";

function AuthPrompt() {
  return (
    <div className="h-screen flex flex-col justify-start items-center text-center px-4 mt-24">
      <div className="bg-white shadow-lg rounded-xl p-6 max-w-md w-full border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Giriş Yapmalısınız
        </h2>
        <p className="text-gray-600 mb-6">
          Devam etmek için lütfen hesabınızla giriş yapın.
        </p>

        <Link to="/login" className="w-full mb-4 block">
          <Button content="Giriş Yap" />
        </Link>

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

export default AuthPrompt;
