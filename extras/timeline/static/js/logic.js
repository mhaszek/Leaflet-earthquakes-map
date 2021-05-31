// Use one of the followng links to get the GeoJSON data:

    // all earthquakes in the past hour:
// var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";

    // all earthquakes in the past day:
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

    // all earthquakes in the past week:
// var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

    // all earthquakes in the past month:
// var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";


// Link to get the tectonic plates data
var plates = "https://raw.githubusercontent.com/fraxen/tectonicplates/339b0c56563c118307b1f4542703047f5f698fae/GeoJSON/PB2002_boundaries.json"

// Retrive tectonic plates GeoJSON data
d3.json(plates, function(tectonic_data) {

    // Log data for reference
    console.log(tectonic_data);

    // Retrive earthquakes GeoJSON data
    d3.json(link, function(data) {

        // Log data for reference
        console.log(data);

        // Call function to plot earthquakes and tectonic plates on the map
        createFeatures(data.features, tectonic_data.features);

    });

});

// Define function which creates cicle on the map for each earthquake
function createFeatures(earthquakeData, tectonic_data) {

    // Define function which determines the circle size
    function markerSize(mag) {
        return mag * 5;
    };

    // Define function which determines the circle size
    function chooseColor(mag) {
        switch (true) {
            case mag > 5:
                return "#ee4545";
            case mag > 4:
                return "#ea822c";
            case mag > 3:
                return "#ee9c00";
            case mag > 2:
                return "#eecc00";
            case mag > 1:
                return "#d4ee00";  
            default:
                return "#98ee00";
        };
    };

    // Define a function which creates circles for each feature 
    function pointToLayer(feature, latlng) {

        return L.circleMarker(latlng, {
            radius: markerSize(feature.properties.mag),
            fillColor: chooseColor(feature.properties.mag),
            color: chooseColor(feature.properties.mag),
            weight: 0.5,
            opacity: 0.8,
            fillOpacity: 0.8
        });
    };

    // Define a function which binds a popup for each feature 
    function onEachFeature(feature, layer) {
        
        layer.bindPopup("<h3> Magnitude: " + feature.properties.mag +
        "</h3><hr><p>" + feature.properties.place + "</p>");
    };

    // Create a GeoJSON layer containing the features array and add it to the map
    var earthquakes = L.geoJSON(earthquakeData, {

        // Call circles function
        pointToLayer: pointToLayer,

        // Call popups function
        onEachFeature: onEachFeature

    });

    // Send earthquakes layer and tectonic_data to the createMap function
    createMap(earthquakes, tectonic_data);
}

// Define function which creates map
function createMap(earthquakes, tectonic_data) {

    // Define satellite layer
    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        maxZoom: 18,
        tileSize: 512,
        zoomOffset: -1,
        id: "mapbox/satellite-streets-v11",
        accessToken: API_KEY
    });

    // Define grayscale layer
    var grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        tileSize: 512,
        zoomOffset: -1,
        id: "light-v10",
        accessToken: API_KEY
    });

    // Define outdoors layer
    var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        maxZoom: 18,
        tileSize: 512,
        zoomOffset: -1,
        id: "mapbox/outdoors-v11",
        accessToken: API_KEY
    });

    // Define a baseMaps object to hold base layers
    var baseMaps = {
        "Satellite": satellite,
        "Grayscale": grayscale,
        "Outdoors": outdoors
    };

    // Create a GeoJSON layer containing the tectonic plates
    var tectonicplates = L.geoJson(tectonic_data, {
        style: function(feature) {
            return {
                color: "#ee9b02",
                fillColor: "white",
                fillOpacity: 0,
                weight: 1.5
            };
        }
    });

    // Create overlay object to hold overlay layers
    var overlayMaps = {
        Earthquakes: earthquakes,
        Tectonicplates: tectonicplates
    };

    // Create map with outdoors and tectonicplates layers to display on load, define timeline options
    // Timeline plugin from: https://github.com/socib/Leaflet.TimeDimension
    var myMap = L.map("map", {
        center: [41.2524, -95.9980],
        zoom: 3,
        layers: [outdoors, tectonicplates],
        timeDimension: true,
        timeDimensionOptions: {
            timeInterval: "2021-05-23/2021-05-30",
            period: "PT1H"
        },
        timeDimensionControl: true,
    });

    // Create a layer control and add it to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: true
    }).addTo(myMap);

    // Set earthquakes layer to always be on top of the tectonicplates layer
    myMap.on("overlayadd", function (event) {
        earthquakes.bringToFront();
      });

    // Set up the legend
    var legend = L.control({ position: "bottomright" });

    // Define legend layout
    legend.onAdd = function(map) {

        var div = L.DomUtil.create("div", "legend");

        div.innerHTML += '<i style="background: #98ee00"></i><span>0-1</span><br>';
        div.innerHTML += '<i style="background: #d4ee00"></i><span>1-2</span><br>';
        div.innerHTML += '<i style="background: #eecc00"></i><span>2-3</span><br>';
        div.innerHTML += '<i style="background: #ee9c00"></i><span>3-4</span><br>';
        div.innerHTML += '<i style="background: #ea822c"></i><span>4-5</span><br>';
        div.innerHTML += '<i style="background: #ee4545"></i><span>5+</span><br>';

        return div;
    };

    // Add legend to the map
    legend.addTo(myMap);

    // Create and add a timeDimension Layer to the map, update with timestamps from geoJSON file
    L.timeDimension.layer.geoJson(earthquakes, {updateTimeDimension: true}).addTo(myMap);
    
};

