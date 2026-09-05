import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  Home, CalendarDays, Users, Star, Sparkles, Trophy, ListChecks, Settings,
  Tv, MapPin, Clock, Flag, Snowflake, Moon, Plane, Shield, Swords, Zap,
  AlertTriangle, Check, ChevronRight, ChevronLeft, Circle, CheckCircle2,
  Eye, EyeOff, Radio, Anchor, Target, TrendingUp, Info, Save, RotateCcw, Flame, Share2, Award, User,
} from "lucide-react";

/* ============================================================================
   GRIDIRON COMMAND — Jake's 2026 College Football Command Center
   Data status legend: verified | projected | tbd
   ========================================================================== */

const DISLIKED = ["michigan", "ohio-state", "alabama", "pitt"];

const TEAMS = {
  "michigan-state": {
    id: "michigan-state", name: "Michigan State", short: "MSU", mascot: "Spartans",
    conf: "Big Ten", tier: 1, priority: 1, colors: ["#18453B", "#FFFFFF"],
    coach: "Pat Fitzgerald (1st yr)", stadium: "Spartan Stadium", city: "East Lansing, MI",
    capacity: "75,005", style: "Rebuild under Fitzgerald — tough, disciplined defense",
    note: "Your #1. New era under Fitzgerald (hired Dec 2025).", runHeavy: false,
  },
  "notre-dame": {
    id: "notre-dame", name: "Notre Dame", short: "ND", mascot: "Fighting Irish",
    conf: "Independent", tier: 1, priority: 2, colors: ["#0C2340", "#C99700"],
    coach: "Marcus Freeman", stadium: "Notre Dame Stadium", city: "South Bend, IN",
    capacity: "77,622", style: "Playoff-caliber, pro-style; heavy trophy-game slate",
    note: "Your #2. CFP push season on NBC.", runHeavy: false,
  },
  "west-virginia": {
    id: "west-virginia", name: "West Virginia", short: "WVU", mascot: "Mountaineers",
    conf: "Big 12", tier: 1, priority: 3, colors: ["#002855", "#EAAA00"],
    coach: "Rich Rodriguez", stadium: "Milan Puskar Stadium", city: "Morgantown, WV",
    capacity: "60,000", style: "RichRod physical spread; blue-collar identity",
    note: "Your #3. No Backyard Brawl in 2026 (Pitt series resumes 2029).", runHeavy: true,
  },
  "georgia-tech": {
    id: "georgia-tech", name: "Georgia Tech", short: "GT", mascot: "Yellow Jackets",
    conf: "ACC", tier: 2, priority: 4, colors: ["#B3A369", "#003057"],
    coach: "Brent Key", stadium: "Bobby Dodd Stadium", city: "Atlanta, GA",
    capacity: "55,000", style: "Physical, option heritage; won the 2024 Dublin opener",
    note: "Your ACC team.", runHeavy: true,
  },
  "lsu": {
    id: "lsu", name: "LSU", short: "LSU", mascot: "Tigers",
    conf: "SEC", tier: 2, priority: 5, colors: ["#461D7C", "#FDD023"],
    coach: "Lane Kiffin (1st yr)", stadium: "Tiger Stadium (Death Valley)", city: "Baton Rouge, LA",
    capacity: "102,321", style: "Elite talent; night games in Death Valley are elite atmosphere",
    note: "Your SEC team. Kiffin's first year. Hosts Clemson (Sep 5) and Alabama (Nov 7).", runHeavy: false,
  },
  "boise-state": {
    id: "boise-state", name: "Boise State", short: "BSU", mascot: "Broncos",
    conf: "Pac-12", tier: 2, priority: 6, colors: ["#0033A0", "#D64309"],
    coach: "Spencer Danielson", stadium: "Albertsons Stadium (Blue Turf)", city: "Boise, ID",
    capacity: "36,387", style: "G5 standard-bearer & giant killer; the blue turf",
    note: "Your Pac-12 team (joined the new Pac-12 on July 1, 2026).", runHeavy: false,
  },
  "navy": {
    id: "navy", name: "Navy", short: "NAVY", mascot: "Midshipmen",
    conf: "American (AAC)", tier: 2, priority: 7, colors: ["#00205B", "#C5B783"],
    coach: "Brian Newberry", stadium: "Navy-Marine Corps Memorial Stadium", city: "Annapolis, MD",
    capacity: "34,000", style: "Triple-option, run-first service academy — peak old-school",
    note: "Your AAC team. Extra weight for run-heavy academy football.", runHeavy: true,
    extra: "Also on the 2026 slate (dates firming): at Air Force (Commander-in-Chief's Trophy), at FAU, at UAB, at UTSA, and Memphis.",
  },
  "north-dakota-state": {
    id: "north-dakota-state", name: "North Dakota State", short: "NDSU", mascot: "Bison",
    conf: "Mountain West (FBS)", tier: 2, priority: 8, colors: ["#009A44", "#FFB819"],
    coach: "Tim Polasek", stadium: "Fargodome", city: "Fargo, ND",
    capacity: "18,700", style: "Downhill, physical dynasty — the blueprint for run-heavy ball",
    note: "Correction: NDSU moved UP to FBS and joined the Mountain West on July 1, 2026. Your 'Mountain West team' mapping was right after all.", runHeavy: true,
    extra: "Full Mountain West slate: opponents set (incl. Air Force), most conference dates still firming. Verified: JSU (Aug 29, Week 0), Air Force (Sep 12), Sacramento State (Sep 19), at San Jose State (Nov 28).",
  },
  "james-madison": {
    id: "james-madison", name: "James Madison", short: "JMU", mascot: "Dukes",
    conf: "Sun Belt", tier: 2, priority: 9, colors: ["#450084", "#CBB677"],
    coach: "Billy Napier (1st yr)", stadium: "Bridgeforth Stadium", city: "Harrisonburg, VA",
    capacity: "25,000", style: "Fast riser; reigning Sun Belt champ; three straight Thursday games",
    note: "Your Sun Belt team. 2025 Sun Belt champ & CFP qualifier. Napier's first year.", runHeavy: false,
  },
  "western-michigan": {
    id: "western-michigan", name: "Western Michigan", short: "WMU", mascot: "Broncos",
    conf: "MAC", tier: 2, priority: 10, colors: ["#6C4023", "#B5A167"],
    coach: "Lance Taylor", stadium: "Waldo Stadium", city: "Kalamazoo, MI",
    capacity: "30,200", style: "MACtion; reigning MAC champ — your weeknight football engine",
    note: "Your MAC team. 2025 MAC champ. Opens at Michigan, hosts Boise State Sep 26.", runHeavy: false,
    extra: "MAC opponents set: home vs Central Michigan, Kent State, Ohio, Toledo; away at Bowling Green, Buffalo, Eastern Michigan, Miami (OH). Conference kickoff dates still firming.",
  },
  "jacksonville-state": {
    id: "jacksonville-state", name: "Jacksonville State", short: "JSU", mascot: "Gamecocks",
    conf: "Conference USA", tier: 2, priority: 11, colors: ["#CC0000", "#000000"],
    coach: "Charles Kelly", stadium: "AmFirst Stadium (Burgess-Snow Field)", city: "Jacksonville, AL",
    capacity: "24,000", style: "Physical, run-forward CUSA program on the rise",
    note: "Your CUSA team. Extra weight for old-school identity.", runHeavy: true,
  },
  // Opponents / national teams (light records for context; ranks are projections)
  "toledo": { id: "toledo", name: "Toledo", short: "TOL", conf: "MAC", colors: ["#15397F", "#FFD600"] },
  "eastern-michigan": { id: "eastern-michigan", name: "Eastern Michigan", short: "EMU", conf: "MAC", colors: ["#046A38", "#000000"] },
  "nebraska": { id: "nebraska", name: "Nebraska", short: "NEB", conf: "Big Ten", colors: ["#E41C38", "#FFFFFF"] },
  "wisconsin": { id: "wisconsin", name: "Wisconsin", short: "WIS", conf: "Big Ten", colors: ["#C5050C", "#FFFFFF"] },
  "illinois": { id: "illinois", name: "Illinois", short: "ILL", conf: "Big Ten", colors: ["#13294B", "#E84A27"] },
  "northwestern": { id: "northwestern", name: "Northwestern", short: "NW", conf: "Big Ten", colors: ["#4E2A84", "#FFFFFF"] },
  "ucla": { id: "ucla", name: "UCLA", short: "UCLA", conf: "Big Ten", colors: ["#2D68C4", "#F2A900"] },
  "michigan": { id: "michigan", name: "Michigan", short: "MICH", conf: "Big Ten", colors: ["#00274C", "#FFCB05"], disliked: true },
  "washington": { id: "washington", name: "Washington", short: "UW", conf: "Big Ten", colors: ["#4B2E83", "#B7A57A"] },
  "oregon": { id: "oregon", name: "Oregon", short: "ORE", conf: "Big Ten", colors: ["#154733", "#FEE123"] },
  "rutgers": { id: "rutgers", name: "Rutgers", short: "RUT", conf: "Big Ten", colors: ["#CC0033", "#000000"] },
  "rice": { id: "rice", name: "Rice", short: "RICE", conf: "American (AAC)", colors: ["#00205B", "#C1C6C8"] },
  "purdue": { id: "purdue", name: "Purdue", short: "PUR", conf: "Big Ten", colors: ["#CEB888", "#000000"] },
  "north-carolina": { id: "north-carolina", name: "North Carolina", short: "UNC", conf: "ACC", colors: ["#4B9CD3", "#FFFFFF"] },
  "stanford": { id: "stanford", name: "Stanford", short: "STAN", conf: "ACC", colors: ["#8C1515", "#FFFFFF"] },
  "byu": { id: "byu", name: "BYU", short: "BYU", conf: "Big 12", colors: ["#002E5D", "#FFFFFF"] },
  "miami": { id: "miami", name: "Miami", short: "MIA", conf: "ACC", colors: ["#F47321", "#005030"] },
  "boston-college": { id: "boston-college", name: "Boston College", short: "BC", conf: "ACC", colors: ["#98002E", "#BC9B6A"] },
  "smu": { id: "smu", name: "SMU", short: "SMU", conf: "ACC", colors: ["#0033A0", "#C8102E"] },
  "syracuse": { id: "syracuse", name: "Syracuse", short: "SYR", conf: "ACC", colors: ["#F76900", "#000E54"] },
  "coastal-carolina": { id: "coastal-carolina", name: "Coastal Carolina", short: "CCU", conf: "Sun Belt", colors: ["#006F71", "#A27752"] },
  "ut-martin": { id: "ut-martin", name: "UT Martin", short: "UTM", conf: "FCS · OVC", colors: ["#003366", "#FF6600"] },
  "virginia": { id: "virginia", name: "Virginia", short: "UVA", conf: "ACC", colors: ["#232D4B", "#F84C1E"] },
  "oklahoma-state": { id: "oklahoma-state", name: "Oklahoma State", short: "OKST", conf: "Big 12", colors: ["#FF7300", "#000000"] },
  "iowa-state": { id: "iowa-state", name: "Iowa State", short: "ISU", conf: "Big 12", colors: ["#C8102E", "#F1BE48"] },
  "arizona": { id: "arizona", name: "Arizona", short: "ARIZ", conf: "Big 12", colors: ["#003366", "#CC0033"] },
  "cincinnati": { id: "cincinnati", name: "Cincinnati", short: "CIN", conf: "Big 12", colors: ["#E00122", "#000000"] },
  "tcu": { id: "tcu", name: "TCU", short: "TCU", conf: "Big 12", colors: ["#4D1979", "#A3A9AC"] },
  "texas-tech": { id: "texas-tech", name: "Texas Tech", short: "TTU", conf: "Big 12", colors: ["#CC0000", "#000000"] },
  "kansas": { id: "kansas", name: "Kansas", short: "KU", conf: "Big 12", colors: ["#0051BA", "#E8000D"] },
  "houston": { id: "houston", name: "Houston", short: "HOU", conf: "Big 12", colors: ["#C8102E", "#FFFFFF"] },
  "utah": { id: "utah", name: "Utah", short: "UTAH", conf: "Big 12", colors: ["#CC0000", "#FFFFFF"] },
  "towson": { id: "towson", name: "Towson", short: "TOW", conf: "FCS · CAA", colors: ["#FFB81C", "#000000"] },
  "army": { id: "army", name: "Army", short: "ARMY", conf: "American (AAC)", colors: ["#000000", "#D4BF91"] },
  "oregon-state": { id: "oregon-state", name: "Oregon State", short: "ORST", conf: "Pac-12", colors: ["#DC4405", "#000000"] },
  "san-diego-state": { id: "san-diego-state", name: "San Diego State", short: "SDSU", conf: "Pac-12", colors: ["#A6192E", "#000000"] },
  "north-texas": { id: "north-texas", name: "North Texas", short: "UNT", conf: "American (AAC)", colors: ["#00853E", "#FFFFFF"] },
  "texas-state": { id: "texas-state", name: "Texas State", short: "TXST", conf: "Pac-12", colors: ["#501214", "#726158"] },
  // LSU opponents
  "clemson": { id: "clemson", name: "Clemson", short: "CLEM", conf: "ACC", colors: ["#F56600", "#522D80"] },
  "louisiana-tech": { id: "louisiana-tech", name: "Louisiana Tech", short: "LT", conf: "Sun Belt", colors: ["#002F8B", "#E31B23"] },
  "ole-miss": { id: "ole-miss", name: "Ole Miss", short: "MISS", conf: "SEC", colors: ["#14213D", "#CE1126"] },
  "texas-am": { id: "texas-am", name: "Texas A&M", short: "TAMU", conf: "SEC", colors: ["#500000", "#FFFFFF"] },
  "mcneese": { id: "mcneese", name: "McNeese", short: "MCN", conf: "FCS · Southland", colors: ["#00539B", "#FFB81C"] },
  "kentucky": { id: "kentucky", name: "Kentucky", short: "UK", conf: "SEC", colors: ["#0033A0", "#FFFFFF"] },
  "mississippi-state": { id: "mississippi-state", name: "Mississippi State", short: "MSST", conf: "SEC", colors: ["#660000", "#FFFFFF"] },
  "auburn": { id: "auburn", name: "Auburn", short: "AUB", conf: "SEC", colors: ["#0C2340", "#E86100"] },
  "alabama": { id: "alabama", name: "Alabama", short: "BAMA", conf: "SEC", colors: ["#9E1B32", "#FFFFFF"], disliked: true },
  "texas": { id: "texas", name: "Texas", short: "TEX", conf: "SEC", colors: ["#BF5700", "#FFFFFF"] },
  "tennessee": { id: "tennessee", name: "Tennessee", short: "TENN", conf: "SEC", colors: ["#FF8200", "#FFFFFF"] },
  "arkansas": { id: "arkansas", name: "Arkansas", short: "ARK", conf: "SEC", colors: ["#9D2235", "#FFFFFF"] },
  // Georgia Tech opponents
  "colorado": { id: "colorado", name: "Colorado", short: "COLO", conf: "Big 12", colors: ["#CFB87C", "#000000"] },
  "mercer": { id: "mercer", name: "Mercer", short: "MER", conf: "FCS · SoCon", colors: ["#F76900", "#000000"] },
  "duke": { id: "duke", name: "Duke", short: "DUKE", conf: "ACC", colors: ["#003087", "#FFFFFF"] },
  "virginia-tech": { id: "virginia-tech", name: "Virginia Tech", short: "VT", conf: "ACC", colors: ["#630031", "#CF4420"] },
  "pitt": { id: "pitt", name: "Pitt", short: "PITT", conf: "ACC", colors: ["#003594", "#FFB81C"], disliked: true },
  "louisville": { id: "louisville", name: "Louisville", short: "LOU", conf: "ACC", colors: ["#AD0000", "#000000"] },
  "wake-forest": { id: "wake-forest", name: "Wake Forest", short: "WAKE", conf: "ACC", colors: ["#9E7E38", "#000000"] },
  "georgia": { id: "georgia", name: "Georgia", short: "UGA", conf: "SEC", colors: ["#BA0C2F", "#000000"] },
  // Boise State opponents
  "memphis": { id: "memphis", name: "Memphis", short: "MEM", conf: "American (AAC)", colors: ["#003087", "#898D8D"] },
  "south-dakota": { id: "south-dakota", name: "South Dakota", short: "USD", conf: "FCS · MVFC", colors: ["#C8102E", "#000000"] },
  "utah-state": { id: "utah-state", name: "Utah State", short: "USU", conf: "Pac-12", colors: ["#0F2439", "#8A8D8F"] },
  "fresno-state": { id: "fresno-state", name: "Fresno State", short: "FRES", conf: "Pac-12", colors: ["#DB0032", "#002E5D"] },
  "colorado-state": { id: "colorado-state", name: "Colorado State", short: "CSU", conf: "Pac-12", colors: ["#1E4D2B", "#C8C372"] },
  "washington-state": { id: "washington-state", name: "Washington State", short: "WSU", conf: "Pac-12", colors: ["#981E32", "#5E6A71"] },
  // WMU opponents
  "monmouth": { id: "monmouth", name: "Monmouth", short: "MONM", conf: "FCS · CAA", colors: ["#12284C", "#0077C8"] },
  "bowling-green": { id: "bowling-green", name: "Bowling Green", short: "BGSU", conf: "MAC", colors: ["#4F2C1D", "#FE5000"] },
  // JMU opponents
  "liberty": { id: "liberty", name: "Liberty", short: "LIB", conf: "Conference USA", colors: ["#002D62", "#A6192E"] },
  "wagner": { id: "wagner", name: "Wagner", short: "WAG", conf: "FCS · NEC", colors: ["#003B5C", "#00843D"] },
  "old-dominion": { id: "old-dominion", name: "Old Dominion", short: "ODU", conf: "Sun Belt", colors: ["#003057", "#7C878E"] },
  "marshall": { id: "marshall", name: "Marshall", short: "MRSH", conf: "Sun Belt", colors: ["#00B140", "#000000"] },
  "georgia-southern": { id: "georgia-southern", name: "Georgia Southern", short: "GASO", conf: "Sun Belt", colors: ["#041E42", "#87714D"] },
  "georgia-state": { id: "georgia-state", name: "Georgia State", short: "GAST", conf: "Sun Belt", colors: ["#0039A6", "#C8102E"] },
  "appalachian-state": { id: "appalachian-state", name: "Appalachian State", short: "APP", conf: "Sun Belt", colors: ["#000000", "#FFCC00"] },
  "troy": { id: "troy", name: "Troy", short: "TROY", conf: "Sun Belt", colors: ["#8A2432", "#A2AAAD"] },
  "southern-miss": { id: "southern-miss", name: "Southern Miss", short: "USM", conf: "Sun Belt", colors: ["#000000", "#FFAB00"] },
  "uconn": { id: "uconn", name: "UConn", short: "CONN", conf: "Independent", colors: ["#000E2F", "#7C878E"] },
  // JSU opponents
  "eastern-kentucky": { id: "eastern-kentucky", name: "Eastern Kentucky", short: "EKU", conf: "FCS · UAC", colors: ["#752F8A", "#FFFFFF"] },
  "ohio": { id: "ohio", name: "Ohio", short: "OHIO", conf: "MAC", colors: ["#00694E", "#FFFFFF"] },
  "middle-tennessee": { id: "middle-tennessee", name: "Middle Tennessee", short: "MTSU", conf: "Conference USA", colors: ["#0066CC", "#000000"] },
  "kennesaw-state": { id: "kennesaw-state", name: "Kennesaw State", short: "KENN", conf: "Conference USA", colors: ["#000000", "#FDB913"] },
  "fiu": { id: "fiu", name: "FIU", short: "FIU", conf: "Conference USA", colors: ["#081E3F", "#B6862C"] },
  "new-mexico-state": { id: "new-mexico-state", name: "New Mexico State", short: "NMSU", conf: "Conference USA", colors: ["#8C0B42", "#FFFFFF"] },
  "sam-houston": { id: "sam-houston", name: "Sam Houston", short: "SHSU", conf: "Conference USA", colors: ["#F56600", "#FFFFFF"] },
  "western-kentucky": { id: "western-kentucky", name: "Western Kentucky", short: "WKU", conf: "Conference USA", colors: ["#C60C30", "#000000"] },
  "missouri-state": { id: "missouri-state", name: "Missouri State", short: "MOST", conf: "Conference USA", colors: ["#5E0009", "#FFFFFF"] },
  "delaware": { id: "delaware", name: "Delaware", short: "DEL", conf: "Conference USA", colors: ["#00539F", "#FFD200"] },
  // NDSU opponents
  "air-force": { id: "air-force", name: "Air Force", short: "AF", conf: "Mountain West", colors: ["#003087", "#8A8D8F"] },
  "sacramento-state": { id: "sacramento-state", name: "Sacramento State", short: "SAC", conf: "FBS Indep.", colors: ["#00563F", "#C4B581"] },
  "san-jose-state": { id: "san-jose-state", name: "San Jose State", short: "SJSU", conf: "Mountain West", colors: ["#0055A2", "#E5A823"] },
};

const EXTRA_TEAMS = {}; // populated from live sync (national teams not in the seed)
const IDENTITY = {}; // official colors + logo URLs from CFBD /teams, cached in IndexedDB (V3 Pass 2)
const LOGO_DATA = {}; // id -> data URL (offline logo cache, V3 Pass 3)
function applyLogoData(map) { Object.assign(LOGO_DATA, map || {}); }
async function cacheLogo(id) {
  const t = T(id); const url = t.logos && t.logos[0];
  if (!url || LOGO_DATA[id]) return false;
  try {
    const via = PROXY_BASE ? PROXY_BASE.replace(/\/$/, "") + "/img?u=" + encodeURIComponent(url) : url;
    const res = await fetch(via); if (!res.ok) return false;
    const blob = await res.blob();
    const dataURL = await new Promise((r) => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.onerror = () => r(null); fr.readAsDataURL(blob); });
    if (dataURL) { LOGO_DATA[id] = dataURL; return true; }
  } catch (e) { /* offline / CORS — skip; <img> and crest still work */ }
  return false;
}
function T(id) {
  const base = TEAMS[id] || EXTRA_TEAMS[id] || { id, name: id, short: String(id).slice(0, 4).toUpperCase(), colors: ["#555", "#999"] };
  const idn = IDENTITY[id];
  if (!idn) return base;
  return { ...base, colors: idn.colors && idn.colors.length ? idn.colors : base.colors, logos: idn.logos, abbr: idn.abbr || base.abbr };
}
function applyIdentity(map) { Object.keys(IDENTITY).forEach((k) => delete IDENTITY[k]); Object.assign(IDENTITY, map || {}); }

/* ---- Verified 2026 games (selected teams + key national/special) ---- */
// status: verified = cross-checked vs official/reputable sources; projected = likely but unconfirmed; tbd = time/TV not released
const SRC = {
  msu: "msuspartans.com / Big Ten (Jan 27 2026 release)",
  nd: "fightingirish.com / NBC Sports (Jan 23 2026)",
  wvu: "wvusports.com / Big 12 (Jan 21 2026)",
  navy: "Navy Athletics / AAC (May 27 2026)",
  ire: "collegefootballireland.com (official)",
  pac: "pac-12.com 2026 schedule release",
  lsu: "lsusports.net / SEC (ESPN Dec 2025 release)",
  gt: "ramblinwreck.com / ACC (Jan 26 2026)",
  bsu: "broncosports.com / Pac-12 (Feb 11 2026)",
  wmu: "wmubroncos.com / MAC (May 2026 kickoff release)",
  jmu: "jmusports.com / Sun Belt (Mar 13 2026)",
  jsu: "jaxstatesports.com / C-USA (Apr 29 2026 adjusted)",
  ndsu: "gobison.com / Mountain West (2026)",
};

