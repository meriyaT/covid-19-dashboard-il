import React from "react";
import * as d3 from "d3";
import { AxisLeft } from "./AxisLeft";
import { AxisBottom } from "./AxisBottom";
import { Bar } from "./Bar";
import { useChartDimensions, useUniqueId } from "./../utils";

const styles = {
  zIndex: 1000,
  backgroundColor: "white",
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
  const [ref, dimensions] = useChartDimensions();
  if (!data) {
    return <pre>Loading...</pre>;
  }
  /*
  const margin = {
    left: `${svgWidth * 0.12}`,
    right: `${svgWidth * 0.06}`,
    top: `${svgHeight * 0.12}`,
    bottom: `${tiltXLabels ? svgHeight * 0.25 : svgHeight * 0.15}`,
  };
  const chartWidth = svgWidth - margin.right - margin.left;
  const chartHeight = svgHeight - margin.top - margin.bottom;
*/
  //domain array length doesn't include 0 index 1 ... n, range array includes all elements 0 ... n
  const colorScale = d3
    .scaleThreshold()
    .domain(colorBreaks.map((b) => b.break).slice(1, colorBreaks.length))
    .range(
      colorBreaks.map((c) => `rgba(${c.rgba[0]},${c.rgba[1]},${c.rgba[2]},1)`)
    );

  const xScale = d3
    .scaleBand()
    .range([0, dimensions.boundedWidth])
    .padding(0.1)
    .domain(data.map((d) => d.county_name));
  const yScale = d3
    .scaleLinear()
    .range([dimensions.boundedHeight, 0])
    .domain([0, d3.max(data.map((d) => parseInt(d.positives_today)))])
    .nice();

  const minHeight = 2.5; //set a minHeight for a bar so that it is selectable

  return (
    <div className="barPlot" ref={ref}>
      <svg width={svgWidth} height={svgHeight} style={styles}>
        <g>
          <text
            style={{ textAnchor: "middle" }}
            fontFamily="Arial, Helvetica, sans-serif"
            fontSize={dimensions.boundedWidth * 0.035}
            x={svgWidth / 2}
            y={svgHeight * 0.08}
          >
            {visualizationTitle}
          </text>
        </g>
        <g
          transform={`translate(${dimensions.marginLeft},${
            dimensions.marginTop - 20
          })`}
        >
          {data.map((d, i) => (
            <React.Fragment key={`barFrag${d.county_name}`}>
              <Bar
                id={d}
                x={xScale(d.county_name)}
                y={
                  dimensions.boundedHeight -
                    yScale(parseInt(d.positives_today)) >
                  minHeight
                    ? yScale(parseInt(d.positives_today))
                    : dimensions.boundedHeight - minHeight
                }
                itemDelay={itemDelay * (i + 1)}
                width={xScale.bandwidth()}
                height={
                  dimensions.boundedHeight -
                    yScale(parseInt(d.positives_today)) >
                  minHeight
                    ? dimensions.boundedHeight -
                      yScale(parseInt(d.positives_today))
                    : minHeight
                }
                color={colorScale(parseInt(d.positives_today))}
                highlightLineColor={highlightLineColor}
                chartHeight={dimensions.boundedHeight}
                onSelectItem={onSelectItem}
                dimensions={dimensions}
              />
            </React.Fragment>
          ))}

          <AxisLeft
            yScale={yScale}
            chartHeight={dimensions.boundedHeight}
            chartWidth={dimensions.boundedWidth}
            yAxisTitle={leftAxisTitle}
          />

          <AxisBottom
            chartHeight={dimensions.boundedHeight}
            chartWidth={dimensions.boundedWidth}
            tickWidth={5}
            xScale={xScale}
            types={data.map((a) => a.county_name)}
            tiltXLabels={tiltXLabels}
            xAxisTitle={bottomAxisTitle}
          />
        </g>
      </svg>
    </div>
  );
};
