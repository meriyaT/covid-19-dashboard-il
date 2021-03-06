import React, { useState, useEffect } from "react";
import { isMobile } from "react-device-detect";
import { Tab } from "semantic-ui-react";
import * as d3 from "d3";

import ZipcodeTypeahead from "./ZipcodeTypeahead";
import zipcodeCityCountyList from "./../utils/zipcodes";
import Timeline from "./../Timeline";
import StatisticView from "./StatisticView";
import { MapboxGLMap } from "./MapboxGL";

import {
  il_zipcode_covid_geo_data_total,
  il_zipcode_covid_geo_data_today,
  il_zipcode_covid_geo_data_7day,
  color_breaks_zipcode_total,
  color_breaks_zipcode_today,
  color_breaks_zipcode_7day,
} from "./../MapData/MapData";

const ZipcodeTab = (todayDate) => {
  const [activeZipTabIndex, setActiveZipTabIndex] = useState(0);
  const [location, setLocation] = useState({ zipcode: "60532" });
  const [data, setData] = useState({});
  const [totalZipData, setTotalZipData] = useState({});

  const handleZipTabChange = (e, { activeIndex }) =>
    setActiveZipTabIndex(activeIndex);

  const onSelected = (zipCityCountyObj) => {
    setLocation(zipCityCountyObj);
  };

  const parseDate = d3.timeParse("%Y-%m-%d");

  function formatDate(d) {
    let month = "" + (d.todayDate.getMonth() + 1),
      day = "" + d.todayDate.getDate(),
      year = d.todayDate.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  const dateParameter = formatDate(todayDate);
  const formatValue = (d) => `${d3.format(".1f")(d)}`;

  const dateAccessor = (d) => {
    return d.date;
  };
  const infectedTodayAccessor = (d) =>
    parseInt(d.infected_today) > 0 ? parseInt(d.infected_today) : 0;

  const infectedTotalAccessor = (d) => d.infected_total;

  const sevenDayAvgAccessor = (d) => d.positive_7ma;

  const getAPIData = async (zip) => {
    let res = await fetch(
      `https://h9ml0v7oy9.execute-api.us-west-2.amazonaws.com/test/historybyzip?zipcode=${zip}&date=${dateParameter}&average_length=14`
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

  const getTotalZipData = async () => {
    let res = await fetch(
      `https://h9ml0v7oy9.execute-api.us-west-2.amazonaws.com/test/all-zips?date=${dateParameter}`
    );
    let results = await res.json();
    return results;
  };

  useEffect(() => {
    getAPIData(location.zipcode).then((result) => {
      setData(result);
    });
    getTotalZipData().then((result) => {
      setTotalZipData(result);
    });
  }, [location]);

  const renderStats = (showTodayData, showSevenDay) => {
    return showTodayData ? (
      <StatisticView
        location_name={location.zipcode}
        infected_stat={data[0].infected_today}
        tested_stat={data[0].tested_today}
        deaths_stat={data[0].deaths_today}
        todayDate={todayDate}
      />
    ) : showSevenDay ? (
      <StatisticView
        location_name={location.zipcode}
        infected_stat={formatValue(data[0].positive_7ma)}
        tested_stat={formatValue(data[0].tested_7ma)}
        deaths_stat={data[0].deaths_total}
        todayDate={todayDate}
      />
    ) : (
      <StatisticView
        location_name={location.zipcode}
        infected_stat={data[0].infected_total}
        tested_stat={data[0].tested_total}
        deaths_stat={data[0].deaths_total}
        todayDate={todayDate}
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
        {data.length > 0 ? renderStats(showTodayData) : <div></div>}

        {data.length > 0 && Object.entries(totalZipData).length > 0 ? (
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
            <MapboxGLMap
              data={il_zipcode_covid_geo_data_today(
                Object.entries(totalZipData)
              )}
              colorBreaks={color_breaks_zipcode_today()}
              highlightLineColor={{ rgba: [255, 102, 0, 1] }}
              coordinates={[-88.7, 42.49]}
              zoom={6}
              selectedId={location.zipcode}
              zipcodeMap={true}
              activeIndex={activeZipTabIndex}
            />
          </div>
        ) : data.length === 0 && Object.entries(totalZipData).length === 0 ? (
          <div>
            <h3>No data available for this zipcode. Please try another zip.</h3>
          </div>
        ) : (
          ""
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
        {data.length > 0 ? renderStats(showTodayData) : <div></div>}
        {Object.keys(data).length !== 0 &&
        Object.entries(totalZipData).length > 0 ? (
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
            <MapboxGLMap
              data={il_zipcode_covid_geo_data_total(
                Object.entries(totalZipData)
              )}
              colorBreaks={color_breaks_zipcode_total()}
              highlightLineColor={{ rgba: [255, 102, 0, 1] }}
              coordinates={[-88.7, 42.49]}
              zoom={6}
              selectedId={location.zipcode}
              zipcodeMap={true}
              activeIndex={activeZipTabIndex}
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
        {data.length > 0 ? renderStats(showTodayData, true) : <div></div>}
        {Object.keys(data).length !== 0 &&
        Object.entries(totalZipData).length > 0 ? (
          <div className="App__charts">
            <Timeline
              zipcode={location.zipcode}
              data={data}
              xAccessor={dateAccessor}
              yAccessor={sevenDayAvgAccessor}
              labelY="7 day moving average"
              labelX="Date"
              subLabelY="7 day tested moving average"
              showTodayData={showTodayData}
            />
            <MapboxGLMap
              data={il_zipcode_covid_geo_data_7day(
                Object.entries(totalZipData)
              )}
              colorBreaks={color_breaks_zipcode_7day()}
              highlightLineColor={{ rgba: [255, 102, 0, 1] }}
              coordinates={[-88.7, 42.49]}
              zoom={6}
              selectedId={location.zipcode}
              zipcodeMap={true}
              activeIndex={activeZipTabIndex}
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

  return isMobile ? (
    <Tab
      menu={{ fluid: true, vertical: true }}
      menuPosition="right"
      panes={zipPanes}
      activeIndex={activeZipTabIndex}
      onTabChange={handleZipTabChange}
    />
  ) : (
    <Tab
      menu={{ fluid: true, vertical: true }}
      grid={{ paneWidth: 14, tabWidth: 2 }}
      menuPosition="right"
      panes={zipPanes}
      activeIndex={activeZipTabIndex}
      onTabChange={handleZipTabChange}
    />
  );
};

export default ZipcodeTab;
