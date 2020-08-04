import React, { useState } from "react";
import { isMobile } from "react-device-detect";
import { Tab } from "semantic-ui-react";
import StatisticView from "./StatisticView";

const StateTab = ({ illinoisData }) => {
  const [activeIllinoisIndex, setActiveIllinoisIndex] = useState(0);

  const handleIllinoisTabChange = (e, { activeIndex }) =>
    setActiveIllinoisIndex(activeIndex);

  const renderIllinoisDataInTab = (illinoisData, showTodayData) => {
    return Object.keys(illinoisData).length !== 0 ? (
      <Tab.Pane className="inner-tab">
        <div className="today">
          <div className="dateStateData">
            {showTodayData ? (
              <StatisticView
                location_name={illinoisData.county_name}
                infected_stat={illinoisData.positives_today}
                tested_stat={illinoisData.tested_today}
                deaths_stat={illinoisData.deaths_today}
              />
            ) : (
              <StatisticView
                location_name={illinoisData.county_name}
                infected_stat={illinoisData.positives_total}
                tested_stat={illinoisData.tested_total}
                deaths_stat={illinoisData.deaths_total}
              />
            )}
          </div>
        </div>
      </Tab.Pane>
    ) : (
      <Tab.Pane loading></Tab.Pane>
    );
  };

  const panes = [
    {
      menuItem: "Today",
      render: () => renderIllinoisDataInTab(illinoisData, true),
    },
    {
      menuItem: "Total",
      render: () => renderIllinoisDataInTab(illinoisData, false),
    },
  ];

  return isMobile ? (
    <Tab
      menu={{ fluid: true, vertical: true }}
      menuPosition="right"
      panes={panes}
      activeIndex={activeIllinoisIndex}
      onTabChange={handleIllinoisTabChange}
    />
  ) : (
    <Tab
      menu={{ fluid: true, vertical: true }}
      grid={{ paneWidth: 14, tabWidth: 2 }}
      menuPosition="right"
      panes={panes}
      activeIndex={activeIllinoisIndex}
      onTabChange={handleIllinoisTabChange}
    />
  );
};
export default StateTab;