const GAMES = [
  // ===== WEEK 0 =====
  { id: "ire-tcu-unc", wk: 0, date: "2026-08-29", away: "north-carolina", home: "tcu", neutral: true, venue: "Aviva Stadium", city: "Dublin, Ireland", tv: "TBD", et: "TBD", status: "verified", special: ["international", "week0"], note: "Aer Lingus Classic. Belichick's UNC debut abroad. Your kind of game.", src: SRC.ire },

  // ===== WEEK 1 (Sep 5 / ND Sun Sep 6) =====
  { id: "msu-tol", wk: 1, date: "2026-09-05", away: "toledo", home: "michigan-state", tv: "TBD", et: "TBD", status: "verified", src: SRC.msu },
  { id: "wvu-ccu", wk: 1, date: "2026-09-05", away: "coastal-carolina", home: "west-virginia", tv: "TBD", et: "TBD", status: "verified", note: "RichRod opener; new WVU president came from Coastal.", src: SRC.wvu },
  { id: "navy-tow", wk: 1, date: "2026-09-05", away: "towson", home: "navy", tv: "TBD", et: "TBD", status: "verified", src: SRC.navy },
  { id: "nd-wis", wk: 1, date: "2026-09-06", away: "wisconsin", home: "notre-dame", neutral: true, venue: "Lambeau Field", city: "Green Bay, WI", tv: "NBC/Peacock", et: "7:30 PM", status: "verified", special: ["neutral", "uniqueVenue", "primetime"], note: "Shamrock Series at Lambeau. Sunday night.", src: SRC.nd },

  // ===== WEEK 2 (Sep 12) =====
  { id: "msu-emu", wk: 2, date: "2026-09-12", away: "eastern-michigan", home: "michigan-state", tv: "TBD", et: "TBD", status: "verified", src: SRC.msu },
  { id: "nd-rice", wk: 2, date: "2026-09-12", away: "rice", home: "notre-dame", tv: "NBC/Peacock", et: "3:30 PM", status: "verified", src: SRC.nd },
  { id: "wvu-utm", wk: 2, date: "2026-09-12", away: "ut-martin", home: "west-virginia", tv: "TBD", et: "TBD", status: "verified", src: SRC.wvu },
  { id: "tt-orst", wk: 2, date: "2026-09-12", away: "texas-tech", home: "oregon-state", tv: "CBS", et: "7:30 PM", status: "verified", special: ["national"], note: "2025 Big 12 champ Texas Tech visits the new Pac-12.", src: SRC.pac },

  // ===== WEEK 3 (Sep 19) — Megaphone weekend =====
  { id: "msu-nd", wk: 3, date: "2026-09-19", away: "michigan-state", home: "notre-dame", tv: "NBC/Peacock", et: "7:30 PM", status: "verified", rivalry: "Megaphone Trophy", special: ["primetime", "trophy"], note: "YOUR #1 vs YOUR #2. First meeting since 2017. Can't-lose / can't-win.", src: SRC.nd },
  { id: "wvu-uva", wk: 3, date: "2026-09-19", away: "west-virginia", home: "virginia", neutral: true, venue: "Bank of America Stadium", city: "Charlotte, NC", tv: "TBD", et: "TBD", status: "verified", special: ["neutral"], note: "Neutral-site closer to WVU non-con. UVA made the 2025 ACC title game.", src: SRC.wvu },

  // ===== WEEK 4 (Sep 26) =====
  { id: "msu-neb", wk: 4, date: "2026-09-26", away: "nebraska", home: "michigan-state", tv: "TBD", et: "TBD", status: "verified", note: "Big Ten opener; MSU lost 38-27 in 2025.", src: SRC.msu },
  { id: "nd-pur", wk: 4, date: "2026-09-26", away: "notre-dame", home: "purdue", tv: "TBD", et: "TBD", status: "verified", rivalry: "Shillelagh Trophy", special: ["trophy"], src: SRC.nd },
  { id: "wvu-okst", wk: 4, date: "2026-09-26", away: "oklahoma-state", home: "west-virginia", tv: "TBD", et: "TBD", status: "verified", note: "Big 12 opener; OK State's first season post-Gundy.", src: SRC.wvu },

  // ===== WEEK 5 (Oct 3) =====
  { id: "msu-wis", wk: 5, date: "2026-10-03", away: "michigan-state", home: "wisconsin", tv: "TBD", et: "TBD", status: "verified", src: SRC.msu },
  { id: "nd-unc", wk: 5, date: "2026-10-03", away: "notre-dame", home: "north-carolina", tv: "TBD", et: "TBD", status: "verified", note: "Belichick's UNC hosts the Irish.", src: SRC.nd },
  { id: "wvu-isu", wk: 5, date: "2026-10-03", away: "west-virginia", home: "iowa-state", tv: "TBD", et: "TBD", status: "verified", src: SRC.wvu },

  // ===== WEEK 6 (Oct 10) =====
  { id: "msu-ill", wk: 6, date: "2026-10-10", away: "illinois", home: "michigan-state", tv: "TBD", et: "TBD", status: "verified", src: SRC.msu },
  { id: "nd-stan", wk: 6, date: "2026-10-10", away: "stanford", home: "notre-dame", tv: "NBC/Peacock", et: "3:30 PM", status: "verified", rivalry: "Legends Trophy", special: ["trophy"], src: SRC.nd },
  { id: "wvu-ariz", wk: 6, date: "2026-10-10", away: "arizona", home: "west-virginia", tv: "TBD", et: "TBD", status: "verified", note: "RichRod vs his old Arizona program.", src: SRC.wvu },

  // ===== WEEK 7 (Oct 17) =====
  { id: "msu-nw", wk: 7, date: "2026-10-17", away: "northwestern", home: "michigan-state", tv: "TBD", et: "TBD", status: "verified", note: "Fitzgerald vs his alma mater. Storyline of the year.", src: SRC.msu },
  { id: "nd-byu", wk: 7, date: "2026-10-17", away: "notre-dame", home: "byu", tv: "TBD", et: "TBD", status: "verified", note: "BYU went 12-2 in 2025 — toughest road test.", src: SRC.nd },
  { id: "wvu-cin", wk: 7, date: "2026-10-17", away: "cincinnati", home: "west-virginia", tv: "TBD", et: "TBD", status: "verified", note: "WVU Homecoming.", src: SRC.wvu },

  // ===== WEEK 8 (Oct 24) =====
  { id: "msu-ucla", wk: 8, date: "2026-10-24", away: "michigan-state", home: "ucla", tv: "TBD", et: "TBD", status: "verified", note: "Revenge game (38-13 UCLA in 2025).", src: SRC.msu },
  { id: "wvu-tcu", wk: 8, date: "2026-10-24", away: "west-virginia", home: "tcu", tv: "TBD", et: "TBD", status: "verified", src: SRC.wvu },

  // ===== WEEK 9 (Oct 31) — ND-Navy =====
  { id: "nd-navy", wk: 9, date: "2026-10-31", away: "navy", home: "notre-dame", neutral: true, venue: "Gillette Stadium", city: "Foxborough, MA", tv: "TBD", et: "TBD", status: "verified", rivalry: "Notre Dame–Navy", special: ["neutral", "academy", "trophy"], note: "99th meeting, 60th at a neutral site, 1st at Gillette. Academy football.", src: SRC.nd },

  // ===== WEEK 10 (Nov 7) =====
  { id: "msu-mich", wk: 10, date: "2026-11-07", away: "michigan-state", home: "michigan", tv: "TBD", et: "TBD", status: "verified", rivalry: "Paul Bunyan Trophy", special: ["trophy", "rivalry"], note: "ROOT HARD. Your #1 team vs a most-disliked team, for the trophy.", src: SRC.msu },
  { id: "nd-mia", wk: 10, date: "2026-11-07", away: "miami", home: "notre-dame", tv: "NBC/Peacock", et: "7:30 PM", status: "verified", special: ["primetime", "national"], note: "Miami back in South Bend for the first time in 10 years.", src: SRC.nd },
  { id: "wvu-ttu", wk: 10, date: "2026-11-07", away: "west-virginia", home: "texas-tech", tv: "TBD", et: "TBD", status: "verified", src: SRC.wvu },

  // ===== WEEK 11 (Nov 14) =====
  { id: "msu-uw", wk: 11, date: "2026-11-14", away: "washington", home: "michigan-state", tv: "TBD", et: "TBD", status: "verified", note: "MSU hasn't beaten UW since 1969.", src: SRC.msu },
  { id: "nd-bc", wk: 11, date: "2026-11-14", away: "boston-college", home: "notre-dame", tv: "NBC/Peacock", et: "3:30 PM", status: "verified", rivalry: "Ireland Trophy (Holy War)", special: ["trophy"], src: SRC.nd },
  { id: "wvu-ku", wk: 11, date: "2026-11-14", away: "kansas", home: "west-virginia", tv: "TBD", et: "TBD", status: "verified", note: "Mountaineer Week.", src: SRC.wvu },

  // ===== WEEK 12 (Nov 21) =====
  { id: "msu-ore", wk: 12, date: "2026-11-21", away: "oregon", home: "michigan-state", tv: "TBD", et: "TBD", status: "verified", special: ["national"], note: "Only true juggernaut on MSU's Big Ten slate — and it's in East Lansing.", src: SRC.msu },
  { id: "nd-smu", wk: 12, date: "2026-11-21", away: "smu", home: "notre-dame", tv: "TBD", et: "TBD", status: "verified", src: SRC.nd },
  { id: "wvu-hou", wk: 12, date: "2026-11-21", away: "houston", home: "west-virginia", tv: "TBD", et: "TBD", status: "verified", src: SRC.wvu },

  // ===== WEEK 13 (Nov 28) =====
  { id: "msu-rut", wk: 13, date: "2026-11-28", away: "michigan-state", home: "rutgers", tv: "TBD", et: "TBD", status: "verified", note: "Regular-season finale; likely bowl-deciding.", src: SRC.msu },
  { id: "nd-syr", wk: 13, date: "2026-11-28", away: "notre-dame", home: "syracuse", tv: "TBD", et: "TBD", status: "verified", src: SRC.nd },
  { id: "wvu-utah", wk: 13, date: "2026-11-28", away: "west-virginia", home: "utah", tv: "TBD", et: "TBD", status: "verified", src: SRC.wvu },

  // ========================================================================
  // ADOPTED-TEAM FULL SCHEDULES (verified this pass)
  // ========================================================================

  // ---- LSU (SEC) ----
  { id: "lsu-clem", wk: 1, date: "2026-09-05", away: "clemson", home: "lsu", tv: "ABC", et: "6:30 PM", status: "verified", special: ["national", "primetime"], note: "Kiffin's LSU debut vs Clemson in Death Valley. Marquee opener.", src: SRC.lsu },
  { id: "lsu-latech", wk: 2, date: "2026-09-12", away: "louisiana-tech", home: "lsu", tv: "TBD", et: "TBD", status: "verified", src: SRC.lsu },
  { id: "lsu-miss", wk: 3, date: "2026-09-19", away: "lsu", home: "ole-miss", tv: "TBD", et: "TBD", status: "verified", note: "Kiffin returns to Ole Miss. First SEC game.", src: SRC.lsu },
  { id: "lsu-tamu", wk: 4, date: "2026-09-26", away: "texas-am", home: "lsu", tv: "TBD", et: "TBD", status: "verified", src: SRC.lsu },
  { id: "lsu-mcn", wk: 5, date: "2026-10-03", away: "mcneese", home: "lsu", tv: "TBD", et: "TBD", status: "verified", src: SRC.lsu },
  { id: "lsu-uk", wk: 6, date: "2026-10-10", away: "lsu", home: "kentucky", tv: "TBD", et: "TBD", status: "verified", src: SRC.lsu },
  { id: "lsu-msst", wk: 7, date: "2026-10-17", away: "mississippi-state", home: "lsu", tv: "TBD", et: "TBD", status: "verified", src: SRC.lsu },
  { id: "lsu-aub", wk: 8, date: "2026-10-24", away: "lsu", home: "auburn", tv: "TBD", et: "TBD", status: "verified", src: SRC.lsu },
  { id: "lsu-bama", wk: 10, date: "2026-11-07", away: "alabama", home: "lsu", tv: "TBD", et: "TBD", status: "verified", special: ["national"], note: "Bama in Death Valley — night game, and a villain you root against.", src: SRC.lsu },
  { id: "lsu-tex", wk: 11, date: "2026-11-14", away: "texas", home: "lsu", tv: "TBD", et: "TBD", status: "verified", special: ["national"], src: SRC.lsu },
  { id: "lsu-tenn", wk: 12, date: "2026-11-21", away: "lsu", home: "tennessee", tv: "TBD", et: "TBD", status: "verified", src: SRC.lsu },
  { id: "lsu-ark", wk: 13, date: "2026-11-28", away: "lsu", home: "arkansas", tv: "TBD", et: "TBD", status: "verified", src: SRC.lsu },

  // ---- Georgia Tech (ACC) ----
  { id: "gt-colo", wk: 1, date: "2026-09-05", away: "colorado", home: "georgia-tech", tv: "TBD", et: "TBD", status: "verified", note: "Could shift to Thu Sep 3. Bobby Dodd opener vs Colorado.", src: SRC.gt },
  { id: "gt-tenn", wk: 2, date: "2026-09-12", away: "tennessee", home: "georgia-tech", tv: "TBD", et: "TBD", status: "verified", special: ["national"], note: "First Tech-Tennessee meeting since 2017.", src: SRC.gt },
  { id: "gt-mer", wk: 3, date: "2026-09-19", away: "mercer", home: "georgia-tech", tv: "TBD", et: "TBD", status: "verified", src: SRC.gt },
  { id: "gt-stan", wk: 4, date: "2026-09-26", away: "georgia-tech", home: "stanford", tv: "TBD", et: "TBD", status: "verified", note: "Tech's first-ever trip to Stanford.", src: SRC.gt },
  { id: "gt-duke", wk: 6, date: "2026-10-10", away: "duke", home: "georgia-tech", tv: "TBD", et: "TBD", status: "verified", note: "Defending ACC champ visits The Flats.", src: SRC.gt },
  { id: "gt-vt", wk: 7, date: "2026-10-17", away: "georgia-tech", home: "virginia-tech", tv: "TBD", et: "TBD", status: "verified", src: SRC.gt },
  { id: "gt-bc", wk: 8, date: "2026-10-24", away: "boston-college", home: "georgia-tech", tv: "TBD", et: "TBD", status: "verified", src: SRC.gt },
  { id: "gt-pitt", wk: 9, date: "2026-10-31", away: "georgia-tech", home: "pitt", tv: "TBD", et: "TBD", status: "verified", note: "At Pitt on Halloween — a villain you root against.", src: SRC.gt },
  { id: "gt-lou", wk: 10, date: "2026-11-07", away: "louisville", home: "georgia-tech", tv: "TBD", et: "TBD", status: "verified", src: SRC.gt },
  { id: "gt-clem", wk: 11, date: "2026-11-14", away: "georgia-tech", home: "clemson", tv: "TBD", et: "TBD", status: "verified", special: ["national"], src: SRC.gt },
  { id: "gt-wake", wk: 12, date: "2026-11-21", away: "wake-forest", home: "georgia-tech", tv: "TBD", et: "TBD", status: "verified", src: SRC.gt },
  { id: "gt-uga", wk: 13, date: "2026-11-28", away: "georgia-tech", home: "georgia", tv: "TBD", et: "TBD", status: "verified", rivalry: "Clean, Old-Fashioned Hate", special: ["rivalry", "national"], note: "The in-state grudge match to close the season.", src: SRC.gt },

  // ---- Boise State (Pac-12) ----
  { id: "bsu-ore", wk: 1, date: "2026-09-05", away: "boise-state", home: "oregon", tv: "CBS", et: "3:30 PM", status: "verified", special: ["national"], note: "Giant-killer spot: Broncos at CFP-caliber Oregon. BSU 3-1 all-time vs Ducks.", src: SRC.bsu },
  { id: "bsu-mem", wk: 2, date: "2026-09-12", away: "memphis", home: "boise-state", tv: "TBD", et: "TBD", status: "verified", special: ["uniqueVenue"], note: "Home opener on The Blue; Memphis's first trip to the blue turf.", src: SRC.bsu },
  { id: "bsu-sd", wk: 3, date: "2026-09-19", away: "south-dakota", home: "boise-state", tv: "TBD", et: "TBD", status: "verified", src: SRC.bsu },
  { id: "bsu-wmu", wk: 4, date: "2026-09-26", away: "boise-state", home: "western-michigan", tv: "TBD", et: "TBD", status: "verified", special: ["national"], note: "Two of your teams: BSU at WMU. First-ever meeting.", src: SRC.bsu },
  { id: "bsu-usu", wk: 5, date: "2026-10-03", away: "utah-state", home: "boise-state", tv: "USA Network", et: "7:30 PM", status: "verified", special: ["uniqueVenue"], note: "Pac-12 opener on The Blue.", src: SRC.bsu },
  { id: "bsu-fres", wk: 6, date: "2026-10-10", away: "boise-state", home: "fresno-state", tv: "TBD", et: "TBD", status: "verified", rivalry: "Milk Can (BSU-Fresno)", src: SRC.bsu },
  { id: "bsu-wsu", wk: 8, date: "2026-10-24", away: "boise-state", home: "washington-state", tv: "TBD", et: "TBD", status: "verified", src: SRC.bsu },
  { id: "bsu-txst", wk: 9, date: "2026-10-31", away: "texas-state", home: "boise-state", tv: "TBD", et: "TBD", status: "verified", special: ["uniqueVenue"], note: "Halloween on The Blue.", src: SRC.bsu },
  { id: "bsu-csu", wk: 10, date: "2026-11-07", away: "boise-state", home: "colorado-state", tv: "TBD", et: "TBD", status: "verified", src: SRC.bsu },
  { id: "bsu-orst", wk: 11, date: "2026-11-14", away: "oregon-state", home: "boise-state", tv: "TBD", et: "TBD", status: "verified", src: SRC.bsu },
  { id: "bsu-sdsu", wk: 12, date: "2026-11-21", away: "san-diego-state", home: "boise-state", tv: "TBD", et: "TBD", status: "projected", note: "Date subject to change (Nov 20 or 21).", src: SRC.bsu },
  { id: "bsu-flex", wk: 13, date: "2026-11-28", away: "boise-state", home: "utah-state", tv: "TBD", et: "TBD", status: "tbd", note: "Pac-12 road 'flex' game — opponent (CSU/Fresno/USU/WSU) set 6 days out; doesn't count toward standings.", src: SRC.bsu },

  // ---- Western Michigan (MAC) — confirmed-date games ----
  { id: "wmu-mich", wk: 1, date: "2026-09-05", away: "western-michigan", home: "michigan", tv: "NBC", et: "7:30 PM", status: "verified", special: ["national"], note: "Opens at Michigan — root hard against the Wolverines.", src: SRC.wmu },
  { id: "wmu-monm", wk: 2, date: "2026-09-12", away: "monmouth", home: "western-michigan", tv: "ESPN+", et: "6:30 PM", status: "verified", note: "CommUniverCity home opener.", src: SRC.wmu },
  { id: "wmu-rice", wk: 3, date: "2026-09-19", away: "western-michigan", home: "rice", tv: "ESPN+", et: "7:00 PM", status: "verified", src: SRC.wmu },
  { id: "wmu-bgsu", wk: 9, date: "2026-10-31", away: "bowling-green", home: "western-michigan", tv: "TBD", et: "12:00 PM", status: "verified", note: "Family Day at Waldo Stadium.", src: SRC.wmu },

  // ---- Navy (AAC) — confirmed-date additions ----
  { id: "navy-unt", wk: 8, date: "2026-10-24", away: "north-texas", home: "navy", tv: "TBD", et: "TBD", status: "verified", note: "Navy Homecoming.", src: SRC.navy },

  // ---- James Madison (Sun Belt) ----
  { id: "jmu-lib", wk: 1, date: "2026-09-05", away: "liberty", home: "james-madison", tv: "TBD", et: "TBD", status: "verified", src: SRC.jmu },
  { id: "jmu-wag", wk: 2, date: "2026-09-12", away: "wagner", home: "james-madison", tv: "TBD", et: "TBD", status: "verified", src: SRC.jmu },
  { id: "jmu-sdsu", wk: 3, date: "2026-09-19", away: "james-madison", home: "san-diego-state", tv: "The CW", et: "10:00 PM", status: "verified", special: ["latenight", "national"], note: "First trip to California; late window.", src: SRC.jmu },
  { id: "jmu-odu", wk: 4, date: "2026-09-26", away: "james-madison", home: "old-dominion", tv: "TBD", et: "TBD", status: "verified", rivalry: "TowneBank Royal Rivalry", note: "Sun Belt opener.", src: SRC.jmu },
  { id: "jmu-mrsh", wk: 5, date: "2026-10-03", away: "marshall", home: "james-madison", tv: "TBD", et: "TBD", status: "verified", note: "Family Weekend.", src: SRC.jmu },
  { id: "jmu-gaso", wk: 6, date: "2026-10-10", away: "james-madison", home: "georgia-southern", tv: "TBD", et: "TBD", status: "verified", src: SRC.jmu },
  { id: "jmu-gast", wk: 7, date: "2026-10-17", away: "georgia-state", home: "james-madison", tv: "TBD", et: "TBD", status: "verified", note: "Homecoming.", src: SRC.jmu },
  { id: "jmu-app", wk: 8, date: "2026-10-22", away: "james-madison", home: "appalachian-state", tv: "ESPN", et: "TBD", status: "verified", special: ["weeknight"], note: "Thursday night at Boone.", src: SRC.jmu },
  { id: "jmu-troy", wk: 9, date: "2026-10-29", away: "troy", home: "james-madison", tv: "ESPN", et: "TBD", status: "verified", special: ["weeknight"], note: "Thursday night — rematch of the 2025 Sun Belt title game.", src: SRC.jmu },
  { id: "jmu-usm", wk: 10, date: "2026-11-05", away: "james-madison", home: "southern-miss", tv: "ESPN", et: "TBD", status: "verified", special: ["weeknight"], note: "Third straight Thursday.", src: SRC.jmu },
  { id: "jmu-conn", wk: 11, date: "2026-11-14", away: "james-madison", home: "uconn", tv: "TBD", et: "TBD", status: "verified", src: SRC.jmu },
  { id: "jmu-ccu", wk: 13, date: "2026-11-28", away: "coastal-carolina", home: "james-madison", tv: "TBD", et: "TBD", status: "verified", note: "Regular-season finale after a bye.", src: SRC.jmu },

  // ---- Jacksonville State (Conference USA) ----
  { id: "jsu-ndsu", wk: 0, date: "2026-08-29", away: "jacksonville-state", home: "north-dakota-state", tv: "TBD", et: "TBD", status: "verified", special: ["week0", "uniqueVenue", "national"], note: "Two of your teams in Week 0, in the Fargodome. Run-heavy vs run-heavy.", src: SRC.jsu },
  { id: "jsu-eku", wk: 1, date: "2026-09-05", away: "eastern-kentucky", home: "jacksonville-state", tv: "TBD", et: "TBD", status: "verified", src: SRC.jsu },
  { id: "jsu-ohio", wk: 2, date: "2026-09-12", away: "jacksonville-state", home: "ohio", tv: "TBD", et: "TBD", status: "verified", src: SRC.jsu },
  { id: "jsu-gaso", wk: 3, date: "2026-09-19", away: "georgia-southern", home: "jacksonville-state", tv: "TBD", et: "TBD", status: "verified", src: SRC.jsu },
  { id: "jsu-mtsu", wk: 4, date: "2026-09-26", away: "middle-tennessee", home: "jacksonville-state", tv: "TBD", et: "TBD", status: "verified", note: "C-USA opener.", src: SRC.jsu },
  { id: "jsu-kenn", wk: 6, date: "2026-10-07", away: "jacksonville-state", home: "kennesaw-state", tv: "TBD", et: "TBD", status: "verified", special: ["weeknight"], note: "Weekday C-USA; rematch of the 2025 C-USA title game.", src: SRC.jsu },
  { id: "jsu-fiu", wk: 7, date: "2026-10-13", away: "fiu", home: "jacksonville-state", tv: "TBD", et: "TBD", status: "verified", special: ["weeknight"], note: "Weekday C-USA.", src: SRC.jsu },
  { id: "jsu-nmsu", wk: 9, date: "2026-10-28", away: "jacksonville-state", home: "new-mexico-state", tv: "TBD", et: "TBD", status: "verified", special: ["weeknight"], src: SRC.jsu },
  { id: "jsu-shsu", wk: 10, date: "2026-11-07", away: "sam-houston", home: "jacksonville-state", tv: "TBD", et: "TBD", status: "verified", src: SRC.jsu },
  { id: "jsu-wku", wk: 11, date: "2026-11-14", away: "jacksonville-state", home: "western-kentucky", tv: "TBD", et: "TBD", status: "verified", src: SRC.jsu },
  { id: "jsu-most", wk: 12, date: "2026-11-21", away: "missouri-state", home: "jacksonville-state", tv: "TBD", et: "TBD", status: "verified", note: "Final home game.", src: SRC.jsu },
  { id: "jsu-del", wk: 13, date: "2026-11-28", away: "jacksonville-state", home: "delaware", tv: "TBD", et: "TBD", status: "verified", src: SRC.jsu },

  // ---- North Dakota State (Mountain West, FBS newcomer) — confirmed-date games ----
  { id: "ndsu-af", wk: 2, date: "2026-09-12", away: "air-force", home: "north-dakota-state", tv: "TBD", et: "TBD", status: "verified", special: ["academy", "uniqueVenue"], note: "Mountain West opener in the Fargodome vs a service academy. Very your-speed.", src: SRC.ndsu },
  { id: "ndsu-sac", wk: 3, date: "2026-09-19", away: "sacramento-state", home: "north-dakota-state", tv: "TBD", et: "TBD", status: "verified", note: "Two FBS newcomers.", src: SRC.ndsu },
  { id: "ndsu-sjsu", wk: 13, date: "2026-11-28", away: "north-dakota-state", home: "san-jose-state", tv: "TBD", et: "TBD", status: "verified", note: "Regular-season finale.", src: SRC.ndsu },

  // ===== ARMY-NAVY =====
  { id: "army-navy", wk: 15, date: "2026-12-12", away: "navy", home: "army", neutral: true, venue: "MetLife Stadium", city: "East Rutherford, NJ", tv: "CBS", et: "3:00 PM", status: "verified", rivalry: "Army–Navy Game", special: ["academy", "neutral", "rivalry"], note: "America's Game. The one every year.", src: SRC.navy },
];

/* ============================================================================
   ENGINES
   ========================================================================== */

// Projected preseason ranks (clearly NOT official AP — released late August)
const PROJ_SEED = {
  "notre-dame": 8, "oregon": 4, "lsu": 12, "miami": 10, "byu": 18,
  "texas-tech": 9, "michigan": 14, "oregon-state": 22, "boise-state": 25, "james-madison": 24,
  "clemson": 6, "texas": 5, "tennessee": 15, "ole-miss": 20, "alabama": 11, "georgia": 3,
  "auburn": 21, "texas-am": 16, "louisville": 19, "duke": 23, "virginia": 17, "georgia-tech": 13,
};
// RANK is live-updatable: seeded with projections, replaced by the real poll after a CFBD sync.
let RANK = { ...PROJ_SEED };
// LIVE bridge — populated by the CollegeFootballData sync so pure functions can read it.
const LIVE = { ranks: {}, lines: {}, weather: {}, scores: {}, games: [], teams: {}, stats: {}, rankHistory: {}, media: {}, pollName: null, week: null, lastSync: null, scoresAt: null };
function applyLive(live) {
  if (!live) return;
  LIVE.ranks = live.ranks || {};
  LIVE.lines = live.lines || {};
  LIVE.weather = live.weather || {};
  LIVE.scores = live.scores || {};
  LIVE.games = live.games || [];
  LIVE.teams = live.teams || {};
  LIVE.pollName = live.pollName || null;
  LIVE.week = live.week || null;
  LIVE.lastSync = live.lastSync || null;
  LIVE.scoresAt = live.scoresAt || null;
  LIVE.stats = live.stats || {};
  LIVE.rankHistory = live.rankHistory || {};
  LIVE.media = live.media || {};
  Object.keys(EXTRA_TEAMS).forEach((k) => delete EXTRA_TEAMS[k]);
  Object.assign(EXTRA_TEAMS, LIVE.teams);
  RANK = Object.keys(LIVE.ranks).length ? { ...LIVE.ranks } : { ...PROJ_SEED };
}

function computeJakeRating(g, priorities) {
  const reasons = [];
  let s = 2.0;
  const a = g.away, h = g.home;
  const isSel = (id) => TEAMS[id] && TEAMS[id].tier;
  const invSel = [a, h].filter(isSel);
  const pri = (id) => priorities.indexOf(id);

  // Tier-1 weighting (MSU > ND > WVU)
  const addTop = (id, base, label) => {
    if (a === id || h === id) { s += base; reasons.push(label); }
  };
  addTop("michigan-state", 4.2, "Michigan State — your #1 team");
  addTop("notre-dame", 3.5, "Notre Dame — your #2 team");
  addTop("west-virginia", 3.1, "West Virginia — your #3 team");

  // Other adopted teams
  invSel.forEach((id) => {
    if (TEAMS[id].tier === 2) { s += 1.9; reasons.push(`${TEAMS[id].short} — adopted team (${TEAMS[id].conf})`); }
  });

  // Both are your teams → bonus
  if (invSel.length === 2 && invSel.every((id) => TEAMS[id].tier)) {
    s += 1.0; reasons.push("Two of your teams face off");
  }

  if (g.rivalry) { s += 1.2; reasons.push(`Rivalry / trophy: ${g.rivalry}`); }
  const sp = g.special || [];
  if (sp.includes("international")) { s += 1.6; reasons.push("International game"); }
  if (sp.includes("week0")) { s += 0.6; reasons.push("Week 0 — earliest football on the board"); }
  if (sp.includes("academy")) { s += 0.9; reasons.push("Service academy football"); }
  if (sp.includes("neutral")) { s += 0.4; reasons.push("Neutral-site game"); }
  if (sp.includes("uniqueVenue")) { s += 0.6; reasons.push("Unique venue"); }
  if (sp.includes("primetime")) { s += 0.4; reasons.push("Primetime slot"); }
  if (sp.includes("latenight")) { s += 0.4; reasons.push("Late-night window"); }
  if (sp.includes("weeknight")) { s += 0.9; reasons.push("Weeknight football"); }
  if (sp.includes("snow")) { s += 0.8; reasons.push("Snow / weather potential"); }
  if (sp.includes("national")) { s += 0.6; reasons.push("Major national matchup"); }

  // Run-heavy / old-school bonus (Navy, NDSU, JSU, GT, WVU)
  if (invSel.some((id) => TEAMS[id].runHeavy)) { s += 0.6; reasons.push("Run-heavy / old-school identity"); }

  // Projected ranked involvement
  const ranked = [a, h].filter((id) => RANK[id]);
  if (ranked.length === 2) { s += 1.3; reasons.push("Projected ranked vs ranked"); }
  else if (ranked.length === 1) { s += 0.6; reasons.push("Projected Top 25 team involved"); }
  const top10 = [a, h].filter((id) => RANK[id] && RANK[id] <= 10);
  if (top10.length >= 1) { s += 0.6; reasons.push("Projected Top 10 team involved"); }

  // Schadenfreude: a disliked team you can root against
  const villains = [a, h].filter((id) => DISLIKED.includes(id));
  if (villains.length && invSel.length) { s += 0.6; reasons.push(`Chance to beat ${villains.map((v) => TEAMS[v].short).join("/")}`); }

  if (snowPotential(g)) { s += 0.7; reasons.push("Late-season cold-weather venue — snow potential"); }
  const lw = LIVE.weather && LIVE.weather[g.id];
  if (lw) {
    if (lw.snow > 0) { s += 0.9; reasons.push(`Snow in the forecast (${lw.snow}cm)`); }
    else if (lw.tMax != null && lw.tMax <= 32) { s += 0.6; reasons.push("Freezing-cold forecast"); }
    else if (lw.wind != null && lw.wind >= 25) { s += 0.4; reasons.push("High-wind forecast"); }
    else if (lw.precip != null && lw.precip >= 60) { s += 0.3; reasons.push("Wet-weather forecast"); }
  }

  const os = oldSchool(g);
  if (os.score >= 75) { s += 0.6; reasons.push(`Old-School Index ${os.score} — your kind of football`); }
  else if (os.score >= 60) { s += 0.3; reasons.push(`Old-School Index ${os.score}`); }

  s = Math.max(1, Math.min(10, s));
  return { score: Math.round(s * 10) / 10, reasons };
}

/* ---- Weather heuristic (static, API-free): late-season cold northern outdoor venues ---- */
const COLD_OUTDOOR = new Set([
  "michigan-state", "notre-dame", "west-virginia", "western-michigan", "wisconsin",
  "nebraska", "iowa-state", "rutgers", "syracuse", "boston-college", "kansas", "cincinnati", "michigan",
]);
function snowPotential(g) { return !g.neutral && g.wk >= 10 && COLD_OUTDOOR.has(g.home); }

/* ============================================================================
   OLD-SCHOOL INDEX — how "your kind of football" a game is (0–100)
   Static by default (works offline); sharpens with live run-rate after a sync.
   ========================================================================== */
const ACADEMY = new Set(["navy", "army", "airforce"]);
// normalized team name -> grit points (run-first / physical / tradition)
const GRIT = {
  navy: 5, army: 5, airforce: 5, northdakotastate: 4, georgiatech: 3, wisconsin: 3, iowa: 3,
  kansasstate: 3, stanford: 2, minnesota: 2, nebraska: 2, arkansas: 2, michiganstate: 2,
  westvirginia: 2, boisestate: 2, oklahomastate: 1, michigan: 2, pennstate: 2, ohiostate: 1,
  auburn: 2, lsu: 1, notredame: 2, utah: 2, airnavy: 0, jamesmadison: 1, jacksonvillestate: 1,
};
function grit(id) {
  const n = normName(T(id).name);
  let s = GRIT[n] || 0;
  const style = ((TEAMS[id] && TEAMS[id].style) || "").toLowerCase();
  if (/\b(run|ground|physical|option|smashmouth|power|trench|blue-collar|downhill|pound)\b/.test(style)) s += 2;
  if (/tradition|historic|old-school/.test(style)) s += 1;
  return s;
}
function oldSchool(g) {
  let s = 28; const badges = []; const reasons = [];
  const g1 = grit(g.away), g2 = grit(g.home);
  s += (g1 + g2) * 4;
  const acad = [g.away, g.home].filter((id) => ACADEMY.has(normName(T(id).name)));
  if (acad.length) { s += 18; badges.push("SERVICE ACADEMY"); reasons.push("Service-academy football"); }
  if (g1 >= 3 && g2 >= 3) { badges.push("TRENCH WAR"); s += 8; reasons.push("Two physical, run-first teams"); }
  else if (g1 >= 3 || g2 >= 3) { badges.push("RUN HEAVY"); s += 4; reasons.push("A run-first identity on the field"); }
  if (g.rivalry) { s += 12; reasons.push("Rivalry" + ((g.special || []).includes("trophy") ? " with a trophy" : "")); }
  const wsnow = LIVE.weather && LIVE.weather[g.id] && LIVE.weather[g.id].snow > 0;
  if (snowPotential(g) || wsnow) { s += 12; badges.push("SNOW BOWL"); reasons.push("Cold / snow weather"); }
  const sp = g.special || [];
  if (sp.includes("international")) { s += 6; reasons.push("International game"); }
  if (g.neutral) s += 3;
  if (sp.includes("uniqueVenue")) { s += 5; reasons.push("Unique venue"); }
  if (isWeeknight(g.date)) { s += 4; reasons.push("Weeknight lights"); }
  const rr = (id) => LIVE.stats && LIVE.stats[id] && LIVE.stats[id].rushRate;
  const r1 = rr(g.away), r2 = rr(g.home);
  if (r1 != null && r2 != null) { const avg = (r1 + r2) / 2; if (avg >= 0.56) { s += 10; if (!badges.includes("TRENCH WAR")) { if (!badges.includes("RUN HEAVY")) badges.push("RUN HEAVY"); } reasons.push(`Combined ${Math.round(avg * 100)}% run rate (live)`); } }
  const ranked = [g.away, g.home].filter((id) => RANK[id]);
  if (ranked.length === 1) { badges.push("GIANT-KILLER?"); reasons.push("An unranked side with a puncher's chance"); s += 4; }
  s = Math.max(0, Math.min(100, Math.round(s)));
  return { score: s, badges: [...new Set(badges)], reasons };
}
function jakesTake(g, priorities) {
  const t1 = [g.away, g.home].filter((id) => TEAMS[id] && TEAMS[id].tier === 1);
  const villain = [g.away, g.home].filter((id) => DISLIKED.includes(id));
  const os = oldSchool(g);
  if (t1.length === 2) return "Two of your Tier-1 teams on one field — no way to lose.";
  if (t1.length) { const m = T(t1[0]).short; return villain.length ? `${m} vs a team you can't stand. Circle it in red.` : `${m} is on — everything else is a second screen.`; }
  const t2 = [g.away, g.home].filter((id) => TEAMS[id] && TEAMS[id].tier === 2);
  if (villain.length && g.rivalry) return `Root for chaos — ${villain.map((v) => T(v).short).join("/")} in a rivalry you'd love to watch them lose.`;
  if (os.badges.includes("SERVICE ACADEMY")) return "Flexbone, three yards and a cloud of dust. Exactly your Saturday.";
  if (os.badges.includes("SNOW BOWL")) return "Bad weather, good football. Bundle up.";
  if (os.badges.includes("TRENCH WAR")) return "This one's won in the trenches. Bring a hard hat.";
  if (t2.length) return `${T(t2[0]).short} — one of your adopted teams. Keep tabs.`;
  if (os.badges.includes("GIANT-KILLER?")) return "Upset paper: the little guy has a real shot.";
  if (os.score >= 70) return "Old-school to the bone. This is why you watch.";
  if ([g.away, g.home].some((id) => RANK[id] && RANK[id] <= 10)) return "Top-10 heat — big-boy football.";
  return null;
}

/* ============================================================================
   WAR ROOM — cross-country rooting scenarios
   ========================================================================== */
const TIER1 = ["michigan-state", "notre-dame", "west-virginia"];
function weekRooting(wk) {
  const games = gamesForWeek(wk).filter((g) => !TIER1.includes(g.away) && !TIER1.includes(g.home) && !(g.away === g.home));
  const out = [];
  games.forEach((g) => {
    const a = g.away, h = g.home;
    let rootFor = null, weight = 0, reason = ""; const helps = [];
    TIER1.forEach((my) => {
      const myConf = normConf(TEAMS[my].conf);
      const aComp = myConf && normConf(T(a).conf) === myConf;
      const hComp = myConf && normConf(T(h).conf) === myConf;
      const aVill = DISLIKED.includes(a), hVill = DISLIKED.includes(h);
      let rf = null, w = 0, why = "";
      if (aComp && hComp) {
        const ra = RANK[a] || 99, rh = RANK[h] || 99;
        const strong = ra <= rh ? a : h; rf = strong === a ? h : a;
        w = RANK[strong] ? 3 : 1; why = `${T(strong).short} is a ${myConf} rival — a loss helps ${TEAMS[my].short}`;
      } else if (aComp || hComp) {
        const comp = aComp ? a : h; rf = aComp ? h : a;
        w = RANK[comp] ? 3 : 1; why = `${T(comp).short} (${myConf}) losing helps ${TEAMS[my].short}'s race`;
      }
      if (aVill || hVill) {
        const vill = aVill ? a : h; rf = aVill ? h : a;
        w = Math.max(w, RANK[vill] ? 3 : 2) + 1; why = `Root against ${T(vill).short}`;
      }
      if (my === "notre-dame" && !aComp && !hComp && (RANK[a] || RANK[h])) {
        const ranked = [a, h].filter((id) => RANK[id]);
        if (ranked.length === 1) { rf = [a, h].find((id) => !RANK[id]); w = Math.max(w, 2); why = `${T(ranked[0]).short} losing clears ND's at-large path`; }
      }
      if (rf && w > 0) { helps.push(TEAMS[my].short); if (w > weight) { weight = w; rootFor = rf; reason = why; } }
    });
    if (rootFor) out.push({ g, rootFor, helps: [...new Set(helps)], reason, weight });
  });
  return out.sort((x, y) => y.weight - x.weight);
}
function remainingFor(id, results) {
  const games = GAMES.filter((g) => g.away === id || g.home === id);
  const played = games.filter((g) => results[g.id]).length;
  const rankedLeft = games.filter((g) => !results[g.id] && [g.away, g.home].some((t) => t !== id && RANK[t])).length;
  return { total: games.length, played, remaining: games.length - played, rankedLeft };
}

/* ---- Records & standings engine (fed by manual result entry) ---- */
function isConfGame(g) {
  const a = normConf(TEAMS[g.away] && TEAMS[g.away].conf);
  const h = normConf(TEAMS[g.home] && TEAMS[g.home].conf);
  return !!a && a === h && a !== "Independents";
}
function teamRecord(teamId, results) {
  const games = GAMES.filter((g) => (g.away === teamId || g.home === teamId) && results[g.id])
    .sort((a, b) => a.date.localeCompare(b.date));
  const R = { w: 0, l: 0, cw: 0, cl: 0, hw: 0, hl: 0, aw: 0, al: 0, nw: 0, nl: 0, played: games.length };
  const seq = [];
  games.forEach((g) => {
    const r = results[g.id];
    const isHome = g.home === teamId;
    const won = (r.winner === "home" && isHome) || (r.winner === "away" && !isHome);
    won ? R.w++ : R.l++;
    if (isConfGame(g)) { won ? R.cw++ : R.cl++; }
    if (g.neutral) { won ? R.nw++ : R.nl++; }
    else if (isHome) { won ? R.hw++ : R.hl++; }
    else { won ? R.aw++ : R.al++; }
    seq.push(won ? "W" : "L");
  });
  let streak = "—";
  if (seq.length) { const last = seq[seq.length - 1]; let n = 0; for (let i = seq.length - 1; i >= 0 && seq[i] === last; i--) n++; streak = `${last}${n}`; }
  return { ...R, streak, last5: seq.slice(-5), bowlEligible: R.w >= 6 };
}
function conferenceStandings(confKey, results) {
  const members = Object.values(TEAMS).filter((t) => normConf(t.conf) === confKey).map((t) => t.id);
  return members.map((id) => ({ id, rec: teamRecord(id, results) })).sort((a, b) => {
    const ap = (a.rec.cw + a.rec.cl) ? a.rec.cw / (a.rec.cw + a.rec.cl) : -1;
    const bp = (b.rec.cw + b.rec.cl) ? b.rec.cw / (b.rec.cw + b.rec.cl) : -1;
    if (bp !== ap) return bp - ap;
    return (b.rec.w - b.rec.l) - (a.rec.w - a.rec.l);
  });
}

function tierFor(g, rating) {
  const a = g.away, h = g.home, sp = g.special || [];
  const has = (id) => a === id || h === id;
  if (has("michigan-state") && (g.rivalry || rating >= 8)) return "S";
  if (rating >= 8.6) return "S";
  if (sp.includes("international")) return "S";
  if (has("michigan-state") || has("notre-dame") || has("west-virginia")) return rating >= 7 ? "A" : "B";
  if (rating >= 7) return "A";
  if (rating >= 5.5) return "B";
  return "C";
}

function rootingFor(g, priorities) {
  const a = g.away, h = g.home;
  const sel = [a, h].filter((id) => TEAMS[id] && TEAMS[id].tier);
  const dis = [a, h].filter((id) => DISLIKED.includes(id));

  if (sel.length === 2) {
    // both your teams — pick higher priority
    const win = priorities.indexOf(sel[0]) < priorities.indexOf(sel[1]) ? sel[0] : sel[1];
    const lose = win === sel[0] ? sel[1] : sel[0];
    return { team: win, text: `Root ${TEAMS[win].short}. Both are yours — ${TEAMS[win].short} outranks ${TEAMS[lose].short} in your order, so it wins the tie. Bittersweet either way.` };
  }
  if (sel.length === 1) {
    const me = sel[0], opp = me === a ? h : a;
    let t = `Root ${TEAMS[me].short} — your ${TEAMS[me].tier === 1 ? "#" + TEAMS[me].priority : "adopted"} team.`;
    if (DISLIKED.includes(opp)) t += ` Bonus: ${TEAMS[opp].short} is one you root against.`;
    return { team: me, text: t };
  }
  // no selected team
  if (dis.length === 1) {
    const villain = dis[0], other = villain === a ? h : a;
    return { team: other, text: `Root ${TEAMS[other].short}. ${TEAMS[villain].short} is a team you root against.` };
  }
  if (dis.length === 2) {
    return { team: null, text: `No dog in this fight — both ${TEAMS[a].short} and ${TEAMS[h].short} are on your dislike list. Root for chaos, injuries to no one, and a result that muddies their playoff math.` };
  }
  // default: underdog / lower projected rank, else run-heavy
  const ar = RANK[a] || 99, hr = RANK[h] || 99;
  const dog = ar > hr ? a : h;
  return { team: dog, text: `No stake here — lean ${TEAMS[dog].short} as the underdog. Chaos helps everyone below the projected favorite.` };
}

function isWeeknight(dateStr) {
  const d = new Date(dateStr + "T12:00:00");
  const day = d.getDay(); // 0 Sun ... 6 Sat
  return day >= 2 && day <= 5; // Tue-Fri
}

function dayName(dateStr) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", { weekday: "long" });
}
function shortDate(dateStr) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Saturday windows by ET kickoff
function windowFor(g) {
  if (dayName(g.date) !== "Saturday") return dayName(g.date);
  if (!g.et || g.et === "TBD") return "Time TBD";
  const m = g.et.match(/(\d+):(\d+)\s*(AM|PM)/);
  if (!m) return "Time TBD";
  let hr = parseInt(m[1], 10);
  if (m[3] === "PM" && hr !== 12) hr += 12;
  if (m[3] === "AM" && hr === 12) hr = 0;
  if (hr < 12) return "Morning";
  if (hr < 13) return "Noon";
  if (hr < 15) return "Early Afternoon";
  if (hr < 17) return "3:30 Window";
  if (hr < 19) return "Early Evening";
  if (hr < 22) return "Primetime";
  return "Late Night";
}

const WEEKS = [
  { wk: 0, label: "Week 0", date: "2026-08-29" },
  ...Array.from({ length: 13 }, (_, i) => ({ wk: i + 1, label: `Week ${i + 1}`, date: ["2026-09-05","2026-09-12","2026-09-19","2026-09-26","2026-10-03","2026-10-10","2026-10-17","2026-10-24","2026-10-31","2026-11-07","2026-11-14","2026-11-21","2026-11-28"][i] })),
  { wk: 15, label: "Army–Navy", date: "2026-12-12" },
];

