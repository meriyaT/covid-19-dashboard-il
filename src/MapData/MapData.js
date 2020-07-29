import il_geojson from "./illinois-geojson";

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

export const il_county_covid_geo_data = (countyBreakdown) => {
  for (let f of il_geojson.features) {
    for (let c of countyBreakdown) {
      if (f.properties.COUNTY_NAM === c.county_name.toUpperCase()) {
        c.positives_today > 0
          ? (f.properties.COVID_CASES_TODAY = parseInt(c.positives_today))
          : (f.properties.COVID_CASES_TODAY = 0);
      }
    }
  }

  return il_geojson;
};
