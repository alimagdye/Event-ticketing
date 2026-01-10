import { User } from "lucide-react";
import { getStatsOrgainzerDashboard } from "../../../APIs/organizerDashboardAPIs";
import { useEffect, useState } from "react";
import ErrorDialog from "../../../components/Dialogs/ErrorDialog";
import Loading from "../../../components/Layout/LoadingLayout";


export default function OrganizerOverviewPage() {
  const [overviewData, setOverviewData] = useState();
    const [openDialog, setopenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [loading, setloading] = useState(false);
  
  const getData = async () => {
    try {
      setloading(true);
      const response = await getStatsOrgainzerDashboard();
      // console.log(response.data.data.data);
      setOverviewData(response.data.data.data);
    } catch (error) {
            const message =
        error.response?.data?.message || "Something went wrong";
      setDialogMessage(message);
      setopenDialog(true);
    }
    finally {
      setloading(false);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Total Events</p>
          <h3 className="text-2xl font-bold">{overviewData?.event?.totalEvents}</h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Active Events</p>
          <h3 className="text-2xl font-bold">{overviewData?.event?.activeEvents}</h3>
        </div>

        <div className="bg-white p-6 3/3 rounded-xl shadow">
          <p className="text-gray-500">Upcoming Events</p>
          <h3 className="text-2xl font-bold">{overviewData?.event?.upcomingEvents}</h3>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white border-primary border p-6 3/3 rounded-xl shadow h-50 flex flex-col justify-center items-center text-2xl">
          <p className="text-gray-400 mb-4">Total Revenue</p>
          <h3 className="text-3xl font-bold flex items-center gap-2">
             {overviewData?.revenue?.totalRevenue} EGY
          </h3>
        </div>
        <div className="bg-white border-primary border p-6 3/3 rounded-xl shadow h-50 flex flex-col justify-center items-center text-2xl">
          <p className="text-gray-400 mb-4">Sold Tickets</p>
          <h3 className="text-3xl font-bold">{overviewData?.ticket?.soldTickets}</h3>
        </div>
      </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">remaining Tickets</p>
          <h3 className="text-2xl font-bold">{overviewData?.ticket?.remainingTickets}</h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">completed Orders</p>
          <h3 className="text-2xl font-bold">{overviewData?.order?.completedOrders}</h3>
        </div>

        <div className="bg-white p-6 3/3 rounded-xl shadow">
          <p className="text-gray-500">total Orders</p>
          <h3 className="text-2xl font-bold">{overviewData?.order?.totalOrders}</h3>
        </div>
      </div>
             {openDialog && <ErrorDialog open={openDialog} message={dialogMessage} onClose={() => setopenDialog(false)} />}
            {loading && <Loading />}
    </div>
  );
}
