import React, { useState, useEffect } from "react";
import { Tab, Accordion, Button, Label } from "semantic-ui-react";
import CountyBreakdownTable from "./CountyBreakdownTable";
import ZipcodeTypeahead from "./ZipcodeTypeahead";
import zipcodeCityCountyList from "./../utils/zipcodes";
import Timeline from "./../Timeline";
import * as d3 from "d3";

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
  const [activeCountyIndex, setActiveCountyIndex] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState(1);
  const [content, setContent] = useState("Show positivity rates");
  const [location, setLocation] = useState({ zipcode: "60532" });
  const [data, setData] = useState({});

  const barPlotTitleToday = `County Breakdown of Covid Cases ${todayDate.toLocaleDateString()}`;
  const barPlotTitleTotal = `County Breakdown of Total Covid Cases`;
  let dataForBarPlot = [];

  let barPlotHeight = 400,
    barPlotWidth = 600;
  if (isMobile) {
    barPlotHeight = 200;
    barPlotWidth = 300;
  }

  const parseDate = d3.timeParse("%Y-%m-%d");

  const dateAccessor = (d) => {
    return d.date;
  };
  const infectedTodayAccessor = (d) =>
    d.infected_today > 0 ? d.infected_today : 0;

  const infectedTotalAccessor = (d) => d.infected_total;

  const sevenDayAvgAccessor = (d) => d.positive_7ma;

  const getAPIData = async (zip) => {
    let res = await fetch(
      `https://h9ml0v7oy9.execute-api.us-west-2.amazonaws.com/test/historybyzip?zipcode=${zip}&date=2020-08-03&average_length=14`
    );
    let results = await res.json();
    let resultArr = results.results.zipcode_data.timeline_data;
    let finalData = await resultArr.map((item) => {
      let day = parseDate(item.date);
      item.date = day;
      return item;
    });
    return finalData;
  };

  useEffect(() => {
    getAPIData(location.zipcode).then((result) => {
      setData(result);
    });
  }, [location]);

  const onSelected = (zipCityCountyObj) => {
    setLocation(zipCityCountyObj);
  };

  const handleTabChange = (e, { activeIndex }) => setActiveIndex(activeIndex);
  const handleIllinoisTabChange = (e, { activeIndex }) =>
    setActiveIllinoisIndex(activeIndex);
  const handleCountyTabChange = (e, { activeIndex }) =>
    setActiveCountyIndex(activeIndex);
  const handleAccordionClick = (e, { index }) => {
    const newIndex = activeAccordion === index ? -1 : index;
    setActiveAccordion(newIndex);
    activeAccordion === 0
      ? setContent("Show positivity rates")
      : setContent("Hide positivity rates");
  };

  const renderIllinoisDataInTab = (
    illinoisData,
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
        </div>
      </Tab.Pane>
    ) : (
      <Tab.Pane loading></Tab.Pane>
    );
  };

  const panes = [
    {
      menuItem: "Today",
      render: () =>
        renderIllinoisDataInTab(
          illinoisData,
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
        renderIllinoisDataInTab(
          illinoisData,
          countyData,
          barPlotTitleTotal,
          il_county_covid_geo_data_total,
          false,
          color_breaks_total
        ),
    },
  ];

  const renderInnerTabsIllinois = () => {
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

  const renderCountyDataInTab = (
    illinoisData,
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
    return Object.keys(illinoisData).length !== 0 && countyData.length > 0 ? (
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
              activeIndex={activeIllinoisIndex}
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
          illinoisData,
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
          illinoisData,
          countyData,
          barPlotTitleTotal,
          il_county_covid_geo_data_total,
          false,
          color_breaks_total
        ),
    },
  ];

  const renderInnerTabsCounty = () => {
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

  const renderZipCodeTodayDataInTab = (showTodayData) => {
    return (
      <div>
        <ZipcodeTypeahead
          zipcodeCityCountyList={zipcodeCityCountyList}
          onSelected={onSelected}
        />
        {Object.keys(data).length !== 0 ? (
          <div className="App__charts">
            <Timeline
              zipcode={location.zipcode}
              data={data}
              xAccessor={dateAccessor}
              yAccessor={infectedTodayAccessor}
              labelY="Daily Covid Cases"
              labelX="Date"
              subLabelY="Total tested"
              showTodayData={showTodayData}
            />
          </div>
        ) : (
          <div>
            <h3>No data available for this zipcode. Please try another zip.</h3>
          </div>
        )}
      </div>
    );
  };

  const renderZipCodeTotalDataInTab = (showTodayData) => {
    return (
      <div>
        <ZipcodeTypeahead
          zipcodeCityCountyList={zipcodeCityCountyList}
          onSelected={onSelected}
        />
        {Object.keys(data).length !== 0 ? (
          <div className="App__charts">
            <Timeline
              zipcode={location.zipcode}
              data={data}
              xAccessor={dateAccessor}
              yAccessor={infectedTotalAccessor}
              labelY="Total Covid Cases"
              labelX="Date"
              subLabelY="Total tested"
              showTodayData={showTodayData}
            />
          </div>
        ) : (
          <div>
            <h3>No data available for this zipcode. Please try another zip.</h3>
          </div>
        )}
      </div>
    );
  };

  const renderZipCode7DayAvgInTab = (showTodayData) => {
    return (
      <div>
        <ZipcodeTypeahead
          zipcodeCityCountyList={zipcodeCityCountyList}
          onSelected={onSelected}
        />
        {Object.keys(data).length !== 0 ? (
          <div className="App__charts">
            <Timeline
              zipcode={location.zipcode}
              data={data}
              xAccessor={dateAccessor}
              yAccessor={sevenDayAvgAccessor}
              labelY="7 day rolling avg"
              labelX="Date"
              subLabelY="7 day tested rolling avg"
              showTodayData={showTodayData}
            />
          </div>
        ) : (
          <div>
            <h3>No data available for this zipcode. Please try another zip.</h3>
          </div>
        )}
      </div>
    );
  };

  const zipPanes = [
    {
      menuItem: "Daily",
      render: () => renderZipCodeTodayDataInTab(true),
    },
    {
      menuItem: "Total",
      render: () => renderZipCodeTotalDataInTab(false),
    },
    {
      menuItem: "7day",
      render: () => renderZipCode7DayAvgInTab(false),
    },
  ];

  const renderInnerTabsZip = () => {
    return isMobile ? (
      <Tab
        menu={{ fluid: true, vertical: true }}
        menuPosition="right"
        panes={zipPanes}
        activeIndex={activeCountyIndex}
        onTabChange={handleCountyTabChange}
      />
    ) : (
      <Tab
        menu={{ fluid: true, vertical: true }}
        grid={{ paneWidth: 14, tabWidth: 2 }}
        menuPosition="right"
        panes={zipPanes}
        activeIndex={activeCountyIndex}
        onTabChange={handleCountyTabChange}
      />
    );
  };

  const renderIllinoisData = () => {
    return <Tab.Pane>{renderInnerTabsIllinois()}</Tab.Pane>;
  };

  const renderCountyData = () => {
    return <Tab.Pane>{renderInnerTabsCounty()}</Tab.Pane>;
  };

  const renderZipData = () => {
    return <Tab.Pane>{renderInnerTabsZip()}</Tab.Pane>;
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
