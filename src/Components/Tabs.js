import React, { useState } from "react";
import { Tab } from "semantic-ui-react";
import ZipcodeTab from "./ZipcodeTab";
import CountyTab from "./CountyTab";
import StateTab from "./StateTab";

const Tabs = ({ illinoisData, countyData, todayDate }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleTabChange = (e, { activeIndex }) => setActiveIndex(activeIndex);

  const renderIllinoisData = () => {
    return (
      <Tab.Pane>
        <StateTab illinoisData={illinoisData} />
      </Tab.Pane>
    );
  };

  const renderCountyData = () => {
    return (
      <Tab.Pane>
        <CountyTab countyData={countyData} todayDate={todayDate} />
      </Tab.Pane>
    );
  };

  const renderZipData = () => {
    return (
      <Tab.Pane>
        <ZipcodeTab />
      </Tab.Pane>
    );
  };

  const mainPanes = [
    { menuItem: "State", render: () => renderIllinoisData() },
    { menuItem: "County", render: () => renderCountyData() },
    { menuItem: "Zipcode", render: () => renderZipData() },
  ];

  return (
    <Tab
      panes={mainPanes}
      activeIndex={activeIndex}
      onTabChange={handleTabChange}
    />
  );
};

export default Tabs;
