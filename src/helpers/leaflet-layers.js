/**
 * Leaflet layers module.
 * @module leaflet-layers
 */

import L from 'leaflet';
import config from './api-config';


const tileEndpoint = config.tileEndpoint

const cartoDBPositron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
 // attribution: 'Data: <a href="http://www.openstreetmap.org/copyright">OSM</a>, Map Tiles: <a href="http://cartodb.com/attributions">CartoDB</a>',
  subdomains: 'abcd',
  maxZoom: 19,
});



  const stateclassTiles = L.tileLayer(tileEndpoint+'s6370-it0001-ts2011-sc/{z}/{x}/{y}.png', {
 // attribution: 'LULC: <a href="http://landcarbon.org">LandCarbon</a>',
  maxZoom: 19,
  opacity: 1,
  subdomains: 'abcd',
  //tileSize: 512,
  //scenario: '6368',
  //iteration: '0001',
  //year: '2001'
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

const CartoDB_DarkMatterNoLabels = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
  subdomains: 'abcd',
  maxZoom: 19
});
// https: also suppported.
const Stamen_TonerLabels = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
});



//const statelassTilePath = `http://127.0.0.1:8000/tiles/s${scenario}-it${iteration}-ts${year}-sc/{z}/{x}/{y}.png?style=lulc`;

//const tgapTilPath = `http://127.0.0.1:8000/tiles/s${scenario}-it0000-ts${year}-tgap${layer}/{z}/{x}/{y}.png?style=${layer}`
export { cartoDBPositron, cartoDBPositronLabelsOnly, cartoDBDarkMatter, CartoDB_DarkMatterNoLabels, Stamen_TonerLabels, stateclassTiles};
