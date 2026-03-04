import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorMessages from "./common/ErrorMessages";
import FarishtaaLogo from "../logo/FarishtaaLogo";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/slices/authSlice";
import { useTranslation } from "react-i18next";

const Login = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const emailref = useRef();
  const passwordref = useRef();
  const {token}=useSelector(state=>state.auth);
  const { t } = useTranslation();
  const handleSubmit = async (e) => {
    e.preventDefault();
   
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
         "Authorization": `Bearer ${token}`,
         "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email : emailref.current.value,
          password : passwordref.current.value,
        }),
      });

      if (res.status === 200) {
        const data = await res.json();
        dispatch(login(data));
        if (data.userType === 'Doctor') {
          navigate('/doctor-dashboard');
        } else if (data.userType === 'Hospital') {
          navigate('/hospital-dashboard');
        } else {
          navigate('/');
        }
        return;
      }

      if (res.status === 401 || res.status === 500) {
        const data = await res.json();
        setErrors(data.errorMessages);
        return;
      }
    } catch (err) {
      console.error("Error during login:", err);
      setErrors(["Authentication Failed."]);
      return;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-3 sm:px-4 theme-bg">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-5 sm:p-8 
                   border border-red-200 dark:border-gray-700 backdrop-blur-sm"
      >
        {/* Logo Block */}
        <div className="flex flex-col items-center mb-4 sm:mb-6">
          <FarishtaaLogo  className="w-20 h-20 sm:w-30 sm:h-30"/>

          <h2 className="text-2xl sm:text-3xl font-bold text-red-600 mt-2 sm:mt-3 tracking-wide drop-shadow-[0_2px_6px_rgba(255,0,0,0.3)]">
            फरिश्ता
          </h2>
          <p className="text-sm text-red-500 dark:text-red-400 mt-1">{t('auth.motto')}</p>
        </div>

        <h3 className="text-lg sm:text-xl text-red-700 dark:text-red-400 mb-4 sm:mb-5 text-center">
          {t('auth.signInTitle')}
        </h3>

        <ErrorMessages errors={errors} />

        {/* Email */}
        <label className="block text-sm font-medium text-red-700 dark:text-red-400 mt-4">
          {t('auth.enterEmail')}
        </label>
        <input
          type="email"
          ref={emailref}
          className="w-full mt-1 p-2 border border-red-300 dark:border-gray-600 rounded-lg 
                     focus:ring-2 focus:ring-red-500 outline-none bg-white dark:bg-gray-700 dark:text-white"
          placeholder={t('auth.emailPlaceholder')}
        />

        {/* Password */}
        <label className="block text-sm font-medium text-red-700 dark:text-red-400 mt-4">
          {t('auth.password')}
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            ref={passwordref}
            className="w-full mt-1 p-2 pr-10 border border-red-300 dark:border-gray-600 rounded-lg 
                       focus:ring-2 focus:ring-red-500 outline-none bg-white dark:bg-gray-700 dark:text-white"
            placeholder={t('auth.passwordPlaceholder')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 mt-0.5 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-red-600 text-white py-3 rounded-lg 
                     text-lg font-semibold hover:bg-red-700 transition mt-6"
        >
          {t('auth.loginBtn')}
        </button>

        {/* Register link */}
        <p className="text-center mt-5 text-sm text-red-600 dark:text-red-400">
          {t('auth.newHere')}{" "}
          <span
            className="font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/signup")}
          >
            {t('auth.createAccount')}
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
