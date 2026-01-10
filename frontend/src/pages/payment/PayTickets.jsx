import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// const mocktickets = [
//   {
//     id: 1,
//     name: "Ticket 1",
//     price: 50.5,
//     quantity: 20,
//     count: 0,
//   },
//   {
//     id: 2,
//     name: "Ticket 2",
//     price: 75,
//     quantity: 10,
//   },
//   {
//     id: 3,
//     name: "Ticket 3",
//     price: 100,
//     quantity: 5,
//   },
// ];
function PayTicketsPage() {
  const { state } = useLocation();
  const tickets = state?.tickets || [];
  const id = state?.id;
  const [Eventtickets, setTickets] = useState(tickets);
  const navigate = useNavigate();

  const selectedTickets = Eventtickets.filter((t) => t.count > 0);

  const increment = (id) => {
    setTickets((prev) =>
      prev.map((ticket,ticketIndex) =>
       ticketIndex === id && ticket.count < ticket.quantity
          ? { ...ticket, count: ticket.count + 1 }
          : ticket
      )
    );
  };

  const decrement = (id) => {
    setTickets((prev) =>
      prev.map((ticket,ticketIndex) =>
       ticketIndex === id && ticket.count > 0
          ? { ...ticket, count: ticket.count - 1 }
          : ticket
      )
    );
  };

  useEffect(() => {
    setTickets(
      tickets.map((ticket) => ({
        ...ticket,
        count: ticket.count ?? 0, // ensure unique count per ticket
      }))
    );
  }, [tickets]);

  return (
    <>
      <div className="w-full h-screen flex justify-center items-center px-5 ">
        <div className="max-w-2xl w-2xl  border border-gray-200 rounded-2xl flex flex-col items-center shadow-xl ">
          <h1 className="text-3xl w-full text-center text-white font-bold mb-4 bg-linear-to-r from-secandry  to-[#FF8370] p-5 rounded-t-2xl ">
            Select Your Tickets
          </h1>
          {/* Ticket selection*/}
          <div className="p-5 w-full">
            <div className="flex justify-between items-center mb-2 border-b border-gray-600 pb-5">
              <p className="text-lg md:text-2xl font-bold">Tickets</p>
              <p className="text-lg md:text-2xl font-bold">Price</p>
              <p className="text-lg md:text-2xl font-bold">Quantity</p>
            </div>
            {Eventtickets.map((ticket,index) => (
              <div
                className="flex justify-between items-center border-b border-gray-200 pb-4 pt-2 "
                key={index}
              >
                <div>
                  <h2 className="text-md md:text-lg font-semibold">
                    {ticket.name}
                  </h2>
                  <p className="text-gray-400">remainging: {ticket.quantity}</p>
                </div>
                <div>
                  <span className="text-md md:text-lg font-bold">
                    {ticket.price} EGP
                  </span>
                </div>
                {/* counter of tickets */}
                <div className="flex flex-col md:flex-row gap-x-3 justify-center items-center space-x-4">
                  <button
                    disabled={ticket.count === ticket.quantity}
                    onClick={() => increment(index)}
                    className={`w-6 h-6 mr-0
                        ${
                          ticket.count === ticket.quantity
                            ? "text-gray-600 cursor-not-allowed"
                            : "text-primary cursor-pointer hover:opacity-80"
                        }`}
                  >
                    <Plus className=" border rounded-full" />
                  </button>
                  <p className=" mr-0 ">{ticket.count}</p>
                  <button
                    disabled={ticket.count === 0}
                    onClick={() => decrement(index)}
                    className={`w-6 h-6
                        ${
                          ticket.count === 0
                            ? "text-gray-600 cursor-not-allowed"
                            : "text-primary cursor-pointer hover:opacity-80"
                        }`}
                  >
                    <Minus className=" border rounded-full" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* tickets total price and quntity */}
          <div className="w-full p-5 border-t border-gray-200 flex justify-between items-center">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-lg font-bold text-green-600">
              {Eventtickets.reduce(
                (total, ticket) => total + ticket.count * ticket.price,
                0
              ).toFixed(2)}{" "}
              EGP
            </span>
          </div>
          {/* button to pay */}
          <div className="w-full p-5">
            <button
              disabled={
                Eventtickets.reduce(
                  (total, ticket) => total + ticket.count,
                  0
                ) === 0
              }
              onClick={() =>
                navigate("/payment/confirmation", {
                  state: { tickets: selectedTickets, id: id },
                })
              }
              className="w-full bg-linear-to-r from-primary to-secandry hover:bg-primary/90 text-lg text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition duration-300 disabled:bg-linear-to-r disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed"
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default PayTicketsPage;