// Map any date to the nearest weekend bucket in WEEKS (so live national games slot into the right week).
function weekForDate(dateStr) {
  const t = new Date(dateStr + "T12:00:00").getTime();
  let best = WEEKS[0].wk, bestDiff = Infinity;
  WEEKS.forEach((w) => { const diff = Math.abs(new Date(w.date + "T12:00:00").getTime() - t); if (diff < bestDiff) { bestDiff = diff; best = w.wk; } });
  return best;
}
// Deterministic display bits for national teams that aren't in the hand-built seed.
function shortFromName(name) {
  const clean = (name || "").replace(/[^A-Za-z ]/g, "").trim();
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length >= 2) { const ini = words.map((w) => w[0]).join("").toUpperCase(); if (ini.length >= 2 && ini.length <= 4) return ini; }
  return clean.replace(/\s/g, "").slice(0, 4).toUpperCase() || "TBD";
}
function colorFromName(name) {
  let h = 0; for (let i = 0; i < (name || "").length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  const hue = h % 360; return [`hsl(${hue} 55% 32%)`, "#f0f0f0"];
}
// Combined seed + live national games for a given week (seed wins on duplicates).
function gamesForWeek(wk) {
  const seed = GAMES.filter((g) => g.wk === wk);
  if (!LIVE.games || !LIVE.games.length) return seed;
  const seen = new Set(seed.map((g) => [normName(T(g.away).name), normName(T(g.home).name)].sort().join("|")));
  const extra = LIVE.games.filter((g) => g.wk === wk && !seen.has([normName(T(g.away).name), normName(T(g.home).name)].sort().join("|")));
  return seed.concat(extra);
}
function allCombinedGames() {
  const seed = GAMES;
  if (!LIVE.games || !LIVE.games.length) return seed;
  const seen = new Set(seed.map((g) => [normName(T(g.away).name), normName(T(g.home).name)].sort().join("|")));
  return seed.concat(LIVE.games.filter((g) => !seen.has([normName(T(g.away).name), normName(T(g.home).name)].sort().join("|"))));
}

/* ============================================================================
   STORAGE HOOK
   ========================================================================== */
function useStore(key, initial) {
  const [val, setVal] = useState(initial);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const r = await window.storage.get(key);
        if (live && r && r.value) setVal(JSON.parse(r.value));
      } catch (e) { /* first run, no key */ }
      if (live) setLoaded(true);
    })();
    return () => { live = false; };
  }, [key]);
  const save = useCallback(async (next) => {
    setVal(next);
    try { await window.storage.set(key, JSON.stringify(next)); } catch (e) { /* best effort */ }
  }, [key]);
  return [val, save, loaded];
}

/* ============================================================================
   SMALL UI PIECES
   ========================================================================== */
let C = {
  bg: "#0d0f0e", panel: "#15181a", panel2: "#1b1f22", line: "#2a2f33",
  amber: "#f2b134", green: "#3ecf6b", ink: "#e7e9e8", dim: "#8b9299", red: "#ef5b5b",
};
const THEMES = {
  command: { label: "Command", swatch: "#f2b134", c: { bg: "#0d0f0e", panel: "#15181a", panel2: "#1b1f22", line: "#2a2f33", amber: "#f2b134", green: "#3ecf6b", ink: "#e7e9e8", dim: "#8b9299", red: "#ef5b5b" } },
  blackout: { label: "Blackout", swatch: "#ffffff", c: { bg: "#000000", panel: "#0b0b0b", panel2: "#141414", line: "#262626", amber: "#ffffff", green: "#5adf85", ink: "#f4f4f4", dim: "#7d7d7d", red: "#ff5757" } },
  snow: { label: "Snow", swatch: "#8fc7ff", c: { bg: "#0c1116", panel: "#141c24", panel2: "#1b2530", line: "#2b3947", amber: "#8fc7ff", green: "#7fe0c0", ink: "#eaf2fa", dim: "#8ba0b3", red: "#ff8a8a" } },
  crt: { label: "Retro CRT", swatch: "#39ff9c", c: { bg: "#05100a", panel: "#0a1a10", panel2: "#0f2417", line: "#1c3a26", amber: "#39ff9c", green: "#39ff9c", ink: "#c9ffe0", dim: "#5f9e78", red: "#ff6b6b" } },
  whiteout: { label: "Whiteout", swatch: "#0d0f0e", c: { bg: "#eef1f3", panel: "#ffffff", panel2: "#f3f6f8", line: "#d5dbe0", amber: "#c67b00", green: "#1f9d52", ink: "#14181b", dim: "#5c6873", red: "#cc3b3b" } },
};
function applyTheme(name) { const t = THEMES[name] || THEMES.command; Object.assign(C, t.c); if (typeof document !== "undefined") { try { document.body.style.background = t.c.bg; document.documentElement.style.setProperty("--gc-theme-bg", t.c.bg); } catch (e) { /* ignore */ } } }

function Crest({ t, size = 34 }) {
  const c1 = t.colors[0] || "#555", c2 = t.colors[1] || "#999";
  const fs = 14.5 * (String(t.short).length > 4 ? 0.8 : 1);
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ flexShrink: 0, display: "block" }} aria-label={t.short}>
      <rect x="1.5" y="1.5" width="37" height="37" rx="9" fill={c1} stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
      <path d="M40 2 L40 18 L22 40 L6 40 Z" fill={c2} opacity="0.22" />
      <rect x="1.5" y="1.5" width="37" height="13" rx="9" fill="rgba(255,255,255,0.10)" />
      <rect x="4" y="14.5" width="32" height="12.5" rx="3" fill="rgba(0,0,0,0.34)" />
      <text x="20" y="23.7" textAnchor="middle" fontSize={fs} fontWeight="800" fill="#fff" fontFamily="var(--gc-mono)" letterSpacing="-0.5">{t.short}</text>
    </svg>
  );
}
function Logo({ id, size = 34 }) {
  const t = T(id);
  const src = LOGO_DATA[id] || (t.logos && t.logos[0]) || null;
  const [err, setErr] = useState(false);
  useEffect(() => { setErr(false); }, [src]);
  if (!src || err) return <Crest t={t} size={size} />;
  return (
    <span style={{ width: size, height: size, flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: size >= 20 ? 8 : 5, background: "rgba(255,255,255,0.06)" }}>
      <img src={src} alt={t.short} loading="lazy" onError={() => setErr(true)} style={{ width: size * 0.84, height: size * 0.84, objectFit: "contain", display: "block" }} />
    </span>
  );
}

function StatusDot({ status }) {
  const map = { verified: [C.green, "Verified"], projected: [C.amber, "Projected"], tbd: [C.dim, "TBD"] };
  const [c, label] = map[status] || map.tbd;
  return <span title={label} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, color: c, textTransform: "uppercase", letterSpacing: "0.5px" }}>
    <span style={{ width: 6, height: 6, borderRadius: 99, background: c }} /> {label}
  </span>;
}

function TierBadge({ tier }) {
  const map = { S: C.amber, A: C.green, B: "#5aa9e6", C: C.dim };
  return <span style={{ width: 22, height: 22, borderRadius: 6, background: map[tier] + "22", color: map[tier],
    border: `1px solid ${map[tier]}66`, display: "inline-flex", alignItems: "center", justifyContent: "center",
    fontWeight: 800, fontSize: 12, animation: tier === "S" ? "gc-pulse 2.2s ease-in-out infinite" : undefined }}>{tier}</span>;
}

function Rating({ v }) {
  const c = v >= 8.6 ? C.amber : v >= 7 ? C.green : v >= 5.5 ? "#5aa9e6" : C.dim;
  const r = 13.5, circ = 2 * Math.PI * r, frac = Math.max(0, Math.min(1, v / 10));
  return (
    <svg width="38" height="38" viewBox="0 0 38 38" style={{ flexShrink: 0 }}>
      <circle cx="19" cy="19" r={r} fill="none" stroke={C.line} strokeWidth="3" />
      <circle cx="19" cy="19" r={r} fill="none" stroke={c} strokeWidth="3" strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={circ * (1 - frac)} transform="rotate(-90 19 19)"
        style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(.2,.8,.2,1)" }} />
      <text x="19" y="22.5" textAnchor="middle" fontSize="12.5" fontWeight="800" fill={c} fontFamily="var(--gc-mono)">{v.toFixed(1)}</text>
    </svg>
  );
}

function Chip({ children, color = C.dim, icon: Icon }) {
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10, padding: "2px 6px",
    borderRadius: 5, background: color + "18", color, border: `1px solid ${color}33`, whiteSpace: "nowrap" }}>
    {Icon && <Icon size={10} />}{children}
  </span>;
}

function specialChips(g) {
  const out = [];
  const sp = g.special || [];
  if (sp.includes("international")) out.push(<Chip key="i" color="#4ec9b0" icon={Plane}>Ireland</Chip>);
  if (sp.includes("week0")) out.push(<Chip key="w0" color={C.amber}>Week 0</Chip>);
  if (sp.includes("academy")) out.push(<Chip key="ac" color="#c5b783" icon={Anchor}>Academy</Chip>);
  if (g.rivalry) out.push(<Chip key="r" color="#e0995e" icon={Trophy}>{g.rivalry}</Chip>);
  if (sp.includes("neutral")) out.push(<Chip key="n" color={C.dim} icon={MapPin}>Neutral</Chip>);
  if (sp.includes("primetime")) out.push(<Chip key="p" color="#b388ff" icon={Moon}>Primetime</Chip>);
  if (sp.includes("latenight")) out.push(<Chip key="l" color="#7c8cff" icon={Moon}>Late Night</Chip>);
  if (LIVE.weather && LIVE.weather[g.id] && LIVE.weather[g.id].snow > 0) out.push(<Chip key="snw" color="#8fd3ff" icon={Snowflake}>Snow forecast</Chip>);
  else if (sp.includes("snow")) out.push(<Chip key="s" color="#8fd3ff" icon={Snowflake}>Snow watch</Chip>);
  else if (snowPotential(g)) out.push(<Chip key="sp" color="#8fd3ff" icon={Snowflake}>Snow potential</Chip>);
  if (isWeeknight(g.date)) out.push(<Chip key="wn" color={C.green} icon={Radio}>Weeknight</Chip>);
  if (sp.includes("national")) out.push(<Chip key="na" color="#5aa9e6" icon={Star}>National</Chip>);
  const os = oldSchool(g);
  if (os.badges.includes("TRENCH WAR")) out.push(<Chip key="tw" color="#d98a5a" icon={Shield}>Trench War</Chip>);
  else if (os.badges.includes("RUN HEAVY")) out.push(<Chip key="rh" color="#d98a5a" icon={Shield}>Run Heavy</Chip>);
  if (os.badges.includes("GIANT-KILLER?")) out.push(<Chip key="gk" color="#c77dff" icon={Zap}>Giant-Killer?</Chip>);
  if (os.score >= 78) out.push(<Chip key="th" color={C.amber} icon={Flame}>Old-School {os.score}</Chip>);
  return out;
}

/* ============================================================================
   GAME CARD
   ========================================================================== */
const MATCHUP_CACHE = {};
function SeriesHistory({ g }) {
  const cacheKey = "m-" + [normName(T(g.away).name), normName(T(g.home).name)].sort().join("-");
  const [data, setData] = useState(MATCHUP_CACHE[cacheKey] || null);
  const [state, setState] = useState(MATCHUP_CACHE[cacheKey] ? "done" : "idle");
  useEffect(() => {
    let alive = true;
    if (MATCHUP_CACHE[cacheKey]) { setData(MATCHUP_CACHE[cacheKey]); setState("done"); return; }
    const apiKey = (typeof window !== "undefined" && window.CFBD_KEY) || "";
    if (!apiKey) { setState("silent"); return; }
    if (typeof navigator !== "undefined" && navigator.onLine === false) { setState("silent"); return; }
    (async () => {
      setState("loading");
      try {
        try { const r = await window.storage.get("cfb:matchups"); if (r && r.value) { const all = JSON.parse(r.value); if (all[cacheKey]) { MATCHUP_CACHE[cacheKey] = all[cacheKey]; if (alive) { setData(all[cacheKey]); setState("done"); } return; } } } catch (e) { /* ignore */ }
        const res = await fetch(`${cfbdBase()}/teams/matchup?team1=${encodeURIComponent(T(g.away).name)}&team2=${encodeURIComponent(T(g.home).name)}`, { headers: proxied() ? {} : { Authorization: "Bearer " + apiKey } });
        if (!res.ok) { if (alive) setState("silent"); return; }
        const j = await res.json();
        const games = j.games || [];
        const d = { team1: j.team1, team2: j.team2, team1Wins: j.team1Wins || 0, team2Wins: j.team2Wins || 0, ties: j.ties || 0, last: games.length ? games[games.length - 1] : null };
        MATCHUP_CACHE[cacheKey] = d;
        try { const r = await window.storage.get("cfb:matchups"); const all = r && r.value ? JSON.parse(r.value) : {}; all[cacheKey] = d; await window.storage.set("cfb:matchups", JSON.stringify(all)); } catch (e) { /* ignore */ }
        if (alive) { setData(d); setState("done"); }
      } catch (e) { if (alive) setState("silent"); }
    })();
    return () => { alive = false; };
  }, [cacheKey]);
  if (state === "loading") return <Row icon={Info} label="Series">Loading all-time history…</Row>;
  if (state !== "done" || !data) return null;
  const total = data.team1Wins + data.team2Wins + data.ties;
  if (!total) return null;
  const aWins = normName(data.team1) === normName(T(g.away).name) ? data.team1Wins : data.team2Wins;
  const hWins = normName(data.team1) === normName(T(g.home).name) ? data.team1Wins : data.team2Wins;
  const last = data.last;
  return (
    <div style={{ background: C.panel2, borderRadius: 8, padding: 10 }}>
      <div style={{ fontSize: 10, letterSpacing: "1px", color: C.amber, marginBottom: 4 }}>ALL-TIME SERIES</div>
      <div style={{ fontSize: 12, color: C.ink }}>{T(g.away).short} {aWins}–{hWins} {T(g.home).short}{data.ties ? ` · ${data.ties} ties` : ""} · {total} meetings</div>
      {last && (last.team1Score != null || last.winner) && <div style={{ fontSize: 11, color: C.dim, marginTop: 2 }}>Last meeting: {last.season}{last.winner ? ` — ${last.winner} won` : ""}{last.team1Score != null ? ` ${last.team1Score}-${last.team2Score}` : ""}</div>}
    </div>
  );
}

function GameCard({ g, priorities, watched, overrides, results, onWatch, onOverride, onResult, expanded, onToggle }) {
  const base = computeJakeRating(g, priorities);
  const ov = overrides[g.id] || {};
  const rating = ov.jakeRating != null ? ov.jakeRating : base.score;
  const tier = ov.forced ? "S" : (ov.tier || tierFor(g, rating));
  const root = rootingFor(g, priorities);
  const w = watched[g.id] || {};
  const res = (results || {})[g.id];
  const a = T(g.away), h = T(g.home);
  const mine = [g.away, g.home].some((id) => TEAMS[id] && TEAMS[id].tier);
  const et = ov.et || g.et, tv = ov.tv || g.tv;
  const setRes = (patch) => onResult && onResult(g.id, patch);

  return (
    <div style={{ background: C.panel, border: `1px solid ${ov.forced ? C.amber : (mine ? C.amber + "44" : C.line)}`, borderRadius: 12, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", cursor: "pointer" }} onClick={onToggle}>
        <TierBadge tier={tier} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <Logo id={g.away} size={26} />
            <span style={{ color: C.dim, fontSize: 12 }}>{g.neutral ? "vs" : "@"}</span>
            <Logo id={g.home} size={26} />
            <span style={{ color: C.ink, fontWeight: 600, fontSize: 13, marginLeft: 2 }}>
              {a.short} {g.neutral ? "vs" : "at"} {h.short}
            </span>
            {res && res.winner && (
              <span style={{ marginLeft: 4, fontSize: 11, color: C.green, fontFamily: "ui-monospace, monospace" }}>
                {res.as != null && res.hs != null ? `${res.as}–${res.hs} ` : ""}({res.winner === "away" ? a.short : h.short} W)
              </span>
            )}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 4, color: C.dim, fontSize: 11, flexWrap: "wrap" }}>
            <span><Clock size={10} style={{ verticalAlign: -1 }} /> {shortDate(g.date)} · {et || "TBD"}{ov.et ? " *" : ""}</span>
            <span><Tv size={10} style={{ verticalAlign: -1 }} /> {whereToWatch(g) || tv || "TBD"}{whereToWatch(g) ? "" : ov.tv ? " *" : ""}</span>
          </div>
        </div>
        {w.favorite && <Star size={13} color={C.amber} fill={C.amber} />}
        <Rating v={rating} />
        <ChevronRight size={16} color={C.dim} style={{ transform: expanded ? "rotate(90deg)" : "none", transition: "0.15s" }} />
      </div>

      <div style={{ padding: "0 12px 8px", display: "flex", gap: 5, flexWrap: "wrap" }}>
        {ov.forced && <Chip color={C.amber} icon={Star}>Must-watch</Chip>}
        {w.recorded && <Chip color="#b388ff" icon={Radio}>Recorded</Chip>}
        {specialChips(g)}
      </div>

      {expanded && (
        <div style={{ borderTop: `1px solid ${C.line}`, padding: 12, display: "grid", gap: 12 }}>
          {(() => { const take = jakesTake(g, priorities); return take ? (
            <div style={{ background: C.amber + "14", border: `1px solid ${C.amber}44`, borderRadius: 8, padding: 10 }}>
              <div style={{ fontSize: 10, letterSpacing: "1px", color: C.amber, marginBottom: 3, display: "flex", alignItems: "center", gap: 4 }}><Flame size={11} /> JAKE'S TAKE</div>
              <div style={{ fontSize: 12.5, color: C.ink, lineHeight: 1.5, fontStyle: "italic" }}>{take}</div>
            </div>
          ) : null; })()}

          {(() => { const os = oldSchool(g); const c = os.score >= 75 ? C.amber : os.score >= 55 ? "#d98a5a" : C.dim; return (
            <div style={{ background: C.panel2, borderRadius: 8, padding: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 10, letterSpacing: "1px", color: c, display: "flex", alignItems: "center", gap: 4 }}><Shield size={11} /> OLD-SCHOOL INDEX</span>
                <span style={{ fontSize: 15, fontWeight: 800, color: c, fontFamily: "var(--gc-mono)" }}>{os.score}</span>
              </div>
              <div style={{ height: 6, background: C.line, borderRadius: 99, overflow: "hidden" }}><div style={{ width: os.score + "%", height: "100%", background: c, transition: "width .5s ease" }} /></div>
              {os.reasons.length > 0 && <div style={{ fontSize: 10.5, color: C.dim, marginTop: 6, lineHeight: 1.5 }}>{os.reasons.join(" · ")}</div>}
            </div>
          ); })()}

          {g.venue && <Row icon={MapPin} label="Venue">{g.venue} · {g.city}</Row>}
          {weatherLabel(g) && <Row icon={Snowflake} label="Weather">{weatherLabel(g)}</Row>}
          {lineLabel(g) && <Row icon={TrendingUp} label="Line">{lineLabel(g)}{typeof LIVE.lines[g.id] === "number" ? " (live)" : ""}</Row>}
          {(() => { const p = spProjection(g); return p ? <Row icon={Target} label="SP+ pick">{T(p.fav).short} by {p.by.toFixed(1)}</Row> : null; })()}
          <SeriesHistory g={g} />
          {g.note && <div style={{ fontSize: 12, color: C.ink, background: C.panel2, padding: 8, borderRadius: 8, lineHeight: 1.5 }}>{g.note}</div>}

          <div style={{ background: C.panel2, borderRadius: 8, padding: 10 }}>
            <div style={{ fontSize: 10, letterSpacing: "1px", color: C.amber, marginBottom: 6 }}>WHY THIS RATING · {rating.toFixed(1)}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {base.reasons.map((r, i) => <div key={i} style={{ fontSize: 11.5, color: C.dim }}>• {r}</div>)}
            </div>
          </div>

          <div style={{ background: root.team ? T(root.team).colors[0] + "22" : C.panel2, borderRadius: 8, padding: 10, border: `1px solid ${root.team ? T(root.team).colors[0] + "55" : C.line}` }}>
            <div style={{ fontSize: 10, letterSpacing: "1px", color: C.green, marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}><Flag size={11} /> ROOTING GUIDE</div>
            <div style={{ fontSize: 12, color: C.ink, lineHeight: 1.5 }}>{root.text}</div>
          </div>

          {/* RESULT ENTRY */}
          <div style={{ background: C.panel2, borderRadius: 8, padding: 10 }}>
            <div style={{ fontSize: 10, letterSpacing: "1px", color: C.amber, marginBottom: 6 }}>RESULT (drives records & standings)</div>
            <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
              <button onClick={() => setRes({ ...(res || {}), winner: res && res.winner === "away" ? null : "away" })}
                style={{ fontSize: 11, padding: "5px 9px", borderRadius: 7, cursor: "pointer", background: res && res.winner === "away" ? C.green + "22" : C.panel, color: res && res.winner === "away" ? C.green : C.dim, border: `1px solid ${res && res.winner === "away" ? C.green + "66" : C.line}` }}>{a.short} won</button>
              <button onClick={() => setRes({ ...(res || {}), winner: res && res.winner === "home" ? null : "home" })}
                style={{ fontSize: 11, padding: "5px 9px", borderRadius: 7, cursor: "pointer", background: res && res.winner === "home" ? C.green + "22" : C.panel, color: res && res.winner === "home" ? C.green : C.dim, border: `1px solid ${res && res.winner === "home" ? C.green + "66" : C.line}` }}>{h.short} won</button>
              <span style={{ fontSize: 11, color: C.dim, marginLeft: 4 }}>Score:</span>
              <input type="number" placeholder={a.short} value={res && res.as != null ? res.as : ""} onChange={(e) => setRes({ ...(res || {}), as: e.target.value === "" ? null : parseInt(e.target.value, 10) })}
                style={{ width: 52, background: C.panel, color: C.ink, border: `1px solid ${C.line}`, borderRadius: 6, padding: "4px 6px", fontSize: 12 }} />
              <span style={{ color: C.dim }}>–</span>
              <input type="number" placeholder={h.short} value={res && res.hs != null ? res.hs : ""} onChange={(e) => setRes({ ...(res || {}), hs: e.target.value === "" ? null : parseInt(e.target.value, 10) })}
                style={{ width: 52, background: C.panel, color: C.ink, border: `1px solid ${C.line}`, borderRadius: 6, padding: "4px 6px", fontSize: 12 }} />
              {res && <button onClick={() => setRes(null)} style={{ fontSize: 10, color: C.amber, background: "none", border: "none", cursor: "pointer" }}>clear</button>}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <StatusDot status={g.status} />
            <button onClick={() => shareGameImage(g, priorities)} style={{ ...pillBtn, fontSize: 11, color: C.amber, borderColor: C.amber + "66" }}><Share2 size={12} style={{ verticalAlign: -2 }} /> Share graphic</button>
          </div>
          {g.src && <div style={{ fontSize: 10, color: C.dim }}>Source: {g.src}</div>}

          {/* Watch controls */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {[["live", "Watched live"], ["partial", "Partial"], ["replay", "Replay"], ["skip", "Skipped"]].map(([k, lbl]) => (
              <button key={k} onClick={() => onWatch(g.id, { ...w, status: w.status === k ? null : k })}
                style={{ fontSize: 11, padding: "5px 9px", borderRadius: 7, cursor: "pointer",
                  background: w.status === k ? C.green + "22" : C.panel2, color: w.status === k ? C.green : C.dim,
                  border: `1px solid ${w.status === k ? C.green + "66" : C.line}` }}>
                {w.status === k ? <CheckCircle2 size={11} style={{ verticalAlign: -2 }} /> : null} {lbl}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <TogBtn on={w.favorite} onClick={() => onWatch(g.id, { ...w, favorite: !w.favorite })} icon={Star} c={C.amber}>Favorite</TogBtn>
            <TogBtn on={w.recorded} onClick={() => onWatch(g.id, { ...w, recorded: !w.recorded })} icon={Radio} c="#b388ff">Record</TogBtn>
            <TogBtn on={ov.forced} onClick={() => onOverride(g.id, { ...ov, forced: !ov.forced })} icon={Star} c={C.amber}>Must-watch</TogBtn>
            <TogBtn on={ov.hidden} onClick={() => onOverride(g.id, { ...ov, hidden: !ov.hidden })} icon={ov.hidden ? Eye : EyeOff} c={C.dim}>{ov.hidden ? "Unhide" : "Hide"}</TogBtn>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, color: C.dim }}>Override rating:</span>
            <input type="number" min="1" max="10" step="0.5" value={rating}
              onChange={(e) => onOverride(g.id, { ...ov, jakeRating: parseFloat(e.target.value) })}
              style={{ width: 60, background: C.panel2, color: C.ink, border: `1px solid ${C.line}`, borderRadius: 6, padding: "4px 6px", fontSize: 12 }} />
            {ov.jakeRating != null && <button onClick={() => { const n = { ...ov }; delete n.jakeRating; onOverride(g.id, n); }}
              style={{ fontSize: 10, color: C.amber, background: "none", border: "none", cursor: "pointer" }}>reset</button>}
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, color: C.dim, minWidth: 54 }}>Fix time:</span>
            <input placeholder={g.et || "e.g. 3:30 PM"} value={ov.et || ""} onChange={(e) => onOverride(g.id, { ...ov, et: e.target.value || undefined })}
              style={{ width: 100, background: C.panel2, color: C.ink, border: `1px solid ${C.line}`, borderRadius: 6, padding: "4px 6px", fontSize: 12 }} />
            <span style={{ fontSize: 11, color: C.dim }}>TV:</span>
            <input placeholder={g.tv || "network"} value={ov.tv || ""} onChange={(e) => onOverride(g.id, { ...ov, tv: e.target.value || undefined })}
              style={{ width: 90, background: C.panel2, color: C.ink, border: `1px solid ${C.line}`, borderRadius: 6, padding: "4px 6px", fontSize: 12 }} />
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
            <TogBtn on={ov.rivalry || g.rivalry} onClick={() => onOverride(g.id, { ...ov, rivalry: (ov.rivalry || g.rivalry) ? undefined : true })} icon={Trophy} c={C.amber}>Rivalry / trophy</TogBtn>
            {(ov.rivalry || g.rivalry) && <input placeholder={g.rivalry || "trophy name"} value={ov.trophy || ""} onChange={(e) => onOverride(g.id, { ...ov, trophy: e.target.value || undefined })}
              style={{ flex: 1, minWidth: 120, background: C.panel2, color: C.ink, border: `1px solid ${C.line}`, borderRadius: 6, padding: "4px 6px", fontSize: 12 }} />}
          </div>
          <textarea placeholder="Notes after watching…" value={w.note || ""}
            onChange={(e) => onWatch(g.id, { ...w, note: e.target.value })}
            style={{ width: "100%", minHeight: 40, background: C.panel2, color: C.ink, border: `1px solid ${C.line}`, borderRadius: 8, padding: 8, fontSize: 12, resize: "vertical", boxSizing: "border-box" }} />
          <input placeholder="Best moment…" value={w.best || ""} onChange={(e) => onWatch(g.id, { ...w, best: e.target.value })}
            style={{ width: "100%", background: C.panel2, color: C.ink, border: `1px solid ${C.line}`, borderRadius: 8, padding: 8, fontSize: 12, boxSizing: "border-box" }} />
        </div>
      )}
    </div>
  );
}

function TogBtn({ on, onClick, icon: Icon, c, children }) {
  return <button onClick={onClick} style={{ fontSize: 11, padding: "5px 9px", borderRadius: 7, cursor: "pointer",
    background: on ? c + "22" : C.panel2, color: on ? c : C.dim, border: `1px solid ${on ? c + "66" : C.line}` }}>
    <Icon size={11} style={{ verticalAlign: -2 }} /> {children}
  </button>;
}

function Row({ icon: Icon, label, children }) {
  return <div style={{ display: "flex", gap: 8, fontSize: 12, color: C.ink }}>
    <span style={{ color: C.dim, display: "flex", alignItems: "center", gap: 4, minWidth: 70 }}><Icon size={12} /> {label}</span>
    <span>{children}</span>
  </div>;
}

/* ============================================================================
   VIEWS
   ========================================================================== */
function Header({ phase, lastSync, onPalette }) {
  const updated = lastSync ? new Date(lastSync).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "static seed · Jul 12";
  const live = !!lastSync;
  return (
    <div style={{ position: "relative", padding: "16px 16px 12px", borderBottom: `1px solid ${C.line}`, background: `linear-gradient(180deg, ${C.panel} 0%, ${C.bg} 100%)`, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(90deg, transparent 0 46px, rgba(255,255,255,0.03) 46px 47px)`, pointerEvents: "none" }} />
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: C.amber, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 18px ${C.amber}55` }}>
          <Target size={22} color={C.bg} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: "0.5px", color: C.ink, fontFamily: "var(--gc-display)" }}>GRIDIRON COMMAND</div>
          <div style={{ fontSize: 11, color: C.dim, letterSpacing: "0.5px" }}>Jake's 2026 CFB Control Room · {phase}</div>
        </div>
        {onPalette && <button onClick={onPalette} title="Command palette (⌘K)" style={{ background: C.panel2, border: `1px solid ${C.line}`, borderRadius: 7, padding: "5px 8px", color: C.dim, cursor: "pointer", fontSize: 11, fontFamily: "var(--gc-mono)", display: "flex", alignItems: "center", gap: 4 }}>⌘K</button>}
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 8, color: C.dim, letterSpacing: "1px", display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end" }}>
            <span style={{ width: 6, height: 6, borderRadius: 99, background: live ? C.green : C.dim, animation: live ? "gc-pulse 1.8s ease-in-out infinite" : undefined }} /> DATA
          </div>
          <div style={{ fontSize: 10, color: live ? C.green : C.dim }}>{updated}</div>
        </div>
      </div>
    </div>
  );
}

