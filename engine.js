// ═══════════════════════════════════════════
// MAFIA WARS UNDERGROUND — GAME ENGINE
// ═══════════════════════════════════════════

function save(){try{G.lastSeen=Date.now();localStorage.setItem('mw2_save',JSON.stringify(G));}catch(e){console.error('SAVE FAILED:',e);toast('⚠️ Save failed!','r');}}
function saveSoon(){if(_saveTimer)return;_saveTimer=setTimeout(()=>{save();_saveTimer=null;},300);}
function load(){try{const s=localStorage.getItem('mw2_save');if(s){const parsed=JSON.parse(s);Object.assign(G,parsed);return true;}}catch(e){console.error('LOAD FAILED:',e);}return false;}
function safeInitNewFields(){
  if(!G.raceCar)G.raceCar='rc01';
  if(!G.raceWins)G.raceWins=0;
  if(!G.raceCooldowns)G.raceCooldowns={};
  if(!G.racePurchased)G.racePurchased={};
  if(!G.dwPurchased)G.dwPurchased={};
  if(!G.dwHackCooldowns)G.dwHackCooldowns={};
  if(!G.underworldRep)G.underworldRep=0;
  if(!G.streetBounties)G.streetBounties={};
  if(!G.ownedTerritories)G.ownedTerritories={};
  if(!G.heatDecayBonus)G.heatDecayBonus=0;
  // Ensure all new fields exist after loading old save
  if(!G.bossHP)G.bossHP={};
  if(!G.bossDefeated)G.bossDefeated={};
  if(G.bossKills===undefined)G.bossKills=0;
  if(!G.drugPrices)G.drugPrices={};
  if(!G.drugInv)G.drugInv={};
  if(G.drugTradeCount===undefined)G.drugTradeCount=0;
  if(!G.achUnlocked)G.achUnlocked={};
  if(G.cashMult===undefined)G.cashMult=1;
  if(G.incomeMult===undefined)G.incomeMult=1;
  if(G.robBonus===undefined)G.robBonus=0;
  if(G.bountyMult===undefined)G.bountyMult=1;
  if(G.drugMult===undefined)G.drugMult=1;
  if(G.bossDmgMult===undefined)G.bossDmgMult=1;
  if(G.warDmgMult===undefined)G.warDmgMult=1;
  if(G.currentPanel===undefined)G.currentPanel='jobs';
  if(G.heat===undefined)G.heat=0;
  if(G.jailTimer===undefined)G.jailTimer=0;
  if(G.notoriety===undefined)G.notoriety=0;
  if(G.activeEvent===undefined)G.activeEvent=null;
  if(G.casinoWins===undefined)G.casinoWins=0;
  if(G.casinoLosses===undefined)G.casinoLosses=0;
  if(!G.crew)G.crew={};
  if(G.bmStingRisk===undefined)G.bmStingRisk=0;
  if(!G.hitmanMissions)G.hitmanMissions={};
  if(G.raceWins===undefined)G.raceWins=0;
  if(G.notoriety===undefined)G.notoriety=0;
  if(G.heat===undefined)G.heat=0;
  if(!G.crew)G.crew={};
  if(!G.luxuryOwned)G.luxuryOwned={};
  if(!G.luxuryTab)G.luxuryTab='Collectibles';
  if(!G.craftTab)G.craftTab='all';
  if(!G.invTab)G.invTab='all';
  if(!G.invSort)G.invSort='power';
  if(!G.achTab)G.achTab='All';
  if(!G.propTab)G.propTab='all';
  if(!G.propUpgrades)G.propUpgrades={};
  if(!G.hitlistKills)G.hitlistKills=0;
  if(!G.hitlistEarned)G.hitlistEarned=0;
  if(!G.raceLosses)G.raceLosses=0;
  if(!G.raceStreak)G.raceStreak=0;
  if(!G.raceBestStreak)G.raceBestStreak=0;
  if(!G.raceEarned)G.raceEarned=0;
  if(!G.carUpgrades)G.carUpgrades={};
  if(!G.hackSuccesses)G.hackSuccesses=0;
  if(!G.hackEarned)G.hackEarned=0;
  if(!G.fightStreak)G.fightStreak=0;
  if(!G.fightBestStreak)G.fightBestStreak=0;
  if(!G.cityMastered)G.cityMastered={};
  // lastSeen: don't overwrite if exists from save, but set to 0 for first time
  if(G.lastSeen===undefined)G.lastSeen=0;
  // Daily rewards
  if(!G.lastDailyClaim)G.lastDailyClaim=0;
  if(!G.dailyStreak)G.dailyStreak=0;
  // Backpack (consumable items)
  if(!G.backpack)G.backpack={};
  // Active play timer (seconds)
  if(!G.playTime)G.playTime=0;
  if(!G._baseMaxStamina)G._baseMaxStamina=Math.floor(20+G.level*.3);
  if(!G._baseMaxHealth)G._baseMaxHealth=Math.floor(100+G.level*5);
}
function calcOfflineProgress(){
  const now=Date.now();
  if(!G.lastSeen||G.lastSeen===0){G.lastSeen=now;return;} // First time on new code, just set timestamp
  const elapsed=now-G.lastSeen;
  if(elapsed<60000){G.lastSeen=now;return;} // Less than 1 min away, skip

  const seconds=Math.floor(elapsed/1000);
  const minutes=Math.floor(seconds/60);
  const hours=Math.min(24,Math.floor(minutes/60)); // Cap at 24 hours of offline progress
  const cappedSec=Math.min(seconds,86400); // 24hr cap
  const cappedMin=Math.min(minutes,1440);
  let report=[];

  // 1. Energy regen: class-based, every 8s
  const offlineRegen={Fearless:{e:3,s:2},Maniac:{e:5,s:2},Mogul:{e:3,s:2},Ghost:{e:3,s:2},Consigliere:{e:3,s:2}};
  const oR=offlineRegen[G.playerClass]||offlineRegen.Fearless;
  let eRate=oR.e, sRate=oR.s;
  if(G.crew&&G.crew['cr_time'])eRate*=2;
  if(G.blackMarketBuys&&G.blackMarketBuys['bm_time']){eRate*=3;sRate*=3;}
  const ticks=Math.floor(cappedSec/8);
  const energyGain=Math.min(G.maxEnergy-G.energy, ticks*eRate);
  if(energyGain>0){G.energy+=energyGain;report.push('+'+energyGain+' energy');}

  // 2. Stamina regen: class-based, every 8s
  const stamGain=Math.min(G.maxStamina-G.stamina, ticks*sRate);
  if(stamGain>0){G.stamina+=stamGain;report.push('+'+stamGain+' stamina');}

  // 3. Health regen: full heal if away 5+ min
  if(minutes>=5&&G.health<G.maxHealth){G.health=G.maxHealth;report.push('Full HP restored');}

  // 4. Heat decay: 1 per 15s base (+ crew bonuses)
  let heatDecayRate=1;
  if(G.crew&&G.crew['cr07'])heatDecayRate=4;
  if((G.notoriety||0)>=4000)heatDecayRate*=2;
  const heatLost=Math.min(G.heat||0, Math.floor(cappedSec/15)*heatDecayRate);
  if(heatLost>0){G.heat=Math.max(0,(G.heat||0)-heatLost);report.push('-'+heatLost+' heat');}

  // 5. Property income: collect proportional to time away (capped at 12 cycles = 6 hours worth)
  const inc=calcIncome();
  if(inc>0){
    const cycles=Math.min(12, cappedMin/30); // 1 cycle per 30 min, max 12
    const offlineIncome=Math.floor(inc*cycles*0.5); // 50% efficiency while offline
    if(offlineIncome>0){G.cash+=offlineIncome;G.totalEarned+=offlineIncome;report.push('+$'+fmtCash(offlineIncome)+' income');}
  }

  // 6. Crew passives: Doc Moretti heal (already handled), Chen Li heat (already handled above)

  // 7. Drug price fluctuation: randomize prices since they would have changed
  if(G.drugPrices){for(const d of DRUGS){G.drugPrices[d.id]=Math.max(d.buyBase*.4,d.buyBase*(0.6+Math.random()*.9));}}

  // 8. Jail timer: reduce by time away
  if(G.jailTimer>0){
    G.jailTimer=Math.max(0,G.jailTimer-seconds);
    if(G.jailTimer<=0)report.push('Released from jail');
  }

  // Show offline report
  if(report.length>0){
    const timeStr=hours>=1?(hours+'h '+Math.floor(cappedMin%60)+'m'):(cappedMin+'m');
    toast('Offline '+timeStr+': '+report.join(', '),'gold');
    addLog('⏰ OFFLINE PROGRESS ('+timeStr+'): '+report.join(', '),'sp');
  }

  G.lastSeen=now;
  save();
}
function showCharScreen(){
  try{
    if(load()){
      safeInitNewFields();
      calcOfflineProgress();
      document.getElementById('splash').style.display='none';
      document.getElementById('auth-screen').style.display='none';
      document.getElementById('game').style.display='flex';
      buildCityList();showPanel('jobs');updateAll();startLoops();
      addLog('Welcome back, '+G.name+'. Your empire awaits.','sp');
      return;
    }
  }catch(e){
    console.error('Load error:',e);
    try{localStorage.removeItem('mw2_save');}catch(e2){}
  }
  // No save found — show character creation
  document.getElementById('splash').style.display='none';
  document.getElementById('auth-screen').style.display='none';
  document.getElementById('char-screen').style.display='flex';
}
function selectClass(c){
  selClass=c;
  document.querySelectorAll('.cls').forEach(x=>x.classList.remove('sel'));
  document.getElementById('cls-'+c).classList.add('sel');
}
function selectBG(b){
  selBG=b;
  document.querySelectorAll('.bg-card').forEach(x=>x.classList.remove('sel'));
  document.getElementById('bg-'+b).classList.add('sel');
}
function startGame(){
  const nm=document.getElementById('cc-name-input').value.trim();
  G.name=nm||'The Don';
  G.playerClass=selClass;
  G.background=selBG;
  applyClassBonuses();
  applyBGBonuses();
  safeInitNewFields();
  refreshContracts();
  document.getElementById('char-screen').style.display='none';
  document.getElementById('game').style.display='flex';
  buildCityList();
  showPanel('jobs');
  updateAll();
  startLoops();
  addLog(`Welcome to the family, ${G.name}. The streets are yours.`,'sp');
  addLog(`Class: ${G.playerClass} | Background: ${G.background}`,'info');
  save();
}
function applyClassBonuses(){
  if(G.playerClass==='Fearless'){G.baseAttack+=3;}
  else if(G.playerClass==='Maniac'){G.maxEnergy+=15;G.energy=G.maxEnergy;}
  else if(G.playerClass==='Mogul'){/* income bonus applied in calc */}
  else if(G.playerClass==='Ghost'){G.critChance+=10;G.lootBonus+=10;}
  else if(G.playerClass==='Consigliere'){G.xpMult=1.10;}
  G.attack=G.baseAttack;
}
function applyBGBonuses(){
  if(G.background==='Streets'){G.cash=8000;}
  else if(G.background==='Military'){G.baseAttack+=5;G.baseDef+=5;G.attack=G.baseAttack;G.defense=G.baseDef;G.cash=3000;}
  else if(G.background==='WhiteCollar'){G.cash=25000;}
  else if(G.background==='Born'){G.mafiaSize=4;G.cash=5000;}
  else if(G.background==='Assassin'){G.baseAttack+=10;G.attack=G.baseAttack;G.cash=3000;}
}
function calcIncome(){
  let t=0;
  for(const p of PROPS){
    const own=G.properties[p.id]||0;
    if(own<=0)continue;
    const upgLvl=G.propUpgrades&&G.propUpgrades[p.id]||0;
    const upgBonus=upgLvl*Math.floor(p.i*0.25);
    t+=own*(p.i+upgBonus);
  }
  // Multipliers
  t=Math.floor(t*(G.incomeMult||1));
  if(G.blackMarketBuys['bm07'])t=Math.floor(t*1.3);
  return t;
}
function collectIncome(){
  const inc=calcIncome();if(inc===0){toast('No properties!','r');return;}
  const now=Date.now();const el=Math.min(12,(now-G.lastIncomeColl)/300000);
  const earn=Math.floor(inc*el);G.cash+=earn;G.totalEarned+=earn;G.lastIncomeColl=now;
  addLog(`💰 Income: $${earn.toLocaleString()}`,'gold');toast(`Income +$${earn.toLocaleString()}!`,'gold');
  updateAll();save();
}
function getItem(id){
  return LOOT[id]||STORE.find(x=>x.id===id)||{n:id,e:'📦',t:'weapon',atk:0,def:0};
}
function hasLoot(id){
  if(!G.inventory)return false;
  return (G.inventory.weapons||[]).includes(id)||(G.inventory.armor||[]).includes(id)||(G.inventory.vehicles||[]).includes(id)||(G.inventory.specials||[]).includes(id);
}
function addLoot(id){
  const it=LOOT[id];if(!it)return;
  if(it.t==='weapon')G.inventory.weapons.push(id);
  else if(it.t==='armor')G.inventory.armor.push(id);
  else if(it.t==='vehicle')G.inventory.vehicles.push(id);
  else G.inventory.specials.push(id);
  addLog(`🎁 LOOT: ${it.n}!`,'sp');toast(`${it.e} ${it.n}!`,'gold');
}
function addLootById(id,it){
  if(!LOOT[id]&&it){LOOT[id]={n:it.n,e:it.e,t:it.t,atk:it.atk,def:it.def};}
}
function getSkillBonus(type){
  let total=0;
  for(const sk of Object.values(SKILL_TREE).flat()){
    if(G.skilltree[sk.id]&&sk.effect[type])total+=sk.effect[type];
  }
  return total;
}
function refreshContracts(){
  G.activeContracts=[];
  const shuffled=[...CONTRACT_TEMPLATES].sort(()=>Math.random()-.5);
  G.activeContracts=shuffled.slice(0,5);
}
function fmtCash(n){
  if(!n||isNaN(n))return '0';
  if(n>=1e15)return (n/1e15).toFixed(1)+'Q';
  if(n>=1e12)return (n/1e12).toFixed(1)+'T';
  if(n>=1e9)return (n/1e9).toFixed(1)+'B';
  if(n>=1e6)return (n/1e6).toFixed(1)+'M';
  if(n>=1e3)return (n/1e3).toFixed(1)+'K';
  return Math.floor(n).toLocaleString();
}
function initDrugPrices(){
  if(!G.drugPrices)G.drugPrices={};
  if(!G.drugInv)G.drugInv={};
  if(!G.drugTradeCount)G.drugTradeCount=0;
  for(const d of DRUGS){
    if(!G.drugPrices[d.id])G.drugPrices[d.id]=d.buyBase*(0.8+Math.random()*.4);
    if(!G.drugInv[d.id])G.drugInv[d.id]=0;
  }
}
function fluctuateDrugPrices(){
  if(!G.drugPrices)return;
  for(const d of DRUGS){
    G.drugPrices[d.id]=Math.max(d.buyBase*.4,d.buyBase*(0.6+Math.random()*.9));
  }
  if(G.currentPanel==='drugtrade')buildDrugTrade(document.getElementById('center'));
}
function checkAchievements(){
  if(!G.achUnlocked)G.achUnlocked={};
  for(const a of ACHIEVEMENTS){
    if(!G.achUnlocked[a.id]){
      try{
        if(a.check()){
          G.achUnlocked[a.id]=true;
          a.apply();
          addLog(`🏆 ACHIEVEMENT: ${a.n}! (${a.bonus})`,'sp');
          toast(`🏆 ${a.n}!`,'gold');
        }
      }catch(e){}
    }
  }
}
function getHeatLevel(){
  const h=Math.min(100,G.heat||0);
  return HEAT_LEVELS.find(l=>h>=l.min&&h<l.max)||HEAT_LEVELS[0];
}
function addHeat(amount){
  let heatAmt=amount;
  // Heat reduction: additive percentages, capped at 70% total reduction
  let reduction=0;
  if(G.crew&&G.crew['cr05'])reduction+=30; // Roxanne -30%
  if(G.crew&&G.crew['cr_shadow'])reduction+=25; // Shadow -25%
  if(G.blackMarketBuys&&G.blackMarketBuys['bm_silencer'])reduction+=15; // Silencer -15%
  if(G.blackMarketBuys&&G.blackMarketBuys['bm_stolen_badges'])reduction+=10; // Badges -10%
  if(activeEventObj&&activeEventObj.effect==='noRobHeat')reduction+=50;
  reduction=Math.min(70,reduction); // Cap at 70% — always get SOME heat
  heatAmt=Math.max(1,Math.floor(heatAmt*(1-reduction/100))); // Floor at 1
  G.heat=Math.min(100,(G.heat||0)+heatAmt);
  // heatDanger event: random arrest at high heat
  if(activeEventObj&&activeEventObj.effect==='heatDanger'&&G.heat>60&&Math.random()<0.08){triggerJail(10+Math.floor(G.level/10));toast('🚔 Federal sweep! Arrested!','r');}
  updateHeatBar();
  // Trigger jail check at high heat
  if(G.heat>=100&&!G.jailTimer){
    triggerJail(60);
  }
}
function coolHeat(amount){
  G.heat=Math.max(0,(G.heat||0)-amount);
  updateHeatBar();
}
function updateHeatBar(){
  const h=Math.min(100,G.heat||0);
  const lvl=getHeatLevel();
  const fill=document.getElementById('heat-bar-fill');
  const txt=document.getElementById('heat-level-txt');
  if(fill){fill.style.width=h+'%';fill.style.background='linear-gradient(90deg,'+lvl.color+'aa,'+lvl.color+')';}
  if(txt){txt.textContent=lvl.label;txt.style.color=lvl.color;}
}
function addNotoriety(amount){
  G.notoriety=(G.notoriety||0)+Math.floor(amount);
}
function triggerJail(seconds){
  G.jailTimer=seconds;
  G.health=Math.floor(G.health*.6); // took a beating getting arrested
  toast('🚔 BUSTED! You\'re going to jail!','r');
  addLog('🚔 ARRESTED! Jailed for '+seconds+' seconds.','bad');
  addHeat(-30); // heat drops after arrest
  showJail();
}
function updateJailTimer(){
  if(!G.jailTimer||G.jailTimer<=0){
    G.jailTimer=0;
    const o=document.getElementById('jail-overlay');
    if(o)o.style.display='none';
    toast('🔓 Released from jail!','g');
    addLog('🔓 Released. Back on the streets.','gold');
    return;
  }
  const mins=Math.floor(G.jailTimer/60);
  const secs=G.jailTimer%60;
  const t=document.getElementById('jail-timer');
  const bc=document.getElementById('bail-cost-txt');
  const bailCost=G.jailTimer*500*Math.max(1,Math.floor(G.level/10));
  if(t)t.textContent=mins+':'+(secs<10?'0':'')+secs;
  if(bc)bc.textContent='Bail: $'+bailCost.toLocaleString();
}
function payBail(){
  let bailCost=(G.jailTimer||60)*500*Math.max(1,Math.floor(G.level/10));if(G.crew&&G.crew['cr_lawyer'])bailCost=Math.floor(bailCost*0.50);if(G.blackMarketBuys&&G.blackMarketBuys['bm_fake_id'])bailCost=Math.floor(bailCost*0.50);
  if(G.cash<bailCost){toast('Can\'t afford bail!','r');return;}
  G.cash-=bailCost;
  G.jailTimer=0;
  const o=document.getElementById('jail-overlay');
  if(o)o.style.display='none';
  toast('🔓 Bailed out for $'+bailCost.toLocaleString(),'g');
  addLog('💰 Paid $'+bailCost.toLocaleString()+' bail.','gold');
  updateAll();save();
}
function applyCrewPassives(){
  if(!G.crew)return;
  if(G.crew['cr07']){coolHeat(3);}
  if(G.crew['cr02']&&G.health<G.maxHealth){G.health=Math.min(G.maxHealth,G.health+Math.floor(G.maxHealth*.02));}
  if(G.crew['cr_shadow']&&(G.heat||0)>0){coolHeat(1);}
}
function getEventMult(type,base){
  if(!activeEventObj)return base;
  const ef=activeEventObj.effect;
  // Heat modifiers
  if(type==='heatMult'){
    if(ef==='heatDouble')return base*2;
    if(ef==='noRobHeat')return 0;
    if(ef==='easyMode')return base*0.5;
    return base;
  }
  // Cash modifiers
  if(type==='cashMult'){
    if(ef==='cashBonus')return base*1.5;
    if(ef==='goldenHour')return base*2;
    return base;
  }
  // XP modifiers
  if(type==='xpMult'){
    if(ef==='heatDouble'||ef==='fightXP2x'||ef==='goldenHour')return base*2;
    if(ef==='easyMode')return base*1.5;
    return base;
  }
  // Loot modifiers
  if(type==='lootMult'){
    if(ef==='lootTriple')return base*3;
    if(ef==='lootBoost'||ef==='goldenHour')return base*1.5;
    return base;
  }
  // Hack reward modifier
  if(type==='hackMult'){
    if(ef==='cryptoBoost')return base*3;
    if(ef==='goldenHour')return base*2;
    return base;
  }
  // Success rate modifier (contracts, hitman)
  if(type==='successBoost'){
    if(ef==='easyMode')return base+0.20;
    if(ef==='hitmanBoost')return base+0.15;
    return base;
  }
  // Gang war modifier
  if(type==='gangMult'){
    if(ef==='gangBonus')return base*2;
    return base;
  }
  // Property cost modifier
  if(type==='propCostMult'){
    if(ef==='cheapProps')return base*0.7;
    return base;
  }
  return base;
}
function getNotorietyTier(){
  const n=G.notoriety||0;
  let tier=NOTORIETY_TIERS[0];
  for(const t of NOTORIETY_TIERS)if(n>=t.min)tier=t;
  return tier;
}
function applyNotorietyBonuses(){
  // Notoriety bonuses applied passively — checked periodically
  // These are non-stacking caps (use Math.max to not re-add)
}
// Notoriety is checked inline via getNotorietyTier() in relevant functions
// The actual bonuses are applied through getNotorietyMult()
function getNotorietyMult(type){
  const n=G.notoriety||0;
  if(type==='cash'){
    if(n>=500000)return 5;if(n>=200000)return 4;if(n>=100000)return 3;
    if(n>=60000)return 2;if(n>=20000)return 1.25;if(n>=12000)return 1.20;
    if(n>=2000)return 1.15;if(n>=200)return 1.05;if(n>=25)return 1.02;return 1;
  }
  if(type==='xp'){
    if(n>=500000)return 5;if(n>=200000)return 3;if(n>=100000)return 2;
    if(n>=35000)return 2;if(n>=12000)return 1.20;if(n>=2000)return 1.15;
    if(n>=200)return 1.03;return 1;
  }
  if(type==='loot'){
    if(n>=500)return 1.05;if(n>=60000)return 1.10;return 1;
  }
  if(type==='heatDecay'){
    if(n>=4000)return 2;return 1;
  }
  if(type==='crit'){
    if(n>=1000)return 10;return 0;
  }
  return 1;
}
function gainXP(amt){
  checkAchievements();
  G.xp+=Math.round(amt);
  while(G.xp>=G.xpToNext)levelUp();
}
function levelUp(){
  G.xp-=G.xpToNext;G.level++;
  G.xpToNext=Math.floor(45*G.level + 1.5*Math.pow(G.level,1.65));
  G.skillPoints+=G.playerClass==='Consigliere'?4:3;
  G.maxEnergy+=1;
  // Partial refill on level up (20% of max)
  G.energy=Math.min(G.maxEnergy,G.energy+Math.floor(G.maxEnergy*.2));
  // Stamina: only increase the BASE, don't overwrite bonuses from SP/BM/prestige
  const baseStam=Math.floor(20+G.level*.3);
  if(!G._baseMaxStamina)G._baseMaxStamina=baseStam;
  const stamGrowth=baseStam-G._baseMaxStamina;
  if(stamGrowth>0){G.maxStamina+=stamGrowth;G._baseMaxStamina=baseStam;}
  G.stamina=Math.min(G.maxStamina,G.stamina+Math.floor(G.maxStamina*.2));
  // Health: only increase the BASE, don't overwrite bonuses from SP/BM/crew
  const baseHP=Math.floor(100+G.level*5);
  if(!G._baseMaxHealth)G._baseMaxHealth=baseHP;
  const hpGrowth=baseHP-G._baseMaxHealth;
  if(hpGrowth>0){G.maxHealth+=hpGrowth;G._baseMaxHealth=baseHP;}
  G.health=G.maxHealth;
  if(G.level%5===0){G.mafiaSize++;addLog(`👥 New member! Size: ${G.mafiaSize}`,'gold');}
  // Auto atk/def scaling — include achievement bonuses
  let achAtk=0,achDef=0;
  if(G.achUnlocked){
    for(const a of ACHIEVEMENTS){
      if(G.achUnlocked[a.id]){
        // Parse known ATK/DEF achievement bonuses
        if(a.id==='ach01')achAtk+=3;
        if(a.id==='ach05')achAtk+=15;
        if(a.id==='ach09'){achAtk+=Math.floor(G.baseAttack*.05);achDef+=Math.floor(G.baseDef*.05);}
        if(a.id==='ach17')achDef+=50;
        if(a.id==='ach18'){achAtk+=Math.floor(G.baseAttack*.2);achDef+=Math.floor(G.baseDef*.2);}
        if(a.id==='ach19'){achAtk+=500;achDef+=500;}
        if(a.id==='ach20'){achAtk+=1000;achDef+=1000;}
        if(a.id==='ach_crew5')achAtk+=10;
        if(a.id==='ach_heatzero')achDef+=10;
      }
    }
  }
  const invStats=calcInventoryStats();
  G.attack=G.baseAttack+G.pBonuses.attackBonus+getSkillBonus('atk')+achAtk+invStats.atk;
  G.defense=G.baseDef+G.pBonuses.defBonus+getSkillBonus('def')+achDef+invStats.def;
  const lu=document.getElementById('lvlup');
  document.getElementById('lu-text').textContent=`Level ${G.level} — ${getRank(G.level)}`;
  lu.classList.add('show');
  setTimeout(()=>lu.classList.remove('show'),2800);
  addLog(`🌟 LEVEL ${G.level}! ${getRank(G.level)} — +${G.playerClass==='Consigliere'?7:5} SP`,'sp');
  toast(`Level ${G.level}! ${getRank(G.level)}`,'gold');
  buildCityList();checkMissions();
}
function checkMissions(){
  for(const m of MISSIONS){
    const ul=m.ul||1;
    const was=G.missionProgress[m.id]||0;
    if(was>=m.steps.length)continue;
    if(G.level<ul&&G.prestige===0)continue;
    let np=0;
    const totalProps=Object.values(G.properties).reduce((a,b)=>a+b,0);
    if(m.id==='MS01'){if(G.jobsDone>=5)np=Math.max(np,1);if(G.level>=3)np=Math.max(np,2);if(G.totalEarned>=5000)np=Math.max(np,3);}
    else if(m.id==='MS02'){if(G.fightsWon>=3)np=Math.max(np,1);if(G.jobsDone>=15)np=Math.max(np,2);if(totalProps>=1)np=Math.max(np,3);}
    else if(m.id==='MS03'){if(G.jobsDone>=30)np=Math.max(np,1);if(G.totalEarned>=50000)np=Math.max(np,2);if(G.level>=10)np=Math.max(np,3);}
    else if(m.id==='MS04'){if(G.fightsWon>=10)np=Math.max(np,1);if(G.robberies>=5)np=Math.max(np,2);if(G.level>=15)np=Math.max(np,3);}
    else if(m.id==='MS05'){if(G.level>=CITIES.chicago.unlock)np=Math.max(np,1);const chiJobs=Object.keys(G.jobMastery).filter(k=>k.startsWith('CH')).reduce((s,k)=>s+(G.jobMastery[k]||0),0);if(chiJobs>=20)np=Math.max(np,2);if(G.totalEarned>=200000)np=Math.max(np,3);}
    else if(m.id==='MS06'){if(G.jobsDone>=50)np=Math.max(np,1);if(G.fightsWon>=20)np=Math.max(np,2);if(G.level>=20)np=Math.max(np,3);}
    else if(m.id==='MS08'){if(G.level>=30)np=Math.max(np,1);if(totalProps>=10)np=Math.max(np,2);if(G.kills>=10)np=Math.max(np,3);}
    else if(m.id==='MS09'){if(G.contractsDone>=5)np=Math.max(np,1);if(G.level>=50)np=Math.max(np,2);if(G.totalEarned>=2000000)np=Math.max(np,3);}
    else if(m.id==='MS11'){const gangWon=Object.values(G.gangWarProgress).some(v=>v>=100);if(gangWon)np=Math.max(np,1);if(G.level>=80)np=Math.max(np,2);if(G.totalEarned>=5000000)np=Math.max(np,3);}
    else if(m.id==='MS14'){if(G.level>=200)np=Math.max(np,1);if(G.totalEarned>=100000000)np=Math.max(np,2);if(G.respect>=10000)np=Math.max(np,3);}
    else if(m.id==='MS16'){if(G.level>=500)np=Math.max(np,1);if(G.contractsDone>=50)np=Math.max(np,2);if(G.properties['sovereign_fund'])np=Math.max(np,3);}
    else if(m.id==='MS07'){if(G.level>=CITIES.mexico_city.unlock)np=Math.max(np,1);const mcJobs=Object.keys(G.jobMastery).filter(k=>k.startsWith('MC')).length;if(mcJobs>=15)np=Math.max(np,2);if(G.totalEarned>=500000)np=Math.max(np,3);}
    else if(m.id==='MS10'){if(G.level>=CITIES.london.unlock)np=Math.max(np,1);if(G.level>=CITIES.moscow.unlock)np=Math.max(np,2);if(G.level>=70)np=Math.max(np,3);}
    else if(m.id==='MS12'){if(G.blackMarketBuys&&G.blackMarketBuys['bm02'])np=Math.max(np,1);if(G.contractsDone>=15)np=Math.max(np,2);if(G.level>=100)np=Math.max(np,3);}
    else if(m.id==='MS13'){if(G.level>=120)np=Math.max(np,1);if(G.fightsWon>=100)np=Math.max(np,2);if(totalProps>=20)np=Math.max(np,3);}
    else if(m.id==='MS15'){if(G.level>=CITIES.tokyo.unlock)np=Math.max(np,1);if(G.level>=CITIES.singapore.unlock)np=Math.max(np,2);if(G.level>=300)np=Math.max(np,3);}
    else if(m.id==='MS17'){if(G.level>=700)np=Math.max(np,1);if(G.totalEarned>=50000000)np=Math.max(np,2);if(G.fightsWon>=500)np=Math.max(np,3);}
    else if(m.id==='MS18'){if(G.level>=900)np=Math.max(np,1);if(G.kills>=1000)np=Math.max(np,2);const maxGangWon=Object.values(G.gangWarProgress).filter(v=>v>=100).length>=GANGS.length;if(maxGangWon)np=Math.max(np,3);}
    else if(m.id==='MS19'){if(G.level>=1200)np=Math.max(np,1);if(G.totalEarned>=500000000)np=Math.max(np,2);if(totalProps>=40)np=Math.max(np,3);}
    else if(m.id==='MS20'){if(G.level>=1500)np=3;}
    if(np>was){
      G.missionProgress[m.id]=np;
      if(np>=m.steps.length){
        const rew=m.steps.length*10000*(1+m.steps.length*.5);
        G.cash+=rew;gainXP(m.steps.length*50);G.respect+=100;
        addLog(`🏆 MISSION COMPLETE: ${m.t}! +$${rew.toLocaleString()}`,'sp');
        toast(`Mission: ${m.t} DONE!`,'gold');
      }
    }
  }
}
function updateAll(){
  try{
  // Recalculate attack/defense with inventory every update
  const invStats=calcInventoryStats();
  let achAtk=0,achDef=0;
  if(G.achUnlocked&&typeof ACHIEVEMENTS!=='undefined'){
    for(const a of ACHIEVEMENTS){
      if(G.achUnlocked[a.id]){
        if(a.id==='ach01')achAtk+=3;
        if(a.id==='ach05')achAtk+=15;
        if(a.id==='ach09'){achAtk+=Math.floor(G.baseAttack*.05);achDef+=Math.floor(G.baseDef*.05);}
        if(a.id==='ach17')achDef+=50;
        if(a.id==='ach18'){achAtk+=Math.floor(G.baseAttack*.2);achDef+=Math.floor(G.baseDef*.2);}
        if(a.id==='ach19'){achAtk+=500;achDef+=500;}
        if(a.id==='ach20'){achAtk+=1000;achDef+=1000;}
        if(a.id==='ach_crew5')achAtk+=10;
        if(a.id==='ach_heatzero')achDef+=10;
      }
    }
  }
  G.attack=G.baseAttack+(G.pBonuses?G.pBonuses.attackBonus:0)+getSkillBonus('atk')+achAtk+invStats.atk;
  G.defense=G.baseDef+(G.pBonuses?G.pBonuses.defBonus:0)+getSkillBonus('def')+achDef+invStats.def;
  updateTopBar();updateBars();updateRight();updateMafia();
  updateHeatBar();
  if(G.heatCap !== undefined) G.heat = Math.min(G.heatCap, G.heat||0);
  applyNotorietyPerks();
  updateHeatBar();
  const hEl=document.getElementById('rp-heat');
  const nEl=document.getElementById('rp-not');
  if(hEl)hEl.textContent=Math.floor(G.heat||0)+'%';
  if(nEl)nEl.textContent=(G.notoriety||0).toLocaleString();
  }catch(err){console.error('updateAll error:',err);}
}
function updateTopBar(){
  document.getElementById('tb-cash').textContent='$'+G.cash.toLocaleString();
  document.getElementById('tb-level').textContent=G.level;
  document.getElementById('tb-atk').textContent=G.attack;
  document.getElementById('tb-def').textContent=G.defense;
  document.getElementById('tb-mafia').textContent=G.mafiaSize;
  document.getElementById('tb-resp').textContent=G.respect.toLocaleString();
  document.getElementById('tb-prestige').textContent=G.prestige+'★';
  document.getElementById('tb-xpmult').textContent=(G.xpMult*G.pBonuses.xpMult).toFixed(2)+'×';
  document.getElementById('tb-pname').textContent=G.name.toUpperCase();
  document.getElementById('tb-rank').textContent=getRank(G.level);
}
function updateBars(){
  const ep=(G.energy/G.maxEnergy)*100,sp2=(G.stamina/G.maxStamina)*100,hp=(G.health/G.maxHealth)*100,xp=(G.xp/G.xpToNext)*100;
  document.getElementById('ebar').style.width=ep+'%';
  document.getElementById('sbar').style.width=sp2+'%';
  document.getElementById('hbar').style.width=hp+'%';
  document.getElementById('xbar').style.width=xp+'%';
  document.getElementById('ev').textContent=`${G.energy}/${G.maxEnergy}`;
  document.getElementById('sv2').textContent=`${G.stamina}/${G.maxStamina}`;
  document.getElementById('hv').textContent=`${G.health}/${G.maxHealth}`;
  document.getElementById('xv').textContent=`${G.xp.toLocaleString()}/${G.xpToNext.toLocaleString()}`;
}
function updateRight(){
  const r=getRank(G.level);
  document.getElementById('rp-rank').textContent=r;
  document.getElementById('rp-prestige-stars').textContent=G.prestige>0?'★'.repeat(Math.min(10,G.prestige))+` Prestige ${G.prestige}`:'';
  document.getElementById('rp-resp').textContent=G.respect.toLocaleString()+' Respect';
  document.getElementById('rp-level').textContent=G.level;
  document.getElementById('rp-class').textContent=G.playerClass;
  document.getElementById('rp-bg').textContent=G.background;
  document.getElementById('rp-xp').textContent=G.xp.toLocaleString();
  document.getElementById('rp-xpnext').textContent=G.xpToNext.toLocaleString();
  document.getElementById('rp-atk').textContent=G.attack;
  document.getElementById('rp-def').textContent=G.defense;
  document.getElementById('rp-crit').textContent=G.critChance+'%';
  document.getElementById('rp-loot').textContent=G.lootBonus+'%';
  document.getElementById('rp-cash').textContent='$'+G.cash.toLocaleString();
  document.getElementById('rp-total').textContent='$'+G.totalEarned.toLocaleString();
  document.getElementById('rp-propinc').textContent='$'+calcIncome().toLocaleString();
  document.getElementById('rp-propct').textContent=Object.values(G.properties).reduce((a,b)=>a+b,0);
  document.getElementById('rp-fw').textContent=G.fightsWon;
  document.getElementById('rp-fl').textContent=G.fightsLost;
  document.getElementById('rp-kills').textContent=G.kills;
  document.getElementById('rp-jd').textContent=G.jobsDone;
  document.getElementById('rp-rob').textContent=G.robberies;
  document.getElementById('rp-cd').textContent=G.contractsDone;
  document.getElementById('rp-mafia').textContent=G.mafiaSize;
  document.getElementById('sp-count').textContent=G.skillPoints;
  document.getElementById('sk-energy').textContent=G.maxEnergy;
  document.getElementById('sk-stamina').textContent=G.maxStamina;
  document.getElementById('sk-health').textContent=G.maxHealth;
  document.getElementById('sk-attack').textContent=G.attack;
  document.getElementById('sk-defense').textContent=G.defense;
  // Heal button color
  const hb=document.getElementById('heal-btn-top');
  if(hb)hb.style.opacity=G.health<G.maxHealth*.5?'1':'.5';
  // Street Status section
  const rpNot=document.getElementById('rp-notoriety');
  if(rpNot)rpNot.textContent=(G.notoriety||0).toLocaleString();
  const rpRep=document.getElementById('rp-rep-tier');
  if(rpRep)rpRep.textContent=getNotorietyTier().n||'Nobody';
  const rpHeat2=document.getElementById('rp-heat2');
  if(rpHeat2)rpHeat2.textContent=Math.floor(G.heat||0)+'%';
  const rpCrew=document.getElementById('rp-crew');
  if(rpCrew)rpCrew.textContent=G.crew?Object.keys(G.crew).length:0;
  const rpHmDone=document.getElementById('rp-hm-done');
  if(rpHmDone)rpHmDone.textContent=G.hitmanMissions?Object.values(G.hitmanMissions).filter(x=>x===true).length:0;
  // Backpack summary in right panel
  const rpBp=document.getElementById('rp-backpack-items');
  if(rpBp){
    const bpItems=G.backpack?Object.entries(G.backpack).filter(([k,v])=>v>0):[];
    if(bpItems.length===0)rpBp.textContent='Empty';
    else rpBp.innerHTML=bpItems.map(([id,qty])=>{
      const r=DAILY_REWARDS.find(x=>x.id===id);
      return r?r.e+'×'+qty:'';
    }).filter(Boolean).join(' ');
  }
  // Play timer
  const ptEl=document.getElementById('play-timer');
  if(ptEl)ptEl.textContent=formatPlayTime(G.playTime||0);
}
function addLog(msg,type='info'){
  G.log.unshift({msg,type,t:new Date().toLocaleTimeString()});
  if(G.log.length>300)G.log=G.log.slice(0,300);
  const el=document.getElementById('log');
  if(el)el.innerHTML=G.log.slice(0,40).map(l=>`<div class="le ${l.type}">[${l.t}] ${l.msg}</div>`).join('');
}
function toast(msg,type=''){
  const c=document.getElementById('toasts');
  const t=document.createElement('div');
  t.className=`toast${type==='gold'?' tgold':type==='g'?' tg':type==='r'?' ':type==='p'?' tp':''}`;
  t.textContent=msg;c.appendChild(t);
  setTimeout(()=>{t.style.animation='tout .25s ease forwards';setTimeout(()=>t.remove(),250);},2400);
}
function startLoops(){
  // Save on page close/refresh for reliable persistence
  window.addEventListener('beforeunload',()=>{if(!window._wiping)save();});

  // ── ACTIVE PLAY TIMER ──
  // Only counts time when user is actively interacting (clicks/taps within last 60s)
  let _lastActivity=Date.now();
  const trackActivity=()=>{_lastActivity=Date.now();};
  document.addEventListener('click',trackActivity);
  document.addEventListener('touchstart',trackActivity);
  document.addEventListener('keydown',trackActivity);
  setInterval(()=>{
    // Only count if user was active in the last 60 seconds and tab is visible
    if(Date.now()-_lastActivity<60000&&!document.hidden){
      G.playTime=(G.playTime||0)+1;
      // Update play timer display
      const ptEl=document.getElementById('play-timer');
      if(ptEl)ptEl.textContent=formatPlayTime(G.playTime);
    }
  },1000);

  // ── DAILY REWARD CHECK ──
  checkDailyReward();
  const regenRates={Fearless:{e:3,s:2,h:5},Maniac:{e:5,s:2,h:4},Mogul:{e:3,s:2,h:4},Ghost:{e:3,s:2,h:4},Consigliere:{e:3,s:2,h:4}};
  const r=regenRates[G.playerClass]||regenRates.Fearless;
  // Energy/stamina/health regen (every 15s)
  setInterval(()=>{
    let ch=false;
    let eRegen=r.e,sRegen=r.s;
    if(G.crew&&G.crew['cr_time'])eRegen*=2;
    if(G.blackMarketBuys&&G.blackMarketBuys['bm_time'])eRegen*=3;
    if(G.blackMarketBuys&&G.blackMarketBuys['bm_time'])sRegen*=3;
    if(G.skillNodes&&G.skillNodes['st_e4'])eRegen*=2;
    if(G.energy<G.maxEnergy){G.energy=Math.min(G.maxEnergy,G.energy+Math.floor(eRegen));ch=true;}
    if(G.stamina<G.maxStamina){G.stamina=Math.min(G.maxStamina,G.stamina+Math.floor(sRegen));ch=true;}
    if(G.health<G.maxHealth){G.health=Math.min(G.maxHealth,G.health+r.h);ch=true;}
    if(ch){updateBars();updateTopBar();}
  },8000);
  // Auto income trickle
  setInterval(()=>{
    const inc=calcIncome();
    if(inc>0){const e=Math.min(2000,Math.floor(inc*.01));if(e>0){G.cash+=e;G.totalEarned+=e;updateTopBar();}}
  },30000);
  // Drug price fluctuation
  initDrugPrices();
  setInterval(fluctuateDrugPrices,30000);
  // Achievement check
  setInterval(checkAchievements,15000);
  // Auto save
  setInterval(save,15000);
  // Heat cooldown (every 10s)
  setInterval(()=>{
    if((G.heat||0)>0){
      let coolRate=1;
      if(G.crew&&G.crew['cr07'])coolRate=4;
      if((G.notoriety||0)>=4000)coolRate*=2;
      if(G.heatDecayBonus)coolRate+=G.heatDecayBonus;
      if(G.blackMarketBuys&&G.blackMarketBuys['bm_stolen_badges'])coolRate=Math.ceil(coolRate*1.15);
      coolHeat(coolRate);
    }
  },10000);
  // Jail countdown (every 1s)
  setInterval(()=>{
    if(G.jailTimer>0){
      G.jailTimer--;
      updateJailTimer();
      if(G.jailTimer<=0){
        G.jailTimer=0;
        const o=document.getElementById('jail-overlay');
        if(o)o.style.display='none';
        toast('🔓 Released from jail!','g');
        addLog('🔓 Released. Back on the streets.','gold');
        save();
      }
    }
  },1000);
  // Event countdown (every 1s for smooth timer)
  setInterval(()=>{
    if(activeEventObj&&eventCountdown>0){
      eventCountdown--;
      if(eventCountdown<=0)endEvent();
      else if(G.currentPanel==='events')buildEvents(document.getElementById('center'));
    }
  },1000);
  // Random event trigger (every 30s, 15% chance = avg every ~3.3 min)
  setInterval(()=>{
    if(!activeEventObj&&Math.random()<0.15)triggerRandomEvent();
  },30000);
  // Crew passives (every 60s)
  setInterval(()=>{applyCrewPassives();},60000);
  // Init heat bar
  updateHeatBar();
}

