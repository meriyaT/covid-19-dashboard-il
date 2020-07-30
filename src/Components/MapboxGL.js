import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { isMobile } from "react-device-detect";

const IllinoisBoundingBox = [
  [-94.30530163755736, 36.74643211733368],
  [-83.39230352848888, 42.63997206897545],
];

export const MapboxGLMap = ({
  data,
  selectedId,
  colorBreaks,
  highlightLineColor = { rgba: [255, 102, 0, 1] },
  coordinates = [-88.7, 42.49],
  zoom = 6,
}) => {
  const mapContainer = useRef(null);
  const [statefulMap, setStatefulMap] = useState(null);

  const getFillColor = (colorBreaks) => {
    let fc = [];
    fc.push("step");
    fc.push(["get", "COVID_CASES_TODAY"]);
    fc.push("rgba(0,0,0,0)");
    for (let colorBreak of colorBreaks) {
      fc.push(colorBreak.break);
      fc.push(
        `rgba(${colorBreak.rgba[0]}, ${colorBreak.rgba[1]}, ${colorBreak.rgba[2]},${colorBreak.rgba[3]})`
      );
    }

    return fc;
  };
  const initMap = () => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoibWVyaXlhIiwiYSI6ImNrZDYzbnpkdjBrcXAyemxvZXQyZXJjbTkifQ.YzkSnFwg69LygFmBrXBcFg";

    const mapboxGlMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: `mapbox://styles/mapbox/light-v10`,
      scrollZoom: true,
      zoom: zoom,
    });
    mapboxGlMap.addControl(new mapboxgl.NavigationControl());
    mapboxGlMap.addControl(new mapboxgl.FullscreenControl());

    mapboxGlMap.on("load", () => {
      mapboxGlMap.fitBounds(IllinoisBoundingBox);

      mapboxGlMap.addSource("counties", {
        type: "geojson",
        data,
      });

      if (colorBreaks) {
        mapboxGlMap.addLayer({
          id: "countiesSolidLayer",
          source: "counties",
          type: "fill",
          paint: { "fill-color": getFillColor(colorBreaks) },
        });
      }

      mapboxGlMap.addLayer({
        id: "counties-solid-line",
        source: "counties",
        type: "line",
        paint: { "line-color": "gray" },
      });
      mapboxGlMap.addLayer({
        id: "aoi-highlight",
        source: "counties",
        type: "line",
        paint: {
          "line-color": `rgba(65, 131, 215, 1)`,
          "line-width": 3,
        },
      });
      // Create a popup, but don't add it to the map yet.
      let popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });
      mapboxGlMap.on("mousemove", "countiesSolidLayer", function (e) {
        // Change the cursor style as a UI indicator.
        mapboxGlMap.getCanvas().style.cursor = "pointer";

        const feature = e.features[0];

        let popupContent = `
                <h2>${feature.properties.COUNTY_NAM} ${
          feature.properties.County === "Chicago" ? "" : "county"
        }</h2>
                <table>
                  <tr>
                    <th>Tested positive</th>
                    <td>${feature.properties.COVID_CASES_TODAY}</td>
                  </tr>
                <table>
              `;
        if (isMobile) {
          popupContent = `<p>${feature.properties.COUNTY_NAM} ${
            feature.properties.County === "Chicago" ? "" : "county"
          }</p><span>Tested positive ${
            feature.properties.COVID_CASES_TODAY
          }</span>`;
        }
        popup.setLngLat(e.lngLat).setHTML(popupContent).addTo(mapboxGlMap);
      });

      mapboxGlMap.on("mouseleave", "countiesSolidLayer", function () {
        mapboxGlMap.getCanvas().style.cursor = "";
        popup.remove();
      });

      setStatefulMap(mapboxGlMap);
    });
  };

  useEffect(() => {
    if (!statefulMap) {
      initMap();
    } else {
      if (selectedId) {
        statefulMap.setPaintProperty("aoi-highlight", "line-color", [
          "case",
          ["==", ["get", "COUNTY_NAM"], selectedId.county_name.toUpperCase()],
          `rgba(65, 131, 215, 1)`,
          "rgba(0,0,0,0)",
        ]);
      } else {
        statefulMap.setPaintProperty(
          "aoi-highlight",
          "line-color",
          "rgba(0,0,0,0)"
        );
      }
    }
  }, [statefulMap, selectedId]);

  return <div className="mapbox-map" ref={mapContainer} />;
};
