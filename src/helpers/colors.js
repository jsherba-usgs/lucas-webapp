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

export const transitionColorScale = d3.scale.ordinal()
  .range([
   '#7fc97f',
   '#beaed4',
   '#fdc086'
  ]).domain([
    'AGRICULTURAL CONTRACTION',
    'AGRICULTURAL EXPANSION',
    'URBANIZATION'
  ]);

export const carbonstockColorScale = d3.scale.ordinal()
  .range([
   '#386cb0',
   '#f0027f',
   '#bf5b17',
   '#f0027f'
  ]).domain([
    'Litter',
    'SOC',
    'Living Biomass',
    'test'
  ]);

export const colorScaleDic = {"Land-Cover State": [stateclassColorScale, 20], "Carbon Stock": [carbonstockColorScale, 18], "Land-Cover Transition":[transitionColorScale, 7]};

export const dashed = d3.scale.ordinal()
    .domain(["6370", "6385"])
    .range(["0, 0", "3, 3"]);

export const dashedLegend = d3.scale.ordinal()
    .domain(["6370", "6385"])
    .range(["Scenario6370", "Scenario6385"]);

export const stateclassColorScaleLegend = d3.scale.ordinal()
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

export const transitionColorScaleLegend = d3.scale.ordinal()
  .range([
   '#7fc97f',
   '#beaed4',
   '#fdc086'
  ]).domain([
    'AGRICULTURAL CONTRACTION',
    'AGRICULTURAL EXPANSION',
    'URBANIZATION'
  ]);

export const carbonstockColorScaleLegend = d3.scale.ordinal()
  .range([
   '#386cb0',
   '#f0027f',
   '#bf5b17',
   '#f0027f'
  ]).domain([
    'Litter',
    'SOC',
    'Living Biomass',
    'test'
  ]);

export const colorScaleDicLegend = {"Land-Cover State": [stateclassColorScaleLegend, 20], "Carbon Stock": [carbonstockColorScaleLegend, 18], "Land-Cover Transition":[transitionColorScaleLegend, 7]};