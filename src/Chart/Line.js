import React from "react";
import * as d3 from "d3";

const Line = ({
  type,
  data,
  xAccessor,
  yAccessor,
  y0Accessor,
  interpolation,
  ...props
}) => {
  const lineGenerator =
    type === "line"
      ? d3
          .line()
          .x((d) => {
            return xAccessor(d);
          })
          .y((d) => {
            return yAccessor(d);
          })
          .curve(interpolation)
      : d3
          .area()
          .x((d) => xAccessor(d))
          .y((d) => yAccessor(d));

  if (type === "area") {
    lineGenerator.y0(y0Accessor).y1(yAccessor);
  }

  return (
    <path
      {...props}
      className={`Line Line--type-line`}
      d={lineGenerator(data)}
    />
  );
};

export default Line;
