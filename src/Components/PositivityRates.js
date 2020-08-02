import React from "react";
import Gauge from "./../Chart/Gauge";

export const PositivityRates = ({ data, units, showTodayData }) => {
  let min, max;
  showTodayData ? ((min = 0.0), (max = 15.0)) : ((min = 0.0), (max = 30));
  return (
    <div className="positivity-gauge-container">
      {data.slice(0, 10).map((data) => {
        let positivity_rate = showTodayData
          ? parseFloat(
              ((data.positives_today / data.tested_today) * 100).toFixed(2)
            )
          : parseFloat(
              ((data.positives_total / data.tested_total) * 100).toFixed(2)
            );

        return (
          <Gauge
            key={data.county_name}
            value={positivity_rate}
            label={data.county_name}
            units={units}
            min={min}
            max={max}
          />
        );
      })}
    </div>
  );
};
