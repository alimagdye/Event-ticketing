import { useEffect, useState } from "react";
import Card from "../UI/Card";
import { useUser } from "../../Context/AuthProvider";
import { latestEvents } from "../../APIs/homeApis";
import Loading from "./LoadingLayout";
import { useNavigate } from "react-router-dom";


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
//     bannerUrl: "'/images/login.jpg'",
//     title: "Earthen Bottl11e",
//     description: "Adventure Geek - Explore the Unexplored, Mumbai",
//     time: "8:30 AM - 7:30 PM",
//     viwes: "14 interested",
//   },
// ];

function CardDisplaySection({title , endpoint}) {
  const [cards, setcards] = useState([]);
  const {user}  = useUser();
  const [loading, setloading] = useState(false);
  const navigate=useNavigate();
 
 const handleEndpoint=async()=>{
    try{
      setloading(true);
      const response= await endpoint();
      const newcards = response.data.data
      console.log(title,"    ", response.data.data);
      setcards(response.data.data.events);
      setloading(false);
    }
    catch(error){
      
    }
  }

  const handleDiscoverMore=()=>{
    navigate(`/events-pagenation?page=1&title=${title.trim()}`,{state:{title:title}});
  }

    useEffect(() => {
    handleEndpoint();
  }, []);

  return (
    <div className="  md:ml-10 md:mr-10 md:px-10 px-2 mt-20">
      <h1 className=" text-3xl  font-bold mb-5 ml-10 ">{title}</h1>
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 items-center sm:grid-cols-2 lg:grid-cols-3  xl:gap-x-8 ">
        {cards.length >0 && cards.map((card, index) => {
          return (
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
          );
        })}
      </div>
      <div className="w-full flex justify-center ">
        <button
        onClick={handleDiscoverMore}
        className="border border-primary bg-white md:px-30 px-20 py-3 font-semibold text-lg text-primary my-15 rounded-md cursor-pointer">Discover More</button>
      </div>
      {loading && <Loading />}
    </div>
  );
}

export default CardDisplaySection;
