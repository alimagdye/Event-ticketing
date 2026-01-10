import { Calendar, Clock, Heart, Share2 } from "lucide-react";
import NavigationBar from "../../components/Layout/NavigationBar";
import Footer from "../../components/Layout/Footer";
import OtherEventsSlider from "../../components/Layout/OtherEventsSlider";
import { Title } from "react-head";
import { useEffect, useState } from "react";
import { getEvents } from "../../APIs/eventApis";
import DisplayLocatinMap from "../../components/UI/DisplayLocatinMap";
import Loading from "../../components/Layout/LoadingLayout";
import { extractDateTime } from "../../utils/dateFormater";
import { useNavigate } from "react-router-dom";
import ErrorDialog from "../../components/Dialogs/ErrorDialog";
import { useUser } from "../../Context/AuthProvider";

export default function EventPage({ organizer, eventinfo, review = false }) {
  const [event, setEvent] = useState(eventinfo || {});
  const [loading, setloading] = useState(false);
  const [dateFormat, setDateFormat] = useState([]);
  const [timeFormat, setTimeFormat] = useState([]);
  const [openDialog, setopenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const navigate = useNavigate();
  const { user } = useUser();

  const handleLoadEvents = async () => {
    try {
            // console.log("Oid",event.organizerId ,"user  ",user)

      if (review) return;
      setloading(true);
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get("id");
      const response = await getEvents({ id: id });

      setEvent(response.data.data.event);
      const eventSessions =
        response.data.data.event?.eventSessions || eventinfo?.sessions;

      const dateArray = [];
      const timeArray = [];

      for (const session of eventSessions) {
        const startDateTime = session.startDate;
        const endDateTime = session.endDate;

        const { date: startDate, time: startTime } =
          extractDateTime(startDateTime);
        const { date: endDate, time: endTime } = extractDateTime(endDateTime);

        dateArray.push({
          startDate,
          startTime,
          endDate,
          endTime,
        });

        timeArray.push(`${startTime} - ${endTime}`);
      }

      setDateFormat(dateArray);
      setTimeFormat(timeArray);
    } catch (error) {
      const message =
        error.response?.data?.error ||
        "Something went wrong while fetching event data.";
      setDialogMessage(message);
      setopenDialog(true);
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    handleLoadEvents();
  }, []);
  const description = ` 
Get ready to kick off the Christmas season in Mumbai with SOUND OF
CHRISTMAS - your favourite LIVE Christmas concert!
          
          
City Youth Movement invites you to the 4th edition of our annual
Christmas festivities - by the youth and for the youth! Featuring
worship leaders, carols, quizzes and exciting surprises!
          
          
Bring your family and friends and sing along on 2nd December, 6:30

PM onwards!
          

 3 Reasons to attend:
          
The FIRST Christmas concert of Mumbai!
A special Christmas Choir!
Special Dance performances and surprises!`;
  return (
    <>
      <Title>{event.title}</Title>

      <div className="w-full bg-white text-black p-4 max-w-350 mx-auto">
        {/* Header Image */}
        <img
          src={event.bannerUrl || eventinfo?.preview || "/images/login.jpg"}
          alt="Event Banner"
          crossOrigin="anonymous"
          className="w-full h-60 rounded-xl mb-6"
        />

        {/* Title + Icons */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">
            {event.title || eventinfo?.title || "Sound Of Christmas 2023"}
          </h1>
          <div className="flex flex-col md:flex-row gap-8 text-2xl">
            <button className="cursor-pointer">
              <Share2 size={30} />
            </button>
            <button className="cursor-pointer">
              <Heart size={30} />{" "}
            </button>
          </div>
        </div>

        {/* Date & Time */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Date and Time</h2>

          {dateFormat.length > 0 ? (
            dateFormat.map((dateItem, index) => (
              <div key={index} className="mb-4 space-y-2">
                {/* Date */}
                <p className="flex gap-4 items-center">
                  <Calendar />
                  <span>{dateItem.startDate}</span>
                </p>

                {/* Time */}
                <p className="flex gap-4 items-center pl-8 text-gray-500">
                  <Clock />
                  <span>{timeFormat[index] || "6:30 PM - 9:30 PM"}</span>
                </p>
              </div>
            ))
          ) : (
            <div className="space-y-2">
              <p className="flex gap-4 items-center">
                <Calendar />
                Saturday, 2 December 2023
              </p>

              <p className="flex gap-4 items-center pl-8 text-gray-500">
                <Clock />
                6:30 PM - 9:30 PM
              </p>
            </div>
          )}
        </div>

        {/* Ticket Info */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Ticket Information</h2>
          {event.ticketTypes?.length > 0
            ? event.ticketTypes?.map((ticket, index) => (
              <p className="text-lg  pl-3 mb-2" key={index}>
                  {" "}
                  {`${ticket.name}: ${ticket.price}EGP `}
                </p>
              )) || "No tickets available"
              : eventinfo?.tickets?.map((ticket, index) => (
                <p className="text-lg  pl-3 mb-2" key={index}>
                  {" "}
                  {`${ticket.name}: ${ticket.price}EGP `}
                </p>
              )) || "No tickets available"}
        </div>

              {/* Ticket Button */}

        { user.id  ? (
          <button
            onClick={() =>
              navigate(`/payment/tickets?id=${event.id}`, {
                state: { tickets: event.ticketTypes, id: event.id || [] },
              })
            }
            className="bg-pink-500 text-white px-6 py-3 rounded-lg shadow mb-6 cursor-pointer transition-all hover:bg-[#FF8370]"
          >
            Buy Tickets
          </button>
        ) : (
          <p className="text-lg  pl-3 mb-2 text-red-600">
            You can't buy tickets without signing in .{" "}
          </p>
        )}
        {/* Location */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 ">Location</h2>
          <p className="mb-3 select-all">
            {event.venue?.address ||
              eventinfo?.location?.address ||
              `Bal Gandharva Rang Mandir, Near Junction Of 24th & 32nd Road &
            Patwardhan Park, Off Linking Road, Bandra West, Mumbai, India`}
          </p>
          <div className="w-full">
            <DisplayLocatinMap
              lat={event.venue?.latitude || eventinfo?.location?.latitude}
              lon={event.venue?.longitude || eventinfo?.location?.longitude}
              name={event.venue?.address || eventinfo?.location?.address}
            />
          </div>
        </div>

        {/* Hosted By */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Hosted by</h2>
          <div className="flex items-center gap-3">
            <img src="/images/Charity.jpg" className="w-12 h-12 rounded-full" />
            <div>
              <p className="font-semibold">City Youth Movement{organizer}</p>
              <div className="flex gap-2 mt-1">
                <button className="border px-2 py-1 rounded cursor-pointer">
                  Contact
                </button>
                <button className="border px-2 py-1 rounded bg-gray-900 text-white cursor-pointer">
                  + Follow
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Event Description</h2>
          <p className="whitespace-pre-wrap">
            {event.description || eventinfo?.description}
          </p>
        </div>

        {/* Tags */}
        {/* <div className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {["Holiday Concert", "Live Performance", "Seasonal Event", "Family-Friendly", "#Christmas_Spirit", "#Christmas_Carols"].map((tag) => (
            <span key={tag} className="bg-gray-200 px-3 py-1 rounded-full text-sm">
              {tag}
            </span>
          ))}
          </div>
      </div> */}
        <hr className="text-gray-400 mt-10 " />
      </div>

      {openDialog && (
        <ErrorDialog
          open={openDialog}
          message={dialogMessage}
          onClose={() => setopenDialog(false)}
        />
      )}
      {loading && <Loading />}
    </>
  );
}
