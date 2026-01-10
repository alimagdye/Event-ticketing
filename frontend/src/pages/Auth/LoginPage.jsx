import GoogleLogo from "../../components/Icons/GoogleLogo";
import FacebookLogo from "../../components/Icons/FacebookLogo";
import { Meta, Title } from "react-head";

import { validateLogin } from "../../utils/FormVaildators";

import { useAuth } from "../../Hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import EyeTrager from "../../components/Icons/Eyetrager";
import { getGoogleAuth, login } from "../../APIs/authAPIs";
import Loading from "../../components/Layout/LoadingLayout";
import ErrorDialog from "../../components/Dialogs/ErrorDialog";
import { useState } from "react";

export const handleGoogleAuth = async (e) => {
  try {
    const response = await getGoogleAuth();

    const googleAuthUrl = response.data.data.url;
    console.log(googleAuthUrl);
    
    window.location.href = googleAuthUrl;
  } catch (error) {
    console.log(error.response.data || "something go wrong");
  }
};

function LoginPage() {
  const navigate = useNavigate();
  const [openDialog, setopenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const {
    showPassword,
    handleShowPassword,
    errors,
    submit,
    loading,
  } = useAuth({
    validator: validateLogin,
    onSubmit: login,
    redirectTo: "/",
    origin: "login",
    openDialog,
    dialogMessage,
    setDialogMessage,
    setopenDialog,
  });

  return (
    <div className="flex flex-col  min-h-screen font-sans  bg-primary lg:flex-row">
      <Title>Fa3liat | Log in </Title>
      <Meta
        name="description"
        content="Login page in Fa3liat Event Agency site"
      />
      {/* LEFT SIDE */}
      <div
        className="w-full lg:w-[40%]  text-white flex flex-col justify-start gap-2.5 items-center lg:items-start lg:p-10 p-3 "
        style={{
          background: ` linear-gradient(to bottom, #BB52E0 20%, rgba(0,0,0,0.36)) , url('/images/login.jpg')`,
          backgroundSize: `cover`,
        }}
      >
        <img src="/Fa3liatLogo.png" alt="Fa3liat Logo" className="mb-8 w-48" />
        <h1 className="text-4xl font-bold mb-4 text-start leading-snug hidden lg:flex">
          Discover tailored
          <br />
          events.
          <br />
          Sign in for personalized
          <br />
          recommendations
          <br />
          today!
        </h1>
      </div>

      {/* RIGHT SIDE */}
      <div className="lg:w-[60%] w-full bg-white flex flex-col justify-center px-3 lg:px-10 md:px-6  relative lg:rounded-l-3xl rounded-t-3xl  outline-white outline-10 shadow-[0_-25px_50px_2px] shadow-black ">
        {/* Close Button (optional) */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-3 right-3 lg:top-6 lg:right-6 text-gray-400 text-4xl hover:text-gray-600 "
        >
          &times;
        </button>

        <h2 className="text-transparent bg-linear-to-b from-secandry  to-[#FF8370] bg-clip-text md:text-5xl text-4xl font-bold mb-5 mt-5 h-15">
          Login
        </h2>

        {/* Social Login Buttons */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={handleGoogleAuth}
            className="flex-1 border border-gray-300 rounded-md py-2 flex justify-center items-center gap-2 hover:bg-gray-50 transition hover:cursor-pointer"
          >
            <GoogleLogo /> Login with Google
          </button>
          <button className="flex-1 border border-gray-300 rounded-md py-2 flex justify-center items-center gap-2 hover:bg-gray-50 transition hover:cursor-pointer text-[#1877F2]">
            <FacebookLogo /> Login with Facebook
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center mb-6">
          <hr className="grow border-gray-200" />
          <span className="mx-3 text-gray-400">OR</span>
          <hr className="grow border-gray-200" />
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={submit}>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              E-mail Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your e-mail"
              className={`w-full h-15 border  ${
                errors.email ? "border-red-600" : "border-gray-300"
              }  rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary mb-2`}
            />
            {errors.email && (
              <small className={`text-red-600 ml-5 `}>
                {errors.email} <b>*</b>
              </small>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? `text` : `password`}
                placeholder="Enter password"
                name="password"
                id="password"
                autoComplete="new-password"
                className={`w-full h-15 border ${
                  errors.password ? "border-red-600" : "border-gray-300"
                } rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary`}
              />
              {errors.password && (
                <small className={`text-red-600 ml-5 `}>
                  {errors.password} <b>*</b>
                </small>
              )}
              <span
                className="absolute right-6 top-5 text-gray-400 cursor-pointer"
                onClick={handleShowPassword}
              >
                <EyeTrager />
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-2 rounded-md text-white font-semibold bg-linear-to-r from-secandry to-[#FF8370] hover:opacity-90 transition"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-gray-600 text-center">
          Don’t have an account? &nbsp;
          <Link
            to="/signup"
            className="text-secandry font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
        <p className="mt-6 text-gray-600 text-center">
          Forget your Password? &nbsp;
          <Link
            to="/forget-password/get-email"
            className="text-secandry font-semibold hover:underline"
          >
            Reset Password
          </Link>
        </p>
      </div>
      {/* {showDialog && (
        <div className="fixed inset-0 bg-white/40 flex items-center justify-center z-50">
          <div className="bg-white  rounded-lg shadow-lg p-6 w-120 h-50 max-w-sm flex flex-col justify-center items-center ">
            <p className="text-gray-800 text-xl">{dialogMessage}</p>

            <button
              onClick={closeDialog}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded-md transition mt-10"
            >
              Close
            </button>
          </div>
        </div>
      )} */}
      {openDialog && (
        <ErrorDialog
          open={openDialog}
          message={dialogMessage}
          onClose={() => setopenDialog(false)}
        />
      )}
      {loading && <Loading />}
    </div>
  );
}

export default LoginPage;
