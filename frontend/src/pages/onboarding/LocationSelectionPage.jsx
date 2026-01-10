import { Title } from "react-head";
import ProgressBar from "../../components/UI/progressBar";
import AuthHeaderSection from "../../components/UI/AuthHeaderSection";
import locationOptions from "../../utils/LocationOptions";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ButtonOnBoarding from "../../components/UI/ButtonOnBoarding";
import { location } from "../../APIs/onboardingAPIs";
import Loading from "../../components/Layout/LoadingLayout";
import ErrorDialog from "../../components/Dialogs/ErrorDialog";

function LocationSelection() {
  const [Location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDialog, setopenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const navigator = useNavigate();
  const submitLocation = async (e) => {
    e.preventDefault();
    // console.log(Location);
    //sending data to Backend
    try {
      setLoading(true);
      // console.log(Location);
      const response = await location({ governorate: Location });

      // console.log(
      //   "Success:",
      //   response.data,
      //   response?.data?.accessToken?.token
      // );

      navigator("/onboarding/preference-selection");
    } catch (error) {
      console.log("error", error);

      const message =
        error.response?.data?.message || "Something went wrong";
      setDialogMessage(message);
      setopenDialog(true);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {/* Header Section */}
      <AuthHeaderSection
        title="Where are you located?"
        content="This helps us personalize your experience and show you relevant content."
      />
      {/* Location Selection */}
      <div className="mb-8 h-fit">
        <h3 className="text-lg font-bold mb-4">Select your location</h3>

        <select
          name="location"
          value={Location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-3 border-2 border-gray-300 rounded-lg bg-white text-gray-700 cursor-pointer focus:border-primary focus:ring-primary transition-all"
        >
          <option value="" disabled>
            Choose a location...
          </option>

          {locationOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {/* Buttons */}
      <ButtonOnBoarding submit={submitLocation} data={Location} />

      {openDialog && <ErrorDialog open={openDialog} message={dialogMessage} onClose={() => setopenDialog(false)} />}
      {loading && <Loading />}
    </>
  );
}

export default LocationSelection;
