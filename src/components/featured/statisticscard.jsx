import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const StatisticsCard = () => {
    // Data for the progress circles
    const totalOrders = 415000; // $415k
    const ordersSent = 25;
    const totalOrdersCount = 65;
    const ordersPicked = 12;
  
    // Data for the bar chart
    const barData = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      datasets: [
        {
          label: 'Orders',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          borderColor: '#ffffff',
          borderWidth: 1,
        },
      ],
    };
  
    const barOptions = {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#fff',
          },
        },
        x: {
          ticks: {
            color: '#fff',
          },
        },
      },
    };
  
    return (
      <div style={styles.cardContainer}>
        <h3 style={styles.header}>Statistics</h3>
        <div style={styles.circularContainer}>
          <div style={styles.circularItem}>
            <CircularProgressbar
              value={totalOrders / 10000}
              text={`$${(totalOrders / 1000).toFixed(1)}k`}
              styles={buildStyles({
                textColor: '#fff',
                pathColor: '#fff',
                trailColor: '#3a5fcf',
              })}
            />
            <p style={styles.label}>Total Orders</p>
          </div>
          <div style={styles.circularItem}>
            <CircularProgressbar
              value={(ordersSent / totalOrdersCount) * 100}
              text={`${ordersSent} out of ${totalOrdersCount}`}
              styles={buildStyles({
                textColor: '#fff',
                pathColor: '#fff',
                trailColor: '#3a5fcf',
              })}
            />
            <p style={styles.label}>Orders Sent</p>
          </div>
          <div style={styles.circularItem}>
          <CircularProgressbar
              value={(ordersSent / totalOrdersCount) * 100}
              text={`${ordersSent} out of ${totalOrdersCount}`}
              styles={buildStyles({
                textColor: '#fff',
                pathColor: '#fff',
                trailColor: '#3a5fcf',
              })}
            />
            <p style={styles.label}>Orders Picked</p>
          </div>
        </div>
        <div style={styles.bottomSection}>
          <div style={styles.chartContainer}>
            <Bar data={barData} options={barOptions} />
          </div>
          <button style={styles.button}>View More</button>
        </div>
      </div>
    );
  };

  const styles = {
    cardContainer: {
      backgroundColor: '#3a5fcf',
      color: 'white',
      padding: '20px',
      borderRadius: '15px',
      width: '400px',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
    },
    header: {
      marginBottom: '20px',
    },
    circularContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '20px',
    },
    circularItem: {
      width: '80px',
    },
    label: {
      marginTop: '10px',
      fontSize: '14px',
    },
    // bottomSection: {
    //   display: 'flex',
    //   justifyContent: 'space-between', // Ensure elements align side by side
    //   alignItems: 'center',            // Vertically center the items
    //   marginTop: '20px',
    // },
    chartContainer: {
      flex: 1, // Takes up the remaining space
      marginRight: '10px', // Spacing between chart and button
    },
    button: {
      backgroundColor: '#fff',
      color: '#3a5fcf',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      whiteSpace: 'nowrap', // Ensures text doesn't wrap
    },
  };
  export default StatisticsCard;