// Performance tiers per spec section 5.
// Aircraft are grouped into 6 tiers (with 6A/6B/6C subtiers). Users learn by tier, not POH.

export const performanceTiers = {
  '1': {
    id: '1',
    name: 'Tier 1: Slow GA Piston',
    cruise: '85–110 kt',
    climb: '400–700 fpm',
    altitude: 'FL050–FL080 (VFR mostly)',
    atcNote: 'Slowest traffic. Budget 90 kt en route, 70 kt on approach. Climbs slowly in summer heat. Sequence early; don\'t put a jet behind one.',
    examples: ['Cessna 172', 'Cessna 152', 'PA-28', 'Diamond DA20', 'Socata TB9']
  },
  '2': {
    id: '2',
    name: 'Tier 2: Fast Piston / Modern Single',
    cruise: '120–160 kt',
    climb: '700–1200 fpm',
    altitude: 'FL080–FL120',
    atcNote: 'Noticeably better climb than Tier 1. Still slower than turboprops. Useful for separation logic.',
    examples: ['Cessna 182', 'Diamond DA40', 'SR22', 'Bonanza', 'Mooney M20']
  },
  '3': {
    id: '3',
    name: 'Tier 3: Piston Twin / Light Turboprop',
    cruise: '130–180 kt',
    climb: '900–1400 fpm',
    altitude: 'FL100–FL160',
    atcNote: 'Workhorse for utility and training. Reasonable climb, manageable descent.',
    examples: ['PA-34 Seneca', 'Beechcraft Baron', 'Diamond DA42', 'Cessna 208 Caravan', 'TBM light']
  },
  '4': {
    id: '4',
    name: 'Tier 4: Turboprop',
    cruise: '140–220 kt',
    climb: '1200–2000 fpm',
    altitude: 'FL080–FL200+',
    atcNote: 'Substantially faster/higher than Tier 1–2. Handle mountain ops well. Expect fast climbs and aggressive descents.',
    examples: ['Pilatus PC-12', 'PC-6', 'DHC-6 Twin Otter', 'TBM 900', 'King Air', 'PA-46 Meridian']
  },
  '5': {
    id: '5',
    name: 'Tier 5: Light / Mid Business Jet',
    cruise: '300–450 kt',
    climb: '2500–4000 fpm',
    altitude: 'FL200–FL410',
    atcNote: 'Significant speed step from turboprops. Fast climbs. Manage separation from slower traffic. Request FL250+ quickly.',
    examples: ['Citation CJ/XLS', 'Phenom 300', 'PC-24', 'Falcon 2000', 'Challenger 300']
  },
  '6A': {
    id: '6A',
    name: 'Tier 6A: Large Jet',
    cruise: '400–500+ kt',
    climb: '3000–5000+ fpm',
    altitude: 'FL250–FL450',
    atcNote: 'Fastest civilian traffic. Sequence last or expect overtakes. Will request FL350+ aggressively.',
    examples: ['Gulfstream G550/G650', 'Falcon 7X/8X', 'Challenger 350', 'Global 5000/6000']
  },
  '6B': {
    id: '6B',
    name: 'Tier 6B: Helicopter',
    cruise: '80–150 kt',
    climb: '500–1500 fpm (varies)',
    altitude: 'VFR, often low-level',
    atcNote: 'Slowest traffic (like Tier 1 GA). More maneuverable. Can hover. SAR/medevac traffic has priority.',
    examples: ['H145', 'R44', 'EC635', 'Bell 407', 'AS332', 'AW109']
  },
  '6C': {
    id: '6C',
    name: 'Tier 6C: Military Fighter',
    cruise: '400–500+ kt',
    climb: '4000–6000+ fpm',
    altitude: 'FL150–FL400+',
    atcNote: 'Climbs and descends aggressively. Coordinate with Payerne/Sion military frequency. Follow military procedures; don\'t assume civilian.',
    examples: ['F/A-18 Hornet', 'F-5 Tiger II']
  }
};

export const tierOrder = ['1', '2', '3', '4', '5', '6A', '6B', '6C'];
