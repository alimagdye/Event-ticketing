import { useState } from "react";
import { Check } from "lucide-react";
import AuthHeaderSection from "../components/UI/AuthHeaderSection";
import ProgressBar from "../components/UI/progressBar";
import { Title } from "react-head";
import { useNavigate } from "react-router-dom";
import ButtonOnBoarding from "../components/UI/ButtonOnBoarding";
import { preferences } from "../APIs/onboardingAPIs";
import Loading from "../components/Layout/LoadingLayout";

const categories = [
  { label: "Entertainment", image: "images/Entertainment.jpg" },
  { label: "Educational", image: "images/Educational.png" },
  { label: "Community & charity", image: "images/Charity.jpg" },
];

function PreferenceSelection() {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigator = useNavigate();

  const toggle = (label) => {
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label]
    );
  };

  const submitPreference = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log(Location);
      const response = await preferences({ preferences: selected });

      console.log(
        "Success:",
        response.data,
        response?.data?.accessToken?.token
      );

      navigator("/Completed");
    } catch (error) {
      console.log("error", error);

      const message =
        error.response?.data?.data?.error || "Something went wrong";
    } finally {
      setLoading(false);
    }

  };

  return (
    <>
      {/* Header Section */}

      <AuthHeaderSection
        title="What are you interested in?"
        content="Select a few of your favorite topics to help us recommend the best
        events and spaces for you."
      />
      {/* GRID */}
      <div className="grid grid-cols-1 mb-10 sm:grid-cols-1 md:grid-cols-1 gap-6 p-5">
        {categories.map((item, index) => (
          <label
            key={index}
            onClick={() => toggle(item.label)}
            className="relative cursor-pointer  rounded-xl   hover:outline-primary hover:outline-4 transition-all duration-200"
          >
            {/* Image */}
            <img
              src={import.meta.env.BASE_URL + item.image}
              alt={item.label}
              className="w-full h-60 lg:h-80 object-cover rounded-xl hover:scale-105  transition-transform duration-300"
            />

            {/* Label */}
            <div className="absolute bottom-2 left-2 text-primary  drop-shadow-lg sm:text-3xl text-xl font-bold z-10">
              {item.label}
            </div>

            {/* SELECTED OVERLAY */}
            {selected.includes(item.label) && (
              <div className="absolute inset-0 bg-black/40 flex items-center rounded-xl justify-center ">
                <div className="bg-primary text-white w-15 h-15  rounded-full flex items-center justify-center shadow-lg">
                  <Check size={30} />
                </div>
              </div>
            )}
          </label>
        ))}
      </div>

      {/* BUTTONS */}
      <ButtonOnBoarding
        submit={submitPreference}
        data={selected.length === 0 ? null : selected}
      />
      {loading && <Loading />}
    </>
  );
}
export default PreferenceSelection;
