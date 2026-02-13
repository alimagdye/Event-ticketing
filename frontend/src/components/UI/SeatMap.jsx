import { cn } from "./../shadcn/utils";
import { useState } from "react";

export function SeatMap({
  seats,
  rows,
  seatsPerRow,
  selectedTier,
  priceTiers,
  onSeatClick,
  editMode,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedSeats, setDraggedSeats] = useState(new Set());

  const getSeat = (row, number) => {
    return seats.find((s) => s.row === row && s.number === number);
  };

  const getTierColor = (tierId) => {
    if (!tierId) return null;
    const tier = priceTiers.find((t) => t.id === tierId);
    return tier?.color || null;
  };

  const getTierInfo = (tierId) => {
    if (!tierId) return null;
    return priceTiers.find((t) => t.id === tierId);
  };

  const getSeatKey = (row, number) => `${row}-${number}`;

  const handleMouseDown = (row, number) => {
    if (!editMode) return;
    setIsDragging(true);
    setDraggedSeats(new Set([getSeatKey(row, number)]));
    onSeatClick(row, number);
  };

  const handleMouseEnter = (row, number) => {
    if (!editMode || !isDragging) return;

    const seatKey = getSeatKey(row, number);
    if (!draggedSeats.has(seatKey)) {
      setDraggedSeats((prev) => new Set([...prev, seatKey]));
      onSeatClick(row, number);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedSeats(new Set());
  };

  return (
    <div
      className="w-full flex flex-col items-center gap-8"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Stage */}
      <div className="w-full max-w-4xl">
        <div className="bg-gray-800 text-white text-center py-3 rounded-t-lg">
          STAGE
        </div>
      </div>

      {/* Seats Grid */}
      <div className="flex flex-col gap-2">
        {Array.from({ length: rows }, (_, rowIndex) => (
          <div key={rowIndex} className="flex items-center gap-2">
            {/* Row Label */}
            <div className="w-8 text-center text-sm font-medium text-gray-600">
              {String.fromCharCode(65 + rowIndex)}
            </div>

            {/* Seats */}
            <div className="flex gap-1">
              {Array.from({ length: seatsPerRow }, (_, seatIndex) => {
                const seat = getSeat(rowIndex, seatIndex);
                const tierInfo = seat ? getTierInfo(seat.tierId) : null;
                const tierColor = seat ? getTierColor(seat.tierId) : null;

                if (seat?.isAisle) {
                  return <div key={seatIndex} className="w-8 h-8" />;
                }

                return (
                  <button
                    key={seatIndex}
                    onMouseDown={() => handleMouseDown(rowIndex, seatIndex)}
                    onMouseEnter={() => handleMouseEnter(rowIndex, seatIndex)}
                    disabled={!editMode}
                    className={cn(
                      "w-8 h-8 rounded-t-lg border-2 transition-all relative group",
                      !tierColor && "bg-gray-200 border-gray-300",
                      tierColor && "border-gray-400",
                      editMode &&
                        selectedTier &&
                        "hover:opacity-70 cursor-pointer",
                      !editMode && "cursor-default",
                      isDragging && "select-none",
                    )}
                    style={
                      tierColor ? { backgroundColor: tierColor } : undefined
                    }
                  >
                    {/* Tooltip on hover */}
                    {tierInfo && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                        {tierInfo.name} - ${tierInfo.price}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Row Label (right side) */}
            <div className="w-8 text-center text-sm font-medium text-gray-600">
              {String.fromCharCode(65 + rowIndex)}
            </div>
          </div>
        ))}
      </div>

      {/* Seat Numbers */}
      <div className="flex items-center gap-2">
        <div className="w-8" />
        <div className="flex gap-1">
          {Array.from({ length: seatsPerRow }, (_, i) => (
            <div key={i} className="w-8 text-center text-xs text-gray-500">
              {i + 1}
            </div>
          ))}
        </div>
        <div className="w-8" />
      </div>
    </div>
  );
}
