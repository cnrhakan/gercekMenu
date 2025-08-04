import "./App.css";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import SignUp from "./pages/signUp/SignUp.jsx";
import Home from "./pages/home/Home.jsx";
import Login from "./pages/login/Login.jsx";
import CreatePost from "./pages/createPost/CreatePost.jsx";
import AboutUs from "./pages/aboutUs/AboutUs.jsx";
import MyProfile from "./pages/myProfile/MyProfile.jsx";
import Container from "./components/Container.jsx";
import Navbar from "./components/Navbar.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PostDetail from "./pages/postDetail/PostDetail.jsx";
import ErrorMessage from "./components/ErrorMessage.jsx";

const queryClient = new QueryClient();

function App() {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/signup"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Container>
          {!shouldHideNavbar && <Navbar />}
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/home" element={<Home />} />
            <Route path="/:username" element={<MyProfile />} />
            <Route path="/profile" element={<MyProfile />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/:username/:postId" element={<PostDetail />} />
            <Route
              path="*"
              element={
                <ErrorMessage errorMessage="Böyle bir sayfa bulunamadı" />
              }
            />
          </Routes>
        </Container>
      </QueryClientProvider>
    </>
  );
}

export default App;
