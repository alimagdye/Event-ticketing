import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useCategories } from "../../Context/CategoriesProvider";
// const mockCategories = [
//   {
//     name: "Student & University",
//     imageUrl: "/images/login.jpg",
//   },
//   {
//     name: "Workshops & Training Programs",
//     imageUrl: "/images/login.jpg",
//   },
//   {
//     name: "Exhibitions & Trade Shows",
//     imageUrl: "/images/login.jpg",
//   },
//   {
//     name: "Religious & Cultural Gatherings",
//     imageUrl: "/images/login.jpg",
//   },
//   {
//     name: "Fitness & Lifestyle",
//     imageUrl: "/images/login.jpg",
//   },
//   {
//     name: "Community & Charity Events",
//     imageUrl: "/images/login.jpg",
//   },
//   {
//     name: "Community & Charity Events",
//     imageUrl: "/images/login.jpg",
//   },
//   {
//     name: "Community & Charity Events",
//     imageUrl: "/images/login.jpg",
//   },
//   {
//     name: "Community & Charity Events",
//     imageUrl: "/images/login.jpg",
//   },
// ];

function ExploreCategories() {
  const { categories, loading} = useCategories();
  
  // const [categories, setCategories] = useState(Categories);

  const scrollRef = useRef(null);

  //  const handleEndpoint=async()=>{
  //     try{
  //       const response= await endpoint();
  //       setCategories(response.data.data.categories);
  //     }
  //     catch(error){
        
  //     }
  //   }
  
  //     useEffect(() => {
  //     handleEndpoint();
  //   }, []);

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
          className="flex flex-row-reverse overflow-x-auto gap-10 no-scrollbar scroll-smooth"
        >
          {categories.length > 0 && categories.map((cat, index) => ( 
            
            <div
              key={index}
              className="min-w-[180px] flex flex-col items-center text-center group cursor-pointer"
            >
              <div className="w-32 h-32 rounded-full overflow-hidden shadow-md group-hover:shadow-xl transition-all">
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  crossOrigin="anonymous"
                />
              </div>
              <p className="mt-4 text-sm font-semibold text-gray-800 leading-snug group-hover:text-black">
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
