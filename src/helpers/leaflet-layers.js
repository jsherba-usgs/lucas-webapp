/**
 * Leaflet layers module.
 * @module leaflet-layers
 */

import L from 'leaflet';

const cartoDBPositron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Data: <a href="http://www.openstreetmap.org/copyright">OSM</a>, Map Tiles: <a href="http://cartodb.com/attributions">CartoDB</a>',
  subdomains: 'abcd',
  maxZoom: 19,
});

const cartoDBPositronLabelsOnly = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
 // attribution: 'Data: <a href="http://www.openstreetmap.org/copyright">OSM</a>, Map Tiles: <a href="http://cartodb.com/attributions">CartoDB</a>',
  subdomains: 'abcd',
  maxZoom: 19,
});

const cartoDBDarkMatter = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
  attribution: 'Data: <a href="http://www.openstreetmap.org/copyright">OSM</a>, Map Tiles: <a href="http://cartodb.com/attributions">CartoDB</a>',
  subdomains: 'abcd',
  maxZoom: 19,
});

const stateclassTiles = L.tileLayer('http://stage.landcarbon.org/tiles/s6368-it0001-ts2001-sc/{z}/{x}/{y}.png', {
  attribution: 'LULC: <a href="http://landcarbon.org">LandCarbon</a>',
  maxZoom: 19,
  //scenario: '6368',
  //iteration: '0001',
  //year: '2001'
});

export { cartoDBPositron, cartoDBPositronLabelsOnly, cartoDBDarkMatter, stateclassTiles };
