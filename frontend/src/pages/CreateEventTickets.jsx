import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgressBar from "../components/UI/progressBar";
import CreateEventProgressBar from "../components/UI/CreateEventProgressBar";

function CreateEventTickets() {
//   const { formData, updateForm } = useEventForm();
  const navigate = useNavigate();
  const [type, setType] = useState("paid");
  const [tickets, setTickets] = useState( []);
  const [ticketName, setTicketName] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");

  const addTicket = () => {
    if (!ticketName) return;
    const t = { name: ticketName, price: ticketPrice || 0 };
    const next = [...tickets, t];
    setTickets(next);
    updateForm("tickets", { type, list: next });
    setTicketName("");
    setTicketPrice("");
  };

  const removeTicket = (i) => {
    const next = tickets.filter((_, idx) => idx !== i);
    setTickets(next);
    updateForm("tickets", { type, list: next });
  };

  const handleNext = () => {
    updateForm("tickets", { type, list: tickets });
    navigate("/review");
  };
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <CreateEventProgressBar step={3} />
      <h2 className="text-xl font-semibold mb-4">Ticketing</h2>

      <div className="mb-4">
        <div className="flex gap-3">
          <button
            onClick={() => setType("paid")}
            className={`p-4 border rounded flex-1 ${
              type === "paid" ? "border-purple-700 bg-purple-50" : "bg-white"
            }`}
          >
            Ticketed Event
            <div className="text-sm text-gray-500">
              My event requires tickets for entry
            </div>
          </button>
          <button
            onClick={() => setType("free")}
            className={`p-4 border rounded flex-1 ${
              type === "free" ? "border-purple-700 bg-purple-50" : "bg-white"
            }`}
          >
            Free Event
            <div className="text-sm text-gray-500">
              I'm running a free event
            </div>
          </button>
        </div>
      </div>

      {type === "paid" && (
        <div className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
            <input
              value={ticketName}
              onChange={(e) => setTicketName(e.target.value)}
              placeholder="Ticket Name e.g. General Admission"
              className="border rounded p-2 col-span-2"
            />
            <input
              value={ticketPrice}
              onChange={(e) => setTicketPrice(e.target.value)}
              placeholder="Price"
              className="border rounded p-2"
            />
          </div>
          <div className="mt-3">
            <button
              onClick={addTicket}
              className="px-4 py-2 bg-purple-700 text-white rounded"
            >
              Add Ticket
            </button>
          </div>

          <div className="mt-4 space-y-2">
            {tickets.map((t, i) => (
              <div
                key={i}
                className="flex items-center justify-between border rounded p-3"
              >
                <div>
                  <div className="font-medium">{t.name}</div>
                  <div className="text-sm text-gray-500">Price: {t.price}</div>
                </div>
                <button
                  onClick={() => removeTicket(i)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button onClick={() => navigate(-1)} className="text-gray-600">
          Go back
        </button>
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

export default CreateEventTickets;
