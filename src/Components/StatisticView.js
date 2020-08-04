import React from "react";
import { Statistic } from "semantic-ui-react";

const StatisticView = ({
  location_name,
  infected_stat,
  tested_stat,
  deaths_stat,
}) => {
  function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }
  const renderTableData = () => {
    return (
      <Statistic.Group size="small">
        <Statistic size="mini">
          <Statistic.Value>{location_name}</Statistic.Value>
        </Statistic>
        <Statistic color="red">
          <Statistic.Value>{formatNumber(infected_stat)}</Statistic.Value>
          <Statistic.Label>Cases</Statistic.Label>
        </Statistic>
        <Statistic color="teal">
          <Statistic.Value>{formatNumber(tested_stat)}</Statistic.Value>
          <Statistic.Label>Tested</Statistic.Label>
        </Statistic>
        <Statistic color="grey">
          <Statistic.Value>
            {deaths_stat ? formatNumber(deaths_stat) : "N/A"}
          </Statistic.Value>
          <Statistic.Label>Deaths</Statistic.Label>
        </Statistic>
      </Statistic.Group>
    );
  };

  return <div>{renderTableData()}</div>;
};

export default StatisticView;