function Boot({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 1750); return () => clearTimeout(t); }, [onDone]);
  const lines = ["HENDERSON.SYS // GRIDIRON COMMAND", "booting control room…", "loading 2026 season data…", "establishing broadcast uplink…"];
  return (
    <div onClick={onDone} style={{ position: "fixed", inset: 0, background: C.bg, zIndex: 200, display: "flex", flexDirection: "column", justifyContent: "center", padding: 26, cursor: "pointer", animation: "gc-fade 0.2s ease" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(0deg, transparent 0 3px, rgba(0,0,0,0.25) 3px 4px)`, pointerEvents: "none", opacity: 0.4 }} />
      <div style={{ position: "relative", fontFamily: "var(--gc-mono)", color: C.green, fontSize: 13, lineHeight: 2.1 }}>
        {lines.map((l, i) => <div key={i} style={{ opacity: 0, animation: `gc-fade 0.3s ease ${i * 0.3}s forwards` }}>{i === 0 ? "" : "› "}{l}</div>)}
        <div style={{ marginTop: 18, color: C.amber, fontWeight: 800, fontSize: 22, letterSpacing: "3px", fontFamily: "var(--gc-display)", opacity: 0, animation: "gc-fade 0.45s ease 1.25s forwards" }}>▮ ONLINE</div>
      </div>
      <div style={{ position: "absolute", bottom: 22, left: 26, fontSize: 10, color: C.dim, fontFamily: "var(--gc-mono)" }}>tap to skip ▸</div>
    </div>
  );
}

function CommandPalette({ tabs, actions, onView, onClose }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const items = [
    ...tabs.map(([id, label, Icon]) => ({ label: "Go to " + label, icon: Icon, run: () => onView(id) })),
    ...actions.map((a) => ({ label: a.label, icon: Zap, run: a.run })),
  ].filter((it) => it.label.toLowerCase().includes(q.toLowerCase()));
  useEffect(() => { setSel(0); }, [q]);
  const onKey = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, items.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
    else if (e.key === "Enter") { const it = items[sel]; if (it) { it.run(); onClose(); } }
  };
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 150, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 80 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "90%", maxWidth: 460, background: C.panel, border: `1px solid ${C.line}`, borderRadius: 12, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey} placeholder="Jump to… (view or action)" style={{ width: "100%", padding: "14px 16px", background: C.panel2, color: C.ink, border: "none", borderBottom: `1px solid ${C.line}`, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
        <div style={{ maxHeight: 360, overflowY: "auto" }}>
          {items.length === 0 && <div style={{ padding: 16, color: C.dim, fontSize: 12 }}>No matches.</div>}
          {items.map((it, i) => { const Icon = it.icon; return (
            <div key={i} onMouseEnter={() => setSel(i)} onClick={() => { it.run(); onClose(); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", cursor: "pointer", background: i === sel ? C.amber + "18" : "transparent", color: i === sel ? C.ink : C.dim }}>
              <Icon size={15} /><span style={{ fontSize: 13 }}>{it.label}</span>
            </div>
          ); })}
        </div>
        <div style={{ padding: "8px 16px", borderTop: `1px solid ${C.line}`, fontSize: 10, color: C.dim, fontFamily: "var(--gc-mono)" }}>↑↓ navigate · ⏎ select · esc close</div>
      </div>
    </div>
  );
}

function SectionTitle({ children, icon: Icon }) {
  return <div style={{ display: "flex", alignItems: "center", gap: 7, margin: "18px 0 10px", color: C.amber, fontSize: 12, letterSpacing: "1.5px", fontWeight: 700 }}>
    {Icon && <Icon size={14} />} {children}
  </div>;
}

function TopTeamCard({ id, big, results }) {
  const t = TEAMS[id];
  const games = GAMES.filter((g) => g.away === id || g.home === id).sort((a, b) => a.date.localeCompare(b.date));
  const next = games.find((g) => g.date >= "2026-07-12") || games[0];
  const rec = teamRecord(id, results || {});
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 12, padding: big ? 14 : 11,
      borderTop: `3px solid ${t.colors[0]}`, minWidth: 0 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <Logo id={id} size={big ? 44 : 32} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: big ? 16 : 13, color: C.ink }}>{t.name}</div>
          <div style={{ fontSize: 10, color: C.dim }}>{t.conf}{RANK[id] ? ` · #${RANK[id]}${LIVE.pollName ? "" : " proj"}` : ""}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: big ? 15 : 13, fontWeight: 800, color: C.ink, fontFamily: "ui-monospace, monospace" }}>{rec.w}–{rec.l}</div>
          <div style={{ fontSize: 9, color: C.dim }}>{rec.played ? `${rec.cw}–${rec.cl} conf · ${rec.streak}` : "preseason"}</div>
        </div>
      </div>
      {big && t.coach && <div style={{ fontSize: 11, color: C.dim, marginTop: 8 }}>{t.coach} · {t.stadium}</div>}
      {next && (
        <div style={{ marginTop: 10, background: C.panel2, borderRadius: 8, padding: 8 }}>
          <div style={{ fontSize: 9, color: C.dim, letterSpacing: "1px", marginBottom: 3 }}>NEXT</div>
          <div style={{ fontSize: 12, color: C.ink, fontWeight: 600 }}>
            {next.neutral ? "vs " : (next.home === id ? "vs " : "at ")}
            {T(next.home === id ? next.away : next.home).short}
          </div>
          <div style={{ fontSize: 10, color: C.dim, marginTop: 2 }}>{shortDate(next.date)} · {next.et || "TBD"} · {next.tv || "TBD"}</div>
        </div>
      )}
    </div>
  );
}

function HomeView({ priorities, onEnterBooth, ...rest }) {
  const [exp, setExp] = useState(null);
  // Game of the week (Week 1) + special event
  const w1 = GAMES.filter((g) => g.wk === 1);
  const gotw = [...GAMES].sort((a, b) => computeJakeRating(b, priorities).score - computeJakeRating(a, priorities).score)[0];
  const specialEvent = GAMES.find((g) => (g.special || []).includes("international"));
  const tier1 = ["michigan-state", "notre-dame", "west-virginia"];
  const tier2 = priorities.filter((id) => TEAMS[id] && TEAMS[id].tier === 2);
  // Tonight / next: soonest upcoming date with games, prioritized
  const todayStr = new Date().toISOString().slice(0, 10);
  const future = GAMES.filter((g) => g.date >= todayStr).sort((a, b) => a.date.localeCompare(b.date));
  const nextDate = future.length ? future[0].date : null;
  const nextUp = nextDate ? future.filter((g) => g.date === nextDate).sort((a, b) => computeJakeRating(b, priorities).score - computeJakeRating(a, priorities).score).slice(0, 6) : [];

  return (
    <div style={{ padding: "0 14px 90px" }}>
      {onEnterBooth && (
        <button onClick={onEnterBooth} style={{ width: "100%", marginTop: 12, marginBottom: 4, background: `linear-gradient(135deg, ${C.amber}, ${C.amber}cc)`, color: C.bg, border: "none", borderRadius: 12, padding: "13px 14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontWeight: 800, fontSize: 14, letterSpacing: "0.5px", fontFamily: "var(--gc-display)", boxShadow: `0 4px 20px ${C.amber}44` }}>
          <Tv size={18} /> ENTER THE BOOTH — GAME-DAY MODE
        </button>
      )}
      {nextUp.length > 0 && (
        <>
          <SectionTitle icon={Radio}>{nextDate === todayStr ? "TONIGHT / TODAY" : `NEXT UP · ${dayName(nextDate)} ${shortDate(nextDate)}`}</SectionTitle>
          <div style={{ display: "grid", gap: 8 }}>
            {nextUp.map((g) => <GameCard key={g.id} g={g} priorities={priorities} {...rest} expanded={exp === g.id} onToggle={() => setExp(exp === g.id ? null : g.id)} />)}
          </div>
        </>
      )}

      <SectionTitle icon={Star}>YOUR TOP TEAMS</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
        {tier1.map((id) => <TopTeamCard key={id} id={id} big results={rest.results} />)}
      </div>

      <SectionTitle icon={Users}>ADOPTED — ONE PER CONFERENCE</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {tier2.map((id) => <TopTeamCard key={id} id={id} results={rest.results} />)}
      </div>

      <SectionTitle icon={Trophy}>JAKE'S GAME OF THE WEEK</SectionTitle>
      <GameCard g={gotw} priorities={priorities} {...rest} expanded={exp === gotw.id} onToggle={() => setExp(exp === gotw.id ? null : gotw.id)} />

      <SectionTitle icon={Sparkles}>SPECIAL EVENT ON THE RADAR</SectionTitle>
      {specialEvent && <GameCard g={specialEvent} priorities={priorities} {...rest} expanded={exp === specialEvent.id} onToggle={() => setExp(exp === specialEvent.id ? null : specialEvent.id)} />}

      <SectionTitle icon={CalendarDays}>SEASON OPENS — WEEK 1</SectionTitle>
      <div style={{ display: "grid", gap: 8 }}>
        {w1.map((g) => <GameCard key={g.id} g={g} priorities={priorities} {...rest} expanded={exp === g.id} onToggle={() => setExp(exp === g.id ? null : g.id)} />)}
      </div>
    </div>
  );
}

function WatchBoard({ priorities, overrides, ...rest }) {
  const [wk, setWk] = useState(1);
  const [exp, setExp] = useState(null);
  const [filter, setFilter] = useState("all");
  const idx = WEEKS.findIndex((w) => w.wk === wk);

  let games = gamesForWeek(wk).filter((g) => !(overrides[g.id] || {}).hidden);
  if (filter === "mine") games = games.filter((g) => [g.away, g.home].some((id) => TEAMS[id] && TEAMS[id].tier));
  if (filter === "weeknight") games = games.filter((g) => isWeeknight(g.date));
  if (filter === "special") games = games.filter((g) => (g.special || []).length || g.rivalry);

  // group by day, then window for Saturday
  const byDay = {};
  games.forEach((g) => {
    const d = dayName(g.date);
    byDay[d] = byDay[d] || {};
    const win = d === "Saturday" ? windowFor(g) : "all";
    byDay[d][win] = byDay[d][win] || [];
    byDay[d][win].push(g);
  });
  const dayOrder = ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Monday"];
  const winOrder = ["Morning", "Noon", "Early Afternoon", "3:30 Window", "Early Evening", "Primetime", "Late Night", "Time TBD"];

  // conflict detection: same window with 2+ selected/high games
  const conflicts = [];
  Object.entries(byDay).forEach(([d, wins]) => {
    Object.entries(wins).forEach(([w, gs]) => {
      const hot = gs.map((g) => ({ g, r: (overrides[g.id]?.jakeRating ?? computeJakeRating(g, priorities).score) }))
        .filter((x) => x.r >= 6).sort((a, b) => b.r - a.r);
      if (hot.length >= 2) conflicts.push({ window: `${d} · ${w}`, hot });
    });
  });

  return (
    <div style={{ padding: "0 14px 90px" }}>
      {/* week selector */}
      <div style={{ position: "sticky", top: 0, background: C.bg, paddingTop: 12, zIndex: 5 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <button onClick={() => idx > 0 && setWk(WEEKS[idx - 1].wk)} style={navBtn}><ChevronLeft size={18} /></button>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontWeight: 800, fontSize: 16, color: C.ink }}>{WEEKS[idx].label}</div>
            <div style={{ fontSize: 11, color: C.dim }}>{shortDate(WEEKS[idx].date)}, 2026</div>
          </div>
          <button onClick={() => idx < WEEKS.length - 1 && setWk(WEEKS[idx + 1].wk)} style={navBtn}><ChevronRight size={18} /></button>
        </div>
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 8 }}>
          {[["all", "All"], ["mine", "My teams"], ["weeknight", "Weeknight"], ["special", "Special"]].map(([k, l]) => (
            <button key={k} onClick={() => setFilter(k)} style={{ ...pillBtn, background: filter === k ? C.amber : C.panel, color: filter === k ? C.bg : C.dim, borderColor: filter === k ? C.amber : C.line }}>{l}</button>
          ))}
        </div>
      </div>

      {conflicts.length > 0 && (
        <div style={{ background: C.red + "14", border: `1px solid ${C.red}44`, borderRadius: 10, padding: 12, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: C.red, fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
            <AlertTriangle size={14} /> CONFLICT RESOLVER
          </div>
          {conflicts.map((c, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 11, color: C.dim, marginBottom: 3 }}>{c.window}</div>
              <div style={{ fontSize: 12, color: C.ink, lineHeight: 1.5 }}>
                <b style={{ color: C.amber }}>Main screen:</b> {T(c.hot[0].g.away).short} {c.hot[0].g.neutral ? "vs" : "@"} {T(c.hot[0].g.home).short} ({c.hot[0].r.toFixed(1)}).{" "}
                <b style={{ color: C.green }}>2nd screen:</b> {T(c.hot[1].g.away).short} {c.hot[1].g.neutral ? "vs" : "@"} {T(c.hot[1].g.home).short} ({c.hot[1].r.toFixed(1)}).{" "}
                Flip when the main game passes a 3+ score margin in the 4th, or when the 2nd game reaches one score late.
              </div>
            </div>
          ))}
        </div>
      )}

      {games.length === 0 && <Empty>No games match this filter for {WEEKS[idx].label}. Verified games are seeded for your 11 teams and key national events — other national matchups fill in as schedules are confirmed.</Empty>}

      {dayOrder.filter((d) => byDay[d]).map((d) => (
        <div key={d}>
          <div style={{ margin: "16px 0 8px", fontSize: 13, fontWeight: 700, color: C.ink, display: "flex", alignItems: "center", gap: 6 }}>
            <CalendarDays size={13} color={C.amber} /> {d}
          </div>
          {(d === "Saturday" ? winOrder : ["all"]).filter((w) => byDay[d][w]).map((w) => (
            <div key={w} style={{ marginBottom: 10 }}>
              {d === "Saturday" && <div style={{ fontSize: 10, letterSpacing: "1px", color: C.dim, margin: "6px 0 6px 2px" }}>{w.toUpperCase()}</div>}
              <div style={{ display: "grid", gap: 8 }}>
                {byDay[d][w].sort((a, b) => computeJakeRating(b, priorities).score - computeJakeRating(a, priorities).score)
                  .map((g) => <GameCard key={g.id} g={g} priorities={priorities} overrides={overrides} {...rest} expanded={exp === g.id} onToggle={() => setExp(exp === g.id ? null : g.id)} />)}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function CFBMap({ ids }) {
  const latMin = 25, latMax = 49.5, lonMin = -125, lonMax = -66;
  const W = 340, H = 190, pad = 14;
  const px = (lon) => pad + ((lon - lonMin) / (lonMax - lonMin)) * (W - pad * 2);
  const py = (lat) => pad + ((latMax - lat) / (latMax - latMin)) * (H - pad * 2);
  const pts = (ids || []).map((id) => ({ id, geo: HOME_GEO[id] })).filter((p) => p.geo);
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 12, padding: 10, marginBottom: 12 }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", display: "block" }}>
        <rect x="0" y="0" width={W} height={H} rx="8" fill="#0a0c0b" />
        {[0, 1, 2, 3, 4].map((i) => <line key={"v" + i} x1={pad + i * (W - pad * 2) / 4} y1={pad} x2={pad + i * (W - pad * 2) / 4} y2={H - pad} stroke="rgba(255,255,255,0.05)" />)}
        {[0, 1, 2, 3].map((i) => <line key={"h" + i} x1={pad} y1={pad + i * (H - pad * 2) / 3} x2={W - pad} y2={pad + i * (H - pad * 2) / 3} stroke="rgba(255,255,255,0.05)" />)}
        {pts.map((p) => {
          const x = px(p.geo[1]), y = py(p.geo[0]); const t = T(p.id);
          return (
            <g key={p.id}>
              <circle cx={x} cy={y} r="11" fill={t.colors[0]} stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
              <text x={x} y={y + 3} textAnchor="middle" fontSize="7.5" fontWeight="800" fill="#fff" fontFamily="var(--gc-mono)">{String(t.short).slice(0, 3)}</text>
            </g>
          );
        })}
      </svg>
      <div style={{ fontSize: 10, color: C.dim, marginTop: 6, textAlign: "center" }}>Home stadiums of your 11 teams · geographic plot (continental US)</div>
    </div>
  );
}

function TeamsView({ priorities, ...rest }) {
  const [sel, setSel] = useState(null);
  const list = priorities.filter((id) => TEAMS[id] && TEAMS[id].tier);
  if (sel) return <TeamDetail id={sel} priorities={priorities} onBack={() => setSel(null)} {...rest} />;
  return (
    <div style={{ padding: "12px 14px 90px" }}>
      <SectionTitle icon={MapPin}>YOUR CFB MAP</SectionTitle>
      <CFBMap ids={list} />
      <SectionTitle icon={Users}>YOUR 11 TEAMS · PRIORITY ORDER</SectionTitle>
      <div style={{ display: "grid", gap: 8 }}>
        {list.map((id, i) => {
          const t = TEAMS[id];
          return (
            <div key={id} onClick={() => setSel(id)} style={{ display: "flex", alignItems: "center", gap: 12, background: C.panel, border: `1px solid ${C.line}`, borderRadius: 12, padding: 12, cursor: "pointer", borderLeft: `4px solid ${t.colors[0]}` }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: t.tier === 1 ? C.amber : C.dim, width: 24, fontFamily: "ui-monospace, monospace" }}>{i + 1}</div>
              <Logo id={id} size={36} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: C.ink, fontSize: 14 }}>{t.name} <span style={{ color: C.dim, fontWeight: 400 }}>{t.mascot}</span></div>
                <div style={{ fontSize: 11, color: C.dim }}>{t.conf} · {t.tier === 1 ? "Tier 1" : "Adopted"}{t.runHeavy ? " · run-heavy" : ""}</div>
              </div>
              <ChevronRight size={16} color={C.dim} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RankTrend({ id }) {
  const hist = (LIVE.rankHistory && LIVE.rankHistory[id]) || [];
  if (hist.length < 2) return null;
  const W = 300, H = 90, pad = 18;
  const weeks = hist.map((h) => h.week);
  const wMin = Math.min(...weeks), wMax = Math.max(...weeks);
  const x = (w) => pad + (wMax === wMin ? 0.5 : (w - wMin) / (wMax - wMin)) * (W - pad * 2);
  const y = (r) => pad + ((r - 1) / 24) * (H - pad * 2); // rank 1 at top, 25 at bottom
  const pts = hist.map((h) => `${x(h.week)},${y(Math.min(h.rank, 25))}`).join(" ");
  const first = hist[0].rank, last = hist[hist.length - 1].rank;
  const move = first - last; // positive = climbed
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 12, padding: 12, marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 11, letterSpacing: "0.5px", color: C.amber, fontWeight: 700 }}>RANK MOVEMENT · {LIVE.pollName || "poll"}</span>
        <span style={{ fontSize: 11, color: move > 0 ? C.green : move < 0 ? C.red : C.dim, fontWeight: 700 }}>{move > 0 ? `▲ up ${move}` : move < 0 ? `▼ down ${-move}` : "steady"} · now #{last}</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", display: "block" }}>
        {[1, 10, 25].map((r) => <g key={r}><line x1={pad} y1={y(r)} x2={W - pad} y2={y(r)} stroke="rgba(255,255,255,0.06)" /><text x={2} y={y(r) + 3} fontSize="8" fill={C.dim}>{r}</text></g>)}
        <polyline points={pts} fill="none" stroke={C.amber} strokeWidth="2" strokeLinejoin="round" />
        {hist.map((h, i) => <circle key={i} cx={x(h.week)} cy={y(Math.min(h.rank, 25))} r="2.5" fill={C.amber} />)}
      </svg>
    </div>
  );
}

function TeamDetail({ id, priorities, onBack, ...rest }) {
  const t = TEAMS[id];
  const [exp, setExp] = useState(null);
  const games = GAMES.filter((g) => g.away === id || g.home === id).sort((a, b) => a.date.localeCompare(b.date));
  return (
    <div style={{ padding: "12px 14px 90px" }}>
      <button onClick={onBack} style={{ ...pillBtn, marginBottom: 12 }}><ChevronLeft size={14} style={{ verticalAlign: -2 }} /> All teams</button>
      <div style={{ position: "relative", background: `linear-gradient(135deg, ${t.colors[0]} 0%, ${C.panel} 92%)`, borderRadius: 14, padding: 16, marginBottom: 14, overflow: "hidden", boxShadow: `0 0 30px ${t.colors[0]}44`, borderTop: `3px solid ${t.colors[1] || t.colors[0]}` }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(90deg, transparent 0 30px, rgba(255,255,255,0.04) 30px 31px)`, pointerEvents: "none" }} />
        {(() => { const src = LOGO_DATA[id] || (T(id).logos && T(id).logos[0]); return src ? <img src={src} alt="" aria-hidden="true" style={{ position: "absolute", right: -18, top: -14, width: 150, height: 150, objectFit: "contain", opacity: 0.14, pointerEvents: "none" }} /> : null; })()}
        <div style={{ position: "relative", display: "flex", gap: 12, alignItems: "center" }}>
          <Logo id={id} size={56} />
          <div>
            <div style={{ fontWeight: 800, fontSize: 21, color: "#fff", fontFamily: "var(--gc-display)", letterSpacing: "0.3px" }}>{t.name}</div>
            <div style={{ fontSize: 12, color: "#ffffffcc" }}>{t.mascot} · {t.conf}{RANK[id] ? ` · #${RANK[id]}${LIVE.pollName ? "" : " proj"}` : ""}</div>
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gap: 8, marginBottom: 14 }}>
        <Row icon={Shield} label="Coach">{t.coach || "TBD"}</Row>
        <Row icon={MapPin} label="Stadium">{t.stadium} ({t.capacity})</Row>
        <Row icon={MapPin} label="City">{t.city}</Row>
        <Row icon={TrendingUp} label="Identity">{t.style}</Row>
        {(() => {
          const rec = teamRecord(id, rest.results || {});
          if (!rec.played) return <Row icon={ListChecks} label="2026 record">0–0 · enter results on any game to build records & standings</Row>;
          return (
            <div style={{ background: C.panel2, borderRadius: 8, padding: 10, display: "grid", gap: 4 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: C.ink }}>
                <span style={{ fontWeight: 700 }}>{rec.w}–{rec.l} overall</span>
                <span style={{ color: C.amber, fontFamily: "ui-monospace, monospace" }}>{rec.streak}{rec.bowlEligible ? " · bowl eligible" : ""}</span>
              </div>
              <div style={{ fontSize: 11, color: C.dim }}>{rec.cw}–{rec.cl} conf · {rec.hw}–{rec.hl} home · {rec.aw}–{rec.al} away{rec.nw + rec.nl ? ` · ${rec.nw}–${rec.nl} neutral` : ""}</div>
              {rec.last5.length > 0 && <div style={{ display: "flex", gap: 4, marginTop: 2 }}>{rec.last5.map((r, i) => <span key={i} style={{ width: 18, height: 18, borderRadius: 4, fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", background: (r === "W" ? C.green : C.red) + "22", color: r === "W" ? C.green : C.red }}>{r}</span>)}</div>}
            </div>
          );
        })()}
        {t.note && <div style={{ fontSize: 12, color: C.amber, background: C.amber + "12", padding: 8, borderRadius: 8, border: `1px solid ${C.amber}33` }}><Info size={12} style={{ verticalAlign: -2 }} /> {t.note}</div>}
      </div>
      <RankTrend id={id} />
      {(() => {
        const x = INTEL[id]; if (!x) return null;
        const tile = (label, val, fmt) => (
          <div style={{ background: C.panel2, borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: C.ink, fontFamily: "var(--gc-mono)" }}>{val == null ? "—" : fmt ? fmt(val) : val}</div>
            <div style={{ fontSize: 9, color: C.dim, letterSpacing: "0.5px", marginTop: 2 }}>{label}</div>
          </div>
        );
        const pct = (v) => v == null ? "—" : Math.round(v * 100) + "%";
        return (
          <>
            <SectionTitle icon={TrendingUp}>ADVANCED INTEL</SectionTitle>
            <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 12, padding: 12, marginBottom: 8 }}>
              {(x.spRating != null || x.fpi != null) && (
                <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                  {x.spRating != null && <div style={{ flex: 1, minWidth: 120, background: C.amber + "12", border: `1px solid ${C.amber}44`, borderRadius: 8, padding: 10 }}>
                    <div style={{ fontSize: 10, color: C.amber, letterSpacing: "0.5px" }}>SP+ RATING</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: C.ink, fontFamily: "var(--gc-mono)" }}>{x.spRating > 0 ? "+" : ""}{x.spRating.toFixed(1)}</div>
                    <div style={{ fontSize: 10, color: C.dim }}>{x.spRank ? `#${x.spRank} nationally` : ""}</div>
                  </div>}
                  {x.fpi != null && <div style={{ flex: 1, minWidth: 120, background: C.panel2, borderRadius: 8, padding: 10 }}>
                    <div style={{ fontSize: 10, color: C.dim, letterSpacing: "0.5px" }}>FPI</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: C.ink, fontFamily: "var(--gc-mono)" }}>{x.fpi > 0 ? "+" : ""}{x.fpi.toFixed(1)}</div>
                    <div style={{ fontSize: 10, color: C.dim }}>{x.fpiRank ? `#${x.fpiRank}` : ""}</div>
                  </div>}
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                {tile("SP+ OFF", x.spOff, (v) => (v > 0 ? "+" : "") + v.toFixed(1))}
                {tile("SP+ DEF", x.spDef, (v) => (v > 0 ? "+" : "") + v.toFixed(1))}
                {tile("PPA/play OFF", x.ppaOff, (v) => v.toFixed(2))}
                {tile("Success rate", x.offSR, pct)}
                {tile("Explosiveness", x.offExpl, (v) => v.toFixed(2))}
                {tile("Def havoc", x.havoc, pct)}
              </div>
              <div style={{ fontSize: 9, color: C.dim, marginTop: 8 }}>SP+ & FPI have preseason projections; efficiency (success rate, explosiveness, havoc) fills in once games are played.</div>
            </div>
          </>
        );
      })()}
      {(() => {
        if (!PLAYERS.heisman.length) return null;
        const pick = (arr, key) => arr.filter((p) => p.teamId === id).sort((a, b) => (b[key] || 0) - (a[key] || 0))[0];
        const qb = pick(PLAYERS.passing, "YDS"), rb = pick(PLAYERS.rushing, "YDS"), wr = pick(PLAYERS.receiving, "YDS");
        if (!qb && !rb && !wr) return null;
        const row = (label, p, unit) => p ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: `1px solid ${C.line}` }}>
            <span style={{ fontSize: 10, color: C.amber, fontWeight: 800, width: 30 }}>{label}</span>
            <span style={{ flex: 1, fontSize: 13, color: C.ink }}>{p.player}</span>
            <span style={{ fontSize: 12, color: C.dim, fontFamily: "var(--gc-mono)" }}>{p.YDS || 0} {unit} · {p.TD || 0} TD</span>
          </div>
        ) : null;
        return (
          <>
            <SectionTitle icon={User}>TEAM LEADERS</SectionTitle>
            <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 12, padding: "4px 12px", marginBottom: 8 }}>
              {row("PASS", qb, "yds")}{row("RUSH", rb, "yds")}{row("REC", wr, "yds")}
            </div>
          </>
        );
      })()}
      <SectionTitle icon={CalendarDays}>2026 SCHEDULE</SectionTitle>
      <div style={{ display: "grid", gap: 8 }}>
        {games.map((g) => <GameCard key={g.id} g={g} priorities={priorities} {...rest} expanded={exp === g.id} onToggle={() => setExp(exp === g.id ? null : g.id)} />)}
      </div>
      {t.extra && <div style={{ marginTop: 10, fontSize: 12, color: C.dim, background: C.panel2, borderRadius: 8, padding: 10, lineHeight: 1.5, border: `1px solid ${C.line}` }}><Info size={12} style={{ verticalAlign: -2, color: C.amber }} /> {t.extra}</div>}
    </div>
  );
}

function EventsView({ priorities, ...rest }) {
  const [exp, setExp] = useState(null);
  const [customEvents, setCustomEvents] = useStore("cfb:customEvents", []);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const events = GAMES.filter((g) => (g.special || []).length || g.rivalry).sort((a, b) => a.date.localeCompare(b.date));
  const builtIn = [
    { d: "2026-08-29", t: "Week 0 / Aer Lingus Classic (Dublin)" },
    { d: "2026-10-31", t: "Notre Dame–Navy at Gillette Stadium" },
    { d: "2026-11-03", t: "First CFP rankings release (projected)" },
    { d: "2026-11-28", t: "Rivalry Week (Championship Saturday eve)" },
    { d: "2026-12-05", t: "Conference Championship Weekend" },
    { d: "2026-12-07", t: "CFP Selection Day (projected)" },
    { d: "2026-12-12", t: "Army–Navy Game (MetLife)" },
    { d: "2026-12-20", t: "CFP First Round — on-campus (projected)" },
    { d: "2027-01-01", t: "CFP Quarterfinals / NY6 Bowls (projected)" },
    { d: "2027-01-19", t: "CFP National Championship (projected)" },
  ];
  const upcoming = [...builtIn, ...customEvents.map((e) => ({ d: e.date, t: e.title, custom: e.id }))].sort((a, b) => (a.d || "").localeCompare(b.d || ""));
  const addEvent = () => { if (!newTitle.trim() || !newDate) return; setCustomEvents([...customEvents, { id: "ce-" + Date.now(), title: newTitle.trim(), date: newDate }]); setNewTitle(""); setNewDate(""); };
  return (
    <div style={{ padding: "12px 14px 90px" }}>
      <SectionTitle icon={Sparkles}>KEY DATES</SectionTitle>
      <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 12, overflow: "hidden", marginBottom: 8 }}>
        {upcoming.map((e, i) => (
          <div key={i} style={{ display: "flex", gap: 12, padding: 11, borderBottom: i < upcoming.length - 1 ? `1px solid ${C.line}` : "none", alignItems: "center" }}>
            <div style={{ fontSize: 11, color: C.amber, fontFamily: "ui-monospace, monospace", minWidth: 52 }}>{shortDate(e.d)}</div>
            <div style={{ fontSize: 12, color: C.ink, flex: 1 }}>{e.t}{e.custom ? <span style={{ color: C.dim, fontSize: 10 }}> · yours</span> : ""}</div>
            {e.custom && <button onClick={() => setCustomEvents(customEvents.filter((c) => c.id !== e.custom))} title="Remove" style={{ background: "none", border: "none", color: C.dim, cursor: "pointer", fontSize: 14 }}>×</button>}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        <input placeholder="Add your own event…" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} style={{ flex: 1, background: C.panel2, color: C.ink, border: `1px solid ${C.line}`, borderRadius: 8, padding: "8px 10px", fontSize: 12, boxSizing: "border-box" }} />
        <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} style={{ background: C.panel2, color: C.ink, border: `1px solid ${C.line}`, borderRadius: 8, padding: "8px 10px", fontSize: 12 }} />
        <button onClick={addEvent} style={{ ...pillBtn, background: C.amber, color: C.bg, borderColor: C.amber }}>Add</button>
      </div>
      <SectionTitle icon={Trophy}>TROPHY CASE</SectionTitle>
      {(() => {
        const results = rest.results || {}; const overrides = rest.overrides || {};
        const seen = new Set(); const trophies = [];
        GAMES.forEach((g) => { const ov = overrides[g.id] || {}; const riv = g.rivalry || ov.rivalry; if (!riv) return; const nm = ov.trophy || g.rivalry || "Rivalry"; if (seen.has(nm)) return; seen.add(nm); trophies.push({ g, nm }); });
        if (!trophies.length) return null;
        return (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
            {trophies.map(({ g, nm }) => {
              const r = results[g.id]; const holder = r ? (r.winner === "home" ? g.home : g.away) : null;
              return (
                <div key={g.id} style={{ background: C.panel, border: `1px solid ${holder ? C.amber + "66" : C.line}`, borderRadius: 12, padding: 12, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: -8, right: -8, opacity: 0.15 }}><Trophy size={54} color={C.amber} /></div>
                  <div style={{ display: "flex", gap: 4, marginBottom: 8 }}><Logo id={g.away} size={26} /><Logo id={g.home} size={26} /></div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, lineHeight: 1.3 }}>{nm}</div>
                  <div style={{ fontSize: 10.5, color: C.dim, marginTop: 3 }}>{T(g.away).short} vs {T(g.home).short} · {shortDate(g.date)}</div>
                  <div style={{ fontSize: 11, marginTop: 6, color: holder ? C.amber : C.dim, fontWeight: holder ? 700 : 400 }}>
                    {holder ? `Held by ${T(holder).short}` : "Up for grabs"}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })()}

      <SectionTitle icon={Sparkles}>SPECIAL EVENT & RIVALRY GAMES</SectionTitle>
      <div style={{ display: "grid", gap: 8 }}>
        {events.map((g) => <GameCard key={g.id} g={g} priorities={priorities} {...rest} expanded={exp === g.id} onToggle={() => setExp(exp === g.id ? null : g.id)} />)}
      </div>
    </div>
  );
}

function seasonBadges({ games, byConf, byTeam, weeknights, rivalries, results }) {
  const dayCount = {}; games.forEach((g) => { dayCount[g.date] = (dayCount[g.date] || 0) + 1; });
  const maxDay = Math.max(0, ...Object.values(dayCount));
  const confCount = Object.keys(byConf).length;
  const academy = games.some((g) => (g.special || []).includes("academy") || [g.away, g.home].some((id) => ACADEMY.has(normName(T(id).name))));
  const snow = games.some((g) => snowPotential(g) || (g.special || []).includes("snow") || (LIVE.weather && LIVE.weather[g.id] && LIVE.weather[g.id].snow > 0));
  const old = games.some((g) => oldSchool(g).score >= 75);
  const intl = games.some((g) => (g.special || []).includes("international"));
  const tier1 = new Set(); games.forEach((g) => [g.away, g.home].forEach((id) => { if (TEAMS[id] && TEAMS[id].tier === 1) tier1.add(id); }));
  const giant = games.some((g) => { const r = results[g.id]; if (!r) return false; const winner = r.winner === "home" ? g.home : g.away, loser = r.winner === "home" ? g.away : g.home; return !RANK[winner] && RANK[loser]; });
  const total = games.length;
  const B = (id, title, desc, earned, cur, goal, icon) => ({ id, title, desc, earned, cur, goal, icon });
  return [
    B("first", "First Down", "Log your first game.", total >= 1, Math.min(total, 1), 1, Flag),
    B("ten", "Getting Rolling", "Watch 10 games.", total >= 10, Math.min(total, 10), 10, ListChecks),
    B("fifty", "Season Junkie", "Watch 50 games.", total >= 50, Math.min(total, 50), 50, Flame),
    B("weeknight", "Weeknight Warrior", "5 weeknight games.", weeknights >= 5, Math.min(weeknights, 5), 5, Radio),
    B("snow", "Snow Game Survivor", "A snow / cold-weather game.", snow, snow ? 1 : 0, 1, Snowflake),
    B("academy", "Service Academy Salute", "A service-academy game.", academy, academy ? 1 : 0, 1, Anchor),
    B("rivalry", "Trophy Hunter", "3 rivalry / trophy games.", rivalries >= 3, Math.min(rivalries, 3), 3, Trophy),
    B("giant", "Giant-Killer Witness", "See an unranked team beat a ranked one.", giant, giant ? 1 : 0, 1, Zap),
    B("old", "Old-Schooler", "A 75+ Old-School Index game.", old, old ? 1 : 0, 1, Shield),
    B("tier1", "Tier-1 Devotee", "All three Tier-1 teams (MSU/ND/WVU).", tier1.size >= 3, tier1.size, 3, Star),
    B("conf", "Conference Tour", "Games across 8 conferences.", confCount >= 8, confCount, 8, Users),
    B("three", "3-Screen Saturday", "3+ games in one day.", maxDay >= 3, Math.min(maxDay, 3), 3, Tv),
    B("intl", "Passport Stamped", "Watch the international game.", intl, intl ? 1 : 0, 1, Plane),
    B("century", "Century Club", "Watch 100 games.", total >= 100, Math.min(total, 100), 100, Target),
  ];
}
function seasonNarrative(s) {
  if (s.total === 0) return "Your season starts the first time you tap \u201cWatched\u201d on a game. The goal: make 2026 the most college football you've ever watched.";
  const p = [];
  p.push(`You've logged ${s.total} game${s.total === 1 ? "" : "s"} \u2014 about ${s.hours} hours across ${s.confCount} conference${s.confCount === 1 ? "" : "s"}.`);
  if (s.topTeam) p.push(`No one gets more of your couch than ${TEAMS[s.topTeam[0]].name} (${s.topTeam[1]}).`);
  if (s.weeknights) p.push(`You've stayed up for ${s.weeknights} weeknight game${s.weeknights === 1 ? "" : "s"}.`);
  if (s.rivalries) p.push(`${s.rivalries} rivalry game${s.rivalries === 1 ? "" : "s"} in the books.`);
  if (s.favGame) p.push(`Favorite so far: ${s.favGame}.`);
  return p.join(" ");
}

function HistoryView({ watched, results, priorities }) {
  const entries = Object.entries(watched).filter(([, w]) => w.status && w.status !== "skip");
  const total = entries.length;
  const hours = (total * 3.3).toFixed(0);
  const combined = allCombinedGames();
  const GMAP = {}; combined.forEach((g) => { GMAP[g.id] = g; });
  const gof = (gid) => GMAP[gid];
  const games = entries.map(([gid]) => gof(gid)).filter(Boolean);
  const byConf = {}; const byTeam = {}; const slots = {};
  games.forEach((g) => {
    [g.away, g.home].forEach((id) => { const c = T(id).conf; if (c) byConf[c] = (byConf[c] || 0) + 1; if (TEAMS[id] && TEAMS[id].tier) byTeam[id] = (byTeam[id] || 0) + 1; });
    const slot = dayName(g.date) === "Saturday" ? windowFor(g) : dayName(g.date);
    slots[slot] = (slots[slot] || 0) + 1;
  });
  const weeknights = games.filter((g) => isWeeknight(g.date)).length;
  const rivalries = games.filter((g) => g.rivalry).length;
  const ranked = games.filter((g) => [g.away, g.home].some((id) => RANK[id])).length;
  const specials = games.filter((g) => (g.special || []).length).length;
  const favorites = Object.entries(watched).filter(([, w]) => w.favorite).map(([gid]) => gid);
  const recorded = Object.values(watched).filter((w) => w.recorded).length;
  const topSlot = Object.entries(slots).sort((a, b) => b[1] - a[1])[0];
  const topTeam = Object.entries(byTeam).sort((a, b) => b[1] - a[1])[0];
  const confCount = Object.keys(byConf).length;
  const favGame = favorites.length && gof(favorites[0]) ? `${T(gof(favorites[0]).away).short} ${gof(favorites[0]).neutral ? "vs" : "@"} ${T(gof(favorites[0]).home).short}` : null;
  const badges = seasonBadges({ games, byConf, byTeam, weeknights, rivalries, results });
  const earned = badges.filter((b) => b.earned);
  const narrative = seasonNarrative({ total, hours, confCount, topTeam, weeknights, rivalries, favGame });

  const Stat = ({ n, l }) => (
    <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 12, padding: 14, textAlign: "center" }}>
      <div style={{ fontSize: 24, fontWeight: 800, color: C.amber, fontFamily: "var(--gc-mono)" }}>{n}</div>
      <div style={{ fontSize: 10, color: C.dim, letterSpacing: "0.5px", marginTop: 2 }}>{l}</div>
    </div>
  );
  return (
    <div style={{ padding: "0 14px 90px" }}>
      {/* HERO */}
      <div style={{ position: "relative", overflow: "hidden", marginTop: 12, background: `linear-gradient(135deg, ${C.amber}22, ${C.panel})`, border: `1px solid ${C.amber}44`, borderRadius: 14, padding: 16 }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(90deg, transparent 0 34px, rgba(255,255,255,0.03) 34px 35px)`, pointerEvents: "none" }} />
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 10, letterSpacing: "1.5px", color: C.amber, fontWeight: 800 }}>THE MOST CFB YOU'VE EVER WATCHED · 2026</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 6 }}>
            <span style={{ fontSize: 44, fontWeight: 800, color: C.ink, fontFamily: "var(--gc-mono)", lineHeight: 1 }}>{total}</span>
            <span style={{ fontSize: 13, color: C.dim }}>games · ~{hours} hours · {confCount} conferences</span>
          </div>
          <div style={{ fontSize: 12, color: C.ink, marginTop: 10, lineHeight: 1.6 }}>{narrative}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 12 }}>
        <Stat n={weeknights} l="WEEKNIGHT" />
        <Stat n={ranked} l="RANKED" />
        <Stat n={rivalries} l="RIVALRY" />
        <Stat n={specials} l="SPECIAL" />
        <Stat n={favorites.length} l="FAVORITES" />
        <Stat n={recorded} l="RECORDED" />
      </div>

      {/* ACHIEVEMENTS */}
      <SectionTitle icon={Trophy}>ACHIEVEMENTS · {earned.length}/{badges.length}</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {badges.map((b) => {
          const Icon = b.icon;
          return (
            <div key={b.id} style={{ background: b.earned ? C.amber + "14" : C.panel, border: `1px solid ${b.earned ? C.amber + "66" : C.line}`, borderRadius: 10, padding: 10, opacity: b.earned ? 1 : 0.6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Icon size={14} color={b.earned ? C.amber : C.dim} />
                <span style={{ fontSize: 12, fontWeight: 700, color: b.earned ? C.ink : C.dim }}>{b.title}</span>
              </div>
              <div style={{ fontSize: 10.5, color: C.dim, marginTop: 3, lineHeight: 1.4 }}>{b.desc}</div>
              {!b.earned && b.goal > 1 && (
                <div style={{ marginTop: 6 }}>
                  <div style={{ height: 4, background: C.line, borderRadius: 99, overflow: "hidden" }}><div style={{ width: `${Math.round((b.cur / b.goal) * 100)}%`, height: "100%", background: C.amber }} /></div>
                  <div style={{ fontSize: 9, color: C.dim, marginTop: 2 }}>{b.cur}/{b.goal}</div>
                </div>
              )}
              {b.earned && <div style={{ fontSize: 9, color: C.amber, marginTop: 4, fontWeight: 700 }}>✓ EARNED</div>}
            </div>
          );
        })}
      </div>

      {/* WRAPPED */}
      {total > 0 && (
        <>
          <SectionTitle icon={Sparkles}>YOUR SEASON, WRAPPED</SectionTitle>
          <div style={{ background: `linear-gradient(160deg, ${C.panel}, ${C.panel2})`, border: `1px solid ${C.line}`, borderRadius: 14, padding: 14, display: "grid", gap: 8 }}>
            {[["Games watched", `${total} (~${hours}h)`], topTeam && ["Most-watched team", `${TEAMS[topTeam[0]].name} (${topTeam[1]})`], topSlot && ["Favorite time slot", `${topSlot[0]} (${topSlot[1]})`], favGame && ["Favorite game", favGame], earned.length && ["Top achievement", earned[earned.length - 1].title], confCount && ["Conferences seen", `${confCount} / 11`]].filter(Boolean).map(([k, v], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, borderBottom: `1px solid ${C.line}`, paddingBottom: 6 }}><span style={{ color: C.dim }}>{k}</span><span style={{ color: C.ink, fontWeight: 600, textAlign: "right" }}>{v}</span></div>
            ))}
            <div style={{ fontSize: 10, color: C.dim, marginTop: 2 }}>A running recap all year — it becomes your end-of-season Wrapped.</div>
            <button onClick={() => shareWrappedImage({ total, hours, confCount, topTeam, topSlot, favGame, weeknights, earned: earned.length })} style={{ ...pillBtn, marginTop: 8, background: C.amber, color: C.bg, borderColor: C.amber, alignSelf: "start", display: "inline-flex", alignItems: "center", gap: 6 }}><Share2 size={13} /> Share Wrapped</button>
          </div>
        </>
      )}

      {favorites.length > 0 && (
        <>
          <SectionTitle icon={Star}>WATCH JOURNAL · FAVORITES</SectionTitle>
          {favorites.map((gid) => { const g = gof(gid); if (!g) return null; const w = watched[gid]; return (
            <div key={gid} style={{ background: C.panel, border: `1px solid ${C.amber}44`, borderRadius: 10, padding: 10, marginBottom: 6 }}>
              <div style={{ fontSize: 13, color: C.ink, fontWeight: 600 }}>{T(g.away).short} {g.neutral ? "vs" : "@"} {T(g.home).short} <span style={{ color: C.dim, fontWeight: 400, fontSize: 11 }}>· {shortDate(g.date)}</span></div>
              {w.best && <div style={{ fontSize: 12, color: C.amber, marginTop: 3 }}>★ {w.best}</div>}
              {w.note && <div style={{ fontSize: 11, color: C.dim, marginTop: 3 }}>{w.note}</div>}
            </div>
          ); })}
        </>
      )}
      {Object.keys(byConf).length > 0 && (
        <>
          <SectionTitle>BY CONFERENCE</SectionTitle>
          {Object.entries(byConf).sort((a, b) => b[1] - a[1]).map(([c, n]) => (
            <div key={c} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.line}`, fontSize: 12 }}>
              <span style={{ color: C.ink }}>{c}</span><span style={{ color: C.amber, fontFamily: "var(--gc-mono)" }}>{n}</span>
            </div>
          ))}
        </>
      )}
      {total === 0 && <div style={{ fontSize: 12, color: C.dim, textAlign: "center", margin: "16px 0", lineHeight: 1.6 }}>Tap "Watched" on any game (and ★ your favorites) and this whole page comes alive — stats, achievements, and your season narrative.</div>}
    </div>
  );
}

