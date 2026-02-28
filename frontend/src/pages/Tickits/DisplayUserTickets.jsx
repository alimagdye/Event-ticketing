import { ArrowRight, Ticket } from "lucide-react";
import { useRef, useState } from "react";
import { Title } from "react-head";
import QRCode from "react-qr-code";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import TicketDialog from "../../components/Dialogs/TicketDialog";
import { Skeleton } from "../../components/shadcn/skeleton";
import { Card, CardContent, CardHeader } from "../../components/shadcn/card";


const mockTickets = [
  {
    id: 1,
    eventName: "Music Concert",
    date: "2026-02-30 12:30pm",
    numberOfTickets: 5,
    qrValue: "Ticket ID: 12345, Event: Music Concert",
    location: "City Arena",
    status: "Valid",
    organizer: "ABC Events",
    seats: "A1, A2, A3, A4, A5"
  },
  {
    id: 2,
    eventName: "Art Exhibition",
    date: "2026-03-15 10:00am",
    numberOfTickets: 3,
    qrValue: "Ticket ID: 67890, Event: Art Exhibition",
    location: "Downtown Gallery",
    status: "Valid",
    organizer: "XYZ Arts",
    seats: "B1, B2, B3"
  },
  {
    id: 3,
    eventName: "Tech Conference",
    date: "2026-04-05 9:00am",
    numberOfTickets: 2,
    qrValue: "Ticket ID: 98765, Event: Tech Conference",
    location: "Convention Center",
    status: "Valid",
    organizer: "TechWorld",
    seats: "C1, C2"
  },
  {
    id: 4,
    eventName: "Sports Event",
    date: "2026-04-20 2:00pm",
    numberOfTickets: 1,
    qrValue: "Ticket ID: 54321, Event: Sports Event",
    location: "Stadium",
    status: "Valid",
    organizer: "Sports Inc.",
    seats: "D1"
  },
];

function DisplayUserTickets() {
  const [sortedMethod, setSortedMethod] = useState("Newest");
  const [openDialog, setopenDialog] = useState(false);

  const [selectedTicket, setSelectedTicket] = useState(null);

  const handleSortingChange = (method) => {
    setSortedMethod(method);
  };

// testing downloading QR code as PDF



  return (
    <>
      <Title>My Tickets</Title>

      
      <div className="px-4 sm:px-6 lg:px-16 xl:px-24 my-6 max-w-7xl mx-auto">

        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <h1 className="font-bold text-3xl sm:text-4xl lg:text-5xl font-serif text-shadow-md text-shadow-gray-400">
            Tickets
          </h1>

          {/* Sorting */}
          <div className="flex w-full md:w-auto border border-gray-300 rounded-lg overflow-hidden">
            {["Newest", "Nearest"].map((method, i) => (
              <label
                key={method}
                className={`flex-1 text-center px-4 py-2 font-mono cursor-pointer transition
                ${
                  sortedMethod === method
                    ? "bg-primary text-white cursor-not-allowed"
                    : "bg-white hover:bg-primary/10"
                }
                ${i === 0 ? "border-r border-gray-300" : ""}
              `}
              >
                <input
                  type="radio"
                  name="selected"
                  value={method}
                  checked={sortedMethod === method}
                  onChange={(e) => handleSortingChange(e.target.value)}
                  className="hidden"
                />
                {method}
              </label>
            ))}
          </div>
        </div>

        <hr className="my-4 text-gray-300" />

        {/* Tickets */}
        <div className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          gap-6
        ">
          {mockTickets.length >0 ? mockTickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={()=>{setopenDialog(true); setSelectedTicket(ticket)}}
              className="border rounded-xl shadow-lg flex flex-col items-center text-center overflow-hidden hover:shadow-2xl hover:scale-103 transition duration-500 hover:bg-black/5"
            >
              {/* QR */}
              <div className="w-32 h-32 sm:w-40 sm:h-48 mt-8">
                <QRCode
                  value={ticket.qrValue}
                  className="w-full h-full"
                />
              </div>

              {/* Info */}
              <div className="py-4 px-4">
                <h3 className="text-lg sm:text-xl font-bold mb-2">
                  {ticket.eventName}
                </h3>

                <p className="text-gray-500 text-sm sm:text-base">
                  Date: {ticket.date}
                </p>

                <p className="text-gray-500 text-sm sm:text-base">
                  Number of tickets: {ticket.numberOfTickets}
                </p>
              </div>
              {/* Button */}
              <button className="w-full bg-primary text-white py-3 flex items-center justify-center gap-2 hover:bg-primary/80 transition">
                View Details <ArrowRight size={18} />
              </button>
            </div>
          ))
          : (
          [1,2,3,4,5,6].map((temp) => (
          <div key={temp}
           className="flex flex-col-reverse justify-end items-center gap-3 border border-gray-50 rounded-xl p-4">

            <Skeleton className="h-4 w-2/3 bg-gray-300" />
            <Skeleton className="h-6 w-1/2 bg-gray-300" />
    
            <Skeleton className="aspect-video w-full bg-gray-300" />
          </div>)))
        }
          {openDialog && <TicketDialog open={openDialog} onClose={() => setopenDialog(false)} ticket={selectedTicket} />}
          
     
         
      



          {/* testing download ticket */}
          {/* <div 
              className="border  rounded-xl shadow-lg flex flex-col items-center text-center overflow-hidden"
              >
                <div ref={inputRef} className="w-full h-full flex flex-col items-center justify-center p-0">

                
         
              <div className="w-32 h-32 sm:w-40 sm:h-40 mt-8">
                <QRCode
                  value="Ticket ID: 12345, Event: Music Concert"
                  className="w-full h-full"
                />
              </div>

              <div className="py-4 px-4">
                <h3 className="text-lg sm:text-xl font-bold mb-2">
                  Event Name
                </h3>

                <p className=" text-sm sm:text-base">
                  Date: 2026-02-30 12:30pm
                </p>

                <p className=" text-sm sm:text-base">
                  Number of tickets: 5
                </p>
              </div>

          
              <button
              onClick={handleDownloadPDF}
              className="w-full bg-secandry text-white py-3 flex items-center justify-center gap-2 hover:bg-primary/80 transition">
                View Details <ArrowRight size={18} />
              </button>
            </div>
           </div>    */}
        </div>
      </div>
    </>
  );
}

export default DisplayUserTickets;
