import Dialog from "../UI/Dialog";


export default function DeleteDialog({ open, onClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
      <p className="text-gray-600 mb-4">
        Are you sure you want to delete this event?
      </p>

      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Delete
        </button>
      </div>
    </Dialog>
  );
}
