import { Children, lazy, useState } from "react";
import ActiveInterestedHart from "../Icons/ActiveInterestedHart.jsx";

import UnactiveInterestedHart from "../Icons/UnactiveInterestedHart.jsx";
import { Heart, Ticket } from "lucide-react";
import { Link } from "react-router-dom";
import { formatEventSessionDate } from "../../utils/dateFormater.js";


function Card({bannerUrl , title , date ,price ,views ,description ,slug ,id ,sessions}) {
  const [interestedButten, setinterestedButten] = useState(false);
  const sessionssInfo = formatEventSessionDate(sessions );
  const priceRange = () => {

    if (Number(price[0].price) === 0 && price.length === 1) {
      return "Free";
    }
    if(price[0].price != 0 &&  price?.length === 1){
      return `${price[0].price} EGY`;
    }
    const minprice = Math.min(...price.map((ticket) => ticket.price));
    const maxprice = Math.max(...price.map((ticket) => ticket.price));
    return `${minprice} - ${maxprice} EGY`;
    }
  const handleInterested = (e) => {
    e.preventDefault();
    // console.log(sessionssInfo)
    // 2. CRITICAL: Stop the event from propagating to the parent <div>
    e.stopPropagation();

    return setinterestedButten(!interestedButten);
  };


  
  return (
    <>

      <Link to={`/events/${slug}?id=${id}`} className="max-w-full max-h-150  w-full mt-6 shadow-sm p-1 pb-6 rounded-xl "  >
        <div className={`  rounded-lg border-0  bg-cover bg-center h-64 w-full object-cover group-hover:opacity-75 xl:aspect-7/8 relative`}>

        <img  
        src={encodeURI(bannerUrl)}
        loading="lazy"
        crossOrigin="anonymous"
          className={`  rounded-lg border-0  bg-cover bg-center h-64 w-full object-cover group-hover:opacity-75 xl:aspect-7/8 relative`} style={{ backgroundImage: `url(${encodeURI(bannerUrl)})` }}
        />
          <button
            onClick={handleInterested}
            className="bg-white rounded-full w-10 h-10  left-87/100 top-6/100 flex items-center hover:cursor-pointer mr-100 absolute"
          >
            {interestedButten ? (
              <ActiveInterestedHart />
            ) : (
              <UnactiveInterestedHart />
            )}
          </button>

        </div>
          
        <div className="flex ">
          <div className="w-1/6 text-xl font-bold text-primary mt-4 ml-2">{sessionssInfo?.dateText||'Dec 8'}</div>
          <div className="ml-3">

          <h3 className="mt-4 text-xl font-bold text-gray-900 line-clamp-1 wrap-break-words">
            {title}
          </h3>
          <p className="mt-1 font-normal text-[#5A5A5A] w-full max-h-18 break-all line-clamp-2 wrap-break-word ">
            {description}
          </p>
          <p className="mt-1 font-medium text-[#5A5A5A]">
            {sessionssInfo?.startTime} - {sessionssInfo?.endTime || "6:30 PM - 9:30 PM"}
          </p>
          <p className="mt-1 font-normal text-secandry flex items-center">
            <Heart size={20} className="mr-1 mb-1 " /> 0 Interested
          </p>
          <p className="mt-1 font-semibold text-green-700 flex items-start">
            <Ticket size={24}  className="mr-1 pt-1 " /> {priceRange()}
          </p>
          </div>
        </div>
      </Link>
      {/* </div>
        </div>
      </div> */}
    </>
  );
}

export default Card;
