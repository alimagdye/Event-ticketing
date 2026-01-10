import { useState } from "react";
import { useEventForm } from "../../Context/EventPovider";
import CreateEventProgressBar from "../../components/UI/CreateEventProgressBar";
import { Link, useNavigate } from "react-router-dom";
import { createEvent } from "../../APIs/organizerApis";
import { useUser } from "../../Context/AuthProvider";
import EventPage from "../Events/EventPage";
import { Title } from "react-head";
import ErrorDialog from "../../components/Dialogs/ErrorDialog";
import Loading from "../../components/Layout/LoadingLayout";

function CreateEventReview() {
  const { formData } = useEventForm();
  const [submitting, setSubmitting] = useState(false);
  const [openDialog, setopenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { user } = useUser();
  const navigate = useNavigate();

  const submit = async () => {
    try {
      setSubmitting(true);

      const fd = new FormData();

      // === BASIC INFO ===
      fd.append("title", formData.basicInfo.title);
      fd.append("description", formData.basicInfo.description);
      fd.append("type", formData.tickets.type);
      fd.append("mode", formData.basicInfo.mode);
      fd.append("categoryName", formData.basicInfo.category);

      for (let i = 0; i < formData.basicInfo.sessions.length; i++) {
        fd.append(
          `sessions[${i}][startDate]`,
          formData.basicInfo.sessions[i].startDate
        );
        fd.append(
          `sessions[${i}][endDate]`,
          formData.basicInfo.sessions[i].endDate
        );
      }

      // === BANNER FILE ===
      if (formData.banner?.file) {
        fd.append("banner", formData.banner.file);
      }

      // === LOCATION ===
      fd.append("location[name]", formData.basicInfo.location.name);
      fd.append("location[address]", formData.basicInfo.location.address);
      fd.append("location[city]", formData.basicInfo.location.city || "city");
      fd.append("location[state]", formData.basicInfo.location.state);
      fd.append("location[country]", formData.basicInfo.location.country);
      fd.append(
        "location[latitude]",
        parseFloat(formData.basicInfo.location.latitude)
      );
      fd.append(
        "location[longitude]",
        parseFloat(formData.basicInfo.location.longitude)
      );

      // === TICKETS ARRAY ===
      for (let i = 0; i < formData.tickets.tickets.length; i++) {
        fd.append(`tickets[${i}][name]`, formData.tickets.tickets[i].name);
        fd.append(`tickets[${i}][price]`, formData.tickets.tickets[i].price);
        fd.append(
          `tickets[${i}][quantity]`,
          formData.tickets.tickets[i].quantity
        );
      }

      // Debug: Show form data
      // for (let pair of fd.entries()) {
      //   console.log(pair[0], pair[1]);
      // }
      setLoading(true);
      const response = await createEvent(fd, true); // send formData

      // console.log("EVENT CREATED", response);

      alert("Event created successfully!");
      navigate(`/organizer/dashboard/overview`);
    } catch (error) {
        const message =
        error.response?.data?.message || "Something went wrong";
      setDialogMessage(message);
      setopenDialog(true);
    } finally {
      setSubmitting(false);
      setLoading(false)
    }
  };
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Title>Create Event - Review</Title>
      <CreateEventProgressBar step={4} />
      <h2 className="text-xl font-semibold mb-4">Review</h2>
      {/* 
      <div className="space-y-4">
        <div className="border rounded p-4">
          <div className="text-sm text-gray-500">Title</div>
          <div className="font-medium">{formData.basicInfo.title || "-"}</div>
        </div>

        <div className="border rounded p-4">
          <div className="text-sm text-gray-500">Category</div>
          <div className="font-medium">
            {formData.basicInfo.category || "-"}
          </div>
        </div>

        <div className="border rounded p-4">
          <div className="text-sm text-gray-500">Schedule</div>
          <div className="font-medium">
            {formData.basicInfo.startDate} {formData.basicInfo.startTime}
          </div>
        </div>

        <div className="border rounded p-4">
          <div className="text-sm text-gray-500">Banner</div>
          {formData.banner.preview ? (
            <img
              src={formData.banner.preview}
              alt="banner"
              className="w-full h-44 object-cover rounded"
            />
          ) : (
            <div className="text-sm text-gray-500">No banner uploaded</div>
          )}
        </div>

        <div className="border rounded p-4">
          <div className="text-sm text-gray-500">Tickets</div>
          <div className="font-medium">
            {formData.tickets.tickets.length} ticket(s) <br />

          </div>
        </div>
      </div> */}
      <div className="border-6 rounded-2xl p-3 relative">
        <EventPage
          eventinfo={{
            ...formData.basicInfo,
            ...formData.tickets,
            ...formData.banner,
          }}
          review={true}
        />
        <div className="h-full w-full inset-0 absolute z-100" ></div>
      </div>

      <div className="flex justify-between mt-6">
        <Link to="/organizer/create-event/ticket" className="text-gray-600">
          Edit Tickets
        </Link>
        <button
          onClick={submit}
          disabled={submitting}
          className="bg-green-600 text-white px-6 py-2 rounded"
        >
          {submitting ? "Creating..." : "Create Event"}
        </button>
      </div>
            {openDialog && <ErrorDialog open={openDialog} message={dialogMessage} onClose={() => setopenDialog(false)} />}
              {loading && <Loading />}
    </div>
  );
}

export default CreateEventReview;
