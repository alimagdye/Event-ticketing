import Dialog from "../UI/Dialog";

export default function InfoDialog({ open, onClose, event }) {
  if (!event) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <h3 className="text-xl font-semibold mb-4">Event Details</h3>

      <p className="text-gray-600 mb-2"><strong>Event ID:</strong> {event?.id}</p>
      <p className="text-gray-600 mb-2"><strong>Title:</strong> {event?.title}</p>
      <p className="text-gray-600 mb-2"><strong>Description:</strong> {event?.description}</p>
      <p className="text-gray-600 mb-2"><strong>Location name:</strong> {event?.venue?.name}</p>

      <div className="flex justify-end mt-4">
        <button
          onClick={onClose}
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded mr-2"
        >
          Close
        </button>
      </div>
    </Dialog>
  );
}
