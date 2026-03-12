import PreferenceBadge from "../PreferenceBadge";
import AddPreferencePopover from "../AddPreferenceBadgeButton";

function UserSettingsAddPreference({
  preferences,
  availablePreferences,
  handlePreferenceChange,
  getAvailablePreferences,
}) {
  return (
    <section className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">

      <div className="p-6 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-900">Preferences</h2>
        <p className="text-sm text-slate-500">
          Configure how you interact with the platform.
        </p>
      </div>

      <div className="p-6 flex flex-col gap-4">

        <div className="flex flex-wrap gap-2 pl-4">
          {preferences.map((interest) => (
            <PreferenceBadge
              key={interest}
              interest={interest}
              onRemove={handlePreferenceChange}
            />
          ))}

          <AddPreferencePopover
            availablePreferences={availablePreferences}
            handlePreferenceChange={handlePreferenceChange}
            getAvailablePreferences={getAvailablePreferences}
          />
        </div>

        <div className="flex justify-end pt-2">
          <button className="px-6 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 shadow-md shadow-primary/20 transition-all">
            Save Changes
          </button>
        </div>

      </div>
    </section>
  );
}

export default UserSettingsAddPreference;