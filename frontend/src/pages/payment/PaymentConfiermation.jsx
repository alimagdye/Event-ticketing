import { useLocation } from "react-router-dom";
import { getOrderStatus } from "../../APIs/orderApis";
import { checkoutEvent } from "../../APIs/eventApis";
import Loading from "../../components/Layout/LoadingLayout";
import ErrorDialog from "../../components/Dialogs/ErrorDialog";
import { useState } from "react";

function ConfirmTicketsPage() {

    const [openDialog, setopenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [loading, setloading] = useState(false);
  const { state } = useLocation();
  const tickets = state?.tickets || [];
  const id = state?.id;

  const subtotal = tickets.reduce((sum, t) => sum + t.price * t.count, 0);

  const tax = subtotal * 0.07;
  const total = subtotal + tax;

  const handleConfirm = async () => {
    try {
      setloading(true);
      const payload = {
        tickets: tickets.map((ticket) => ({
          name: ticket.name,
          quantity: ticket.count,
        })),
      };
      // console.log("first ", id);
      const response = await checkoutEvent(payload, parseInt(id));

      // console.log(response);
      window.location.href = response.data.data.stripeUrl;
    } catch (error) {
      console.log(error)
      setDialogMessage(error.response?.data?.message || "Error confirming order");
      setopenDialog(true);
      // console.error("Error confirming order:", error);
    }finally {
      setloading(false);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center px-5">
      <div className="max-w-2xl w-full border border-gray-200 rounded-2xl shadow-xl">
        <h1 className="text-3xl text-center text-white font-bold bg-linear-to-r from-secandry to-[#FF8370] p-5 rounded-t-2xl">
          Confirm Your Tickets
        </h1>

        {/* Selected Tickets */}
        <div className="p-5">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="flex justify-between items-center mb-4 border-b border-gray-300 pb-3"
            >
              <div>
                <h2 className="font-semibold">{ticket.name}</h2>
                <p className="text-gray-400">
                  {ticket.count} × {ticket.price} EGP
                </p>
              </div>
              <span className="font-bold">
                {ticket.count * ticket.price} EGP
              </span>
            </div>
          ))}
        </div>

        {/* Price Summary */}
        <div className="p-5 border-t space-y-2">
          <div className="flex justify-between text-gray-500">
            <span>Subtotal</span>
            <span>{subtotal.toFixed(2)} EGP</span>
          </div>

          <div className="flex justify-between text-gray-500">
            <span>Tax (7%)</span>
            <span>{tax.toFixed(2)} EGP</span>
          </div>

          <div className="flex justify-between text-lg font-bold text-green-600">
            <span>Total</span>
            <span>{total.toFixed(2)} EGP</span>
          </div>
        </div>

        {/* Confirm Button */}
        <div className="p-5">
          <button
            onClick={handleConfirm}
            className="w-full bg-linear-to-r from-primary to-secandry text-white py-3 rounded-lg font-semibold cursor-pointer"
          >
            Confirm & Pay
          </button>
        </div>
      </div>
            {openDialog && <ErrorDialog open={openDialog} message={dialogMessage} onClose={() => setopenDialog(false)} />}
              {loading && <Loading />}
    </div>
  );
}

export default ConfirmTicketsPage;
