import d3 from 'd3';

export const stateclassColorScale = d3.scale.ordinal()
  .range(['#ffff33', '#e41a1c', '#999999', '#a65628',
    '#4daf4a', '#ff7f00', '#377eb8', '#984ea3', '#f781bf'])
  .domain(['Agriculture', 'Barren', 'Developed', 'Forest',
    'Grassland', 'Shrubland', 'Water', 'Plantation', 'Wetland']);
