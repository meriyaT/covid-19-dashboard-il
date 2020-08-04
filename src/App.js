import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "semantic-ui-css/semantic.min.css";

import * as d3 from "d3";
import Timeline from "./Timeline";
import ZipcodeTypeahead from "./Components/ZipcodeTypeahead";
import Tabs from "./Components/Tabs";

import zipcodeCityCountyList from "./utils/zipcodes";
import { getTimelineData } from "./utils/data";

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

  return (
    <div className="App">
      <h1>Covid Dashboard</h1>
      <p>Data updates everyday at 2:30pm Chicago time</p>
      <Tabs
        illinoisData={todayIllinoisData}
        countyData={todayCountyData}
        todayDate={todayDate}
      />

      {/*}
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
        />
      </div>*/}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
