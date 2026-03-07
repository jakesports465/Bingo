// ═══════════════════════════════════════════
// MAFIA WARS UNDERGROUND — GAME DATA
// ═══════════════════════════════════════════

// ══════════════════════════════════════════
// GAME STATE
// ══════════════════════════════════════════
const G = {
  name:'Player', playerClass:'Fearless', background:'Streets',
  level:1, xp:0, xpToNext:20, prestige:0, prestigeTokens:0,
  cash:5000, totalEarned:0,
  energy:50, maxEnergy:50,
  stamina:25, maxStamina:25,
  health:100, maxHealth:100,
  baseAttack:10, baseDef:8,
  attack:10, defense:8,
  critChance:5, lootBonus:0,
  xpMult:1.0,
  respect:0, skillPoints:0,
  mafiaSize:1,
  jobsDone:0, fightsWon:0, fightsLost:0, kills:0, robberies:0, contractsDone:0,
  currentCity:'new_york',
  inventory:{ weapons:[], armor:[], vehicles:[], specials:[] },
  properties:{}, lastIncomeColl:Date.now(),
  jobMastery:{}, missionProgress:{}, opProgress:{}, gangWarProgress:{},
  gangTerritories:{},
  skilltree:{},
  craftedItems:{},
  blackMarketBuys:{},
  log:[],
  storeTab:'All',
  activeContracts:[],
  contractRefreshTimer:0,
  // Prestige bonuses
  pBonuses:{ cashMult:1, xpMult:1, energyMult:1, lootMult:1, attackBonus:0, defBonus:0 },
  // New systems
  bossHP:{}, bossDefeated:{}, bossKills:0,
  drugPrices:{}, drugInv:{}, drugTradeCount:0,
  achUnlocked:{},
  currentPanel:'jobs',
  cashMult:1, incomeMult:1, robBonus:0, bountyMult:1, drugMult:1, bossDmgMult:1, warDmgMult:1,
  // Heat / Wanted system
  heat:0, jailTimer:0, stingRisk:0,
  // Hitman-for-hire
  hitmanMissions:{}, hitmanAvail:[],
  // Street Rep / Notoriety
  notoriety:0,
  // Global events
  activeEvent:null, eventTimer:0,
  // Casino stats
  casinoWins:0, casinoLosses:0,
  // Crew members (named)
  crew:{},
  // Black market sting tracking
  bmStingRisk:0,
  luxuryOwned:{}, luxuryTab:'Collectibles',
};

// ══════════════════════════════════════════
// RANKS (Level 1 → 1500)
// ══════════════════════════════════════════
const RANKS = [
  {l:1,n:'Street Rat'},{l:3,n:'Pickpocket'},{l:5,n:'Thug'},{l:8,n:'Street Soldier'},
  {l:12,n:'Corner Boy'},{l:16,n:'Associate'},{l:20,n:'Made Man'},{l:25,n:'Soldier'},
  {l:30,n:'Enforcer'},{l:35,n:'Leg Breaker'},{l:40,n:'Lieutenant'},{l:50,n:'Capo'},
  {l:60,n:'Senior Capo'},{l:70,n:'Underboss'},{l:80,n:'Consigliere'},{l:90,n:'Boss'},
  {l:100,n:'Don'},{l:115,n:'Don of Dons'},{l:130,n:'Godfather'},{l:150,n:'Capo Crimini'},
  {l:175,n:'Shadow Broker'},{l:200,n:'Crime Lord'},{l:225,n:'Cartel Architect'},
  {l:250,n:'International Kingpin'},{l:275,n:'Ghost Emperor'},{l:300,n:'The Untouchable'},
  {l:350,n:'Black Market Sovereign'},{l:400,n:'World Syndicate Boss'},{l:450,n:'Network Controller'},
  {l:500,n:'Phantom Don'},{l:550,n:'Dark Emperor'},{l:600,n:'Legend of the Streets'},
  {l:650,n:'Myth'},{l:700,n:'Shadow Patriarch'},{l:750,n:'The Eternal Don'},
  {l:800,n:'Transcendent Kingpin'},{l:850,n:'Immortal Crime Lord'},{l:900,n:'The Architect'},
  {l:950,n:'Omnipotent'},{l:1000,n:'Godlike'},{l:1100,n:'Ancient Evil'},
  {l:1200,n:'The Devil\'s Right Hand'},{l:1300,n:'Primordial Don'},{l:1400,n:'The Last Don'},
  {l:1500,n:'Il Capo di Tutti Capi'},
];
function getRank(lvl){let r=RANKS[0];for(const rk of RANKS)if(lvl>=rk.l)r=rk;return r.n;}

// ══════════════════════════════════════════
// CITIES (20 total)
// ══════════════════════════════════════════
const CITIES = {
  new_york:     {name:'New York',      emoji:'🗽', unlock:1,    tier:1},
  chicago:      {name:'Chicago',       emoji:'🏙️', unlock:10,   tier:1},
  miami:        {name:'Miami',         emoji:'🌴', unlock:18,   tier:1},
  los_angeles:  {name:'Los Angeles',   emoji:'🎬', unlock:25,   tier:1},
  cuba:         {name:'Havana',        emoji:'🌺', unlock:35,   tier:2},
  mexico_city:  {name:'Mexico City',   emoji:'🌮', unlock:45,   tier:2},
  las_vegas:    {name:'Las Vegas',     emoji:'🎰', unlock:55,   tier:2},
  london:       {name:'London',        emoji:'🎩', unlock:70,   tier:2},
  paris:        {name:'Paris',         emoji:'🗼', unlock:85,   tier:2},
  moscow:       {name:'Moscow',        emoji:'❄️', unlock:100,  tier:3},
  berlin:       {name:'Berlin',        emoji:'🍺', unlock:120,  tier:3},
  dubai:        {name:'Dubai',         emoji:'🏙️', unlock:150,  tier:3},
  istanbul:     {name:'Istanbul',      emoji:'🕌', unlock:175,  tier:3},
  bangkok:      {name:'Bangkok',       emoji:'🐘', unlock:200,  tier:4},
  hong_kong:    {name:'Hong Kong',     emoji:'🏮', unlock:250,  tier:4},
  tokyo:        {name:'Tokyo',         emoji:'⛩️', unlock:300,  tier:4},
  brazil:       {name:'São Paulo',     emoji:'🌿', unlock:350,  tier:4},
  nairobi:      {name:'Nairobi',       emoji:'🦁', unlock:400,  tier:5},
  singapore:    {name:'Singapore',     emoji:'🌆', unlock:500,  tier:5},
  italy:        {name:'Palermo',       emoji:'🍕', unlock:600,  tier:5},
};

