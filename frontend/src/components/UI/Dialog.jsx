export default function Dialog({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 ">
      <div className="bg-white rounded-lg shadow-lg w-full mx-3 sm:mx-24 lg:mx-36 xl:mx-48 px-3 py-6  sm:px-6 lg:px-16 xl:px-24 my-6 max-w-3xl z-45 ">
        {children}
      </div>
      <div
        className="absolute inset-0 z-40"
        onClick={onClose}
      />
    </div>
  );
}
