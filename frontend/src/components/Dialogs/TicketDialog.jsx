import { X } from "lucide-react";
import Dialog from "../UI/Dialog";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef } from "react";

function TicketDialog({ open, onClose, ticket }) {
  const inputRef = useRef(null);
  const handleDownloadPDF = async () => {
    const element = inputRef.current;
    if (!element) return;

    // save original styles
    const originalWidth = element.style.width;
    const originalHeight = element.style.height;

    // force fixed size
    element.style.width = "535px";
    element.style.height = "518px";

    const canvas = await html2canvas(element, {
      scale: 2, // improves quality
      useCORS: true,
    });

    // restore styles
    element.style.width = originalWidth;
    element.style.height = originalHeight;

    const imgData = canvas.toDataURL("image/jpeg", 1.0);

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [535, 518], // SAME SIZE as ticket
    });

    pdf.addImage(imgData, "JPEG", 0, 0, 535, 518);
    pdf.save(ticket.eventName + " ticket.pdf");
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-300 hover:text-gray-800 transition duration-300 ease-in-out"
      >
        <X size={24} />
      </button>

      <h3 className="text-3xl text-center text-shadow-2xs text-shadow-gray-600 font-semibold mb-4 ">
        {ticket.eventName}
      </h3>
      <div
        key={ticket.id}
        ref={inputRef}
        className="border rounded-xl max-w-xl shadow-lg flex flex-col items-center text-center overflow-hidden m-auto "
      >
        {/* QR */}
        <div className="w-40 h-40 sm:w-48 sm:h-48 mt-8 mb-8">
          <QRCode value={ticket.qrValue} className="w-full h-full" />
        </div>

        {/* Info */}
        <h3 className="text-lg sm:text-xl font-bold ">{ticket.eventName}</h3>
        <div className="py-4 px-4 flex flex-col items-start gap-3 ">
          <p className=" text-sm sm:text-base">Date: {ticket.date}</p>

          <p className=" text-sm sm:text-base">Seats: {ticket.seats}</p>

          <p className=" text-sm sm:text-base">Location: {ticket.location}</p>
          <p className=" text-sm sm:text-base">
            Ticket Status: {ticket.status}
          </p>
          <p className=" text-sm sm:text-base">organizer: {ticket.organizer}</p>
        </div>
        <footer className="w-full border-t border-[#ebe6e7] pt-2 pb-3 px-2 text-start text-xs font-light " style={{color: '#99a1af' }}>
          © 2026 Fa3liat
        </footer>
      </div>
      <button
        onClick={handleDownloadPDF}
        className="px-6 rounded-xl bg-primary text-white py-3 flex items-center justify-center gap-2 hover:bg-primary/80 transition m-auto mt-6"
      >
        Download as PDF
      </button>
    </Dialog>
  );
}

export default TicketDialog;
