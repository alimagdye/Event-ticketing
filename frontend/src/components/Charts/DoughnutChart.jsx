import {Chart as ChartJS} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';


const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: "#374151", // gray-700
        font: { size: 12 ,weight: 'bold' },
      },
    },
    tooltip: { // Customize tooltip appearance
      backgroundColor: "#111827", // gray-900
      titleColor: "#fff",
      bodyColor: "#d1d5db",
    },
  },
};
export default function DoughnutChart({data}) {
const setdata = {
  labels: ['Active', 'Canceled' ,'Upcoming'],
  datasets: [
    {
      label: ['Number of events'],
      data: data,
      backgroundColor: [
        'rgba(26, 197, 4, 0.756)',
        'rgba(197, 4, 4, 0.756)',
        'rgba(10, 4, 197, 0.756)',

      ],
      borderColor: [
        'rgba(46, 197, 4, 1)',
        'rgba(197, 4, 4, 1)',
        'rgba(10, 4, 197, 1)',

      ],
      borderWidth: 1,
    },
  ],
};



  return (
    <Doughnut data={setdata } options={options} />
  );
}