// ══════════════════════════════════════════
// MASSIVE JOBS DATABASE (200+)
// ══════════════════════════════════════════
const JOBS = {
new_york:[
  {tier:'I. Petty Crime',jobs:[
    {id:'NY01',n:'Mug a Tourist',e:1,c:72,x:3,lc:.05,li:'brass_knuckles',d:'Easy mark on 5th Avenue'},
    {id:'NY02',n:'Steal a Wallet',e:1,c:60,x:3,lc:.04,d:'Quick hands, quicker feet'},
    {id:'NY03',n:'Run Numbers',e:2,c:132,x:4,lc:.04,d:'Carry bets for the local book'},
    {id:'NY04',n:'Smash a Car Window',e:1,c:90,x:3,lc:.03,d:'GPS units sell fast'},
    {id:'NY05',n:'Boost a Bicycle',e:1,c:108,x:4,lc:.04,d:'Kids love new bikes. So do fences.'},
  ]},
  {tier:'II. Street Level',jobs:[
    {id:'NY06',n:'Collect Protection Money',e:3,c:294,x:11,lc:.06,li:'switchblade',d:'Pay or the restaurant burns'},
    {id:'NY07',n:'Tag Rival Turf',e:2,c:180,x:6,lc:.04,d:'Mark territory, send a message'},
    {id:'NY08',n:'Fence Stolen Electronics',e:3,c:350,x:11,lc:.05,d:'iPads move fast in Chinatown'},
    {id:'NY09',n:'Rob a Bodega',e:4,c:454,x:15,lc:.08,li:'pistol',d:'Corner store, no cameras'},
    {id:'NY10',n:'Sell Counterfeit Watches',e:3,c:336,x:13,lc:.05,d:'Tourists can\'t tell the difference'},
    {id:'NY11',n:'Beat Up a Debtor',e:3,c:385,x:13,lc:.06,d:'He owes three weeks of vig'},
  ]},
  {tier:'III. Made Man',jobs:[
    {id:'NY12',n:'Hijack a Delivery Truck',e:5,c:770,x:22,lc:.08,li:'baseball_bat',d:'Intercept before the dock'},
    {id:'NY13',n:'Shake Down a Business Block',e:6,c:1120,x:36,lc:.08,d:'Four restaurants, one collection run'},
    {id:'NY14',n:'Bribe a Beat Cop',e:5,c:700,x:22,lc:.06,d:'Keep the precinct off your back'},
    {id:'NY15',n:'Run an Illegal Numbers Game',e:5,c:840,x:24,lc:.07,d:'Daily action from 200 bettors'},
    {id:'NY16',n:'Car Theft Ring',e:6,c:1280,x:39,lc:.09,li:'crowbar',d:'Five cars per night to the chop shop'},
    {id:'NY17',n:'Intimidate a Witness',e:6,c:1200,x:36,lc:.08,d:'They saw nothing. Keep it that way.'},
  ]},
  {tier:'IV. Capo',jobs:[
    {id:'NY18',n:'Rob an Armored Car',e:9,c:2800,x:60,lc:.10,li:'tommy_gun',d:'Six guards, one payday'},
    {id:'NY19',n:'Bribe a Police Captain',e:8,c:2400,x:54,lc:.08,d:'A captain is very... persuadable'},
    {id:'NY20',n:'Fix a Court Case',e:9,c:3040,x:60,lc:.09,li:'briefcase_of_cash',d:'Justice has a price. You know it.'},
    {id:'NY21',n:'Control the Docks',e:10,c:3600,x:66,lc:.10,d:'Every container pays a toll'},
    {id:'NY22',n:'Smuggle Cargo Through Customs',e:10,c:3360,x:63,lc:.10,li:'bulletproof_vest',d:'The agent is on the payroll'},
    {id:'NY23',n:'Eliminate a Rival Capo',e:14,c:7200,x:131,lc:.14,li:'sniper_rifle',d:'Commission approved. Green light.'},
  ]},
  {tier:'V. Boss Tier',jobs:[
    {id:'NY24',n:'Launder Money Through Restaurants',e:12,c:6300,x:112,lc:.09,d:'The books are immaculate'},
    {id:'NY25',n:'Run a Chop Shop Network',e:12,c:6750,x:120,lc:.10,d:'Parts worth more than whole vehicles'},
    {id:'NY26',n:'Bribe the DA',e:14,c:9000,x:142,lc:.11,d:'Entire case gets dismissed'},
    {id:'NY27',n:'Takeover a Casino',e:15,c:6750,x:168,lc:.12,li:'ak47',d:'The gamblers barely notice the new owner'},
    {id:'NY28',n:'Control the Financial District',e:16,c:8100,x:187,lc:.13,li:'gold_watch',d:'Banks. Brokerages. Yours.'},
    {id:'NY29',n:'Execute a Rival Don',e:20,c:12600,x:262,lc:.16,li:'don_ring',d:'The Five Families have spoken'},
  ]},
],
chicago:[
  {tier:'I. The Underground',jobs:[
    {id:'CH01',n:'Bootleg Whiskey Run',e:2,c:300,x:7,lc:300.057,li:'switchblade',d:'High-stakes criminal enterprise'},
    {id:'CH02',n:'Break Up a Union Meeting',e:3,c:489,x:15,lc:489.073,li:'baseball_bat',d:'High-stakes criminal enterprise'},
    {id:'CH03',n:'Rob a Poker Game',e:3,c:560,x:17,lc:560.09,d:'High-stakes criminal enterprise'},
    {id:'CH04',n:'Cut a Numbers Wire',e:2,c:330,x:8,lc:330.107,d:'High-stakes criminal enterprise'},
    {id:'CH05',n:'Extort a Pawn Shop',e:3,c:454,x:14,lc:454.123,d:'High-stakes criminal enterprise'},
    {id:'CH06',n:'Mug Drunk Cubs Fans',e:2,c:270,x:6,lc:270.14,d:'High-stakes criminal enterprise'}
  ]},
  {tier:'II. Syndicate',jobs:[
    {id:'CH07',n:'Bomb a Rival Speakeasy',e:5,c:1260,x:29,lc:1260.157,li:'dynamite',d:'High-stakes criminal enterprise'},
    {id:'CH08',n:'Control the Gambling Dens',e:5,c:1400,x:31,lc:1400.173,d:'High-stakes criminal enterprise'},
    {id:'CH09',n:'Bribe a Federal Judge',e:6,c:2000,x:48,lc:2000.19,d:'High-stakes criminal enterprise'},
    {id:'CH10',n:'Whack a Police Informant',e:6,c:2240,x:51,lc:2240.2,li:'silenced_pistol',d:'High-stakes criminal enterprise'},
    {id:'CH11',n:'Run the Stockyards Racket',e:5,c:1540,x:33,lc:1540.2,d:'High-stakes criminal enterprise'},
    {id:'CH12',n:'Hijack a Meat Truck',e:6,c:2080,x:49,lc:2080.2,li:'crowbar',d:'High-stakes criminal enterprise'}
  ]},
  {tier:'III. Outfit Boss',jobs:[
    {id:'CH13',n:'Rig a Union Election',e:9,c:4000,x:84,lc:4000.2,li:'briefcase_of_cash',d:'High-stakes criminal enterprise'},
    {id:'CH14',n:'Smuggle Guns Through OHare',e:10,c:4800,x:96,lc:4800.2,li:'tommy_gun',d:'High-stakes criminal enterprise'},
    {id:'CH15',n:'Hijack a Federal Shipment',e:10,c:5200,x:102,lc:5200.2,li:'fbi_badge',d:'High-stakes criminal enterprise'},
    {id:'CH16',n:'Take Over the Projects',e:8,c:3600,x:78,lc:3600.2,d:'High-stakes criminal enterprise'},
    {id:'CH17',n:'Run the Meatpacking Racket',e:9,c:4400,x:90,lc:4400.2,d:'High-stakes criminal enterprise'},
    {id:'CH18',n:'Control the Taxi Union',e:8,c:3840,x:81,lc:3840.2,d:'High-stakes criminal enterprise'}
  ]},
  {tier:'IV. Kingpin',jobs:[
    {id:'CH19',n:'Control the Commodity Exchange',e:13,c:8100,x:165,lc:8100.2,li:'offshore_account',d:'High-stakes criminal enterprise'},
    {id:'CH20',n:'Own the Police Superintendent',e:14,c:9000,x:187,lc:9000.2,d:'High-stakes criminal enterprise'},
    {id:'CH21',n:'Run Great Lakes Smuggling',e:13,c:7650,x:157,lc:7650.2,li:'speedboat_key',d:'High-stakes criminal enterprise'},
    {id:'CH22',n:'Rig City Contracts',e:12,c:7200,x:150,lc:7200.2,d:'High-stakes criminal enterprise'},
    {id:'CH23',n:'Control McCormick Place',e:14,c:9450,x:195,lc:9450.2,d:'High-stakes criminal enterprise'},
    {id:'CH24',n:'Infiltrate FBI Field Office',e:15,c:10800,x:210,lc:10800.2,li:'fbi_badge',d:'High-stakes criminal enterprise'}
  ]},
  {tier:'V. Chicago Don',jobs:[
    {id:'CH25',n:'Merge All Five Outfits',e:18,c:14400,x:285,lc:14400.2,li:'don_ring',d:'High-stakes criminal enterprise'},
    {id:'CH26',n:'Buy the Governor',e:20,c:18000,x:315,lc:18000.2,d:'High-stakes criminal enterprise'},
    {id:'CH27',n:'Control Midwest Drug Pipeline',e:22,c:22800,x:408,lc:22800.2,li:'drug_lord_crown',d:'High-stakes criminal enterprise'},
    {id:'CH28',n:'Blackmail the FBI Director',e:25,c:28500,x:467,lc:28500.2,li:'fbi_badge',d:'High-stakes criminal enterprise'},
    {id:'CH29',n:'The Capone Legacy',e:28,c:36100,x:552,lc:36100.2,d:'High-stakes criminal enterprise'}
  ]},
],
miami:[
  {tier:'I. Beach City',jobs:[
    {id:'MI01',n:'Hustle Tourists on Ocean Drive',e:2,c:360,x:8,lc:360.057,d:'High-stakes criminal enterprise'},
    {id:'MI02',n:'Run Beach Gambling Ring',e:3,c:560,x:15,lc:560.073,d:'High-stakes criminal enterprise'},
    {id:'MI03',n:'Steal from Yacht Club',e:3,c:630,x:17,lc:630.09,li:'gold_watch',d:'High-stakes criminal enterprise'},
    {id:'MI04',n:'Deal at the Nightclubs',e:2,c:420,x:9,lc:420.107,d:'High-stakes criminal enterprise'},
    {id:'MI05',n:'Carjack Luxury Vehicles',e:4,c:770,x:20,lc:770.123,d:'High-stakes criminal enterprise'},
    {id:'MI06',n:'Rob Spring Breakers',e:2,c:330,x:7,lc:330.14,d:'High-stakes criminal enterprise'}
  ]},
  {tier:'II. Cartel Connection',jobs:[
    {id:'MI07',n:'Smuggle Cocaine Through Port',e:6,c:2000,x:48,lc:2000.157,li:'cartel_pistol',d:'High-stakes criminal enterprise'},
    {id:'MI08',n:'Run a Pill Mill',e:5,c:1400,x:29,lc:1400.173,d:'High-stakes criminal enterprise'},
    {id:'MI09',n:'Control the Fishing Fleet',e:5,c:1260,x:27,lc:1260.19,li:'speedboat_key',d:'High-stakes criminal enterprise'},
    {id:'MI10',n:'Launder Through Art Basel',e:7,c:2400,x:57,lc:2400.2,li:'stolen_masterpiece',d:'High-stakes criminal enterprise'},
    {id:'MI11',n:'Bribe the Coast Guard',e:6,c:1760,x:45,lc:1760.2,d:'High-stakes criminal enterprise'},
    {id:'MI12',n:'Extort Condo Developers',e:6,c:2080,x:49,lc:2080.2,d:'High-stakes criminal enterprise'}
  ]},
  {tier:'III. Miami Vice',jobs:[
    {id:'MI13',n:'Take Over Little Havana',e:9,c:4000,x:84,lc:4000.2,d:'High-stakes criminal enterprise'},
    {id:'MI14',n:'Control Strip Club Empire',e:8,c:3360,x:72,lc:3360.2,li:'entertainer_contract',d:'High-stakes criminal enterprise'},
    {id:'MI15',n:'Run Guns to Central America',e:10,c:4800,x:96,lc:4800.2,li:'ak47',d:'High-stakes criminal enterprise'},
    {id:'MI16',n:'Infiltrate DEA Field Office',e:11,c:6300,x:135,lc:6300.2,li:'fbi_badge',d:'High-stakes criminal enterprise'},
    {id:'MI17',n:'Hurricane Insurance Fraud',e:9,c:3840,x:78,lc:3840.2,li:'briefcase_of_cash',d:'High-stakes criminal enterprise'},
    {id:'MI18',n:'Own the Orange Bowl',e:10,c:4400,x:90,lc:4400.2,d:'High-stakes criminal enterprise'}
  ]},
  {tier:'IV. Vice Lord',jobs:[
    {id:'MI19',n:'Control All Ports of Entry',e:14,c:9000,x:195,lc:9000.2,d:'High-stakes criminal enterprise'},
    {id:'MI20',n:'Run the Caribbean Pipeline',e:15,c:10800,x:225,lc:10800.2,li:'drug_lord_crown',d:'High-stakes criminal enterprise'},
    {id:'MI21',n:'Corrupt the State Attorney',e:14,c:9450,x:202,lc:9450.2,d:'High-stakes criminal enterprise'},
    {id:'MI22',n:'Take Over Star Island',e:16,c:11700,x:240,lc:11700.2,li:'offshore_account',d:'High-stakes criminal enterprise'},
    {id:'MI23',n:'Control Cruise Ship Industry',e:15,c:10350,x:217,lc:10350.2,d:'High-stakes criminal enterprise'}
  ]},
  {tier:'V. King of Miami',jobs:[
    {id:'MI24',n:'Unite the Florida Cartels',e:20,c:16200,x:315,lc:16200.2,li:'cartel_pistol',d:'High-stakes criminal enterprise'},
    {id:'MI25',n:'Build Private Island Base',e:25,c:26600,x:467,lc:26600.2,d:'High-stakes criminal enterprise'},
    {id:'MI26',n:'Control Straits of Florida',e:28,c:33250,x:552,lc:33250.2,li:'speedboat_key',d:'High-stakes criminal enterprise'},
    {id:'MI27',n:'The Scarface Legacy',e:30,c:39900,x:637,lc:39900.2,li:'golden_ak',d:'High-stakes criminal enterprise'},
    {id:'MI28',n:'Rule the Tropics',e:32,c:45600,x:722,lc:45600.2,d:'High-stakes criminal enterprise'}
  ]},
],
los_angeles:[
  {tier:'I. Hollywood Hustle',jobs:[
    {id:'LA01',n:'Sell Fake Scripts',e:2,c:390,x:9,lc:390.057,d:'High-stakes criminal enterprise'},
    {id:'LA02',n:'Run a Chop Shop in Compton',e:3,c:630,x:17,lc:630.073,d:'High-stakes criminal enterprise'},
    {id:'LA03',n:'Deal at Hollywood Parties',e:3,c:700,x:18,lc:700.09,d:'High-stakes criminal enterprise'},
    {id:'LA04',n:'Rob a Dispensary',e:4,c:840,x:21,lc:840.107,li:'pistol',d:'High-stakes criminal enterprise'},
    {id:'LA05',n:'Shake Down Food Trucks',e:2,c:420,x:9,lc:420.123,d:'High-stakes criminal enterprise'},
    {id:'LA06',n:'Control the Rap Industry',e:3,c:595,x:16,lc:595.14,li:'platinum_chain',d:'High-stakes criminal enterprise'}
  ]},
  {tier:'II. West Coast Boss',jobs:[
    {id:'LA07',n:'Rig a Film Production',e:6,c:2240,x:51,lc:2240.157,d:'High-stakes criminal enterprise'},
    {id:'LA08',n:'Control Port of Long Beach',e:7,c:2800,x:60,lc:2800.173,d:'High-stakes criminal enterprise'},
    {id:'LA09',n:'Run the Cannabis Cartel',e:6,c:2000,x:46,lc:2000.19,d:'High-stakes criminal enterprise'},
    {id:'LA10',n:'Extort the Tech Bros',e:5,c:1540,x:31,lc:1540.2,d:'High-stakes criminal enterprise'},
    {id:'LA11',n:'Bribe LAPD Captains',e:7,c:2560,x:57,lc:2560.2,li:'fbi_badge',d:'High-stakes criminal enterprise'},
    {id:'LA12',n:'Own the Nightclub Scene',e:6,c:2080,x:49,lc:2080.2,li:'entertainer_contract',d:'High-stakes criminal enterprise'}
  ]},
  {tier:'III. LA Kingpin',jobs:[
    {id:'LA13',n:'Take Over Garment District',e:9,c:4400,x:90,lc:4400.2,d:'High-stakes criminal enterprise'},
    {id:'LA14',n:'Control Skid Row Drug Trade',e:10,c:5200,x:102,lc:5200.2,li:'drug_lord_crown',d:'High-stakes criminal enterprise'},
    {id:'LA15',n:'Infiltrate the Studios',e:9,c:4000,x:84,lc:4000.2,d:'High-stakes criminal enterprise'},
    {id:'LA16',n:'Run the Border Tunnel',e:11,c:6750,x:142,lc:6750.2,li:'cartel_pistol',d:'High-stakes criminal enterprise'},
    {id:'LA17',n:'Own the Water Rights',e:10,c:4800,x:96,lc:4800.2,d:'High-stakes criminal enterprise'},
    {id:'LA18',n:'Rig the Oscars',e:9,c:4160,x:87,lc:4160.2,li:'stolen_masterpiece',d:'High-stakes criminal enterprise'}
  ]},
  {tier:'IV. Pacific Boss',jobs:[
    {id:'LA19',n:'Control West Coast Ports',e:14,c:9900,x:210,lc:9900.2,d:'High-stakes criminal enterprise'},
    {id:'LA20',n:'Own Sacramento Legislature',e:15,c:11700,x:240,lc:11700.2,d:'High-stakes criminal enterprise'},
    {id:'LA21',n:'Run Asian Import Pipeline',e:14,c:9450,x:202,lc:9450.2,li:'jade_dragon',d:'High-stakes criminal enterprise'},
    {id:'LA22',n:'Take Over Silicon Valley',e:16,c:13500,x:262,lc:13500.2,li:'hacking_rig',d:'High-stakes criminal enterprise'},
    {id:'LA23',n:'Control Entertainment Empire',e:15,c:10800,x:225,lc:10800.2,li:'entertainer_contract',d:'High-stakes criminal enterprise'}
  ]},
  {tier:'V. West Coast Don',jobs:[
    {id:'LA24',n:'Unite Pacific Coast Families',e:20,c:18000,x:337,lc:18000.2,li:'don_ring',d:'High-stakes criminal enterprise'},
    {id:'LA25',n:'Buy the Governor of California',e:22,c:23750,x:442,lc:23750.2,d:'High-stakes criminal enterprise'},
    {id:'LA26',n:'Control Pacific Trade Routes',e:25,c:30400,x:510,lc:30400.2,li:'speedboat_key',d:'High-stakes criminal enterprise'},
    {id:'LA27',n:'Own Hollywood',e:28,c:36100,x:595,lc:36100.2,d:'High-stakes criminal enterprise'},
    {id:'LA28',n:'The West Coast Legacy',e:30,c:42750,x:680,lc:42750.2,d:'High-stakes criminal enterprise'}
  ]},
],
cuba:[
  {tier:'I. Island Life',jobs:[
    {id:'CU01',n:'Sell Black Market Rum',e:2,c:420,x:9,lc:420.057,li:'rum_pistol',d:'High-stakes criminal enterprise'},
    {id:'CU02',n:'Run a Beach Con',e:2,c:360,x:8,lc:360.073,d:'High-stakes criminal enterprise'},
    {id:'CU03',n:'Smuggle Cigars',e:3,c:630,x:17,lc:630.09,d:'High-stakes criminal enterprise'},
    {id:'CU04',n:'Bribe the Harbor Master',e:3,c:595,x:15,lc:595.107,d:'High-stakes criminal enterprise'},
    {id:'CU05',n:'Pickpocket Diplomats',e:2,c:390,x:9,lc:390.123,d:'High-stakes criminal enterprise'},
    {id:'CU06',n:'Run Numbers in Old Havana',e:3,c:560,x:15,lc:560.14,d:'High-stakes criminal enterprise'}
  ]},
  {tier:'II. Island Boss',jobs:[
    {id:'CU07',n:'Control the Rum Distilleries',e:6,c:2240,x:51,lc:2240.157,d:'High-stakes criminal enterprise'},
    {id:'CU08',n:'Run the Havana Casino Ring',e:6,c:2400,x:54,lc:2400.173,d:'High-stakes criminal enterprise'},
    {id:'CU09',n:'Smuggle Refugees for Profit',e:5,c:1540,x:32,lc:1540.19,li:'speedboat_key',d:'High-stakes criminal enterprise'},
    {id:'CU10',n:'Extort Sugar Plantations',e:5,c:1400,x:30,lc:1400.2,d:'High-stakes criminal enterprise'},
    {id:'CU11',n:'Bribe Military Brass',e:7,c:2800,x:60,lc:2800.2,d:'High-stakes criminal enterprise'},
    {id:'CU12',n:'Run Guns from Miami',e:7,c:2560,x:57,lc:2560.2,li:'ak47',d:'High-stakes criminal enterprise'}
  ]},
  {tier:'III. Caribbean Power',jobs:[
    {id:'CU13',n:'Control Drug Transit Route',e:9,c:4400,x:90,lc:4400.2,li:'cartel_pistol',d:'High-stakes criminal enterprise'},
    {id:'CU14',n:'Own the Fishing Fleet',e:8,c:3600,x:78,lc:3600.2,d:'High-stakes criminal enterprise'},
    {id:'CU15',n:'Infiltrate Secret Police',e:10,c:5200,x:102,lc:5200.2,li:'fbi_badge',d:'High-stakes criminal enterprise'},
    {id:'CU16',n:'Run Underground Economy',e:9,c:4000,x:84,lc:4000.2,d:'High-stakes criminal enterprise'},
    {id:'CU17',n:'Take Over Port of Mariel',e:10,c:4800,x:96,lc:4800.2,d:'High-stakes criminal enterprise'},
    {id:'CU18',n:'Control Tourist Industry',e:8,c:3840,x:81,lc:3840.2,li:'briefcase_of_cash',d:'High-stakes criminal enterprise'}
  ]},
  {tier:'IV. Island Emperor',jobs:[
    {id:'CU19',n:'Own the Cuban Military',e:14,c:9000,x:195,lc:9000.2,d:'High-stakes criminal enterprise'},
    {id:'CU20',n:'Control Caribbean Drug Routes',e:15,c:10800,x:225,lc:10800.2,li:'drug_lord_crown',d:'High-stakes criminal enterprise'},
    {id:'CU21',n:'Establish Private Island Base',e:14,c:9450,x:202,lc:9450.2,d:'High-stakes criminal enterprise'},
    {id:'CU22',n:'Run Venezuelan Oil Scam',e:16,c:12600,x:255,lc:12600.2,li:'offshore_account',d:'High-stakes criminal enterprise'},
    {id:'CU23',n:'Own the Mexican Pipeline',e:15,c:10350,x:217,lc:10350.2,d:'High-stakes criminal enterprise'}
  ]},
  {tier:'V. Caribbean Don',jobs:[
    {id:'CU24',n:'Unite Caribbean Cartels',e:20,c:16200,x:315,lc:16200.2,d:'High-stakes criminal enterprise'},
    {id:'CU25',n:'Overthrow the Government',e:25,c:26600,x:467,lc:26600.2,d:'High-stakes criminal enterprise'},
    {id:'CU26',n:'Control All Caribbean Shipping',e:28,c:33250,x:552,lc:33250.2,li:'speedboat_key',d:'High-stakes criminal enterprise'},
    {id:'CU27',n:'The Castro Legacy',e:30,c:39900,x:637,lc:39900.2,li:'cuban_pistol',d:'High-stakes criminal enterprise'},
    {id:'CU28',n:'Caribbean Empire',e:32,c:47500,x:722,lc:47500.2,d:'High-stakes criminal enterprise'}
  ]},
],
mexico_city:[
  {tier:'I. Cartel Initiate',jobs:[
    {id:'MC01',n:'Run Street Corner Sales',e:2,c:480,x:10,lc:480.057,d:'High-stakes criminal enterprise'},
    {id:'MC02',n:'Extort Local Merchants',e:3,c:770,x:18,lc:770.073,d:'High-stakes criminal enterprise'},
    {id:'MC03',n:'Smuggle Across the Border',e:3,c:840,x:20,lc:840.09,d:'High-stakes criminal enterprise'},
    {id:'MC04',n:'Recruit Sicarios',e:2,c:540,x:11,lc:540.107,d:'High-stakes criminal enterprise'},
    {id:'MC05',n:'Steal from Rich Neighborhoods',e:3,c:700,x:18,lc:700.123,d:'High-stakes criminal enterprise'},
    {id:'MC06',n:'Run a Tianguis Black Market',e:2,c:510,x:10,lc:510.14,d:'High-stakes criminal enterprise'}
  ]},
  {tier:'II. Cartel Soldier',jobs:[
    {id:'MC07',n:'Guard a Drug Shipment',e:6,c:2400,x:54,lc:2400.157,d:'High-stakes criminal enterprise'},
    {id:'MC08',n:'Assassinate a Rival Lieutenant',e:7,c:3040,x:66,lc:3040.173,li:'silenced_pistol',d:'High-stakes criminal enterprise'},
    {id:'MC09',n:'Run a Meth Superlab',e:6,c:2560,x:57,lc:2560.19,d:'High-stakes criminal enterprise'},
    {id:'MC10',n:'Control a Border Crossing',e:7,c:3200,x:69,lc:3200.2,d:'High-stakes criminal enterprise'},
    {id:'MC11',n:'Extort the Avocado Farmers',e:5,c:1819,x:36,lc:1819.2,d:'High-stakes criminal enterprise'},
    {id:'MC12',n:'Kidnap a Businessman',e:6,c:2720,x:60,lc:2720.2,li:'pistol',d:'High-stakes criminal enterprise'}
  ]},
  {tier:'III. Cartel Lieutenant',jobs:[
    {id:'MC13',n:'Take Over a State Government',e:10,c:5600,x:108,lc:5600.2,d:'High-stakes criminal enterprise'},
    {id:'MC14',n:'Run the Fentanyl Pipeline',e:11,c:7200,x:150,lc:7200.2,li:'drug_lord_crown',d:'High-stakes criminal enterprise'},
    {id:'MC15',n:'Control the Migration Routes',e:9,c:4800,x:96,lc:4800.2,d:'High-stakes criminal enterprise'},
    {id:'MC16',n:'Own the Federal Police',e:10,c:6000,x:114,lc:6000.2,li:'fbi_badge',d:'High-stakes criminal enterprise'},
    {id:'MC17',n:'Run the Tunnel Network',e:9,c:5200,x:102,lc:5200.2,d:'High-stakes criminal enterprise'},
    {id:'MC18',n:'Assassinate a Governor',e:11,c:7650,x:157,lc:7650.2,li:'assassination_kit',d:'High-stakes criminal enterprise'}
  ]},
  {tier:'IV. Cartel Boss',jobs:[
    {id:'MC19',n:'Merge Two Major Cartels',e:15,c:11700,x:240,lc:11700.2,d:'High-stakes criminal enterprise'},
    {id:'MC20',n:'Control the Pacific Port',e:16,c:13500,x:270,lc:13500.2,d:'High-stakes criminal enterprise'},
    {id:'MC21',n:'Own the Mexican Military',e:15,c:12600,x:255,lc:12600.2,d:'High-stakes criminal enterprise'},
    {id:'MC22',n:'Run the US Distribution Network',e:17,c:15300,x:300,lc:15300.2,li:'drug_lord_crown',d:'High-stakes criminal enterprise'},
    {id:'MC23',n:'Control the Oil Pipeline',e:16,c:14400,x:285,lc:14400.2,li:'offshore_account',d:'High-stakes criminal enterprise'}
  ]},
  {tier:'V. El Jefe',jobs:[
    {id:'MC24',n:'Rule All of Mexico',e:22,c:23750,x:442,lc:23750.2,d:'High-stakes criminal enterprise'},
    {id:'MC25',n:'Control the Americas Drug Supply',e:26,c:33250,x:552,lc:33250.2,li:'drug_lord_crown',d:'High-stakes criminal enterprise'},
    {id:'MC26',n:'Own the Government',e:28,c:38000,x:612,lc:38000.2,d:'High-stakes criminal enterprise'},
    {id:'MC27',n:'The El Chapo Legacy',e:30,c:45600,x:680,lc:45600.2,d:'High-stakes criminal enterprise'},
    {id:'MC28',n:'Continental Empire',e:32,c:52250,x:765,lc:52250.2,d:'High-stakes criminal enterprise'}
  ]},
],
las_vegas:[
  {tier:'I. The Strip',jobs:[
    {id:'LV01',n:'Count Cards at the Bellagio',e:2,c:540,x:11,lc:540.057,d:'High-stakes criminal enterprise'},
    {id:'LV02',n:'Run a Fake Casino Chip Ring',e:3,c:840,x:20,lc:840.073,d:'High-stakes criminal enterprise'},
    {id:'LV03',n:'Pickpocket High Rollers',e:2,c:480,x:10,lc:480.09,d:'High-stakes criminal enterprise'},
    {id:'LV04',n:'Sell Fake Show Tickets',e:2,c:450,x:9,lc:450.107,d:'High-stakes criminal enterprise'},
    {id:'LV05',n:'Rob a Pawn Shop on Fremont',e:3,c:770,x:18,lc:770.123,d:'High-stakes criminal enterprise'},
    {id:'LV06',n:'Run a Street Dice Game',e:3,c:700,x:18,lc:700.14,d:'High-stakes criminal enterprise'}
  ]},
  {tier:'II. Vegas Royalty',jobs:[
    {id:'LV07',n:'Rig Slot Machines',e:6,c:2560,x:57,lc:2560.157,d:'High-stakes criminal enterprise'},
    {id:'LV08',n:'Run the Underground Fight Club',e:7,c:3200,x:69,lc:3200.173,d:'High-stakes criminal enterprise'},
    {id:'LV09',n:'Extort the Strip Club Owners',e:6,c:2800,x:60,lc:2800.19,li:'entertainer_contract',d:'High-stakes criminal enterprise'},
    {id:'LV10',n:'Bribe the Gaming Commission',e:7,c:3360,x:72,lc:3360.2,d:'High-stakes criminal enterprise'},
    {id:'LV11',n:'Control the Escort Services',e:5,c:1959,x:38,lc:1959.2,d:'High-stakes criminal enterprise'},
    {id:'LV12',n:'Launder Through Wedding Chapels',e:6,c:2400,x:54,lc:2400.2,li:'briefcase_of_cash',d:'High-stakes criminal enterprise'}
  ]},
  {tier:'III. Casino Boss',jobs:[
    {id:'LV13',n:'Take Over a Casino Floor',e:10,c:6000,x:114,lc:6000.2,d:'High-stakes criminal enterprise'},
    {id:'LV14',n:'Run the Sports Betting Wire',e:11,c:7650,x:157,lc:7650.2,d:'High-stakes criminal enterprise'},
    {id:'LV15',n:'Control the Convention Industry',e:9,c:5200,x:102,lc:5200.2,d:'High-stakes criminal enterprise'},
    {id:'LV16',n:'Own the Teamsters Pension Fund',e:10,c:5600,x:108,lc:5600.2,li:'offshore_account',d:'High-stakes criminal enterprise'},
    {id:'LV17',n:'Rig a Boxing Championship',e:11,c:7200,x:150,lc:7200.2,d:'High-stakes criminal enterprise'},
    {id:'LV18',n:'Blackmail Casino Executives',e:9,c:5440,x:105,lc:5440.2,li:'compromising_photos',d:'High-stakes criminal enterprise'}
  ]},
  {tier:'IV. Desert King',jobs:[
    {id:'LV19',n:'Own Three Casinos',e:15,c:12600,x:255,lc:12600.2,d:'High-stakes criminal enterprise'},
    {id:'LV20',n:'Control the Water Supply',e:16,c:14400,x:285,lc:14400.2,d:'High-stakes criminal enterprise'},
    {id:'LV21',n:'Run Nevada State Politics',e:15,c:12150,x:247,lc:12150.2,d:'High-stakes criminal enterprise'},
    {id:'LV22',n:'Build an Underground Bunker Network',e:17,c:16200,x:315,lc:16200.2,d:'High-stakes criminal enterprise'},
    {id:'LV23',n:'Control Area 51 Security Contracts',e:16,c:13500,x:270,lc:13500.2,li:'hacking_rig',d:'High-stakes criminal enterprise'}
  ]},
  {tier:'V. King of Vegas',jobs:[
    {id:'LV24',n:'Own the Entire Strip',e:22,c:24700,x:459,lc:24700.2,d:'High-stakes criminal enterprise'},
    {id:'LV25',n:'Control All Nevada Gaming',e:26,c:34200,x:561,lc:34200.2,d:'High-stakes criminal enterprise'},
    {id:'LV26',n:'Build a Criminal Empire in the Desert',e:28,c:39900,x:629,lc:39900.2,li:'don_ring',d:'High-stakes criminal enterprise'},
    {id:'LV27',n:'The Bugsy Legacy',e:30,c:47500,x:697,lc:47500.2,d:'High-stakes criminal enterprise'},
    {id:'LV28',n:'Sin City Is Your City',e:32,c:55100,x:765,lc:55100.2,d:'High-stakes criminal enterprise'}
  ]},
],
london:[
  {tier:'I. Eastside',jobs:[
    {id:'LO01',n:'Pickpocket on the Tube',e:2,c:600,x:12,lc:600.057,d:'High-stakes criminal enterprise'},
    {id:'LO02',n:'Fence Stolen Antiques',e:3,c:979,x:21,lc:979.073,d:'High-stakes criminal enterprise'},
    {id:'LO03',n:'Run a Betting Shop Scam',e:3,c:840,x:19,lc:840.09,d:'High-stakes criminal enterprise'},
    {id:'LO04',n:'Mug Tourists at Big Ben',e:2,c:540,x:11,lc:540.107,d:'High-stakes criminal enterprise'},
    {id:'LO05',n:'Sell Counterfeit Pounds',e:3,c:909,x:20,lc:909.123,d:'High-stakes criminal enterprise'},
    {id:'LO06',n:'Burgle Kensington Homes',e:4,c:1120,x:23,lc:1120.14,li:'gold_watch',d:'High-stakes criminal enterprise'}
  ]},
  {tier:'II. London Don',jobs:[
    {id:'LO07',n:'Control the East End Firms',e:6,c:2800,x:60,lc:2800.157,d:'High-stakes criminal enterprise'},
    {id:'LO08',n:'Run the Soho Gambling Dens',e:7,c:3360,x:72,lc:3360.173,d:'High-stakes criminal enterprise'},
    {id:'LO09',n:'Extort the City Bankers',e:7,c:3600,x:75,lc:3600.19,li:'briefcase_of_cash',d:'High-stakes criminal enterprise'},
    {id:'LO10',n:'Smuggle Through the Chunnel',e:6,c:3040,x:64,lc:3040.2,d:'High-stakes criminal enterprise'},
    {id:'LO11',n:'Bribe Scotland Yard',e:8,c:4000,x:81,lc:4000.2,li:'fbi_badge',d:'High-stakes criminal enterprise'},
    {id:'LO12',n:'Run the Football Hooligan Firm',e:6,c:2560,x:57,lc:2560.2,d:'High-stakes criminal enterprise'}
  ]},
  {tier:'III. Crown Syndicate',jobs:[
    {id:'LO13',n:'Take Over the Docklands',e:10,c:6400,x:120,lc:6400.2,d:'High-stakes criminal enterprise'},
    {id:'LO14',n:'Control the Diamond Trade',e:11,c:8100,x:165,lc:8100.2,li:'uncut_diamonds',d:'High-stakes criminal enterprise'},
    {id:'LO15',n:'Infiltrate MI5',e:11,c:8550,x:172,lc:8550.2,li:'fbi_badge',d:'High-stakes criminal enterprise'},
    {id:'LO16',n:'Run the Arms Trade to Africa',e:10,c:6800,x:126,lc:6800.2,li:'british_rifle',d:'High-stakes criminal enterprise'},
    {id:'LO17',n:'Own the West End',e:9,c:6000,x:114,lc:6000.2,li:'entertainer_contract',d:'High-stakes criminal enterprise'},
    {id:'LO18',n:'Corrupt a Cabinet Minister',e:10,c:6560,x:123,lc:6560.2,li:'compromising_photos',d:'High-stakes criminal enterprise'}
  ]},
  {tier:'IV. Empire Builder',jobs:[
    {id:'LO19',n:'Control the City of London Banks',e:16,c:14400,x:285,lc:14400.2,d:'High-stakes criminal enterprise'},
    {id:'LO20',n:'Run European Drug Distribution',e:17,c:16200,x:315,lc:16200.2,li:'drug_lord_crown',d:'High-stakes criminal enterprise'},
    {id:'LO21',n:'Own the House of Lords',e:16,c:15300,x:300,lc:15300.2,d:'High-stakes criminal enterprise'},
    {id:'LO22',n:'Control the Arms Export Industry',e:18,c:18000,x:337,lc:18000.2,li:'british_rifle',d:'High-stakes criminal enterprise'},
    {id:'LO23',n:'Take Over Canary Wharf',e:17,c:17100,x:322,lc:17100.2,li:'offshore_account',d:'High-stakes criminal enterprise'}
  ]},
  {tier:'V. Lord of London',jobs:[
    {id:'LO24',n:'Own the Crown Jewels Heist',e:22,c:26600,x:476,lc:26600.2,d:'High-stakes criminal enterprise'},
    {id:'LO25',n:'Control All of Europe',e:26,c:36100,x:578,lc:36100.2,d:'High-stakes criminal enterprise'},
    {id:'LO26',n:'Infiltrate the Royal Family',e:28,c:41800,x:646,lc:41800.2,li:'papal_signet',d:'High-stakes criminal enterprise'},
    {id:'LO27',n:'The Kray Legacy',e:30,c:49400,x:714,lc:49400.2,d:'High-stakes criminal enterprise'},
    {id:'LO28',n:'British Empire Reborn',e:32,c:57000,x:782,lc:57000.2,li:'world_don_crown',d:'High-stakes criminal enterprise'}
  ]},
],
paris:[
  {tier:'I. Parisian Underground',jobs:[
    {id:'PA01',n:'Pickpocket at the Louvre',e:2,c:720,x:13,lc:720.057,d:'High-stakes criminal enterprise'},
    {id:'PA02',n:'Run a Montmartre Con',e:3,c:1050,x:22,lc:1050.073,d:'High-stakes criminal enterprise'},
    {id:'PA03',n:'Sell Fake Designer Goods',e:2,c:660,x:12,lc:660.09,d:'High-stakes criminal enterprise'},
    {id:'PA04',n:'Burgle the Marais District',e:3,c:1120,x:23,lc:1120.107,d:'High-stakes criminal enterprise'},
    {id:'PA05',n:'Extort Cafe Owners',e:2,c:600,x:12,lc:600.123,d:'High-stakes criminal enterprise'},
    {id:'PA06',n:'Run an Illegal Cabaret',e:3,c:979,x:21,lc:979.14,li:'entertainer_contract',d:'High-stakes criminal enterprise'}
  ]},
  {tier:'II. Parisian Don',jobs:[
    {id:'PA07',n:'Control the Banlieue Drug Trade',e:6,c:3200,x:69,lc:3200.157,d:'High-stakes criminal enterprise'},
    {id:'PA08',n:'Run the Art Forgery Ring',e:7,c:3840,x:78,lc:3840.173,li:'stolen_masterpiece',d:'High-stakes criminal enterprise'},
    {id:'PA09',n:'Extort the Fashion Houses',e:7,c:4000,x:81,lc:4000.19,d:'High-stakes criminal enterprise'},
    {id:'PA10',n:'Smuggle Through Charles de Gaulle',e:6,c:3360,x:72,lc:3360.2,d:'High-stakes criminal enterprise'},
    {id:'PA11',n:'Bribe the Gendarmerie',e:7,c:3600,x:75,lc:3600.2,li:'fbi_badge',d:'High-stakes criminal enterprise'},
    {id:'PA12',n:'Control the Wine Fraud Network',e:6,c:3040,x:66,lc:3040.2,d:'High-stakes criminal enterprise'}
  ]},
  {tier:'III. French Connection',jobs:[
    {id:'PA13',n:'Run the Heroin Pipeline',e:10,c:6800,x:126,lc:6800.2,d:'High-stakes criminal enterprise'},
    {id:'PA14',n:'Take Over the Corsican Mafia',e:11,c:8550,x:172,lc:8550.2,li:'corsican_blade',d:'High-stakes criminal enterprise'},
    {id:'PA15',n:'Control the Riviera Casinos',e:10,c:6400,x:120,lc:6400.2,d:'High-stakes criminal enterprise'},
    {id:'PA16',n:'Infiltrate the DGSE',e:11,c:9000,x:180,lc:9000.2,li:'fbi_badge',d:'High-stakes criminal enterprise'},
    {id:'PA17',n:'Own the Champagne Trade',e:9,c:6000,x:114,lc:6000.2,d:'High-stakes criminal enterprise'},
    {id:'PA18',n:'Run the Monaco Heist',e:10,c:7200,x:132,lc:7200.2,li:'uncut_diamonds',d:'High-stakes criminal enterprise'}
  ]},
  {tier:'IV. Continental Boss',jobs:[
    {id:'PA19',n:'Control the European Drug Routes',e:16,c:15300,x:300,lc:15300.2,li:'drug_lord_crown',d:'High-stakes criminal enterprise'},
    {id:'PA20',n:'Own the EU Parliament Members',e:17,c:17100,x:330,lc:17100.2,d:'High-stakes criminal enterprise'},
    {id:'PA21',n:'Run the Mediterranean Smuggling',e:16,c:16200,x:315,lc:16200.2,d:'High-stakes criminal enterprise'},
    {id:'PA22',n:'Take Over the French Banking System',e:18,c:18900,x:360,lc:18900.2,li:'offshore_account',d:'High-stakes criminal enterprise'},
    {id:'PA23',n:'Control the Nuclear Industry',e:17,c:18000,x:345,lc:18000.2,d:'High-stakes criminal enterprise'}
  ]},
  {tier:'V. Emperor of Paris',jobs:[
    {id:'PA24',n:'Unite the European Families',e:22,c:26600,x:476,lc:26600.2,li:'don_ring',d:'High-stakes criminal enterprise'},
    {id:'PA25',n:'Own the European Union',e:26,c:36100,x:578,lc:36100.2,d:'High-stakes criminal enterprise'},
    {id:'PA26',n:'Control All Continental Trade',e:28,c:42750,x:646,lc:42750.2,d:'High-stakes criminal enterprise'},
    {id:'PA27',n:'The Napoleon Legacy',e:30,c:51300,x:731,lc:51300.2,d:'High-stakes criminal enterprise'},
    {id:'PA28',n:'LEmpire',e:32,c:58900,x:799,lc:58900.2,d:'High-stakes criminal enterprise'}
  ]},
],
moscow:[
  {tier:'I. Bratva',jobs:[
    {id:'MO01',n:'Shake Down Market Vendors',e:2,c:900,x:14,lc:900.057,d:'High-stakes criminal enterprise'},
    {id:'MO02',n:'Run a Vodka Smuggling Ring',e:3,c:1260,x:24,lc:1260.073,d:'High-stakes criminal enterprise'},
    {id:'MO03',n:'Extort the Metro Merchants',e:2,c:780,x:13,lc:780.09,d:'High-stakes criminal enterprise'},
    {id:'MO04',n:'Rob Oligarch Apartments',e:4,c:1540,x:27,lc:1540.107,d:'High-stakes criminal enterprise'},
    {id:'MO05',n:'Run Underground Card Games',e:3,c:1120,x:22,lc:1120.123,d:'High-stakes criminal enterprise'},
    {id:'MO06',n:'Sell Black Market Electronics',e:3,c:1190,x:23,lc:1190.14,d:'High-stakes criminal enterprise'}
  ]},
  {tier:'II. Vor',jobs:[
    {id:'MO07',n:'Control the Arms Bazaar',e:7,c:4000,x:81,lc:4000.157,d:'High-stakes criminal enterprise'},
    {id:'MO08',n:'Run the Protection Racket',e:6,c:3360,x:69,lc:3360.173,d:'High-stakes criminal enterprise'},
    {id:'MO09',n:'Smuggle Gold from Siberia',e:7,c:4400,x:87,lc:4400.19,li:'gold_bar',d:'High-stakes criminal enterprise'},
    {id:'MO10',n:'Bribe FSB Officers',e:8,c:4800,x:93,lc:4800.2,li:'fbi_badge',d:'High-stakes criminal enterprise'},
    {id:'MO11',n:'Control the Vodka Trade',e:6,c:3600,x:72,lc:3600.2,d:'High-stakes criminal enterprise'},
    {id:'MO12',n:'Run the Human Trafficking Route',e:7,c:4160,x:84,lc:4160.2,d:'High-stakes criminal enterprise'}
  ]},
  {tier:'III. Pakhan',jobs:[
    {id:'MO13',n:'Take Over the Oil Pipeline',e:11,c:9000,x:180,lc:9000.2,d:'High-stakes criminal enterprise'},
    {id:'MO14',n:'Control Moscow Real Estate',e:10,c:7200,x:132,lc:7200.2,d:'High-stakes criminal enterprise'},
    {id:'MO15',n:'Run the Oligarch Extortion Ring',e:11,c:9450,x:187,lc:9450.2,li:'compromising_photos',d:'High-stakes criminal enterprise'},
    {id:'MO16',n:'Infiltrate the Kremlin Guard',e:12,c:10800,x:210,lc:10800.2,li:'fbi_badge',d:'High-stakes criminal enterprise'},
    {id:'MO17',n:'Own the Trans-Siberian Route',e:10,c:7600,x:138,lc:7600.2,d:'High-stakes criminal enterprise'},
    {id:'MO18',n:'Control the Cybercrime Network',e:11,c:9900,x:195,lc:9900.2,li:'hacking_rig',d:'High-stakes criminal enterprise'}
  ]},
  {tier:'IV. Krestniy Otets',jobs:[
    {id:'MO19',n:'Own the Russian Energy Sector',e:17,c:18000,x:345,lc:18000.2,d:'High-stakes criminal enterprise'},
    {id:'MO20',n:'Control the Nuclear Arsenal Access',e:18,c:19800,x:375,lc:19800.2,d:'High-stakes criminal enterprise'},
    {id:'MO21',n:'Run the Global Weapons Trade',e:17,c:18900,x:360,lc:18900.2,li:'ak47',d:'High-stakes criminal enterprise'},
    {id:'MO22',n:'Bribe the Presidentss Inner Circle',e:19,c:22500,x:405,lc:22500.2,li:'compromising_photos',d:'High-stakes criminal enterprise'},
    {id:'MO23',n:'Take Over Gazprom',e:18,c:20700,x:390,lc:20700.2,li:'offshore_account',d:'High-stakes criminal enterprise'}
  ]},
  {tier:'V. Tsar of the Underworld',jobs:[
    {id:'MO24',n:'Unite All Russian Mafia Families',e:24,c:30400,x:527,lc:30400.2,li:'vor_crown',d:'High-stakes criminal enterprise'},
    {id:'MO25',n:'Own the Kremlin',e:28,c:39900,x:629,lc:39900.2,d:'High-stakes criminal enterprise'},
    {id:'MO26',n:'Control the Arctic Resources',e:30,c:47500,x:714,lc:47500.2,d:'High-stakes criminal enterprise'},
    {id:'MO27',n:'The Putin Gambit',e:32,c:55100,x:782,lc:55100.2,d:'High-stakes criminal enterprise'},
    {id:'MO28',n:'Russian Empire Reborn',e:35,c:64600,x:850,lc:64600.2,li:'world_don_crown',d:'High-stakes criminal enterprise'}
  ]},
],
berlin:[
  {tier:'I. Underground',jobs:[
    {id:'BE01',n:'Deal in Kreuzberg Clubs',e:2,c:960,x:15,lc:960.057,d:'High-stakes criminal enterprise'},
    {id:'BE02',n:'Run a Counterfeit Euro Ring',e:3,c:1400,x:26,lc:1400.073,d:'High-stakes criminal enterprise'},
    {id:'BE03',n:'Steal from Museum Island',e:3,c:1540,x:27,lc:1540.09,d:'High-stakes criminal enterprise'},
    {id:'BE04',n:'Extort the Kebab Shops',e:2,c:900,x:14,lc:900.107,d:'High-stakes criminal enterprise'},
    {id:'BE05',n:'Smuggle Through Checkpoint Charlie',e:3,c:1260,x:24,lc:1260.123,d:'High-stakes criminal enterprise'},
    {id:'BE06',n:'Run Underground Raves',e:2,c:1020,x:15,lc:1020.14,li:'entertainer_contract',d:'High-stakes criminal enterprise'}
  ]},
  {tier:'II. German Syndicate',jobs:[
    {id:'BE07',n:'Control the Autobahn Smuggling',e:7,c:4400,x:87,lc:4400.157,d:'High-stakes criminal enterprise'},
    {id:'BE08',n:'Run the Berlin Club Empire',e:7,c:4640,x:90,lc:4640.173,d:'High-stakes criminal enterprise'},
    {id:'BE09',n:'Extort the Auto Industry',e:8,c:5200,x:99,lc:5200.19,d:'High-stakes criminal enterprise'},
    {id:'BE10',n:'Bribe the BND',e:8,c:5440,x:102,lc:5440.2,li:'fbi_badge',d:'High-stakes criminal enterprise'},
    {id:'BE11',n:'Run the Eastern European Pipeline',e:7,c:4160,x:84,lc:4160.2,d:'High-stakes criminal enterprise'},
    {id:'BE12',n:'Control the Port of Hamburg',e:8,c:4960,x:94,lc:4960.2,d:'High-stakes criminal enterprise'}
  ]},
  {tier:'III. European Power',jobs:[
    {id:'BE13',n:'Take Over Deutsche Bank Operations',e:11,c:9900,x:195,lc:9900.2,d:'High-stakes criminal enterprise'},
    {id:'BE14',n:'Control the EU Drug Trade',e:12,c:11700,x:225,lc:11700.2,d:'High-stakes criminal enterprise'},
    {id:'BE15',n:'Run the Balkans Arms Route',e:11,c:10350,x:202,lc:10350.2,li:'ak47',d:'High-stakes criminal enterprise'},
    {id:'BE16',n:'Own the Bundesliga',e:11,c:10800,x:210,lc:10800.2,d:'High-stakes criminal enterprise'},
    {id:'BE17',n:'Infiltrate German Intelligence',e:12,c:12150,x:232,lc:12150.2,li:'fbi_badge',d:'High-stakes criminal enterprise'},
    {id:'BE18',n:'Control the Rhine Shipping',e:11,c:10620,x:206,lc:10620.2,d:'High-stakes criminal enterprise'}
  ]},
  {tier:'IV. Continental Lord',jobs:[
    {id:'BE19',n:'Own German Industry',e:18,c:19800,x:375,lc:19800.2,d:'High-stakes criminal enterprise'},
    {id:'BE20',n:'Control the European Arms Trade',e:19,c:22500,x:412,lc:22500.2,d:'High-stakes criminal enterprise'},
    {id:'BE21',n:'Run the EU Banking Fraud',e:18,c:20700,x:390,lc:20700.2,li:'offshore_account',d:'High-stakes criminal enterprise'},
    {id:'BE22',n:'Take Over the Bundestag',e:20,c:25200,x:450,lc:25200.2,d:'High-stakes criminal enterprise'},
    {id:'BE23',n:'Control the Pharma Industry',e:19,c:23400,x:420,lc:23400.2,d:'High-stakes criminal enterprise'}
  ]},
  {tier:'V. Kaiser',jobs:[
    {id:'BE24',n:'Unite the European Mafias',e:26,c:36100,x:595,lc:36100.2,d:'High-stakes criminal enterprise'},
    {id:'BE25',n:'Own the EU',e:30,c:47500,x:714,lc:47500.2,d:'High-stakes criminal enterprise'},
    {id:'BE26',n:'Control Continental Banking',e:32,c:55100,x:782,lc:55100.2,d:'High-stakes criminal enterprise'},
    {id:'BE27',n:'The Fourth Reich of Crime',e:35,c:64600,x:850,lc:64600.2,li:'don_ring',d:'High-stakes criminal enterprise'},
    {id:'BE28',n:'European Emperor',e:38,c:74100,x:935,lc:74100.2,d:'High-stakes criminal enterprise'}
  ]},
],
dubai:[
  {tier:'I. Oil Money',jobs:[
    {id:'DU01',n:'Scam Rich Tourists',e:2,c:1200,x:17,lc:1200.057,d:'High-stakes criminal enterprise'},
    {id:'DU02',n:'Run a Gold Smuggling Ring',e:3,c:1750,x:30,lc:1750.073,li:'gold_bar',d:'High-stakes criminal enterprise'},
    {id:'DU03',n:'Sell Fake Luxury Goods',e:2,c:1080,x:16,lc:1080.09,d:'High-stakes criminal enterprise'},
    {id:'DU04',n:'Extort Construction Workers',e:2,c:1020,x:15,lc:1020.107,d:'High-stakes criminal enterprise'},
    {id:'DU05',n:'Run an Underground Fight Club',e:3,c:1540,x:27,lc:1540.123,d:'High-stakes criminal enterprise'},
    {id:'DU06',n:'Bribe the Port Authority',e:3,c:1680,x:29,lc:1680.14,d:'High-stakes criminal enterprise'}
  ]},
  {tier:'II. Desert Syndicate',jobs:[
    {id:'DU07',n:'Control the Gold Souk',e:7,c:4800,x:93,lc:4800.157,d:'High-stakes criminal enterprise'},
    {id:'DU08',n:'Run the Oil Futures Scam',e:8,c:5600,x:105,lc:5600.173,d:'High-stakes criminal enterprise'},
    {id:'DU09',n:'Extort the Real Estate Developers',e:7,c:5200,x:99,lc:5200.19,li:'offshore_account',d:'High-stakes criminal enterprise'},
    {id:'DU10',n:'Smuggle Weapons to Yemen',e:8,c:6000,x:111,lc:6000.2,li:'ak47',d:'High-stakes criminal enterprise'},
    {id:'DU11',n:'Control the Luxury Car Trade',e:7,c:4960,x:96,lc:4960.2,d:'High-stakes criminal enterprise'},
    {id:'DU12',n:'Run the Hawala Network',e:8,c:5760,x:106,lc:5760.2,d:'High-stakes criminal enterprise'}
  ]},
  {tier:'III. Gulf Power',jobs:[
    {id:'DU13',n:'Take Over the Free Zone',e:12,c:12600,x:240,lc:12600.2,d:'High-stakes criminal enterprise'},
    {id:'DU14',n:'Control the Oil Tanker Routes',e:13,c:14400,x:270,lc:14400.2,d:'High-stakes criminal enterprise'},
    {id:'DU15',n:'Run the Diamond Pipeline',e:12,c:13500,x:255,lc:13500.2,li:'uncut_diamonds',d:'High-stakes criminal enterprise'},
    {id:'DU16',n:'Own the Emirates Airline Board',e:13,c:14850,x:277,lc:14850.2,d:'High-stakes criminal enterprise'},
    {id:'DU17',n:'Infiltrate the Royal Guard',e:14,c:16200,x:300,lc:16200.2,d:'High-stakes criminal enterprise'},
    {id:'DU18',n:'Control the Crypto Exchange',e:12,c:13050,x:247,lc:13050.2,li:'crypto_wallet',d:'High-stakes criminal enterprise'}
  ]},
  {tier:'IV. Gulf Emperor',jobs:[
    {id:'DU19',n:'Own the OPEC Decision Makers',e:19,c:23400,x:420,lc:23400.2,d:'High-stakes criminal enterprise'},
    {id:'DU20',n:'Control the Suez Canal',e:20,c:27000,x:465,lc:27000.2,d:'High-stakes criminal enterprise'},
    {id:'DU21',n:'Run the Global Gold Trade',e:19,c:25200,x:435,lc:25200.2,li:'gold_bar',d:'High-stakes criminal enterprise'},
    {id:'DU22',n:'Take Over the Sovereign Wealth Fund',e:21,c:32300,x:578,lc:32300.2,li:'offshore_account',d:'High-stakes criminal enterprise'},
    {id:'DU23',n:'Own the Arms Trade to Africa',e:20,c:28800,x:480,lc:28800.2,d:'High-stakes criminal enterprise'}
  ]},
  {tier:'V. Sultan of Crime',jobs:[
    {id:'DU24',n:'Unite the Gulf Cartels',e:28,c:42750,x:663,lc:42750.2,d:'High-stakes criminal enterprise'},
    {id:'DU25',n:'Own the Middle East',e:32,c:55100,x:782,lc:55100.2,d:'High-stakes criminal enterprise'},
    {id:'DU26',n:'Control Global Oil Prices',e:35,c:64600,x:867,lc:64600.2,d:'High-stakes criminal enterprise'},
    {id:'DU27',n:'The Sheikh Legacy',e:38,c:76000,x:935,lc:76000.2,d:'High-stakes criminal enterprise'},
    {id:'DU28',n:'Desert Empire',e:40,c:85500,x:1020,lc:85500.2,li:'world_don_crown',d:'High-stakes criminal enterprise'}
  ]},
],
istanbul:[
  {tier:'I. Bosphorus',jobs:[
    {id:'IS01',n:'Sell Fake Antiquities',e:2,c:1320,x:18,lc:1320.057,d:'High-stakes criminal enterprise'},
    {id:'IS02',n:'Run the Carpet Scam',e:2,c:1200,x:17,lc:1200.073,d:'High-stakes criminal enterprise'},
    {id:'IS03',n:'Smuggle Through the Bazaar',e:3,c:1819,x:30,lc:1819.09,d:'High-stakes criminal enterprise'},
    {id:'IS04',n:'Extort the Ferry Operators',e:3,c:1680,x:29,lc:1680.107,d:'High-stakes criminal enterprise'},
    {id:'IS05',n:'Run Underground Gambling',e:3,c:1750,x:29,lc:1750.123,d:'High-stakes criminal enterprise'},
    {id:'IS06',n:'Pickpocket in Sultanahmet',e:2,c:1260,x:18,lc:1260.14,d:'High-stakes criminal enterprise'}
  ]},
  {tier:'II. Turkish Syndicate',jobs:[
    {id:'IS07',n:'Control the Heroin Route',e:7,c:5200,x:99,lc:5200.157,d:'High-stakes criminal enterprise'},
    {id:'IS08',n:'Run the Bosphorus Smuggling',e:8,c:6000,x:111,lc:6000.173,d:'High-stakes criminal enterprise'},
    {id:'IS09',n:'Extort the Grand Bazaar',e:7,c:5440,x:102,lc:5440.19,li:'ottoman_blade',d:'High-stakes criminal enterprise'},
    {id:'IS10',n:'Bribe the Jandarma',e:8,c:5760,x:106,lc:5760.2,d:'High-stakes criminal enterprise'},
    {id:'IS11',n:'Control the Migrant Pipeline',e:7,c:4960,x:96,lc:4960.2,d:'High-stakes criminal enterprise'},
    {id:'IS12',n:'Run the Counterfeit Goods Trade',e:8,c:6240,x:114,lc:6240.2,d:'High-stakes criminal enterprise'}
  ]},
  {tier:'III. Ottoman Power',jobs:[
    {id:'IS13',n:'Take Over the Strait Traffic',e:12,c:13500,x:255,lc:13500.2,d:'High-stakes criminal enterprise'},
    {id:'IS14',n:'Control the Arms to Syria',e:13,c:15300,x:285,lc:15300.2,li:'ak47',d:'High-stakes criminal enterprise'},
    {id:'IS15',n:'Run the Kurdish Smuggling Route',e:12,c:13950,x:262,lc:13950.2,d:'High-stakes criminal enterprise'},
    {id:'IS16',n:'Own the Turkish Military Contracts',e:13,c:15750,x:292,lc:15750.2,d:'High-stakes criminal enterprise'},
    {id:'IS17',n:'Infiltrate MIT Intelligence',e:14,c:17100,x:315,lc:17100.2,li:'fbi_badge',d:'High-stakes criminal enterprise'},
    {id:'IS18',n:'Control the Refugee Trade',e:12,c:14400,x:270,lc:14400.2,d:'High-stakes criminal enterprise'}
  ]},
  {tier:'IV. Pasha',jobs:[
    {id:'IS19',n:'Control the Mediterranean Drug Routes',e:20,c:27000,x:465,lc:27000.2,d:'High-stakes criminal enterprise'},
    {id:'IS20',n:'Own the Bosphorus',e:21,c:32300,x:578,lc:32300.2,d:'High-stakes criminal enterprise'},
    {id:'IS21',n:'Run the Central Asian Pipeline',e:20,c:28800,x:480,lc:28800.2,d:'High-stakes criminal enterprise'},
    {id:'IS22',n:'Take Over Turkish Politics',e:22,c:36100,x:629,lc:36100.2,li:'compromising_photos',d:'High-stakes criminal enterprise'},
    {id:'IS23',n:'Control the Black Sea Trade',e:21,c:34200,x:595,lc:34200.2,d:'High-stakes criminal enterprise'}
  ]},
  {tier:'V. Sultan',jobs:[
    {id:'IS24',n:'Unite the Silk Road Cartels',e:28,c:45600,x:680,lc:45600.2,d:'High-stakes criminal enterprise'},
    {id:'IS25',n:'Own the Crossroads of Empires',e:32,c:57000,x:799,lc:57000.2,d:'High-stakes criminal enterprise'},
    {id:'IS26',n:'Control Europe to Asia Trade',e:35,c:66500,x:884,lc:66500.2,d:'High-stakes criminal enterprise'},
    {id:'IS27',n:'The Ottoman Legacy',e:38,c:77900,x:969,lc:77900.2,d:'High-stakes criminal enterprise'},
    {id:'IS28',n:'Eurasian Empire',e:40,c:90250,x:1062,lc:90250.2,li:'world_don_crown',d:'High-stakes criminal enterprise'}
  ]},
],
bangkok:[
  {tier:'I. Golden Triangle',jobs:[
    {id:'BK01',n:'Run a Ping Pong Show Scam',e:2,c:1440,x:19,lc:1440.057,d:'High-stakes criminal enterprise'},
    {id:'BK02',n:'Sell Fake Gems to Tourists',e:2,c:1320,x:18,lc:1320.073,d:'High-stakes criminal enterprise'},
    {id:'BK03',n:'Control the Tuk-Tuk Mafia',e:3,c:1959,x:32,lc:1959.09,d:'High-stakes criminal enterprise'},
    {id:'BK04',n:'Smuggle Through the Mekong',e:3,c:2100,x:33,lc:2100.107,d:'High-stakes criminal enterprise'},
    {id:'BK05',n:'Deal in Khao San Road',e:2,c:1500,x:20,lc:1500.123,d:'High-stakes criminal enterprise'},
    {id:'BK06',n:'Run a Muay Thai Fixing Ring',e:3,c:1889,x:31,lc:1889.14,d:'High-stakes criminal enterprise'}
  ]},
  {tier:'II. Thai Syndicate',jobs:[
    {id:'BK07',n:'Control the Meth Labs',e:7,c:5600,x:105,lc:5600.157,d:'High-stakes criminal enterprise'},
    {id:'BK08',n:'Run the Sex Tourism Industry',e:7,c:6000,x:111,lc:6000.173,d:'High-stakes criminal enterprise'},
    {id:'BK09',n:'Smuggle Gems from Myanmar',e:8,c:6400,x:117,lc:6400.19,li:'uncut_diamonds',d:'High-stakes criminal enterprise'},
    {id:'BK10',n:'Extort the Night Market Empire',e:7,c:5760,x:108,lc:5760.2,d:'High-stakes criminal enterprise'},
    {id:'BK11',n:'Bribe the Royal Thai Police',e:8,c:6800,x:123,lc:6800.2,li:'fbi_badge',d:'High-stakes criminal enterprise'},
    {id:'BK12',n:'Control the Fishing Slave Trade',e:8,c:6240,x:114,lc:6240.2,d:'High-stakes criminal enterprise'}
  ]},
  {tier:'III. Southeast Asian Power',jobs:[
    {id:'BK13',n:'Take Over the Drug Triangle',e:12,c:14400,x:270,lc:14400.2,d:'High-stakes criminal enterprise'},
    {id:'BK14',n:'Control the Mekong Smuggling Route',e:13,c:16200,x:300,lc:16200.2,d:'High-stakes criminal enterprise'},
    {id:'BK15',n:'Run the ASEAN Crime Network',e:12,c:14850,x:277,lc:14850.2,li:'drug_lord_crown',d:'High-stakes criminal enterprise'},
    {id:'BK16',n:'Own the Thai Military Contracts',e:13,c:15750,x:292,lc:15750.2,d:'High-stakes criminal enterprise'},
    {id:'BK17',n:'Infiltrate the Palace Guard',e:14,c:18000,x:330,lc:18000.2,d:'High-stakes criminal enterprise'},
    {id:'BK18',n:'Control the Migrant Worker Trade',e:12,c:15300,x:285,lc:15300.2,d:'High-stakes criminal enterprise'}
  ]},
  {tier:'IV. Dragon of the East',jobs:[
    {id:'BK19',n:'Control All of Southeast Asia',e:20,c:28800,x:495,lc:28800.2,d:'High-stakes criminal enterprise'},
    {id:'BK20',n:'Own the Opium Trade',e:21,c:34200,x:612,lc:34200.2,li:'drug_lord_crown',d:'High-stakes criminal enterprise'},
    {id:'BK21',n:'Run the Pacific Smuggling Routes',e:20,c:30600,x:510,lc:30600.2,d:'High-stakes criminal enterprise'},
    {id:'BK22',n:'Take Over the Thai Government',e:22,c:38000,x:663,lc:38000.2,d:'High-stakes criminal enterprise'},
    {id:'BK23',n:'Control the Golden Triangle',e:21,c:36100,x:629,lc:36100.2,d:'High-stakes criminal enterprise'}
  ]},
  {tier:'V. King of the East',jobs:[
    {id:'BK24',n:'Unite the Asian Cartels',e:28,c:47500,x:714,lc:47500.2,d:'High-stakes criminal enterprise'},
    {id:'BK25',n:'Own Southeast Asia',e:32,c:60800,x:833,lc:60800.2,d:'High-stakes criminal enterprise'},
    {id:'BK26',n:'Control the Pacific Drug Routes',e:35,c:71250,x:918,lc:71250.2,d:'High-stakes criminal enterprise'},
    {id:'BK27',n:'The Dragon Legacy',e:38,c:83600,x:1003,lc:83600.2,d:'High-stakes criminal enterprise'},
    {id:'BK28',n:'Asian Empire',e:40,c:95000,x:1105,lc:95000.2,d:'High-stakes criminal enterprise'}
  ]},
],
hong_kong:[
  {tier:'I. Triad',jobs:[
    {id:'HK01',n:'Run a Counterfeit Electronics Ring',e:2,c:1680,x:21,lc:1680.057,d:'High-stakes criminal enterprise'},
    {id:'HK02',n:'Extort the Night Markets',e:3,c:2240,x:36,lc:2240.073,d:'High-stakes criminal enterprise'},
    {id:'HK03',n:'Smuggle Through Victoria Harbor',e:3,c:2450,x:38,lc:2450.09,d:'High-stakes criminal enterprise'},
    {id:'HK04',n:'Run Underground Mahjong Parlors',e:2,c:1560,x:20,lc:1560.107,d:'High-stakes criminal enterprise'},
    {id:'HK05',n:'Sell Fake Luxury Watches',e:2,c:1500,x:19,lc:1500.123,d:'High-stakes criminal enterprise'},
    {id:'HK06',n:'Control the Taxi Fleet',e:3,c:2100,x:34,lc:2100.14,d:'High-stakes criminal enterprise'}
  ]},
  {tier:'II. Dragon Head',jobs:[
    {id:'HK07',n:'Control the Heroin Pipeline',e:8,c:6400,x:117,lc:6400.157,d:'High-stakes criminal enterprise'},
    {id:'HK08',n:'Run the Money Laundering Network',e:8,c:6800,x:123,lc:6800.173,d:'High-stakes criminal enterprise'},
    {id:'HK09',n:'Extort the Banking Sector',e:9,c:7600,x:135,lc:7600.19,li:'offshore_account',d:'High-stakes criminal enterprise'},
    {id:'HK10',n:'Smuggle Through Macau Casinos',e:8,c:6560,x:120,lc:6560.2,d:'High-stakes criminal enterprise'},
    {id:'HK11',n:'Bribe the HKPF',e:9,c:7200,x:129,lc:7200.2,li:'fbi_badge',d:'High-stakes criminal enterprise'},
    {id:'HK12',n:'Control the Container Port',e:8,c:7040,x:126,lc:7040.2,d:'High-stakes criminal enterprise'}
  ]},
  {tier:'III. Triad Master',jobs:[
    {id:'HK13',n:'Take Over Kowloon',e:13,c:16200,x:300,lc:16200.2,d:'High-stakes criminal enterprise'},
    {id:'HK14',n:'Control the South China Sea Routes',e:14,c:18000,x:330,lc:18000.2,d:'High-stakes criminal enterprise'},
    {id:'HK15',n:'Run the Asian Drug Distribution',e:13,c:17100,x:315,lc:17100.2,li:'drug_lord_crown',d:'High-stakes criminal enterprise'},
    {id:'HK16',n:'Own the Macau Casino Empire',e:14,c:18900,x:345,lc:18900.2,d:'High-stakes criminal enterprise'},
    {id:'HK17',n:'Infiltrate Chinese Intelligence',e:15,c:20700,x:375,lc:20700.2,li:'fbi_badge',d:'High-stakes criminal enterprise'},
    {id:'HK18',n:'Control the Tech Smuggling',e:13,c:16650,x:307,lc:16650.2,li:'hacking_rig',d:'High-stakes criminal enterprise'}
  ]},
  {tier:'IV. Shan Chu',jobs:[
    {id:'HK19',n:'Control All Chinese Triads',e:21,c:34200,x:612,lc:34200.2,d:'High-stakes criminal enterprise'},
    {id:'HK20',n:'Own the Pearl River Delta',e:22,c:38000,x:663,lc:38000.2,d:'High-stakes criminal enterprise'},
    {id:'HK21',n:'Run the Fentanyl Precursor Trade',e:21,c:36100,x:629,lc:36100.2,d:'High-stakes criminal enterprise'},
    {id:'HK22',n:'Take Over the Stock Exchange',e:23,c:41800,x:714,lc:41800.2,li:'offshore_account',d:'High-stakes criminal enterprise'},
    {id:'HK23',n:'Control the Belt and Road Corruption',e:22,c:39900,x:680,lc:39900.2,d:'High-stakes criminal enterprise'}
  ]},
  {tier:'V. Dragon Emperor',jobs:[
    {id:'HK24',n:'Unite All Asian Syndicates',e:30,c:53200,x:782,lc:53200.2,d:'High-stakes criminal enterprise'},
    {id:'HK25',n:'Own the Pacific Rim',e:34,c:66500,x:901,lc:66500.2,d:'High-stakes criminal enterprise'},
    {id:'HK26',n:'Control the Global Supply Chain',e:36,c:76000,x:969,lc:76000.2,d:'High-stakes criminal enterprise'},
    {id:'HK27',n:'The Triad Legacy',e:38,c:85500,x:1037,lc:85500.2,li:'dragon_seal',d:'High-stakes criminal enterprise'},
    {id:'HK28',n:'Eastern Empire',e:40,c:99750,x:1147,lc:99750.2,d:'High-stakes criminal enterprise'}
  ]},
],
tokyo:[
  {tier:'I. Yakuza Initiate',jobs:[
    {id:'TO01',n:'Run Pachinko Parlor Skims',e:2,c:1800,x:23,lc:1800.057,d:'High-stakes criminal enterprise'},
    {id:'TO02',n:'Extort the Shinjuku Bars',e:3,c:2450,x:39,lc:2450.073,d:'High-stakes criminal enterprise'},
    {id:'TO03',n:'Sell Fake Electronics in Akihabara',e:2,c:1680,x:22,lc:1680.09,d:'High-stakes criminal enterprise'},
    {id:'TO04',n:'Run an Illegal Host Club',e:3,c:2240,x:36,lc:2240.107,d:'High-stakes criminal enterprise'},
    {id:'TO05',n:'Shake Down the Fish Market',e:3,c:2380,x:38,lc:2380.123,d:'High-stakes criminal enterprise'},
    {id:'TO06',n:'Collect Debts in Kabukicho',e:2,c:1740,x:22,lc:1740.14,d:'High-stakes criminal enterprise'}
  ]},
  {tier:'II. Yakuza Soldier',jobs:[
    {id:'TO07',n:'Control the Akihabara Electronics Racket',e:8,c:7200,x:129,lc:7200.157,d:'High-stakes criminal enterprise'},
    {id:'TO08',n:'Run the Underground Fight Circuit',e:8,c:7600,x:135,lc:7600.173,d:'High-stakes criminal enterprise'},
    {id:'TO09',n:'Extort the Construction Industry',e:9,c:8000,x:144,lc:8000.19,d:'High-stakes criminal enterprise'},
    {id:'TO10',n:'Smuggle Through Yokohama Port',e:9,c:8400,x:150,lc:8400.2,d:'High-stakes criminal enterprise'},
    {id:'TO11',n:'Bribe the Tokyo Metropolitan Police',e:10,c:8800,x:156,lc:8800.2,li:'fbi_badge',d:'High-stakes criminal enterprise'},
    {id:'TO12',n:'Control the Gambling Dens',e:8,c:7360,x:132,lc:7360.2,li:'katana',d:'High-stakes criminal enterprise'}
  ]},
  {tier:'III. Wakagashira',jobs:[
    {id:'TO13',n:'Take Over the Keiretsu',e:14,c:19800,x:360,lc:19800.2,d:'High-stakes criminal enterprise'},
    {id:'TO14',n:'Control the Drug Distribution',e:14,c:20700,x:375,lc:20700.2,li:'drug_lord_crown',d:'High-stakes criminal enterprise'},
    {id:'TO15',n:'Run the Real Estate Yakuza',e:13,c:18000,x:330,lc:18000.2,d:'High-stakes criminal enterprise'},
    {id:'TO16',n:'Own the Entertainment Industry',e:13,c:18900,x:345,lc:18900.2,li:'entertainer_contract',d:'High-stakes criminal enterprise'},
    {id:'TO17',n:'Infiltrate the NPA',e:15,c:22500,x:405,lc:22500.2,li:'fbi_badge',d:'High-stakes criminal enterprise'},
    {id:'TO18',n:'Control the Tech Underground',e:14,c:20250,x:367,lc:20250.2,li:'hacking_rig',d:'High-stakes criminal enterprise'}
  ]},
  {tier:'IV. Kumicho',jobs:[
    {id:'TO19',n:'Own the Yamaguchi-gumi',e:22,c:38000,x:663,lc:38000.2,d:'High-stakes criminal enterprise'},
    {id:'TO20',n:'Control All Japanese Crime',e:23,c:41800,x:714,lc:41800.2,d:'High-stakes criminal enterprise'},
    {id:'TO21',n:'Run the Pacific Heroin Route',e:22,c:39900,x:680,lc:39900.2,d:'High-stakes criminal enterprise'},
    {id:'TO22',n:'Bribe the LDP Leadership',e:24,c:45600,x:765,lc:45600.2,li:'compromising_photos',d:'High-stakes criminal enterprise'},
    {id:'TO23',n:'Take Over the Bank of Japan',e:23,c:43700,x:731,lc:43700.2,li:'offshore_account',d:'High-stakes criminal enterprise'}
  ]},
  {tier:'V. Shogun of Crime',jobs:[
    {id:'TO24',n:'Unite All Yakuza Families',e:30,c:55100,x:799,lc:55100.2,li:'yakuza_tattoo_scroll',d:'High-stakes criminal enterprise'},
    {id:'TO25',n:'Own Japan',e:34,c:68400,x:918,lc:68400.2,d:'High-stakes criminal enterprise'},
    {id:'TO26',n:'Control the Pacific Crime Network',e:36,c:77900,x:986,lc:77900.2,d:'High-stakes criminal enterprise'},
    {id:'TO27',n:'The Yakuza Legacy',e:38,c:89300,x:1071,lc:89300.2,li:'samurai_sword',d:'High-stakes criminal enterprise'},
    {id:'TO28',n:'Eastern Shogunate',e:40,c:104500,x:1190,lc:104500.2,d:'High-stakes criminal enterprise'}
  ]},
],
brazil:[
  {tier:'I. Favela',jobs:[
    {id:'BR01',n:'Run Drugs in Rocinha',e:2,c:1920,x:24,lc:1920.057,d:'High-stakes criminal enterprise'},
    {id:'BR02',n:'Control a Favela Block',e:3,c:2660,x:41,lc:2660.073,d:'High-stakes criminal enterprise'},
    {id:'BR03',n:'Rob Tourists in Copacabana',e:2,c:1800,x:23,lc:1800.09,d:'High-stakes criminal enterprise'},
    {id:'BR04',n:'Extort the Taxi Drivers',e:2,c:1680,x:22,lc:1680.107,d:'High-stakes criminal enterprise'},
    {id:'BR05',n:'Run Underground Samba Clubs',e:3,c:2450,x:39,lc:2450.123,d:'High-stakes criminal enterprise'},
    {id:'BR06',n:'Sell Stolen Electronics',e:3,c:2520,x:40,lc:2520.14,d:'High-stakes criminal enterprise'}
  ]},
  {tier:'II. PCC Soldier',jobs:[
    {id:'BR07',n:'Control the Prison Drug Trade',e:8,c:8000,x:144,lc:8000.157,d:'High-stakes criminal enterprise'},
    {id:'BR08',n:'Run the Cocaine Export',e:9,c:8800,x:156,lc:8800.173,d:'High-stakes criminal enterprise'},
    {id:'BR09',n:'Extort the Construction Firms',e:8,c:8400,x:150,lc:8400.19,d:'High-stakes criminal enterprise'},
    {id:'BR10',n:'Smuggle Through Santos Port',e:9,c:9200,x:162,lc:9200.2,d:'High-stakes criminal enterprise'},
    {id:'BR11',n:'Bribe the Policia Civil',e:9,c:8960,x:159,lc:8960.2,li:'fbi_badge',d:'High-stakes criminal enterprise'},
    {id:'BR12',n:'Run the Numbers Game',e:8,c:7840,x:141,lc:7840.2,d:'High-stakes criminal enterprise'}
  ]},
  {tier:'III. PCC Captain',jobs:[
    {id:'BR13',n:'Take Over the Amazon Drug Route',e:14,c:20700,x:375,lc:20700.2,d:'High-stakes criminal enterprise'},
    {id:'BR14',n:'Control the Mining Operations',e:14,c:21600,x:390,lc:21600.2,li:'gold_bar',d:'High-stakes criminal enterprise'},
    {id:'BR15',n:'Run the Arms Trade to Africa',e:15,c:23400,x:420,lc:23400.2,li:'ak47',d:'High-stakes criminal enterprise'},
    {id:'BR16',n:'Own the Carnival Revenue',e:13,c:18900,x:345,lc:18900.2,li:'entertainer_contract',d:'High-stakes criminal enterprise'},
    {id:'BR17',n:'Infiltrate the Federal Police',e:15,c:24300,x:435,lc:24300.2,li:'fbi_badge',d:'High-stakes criminal enterprise'},
    {id:'BR18',n:'Control the Deforestation Mafia',e:14,c:22500,x:405,lc:22500.2,d:'High-stakes criminal enterprise'}
  ]},
  {tier:'IV. Primeiro Comando',jobs:[
    {id:'BR19',n:'Control All Brazilian Prisons',e:22,c:39900,x:680,lc:39900.2,d:'High-stakes criminal enterprise'},
    {id:'BR20',n:'Own the Amazon',e:23,c:43700,x:731,lc:43700.2,d:'High-stakes criminal enterprise'},
    {id:'BR21',n:'Run the South American Drug Trade',e:22,c:41800,x:697,lc:41800.2,li:'drug_lord_crown',d:'High-stakes criminal enterprise'},
    {id:'BR22',n:'Take Over Petrobras',e:24,c:47500,x:782,lc:47500.2,li:'offshore_account',d:'High-stakes criminal enterprise'},
    {id:'BR23',n:'Control the Soybean Mafia',e:23,c:45600,x:748,lc:45600.2,d:'High-stakes criminal enterprise'}
  ]},
  {tier:'V. King of Brazil',jobs:[
    {id:'BR24',n:'Unite South American Cartels',e:30,c:57000,x:816,lc:57000.2,d:'High-stakes criminal enterprise'},
    {id:'BR25',n:'Own the Continent',e:34,c:70300,x:935,lc:70300.2,d:'High-stakes criminal enterprise'},
    {id:'BR26',n:'Control the Atlantic Trade Routes',e:36,c:79800,x:1003,lc:79800.2,d:'High-stakes criminal enterprise'},
    {id:'BR27',n:'The PCC Legacy',e:38,c:91200,x:1088,lc:91200.2,li:'pcc_crown',d:'High-stakes criminal enterprise'},
    {id:'BR28',n:'South American Empire',e:40,c:106400,x:1207,lc:106400.2,d:'High-stakes criminal enterprise'}
  ]},
],
nairobi:[
  {tier:'I. East Africa',jobs:[
    {id:'NA01',n:'Run a Matatu Protection Racket',e:2,c:2100,x:26,lc:2100.057,d:'High-stakes criminal enterprise'},
    {id:'NA02',n:'Sell Fake Medicines',e:2,c:1920,x:24,lc:1920.073,d:'High-stakes criminal enterprise'},
    {id:'NA03',n:'Smuggle Ivory',e:3,c:2800,x:42,lc:2800.09,d:'High-stakes criminal enterprise'},
    {id:'NA04',n:'Extort the Market Vendors',e:2,c:1800,x:23,lc:1800.107,d:'High-stakes criminal enterprise'},
    {id:'NA05',n:'Run an M-Pesa Fraud Ring',e:3,c:2660,x:41,lc:2660.123,d:'High-stakes criminal enterprise'},
    {id:'NA06',n:'Control the Charcoal Mafia',e:3,c:2520,x:40,lc:2520.14,d:'High-stakes criminal enterprise'}
  ]},
  {tier:'II. East African Syndicate',jobs:[
    {id:'NA07',n:'Control the Somali Piracy Network',e:8,c:8400,x:150,lc:8400.157,d:'High-stakes criminal enterprise'},
    {id:'NA08',n:'Run the Miraa Trade',e:8,c:8000,x:144,lc:8000.173,d:'High-stakes criminal enterprise'},
    {id:'NA09',n:'Smuggle Weapons from Libya',e:9,c:9600,x:168,lc:9600.19,li:'ak47',d:'High-stakes criminal enterprise'},
    {id:'NA10',n:'Extort the Safari Industry',e:8,c:8800,x:156,lc:8800.2,d:'High-stakes criminal enterprise'},
    {id:'NA11',n:'Bribe the Kenyan Military',e:9,c:10000,x:174,lc:10000.2,li:'fbi_badge',d:'High-stakes criminal enterprise'},
    {id:'NA12',n:'Control the Refugee Camp Rackets',e:9,c:9200,x:162,lc:9200.2,d:'High-stakes criminal enterprise'}
  ]},
  {tier:'III. African Power',jobs:[
    {id:'NA13',n:'Take Over the Congo Mining',e:14,c:22500,x:405,lc:22500.2,li:'uncut_diamonds',d:'High-stakes criminal enterprise'},
    {id:'NA14',n:'Control the Sahel Drug Route',e:15,c:25200,x:450,lc:25200.2,d:'High-stakes criminal enterprise'},
    {id:'NA15',n:'Run the Blood Diamond Trade',e:14,c:23400,x:420,lc:23400.2,li:'uncut_diamonds',d:'High-stakes criminal enterprise'},
    {id:'NA16',n:'Own the Ethiopian Coffee Export',e:14,c:21600,x:390,lc:21600.2,d:'High-stakes criminal enterprise'},
    {id:'NA17',n:'Infiltrate the African Union',e:15,c:26100,x:465,lc:26100.2,li:'fbi_badge',d:'High-stakes criminal enterprise'},
    {id:'NA18',n:'Control the Coltan Supply',e:14,c:24300,x:435,lc:24300.2,d:'High-stakes criminal enterprise'}
  ]},
  {tier:'IV. Warlord',jobs:[
    {id:'NA19',n:'Control East Africa',e:23,c:45600,x:748,lc:45600.2,d:'High-stakes criminal enterprise'},
    {id:'NA20',n:'Own the Indian Ocean Trade',e:24,c:49400,x:799,lc:49400.2,d:'High-stakes criminal enterprise'},
    {id:'NA21',n:'Run the Arms to Conflict Zones',e:23,c:47500,x:765,lc:47500.2,d:'High-stakes criminal enterprise'},
    {id:'NA22',n:'Take Over the Oil of South Sudan',e:25,c:53200,x:850,lc:53200.2,li:'offshore_account',d:'High-stakes criminal enterprise'},
    {id:'NA23',n:'Control the Migration Routes',e:24,c:51300,x:816,lc:51300.2,d:'High-stakes criminal enterprise'}
  ]},
  {tier:'V. King of Africa',jobs:[
    {id:'NA24',n:'Unite the African Syndicates',e:32,c:64600,x:901,lc:64600.2,d:'High-stakes criminal enterprise'},
    {id:'NA25',n:'Own the Continent',e:36,c:77900,x:1003,lc:77900.2,d:'High-stakes criminal enterprise'},
    {id:'NA26',n:'Control African Resources',e:38,c:89300,x:1088,lc:89300.2,d:'High-stakes criminal enterprise'},
    {id:'NA27',n:'The Warlord Legacy',e:40,c:102600,x:1173,lc:102600.2,d:'High-stakes criminal enterprise'},
    {id:'NA28',n:'African Empire',e:42,c:114000,x:1275,lc:114000.2,li:'world_don_crown',d:'High-stakes criminal enterprise'}
  ]},
],
singapore:[
  {tier:'I. Tiger City',jobs:[
    {id:'SI01',n:'Run the Clean Money Corridor',e:3,c:2800,x:42,lc:2800.057,d:'High-stakes criminal enterprise'},
    {id:'SI02',n:'Hack the Banking Network',e:3,c:2940,x:44,lc:2940.073,li:'hacking_rig',d:'High-stakes criminal enterprise'},
    {id:'SI03',n:'Smuggle Through the Strait',e:3,c:3150,x:45,lc:3150.09,d:'High-stakes criminal enterprise'},
    {id:'SI04',n:'Run a Crypto Scam',e:2,c:2100,x:26,lc:2100.107,d:'High-stakes criminal enterprise'},
    {id:'SI05',n:'Extort the Ship Operators',e:3,c:2660,x:41,lc:2660.123,d:'High-stakes criminal enterprise'},
    {id:'SI06',n:'Control the Dark Web Marketplace',e:3,c:2870,x:43,lc:2870.14,li:'crypto_wallet',d:'High-stakes criminal enterprise'}
  ]},
  {tier:'II. Asian Finance Syndicate',jobs:[
    {id:'SI07',n:'Control Shipping Through Malacca',e:9,c:9600,x:168,lc:9600.157,d:'High-stakes criminal enterprise'},
    {id:'SI08',n:'Run the ASEAN Dark Finance',e:9,c:10000,x:174,lc:10000.173,d:'High-stakes criminal enterprise'},
    {id:'SI09',n:'Extort the Semiconductor Trade',e:10,c:10800,x:186,lc:10800.19,d:'High-stakes criminal enterprise'},
    {id:'SI10',n:'Launder Through Crypto Exchanges',e:9,c:10400,x:180,lc:10400.2,li:'crypto_wallet',d:'High-stakes criminal enterprise'},
    {id:'SI11',n:'Bribe the Singapore Police Force',e:10,c:11200,x:192,lc:11200.2,li:'fbi_badge',d:'High-stakes criminal enterprise'},
    {id:'SI12',n:'Control the Casino Revenue',e:9,c:10240,x:177,lc:10240.2,d:'High-stakes criminal enterprise'}
  ]},
  {tier:'III. Pacific Master',jobs:[
    {id:'SI13',n:'Take Over the Pacific Shipping Routes',e:15,c:25200,x:450,lc:25200.2,d:'High-stakes criminal enterprise'},
    {id:'SI14',n:'Control the Asian Drug Finance',e:15,c:26100,x:465,lc:26100.2,d:'High-stakes criminal enterprise'},
    {id:'SI15',n:'Run the Cyber Warfare Network',e:16,c:28800,x:510,lc:28800.2,li:'hacking_rig',d:'High-stakes criminal enterprise'},
    {id:'SI16',n:'Own the Tech Company Fronts',e:15,c:27000,x:480,lc:27000.2,d:'High-stakes criminal enterprise'},
    {id:'SI17',n:'Infiltrate the ISA',e:16,c:29700,x:525,lc:29700.2,li:'fbi_badge',d:'High-stakes criminal enterprise'},
    {id:'SI18',n:'Control the Rare Earth Trade',e:15,c:27900,x:495,lc:27900.2,d:'High-stakes criminal enterprise'}
  ]},
  {tier:'IV. Pacific Emperor',jobs:[
    {id:'SI19',n:'Control the ASEAN Economy',e:24,c:51300,x:816,lc:51300.2,d:'High-stakes criminal enterprise'},
    {id:'SI20',n:'Own the Pacific Banking',e:25,c:55100,x:867,lc:55100.2,d:'High-stakes criminal enterprise'},
    {id:'SI21',n:'Run the Global Cyber Crime',e:24,c:53200,x:833,lc:53200.2,li:'hacking_rig',d:'High-stakes criminal enterprise'},
    {id:'SI22',n:'Take Over the Sovereign Wealth Funds',e:26,c:58900,x:918,lc:58900.2,li:'offshore_account',d:'High-stakes criminal enterprise'},
    {id:'SI23',n:'Control the Strait of Malacca',e:25,c:57000,x:884,lc:57000.2,d:'High-stakes criminal enterprise'}
  ]},
  {tier:'V. Tiger Emperor',jobs:[
    {id:'SI24',n:'Own the Pacific Rim Finance',e:34,c:74100,x:969,lc:74100.2,d:'High-stakes criminal enterprise'},
    {id:'SI25',n:'Control Global Shipping',e:38,c:87400,x:1071,lc:87400.2,d:'High-stakes criminal enterprise'},
    {id:'SI26',n:'The Lion City Legacy',e:40,c:100700,x:1173,lc:100700.2,d:'High-stakes criminal enterprise'},
    {id:'SI27',n:'Pacific Empire',e:42,c:114000,x:1275,lc:114000.2,d:'High-stakes criminal enterprise'},
    {id:'SI28',n:'Global Financial Emperor',e:45,c:133000,x:1445,lc:133000.2,li:'world_don_crown',d:'High-stakes criminal enterprise'}
  ]},
],
italy:[
  {tier:'I. Sicilian Streets',jobs:[
    {id:'IT01',n:'Run a Protection Racket in Palermo',e:2,c:2700,x:30,lc:2700.057,d:'High-stakes criminal enterprise'},
    {id:'IT02',n:'Sell Counterfeit Wine',e:2,c:2400,x:28,lc:2400.073,d:'High-stakes criminal enterprise'},
    {id:'IT03',n:'Extort the Fish Market',e:3,c:3500,x:49,lc:3500.09,d:'High-stakes criminal enterprise'},
    {id:'IT04',n:'Smuggle Through the Mediterranean',e:3,c:3639,x:51,lc:3639.107,d:'High-stakes criminal enterprise'},
    {id:'IT05',n:'Rob Tourist Villas',e:3,c:3360,x:48,lc:3360.123,d:'High-stakes criminal enterprise'},
    {id:'IT06',n:'Run Underground Gambling',e:2,c:2520,x:29,lc:2520.14,li:'renaissance_dagger',d:'High-stakes criminal enterprise'}
  ]},
  {tier:'II. Cosa Nostra',jobs:[
    {id:'IT07',n:'Control the Ndrangheta Pipeline',e:9,c:10400,x:180,lc:10400.157,d:'High-stakes criminal enterprise'},
    {id:'IT08',n:'Run the Vatican Bank Fraud',e:10,c:12000,x:204,lc:12000.173,li:'papal_signet',d:'High-stakes criminal enterprise'},
    {id:'IT09',n:'Extort the Fashion Industry',e:9,c:10800,x:186,lc:10800.19,d:'High-stakes criminal enterprise'},
    {id:'IT10',n:'Smuggle Antiquities',e:10,c:11600,x:198,lc:11600.2,li:'ancient_artifact',d:'High-stakes criminal enterprise'},
    {id:'IT11',n:'Bribe the Carabinieri',e:10,c:11200,x:192,lc:11200.2,li:'fbi_badge',d:'High-stakes criminal enterprise'},
    {id:'IT12',n:'Control the Olive Oil Mafia',e:9,c:10560,x:183,lc:10560.2,d:'High-stakes criminal enterprise'}
  ]},
  {tier:'III. Padrino',jobs:[
    {id:'IT13',n:'Take Over the Camorra',e:15,c:27000,x:480,lc:27000.2,d:'High-stakes criminal enterprise'},
    {id:'IT14',n:'Control the European Drug Route',e:16,c:30600,x:540,lc:30600.2,d:'High-stakes criminal enterprise'},
    {id:'IT15',n:'Run the Mediterranean Arms Trade',e:15,c:28800,x:510,lc:28800.2,li:'ak47',d:'High-stakes criminal enterprise'},
    {id:'IT16',n:'Own the Vatican Finances',e:16,c:31500,x:555,lc:31500.2,li:'papal_signet',d:'High-stakes criminal enterprise'},
    {id:'IT17',n:'Infiltrate the Italian Intelligence',e:16,c:29700,x:525,lc:29700.2,li:'fbi_badge',d:'High-stakes criminal enterprise'},
    {id:'IT18',n:'Control the Construction Mafia',e:15,c:27900,x:495,lc:27900.2,d:'High-stakes criminal enterprise'}
  ]},
  {tier:'IV. Capo di Tutti Capi',jobs:[
    {id:'IT19',n:'Control All Italian Mafia Families',e:25,c:55100,x:867,lc:55100.2,d:'High-stakes criminal enterprise'},
    {id:'IT20',n:'Own the Mediterranean',e:26,c:58900,x:918,lc:58900.2,d:'High-stakes criminal enterprise'},
    {id:'IT21',n:'Run the European Crime Network',e:25,c:57000,x:884,lc:57000.2,li:'don_ring',d:'High-stakes criminal enterprise'},
    {id:'IT22',n:'Take Over the European Banking',e:27,c:62700,x:969,lc:62700.2,li:'offshore_account',d:'High-stakes criminal enterprise'},
    {id:'IT23',n:'Control the Vatican',e:26,c:60800,x:935,lc:60800.2,li:'papal_signet',d:'High-stakes criminal enterprise'}
  ]},
  {tier:'V. Il Padrino Eterno',jobs:[
    {id:'IT24',n:'Unite All Mediterranean Families',e:35,c:77900,x:1020,lc:77900.2,d:'High-stakes criminal enterprise'},
    {id:'IT25',n:'Own Europe',e:38,c:91200,x:1122,lc:91200.2,d:'High-stakes criminal enterprise'},
    {id:'IT26',n:'Control the Global Mafia Network',e:40,c:104500,x:1224,lc:104500.2,d:'High-stakes criminal enterprise'},
    {id:'IT27',n:'The Corleone Legacy',e:42,c:118750,x:1326,lc:118750.2,li:'don_ring',d:'High-stakes criminal enterprise'},
    {id:'IT28',n:'Eternal Godfather',e:45,c:137750,x:1487,lc:137750.2,li:'world_don_crown',d:'High-stakes criminal enterprise'}
  ]},
],
};

