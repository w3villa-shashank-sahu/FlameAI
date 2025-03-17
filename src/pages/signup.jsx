import { Flame } from "lucide-react";
import googleImg from "../image/google.png";
import { useNavigate } from "react-router-dom";
import { GridLoader } from "react-spinners";
import { Sun, Moon } from 'lucide-react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "../firebaseConfig";
import { MyRoutes } from "../backend/const";
import { useState, useEffect } from "react";

const SignupPage = () => {
  let navigate = useNavigate();
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("Error");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    localStorage.setItem('theme', isDarkMode ? 'light' : 'dark');
    setIsDarkMode(prevMode => !prevMode);
  };

  useEffect(() => {
    let savedTheme = localStorage.getItem("theme");
    if (savedTheme == undefined) {
      setIsDarkMode(
        'dark' === (window.matchMedia?.("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light")
      );
    } else {
      setIsDarkMode(savedTheme == 'dark');
    }
  }, []);

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      localStorage.setItem("token", result.user.accessToken);
      navigate(MyRoutes.home);
    } catch (error) {
      openModal("Error", "An unexpected error occurred. Please try again.", error);
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
        openModal("Invalid info", "Password must be at least 6 characters long.");
        return;
      }
      setIsLoading(true)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      localStorage.setItem("token", userCredential.user.accessToken);
      setIsLoading(false)
      openModal('Success', "Account created successfully! Please log in.");
    } catch (error) {
      openModal("Error", error.message || "An unexpected error occurred. Please try again.");
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Dark Mode Toggle */}
      <div className={`fixed top-4 right-4 z-10`}>
        <button
          onClick={toggleDarkMode}
          aria-label="Toggle Dark Mode"
          className="relative w-6 h-6"
        >
          <div className="relative w-6 h-6">
            <Moon
              className={`absolute inset-0 transition-all duration-300 ${isDarkMode ? "opacity-0 scale-90 rotate-90" : "opacity-100 scale-100 rotate-0"
                } ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
            />
            <Sun
              className={`absolute inset-0 transition-all duration-300 ${isDarkMode ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-90 -rotate-90"
                } ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
            />
          </div>
        </button>
      </div>

      {/* Main Container */}
      <div className={`flex items-center relative justify-center min-h-screen px-4 transition-all duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
        }`}>
        <div className={`w-full max-w-sm sm:max-w-md p-6 sm:p-8 rounded-xl shadow-md border transition-all duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
          <h2 className={`text-xl sm:text-2xl flex gap-7 flex-col justify-center font-semibold text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-800'
            }`}>
            <Flame size={100} className="self-center" color="#ffb300" />
            <div className={`text-xl sm:text-2xl flex justify-center font-bold text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Flame AI</div>
            Let's Get Started
          </h2>
          <p className={`text-center mt-1 sm:mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>Sign up to get started</p>

          {/* Google Signup Button */}
          <button
            className={`w-full flex items-center justify-center gap-2 py-2 sm:py-3 mt-4 border rounded-lg shadow-sm transition ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            onClick={handleGoogleSignup}
          >
            <img src={googleImg} className="h-6 w-6 mr-2" alt="Google" />
            <span className="font-medium text-sm sm:text-base">Sign up with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center my-4 sm:my-6">
            <div className={`flex-1 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}></div>
            <span className={`mx-2 sm:mx-3 text-xs sm:text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>OR</span>
            <div className={`flex-1 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}></div>
          </div>

          {/* Email & Password Inputs */}
          <form className="space-y-3">
            <input
              type="email"
              id="email"
              placeholder="Email"
              className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                }`}
            />
            <input
              type="password"
              id="password"
              placeholder="Password"
              className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                }`}
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
          <p className={`text-center text-xs sm:text-sm mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
            Already have an account? <a href={MyRoutes.login} className="text-blue-500 hover:underline">Log in</a>
          </p>
        </div>

        {/* Loading Overlay */}
        {isloading && (
          <div className="h-screen w-screen bg-[#0000008a] absolute z-5 flex justify-center items-center">
            <GridLoader color={'#fff'} />
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-5 flex items-center justify-center bg-[#00000088]">
          <div className={`p-6 rounded shadow-lg w-96 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            }`}>
            <h2 className="text-lg font-semibold">{modalTitle}</h2>
            <p className="mt-2">{modalMessage}</p>
            <button
              onClick={closeModal}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SignupPage;