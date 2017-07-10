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

export const ColorScale7171= d3.scale.ordinal()
.range([
   "rgb(224,224,224)",
   "rgb(0,0,255)",
   "rgb(0,255,255)",
   "rgb(255,255,0)",
   "rgb(255,128,0)",
   "rgb(255,0,0)"
  ]).domain([
    '0',
    '0-.03',
    '.03-.06',
    '.06-.09',
    '.09-.12',
    '.12-.16'
  ]);

export const ColorScale7129= d3.scale.ordinal()
.range([
   "rgb(224,224,224)",
   "rgb(0,0,255)",
   "rgb(0,255,255)",
   "rgb(255,255,0)",
   "rgb(255,128,0)",
   "rgb(255,0,0)"
  ]).domain([
    '0',
    '0-0.1',
    '0.1-0.2',
    '0.2-0.3',
    '0.3-0.4',
    '0.4-0.5'
  ]);

export const ColorScale7134= d3.scale.ordinal()
.range([
   "rgb(224,224,224)",
   "rgb(0,0,255)",
   "rgb(0,255,255)",
   "rgb(255,255,0)",
   "rgb(255,128,0)",
   "rgb(255,0,0)"
  ]).domain([
    '0',
    '0-0.1',
    '0.1-0.2',
    '0.2-0.3',
    '0.3-0.4',
    '0.4-0.5'
  ]);

export const ColorScale7141= d3.scale.ordinal()
.range([
   "rgb(224,224,224)",
   "rgb(0,0,255)",
   "rgb(0,255,255)",
   "rgb(255,255,0)",
   "rgb(255,128,0)",
   "rgb(255,0,0)"
  ]).domain([
    '0',
    '0-.07',
    '.07-.14',
    '.14-.21',
    '.21-.28',
    '.28-.35'
  ]);

export const ColorScale7148= d3.scale.ordinal()
.range([
   "rgb(224,224,224)",
   "rgb(0,0,255)",
   "rgb(0,255,255)",
   "rgb(255,255,0)",
   "rgb(255,128,0)",
   "rgb(255,0,0)"
  ]).domain([
    '0',
    '0-.07',
    '.07-.14',
    '.14-.21',
    '.21-.28',
    '.28-.35'
  ]);

export const ColorScale7151= d3.scale.ordinal()
.range([
   "rgb(224,224,224)",
   "rgb(0,0,255)",
   "rgb(0,255,255)",
   "rgb(255,255,0)",
   "rgb(255,128,0)",
   "rgb(255,0,0)"
  ]).domain([
    '0',
    '0-.07',
    '.07-.14',
    '.14-.21',
    '.21-.28',
    '.28-.35'
  ]);

export const ColorScale7158= d3.scale.ordinal()
.range([
   "rgb(224,224,224)",
   "rgb(0,0,255)",
   "rgb(0,255,255)",
   "rgb(255,255,0)",
   "rgb(255,128,0)",
   "rgb(255,0,0)"
  ]).domain([
    '0',
    '0-.07',
    '.07-.14',
    '.14-.21',
    '.21-.28',
    '.28-.35'
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

export const transitionTypeColorScale = d3.scale.ordinal()
  .range([
   '#8dd3c7',
   '#ffffb3',
   '#bebada',
   '#fb8072',
   '#80b1d3',
   '#fdb462',
   '#b3de69',
   '#fccde5',
   '#d9d9d9',
   '#bc80bd',
   '#ccebc5'

  ]).domain([
    'Ag->Forest',
    'Ag->Grassland',
    'Ag->Shrubland',
    'Forest->Ag',
    'Grassland->Ag',
    'Shrubland->Ag',
    'Agriculture->Developed',
    'Barren->Developed',
    'Forest->Developed',
    'Grassland->Developed',
    'Shrubland->Developed'

  ]);

export const carbonstockColorScale = d3.scale.ordinal()
  .range([
   '#386cb0',
   '#f0027f',
   '#bf5b17',
   
  ]).domain([
    'Litter',
    'SOC',
    'Living Biomass',
    
  ]);

export const transitiongroupColorScale = {"7171":[ColorScale7171,"Avg. Annual Prob."], "7129":[ColorScale7129,"Avg. Annual Prob."], "7134":[ColorScale7134,"Avg. Annual Prob."], "7141":[ColorScale7141,"Avg. Annual Prob."], "7148":[ColorScale7148,"Avg. Annual Prob."], "7151":[ColorScale7151,"Avg. Annual Prob."], "7158":[ColorScale7158,"Avg. Annual Prob."]}

export const colorScaleDic = {"Land-Cover State": [stateclassColorScale, 30], "Carbon Stock": [carbonstockColorScale, 30], "Land-Cover Transition":[transitionColorScale, 30], "Land-Cover Transition Types":[transitionTypeColorScale]};

export const dashed = d3.scale.ordinal()
    .domain(["6370", "6385"])
    .range(["0, 0", "3, 3"]);

export const dashedLegend = d3.scale.ordinal()
    .domain(["6370", "6385"])
    .range(["Scenario6370", "Scenario6385"]);

/*export const stateclassColorScaleLegend = d3.scale.ordinal()
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
   '#bf5b17'
  
  ]).domain([
    'Litter',
    'SOC',
    'Living Biomass'
   
  ]);*/

export const transitionClassLegendLookup = {
          'AGRICULTURAL CONTRACTION':'#7fc97f',
          'AGRICULTURAL EXPANSION':'#beaed4',
          'URBANIZATION':'#fdc086'}

export const stateClassLegendLookup = {'Agriculture':'#ff8040',
          'Barren':'#c0c0c0',
          'Developed':'#000',
          'Forest':'#008000',
          'Grassland':'#ffff80',
          'Shrubland':'#a6a600',
          'Water':'#0080ff',
          'Plantation':'#ff00ff',
          'Wetland':'#80ffff'}

export const stockLegendLookup = {'Agriculture':'#ff8040',
          'Litter':'#386cb0',
          'SOC':'#f0027f',
          'Living Biomass':'#bf5b17'}

export const scenarioLegendLookup = {
         "6370":"Scenario6370", 
         "6385":"Scenario6385" }

export const colorScaleDicLegend = {"Land-Cover State": [stateclassColorScale, 20], "Carbon Stock": [carbonstockColorScale, 18], "Land-Cover Transition":[transitionColorScale, 7]};