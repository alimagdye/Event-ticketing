import { Bar } from "react-chartjs-2"
import "chart.js/auto"



const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {

        display: false,


    },
    tooltip: { // Customize tooltip appearance
      backgroundColor: "#111827", // gray-900
      titleColor: "#fff",
      bodyColor: "#d1d5db",
      padding: 10,
      cornerRadius: 6,
    },
  },
  scales: { // Customize axes 
    x: {
      grid: { display: false },
      ticks: {
        color: "#6b7280", // gray-500
      },
    },
    y: {
      grid: {
        color: "#e5e7eb", // gray-200
      },
      ticks: {
        color: "#6b7280",
      },
    },
  },
}

export default function BarChart({data ,labels}) {
const setdata = {
  labels: labels,
  datasets: [
    
    {

      label: "Tickets Sold",
      // data: [30, 20, 10, 40, 50, 60, 70, 80, 90, 100, 110, 120],
      data: data,
      backgroundColor: ["#BB52E0"  ,"#FF8370" , "#FF49B5"],
      titleColor: "#fff",

      labelColor: "#fff",
      borderRadius: 8,
      barThickness: 30,
    },
    // {
    //   label: "",
    //   backgroundColor: ["#BB52E0"  ,"#FF8370" , "#FF49B5"],
    // },
    // {
    //   label: "",
    //   backgroundColor: ["#BB52E0"  ,"#FF8370" , "#FF49B5"],
    // }
  ],
}
  return (
      <Bar data={setdata} options={options}  />
  )
}
