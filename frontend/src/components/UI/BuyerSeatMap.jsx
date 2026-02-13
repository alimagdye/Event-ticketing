import { cn } from "./../shadcn/utils";
import { Check } from "lucide-react";

export function BuyerSeatMap({
  seats,
  rows,
  seatsPerRow,
  priceTiers,
  onSeatClick,
  selectedSeats,
  viewMode,
}) {
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

  const isSelected = (row, number) => {
    return selectedSeats.some((s) => s.row === row && s.number === number);
  };

  const getSeatStyle = (seat) => {
    if (!seat || !seat.tierId) return {};

    if (viewMode === "pricing") {
      return { backgroundColor: getTierColor(seat.tierId) || "#d1d5db" };
    }

    // Availability mode
    switch (seat.status) {
      case "available":
        return { backgroundColor: "#22c55e" }; // green
      case "sold":
        return { backgroundColor: "#ef4444" }; // red
      case "reserved":
        return { backgroundColor: "#f59e0b" }; // amber
      case "selected":
        return { backgroundColor: "#3b82f6" }; // blue
      default:
        return {};
    }
  };

  const getSeatClassName = (seat) => {
    if (!seat || !seat.tierId) return "bg-gray-200 border-gray-300";

    const selected = isSelected(seat.row, seat.number);

    if (viewMode === "availability") {
      if (selected) {
        return "border-blue-700 ring-2 ring-blue-400";
      }
      if (seat.status === "sold" || seat.status === "reserved") {
        return "border-gray-400 cursor-not-allowed opacity-60";
      }
      return "border-gray-400 hover:ring-2 hover:ring-green-400 cursor-pointer";
    }

    // Pricing mode
    if (selected) {
      return "border-gray-900 ring-2 ring-gray-400";
    }
    if (seat.status === "sold" || seat.status === "reserved") {
      return "border-gray-400 cursor-not-allowed opacity-60";
    }
    return "border-gray-400 hover:ring-2 hover:ring-gray-300 cursor-pointer";
  };

  const getTooltipText = (seat) => {
    if (!seat) return "";

    const tierInfo = getTierInfo(seat.tierId);
    if (!tierInfo) return "";

    if (viewMode === "pricing") {
      return `${tierInfo.name} - $${tierInfo.price}`;
    }

    // Availability mode
    const statusText =
      seat.status.charAt(0).toUpperCase() + seat.status.slice(1);
    return `${statusText} - ${tierInfo.name} ($${tierInfo.price})`;
  };

  return (
    <div className="w-full flex flex-col items-center gap-8">
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
                const tooltipText = getTooltipText(seat);
                const canClick =
                  seat && seat.tierId && seat.status === "available";

                if (seat?.isAisle) {
                  return <div key={seatIndex} className="w-8 h-8" />;
                }

                return (
                  <button
                    key={seatIndex}
                    onClick={() => canClick && onSeatClick(rowIndex, seatIndex)}
                    disabled={!canClick}
                    className={cn(
                      "w-8 h-8 rounded-t-lg border-2 transition-all relative group",
                      getSeatClassName(seat),
                    )}
                    style={getSeatStyle(seat)}
                  >
                    {/* Selected indicator */}
                    {isSelected(rowIndex, seatIndex) && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" strokeWidth={3} />
                      </div>
                    )}

                    {/* Tooltip on hover */}
                    {tooltipText && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                        {tooltipText}
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
