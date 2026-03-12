import { IdCard, Stars, FlagTriangleLeft, Settings } from "lucide-react";

import { Badge } from "../../../components/shadcn/badge";
import UserProfileHeader from "../../../components/UI/UserProfileUI/UserProfileHeader";
import UserProfileMainLayout from "../../../components/Layout/UserProfileMainLayout";
import UserProfileInfoItem from "../../../components/UI/UserProfileUI/UserProfileInfoItem";

function UserProfilePage() {
  return (
    <UserProfileMainLayout>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <UserProfileHeader
          name="Amr khaled"
          memberSince="2026"
          eventsAttended="12"
        />

        <div className="p-8 px-10">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <IdCard color="#BB52E0" size={28} />
            Personal Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
            <UserProfileInfoItem label="Age">28 Years</UserProfileInfoItem>

            <UserProfileInfoItem label="Gender"> Male</UserProfileInfoItem>

            <UserProfileInfoItem label="Location">
              <div className="flex items-center gap-1.5">
                <FlagTriangleLeft color="#BB52E0" size={24} />
                New York, USA
              </div>
            </UserProfileInfoItem>

            <UserProfileInfoItem label="Email Address">
              john.doe@example.com
            </UserProfileInfoItem>
          </div>

          <div className="mt-12">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Stars color="#BB52E0" />
              Preferences & Interests
            </h3>

            <div className="flex flex-wrap gap-2 pl-4">
              {[
                "Technology",
                "Education",
                "Business",
                "Party",
                "Typography",
              ].map((interest) => (
                <Badge
                  className={`px-4 py-2 rounded-full bg-slate-100  text-slate-700  text-md font-medium border border-slate-300 `}
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <div class="bg-slate-50  p-6 flex justify-start gap-3 border-t border-slate-200 ">
          <button class="px-6 py-2.5 rounded-lg text-md font-bold bg-primary text-white shadow-md shadow-primary/25 hover:opacity-90 transition-opacity flex items-center gap-2">
            <Settings color="white" size={24} /> Edit Account
          </button>
        </div>
      </div>
    </UserProfileMainLayout>
  );
}

export default UserProfilePage;
