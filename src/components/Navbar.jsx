import { Link, useNavigate, useParams } from "react-router-dom";
import SignOut from "./SignOut";
import { useState } from "react";
import { fetchAuthUserProfile } from "./fetchAuthUserProfile";
import { useQuery } from "@tanstack/react-query";
import { GetSignedInUser } from "./GetSignedInUser";
import { HiMenu, HiX } from "react-icons/hi";
// hamburger ve kapama ikonları

const Navbar = () => {
  const navigate = useNavigate();
  const [isSignOut, setIsSignOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const {
    data: signedInUserData,
    isLoading: signedInUserLoading,
    isError,
    isSuccess,
    error: signedInUserError,
  } = useQuery({
    queryKey: ["signedInUser"],
    queryFn: GetSignedInUser,
    retry: false,
  });

  const {
    data: profile,
    error: profileError,
    isLoading: profileLoading,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchAuthUserProfile,
  });

  const handleSearch = (e) => {
    e.preventDefault(); // Formun sayfayı yenilemesini engeller
    if (searchInput.trim()) {
      navigate(`/${searchInput}`); // Boşlukları kırpar ve yönlendirir
    }
    setSearchInput("");
  };
  return (
    <nav className="w-full bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/home" className="cursor-pointer">
              <img
                src="/gercekmenulogo.png"
                alt="Logo"
                className="h-24 w-auto"
              />
            </Link>
          </div>

          <div
            className="lg:hidden px-6


          "
          >
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="cursor-pointer"
            >
              {mobileMenuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
            </button>
          </div>

          {/* Menü (Desktop) */}
          <div className="hidden lg:flex space-x-5">
            <ul className="flex gap-4 items-center">
              <li>
                <form onSubmit={handleSearch} className="relative w-40">
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Ara"
                    className="w-full pl-8 pr-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-0 appearance-none"
                    autoComplete="off"
                  />

                  {/* Büyüteç ikonu */}
                  <button
                    type="submit"
                    className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black focus:outline-none"
                  >
                    <svg
                      className="h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        fill="none"
                        stroke="currentColor"
                      >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                      </g>
                    </svg>
                  </button>
                </form>
              </li>
              <li>
                <Link
                  to="/home"
                  className="text-gray-700 hover:text-gray-900 transition"
                >
                  Anasayfa
                </Link>
              </li>
              <li>
                <Link
                  to="/create"
                  className="text-gray-700 hover:text-gray-900 transition"
                >
                  Paylaşım yap
                </Link>
              </li>
              {signedInUserData && (
                <li>
                  <Link
                    to={`/${profile?.username}`}
                    className="text-gray-700 hover:text-gray-900 transition"
                  >
                    Profil
                  </Link>
                </li>
              )}
              <li>
                <Link
                  to="/about"
                  className="text-gray-700 hover:text-gray-900 transition"
                >
                  Hakkımızda
                </Link>
              </li>
              <li className="pr-7">
                {signedInUserData ? (
                  <button
                    onClick={() => setIsSignOut(true)}
                    className="text-gray-700 hover:text-gray-900 transition cursor-pointer"
                  >
                    Çıkış Yap
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-gray-900 transition"
                  >
                    Giriş yap
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>

        {/* Menü (Mobil) */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4">
            <ul className="flex flex-col gap-4">
              <li className="mx-auto">
                <form onSubmit={handleSearch} className="relative w-40">
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Ara"
                    className="w-full pl-8 pr-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-0 appearance-none"
                    autoComplete="off"
                  />

                  {/* Büyüteç ikonu */}
                  <button
                    type="submit"
                    className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black focus:outline-none"
                  >
                    <svg
                      className="h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        fill="none"
                        stroke="currentColor"
                      >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                      </g>
                    </svg>
                  </button>
                </form>
              </li>
              <li className="mx-auto">
                <Link
                  to="/home"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-gray-900 transition  block"
                >
                  Anasayfa
                </Link>
              </li>
              <li className="mx-auto">
                <Link
                  to="/create"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-gray-900 transition block"
                >
                  Paylaşım yap
                </Link>
              </li>
              {signedInUserData && (
                <li className="mx-auto">
                  <Link
                    to={`/${profile?.username}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-700 hover:text-gray-900 transition block"
                  >
                    Profil
                  </Link>
                </li>
              )}
              <li className="mx-auto">
                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-gray-900 transition block"
                >
                  Hakkımızda
                </Link>
              </li>
              <li className="mx-auto">
                {signedInUserData ? (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsSignOut(true);
                    }}
                    className="text-gray-700 hover:text-gray-900 transition cursor-pointer"
                  >
                    Çıkış Yap
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-700 hover:text-gray-900 transition block"
                  >
                    Giriş yap
                  </Link>
                )}
              </li>
            </ul>
          </div>
        )}
      </div>
      {isSignOut && (
        <SignOut isSignOut={isSignOut} setIsSignOut={setIsSignOut} />
      )}
    </nav>
  );
};

export default Navbar;