// ══════════════════════════════════════════
// PLAY TIME FORMATTER
// ══════════════════════════════════════════
function formatPlayTime(sec){
  const h=Math.floor(sec/3600);
  const m=Math.floor((sec%3600)/60);
  const s=sec%60;
  if(h>0)return h+'h '+m+'m '+s+'s';
  if(m>0)return m+'m '+s+'s';
  return s+'s';
}

// ══════════════════════════════════════════
// DAILY REWARDS
// ══════════════════════════════════════════
const DAILY_REWARDS=[
  {id:'dr_energy',n:'Energy Refill',e:'⚡',d:'Fully restores your energy.',qty:1},
  {id:'dr_stamina',n:'Stamina Refill',e:'💪',d:'Fully restores your stamina.',qty:1},
  {id:'dr_heal',n:'Full Heal',e:'❤️',d:'Restores all HP instantly.',qty:1},
  {id:'dr_cash',n:'Cash Drop',e:'💰',d:'$10,000 bonus cash.',qty:1},
  {id:'dr_mafia',n:'Mafia Recruits',e:'👥',d:'+3 mafia members.',qty:1},
  {id:'dr_heat_clear',n:'Heat Cleanse',e:'🧊',d:'Instantly clears all heat.',qty:1},
  {id:'dr_xp_boost',n:'XP Boost',e:'🌟',d:'Instant 500 XP.',qty:1},
  {id:'dr_loot_crate',n:'Loot Crate',e:'🎁',d:'Random weapon or armor drop.',qty:1},
  {id:'dr_skill_point',n:'Bonus Skill Point',e:'🧠',d:'+1 skill point.',qty:1},
  {id:'dr_notoriety',n:'Street Cred',e:'☠️',d:'+50 notoriety.',qty:1},
];

