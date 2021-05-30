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

// Set up the legend
var legend = L.control({ position: "bottomright" });

// Define legend layout
legend.onAdd = function(map) {

    var div = L.DomUtil.create("div", "legend");

    div.innerHTML += '<i style="background: #b7f34d"></i><span>0-1</span><br>';
    div.innerHTML += '<i style="background: #e1f34d"></i><span>1-2</span><br>';
    div.innerHTML += '<i style="background: #f3ba4d"></i><span>2-3</span><br>';
    div.innerHTML += '<i style="background: #f3ba4d"></i><span>3-4</span><br>';
    div.innerHTML += '<i style="background: #f0a76b"></i><span>4-5</span><br>';
    div.innerHTML += '<i style="background: #f06b6b"></i><span>5+</span><br>';

    return div;
};

// Add legend to the map
legend.addTo(myMap);


// Use one of the followng links to get the GeoJSON data:

    // all earthquakes in the past hour:
// var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";

    // all earthquakes in the past day:
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

    // all earthquakes in the past week:
// var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

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

    // Define function which determines the circle size
    function markerSize(mag) {
        return mag * 5;
    }

    // Define function which determines the circle size
    function chooseColor(mag) {
        switch (true) {
            case mag > 5:
                return "#f06b6b";
            case mag > 4:
                return "#f0a76b";
            case mag > 3:
                return "#f3ba4d";
            case mag > 2:
                return "#f3db4d"; 
            default:
                return "#b7f34d";
        }
    }

    // Define a function which creates circles for each feature 
    function pointToLayer(feature, latlng) {

        return L.circleMarker(latlng, {
            radius: markerSize(feature.properties.mag),
            fillColor: chooseColor(feature.properties.mag),
            color: "#000",
            weight: 0.5,
            opacity: 1,
            fillOpacity: 1
        });
    }

    // Define a function which binds a popup for each feature 
    function onEachFeature(feature, layer) {
        
        layer.bindPopup("<h3> Magnitude: " + feature.properties.mag +
        "</h3><hr><p>" + feature.properties.place + "</p>");
    }

    // Create a GeoJSON layer containing the features array and add it to the map
    L.geoJSON(earthquakeData, {

        // Call circles function
        pointToLayer: pointToLayer,

        // Call popups function
        onEachFeature: onEachFeature

    }).addTo(myMap);

}
