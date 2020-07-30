import React from "react";

const CountyBreakdownTable = ({ header, countyBreakdown, showTodayData }) => {
  const renderTableData = () => {
    return Array.isArray(countyBreakdown) ? (
      countyBreakdown.map((county) => {
        const {
          county_name,
          deaths_today,
          tested_today,
          positives_today,
        } = county;
        return (
          <tr key={county_name}>
            <td>{county_name}</td>
            <td>{positives_today}</td>
            <td>{tested_today}</td>
            <td>{deaths_today}</td>
          </tr>
        );
      })
    ) : showTodayData ? (
      <tr key={countyBreakdown.county_name}>
        <td>{countyBreakdown.county_name}</td>
        <td>{countyBreakdown.positives_today}</td>
        <td>{countyBreakdown.tested_today}</td>
        <td>{countyBreakdown.deaths_today}</td>
      </tr>
    ) : (
      <tr key={countyBreakdown.county_name}>
        <td>{countyBreakdown.county_name}</td>
        <td>{countyBreakdown.positives_total}</td>
        <td>{countyBreakdown.tested_total}</td>
        <td>{countyBreakdown.deaths_total}</td>
      </tr>
    );
  };
  const renderTableHeader = (header) => {
    return (
      <tr>
        <th>{header}</th>
        <th>Cases</th>
        <th>Tested</th>
        <th>Deaths</th>
      </tr>
    );
  };
  return (
    <div className="tableFormat">
      <table>
        <tbody style={{ textAlign: "center" }}>
          {renderTableHeader(header)}
          {renderTableData()}
        </tbody>
      </table>
    </div>
  );
};

export default CountyBreakdownTable;
