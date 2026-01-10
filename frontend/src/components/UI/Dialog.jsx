export default function Dialog({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-1/2 px-12 py-8">
        {children}
      </div>
      <div
        className="absolute "
        onClick={onClose}
      />
    </div>
  );
}
