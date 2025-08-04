import supabase from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import AreYouSureModal from "./AreYouSureModal";

function SignOut({ isSignOut, setIsSignOut }) {
  const navigate = useNavigate();
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigate("/login"); // çıkış sonrası login sayfasına yönlendirme
    } else {
      console.error("Çıkış hatası:", error.message);
    }
  };

  return (
    <AreYouSureModal
      question="Çıkış yapılsın mı?"
      onClick={handleSignOut}
      setState={setIsSignOut}
    />
  );
}

export default SignOut;
