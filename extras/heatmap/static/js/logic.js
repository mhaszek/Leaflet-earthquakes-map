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
// var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

    // all earthquakes in the past month:
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";


// Retrive GeoJSON data
d3.json(link, function(data) {

    // Log data for reference
    console.log(data);

    // Call function to plot earthquakes on the map
    createFeatures(data.features);

});

// Define function which creates cicle on the map for each earthquake
function createFeatures(earthquakeData) {

    var heatArray = [];

    L.geoJson(earthquakeData, {

        onEachFeature: function (feature, layer) {
            heatArray.push([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]);
        }

    });
    
    // Add marker cluster layer to the map
    var heat = L.heatLayer(heatArray, {
        radius: 40,
        blur: 20
      }).addTo(myMap);

}
