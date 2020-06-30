var w = 800;
var h = 500;

var dataset = {
nodes: [
       { name: "I" },
       { name: "N" },
       { name: "T" },
       { name: "R" },
       { name: "I" },
       { name: "N" },
       { name: "Z" },
       { name: "I" },
       { name: "C" },
       { name: "S" },
],
edges: [
    { source: 0, target: 1 },
    { source: 1, target: 2 },
    { source: 2, target: 3 },
    { source: 3, target: 4 },
    { source: 4, target: 5 },
    { source: 5, target: 6 },
    { source: 6, target: 7 },
    { source: 7, target: 8 },
    { source: 8, target: 9 },
]
};

var svg = d3.select("#play")
            .append("svg")
            .attr("class", "middle")
            .attr("width", "100%")
            .attr("height", "100%");

const el = document.querySelector(".middle");
const bbox = el.getBoundingClientRect();



const center = {
    x: bbox.left + (bbox.width / 2),
    y: bbox.top + (bbox.height / 2)
};


/*
const center = {
    x: 350,
    y: 300
};
*/


console.log(center);

var force = d3.forceSimulation(dataset.nodes)
                .force("charge", d3.forceManyBody().strength(function () { return -175; }))        
                .force("link", d3.forceLink(dataset.edges).distance(function(link) { return 15; }))
                .force("y", d3.forceY().y(center.y))
                .force("center", d3.forceCenter().x(center.x).y(center.y));
                
var edges = svg.selectAll("line")
                .data(dataset.edges)
                .enter()
                .append("line")
                .style("stroke", "#ccc")
                .style("stroke-width", 1);

var colors = d3.scaleOrdinal(d3.schemeCategory10);

var nodes = svg.selectAll("circle")
                .data(dataset.nodes)
                .enter()
                .append("circle")
                .attr("r", 18)
                .style("fill", function(data, index) { return colors(index); })
                .call(d3.drag() 
                        .on("start", dragStarted)
                        .on("drag", dragging)
                        .on("end", dragEnd));

var labels = svg.selectAll("text")
                .data(dataset.nodes)
                .enter()
                .append("text")
                .attr("class", "labels")
                .text(function(data) { return data.name; })
                .call(d3.drag()
                        .on("start", dragStarted)
                        .on("drag", dragging)
                        .on("end", dragEnd));


function dragStarted(data) {
    if(!d3.event.active)
        force.alphaTarget(0.3).restart();
        data.fx = data.x;
        data.fy = data.y;
}

function dragging(data) {
    data.fx = d3.event.x;
    data.fy = d3.event.y;
}

function dragEnd(data) {
    if(!d3.event.active) 
        force.alphaTarget(0);
    data.fx = null;
    data.fy = null;
}


force.on("tick", function() {
    edges.attr("x1", function(data) { return data.source.x; })      
         .attr("y1", function(data) { return data.source.y; })
         .attr("x2", function(data) { return data.target.x; })
         .attr("y2", function(data) { return data.target.y; });
    
    nodes.attr("cx", function(data) { return data.x; })
         .attr("cy", function(data) { return data.y; });

    labels.attr("x", function(data) { return data.x; })
            .attr("y", function(data) { return data.y + 4; });
});

