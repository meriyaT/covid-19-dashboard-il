import React from "react";
export const AxisLeft = ({ yScale, chartHeight, chartWidth, yAxisTitle }) => {
  return (
    <g>
      <g>
        <line x1={0} y1={0} x2={0} y2={chartHeight} stroke="#000000" />
      </g>
      {yScale.ticks().map((tickValue) => (
        <g
          transform={`translate(0,${yScale(tickValue)})`}
          key={`g${tickValue}`}
        >
          <line
            key={`line${tickValue}`}
            x1={-5}
            y1={0}
            x2={0}
            y2={0}
            stroke="#000000"
          />
          <text
            key={tickValue}
            style={{ textAnchor: "end" }}
            x={-7}
            y={3}
            fontFamily="Arial, Helvetica, sans-serif"
            fontSize={chartWidth * 0.0251}
          >
            {tickValue}
          </text>
        </g>
      ))}
      <g>
        <text
          transform={`rotate(-90, ${chartWidth * 0.095 * -1}, ${
            chartHeight / 2
          })`}
          style={{ textAnchor: "middle" }}
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize={chartWidth * 0.03}
          x={chartWidth * 0.095 * -1}
          y={chartHeight / 2}
        >
          {yAxisTitle}
        </text>
      </g>
    </g>
  );
};
