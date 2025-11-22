import { useNavigate } from "react-router-dom";
import ProgressBar from "../components/UI/progressBar";
import { useState } from "react";
import CreateEventProgressBar from "../components/UI/CreateEventProgressBar";

function CreateEventBanner() {
    // const { formData, updateForm } = useEventForm();
const navigate = useNavigate();
const [fileInfo, setFileInfo] = useState("");
const onFile = (e) => {
const f = e.target.files[0];
if (!f) return;
const preview = URL.createObjectURL(f);
setFileInfo({ file: f, preview });
updateForm("banner", { file: f, preview });
};


const handleNext = () => {
navigate("/ticketing");
};


return (
<div className="p-6 max-w-4xl mx-auto">
      <CreateEventProgressBar step={2} />

<h2 className="text-xl font-semibold mb-4">Banner</h2>


<div className="mb-4">
<input type="file" accept="image/*" onChange={onFile} />
<p className="text-xs text-gray-500 mt-2">Feature image must be at least 1170px wide x 504px high. Valid formats: JPG, GIF, PNG.</p>
</div>


{fileInfo.preview && (
<div className="mb-4">
<div className="border rounded overflow-hidden">
<img src={fileInfo.preview} alt="preview" className="w-full h-56 object-cover" />
</div>
</div>
)}


<div className="flex justify-between">
<button onClick={() => navigate(-1)} className="text-gray-600">Go back to Edit Event</button>
<button onClick={handleNext} className="bg-purple-700 text-white px-6 py-2 rounded">Save & Continue</button>
</div>
</div>
);
}

export default CreateEventBanner;