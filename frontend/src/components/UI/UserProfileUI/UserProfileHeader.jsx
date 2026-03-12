import { CircleAlert, PartyPopper } from "lucide-react";

function UserProfileHeader({name , memberSince, eventsAttended}) {
  return (
    <div className="px-10 py-8 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {name}
        </h1>

        <p className="text-slate-500 mt-1 flex items-center gap-2 pl-2">
          <CircleAlert color="#BB52E0" size={22} />
          Member since {memberSince}
        </p>
      </div>

      <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
        <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
          <PartyPopper color="#BB52E0" size={24} />
        </div>

        <div>
          <p className="text-2xl font-black text-primary leading-none">{eventsAttended}</p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            Events Attended
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserProfileHeader;
