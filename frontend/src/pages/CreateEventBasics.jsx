import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgressBar from "../components/UI/progressBar";
import CreateEventProgressBar from "../components/UI/CreateEventProgressBar";

function CreateEventBasics() {
//   const { formData, updateForm } = useEventForm();
  const navigate = useNavigate();
  const [local, setLocal] = useState('');

  const handleNext = () => {
    updateForm("basicInfo", local);
    navigate("/banner");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <CreateEventProgressBar step={1} />
      <h2 className="text-xl font-semibold mb-4">Event Details</h2>

      <label className="block mb-3">
        <div className="text-sm font-medium">Event Title</div>
        <input
          value={local.title}
          onChange={(e) => setLocal((s) => ({ ...s, title: e.target.value }))}
          className="w-full border rounded p-3 mt-1"
          placeholder="Enter the name of your event"
        />
      </label>

      <label className="block mb-3">
        <div className="text-sm font-medium">Event Category</div>
        <select
          value={local.category}
          onChange={(e) =>
            setLocal((s) => ({ ...s, category: e.target.value }))
          }
          className="w-full border rounded p-3 mt-1"
        >
          <option value="">Select one</option>
          <option value="music">Music</option>
          <option value="education">Education</option>
          <option value="sports">Sports</option>
        </select>
      </label>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <label className="block">
          <div className="text-sm">Start Date</div>
          <input
            type="date"
            value={local.startDate}
            onChange={(e) =>
              setLocal((s) => ({ ...s, startDate: e.target.value }))
            }
            className="w-full border rounded p-2 mt-1"
          />
        </label>
        <label className="block">
          <div className="text-sm">Start Time</div>
          <input
            type="time"
            value={local.startTime}
            onChange={(e) =>
              setLocal((s) => ({ ...s, startTime: e.target.value }))
            }
            className="w-full border rounded p-2 mt-1"
          />
        </label>
        <label className="block">
          <div className="text-sm">End Time</div>
          <input
            type="time"
            value={local.endTime}
            onChange={(e) =>
              setLocal((s) => ({ ...s, endTime: e.target.value }))
            }
            className="w-full border rounded p-2 mt-1"
          />
        </label>
      </div>

      <label className="block mb-3">
        <div className="text-sm font-medium">Location</div>
        <input
          value={local.location}
          onChange={(e) =>
            setLocal((s) => ({ ...s, location: e.target.value }))
          }
          className="w-full border rounded p-3 mt-1"
          placeholder="Where will your event take place?"
        />
      </label>

      <label className="block mb-6">
        <div className="text-sm font-medium">Event Description</div>
        <textarea
          value={local.description}
          onChange={(e) =>
            setLocal((s) => ({ ...s, description: e.target.value }))
          }
          className="w-full border rounded p-3 mt-1 h-40"
          placeholder="Describe what's special about your event"
        />
      </label>

      <div className="flex justify-between">
        <div />
        <button
          onClick={handleNext}
          className="bg-purple-700 text-white px-6 py-2 rounded"
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
}

export default CreateEventBasics;
