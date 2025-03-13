import { Flame } from "lucide-react";
import googleImg from "../image/google.png";
import { useNavigate } from "react-router-dom";
import { GridLoader } from "react-spinners";
import {
  auth,
  googleProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "../firebaseConfig";
import { MyRoutes } from "../backend/const";
import { useState } from "react";

const SignupPage = () => {
  let navigate = useNavigate();
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("Error");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isloading, setIsLoading] = useState(false);

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      localStorage.setItem("token", result.user.accessToken);
      navigate(MyRoutes.home);
    } catch (error) {
      openModal("Error","An unexpected error occurred. Please try again.", error);
    }
  };

  function openModal(title, message) {
    setModalTitle(title);
    setModalMessage(message);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsLoading(false);
    setIsModalOpen(false);
  }

  async function handleSignup() {
    try {
      let email = document.getElementById("email").value;
      let password = document.getElementById("password").value;

      if (password.length < 6) {
        openModal("Invalid info","Password must be at least 6 characters long.");
        return;
      }
      setIsLoading(true)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      localStorage.setItem("token", userCredential.user.accessToken);
      setIsLoading(false)
      openModal('Success',"Account created successfully! Please log in.");
    } catch (error) {
      openModal("Error",error.message || "An unexpected error occurred. Please try again.");
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="flex items-center relative justify-center min-h-screen bg-gray-100 px-4">
        <div className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 bg-white rounded-xl shadow-md border border-gray-200">
          <h2 className="text-xl sm:text-2xl flex gap-7 flex-col justify-center font-semibold text-center text-gray-800">
            <Flame size={100} className="self-center" color="#ffb300"/> 
            Welcome Back
          </h2>
          <p className="text-gray-500 text-center mt-1 sm:mt-2 text-sm">Sign up to get started</p>

          {/* Google Signup Button */}
          <button
            className="w-full flex items-center justify-center gap-2 py-2 sm:py-3 mt-4 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-100 transition"
            onClick={handleGoogleSignup}
          >
            <img src={googleImg} className="h-6 w-6 mr-2" alt="Google" />
            <span className="font-medium text-sm sm:text-base">Sign up with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center my-4 sm:my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="mx-2 sm:mx-3 text-gray-400 text-xs sm:text-sm">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Email & Password Inputs */}
          <form className="space-y-3">
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
          </form>

          {/* Signup Button */}
          <button
            onClick={handleSignup}
            className="w-full bg-blue-500 text-white py-2 sm:py-3 rounded-lg shadow-md mt-4 font-medium text-sm sm:text-base hover:bg-blue-600 transition"
          >
            Sign Up
          </button>

          {/* Login Link */}
          <p className="text-center text-gray-500 text-xs sm:text-sm mt-4">
            Already have an account? <a href={MyRoutes.login} className="text-blue-500 hover:underline">Log in</a>
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
            <button onClick={closeModal} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SignupPage;
