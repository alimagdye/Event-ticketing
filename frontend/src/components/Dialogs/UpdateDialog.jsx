import Dialog from "../UI/Dialog";

export default function UpdateDialog({ open, onClose, onConfirm, event }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <h3 className="text-xl font-semibold mb-4">Update Event</h3>
      <p className="text-gray-600 mb-4">
        Are you sure you want to update this event?
      </p>
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded mr-2"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Update
        </button>
      </div>
    </Dialog>
  );
}
