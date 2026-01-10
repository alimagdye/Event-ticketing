import { Outlet, useNavigate } from "react-router-dom";
import { Title } from "react-head";
import { useUser } from "../../../Context/AuthProvider";
import { ChartColumn, Info, LucideBookHeart, Plus, Users2 } from "lucide-react";
import UnauthorizedPage from "../../Unauthorized";

function OrganizerDashboard({ children, page, title }) {
  const navigate = useNavigate();
  const { user } = useUser();
  return (
    <div className="flex  items-center justify-center  p-4 w-screen h-screen  transition-all gap-2  bg-gray-50">
      {user.role === "organizer" ?
      <>
      <Title>{title}</Title>
      <div className="w-full h-full flex gap-4  ">
        {/* side bar */}
        <aside className="w-76  h-full min-h-170 shadow-2xl p-6 bg-linear-to-b from-primary/95 to-primary/90 text-white text-2xl flex align-center rounded-2xl flex-col ">
          <img
            src="/Fa3liatLogo.png"
            alt="Fa3liat logo"
            className="mb-10 hover:cursor-pointer"
            onClick={() => navigate("/")}
          />
          <hr className=" text-gray-350 mb-4   " />
          <ul className=" h-full transition-all duration-300">
            <li
              onClick={() => navigate("/organizer/dashboard/overview")}
              className={`flex gap-3 hover:cursor-pointer hover:bg-black/10 p-3 py-4 rounded-xl border-b  border-gray-300/50 transition-all duration-200
              ${page === "overview" ? "bg-black/30 hover:bg-black/30" : ""}
              `}
            >
              <Info className="self-center" /> Overview
            </li>
            <li
              onClick={() => navigate("/organizer/dashboard/events")}
              className={`flex gap-3 hover:cursor-pointer hover:bg-black/10 p-3 py-4 rounded-xl border-b border-gray-300/50 transition-all duration-200
              ${page === "events" ? "bg-black/30 hover:bg-black/30" : ""}
              `}
            >
              <LucideBookHeart /> My Events
            </li>
            {/* attendee insights : for organizer to get insights of their attendees */}
            {/* <li
              onClick={() => navigate("/organizer/dashboard/attendee-insights")}
              className={`flex gap-3 hover:cursor-pointer hover:bg-black/10 p-3 py-4 rounded-xl border-b border-gray-300/50 transition-all duration-200
              ${
                page === "attendee-insights"
                  ? "bg-black/30 hover:bg-black/30"
                  : ""
              }
              `}
            >
              <Users2 className="self-center" />
              Attendee Insights
            </li> */}

            <li
              onClick={() => navigate("/organizer/dashboard/analytics")}
              className={`flex gap-3 hover:cursor-pointer hover:bg-black/10 p-3 py-4 rounded-xl transition-all duration-200 
              ${page === "analytics" ? "bg-black/30 hover:bg-black/30" : ""}
              `}
            >
              <ChartColumn className="self-center" />
              analytics
            </li>
            {/* <li onClick={() => navigate("/organizer/create-event/basics")}  className="flex gap-3 hover:cursor-pointer hover:bg-black/10 p-3 rounded-md self-end"> <Plus className="self-center"/> Create New Event </li> */}
          </ul>
          <button
            onClick={() => navigate("/organizer/create-event/basics")}
            className="text-2xl p-4 flex gap-2 hover:bg-blue-950/95 transition duration-300 bg-blue-950 text-white rounded-2xl cursor-pointer"
          >
            <Plus className="self-center" /> Create New Event
          </button>
        </aside>
        {/* main content */}
        <div className="flex-1 h-full min-h-170 bg-white shadow-2xl rounded-2xl p-8 ">
          {children}
          <Outlet />
        </div>
      </div> 
            </>
      : <UnauthorizedPage />
    }
    </div>
  );
}

export default OrganizerDashboard;
