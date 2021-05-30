// Create map variable
var myMap = L.map("map", {
    center: [41.2524, -95.9980],
    zoom: 4
});

// Create map layer
var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    tileSize: 512,
    zoomOffset: -1,
    id: "light-v10",
    accessToken: API_KEY
}).addTo(myMap);


// Use one of the followng links to get the GeoJSON data:

    // all earthquakes in the past hour:
// var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";

    // all earthquakes in the past day:
// var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

    // all earthquakes in the past week:
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

    // all earthquakes in the past month:
// var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";


// Retrive GeoJSON data
d3.json(link, function(data) {

    // Log data for reference
    console.log(data);

    // Call function to plot earthquakes on the map
    createFeatures(data.features);

});

// Define function which creates cicle on the map for each earthquake
function createFeatures(earthquakeData) {

    // Create a new marker cluster group
    var markers = L.markerClusterGroup();

    // Define a function which binds a popup for each feature 
    function onEachFeature(feature, layer) {
        
        layer.bindPopup("<h3> Magnitude: " + feature.properties.mag +
        "</h3><hr><p>" + feature.properties.place + "</p>");

    }

    // Create a GeoJSON layer containing the features array and add it to the map
    var geoJsonLayer = L.geoJSON(earthquakeData, {

        // Call popups function
        onEachFeature: onEachFeature

    });

    // Add markers to the marker cluster group
    markers.addLayer(geoJsonLayer);

    // Add marker cluster layer to the map
    myMap.addLayer(markers);

}
