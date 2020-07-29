import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

const IllinoisMap = ({ countyBreakdown }) => {
  const [countyShapes, setCountyShapes] = useState({});
  const [metricDataByCounty, setMetricDataByCounty] = useState({});
  const boundsRef = useRef(null);
  const countyNameAccessor = (d) => d.county_name;
  const metric = "Cases";

  const getData = async () => {
    let shapes = await d3.json("./il-geojson2.json");
    return shapes;
  };

  const setMetricData = async () => {
    let metricDataByCounty = {};
    await countyBreakdown.forEach((d) => {
      metricDataByCounty[d.county_name] = d.positives_today;
    });

    return metricDataByCounty;
  };

  useEffect(() => {
    getData().then((data) => setCountyShapes(data));
    setMetricDataByCounty(setMetricData());
  }, []);

  let dimensions = {
    width: d3.min([900, window.innerWidth * 0.9]),
    margin: {
      top: 10,
      right: 40,
      bottom: 40,
      left: 40,
    },
  };
  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  const sphere = { type: "Sphere" };
  const projection = d3
    .geoMercator()
    .scale(dimensions.boundedWidth / 2 / Math.PI)
    .translate([dimensions.boundedWidth / 2, dimensions.boundedHeight / 2]);

  const pathGenerator = d3.geoPath(projection);
  const [[x0, y0], [x1, y1]] = pathGenerator.bounds(sphere);

  dimensions.boundedHeight = y1;
  dimensions.height =
    dimensions.boundedHeight + dimensions.margin.top + dimensions.margin.bottom;

  const metricValues = Object.values(metricDataByCounty);
  const metricValueExtent = d3.extent(metricValues);
  const maxChange = d3.max([-metricValueExtent[0], metricValueExtent[1]]);
  const colorScale = d3
    .scaleLinear()
    .domain([-maxChange, 0, maxChange])
    .range(["indigo", "white", "darkgreen"]);

  const graticuleJson = d3.geoGraticule10();

  /*  const counties = () =>
    boundsRef.current
      .selectAll(".country")
      .data(countyShapes.features)
      .enter()
      .append("path")
      .attr("class", "country")
      .attr("d", pathGenerator)
      .attr("fill", (d) => {
        const metricValue = metricDataByCounty[countyNameAccessor(d)];
        if (typeof metricValue == "undefined") return "#e2e6e9";
        return colorScale(metricValue);
      });*/

  return (
    <div id="map-wrapper" className="MapWrapper">
      <svg width={dimensions.width} height={dimensions.height}>
        <g
          ref={boundsRef}
          transform={`translate(${dimensions.marginLeft}, ${dimensions.marginTop})`}
        >
          <path className="illinois" d={pathGenerator(sphere)} />
          <path className="graticule" d={pathGenerator(graticuleJson)} />
        </g>
      </svg>
    </div>
  );
};

export default IllinoisMap;
