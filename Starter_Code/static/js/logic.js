url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
depth = function(d){
    if (d >= 90) {
         return "red"}
         else if (d>=70){
            return "green"
         }
         else if (d>=50){
            return "orange"
         }
         else if (d>=30){
            return "yellow"
         }
         else {
            return "blue"
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
    L.geoJson(eqData,{pointToLayer:function(feature, cord){
        return L.circleMarker(cord,{
            color: depth(feature.geometry.coordinates[2]),
            fillColor: depth(feature.geometry.coordinates[2]),
            opacity: 1,
            fillOpacity: .7, 
            radius: feature.properties.mag * 10
        })
    }}).addTo(map);
})