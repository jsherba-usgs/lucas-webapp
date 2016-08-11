import d3 from 'd3';

export const stateclassColorScale = d3.scale.ordinal()
  .range(['#a65628', '#4daf4a', '#ff7f00', '#f781bf', '#377eb8', '#e41a1c', '#ffff33',
    '#999999', '#984ea3'])
  .domain(['Forest', 'Grassland', 'Shrubland', 'Wetland', 'Water', 'Barren', 'Agriculture',
    'Developed', 'Plantation']);
