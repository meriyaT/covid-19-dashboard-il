import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { isMobile } from "react-device-detect";

const IllinoisBoundingBox = [
  [-91.883607, 42.991607],
  [-87.220299, 36.704043],
];

export const MapboxGLMap = ({
  data,
  selectedId,
  colorBreaks,
  highlightLineColor = { rgba: [255, 102, 0, 1] },
  coordinates = [-88.7, 42.49],
  zoom = 6,
  activeIndex,
}) => {
  const mapContainer = useRef(null);
  const [statefulMap, setStatefulMap] = useState(null);

  const getFillColor = (colorBreaks) => {
    let fc = [];
    fc.push("step");
    fc.push(["get", "COVID_CASES"]);
    fc.push("rgba(0,0,0,0)");
    for (let colorBreak of colorBreaks) {
      fc.push(colorBreak.break);
      fc.push(
        `rgba(${colorBreak.rgba[0]}, ${colorBreak.rgba[1]}, ${colorBreak.rgba[2]},${colorBreak.rgba[3]})`
      );
    }

    return fc;
  };

  const updateMap = () => {
    statefulMap.getSource("counties").setData(data);
    if (colorBreaks) {
      statefulMap.removeLayer("countiesSolidLayer");
      statefulMap.addLayer({
        id: "countiesSolidLayer",
        source: "counties",
        type: "fill",
        paint: { "fill-color": getFillColor(colorBreaks) },
      });
    }
  };

  const initMap = () => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoibWVyaXlhIiwiYSI6ImNrZDYzbnpkdjBrcXAyemxvZXQyZXJjbTkifQ.YzkSnFwg69LygFmBrXBcFg";

    const mapboxGlMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: `mapbox://styles/mapbox/light-v10`,
      center: [-88.974268, 40.478307],
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

      //Add a transperant color layer to highlight a county during mouseover event
      mapboxGlMap.addLayer({
        id: "county-highlight",
        source: "counties",
        type: "fill",
        paint: {
          "fill-outline-color": "rgba(103, 65, 114, 0)",
          "fill-color": "rgba(103, 65, 114, 0)",
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

        mapboxGlMap.setPaintProperty("county-highlight", "fill-color", [
          "case",
          ["==", ["get", "COUNTY_NAM"], feature.properties.COUNTY_NAM],
          "rgba(46, 49, 49, 1)",
          "rgba(0,0,0,0)",
        ]);
        let popupContent = `
                <h2>${feature.properties.COUNTY_NAM}</h2>
                <table>
                  <tr>
                    <th>Tested positive</th>
                    <td>${feature.properties.COVID_CASES}</td>
                  </tr>
                <table>
              `;
        if (isMobile) {
          popupContent = `<p>${feature.properties.COUNTY_NAM}</p><span>Tested positive ${feature.properties.COVID_CASES}</span>`;
        }
        popup.setLngLat(e.lngLat).setHTML(popupContent).addTo(mapboxGlMap);
      });

      mapboxGlMap.on("mouseleave", "countiesSolidLayer", function () {
        mapboxGlMap.getCanvas().style.cursor = "";
        popup.remove();
        mapboxGlMap.setPaintProperty(
          "county-highlight",
          "fill-color",
          "rgba(0,0,0,0)"
        );
      });

      setStatefulMap(mapboxGlMap);
    });
  };

  useEffect(() => {
    if (!statefulMap) {
      initMap();
    } else {
      if (selectedId) {
        statefulMap.setPaintProperty("county-highlight", "fill-color", [
          "case",
          ["==", ["get", "COUNTY_NAM"], selectedId.county_name.toUpperCase()],
          "rgba(46, 49, 49, 1)",
          "rgba(0,0,0,0)",
        ]);
      } else {
        statefulMap.setPaintProperty(
          "county-highlight",
          "fill-color",
          "rgba(0,0,0,0)"
        );
      }
      if (!selectedId && (activeIndex || activeIndex === 0)) {
        updateMap();
      }
    }
  }, [statefulMap, selectedId, activeIndex, data]);

  return <div className="mapbox-map" ref={mapContainer} />;
};
