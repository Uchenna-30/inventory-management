import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto'; // Import chart.js

export const ULineChart = () => {
    // Sample data for the chart
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
            {
                label: 'Controlled Drugs',
                data: [12, 19, 30, 25, 35, 45, 40],
                borderColor: '#FF6384',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.4,
            },
            {
                label: 'Pharmacy Medicines',
                data: [18, 22, 35, 28, 42, 40, 32],
                borderColor: '#36A2EB',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                tension: 0.4,
            },
            {
                label: 'Prescription Only Medicines',
                data: [10, 25, 35, 40, 28, 25, 32],
                borderColor: '#4BC0C0',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
            }
        ]
    };

    // Chart options for customization
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#000',
                }
            },
            y: {
                grid: {
                    color: '#ddd',
                },
                ticks: {
                    color: '#000',
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: '#000',
                },
            },
        },
    };

    return (
        <div style={{ width: '100%', height: '300px' }}>
            <h3>Average Inventory Turnaround</h3>
            <Line data={data} options={options} />
        </div>
    );
};

// export default ULineChart;
