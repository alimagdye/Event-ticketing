import { useState } from "react";
import UserSettings from "../../../components/Layout/UserSettingsLayout";
import UserSettingsSecurity from "../../../components/UI/UserProfileUI/UserSettingsSecurit";
import PersonalInfoSection from "../../../components/UI/UserProfileUI/UserPersonalInfo";
import PreferencesSection from "../../../components/UI/UserProfileUI/UserSettingsAddPreference";
import DeleteAccountSection from "../../../components/UI/UserProfileUI/UserDeleteAccount";
import { useCategories } from "../../../Context/CategoriesProvider";



function UserAccountSettings() {

  const [preferences, setPreferences] = useState([
    "Business",
    "Party",
    "Typography",
  ]);

  const {categories} = useCategories();
  

  const [availablePreferences, setAvailablePreferences] = useState([]);

  const getAvailablePreferences = () => {

    setAvailablePreferences(
      categories.filter((pref) => !preferences.includes(pref))
    );
  };

  const handlePreferenceChange = (preference) => {

    if (preferences.includes(preference)) {
      setPreferences(preferences.filter((p) => p !== preference));
      setAvailablePreferences([...availablePreferences, preference]);
    } else {
      setPreferences([...preferences, preference]);
      setAvailablePreferences(
        availablePreferences.filter((p) => p !== preference)
      );
    }
  };

  return (
    <UserSettings
      title="Manage Account"
      description="Update your security settings and personal preferences."
    >
      <UserSettingsSecurity />

      <PersonalInfoSection />

      <PreferencesSection
        preferences={preferences}
        availablePreferences={availablePreferences}
        handlePreferenceChange={handlePreferenceChange}
        getAvailablePreferences={getAvailablePreferences}
      />

      <DeleteAccountSection />

    </UserSettings>
  );
}

export default UserAccountSettings;