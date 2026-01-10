import { Minus } from "lucide-react";

export default function SessionForm({
  session,
  index,
  updateSession,
  removeSession,
  canRemove,
}) {
const buildDateTime = (date, time) => {
  if (!date || !time) return null;

  return `${date}T${time}:00.000Z`;
};


  const handleUpdate = (field, value) => {
    updateSession(index, field, value);

    const startDate = buildDateTime(
      field === "date" ? value : session.date,
      field === "startTime" ? value : session.startTime
    );
    const endDate = buildDateTime(
      field === "date" ? value : session.date,
      field === "endTime" ? value : session.endTime
    );
    // console.log("startDate", startDate , "endDate", endDate);
    updateSession(index, "startDate", startDate);
    updateSession(index, "endDate", endDate);
  };

  return (
    <div className="p-4 rounded mb-4 border border-gray-200">
      
      <h3 className="font-semibold mb-3 flex items-center justify-between">
        Session {index + 1}
        {canRemove && (
          <button
            className="border rounded-full w-6 h-6 text-center flex items-center justify-center"
            onClick={() => removeSession(index)}
          >
            <Minus size={14} />
          </button>
        )}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <label>
          <div className="text-sm">Session Date <strong className="text-red-600 text-md">*</strong></div>
          <input
            type="date"
            value={session.date}
            onChange={(e) => handleUpdate("date", e.target.value)}
            className="w-full border rounded p-2 mt-1"
          />
        </label>

        <label>
          <div className="text-sm">Start Time <strong className="text-red-600 text-md">*</strong></div>
          <input
            type="time"
            value={session.startTime}
            onChange={(e) => handleUpdate("startTime", e.target.value)}
            className="w-full border rounded p-2 mt-1"
          />
        </label>

        <label>
          <div className="text-sm">End Time <strong className="text-red-600 text-md">*</strong></div>
          <input
            type="time"
            value={session.endTime}
            onChange={(e) => handleUpdate("endTime", e.target.value)}
            className="w-full border rounded p-2 mt-1"
          />
        </label>
      </div>
    </div>
  );
}
