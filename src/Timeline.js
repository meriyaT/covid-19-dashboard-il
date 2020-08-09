import React, { useRef } from "react";
import * as d3 from "d3";
import { isMobile } from "react-device-detect";

import Chart from "./Chart/Chart";
import Line from "./Chart/Line";
import Axis from "./Chart/Axis";
import Gradient from "./Chart/Gradient";
import { useChartDimensions, useUniqueId } from "./Chart/utils";

const formatDate = d3.timeFormat("%b %-d");
const formatTick = d3.format(",");
const gradientColors = ["rgb(226, 222, 243)", "#f8f9fa"];

const Timeline = ({
  zipcode,
  data,
  xAccessor,
  yAccessor,
  labelY,
  subLabelY,
  showTodayData,
}) => {
  const tooltipCircleRef = useRef(null);
  const rectRef = useRef(null);
  const [ref, dimensions] = useChartDimensions();
  const gradientId = useUniqueId("Timeline-gradient");

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(data, xAccessor))
    .range([0, dimensions.boundedWidth]);

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, yAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice();

  const xAccessorScaled = (d) => {
    return xScale(xAccessor(d));
  };

  const yAccessorScaled = (d) => yScale(yAccessor(d));

  const tooltip = d3.select("#tooltip");

  function onMouseMove(e) {
    const mousePosition = d3.clientPoint(e.target, e);
    const hoveredDate = xScale.invert(mousePosition[0]);

    const getDistanceFromHoveredDate = (d) =>
      Math.abs(xAccessor(d) - hoveredDate);
    const closestIndex = d3.scan(
      data,
      (a, b) => getDistanceFromHoveredDate(a) - getDistanceFromHoveredDate(b)
    );
    const closestDataPoint = data[closestIndex];

    const closestXValue = xAccessor(closestDataPoint);
    const closestYValue = yAccessor(closestDataPoint);

    const formatDate = d3.timeFormat("%B %A %-d, %Y");
    //  tooltip.select("#date").text(formatDate(closestXValue));
    const formatValue = (d) => `${d3.format(".1f")(d)}`;

    let tested_positive =
      labelY === "7 day moving average"
        ? formatValue(closestYValue)
        : closestYValue;
    let positives_metric =
      labelY === "7 day moving average"
        ? "tested_7ma"
        : showTodayData
        ? "tested_today"
        : "tested_total";

    let subLabelYValue =
      labelY === "7 day moving average"
        ? formatValue(closestDataPoint[positives_metric])
        : closestDataPoint[positives_metric];
    let popupContent = `
      <span>${formatDate(closestXValue)}</span>
      <table>
        <tr>
          <th>${labelY}</th>
          <td>${tested_positive}</td>
        </tr>
        <tr>
        <th>${subLabelY}</th>
        <td>${subLabelYValue}</td>
      </tr>
      <table>
    `;
    tooltip.select("#tooltip-value").html(popupContent);
    let x = xScale(closestXValue) + dimensions.marginLeft + 25;
    let y = yScale(closestYValue) + dimensions.marginTop + 160;

    if (isMobile) {
      y = y + 80;
    }
    tooltip.style(
      "transform",
      `translate(` + `calc( -50% + ${x}px),` + `calc(-100% + ${y}px)` + `)`
    );

    tooltip.style("opacity", 1);
    tooltipCircleRef.current.setAttribute("cx", xScale(closestXValue));
    tooltipCircleRef.current.setAttribute("cy", yScale(closestYValue));
    tooltipCircleRef.current.style.opacity = 1;
  }

  function onMouseLeave() {
    tooltip.style("opacity", 0);

    tooltipCircleRef.current.style.opacity = 0;
  }

  return (
    <div className="Timeline" ref={ref}>
      <h4>
        {labelY} for {zipcode}
      </h4>
      <div id="tooltip" className="tooltip">
        <div className="tooltip-date">
          <span id="date"></span>
        </div>
        <div className="tooltip-value" id="tooltip-value"></div>
      </div>
      <Chart dimensions={dimensions}>
        <defs>
          <Gradient id={gradientId} colors={gradientColors} x2="0" y2="100%" />
        </defs>
        <Axis dimension="x" scale={xScale} formatTick={formatDate} />
        <Axis
          dimension="y"
          scale={yScale}
          label={labelY}
          formatTick={formatTick}
        />
        {data.length > 0 && (
          <Line
            data={data}
            xAccessor={xAccessorScaled}
            yAccessor={yAccessorScaled}
          />
        )}
        <rect
          ref={rectRef}
          className="listening-rect"
          width={dimensions.boundedWidth}
          height={dimensions.boundedHeight}
          onMouseMove={(e) => onMouseMove(e)}
          onMouseLeave={onMouseLeave}
        ></rect>
        <circle
          ref={tooltipCircleRef}
          className="tooltip-circle"
          r="4"
          stroke="#af9358"
          fill="white"
          strokeWidth="2"
          opacity="0"
        />
      </Chart>
    </div>
  );
};

export default Timeline;
