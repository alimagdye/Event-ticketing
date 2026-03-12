import { Badge } from "../shadcn/badge";
import { Minus } from "lucide-react";

function PreferenceBadge({ interest, onRemove }) {
  return (
    <Badge
      onClick={() => onRemove(interest)}
      className="px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-md font-medium border border-slate-300 hover:bg-red-400/20 transition-colors flex items-center gap-2"
    >
      <Minus />
      {interest}
    </Badge>
  );
}

export default PreferenceBadge;