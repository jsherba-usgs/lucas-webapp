


var map = new L.Map('strata-leaflet', {
  'center': [37.8, -96],
  'zoom': 4,
  'layers': [
    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
    })
  ]
});/*

$.getJSON('states.geojson', function (collection) {

    var selected

    // Create new geojson layer
    new L.GeoJSON(collection, {
      // Set default style
      'style': function () {
        return {
          'color': 'yellow',
        }
      }
    }).on('click', function (e) {
      // Check for selected
      if (selected) {
        // Reset selected to default style
        e.target.resetStyle(selected)
      }
      // Assign new selected
      selected = e.layer
      // Bring selected to front
      selected.bringToFront()
      // Style selected
      selected.setStyle({
        'color': 'red'
      })
    }).addTo(map)

})*/