// ══════════════════════════════════════════
// HITLIST TARGETS (expanded)
// ══════════════════════════════════════════
const HITLIST = [
  // ── TIER I: SMALL TIME ──
  {n:'Rat Tommy C.',b:1000,st:2,d:'Talked to the Feds',tier:'Street',ml:1,loot:null},
  {n:'Shoplifter Mike',b:1800,st:2,d:'Stealing from our businesses',tier:'Street',ml:1,loot:null},
  {n:'Dirty Cop McGee',b:3000,st:3,d:'Shaking down your businesses',tier:'Street',ml:3,loot:'pistol'},
  {n:'Joey Two-Times',b:4500,st:3,d:'Skimming from collections',tier:'Street',ml:5,loot:null},
  {n:'The Jackal',b:7000,st:4,d:'Rival assassin. Professional.',tier:'Street',ml:8,loot:'silenced_pistol'},
  // ── TIER II: MID-LEVEL ──
  {n:'Councilman Finney',b:12000,st:5,d:'Blocking your permits',tier:'Political',ml:10,loot:'compromising_photos'},
  {n:'Agent Rivera',b:20000,st:6,d:'Getting too close to the operation',tier:'Political',ml:12,loot:'fbi_badge'},
  {n:'Sergeant Kowalski',b:30000,st:7,d:'Honest cop. Biggest threat.',tier:'Political',ml:15,loot:null},
  {n:'Don Paulo Ricci',b:50000,st:8,d:'Ordered a hit on your underboss',tier:'Rival Don',ml:18,loot:'gold_watch'},
  {n:'The Viper',b:75000,st:9,d:'Poison specialist. Silent kills.',tier:'Rival Don',ml:20,loot:'assassination_kit'},
  // ── TIER III: HIGH VALUE ──
  {n:'Ghost Network Operative',b:120000,st:10,d:'Shadow org moving in on your territory',tier:'Intelligence',ml:25,loot:'hacking_rig'},
  {n:'Bratva Colonel Petrov',b:200000,st:12,d:'Russian intel contract. Moscow wants him gone.',tier:'Intelligence',ml:30,loot:'vor_crown'},
  {n:'Yakuza Enforcer Tanaka',b:350000,st:14,d:'East/West territory dispute',tier:'International',ml:40,loot:'katana'},
  {n:'CIA Black Site Operator',b:500000,st:16,d:'Too much knowledge. Too little loyalty.',tier:'Intelligence',ml:50,loot:'fbi_badge'},
  {n:'Cartel Supreme Don',b:800000,st:18,d:'Controls all supply south of the border',tier:'International',ml:60,loot:'drug_lord_crown'},
  // ── TIER IV: LEGENDARY TARGETS ──
  {n:'The Nameless One',b:1200000,st:20,d:'Nobody knows who hired you. Does it matter?',tier:'Legendary',ml:75,loot:'assassination_kit'},
  {n:'Prime Minister\'s Fixer',b:2000000,st:22,d:'Knows where every body is buried. Worldwide.',tier:'Legendary',ml:90,loot:'british_rifle'},
  {n:'The Immortal',b:3500000,st:24,d:'Been targeted 40 times. Still breathing.',tier:'Legendary',ml:100,loot:'golden_ak'},
  {n:'Shadow Council Chair',b:6000000,st:26,d:'Controls world leaders from behind a screen',tier:'Legendary',ml:150,loot:'crypto_wallet'},
  {n:'The Final Contract',b:15000000,st:30,d:'The most dangerous person alive. You included.',tier:'Legendary',ml:250,loot:'world_don_crown'},
];

