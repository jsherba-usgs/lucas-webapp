const projectList = [
  '7096',
];

const projectDetails = [
  {
    id: '7096',
    details: {
      scenario: [
        {
          id: '6368',
          name: '6368 | BAU 60TS; 1MC',
          type: 'Business as Usual',
          iterations: 1,
        },
        {
          id: '6370',
          name: '6370 | BAU 60TS; 20MC',
          type: 'Business as Usual',
          iterations: 20,
        },
        {
          id: '6374',
          name: '6374 | BAU 60TS; 100MC',
          type: 'Business as Usual',
          iterations: 100,
        },
        {
          id: '6385',
          name: '6385 | No Fire',
          type: 'Sensitivity Test',
          iterations: 20,
        },
      ],
      stratum: [
        'Dry',
        'Wet',
        'Mesic'
      ],
      secondary_stratum: [
        "Hawai'i",
        "Kaho'olawe",
        "Kaua'i",
        "Lana'i",
        'Maui',
        "Moloka'i",
        "Ni'ihau",
        "O'ahu"
      ],
      StateLabelX: [
        'Forest',
        'Grassland',
        'Shrubland',
        'Wetland',
        'Water',
        'Barren',
        'Agriculture',
        'Developed',
        'Plantation'
      ],
      transition_group: [
        'AGRICULTURAL CONTRACTION',
        'AGRICULTURAL CONTRACTION: Ag->Forest',
        'AGRICULTURAL CONTRACTION: Ag->Grassland',
        'AGRICULTURAL CONTRACTION: Ag->Shrubland',
        'AGRICULTURAL CONTRACTION: Ag->Wetland',
        'AGRICULTURAL EXPANSION',
        'AGRICULTURAL EXPANSION: Forest->Ag',
        'AGRICULTURAL EXPANSION: Grassland->Ag',
        'AGRICULTURAL EXPANSION: Shrubland->Ag',
        'AGRICULTURAL EXPANSION: Wetland->Ag',
        'MOISTURE ZONE',
        'MOISTURE ZONE: Dry->Mesic',
        'MOISTURE ZONE: Mesic->Dry',
        'MOISTURE ZONE: Mesic->Wet',
        'MOISTURE ZONE: Wet->Mesic',
        'MANAGEMENT',
        'MANAGEMENT: Ag->Plantation',
        'MANAGEMENT: Forest Clearcut',
        'MANAGEMENT: Forest Thinning',
        'MANAGEMENT: Forest->Plantation',
        'MANAGEMENT: Reforestation Ag->Forest',
        'MANAGEMENT: Plantation Harvest',
        'FIRE',
        'FIRE: Forest High Severity',
        'FIRE: Grassland High Severity',
        'FIRE: Shrubland High Severity',
        'FIRE: Forest Medium Severity',
        'FIRE: Grassland Medium Severity',
        'FIRE: Shrubland Medium Severity',
        'FIRE: Forest Low Severity',
        'FIRE: Grassland Low Severity',
        'FIRE: Shrubland Low Severity',
        'FIRE: Forest Fire',
        'FIRE: Grassland Fire',
        'FIRE: Shrubland Fire',
        'FIRE: High Severity',
        'FIRE: Low Severity',
        'FIRE: Medium Severity',
        'URBANIZATION',
        'URBANIZATION: Agriculture->Developed',
        'URBANIZATION: Barren->Developed',
        'URBANIZATION: Forest->Developed',
        'URBANIZATION: Grassland->Developed',
        'URBANIZATION: Shrubland->Developed',
        'URBANIZATION: Wetland->Developed',
        'VEGETATION CHANGE',
        'VEGETATION CHANGE: Forest->Grassland',
        'VEGETATION CHANGE: Forest->Shrubland',
        'VEGETATION CHANGE: Grassland->Forest',
        'VEGETATION CHANGE: Grassland->Shrubland',
        'VEGETATION CHANGE: Shrubland->Forest',
        'VEGETATION CHANGE: Shrubland->Grassland'
      ],
    }
  }
];

const projects = {
  getList() {
    return projectList;
  },
  getDetailsForId(id) {
    return projectDetails.find((project) => project.id === id);
  }
};

export default projects;