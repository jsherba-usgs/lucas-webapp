/**
 * Leaflet layers module.
 * @module leaflet-layers
 */

import L from 'leaflet';
import 'leaflet-mapbox-vector-tile/dist/Leaflet.MapboxVectorTile';

const cartoDBPositron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Data: <a href="http://www.openstreetmap.org/copyright">OSM</a>, Map Tiles: <a href="http://cartodb.com/attributions">CartoDB</a>',
  subdomains: 'abcd',
  maxZoom: 19,
});
const cartoDBDarkMatter = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
  attribution: 'Data: <a href="http://www.openstreetmap.org/copyright">OSM</a>, Map Tiles: <a href="http://cartodb.com/attributions">CartoDB</a>',
  subdomains: 'abcd',
  maxZoom: 19,
});

// Caladapt source
const counties = new L.TileLayer.MVTSource({
  url: 'http://api.cal-adapt.org/vtiles/counties/{z}/{x}/{y}.pbf',
  debug: false,
  // clickableLayers: ['county'],
  mutexToggle: true,
  getIDForLayerFeature: (feature) => feature._id,
  filter: (feature, context) => true,
  style: (feature) => {
    const style = {};
    style.color = 'rgba(55,158,204,0.3)';
    style.outline = {
      color: 'rgb(255,255,255)',
      size: 0.8,
    };
    style.selected = {
      color: 'rgba(126,5,153,0.1)',
      outline: {
        color: 'rgba(126,5,153,0.5)',
        size: 2,
      },
    };
    return style;
  }
});

// Caladapt source
const hydrounits = new L.TileLayer.MVTSource({
  url: 'http://api.cal-adapt.org/vtiles/hydrounits/{z}/{x}/{y}.pbf',
  debug: false,
  // clickableLayers: ['hydrounit'],
  mutexToggle: true,
  getIDForLayerFeature: (feature) => feature._id,
  filter: (feature, context) => true,
  style: (feature) => {
    const style = {};
    style.color = 'rgba(55,158,204,0.3)';
    style.outline = {
      color: 'rgb(255,255,255)',
      size: 0.8,
    };
    style.selected = {
      color: 'rgba(126,5,153,0.1)',
      outline: {
        color: 'rgba(126,5,153,0.5)',
        size: 2,
      },
    };
    return style;
  },
});

// Caladapt source
const calenviroscreen = new L.TileLayer.MVTSource({
  url: 'http://api.cal-adapt.org/vtiles/censustracts/{z}/{x}/{y}.pbf',
  debug: false,
  // clickableLayers: ['censustract'],
  mutexToggle: true,
  getIDForLayerFeature: (feature) => feature._id,
  filter: (feature, context) => true,
  style: (feature) => {
    const style = {};
    const percentile = feature.properties.percentilerange;

    switch (percentile) {
      case '96-100%':
      case '91-95%':
        style.color = 'rgba(232,7,18,0.4)';
        break;
      case '86-90%':
      case '81-85%':
        style.color = 'rgba(243,86,31,0.4)';
        break;
      case '76-80%':
      case '71-75%':
        style.color = 'rgba(250,134,48,0.4)';
        break;
      case '66-70%':
      case '61-65%':
        style.color = 'rgba(252,146,114,0.4)';
        break;
      case '56-60%':
      case '51-55%':
        style.color = 'rgba(253,228,90,0.4)';
        break;
      case '46-50%':
      case '41-45%':
        style.color = 'rgba(231,238,114,0.4)';
        break;
      case '36-40%':
      case '31-35%':
        style.color = 'rgba(173,211,77,0.4)';
        break;
      case '26-30%':
      case '21-25%':
        style.color = 'rgba(167,205,73,0.4)';
        break;
      case '16-20%':
      case '11-15%':
        style.color = 'rgba(146,180,66,0.4)';
        break;
      default:
        style.color = 'rgba(129,159,58,0.4)';
        break;
    }
    style.outline = {
      color: 'rgb(255,255,255)',
      size: 0.8,
    };
    style.selected = {
      color: 'rgba(126,5,153,0.1)',
      outline: {
        color: 'rgba(126,5,153,0.5)',
        size: 2,
      },
    };
    return style;
  },
});

// Caladapt source
const locaModelGrid = new L.TileLayer.MVTSource({
  url: 'http://api.cal-adapt.org/vtiles/locagrid/{z}/{x}/{y}.pbf',
  debug: false,
  // clickableLayers: ['locagrid'],
  getIDForLayerFeature: (feature) => feature._id,
  mutexToggle: true,
  filter: (feature, context) => true,
  style: (feature) => {
    const style = {};
    style.color = 'rgba(255,255,255,0)';
    style.outline = {
      color: 'rgba(0,0,0, 0.2)',
      size: 0.8,
    };
    style.selected = {};
    return style;
  },
});

export { cartoDBPositron, cartoDBDarkMatter, locaModelGrid, counties, hydrounits, calenviroscreen };