// ══════════════════════════════════════════
// STORE ITEMS (weapons/armor/vehicles)
// ══════════════════════════════════════════
const STORE_TIERS=['I. Street Gear','II. Professional','III. Military Grade','IV. Experimental','V. Endgame'];
const STORE = [
  // ── TIER I: STREET GEAR ──
  {id:'brass_knuckles',n:'Brass Knuckles',t:'weapon',e:'👊',atk:2,def:0,c:500,tier:0,ml:1},
  {id:'switchblade',n:'Switchblade',t:'weapon',e:'🔪',atk:5,def:0,c:900,tier:0,ml:1},
  {id:'baseball_bat',n:'Aluminum Bat',t:'weapon',e:'⚾',atk:7,def:1,c:1500,tier:0,ml:1},
  {id:'crowbar',n:'Crowbar',t:'weapon',e:'🔩',atk:8,def:0,c:1200,tier:0,ml:1},
  {id:'pistol',n:'.45 Pistol',t:'weapon',e:'🔫',atk:12,def:0,c:3500,tier:0,ml:1},
  {id:'silenced_pistol',n:'Silenced Pistol',t:'weapon',e:'🔫',atk:15,def:0,c:6000,tier:0,ml:3},
  {id:'pepper_spray',n:'Pepper Spray',t:'weapon',e:'🌶️',atk:4,def:2,c:800,tier:0,ml:1},
  {id:'leather_jacket',n:'Leather Jacket',t:'armor',e:'🧥',atk:0,def:4,c:2000,tier:0,ml:1},
  {id:'stab_vest',n:'Stab Proof Vest',t:'armor',e:'🦺',atk:0,def:10,c:6000,tier:0,ml:1},
  {id:'motorcycle',n:'Harley Davidson',t:'vehicle',e:'🏍️',atk:8,def:3,c:12000,tier:0,ml:1},
  {id:'muscle_car',n:'Muscle Car',t:'vehicle',e:'🚗',atk:5,def:5,c:8000,tier:0,ml:1},
  // ── TIER II: PROFESSIONAL ──
  {id:'tommy_gun',n:'Tommy Gun',t:'weapon',e:'🔫',atk:22,def:1,c:10000,tier:1,ml:5},
  {id:'sawed_off',n:'Sawed-Off Shotgun',t:'weapon',e:'🔫',atk:28,def:0,c:15000,tier:1,ml:8},
  {id:'ak47',n:'AK-47',t:'weapon',e:'🔫',atk:35,def:2,c:22000,tier:1,ml:10},
  {id:'desert_eagle',n:'Desert Eagle',t:'weapon',e:'🔫',atk:40,def:1,c:28000,tier:1,ml:12},
  {id:'uzi',n:'Gold-Plated Uzi',t:'weapon',e:'🔫',atk:32,def:0,c:18000,tier:1,ml:8},
  {id:'combat_knife',n:'Combat Knife',t:'weapon',e:'🗡️',atk:18,def:3,c:8000,tier:1,ml:5},
  {id:'bulletproof_vest',n:'Bulletproof Vest',t:'armor',e:'🦺',atk:0,def:18,c:14000,tier:1,ml:5},
  {id:'tactical_vest',n:'Tactical Vest',t:'armor',e:'🦺',atk:2,def:30,c:35000,tier:1,ml:10},
  {id:'reinforced_helmet',n:'Reinforced Helmet',t:'armor',e:'⛑️',atk:0,def:14,c:12000,tier:1,ml:5},
  {id:'van',n:'Armored Van',t:'vehicle',e:'🚐',atk:3,def:18,c:25000,tier:1,ml:8},
  {id:'armored_suv',n:'Armored SUV',t:'vehicle',e:'🚙',atk:10,def:28,c:55000,tier:1,ml:12},
  {id:'speedboat',n:'Speedboat',t:'vehicle',e:'🚤',atk:14,def:10,c:70000,tier:1,ml:15},
  // ── TIER III: MILITARY GRADE ──
  {id:'sniper_rifle',n:'Sniper Rifle',t:'weapon',e:'🎯',atk:55,def:0,c:45000,tier:2,ml:18},
  {id:'mp5',n:'MP5 Submachine Gun',t:'weapon',e:'🔫',atk:60,def:3,c:55000,tier:2,ml:20},
  {id:'m4_carbine',n:'M4 Carbine',t:'weapon',e:'🔫',atk:70,def:4,c:75000,tier:2,ml:22},
  {id:'kalashnikov',n:'Kalashnikov Elite',t:'weapon',e:'🔫',atk:80,def:4,c:100000,tier:2,ml:25},
  {id:'grenade_launcher',n:'M203 Grenade Launcher',t:'weapon',e:'💥',atk:95,def:0,c:140000,tier:2,ml:28},
  {id:'riot_shield',n:'Riot Shield',t:'armor',e:'🛡️',atk:3,def:45,c:50000,tier:2,ml:18},
  {id:'kevlar_suit',n:'Full Kevlar Suit',t:'armor',e:'🥷',atk:0,def:50,c:80000,tier:2,ml:22},
  {id:'battle_armor',n:'Military Battle Armor',t:'armor',e:'🛡️',atk:5,def:80,c:180000,tier:2,ml:28},
  {id:'bomb_suit',n:'EOD Bomb Suit',t:'armor',e:'💣',atk:0,def:65,c:120000,tier:2,ml:25},
  {id:'helicopter',n:'Attack Helicopter',t:'vehicle',e:'🚁',atk:40,def:20,c:300000,tier:2,ml:30},
  {id:'armored_limo',n:'Armored Limousine',t:'vehicle',e:'🚗',atk:12,def:45,c:200000,tier:2,ml:25},
  {id:'submarine',n:'Private Submarine',t:'vehicle',e:'🌊',atk:30,def:60,c:800000,tier:2,ml:35},
  // ── TIER IV: EXPERIMENTAL ──
  {id:'minigun',n:'Minigun',t:'weapon',e:'🔫',atk:120,def:0,c:200000,tier:3,ml:40},
  {id:'rocket_launcher',n:'RPG-7',t:'weapon',e:'💥',atk:150,def:0,c:300000,tier:3,ml:45},
  {id:'rail_gun',n:'Experimental Rail Gun',t:'weapon',e:'⚡',atk:220,def:5,c:700000,tier:3,ml:55},
  {id:'laser_designator',n:'Laser Designator',t:'weapon',e:'📡',atk:180,def:0,c:450000,tier:3,ml:50},
  {id:'emp_cannon',n:'EMP Cannon',t:'weapon',e:'🔌',atk:160,def:10,c:350000,tier:3,ml:48},
  {id:'exo_frame',n:'Exoskeleton Frame',t:'armor',e:'🤖',atk:15,def:130,c:500000,tier:3,ml:50},
  {id:'stealth_suit',n:'Stealth Camouflage Suit',t:'armor',e:'🥷',atk:10,def:100,c:400000,tier:3,ml:45},
  {id:'private_jet',n:'Armed Private Jet',t:'vehicle',e:'✈️',atk:50,def:35,c:1200000,tier:3,ml:55},
  {id:'apc',n:'Armored Personnel Carrier',t:'vehicle',e:'🚛',atk:60,def:90,c:900000,tier:3,ml:50},
  // ── TIER V: ENDGAME ──
  {id:'plasma_rifle',n:'Plasma Rifle (Prototype)',t:'weapon',e:'🔬',atk:350,def:10,c:2000000,tier:4,ml:80},
  {id:'gauss_rifle',n:'Gauss Sniper System',t:'weapon',e:'🔭',atk:280,def:0,c:1500000,tier:4,ml:70},
  {id:'pulse_cannon',n:'Pulse Cannon',t:'weapon',e:'💫',atk:400,def:5,c:4000000,tier:4,ml:100},
  {id:'nano_suit',n:'Nano-Fiber Suit',t:'armor',e:'🔬',atk:20,def:200,c:1500000,tier:4,ml:75},
  {id:'god_plate',n:'Titan Alloy Plate',t:'armor',e:'⚡',atk:30,def:280,c:3000000,tier:4,ml:90},
  {id:'tank',n:'M1 Abrams Tank',t:'vehicle',e:'💀',atk:120,def:150,c:5000000,tier:4,ml:80},
  {id:'warship',n:'Destroyer Warship',t:'vehicle',e:'⚓',atk:200,def:200,c:15000000,tier:4,ml:100},
  {id:'stealth_bomber',n:'B-2 Stealth Bomber',t:'vehicle',e:'🛩️',atk:300,def:100,c:25000000,tier:4,ml:120},
];

