// import { FcGoogle } from "react-icons/fc";
import { Flame } from "lucide-react";
import googleImg from "../image/google.png"
import { useNavigate } from "react-router-dom";
import { GridLoader } from "react-spinners";
import {
  auth,
  googleProvider,
  signInWithPopup,
  // createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "../firebaseConfig";
import { MyConst, MyRoutes } from "../backend/const";
import { useState } from "react";
// import ModalWithInput from "../components/inputModal";

const LoginPage = () => {
  let navigate = useNavigate()
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("Error");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isloading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      localStorage.setItem("token", result.user.accessToken);
      navigate(MyRoutes.home);
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        // Handle API error response
        const errorMessage = error.response.data?.error?.message || "An unknown error occurred";
        openModal(errorMessage);
      } else {
        openModal("An unexpected error occurred. Please try again.");
      }
    }
  };

  function openModal(title, message) {
    // console.log('opening modal');
    setModalTitle(title)
    setModalMessage(message);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsLoading(false);
    setIsModalOpen(false);
  }

  async function handleLogin() {
    try {
      let email = document.getElementById("email").value;
      let password = document.getElementById("password").value;

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        openModal("Invalid email address. Please enter a valid email.");
        return;
      }
      setIsLoading(true)
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      localStorage.setItem('token', userCredential.user.accessToken)
      navigate(MyRoutes.home)
    } catch (error) {
      
      if (error.message) {
        const errorMessage = error.message || "An unknown error occurred";
        openModal(errorMessage);
      } else {
        console.log('try again');        
        openModal('Error',"An unexpected error occurred. Please try again.");
      }
    }
  }

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 bg-white rounded-xl shadow-md border border-gray-200">
          <h2 className="text-xl sm:text-2xl flex gap-7 flex-col justify-center font-semibold text-center text-gray-800">
            <Flame size={100} className="self-center" color="#ffb300"/> 
            Welcome Back
          </h2>
          <p className="text-gray-500 text-center mt-1 sm:mt-2 text-sm">Sign in to continue</p>

          {/* Google Sign-In Button */}
          <button className="w-full flex items-center justify-center gap-2 py-2 sm:py-3 mt-4 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-100 transition"
          onClick={handleGoogleSignIn}>
            {/* <FcGoogle size={20} /> */}
            <img src={googleImg} className="h-6 w-6 mr-2" alt="" />
            <span className="font-medium text-sm sm:text-base">Sign in with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center my-4 sm:my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="mx-2 sm:mx-3 text-gray-400 text-xs sm:text-sm">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Email & Password Inputs */}
          <form className="space-y-3" onSubmit={handleLogin}>
            <input
              type="email"
              id="email"
              placeholder="Email"
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400 text-sm sm:text-base"
            />
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400 text-sm sm:text-base"
            />
            {/* Sign In Button */}
          </form>
            <button onClick={handleLogin} className="w-full bg-blue-500 text-white py-2 sm:py-3 rounded-lg shadow-md mt-4 font-medium text-sm sm:text-base hover:bg-blue-600 transition">
              Sign In
            </button>

          {/* Signup Link */}
          <p className="text-center text-gray-500 text-xs sm:text-sm mt-4">
            Don't have an account? <a href={MyRoutes.signup} className="text-blue-500 hover:underline">Sign up</a>
          </p>
        </div>
        {isloading && (
          <div className="h-screen w-screen bg-[#0000008a] absolute z-5 flex justify-center items-center">
            <GridLoader color={'#fff'}/>
          </div>
        )}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-5 flex items-center justify-center bg-[#00000088]">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-semibold">{modalTitle}</h2>
            <p className="mt-2">{modalMessage}</p>
            <button
              onClick={closeModal}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginPage;
