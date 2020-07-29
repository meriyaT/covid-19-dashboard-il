import React from "react";
import * as d3 from "d3";
import { AxisLeft } from "./AxisLeft";
import { AxisBottom } from "./AxisBottom";
import { Bar } from "./Bar";

const styles = {
  zIndex: 1000,
  backgroundColor: "white",
  border: "1px solid gray",
};

export const BarPlot = ({
  data,
  svgWidth,
  svgHeight,
  itemDelay,
  colorBreaks,
  tiltXLabels = false,
  highlightLineColor,
  visualizationTitle = "Visualization Title",
  leftAxisTitle = "Left Axis Title",
  bottomAxisTitle = "Bottom Axis Title",
  onSelectItem,
}) => {
  if (!data) {
    return <pre>Loading...</pre>;
  }

  const margin = {
    left: `${svgWidth * 0.12}`,
    right: `${svgWidth * 0.06}`,
    top: `${svgHeight * 0.12}`,
    bottom: `${tiltXLabels ? svgHeight * 0.25 : svgHeight * 0.15}`,
  };
  const chartWidth = svgWidth - margin.right - margin.left;
  const chartHeight = svgHeight - margin.top - margin.bottom;

  //domain array length doesn't include 0 index 1 ... n, range array includes all elements 0 ... n
  const colorScale = d3
    .scaleThreshold()
    .domain(colorBreaks.map((b) => b.break).slice(1, colorBreaks.length))
    .range(
      colorBreaks.map((c) => `rgba(${c.rgba[0]},${c.rgba[1]},${c.rgba[2]},1)`)
    );

  const xScale = d3
    .scaleBand()
    .range([0, chartWidth])
    .padding(0.1)
    .domain(data.map((d) => d.county_name));
  const yScale = d3
    .scaleLinear()
    .range([chartHeight, 0])
    .domain([0, d3.max(data.map((d) => parseInt(d.positives_today)))])
    .nice();

  const minHeight = 2.5; //set a minHeight for a bar so that it is selectable

  return (
    <svg width={svgWidth} height={svgHeight} style={styles}>
      <g>
        <text
          style={{ textAnchor: "middle" }}
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize={chartWidth * 0.035}
          x={svgWidth / 2}
          y={svgHeight * 0.08}
        >
          {visualizationTitle}
        </text>
      </g>
      <g transform={`translate(${margin.left},${margin.top})`}>
        {data.map((d, i) => (
          <React.Fragment key={`barFrag${d.county_name}`}>
            <Bar
              id={d}
              x={xScale(d.county_name)}
              y={
                chartHeight - yScale(parseInt(d.positives_today)) > minHeight
                  ? yScale(parseInt(d.positives_today))
                  : chartHeight - minHeight
              }
              itemDelay={itemDelay * (i + 1)}
              width={xScale.bandwidth()}
              height={
                chartHeight - yScale(parseInt(d.positives_today)) > minHeight
                  ? chartHeight - yScale(parseInt(d.positives_today))
                  : minHeight
              }
              color={colorScale(parseInt(d.positives_today))}
              highlightLineColor={highlightLineColor}
              chartHeight={chartHeight}
              onSelectItem={onSelectItem}
              margin={margin}
            />
          </React.Fragment>
        ))}

        <AxisLeft
          yScale={yScale}
          chartHeight={chartHeight}
          chartWidth={chartWidth}
          yAxisTitle={leftAxisTitle}
        />

        <AxisBottom
          chartHeight={chartHeight}
          chartWidth={chartWidth}
          tickWidth={5}
          xScale={xScale}
          types={data.map((a) => a.county_name)}
          tiltXLabels={tiltXLabels}
          xAxisTitle={bottomAxisTitle}
        />
      </g>
    </svg>
  );
};
