import { useState } from "react";
import { Button } from "./../shadcn/button";
import { Input } from "./../shadcn/input";
import { Label } from "./../shadcn/label";
import { Trash2, Plus } from "lucide-react";
import { cn } from "./../shadcn/utils";

const PRESET_COLORS = [
  "#14b8a6", // teal
  "#0ea5e9", // sky
  "#6366f1", // indigo
  "#a855f7", // violet
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#ec4899", // pink
];

export function PriceTierEditor({
  priceTiers,
  selectedTier,
  onTierSelect,
  onTierAdd,
  onTierUpdate,
  onTierDelete,
}) {
  const [newTierName, setNewTierName] = useState("");
  const [newTierPrice, setNewTierPrice] = useState("");
  const [newTierColor, setNewTierColor] = useState(PRESET_COLORS[0]);

  const handleAddTier = () => {
    if (!newTierName.trim() || !newTierPrice.trim()) return;

    onTierAdd({
      name: newTierName,
      price: parseFloat(newTierPrice),
      color: newTierColor,
    });

    setNewTierName("");
    setNewTierPrice("");
    setNewTierColor(PRESET_COLORS[0]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-4">Price Tiers</h3>
        <div className="space-y-2">
          {priceTiers.map((tier) => (
            <div
              key={tier.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all",
                selectedTier === tier.id
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200 hover:border-gray-300",
              )}
              onClick={() => onTierSelect(tier.id)}
            >
              <div
                className="w-6 h-6 rounded"
                style={{ backgroundColor: tier.color }}
              />
              <div className="flex-1">
                <div className="font-medium">{tier.name}</div>
                <div className="text-sm text-gray-600">${tier.price}</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onTierDelete(tier.id);
                }}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-6">
        <h4 className="font-semibold mb-4">Add New Tier</h4>
        <div className="space-y-4">
          <div>
            <Label htmlFor="tierName">Tier Name</Label>
            <Input
              id="tierName"
              placeholder="e.g., VIP, Premium, Standard"
              value={newTierName}
              onChange={(e) => setNewTierName(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="tierPrice">Price ($)</Label>
            <Input
              id="tierPrice"
              type="number"
              placeholder="0.00"
              step="0.01"
              value={newTierPrice}
              onChange={(e) => setNewTierPrice(e.target.value)}
            />
          </div>

          <div>
            <Label>Color</Label>
            <div className="flex gap-2 mt-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  className={cn(
                    "w-8 h-8 rounded border-2 transition-all",
                    newTierColor === color
                      ? "border-gray-900 scale-110"
                      : "border-gray-300",
                  )}
                  style={{ backgroundColor: color }}
                  onClick={() => setNewTierColor(color)}
                />
              ))}
            </div>
          </div>

          <Button
            onClick={handleAddTier}
            className="w-full"
            disabled={!newTierName.trim() || !newTierPrice.trim()}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Tier
          </Button>
        </div>
      </div>
    </div>
  );
}
