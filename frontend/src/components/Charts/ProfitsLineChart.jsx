import{Chart as ChartJS} from'chart.js/auto';
import { point } from 'leaflet';
import { Weight } from 'lucide-react';

import{Line} from'react-chartjs-2';

const data={
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
        {
            label: 'Profits',
            data: [1200, 1900, 3000, 2500, 3200, 4000, 4500, 4800, 5000, 5500, 6000, 7000],
            backgroundColor: 'rgba(16, 156, 250, 0.3)',
            pointRadius: 4,
            pointHoverRadius: 7,
            pointBackgroundColor: 'rgba(16, 126, 280, 1)',
            fill: true,
            lineTension: 0.1,
            tension: 0.4,
            borderWidth: 3,
            borderColor: 'rgba(16, 126, 280, 1)',
            borderWidth: 2,
        },
    ],
};
const options={
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            labels: {
                color: "#374151", // gray-700
                font: { size: 16 ,weight: 'bold'},
            },
        },
        tooltip: { // Customize tooltip appearance
            backgroundColor: "#111827", // gray-900
            titleColor: "#fff",
            bodyColor: "#d1d5db",
            padding: 10,
            cornerRadius: 6,
        },
    },
    scales: { // Customize axes appearance
        x: {
            ticks: {
                color: "#374151", // gray-700
                font: { size: 12 },
            },
            grid: {
                color: "#374151", // gray-700
            },
        },
        y: {
            ticks: {
                color: "#374151", // gray-700
                font: { size: 12 },
            },
            grid: {
                color: "#374151", // gray-700
            },
        },
    },
};
    export default function ProfitsLineChart() {
        return(<>
            <Line data={data} options={options} /></>);
    }