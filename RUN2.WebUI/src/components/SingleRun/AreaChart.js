import { useD3 } from './hooks/useD3';
import React from 'react';
import * as d3 from 'd3';

function AreaChart({ data, h, w, minmax, yLabel }) {
  const ref = useD3(
    (svg) => {
        // Compute values.
        const height = h;
        const width = w;
        const margin = { top: 0, right: 0, bottom: 0, left: 40 };

        const X = d3.map(data, (d) => {return d.x});
        const Y = d3.map(data, (d) => {return d.y});
        const I = d3.range(X.length);

        // Compute which data points are considered defined.
        const defined = (d, i) => !isNaN(X[i]) && !isNaN(Y[i]);
        const D = d3.map(data, defined);

        // Compute default domains.
        const xDomain = d3.extent(X);
        const yDomain = minmax;

        // Construct scales and axes.
        const xScale = d3.scaleLinear(xDomain, [margin.left, width - margin.right]);
        const yScale = d3.scaleLinear(yDomain, [height - margin.bottom, margin.top]);
        const xAxis = d3.axisBottom(xScale).ticks(width / 80).tickSizeOuter(0);
        const yAxis = d3.axisLeft(yScale).ticks(height / 40);

        // Construct an area generator.
        const area = d3.area()
            .defined(i => D[i])
            .curve(d3.curveBasis)
            .x(i => xScale(X[i]))
            .y0(yScale(0))
            .y1(i => yScale(Y[i]));
        
        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(yAxis)
            .call(g => g.select(".domain").remove())
            .call(g => g.append("text")
                .attr("x", -margin.left)
                .attr("y", 10)
                .attr("fill", "currentColor")
                .attr("text-anchor", "start"));
      
        svg.append("path")
            .attr("fill", '#484a4e')
            .attr("d", area(I));
      
        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(xAxis);

        
    },
    [data.length]
  );

  return (
    <svg
      ref={ref}
      style={{
        height: h,
        width: w,
        marginRight: "0px",
        marginLeft: "0px",
      }}
    ></svg>
  );
}

export default AreaChart;