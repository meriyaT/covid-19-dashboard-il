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
}) => {
  const barRef = useRef(null);

  const tooltip = d3.select("#today-bar-tooltip");
  let positives_metric = showTodayData ? "positives_today" : "positives_total";

  const setHighlight = (el, highlighted) => {
    if (highlighted) {
      el.style("stroke-width", "3");
      el.style("stroke", `rgba(65, 131, 215, 1)`);
      el.style("cursor", "pointer");
    } else {
      el.style("stroke-width", "0");
    }
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
      tooltip.style("opacity", 1);
      tooltip.select("#title").text([id.county_name, "county"].join(" "));
      tooltip
        .select("#tooltip-bar-value")
        .text(["Tested positive", id[positives_metric]].join(" "));

      let tooltipX = x + parseInt(dimensions.marginLeft);
      let tooltipY = y + parseInt(dimensions.marginTop);

      if (isMobile) {
        tooltipX = tooltipX + 45;
        tooltipY = tooltipY + 170;
      } else {
        tooltipX = tooltipX + 130;
        tooltipY = tooltipY + 170;
      }
      tooltip.style(
        "transform",
        `translate(` +
          `calc( -50% + ${tooltipX}px),` +
          `calc(-100% + ${tooltipY}px)` +
          `)`
      );
      tooltip.style("opacity", 1);
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
    />
  );
};
