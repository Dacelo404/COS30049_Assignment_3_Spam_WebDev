import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Box } from "@mui/material";

function SpamRatio_Pie({ data })  {
  
    
  
  const chartRef = useRef();


    const drawChart = () => {
        if (!chartRef.current || !data) return;

        const spam = data.spam ?? 0;
        const not_spam = data.not_spam ?? 0;

        const dataset = { spam, not_spam };

        //get width
        const containerWidth = chartRef.current.getBoundingClientRect().width;
    
        // clear
        d3.select(chartRef.current).selectAll("*").remove();

        const width = containerWidth;
        const height = width;
        const radius = Math.min(width, height) / 2 * 0.75; 

        // SVG 
        const svg = d3
            .select(chartRef.current)
            .append("svg")
            .attr("width", "100%")
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2 + 20})`); // Added a slight downshift for the title

        // title
            svg.append("text")
            .attr("x", 0) 
            .attr("class", "chart-title")
            .attr("y", -height / 2 + 10)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .style("font-weight", "bold")
            .text("Proportion of Spam to Ham");

        const color = d3.scaleOrdinal()
            .domain(["not_spam", "spam"])
            .range(["#4f8ef7", "#e63946"]);

        const pie = d3.pie().value(d => d[1]);
        // load data here
        const data_ready = pie(Object.entries(data));

        // arc for pie
        const arc = d3.arc().innerRadius(0).outerRadius(radius);
        //arc for label
        const arcLabel = d3.arc().innerRadius(radius * 1.05).outerRadius(radius * 1.1);

        // tooltip 
        const tooltip = d3.select(chartRef.current)
            .append("div")
            .attr("class", "chart-tooltip")
            .style("position", "absolute")
            .style("background", "white")
            .style("padding", "4px 8px")
            .style("border", "1px solid #ccc")
            .style("border-radius", "4px")
            .style("opacity", 0)
            .style("pointer-events", "none");

        // slices
            svg.selectAll("path")
            .data(data_ready)
            .join("path")
            .attr("fill", d => color(d.data[0]))
            .attr("stroke", "white")
            .style("stroke-width", "2px")
            .attr("d", arc)
            
            //hover tooltip on pie
            .on("mouseover", (event, d) => {
                const [x, y] = d3.pointer(event, chartRef.current);
            
              tooltip
                .style("opacity", 1)
                .html(`<strong>${d.data[0]}</strong>: ${d.data[1]}`)
                .style("left", x + 10 + "px") 
                .style("top", y - 20 + "px");
              })
              .on("mouseout", () => tooltip.style("opacity", 0))

              .each(function (d) { this._current = d; })
              .transition()
              .duration(1200)
              .attrTween("d", function (d) {
                const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
                return t => arc(i(t));
              });

              const total = d3.sum(Object.values(data));

              //labels outside
              const textGroups = svg.selectAll("text.label")
              .data(data_ready)
              .join("text")
              .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
              .style("text-anchor", d => (d.endAngle + d.startAngle) / 2 > Math.PI ? "end" : "start")
              .attr("class", "pie-label")
              
              //fade in 
              .attr("opacity", 0)
              .transition()
              .delay(1000)
              .duration(600)
              .attr("opacity", 1)

              textGroups.each(function (d) {
              const percentage = ((d.data[1] / total) * 100).toFixed(1);
              const label = d.data[0] === "spam" ? "Spam" : "Ham";
              const text = d3.select(this);

              text.append("tspan")
                .attr("x", 0)
                .attr("dy", "0em")
                .text(`${percentage}%`);

              text.append("tspan")
                .attr("x", 0)
                .attr("dy", "1.2em")
                .text(label);

                //one line instead of 2:
              // .text(d => {
              //   const percentage = ((d.data[1] / total) * 100).toFixed(1);
              //   return d.data[0] === "spam" ? `${percentage}% \nSpam` : `${percentage}% \nHam`;
                
              });


        const legend = svg.append("g").attr("transform", `translate(${radius + 10}, -40)`);
        
    };

  useEffect(() => {
    drawChart();

    //resize
    const handleResize = () => {
      drawChart();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [data]);

  return (
    <Box sx={{ textAlign: "center", position: "relative" }}>
      <div
        ref={chartRef}
        style={{width: "100%", maxWidth:"70%", minWidth: "250px" ,margin: "0 auto", position: "relative" }}></div>
    </Box>
  );
}

export default SpamRatio_Pie;