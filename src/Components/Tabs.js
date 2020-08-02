import React, { useState } from "react";
import { Tab, Accordion, Button, Label } from "semantic-ui-react";
import CountyBreakdownTable from "./CountyBreakdownTable";
import {
  il_county_covid_geo_data_today,
  il_county_covid_geo_data_total,
  color_breaks,
  color_breaks_total,
} from "./../MapData/MapData";
import { MapboxGLMap } from "./MapboxGL";
import { PositivityRates } from "./PositivityRates";
import { BarPlot } from "./../Chart/BarPlot/BarPlot";
import { isMobile } from "react-device-detect";

const Tabs = ({ illinoisData, countyData, todayDate }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeIllinoisIndex, setActiveIllinoisIndex] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState(1);
  const [content, setContent] = useState("Show positivity rates");
  const barPlotTitleToday = `County Breakdown of Covid Cases ${todayDate.toLocaleDateString()}`;
  const barPlotTitleTotal = `County Breakdown of Total Covid Cases`;

  let barPlotHeight = 400,
    barPlotWidth = 600;
  if (isMobile) {
    barPlotHeight = 200;
    barPlotWidth = 300;
  }

  const handleTabChange = (e, { activeIndex }) => setActiveIndex(activeIndex);
  const handleIllinoisTabChange = (e, { activeIndex }) =>
    setActiveIllinoisIndex(activeIndex);

  const handleAccordionClick = (e, { index }) => {
    const newIndex = activeAccordion === index ? -1 : index;
    setActiveAccordion(newIndex);
    activeAccordion === 0
      ? setContent("Show positivity rates")
      : setContent("Hide positivity rates");
  };

  const renderDataInTab = (
    illinoisData,
    countyData,
    barPlotTitle,
    il_county_covid_geo_data,
    showTodayData,
    color_breaks_data
  ) => {
    return Object.keys(illinoisData).length !== 0 && countyData.length > 0 ? (
      <Tab.Pane className="inner-tab">
        <div className="today">
          <div className="dateStateData">
            <CountyBreakdownTable
              header="State"
              countyBreakdown={illinoisData}
              showTodayData={showTodayData}
            />
          </div>
          <Accordion fluid styled className="accordion-containier">
            <Accordion.Title
              active={activeAccordion === 0}
              index={0}
              onClick={handleAccordionClick}
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
              activeAccordion={activeAccordion}
            />
            <MapboxGLMap
              data={il_county_covid_geo_data(countyData)}
              colorBreaks={color_breaks_data()}
              highlightLineColor={{ rgba: [255, 102, 0, 1] }}
              coordinates={[-88.7, 42.49]}
              zoom={6}
              selectedId={selectedId}
              activeIndex={activeIllinoisIndex}
            />
          </div>
        </div>
      </Tab.Pane>
    ) : (
      <Tab.Pane loading></Tab.Pane>
    );
  };

  const panes = [
    {
      menuItem: "Today's cases",
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
      menuItem: "Total cases",
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

  const renderInnerTabs = () => {
    return (
      <div>
        <Tab
          menu={{ fluid: true, vertical: true }}
          menuPosition="right"
          panes={panes}
          activeIndex={activeIllinoisIndex}
          onTabChange={handleIllinoisTabChange}
        />
      </div>
    );
  };
  const renderIllinoisData = () => {
    return <Tab.Pane>{renderInnerTabs()}</Tab.Pane>;
  };

  const mainPanes = [{ menuItem: "State", render: () => renderIllinoisData() }];

  return (
    <Tab
      panes={mainPanes}
      activeIndex={activeIndex}
      onTabChange={handleTabChange}
    />
  );
};

export default Tabs;
