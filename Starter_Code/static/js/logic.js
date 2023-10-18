url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
depth = function(d){
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
d3.json(url).then(function(eqData){
    console.log(eqData)
    map = L.map("map",{
        center:[0,0],
        zoom: 2
    })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    L.geoJson(eqData,{
        pointToLayer:function(feature, cord){
            return L.circleMarker(cord,{
                color: depth(feature.geometry.coordinates[2]),
                fillColor: depth(feature.geometry.coordinates[2]),
                opacity: 1,
                fillOpacity: .3, 
                radius: feature.properties.mag * 10
            })
        },
        onEachFeature: function(feature, layer){
            layer.bindPopup(`<h1>LOCATION: ${feature.properties.place.toUpperCase()},
            LATITUDE: ${feature.geometry.coordinates[1]},
            LONGITUDE: ${feature.geometry.coordinates[0]},
            MAGNITUDE: ${feature.properties.mag}</h1>`);
        }}).addTo(map);

    control = L.control({position:"bottomright"})
    control.onAdd = function(){
        let box = L.DomUtil.create("div","legends")
        let depths = [90,70,50,30,0]

        box.innerHTML = "<h3>Key</h3>"
        for (let d=0; d < depths.length; d++) {
            let display;

            if (d == 0){
                display = "90+"
            } else if (d == depths.length -1) {
                display = "<=30"
            }else {
                display = `${depths[d-1]}-${depths[d]}`
            }

            box.innerHTML +=`<div>
            <div class="description" style="background-color:${depth(depths[d])}"></div> ${display}
            </div>`
        }
        

        return box
    }
    control.addTo(map);
})