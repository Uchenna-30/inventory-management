import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './sectionusage.css'; // CSS styling

const SectionUsage = () => {
    const percentage = 58; // The percentage of location used
    const loadedShelves = 19;
    const emptyShelves = 64;
  
    return (
      <div className="section-usage-card">
        <h3>Section 5 usage</h3>
        <div className="progress-circle">
          <CircularProgressbar
            value={percentage}
            text={`${percentage}%`}
            strokeWidth={10}
            styles={buildStyles({
              textColor: '#ffffff',
              pathColor: '#FFBF42',
              trailColor: '#4CAF50',
            })}
          />
          <p className="progress-label">Location used</p>
        </div>
        <div className="shelf-info">
          <div className="shelf-item">
            <p>Loaded</p>
            <h4>{loadedShelves}</h4>
            <span>Shelves</span>
          </div>
          <div className="shelf-item">
            <p>Empty</p>
            <h4>{emptyShelves}</h4>
            <span>Shelves</span>
          </div>
        </div>
      </div>
    );
  };
  
  export default SectionUsage;