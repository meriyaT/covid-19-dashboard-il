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
  zipcodeMap = false,
}) => {
  const mapContainer = useRef(null);
  const [statefulMap, setStatefulMap] = useState(null);

  let previousSelectedId = "";

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
    statefulMap.getSource("locations").setData(data);
    if (colorBreaks) {
      statefulMap.removeLayer("locationsSolidLayer");
      statefulMap.addLayer({
        id: "locationsSolidLayer",
        source: "locations",
        type: "fill",
        paint: { "fill-color": getFillColor(colorBreaks) },
      });
    }
    previousSelectedId = "";
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
      mapboxGlMap.addSource("locations", {
        type: "geojson",
        data,
      });

      //   if (colorBreaks) {
      mapboxGlMap.addLayer({
        id: "locationsSolidLayer",
        source: "locations",
        type: "fill",
        paint: { "fill-color": getFillColor(colorBreaks) },
      });
      //   }

      if (!zipcodeMap) {
        mapboxGlMap.addLayer({
          id: "locations-solid-line",
          source: "locations",
          type: "line",
          paint: { "line-color": "gray" },
        });
      }
      //Add a transperant color layer to highlight a county during mouseover event
      mapboxGlMap.addLayer({
        id: "location-highlight",
        source: "locations",
        type: "fill",
        paint: {
          "fill-outline-color": "rgba(103, 65, 114, 0)",
          "fill-color": "rgba(103, 65, 114, 0)",
        },
      });

      //Add a transperant color layer to highlight a county during mouseover event
      mapboxGlMap.addLayer({
        id: "zip-highlight",
        source: "locations",
        type: "line",
        paint: {
          "line-color": "rgba(103, 65, 114, 0)",
          "line-width": 4,
        },
      });

      // Create a popup, but don't add it to the map yet.
      let popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });
      mapboxGlMap.on("mousemove", "locationsSolidLayer", function (e) {
        // Change the cursor style as a UI indicator.
        mapboxGlMap.getCanvas().style.cursor = "pointer";

        const feature = e.features[0];

        !zipcodeMap
          ? mapboxGlMap.setPaintProperty("location-highlight", "fill-color", [
              "case",
              ["==", ["get", "COUNTY_NAM"], feature.properties.COUNTY_NAM],
              "rgba(46, 49, 49, 1)",
              "rgba(0,0,0,0)",
            ])
          : mapboxGlMap.setPaintProperty("location-highlight", "fill-color", [
              "case",
              ["==", ["get", "zip"], feature.properties.zip],
              "rgba(245, 171, 53, 1)",
              "rgba(0,0,0,0)",
            ]);

        /*  if (zipcodeMap) {
          mapboxGlMap.setPaintProperty("zip-highlight", "fill-color", [
            "case",
            ["==", ["get", "zip"], feature.properties.zip],
            "rgba(245, 171, 53, 1)",
            "rgba(0,0,0,0)",
          ]);
        }*/
        let locationName = feature.properties.COUNTY_NAM
          ? feature.properties.COUNTY_NAM
          : feature.id;
        let covidCases = feature.properties.COVID_CASES
          ? feature.properties.COVID_CASES
          : 0;
        let popupContent = `
                <h2>${locationName}</h2>
                <table>
                  <tr>
                    <th>Tested positive</th>
                    <td>${covidCases}</td>
                  </tr>
                <table>
              `;
        if (isMobile) {
          popupContent = `<p>${locationName}</p><span>Tested positive ${covidCases}</span>`;
        }
        popup.setLngLat(e.lngLat).setHTML(popupContent).addTo(mapboxGlMap);
      });

      mapboxGlMap.on("mouseleave", "locationsSolidLayer", function () {
        mapboxGlMap.getCanvas().style.cursor = "";
        popup.remove();
        mapboxGlMap.setPaintProperty(
          "location-highlight",
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
        !zipcodeMap
          ? statefulMap.setPaintProperty("location-highlight", "fill-color", [
              "case",
              ["==", ["get", "COUNTY_NAM"], selectedId.county_name],
              "rgba(46, 49, 49, 1)",
              "rgba(0,0,0,0)",
            ])
          : statefulMap.setPaintProperty("zip-highlight", "line-color", [
              "case",
              ["==", ["get", "zip"], selectedId],
              "rgba(46, 49, 49, 1)",
              "rgba(0,0,0,0)",
            ]);
        statefulMap.on("sourcedata", function () {
          if (
            statefulMap.getSource("locations") &&
            statefulMap.isSourceLoaded("locations") &&
            previousSelectedId !== selectedId
          ) {
            let zipFeatures = statefulMap.querySourceFeatures("locations", {
              sourceLayer: "locationsSolidLayer",
              filter: ["==", ["get", "zip"], selectedId],
            });
            zipFeatures[0] && zipFeatures[0].geometry
              ? (statefulMap.flyTo({
                  center: [
                    zipFeatures[0].geometry.coordinates[0][0][0],
                    zipFeatures[0].geometry.coordinates[0][0][1],
                  ],
                  zoom: 9,
                }),
                (previousSelectedId = selectedId))
              : "";
          }
        });
      } else {
        statefulMap.setPaintProperty(
          "location-highlight",
          "fill-color",
          "rgba(0,0,0,0)"
        );
      }
      if (!selectedId || activeIndex || activeIndex === 0) {
        updateMap();
      }
    }
  }, [statefulMap, selectedId, activeIndex, data]);

  return <div className="mapbox-map" ref={mapContainer} />;
};
