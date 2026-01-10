import { use, useEffect, useState } from "react";
import { getAnalyticsOrgainzerDashboard } from "../../../APIs/organizerDashboardAPIs";
import BarChart from "../../../components/Charts/BarChart";

import ProfitsLineChart from "../../../components/Charts/ProfitsLineChart";
import DoughnutChart from "../../../components/Charts/DoughnutChart";
import ErrorDialog from "../../../components/Dialogs/ErrorDialog";
import Loading from "../../../components/Layout/LoadingLayout";


export default function OrganizerAnalyticsPage() {
  const [analyticsData, setanalyticsData] = useState({});
    const [openDialog, setopenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [loading, setloading] = useState(false);
    const getAnalyticsData = async () => {
      try {
          setloading(true);
          const response= await getAnalyticsOrgainzerDashboard();
          // console.log("data",response);
          setanalyticsData(response.data.data.data);
      } catch (error) {
             const message =
        error.response?.data?.message || "Something went wrong";
      setDialogMessage(message);
      setopenDialog(true);
      }
      finally{
        setloading(false);
      }
    }
    useEffect(() => {
      getAnalyticsData();
    }, []);

  return (<>
      <h2 className="text-3xl font-bold mb-6">Analytics</h2>
    <div className=" grid grid-cols-1 md:grid-cols-2 overflow-y-auto max-h-140 h-full gap-6">


      {/* tickets Statistics */}
      <div className="bg-white p-6 rounded-xl shadow grid">
        <p className="text-gray-500 mb-2"> selling tickets Statistics </p>
        <div className="h-45 flex items-center justify-center text-gray-400">
          <BarChart  data={analyticsData?.ticket?.data||[]} labels={['Total Orders', 'Completed Orders', 'Pending Orders', 'Cancelled Orders']} />
        </div>
      </div>
      {/* Events Statistics */}
      <div className="bg-white p-6 rounded-xl shadow grid">
        <p className="text-gray-500 mb-2">Events Statistics</p>
        <div className="h-45 flex items-center justify-center text-gray-400">
          <DoughnutChart data={analyticsData?.event?.data||[]} />
        </div>
      </div>
      {/* orders Statistics */}
      <div className="bg-white p-6 rounded-xl shadow-[5px_2px_15px_-10px] col-span-2">
        <p className="text-gray-500 mb-2">Orders Statistics</p>
        <div className="h-45 flex items-center justify-center text-gray-400">
          {/* <ProfitsLineChart  /> */}
          <BarChart data={analyticsData?.order?.data||[]} labels={['Total Orders', 'Completed Orders', 'Pending Orders', 'Cancelled Orders']} />
        </div>
      </div>
      {openDialog && <ErrorDialog open={openDialog} message={dialogMessage} onClose={() => setopenDialog(false)} />}
        {loading && <Loading />}
    </div>
  </>
  );
}
