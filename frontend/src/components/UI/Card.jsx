import { Children, useState } from "react";
import ActiveInterestedHart from "../Icons/ActiveInterestedHart.jsx";

import UnactiveInterestedHart from "../Icons/UnactiveInterestedHart.jsx";


function Card({image , title , time ,views ,about}) {
  const [interestedButten, setinterestedButten] = useState(false);

  const handleInterested = (e) => {
    e.preventDefault();

    // 2. CRITICAL: Stop the event from propagating to the parent <div>
    e.stopPropagation();
    return setinterestedButten(!interestedButten);
  };

  return (
    <>
      {/* <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="sr-only mb-12 ml-6 text-4xl font-extrabold ">
            Events Just for You
          </h2>

          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3  xl:gap-x-8"> */}
      <a href="https://www.youtube.com/" className="max-w-full max-h-100 w-full ">
        <div
          className={` aspect-square rounded-lg  bg-cover bg-center h-64 w-full object-cover group-hover:opacity-75 xl:aspect-7/8`} style={{ backgroundImage: `url(${image})` }}
        >
          <button
            onClick={handleInterested}
            className="bg-white rounded-full w-10 h-10 relative left-87/100 top-6/100 flex items-center hover:cursor-pointer mr-100"
          >
            {interestedButten ? (
              <ActiveInterestedHart />
            ) : (
              <UnactiveInterestedHart />
            )}
          </button>
        </div>
        <div>
          <div></div>
          <h3 className="mt-4 text-xl font-bold text-gray-900">
            {title}
          </h3>
          <p className="mt-1 font-normal text-[#5A5A5A]">
            {about}
          </p>
          <p className="mt-1 font-light text-[#5A5A5A]">
            {time}
          </p>
          <p className="mt-1 font-semibold text-[#5A5A5A]">
            {views}
          </p>
        </div>
      </a>
      {/* </div>
        </div>
      </div> */}
    </>
  );
}

export default Card;