function SettingsView({ priorities, setPriorities, resetAll, lastUpdate, watchedData, overridesData, resultsData, apiKey, setApiKey, proxyBase, setProxyBase, doSync, syncing, syncMsg, lastSync, pollName, onImport, usage, registerCalls, makeRestorePoint, restoreBackup, backup, onLoadIdentity, identity, theme, setTheme, onLoadIntel, intel, onLoadPlayers, players, autoSync, setAutoSync, installEvt, installed, onInstall }) {
  const [diag, setDiag] = useState(null);
  const [diagRunning, setDiagRunning] = useState(false);
  const [syncCode, setSyncCode] = useState("");
  const [applyCode, setApplyCode] = useState("");
  const runDiag = async () => {
    setDiagRunning(true);
    try { const r = await runDiagnostics({ key: apiKey }); setDiag(r.results); if (r.calls) registerCalls(r.calls); }
    catch (e) { setDiag([{ label: "Diagnostics", status: "fail", detail: "Couldn't complete: " + (e.message || e) }]); }
    setDiagRunning(false);
  };
  const list = priorities.filter((id) => TEAMS[id] && TEAMS[id].tier);
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    const arr = [...list];
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setPriorities([...arr, ...priorities.filter((id) => !TEAMS[id] || !TEAMS[id].tier)]);
  };
  return (
    <div style={{ padding: "12px 14px 90px" }}>
      {(() => {
        const isIOS = typeof navigator !== "undefined" && /iphone|ipad|ipod/i.test(navigator.userAgent || "");
        if (installed) return (
          <div style={{ background: C.green + "12", border: `1px solid ${C.green}44`, borderRadius: 12, padding: 12, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
            <Check size={16} color={C.green} /><span style={{ fontSize: 12.5, color: C.ink }}>Installed — running as an app. No address bar. 🏈</span>
          </div>
        );
        return (
          <div style={{ background: C.amber + "12", border: `1px solid ${C.amber}44`, borderRadius: 12, padding: 12, marginBottom: 8 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.5px", color: C.amber, fontWeight: 800, marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}><Target size={13} /> INSTALL AS AN APP</div>
            {installEvt ? (
              <>
                <div style={{ fontSize: 12, color: C.ink, lineHeight: 1.5, marginBottom: 8 }}>Get the full-screen app with an icon and offline support — no address bar.</div>
                <button onClick={onInstall} style={{ ...pillBtn, background: C.amber, color: C.bg, borderColor: C.amber, fontWeight: 800 }}><Target size={13} style={{ verticalAlign: -2 }} /> Install app</button>
              </>
            ) : isIOS ? (
              <div style={{ fontSize: 12, color: C.ink, lineHeight: 1.6 }}>On iPhone: tap the <b>Share</b> button in Safari, then <b>Add to Home Screen</b>. Open it from the new icon — full-screen, no address bar. <span style={{ color: C.dim }}>(Must be Safari, not Chrome.)</span></div>
            ) : (
              <div style={{ fontSize: 12, color: C.ink, lineHeight: 1.6 }}>Open the browser menu and choose <b>Install app</b> (or <b>Add to Home screen</b>). If you don't see it yet, give the page a few seconds after it loads and check again. <span style={{ color: C.dim }}>Must be opened over https (your hosted URL), not a local file.</span></div>
            )}
          </div>
        );
      })()}
      <SectionTitle icon={Sparkles}>THEME</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 6 }}>
        {Object.entries(THEMES).map(([key, th]) => (
          <button key={key} onClick={() => setTheme(key)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 10, cursor: "pointer", textAlign: "left",
            background: theme === key ? C.amber + "18" : C.panel, border: `1px solid ${theme === key ? C.amber : C.line}`, color: C.ink }}>
            <span style={{ display: "inline-flex", flexShrink: 0 }}>
              <span style={{ width: 14, height: 14, borderRadius: 4, background: th.c.bg, border: `1px solid ${C.line}` }} />
              <span style={{ width: 14, height: 14, borderRadius: 4, background: th.swatch, marginLeft: -4, border: `1px solid ${C.line}` }} />
            </span>
            <span style={{ fontSize: 12.5, fontWeight: 700 }}>{th.label}</span>
            {theme === key && <Check size={13} color={C.amber} style={{ marginLeft: "auto" }} />}
          </button>
        ))}
      </div>
      <div style={{ fontSize: 10, color: C.dim, marginBottom: 4 }}>Recolors the whole app instantly. Saved across sessions.</div>

      <SectionTitle icon={Settings}>PRIORITY ORDER</SectionTitle>
      <div style={{ fontSize: 12, color: C.dim, marginBottom: 10 }}>This drives conflict resolution, rooting, and Jake Ratings. Reorder freely — it persists.</div>
      <div style={{ display: "grid", gap: 6 }}>
        {list.map((id, i) => (
          <div key={id} style={{ display: "flex", alignItems: "center", gap: 10, background: C.panel, border: `1px solid ${C.line}`, borderRadius: 10, padding: 10 }}>
            <span style={{ width: 20, color: i < 3 ? C.amber : C.dim, fontWeight: 800, fontFamily: "ui-monospace, monospace" }}>{i + 1}</span>
            <Logo id={id} size={28} />
            <span style={{ flex: 1, fontSize: 13, color: C.ink }}>{TEAMS[id].name}</span>
            <button onClick={() => move(i, -1)} style={iconBtn}><ChevronLeft size={14} style={{ transform: "rotate(90deg)" }} /></button>
            <button onClick={() => move(i, 1)} style={iconBtn}><ChevronRight size={14} style={{ transform: "rotate(90deg)" }} /></button>
          </div>
        ))}
      </div>

      <SectionTitle icon={Info}>DATA STATUS</SectionTitle>
      <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 12, padding: 14, fontSize: 12, color: C.dim, lineHeight: 1.6 }}>
        <div style={{ marginBottom: 8 }}><StatusDot status="verified" /> — Cross-checked vs official school/conference releases. Full 2026 slates for MSU, Notre Dame, West Virginia, LSU, Georgia Tech, Boise State, James Madison, and Jacksonville State. Western Michigan, Navy, and North Dakota State have all confirmed-date games seeded; their remaining conference dates are still being released (opponents known — see each team page).</div>
        <div style={{ marginBottom: 8 }}><StatusDot status="projected" /> — Likely but not yet confirmed (e.g., preseason ranks). Ranks shown are <b style={{ color: C.amber }}>projections</b>, not the official AP poll (released late August).</div>
        <div><StatusDot status="tbd" /> — Kickoff time or TV not yet released. Big Ten set only Weeks 1–3 kickoffs so far; most times fill in through the summer.</div>
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.line}`, color: C.dim }}>Last data build: <b style={{ color: C.ink }}>{lastUpdate}</b></div>
      </div>

      <SectionTitle icon={Radio}>LIVE DATA · CollegeFootballData + weather</SectionTitle>
      <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 12, padding: 14, display: "grid", gap: 10 }}>
        <div style={{ fontSize: 12, color: C.dim, lineHeight: 1.5 }}>
          The app auto-syncs when you open it (if a key is set) and pulls real kickoff times, final scores (→ records & standings), the official poll, betting lines, and weather. Free key: <b style={{ color: C.amber }}>collegefootballdata.com/key</b> — 1,000 calls/month; each sync uses ~4 in-season. Weather (Open-Meteo) needs no key.
        </div>
        <input placeholder="API key (or edit CFBD_KEY at the top of the HTML file)" value={apiKey || ""} onChange={(e) => setApiKey(e.target.value)} type="password"
          style={{ background: C.panel2, color: C.ink, border: `1px solid ${C.line}`, borderRadius: 8, padding: "8px 10px", fontSize: 12 }} />
        <button onClick={doSync} disabled={syncing} style={{ ...pillBtn, background: syncing ? C.panel2 : C.amber, color: syncing ? C.dim : C.bg, borderColor: C.amber, fontWeight: 700, opacity: syncing ? 0.7 : 1 }}>
          {syncing ? "Syncing…" : "Sync now"}
        </button>
        {syncMsg && <div style={{ fontSize: 11.5, color: syncMsg.ok ? C.green : C.red, lineHeight: 1.5, background: (syncMsg.ok ? C.green : C.red) + "12", border: `1px solid ${(syncMsg.ok ? C.green : C.red)}33`, borderRadius: 8, padding: 8 }}>{syncMsg.text}</div>}
        <div style={{ fontSize: 10, color: C.dim }}>
          {lastSync ? `Last sync: ${new Date(lastSync).toLocaleString()}${pollName ? ` · using ${pollName}` : ""}` : "Not yet synced — running on verified static data."}
        </div>
        {usage && (() => {
          const used = usage.calls || 0, pct = Math.min(100, Math.round(used / 10));
          const c = used > 800 ? C.red : used > 500 ? C.amber : C.green;
          return (
            <div style={{ background: C.panel2, borderRadius: 8, padding: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.dim, marginBottom: 5 }}>
                <span>API usage this month</span><span style={{ color: c, fontFamily: "ui-monospace, monospace" }}>{used} / 1,000</span>
              </div>
              <div style={{ height: 6, background: C.line, borderRadius: 99, overflow: "hidden" }}>
                <div style={{ width: pct + "%", height: "100%", background: c }} />
              </div>
            </div>
          );
        })()}
        <div style={{ background: C.panel2, borderRadius: 8, padding: 10 }}>
          <div style={{ fontSize: 11, color: C.amber, letterSpacing: "0.5px", marginBottom: 6, fontWeight: 700 }}>LOADED DATA</div>
          {[["Team colors & logos", identity && identity.count], ["Advanced stats (SP+/FPI/PPA)", intel && intel.count], ["Players & Heisman", players && players.count]].map(([k, n]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, padding: "3px 0" }}>
              <span style={{ color: C.dim }}>{k}</span>
              <span style={{ color: n ? C.green : C.dim, fontFamily: "var(--gc-mono)" }}>{n ? `● ${n}` : "○ not loaded"}</span>
            </div>
          ))}
        </div>
        <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: C.panel2, borderRadius: 8, padding: "10px 12px", cursor: "pointer" }}>
          <div><div style={{ fontSize: 12, color: C.ink, fontWeight: 600 }}>Auto-sync on open</div><div style={{ fontSize: 10, color: C.dim }}>Once/day max. Turn off to sync only when you tap.</div></div>
          <button onClick={() => setAutoSync(!autoSync)} style={{ width: 44, height: 24, borderRadius: 99, border: "none", cursor: "pointer", background: autoSync ? C.green : C.line, position: "relative", flexShrink: 0 }}>
            <span style={{ position: "absolute", top: 2, left: autoSync ? 22 : 2, width: 20, height: 20, borderRadius: 99, background: "#fff", transition: "0.15s" }} />
          </button>
        </label>
        <div style={{ fontSize: 10.5, color: C.dim, lineHeight: 1.5, borderTop: `1px solid ${C.line}`, paddingTop: 8 }}>
          Quota-smart by design: auto-syncs at most once a day; polls & betting lines are skipped until the season starts; the scoreboard Refresh has a 60-second cooldown. A typical in-season day costs ~3–5 of your 1,000 monthly calls. Weather (Open-Meteo) is free and doesn't count.
        </div>
        <div style={{ fontSize: 10.5, color: C.dim, lineHeight: 1.5 }}>
          Heads-up: some browsers block a double-clicked <code>file://</code> page from calling web APIs. If sync fails with a network error, try a different browser. Everything else in the app works offline regardless.
        </div>
        <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: 10 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.5px", color: C.amber, fontWeight: 700, marginBottom: 4 }}>DATA PROXY · recommended when hosted</div>
          <div style={{ fontSize: 10.5, color: C.dim, lineHeight: 1.5, marginBottom: 8 }}>
            Paste your Cloudflare Worker URL (from <code>HOSTING.md</code> / <code>worker.js</code>). When set, the Worker holds your key server-side — so it's <b style={{ color: C.ink }}>never in the page</b> — and it permanently fixes the CORS/file issue. Leave blank for direct mode.
          </div>
          <input placeholder="https://gridiron-proxy.yourname.workers.dev" value={proxyBase || ""} onChange={(e) => setProxyBase(e.target.value)}
            style={{ width: "100%", background: C.panel2, color: C.ink, border: `1px solid ${proxyBase ? C.green + "66" : C.line}`, borderRadius: 8, padding: "8px 10px", fontSize: 12, boxSizing: "border-box" }} />
          {proxyBase ? <div style={{ fontSize: 10, color: C.green, marginTop: 5 }}>● Proxy mode on — key hidden, CORS solved.</div> : <div style={{ fontSize: 10, color: C.dim, marginTop: 5 }}>Direct mode — using the key in this page.</div>}
        </div>
        <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: 10 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.5px", color: C.amber, fontWeight: 700, marginBottom: 4 }}>TEAM COLORS & LOGOS</div>
          <div style={{ fontSize: 10.5, color: C.dim, lineHeight: 1.5, marginBottom: 8 }}>
            Pulls every FBS team's <b style={{ color: C.ink }}>official colors and logo URLs</b> (one call), cached offline in IndexedDB. Colors apply immediately across the app; logos light up in the next update. Auto-loads on your first sync.
          </div>
          <button onClick={() => onLoadIdentity && onLoadIdentity()} disabled={syncing} style={{ ...pillBtn, color: C.ink, borderColor: C.line, alignSelf: "start" }}>
            {identity && identity.count ? "Refresh team colors & logos" : "Load team colors & logos"}
          </button>
          <div style={{ fontSize: 10, color: identity && identity.count ? C.green : C.dim, marginTop: 6 }}>
            {identity && identity.count ? `● ${identity.count} teams loaded${identity.at ? ` · ${timeAgo(identity.at)}` : ""} — official colors active.` : "Not loaded yet — running on built-in colors."}
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: 10 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.5px", color: C.amber, fontWeight: 700, marginBottom: 4 }}>ADVANCED STATS · SP+ / FPI / PPA / efficiency</div>
          <div style={{ fontSize: 10.5, color: C.dim, lineHeight: 1.5, marginBottom: 8 }}>
            Pulls national ratings and efficiency for every team (4 calls, cached offline). Powers team-page intel dashboards and SP+ projected margins on game cards. Auto-loads on your first in-season sync.
          </div>
          <button onClick={() => onLoadIntel && onLoadIntel()} disabled={syncing} style={{ ...pillBtn, color: C.ink, borderColor: C.line, alignSelf: "start" }}>
            {intel && intel.count ? "Refresh advanced stats" : "Load advanced stats"}
          </button>
          <div style={{ fontSize: 10, color: intel && intel.count ? C.green : C.dim, marginTop: 6 }}>
            {intel && intel.count ? `● ${intel.count} teams${intel.at ? ` · ${timeAgo(intel.at)}` : ""} — SP+, FPI, PPA & efficiency active.` : "Not loaded — team pages show the built-in profile only."}
          </div>
        </div>
      </div>

      <SectionTitle icon={AlertTriangle}>DIAGNOSTICS</SectionTitle>
      <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 12, padding: 14, display: "grid", gap: 10 }}>
        <div style={{ fontSize: 12, color: C.dim, lineHeight: 1.5 }}>If live data won't load, run this — it checks your key, network, browser, and the API, and tells you exactly what to fix.</div>
        <button onClick={runDiag} disabled={diagRunning} style={{ ...pillBtn, background: diagRunning ? C.panel2 : C.panel2, color: C.ink, borderColor: C.line, alignSelf: "start" }}>{diagRunning ? "Running…" : "Run diagnostics"}</button>
        {diag && (
          <div style={{ display: "grid", gap: 6 }}>
            {diag.map((d, i) => {
              const c = d.status === "ok" ? C.green : d.status === "warn" ? C.amber : C.red;
              return (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", background: C.panel2, borderRadius: 8, padding: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 99, background: c, marginTop: 5, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: C.ink, fontWeight: 600 }}>{d.label} <span style={{ color: c, fontWeight: 400, textTransform: "uppercase", fontSize: 10 }}>{d.status}</span></div>
                    <div style={{ fontSize: 11, color: C.dim, lineHeight: 1.5 }}>{d.detail}</div>
                  </div>
                </div>
              );
            })}
            <div style={{ fontSize: 10, color: C.dim }}>The API check uses 1 call.</div>
          </div>
        )}
      </div>

      <SectionTitle icon={Save}>EXPORT & BACKUP</SectionTitle>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={() => exportJSON(watchedData, overridesData, priorities, resultsData)} style={pillBtn}><Save size={13} style={{ verticalAlign: -2 }} /> Data (JSON)</button>
        <button onClick={exportCSV} style={pillBtn}><Save size={13} style={{ verticalAlign: -2 }} /> Schedule (CSV)</button>
        <button onClick={() => exportICS(overridesData)} style={pillBtn}><CalendarDays size={13} style={{ verticalAlign: -2 }} /> Calendar (.ics)</button>
        <label style={{ ...pillBtn, cursor: "pointer" }}>
          <Save size={13} style={{ verticalAlign: -2, transform: "rotate(180deg)" }} /> Import JSON
          <input type="file" accept="application/json,.json" style={{ display: "none" }} onChange={(e) => {
            const f = e.target.files && e.target.files[0]; if (!f) return;
            const rd = new FileReader(); rd.onload = () => { try { const ok = onImport(JSON.parse(rd.result)); alert(ok ? "Imported — your data was restored." : "Couldn't read that file."); } catch (err) { alert("That doesn't look like a valid Gridiron export."); } }; rd.readAsText(f);
          }} />
        </label>
      </div>
      <div style={{ fontSize: 10.5, color: C.dim, marginTop: 6, lineHeight: 1.5 }}>Calendar (.ics) adds your 11 teams' games (plus any must-watch games) to Apple/Google/Outlook Calendar for kickoff reminders. Import restores a JSON backup — handy for moving between devices or browsers.</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
        <button onClick={() => { makeRestorePoint(); alert("Restore point saved on this device."); }} style={pillBtn}><Save size={13} style={{ verticalAlign: -2 }} /> Create restore point</button>
        <button onClick={() => { if (!backup) { alert("No restore point yet."); return; } if (confirm("Restore your last on-device restore point? This replaces current watch data, results, and settings.")) { const ok = restoreBackup(); alert(ok ? "Restored." : "Restore failed."); } }} style={{ ...pillBtn, opacity: backup ? 1 : 0.5 }}><RotateCcw size={13} style={{ verticalAlign: -2 }} /> Restore{backup && backup.at ? ` (${new Date(backup.at).toLocaleDateString()})` : ""}</button>
      </div>

      <SectionTitle icon={Share2}>DEVICE SYNC (no server)</SectionTitle>
      <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 12, padding: 14, display: "grid", gap: 10 }}>
        <div style={{ fontSize: 12, color: C.dim, lineHeight: 1.5 }}>Move your watch log, results, favorites, and priorities to another device with a copy-paste code — no account, no server.</div>
        <button onClick={() => { try { const code = btoa(encodeURIComponent(JSON.stringify({ watched: watchedData, overrides: overridesData, results: resultsData, priorities }))); setSyncCode(code); } catch (e) { alert("Couldn't generate code."); } }} style={{ ...pillBtn, alignSelf: "start" }}>Generate sync code</button>
        {syncCode && <textarea readOnly value={syncCode} onFocus={(e) => e.target.select()} style={{ width: "100%", minHeight: 60, background: C.panel2, color: C.ink, border: `1px solid ${C.line}`, borderRadius: 8, padding: 8, fontSize: 10, fontFamily: "var(--gc-mono)", resize: "vertical", boxSizing: "border-box" }} />}
        <textarea placeholder="Paste a sync code here to load it…" value={applyCode} onChange={(e) => setApplyCode(e.target.value)} style={{ width: "100%", minHeight: 50, background: C.panel2, color: C.ink, border: `1px solid ${C.line}`, borderRadius: 8, padding: 8, fontSize: 10, fontFamily: "var(--gc-mono)", resize: "vertical", boxSizing: "border-box" }} />
        <button onClick={() => { try { const obj = JSON.parse(decodeURIComponent(atob(applyCode.trim()))); const ok = onImport(obj); alert(ok ? "Loaded from sync code." : "That code didn't contain valid data."); } catch (e) { alert("Invalid sync code."); } }} style={{ ...pillBtn, alignSelf: "start", opacity: applyCode ? 1 : 0.5 }}>Load from code</button>
      </div>

      <div style={{ textAlign: "center", fontSize: 10, color: C.dim, marginTop: 20, fontFamily: "var(--gc-mono)", lineHeight: 1.6 }}>
        GRIDIRON COMMAND · v2.0<br />HENDERSON.SYS · built for Jake · 2026 season
      </div>
      <button onClick={resetAll} style={{ ...pillBtn, marginTop: 16, color: C.red, borderColor: C.red + "55" }}>
        <RotateCcw size={13} style={{ verticalAlign: -2 }} /> Reset all watch data & overrides
      </button>
    </div>
  );
}

function Empty({ children }) {
  return <div style={{ background: C.panel, border: `1px dashed ${C.line}`, borderRadius: 12, padding: 16, fontSize: 12, color: C.dim, lineHeight: 1.5, textAlign: "center" }}>{children}</div>;
}

const navBtn = { background: C.panel, border: `1px solid ${C.line}`, borderRadius: 8, width: 34, height: 34, color: C.ink, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" };
const pillBtn = { background: C.panel, border: `1px solid ${C.line}`, borderRadius: 8, padding: "6px 12px", color: C.dim, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" };
const iconBtn = { background: C.panel2, border: `1px solid ${C.line}`, borderRadius: 7, width: 30, height: 30, color: C.ink, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" };

/* ============================================================================
   CONFERENCES VIEW  (verified 2026 realignment + championship info)
   ========================================================================== */
function normConf(c) {
  if (!c) return null;
  if (c.startsWith("FCS")) return null;
  if (c.includes("Big Ten")) return "Big Ten";
  if (c === "SEC") return "SEC";
  if (c === "ACC") return "ACC";
  if (c.includes("Big 12")) return "Big 12";
  if (c.includes("Pac-12")) return "Pac-12";
  if (c.includes("American")) return "American Athletic";
  if (c.includes("Mountain West")) return "Mountain West";
  if (c.includes("Sun Belt")) return "Sun Belt";
  if (c === "MAC") return "MAC";
  if (c.includes("Conference USA")) return "Conference USA";
  if (c.includes("Independent") || c.includes("Indep")) return "Independents";
  return null;
}
const CONF_META = {
  "Big Ten": { my: "michigan-state", champ: "Dec 5 · Lucas Oil Stadium, Indianapolis", games: "9 league games", note: "18 members. MSU's 2026 crossover slate skips Ohio State, Indiana, Penn State, USC & Iowa." },
  "SEC": { my: "lsu", champ: "Dec 5 · Mercedes-Benz Stadium, Atlanta", games: "9 league games (new for 2026)", note: "16 members. First year at nine conference games; LSU's annual rivals: Texas A&M, Arkansas, Ole Miss." },
  "ACC": { my: "georgia-tech", champ: "Dec 5 · Bank of America Stadium, Charlotte", games: "8–9 (phasing to 9)", note: "17 members. Georgia Tech stays on an 8-game ACC slate in 2026." },
  "Big 12": { my: "west-virginia", champ: "Dec 5 · AT&T Stadium, Arlington", games: "9 league games", note: "16 members. WVU plays 9; no Backyard Brawl this year (Pitt series resumes 2029)." },
  "Pac-12": { my: "boise-state", champ: "Dec 4 · home of the top seed", games: "7 league games + Week 13 flex", note: "Reborn for 2026 with 8 football members: Oregon State, Washington State, Boise State, Colorado State, Fresno State, San Diego State, Utah State, Texas State. Gonzaga joins for non-football." },
  "American Athletic": { my: "navy", champ: "Dec 5 · home of the top seed", games: "8 league games", note: "Navy's academy scheduling adds Army & Air Force outside the league." },
  "Mountain West": { my: "north-dakota-state", champ: "Early December", games: "8 league games", note: "North Dakota State joined as a football-only FBS member on July 1, 2026 after the Pac-12 raid — immediately bowl & CFP eligible." },
  "Sun Belt": { my: "james-madison", champ: "Dec 4 (Fri) · higher seed's campus", games: "8 league games", note: "Only FBS league still using East/West divisions. JMU is the reigning champ & 2025 CFP qualifier." },
  "MAC": { my: "western-michigan", champ: "Early Dec · Ford Field, Detroit", games: "8 league games", note: "Divisions gone — top two by win pct meet for the title. WMU is the reigning champ." },
  "Conference USA": { my: "jacksonville-state", champ: "Dec (Fri) · higher seed", games: "8 league games", note: "JSU opens Week 0 at North Dakota State; heavy weekday slate all fall." },
  "Independents": { my: "notre-dame", champ: "— (no conference title)", games: "Independent schedule", note: "Notre Dame chases an at-large CFP bid; UConn is also independent." },
};
const CONF_ORDER = ["Big Ten", "SEC", "ACC", "Big 12", "Pac-12", "American Athletic", "Mountain West", "Sun Belt", "MAC", "Conference USA", "Independents"];

function ConferencesView({ priorities, results }) {
  const [open, setOpen] = useState("Big Ten");
  const members = {};
  Object.values(TEAMS).forEach((t) => { const k = normConf(t.conf); if (k) { members[k] = members[k] || []; members[k].push(t.id); } });
  return (
    <div style={{ padding: "12px 14px 90px" }}>
      <SectionTitle icon={Trophy}>2026 CONFERENCES · VERIFIED REALIGNMENT</SectionTitle>
      <div style={{ fontSize: 12, color: C.dim, marginBottom: 10, lineHeight: 1.5 }}>Membership reflects 2026 realignment. Standings populate from results as you enter them (on any game card).</div>
      <div style={{ display: "grid", gap: 8 }}>
        {CONF_ORDER.map((cf) => {
          const meta = CONF_META[cf];
          const mine = meta.my;
          const tracked = (members[cf] || []).filter((id) => id !== mine);
          const isOpen = open === cf;
          const standings = isOpen && cf !== "Independents" ? conferenceStandings(cf, results || {}).filter((s) => s.rec.played) : [];
          return (
            <div key={cf} style={{ background: C.panel, border: `1px solid ${isOpen ? C.amber + "55" : C.line}`, borderRadius: 12, overflow: "hidden" }}>
              <div onClick={() => setOpen(isOpen ? null : cf)} style={{ display: "flex", alignItems: "center", gap: 10, padding: 12, cursor: "pointer" }}>
                <Logo id={mine} size={30} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: C.ink, fontSize: 14 }}>{cf}</div>
                  <div style={{ fontSize: 11, color: C.dim }}>Your team: {TEAMS[mine].name}</div>
                </div>
                <ChevronRight size={16} color={C.dim} style={{ transform: isOpen ? "rotate(90deg)" : "none", transition: "0.15s" }} />
              </div>
              {isOpen && (
                <div style={{ borderTop: `1px solid ${C.line}`, padding: 12, display: "grid", gap: 10 }}>
                  <div style={{ fontSize: 12, color: C.ink, lineHeight: 1.5 }}>{meta.note}</div>
                  <Row icon={Trophy} label="Title game">{meta.champ}</Row>
                  <Row icon={CalendarDays} label="Format">{meta.games}</Row>
                  {cf !== "Independents" && (
                    <div>
                      <div style={{ fontSize: 10, letterSpacing: "1px", color: C.amber, marginBottom: 6 }}>STANDINGS (conf · overall)</div>
                      {standings.length === 0
                        ? <div style={{ fontSize: 11, color: C.dim }}>No results entered yet — enter game results to build the table.</div>
                        : <div style={{ background: C.panel2, borderRadius: 8, overflow: "hidden" }}>
                            {standings.map((s, i) => (
                              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 9px", borderBottom: i < standings.length - 1 ? `1px solid ${C.line}` : "none", background: s.id === mine ? C.amber + "0d" : "transparent" }}>
                                <span style={{ width: 16, color: C.dim, fontSize: 11, fontFamily: "ui-monospace, monospace" }}>{i + 1}</span>
                                <Logo id={s.id} size={20} />
                                <span style={{ flex: 1, fontSize: 12, color: C.ink }}>{T(s.id).short}{s.id === mine ? " ★" : ""}</span>
                                <span style={{ fontSize: 12, color: C.amber, fontFamily: "ui-monospace, monospace" }}>{s.rec.cw}–{s.rec.cl}</span>
                                <span style={{ fontSize: 11, color: C.dim, fontFamily: "ui-monospace, monospace", minWidth: 34, textAlign: "right" }}>{s.rec.w}–{s.rec.l}</span>
                              </div>
                            ))}
                          </div>}
                    </div>
                  )}
                  <div>
                    <div style={{ fontSize: 10, letterSpacing: "1px", color: C.amber, marginBottom: 6 }}>TEAMS TRACKED IN THIS APP</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: TEAMS[mine].colors[0] + "33", border: `1px solid ${TEAMS[mine].colors[0]}`, borderRadius: 6, padding: "3px 7px", fontSize: 11, color: C.ink }}>★ {TEAMS[mine].short}</span>
                      {tracked.map((id) => <span key={id} style={{ display: "inline-flex", alignItems: "center", gap: 4, background: C.panel2, border: `1px solid ${C.line}`, borderRadius: 6, padding: "3px 7px", fontSize: 11, color: C.dim }}>{T(id).short}</span>)}
                    </div>
                    {cf !== "Independents" && <div style={{ fontSize: 10, color: C.dim, marginTop: 6 }}>Full conference rosters aren't all seeded — this shows teams that appear in the app's game data. Realignment facts above are verified.</div>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================================
   NATIONAL GAMES + WEEKDAY FOOTBALL VIEW
   ========================================================================== */
function isNational(g, priorities) {
  const r = computeJakeRating(g, priorities).score;
  const ranked = [g.away, g.home].some((id) => RANK[id]);
  const sp = g.special || [];
  return ranked || g.rivalry || sp.length > 0 || isWeeknight(g.date) || r >= 6.5;
}
function NationalView({ priorities, mode, ...rest }) {
  const [wk, setWk] = useState(mode === "weekday" ? "all" : 1);
  const [filter, setFilter] = useState(mode === "weekday" ? "weeknight" : "ranked");
  const [exp, setExp] = useState(null);
  const [shown, setShown] = useState(60);
  const idx = WEEKS.findIndex((w) => w.wk === wk);
  useEffect(() => { setShown(60); }, [wk, filter]);

  const pool = useMemo(() => (wk === "all" ? allCombinedGames() : gamesForWeek(wk)), [wk, LIVE.lastSync]);
  // Compute each game's rating once (cheap memo) — avoids recomputing thousands of times while sorting 800 games.
  const rmap = useMemo(() => { const m = {}; pool.forEach((g) => { m[g.id] = (rest.overrides[g.id] || {}).jakeRating ?? computeJakeRating(g, priorities).score; }); return m; }, [pool, priorities, rest.overrides, LIVE.lastSync]);
  const nat = pool.filter((g) => isNational(g, priorities));
  const F = {
    ranked: (g) => [g.away, g.home].some((id) => RANK[id]),
    top10: (g) => [g.away, g.home].some((id) => RANK[id] && RANK[id] <= 10),
    rivalry: (g) => !!g.rivalry,
    intl: (g) => (g.special || []).includes("international"),
    neutral: (g) => !!g.neutral,
    academy: (g) => (g.special || []).includes("academy") || oldSchool(g).badges.includes("SERVICE ACADEMY"),
    weeknight: (g) => isWeeknight(g.date),
    sickos: (g) => (rmap[g.id] < 6) || (g.special || []).includes("uniqueVenue"),
    special: (g) => (g.special || []).length > 0 || g.rivalry,
    oldschool: () => true,
    all: () => true,
  };
  let filtered;
  if (filter === "oldschool") {
    // Old-School view ranks the WHOLE slate by the index, not just "national" games.
    filtered = [...pool].sort((a, b) => oldSchool(b).score - oldSchool(a).score);
  } else {
    filtered = nat.filter(F[filter] || F.all).sort((a, b) => rmap[b.id] - rmap[a.id]);
  }
  const visible = filtered.slice(0, shown);

  const chips = mode === "weekday"
    ? [["weeknight", "All weeknight"], ["ranked", "Ranked"], ["academy", "Academy"], ["oldschool", "Old-school"], ["special", "Special"]]
    : [["ranked", "Ranked"], ["top10", "Top 10"], ["oldschool", "Old-school"], ["rivalry", "Rivalry"], ["intl", "Intl"], ["neutral", "Neutral"], ["academy", "Academy"], ["weeknight", "Weeknight"], ["sickos", "Sickos"], ["all", "All"]];

  return (
    <div style={{ padding: "0 14px 90px" }}>
      <div style={{ paddingTop: 12 }}>
        <SectionTitle icon={mode === "weekday" ? Zap : Star}>{mode === "weekday" ? "WEEKDAY FOOTBALL (TUE–FRI)" : "NATIONAL GAMES"}</SectionTitle>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <button onClick={() => setWk("all")} style={{ ...pillBtn, background: wk === "all" ? C.amber : C.panel, color: wk === "all" ? C.bg : C.dim }}>Whole season</button>
        {wk !== "all" && idx >= 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button onClick={() => idx > 0 && setWk(WEEKS[idx - 1].wk)} style={navBtn}><ChevronLeft size={16} /></button>
            <span style={{ fontSize: 13, color: C.ink, fontWeight: 700, minWidth: 64, textAlign: "center" }}>{WEEKS[idx].label}</span>
            <button onClick={() => idx < WEEKS.length - 1 && setWk(WEEKS[idx + 1].wk)} style={navBtn}><ChevronRight size={16} /></button>
          </div>
        )}
        {wk === "all" && <button onClick={() => setWk(1)} style={pillBtn}>By week</button>}
      </div>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 8 }}>
        {chips.map(([k, l]) => <button key={k} onClick={() => setFilter(k)} style={{ ...pillBtn, background: filter === k ? C.amber : C.panel, color: filter === k ? C.bg : C.dim, borderColor: filter === k ? C.amber : C.line }}>{l}</button>)}
      </div>
      {filtered.length > 0 && <div style={{ fontSize: 10, color: C.dim, marginBottom: 8 }}>{filtered.length} game{filtered.length === 1 ? "" : "s"}{LIVE.lastSync ? "" : " (sync in Setup to load the full national slate)"}</div>}
      {filtered.length === 0 && <Empty>{LIVE.games && LIVE.games.length ? `No games match this filter${wk === "all" ? "" : ` for ${WEEKS[idx].label}`}.` : `No games match this filter${wk === "all" ? "" : ` for ${WEEKS[idx].label}`}. This view shows your 11 teams + seeded marquee games now; run a Sync (Setup) once the season's underway and the full national FBS slate loads in here automatically — no extra setup.`}</Empty>}
      <div style={{ display: "grid", gap: 8 }}>
        {visible.map((g) => <GameCard key={g.id} g={g} priorities={priorities} {...rest} expanded={exp === g.id} onToggle={() => setExp(exp === g.id ? null : g.id)} />)}
      </div>
      {filtered.length > shown && (
        <button onClick={() => setShown((n) => n + 60)} style={{ ...pillBtn, width: "100%", marginTop: 10, justifyContent: "center" }}>Show more ({filtered.length - shown} remaining)</button>
      )}
    </div>
  );
}

