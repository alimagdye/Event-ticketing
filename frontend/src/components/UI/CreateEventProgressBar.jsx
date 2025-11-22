import { useState } from "react";

function CreateEventProgressBar({step}) {
  const currentStep=step;
  const totalSteps = 4;

  const progressWidth = ((currentStep - 1) / (totalSteps - 1)) * 100;
  
  return (
    <div className="flex flex-col items-center mt-10">
      {/* Progress Container */}
      <div className="relative flex justify-between w-full mb-8">
        {/* Gray Line (background) */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-300 z-1 -translate-y-1/2 "></div>

        {/* Blue Progress Line */}
        <div
          className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 transition-all duration-300 z-3"
          style={{ width: `${progressWidth}%` }}
        ></div>

        {/* Circles */}
        {["Edit", "Banner", "Ticketing", "Review"].map((step, index) => (
          <div key={step} className="z-10 flex flex-col gap-2.5 h-10 items-center justify-center ">
            <div
              className={`w-7.5 h-7.5 rounded-full bg-white flex items-center justify-center border-[3px] transition-all duration-300 z-10000 ${
                index < currentStep
                  ? "border-primary text-primary"
                  : "border-gray-300 text-gray-400"
              }`}
            >
              {index + 1}
            </div>
            <h3
              className={`absolute top-8 -translate-x-1 p-1 ${
                index < currentStep
                  ? "border-primary text-primary"
                  : "border-gray-300 text-gray-400"
              } `}
            >
              {step}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CreateEventProgressBar;
