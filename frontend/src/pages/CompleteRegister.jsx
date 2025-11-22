import { useNavigate } from "react-router-dom";
import ProgressBar from "../components/UI/progressBar";
import { Title } from "react-head";
import { getStatus } from "../APIs/onboardingAPIs";
import Loading from "../components/Layout/LoadingLayout";
import { useState } from "react";

function CompleteResister() {
  const [loading, setLoading] = useState(false);
  const navigator = useNavigate();

  const goToHome = async () => {
    try {
      setLoading(true)
      const response = await getStatus();

      console.log(
        "Success:",
        response.data,
        response?.data?.accessToken?.token
      );
      navigator("/");
    } catch (error) {
      console.log("error", error);

      const message =
        error.response?.data?.data?.error || "Something went wrong";
    }
    finally{
      setLoading(false)
    }
  };

  return (
    <>
      <div className=" font-display min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 md:px-20 lg:px-20">
        <div
          className="w-full max-w-4xl bg-white/10 rounded-xl shadow-2xl px-12 py-8"
          style={{
            background: `url('images/CompleteRegister.png')`,
            backgroundSize: "cover",
          }}
        >
          <ProgressBar step={"Complete"} />
          <Title>Completed!!</Title>
          <div className="h-120 flex flex-col justify-center items-center ">
            <img
              src={import.meta.env.BASE_URL + "images/CompleteSign.png"}
              alt=""
              className="w-fit h-20 lg:h-40 md:h-30 sm:h-20 object-cover mb-4"
            />
            <h1 className="lg:text-5xl md:text-4xl text-3xl mb-4 font-extrabold leading-tight text-center  ">
              Thank You for Signing Up!
            </h1>
            <p className="w-3/4 lg:p-8  text-center">
              Your account has been successfully created. Welcome to the
              community! You can now explore and book unique spaces for your
              parties, events, and workspaces.{" "}
            </p>
          </div>
          <div className="flex flex-row sm:flex-row gap-3 max-w-120 mx-auto z-20">
            <button
              onClick={goToHome}
              className={`flex-1 h-12 bg-linear-to-r from-primary to-secandry hover:bg-primary/90 cursor-pointer hover:opacity-90  text-white text-2xl rounded-lg font-bold tracking-wide transition z-30`}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
      {loading && <Loading />}
    </>
  );
}

export default CompleteResister;
