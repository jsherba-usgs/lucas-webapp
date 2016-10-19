import d3 from 'd3';

export const stateclassColorScale = d3.scale.ordinal()
  .range([
    '#ff8040',
    '#c0c0c0',
    '#000',
    '#008000',
    '#ffff80',
    '#a6a600',
    '#0080ff',
    '#ff00ff',
    '#80ffff'
  ]).domain([
    'Agriculture',
    'Barren',
    'Developed',
    'Forest',
    'Grassland',
    'Shrubland',
    'Water',
    'Plantation',
    'Wetland'
  ]);
