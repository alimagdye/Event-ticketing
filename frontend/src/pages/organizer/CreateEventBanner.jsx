import { Link, useNavigate } from "react-router-dom";
import ProgressBar from "../../components/UI/progressBar";
import { useState } from "react";
import CreateEventProgressBar from "../../components/UI/CreateEventProgressBar";
import { useEventForm } from "../../Context/EventPovider";
import { Title } from "react-head";

function CreateEventBanner() {
  const { formData, updateForm } = useEventForm();
  const navigate = useNavigate();
  const [fileInfo, setFileInfo] = useState(formData.banner || { file: null, preview: null });
  const onFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const preview = URL.createObjectURL(f);
    setFileInfo({ file: f, preview });
    updateForm("banner", { file: f, preview });
  };

  const handleNext = () => {
    // console.log(fileInfo);
    // console.log(formData)
    updateForm("banner", { file: fileInfo.file, preview: fileInfo.preview });
    navigate("/organizer/create-event/ticket");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Title>Create Event - Banner</Title>
      <CreateEventProgressBar step={2} />

      <h2 className="text-xl font-semibold mb-4">Banner</h2>

      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={onFile}
          className="bg-primary/10 w-1/2 h-20 text-center text-3xl font-bold border border-gray-300 rounded-lg p-5 "
        />
        <p className="text-xs text-gray-500 mt-2">
          Feature image must be at least 1170px wide x 504px high. Valid
          formats: JPG, GIF, PNG.
        </p>
      </div>

      {fileInfo.preview && (
        <div className="mb-4">
          <div className="border rounded overflow-hidden">
            <img
              src={fileInfo.preview}
              alt="preview"
              className="w-full h-60 object-cover"
            />
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <Link to= {'/organizer/create-event/basics'} className="text-gray-600">
          Go back to Edit Event info
        </Link >
        <button
          disabled={!fileInfo.file}
          onClick={handleNext}
          className="bg-purple-700 text-white px-6 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default CreateEventBanner;
