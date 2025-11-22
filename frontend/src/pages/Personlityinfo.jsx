import { useState } from "react";
import FemaleIcon from "../components/Icons/Female";
import MaleIcon from "../components/Icons/male";
import { Title } from "react-head";
import CustomDateInput from "../components/UI/CustemDateInput";
import AuthHeaderSection from "../components/UI/AuthHeaderSection";
import ProgressBar from "../components/UI/progressBar";
import genderRadio from "../utils/genderRadio";
import { useLocation, useNavigate } from "react-router-dom";
import ButtonOnBoarding from "../components/UI/ButtonOnBoarding";
import { basic } from "../APIs/onboardingAPIs";
import Loading from "../components/Layout/LoadingLayout";

function PersonlityinfoQ() {
  const [gender, setGender] = useState();
  const [date, setDate] = useState();
  const [showDialog, setShowDialog] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigator = useNavigate();
  // const location = useLocation();

  const submitInfo = async (e) => {
    e.preventDefault();
    const formattedDate =
      date instanceof Date ? date.toISOString().split("T")[0] : date;

    //    const validationErr = validator();

    // setErrors(validationErr);

    // if (Object.keys(validationErr).length > 0) return;

    try {
      setLoading(true);
      const response = await basic({
        birthDate: formattedDate,
        gender: gender,
      });

      console.log(
        "Success:",
        response.data,
        response?.data?.accessToken?.token
      );

      navigator("/onboarding/location-selection");
    } catch (error) {
      console.log("error", error);

      const message =
        error.response?.data?.data?.error || "Something went wrong";
    } finally {
      setLoading(false);
    }

    //sending data to Backend
  };

  return (
    <>
      {/* Header Section */}
      <AuthHeaderSection
        title="Tell us a bit about yourself"
        content="This helps us personalize your experience and show you relevant content."
      />
      {/* gender Selection */}
      <div className="mb-8 h-fit">
        <h3 className="text-lg font-bold mb-4 ">What's your gender?</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {genderRadio.map((option) => (
            <label
              key={option.value}
              className={`group relative flex flex-col items-center justify-center p-6 rounded-lg border-2 cursor-pointer transition-all duration-400 hover:border-primary
                    ${
                      gender === option.value
                        ? "border-primary bg-primary/20 scale-103"
                        : "border-gray-300 "
                    } `}
            >
              <input
                type="radio"
                name="gender"
                value={option.value}
                checked={gender === option.value}
                onChange={(e) => setGender(e.target.value)}
                className="absolute h-full w-full opacity-0 cursor-pointer"
              />

              <span className="material-symbols-outlined text-4xl mb-2 text-primary">
                {option.icon}
              </span>
              <span className="font-semibold">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* date Input */}
      <CustomDateInput
        id="date"
        name="date"
        type="date"
        selected={date}
        value={date}
        onChange={(value) => setDate(value)}
        placeholder="Enter your date"
        className="lg:w-100 w-70  max-w-sm rounded-lg border px-4 py-3 focus:outline-none focus:border-primary  focus:ring-2 focus:ring-primary transition-all duration-200"
      />

      {/* Buttons */}
      <ButtonOnBoarding submit={submitInfo} data={gender && date} />
      {loading && <Loading />}
    </>
  );
}

export default PersonlityinfoQ;
