import { Calendar, Clock, Heart, Share2 } from "lucide-react";
import NavigationBar from "../../components/Layout/NavigationBar";
import Footer from "../../components/Layout/Footer";
import OtherEventsSlider from "../../components/Layout/OtherEventsSlider";
import { Title } from "react-head";
import { useEffect, useState } from "react";
import { getEvents } from "../../APIs/eventApis";
import DisplayLocatinMap from "./../../components/UI/DisplayLocatinMap";
import Loading from "./../../components/Layout/LoadingLayout";
import { extractDateTime } from "../../utils/dateFormater";
import { useNavigate } from "react-router-dom";
import ErrorDialog from "./../../components/Dialogs/ErrorDialog";
import { useUser } from "../../Context/AuthProvider";
import { Link } from "react-router";
import { BuyerSeatMap } from "./../../components/UI/BuyerSeatMap";
import { ReservationTimer } from "./../../components/UI/ReservationTimer";
import { Button } from "./../../components/shadcn/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./../../components/shadcn/card";
import { Tabs, TabsList, TabsTrigger } from "./../../components/shadcn/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./../../components/shadcn/dialog";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

const RESERVATION_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

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
      if (response.data.data.event.hasSeatMap) {
        const storedRows = parseInt(
          response.data.data.event.eventSeatTier[0].numberOfRows,
        );
        const storedSeatsPerRow = parseInt(
          response.data.data.event.eventSeatTier[0].numberOfColumns,
        );

        const storedSeats = response.data.data.event.eventSeat.map((seat) => ({
          row: seat.rowIndex,
          number: seat.seatIndex,
          tierId: seat.tierNumber ? `${seat.tierNumber}` : null,
          status: seat.isSold ? "sold" : "available",
        }));

        const storedTiers = response.data.data.event.eventSeatTier.map(
          (tier) => ({
            id: `${tier.tierNumber}`,
            name: tier.name,
            price: parseFloat(tier.price),
            color: tier.color,
          }),
        );
        setPriceTiers(storedTiers);
        setRows(parseInt(storedRows));
        setSeatsPerRow(parseInt(storedSeatsPerRow));
        setSeats(storedSeats);
      }
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

  const [seats, setSeats] = useState([]);
  const [priceTiers, setPriceTiers] = useState([]);
  const [rows, setRows] = useState(8);
  const [seatsPerRow, setSeatsPerRow] = useState(12);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [viewMode, setViewMode] = useState("pricing");
  const [reservationExpiry, setReservationExpiry] = useState(null);
  const [showReservationDialog, setShowReservationDialog] = useState(false);

  // Check for expired reservations
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setSeats((prev) =>
        prev.map((seat) => {
          if (
            seat.status === "reserved" &&
            seat.reservedUntil &&
            seat.reservedUntil < now
          ) {
            return { ...seat, status: "available", reservedUntil: undefined };
          }
          return seat;
        }),
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSeatClick = (row, number) => {
    const seat = seats.find((s) => s.row === row && s.number === number);
    if (!seat || seat.status !== "available") return;

    setSelectedSeats((prev) => {
      const isAlreadySelected = prev.some(
        (s) => s.row === row && s.number === number,
      );
      if (isAlreadySelected) {
        return prev.filter((s) => !(s.row === row && s.number === number));
      } else {
        return [...prev, seat];
      }
    });
  };

  const handleReserve = () => {
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat");
      return;
    }

    const expiryTime = Date.now() + RESERVATION_DURATION;
    setReservationExpiry(expiryTime);

    // Mark seats as reserved
    setSeats((prev) =>
      prev.map((seat) => {
        const isSelected = selectedSeats.some(
          (s) => s.row === seat.row && s.number === seat.number,
        );
        if (isSelected) {
          return { ...seat, status: "reserved", reservedUntil: expiryTime };
        }
        return seat;
      }),
    );

    setShowReservationDialog(true);
    toast.success(`${selectedSeats.length} seat(s) reserved for 10 minutes`);
  };

  const handleReservationExpire = () => {
    // Release reserved seats
    setSeats((prev) =>
      prev.map((seat) => {
        const isSelected = selectedSeats.some(
          (s) => s.row === seat.row && s.number === seat.number,
        );
        if (isSelected && seat.status === "reserved") {
          return { ...seat, status: "available", reservedUntil: undefined };
        }
        return seat;
      }),
    );

    setSelectedSeats([]);
    setReservationExpiry(null);
    setShowReservationDialog(false);
    toast.error("Reservation expired. Seats have been released.");
  };

  const handleBuyNow = () => {
    // Mark seats as sold
    setSeats((prev) =>
      prev.map((seat) => {
        const isSelected = selectedSeats.some(
          (s) => s.row === seat.row && s.number === seat.number,
        );
        if (isSelected) {
          return { ...seat, status: "sold", reservedUntil: undefined };
        }
        return seat;
      }),
    );

    const total = calculateTotal();
    const tickets = selectedSeats.map((seat) => {
      const tier = priceTiers.find((t) => t.id === seat.tierId);
      return {
        name: `Row ${String.fromCharCode(65 + seat.row)}, Seat ${seat.number + 1} (${tier?.name || "General"})`,
        price: tier?.price || 0,
        count: 1,
        seatInfo: {
          row: seat.row,
          number: seat.number,
          tierId: seat.tierId,
          tierName: tier?.name,
        },
      };
    });
    navigate("/payment/confirmation", {
      state: { tickets, id: event.id },
    });
    toast.success(`Purchase successful! Total: $${total}`);
    setSelectedSeats([]);
    setReservationExpiry(null);
    setShowReservationDialog(false);
  };

  const calculateTotal = () => {
    return selectedSeats.reduce((sum, seat) => {
      const tier = priceTiers.find((t) => t.id === seat.tierId);
      return sum + (tier?.price || 0);
    }, 0);
  };

  const getAvailabilityStats = () => {
    const available = seats.filter(
      (s) => s.status === "available" && s.tierId,
    ).length;
    const sold = seats.filter((s) => s.status === "sold").length;
    const reserved = seats.filter((s) => s.status === "reserved").length;
    const total = seats.filter((s) => s.tierId).length;

    return { available, sold, reserved, total };
  };

  const stats = getAvailabilityStats();

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
        {event?.hasSeatMap ? (
          /* ======================= SEAT MAP UI ======================= */

          <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8 flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    Ticket information
                  </h1>
                  <p className="text-gray-600">
                    Select your seats and complete your purchase
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                  {/* View Mode Toggle */}
                  <Card>
                    <CardHeader>
                      <CardTitle>View Mode</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Tabs
                        value={viewMode}
                        onValueChange={(v) => setViewMode(v)}
                      >
                        <TabsList
                          className="
      grid w-full grid-cols-2
      bg-gray-200
      rounded-xl
      p-1
    "
                        >
                          <TabsTrigger
                            value="pricing"
                            className="
        rounded-lg
        text-gray-700
        data-[state=active]:bg-white
        data-[state=active]:text-black
        data-[state=active]:shadow-sm
        transition-all
      "
                          >
                            Pricing
                          </TabsTrigger>

                          <TabsTrigger
                            value="availability"
                            className="
        rounded-lg
        text-gray-700
        data-[state=active]:bg-white
        data-[state=active]:text-black
        data-[state=active]:shadow-sm
        transition-all
      "
                          >
                            Availability
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </CardContent>
                  </Card>

                  {/* Legend */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Legend</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {viewMode === "pricing" ? (
                        <>
                          {priceTiers.map((tier) => (
                            <div
                              key={tier.id}
                              className="flex items-center gap-3"
                            >
                              <div
                                className="w-6 h-6 rounded border-2 border-gray-400"
                                style={{ backgroundColor: tier.color }}
                              />
                              <div className="flex-1">
                                <div className="font-medium">{tier.name}</div>
                                <div className="text-sm text-gray-600">
                                  ${tier.price}
                                </div>
                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded border-2 border-gray-400 bg-[#22c55e]" />
                            <span>Available</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded border-2 border-gray-400 bg-[#ef4444]" />
                            <span>Sold</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded border-2 border-gray-400 bg-[#f59e0b]" />
                            <span>Reserved</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded border-2 border-blue-700 bg-[#3b82f6]" />
                            <span>Your Selection</span>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  {/* Statistics */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Seat Availability</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">
                            Available
                          </span>
                          <span className="font-bold text-green-600">
                            {stats.available}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">Sold</span>
                          <span className="font-bold text-red-600">
                            {stats.sold}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            Reserved
                          </span>
                          <span className="font-bold text-amber-600">
                            {stats.reserved}
                          </span>
                        </div>
                      </div>
                      <div className="border-t pt-4">
                        <div className="text-sm text-gray-600">Total Seats</div>
                        <div className="text-2xl font-bold">{stats.total}</div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Selected Seats */}
                  {selectedSeats.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          Selected Seats ({selectedSeats.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="max-h-40 overflow-y-auto space-y-2">
                          {selectedSeats.map((seat) => {
                            const tier = priceTiers.find(
                              (t) => t.id === seat.tierId,
                            );
                            return (
                              <div
                                key={`${seat.row}-${seat.number}`}
                                className="flex justify-between items-center text-sm"
                              >
                                <span>
                                  Row {String.fromCharCode(65 + seat.row)}, Seat{" "}
                                  {seat.number + 1}
                                </span>
                                <span className="font-medium">
                                  ${tier?.price || 0}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        <div className="border-t pt-3 flex justify-between items-center">
                          <span className="font-semibold">Total</span>
                          <span className="text-xl font-bold text-green-600">
                            ${calculateTotal()}
                          </span>
                        </div>
                        {user?.id ? (
                          !reservationExpiry && (
                            <Button
                              onClick={handleReserve}
                              className="w-full"
                              size="lg"
                            >
                              <Clock className="w-4 h-4 mr-2" />
                              Reserve for 10 Minutes
                            </Button>
                          )
                        ) : (
                          <p className="text-lg pl-3 mb-2 text-red-600">
                            You can't reserve tickets without signing in.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Reservation Timer */}
                  {reservationExpiry && (
                    <ReservationTimer
                      expiresAt={reservationExpiry}
                      onExpire={handleReservationExpire}
                    />
                  )}

                  {/* Buy Button */}
                  {user?.id ? (
                    reservationExpiry && (
                      <Button
                        onClick={handleBuyNow}
                        className="w-full"
                        size="lg"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Complete Purchase - ${calculateTotal()}
                      </Button>
                    )
                  ) : (
                    <p className="text-lg pl-3 mb-2 text-red-600">
                      You can't buy tickets without signing in.
                    </p>
                  )}
                </div>

                {/* Main Content - Seat Map */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Venue Seating Map</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto pb-4">
                        <BuyerSeatMap
                          seats={seats}
                          rows={rows}
                          seatsPerRow={seatsPerRow}
                          priceTiers={priceTiers}
                          onSeatClick={handleSeatClick}
                          selectedSeats={selectedSeats}
                          viewMode={viewMode}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Reservation Confirmation Dialog */}
            <Dialog
              open={showReservationDialog}
              onOpenChange={setShowReservationDialog}
            >
              <DialogContent className="!bg-white">
                <DialogHeader>
                  <DialogTitle>Seats Reserved!</DialogTitle>
                  <DialogDescription>
                    Your {selectedSeats.length} seat(s) have been reserved for
                    10 minutes. Please complete your purchase before the timer
                    expires, or your seats will be released and become available
                    to other customers. 3 times of failing to complete the
                    purchase within the reservation time may result in a block
                    of your account.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 mt-4">
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-amber-900">
                          Timer Started
                        </p>
                        <p className="text-sm text-amber-700 mt-1">
                          Complete your purchase within 10 minutes to secure
                          your seats.
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button onClick={() => setShowReservationDialog(false)}>
                    Continue to Purchase
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          /* ======================= NORMAL TICKET UI ======================= */
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Ticket Information</h2>

              {event?.ticketTypes?.length > 0 ? (
                event.ticketTypes.map((ticket) => (
                  <p className="text-lg pl-3 mb-2" key={ticket.id}>
                    {`${ticket.name}: ${ticket.price} EGP`}
                  </p>
                ))
              ) : eventinfo?.tickets?.length > 0 ? (
                eventinfo.tickets.map((ticket, index) => (
                  <p className="text-lg pl-3 mb-2" key={index}>
                    {`${ticket.name}: ${ticket.price} EGP`}
                  </p>
                ))
              ) : (
                <p>No tickets available</p>
              )}
            </div>

            {/* Ticket Button */}
            {user?.id ? (
              <button
                onClick={() =>
                  navigate(`/payment/tickets?id=${event.id}`, {
                    state: { tickets: event.ticketTypes || [], id: event.id },
                  })
                }
                className="bg-pink-500 text-white px-6 py-3 rounded-lg shadow mb-6 cursor-pointer transition-all hover:bg-[#FF8370]"
              >
                Buy Tickets
              </button>
            ) : (
              <p className="text-lg pl-3 mb-2 text-red-600">
                You can't buy tickets without signing in.
              </p>
            )}
          </>
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
