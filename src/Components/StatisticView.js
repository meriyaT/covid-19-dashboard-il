import React from "react";
import { Statistic } from "semantic-ui-react";

const StatisticView = ({
  location_name,
  infected_stat,
  tested_stat,
  deaths_stat,
  todayDate,
}) => {
  function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const renderTableData = () => {
    return (
      <Statistic.Group size="small">
        <Statistic horizontal size="mini">
          <Statistic.Value>{location_name}</Statistic.Value>
        </Statistic>
        <Statistic horizontal color="red">
          <Statistic.Value>{formatNumber(infected_stat)}</Statistic.Value>
          <Statistic.Label>Cases</Statistic.Label>
        </Statistic>
        <Statistic horizontal color="teal">
          <Statistic.Value>{formatNumber(tested_stat)}</Statistic.Value>
          <Statistic.Label>Tested</Statistic.Label>
        </Statistic>
        {deaths_stat ? (
          <Statistic horizontal color="grey">
            <Statistic.Value>{formatNumber(deaths_stat)}</Statistic.Value>
            <Statistic.Label>Deaths</Statistic.Label>
          </Statistic>
        ) : (
          <Statistic color="grey">
            <Statistic.Value>
              {`${
                months[todayDate.todayDate.getMonth()]
              } ${todayDate.todayDate.getDate()}`}
            </Statistic.Value>
          </Statistic>
        )}
      </Statistic.Group>
    );
  };

  return <div>{renderTableData()}</div>;
};

export default StatisticView;