function getDailyReward(day){
  // Cycle through rewards, streak bonus on day 7
  return DAILY_REWARDS[day%DAILY_REWARDS.length];
}

function checkDailyReward(){
  const now=Date.now();
  const last=G.lastDailyClaim||0;
  const elapsed=now-last;
  const oneDay=86400000; // 24 hours

  if(elapsed>=oneDay){
    // Show daily reward popup after a short delay
    setTimeout(()=>showDailyRewardPopup(),1500);
  }
}

function showDailyRewardPopup(){
  const streak=(G.dailyStreak||0);
  const reward=getDailyReward(streak);
  const isDay7=(streak+1)%7===0;

  // Create popup overlay
  let popup=document.getElementById('daily-popup');
  if(!popup){
    popup=document.createElement('div');
    popup.id='daily-popup';
    document.body.appendChild(popup);
  }
  popup.style.cssText='position:fixed;inset:0;z-index:9500;background:rgba(0,0,0,.92);display:flex;align-items:center;justify-content:center;';
  popup.innerHTML=`
    <div style="background:linear-gradient(135deg,#0a0a14,#1a0a20);border:2px solid var(--gold);padding:30px;max-width:360px;width:90%;text-align:center;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:14px;color:var(--text-dim);letter-spacing:.2em;margin-bottom:4px;">DAILY REWARD</div>
      <div style="font-family:'Bebas Neue',sans-serif;font-size:24px;color:var(--bright-gold);letter-spacing:.15em;margin-bottom:8px;">DAY ${streak+1}${isDay7?' — BONUS DAY!':''}</div>
      <div style="font-size:48px;margin:12px 0;">${reward.e}</div>
      <div style="font-family:'Bebas Neue',sans-serif;font-size:20px;color:var(--text);margin-bottom:4px;">${reward.n}${isDay7?' ×2':''}</div>
      <div style="font-family:'Special Elite',serif;font-size:12px;color:var(--text-dim);margin-bottom:16px;">${reward.d}</div>
      <div style="font-family:'Cutive Mono',monospace;font-size:10px;color:var(--text-dim);margin-bottom:16px;">Sent to your Backpack — use anytime!</div>
      <button onclick="claimDailyReward()" style="background:linear-gradient(135deg,var(--blood),var(--crimson));border:2px solid var(--gold);color:#fff;font-family:'Bebas Neue',sans-serif;font-size:20px;letter-spacing:.15em;padding:12px 40px;cursor:pointer;transition:all .2s;width:100%;">CLAIM REWARD</button>
      <div style="margin-top:12px;display:flex;justify-content:center;gap:4px;">
        ${Array.from({length:7},(_, i)=>`<div style="width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;border:1px solid ${i<(streak%7)?'var(--bright-gold)':i===(streak%7)?'var(--crimson)':'var(--border)'};background:${i<(streak%7)?'rgba(218,165,32,.15)':i===(streak%7)?'rgba(139,0,0,.3)':'var(--surface2)'};color:${i<=(streak%7)?'var(--bright-gold)':'var(--text-dim)'}">${i+1}</div>`).join('')}
      </div>
    </div>`;
}

