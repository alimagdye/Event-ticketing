import Card from "../UI/Card";


const mockCards = [
  {
    image: "'/images/2025-09-10(1).png'",
    title: "Earthen Bott4444le",
    about: "Adventure Geek - Explore the Unexplored, Mumbai",
    time: "8:30 AM - 7:30 PM",
    viwes: "14 interested",
  },
  {
    image: "'/images/2025-09-10(1).png'",
    title: "Earthen Bott333le",
    about: "Adventure Geek - Explore the Unexplored, Mumbai",
    time: "8:30 AM - 7:30 PM",
    viwes: "14 interested",
  },
  {
    image: "'/images/2025-09-10(1).png'",
    title: "Earthen Bottl21e",
    about: "Adventure Geek - Explore the Unexplored, Mumbai",
    time: "8:30 AM - 7:30 PM",
    viwes: "14 interested",
  },
  {
    image: "'/images/2025-09-10(1).png'",
    title: "Earthen Bottl11e",
    about: "Adventure Geek - Explore the Unexplored, Mumbai",
    time: "8:30 AM - 7:30 PM",
    viwes: "14 interested",
  },
];

function CardDisplaySection() {
  return (
    <>
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 items-center sm:grid-cols-2 lg:grid-cols-3  xl:gap-x-8 ml-10 mr-10">
        {mockCards.map((card, index) => {
          return (
            <Card
              key={index}
              image={card.image}
              title={card.title}
              about={card.about}
              time={card.time}
              views={card.viwes}
            />
          );
        })}
      </div>
    </>
  );
}

export default CardDisplaySection;
