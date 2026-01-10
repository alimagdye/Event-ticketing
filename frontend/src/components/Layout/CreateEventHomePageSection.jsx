import { CalendarPlus } from "lucide-react";

function CreateEventHomePageSection() {
    return (       <div className="w-full flex justify-center ">
        <div
          className="w-full  border py-10 text-center text-white bg-cover bg-center"
          style={{ backgroundImage: "url('/images/homePageSections.png')" }}
        >
          {/* Left Gradient Bulb */}

          <h2 className="text-3xl font-bold mb-3">
            Create an event with Fa3liat!
          </h2>

          <p className="text-lg mb-6 text-white/90">
            Got a show, event, activity or a great experience? Partner with us &
            get listed on Fa3liat
          </p>

          <button
            className="
            bg-white text-purple-600 font-semibold 
            text-xl
            px-8 py-3 rounded-md shadow 
            hover:bg-white/90 transition flex items-center gap-2 mx-auto
          "
          >
            <CalendarPlus size={20} />
            Create Event
          </button>
        </div>
      </div> );
}

export default CreateEventHomePageSection;