// LOOT TABLE
const LOOT = {
  brass_knuckles:{n:'Brass Knuckles',e:'👊',t:'weapon',atk:2,def:0},
  switchblade:{n:'Switchblade',e:'🔪',t:'weapon',atk:5,def:0},
  baseball_bat:{n:'Aluminum Bat',e:'⚾',t:'weapon',atk:7,def:1},
  crowbar:{n:'Crowbar',e:'🔩',t:'weapon',atk:8,def:0},
  pistol:{n:'.45 Pistol',e:'🔫',t:'weapon',atk:12,def:0},
  silenced_pistol:{n:'Silenced Pistol',e:'🔫',t:'weapon',atk:15,def:0},
  tommy_gun:{n:'Tommy Gun',e:'🔫',t:'weapon',atk:22,def:1},
  bulletproof_vest:{n:'Bulletproof Vest',e:'🦺',t:'armor',atk:0,def:18},
  ak47:{n:'AK-47',e:'🔫',t:'weapon',atk:35,def:2},
  sniper_rifle:{n:'Sniper Rifle',e:'🎯',t:'weapon',atk:55,def:0},
  desert_eagle:{n:'Desert Eagle',e:'🔫',t:'weapon',atk:40,def:1},
  kalashnikov:{n:'Kalashnikov Elite',e:'🔫',t:'weapon',atk:80,def:4},
  rocket_launcher:{n:'RPG-7',e:'💥',t:'weapon',atk:150,def:0},
  rum_pistol:{n:'Rum Runner\'s Pistol',e:'🔫',t:'weapon',atk:25,def:0},
  dynamite:{n:'Dynamite Bundle',e:'🧨',t:'weapon',atk:28,def:0},
  jade_dragon:{n:'Jade Dragon',e:'🐉',t:'armor',atk:0,def:25},
  jungle_machete:{n:'Jungle Machete',e:'🌿',t:'weapon',atk:35,def:3},
  diamonds:{n:'Blood Diamonds',e:'💎',t:'armor',atk:5,def:12},
  renaissance_dagger:{n:'Renaissance Dagger',e:'🗡️',t:'weapon',atk:50,def:5},
  papal_signet:{n:'Papal Signet Ring',e:'💍',t:'armor',atk:10,def:35},
  don_ring:{n:'Don\'s Ring',e:'💍',t:'armor',atk:20,def:45},
  gold_watch:{n:'Gold Watch',e:'⌚',t:'armor',atk:5,def:8},
  uncut_diamonds:{n:'Uncut Diamonds',e:'💎',t:'armor',atk:8,def:20},
  katana:{n:'Katana',e:'⚔️',t:'weapon',atk:65,def:5},
  samurai_sword:{n:'Samurai Sword',e:'⚔️',t:'weapon',atk:90,def:8},
  hacking_rig:{n:'Hacking Rig',e:'💻',t:'special',atk:20,def:20},
  gold_bar:{n:'Gold Bar',e:'🥇',t:'armor',atk:0,def:15},
  crypto_wallet:{n:'Crypto Wallet',e:'💰',t:'special',atk:10,def:10},
  golden_ak:{n:'Golden AK-47',e:'🔫',t:'weapon',atk:95,def:5},
  ottoman_blade:{n:'Ottoman Blade',e:'🗡️',t:'weapon',atk:70,def:7},
  dragon_seal:{n:'Dragon Seal',e:'🐉',t:'special',atk:30,def:30},
  yakuza_tattoo_scroll:{n:'Yakuza Oath Scroll',e:'📜',t:'special',atk:15,def:15},
  world_don_crown:{n:'World Don Crown',e:'👑',t:'special',atk:100,def:100},
  // Missing loot items from jobs
  ancient_artifact:{n:'Ancient Artifact',e:'🏺',t:'special',atk:20,def:20},
  assassination_kit:{n:'Assassination Kit',e:'🧰',t:'weapon',atk:60,def:0},
  briefcase_of_cash:{n:'Briefcase of Cash',e:'💼',t:'special',atk:0,def:0},
  british_rifle:{n:'British Rifle',e:'🔫',t:'weapon',atk:45,def:0},
  cartel_pistol:{n:'Cartel Pistol',e:'🔫',t:'weapon',atk:40,def:0},
  compromising_photos:{n:'Compromising Photos',e:'📸',t:'special',atk:0,def:15},
  corsican_blade:{n:'Corsican Blade',e:'🗡️',t:'weapon',atk:50,def:5},
  cuban_pistol:{n:'Cuban Pistol',e:'🔫',t:'weapon',atk:25,def:0},
  drug_lord_crown:{n:'Drug Lord Crown',e:'👑',t:'special',atk:35,def:10},
  entertainer_contract:{n:'Entertainer Contract',e:'🎭',t:'special',atk:0,def:10},
  fake_rolex:{n:'Fake Rolex',e:'⌚',t:'special',atk:0,def:5},
  fbi_badge:{n:'FBI Badge',e:'🪪',t:'special',atk:10,def:25},
  gold_chain:{n:'Gold Chain',e:'⛓️',t:'armor',atk:0,def:12},
  ivory_tusk:{n:'Ivory Tusk',e:'🦷',t:'special',atk:15,def:0},
  offshore_account:{n:'Offshore Account',e:'🏦',t:'special',atk:0,def:0},
  pcc_crown:{n:'PCC Crown',e:'👑',t:'special',atk:40,def:15},
  platinum_chain:{n:'Platinum Chain',e:'⛓️',t:'armor',atk:5,def:20},
  polonium_vial:{n:'Polonium Vial',e:'☢️',t:'weapon',atk:80,def:0},
  speedboat_key:{n:'Speedboat Key',e:'🚤',t:'vehicle',atk:0,def:10},
  stolen_masterpiece:{n:'Stolen Masterpiece',e:'🖼️',t:'special',atk:0,def:0},
  usp_pistol:{n:'USP Pistol',e:'🔫',t:'weapon',atk:30,def:0},
  vor_crown:{n:'Vor Crown',e:'👑',t:'special',atk:55,def:20},
  world_bank_key:{n:'World Bank Key',e:'🔑',t:'special',atk:0,def:0},
};

