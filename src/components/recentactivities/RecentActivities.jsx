import React from 'react';
import './recentactivities.css'; // Assuming the CSS file is named like this

const activities = [
  { status: 'Product Expired', product: 'Paracetamol', time: '5 mins ago', color: 'red' },
  { status: 'Restocked', product: 'Ibuprofen', time: '7 mins ago', color: 'yellow' },
  { status: 'Completed', product: 'Aspirin', time: '18 mins ago', color: 'green' },
  { status: 'Restocked', product: 'Gabapentin', time: '10 mins ago', color: 'yellow' },
];

const RecentActivities = () => {
  return (
    <div className="recent-activities">
      <h3>Recents Activities</h3>
      <ul>
        {activities.map((activity, index) => (
          <li key={index} className="activity">
            <div className="activity-status">
              <div className={`status-circle ${activity.color}`}></div>
              <div className="activity-info">
                <span className={`status-label ${activity.color}`}>{activity.status}</span>
                <span className="product-name">{activity.product}</span>
                <span className="time">{activity.time}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivities;
