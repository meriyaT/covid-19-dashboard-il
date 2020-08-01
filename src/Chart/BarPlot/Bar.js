import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { isMobile } from "react-device-detect";

export const Bar = ({
  id,
  x,
  y,
  chartHeight,
  width,
  height,
  color,
  highlightLineColor = { rgba: [255, 102, 0, 1] },
  itemDelay,
  onSelectItem,
  dimensions,
  showTodayData,
  activeAccordion,
}) => {
  const barRef = useRef(null);
  let tooltipX, tooltipY;
  const tooltip = d3.select("#today-bar-tooltip");
  let metric = showTodayData
    ? {
        positives: "positives_today",
        tested: "tested_today",
        deaths: "deaths_today",
      }
    : {
        positives: "positives_total",
        tested: "tested_total",
        deaths: "deaths_total",
      };

  const setHighlight = (el, highlighted) => {
    if (highlighted) {
      el.style("stroke-width", "3");
      el.style("stroke", `rgba(245, 171, 53, 1)`);
      el.style("cursor", "pointer");
    } else {
      el.style("stroke-width", "0");
    }
  };

  const showTooltip = () => {
    tooltip.style("opacity", 1);
    let tooltopContent = `
    <h3>${id.county_name}</h3>
    <table>
      <tr>
        <th>Tested positive</th>
        <td><b>${id[metric.positives]}</b></td>
      </tr>
      <tr>
      <th>Number of tests</th>
      <td><b>${id[metric.tested]}</b></td>
    </tr>
    <tr>
    <th>Deaths</th>
    <td><b>${id[metric.deaths]}</b></td>
  </tr>
    <table>`;
    tooltip.select("#tooltip-bar-value").html(tooltopContent);

    tooltipX = x + parseInt(dimensions.marginLeft);
    tooltipY = y + parseInt(dimensions.marginTop);
    if (isMobile) {
      if (activeAccordion === 0 || activeAccordion === -1) {
        tooltipX = tooltipX + 5;
        tooltipY = tooltipY - 20;
      } else {
        tooltipX = tooltipX - 1;
        tooltipY = tooltipY - 20;
      }
    } else {
      tooltipX = tooltipX + 10;
      tooltipY = tooltipY - 20;
    }

    tooltip.style(
      "transform",
      `translate(` +
        `calc( -50% + ${tooltipX}px),` +
        `calc(-100% + ${tooltipY}px)` +
        `)`
    );
    tooltip.style("opacity", 1);
  };

  useEffect(() => {
    let el = d3.select(barRef.current);

    if (itemDelay > 0) {
      el.transition()
        .delay(itemDelay)
        .duration(3000)
        .ease(d3.easeElastic)
        .attr("y", y)
        .attr("height", height);
    }

    el.on("mouseenter", () => {
      onSelectItem(id);
      setHighlight(el, true);
      showTooltip();
    });

    el.on("click", () => {
      onSelectItem(id);
      setHighlight(el, true);
    });

    el.on("mouseleave", () => {
      onSelectItem(null);
      setHighlight(el, false);
      tooltip.style("opacity", 0);
    });
  });
  return (
    <rect
      ref={barRef}
      x={x}
      y={itemDelay > 0 ? chartHeight : y}
      width={width}
      height={itemDelay > 0 ? 0 : height}
      fill={color}
      className="rect-bar"
    />
  );
};
