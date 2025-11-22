import { useState } from "react";
import NavbarMenuIcon from "../Icons/NavbarMenu";

function NavigationBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="bg-primary border-b border-gray-200 p-2">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* === 1/4: Logo / Brand === */}
            <div className="w-3/4 flex items-center md:w-1/4">
              <a href="#" className="h-full w-3/4 flex items-center">
                <img
                  src={"/public/Fa3liatLogo.png"}
                  alt="Fa3liat Logo"
                  className="h-12 w-auto"
                />
              </a>
            </div>

            {/* === 1/4: Menu Items === */}
            <div className="hidden lg:flex w-2/4 justify-center font-semibold text-xl">
              <ul className="flex justify-between w-full text-white">
                <li className="text-center hover:text-gray-300 cursor-pointer border-r border-gray-400 flex-1">
                  <a href="#">Home</a>
                </li>
                <li className="text-center hover:text-gray-300 cursor-pointer border-r border-gray-400 flex-1">
                  <a href="#">Cetagories</a>
                </li>
                <li className="text-center hover:text-gray-300 cursor-pointer border-r border-gray-400 flex-1">
                  <a href="#">About</a>
                </li>
                <li className="text-center hover:text-gray-300 cursor-pointer flex-1">
                  <a href="#">Link</a>
                </li>
              </ul>
            </div>

            {/* === 1/4: Language Buttons === */}
            <div className="hidden lg:flex w-1/8 justify-center items-center space-x-4">
              <button className="text-white hover:text-gray-300 font-bold text-2xl">
                AR
              </button>
              <span className="text-white text-2xl">|</span>
              <button className="text-white hover:text-gray-300 font-bold text-2xl">
                EG
              </button>
            </div>

            {/* === 1/4: Auth Buttons === */}
            <div className="hidden lg:flex w-1/4 justify-end space-x-4">
              <button className="px-6 py-2 bg-secandry text-white rounded-md hover:bg-[#FF8370] transition w-1/2">
                Login
              </button>
              <button className="px-6 py-2 bg-secandry text-white rounded-md hover:bg-[#FF8370] transition w-1/2">
                Sign Up
              </button>
            </div>

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
                className="block text-white font-semibold hover:text-gray-300"
              >
                Home
              </a>
              <a
                href="#"
                className="block text-white font-semibold hover:text-gray-300"
              >
                About
              </a>
              <a
                href="#"
                className="block text-white font-semibold hover:text-gray-300"
              >
                Link
              </a>
              <div className="flex space-x-2">
                <button className="flex-1 px-3 py-1 border border-green-600 text-green-600 rounded-md hover:bg-green-600 hover:text-white transition">
                  Login
                </button>
                <button className="flex-1 px-3 py-1 border border-green-600 text-green-600 rounded-md hover:bg-green-600 hover:text-white transition">
                  Sign Up
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default NavigationBar;
