import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { AuthContextProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Account from "./pages/Account";
import Classi from "./pages/Classi"
import ProtectedRoutes from "./components/ProtectedRoutes";

export default function App() {
  return (
    <>
      <AuthContextProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} /> {/*Route con le varie schede */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/account" element={<ProtectedRoutes><Account /></ProtectedRoutes>} />  {/*la pagina /account è accessibile solo se si è loggati*/}
          <Route path="/classi" element={<ProtectedRoutes><Classi /></ProtectedRoutes>} />  {/*la pagina /account è accessibile solo se si è loggati*/}
        </Routes>
      </AuthContextProvider>
    </>
  );
}
