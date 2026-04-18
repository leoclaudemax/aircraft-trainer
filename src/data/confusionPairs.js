// Priority confusion pairs (FIC Delta-specific) per spec section 7.
// Used by "Similar pairs" drill to intentionally mix visually similar aircraft.

export const confusionPairs = [
  { a: 'cessna-172', b: 'cessna-182', tellApart: 'Wheel fairings — 182 has retractable gear doors; 172 has fixed gear sticking out.' },
  { a: 'diamond-da20', b: 'diamond-da40', tellApart: 'DA20 = 2 seats and bubble canopy. DA40 = 4 seats, larger cabin, more windows.' },
  { a: 'cirrus-sr20', b: 'cirrus-sr22', tellApart: 'Both have parachute bulge. SR22 is visibly larger and more powerful.' },
  { a: 'piper-pa28', b: 'piper-pa34', tellApart: 'Number of engines under wings — PA-28 single, PA-34 twin.' },
  { a: 'cessna-208', b: 'pilatus-pc12', tellApart: 'Caravan = boxy + fixed gear + struts. PC-12 = sleek + retractable gear + cantilever wing.' },
  { a: 'beech-baron', b: 'piper-pa34', tellApart: 'Baron = aggressive nose, premium look. Seneca = cleaner fuselage, training twin.' },
  { a: 'twin-otter', b: 'cessna-208', tellApart: 'Twin Otter = 2 engines on top of high wing. Caravan = 1 engine in nose.' },
  { a: 'cessna-citation', b: 'phenom-300', tellApart: 'Phenom has T-tail and rounder nose. Citation has cruciform tail and pointier nose.' },
  { a: 'falcon-2000', b: 'challenger-300', tellApart: 'Falcon has slimmer fuselage. Challenger has wider stand-up cabin and bigger winglets.' },
  { a: 'robinson-r44', b: 'robinson-r22', tellApart: 'R22 is 2-seat, very small. R44 is 4-seat, more substantial. (Note: R22 not in dataset by default.)' },
  { a: 'aw109sp', b: 'h145', tellApart: 'AW109 has wheels + 4 blades + conventional tail rotor. H145 has skids + 5 blades + fenestron.' },
  { a: 'pilatus-pc7', b: 'pilatus-pc21', tellApart: 'PC-21 looks jet-like (sleek, sharp). PC-7 looks like a conventional trainer.' }
];

// Helper: get all confusion partners for an aircraft id.
export function partnersFor(id) {
  const set = new Set();
  for (const p of confusionPairs) {
    if (p.a === id) set.add(p.b);
    if (p.b === id) set.add(p.a);
  }
  return [...set];
}

export function tellApartFor(idA, idB) {
  for (const p of confusionPairs) {
    if ((p.a === idA && p.b === idB) || (p.a === idB && p.b === idA)) return p.tellApart;
  }
  return null;
}