// ══════════════════════════════════════════
// BLACK MARKET
// ══════════════════════════════════════════
const BM_TIERS=['Contraband','Intelligence','Passive Upgrades','War Assets','Endgame'];
const BLACK_MARKET = [
  // ── CONTRABAND ──
  {id:'bm01',n:'Military Grade Explosives',e:'💣',d:'C4 blocks for high-security jobs',p:50000,atk:40,def:0,ml:1,tier:0,special:null,tag:['explosive','military']},
  {id:'bm_silencer',n:'Universal Silencer Kit',e:'🔇',d:'All weapons run quiet. Heat from fights -25%.',p:30000,atk:5,def:0,ml:5,tier:0,special:'silencer',tag:['stealth','weapon']},
  {id:'bm_fake_id',n:'Fake ID Set',e:'🪪',d:'Walk past any checkpoint. Bail costs halved.',p:40000,atk:0,def:0,ml:8,tier:0,special:'fakeId',tag:['stealth','identity']},
  {id:'bm_armor_pierce',n:'Armor-Piercing Rounds',e:'🔫',d:'Ignore 20% of enemy DEF in fights.',p:75000,atk:20,def:0,ml:12,tier:0,special:null,tag:['weapon','combat']},
  {id:'bm_stolen_badges',n:'Stolen Police Badges',e:'🪪',d:'Flash a badge. Heat drops 15% faster.',p:60000,atk:0,def:0,ml:10,tier:0,special:'heatReduction',tag:['stealth','heat']},
  // ── INTELLIGENCE ──
  {id:'bm02',n:'Stolen FBI Database',e:'🗂️',d:'Every informant\'s location. Clear 40 heat.',p:200000,atk:0,def:0,ml:15,tier:1,special:'reduceheat',tag:['intel','special']},
  {id:'bm_wiretap',n:'Citywide Wiretap Network',e:'📡',d:'Know every job\'s real payout. +10% job cash.',p:150000,atk:0,def:0,ml:12,tier:1,special:'jobCash',tag:['intel','passive']},
  {id:'bm_satellite',n:'Stolen Satellite Access',e:'🛰️',d:'+20% loot drop rate permanently.',p:350000,atk:0,def:0,ml:20,tier:1,special:'lootbonus',tag:['intel','loot']},
  {id:'bm_blackmail',n:'Blackmail Portfolio',e:'📸',d:'Compromising photos of 50 officials. +15% contract cash.',p:250000,atk:0,def:0,ml:18,tier:1,special:'contractCash',tag:['intel','contracts']},
  {id:'bm_deepfake',n:'Deepfake Studio',e:'🎭',d:'Frame anyone. Rob success +20%.',p:180000,atk:0,def:0,ml:15,tier:1,special:'robSuccess',tag:['intel','combat']},
  // ── PASSIVE UPGRADES ──
  {id:'bm03',n:'Black Market Connections',e:'🤝',d:'+10% all cash income permanently.',p:500000,atk:0,def:0,ml:20,tier:2,special:'cashbonus',tag:['passive','income']},
  {id:'bm04',n:'Cartel Drug Pipeline',e:'💊',d:'+25% max energy permanently.',p:300000,atk:0,def:0,ml:18,tier:2,special:'energybonus',tag:['passive','energy']},
  {id:'bm07',n:'Swiss Bank Account',e:'🏦',d:'Property income +30% permanently.',p:2000000,atk:0,def:0,ml:35,tier:2,special:'propbonus',tag:['passive','finance']},
  {id:'bm10',n:'Mind Control Serum',e:'💉',d:'+50 mafia members instantly.',p:3000000,atk:0,def:0,ml:40,tier:2,special:'mafia50',tag:['mafia','special']},
  {id:'bm_stam_surge',n:'Adrenaline Implant',e:'💊',d:'+15 max stamina permanently.',p:800000,atk:0,def:0,ml:25,tier:2,special:'staminaBonus',tag:['passive','stamina']},
  {id:'bm_xp_chip',n:'Neural XP Chip',e:'🧠',d:'+15% XP gain permanently.',p:1000000,atk:0,def:0,ml:30,tier:2,special:'xpChip',tag:['passive','xp']},
  // ── WAR ASSETS ──
  {id:'bm05',n:'Shadow Operative Contract',e:'🥷',d:'Passive assassin. +5 ATK permanently.',p:750000,atk:5,def:0,ml:25,tier:3,special:null,tag:['passive','combat']},
  {id:'bm06',n:'Prototype Nano Weapons',e:'⚗️',d:'Bleeding-edge combat tech. ATK +80 DEF +20.',p:1000000,atk:80,def:20,ml:30,tier:3,special:null,tag:['weapon','experimental']},
  {id:'bm09',n:'Stolen Nuclear Briefcase',e:'☢️',d:'The ultimate deterrent. DEF +300.',p:10000000,atk:0,def:300,ml:80,tier:3,special:null,tag:['defense','ultimate']},
  {id:'bm_private_army',n:'Private Mercenary Army',e:'⚔️',d:'+100 mafia, +30 ATK, +30 DEF.',p:5000000,atk:30,def:30,ml:60,tier:3,special:'mercArmy',tag:['military','mafia']},
  {id:'bm_orbital',n:'Orbital Strike Satellite',e:'🛰️',d:'Boss damage ×3. You fight from space.',p:8000000,atk:0,def:0,ml:75,tier:3,special:'bossDmg3x',tag:['military','boss']},
  // ── ENDGAME ──
  {id:'bm12',n:'Global Crime Network Access',e:'🌐',d:'×2 XP gain permanently.',p:15000000,atk:0,def:0,ml:100,tier:4,special:'xpbonus',tag:['passive','xp']},
  {id:'bm_time',n:'Time Dilation Field',e:'⌛',d:'Energy & stamina regen ×3.',p:20000000,atk:0,def:0,ml:120,tier:4,special:'tripleRegen',tag:['special','regen']},
  {id:'bm_godmode',n:'Project OLYMPUS',e:'⚡',d:'+200 ATK, +200 DEF, +50% all cash.',p:50000000,atk:200,def:200,ml:200,tier:4,special:'olympus',tag:['ultimate','endgame']},
  {id:'bm_matrix',n:'Reality Engine',e:'🔮',d:'×3 all income. ×2 XP. You rewrote the code.',p:100000000,atk:0,def:0,ml:300,tier:4,special:'reality',tag:['ultimate','endgame']},
];

