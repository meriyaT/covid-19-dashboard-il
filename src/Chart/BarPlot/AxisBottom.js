import React from "react";
export const AxisBottom = ({
  xScale,
  chartHeight,
  chartWidth,
  types,
  tiltXLabels = false,
  xAxisTitle = "title",
}) => {
  return (
    <g>
      <g>
        <line
          x1="0"
          y1={chartHeight}
          x2={chartWidth}
          y2={chartHeight}
          stroke="#000000"
        />
      </g>
      {types.map((type) => (
        <g
          className="tick"
          key={type}
          transform={`translate(${
            xScale(type) + xScale.bandwidth() / 2
          },${chartHeight})`}
        >
          <line
            key={`line${type}`}
            x1={0}
            y1={0}
            x2={0}
            y2={chartWidth * 0.012}
            stroke="#000000"
          />
          {tiltXLabels ? (
            <text
              transform="rotate(45, -5, 12)"
              style={{ textAnchor: "start" }}
              y={12}
              x={-5}
              fontFamily="Arial, Helvetica, sans-serif"
              fontSize={chartWidth * 0.03}
            >
              {type}
            </text>
          ) : (
            <text
              style={{ textAnchor: "middle" }}
              y={chartWidth * 0.04}
              fontFamily="Arial, Helvetica, sans-serif"
              fontSize={chartWidth * 0.025}
            >
              {type.toLocaleString()}
            </text>
          )}
        </g>
      ))}
      <g>
        <text
          style={{ textAnchor: "middle" }}
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize={chartWidth * 0.03}
          x={chartWidth / 2}
          y={
            tiltXLabels
              ? chartHeight + chartHeight * 0.35
              : chartHeight + chartHeight * 0.17
          }
        >
          {xAxisTitle}
        </text>
      </g>
    </g>
  );
};
