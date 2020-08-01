import React from "react";
import { Statistic } from "semantic-ui-react";

const CountyBreakdownTable = ({ header, countyBreakdown, showTodayData }) => {
  function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }
  const renderTableData = () => {
    return showTodayData ? (
      <Statistic.Group size="small">
        <Statistic size="mini">
          <Statistic.Value>{countyBreakdown.county_name}</Statistic.Value>
        </Statistic>
        <Statistic color="red">
          <Statistic.Value>
            {formatNumber(countyBreakdown.positives_today)}
          </Statistic.Value>
          <Statistic.Label>Cases</Statistic.Label>
        </Statistic>
        <Statistic color="teal">
          <Statistic.Value>
            {formatNumber(countyBreakdown.tested_today)}
          </Statistic.Value>
          <Statistic.Label>Tested</Statistic.Label>
        </Statistic>
        <Statistic color="grey">
          <Statistic.Value>
            {formatNumber(countyBreakdown.deaths_today)}
          </Statistic.Value>
          <Statistic.Label>Deaths</Statistic.Label>
        </Statistic>
      </Statistic.Group>
    ) : (
      <Statistic.Group size="small">
        <Statistic size="mini">
          <Statistic.Value>{countyBreakdown.county_name}</Statistic.Value>
        </Statistic>
        <Statistic color="red">
          <Statistic.Value>
            {formatNumber(countyBreakdown.positives_total)}
          </Statistic.Value>
          <Statistic.Label>Cases</Statistic.Label>
        </Statistic>
        <Statistic color="teal">
          <Statistic.Value>
            {formatNumber(countyBreakdown.tested_total)}
          </Statistic.Value>
          <Statistic.Label>Tested</Statistic.Label>
        </Statistic>
        <Statistic color="grey">
          <Statistic.Value>
            {formatNumber(countyBreakdown.deaths_total)}
          </Statistic.Value>
          <Statistic.Label>Deaths</Statistic.Label>
        </Statistic>
      </Statistic.Group>
    );
  };

  return <div>{renderTableData()}</div>;
};

export default CountyBreakdownTable;