// ══════════════════════════════════════════
// SKILL TREE
// ══════════════════════════════════════════
const SKILL_TREE = {
  combat:[
    {id:'st_atk1',n:'Street Fighter',d:'ATK +5',cost:6,effect:{atk:5},req:null},
    {id:'st_atk2',n:'Trained Killer',d:'ATK +10, Crit +3%',cost:12,effect:{atk:10,crit:3},req:'st_atk1'},
    {id:'st_atk3',n:'Lethal Weapon',d:'ATK +20, Crit +5%',cost:18,effect:{atk:20,crit:5},req:'st_atk2'},
    {id:'st_atk4',n:'Ghost Operator',d:'ATK +40, Crit +10%',cost:30,effect:{atk:40,crit:10},req:'st_atk3'},
    {id:'st_atk5',n:'Supreme Assassin',d:'ATK +80, Crit +15%',cost:45,effect:{atk:80,crit:15},req:'st_atk4'},
    {id:'st_def1',n:'Street Tough',d:'DEF +5',cost:6,effect:{def:5},req:null},
    {id:'st_def2',n:'Iron Skin',d:'DEF +15',cost:12,effect:{def:15},req:'st_def1'},
    {id:'st_def3',n:'Bulletproof',d:'DEF +35, HP +50',cost:21,effect:{def:35,hp:50},req:'st_def2'},
    {id:'st_def4',n:'Untouchable',d:'DEF +70, HP +100',cost:36,effect:{def:70,hp:100},req:'st_def3'},
    {id:'st_def5',n:'The Shield',d:'DEF +150, HP +200',cost:54,effect:{def:150,hp:200},req:'st_def4'},
  ],
  hustle:[
    {id:'st_e1',n:'Night Owl',d:'Max Energy +10',cost:6,effect:{energy:10},req:null},
    {id:'st_e2',n:'Caffeinated',d:'Max Energy +20',cost:12,effect:{energy:20},req:'st_e1'},
    {id:'st_e3',n:'Iron Will',d:'Max Energy +40',cost:18,effect:{energy:40},req:'st_e2'},
    {id:'st_e4',n:'Relentless',d:'Max Energy +80, regen ×2',cost:30,effect:{energy:80},req:'st_e3'},
    {id:'st_e5',n:'Perpetual Motion',d:'Max Energy +160',cost:45,effect:{energy:160},req:'st_e4'},
    {id:'st_loot1',n:'Eagle Eye',d:'Loot chance +5%',cost:6,effect:{loot:5},req:null},
    {id:'st_loot2',n:'Scavenger',d:'Loot chance +10%',cost:12,effect:{loot:10},req:'st_loot1'},
    {id:'st_loot3',n:'Treasure Hunter',d:'Loot chance +20%',cost:21,effect:{loot:20},req:'st_loot2'},
    {id:'st_loot4',n:'Master Looter',d:'Loot chance +35%',cost:36,effect:{loot:35},req:'st_loot3'},
    {id:'st_loot5',n:'Godly Fortune',d:'Loot chance +50%',cost:60,effect:{loot:50},req:'st_loot4'},
  ],
  empire:[
    {id:'st_cash1',n:'Street Hustler',d:'Cash from jobs +5%',cost:6,effect:{cashMult:.05},req:null},
    {id:'st_cash2',n:'Earner',d:'Cash from jobs +10%',cost:12,effect:{cashMult:.10},req:'st_cash1'},
    {id:'st_cash3',n:'Big Earner',d:'Cash from jobs +20%',cost:18,effect:{cashMult:.20},req:'st_cash2'},
    {id:'st_cash4',n:'Top Earner',d:'Cash from jobs +35%',cost:30,effect:{cashMult:.35},req:'st_cash3'},
    {id:'st_cash5',n:'Untaxable',d:'Cash from jobs +60%',cost:45,effect:{cashMult:.60},req:'st_cash4'},
    {id:'st_xp1',n:'Street Smart',d:'XP gain +5%',cost:6,effect:{xpMult:.05},req:null},
    {id:'st_xp2',n:'Quick Learner',d:'XP gain +10%',cost:12,effect:{xpMult:.10},req:'st_xp1'},
    {id:'st_xp3',n:'Veteran',d:'XP gain +20%',cost:21,effect:{xpMult:.20},req:'st_xp2'},
    {id:'st_xp4',n:'Mastermind',d:'XP gain +35%',cost:36,effect:{xpMult:.35},req:'st_xp3'},
    {id:'st_xp5',n:'Omniscient',d:'XP gain +60%',cost:54,effect:{xpMult:.60},req:'st_xp4'},
  ],
};

