import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { useEventForm } from "../../Context/EventPovider";
import CreateEventProgressBar from "../../components/UI/CreateEventProgressBar";
import SessionForm from "../../components/Layout/CreateEventSessionForm";
import LocationPicker from "../../components/Layout/LocationPicker";
import { Title } from "react-head";
import { useCategories } from "../../Context/CategoriesProvider";

export default function CreateEventBasics() {
  const { formData,updateForm } = useEventForm();
  const navigate = useNavigate();
  const [position, setPosition] = useState(null);
  const [details, setDetails] = useState(null);
  const [errors, setErrors] = useState({});
  const {categories} = useCategories();

  const [local, setLocal] = useState({
    title: formData.basicInfo.title || "",
    category: formData.basicInfo.category || "",
    description: formData.basicInfo.description || "",
    location: formData.basicInfo.location || null,
    mode: formData.basicInfo.mode || "single",
    sessions: formData.basicInfo.sessions ||[{ date: "", startTime: "", endTime: "" }],
  });

  const validate = () => {
    const newErrors = {};

    if (!local.title.trim()) newErrors.title = "Event title is required.";
    if (!local.category) newErrors.category = "Please select a category.";
    if (!local.description.trim())
      newErrors.description = "Event description is required.";

    // Location
    if (!position) newErrors.location = "Location is required.";

    // Sessions validation
    local.sessions.forEach((session, i) => {
      if (!session.date) newErrors[`session_date_${i}`] = "Date is required.";
      if (!session.startTime)
        newErrors[`session_start_${i}`] = "Start time is required.";
      if (!session.endTime)
        newErrors[`session_end_${i}`] = "End time is required.";

      if (
        session.startTime &&
        session.endTime &&
        session.endTime <= session.startTime
      ) {
        newErrors[`session_time_${i}`] = "End time must be after start time.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addSession = () => {
    setLocal((prev) => ({
      ...prev,
      sessions: [...prev.sessions, { date: "", startTime: "", endTime: "" }],
    }));
  };

  const removeSession = (i) => {
    const sessions = local.sessions.filter((_, idx) => idx !== i);
    setLocal((prev) => ({ ...prev, sessions }));
  };

  const updateSession = (index, field, value) => {
    const updated = [...local.sessions];

    updated[index][field] = value;

    const { date, startTime, endTime } = updated[index];

    const startDate = date && startTime ? `${date}T${startTime}:00.000Z` : null;
    const endDate = date && endTime ? `${date}T${endTime}:00.000Z` : null;

    updated[index] = {
      startDate,
      endDate,
      date,
      startTime,
      endTime,
    };

    setLocal((prev) => ({ ...prev, sessions: updated }));
  };

  const possibleNames = [
    "name",
    "tourism",
    "historic",
    "leisure",
    "suburb",
    "village",
    "town",
    "city",
    "hamlet",
  ];
  const handleNext = () => {

    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }


    // console.log("details111", details);
    // console.log("local111", local);
    const newLocation = {
      name:
        details[possibleNames.filter((item) => details[item])?.[0]] || "name",
      address: details.address || "address",
      latitude: position[0],
      longitude: position[1],
      city: details.city || details.town || details.village || "",
      state: details.state || "",
      country: details.country || "",
    };

    const newLocal = { ...local, location: newLocation };

    // console.log("newLocal", newLocal);

    updateForm("basicInfo", newLocal);
    setLocal(newLocal);
    navigate("/organizer/create-event/banner");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Title>Create Event - Basics</Title>
      {/* Header & Progress Bar */}
      <div className="flex  items-center-safe gap-6 mb-6">
        <button
          onClick={() => navigate("/organizer/dashboard/overview")}
          className="text-5xl bg-gray-50 border relative top-1 border-primary rounded-full  p-2 w-fit h-fit hover:bg-gray-100"
        >
          <ArrowLeft size={30} />
        </button>
        <h1 className="text-5xl font-semibold ">Create New Event</h1>
      </div>

      <CreateEventProgressBar step={1} />

      {/* Event Title & Category */}
      <label className="mb-3 flex gap-3 items-center">
        <div className="text-md font-medium w-30 ">
          Event Title <strong className="text-red-600 text-lg">*</strong>
        </div>
        <input
          value={local.title}
          onChange={(e) => setLocal((s) => ({ ...s, title: e.target.value }))}
          className="w-full border rounded p-3 mt-1 border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none"
          placeholder="Enter the name of your event"
        />
      </label>
      {errors.title && (
        <div className="text-red-600 text-sm">{errors.title}</div>
      )}
      <label className="my-3 flex gap-3 items-center">
        <div className="text-md font-medium w-30">
          Event Category <strong className="text-red-600 text-lg">*</strong>
        </div>
        <select
          value={local.category}
          onChange={(e) =>
            setLocal((s) => ({ ...s, category: e.target.value }))
          }
          className="w-full border rounded p-3 mt-1 border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none"
        >
          <option value="">Select one</option>
          {categories.map((category) => (
            <option key={category.name} value={category.name}>
              {category.name}
            </option>
          ))}

        </select>
      </label>
      {errors.category && (
        <div className="text-red-600 text-sm">{errors.category}</div>
      )}
      {/* Sessions */}
      <h2 className="text-3xl font-semibold mb-4 mt-6 flex items-center justify-between">
        Date & Time
        {local.mode === "recurring" && (
          <button
            className="border-2 rounded-full w-8 h-8 flex items-center justify-center"
            onClick={addSession}
          >
            <Plus size={16} />
          </button>
        )}
      </h2>
      <label className="mb-3 flex gap-6 items-center ">
        <div className="text-md font-medium w-30">
          Event mode <strong className="text-red-600 text-lg">*</strong>
        </div>
        <label name="single" className="flex items-center gap-4">
          <input
            type="radio"
            name="mode"
            value="single"
            id="single"
            onChange={(e) =>
              setLocal((s) => ({
                ...s,
                mode: e.target.value,
                sessions: [{ date: "", startTime: "", endTime: "" }],
              }))
            }
          />
          single session
        </label>
        <label name="recurring" className="flex items-center gap-4">
          <input
            type="radio"
            name="mode"
            value="recurring"
            id="recurring"
            onChange={(e) => {
              setLocal((s) => ({ ...s, mode: e.target.value }));
            }}
          />
          recurring sessions
        </label>
      </label>
      <h3 className="text-xl font-semibold p-3">Sessions</h3>
      {local.sessions.map((session, index) => (
        <div key={index} className=" mb-4">
          <SessionForm
            key={index}
            session={session}
            index={index}
            updateSession={updateSession}
            removeSession={removeSession}
            canRemove={local.sessions.length > 1}
          />
          {errors[`session_date_${index}`] && (
            <div className="text-red-600 text-sm">
              {errors[`session_date_${index}`]}
            </div>
          )}
          {errors[`session_start_${index}`] && (
            <div className="text-red-600 text-sm">
              {errors[`session_start_${index}`]}
            </div>
          )}
          {errors[`session_end_${index}`] && (
            <div className="text-red-600 text-sm">
              {errors[`session_end_${index}`]}
            </div>
          )}
          {errors[`session_time_${index}`] && (
            <div className="text-red-600 text-sm">
              {errors[`session_time_${index}`]}
            </div>
          )}
        </div>
      ))}

      {/* Location */}
      <h2 className="text-3xl font-semibold mb-4 mt-6">Location</h2>
      <LocationPicker
        local={local}
        setLocal={setLocal}
        position={position}
        setPosition={setPosition}
        details={details}
        setDetails={setDetails}
      />
      {errors.location && (
        <div className="text-red-600 text-sm">{errors.location}</div>
      )}
      {/* Description */}
      <h2 className="text-3xl font-semibold mb-4 mt-6">
        Additional Information
      </h2>
      <label className="block mb-6">
        <div className="text-md font-medium w-30">
          Event Description <strong className="text-red-600 text-lg">*</strong>
        </div>
        <textarea
          value={local.description}
          onChange={(e) =>
            setLocal((s) => ({ ...s, description: e.target.value }))
          }
          className="w-full border rounded p-3 mt-1 border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none h-40"
          placeholder="Describe what's special about your event"
        />
      </label>
      {errors.description && (
        <div className="text-red-600 text-sm">{errors.description}</div>
      )}
      {/* Next Button */}
      <div className="flex justify-end">
        <button
          // disabled={Object.keys(errors).length > 0}
          onClick={handleNext}
          className="bg-purple-700 text-white px-6 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
