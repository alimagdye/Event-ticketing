import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import AuthHeaderSection from "../../components/UI/AuthHeaderSection";
import ProgressBar from "../../components/UI/progressBar";
import { Title } from "react-head";
import { useNavigate } from "react-router-dom";
import ButtonOnBoarding from "../../components/UI/ButtonOnBoarding";
import { preferences } from "../../APIs/onboardingAPIs";
import Loading from "../../components/Layout/LoadingLayout";
import { categories } from "../../APIs/homeApis";
import { useCategories } from "../../Context/CategoriesProvider";
import ErrorDialog from "../../components/Dialogs/ErrorDialog";

// const mockcategories = [
//   { label: "Entertainment", image: "images/Entertainment.jpg" },
//   { label: "Educational", image: "images/Educational.png" },
//   { label: "Community & charity", image: "images/Charity.jpg" },
// ];

function PreferenceSelection() {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [providedcategories, setCategories] = useState(mockcategories);
    const [openDialog, setopenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const { categories } = useCategories();
  const navigator = useNavigate();

  const toggle = (item) => {
    setSelected((prev) =>
      prev.includes(item.name)
        ? prev.filter((c) => c !== item.name)
        : [...prev, item.name]
    );
  };

  const submitPreference = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // console.log(selected);
      const response = await preferences({ preferences: selected });

      // console.log(
      //   "Success:",
      //   response.data,
      //   response?.data?.accessToken?.token
      // );

      navigator("/Completed");
    } catch (error) {
      console.log("error", error);

      const message =
        error.response?.data?.message || "Something went wrong";
      setDialogMessage(message);
      setopenDialog(true);
      console.error(message);
    } finally {
      setLoading(false);
    }
  };
  // const handleGetCategories=async()=>{
  //       try{
  //         const response= await categories();
  //         setCategories(response.data.data.categories);
  //       }
  //       catch(error){

  //       }
  //     }

  useEffect(() => {
    console.log(categories);
    // handleGetCategories();
  }, []);

  return (
    <>
      {/* Header Section */}

      <AuthHeaderSection
        title="What are you interested in?"
        content="Select a few of your favorite topics to help us recommend the best
        events and spaces for you."
      />
      {/* GRID */}
      <div className="grid lg:grid-cols-2 grid-cols-1 mb-10 sm:grid-cols-1 md:grid-cols-1 gap-6 p-5">
        {categories.map((item, index) => (
          <label
            key={index}
            onClick={() => toggle(item)}
            className="relative cursor-pointer  rounded-xl   hover:outline-primary hover:outline-4 transition-all duration-200"
          >
            {/* Image */}
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-60 lg:h-80 object-cover rounded-xl hover:scale-105  transition-transform duration-300"
              crossOrigin="anonymous"
            />

            {/* name */}
            <div className="absolute bottom-2 left-2 text-primary  drop-shadow-lg sm:text-3xl text-xl font-bold z-10">
              {item.name}
            </div>

            {/* SELECTED OVERLAY */}
            {selected.includes(item.name) && (
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
            {openDialog && <ErrorDialog open={openDialog} message={dialogMessage} onClose={() => setopenDialog(false)} />}
      {loading && <Loading />}
    </>
  );
}
export default PreferenceSelection;