// ══════════════════════════════════════════
// CONTRACTS (dynamically generated)
// ══════════════════════════════════════════
const CONTRACT_TEMPLATES = [
  // ── EASY ──
  {n:'Silence a Witness',d:'Someone saw too much. Make sure they stay silent.',diff:'easy',ec:8,sc:3,cb:5600,cx:15},
  {n:'Deliver a Package',d:'No questions. No mistakes. Just deliver it.',diff:'easy',ec:10,sc:0,cb:8400,cx:17},
  {n:'Clear a Debt',d:'Three deadbeats owe us money. Collect it. With interest.',diff:'easy',ec:12,sc:2,cb:10500,cx:20},
  {n:'Torch a Business',d:'The owner didn\'t pay protection. Send a message.',diff:'easy',ec:10,sc:2,cb:7000,cx:15},
  {n:'Plant Evidence',d:'Make the rival capo look like a snitch.',diff:'easy',ec:8,sc:1,cb:7699,cx:17},
  // ── MEDIUM ──
  {n:'Rob a Courier',d:'High-value transfer happening tonight. Intercept it.',diff:'med',ec:15,sc:5,cb:21000,cx:35},
  {n:'Retrieve Stolen Merchandise',d:'Someone lifted our product. We want it back.',diff:'med',ec:18,sc:6,cb:28000,cx:42},
  {n:'Hit a Safe House',d:'Rival crew is sitting on $200k. It\'s ours now.',diff:'med',ec:20,sc:8,cb:42000,cx:55},
  {n:'Kidnap a Banker',d:'He knows where $5M in laundered money sits.',diff:'med',ec:16,sc:6,cb:31499,cx:45},
  {n:'Hack the Police Database',d:'Delete three names. Add two others.',diff:'med',ec:14,sc:4,cb:24500,cx:37},
  {n:'Smuggle Weapons',d:'50 crates across the border. No stops.',diff:'med',ec:22,sc:7,cb:38500,cx:50},
  // ── HARD ──
  {n:'Eliminate a Capo',d:'The Commission authorized it. Clean and quiet.',diff:'hard',ec:25,sc:10,cb:84000,cx:100},
  {n:'Infiltrate a Federal Building',d:'Something inside we need. Extract it.',diff:'hard',ec:30,sc:12,cb:140000,cx:140},
  {n:'Take Down a Rival Organization',d:'Scorched earth. Nothing left standing.',diff:'hard',ec:40,sc:15,cb:280000,cx:225},
  {n:'Assassinate a Judge',d:'The trial ends. Permanently.',diff:'hard',ec:28,sc:11,cb:125999,cx:125},
  {n:'Steal a Missile',d:'Don\'t ask why. Don\'t ask for whom.',diff:'hard',ec:35,sc:14,cb:244999,cx:200},
  {n:'Break Into a Vault',d:'Swiss bank. Titanium vault. 90-second window.',diff:'hard',ec:32,sc:13,cb:196000,cx:160},
  // ── ELITE ──
  {n:'Ghost Protocol',d:'A target of maximum importance. No witnesses.',diff:'elite',ec:50,sc:20,cb:630000,cx:400},
  {n:'The Final Sanction',d:'The most dangerous contract ever issued.',diff:'elite',ec:60,sc:25,cb:1400000,cx:750},
  {n:'Regime Change',d:'A small country needs new leadership. You\'re providing it.',diff:'elite',ec:55,sc:22,cb:1050000,cx:600},
  {n:'Erase a City Block',d:'Make it look like it was never there.',diff:'elite',ec:70,sc:28,cb:2100000,cx:1000},
  {n:'The Impossible Hit',d:'Protected by 200 guards. Underground bunker. 0.1% success rate advertised. You\'re better than that.',diff:'elite',ec:80,sc:30,cb:3500000,cx:1500},
];

// ══════════════════════════════════════════
// MISSIONS (20 total)
// ══════════════════════════════════════════
const MISSIONS = [
  {id:'MS01',t:'Rise from the Gutter',s:'You\'re nobody. A street punk with a name and a knife. Time to build something.',steps:['Do 5 jobs','Earn $5,000','Reach Level 3'],ul:1},
  {id:'MS02',t:'Making Your Bones',s:'The Don has noticed you. You have what it takes. Get your hands dirty.',steps:['Win 3 fights','Do 15 jobs','Buy any property'],ul:4},
  {id:'MS03',t:'Earning Your Stripes',s:'Respect is earned one job at a time. Prove you\'re a soldier.',steps:['Do 30 jobs','Earn $50,000','Reach Level 10'],ul:7},
  {id:'MS04',t:'The Hostile Takeover',s:'A rival crew is moving on your block. Send a message.',steps:['Win 10 fights','Rob 5 rivals','Reach Level 15'],ul:10},
  {id:'MS05',t:'International Expansion',s:'New York is a start. The world is the prize.',steps:['Unlock Chicago','Do 20 Chicago jobs','Earn $200,000'],ul:15},
  {id:'MS06',t:'The Commission',s:'The five families want to know your loyalties.',steps:['Do 50 jobs','Win 20 fights','Reach Level 20'],ul:18},
  {id:'MS07',t:'Cartel Contact',s:'A connection in Mexico changes everything. Build the bridge.',steps:['Unlock Mexico City','Do 15 Mexico jobs','Earn $500,000'],ul:40},
  {id:'MS08',t:'The Godfather\'s Test',s:'The old man wants to see what you\'re made of.',steps:['Reach Level 30','Own 10 properties','Kill 10 enemies'],ul:25},
  {id:'MS09',t:'Shadow Operations',s:'Intelligence work. Off the books. Maximum reward.',steps:['Complete 5 contracts','Reach Level 50','Earn $2,000,000'],ul:45},
  {id:'MS10',t:'Global Connections',s:'Asia, Europe, the Middle East. All paying tribute.',steps:['Unlock London','Unlock Moscow','Reach Level 70'],ul:65},
  {id:'MS11',t:'Iron Throne',s:'One seat of power. Many pretenders. One Don.',steps:['Win a Gang War','Reach Level 80','Earn $5,000,000'],ul:75},
  {id:'MS12',t:'The Invisible Hand',s:'Move money without a trace. Control without being seen.',steps:['Buy an Offshore Account','Complete 15 contracts','Reach Level 100'],ul:90},
  {id:'MS13',t:'Untouchable',s:'Cops, Feds, Interpol. Nobody can touch you.',steps:['Reach Level 120','Win 100 fights','Own 20 properties'],ul:110},
  {id:'MS14',t:'The Long Game',s:'Decades of patience. A lifetime of power.',steps:['Reach Level 200','Earn $100,000,000','Reach 10,000 Respect'],ul:175},
  {id:'MS15',t:'World Syndicate',s:'Every criminal organization in the world answers to you.',steps:['Unlock Tokyo','Unlock Singapore','Reach Level 300'],ul:275},
  {id:'MS16',t:'The Prestige',s:'You\'ve conquered everything. Now transcend it.',steps:['Reach Level 500','Complete 50 contracts','Own a Sovereign Fund'],ul:450},
  {id:'MS17',t:'Immortal Don',s:'Legends are made. You are becoming one.',steps:['Reach Level 700','Earn $50,000,000','Win 500 fights'],ul:650},
  {id:'MS18',t:'The Last War',s:'One final battle for supreme dominance.',steps:['Reach Level 900','Kill 1000 enemies','Complete a Gang War on Max'],ul:850},
  {id:'MS19',t:'Transcendence',s:'Beyond level. Beyond rank. Beyond human.',steps:['Reach Level 1200','Earn $500,000,000','Own all city-tier properties'],ul:1100},
  {id:'MS20',t:'IL CAPO DI TUTTI CAPI',s:'The Don of all Dons. The final achievement. Level 1500. You are the game.',steps:['Reach Level 1500','Earn $2,000,000,000','Kill the Final Enemy'],ul:1400},
];

// ══════════════════════════════════════════
// PRESTIGE SYSTEM
// ══════════════════════════════════════════
const PRESTIGE_UNLOCKS = [
  {p:1,req_level:100,desc:'Prestige I — Reset to Level 1. Keep all items & properties. +15% XP, +10% cash gain, +5 ATK, permanent.'},
  {p:2,req_level:100,desc:'Prestige II — +30% XP, +20% cash, +10 ATK, access to P2 skill tree.'},
  {p:3,req_level:100,desc:'Prestige III — +50% XP, +35% cash, +20 ATK/DEF, unlock prestige-exclusive jobs.'},
  {p:4,req_level:100,desc:'Prestige IV — +75% XP, +55% cash, +35 ATK, +500 max energy.'},
  {p:5,req_level:100,desc:'Prestige V — ×2 XP, ×2 cash, +50 ATK, unlock Elite missions.'},
  {p:10,req_level:100,desc:'Prestige X — ×5 XP, ×5 cash, +150 ATK/DEF. A true legend.'},
];

// ══════════════════════════════════════════
// SAVE / LOAD
// ══════════════════════════════════════════
let _saveTimer=null;
