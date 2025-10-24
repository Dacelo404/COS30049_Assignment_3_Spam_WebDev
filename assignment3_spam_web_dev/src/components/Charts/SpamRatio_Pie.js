import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Box } from "@mui/material";

function SpamRatio_Pie({ data = { spam: 23, not_spam: 77 } }) {
    const chartRef = useRef();


    const drawChart = () => {
        if (!chartRef.current) return;

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

        // tooltip 
        const tooltip = d3.select(chartRef.current)
            .append("div")
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
            .attr("d", arc)
            .attr("fill", d => color(d.data[0]))
            .attr("stroke", "white")
            .style("stroke-width", "2px")
            .on("mouseover", (event, d) => {
                const [x, y] = d3.pointer(event, chartRef.current);
            
        tooltip
            .style("opacity", 1)
            .html(`<strong>${d.data[0]}</strong>: ${d.data[1]}`)
            .style("left", x + 10 + "px") 
            .style("top", y - 20 + "px");
        })
        .on("mouseout", () => tooltip.style("opacity", 0));

        const total = d3.sum(Object.values(data));
        // label
        svg.selectAll("text.label")
            .data(data_ready)
            .join("text")
            .text(d => `${((d.data[1] / total) * 100).toFixed(1)}%`)
            .attr("transform", d => `translate(${arc.centroid(d)})`)
            .style("text-anchor", "middle")
            .style("font-size", "14px")
            .style("font-weight", "bold");
        const legend = svg.append("g").attr("transform", `translate(${radius + 10}, -40)`);
        
        // draw legend
        ["not_spam", "spam"].forEach((label, i) => {
            const y = i * 25;
            legend.append("rect")
                .attr("x", 0)
                .attr("y", y + 140)
                .attr("width", 15)
                .attr("height", 15)
                .attr("fill", color(label));
            legend.append("text")
                .attr("x", 25)
                .attr("y", y + 150)
                .text(label.replace("_", " "))
                .style("font-size", "13px")
                .attr("alignment-baseline", "middle");
        });
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