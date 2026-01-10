import { createContext, useContext, useState } from "react";

const EventFormContext = createContext();
export function EventFormProvider({ children }) {
  const [formData, setFormData] = useState({
    basicInfo: {
      title: "",
      description: "",
      category: "",
      mode: "single",
      sessions: [{ startDate: "", startTime: "", endTime: "" }],
      location: {
        name: "",
        address: "",
        latitude: null,
        longitude: null,
        city: "",
        state: "",
        country: "",
      },
    },
    banner: {
      file: null,
      preview: null,
    },
    tickets: {
      type: "ticketed", // paid | free
      tickets: [],
    },
  });

  const updateForm = (section, data) => {
    // console.log(formData);
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }));
  };

  const reset = () => {
    setFormData({
      basicInfo: {
        title: "",
        category: "",
        eventType: "single",
        startDate: "",
        startTime: "",
        endTime: "",
        location: "",
        description: "",
      },
      banner: { file: null, preview: null },
      tickets: { type: "paid", tickets: [] },
    });
  };

  return (
    <EventFormContext.Provider value={{ formData, updateForm, reset }}>
      {children}
    </EventFormContext.Provider>
  );
}
export const useEventForm = () => useContext(EventFormContext);
