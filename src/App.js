import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import * as d3 from "d3";
import Timeline from "./Timeline";
import IllinoisMap from "./Chart/Map";
import ZipcodeTypeahead from "./Components/ZipcodeTypeahead";
import CountyBreakdownTable from "./Components/CountyBreakdownTable";
import IllinoisBreakdown from "./Components/IllinoisBreakdown";

import zipcodeCityCountyList from "./utils/zipcodes";
import { getTimelineData } from "./utils/data";
import { il_county_covid_geo_data, color_breaks } from "./MapData/MapData";
import { MapboxGLMap } from "./Components/MapboxGL";
import { BarPlot } from "./Chart/BarPlot/BarPlot";

import "./styles.css";
import { set } from "d3";

const parseDate = d3.timeParse("%Y-%m-%d");
const formatDate = d3.timeFormat("%m/%d/%Y");
const dateAccessor = (d) => {
  return d.date;
};
const totalCovidNumberAccessor = (d) => d.totalCases;
const dailyCovidNumberAccessor = (d) => d.dailyCase;
const bitCoinValueAccessor = (d) => d.value;

const App = () => {
  const getAPIData = async () => {
    let res = await fetch(
      "https://api.coindesk.com/v1/bpi/historical/close.json?start=2020-01-01&end=2020-07-22"
    );
    let results = await res.json();
    let resultArr = await Object.entries(results.bpi);
    let finalData = await resultArr.map((item) => {
      let [day, value] = item;
      day = parseDate(day);
      return { date: day, value: value };
    });
    return finalData;
    // setData(finalData);
  };

  const [data, setData] = useState([]);
  const [location, setLocation] = useState({});
  const [todayDate, setToday] = useState(new Date());
  const [todayIllinoisData, setTodayIllinoisData] = useState({});
  const [todayCountyData, setTodayCountyData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const getTodayData = async () => {
    let res = await fetch(
      `https://h9ml0v7oy9.execute-api.us-west-2.amazonaws.com/beta/county`
    );

    let results = await res.json();
    return results;
  };

  useEffect(() => {
    getAPIData().then((result) => {
      setData(result);
    });
    getTodayData().then((result) => {
      setTodayIllinoisData(result.results.illinois_data);
      setTodayCountyData(result.county_data);
    });
  }, []);

  const onSelected = (zipCityCountyObj) => {
    setLocation(zipCityCountyObj);
  };

  const barPlotTitle = `County Breakdown of Covid cases ${todayDate.toLocaleDateString()}`;
  return (
    <div className="App">
      <h1>Covid Dashboard</h1>
      {Object.keys(todayIllinoisData).length !== 0 &&
      todayCountyData.length > 0 ? (
        <div className="today">
          <div className="dateStateData">
            <CountyBreakdownTable
              header="State"
              countyBreakdown={todayIllinoisData}
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
              data={todayCountyData.slice(0, 20)}
              svgWidth={500}
              svgHeight={300}
              itemDelay={200}
              onSelectItem={setSelectedId}
              colorBreaks={color_breaks()}
              highlightLineColor={{ rgba: [255, 102, 0, 1] }}
              tiltXLabels={true}
              visualizationTitle={barPlotTitle}
              leftAxisTitle="Positive Cases"
              bottomAxisTitle="County"
            />
            <MapboxGLMap
              data={il_county_covid_geo_data(todayCountyData)}
              colorBreaks={color_breaks()}
              highlightLineColor={{ rgba: [255, 102, 0, 1] }}
              coordinates={[-88.7, 42.49]}
              zoom={6}
              selectedId={selectedId}
            />
          </div>
        </div>
      ) : (
        <div className="loader-msg">
          <h4>Fetching today's data...</h4>
        </div>
      )}

      <ZipcodeTypeahead
        zipcodeCityCountyList={zipcodeCityCountyList}
        onSelected={onSelected}
      />
      <div className="App__charts">
        <Timeline
          data={data}
          xAccessor={dateAccessor}
          yAccessor={bitCoinValueAccessor}
          labelY="Total Covid Cases"
          labelX="Date"
        />
        {/*<Timeline
          data={data.dailyCasesTimeline}
          xAccessor={dateAccessor}
          yAccessor={temperatureAccessor}
          labelY="Daily Number of Covid Cases"
        />*/}
        {/* <Histogram
          data={data.scatter}
          xAccessor={humidityAccessor}
          label="Daily Covid Cases"
        />*/}
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