function claimDailyReward(){
  const streak=(G.dailyStreak||0);
  const reward=getDailyReward(streak);
  const isDay7=(streak+1)%7===0;
  const qty=isDay7?2:1; // Double on day 7

  // Add to backpack
  if(!G.backpack)G.backpack={};
  G.backpack[reward.id]=(G.backpack[reward.id]||0)+qty;

  // Update streak
  G.dailyStreak=streak+1;
  G.lastDailyClaim=Date.now();

  // Remove popup
  const popup=document.getElementById('daily-popup');
  if(popup)popup.remove();

  toast(`${reward.e} ${reward.n}${qty>1?' ×'+qty:''} added to Backpack!`,'gold');
  addLog(`🎁 Daily Reward Day ${streak+1}: ${reward.n}${qty>1?' ×'+qty:''}!`,'sp');
  save();
}

// ══════════════════════════════════════════
// BACKPACK — USE CONSUMABLE ITEMS
// ══════════════════════════════════════════
function useBackpackItem(id){
  if(!G.backpack||!G.backpack[id]||G.backpack[id]<=0){toast('None left!','r');return;}
  G.backpack[id]--;
  if(G.backpack[id]<=0)delete G.backpack[id];

  switch(id){
    case 'dr_energy':
      G.energy=G.maxEnergy;
      toast('⚡ Energy fully restored!','g');
      addLog('⚡ Used Energy Refill — full energy!','gold');
      break;
    case 'dr_stamina':
      G.stamina=G.maxStamina;
      toast('💪 Stamina fully restored!','g');
      addLog('💪 Used Stamina Refill — full stamina!','gold');
      break;
    case 'dr_heal':
      G.health=G.maxHealth;
      toast('❤️ Fully healed!','g');
      addLog('❤️ Used Full Heal — max HP!','gold');
      break;
    case 'dr_cash':
      const cashAmt=10000;
      G.cash+=cashAmt;G.totalEarned+=cashAmt;
      toast('💰 +$'+fmtCash(cashAmt)+'!','gold');
      addLog('💰 Used Cash Drop — +$'+fmtCash(cashAmt),'gold');
      break;
    case 'dr_mafia':
      G.mafiaSize+=3;
      toast('👥 +3 mafia members!','g');
      addLog('👥 Used Mafia Recruits — +3 members!','gold');
      break;
    case 'dr_heat_clear':
      G.heat=0;
      toast('🧊 All heat cleared!','g');
      addLog('🧊 Used Heat Cleanse — heat at 0%!','gold');
      break;
    case 'dr_xp_boost':
      gainXP(500);
      toast('🌟 +500 XP!','gold');
      addLog('🌟 Used XP Boost — +500 XP!','gold');
      break;
    case 'dr_loot_crate':
      const keys=Object.keys(LOOT);
      const rndLoot=keys[Math.floor(Math.random()*keys.length)];
      addLoot(rndLoot);
      addLog('🎁 Opened Loot Crate!','sp');
      break;
    case 'dr_skill_point':
      G.skillPoints++;
      toast('🧠 +1 Skill Point!','gold');
      addLog('🧠 Used Bonus Skill Point!','gold');
      break;
    case 'dr_notoriety':
      addNotoriety(50);
      toast('☠️ +50 Notoriety!','gold');
      addLog('☠️ Used Street Cred — +50 Notoriety!','gold');
      break;
    default:
      toast('Unknown item!','r');
      return;
  }
  updateAll();save();
  // Refresh backpack panel if open
  if(G.currentPanel==='backpack')buildBackpack(document.getElementById('center'));
}

