import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Box } from "@mui/material";

function SusWords_Bar({
  data = { free: 1277, click: 803, money: 805, offer: 522, prize: 410 }
}) {
  const chartRef = useRef();


  const drawChart = () => {
    if (!chartRef.current) return;

    //get width
    const containerWidth = chartRef.current.getBoundingClientRect().width;
    
    // clear
    d3.select(chartRef.current).selectAll("*").remove();

    const margin = { top: 30, right: 20, bottom: 40, left: 60 };
    const width = containerWidth - margin.left - margin.right;
    const height = width - ((margin.top - margin.bottom)*0.4); 

    // SVG
    const svg = d3
        .select(chartRef.current)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const words = Object.keys(data);
    const values = Object.values(data);

    const x = d3.scaleBand().domain(words).range([0, width]).padding(0.3);
    const y = d3.scaleLinear().domain([0, d3.max(values)]).range([height, 0]);

    const barColor = "#4f8ef7";
    const hoverColor = "#e63946";


    // tooltip for hover
    const tooltip = d3.select(chartRef.current)
        .append("div")
        .style("position", "absolute")
        .attr("class", "chart-tooltip")
        .style("background", "white")
        .style("padding", "4px 8px")
        .style("border", "1px solid #ccc")
        .style("border-radius", "4px")
        .style("opacity", 0)
        .style("pointer-events", "none");

//dashed lines here
    svg.append("g")
        .attr("class", "grid")
        .attr("opacity", 0.1)
        .call(d3.axisLeft(y)
            .tickSize(-width)
            .tickFormat("")
        )
        .selectAll(".tick line") 
        .attr("stroke-dasharray", "6,6");


    // Bars
    svg.selectAll(".bar")
        .data(words)
        .join("rect")
        .attr("class", "bar")
        .attr("x", d => x(d))
        .attr("y", d => y(data[d]))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(data[d]))
        .attr("fill", barColor)
        .on("mouseover", function (event, d) {
    d3.select(this).attr("fill", hoverColor);

  // mouse pos
    const [mx, my] = d3.pointer(event, chartRef.current);

    tooltip
        .style("opacity", 1)
        .html(`<strong>${d}</strong>: ${data[d]}`)
        .style("left", `${mx + 12}px`)
        .style("top", `${my - 24}px`);
    })
    .on("mousemove", function (event) {
    const [mx, my] = d3.pointer(event, chartRef.current);
    tooltip
        .style("left", `${mx + 12}px`)
        .style("top", `${my - 24}px`);
    })
    .on("mouseout", function () {
    d3.select(this).attr("fill", barColor);
    tooltip.style("opacity", 0);
    });



    // axes
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    svg.append("g").call(d3.axisLeft(y));

    // ttle
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("class", "chart-title")
        .attr("text-anchor", "middle")
        .style("font-weight", "bold")
        .style("font-size", "14px")
        .text("Frequency of Suspicious Words");
  };

    useEffect(() => {
        drawChart();

        // resize
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
        style={{width: "100%", maxWidth:"70%",
        minWidth: "250px", minHeight: "250px",
        margin: "0 auto", position: "relative" }}>
      </div>
    </Box>
  );
}

export default SusWords_Bar;