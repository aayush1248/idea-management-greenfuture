import React from 'react';
import Notifications from './Notifications';

const TabBar = () => {
  return (
    <div className="tab-bar">
      <div className="tab">Home</div>
      <div className="tab">Profile</div>
      <div className="tab">Settings</div>
      <Notifications /> {/* Include Notifications Tab */}
    </div>
  );
};

export default TabBar;