/* ============================================================================
   RANKINGS VIEW  (projected — clearly labeled)
   ========================================================================== */
function RankingsView({ priorities }) {
  const ranked = Object.entries(RANK).sort((a, b) => a[1] - b[1]);
  return (
    <div style={{ padding: "12px 14px 90px" }}>
      <SectionTitle icon={TrendingUp}>RANKINGS</SectionTitle>
      {LIVE.pollName ? (
        <div style={{ background: C.green + "12", border: `1px solid ${C.green}44`, borderRadius: 10, padding: 12, marginBottom: 12, fontSize: 12, color: C.ink, lineHeight: 1.5 }}>
          <b style={{ color: C.green }}>LIVE · {LIVE.pollName}{LIVE.week ? `, week ${LIVE.week}` : ""}.</b> Pulled from CollegeFootballData and now driving Jake Ratings. Re-sync in Setup to refresh.
        </div>
      ) : (
        <div style={{ background: C.amber + "12", border: `1px solid ${C.amber}44`, borderRadius: 10, padding: 12, marginBottom: 12, fontSize: 12, color: C.ink, lineHeight: 1.5 }}>
          <b style={{ color: C.amber }}>PROJECTED — not an official poll.</b> The official AP Top 25 and Coaches Poll are released in August 2026; CFP rankings begin in November. Sync in Setup once polls exist to replace these.
        </div>
      )}
      <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 12, overflow: "hidden" }}>
        {ranked.map(([id, rk], i) => {
          const mine = TEAMS[id] && TEAMS[id].tier;
          return (
            <div key={id} style={{ display: "flex", alignItems: "center", gap: 10, padding: 10, borderBottom: i < ranked.length - 1 ? `1px solid ${C.line}` : "none", background: mine ? C.amber + "0d" : "transparent" }}>
              <span style={{ width: 24, textAlign: "center", fontWeight: 800, color: rk <= 4 ? C.amber : C.dim, fontFamily: "ui-monospace, monospace" }}>{rk}</span>
              <Logo id={id} size={26} />
              <span style={{ flex: 1, fontSize: 13, color: C.ink }}>{T(id).name}{mine ? <span style={{ color: C.amber }}> ★</span> : ""}</span>
              <span style={{ fontSize: 11, color: C.dim }}>{T(id).conf}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================================
   WEEKLY GUIDE GENERATOR
   ========================================================================== */
function GuideView({ priorities, ...rest }) {
  const [wk, setWk] = useState(1);
  const [exp, setExp] = useState(null);
  const idx = WEEKS.findIndex((w) => w.wk === wk);
  const wkGames = GAMES.filter((g) => g.wk === wk && !(rest.overrides[g.id] || {}).hidden);
  const rate = (g) => rest.overrides[g.id]?.jakeRating ?? computeJakeRating(g, priorities).score;
  const byRate = [...wkGames].sort((a, b) => rate(b) - rate(a));

  const myGames = byRate.filter((g) => [g.away, g.home].some((id) => TEAMS[id] && TEAMS[id].tier));
  const primary = byRate[0];
  const second = byRate[1];
  const flip = byRate.find((g) => g !== primary && g !== second && (g.special || []).length) || byRate[2];
  const gotw = primary;
  const special = byRate.find((g) => (g.special || []).some((s) => ["international", "academy", "week0", "neutral"].includes(s)) || g.rivalry);
  const rivalry = byRate.find((g) => g.rivalry);
  const sickos = [...wkGames].sort((a, b) => rate(a) - rate(b)).find((g) => (g.special || []).includes("uniqueVenue") || rate(g) < 6) || [...wkGames].sort((a, b) => rate(a) - rate(b))[0];
  const upset = byRate.find((g) => { const lo = RANK[g.home] && !RANK[g.away]; const hi = RANK[g.away] && !RANK[g.home]; return (g.special || []).includes("national") && (lo || hi); });
  const weeknight = byRate.filter((g) => isWeeknight(g.date));
  const confRace = byRate.find((g) => { const ct = [g.away, g.home].map((id) => TEAMS[id]?.conf); const myConfs = priorities.filter((id) => TEAMS[id]?.tier).map((id) => TEAMS[id].conf); return ct.some((c) => myConfs.includes(c)) && (RANK[g.away] || RANK[g.home]) && !myGames.includes(g); });

  const Block = ({ icon: Icon, label, g, text }) => {
    if (!g && !text) return null;
    return (
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, letterSpacing: "1px", color: C.amber, marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}>{Icon && <Icon size={12} />} {label}</div>
        {text && <div style={{ fontSize: 12, color: C.dim, marginBottom: g ? 6 : 0, lineHeight: 1.5 }}>{text}</div>}
        {g && <GameCard g={g} priorities={priorities} {...rest} expanded={exp === g.id} onToggle={() => setExp(exp === g.id ? null : g.id)} />}
      </div>
    );
  };

  return (
    <div style={{ padding: "0 14px 90px" }}>
      <div style={{ position: "sticky", top: 0, background: C.bg, paddingTop: 12, zIndex: 5 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <button onClick={() => idx > 0 && setWk(WEEKS[idx - 1].wk)} style={navBtn}><ChevronLeft size={18} /></button>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: C.ink }}>{WEEKS[idx].label} Watch Guide</div>
            <div style={{ fontSize: 11, color: C.dim }}>Built for your priorities · {shortDate(WEEKS[idx].date)}</div>
          </div>
          <button onClick={() => idx < WEEKS.length - 1 && setWk(WEEKS[idx + 1].wk)} style={navBtn}><ChevronRight size={18} /></button>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          {gotw && <button onClick={() => shareGameImage(gotw, priorities)} style={{ ...pillBtn, flex: 1, justifyContent: "center", color: C.amber, borderColor: C.amber + "66" }}><Share2 size={13} style={{ verticalAlign: -2 }} /> Game of the Week</button>}
          <button onClick={() => shareWeekImage(wk, priorities, rest.overrides)} style={{ ...pillBtn, flex: 1, justifyContent: "center", color: C.amber, borderColor: C.amber + "66" }}><Share2 size={13} style={{ verticalAlign: -2 }} /> Share the week</button>
        </div>
      </div>

      {wkGames.length === 0 && <Empty>No seeded games for {WEEKS[idx].label} yet.</Empty>}

      {myGames.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, letterSpacing: "1px", color: C.amber, marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}><Star size={12} /> YOUR TEAMS THIS WEEK ({myGames.length})</div>
          <div style={{ display: "grid", gap: 8 }}>
            {myGames.map((g) => <GameCard key={g.id} g={g} priorities={priorities} {...rest} expanded={exp === g.id} onToggle={() => setExp(exp === g.id ? null : g.id)} />)}
          </div>
        </div>
      )}

      <Block icon={Trophy} label="JAKE'S GAME OF THE WEEK" g={gotw} text={gotw ? `Top-rated game for you this week (${rate(gotw).toFixed(1)}).` : null} />
      <Block icon={Tv} label="PRIMARY SCREEN" g={primary} />
      <Block icon={Radio} label="SECOND SCREEN" g={second} />
      <Block icon={AlertTriangle} label="FLIP ALERT — KEEP AN EYE ON THIS" g={flip} />
      <Block icon={Sparkles} label="SPECIAL EVENT OF THE WEEK" g={special} />
      <Block icon={Swords} label="RIVALRY OF THE WEEK" g={rivalry} />
      {upset && <Block icon={Zap} label="UPSET ALERT" g={upset} text="Giant-killer potential — an unranked side with a real shot." />}
      {confRace && <Block icon={TrendingUp} label="CONFERENCE-RACE GAME" g={confRace} text="Result moves the standings in one of your teams' leagues." />}
      <Block icon={Moon} label="SICKOS PICK" g={sickos} text="Overlooked or weird — exactly the kind you'd flip to at 1 a.m." />

      {weeknight.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, letterSpacing: "1px", color: C.amber, marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}><Zap size={12} /> WEEKNIGHT FOOTBALL</div>
          <div style={{ display: "grid", gap: 8 }}>
            {weeknight.map((g) => <GameCard key={g.id} g={g} priorities={priorities} {...rest} expanded={exp === g.id} onToggle={() => setExp(exp === g.id ? null : g.id)} />)}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   LIVE — scoreboard + flip alerts
   ========================================================================== */
function LiveView({ priorities, doRefreshScores, scoresAt, syncing, ...rest }) {
  const [exp, setExp] = useState(null);
  const todayStr = new Date().toISOString().slice(0, 10);
  const alerts = flipAlerts(priorities);

  // games with a live/recent score, prioritized
  const scored = GAMES.filter((g) => liveScore(g)).sort((a, b) => scoreOrder(a, priorities) - scoreOrder(b, priorities));
  // today's scheduled games without live data
  const todayGames = allCombinedGames().filter((g) => g.date === todayStr && !liveScore(g)).sort((a, b) => computeJakeRating(b, priorities).score - computeJakeRating(a, priorities).score);

  const ScoreRow = ({ g }) => {
    const ls = liveScore(g); const a = T(g.away), h = T(g.home);
    const done = /final|completed/i.test(String(ls.status || ""));
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.panel, border: `1px solid ${C.line}`, borderRadius: 10, padding: "9px 11px" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: C.ink }}>
            <Logo id={g.away} size={22} /><span style={{ fontFamily: "ui-monospace,monospace", minWidth: 22, textAlign: "right" }}>{ls.as ?? "–"}</span>
            <span style={{ color: C.dim }}>{a.short}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: C.ink, marginTop: 3 }}>
            <Logo id={g.home} size={22} /><span style={{ fontFamily: "ui-monospace,monospace", minWidth: 22, textAlign: "right" }}>{ls.hs ?? "–"}</span>
            <span style={{ color: C.dim }}>{h.short}</span>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: done ? C.dim : C.green, fontWeight: 700 }}>{done ? "FINAL" : (ls.status || "LIVE")}</div>
          {!done && (ls.period || ls.clock) && <div style={{ fontSize: 10, color: C.dim }}>{ls.clock || ""} {ls.period ? `Q${ls.period}` : ""}</div>}
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: "0 14px 90px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, marginBottom: 4 }}>
        <SectionTitle icon={Radio}>LIVE SCOREBOARD</SectionTitle>
        <button onClick={doRefreshScores} disabled={syncing} style={{ ...pillBtn, background: syncing ? C.panel2 : C.amber, color: syncing ? C.dim : C.bg, borderColor: C.amber }}>{syncing ? "…" : "Refresh"}</button>
      </div>
      <div style={{ fontSize: 10, color: C.dim, marginBottom: 12 }}>{scoresAt ? `Scores updated ${timeAgo(scoresAt)}` : "Tap Refresh during game days to pull the live scoreboard (prioritized to your teams)."}</div>

      {alerts.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, letterSpacing: "1px", color: C.red, marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}><AlertTriangle size={12} /> FLIP ALERTS</div>
          <div style={{ display: "grid", gap: 8 }}>
            {alerts.map(({ g, why }) => {
              const ls = liveScore(g);
              return (
                <div key={g.id} style={{ background: C.red + "12", border: `1px solid ${C.red}44`, borderRadius: 10, padding: 10 }}>
                  <div style={{ fontSize: 13, color: C.ink, fontWeight: 700 }}>{T(g.away).short} {ls.as}–{ls.hs} {T(g.home).short}</div>
                  <div style={{ fontSize: 11, color: C.red, marginTop: 2 }}>{why} — flip here.</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {scored.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, letterSpacing: "1px", color: C.amber, marginBottom: 8 }}>LIVE / RECENT</div>
          <div style={{ display: "grid", gap: 8 }}>{scored.map((g) => <ScoreRow key={g.id} g={g} />)}</div>
        </div>
      )}

      {todayGames.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, letterSpacing: "1px", color: C.amber, marginBottom: 8 }}>ON TODAY</div>
          <div style={{ display: "grid", gap: 8 }}>
            {todayGames.map((g) => <GameCard key={g.id} g={g} priorities={priorities} {...rest} expanded={exp === g.id} onToggle={() => setExp(exp === g.id ? null : g.id)} />)}
          </div>
        </div>
      )}

      {alerts.length === 0 && scored.length === 0 && todayGames.length === 0 &&
        <Empty>No live or scheduled games right now — it's the offseason/preseason. On game days, tap Refresh to pull live scores; flip alerts appear automatically when your teams or ranked games get close late.</Empty>}
    </div>
  );
}
function scoreOrder(g, priorities) {
  const p = Math.min(...[g.away, g.home].map((id) => { const i = priorities.indexOf(id); return i < 0 ? 99 : i; }));
  const ranked = [g.away, g.home].some((id) => RANK[id]) ? 0 : 1;
  return p * 2 + ranked;
}

/* ============================================================================
   THE WAR ROOM — rooting scenarios, conference races, playoff/bowl outlook
   ========================================================================== */
function WarRoomView({ priorities, results, ...rest }) {
  const [wk, setWk] = useState(1);
  const [exp, setExp] = useState(null);
  const idx = WEEKS.findIndex((w) => w.wk === wk);
  const board = useMemo(() => weekRooting(wk).slice(0, 14), [wk, LIVE.lastSync]);

  return (
    <div style={{ padding: "0 14px 90px" }}>
      <div style={{ paddingTop: 12 }}>
        <div style={{ fontFamily: "var(--gc-display)", fontSize: 22, fontWeight: 800, letterSpacing: "1px", color: C.ink }}>THE WAR ROOM</div>
        <div style={{ fontSize: 11, color: C.dim, marginTop: 2 }}>Who to root for across the country — and where your teams stand.</div>
      </div>

      {/* rooting board */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "14px 0 8px" }}>
        <button onClick={() => idx > 0 && setWk(WEEKS[idx - 1].wk)} style={navBtn}><ChevronLeft size={16} /></button>
        <span style={{ flex: 1, textAlign: "center", fontWeight: 700, color: C.ink }}>{WEEKS[idx].label} · rooting board</span>
        <button onClick={() => idx < WEEKS.length - 1 && setWk(WEEKS[idx + 1].wk)} style={navBtn}><ChevronRight size={16} /></button>
      </div>
      {board.length === 0 && <Empty>No rooting angles seeded for {WEEKS[idx].label} yet. Sync the national slate (Setup) and this fills with every game that moves the needle for MSU, ND, or WVU.</Empty>}
      <div style={{ display: "grid", gap: 8 }}>
        {board.map(({ g, rootFor, helps, reason }) => (
          <div key={g.id} style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 10, padding: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Logo id={g.away} size={22} /><span style={{ fontSize: 12, color: C.dim }}>{T(g.away).short}</span>
              <span style={{ fontSize: 11, color: C.dim }}>{g.neutral ? "vs" : "@"}</span>
              <Logo id={g.home} size={22} /><span style={{ fontSize: 12, color: C.ink, flex: 1 }}>{T(g.home).short}</span>
              <span style={{ fontSize: 10, color: C.dim }}>{shortDate(g.date)}</span>
            </div>
            <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8, background: C.green + "12", border: `1px solid ${C.green}33`, borderRadius: 8, padding: "6px 8px" }}>
              <Flag size={13} color={C.green} />
              <span style={{ fontSize: 12, color: C.ink }}>Root for <b style={{ color: C.green }}>{T(rootFor).short}</b> — {reason}.</span>
              {helps.length > 0 && <span style={{ marginLeft: "auto", fontSize: 10, color: C.amber, fontWeight: 700 }}>helps {helps.join(" · ")}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* conference races */}
      <SectionTitle icon={Trophy}>YOUR CONFERENCE RACES</SectionTitle>
      {TIER1.filter((id) => normConf(TEAMS[id].conf)).map((id) => {
        const conf = normConf(TEAMS[id].conf);
        const standings = conferenceStandings(conf, results).filter((s) => s.rec.played);
        const rem = remainingFor(id, results);
        return (
          <div key={id} style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 12, padding: 12, marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Logo id={id} size={24} /><span style={{ fontWeight: 700, color: C.ink, fontSize: 13, flex: 1 }}>{TEAMS[id].short} · {conf}</span>
              <span style={{ fontSize: 11, color: C.dim }}>{rem.remaining} games left</span>
            </div>
            {standings.length === 0
              ? <div style={{ fontSize: 11, color: C.dim }}>Standings populate as you enter results (or sync in-season).</div>
              : standings.slice(0, 6).map((s, i) => (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", background: s.id === id ? C.amber + "0d" : "transparent" }}>
                  <span style={{ width: 16, fontSize: 11, color: C.dim, fontFamily: "var(--gc-mono)" }}>{i + 1}</span>
                  <Logo id={s.id} size={18} /><span style={{ flex: 1, fontSize: 12, color: C.ink }}>{T(s.id).short}{s.id === id ? " ★" : ""}</span>
                  <span style={{ fontSize: 12, color: C.amber, fontFamily: "var(--gc-mono)" }}>{s.rec.cw}–{s.rec.cl}</span>
                </div>
              ))}
          </div>
        );
      })}

      {/* playoff / bowl outlook */}
      <SectionTitle icon={TrendingUp}>PLAYOFF & BOWL OUTLOOK</SectionTitle>
      {TIER1.map((id) => {
        const rec = teamRecord(id, results); const rem = remainingFor(id, results);
        return (
          <div key={id} style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 12, padding: 12, marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Logo id={id} size={24} /><span style={{ fontWeight: 700, color: C.ink, fontSize: 13, flex: 1 }}>{TEAMS[id].name}</span>
              <span style={{ fontFamily: "var(--gc-mono)", color: C.ink, fontWeight: 800 }}>{rec.w}–{rec.l}</span>
            </div>
            <div style={{ fontSize: 11, color: C.dim, marginTop: 6, lineHeight: 1.6 }}>
              {RANK[id] ? <span style={{ color: C.amber }}>Ranked #{RANK[id]}{LIVE.pollName ? "" : " (proj)"} · </span> : null}
              {rec.bowlEligible ? <span style={{ color: C.green }}>Bowl eligible ✓ · </span> : `${Math.max(0, 6 - rec.w)} win(s) from bowl eligibility · `}
              {rem.remaining} games left{rem.rankedLeft ? `, ${rem.rankedLeft} vs ranked` : ""}.
              {id === "notre-dame" ? " Independent — chasing an at-large CFP bid." : ""}
            </div>
          </div>
        );
      })}
      <div style={{ fontSize: 10, color: C.dim, marginTop: 4, lineHeight: 1.5 }}>Outlook is honest and simple — record, ranking, remaining slate, bowl math. No fabricated playoff percentages; it sharpens as results come in.</div>
    </div>
  );
}

/* ============================================================================
   PLAYERS — Heisman Watch + national stat leaders (V3 Pass 6)
   ========================================================================== */
function PlayerRow({ p, rank, stat, accent }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: `1px solid ${C.line}` }}>
      {rank != null && <span style={{ width: 18, fontFamily: "var(--gc-mono)", fontSize: 12, color: rank <= 3 ? C.amber : C.dim, fontWeight: 800 }}>{rank}</span>}
      <Logo id={p.teamId} size={22} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: C.ink, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.player}</div>
        <div style={{ fontSize: 10.5, color: C.dim }}>{T(p.teamId).short}{p.pos ? ` · ${p.pos}` : ""}</div>
      </div>
      <div style={{ fontSize: 12, color: accent || C.amber, fontFamily: "var(--gc-mono)", textAlign: "right" }}>{stat}</div>
    </div>
  );
}
function PlayersView({ onLoadPlayers, playersMeta }) {
  const [tab, setTab] = useState("heisman");
  const loaded = PLAYERS.heisman.length > 0;
  const tabs = [["heisman", "Heisman"], ["passing", "Passing"], ["rushing", "Rushing"], ["receiving", "Receiving"]];
  const topPass = [...PLAYERS.passing].sort((a, b) => (b.YDS || 0) - (a.YDS || 0)).slice(0, 20);
  const topRush = [...PLAYERS.rushing].sort((a, b) => (b.YDS || 0) - (a.YDS || 0)).slice(0, 20);
  const topRec = [...PLAYERS.receiving].sort((a, b) => (b.YDS || 0) - (a.YDS || 0)).slice(0, 20);
  const maxH = PLAYERS.heisman[0] ? PLAYERS.heisman[0].score : 1;
  return (
    <div style={{ padding: "12px 14px 90px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ fontFamily: "var(--gc-display)", fontSize: 22, fontWeight: 800, letterSpacing: "1px", color: C.ink }}>PLAYERS</div>
        <button onClick={() => onLoadPlayers && onLoadPlayers()} style={{ ...pillBtn, color: C.ink, borderColor: C.line }}>{loaded ? "Refresh" : "Load stats"}</button>
      </div>
      {!loaded && <Empty>No player data yet. Tap "Load stats" (3 calls, cached) to pull national leaders and build the Heisman Watch. Auto-loads on your first in-season sync.</Empty>}
      {loaded && (
        <>
          <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 10 }}>
            {tabs.map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)} style={{ ...pillBtn, whiteSpace: "nowrap", background: tab === k ? C.amber : C.panel, color: tab === k ? C.bg : C.dim, borderColor: tab === k ? C.amber : C.line }}>{l}</button>
            ))}
          </div>
          {tab === "heisman" && (
            <>
              <div style={{ fontSize: 11, color: C.dim, marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}><Award size={13} color={C.amber} /> HEISMAN WATCH — model estimate (production × team quality)</div>
              {PLAYERS.heisman.map((p, i) => (
                <div key={p.player + p.team} style={{ background: i === 0 ? C.amber + "12" : C.panel, border: `1px solid ${i === 0 ? C.amber + "66" : C.line}`, borderRadius: 10, padding: 10, marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 20, fontFamily: "var(--gc-mono)", fontWeight: 800, color: i < 3 ? C.amber : C.dim }}>{i + 1}</span>
                    <Logo id={p.teamId} size={26} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, color: C.ink, fontWeight: 700 }}>{p.player} <span style={{ fontSize: 10, color: C.dim, fontWeight: 400 }}>{p.pos}</span></div>
                      <div style={{ fontSize: 11, color: C.dim }}>{T(p.teamId).short} · {p.line}</div>
                    </div>
                  </div>
                  <div style={{ height: 4, background: C.line, borderRadius: 99, overflow: "hidden", marginTop: 8 }}><div style={{ width: Math.round((p.score / maxH) * 100) + "%", height: "100%", background: i === 0 ? C.amber : C.green }} /></div>
                </div>
              ))}
              <div style={{ fontSize: 9, color: C.dim, marginTop: 4 }}>Not an official watch list — a transparent model from real season stats, weighted by team strength.</div>
            </>
          )}
          {tab === "passing" && <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 12, padding: "4px 12px" }}>{topPass.map((p, i) => <PlayerRow key={p.player + p.team} p={{ ...p, pos: "QB" }} rank={i + 1} stat={`${p.YDS || 0} yds · ${p.TD || 0} TD`} />)}</div>}
          {tab === "rushing" && <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 12, padding: "4px 12px" }}>{topRush.map((p, i) => <PlayerRow key={p.player + p.team} p={{ ...p, pos: "RB" }} rank={i + 1} stat={`${p.YDS || 0} yds · ${p.TD || 0} TD`} accent={C.green} />)}</div>}
          {tab === "receiving" && <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 12, padding: "4px 12px" }}>{topRec.map((p, i) => <PlayerRow key={p.player + p.team} p={{ ...p, pos: "WR" }} rank={i + 1} stat={`${p.YDS || 0} yds · ${p.TD || 0} TD`} accent="#5aa9e6" />)}</div>}
        </>
      )}
    </div>
  );
}

/* export helpers */
/* ---- Shareable graphics (Canvas → PNG, offline, Fanbound-ready) ---- */
function _roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
function _crest(ctx, id, x, y, s) {
  const t = T(id), c1 = t.colors[0] || "#555", c2 = t.colors[1] || "#999";
  ctx.save(); _roundRect(ctx, x, y, s, s, s * 0.22); ctx.fillStyle = c1; ctx.fill();
  _roundRect(ctx, x, y, s, s, s * 0.22); ctx.clip();
  ctx.globalAlpha = 0.22; ctx.fillStyle = c2; ctx.beginPath(); ctx.moveTo(x + s, y + s * 0.05); ctx.lineTo(x + s, y + s * 0.45); ctx.lineTo(x + s * 0.55, y + s); ctx.lineTo(x + s * 0.15, y + s); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
  ctx.fillStyle = "rgba(0,0,0,0.34)"; _roundRect(ctx, x + s * 0.08, y + s * 0.37, s * 0.84, s * 0.3, s * 0.05); ctx.fill();
  ctx.restore();
  ctx.fillStyle = "#fff"; ctx.font = `800 ${s * 0.26}px ui-monospace, monospace`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(String(t.short).slice(0, 5), x + s / 2, y + s * 0.53);
}
function loadImg(src) { return new Promise((res) => { if (!src) { res(null); return; } const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = src; }); }
async function _logoImgs(ids) { const imgs = {}; for (const id of ids) { const d = LOGO_DATA[id]; if (d) imgs[id] = await loadImg(d); } return imgs; }
function _crestImg(ctx, id, x, y, s, imgs) {
  const img = imgs && imgs[id];
  if (!img) { _crest(ctx, id, x, y, s); return; }
  ctx.save(); _roundRect(ctx, x, y, s, s, s * 0.18); ctx.fillStyle = "rgba(255,255,255,0.07)"; ctx.fill();
  const pad = s * 0.1; try { ctx.drawImage(img, x + pad, y + pad, s - 2 * pad, s - 2 * pad); } catch (e) { _crest(ctx, id, x, y, s); }
  ctx.restore();
}
function _bg(ctx, W, H) {
  const grad = ctx.createLinearGradient(0, 0, 0, H); grad.addColorStop(0, C.panel); grad.addColorStop(1, C.bg);
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "rgba(255,255,255,0.04)"; ctx.lineWidth = 2;
  for (let xx = 90; xx < W; xx += 95) { ctx.beginPath(); ctx.moveTo(xx, 0); ctx.lineTo(xx, H); ctx.stroke(); }
  ctx.fillStyle = C.amber; ctx.fillRect(0, 0, W, 8);
}
function _download(cv, name) { const url = cv.toDataURL("image/png"); const a = document.createElement("a"); a.href = url; a.download = name; a.click(); }
async function shareGameImage(g, priorities) {
  try {
    const imgs = await _logoImgs([g.away, g.home]);
    const W = 1080, H = 1350, cv = document.createElement("canvas"); cv.width = W; cv.height = H;
    const ctx = cv.getContext("2d"); if (!ctx) throw new Error("no canvas");
    _bg(ctx, W, H);
    ctx.textAlign = "left"; ctx.fillStyle = C.amber; ctx.font = "800 40px 'Arial Narrow', sans-serif"; ctx.fillText("GRIDIRON COMMAND", 70, 100);
    ctx.fillStyle = C.dim; ctx.font = "28px ui-monospace, monospace"; ctx.fillText("JAKE'S GAME OF THE WEEK", 70, 145);
    _crestImg(ctx, g.away, 90, 230, 200, imgs); _crestImg(ctx, g.home, W - 90 - 200, 230, 200, imgs);
    ctx.textAlign = "center"; ctx.fillStyle = C.dim; ctx.font = "700 46px 'Arial Narrow'"; ctx.fillText(g.neutral ? "VS" : "AT", W / 2, 345);
    ctx.fillStyle = C.ink; ctx.font = "800 60px 'Arial Narrow'"; ctx.fillText(`${T(g.away).short}  ${g.neutral ? "vs" : "@"}  ${T(g.home).short}`, W / 2, 510);
    ctx.fillStyle = C.dim; ctx.font = "30px 'Arial Narrow'"; ctx.fillText(`${T(g.away).name}  ·  ${T(g.home).name}`, W / 2, 560);
    const r = computeJakeRating(g, priorities).score, os = oldSchool(g);
    ctx.fillStyle = C.amber; ctx.font = "800 130px ui-monospace"; ctx.fillText(r.toFixed(1), W * 0.29, 730);
    ctx.fillStyle = C.dim; ctx.font = "26px 'Arial Narrow'"; ctx.fillText("JAKE RATING", W * 0.29, 775);
    ctx.fillStyle = "#d98a5a"; ctx.font = "800 130px ui-monospace"; ctx.fillText(String(os.score), W * 0.71, 730);
    ctx.fillStyle = C.dim; ctx.font = "26px 'Arial Narrow'"; ctx.fillText("OLD-SCHOOL INDEX", W * 0.71, 775);
    ctx.fillStyle = C.ink; ctx.font = "36px 'Arial Narrow'"; ctx.fillText(`${dayName(g.date)} ${shortDate(g.date)}  ·  ${g.et || "TBD"}  ·  ${whereToWatch(g) || g.tv || "TBD"}`, W / 2, 880);
    const badges = os.badges.slice(0, 3); let bx = W / 2 - (badges.length * 150) / 2;
    ctx.font = "700 26px 'Arial Narrow'";
    badges.forEach((b) => { const bw = 140; ctx.fillStyle = "rgba(242,177,52,0.15)"; _roundRect(ctx, bx, 920, bw, 46, 10); ctx.fill(); ctx.fillStyle = C.amber; ctx.fillText(b.slice(0, 12), bx + bw / 2, 950); bx += bw + 12; });
    const take = jakesTake(g, priorities);
    if (take) { ctx.fillStyle = C.ink; ctx.font = "italic 34px 'Arial Narrow'"; _wrap(ctx, `\u201c${take}\u201d`, W / 2, 1080, W - 180, 46); }
    ctx.fillStyle = C.dim; ctx.font = "24px ui-monospace"; ctx.fillText("HENDERSON.SYS // GRIDIRON COMMAND", W / 2, H - 55);
    _download(cv, `gotw-${g.id}.png`); return true;
  } catch (e) { alert("Couldn't render the image in this browser."); return false; }
}
function _wrap(ctx, text, cx, y, maxW, lh) {
  const words = text.split(" "); let line = ""; const lines = [];
  words.forEach((w) => { const t = line ? line + " " + w : w; if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t; });
  if (line) lines.push(line);
  lines.slice(0, 3).forEach((l, i) => ctx.fillText(l, cx, y + i * lh));
}
async function shareWeekImage(wk, priorities, overrides) {
  try {
    const top = gamesForWeek(wk).map((g) => ({ g, r: (overrides[g.id] || {}).jakeRating ?? computeJakeRating(g, priorities).score })).sort((a, b) => b.r - a.r).slice(0, 8);
    const imgs = await _logoImgs(top.flatMap((x) => [x.g.away, x.g.home]));
    const W = 1080, H = 1350, cv = document.createElement("canvas"); cv.width = W; cv.height = H;
    const ctx = cv.getContext("2d"); if (!ctx) throw new Error("no canvas");
    _bg(ctx, W, H);
    const wl = WEEKS.find((w) => w.wk === wk);
    ctx.textAlign = "left"; ctx.fillStyle = C.amber; ctx.font = "800 40px 'Arial Narrow'"; ctx.fillText("GRIDIRON COMMAND", 70, 100);
    ctx.fillStyle = C.ink; ctx.font = "800 52px 'Arial Narrow'"; ctx.fillText(`${wl ? wl.label.toUpperCase() : "THE WEEK"} — WHAT TO WATCH`, 70, 165);
    let y = 250;
    top.forEach((x, i) => {
      const g = x.g; ctx.fillStyle = i % 2 ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.05)"; _roundRect(ctx, 60, y, W - 120, 120, 14); ctx.fill();
      _crestImg(ctx, g.away, 80, y + 20, 80, imgs); _crestImg(ctx, g.home, 175, y + 20, 80, imgs);
      ctx.textAlign = "left"; ctx.fillStyle = C.ink; ctx.font = "700 40px 'Arial Narrow'"; ctx.fillText(`${T(g.away).short} ${g.neutral ? "vs" : "@"} ${T(g.home).short}`, 290, y + 55);
      ctx.fillStyle = C.dim; ctx.font = "26px 'Arial Narrow'"; ctx.fillText(`${dayName(g.date)} · ${g.et || "TBD"} · ${whereToWatch(g) || g.tv || "TBD"}`, 290, y + 92);
      ctx.textAlign = "right"; ctx.fillStyle = C.amber; ctx.font = "800 56px ui-monospace"; ctx.fillText(x.r.toFixed(1), W - 90, y + 78);
      y += 132;
    });
    ctx.textAlign = "center"; ctx.fillStyle = C.dim; ctx.font = "24px ui-monospace"; ctx.fillText("HENDERSON.SYS // GRIDIRON COMMAND", W / 2, H - 45);
    _download(cv, `week-${wk}.png`); return true;
  } catch (e) { alert("Couldn't render the image in this browser."); return false; }
}
async function shareWrappedImage(s) {
  try {
    const imgs = await _logoImgs(s.topTeam ? [s.topTeam[0]] : []);
    const W = 1080, H = 1350, cv = document.createElement("canvas"); cv.width = W; cv.height = H;
    const ctx = cv.getContext("2d"); if (!ctx) throw new Error("no canvas");
    _bg(ctx, W, H);
    ctx.textAlign = "center";
    ctx.fillStyle = C.amber; ctx.font = "800 44px 'Arial Narrow'"; ctx.fillText("GRIDIRON COMMAND", W / 2, 110);
    ctx.fillStyle = C.dim; ctx.font = "30px ui-monospace"; ctx.fillText("YOUR 2026 SEASON, WRAPPED", W / 2, 158);
    ctx.fillStyle = C.ink; ctx.font = "800 240px ui-monospace"; ctx.fillText(String(s.total), W / 2, 430);
    ctx.fillStyle = C.dim; ctx.font = "34px 'Arial Narrow'"; ctx.fillText(`GAMES WATCHED  ·  ~${s.hours} HOURS  ·  ${s.confCount} CONFERENCES`, W / 2, 500);
    let y = 620; const line = (k, v) => { ctx.textAlign = "left"; ctx.fillStyle = C.dim; ctx.font = "34px 'Arial Narrow'"; ctx.fillText(k, 110, y); ctx.textAlign = "right"; ctx.fillStyle = C.ink; ctx.font = "700 34px 'Arial Narrow'"; ctx.fillText(v, W - 110, y); ctx.strokeStyle = "rgba(255,255,255,0.08)"; ctx.beginPath(); ctx.moveTo(110, y + 22); ctx.lineTo(W - 110, y + 22); ctx.stroke(); y += 84; };
    if (s.topTeam) line("Most-watched team", `${T(s.topTeam[0]).short} (${s.topTeam[1]})`);
    if (s.topSlot) line("Favorite slot", `${s.topSlot[0]}`);
    if (s.favGame) line("Favorite game", s.favGame);
    if (s.weeknights != null) line("Weeknight games", String(s.weeknights));
    if (s.earned != null) line("Achievements", `${s.earned} unlocked`);
    ctx.textAlign = "center"; ctx.fillStyle = C.amber; ctx.font = "italic 34px 'Arial Narrow'"; ctx.fillText("The most college football you've ever watched.", W / 2, y + 40);
    ctx.fillStyle = C.dim; ctx.font = "24px ui-monospace"; ctx.fillText("HENDERSON.SYS // GRIDIRON COMMAND", W / 2, H - 50);
    _download(cv, "wrapped-2026.png"); return true;
  } catch (e) { alert("Couldn't render the image in this browser."); return false; }
}

