import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Box } from "@mui/material";

function SpamConfidence({
  data = [
    { id: 1, subject: "Win a free iPhone", confidence: 0.91 },
    { id: 2, subject: "Meeting Reminder", confidence: 0.12 },
    { id: 3, subject: "Password Reset", confidence: 0.65 },
    { id: 4, subject: "Claim your reward", confidence: 0.85 },
    { id: 5, subject: "Project Update", confidence: 0.35 },
    { id: 6, subject: "Urgent: Account Lock", confidence: 0.51 },
    { id: 7, subject: "New Video Link", confidence: 0.18 },
    { id: 8, subject: "Cryptocurrency offer", confidence: 0.99 },
    { id: 9, subject: "Weekly Report", confidence: 0.05 },
    { id: 10, subject: "You've been selected!", confidence: 0.78 },
  ]
}) {
  const chartRef = useRef();


  //colours:
  //red = spam
  //orange = risky
  //green = healthy
  const getColor = (confidence) => {
    if (confidence > 0.8) return "#e63946";
    if (confidence >= 0.5) return "#ff9f1c";
    return "#4CAF50";
  };

  const drawChart = () => {
    if (!chartRef.current || data.length === 0) return;

    //sort id
    const sortedData = [...data].sort((a, b) => a.id - b.id);


    const containerWidth = chartRef.current.getBoundingClientRect().width;
    d3.select(chartRef.current).selectAll("*").remove();

    const margin = { top: 30, right: 30, bottom: 40, left: 60 };
    const width = containerWidth - margin.left - margin.right;
    const height = width - ((margin.top - margin.bottom) * 0.4); 

    // SVG
    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // hover tooltip
    const tooltip = d3.select(chartRef.current)
        .append("div")
        .style("position", "absolute")
        .style("background", "white")
        .style("padding", "4px 8px")
        .style("border", "1px solid #ccc")
        .style("border-radius", "4px")
        .style("opacity", 0)
        .style("pointer-events", "none");

    // scale
    const x = d3.scalePoint()
        .domain(sortedData.map(d => d.id))
        .range([0, width])
        .padding(0.5);

    //confidence 0 - 1
    const y = d3.scaleLinear()
        .domain([0, 1])
        .range([height, 0]);

    //dash lines 0.8
    svg.append("line")
        .attr("x1", 0).attr("y1", y(0.8))
        .attr("x2", width).attr("y2", y(0.8))
        .attr("stroke", getColor(0.9)).attr("stroke-dasharray", "6,6")
        .attr("opacity", 0.2).style("stroke-width", 1);


    // 0.5
    svg.append("line")
        .attr("x1", 0).attr("y1", y(0.5))
        .attr("x2", width).attr("y2", y(0.5))
        .attr("stroke", getColor(0.51)).attr("stroke-dasharray", "4,4")
        .attr("opacity", 0.5).style("stroke-width", 1);



    // data pointss
    svg.selectAll(".dot")
        .data(sortedData)
        .join("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.id))
        .attr("cy", d => y(d.confidence))
        .attr("r", 6)
        .attr("fill", d => getColor(d.confidence))
        .attr("stroke", "white")
        .attr("stroke-width", 1.5)
        .on("mouseover", function (event, d) {
            d3.select(this).attr("r", 8);

            // mouse pos
            const [mx, my] = d3.pointer(event, chartRef.current);
            const riskLevel = d.confidence > 0.8 ? "Spam" : d.confidence >= 0.5 ? "Risky" : "Healthy";

            tooltip
                .style("opacity", 1)
                .html(`
                    <strong>ID:</strong> ${d.id}<br>
                    <strong>Subject:</strong> ${d.subject}<br>
                    <strong>Confidence:</strong> ${d.confidence.toFixed(2)} (${riskLevel})
                `)
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


    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));
    
    //x label
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 5)
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Email ID");

    //y label
    svg.append("g")
        .call(d3.axisLeft(y).tickFormat(d3.format(".1f")));
    
    // Y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Spam Confidence Score (0 - 1)");


    // title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-weight", "bold")
        .style("font-size", "14px")
        .text("Spam Confidence Curve by Email ID");
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

export default SpamConfidence;