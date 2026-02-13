import { Label } from "./../shadcn/label";
import { Input } from "./../shadcn/input";
import { Button } from "./../shadcn/button";
import { Settings } from "lucide-react";

export function VenueSettings({
  rows,
  seatsPerRow,
  onRowsChange,
  onSeatsPerRowChange,
  onApply,
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5" />
        <h3 className="font-semibold">Venue Layout</h3>
      </div>

      <div>
        <Label htmlFor="rows">Number of Rows</Label>
        <Input
          id="rows"
          type="number"
          min="1"
          max="26"
          value={rows}
          onChange={(e) => onRowsChange(parseInt(e.target.value) || 1)}
        />
      </div>

      <div>
        <Label htmlFor="seatsPerRow">Seats Per Row</Label>
        <Input
          id="seatsPerRow"
          type="number"
          min="1"
          max="50"
          value={seatsPerRow}
          onChange={(e) => onSeatsPerRowChange(parseInt(e.target.value) || 1)}
        />
      </div>

      <Button onClick={onApply} className="w-full">
        Apply Layout
      </Button>
    </div>
  );
}