function downloadFile(name, text, type) {
  try {
    const blob = new Blob([text], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = name; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (e) { /* no-op */ }
}
function exportJSON(watched, overrides, priorities, results) {
  const data = { exportedAt: new Date().toISOString(), season: 2026, priorities, teams: TEAMS, games: GAMES, watched, overrides, results };
  downloadFile("gridiron-command-2026.json", JSON.stringify(data, null, 2), "application/json");
}
function exportCSV() {
  const rows = [["id", "week", "date", "away", "home", "neutral", "venue", "tv", "et", "status", "rivalry", "source"]];
  GAMES.forEach((g) => rows.push([g.id, g.wk, g.date, T(g.away).name, T(g.home).name, g.neutral ? "neutral" : "", g.venue || "", g.tv || "", g.et || "", g.status, g.rivalry || "", (g.src || "").replace(/,/g, ";")]));
  downloadFile("gridiron-schedule-2026.csv", rows.map((r) => r.map((c) => `"${String(c)}"`).join(",")).join("\n"), "text/csv");
}
function icsStart(dateStr, et) {
  if (!et || et === "TBD") return { allDay: true, v: dateStr.replace(/-/g, "") };
  const m = et.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return { allDay: true, v: dateStr.replace(/-/g, "") };
  let hr = parseInt(m[1], 10); if (/pm/i.test(m[3]) && hr !== 12) hr += 12; if (/am/i.test(m[3]) && hr === 12) hr = 0;
  return { allDay: false, v: `${dateStr.replace(/-/g, "")}T${String(hr).padStart(2, "0")}${m[2]}00` };
}
function exportICS(overrides) {
  const wanted = GAMES.filter((g) => [g.away, g.home].some((id) => TEAMS[id] && TEAMS[id].tier) || (overrides[g.id] || {}).forced);
  const L = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Gridiron Command//2026//EN", "CALSCALE:GREGORIAN"];
  wanted.forEach((g) => {
    const et = (overrides[g.id] || {}).et || g.et, tv = (overrides[g.id] || {}).tv || g.tv;
    const d = icsStart(g.date, et);
    L.push("BEGIN:VEVENT", "UID:" + g.id + "@gridiron-command");
    L.push(d.allDay ? "DTSTART;VALUE=DATE:" + d.v : "DTSTART;TZID=America/New_York:" + d.v);
    L.push("DURATION:" + (d.allDay ? "P1D" : "PT3H30M"));
    L.push("SUMMARY:CFB — " + T(g.away).short + (g.neutral ? " vs " : " @ ") + T(g.home).short + (g.rivalry ? " (" + g.rivalry + ")" : ""));
    const desc = [g.venue ? "Venue: " + g.venue : "", tv ? "TV: " + tv : ""].filter(Boolean).join("\\n");
    if (desc) L.push("DESCRIPTION:" + desc);
    L.push("END:VEVENT");
  });
  L.push("END:VCALENDAR");
  downloadFile("gridiron-2026.ics", L.join("\r\n"), "text/calendar");
}

/* ============================================================================
   LIVE DATA — CollegeFootballData API v2 sync (api.collegefootballdata.com)
   Free tier: 1,000 calls/month. Auth: Authorization: Bearer <key>.
   ========================================================================== */
function normName(s) { return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, ""); }
const APP_BY_PAIR = {};
GAMES.forEach((g) => { APP_BY_PAIR[[normName(T(g.away).name), normName(T(g.home).name)].sort().join("|")] = g; });
const NAME_TO_ID = {};
Object.values(TEAMS).forEach((t) => { NAME_TO_ID[normName(t.name)] = t.id; });

/* ---- Data endpoints: direct, or through your hosted proxy (Worker) ---- */
let PROXY_BASE = ""; // set from cfb:proxybase; when set, the Worker holds the key + fixes CORS
function proxied() { return !!PROXY_BASE; }
function cfbdBase() { return PROXY_BASE ? PROXY_BASE.replace(/\/$/, "") + "/cfbd" : "https://api.collegefootballdata.com"; }
function weatherBase() { return PROXY_BASE ? PROXY_BASE.replace(/\/$/, "") + "/weather" : "https://api.open-meteo.com/v1/forecast"; }

async function cfbdFetch(path, key, _retry) {
  try {
    const headers = proxied() ? {} : { Authorization: "Bearer " + key };
    const res = await fetch(cfbdBase() + path, { headers });
    if (res.status === 401) throw new Error("Invalid API key (401). Grab a free key at collegefootballdata.com/key.");
    if (res.status === 429) throw new Error("Rate limit hit (429). The free tier is 1,000 calls/month.");
    if (!res.ok) throw new Error("API error " + res.status + ".");
    return res.json();
  } catch (e) {
    const net = e instanceof TypeError || /Failed to fetch|NetworkError|load failed/i.test(e.message || "");
    if (net && !_retry) { await new Promise((r) => setTimeout(r, 700)); return cfbdFetch(path, key, true); }
    throw e;
  }
}

/* ---- IndexedDB cache layer (for logos, teams, stats, history — beyond localStorage's ~5MB) ---- */
let _IDB = null;
function idbOpen() {
  if (_IDB) return _IDB;
  _IDB = new Promise((resolve, reject) => {
    try {
      const req = indexedDB.open("gridiron", 1);
      req.onupgradeneeded = () => { const db = req.result; if (!db.objectStoreNames.contains("kv")) db.createObjectStore("kv"); };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    } catch (e) { reject(e); }
  });
  return _IDB;
}
async function idbSet(key, val) { const db = await idbOpen(); return new Promise((res, rej) => { const tx = db.transaction("kv", "readwrite"); tx.objectStore("kv").put(val, key); tx.oncomplete = () => res(true); tx.onerror = () => rej(tx.error); }); }
async function idbGet(key) { const db = await idbOpen(); return new Promise((res, rej) => { const tx = db.transaction("kv", "readonly"); const r = tx.objectStore("kv").get(key); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }); }
async function idbDel(key) { const db = await idbOpen(); return new Promise((res, rej) => { const tx = db.transaction("kv", "readwrite"); tx.objectStore("kv").delete(key); tx.oncomplete = () => res(true); tx.onerror = () => rej(tx.error); }); }

/* ---- Diagnostics: one-tap "why isn't live data working?" self-test ---- */
async function runDiagnostics({ key }) {
  const results = []; let calls = 0;
  const K = key || (typeof window !== "undefined" && window.CFBD_KEY) || "";
  try { const t = "__diag__"; window.localStorage.setItem(t, "1"); const ok = window.localStorage.getItem(t) === "1"; window.localStorage.removeItem(t);
    results.push({ label: "Local storage", status: ok ? "ok" : "warn", detail: ok ? "Working — your watch log and settings persist." : "Not writable — data won't persist between sessions." });
  } catch (e) { results.push({ label: "Local storage", status: "warn", detail: "Blocked (in-memory only). Watch log won't survive a reload — check private-browsing settings." }); }
  results.push({ label: "API key", status: K ? "ok" : "warn", detail: K ? `Set (${K.length} chars).` : "No key — live data is off. Paste one in Setup or edit window.CFBD_KEY at the top of the HTML." });
  const online = typeof navigator === "undefined" || navigator.onLine !== false;
  results.push({ label: "Network", status: online ? "ok" : "fail", detail: online ? "Browser reports you're online." : "Offline — reconnect for live data. Everything else still works." });
  const proto = (typeof location !== "undefined" && location.protocol) || "";
  const isFile = proto === "file:";
  results.push({ label: "How it's opened", status: isFile ? "warn" : "ok", detail: isFile ? "Opened as a local file (file://). Some browsers block API calls from here — if the API check below fails, open in Firefox/Safari or host the file." : `Served over ${proto || "http"} — API calls are allowed.` });
  results.push({ label: "Data proxy", status: proxied() ? "ok" : "warn", detail: proxied() ? `Routing through your proxy (${PROXY_BASE}) — key hidden, CORS solved.` : "Direct mode (no proxy). Set a proxy URL in Setup once hosted to hide your key and fix CORS." });
  try { await idbOpen(); results.push({ label: "IndexedDB cache", status: "ok", detail: "Available — logos and big datasets can cache offline." }); }
  catch (e) { results.push({ label: "IndexedDB cache", status: "warn", detail: "Unavailable (private mode?) — falls back to lighter caching." }); }
  if (K && online) {
    try {
      const res = await fetch(cfbdBase() + "/conferences", { headers: proxied() ? {} : { Authorization: "Bearer " + K } });
      calls = 1;
      if (res.status === 401) results.push({ label: "CFBD API", status: "fail", detail: "Reached the API, but your key was rejected (401). Rotate it at collegefootballdata.com/key and paste the new one in." });
      else if (res.status === 429) results.push({ label: "CFBD API", status: "warn", detail: "Reached the API but you're rate-limited (429). Wait a bit — check the usage meter." });
      else if (res.ok) results.push({ label: "CFBD API", status: "ok", detail: "Connected and key accepted. Live data will sync." });
      else results.push({ label: "CFBD API", status: "warn", detail: "Reached the API but got HTTP " + res.status + "." });
    } catch (e) {
      results.push({ label: "CFBD API", status: "fail", detail: isFile ? "Couldn't reach the API — almost certainly the file:// block. Open in Firefox/Safari, or host the file." : "Couldn't reach the API (network or CORS). Check your connection." });
    }
  } else results.push({ label: "CFBD API", status: "warn", detail: "Skipped — needs a key and a network connection." });
  if (online) {
    try { const r = await fetch("https://api.open-meteo.com/v1/forecast?latitude=42&longitude=-84&daily=temperature_2m_max&timezone=auto&start_date=2026-11-14&end_date=2026-11-14");
      results.push({ label: "Weather (Open-Meteo)", status: r.ok ? "ok" : "warn", detail: r.ok ? "Reachable — no key needed." : "Got HTTP " + r.status + "." });
    } catch (e) { results.push({ label: "Weather (Open-Meteo)", status: "warn", detail: "Couldn't reach weather (likely the same file:// block)." }); }
  }
  return { results, calls };
}
function timeAgo(iso) {
  if (!iso) return null; const s = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return s + "s ago"; if (s < 3600) return Math.round(s / 60) + "m ago"; if (s < 86400) return Math.round(s / 3600) + "h ago"; return Math.round(s / 86400) + "d ago";
}

async function syncCFBD({ key, results, overrides, full, prevLive }) {
  let calls = 0;
  const games = await cfbdFetch("/games?year=2026&seasonType=both", key); calls++;
  let rankingsRaw = [], linesRaw = [], statsRaw = [], mediaRaw = [];
  if (full) {
    try { rankingsRaw = await cfbdFetch("/rankings?year=2026", key); calls++; } catch (e) { /* optional */ }
    try { linesRaw = await cfbdFetch("/lines?year=2026", key); calls++; } catch (e) { /* optional */ }
    try { statsRaw = await cfbdFetch("/stats/season?year=2026", key); calls++; } catch (e) { /* optional */ }
    try { mediaRaw = await cfbdFetch("/games/media?year=2026", key); calls++; } catch (e) { /* optional */ }
  }

  const newResults = { ...results }, newOverrides = { ...overrides };
  let updatedKick = 0, updatedRes = 0, updatedLines = 0, rankedCount = 0;
  const liveGames = [], liveTeams = {};
  const seedPairs = new Set(GAMES.map((g) => [normName(T(g.away).name), normName(T(g.home).name)].sort().join("|")));

  (games || []).forEach((cg) => {
    const home = cg.homeTeam ?? cg.home_team, away = cg.awayTeam ?? cg.away_team;
    if (!home || !away) return;
    const pairKey = [normName(away), normName(home)].sort().join("|");
    const g = APP_BY_PAIR[pairKey];
    const start = cg.startDate ?? cg.start_date, tbd = cg.startTimeTBD ?? cg.start_time_tbd;
    const et = (start && !tbd) ? new Date(start).toLocaleTimeString("en-US", { timeZone: "America/New_York", hour: "numeric", minute: "2-digit" }) : null;
    const hp = cg.homePoints ?? cg.home_points, ap = cg.awayPoints ?? cg.away_points;

    if (g) {
      // known (seeded) game — update kickoff + result
      if (et) { newOverrides[g.id] = { ...(newOverrides[g.id] || {}), et }; updatedKick++; }
      if (cg.completed && hp != null && ap != null) {
        const appHomeIsCfbHome = normName(T(g.home).name) === normName(home);
        const hs = appHomeIsCfbHome ? hp : ap, as = appHomeIsCfbHome ? ap : hp;
        newResults[g.id] = { winner: hs > as ? "home" : "away", as, hs }; updatedRes++;
      }
      return;
    }
    // national game not in the seed — register teams + add it (skip non-FBS-vs-nothing junk by requiring a date)
    if (!start || seedPairs.has(pairKey)) return;
    const regTeam = (name, conf) => {
      const id = "cfbd-" + normName(name); if (TEAMS[id]) return id;
      const existing = NAME_TO_ID[normName(name)]; if (existing) return existing;
      if (!liveTeams[id]) liveTeams[id] = { id, name, short: shortFromName(name), conf: conf || "FBS", colors: colorFromName(name) };
      return id;
    };
    const awayId = NAME_TO_ID[normName(away)] || regTeam(away, cg.awayConference ?? cg.away_conference);
    const homeId = NAME_TO_ID[normName(home)] || regTeam(home, cg.homeConference ?? cg.home_conference);
    const date = start.slice(0, 10);
    const lg = { id: "cfbd-" + (cg.id || pairKey), wk: weekForDate(date), date, away: awayId, home: homeId,
      neutral: !!(cg.neutralSite ?? cg.neutral_site), venue: (cg.venue || null), tv: (cg.tv || null), et: et || "TBD",
      status: "verified", src: "CollegeFootballData (live sync)", live: true };
    liveGames.push(lg);
    if (cg.completed && hp != null && ap != null) {
      newResults[lg.id] = { winner: hp > ap ? "home" : "away", as: ap, hs: hp }; updatedRes++;
    }
  });

  // Rankings & lines only refreshed on a full sync; otherwise keep what we had.
  let ranks = (prevLive && prevLive.ranks) || {}, pollName = (prevLive && prevLive.pollName) || null, week = (prevLive && prevLive.week) || null;
  let lines = (prevLive && prevLive.lines) || {};
  let rankHistory = (prevLive && prevLive.rankHistory) || {};
  if (full) {
    if (rankingsRaw && rankingsRaw.length) {
      ranks = {}; const latest = rankingsRaw[rankingsRaw.length - 1]; week = latest.week;
      const polls = latest.polls || [];
      const ap = polls.find((p) => /ap/i.test(p.poll)) || polls.find((p) => /playoff|cfp/i.test(p.poll)) || polls[0];
      if (ap) { pollName = ap.poll; (ap.ranks || []).forEach((r) => { const id = NAME_TO_ID[normName(r.school)]; if (id) { ranks[id] = r.rank; rankedCount++; } }); }
      // Per-week movement across the whole season (for rank-trend charts).
      rankHistory = {};
      rankingsRaw.forEach((wk) => {
        const wp = (wk.polls || []).find((p) => /ap/i.test(p.poll)) || (wk.polls || []).find((p) => /playoff|cfp/i.test(p.poll)) || (wk.polls || [])[0];
        if (!wp) return;
        (wp.ranks || []).forEach((r) => { const id = NAME_TO_ID[normName(r.school)] || ("cfbd-" + normName(r.school)); (rankHistory[id] = rankHistory[id] || []).push({ week: wk.week, rank: r.rank }); });
      });
    }
    if (linesRaw && linesRaw.length) {
      lines = {};
      const liveByPair = {}; liveGames.forEach((lg) => { liveByPair[[normName(T(lg.away).name), normName(T(lg.home).name)].sort().join("|")] = lg; });
      linesRaw.forEach((cl) => {
        const home = cl.homeTeam ?? cl.home_team, away = cl.awayTeam ?? cl.away_team;
        const pk = [normName(away), normName(home)].sort().join("|");
        const g = APP_BY_PAIR[pk] || liveByPair[pk]; if (!g) return;
        const ls = (cl.lines || [])[0]; if (!ls) return;
        const spread = ls.spread ?? ls.formattedSpread;
        if (spread != null && spread !== "") { lines[g.id] = spread; updatedLines++; }
      });
    }
  }

  let stats = (prevLive && prevLive.stats) || {};
  if (full && statsRaw && statsRaw.length) {
    const acc = {};
    statsRaw.forEach((row) => {
      const nm = row.team || row.school; if (!nm) return;
      const id = NAME_TO_ID[normName(nm)] || ("cfbd-" + normName(nm));
      acc[id] = acc[id] || {};
      const sn = (row.statName || row.stat || "").toLowerCase();
      if (sn.includes("rushingattempts")) acc[id].rush = +row.statValue || 0;
      if (sn.includes("passattempts")) acc[id].pass = +row.statValue || 0;
    });
    stats = {};
    Object.keys(acc).forEach((id) => { const a = acc[id]; if (a.rush != null && a.pass != null && (a.rush + a.pass) > 0) stats[id] = { rushRate: a.rush / (a.rush + a.pass) }; });
  }

  let media = (prevLive && prevLive.media) || {};
  if (full && mediaRaw && mediaRaw.length) {
    media = {};
    mediaRaw.forEach((m) => {
      const home = m.homeTeam ?? m.home_team, away = m.awayTeam ?? m.away_team;
      if (!home || !away) return;
      const pk = [normName(away), normName(home)].sort().join("|");
      const g = APP_BY_PAIR[pk]; if (!g) return;
      const outlet = m.outlet || m.name; const type = String(m.mediaType || m.media_type || "").toLowerCase();
      if (!outlet) return;
      const cur = media[g.id] || { tv: null, others: [] };
      if ((type === "tv" || type === "") && !cur.tv) cur.tv = outlet;
      else if (!cur.others.includes(outlet) && outlet !== cur.tv) cur.others.push(outlet);
      media[g.id] = cur;
    });
  }

  const live = { ranks, lines, stats, rankHistory, media, pollName, week, games: liveGames, teams: liveTeams, lastSync: new Date().toISOString() };
  return { results: newResults, overrides: newOverrides, live, calls, summary: { updatedKick, updatedRes, updatedLines, rankedCount, national: liveGames.length, games: (games || []).length, full: !!full } };
}

function lineLabel(g) {
  const s = LIVE.lines[g.id]; if (s == null) return null;
  if (typeof s === "string") return s;
  if (s === 0) return "Pick'em";
  const fav = s < 0 ? T(g.home).short : T(g.away).short;
  return `${fav} -${Math.abs(s)}`;
}

/* ---- Venue geo + weather (Open-Meteo — free, no API key) ---- */
const HOME_GEO = {
  "michigan-state": [42.728, -84.485], "notre-dame": [41.698, -86.234], "west-virginia": [39.649, -79.955],
  "georgia-tech": [33.772, -84.393], "lsu": [30.412, -91.184], "boise-state": [43.602, -116.196],
  "navy": [38.984, -76.489], "north-dakota-state": [46.895, -96.815], "james-madison": [38.434, -78.874],
  "western-michigan": [42.283, -85.611], "jacksonville-state": [33.823, -85.766],
};
const NEUTRAL_GEO = [
  ["Aviva", [53.335, -6.228]], ["Lambeau", [44.501, -88.062]], ["Gillette", [42.091, -71.264]],
  ["MetLife", [40.813, -74.074]], ["Bank of America", [35.226, -80.853]],
];
const INDOOR = new Set(["north-dakota-state"]); // Fargodome (dome) — weather doesn't apply
function geoFor(g) {
  if (g.neutral && g.venue) { const m = NEUTRAL_GEO.find(([n]) => g.venue.includes(n)); if (m) return m[1]; }
  return HOME_GEO[g.home] || null;
}

/* ---- Team identity: official colors + logo URLs from CFBD /teams (V3 Pass 2) ---- */
function cleanHex(hex) {
  if (!hex || typeof hex !== "string") return null;
  let h = hex.trim(); if (!h.startsWith("#")) h = "#" + h;
  if (!/^#[0-9a-fA-F]{6}$/.test(h)) return null;
  return h.toLowerCase();
}
async function fetchTeams(key) {
  const raw = await cfbdFetch("/teams/fbs?year=2026", key);
  const map = {};
  (raw || []).forEach((t) => {
    const school = t.school || t.team; if (!school) return;
    const id = NAME_TO_ID[normName(school)] || ("cfbd-" + normName(school));
    const c1 = cleanHex(t.color), c2 = cleanHex(t.alternateColor || t.alternate_color);
    let colors = c1 && c2 ? [c1, c2] : c1 ? [c1, c1] : null;
    if (colors && /^#0{6}$/.test(colors[0])) colors = c2 ? [c2, colors[0]] : null; // avoid invisible black on dark UI
    const logos = Array.isArray(t.logos) ? t.logos.filter(Boolean) : [];
    map[id] = { colors, logos, abbr: t.abbreviation || null, mascot: t.mascot || null };
  });
  return map;
}

/* ---- Team intelligence: SP+, FPI, PPA, advanced stats (V3 Pass 5) ---- */
const INTEL = {};
function applyIntel(map) { Object.keys(INTEL).forEach((k) => delete INTEL[k]); Object.assign(INTEL, map || {}); }
function inum(v) { return (v == null || v === "" || isNaN(+v)) ? null : +v; }
async function fetchIntel(key) {
  let calls = 0;
  const tmp = {};
  const mid = (nm) => NAME_TO_ID[normName(nm)] || ("cfbd-" + normName(nm));
  const put = (nm) => { const id = mid(nm); tmp[id] = tmp[id] || {}; return tmp[id]; };
  try { const sp = await cfbdFetch("/ratings/sp?year=2026", key); calls++; (sp || []).forEach((r) => { if (!r.team) return; const o = put(r.team); o.spRating = inum(r.rating); o.spRank = inum(r.ranking); o.spOff = inum(r.offense && r.offense.rating); o.spDef = inum(r.defense && r.defense.rating); }); } catch (e) { /* optional */ }
  try { const fpi = await cfbdFetch("/ratings/fpi?year=2026", key); calls++; (fpi || []).forEach((r) => { if (!r.team) return; const o = put(r.team); o.fpi = inum(r.fpi); o.fpiRank = inum(r.ranking != null ? r.ranking : (r.resumeRanks && r.resumeRanks.fpi)); }); } catch (e) { /* optional */ }
  try { const ppa = await cfbdFetch("/ppa/teams?year=2026", key); calls++; (ppa || []).forEach((r) => { if (!r.team) return; const o = put(r.team); o.ppaOff = inum(r.offense && r.offense.overall); o.ppaDef = inum(r.defense && r.defense.overall); o.ppaPass = inum(r.offense && r.offense.passing); o.ppaRush = inum(r.offense && r.offense.rushing); }); } catch (e) { /* optional */ }
  try { const adv = await cfbdFetch("/stats/season/advanced?year=2026", key); calls++; (adv || []).forEach((r) => { if (!r.team) return; const o = put(r.team); o.offSR = inum(r.offense && r.offense.successRate); o.offExpl = inum(r.offense && r.offense.explosiveness); o.defSR = inum(r.defense && r.defense.successRate); o.havoc = inum(r.defense && r.defense.havoc && r.defense.havoc.total); }); } catch (e) { /* optional */ }
  return { map: tmp, calls };
}
function spProjection(g) {
  const A = INTEL[g.away], H = INTEL[g.home];
  if (!A || !H || A.spRating == null || H.spRating == null) return null;
  const hfa = g.neutral ? 0 : 2.5;
  const margin = (H.spRating - A.spRating) + hfa;
  const fav = margin >= 0 ? g.home : g.away;
  return { fav, by: Math.abs(margin) };
}

/* ---- Players, leaders & Heisman watch (V3 Pass 6) ---- */
const PLAYERS = { passing: [], rushing: [], receiving: [], heisman: [] };
function applyPlayers(p) { PLAYERS.passing = p.passing || []; PLAYERS.rushing = p.rushing || []; PLAYERS.receiving = p.receiving || []; PLAYERS.heisman = p.heisman || []; }
async function fetchPlayers(key) {
  let calls = 0; const out = { passing: {}, rushing: {}, receiving: {} };
  const grab = async (cat) => {
    try {
      const rows = await cfbdFetch(`/stats/player/season?year=2026&category=${cat}`, key); calls++;
      (rows || []).forEach((r) => {
        if (!r.player) return;
        const pid = (r.playerId || r.player) + "|" + (r.team || "");
        const o = out[cat][pid] = out[cat][pid] || { player: r.player, team: r.team, teamId: NAME_TO_ID[normName(r.team)] || ("cfbd-" + normName(r.team)) };
        const st = String(r.statType || r.stat_type || "").toUpperCase();
        if (st) o[st] = inum(r.stat);
      });
    } catch (e) { /* optional */ }
  };
  await grab("passing"); await grab("rushing"); await grab("receiving");
  const A = (o) => Object.values(o);
  const passing = A(out.passing), rushing = A(out.rushing), receiving = A(out.receiving);
  const teamMult = (tid) => { const x = INTEL[tid]; return x && x.spRating != null ? 1 + Math.max(0, x.spRating) / 40 : 1; };
  const cand = {};
  const add = (p, score, line, pos) => { const k = p.player + "|" + p.team; const s = score * teamMult(p.teamId); const cur = cand[k]; if (!cur || s > cur.score) cand[k] = { player: p.player, team: p.team, teamId: p.teamId, score: s, line, pos }; };
  passing.forEach((p) => add(p, (p.YDS || 0) * 0.02 + (p.TD || 0) * 4 - (p.INT || 0) * 3, `${p.YDS || 0} pass yds · ${p.TD || 0} TD · ${p.INT || 0} INT`, "QB"));
  rushing.forEach((p) => add(p, (p.YDS || 0) * 0.045 + (p.TD || 0) * 6, `${p.YDS || 0} rush yds · ${p.TD || 0} TD`, "RB"));
  receiving.forEach((p) => add(p, (p.YDS || 0) * 0.035 + (p.TD || 0) * 6, `${p.YDS || 0} rec yds · ${p.TD || 0} TD`, "WR"));
  const heisman = Object.values(cand).sort((a, b) => b.score - a.score).slice(0, 15);
  return { map: { passing, rushing, receiving, heisman }, calls };
}

async function fetchWeather(prevWeather) {
  const today = new Date(), horizon = new Date(); horizon.setDate(today.getDate() + 16);
  const near = GAMES.filter((g) => { const d = new Date(g.date + "T12:00:00"); return d >= today && d <= horizon && !g.neutral ? !INDOOR.has(g.home) : (d >= today && d <= horizon); });
  const out = { ...(prevWeather || {}) };
  for (const g of near) {
    if (out[g.id]) continue; // already have a forecast for this game — don't spend another call
    const geo = geoFor(g); if (!geo) continue;
    const url = `${weatherBase()}?latitude=${geo[0]}&longitude=${geo[1]}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,snowfall_sum&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto&start_date=${g.date}&end_date=${g.date}`;
    try {
      const r = await fetch(url); if (!r.ok) continue;
      const d = await r.json(); const dl = d.daily; if (!dl) continue;
      out[g.id] = { tMax: dl.temperature_2m_max?.[0], tMin: dl.temperature_2m_min?.[0], precip: dl.precipitation_probability_max?.[0], wind: dl.wind_speed_10m_max?.[0], snow: dl.snowfall_sum?.[0] };
    } catch (e) { /* best effort */ }
  }
  return out;
}
function weatherLabel(g) {
  const w = LIVE.weather && LIVE.weather[g.id]; if (!w) return null;
  const bits = [];
  if (w.tMax != null) bits.push(`${Math.round(w.tMax)}°/${Math.round(w.tMin)}°F`);
  if (w.precip != null) bits.push(`${w.precip}% precip`);
  if (w.wind != null) bits.push(`${Math.round(w.wind)} mph wind`);
  if (w.snow > 0) bits.push(`❄ ${w.snow}cm snow`);
  return bits.join(" · ");
}

/* ---- Live scoreboard (CFBD /scoreboard) + flip-alert logic ---- */
async function fetchScores(key) {
  const data = await cfbdFetch("/scoreboard", key);
  const out = {};
  (data || []).forEach((sg) => {
    const homeObj = sg.homeTeam || {}, awayObj = sg.awayTeam || {};
    const home = homeObj.name ?? sg.home_team ?? (typeof sg.homeTeam === "string" ? sg.homeTeam : null);
    const away = awayObj.name ?? sg.away_team ?? (typeof sg.awayTeam === "string" ? sg.awayTeam : null);
    if (!home || !away) return;
    const g = APP_BY_PAIR[[normName(away), normName(home)].sort().join("|")];
    if (!g) return;
    out[g.id] = {
      status: sg.status, period: sg.period, clock: sg.clock,
      hp: homeObj.points ?? sg.home_points, ap: awayObj.points ?? sg.away_points,
      appHomeIsCfbHome: normName(T(g.home).name) === normName(home),
    };
  });
  return out;
}
function liveScore(g) {
  const s = LIVE.scores && LIVE.scores[g.id]; if (!s || s.hp == null) return null;
  const hs = s.appHomeIsCfbHome ? s.hp : s.ap, as = s.appHomeIsCfbHome ? s.ap : s.hp;
  return { hs, as, status: s.status, period: s.period, clock: s.clock };
}
/* Transparent live win-probability ESTIMATE from score margin + time left (not the official model). */
function liveWinProb(g) {
  const ls = liveScore(g); if (!ls || ls.hs == null) return null;
  if (/final|completed/i.test(String(ls.status || ""))) { const homeWon = ls.hs > ls.as; return { home: homeWon ? 1 : 0, fav: homeWon ? g.home : g.away, p: 1, final: true }; }
  const period = ls.period || 1;
  const clk = String(ls.clock || "15:00").match(/(\d+):(\d+)/);
  const secLeftQtr = clk ? (+clk[1] * 60 + +clk[2]) : 900;
  const totalLeft = Math.max(0, (4 - period) * 900 + secLeftQtr);
  const frac = 1 - totalLeft / 3600; // 0 start → 1 end
  const margin = ls.hs - ls.as; // home perspective
  const k = 0.16 + frac * 0.55; // late margins matter much more
  const home = 1 / (1 + Math.exp(-k * margin));
  const fav = home >= 0.5 ? g.home : g.away;
  return { home, fav, p: Math.max(home, 1 - home), final: false };
}
function whereToWatch(g) {
  const m = LIVE.media && LIVE.media[g.id]; if (!m) return null;
  return m.tv || (m.others && m.others[0]) || null;
}
function flipAlerts(priorities) {
  const alerts = [];
  allCombinedGames().forEach((g) => {
    const s = LIVE.scores && LIVE.scores[g.id]; if (!s) return;
    const inProgress = /progress|in_progress|1st|2nd|3rd|4th|ot|halftime/i.test(String(s.status || "")) || (s.period && s.period >= 1 && !/final|completed/i.test(String(s.status || "")));
    if (!inProgress) return;
    const ls = liveScore(g); if (!ls || ls.hs == null) return;
    const margin = Math.abs(ls.hs - ls.as);
    const late = (s.period || 0) >= 4;
    const ot = /ot|overtime/i.test(String(s.status || "")) || (s.period || 0) >= 5;
    const mine = [g.away, g.home].some((id) => TEAMS[id] && TEAMS[id].tier);
    const ranked = [g.away, g.home].some((id) => RANK[id]);
    let why = null;
    if (ot) why = "Overtime";
    else if (late && margin <= 8) why = `One score, ${s.clock || "late"} 4th`;
    else if (late && margin <= 3) why = "Nail-biter, final minutes";
    if (why && (mine || ranked || margin <= 8)) {
      alerts.push({ g, why, margin, priority: (mine ? 0 : 1) + (ranked ? 0 : 1) });
    }
  });
  return alerts.sort((a, b) => a.priority - b.priority || a.margin - b.margin);
}

/* ---- Synthesized game-day audio (WebAudio — no files, copyright-safe) ---- */
let _AC = null;
function audioCtx() { if (_AC) return _AC; try { _AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { _AC = null; } return _AC; }
function playHorn() {
  const ac = audioCtx(); if (!ac) return; if (ac.state === "suspended") ac.resume();
  const now = ac.currentTime;
  const blast = (t, dur) => {
    const g = ac.createGain(); g.connect(ac.destination);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.22, t + 0.03); g.gain.setValueAtTime(0.22, t + dur - 0.06); g.gain.linearRampToValueAtTime(0, t + dur);
    const lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 1500; lp.connect(g);
    [110, 138.6, 220].forEach((f) => { const o = ac.createOscillator(); o.type = "sawtooth"; o.frequency.value = f; o.connect(lp); o.start(t); o.stop(t + dur); });
  };
  blast(now, 0.45); blast(now + 0.6, 0.85);
}
function playRoar() {
  const ac = audioCtx(); if (!ac) return; if (ac.state === "suspended") ac.resume();
  const now = ac.currentTime, dur = 1.6;
  const buf = ac.createBuffer(1, Math.floor(ac.sampleRate * dur), ac.sampleRate);
  const d = buf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource(); src.buffer = buf;
  const bp = ac.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 650; bp.Q.value = 0.6;
  const g = ac.createGain(); g.gain.setValueAtTime(0, now); g.gain.linearRampToValueAtTime(0.16, now + 0.5); g.gain.linearRampToValueAtTime(0, now + dur);
  src.connect(bp); bp.connect(g); g.connect(ac.destination); src.start(now); src.stop(now + dur);
}

/* ---- "What do I watch RIGHT NOW?" engine ---- */
function watchNow(priorities) {
  const all = allCombinedGames();
  const withLive = all.map((g) => ({ g, ls: liveScore(g) })).filter((x) => x.ls);
  const inProg = withLive.filter((x) => !/final|completed/i.test(String(x.ls.status || "")));
  const rankLive = ({ g, ls }) => {
    const p = Math.min(...[g.away, g.home].map((id) => { const i = priorities.indexOf(id); return i < 0 ? 40 : i; }));
    let s = 100 - p * 5;
    const margin = Math.abs((ls.hs || 0) - (ls.as || 0));
    if ((ls.period || 0) >= 4 && margin <= 8) s += 30;
    if ((ls.period || 0) >= 4 && margin <= 3) s += 12;
    if (/ot|overtime/i.test(String(ls.status || ""))) s += 45;
    if ([g.away, g.home].some((id) => RANK[id])) s += 8;
    const wp = liveWinProb(g); if (wp && !wp.final) s += (1 - Math.abs(wp.home - 0.5) * 2) * 18; // toss-ups rise
    s += computeJakeRating(g, priorities).score;
    return s;
  };
  if (inProg.length) {
    const sorted = inProg.sort((a, b) => rankLive(b) - rankLive(a));
    const best = sorted[0];
    const margin = Math.abs((best.ls.hs || 0) - (best.ls.as || 0));
    const mine = [best.g.away, best.g.home].filter((id) => TEAMS[id] && TEAMS[id].tier).map((id) => T(id).short);
    let why = mine.length ? `${mine[0]} is playing` : "Best game on the board";
    if (/ot/i.test(String(best.ls.status || ""))) why += " — OVERTIME";
    else if ((best.ls.period || 0) >= 4 && margin <= 8) why += ` — one score, ${best.ls.clock || "late"} 4th`;
    return { game: best.g, ls: best.ls, live: true, why, second: sorted[1] && sorted[1].g, third: sorted[2] && sorted[2].g };
  }
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = all.filter((g) => g.date >= today).sort((a, b) => a.date.localeCompare(b.date) || computeJakeRating(b, priorities).score - computeJakeRating(a, priorities).score);
  const g = upcoming.find((x) => [x.away, x.home].some((id) => TEAMS[id] && TEAMS[id].tier)) || upcoming[0];
  return g ? { game: g, live: false, why: "Nothing live right now — next up on your slate." } : null;
}

/* ============================================================================
   THE BOOTH — game-day cockpit
   ========================================================================== */
function BoothView({ priorities, doRefreshScores, scoresAt, syncing, ...rest }) {
  const [booth, setBooth] = useStore("cfb:booth", { main: null, second: null, third: null });
  const [sound, setSound] = useStore("cfb:sound", { on: false });
  const [exp, setExp] = useState(null);
  const prevAlerts = useRef(new Set());

  const now = watchNow(priorities);
  const alerts = flipAlerts(priorities);
  const anyLive = allCombinedGames().some((g) => { const ls = liveScore(g); return ls && !/final|completed/i.test(String(ls.status || "")); });

  // Fire the horn when a NEW flip alert appears (if sound on).
  useEffect(() => {
    const ids = new Set(alerts.map((a) => a.g.id));
    let fresh = false; ids.forEach((id) => { if (!prevAlerts.current.has(id)) fresh = true; });
    if (fresh && sound.on && prevAlerts.current.size >= 0 && alerts.length) { try { playHorn(); } catch (e) {} }
    prevAlerts.current = ids;
  }, [alerts.map((a) => a.g.id).join(","), sound.on]);

  // Quota-smart auto-refresh: only while The Booth is open AND games are live.
  useEffect(() => {
    if (!anyLive) return;
    const key = (rest.apiKey) || (typeof window !== "undefined" && window.CFBD_KEY) || "";
    if (!key) return;
    const iv = setInterval(() => { doRefreshScores && doRefreshScores(); }, 110 * 1000);
    return () => clearInterval(iv);
  }, [anyLive, doRefreshScores]);

  // Today's slate grouped into watch windows.
  const todayStr = new Date().toISOString().slice(0, 10);
  const nextDate = (() => { const f = allCombinedGames().filter((g) => g.date >= todayStr).map((g) => g.date).sort(); return f[0] || todayStr; })();
  const dayGames = allCombinedGames().filter((g) => g.date === nextDate);
  const windows = {};
  dayGames.forEach((g) => { const w = windowFor(g); (windows[w] = windows[w] || []).push(g); });
  const WINDOW_ORDER = ["Morning", "Noon", "Early Afternoon", "3:30 Window", "Early Evening", "Primetime", "Late Night", "After Midnight", "Time TBD", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const winKeys = Object.keys(windows).sort((a, b) => (WINDOW_ORDER.indexOf(a) + 99) % 200 - (WINDOW_ORDER.indexOf(b) + 99) % 200);

  const setSlot = (slot, gid) => setBooth({ ...booth, [slot]: booth[slot] === gid ? null : gid });
  const slotOf = (gid) => booth.main === gid ? "MAIN" : booth.second === gid ? "2ND" : booth.third === gid ? "3RD" : null;

  const HeroCard = ({ label, g, ls, why, color }) => {
    if (!g) return null;
    const a = T(g.away), h = T(g.home);
    return (
      <div style={{ background: `linear-gradient(135deg, ${color}22, ${C.panel})`, border: `1px solid ${color}66`, borderRadius: 14, padding: 14, marginBottom: 10 }}>
        <div style={{ fontSize: 10, letterSpacing: "1.5px", color, fontWeight: 800, marginBottom: 8 }}>{label}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Logo id={g.away} size={34} /><span style={{ fontFamily: "var(--gc-mono)", fontSize: 20, fontWeight: 800, minWidth: 28, textAlign: "right" }}>{ls ? (ls.as ?? "–") : ""}</span>
          <span style={{ flex: 1, fontSize: 14, color: C.ink, fontWeight: 700 }}>{a.short} {g.neutral ? "vs" : "@"} {h.short}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
          <Logo id={g.home} size={34} /><span style={{ fontFamily: "var(--gc-mono)", fontSize: 20, fontWeight: 800, minWidth: 28, textAlign: "right" }}>{ls ? (ls.hs ?? "–") : ""}</span>
          <span style={{ flex: 1, fontSize: 12, color: C.dim }}>{ls ? (ls.status || "LIVE") + (ls.period ? ` · Q${ls.period} ${ls.clock || ""}` : "") : `${shortDate(g.date)} · ${(rest.overrides[g.id] || {}).et || g.et || "TBD"}`}</span>
          {whereToWatch(g) && <span style={{ fontSize: 11, color: C.amber, display: "flex", alignItems: "center", gap: 3 }}><Tv size={11} /> {whereToWatch(g)}</span>}
        </div>
        {(() => { const wp = liveWinProb(g); if (!wp || wp.final) return null; const hp = Math.round(wp.home * 100); return (
          <div style={{ marginTop: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: C.dim, marginBottom: 3 }}><span>{a.short} {100 - hp}%</span><span>win prob est · {h.short} {hp}%</span></div>
            <div style={{ height: 5, background: T(g.away).colors[0], borderRadius: 99, overflow: "hidden" }}><div style={{ width: hp + "%", height: "100%", background: T(g.home).colors[0], marginLeft: "auto" }} /></div>
          </div>
        ); })()}
        <div style={{ fontSize: 12, color: C.ink, marginTop: 8, background: C.panel2, borderRadius: 8, padding: 8 }}>{why}</div>
      </div>
    );
  };

  return (
    <div style={{ padding: "0 14px 90px" }}>
      {/* live ticker */}
      <div style={{ overflow: "hidden", whiteSpace: "nowrap", borderBottom: `1px solid ${C.line}`, margin: "0 -14px 12px", padding: "6px 0", background: C.panel }}>
        <div style={{ display: "inline-block", animation: "gc-ticker 32s linear infinite", fontFamily: "var(--gc-mono)", fontSize: 12 }}>
          {(() => {
            const items = allCombinedGames().filter((g) => liveScore(g) || g.date === nextDate).slice(0, 30);
            if (!items.length) return <span style={{ color: C.dim, paddingLeft: 14 }}>GRIDIRON COMMAND · THE BOOTH · game-day control room — scores populate live on game days ·&nbsp;&nbsp;&nbsp;</span>;
            return items.concat(items).map((g, i) => { const ls = liveScore(g); return <span key={i} style={{ color: ls ? C.green : C.dim, paddingLeft: 20 }}>{T(g.away).short} {ls ? ls.as : ""}{ls ? "–" + ls.hs : ""} {T(g.home).short}{ls && ls.period ? ` Q${ls.period}` : ""}</span>; });
          })()}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ fontFamily: "var(--gc-display)", fontSize: 22, fontWeight: 800, letterSpacing: "1px", color: C.ink }}>THE BOOTH</div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => { setSound({ on: !sound.on }); if (!sound.on) { try { playHorn(); } catch (e) {} } }} style={{ ...pillBtn, color: sound.on ? C.amber : C.dim, borderColor: sound.on ? C.amber : C.line }}>{sound.on ? "🔊 Sound on" : "🔇 Sound off"}</button>
          <button onClick={doRefreshScores} disabled={syncing} style={{ ...pillBtn, background: syncing ? C.panel2 : C.amber, color: syncing ? C.dim : C.bg, borderColor: C.amber }}>{syncing ? "…" : "Refresh"}</button>
        </div>
      </div>
      <div style={{ fontSize: 10, color: C.dim, marginBottom: 12 }}>
        {anyLive ? <span style={{ color: C.green }}>● LIVE · auto-refreshing every ~2 min while games are on</span> : (scoresAt ? `Scores ${timeAgo(scoresAt)} — no games in progress` : "No games live. On game days, tap Refresh; flip alerts + horn fire automatically.")}
      </div>

      {now && <HeroCard label="ON YOUR MAIN SCREEN RIGHT NOW" g={now.game} ls={now.ls} why={now.why} color={C.amber} />}
      {now && now.second && <HeroCard label="SECOND SCREEN" g={now.second} ls={liveScore(now.second)} why="Next-best live game." color={C.green} />}

      {alerts.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, letterSpacing: "1px", color: C.red, marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}><AlertTriangle size={12} /> FLIP ALERTS</div>
          <div style={{ display: "grid", gap: 8 }}>
            {alerts.map(({ g, why }) => { const ls = liveScore(g); return (
              <div key={g.id} style={{ background: C.red + "12", border: `1px solid ${C.red}44`, borderRadius: 10, padding: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div><div style={{ fontSize: 13, color: C.ink, fontWeight: 700 }}>{T(g.away).short} {ls.as}–{ls.hs} {T(g.home).short}</div><div style={{ fontSize: 11, color: C.red }}>{why} — flip here.</div></div>
              </div>
            ); })}
          </div>
        </div>
      )}

      {/* screen assignments */}
      {(booth.main || booth.second || booth.third) && (
        <div style={{ marginBottom: 14, background: C.panel, border: `1px solid ${C.line}`, borderRadius: 12, padding: 12 }}>
          <div style={{ fontSize: 11, letterSpacing: "1px", color: C.amber, marginBottom: 8 }}>YOUR SCREENS TODAY</div>
          {["main", "second", "third"].map((slot) => booth[slot] ? (() => { const g = allCombinedGames().find((x) => x.id === booth[slot]); if (!g) return null; const ls = liveScore(g); return (
            <div key={slot} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", fontSize: 13 }}>
              <span style={{ fontSize: 10, color: C.amber, fontWeight: 800, minWidth: 34 }}>{slot === "main" ? "MAIN" : slot === "second" ? "2ND" : "3RD"}</span>
              <Logo id={g.away} size={20} /><span style={{ color: C.dim }}>{T(g.away).short}</span><span style={{ color: C.dim }}>{g.neutral ? "vs" : "@"}</span><Logo id={g.home} size={20} /><span style={{ color: C.ink }}>{T(g.home).short}</span>
              {ls && <span style={{ marginLeft: "auto", fontFamily: "var(--gc-mono)", color: C.green, fontSize: 12 }}>{ls.as}–{ls.hs}</span>}
            </div>
          ); })() : null)}
        </div>
      )}

      {/* windows */}
      <div style={{ fontSize: 11, letterSpacing: "1px", color: C.amber, marginBottom: 8 }}>{nextDate === todayStr ? "TODAY" : shortDate(nextDate).toUpperCase()} · BY WINDOW — tap a game to assign a screen</div>
      {winKeys.length === 0 && <Empty>No games on this date.</Empty>}
      {winKeys.map((w) => {
        const list = windows[w].sort((a, b) => computeJakeRating(b, priorities).score - computeJakeRating(a, priorities).score);
        return (
          <div key={w} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: C.dim, fontWeight: 700, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>{w}</div>
            <div style={{ display: "grid", gap: 6 }}>
              {list.slice(0, 6).map((g) => { const s = slotOf(g.id); const ls = liveScore(g); return (
                <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 8, background: C.panel, border: `1px solid ${s ? C.amber + "66" : C.line}`, borderRadius: 9, padding: "7px 9px" }}>
                  <TierBadge tier={(rest.overrides[g.id] || {}).forced ? "S" : tierFor(g, computeJakeRating(g, priorities).score)} />
                  <Logo id={g.away} size={20} /><span style={{ fontSize: 12, color: C.dim }}>{T(g.away).short}</span>
                  <span style={{ fontSize: 11, color: C.dim }}>{g.neutral ? "vs" : "@"}</span>
                  <Logo id={g.home} size={20} /><span style={{ fontSize: 12, color: C.ink, flex: 1 }}>{T(g.home).short}</span>
                  {ls && <span style={{ fontFamily: "var(--gc-mono)", fontSize: 12, color: C.green }}>{ls.as}–{ls.hs}</span>}
                  <div style={{ display: "flex", gap: 3 }}>
                    {[["main", "M"], ["second", "2"], ["third", "3"]].map(([slot, lbl]) => (
                      <button key={slot} title={`Set as ${slot === "main" ? "main" : slot === "second" ? "second" : "third"} screen`} onClick={() => setSlot(slot, g.id)} style={{ width: 22, height: 22, borderRadius: 5, fontSize: 10, fontWeight: 800, cursor: "pointer", background: booth[slot] === g.id ? C.amber : C.panel2, color: booth[slot] === g.id ? C.bg : C.dim, border: `1px solid ${booth[slot] === g.id ? C.amber : C.line}` }}>{lbl}</button>
                    ))}
                  </div>
                </div>
              ); })}
            </div>
          </div>
        );
      })}
    </div>
  );
}


