import React, { useState } from "react";
import { isMobile } from "react-device-detect";
import { Tab, Accordion, Button } from "semantic-ui-react";

import { MapboxGLMap } from "./MapboxGL";
import { PositivityRates } from "./PositivityRates";
import { BarPlot } from "./../Chart/BarPlot/BarPlot";

import {
  il_county_covid_geo_data_today,
  il_county_covid_geo_data_total,
  color_breaks,
  color_breaks_total,
} from "./../MapData/MapData";

const CountyTab = ({ countyData, todayDate }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [activeCountyIndex, setActiveCountyIndex] = useState(0);
  const [content, setContent] = useState("Show positivity rates");

  const [activeAccordion, setActiveAccordion] = useState(1);

  const barPlotTitleToday = `County Breakdown of Covid Cases ${todayDate.toLocaleDateString()}`;
  const barPlotTitleTotal = `County Breakdown of Total Covid Cases`;

  let dataForBarPlot = [];

  const handleCountyTabChange = (e, { activeIndex }) =>
    setActiveCountyIndex(activeIndex);
  const handleAccordionClick = (e, { index }) => {
    const newIndex = activeAccordion === index ? -1 : index;
    setActiveAccordion(newIndex);
    activeAccordion === 0
      ? setContent("Show positivity rates")
      : setContent("Hide positivity rates");
  };

  let barPlotHeight = 400,
    barPlotWidth = 600;
  if (isMobile) {
    barPlotHeight = 200;
    barPlotWidth = 300;
  }
  const renderCountyDataInTab = (
    countyData,
    barPlotTitle,
    il_county_covid_geo_data,
    showTodayData,
    color_breaks_data
  ) => {
    dataForBarPlot = showTodayData
      ? countyData
          .sort((a, b) => b.positives_today - a.positives_today)
          .slice(0, 20)
      : countyData
          .sort((a, b) => b.positives_total - a.positives_total)
          .slice(0, 20);
    return countyData.length > 0 ? (
      <Tab.Pane className="inner-tab">
        <div className="today">
          <Accordion fluid styled className="accordion-containier">
            <Accordion.Title
              active={activeAccordion === 0}
              index={0}
              onClick={handleAccordionClick}
              className="positivity-rate-title"
            >
              <Button secondary content={content} />
            </Accordion.Title>
            <Accordion.Content active={activeAccordion === 0}>
              <PositivityRates
                data={countyData}
                showTodayData={showTodayData}
              />
            </Accordion.Content>
          </Accordion>
          <div className="todayData">
            <BarPlot
              data={dataForBarPlot}
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
              activeAccordion={activeAccordion}
            />
            <MapboxGLMap
              data={il_county_covid_geo_data(countyData)}
              colorBreaks={color_breaks_data()}
              highlightLineColor={{ rgba: [255, 102, 0, 1] }}
              coordinates={[-88.7, 42.49]}
              zoom={6}
              selectedId={selectedId}
              activeIndex={activeCountyIndex}
            />
          </div>
        </div>
      </Tab.Pane>
    ) : (
      <Tab.Pane loading></Tab.Pane>
    );
  };

  const countyPanes = [
    {
      menuItem: "Today",
      render: () =>
        renderCountyDataInTab(
          countyData,
          barPlotTitleToday,
          il_county_covid_geo_data_today,
          true,
          color_breaks
        ),
    },
    {
      menuItem: "Total",
      render: () =>
        renderCountyDataInTab(
          countyData,
          barPlotTitleTotal,
          il_county_covid_geo_data_total,
          false,
          color_breaks_total
        ),
    },
  ];

  return isMobile ? (
    <Tab
      menu={{ fluid: true, vertical: true }}
      menuPosition="right"
      panes={countyPanes}
      activeIndex={activeCountyIndex}
      onTabChange={handleCountyTabChange}
    />
  ) : (
    <Tab
      menu={{ fluid: true, vertical: true }}
      grid={{ paneWidth: 14, tabWidth: 2 }}
      menuPosition="right"
      panes={countyPanes}
      activeIndex={activeCountyIndex}
      onTabChange={handleCountyTabChange}
    />
  );
};

export default CountyTab;
