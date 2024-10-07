// import React,{useState} from 'react';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './topcities.css';

const Topcities = () => {
    const data = [
        { name: 'Abeokuta', uv: 80, percentage: 80, },
        { name: 'Sagamu', uv: 60 },
        { name: 'Mowe', uv: 50 },
        { name: 'Ijebu Ode', uv: 40 },
        { name: 'Ilaro', uv: 30 }
      ];

    const cities = [
      { name: 'Mimai', percentage: 80, value: '$100,000' },
      { name: 'New York', percentage: 60, value: '$80,000' },
      { name: 'Washington', percentage: 50, value: '$70,000' },
      { name: 'California', percentage: 40, value: '$50,000' },
      { name: 'Chicago', percentage: 30, value: '$30,000' }
    ];
  
    // const handleMouseEnter = (city) => {
    //   setHoveredCity(city);
    // };
  
    // const handleMouseLeave = () => {
    //   setHoveredCity(null);
    // };
  
    return (
        <div className="chart-container">
          <h3 className="chart-title">Top Cities</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 14, fill: '#6B7280' }} />
              <Tooltip cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} contentStyle={{ borderRadius: '10px', borderColor: 'lightgray' }} />
              <Bar dataKey="uv" fill="#7cc6ff" barSize={20} radius={[10, 10, 10, 10]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    };

export default Topcities;
