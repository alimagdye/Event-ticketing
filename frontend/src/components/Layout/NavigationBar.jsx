import { useState } from "react";
import NavbarMenuIcon from "../Icons/NavbarMenu";
import { ChevronDown, DoorOpen, Heart, TicketXIcon } from "lucide-react";
import TicketIcon from "../Icons/TicketIcon";
import ProfileIcon from "../Icons/ProfileIcon";
// import { useAuth } from "../../Hooks/useAuth";
import { useUser } from "../../Context/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import {
  getAccessToken,
  // refreshAccessToken,
  removeTokens,
} from "../../services/cookieTokenService";
import { logout ,refreshToken } from "../../APIs/authAPIs";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { becomeOrganizer } from "../../APIs/userAPIs";


function NavigationBar({ backGround = "primary" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const navigate = useNavigate();

  const { user, updateUser } = useUser();

  const handlelogout = async () => {
    try {
      const response = await logout();
      // console.log("Success:", response.data);
      updateUser({});
      // console.log(user)
      removeTokens();
      window.location.reload();
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    try {
      // console.log(user);
      // console.log(user)
      const accessToken = getAccessToken();
      if (!accessToken) return;

      const decoded = jwtDecode(accessToken);
      updateUser(decoded);
    } catch (error) {
      // console.log("invalid token:", error);
      updateUser({});
    }
  }, []);

  const handleBecomeOrganizer = async () => {
    try {
      const response = await becomeOrganizer();
      const newUser = { ...user, role: "organizer" };
      updateUser(newUser);
        // console.log(user);
      // const newtoken = await refreshToken();
      // refreshAccessToken(newtoken.data);
      // window.location.reload();
      // console.log("response", response);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      <nav
        className={` ${
          backGround ? `bg-${backGround}` : "bg-primary"
        }  border-gray-200 p-2`}
      >
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* === 1/4: Logo / Brand === */}
            <div className="w-3/4 flex items-center md:w-1/6">
              <Link to="/" className="h-full w-full flex items-center">
                <img
                  src={"/public/Fa3liatLogo.png"}
                  alt="Fa3liat Logo"
                  className="md:h-20 h-16 w-fit pb-2"
                />
              </Link>
            </div>

            {/* === 1/4: Menu Items === */}
            <div className="hidden lg:flex w-2/4 justify-center font-semibold text-lg">
              <ul className="flex justify-between w-full text-white">
                <li className="text-center hover:text-gray-300 cursor-pointer border-r border-gray-400 flex-1">
                  <a href="#">Explore</a>
                </li>
                <li className="text-center hover:text-gray-300 cursor-pointer border-r border-gray-400 flex-1">
                  <a href="#">Events</a>
                </li>
                <li className="text-center hover:text-gray-300 cursor-pointer border-r border-gray-400 flex-1">
                  <a href="#">Categories</a>
                </li>
                <li className="text-center hover:text-gray-300 cursor-pointer flex-1">
                  <a href="#">Calendar</a>
                </li>
              </ul>
            </div>

            {/* === 1/4: Language Buttons === */}
            <div className="hidden lg:flex w-1/8 justify-center items-center space-x-4">
              <button className="text-white hover:text-gray-300 font-bold text-xl">
                AR
              </button>
              <span className="text-white text-2xl">|</span>
              <button className="text-white hover:text-gray-300 font-bold text-xl">
                EN
              </button>
            </div>

            {/* === 1/4: Auth Buttons === */}

            {user.role === "user" || user.role === "organizer" ? (
              <div className="text-white flex items-center gap-6">
                <div className="hidden md:flex flex-col items-center text-sm cursor-pointer">
                  <TicketIcon />

                  <span>Tickets</span>
                </div>

                <div className="hidden md:flex flex-col items-center text-sm cursor-pointer">
                  <Heart size={30} />
                  <span>Interested</span>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setOpenProfile(!openProfile)}
                    className="flex  items-center gap-1 cursor-pointer"
                  >
                    <div className="flex flex-col items-center text-sm">
                      <ProfileIcon />

                      <span>Profile</span>
                    </div>
                    <ChevronDown size={20} />
                  </button>

                  {openProfile && (
                    <div className="absolute right-0 mt-2 bg-white text-black shadow-lg rounded-lg w-48  z-20 ">
                      <button className="w-full text-left px-4 py-3 hover:bg-gray-200 transition duration-300 rounded-t-lg">
                        Profile
                      </button>
                      <button
                        onClick={handlelogout}
                        className="w-full text-left px-4 py-3  transition duration-300 flex gap-2 items-center text-red-700 hover:text-white hover:bg-red-600 "
                      >
                        <DoorOpen size={20} />
                        logout
                      </button>

                      {user.role === "user" ? (
                        <button
                          onClick={handleBecomeOrganizer}
                          className="w-full text-left px-4 py-3 hover:bg-secandry/80 transition duration-300 bg-secandry text-white rounded-b-lg"
                        >
                          Upgrade to organizer
                        </button>
                      ) : (
                        <button
                          onClick={() => navigate("/organizer/dashboard/overview")}
                          className="w-full text-left px-4 py-3 hover:bg-secandry/80 transition duration-300 bg-secandry text-white rounded-b-lg cursor-pointer"
                        >
                          Go to Dashboard
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden lg:flex w-1/5 justify-end space-x-4">
                <button
                  onClick={() => {
                    // console.log(user);
                    navigate("/login");
                  }}
                  className="px-6 py-2 bg-secandry text-white rounded-md hover:bg-[#FF8370] transition w-3/5"
                >
                  Join Us
                </button>
              </div>
            )}

            {/* === Mobile Menu Button === */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-300 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* === Mobile Dropdown === */}
          {isOpen && (
            <div className="lg:hidden px-4 pb-4 space-y-2">
              <a
                href="#"
                className="block text-white font-semibold hover:text-gray-300 mb-2 border-b py-3 border-white/30"
              >
                Explore
              </a>
              <a
                href="#"
                className="block text-white font-semibold hover:text-gray-300 mb-2 border-b py-3 border-white/30"
              >
                Events
              </a>
              <a
                href="#"
                className="block text-white font-semibold hover:text-gray-300 mb-2 border-b py-3 border-white/30"
              >
                Categories
              </a>
              <a
                href="#"
                className="block text-white font-semibold hover:text-gray-300 mb-5"
              >
                Calendar
              </a>
              {user.role === "user" || user.role === "organizer" ? (
                <div className="flex space-x-2 items-center justify-center text-white  gap-10">
                  <div className=" flex flex-col items-center text-lg cursor-pointer ">
                    <TicketIcon />

                    <span>Tickets</span>
                  </div>

                  <div className=" flex flex-col items-center text-lg cursor-pointer  ">
                    <Heart size={30} />
                    <span>Interested</span>
                  </div>
                </div>
              ) : (
                <div className="flex space-x-2 items-center justify-center">
                  <button
                    onClick={() => {
                      navigate("/login");
                    }}
                    className="px-6 py-2 bg-secandry text-white rounded-md hover:bg-[#FF8370] transition w-3/5"
                  >
                    Join Us
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default NavigationBar;
