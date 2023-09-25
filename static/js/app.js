// Url used to access JSON data.
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Generates an initial set of graphics when page is opened.
let initialDisplay = "940";
generatePlots(initialDisplay);

function optionChanged(value) {
    generatePlots(value);
}

// Generates plots by getting data from the above url.
function generatePlots(input) {
    d3.json(url).then(function(data) {

        // Add subject ID options to drop down list.
        sampleIDs = data.samples.map(obj => obj.id);
        selector = document.getElementById("selDataset");
        for (let i = 0; i < sampleIDs.length; i++) {
            let option = document.createElement("option");
            option.text = sampleIDs[i];
            selector.add(option);
        }
    
        // Set current value based on user input. 
        current = data.samples.find(obj => obj.id === input);
        
        
        // Create bar chart for currently selected used.
        let barChart = {
            x: current.sample_values.slice(0,10).map(val => val),
            y: current.otu_ids.slice(0,10).map(val => `OTU ${val}`),
            hovertemplate: current.otu_labels.slice(0,10).map(val => val),
            type: "bar",
            orientation: "h"
        };
        let barGraphData = [barChart];
        let barLayout = {title: "Top Ten OTUs"};
    
        // Display bar chart at id=bar
        Plotly.newPlot("bar", barGraphData, barLayout);
    
        // Create bubble chart.
        let bubbleChart = {
            x: current.otu_ids,
            y: current.sample_values,
            text: current.otu_labels,
            mode: "markers",
            marker: {
                color: current.otu_ids,
                size: current.sample_values
            },
            type: "bubble"
        };
        let bubbleGraphData = [bubbleChart];
        let bubbleLayout = {title: "Sample Value by ID"};
    
        // Display bubble chart at id=bubble.
        Plotly.newPlot("bubble", bubbleGraphData, bubbleLayout)

        // Display metadata for currently selected subject.
        let md = data.metadata.find(obj => obj.id === parseInt(input));
        keys = Object.keys(md);
        values = Object.values(md);
        mdString = "";
        for (let i = 0; i < keys.length; i++) {
            mdString = mdString.concat(`${keys[i]}: ${values[i]} <br>`);
        }

        metadata = document.getElementById("sample-metadata");
        metadata.innerHTML = mdString;

    });
};


