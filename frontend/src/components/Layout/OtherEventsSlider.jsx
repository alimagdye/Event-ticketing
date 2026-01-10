import { useEffect, useRef, useState } from "react";
import Card from "../UI/Card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { latestEvents, nearbyEvents, personalizedEvents } from "../../APIs/homeApis";
import { useLocation, useParams } from "react-router-dom";

// const mockCards = [
//   {
//     image: "'/images/login.jpg'",
//     title: "Earthen Bott4444le",
//     description: "Adventure Geek - Explore the Unexplored, Mumbai",
//     time: "8:30 AM - 7:30 PM",
//     viwes: "14 interested",
//   },
//   {
//     image: "'/images/login.jpg'",
//     title: "Earthen Bott333le",
//     description: "Adventure Geek - Explore the Unexplored, Mumbai",
//     time: "8:30 AM - 7:30 PM",
//     viwes: "14 interested",
//   },
//   {
//     image: "'/images/login.jpg'",
//     title: "Earthen Bottl21e",
//     description: "Adventure Geek - Explore the Unexplored, Mumbai",
//     time: "8:30 AM - 7:30 PM",
//     viwes: "14 interested",
//   },
//   {
//     image: "'/images/login.jpg'",
//     title: "Earthen Bottl11e",
//     description: "Adventure Geek - Explore the Unexplored, Mumbai",
//     time: "8:30 AM - 7:30 PM",
//     viwes: "14 interested",
//   },
//   {
//     image: "'/images/login.jpg'",
//     title: "Earthen Bottl11e",
//     description: "Adventure Geek - Explore the Unexplored, Mumbai",
//     time: "8:30 AM - 7:30 PM",
//     viwes: "14 interested",
//   },
//   {
//     image: "'/images/login.jpg'",
//     title: "Earthen Bottl11e",
//     description: "Adventure Geek - Explore the Unexplored, Mumbai",
//     time: "8:30 AM - 7:30 PM",
//     viwes: "14 interested",
//   },
// ];

function OtherEventsSlider() {
  const [cards, setcards] = useState([]);
  const scrollRef = useRef(null);
  const slug =useParams();
  const id=new URLSearchParams(useLocation().search).get('id');

  const slideRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };
  const slideleft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };
    const handleEndpoint=async()=>{
    try{
      const response= await personalizedEvents();
      setcards(response.data.data.events);

    }
    catch(error){
      console.log(error)
    }
  }

    useEffect(() => {
    handleEndpoint();
  }, [slug,id]);

  return (
    <section className="w-full py-20 bg-white no-scrollbar h-fit">
      <div className="max-w-350 mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Other events you may like
          </h2>
          <div>
            <button
              onClick={slideleft}
              className="p-3 mr-5 rounded-full border border-gray-300 hover:bg-gray-100 transition"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <button
              onClick={slideRight}
              className="p-3 rounded-full border border-gray-300 hover:bg-gray-100 transition"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-10 no-scrollbar scroll-smooth h-fit"
        >
          {cards.map((card, index) => (
            <div key={index} className="shrink-0 w-80">

           <Card
              key={index}
              bannerUrl={`${card.bannerUrl}`}
              title={card.title}
              description={card.description}
              date={card.date}
              price={card.ticketTypes||[]}
              views={card.viwes}
              id={card.id}
              slug={card.slug}
              sessions={card.eventSessions||[]}
              crossOrigin="anonymous"
            />
              </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default OtherEventsSlider;
