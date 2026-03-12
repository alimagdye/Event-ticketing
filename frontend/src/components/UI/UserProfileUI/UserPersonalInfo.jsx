import locationOptions from "../../../utils/LocationOptions.js";

function PersonalInfoSection() {
  return (
    <section className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-900">
          Personal Information
        </h2>

        <p className="text-sm text-slate-500">
          Update your location and regional settings.
        </p>
      </div>

      <div className="p-6">
        <form className="flex flex-col gap-5">

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Location
            </label>

            <select className="form-select w-full bg-slate-100 h-12 rounded-lg text-md p-2">
              {locationOptions.map((location) => (
                <option key={location.value} value={location.value}>
                  {location.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end pt-2">
            <button
              className="px-6 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 shadow-md shadow-primary/20 transition-all"
              type="submit"
            >
              Save Changes
            </button>
          </div>

        </form>
      </div>

    </section>
  );
}

export default PersonalInfoSection;