/* ============================================================================
   APP SHELL
   ========================================================================== */
const DEFAULT_PRI = ["michigan-state", "notre-dame", "west-virginia", "georgia-tech", "lsu", "boise-state", "navy", "north-dakota-state", "james-madison", "western-michigan", "jacksonville-state"];
const LAST_UPDATE = "Jul 12, 2026";
const SEASON_START = "2026-08-23"; // polls/lines don't exist before this — skip those calls to save quota
function monthKey() { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0"); }
function seasonStarted() { return new Date().toISOString().slice(0, 10) >= SEASON_START; }

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { err: null }; }
  static getDerivedStateFromError(err) { return { err }; }
  componentDidUpdate(prev) { if (prev.view !== this.props.view && this.state.err) this.setState({ err: null }); }
  render() {
    if (this.state.err) {
      return (
        <div style={{ padding: 24, textAlign: "center" }}>
          <div style={{ fontSize: 34, marginBottom: 6 }}>🛠️</div>
          <div style={{ fontFamily: "var(--gc-display)", fontSize: 18, fontWeight: 800, color: C.ink, marginBottom: 6 }}>This screen hit a snag</div>
          <div style={{ fontSize: 12.5, color: C.dim, lineHeight: 1.6, maxWidth: 340, margin: "0 auto 14px" }}>Your data is safe — the rest of the app is fine. Head back home, or reload if it sticks.</div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            <button onClick={() => { this.setState({ err: null }); this.props.onHome && this.props.onHome(); }} style={{ ...pillBtn, background: C.amber, color: C.bg, borderColor: C.amber }}>Back to Home</button>
            <button onClick={() => { try { location.reload(); } catch (e) { /* noop */ } }} style={{ ...pillBtn, color: C.ink, borderColor: C.line }}>Reload</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [view, setView] = useState("home");
  const [booting, setBooting] = useState(true);
  const [palette, setPalette] = useState(false);
  const [watched, setWatched] = useStore("cfb:watched", {});
  const [overrides, setOverrides] = useStore("cfb:overrides", {});
  const [results, setResults] = useStore("cfb:results", {});
  const [priorities, setPriorities] = useStore("cfb:priorities", DEFAULT_PRI);
  const [live, setLive] = useStore("cfb:live", { ranks: {}, lines: {}, pollName: null, week: null, lastSync: null });
  const [apiKey, setApiKey] = useStore("cfb:apikey", (typeof window !== "undefined" && window.CFBD_KEY) || "");
  const [proxyBase, setProxyBase] = useStore("cfb:proxybase", "");
  const [theme, setTheme] = useStore("cfb:theme", "command");
  const [autoSync, setAutoSync] = useStore("cfb:autosync", true);
  const [installEvt, setInstallEvt] = useState(null);
  const [installed, setInstalled] = useState(false);
  const [identity, setIdentity] = useState({ at: null, count: 0 });
  const [intel, setIntel] = useState({ at: null, count: 0 });
  const [players, setPlayers] = useState({ at: null, count: 0 });
  const [usage, setUsage] = useStore("cfb:usage", { month: monthKey(), calls: 0 });
  const [backup, setBackup] = useStore("cfb:backup", null);
  const [schema, setSchema] = useStore("cfb:schema", { v: 2 });
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState(null);
  const autoDone = useRef(false);
  const snapDone = useRef(false);

  // Bridge stored/synced live data into module scope for the pure engines (runs during render).
  useMemo(() => applyLive(live), [live]);
  useMemo(() => { PROXY_BASE = (proxyBase || "").trim(); }, [proxyBase]);
  useMemo(() => { applyTheme(theme); }, [theme]);

  // Load cached team identity (official colors + logos) from IndexedDB on boot.
  useEffect(() => {
    (async () => {
      try {
        const map = await idbGet("teams-identity");
        const at = await idbGet("teams-identity-at");
        if (map && typeof map === "object") { applyIdentity(map); setIdentity({ at: at || null, count: Object.keys(map).length }); }
        const logos = await idbGet("logo-cache");
        if (logos && typeof logos === "object") applyLogoData(logos);
        const it = await idbGet("team-intel");
        const itAt = await idbGet("team-intel-at");
        if (it && typeof it === "object") { applyIntel(it); setIntel({ at: itAt || null, count: Object.keys(it).length }); }
        const pl = await idbGet("players");
        const plAt = await idbGet("players-at");
        if (pl && typeof pl === "object") { applyPlayers(pl); setPlayers({ at: plAt || null, count: (pl.heisman || []).length }); }
      } catch (e) { /* IDB unavailable — fine, derived colors stay */ }
    })();
  }, []);

  // PWA install: capture the prompt so we can show a real "Install app" button.
  useEffect(() => {
    const bip = (e) => { e.preventDefault(); setInstallEvt(e); };
    const ai = () => { setInstalled(true); setInstallEvt(null); };
    try {
      if ((window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) || window.navigator.standalone) setInstalled(true);
    } catch (e) { /* ignore */ }
    window.addEventListener("beforeinstallprompt", bip);
    window.addEventListener("appinstalled", ai);
    return () => { window.removeEventListener("beforeinstallprompt", bip); window.removeEventListener("appinstalled", ai); };
  }, []);
  const doInstall = useCallback(async () => {
    if (!installEvt) return;
    try { installEvt.prompt(); await installEvt.userChoice; } catch (e) { /* ignore */ }
    setInstallEvt(null);
  }, [installEvt]);

  // Register the service worker when served over http(s) (PWA install + offline). No-op as a file.
  useEffect(() => {
    if (typeof navigator !== "undefined" && "serviceWorker" in navigator && typeof location !== "undefined" && /^https?:$/.test(location.protocol)) {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    }
  }, []);

  const addCalls = useCallback((n) => {
    if (!n) return; const mk = monthKey();
    setUsage(usage && usage.month === mk ? { month: mk, calls: (usage.calls || 0) + n } : { month: mk, calls: n });
  }, [usage, setUsage]);

  const onWatch = useCallback((id, w) => setWatched({ ...watched, [id]: w }), [watched, setWatched]);
  const onOverride = useCallback((id, o) => setOverrides({ ...overrides, [id]: o }), [overrides, setOverrides]);
  const onResult = useCallback((id, r) => { const n = { ...results }; if (r == null) delete n[id]; else n[id] = r; setResults(n); }, [results, setResults]);
  const resetAll = useCallback(() => { setWatched({}); setOverrides({}); setResults({}); setLive({ ranks: {}, lines: {}, weather: {}, scores: {}, pollName: null, week: null, lastSync: null, scoresAt: null }); setUsage({ month: monthKey(), calls: 0 }); setPriorities(DEFAULT_PRI); }, [setWatched, setOverrides, setResults, setLive, setUsage, setPriorities]);
  const onImport = useCallback((obj) => {
    if (!obj || typeof obj !== "object") return false;
    if (Array.isArray(obj.priorities)) setPriorities(obj.priorities);
    if (obj.watched) setWatched(obj.watched);
    if (obj.overrides) setOverrides(obj.overrides);
    if (obj.results) setResults(obj.results);
    if (obj.live) setLive(obj.live);
    return true;
  }, [setPriorities, setWatched, setOverrides, setResults, setLive]);

  const doLoadIdentity = useCallback(async (opts) => {
    const silent = opts && opts.silent;
    const key = apiKey || (typeof window !== "undefined" && window.CFBD_KEY) || "";
    if (!proxied() && !key) { if (!silent) setSyncMsg({ ok: false, text: "Add your key (or a proxy) to load team colors & logos." }); return; }
    try {
      const map = await fetchTeams(key); addCalls(1);
      const at = new Date().toISOString();
      applyIdentity(map); setIdentity({ at, count: Object.keys(map).length });
      try { await idbSet("teams-identity", map); await idbSet("teams-identity-at", at); } catch (e) { /* memory-only if IDB blocked */ }
      // Offline logo cache: prefetch your teams' logos as data URLs (needs proxy for clean cross-origin read).
      if (proxied()) {
        let got = 0;
        for (const id of priorities.slice(0, 14)) { if (await cacheLogo(id)) got++; }
        if (got) { try { await idbSet("logo-cache", { ...LOGO_DATA }); } catch (e) { /* ignore */ } setIdentity((s) => ({ ...s })); }
      }
      if (!silent) setSyncMsg({ ok: true, text: `Loaded official colors & logos for ${Object.keys(map).length} teams · used 1 call.` });
    } catch (e) {
      if (!silent) setSyncMsg({ ok: false, text: e.message || "Couldn't load team data." });
    }
  }, [apiKey, proxyBase, addCalls, priorities]);

  const doLoadIntel = useCallback(async (opts) => {
    const silent = opts && opts.silent;
    const key = apiKey || (typeof window !== "undefined" && window.CFBD_KEY) || "";
    if (!proxied() && !key) { if (!silent) setSyncMsg({ ok: false, text: "Add your key (or a proxy) to load advanced stats." }); return; }
    try {
      const { map, calls } = await fetchIntel(key); addCalls(calls);
      const at = new Date().toISOString();
      applyIntel(map); setIntel({ at, count: Object.keys(map).length });
      try { await idbSet("team-intel", map); await idbSet("team-intel-at", at); } catch (e) { /* memory-only */ }
      if (!silent) setSyncMsg({ ok: true, text: `Loaded advanced stats (SP+, FPI, PPA, efficiency) for ${Object.keys(map).length} teams · ${calls} calls.` });
    } catch (e) { if (!silent) setSyncMsg({ ok: false, text: e.message || "Couldn't load advanced stats." }); }
  }, [apiKey, proxyBase, addCalls]);

  const doLoadPlayers = useCallback(async (opts) => {
    const silent = opts && opts.silent;
    const key = apiKey || (typeof window !== "undefined" && window.CFBD_KEY) || "";
    if (!proxied() && !key) { if (!silent) setSyncMsg({ ok: false, text: "Add your key (or a proxy) to load player stats." }); return; }
    try {
      const { map, calls } = await fetchPlayers(key); addCalls(calls);
      const at = new Date().toISOString();
      applyPlayers(map); setPlayers({ at, count: (map.heisman || []).length });
      try { await idbSet("players", map); await idbSet("players-at", at); } catch (e) { /* memory-only */ }
      if (!silent) setSyncMsg({ ok: true, text: `Loaded player stats & Heisman Watch · ${calls} calls.` });
    } catch (e) { if (!silent) setSyncMsg({ ok: false, text: e.message || "Couldn't load player stats." }); }
  }, [apiKey, proxyBase, addCalls]);

  const doSync = useCallback(async (opts) => {
    const silent = opts && opts.silent;
    if (!proxied() && !apiKey) { if (!silent) setSyncMsg({ ok: false, text: "Add your free CollegeFootballData API key first (collegefootballdata.com/key)." }); return; }
    setSyncing(true); if (!silent) setSyncMsg(null);
    try {
      // Smart: only pull polls & lines once the season is underway (they're empty in the offseason).
      const full = seasonStarted();
      const r = await syncCFBD({ key: apiKey, results, overrides, full, prevLive: live });
      addCalls(r.calls);
      let weather = {};
      try { weather = await fetchWeather(live.weather); } catch (e) { /* best effort, keyless */ }
      setResults(r.results); setOverrides(r.overrides);
      setLive({ ...r.live, weather, scores: live.scores || {}, scoresAt: live.scoresAt || null });
      if (!identity.count) { try { await doLoadIdentity({ silent: true }); } catch (e) { /* best effort */ } }
      if (full && !intel.count) { try { await doLoadIntel({ silent: true }); } catch (e) { /* best effort */ } }
      if (full && !players.count) { try { await doLoadPlayers({ silent: true }); } catch (e) { /* best effort */ } }
      const s = r.summary;
      setSyncMsg({ ok: true, text: `${s.full ? "Full sync" : "Schedule sync"} · ${s.games} games · ${s.updatedKick} kickoffs · ${s.updatedRes} results${s.full ? ` · ${s.rankedCount} ranked · ${s.updatedLines} lines` : " · polls/lines start with the season"} · used ${r.calls} call${r.calls === 1 ? "" : "s"}.` });
    } catch (e) {
      const net = e instanceof TypeError || /Failed to fetch|NetworkError|load failed/i.test(e.message || "");
      setSyncMsg({ ok: false, text: net
        ? "Couldn't reach the data API from the browser. Two common causes: (1) you're opening the file by double-click and your browser blocks a local file from calling the internet — try Firefox or Safari; (2) check your key in Setup. Everything except live data works offline."
        : (e.message || "Sync failed.") });
    }
    setSyncing(false);
  }, [apiKey, proxyBase, results, overrides, live, addCalls, setResults, setOverrides, setLive]);

  const doRefreshScores = useCallback(async () => {
    const key = apiKey || (typeof window !== "undefined" && window.CFBD_KEY) || "";
    if (!proxied() && !key) { setSyncMsg({ ok: false, text: "Add a key to pull live scores." }); return; }
    // Cooldown: don't spend a call more than once per 60s.
    if (live.scoresAt && Date.now() - new Date(live.scoresAt).getTime() < 60 * 1000) {
      const secs = Math.ceil((60 * 1000 - (Date.now() - new Date(live.scoresAt).getTime())) / 1000);
      setSyncMsg({ ok: true, text: `Scores are fresh (updated ${Math.round((Date.now() - new Date(live.scoresAt).getTime()) / 1000)}s ago). Try again in ${secs}s to save calls.` });
      return;
    }
    setSyncing(true);
    try {
      const scores = await fetchScores(key); addCalls(1);
      setLive({ ...live, scores, scoresAt: new Date().toISOString() });
      setSyncMsg({ ok: true, text: `Scoreboard refreshed · ${Object.keys(scores).length} of your games live/recent · used 1 call.` });
    } catch (e) {
      const net = e instanceof TypeError || /Failed to fetch|NetworkError|load failed/i.test(e.message || "");
      setSyncMsg({ ok: false, text: net ? "Couldn't reach the scoreboard (browser blocked the call)." : (e.message || "Scores failed.") });
    }
    setSyncing(false);
  }, [apiKey, proxyBase, live, addCalls, setLive]);

  const shared = { watched, overrides, results, onWatch, onOverride, onResult };
  const phase = seasonStarted() ? "In season" : "Preseason";

  // Auto-sync at most once per 24h on open (schedules/polls change ~weekly, not hourly — this protects the quota).
  useEffect(() => {
    if (autoDone.current) return;
    if (!autoSync) return;
    const key = apiKey || (typeof window !== "undefined" && window.CFBD_KEY) || "";
    if (!key) return;
    if (typeof navigator !== "undefined" && navigator.onLine === false) return;
    autoDone.current = true;
    const stale = !live.lastSync || (Date.now() - new Date(live.lastSync).getTime() > 24 * 3600 * 1000);
    if (stale) { const t = setTimeout(() => doSync({ silent: true }), 600); return () => clearTimeout(t); }
  }, [apiKey, live.lastSync, doSync, autoSync]);

  // One-time safety snapshot: if you have data but no restore point yet, make one.
  useEffect(() => {
    if (snapDone.current) return;
    const hasData = Object.keys(watched || {}).length || Object.keys(results || {}).length;
    if (hasData && !backup) { snapDone.current = true; setBackup({ watched, overrides, results, priorities, live, at: new Date().toISOString() }); }
  }, [watched, results, overrides, priorities, live, backup, setBackup]);

  const makeRestorePoint = useCallback(() => { setBackup({ watched, overrides, results, priorities, live, at: new Date().toISOString() }); }, [watched, overrides, results, priorities, live, setBackup]);
  const restoreBackup = useCallback(() => { if (backup) return onImport(backup); return false; }, [backup, onImport]);

  const tabs = [
    ["home", "Home", Home], ["booth", "Booth", Tv], ["live", "Live", Radio], ["watch", "Watch", CalendarDays], ["guide", "Guide", ListChecks],
    ["national", "National", Star], ["weekday", "Weekday", Zap], ["teams", "Teams", Users],
    ["conf", "Conf", Trophy], ["warroom", "War Room", Swords], ["players", "Players", Award], ["rankings", "Ranks", TrendingUp], ["events", "Events", Sparkles],
    ["history", "Log", CheckCircle2], ["settings", "Setup", Settings],
  ];

  // Command palette: Cmd/Ctrl-K to open, Esc to close.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) { e.preventDefault(); setPalette((p) => !p); }
      else if (e.key === "Escape") setPalette(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.ink, fontFamily: "system-ui, -apple-system, sans-serif", maxWidth: 640, margin: "0 auto", position: "relative" }}>
      {booting && <Boot onDone={() => setBooting(false)} />}
      {palette && <CommandPalette tabs={tabs} onClose={() => setPalette(false)} onView={(v) => { setView(v); setPalette(false); }} actions={[
        { label: "Sync live data now", run: () => doSync() },
        { label: "Refresh live scores", run: () => doRefreshScores() },
        { label: "Enter The Booth (game-day mode)", run: () => setView("booth") },
        { label: "Create restore point", run: () => makeRestorePoint() },
      ]} />}
      <Header phase={phase} lastSync={live.lastSync} onPalette={() => setPalette(true)} />
      {syncMsg && !syncMsg.ok && view !== "settings" && (
        <div style={{ background: C.red + "18", borderBottom: `1px solid ${C.red}44`, padding: "10px 14px", display: "flex", alignItems: "flex-start", gap: 10 }}>
          <AlertTriangle size={15} color={C.red} style={{ flexShrink: 0, marginTop: 1 }} />
          <div style={{ flex: 1, fontSize: 12, color: C.ink, lineHeight: 1.5 }}>
            <b style={{ color: C.red }}>Live data didn't load.</b> {syncMsg.text} <span onClick={() => setView("settings")} style={{ color: C.amber, cursor: "pointer", textDecoration: "underline" }}>Open Setup</span>
          </div>
          <button onClick={() => setSyncMsg(null)} style={{ background: "none", border: "none", color: C.dim, cursor: "pointer", fontSize: 16, lineHeight: 1 }}>×</button>
        </div>
      )}
      <div key={view} style={{ animation: "gc-fade 0.28s ease" }}>
      <ErrorBoundary view={view} onHome={() => setView("home")}>
      {view === "home" && <HomeView priorities={priorities} onEnterBooth={() => setView("booth")} {...shared} />}
      {view === "booth" && <BoothView priorities={priorities} doRefreshScores={doRefreshScores} scoresAt={live.scoresAt} syncing={syncing} apiKey={apiKey} {...shared} />}
      {view === "live" && <LiveView priorities={priorities} doRefreshScores={doRefreshScores} scoresAt={live.scoresAt} syncing={syncing} {...shared} />}
      {view === "watch" && <WatchBoard priorities={priorities} {...shared} />}
      {view === "guide" && <GuideView priorities={priorities} {...shared} />}
      {view === "national" && <NationalView priorities={priorities} mode="national" {...shared} />}
      {view === "weekday" && <NationalView priorities={priorities} mode="weekday" {...shared} />}
      {view === "teams" && <TeamsView priorities={priorities} {...shared} />}
      {view === "conf" && <ConferencesView priorities={priorities} results={results} />}
      {view === "warroom" && <WarRoomView priorities={priorities} results={results} />}
      {view === "players" && <PlayersView onLoadPlayers={doLoadPlayers} playersMeta={players} />}
      {view === "rankings" && <RankingsView priorities={priorities} />}
      {view === "events" && <EventsView priorities={priorities} {...shared} />}
      {view === "history" && <HistoryView watched={watched} results={results} priorities={priorities} />}
      {view === "settings" && <SettingsView priorities={priorities} setPriorities={setPriorities} resetAll={resetAll} lastUpdate={LAST_UPDATE}
        watchedData={watched} overridesData={overrides} resultsData={results}
        apiKey={apiKey} setApiKey={setApiKey} proxyBase={proxyBase} setProxyBase={setProxyBase} doSync={doSync} syncing={syncing} syncMsg={syncMsg} lastSync={live.lastSync} pollName={live.pollName} onImport={onImport} usage={usage}
        onLoadIdentity={doLoadIdentity} identity={identity} theme={theme} setTheme={setTheme} onLoadIntel={doLoadIntel} intel={intel} onLoadPlayers={doLoadPlayers} players={players} autoSync={autoSync} setAutoSync={setAutoSync} installEvt={installEvt} installed={installed} onInstall={doInstall}
        registerCalls={addCalls} makeRestorePoint={makeRestorePoint} restoreBackup={restoreBackup} backup={backup} />}
      </ErrorBoundary>
      </div>

      {/* bottom nav — horizontally scrollable */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, maxWidth: 640, margin: "0 auto", background: C.panel, borderTop: `1px solid ${C.line}`, display: "flex", overflowX: "auto", padding: "6px 4px 10px", zIndex: 20 }}>
        {tabs.map(([k, l, Icon]) => (
          <button key={k} onClick={() => setView(k)} style={{ flex: "0 0 auto", minWidth: 58, background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "6px 4px", color: view === k ? C.amber : C.dim }}>
            <Icon size={18} /><span style={{ fontSize: 9.5 }}>{l}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
