import "./featured.scss";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const Featured = () => {
  const citiesData = {
    labels: ['Mimai', 'New York', 'Washington', 'California', 'Chicago'],
    datasets: [
      {
        label: 'Cities',
        data: [100, 80, 60, 50, 40],
        backgroundColor: '#87CEFA',
        borderRadius: 10, // Rounded bar edges
        borderSkipped: false,
      },
    ],
  };

  const citiesOptions = {
    indexAxis: 'y', // Horizontal bar
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Top Cities' },
    },
    scales: {
      x: {
        ticks: { stepSize: 20 },
      },
    },
  };

  // Data for Inventory Stock chart
  const stockData = {
    labels: ['Paracetamol', 'Aspirin', 'Ibuprofen', 'Diclofenac', 'Gabapentin'],
    datasets: [
      {
        label: 'In',
        data: [40, 50, 45, 60, 50],
        backgroundColor: '#4B0082',
      },
      {
        label: 'Low',
        data: [15, 20, 18, 25, 22],
        backgroundColor: '#9370DB',
      },
      {
        label: 'Out',
        data: [5, 8, 6, 10, 8],
        backgroundColor: '#87CEFA',
      },
    ],
  };

  const stockOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
      title: { display: true, text: 'Inventory Stock' },
    },
    scales: {
      x: { stacked: true },
      y: { stacked: true },
    },
  };
  return (
    <div className="featured">
      {/* <Bar data={citiesData} options={citiesOptions} /> */}
      <Bar data={stockData} options={stockOptions} />
    </div>
  );
};

export default Featured;
