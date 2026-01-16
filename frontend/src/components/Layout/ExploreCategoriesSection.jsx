import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useCategories } from "../../Context/CategoriesProvider";

function ExploreCategories() {
  const { categories, loading} = useCategories();
  
  
  const scrollRef = useRef(null);

  
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
  return (
    <section className="w-full py-20 bg-white no-scrollbar">
      <div className="max-w-350 mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Explore Categories
          </h2>
          <div >

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
          className="flex  overflow-x-auto gap-10 no-scrollbar scroll-smooth"
        >
          {categories.length > 0 && categories.map((cat, index) => ( 
            
            <div
              key={index}
              className="min-w-[180px] flex flex-col items-center text-center  cursor-pointer"
            >
              <div className="w-32 h-32 rounded-full overflow-hidden shadow-md hover:shadow-xl transition-all">
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform"
                  crossOrigin="anonymous"
                />
              </div>
              <p className="mt-4 text-sm font-semibold text-gray-800 leading-snug hover:text-black">
                {cat.name}
              </p>
            </div>
          ))}
        </div>
      </div>
      
    </section>
  );
}

export default ExploreCategories;
