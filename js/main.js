//mapa

var map = L.map('map',{
  fullscreenControl:true
}
).setView([41.61496, 0.62575], 14);

map.on('draw:created', function (evento) {
  var layer = evento.layer;
  capaEdicion.addLayer(layer);
});

//capas

var cartodb = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
  maxZoom: 18,
}).addTo(map);

var cartodb_mini = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
  minZoom: 0,
  maxZoom: 18,
});

var vuelo_americano = new L.tileLayer.wms("http://geoserveis.icc.cat/icc_ortohistorica/wms/service?", {
  layers: 'ovab5m',
  format: 'image/png',
  transparent: true,
  attribution: '<a href="http://www.icc.cat/Home-ICC/Web/Avis-Legal">&copy; Institut Cartogràfic y Geològic de Catalunya</a>'
});

var icon_historico = L.icon({
  iconUrl: 'imagenes/vista.png',
  iconSize: [16, 16]
});

var historico = L.geoJson(historic_lleida_4326, {
  onEachFeature: agregarPopupHistorico,
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {icon: icon_historico})
  }
});

var icon_intervencion = L.icon({
  iconUrl: 'imagenes/intervencio.png',
  iconSize: [16, 16]
});

var intervenciones = L.geoJson(null, {
  onEachFeature: agregarPopupIntervenciones,
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {icon: icon_intervencion});
  }
});

omnivore.kml('datos/intervencions_arqueo_centroids.kml', null, intervenciones);

var capaEdicion = new L.FeatureGroup().addTo(map);

//controles

L.control.scale({
  position: 'bottomright',
  imperial: false
}).addTo(map);

var baseMaps = {
  "CartoDB": cartodb,
  "Vuelo Americano 1956 1:5000 - ICGC": vuelo_americano
};

var overlays = {
  "<img src='imagenes/vista.png'/> Puntos de interés histórico": historico,
  "<img src='imagenes/intervencio.png' /> Intervenciones arqueológicas": intervenciones
};

var opciones_control_layers = {
  position: 'topleft'
};

L.control.layers(baseMaps, overlays, opciones_control_layers).addTo(map);

var opciones_geocoder = {
  position: "topleft",
  placeholder: "Buscar una dirección..."
};

L.Control.geocoder(opciones_geocoder).addTo(map);

var opciones_draw = {
  draw: {
    polygon: {
      shapeOptions: {
        color: '#C8FF00',
        weight: 2
      }
    },
    circle: false, // Elimina la funcionalidad
    rectangle: false // Elimina la funcionalidad
  },
  edit: {
    featureGroup: capaEdicion
  }
};

var drawControl = new L.Control.Draw(opciones_draw).addTo(map);

var miniMap = new L.Control.MiniMap(cartodb_mini).addTo(map);

//funciones

function agregarPopupHistorico(feature, layer) {
  layer.bindPopup(
    '<div id="caja_propiedades_popup">'
    + '<b>' + feature.properties.nom + '</b><br>'
    + feature.properties.edat + '<br>'
    + feature.properties.tipologia + '<br>'
    + '</div>'
    + '<br>'
    + '<div id="caja_foto_popup">'
    + '<img src ="' + feature.properties.imatge + '">'
    + '</div>'
);
}

function agregarPopupIntervenciones(feature, layer) {
  layer.bindPopup(
    'Codificación de la intervención: ' + '<b>' + feature.properties.codi + '</b>'
);
}
