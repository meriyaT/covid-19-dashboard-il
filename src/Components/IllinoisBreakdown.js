import React from "react";

const IllinoisBreakdown = ({ todayDate, todayIllinoisData }) => {
  return (
    <div>
      <h3>
        Total Cases in Illinois reported on{" "}
        {`${todayDate.toLocaleDateString()}`}:{" "}
        {todayIllinoisData.positives_today}
      </h3>
      <h3>
        Total Tests in Illinois reported on{" "}
        {`${todayDate.toLocaleDateString()}`}: {todayIllinoisData.tested_today}
      </h3>
      <h3>
        Total Deaths in Illinois reported on{" "}
        {`${todayDate.toLocaleDateString()}`}: {todayIllinoisData.deaths_today}
      </h3>
    </div>
  );
};

export default IllinoisBreakdown;
