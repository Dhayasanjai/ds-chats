import React from 'react';

import SideBarChats from './SideBarChats';

import SideBarHeader from './SideBarHeader';

const SideBar = () => {
  return (
    <React.Fragment>
      <SideBarHeader />
      <SideBarChats />
    </React.Fragment>
  );
};
export default SideBar;
