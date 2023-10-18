//linking to the geojson url to a value to be accessed
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

//Creating a value to represent depth
depth = function(d){
    //Using if statements to color coordinate based on depth
    if (d >= 90) {
         return "maroon"}
         else if (d>=70){
            return "red"
         }
         else if (d>=50){
            return "orange"
         }
         else if (d>=30){
            return "yellow"
         }
         else {
            return "lime"
         }
}
//Jsonifying the URL data via d3 to connect to the html
d3.json(url).then(function(eqData){
    //allowing the data to be viewed in the console
    console.log(eqData)
    // creating a map value to access the map div tag in html
    map = L.map("map",{
        center:[0,0],
        zoom: 2
    })
    // Using Leaflet to choose the tile layer design on the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    // a format for encoding a variety of geographic data structures 
    L.geoJson(eqData,{
        //setting the location of the data on the map
        pointToLayer:function(feature, cord){
            //Formatting the design of the data
            return L.circleMarker(cord,{
                color: depth(feature.geometry.coordinates[2]),
                fillColor: depth(feature.geometry.coordinates[2]),
                opacity: 1,
                fillOpacity: .3, 
                radius: feature.properties.mag * 10
            })
        },
        //Allowing a popup display on each displayed feature on the map
        onEachFeature: function(feature, layer){
            layer.bindPopup(`<h1>LOCATION: ${feature.properties.place.toUpperCase()},
            LATITUDE: ${feature.geometry.coordinates[1]},
            LONGITUDE: ${feature.geometry.coordinates[0]},
            MAGNITUDE: ${feature.properties.mag}</h1>`);
        }}).addTo(map);
        //Placing a legend
    control = L.control({position:"bottomright"})
    control.onAdd = function(){
        let box = L.DomUtil.create("div","legends")
        let depths = [90,70,50,30,0]

        //For loop to display labels with colors of the depth
        box.innerHTML = "<h3>Depth Measure</h3>"
        for (let d=0; d < depths.length; d++) {
            let display;

            if (d == 0){
                display = "90+"
            } else if (d == depths.length -1) {
                display = "<=30"
            }else {
                display = `${depths[d-1]}-${depths[d]}`
            }
            //connecting with the css file to set up coloration
            box.innerHTML +=`<div>
            <div class="description" style="background-color:${depth(depths[d])}"></div> ${display}
            </div>`
        }
        
        //calling the value to be displayed
        return box
    }//adding to the map so appear on the html  
    control.addTo(map);
})