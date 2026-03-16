import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../shadcn/popover";

function AddPreferencePopover({
  availablePreferences,
  handlePreferenceChange,
  getAvailablePreferences,
}) {
  return (
    <Popover>

      <PopoverTrigger asChild>
        <button
          onClick={getAvailablePreferences}
          className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold border border-primary/20 hover:bg-primary/20"
        >
          + Add New
        </button>
      </PopoverTrigger>

      <PopoverContent
        side="top"
        className="border-0 shadow-none bg-white rounded-lg p-2 w-64"
      >
        <div className="h-48 overflow-auto w-full bg-slate-100 rounded-lg text-md p-2">


          {availablePreferences.map((interest) => (
            <div
              key={interest.id}
              onClick={() => handlePreferenceChange(interest)}
              className="p-2 hover:bg-primary/10 cursor-pointer rounded-md"
            >
              {interest.name} 
            </div>
          ))}

        </div>
      </PopoverContent>

    </Popover>
  );
}

export default AddPreferencePopover;