// ══════════════════════════════════════════
// INVENTORY COMBAT STATS
// ══════════════════════════════════════════
function calcInventoryStats(){
  let atk=0,def=0;
  if(!G.inventory)return{atk:0,def:0};
  const allItems=[...G.inventory.weapons,...G.inventory.armor,...G.inventory.vehicles,...G.inventory.specials];
  // Use BEST weapon + BEST armor + BEST vehicle (not all stacked)
  let bestWepATK=0,bestArmDEF=0,bestVehATK=0,bestVehDEF=0;
  for(const id of G.inventory.weapons){
    const it=LOOT[id]||STORE.find(x=>x.id===id);
    if(it&&it.atk>bestWepATK)bestWepATK=it.atk;
  }
  for(const id of G.inventory.armor){
    const it=LOOT[id]||STORE.find(x=>x.id===id);
    if(it&&it.def>bestArmDEF)bestArmDEF=it.def;
  }
  for(const id of G.inventory.vehicles){
    const it=LOOT[id]||STORE.find(x=>x.id===id);
    if(it){
      if(it.atk>bestVehATK)bestVehATK=it.atk;
      if(it.def>bestVehDEF)bestVehDEF=it.def;
    }
  }
  // Also count weapon DEF and armor ATK
  for(const id of G.inventory.weapons){
    const it=LOOT[id]||STORE.find(x=>x.id===id);
    if(it&&it.def)def+=Math.floor(it.def*0.3); // minor DEF from weapons
  }
  for(const id of G.inventory.armor){
    const it=LOOT[id]||STORE.find(x=>x.id===id);
    if(it&&it.atk)atk+=Math.floor(it.atk*0.3); // minor ATK from armor
  }
  atk+=bestWepATK+bestVehATK;
  def+=bestArmDEF+bestVehDEF;
  return{atk,def};
}

