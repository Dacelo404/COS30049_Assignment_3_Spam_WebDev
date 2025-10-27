import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Box } from "@mui/material";

function ClusterData_Scatter({
  data = [
    { x: 10, y: 20, cluster: 1 },
    { x: 5, y: 5, cluster: 0 },
    { x: 12, y: 8, cluster: 1 },
    { x: 20, y: 15, cluster: 0 },
    { x: 8, y: 18, cluster: 1 },
  ],
}) {
  const chartRef = useRef();

  const drawChart = () => {
    if (!chartRef.current) return;

    // clear
    d3.select(chartRef.current).selectAll("*").remove();

    const containerWidth = chartRef.current.getBoundingClientRect().width;
    const margin = { top: 30, right: 20, bottom: 40, left: 60 };
    const width = containerWidth - margin.left - margin.right;
    const height = width - ((margin.top - margin.bottom)*0.4);

    // SVG setup
    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // scales
    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.x) * 1.1])
      .range([0, width]);
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.y) * 1.1])
      .range([height, 0]);

    const color = d3.scaleOrdinal()
      .domain([0, 1])
      .range(["#4f8ef7", "#e63946"]);

    // tooltip
    const tooltip = d3
      .select(chartRef.current)
      .append("div")
      .attr("class", "chart-tooltip")
      .style("position", "absolute")
      .style("background", "white")
      .style("padding", "4px 8px")
      .style("border", "1px solid #ccc")
      .style("border-radius", "4px")
      .style("opacity", 0)
      .style("pointer-events", "none");

    // grid
    svg.append("g")
      .attr("opacity", 0.1)
      .call(
        d3.axisLeft(y)
          .tickSize(-width)
          .tickFormat("")
      )
      .selectAll(".tick line")
      .attr("stroke-dasharray", "6,6");

    // points
    svg.selectAll(".dot")
      .data(data)
      .join("circle")
      .attr("class", "dot")
      .attr("cx", (d) => x(d.x))
      .attr("cy", (d) => y(d.y))
      .attr("r", 4)
      .attr("fill", (d) => color(d.cluster))
      .attr("opacity", 0.8)
      .on("mouseover", function (event, d) {
        d3.select(this).attr("r", 8);
        const [mx, my] = d3.pointer(event, chartRef.current);
        tooltip
          .style("opacity", 1)
          .html(
            `<strong>Classification:</strong> ${d.cluster === 1 ? "Spam" : "Not Spam"}`
          )
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
        d3.select(this).attr("r", 6);
        tooltip.style("opacity", 0);
      });

    // axes
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    // axis labels
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height + 35)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .text("Suspicious Word Percentage");

    svg.append("text")
      .attr("x", -height / 2)
      .attr("y", -45)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .text("Web Word Percentage");

    // title
    svg.append("text")
      .attr("x", width / 2)
      .attr("class", "chart-title")
      .attr("y", -10)
      .attr("text-anchor", "middle")
      .style("font-weight", "bold")
      .style("font-size", "14px")
      .text("Cluster Distribution of Emails");
  };

  useEffect(() => {
    drawChart();
    const handleResize = () => drawChart();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [data]);

  return (
    <Box sx={{ textAlign: "center", position: "relative" }}>
      <div
        ref={chartRef}
        style={{
          width: "100%",
          maxWidth: "70%",
          minWidth: "250px",
          minHeight: "250px",
          margin: "0 auto",
          position: "relative",
        }}
      ></div>
    </Box>
  );
}

export default ClusterData_Scatter;
