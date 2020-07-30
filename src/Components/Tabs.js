import React, { useState } from "react";
import { Tab } from "semantic-ui-react";
import CountyBreakdownTable from "./CountyBreakdownTable";
import {
  il_county_covid_geo_data_today,
  il_county_covid_geo_data_total,
  color_breaks,
  color_breaks_total,
} from "./../MapData/MapData";
import { MapboxGLMap } from "./MapboxGL";
import { BarPlot } from "./../Chart/BarPlot/BarPlot";
import { isMobile } from "react-device-detect";

const Tabs = ({ illinoisData, countyData, todayDate }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const barPlotTitleToday = `County Breakdown of Covid cases ${todayDate.toLocaleDateString()}`;
  const barPlotTitleTotal = `County Breakdown of Total Covid cases`;

  let barPlotHeight = 400,
    barPlotWidth = 600;
  if (isMobile) {
    barPlotHeight = 200;
    barPlotWidth = 300;
  }
  const renderDataInTab = (
    illinoisData,
    countyData,
    barPlotTitle,
    il_county_covid_geo_data,
    showTodayData,
    color_breaks_data
  ) =>
    Object.keys(illinoisData).length !== 0 && countyData.length > 0 ? (
      <Tab.Pane>
        <div className="today">
          <div className="dateStateData">
            <CountyBreakdownTable
              header="State"
              countyBreakdown={illinoisData}
              showTodayData={showTodayData}
            />
          </div>
          <div className="todayData">
            <div id="today-bar-tooltip" className="today-bar-tooltip">
              <div className="tooltip-title" id="title"></div>
              <div className="tooltip-bar-value">
                <span id="tooltip-bar-value"></span>
              </div>
            </div>
            <BarPlot
              data={countyData.slice(0, 20)}
              svgWidth={barPlotWidth}
              svgHeight={barPlotHeight}
              itemDelay={200}
              onSelectItem={setSelectedId}
              colorBreaks={color_breaks_data()}
              highlightLineColor={{ rgba: [255, 102, 0, 1] }}
              tiltXLabels={true}
              visualizationTitle={barPlotTitle}
              leftAxisTitle="Positive Cases"
              bottomAxisTitle="County"
              showTodayData={showTodayData}
            />
            <MapboxGLMap
              data={il_county_covid_geo_data(countyData)}
              colorBreaks={color_breaks_data()}
              highlightLineColor={{ rgba: [255, 102, 0, 1] }}
              coordinates={[-88.7, 42.49]}
              zoom={6}
              selectedId={selectedId}
              activeIndex={activeIndex}
            />
          </div>
        </div>
      </Tab.Pane>
    ) : (
      <Tab.Pane loading></Tab.Pane>
    );

  const panes = [
    {
      menuItem: "Today's Cases",
      render: () =>
        renderDataInTab(
          illinoisData,
          countyData,
          barPlotTitleToday,
          il_county_covid_geo_data_today,
          true,
          color_breaks
        ),
    },
    {
      menuItem: "Total Cases",
      render: () =>
        renderDataInTab(
          illinoisData,
          countyData,
          barPlotTitleTotal,
          il_county_covid_geo_data_total,
          false,
          color_breaks_total
        ),
    },
  ];
  const handleTabChange = (e, { activeIndex }) => setActiveIndex(activeIndex);
  return (
    <Tab
      panes={panes}
      activeIndex={activeIndex}
      onTabChange={handleTabChange}
    />
  );
};
export default Tabs;
