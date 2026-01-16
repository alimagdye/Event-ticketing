import { Search, MapPin, ChevronDown } from "lucide-react";
import locationOptions from "../../utils/LocationOptions";

export default function HeroSection() {
    
  return (
    <section className="w-full relative p-2">
      
      {/* Background Placeholder — replace with your own */}
     
      
      <div className="relative max-w-300 mx-auto md:px-6 pt-28 pb-24 text-center text-white">
        
        {/* ===== Title ===== */}
        <h1 className="text-3xl md:text-5xl font-bold leading-tight">
          Explore the <span className="text-orange-300">vibrant events</span> 
          <span> that inspire you.</span>
        </h1>

        {/* ===== Search Bar ===== */}
        <div className="mt-10 w-full flex justify-center">
          <div className="bg-white text-gray-600 w-full md:w-[700px] flex items-center rounded-xl shadow-lg overflow-hidden">
            
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3 w-full border-r">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search Events, Categories, Location,..."
                className="w-full outline-none text-[15px]"
              />
            </div>

            {/* Location Dropdown */}
            <div className="px-4 py-3 flex">
              <select
                className="
                  text-gray-700 text-15 outline-none cursor-pointer bg-white
                  appearance-none pr-6
                "
                
              >
                {locationOptions.map((city, index) => (
                    <option key={index} value={city.value} className="">
                    {city.label}
                  </option>
                ))}
              </select>
                <ChevronDown size={20} />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
