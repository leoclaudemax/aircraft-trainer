// Aircraft dataset.
// Schema:
//   id              kebab-case unique id
//   name            display name
//   family          family-level name (for "family-level" recognition mode)
//   aliases         additional accepted answer strings (lowercased compared)
//   tier            learning priority tier: 1 | 2 | 3
//   category        Piston | Turboprop | Jet | Helicopter | Military | Glider | Special
//   subcategory     short label, e.g. "Piston single", "Light jet"
//   perfTier        performance tier id (see performanceTiers.js)
//   frequency       1-3 (3 = ★★★ very common at FIC Delta)
//   wikipediaTitle  used to fetch image at runtime via Wikipedia API
//   recognition     short visual-first description (2-3 sentences)
//   visualMarkers   array of bullet points (visual cues)
//   confusedWith    array of aircraft ids
//   context         where/why you'll see it
//   memoryTip       short mnemonic
//   contentLevel    'full' | 'stub'  -- stubs need more content authored

export const aircraft = [
  // ============================================================
  // TIER 1 — full content
  // ============================================================
  {
    id: 'cessna-172',
    name: 'Cessna 172 Skyhawk',
    family: 'Cessna',
    aliases: ['c172', '172', 'skyhawk'],
    tier: 1,
    category: 'Piston',
    subcategory: 'Piston single',
    perfTier: '1',
    frequency: 3,
    wikipediaTitle: 'Cessna 172',
    recognition: 'The classic high-wing trainer. Fixed gear, boxy cabin, small windows. Iconic yellow paint on many examples.',
    visualMarkers: [
      'High wing — mounted on top of fuselage',
      'Strut-braced wing — visible struts connecting wing',
      'Fixed landing gear — sturdy-looking, not retractable',
      'Small windows — round or oval, 4 per side',
      'Single propeller — nose-mounted',
      'Compact rectangular fuselage'
    ],
    confusedWith: ['cessna-152', 'cessna-182'],
    context: 'Training, touring, regional GA. World\'s most produced aircraft. You\'ll see many of these.',
    memoryTip: 'Think "yellow taxi." The most common trainer in the world.',
    contentLevel: 'full'
  },
  {
    id: 'diamond-da40',
    name: 'Diamond DA40 Diamond Star',
    family: 'Diamond',
    aliases: ['da40', 'diamond star'],
    tier: 1,
    category: 'Piston',
    subcategory: 'Piston single',
    perfTier: '2',
    frequency: 3,
    wikipediaTitle: 'Diamond DA40 Diamond Star',
    recognition: 'Low-wing, sleek, composite-looking. Smaller and more modern than most GA singles. European design.',
    visualMarkers: [
      'Low wing — mounted below fuselage',
      'Smooth composite fuselage — not riveted',
      'Modern, streamlined cabin — aerodynamic styling',
      'Large frameless-looking windows',
      'Single propeller — standard nose-mount',
      'Clean, integrated tail design',
      'T-tail or low tail variants exist'
    ],
    confusedWith: ['cirrus-sr20', 'cirrus-sr22', 'diamond-da20'],
    context: 'Modern GA touring, advanced training, private owners. Common at Swiss airfields.',
    memoryTip: 'European sleek. If it looks smooth and "new" without a parachute bulge, probably DA40.',
    contentLevel: 'full'
  },
  {
    id: 'robin-dr400',
    name: 'Robin DR400',
    family: 'Robin',
    aliases: ['dr400', 'dr-400', 'robin'],
    tier: 1,
    category: 'Piston',
    subcategory: 'Piston single',
    perfTier: '1',
    frequency: 3,
    wikipediaTitle: 'Robin DR400',
    recognition: 'French low-wing trainer. Distinctive bent "cranked" wing — flat inboard, dihedral outboard. Wood-and-fabric construction with sliding bubble canopy.',
    visualMarkers: [
      'Low wing with cranked dihedral — kinked wing shape is the giveaway',
      'Sliding bubble canopy — clear bubble cockpit',
      'Fixed tricycle gear with wheel pants',
      'Tapered wood-and-fabric fuselage',
      'Single nose-mounted propeller',
      'Often white with bright accent stripes'
    ],
    confusedWith: ['piper-pa28', 'diamond-da40'],
    context: 'European clubs, training, touring. Very common at French and Swiss aero clubs.',
    memoryTip: 'Bent wing + bubble canopy = Robin. The "kinked" wing is unmistakable.',
    contentLevel: 'full'
  },
  {
    id: 'piper-pa28',
    name: 'Piper PA-28 (Cherokee/Archer/Warrior)',
    family: 'Piper',
    aliases: ['pa28', 'pa-28', 'cherokee', 'archer', 'warrior'],
    tier: 1,
    category: 'Piston',
    subcategory: 'Piston single',
    perfTier: '1',
    frequency: 3,
    wikipediaTitle: 'Piper PA-28 Cherokee',
    recognition: 'Low-wing piston single, fixed gear. Squarer wing than Robin (no crank). Conventional cabin with door on right side only.',
    visualMarkers: [
      'Low wing — straight, untapered (the "Hershey bar" wing on older models)',
      'Fixed tricycle gear, often with wheel fairings',
      'Boxy cabin, single door on right side',
      'Stabilator (one-piece moving horizontal tail) — no separate elevator',
      'Single nose-mounted propeller',
      'Window line straight along fuselage'
    ],
    confusedWith: ['robin-dr400', 'diamond-da40', 'piper-pa38'],
    context: 'Training, club flying, touring. Worldwide GA workhorse alongside the 172.',
    memoryTip: 'Low-wing Cessna. Straight wing (no Robin crank), one door on right.',
    contentLevel: 'full'
  },
  {
    id: 'pilatus-pc12',
    name: 'Pilatus PC-12',
    family: 'Pilatus',
    aliases: ['pc12', 'pc-12'],
    tier: 1,
    category: 'Turboprop',
    subcategory: 'Single turboprop',
    perfTier: '4',
    frequency: 3,
    wikipediaTitle: 'Pilatus PC-12',
    recognition: 'Swiss turboprop. Single turboprop engine, low wing, unusually big cabin, muscular nose. Sleek and purposeful-looking.',
    visualMarkers: [
      'Single turboprop — one large prop, turbine sound',
      'Low wing with winglets (newer NGX/PC-12NG variants)',
      'Large, rounded cabin — notably bigger than most singles',
      'Muscular, blunt nose — aerodynamic and refined',
      'Retractable tricycle gear',
      'High swept T-tail — prominent vertical stabilizer',
      'Larger windows than typical singles'
    ],
    confusedWith: ['cessna-208', 'tbm-900', 'pa46-meridian'],
    context: 'Mountain ops, medevac, photo missions, high-performance touring. Common at FIC Delta regional approaches.',
    memoryTip: 'Swiss professional look + turboprop + T-tail = PC-12.',
    contentLevel: 'full'
  },
  {
    id: 'pilatus-pc6',
    name: 'Pilatus PC-6 Porter',
    family: 'Pilatus',
    aliases: ['pc6', 'pc-6', 'porter'],
    tier: 1,
    category: 'Turboprop',
    subcategory: 'Single turboprop (utility)',
    perfTier: '4',
    frequency: 2,
    wikipediaTitle: 'Pilatus PC-6 Porter',
    recognition: 'Boxy, slab-sided utility turboprop. High wing, tall fixed gear, long greenhouse cockpit. STOL workhorse — looks built for rough strips.',
    visualMarkers: [
      'High wing with struts',
      'Fixed tail-dragger or tricycle gear, very tall and rugged',
      'Long greenhouse cockpit — many windows for visibility',
      'Single turboprop, slim cowling',
      'Slab-sided utility fuselage with sliding cargo door',
      'Big rear cargo doors on paradrop variants'
    ],
    confusedWith: ['cessna-208', 'twin-otter'],
    context: 'Paradrop, mountain supply, alpine ops, photo work. Iconic Swiss utility aircraft.',
    memoryTip: 'Tall rugged STOL with greenhouse cockpit = Porter. Looks like a Land Cruiser with wings.',
    contentLevel: 'full'
  },
  {
    id: 'cessna-208',
    name: 'Cessna 208 Caravan',
    family: 'Cessna',
    aliases: ['c208', 'caravan', '208'],
    tier: 1,
    category: 'Turboprop',
    subcategory: 'Single turboprop (utility)',
    perfTier: '3',
    frequency: 2,
    wikipediaTitle: 'Cessna 208 Caravan',
    recognition: 'Big, boxy single turboprop. High strut-braced wing, fixed tricycle gear, big square cabin. Looks like a "stretched 172 on steroids."',
    visualMarkers: [
      'High wing with prominent struts',
      'Fixed tricycle gear (often with cargo pod under fuselage)',
      'Single turboprop with three- or four-blade prop',
      'Tall, square fuselage with large cargo door',
      'Many small square cabin windows',
      'Large vertical tail'
    ],
    confusedWith: ['pilatus-pc12', 'pilatus-pc6', 'twin-otter'],
    context: 'Cargo, paradrop, regional pax, utility. Common feeder aircraft worldwide.',
    memoryTip: 'High wing + struts + fixed gear + turbine = Caravan. The "delivery van" of the sky.',
    contentLevel: 'full'
  },
  {
    id: 'cessna-citation',
    name: 'Cessna Citation (CJ2/CJ4/XLS)',
    family: 'Cessna',
    aliases: ['citation', 'cj2', 'cj4', 'xls', 'citation xls'],
    tier: 1,
    category: 'Jet',
    subcategory: 'Light/mid business jet',
    perfTier: '5',
    frequency: 2,
    wikipediaTitle: 'Cessna Citation family',
    recognition: 'Business jet. Twin engines mounted on aft fuselage (not under wings). Straight-ish wing on smaller variants, swept on XLS. Pointed aerodynamic nose.',
    visualMarkers: [
      'Twin jet engines — pod-mounted on AFT fuselage (key cue vs jets with under-wing engines)',
      'Straight or modestly swept wing (depending on variant)',
      'Retractable tricycle gear',
      'Long fuselage with row of cabin windows',
      'Pointed, aerodynamic nose',
      'Cruciform tail (mid-set horizontal stabilizer)'
    ],
    confusedWith: ['phenom-300', 'falcon-2000'],
    context: 'Business travel, executive transport, regional corporate. Increasingly common at FIC Delta.',
    memoryTip: 'Engines on the back fuselage = Citation. Pointed nose, swept-ish wing.',
    contentLevel: 'full'
  },
  {
    id: 'phenom-300',
    name: 'Embraer Phenom 300',
    family: 'Embraer',
    aliases: ['phenom', 'phenom 300', 'emb-505'],
    tier: 1,
    category: 'Jet',
    subcategory: 'Light business jet',
    perfTier: '5',
    frequency: 2,
    wikipediaTitle: 'Embraer Phenom 300',
    recognition: 'Modern light business jet. Twin engines on aft fuselage, swept wing with characteristic winglets. Cleaner, rounder nose than Citation.',
    visualMarkers: [
      'Twin jet engines — aft-fuselage mounted',
      'Swept wing with prominent winglets (canted up sharply)',
      'T-tail — horizontal stabilizer on top of vertical fin',
      'Smooth, rounded nose',
      'Five oval cabin windows per side',
      'Clean modern lines overall'
    ],
    confusedWith: ['cessna-citation', 'pc-24'],
    context: 'Best-selling light jet worldwide. Frequent business charters into Geneva/Sion.',
    memoryTip: 'T-tail + winglets + rounded nose = Phenom. Cleaner than a Citation.',
    contentLevel: 'full'
  },
  {
    id: 'h145',
    name: 'Airbus H145 D3 (REGA)',
    family: 'Airbus Helicopters',
    aliases: ['h145', 'ec145', 'rega', 'bk117'],
    tier: 1,
    category: 'Helicopter',
    subcategory: 'Twin-engine medium helicopter',
    perfTier: '6B',
    frequency: 3,
    wikipediaTitle: 'Airbus Helicopters H145',
    recognition: 'Twin-engine medium helicopter. Red-and-white REGA livery. Distinctive five-blade main rotor (D3). Fenestron (shrouded) tail rotor.',
    visualMarkers: [
      'Twin engines on top — two intakes/exhausts',
      'Five-blade main rotor (D3 variant) — quieter and modern',
      'Fenestron tail rotor — enclosed in vertical fin (key cue)',
      'Large bubble cockpit — greenhouse glazing',
      'Skid landing gear',
      'Red-and-white REGA livery very common in Switzerland'
    ],
    confusedWith: ['aw109sp', 'ec635'],
    context: 'REGA mountain rescue, medevac, police. Constant in Swiss airspace — you will hear H145 callsigns daily.',
    memoryTip: 'Red+white + fenestron tail + 5-blade rotor = REGA H145.',
    contentLevel: 'full'
  },
  {
    id: 'robinson-r44',
    name: 'Robinson R44',
    family: 'Robinson',
    aliases: ['r44'],
    tier: 1,
    category: 'Helicopter',
    subcategory: 'Light piston helicopter',
    perfTier: '6B',
    frequency: 3,
    wikipediaTitle: 'Robinson R44',
    recognition: 'Small piston helicopter. Single engine, two-blade main rotor with seesaw teetering hub. Slim tail boom, bubble canopy.',
    visualMarkers: [
      'Single piston engine (not turbine) — note the sound',
      'Two-blade main rotor with characteristic teetering hub',
      'Slim tail boom — looks bare/skeletal',
      'Bubble cockpit — four seats',
      'Skid landing gear',
      'Small two-blade tail rotor on the side of vertical fin'
    ],
    confusedWith: ['robinson-r22'],
    context: 'Training, private, sightseeing, police. Most common civilian helicopter worldwide.',
    memoryTip: 'Two main blades + slim tail boom + piston sound = R44. (R22 is smaller two-seater.)',
    contentLevel: 'full'
  },
  {
    id: 'fa18',
    name: 'F/A-18 C/D Hornet',
    family: 'Boeing/McDonnell Douglas',
    aliases: ['fa18', 'f/a-18', 'hornet', 'f-18'],
    tier: 1,
    category: 'Military',
    subcategory: 'Multirole fighter',
    perfTier: '6C',
    frequency: 2,
    wikipediaTitle: 'McDonnell Douglas F/A-18 Hornet',
    recognition: 'Twin-engine fighter. Twin canted vertical tails. Large LERX (leading-edge root extensions) blending wing into fuselage. Swiss Air Force primary fighter.',
    visualMarkers: [
      'Twin engines side-by-side in fuselage',
      'Twin vertical tails canted outward (very distinctive)',
      'LERX — large leading-edge wing root extensions',
      'Bubble canopy',
      'Tricycle gear, retractable',
      'Swiss roundels on Swiss Air Force aircraft'
    ],
    confusedWith: ['f5-tiger'],
    context: 'Swiss Air Force air policing. Operating from Payerne, Sion, Meiringen. Coordinate with military FREQ.',
    memoryTip: 'Two canted tails + big wing-root extensions = Hornet. Swiss F-18 is THE current fighter.',
    contentLevel: 'full'
  },
  {
    id: 'pilatus-pc21',
    name: 'Pilatus PC-21',
    family: 'Pilatus',
    aliases: ['pc21', 'pc-21'],
    tier: 1,
    category: 'Military',
    subcategory: 'Advanced trainer (turboprop)',
    perfTier: '4',
    frequency: 2,
    wikipediaTitle: 'Pilatus PC-21',
    recognition: 'Advanced military turboprop trainer. Looks jet-like — sharp, sleek fuselage. Tandem cockpit (two seats in line). Five-blade prop. Swiss Air Force training fleet.',
    visualMarkers: [
      'Single turboprop with five-blade scimitar propeller',
      'Tandem stepped canopy — instructor behind student',
      'Sleek "jet-like" fuselage and pointed nose',
      'Swept-back fin and ventral strakes',
      'Low wing with hardpoints',
      'Swiss Air Force livery'
    ],
    confusedWith: ['pilatus-pc7', 'pilatus-pc9'],
    context: 'Swiss Air Force lead-in fighter trainer (replaces PC-7 in advanced phase). Common around Payerne and Emmen.',
    memoryTip: 'Looks like a jet but turns a propeller — PC-21. Sharper and more modern than PC-7.',
    contentLevel: 'full'
  },

  // ============================================================
  // TIER 2 — stubs (basic identifying info; expand later)
  // ============================================================
  { id: 'cessna-152', name: 'Cessna 152', family: 'Cessna', aliases: ['c152', '152'], tier: 2, category: 'Piston', subcategory: 'Piston single (trainer)', perfTier: '1', frequency: 2, wikipediaTitle: 'Cessna 152', recognition: 'Smaller two-seat sibling of the Cessna 172. Same high-wing layout, but more compact.', visualMarkers: ['High wing with strut', 'Fixed gear', 'Two seats only — narrower cabin than 172', 'Single nose-mounted propeller'], confusedWith: ['cessna-172'], context: 'Basic trainer worldwide.', memoryTip: 'A 172 that shrunk in the wash.', contentLevel: 'stub' },
  { id: 'cessna-182', name: 'Cessna 182 Skylane', family: 'Cessna', aliases: ['c182', '182', 'skylane'], tier: 2, category: 'Piston', subcategory: 'Piston single', perfTier: '2', frequency: 2, wikipediaTitle: 'Cessna 182 Skylane', recognition: 'Bigger, faster Cessna 172. Same high-wing layout but heavier-looking. Often constant-speed propeller.', visualMarkers: ['High wing with strut', 'Larger cabin than 172', 'Constant-speed prop (different sound)', 'Fixed gear (some retractable RG variants)'], confusedWith: ['cessna-172'], context: 'Touring, family GA, jump ship variant common.', memoryTip: '172 with more muscle. Bulkier nose.', contentLevel: 'stub' },
  { id: 'diamond-da20', name: 'Diamond DA20 Katana', family: 'Diamond', aliases: ['da20', 'katana'], tier: 2, category: 'Piston', subcategory: 'Piston single (trainer)', perfTier: '1', frequency: 1, wikipediaTitle: 'Diamond DA20', recognition: 'Compact two-seat composite trainer. Bubble canopy, T-tail, very smooth fuselage.', visualMarkers: ['Low wing, composite', 'Bubble canopy — sliding', 'T-tail', 'Two seats side-by-side'], confusedWith: ['diamond-da40'], context: 'Primary trainer, schools.', memoryTip: 'Tiny DA40 with a bubble canopy.', contentLevel: 'stub' },
  { id: 'beech-bonanza', name: 'Beechcraft Bonanza (A36/G36)', family: 'Beechcraft', aliases: ['bonanza', 'a36', 'g36', 'b36'], tier: 2, category: 'Piston', subcategory: 'High-performance piston single', perfTier: '2', frequency: 1, wikipediaTitle: 'Beechcraft Bonanza', recognition: 'Sleek high-performance single. Modern A36/G36 has conventional tail; vintage V35 has unique V-tail.', visualMarkers: ['Low wing, retractable gear', 'Long fuselage with rear cabin door', 'Conventional tail (A36/G36) or V-tail (older)'], confusedWith: ['cirrus-sr22'], context: 'Owner-flown touring, business GA.', memoryTip: 'Premium piston single. V-tail = old Bonanza.', contentLevel: 'stub' },
  { id: 'cirrus-sr20', name: 'Cirrus SR20', family: 'Cirrus', aliases: ['sr20'], tier: 2, category: 'Piston', subcategory: 'Piston single', perfTier: '2', frequency: 2, wikipediaTitle: 'Cirrus SR20', recognition: 'Modern composite single with parachute (CAPS) bulge on top of fuselage. Smaller, less powerful than SR22.', visualMarkers: ['Low wing, composite', 'CAPS parachute housing on top of fuselage', 'Fixed gear with fairings', 'Side-stick controls visible through canopy'], confusedWith: ['cirrus-sr22', 'diamond-da40'], context: 'Owner-flown, training.', memoryTip: 'Smaller of the two Cirrus singles. Both have parachute bulge.', contentLevel: 'stub' },
  { id: 'cirrus-sr22', name: 'Cirrus SR22', family: 'Cirrus', aliases: ['sr22'], tier: 2, category: 'Piston', subcategory: 'High-performance piston single', perfTier: '2', frequency: 2, wikipediaTitle: 'Cirrus SR22', recognition: 'Most popular high-performance piston single. Same parachute bulge as SR20 but larger and faster.', visualMarkers: ['Low wing, composite', 'CAPS parachute housing on top fuselage', 'Fixed gear with sleek fairings', 'Three side windows per side'], confusedWith: ['cirrus-sr20', 'diamond-da40'], context: 'Owner-flown business and touring.', memoryTip: 'SR20 + more horsepower. Same bulge.', contentLevel: 'stub' },
  { id: 'piper-pa38', name: 'Piper PA-38 Tomahawk', family: 'Piper', aliases: ['pa38', 'tomahawk'], tier: 2, category: 'Piston', subcategory: 'Piston single (trainer)', perfTier: '1', frequency: 1, wikipediaTitle: 'Piper PA-38 Tomahawk', recognition: 'Two-seat trainer, low-wing, T-tail. Often nicknamed "Traumahawk."', visualMarkers: ['Low wing', 'T-tail (key cue)', 'Two seats side-by-side', 'Fixed gear'], confusedWith: ['piper-pa28'], context: 'Trainer, club fleet.', memoryTip: 'Low-wing trainer with T-tail.', contentLevel: 'stub' },
  { id: 'piper-pa34', name: 'Piper PA-34 Seneca', family: 'Piper', aliases: ['pa34', 'seneca'], tier: 2, category: 'Piston', subcategory: 'Piston twin', perfTier: '3', frequency: 1, wikipediaTitle: 'Piper PA-34 Seneca', recognition: 'Twin-engine training/touring aircraft based on PA-28 fuselage. Two engine nacelles on the wings.', visualMarkers: ['Two piston engines on the wings', 'Low wing', 'Retractable gear', 'Six seats, double rear door on right'], confusedWith: ['beech-baron', 'diamond-da42'], context: 'Multi-engine training, light charter.', memoryTip: 'PA-28 with two engines. Cleaner fuselage than the Baron.', contentLevel: 'stub' },
  { id: 'beech-baron', name: 'Beechcraft Baron (B55/B58)', family: 'Beechcraft', aliases: ['baron', 'b55', 'b58'], tier: 2, category: 'Piston', subcategory: 'Piston twin', perfTier: '3', frequency: 1, wikipediaTitle: 'Beechcraft Baron', recognition: 'Premium piston twin. Aggressive nose, powerful look. B58 has rear double clamshell door.', visualMarkers: ['Two piston engines on wings', 'Aggressive pointed nose', 'Conventional tail', 'Retractable gear'], confusedWith: ['piper-pa34', 'diamond-da42'], context: 'Owner-flown twin, business GA.', memoryTip: 'Beefier than a Seneca — more aggressive nose.', contentLevel: 'stub' },
  { id: 'diamond-da42', name: 'Diamond DA42 Twin Star', family: 'Diamond', aliases: ['da42', 'twin star'], tier: 2, category: 'Piston', subcategory: 'Piston twin (diesel)', perfTier: '3', frequency: 2, wikipediaTitle: 'Diamond DA42', recognition: 'Modern composite twin. Diesel engines, sleek aerodynamic shape, T-tail. Looks like a stretched DA40.', visualMarkers: ['Low composite wing with two engines', 'T-tail', 'Diesel engines (different sound — quieter, smoother)', 'Retractable gear'], confusedWith: ['piper-pa34', 'beech-baron'], context: 'Modern multi-engine training. Common at flight schools.', memoryTip: 'DA40 with two diesel engines and a T-tail.', contentLevel: 'stub' },
  { id: 'twin-otter', name: 'DHC-6 Twin Otter', family: 'De Havilland Canada', aliases: ['twin otter', 'dhc-6', 'dhc6'], tier: 2, category: 'Turboprop', subcategory: 'Twin turboprop (utility)', perfTier: '4', frequency: 1, wikipediaTitle: 'De Havilland Canada DHC-6 Twin Otter', recognition: 'Boxy, high-wing twin turboprop. Two engines mounted on top of wing. Fixed gear, very utilitarian — built for harsh strips.', visualMarkers: ['High wing with two turboprops on top', 'Fixed tricycle gear', 'Boxy fuselage with multiple cabin windows', 'Big square cabin door'], confusedWith: ['cessna-208'], context: 'Mountain ops, paradrop, regional pax. Iconic STOL.', memoryTip: 'Caravan with two engines on top of the wing.', contentLevel: 'stub' },
  { id: 'tbm-900', name: 'TBM 900/940/960', family: 'Daher / Socata', aliases: ['tbm', 'tbm900', 'tbm940', 'tbm960'], tier: 2, category: 'Turboprop', subcategory: 'Single turboprop', perfTier: '4', frequency: 2, wikipediaTitle: 'Daher TBM', recognition: 'Sleek single turboprop. Pointed nose, low wing with winglets. Looks "fast" — built like a private jet.', visualMarkers: ['Single turboprop with five-blade scimitar prop (TBM 900+)', 'Low wing with winglets', 'Pointed, jet-like nose', 'Retractable gear', 'Sleek glass cockpit'], confusedWith: ['pilatus-pc12', 'pa46-meridian'], context: 'Owner-flown high-performance touring.', memoryTip: 'Low-wing speedster turboprop. PC-12 = high-wing-ish bigger; TBM = low-wing pointier.', contentLevel: 'stub' },
  { id: 'pa46-meridian', name: 'Piper PA-46 Malibu Meridian', family: 'Piper', aliases: ['pa46', 'meridian', 'malibu', 'm500', 'm600'], tier: 2, category: 'Turboprop', subcategory: 'Single turboprop', perfTier: '4', frequency: 1, wikipediaTitle: 'Piper PA-46', recognition: 'Pressurized single turboprop. Long, slim fuselage with low wing. Smaller window line than TBM.', visualMarkers: ['Single turboprop, three- or four-blade prop', 'Low wing', 'Long, slim fuselage', 'Retractable gear', 'Conventional tail'], confusedWith: ['tbm-900', 'pilatus-pc12'], context: 'Owner-flown touring.', memoryTip: 'Slimmer fuselage than TBM, less aggressive nose.', contentLevel: 'stub' },
  { id: 'king-air', name: 'Beechcraft King Air (C90/B200/350)', family: 'Beechcraft', aliases: ['king air', 'b200', 'c90', '350', 'be20'], tier: 2, category: 'Turboprop', subcategory: 'Twin turboprop', perfTier: '4', frequency: 2, wikipediaTitle: 'Beechcraft King Air', recognition: 'Iconic twin turboprop. Low wing with two engines, T-tail. Many variants — corporate, ambulance, military.', visualMarkers: ['Two turboprops on low wing', 'T-tail', 'Long fuselage with row of square cabin windows', 'Retractable gear'], confusedWith: ['pilatus-pc12'], context: 'Corporate, medevac, military. Decades-old workhorse.', memoryTip: 'Two turboprops + T-tail = King Air.', contentLevel: 'stub' },
  { id: 'falcon-2000', name: 'Dassault Falcon 2000', family: 'Dassault', aliases: ['falcon 2000', 'falcon2000'], tier: 2, category: 'Jet', subcategory: 'Mid business jet', perfTier: '5', frequency: 1, wikipediaTitle: 'Dassault Falcon 2000', recognition: 'French mid-size business jet. Twin engines on aft fuselage, swept wing. More compact than 7X/8X.', visualMarkers: ['Twin aft-fuselage engines', 'Swept wing', 'Long cabin windows row', 'Retractable gear'], confusedWith: ['cessna-citation', 'challenger-300'], context: 'Business charter, corporate.', memoryTip: 'Falcon = pointier French silhouette than US jets.', contentLevel: 'stub' },
  { id: 'falcon-7x', name: 'Dassault Falcon 7X / 8X', family: 'Dassault', aliases: ['falcon 7x', 'falcon7x', 'falcon 8x'], tier: 2, category: 'Jet', subcategory: 'Large business jet (trijet)', perfTier: '6A', frequency: 1, wikipediaTitle: 'Dassault Falcon 7X', recognition: 'Large business trijet — THREE engines (two on sides + one in tail). Distinctive in a sea of twins.', visualMarkers: ['THREE engines — unusual for modern bizjets', 'S-duct center engine in tail', 'Swept wing with winglets', 'Long fuselage'], confusedWith: ['gulfstream-g650'], context: 'Long-range corporate.', memoryTip: 'Three engines = Falcon 7X/8X. The only common modern trijet.', contentLevel: 'stub' },
  { id: 'challenger-300', name: 'Bombardier Challenger 300/350', family: 'Bombardier', aliases: ['challenger 300', 'challenger 350', 'cl30', 'cl35'], tier: 2, category: 'Jet', subcategory: 'Super-mid business jet', perfTier: '5', frequency: 1, wikipediaTitle: 'Bombardier Challenger 300', recognition: 'Super-mid business jet. Wide stand-up cabin, twin aft engines, prominent winglets (350 has bigger winglets).', visualMarkers: ['Twin aft-fuselage engines', 'Swept wing with prominent winglets', 'Wide oval fuselage cross-section', 'T-tail'], confusedWith: ['falcon-2000', 'gulfstream-g550'], context: 'Best-selling super-mid jet.', memoryTip: 'Big winglets + wide stand-up cabin = Challenger.', contentLevel: 'stub' },
  { id: 'gulfstream-g550', name: 'Gulfstream G550 / G650', family: 'Gulfstream', aliases: ['g550', 'g650', 'gulfstream'], tier: 2, category: 'Jet', subcategory: 'Large business jet', perfTier: '6A', frequency: 1, wikipediaTitle: 'Gulfstream G550', recognition: 'Large long-range business jet. Distinctive round portholes (oval on G650). Twin aft engines, swept wing.', visualMarkers: ['Twin aft-fuselage engines', 'Round/oval signature cabin windows (Gulfstream "ovals")', 'Swept wing with winglets', 'Long, sleek fuselage'], confusedWith: ['falcon-7x', 'challenger-300'], context: 'Top-end corporate, government, VIP.', memoryTip: 'Round windows = Gulfstream. The "G" silhouette.', contentLevel: 'stub' },
  { id: 'pc-24', name: 'Pilatus PC-24', family: 'Pilatus', aliases: ['pc24', 'pc-24'], tier: 2, category: 'Jet', subcategory: 'Light business jet', perfTier: '5', frequency: 2, wikipediaTitle: 'Pilatus PC-24', recognition: 'Swiss "super versatile jet." Twin aft engines, T-tail, but with rough-field-capable trailing-link gear and a rear cargo door.', visualMarkers: ['Twin aft-fuselage engines', 'T-tail', 'Rear cargo door (unusual on a jet)', 'Rugged trailing-link landing gear'], confusedWith: ['phenom-300', 'cessna-citation'], context: 'Business, medevac, utility — can use unpaved strips.', memoryTip: 'Pilatus jet — looks like a Phenom but with a cargo door.', contentLevel: 'stub' },
  { id: 'aw109sp', name: 'AgustaWestland AW109SP Da Vinci', family: 'Leonardo / AgustaWestland', aliases: ['aw109', 'aw109sp', 'da vinci', 'davinci'], tier: 2, category: 'Helicopter', subcategory: 'Twin-engine light helicopter', perfTier: '6B', frequency: 2, wikipediaTitle: 'AgustaWestland AW109', recognition: 'Sleek Italian twin-engine helicopter. Retractable wheels (not skids). Four-blade main rotor. Older REGA fleet (now phasing out for H145).', visualMarkers: ['Twin engines on top', 'Four-blade main rotor', 'Retractable wheel landing gear (key cue vs H145 skids)', 'Sleek narrow fuselage', 'Conventional tail rotor (not fenestron)'], confusedWith: ['h145'], context: 'Older REGA workhorse, EMS, executive.', memoryTip: 'Wheels not skids + 4-blade rotor = AW109. (H145 has fenestron + 5 blades + skids.)', contentLevel: 'stub' },
  { id: 'h125', name: 'Airbus H125 / AS350 Écureuil', family: 'Airbus Helicopters', aliases: ['h125', 'as350', 'ecureuil', 'écureuil', 'squirrel'], tier: 2, category: 'Helicopter', subcategory: 'Single-engine light helicopter', perfTier: '6B', frequency: 2, wikipediaTitle: 'Airbus Helicopters H125', recognition: 'Single-turbine light helicopter. Three-blade main rotor with prominent "Starflex" rotor head. Skid gear. Mountain-ops favorite.', visualMarkers: ['Single turbine engine', 'Three-blade main rotor with visible "starflex" hub', 'Skid landing gear', 'Slim tail boom', 'Bubble cockpit'], confusedWith: ['bell-407'], context: 'Heli-skiing, mountain rescue, sling load. Common in Alps.', memoryTip: '"Squirrel" — single engine, 3 blades, skids. Alpine workhorse.', contentLevel: 'stub' },
  { id: 'bell-407', name: 'Bell 407 GX', family: 'Bell', aliases: ['bell 407', '407', 'bell407'], tier: 2, category: 'Helicopter', subcategory: 'Single-engine light helicopter', perfTier: '6B', frequency: 1, wikipediaTitle: 'Bell 407', recognition: 'Single-turbine light helicopter. Four-blade main rotor (the upgrade vs older Bell JetRanger). Skid gear. Conventional tail rotor.', visualMarkers: ['Single turbine engine', 'Four-blade main rotor (vs 3 on JetRanger)', 'Skid gear', 'Smooth pod-and-boom fuselage'], confusedWith: ['h125'], context: 'Utility, EMS, charter.', memoryTip: 'JetRanger with 4 blades and a turbine = 407.', contentLevel: 'stub' },
  { id: 'as332', name: 'Airbus AS332 Super Puma', family: 'Airbus Helicopters', aliases: ['as332', 'super puma', 'h215'], tier: 2, category: 'Helicopter', subcategory: 'Heavy helicopter', perfTier: '6B', frequency: 1, wikipediaTitle: 'Eurocopter AS332 Super Puma', recognition: 'Heavy twin-engine helicopter. Big four-blade main rotor, retractable gear. Used by Swiss Air Force as transport.', visualMarkers: ['Twin engines on top', 'Large four-blade main rotor', 'Retractable wheel gear', 'Bulky fuselage with rear cabin door', 'Sponsons on the side'], confusedWith: ['aw109sp'], context: 'Swiss Air Force transport (Cougar). Offshore, SAR, heavy lift.', memoryTip: 'Big bulky helicopter with sponsons = Super Puma.', contentLevel: 'stub' },
  { id: 'f5-tiger', name: 'F-5E/F Tiger II', family: 'Northrop', aliases: ['f5', 'f-5', 'tiger ii', 'tiger 2'], tier: 2, category: 'Military', subcategory: 'Light fighter', perfTier: '6C', frequency: 1, wikipediaTitle: 'Northrop F-5', recognition: 'Small twin-engine fighter. Slender fuselage, sharp pointy nose, single vertical tail. Older than F-18 — being phased out (Patrouille Suisse).', visualMarkers: ['Twin engines side-by-side (small intakes on fuselage sides)', 'Single vertical tail (vs F-18\'s twin tails)', 'Pointed needle nose', 'Slim swept wing', 'Patrouille Suisse red livery often visible'], confusedWith: ['fa18'], context: 'Swiss Air Force secondary fighter, training, Patrouille Suisse aerobatics.', memoryTip: 'One tail (not two) + tiny + needle nose = F-5.', contentLevel: 'stub' },
  { id: 'pilatus-pc7', name: 'Pilatus PC-7', family: 'Pilatus', aliases: ['pc7', 'pc-7'], tier: 2, category: 'Military', subcategory: 'Basic trainer (turboprop)', perfTier: '4', frequency: 1, wikipediaTitle: 'Pilatus PC-7', recognition: 'Swiss basic military trainer. Turboprop, tandem cockpit, but more "vintage trainer" look than the sleek PC-21.', visualMarkers: ['Single turboprop, three-blade prop (older look)', 'Tandem cockpit, less stepped than PC-21', 'Low straight wing', 'Conventional tail', 'Swiss Air Force or PC-7 Team livery'], confusedWith: ['pilatus-pc21', 'pilatus-pc9'], context: 'Swiss Air Force basic trainer, PC-7 Team aerobatic display.', memoryTip: 'PC-21 looks like a jet. PC-7 looks like a trainer.', contentLevel: 'stub' },
  { id: 'ec635', name: 'Airbus EC635', family: 'Airbus Helicopters', aliases: ['ec635', 'h135', 'ec135'], tier: 2, category: 'Military', subcategory: 'Light military helicopter', perfTier: '6B', frequency: 2, wikipediaTitle: 'Eurocopter EC635', recognition: 'Swiss Air Force light twin helicopter (military variant of EC135/H135). Fenestron tail rotor, skid gear. Smaller than H145.', visualMarkers: ['Twin engines on top', 'Fenestron (shrouded) tail rotor', 'Skid landing gear', 'Greenhouse cockpit, narrow body', 'Swiss Air Force military livery'], confusedWith: ['h145'], context: 'Swiss Air Force training and light transport.', memoryTip: 'Like a small H145 (fenestron + skids) but military gray.', contentLevel: 'stub' },

  // ============================================================
  // TIER 3 — minimal stubs (reference only)
  // ============================================================
  { id: 'mooney-m20', name: 'Mooney M20', family: 'Mooney', aliases: ['mooney', 'm20'], tier: 3, category: 'Piston', subcategory: 'Piston single', perfTier: '2', frequency: 1, wikipediaTitle: 'Mooney M20', recognition: 'Sleek low-wing high-performance single. Distinctive forward-canted vertical tail (looks "wrong-way" leaning).', visualMarkers: ['Forward-leaning vertical tail (THE giveaway)', 'Low wing, retractable gear', 'Slim fuselage'], confusedWith: ['beech-bonanza'], context: 'Owner touring.', memoryTip: 'Tail leans forward = Mooney.', contentLevel: 'stub' },
  { id: 'grumman-aa5', name: 'Grumman AA-5 / AA-1', family: 'Grumman / American', aliases: ['grumman', 'aa-5', 'aa-1', 'tiger', 'cheetah'], tier: 3, category: 'Piston', subcategory: 'Piston single', perfTier: '1', frequency: 1, wikipediaTitle: 'American Aviation AA-1', recognition: 'Low-wing piston single, sliding canopy, simple tubular construction.', visualMarkers: ['Low wing', 'Sliding bubble canopy', 'Fixed gear, tricycle'], confusedWith: ['piper-pa28'], context: 'Light touring, club.', memoryTip: 'Sliding canopy on a low-wing trainer.', contentLevel: 'stub' },
  { id: 'socata-tb', name: 'Socata TB9 / TB10 / TB20 Trinidad', family: 'Socata', aliases: ['tb9', 'tb10', 'tb20', 'trinidad', 'tobago'], tier: 3, category: 'Piston', subcategory: 'Piston single', perfTier: '1', frequency: 1, wikipediaTitle: 'Socata TB family', recognition: 'French low-wing single. Distinctive stepped cabin profile and gull-wing doors.', visualMarkers: ['Low wing', 'Gull-wing cabin doors', 'Pronounced cabin step in fuselage'], confusedWith: ['piper-pa28'], context: 'European clubs.', memoryTip: 'Gull-wing doors = Socata TB.', contentLevel: 'stub' },
  { id: 'jodel', name: 'Jodel D112 / D120 / DR1050', family: 'Jodel', aliases: ['jodel', 'd112', 'd120', 'dr1050'], tier: 3, category: 'Piston', subcategory: 'Piston single (vintage)', perfTier: '1', frequency: 1, wikipediaTitle: 'Jodel', recognition: 'French wood-and-fabric vintage single. Cranked low wing similar to Robin DR400 (its descendant). Tail-dragger.', visualMarkers: ['Cranked dihedral wing', 'Tail-dragger gear', 'Wood/fabric construction'], confusedWith: ['robin-dr400'], context: 'Vintage clubs, France/Switzerland.', memoryTip: 'Robin\'s ancestor with tail wheel.', contentLevel: 'stub' },
  { id: 'piper-pa18', name: 'Piper PA-18 Super Cub', family: 'Piper', aliases: ['pa18', 'super cub', 'cub'], tier: 3, category: 'Piston', subcategory: 'Piston single (utility/STOL)', perfTier: '1', frequency: 1, wikipediaTitle: 'Piper PA-18 Super Cub', recognition: 'Iconic yellow tail-dragger STOL. Tandem two-seat, fabric-covered, high wing with strut.', visualMarkers: ['High strut-braced wing', 'Tail-dragger gear', 'Tandem seating', 'Yellow/cub livery often'], confusedWith: [], context: 'Glider tow, mountain ops, fun.', memoryTip: 'Yellow taildragger. The Piper Cub.', contentLevel: 'stub' },
  { id: 'maule', name: 'Maule M-7', family: 'Maule', aliases: ['maule', 'm-7', 'm7'], tier: 3, category: 'Piston', subcategory: 'Piston single (STOL)', perfTier: '1', frequency: 1, wikipediaTitle: 'Maule M-7', recognition: 'STOL tail-dragger, high wing with strut, big-tire bush plane.', visualMarkers: ['High strut-braced wing', 'Tail-dragger gear, often big tires', 'Tube-and-fabric build'], confusedWith: ['piper-pa18'], context: 'Bush flying, STOL.', memoryTip: 'Big-tire taildragger that\'s not a Cub.', contentLevel: 'stub' },
  { id: 'pilatus-pc9', name: 'Pilatus PC-9', family: 'Pilatus', aliases: ['pc9', 'pc-9'], tier: 3, category: 'Military', subcategory: 'Advanced trainer', perfTier: '4', frequency: 1, wikipediaTitle: 'Pilatus PC-9', recognition: 'Predecessor to PC-21. Tandem turboprop trainer, more powerful than PC-7, less sleek than PC-21.', visualMarkers: ['Tandem cockpit', 'Single turboprop, four-blade prop', 'Conventional tail'], confusedWith: ['pilatus-pc7', 'pilatus-pc21'], context: 'International military trainer.', memoryTip: 'Between PC-7 and PC-21 in everything.', contentLevel: 'stub' },
  { id: 'glider-schleicher', name: 'Schleicher ASK-21 / ASG-29 / ASH-25', family: 'Alexander Schleicher', aliases: ['schleicher', 'ask-21', 'ask21', 'asg-29', 'ash-25'], tier: 3, category: 'Glider', subcategory: 'Glider', perfTier: '1', frequency: 2, wikipediaTitle: 'Alexander Schleicher', recognition: 'Sailplane. No engine, very long slender wings, T-tail typically.', visualMarkers: ['Very long, slim, high-aspect-ratio wings', 'Slim fuselage', 'No engine (or small retractable)', 'T-tail common'], confusedWith: ['glider-schempp', 'glider-dg'], context: 'Soaring clubs, alps.', memoryTip: 'Schleicher = top-tier sailplanes.', contentLevel: 'stub' },
  { id: 'glider-schempp', name: 'Schempp-Hirth Arcus / Duo Discus / Ventus', family: 'Schempp-Hirth', aliases: ['schempp', 'arcus', 'duo discus', 'ventus'], tier: 3, category: 'Glider', subcategory: 'Glider', perfTier: '1', frequency: 2, wikipediaTitle: 'Schempp-Hirth', recognition: 'Performance sailplane. Long thin wings, sleek fuselage. Often two-seat (Duo Discus, Arcus).', visualMarkers: ['Long high-aspect-ratio wings', 'Slim composite fuselage', 'No engine or small self-launch'], confusedWith: ['glider-schleicher', 'glider-dg'], context: 'Competition soaring.', memoryTip: 'Performance sailplane brand.', contentLevel: 'stub' },
  { id: 'glider-dg', name: 'DG Flugzeugbau DG-1000 / DG-808', family: 'DG Flugzeugbau', aliases: ['dg', 'dg-1000', 'dg-808'], tier: 3, category: 'Glider', subcategory: 'Glider', perfTier: '1', frequency: 1, wikipediaTitle: 'DG Flugzeugbau', recognition: 'German sailplane. High aspect ratio wings, modern composite construction.', visualMarkers: ['Long thin wings', 'Composite construction', 'Self-launch variants common'], confusedWith: ['glider-schleicher', 'glider-schempp'], context: 'Soaring clubs.', memoryTip: 'Yet another premium German glider.', contentLevel: 'stub' },
  { id: 'grob-twin-astir', name: 'Grob G103 Twin Astir', family: 'Grob', aliases: ['grob', 'g103', 'twin astir'], tier: 3, category: 'Glider', subcategory: 'Glider (training)', perfTier: '1', frequency: 1, wikipediaTitle: 'Grob G103 Twin Astir', recognition: 'Two-seat training glider. Composite, very common at gliding clubs.', visualMarkers: ['Two seats in tandem', 'Composite construction', 'Long wings, fixed monowheel'], confusedWith: [], context: 'Glider clubs, training.', memoryTip: 'Standard 2-seat training glider.', contentLevel: 'stub' },
  { id: 'hk36', name: 'Diamond HK36 Super Dimona', family: 'Diamond', aliases: ['hk36', 'super dimona', 'dimona'], tier: 3, category: 'Glider', subcategory: 'Motorglider', perfTier: '1', frequency: 1, wikipediaTitle: 'Diamond HK36 Super Dimona', recognition: 'Motorglider. Long glider wings + small engine + propeller. T-tail typical.', visualMarkers: ['Glider-like long wings', 'Small piston engine and prop', 'T-tail', 'Two-seat side-by-side'], confusedWith: ['motor-falke'], context: 'Glider tow, training, touring.', memoryTip: 'Glider that started its own engine.', contentLevel: 'stub' },
  { id: 'motor-falke', name: 'Grob G109B Motorfalke', family: 'Grob', aliases: ['motor falke', 'motorfalke', 'g109'], tier: 3, category: 'Glider', subcategory: 'Motorglider', perfTier: '1', frequency: 1, wikipediaTitle: 'Grob G109', recognition: 'Side-by-side two-seat motorglider. Long wings, single piston engine and propeller.', visualMarkers: ['Long glider wings', 'Side-by-side two-seat cabin', 'Small engine and propeller', 'T-tail'], confusedWith: ['hk36'], context: 'Touring, training motorglider.', memoryTip: 'Older sibling of the HK36.', contentLevel: 'stub' },
  { id: 'hot-air-balloon', name: 'Hot Air Balloon', family: 'Balloon', aliases: ['balloon', 'hot air'], tier: 3, category: 'Special', subcategory: 'Lighter than air', perfTier: '1', frequency: 1, wikipediaTitle: 'Hot air balloon', recognition: 'Obvious balloon envelope with basket. No control surfaces — drifts with wind.', visualMarkers: ['Inflated fabric envelope', 'Basket beneath', 'Burner flame visible'], confusedWith: [], context: 'Sport, tourism. Often early morning or evening.', memoryTip: 'Drifts with wind. Treat as VFR traffic at low level.', contentLevel: 'stub' },
  { id: 'ulm', name: 'ULM / Microlight (Pipistrel Virus / Alpha)', family: 'Various', aliases: ['ulm', 'microlight', 'pipistrel', 'virus', 'alpha'], tier: 3, category: 'Special', subcategory: 'Ultralight', perfTier: '1', frequency: 1, wikipediaTitle: 'Pipistrel Virus', recognition: 'Very small light aircraft. Low or high wing depending on model, single seat or two-seat.', visualMarkers: ['Very small / lightweight build', 'Single small piston or electric engine', 'Composite or fabric construction'], confusedWith: [], context: 'Sport, training, fuel-efficient touring.', memoryTip: 'Tiny, slow, often very efficient. Special airspace rules.', contentLevel: 'stub' }
];

export const aircraftById = Object.fromEntries(aircraft.map(a => [a.id, a]));

export const categoryList = ['Piston', 'Turboprop', 'Jet', 'Helicopter', 'Military', 'Glider', 'Special'];
