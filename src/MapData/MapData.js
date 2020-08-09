import il_geojson from "./illinois-geojson";
import zip_geojson from "./zipcode-geojson";
import * as d3 from "d3";

const formatValue = (d) => `${d3.format(".1f")(d)}`;

export const il_county_geo_data = () => {
  return il_geojson;
};

export const color_breaks = () => {
  const alpha = 0.65;

  const colorBreaks = [
    { rgba: [241, 169, 160, alpha], break: 0 },
    { rgba: [241, 130, 141, alpha], break: 3 },
    { rgba: [226, 106, 106, alpha], break: 10 },
    { rgba: [210, 77, 87, alpha], break: 20 },
    { rgba: [214, 69, 65, alpha], break: 50 },
    { rgba: [192, 57, 43, alpha], break: 75 },
    { rgba: [150, 40, 27, alpha], break: 100 },
  ];

  return colorBreaks;
};

export const color_breaks_total = () => {
  const alpha = 0.65;

  const colorBreaks = [
    { rgba: [241, 169, 160, alpha], break: 0 },
    { rgba: [241, 130, 141, alpha], break: 500 },
    { rgba: [226, 106, 106, alpha], break: 1000 },
    { rgba: [210, 77, 87, alpha], break: 3000 },
    { rgba: [214, 69, 65, alpha], break: 5000 },
    { rgba: [192, 57, 43, alpha], break: 10000 },
    { rgba: [150, 40, 27, alpha], break: 30000 },
  ];

  return colorBreaks;
};

export const color_breaks_zipcode_total = () => {
  const alpha = 0.65;

  const colorBreaks = [
    { rgba: [241, 169, 160, alpha], break: 0 },
    { rgba: [241, 130, 141, alpha], break: 50 },
    { rgba: [226, 106, 106, alpha], break: 100 },
    { rgba: [210, 77, 87, alpha], break: 200 },
    { rgba: [214, 69, 65, alpha], break: 500 },
    { rgba: [192, 57, 43, alpha], break: 1000 },
    { rgba: [150, 40, 27, alpha], break: 3000 },
  ];

  return colorBreaks;
};

export const color_breaks_zipcode_today = () => {
  const alpha = 0.65;

  const colorBreaks = [
    { rgba: [241, 169, 160, alpha], break: 0 },
    { rgba: [241, 130, 141, alpha], break: 5 },
    { rgba: [226, 106, 106, alpha], break: 10 },
    { rgba: [210, 77, 87, alpha], break: 15 },
    { rgba: [214, 69, 65, alpha], break: 20 },
    { rgba: [192, 57, 43, alpha], break: 30 },
    { rgba: [150, 40, 27, alpha], break: 50 },
  ];

  return colorBreaks;
};

export const color_breaks_zipcode_7day = () => {
  const alpha = 0.65;

  const colorBreaks = [
    { rgba: [241, 169, 160, alpha], break: 0 },
    { rgba: [241, 130, 141, alpha], break: 0.2 },
    { rgba: [226, 106, 106, alpha], break: 0.5 },
    { rgba: [210, 77, 87, alpha], break: 1.0 },
    { rgba: [214, 69, 65, alpha], break: 1.5 },
    { rgba: [192, 57, 43, alpha], break: 2.5 },
    { rgba: [150, 40, 27, alpha], break: 5.0 },
  ];

  return colorBreaks;
};

export const il_county_covid_geo_data_today = (countyBreakdown) => {
  for (let f of il_geojson.features) {
    f.properties.COVID_CASES = 0;
    for (let c of countyBreakdown) {
      if (f.properties.COUNTY_NAM === c.county_name.toUpperCase()) {
        c.positives_today > 0
          ? (f.properties.COVID_CASES =
              f.properties.COVID_CASES + parseInt(c.positives_today))
          : (f.properties.COVID_CASES = 0);
      }
      if (f.properties.COUNTY_NAM === "COOK") {
        if (c.county_name === "Chicago") {
          f.properties.COVID_CASES =
            f.properties.COVID_CASES + parseInt(c.positives_today);
        }
      }
    }
  }

  return il_geojson;
};

export const il_county_covid_geo_data_total = (countyBreakdown) => {
  for (let f of il_geojson.features) {
    f.properties.COVID_CASES = 0;

    for (let c of countyBreakdown) {
      if (f.properties.COUNTY_NAM === c.county_name.toUpperCase()) {
        c.positives_total > 0
          ? (f.properties.COVID_CASES =
              f.properties.COVID_CASES + parseInt(c.positives_total))
          : (f.properties.COVID_CASES = 0);
      }
      if (f.properties.COUNTY_NAM === "COOK") {
        if (c.county_name === "Chicago") {
          f.properties.COVID_CASES =
            f.properties.COVID_CASES + parseInt(c.positives_total);
        }
      }
    }
  }
  return il_geojson;
};

export const il_zipcode_covid_geo_data_total = (zipcodeBreakdown) => {
  for (let f of zip_geojson.features) {
    f.properties = {};
    f.properties.zip = f.id.toString();
    f.properties.COVID_CASES = 0;
    for (let c of zipcodeBreakdown) {
      if (f.id === parseInt(c[0])) {
        f.properties.COVID_CASES = c[1].infected_total
          ? parseInt(c[1].infected_total)
          : 0;
      }
    }
  }
  return zip_geojson;
};

export const il_zipcode_covid_geo_data_today = (zipcodeBreakdown) => {
  for (let f of zip_geojson.features) {
    f.properties = {};
    f.properties.zip = f.id.toString();
    f.properties.COVID_CASES = 0;
    for (let c of zipcodeBreakdown) {
      if (f.id === parseInt(c[0])) {
        f.properties.COVID_CASES = c[1].infected_today
          ? parseInt(c[1].infected_today)
          : 0;
      }
    }
  }
  return zip_geojson;
};

export const il_zipcode_covid_geo_data_7day = (zipcodeBreakdown) => {
  for (let f of zip_geojson.features) {
    f.properties = {};
    f.properties.zip = f.id.toString();
    f.properties.COVID_CASES = 0;
    for (let c of zipcodeBreakdown) {
      if (f.id === parseInt(c[0])) {
        f.properties.COVID_CASES = c[1].infected_7ma
          ? parseFloat(formatValue(c[1].infected_7ma))
          : 0;
      }
    }
  }
  return zip_geojson;
};
