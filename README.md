# NAINI LAKE DUSTBINS MAPPING

An interactive geospatial visualization of field-surveyed dustbin locations around Naini Lake, Nainital, highlighting the spatial concentration and distribution of surveyed waste infrastructure.

##  LIVE DEMO

[View the Interactive Map](https://nidhivert.github.io/naini-lake-dustbins-mapping/)

##  PROJECT OVERVIEW

This project visualizes geotagged dustbin locations collected through field surveying around Naini Lake, Nainital.
The objective is to understand the spatial distribution and concentration of surveyed waste infrastructure using an interactive web-based map.
After data cleaning, **54 valid geotagged dustbin observations** were retained for spatial analysis.

##  KEY FEATURES

- Interactive map of 54 surveyed dustbin locations
- Spatial density heatmap
- Individual dustbin markers with field photographs
- Dustbin-type filtering
- Automatic map zooming for filtered observations
- Dustbin type distribution chart
- Interactive popups containing dustbin information and photographs
- Responsive web interface

##  KEY FINDINGS

Among the mapped observations, **Blue green dustbins were the most frequently recorded type, with 28 out of 54 observations**.
The heatmap highlights areas where surveyed dustbin locations are more spatially concentrated.
> **Note:** The heatmap represents the concentration of surveyed dustbin observations. It should not be interpreted as a measure of waste generation, waste volume, or overflow intensity.

##  DATA & METHEDOLOGY

### DATA COLLECTION

The original data were collected through field surveys around Naini Lake, Nainital, using geotagged observations.
Each valid observation included:

- Geographic coordinates
- Dustbin type
- Overflow status
- Field photograph

### DATA CLEANING

The original dataset contained **55 submissions**.
After removing the incomplete observation without valid geographic coordinates, **54 observations** were retained for mapping.
Python and Pandas were used for data cleaning and preparation.

### SPATIAL ANALYSIS

The project uses:

- Point mapping to display individual surveyed locations
- A heatmap to visualize spatial concentration
- Dustbin type as a categorical filter

##  TOOLS & TECHNOLOGIES

- HTML
- CSS
- JavaScript
- Leaflet.js
- Chart.js
- Python
- Pandas
- CSV
- GitHub Pages