// ══════════════════════════════════════════
// LOOT SOURCE FINDER
// ══════════════════════════════════════════
function findLootSource(lootId){
  // Check jobs
  for(const[cityId,tiers] of Object.entries(JOBS)){
    for(const tier of tiers){
      for(const j of tier.jobs){
        if(j.li===lootId){
          const city=CITIES[cityId];
          return city?city.emoji+' '+j.n+' ('+city.name+')':'Job: '+j.n;
        }
      }
    }
  }
  // Check enemies
  for(const e of ENEMIES){
    if(e.loot===lootId)return '⚔️ Fight: '+e.n;
  }
  // Check store
  for(const s of STORE){
    if(s.id===lootId)return '🔧 Armory: $'+fmtCash(s.c);
  }
  return 'Various drops';
}

// ══════════════════════════════════════════
// KNOCKOUT SYSTEM
// ══════════════════════════════════════════
function checkKnockout(){
  try{
    if(G.health>0) return;
    var loss=Math.floor(G.cash*0.10);
    G.cash=Math.max(0,G.cash-loss);
    G.heat=Math.min(100,(G.heat||0)+15);
    G.health=Math.max(25,Math.floor(G.maxHealth*0.25));
    var old=document.getElementById("ko-overlay");
    if(old)old.remove();
    var d=document.createElement("div");
    d.id="ko-overlay";
    d.style.cssText="position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.95);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px";
    var h="<div style=\"font-family:Bebas Neue,sans-serif;font-size:48px;color:#F44336;letter-spacing:.2em\">☠️ KNOCKED OUT</div>";
    h+="<div style=\"font-family:Special Elite,serif;font-size:14px;color:#888;max-width:300px;text-align:center\">You were left for dead. A back-room doctor patched you up.</div>";
    h+="<div style=\"font-family:Cutive Mono,monospace;font-size:12px;color:#F44336;margin-top:10px\">Lost $"+fmtCash(loss)+" to hospital bills</div>";
    h+="<div style=\"font-family:Cutive Mono,monospace;font-size:12px;color:#FF9800\">Heat +15%</div>";
    h+="<div style=\"font-family:Cutive Mono,monospace;font-size:12px;color:#4CAF50\">Recovered to "+G.health+" HP</div>";
    h+="<button id=\"ko-btn\" style=\"margin-top:20px;background:linear-gradient(90deg,#8B0000,#5d0000);border:2px solid #F44336;color:#FFD700;font-family:Bebas Neue,sans-serif;font-size:20px;letter-spacing:.15em;padding:12px 40px;cursor:pointer\">GET BACK UP</button>";
    d.innerHTML=h;
    document.body.appendChild(d);
    document.getElementById("ko-btn").onclick=function(){document.getElementById("ko-overlay").remove();};
    addLog("☠️ KNOCKED OUT! Lost $"+fmtCash(loss)+". Heat +15%.","bad");
    toast("☠️ KNOCKED OUT!","r");
    try{updateAll();}catch(e2){}
    save();
  }catch(err){console.error("KO error:",err);}
}
