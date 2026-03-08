// ═══════════════════════════════════════════
// MAFIA WARS UNDERGROUND — UI PANELS
// ═══════════════════════════════════════════


// ══════════════════════════════════════════
// INIT
// ══════════════════════════════════════════
let selClass='Fearless', selBG='Streets';



// ══════════════════════════════════════════
// CITY LIST
// ══════════════════════════════════════════
function buildCityList(){
  const el=document.getElementById('city-list');
  el.innerHTML='';
  if(!G.cityMastered)G.cityMastered={};
  for(const[id,c]of Object.entries(CITIES)){
    const locked=G.level<c.unlock&&G.prestige===0;
    const conquered=G.cityMastered[id];
    const b=document.createElement('button');
    b.className='cb'+(locked?' locked':'')+(id===G.currentCity?' active':'');
    b.innerHTML=`${conquered?'👑':c.emoji} ${c.name}${conquered?' ★':''}<span class="cl">${conquered?'DONE':'Lv'+c.unlock}</span>`;
    if(conquered)b.style.borderLeftColor='#DAA520';
    if(!locked)b.onclick=()=>{G.currentCity=id;buildCityList();showPanel('jobs');};
    el.appendChild(b);
  }
}

// ══════════════════════════════════════════
// PANEL ROUTER
// ══════════════════════════════════════════
function showPanel(p){
  G.currentPanel=p;
  document.querySelectorAll('.nb').forEach(b=>b.classList.remove('active'));
  const n=document.getElementById('nav-'+p);
  if(n)n.classList.add('active');
  const c=document.getElementById('center');
  c.innerHTML='';
  const map={
    jobs:buildJobs, fight:buildFight, hitlist:buildHitlist, rob:buildRob,
    gangwar:buildGangWar, bosses:buildBosses, savemgr:buildSaveMgr, crew:buildCrew, hitman:buildHitman, events:buildEvents, notoriety:buildNotoriety, drugtrade:buildDrugTrade, achievements:buildAchievements, properties:buildProperties, store:buildStore, luxury:buildLuxury,
    blackmarket:buildBlackMarket, crafting:buildCrafting, inventory:buildInventory,
    racing:buildRacing, darkweb:buildDarkWeb, underworld:buildUnderworld,
    skilltree:buildSkillTree, casino:buildCasino, prestige:buildPrestige,
    missions:buildMissions, operations:buildOperations, contracts:buildContracts,
    backpack:buildBackpack,
  };
  if(map[p])map[p](c);
}

// ══════════════════════════════════════════
// JOBS PANEL
// ══════════════════════════════════════════
function buildJobs(c){
  const city=CITIES[G.currentCity];
  const cityJobs=JOBS[G.currentCity]||[];
  let cashMult=1+getSkillBonus('cashMult');
  if(G.playerClass==='Mogul')cashMult*=1.15;
  cashMult*=G.pBonuses.cashMult;
  // City mastery progress
  let allJobIds=[];
  cityJobs.forEach(tier=>{if(tier.jobs)tier.jobs.forEach(jj=>allJobIds.push(jj.id));});
  const masteredCount=allJobIds.filter(jid=>(G.jobMastery[jid]||0)>=30).length;
  const totalJobs=allJobIds.length;
  const cityConquered=G.cityMastered&&G.cityMastered[G.currentCity];
  // Tier level requirements: each tier within a city requires progressively higher levels
  const cityUnlock=city.unlock||1;
  const tierLevelReqs=cityJobs.map((_,i)=>Math.floor(cityUnlock+i*Math.max(5,cityUnlock*0.25)));
  let html=`<div class="panel"><div class="ph"><h2>${city.emoji} ${city.name} — JOBS${cityConquered?' 👑':''}</h2><span class="psub">Energy: ${G.energy}/${G.maxEnergy} | Jobs Done: ${G.jobsDone} | Mastered: ${masteredCount}/${totalJobs}${cityConquered?' — CONQUERED':''}  | <span class="xp-mult">XP ×${(G.xpMult*G.pBonuses.xpMult).toFixed(2)}</span></span></div><div class="pb">`;
  for(let ti=0;ti<cityJobs.length;ti++){
    const tier=cityJobs[ti];
    const tierLvReq=tierLevelReqs[ti];
    const tierLocked=G.level<tierLvReq;
    html+=`<div class="tier-hdr">▸ ${tier.tier}${tierLocked?' <span style="color:var(--crimson);font-size:10px">🔒 Level '+tierLvReq+'</span>':''}</div>`;
    for(const j of tier.jobs){
      const needsReq=j.req&&!hasLoot(j.req);
      const reqItem=j.req?getItem(j.req):null;
      const dis=G.energy<j.e||tierLocked||needsReq;
      const mas=G.jobMastery[j.id]||0;
      const mTier=mas>=30?3:mas>=20?2:mas>=10?1:0;
      const tStart=[0,0,10,20][mTier];
      const tMax=10;
      const tProg=Math.min(10,mas-tStart);
      const mp=(tProg/tMax)*100;
      const mastered=mas>=30;
      const adjCash=Math.floor(j.c*cashMult*(1+(mTier*.15)));
      const tClass=mTier===3?'t3':mTier===2?'t2':'t1';
      const tBadge=mastered?'<span class="mastered-badge">MASTERED</span>':mTier===2?'<span style="font-size:9px;color:#E0E0E0;margin-left:5px">SILVER</span>':mTier===1?'<span style="font-size:9px;color:#CD7F32;margin-left:5px">BRONZE</span>':'' ;
      const tLabel=mastered?'Fully Mastered ★':mTier===2?'Gold: '+tProg+'/10':mTier===1?'Silver: '+tProg+'/10':'Bronze: '+tProg+'/10';
      html+=`<div class="jcard ${dis?'jdis':''} ${mastered?'jmas':''}" id="jc-${j.id}" ${tierLocked?'style="opacity:.4"':''}>
        <div>
          <div class="jn">${mastered?'★ ':''} ${j.n} ${tBadge}</div>
          <div class="jd">${j.d}</div>
          <div class="jreq">⚡ ${j.e} energy${j.li?` &nbsp;🎁 Loot: ${getItem(j.li).e}${(j.lc*100+G.lootBonus).toFixed(0)}%`:''}${tierLocked?' &nbsp;🔒 Lv'+tierLvReq:''}${j.req?(needsReq?' &nbsp;<span style="color:#F44336">❌ Need '+reqItem.e+' '+reqItem.n+' <span style="font-size:8px;color:var(--text-dim)">('+findLootSource(j.req)+')</span></span>':' &nbsp;<span style="color:#4CAF50">✅ '+reqItem.e+'</span>'):''}</div>
          <div class="mbar"><div class="mfill ${tClass}" id="mf-${j.id}" style="width:${mp}%"></div></div>
          <div style="font-size:9px;color:var(--text-dim);font-family:'Cutive Mono',monospace;margin-top:2px" id="ml-${j.id}">${tLabel}</div>
        </div>
        <div class="jr">
          <span class="jrv">$${adjCash.toLocaleString()}</span>
          <span class="jrx">${j.x} XP</span>
          ${j.li?`<span class="jrl">🎁 ${getItem(j.li).e} ${(j.lc*100+G.lootBonus).toFixed(0)}%</span>`:''}
        </div>
        <button class="djb" onclick="doJob('${j.id}')" ${dis?'disabled':''}>DO JOB</button>
      </div>`;
    }
  }
  html+=`</div></div>`;
  c.innerHTML=html;
}

function findJob(id){
  for(const[,tiers]of Object.entries(JOBS))for(const t of tiers)for(const j of t.jobs)if(j.id===id)return j;
  return null;
}

function doJob(id){
  const j=findJob(id);
  if(!j)return;
  // Check tier level lock
  const cityJobs=JOBS[G.currentCity]||[];
  const city=CITIES[G.currentCity];
  const cityUnlock=city.unlock||1;
  for(let ti=0;ti<cityJobs.length;ti++){
    if(cityJobs[ti].jobs.some(jj=>jj.id===id)){
      const tierLvReq=Math.floor(cityUnlock+ti*Math.max(5,cityUnlock*0.25));
      if(G.level<tierLvReq){toast('Need Level '+tierLvReq+'!','r');return;}
      break;
    }
  }
  if(G.energy<j.e){toast('Not enough energy!','r');return;}
  // Check loot requirement
  if(j.req&&!hasLoot(j.req)){
    const reqItem=getItem(j.req);
    toast('Need '+reqItem.e+' '+reqItem.n+'! ('+findLootSource(j.req)+')','r');return;
  }
  G.energy-=j.e;
  let cashMult=1+getSkillBonus('cashMult');
  if(G.playerClass==='Mogul')cashMult*=1.15;
  cashMult*=G.pBonuses.cashMult;
  const cash=Math.floor((j.c+Math.floor(Math.random()*j.c*.2))*cashMult*getEventMult('cashMult',1)*getNotorietyMult('cash'));
  G.cash+=cash;G.totalEarned+=cash;
  const xp=Math.round(j.x*G.xpMult*G.pBonuses.xpMult*getEventMult('xpMult',1)*getNotorietyMult('xp'));
  gainXP(xp);
  G.jobsDone++;
  const prevMas=G.jobMastery[j.id]||0;
  G.jobMastery[j.id]=Math.min(30,prevMas+1);
  const newMas=G.jobMastery[j.id];
  // Update mastery bar live without panel rebuild
  const nTier=newMas>=30?3:newMas>=20?2:newMas>=10?1:0;
  const nTStart=[0,0,10,20][nTier];
  const nTProg=Math.min(10,newMas-nTStart);
  const nMp=(nTProg/10)*100;
  const mfEl=document.getElementById('mf-'+id);
  const mlEl=document.getElementById('ml-'+id);
  const jcEl=document.getElementById('jc-'+id);
  if(mfEl){
    mfEl.style.width=nMp+'%';
    mfEl.className='mfill '+(nTier===3?'t3':nTier===2?'t2':'t1');
  }
  if(mlEl){
    if(newMas>=30)mlEl.textContent='Fully Mastered ★';
    else if(nTier===2)mlEl.textContent='Gold: '+nTProg+'/10';
    else if(nTier===1)mlEl.textContent='Silver: '+nTProg+'/10';
    else mlEl.textContent='Bronze: '+nTProg+'/10';
  }
  if(jcEl&&newMas>=30)jcEl.classList.add('jmas');
  // Tier completion toasts
  if(newMas===10&&prevMas===9){toast('🥉 '+j.n+' — Bronze Mastered! +15% cash','g');addLog('🥉 Bronze mastered: '+j.n,'gold');}
  if(newMas===20&&prevMas===19){toast('🥈 '+j.n+' — Silver Mastered! +30% cash','g');addLog('🥈 Silver mastered: '+j.n,'gold');}
  if(newMas===30&&prevMas===29){toast('★ '+j.n+' — FULLY MASTERED!','g');addLog('★ MASTERED: '+j.n,'sp');}

  // Check city completion — all jobs in this city mastered?
  if(newMas===30){
    const cityJobs=JOBS[G.currentCity]||[];
    let allJobIds=[];
    cityJobs.forEach(tier=>{if(tier.jobs)tier.jobs.forEach(jj=>allJobIds.push(jj.id));});
    const allMastered=allJobIds.every(jid=>(G.jobMastery[jid]||0)>=30);
    if(allMastered&&!G.cityMastered[G.currentCity]){
      G.cityMastered[G.currentCity]=true;
      const city=CITIES[G.currentCity];
      const tierRewards={1:50000,2:250000,3:1000000,4:5000000,5:25000000};
      const xpRewards={1:500,2:2000,3:8000,4:30000,5:100000};
      const cashReward=Math.floor((tierRewards[city.tier]||50000)*(G.cashMult||1));
      const xpReward=xpRewards[city.tier]||500;
      G.cash+=cashReward;G.totalEarned+=cashReward;
      gainXP(xpReward);
      G.respect=(G.respect||0)+Math.floor(xpReward/2);
      addNotoriety(Math.floor(cashReward/50000)+5);
      toast(`👑 ${city.emoji} ${city.name} CONQUERED! +$${fmtCash(cashReward)} +${xpReward}XP`,'gold');
      addLog(`👑 CITY MASTERED: ${city.name}! All jobs fully mastered! +$${fmtCash(cashReward)} +${xpReward}XP`,'sp');
      buildCityList();
    }
  }

  addLog(`✓ ${j.n} — $${cash.toLocaleString()} +${xp}XP`,'good');
  // Loot
  const lc=j.lc+(G.lootBonus/100)+(getSkillBonus('loot')/100);
  if(j.li&&Math.random()<lc*getEventMult('lootMult',1)){addLoot(j.li);}
  // Random loot 2% chance
  if(Math.random()<.02){const keys=Object.keys(LOOT);addLoot(keys[Math.floor(Math.random()*keys.length)]);}
  // Crit cash
  if(Math.random()<G.critChance/100){
    const bonus=Math.floor(cash*.5);G.cash+=bonus;G.totalEarned+=bonus;
    addLog(`💥 CRITICAL JOB! Bonus $${bonus.toLocaleString()}`,'gold');
  }
  addHeat(1);
  updateAll();checkMissions();save();
  const el=document.getElementById('jc-'+id);
  if(el)el.classList.add('flash-win');
}

// ══════════════════════════════════════════
// FIGHT PANEL
// ══════════════════════════════════════════
const ENEMY_TIERS=['Street Thugs','Made Men','Bosses & Capos','International','Legendary','Mythic'];
const ENEMIES = [
  // ── STREET THUGS ──
  {n:'Danny the Rat',rank:'Street Thug',atk:6,def:4,ml:1,r:50,xr:3,kc:.08,tier:0,loot:null},
  {n:'Skinny Pete',rank:'Pickpocket',atk:4,def:3,ml:1,r:50,xr:3,kc:.06,tier:0,loot:null},
  {n:'Alley Cat Jones',rank:'Mugger',atk:8,def:5,ml:1,r:50,xr:3,kc:.09,tier:0,loot:'brass_knuckles'},
  {n:'Knuckles McGee',rank:'Corner Bookie',atk:10,def:7,ml:2,r:66,xr:3,kc:.10,tier:0,loot:'brass_knuckles'},
  {n:'Dumpster Dave',rank:'Fence',atk:12,def:8,ml:3,r:83,xr:4,kc:.10,tier:0,loot:'fake_rolex'},
  {n:'Frankie Two Shoes',rank:'Numbers Runner',atk:14,def:10,ml:4,r:100,xr:4,kc:.12,tier:0,loot:null},
  {n:'Big Sal Romano',rank:'Enforcer',atk:20,def:15,ml:7,r:150,xr:6,kc:.14,tier:0,loot:'switchblade'},
  {n:'Tommy the Torch',rank:'Arsonist',atk:16,def:8,ml:5,r:116,xr:5,kc:.11,tier:0,loot:'dynamite'},
  {n:'Needles Moretti',rank:'Loan Shark',atk:24,def:18,ml:9,r:183,xr:7,kc:.13,tier:0,loot:'gold_chain'},
  {n:'Vinnie the Knife',rank:'Soldier',atk:28,def:22,ml:10,r:200,xr:8,kc:.15,tier:0,loot:'switchblade'},
  // ── MADE MEN ──
  {n:'Marco the Butcher',rank:'Capo',atk:40,def:32,ml:15,r:266,xr:13,kc:.17,tier:1,loot:'pistol'},
  {n:'Don Eduardo Santini',rank:'Underboss',atk:55,def:44,ml:20,r:325,xr:15,kc:.18,tier:1,loot:'gold_watch'},
  {n:'The Sicilian',rank:'Consigliere',atk:75,def:60,ml:28,r:418,xr:17,kc:.19,tier:1,loot:'silenced_pistol'},
  {n:'Ghost',rank:'Assassin',atk:95,def:78,ml:35,r:500,xr:20,kc:.20,tier:1,loot:'assassination_kit'},
  {n:'Lucky Lucchese',rank:'Family Boss',atk:68,def:55,ml:25,r:383,xr:16,kc:.18,tier:1,loot:'don_ring'},
  {n:'Crazy Eyes Colombo',rank:'Hitman',atk:85,def:65,ml:30,r:441,xr:18,kc:.19,tier:1,loot:'desert_eagle'},
  // ── BOSSES & CAPOS ──
  {n:'Viktor Solokov',rank:'Bratva Commander',atk:120,def:100,ml:45,r:907,xr:32,kc:.21,tier:2,loot:'ak47'},
  {n:'Chen Wei',rank:'Triad Master',atk:150,def:125,ml:55,r:1076,xr:35,kc:.22,tier:2,loot:'jade_dragon'},
  {n:'El Señor',rank:'Cartel Kingpin',atk:190,def:160,ml:65,r:1246,xr:39,kc:.23,tier:2,loot:'cartel_pistol'},
  {n:'Black Sun Yoshida',rank:'Yakuza Oyabun',atk:240,def:200,ml:80,r:1500,xr:45,kc:.24,tier:2,loot:'katana'},
  {n:'Natasha Volkov',rank:'Red Mafiya Queen',atk:180,def:150,ml:60,r:1161,xr:37,kc:.22,tier:2,loot:'polonium_vial'},
  {n:'Ibrahim Al-Rashid',rank:'Gulf Warlord',atk:210,def:175,ml:70,r:1330,xr:41,kc:.23,tier:2,loot:'gold_bar'},
  // ── INTERNATIONAL ──
  {n:'The Architect',rank:'Shadow Broker',atk:300,def:255,ml:100,r:3794,xr:61,kc:.25,tier:3,loot:'hacking_rig'},
  {n:'Cardinal Leone',rank:'Vatican Insider',atk:370,def:315,ml:125,r:4750,xr:70,kc:.26,tier:3,loot:'papal_signet'},
  {n:'Iron Duke Morozov',rank:'Russian Oligarch',atk:460,def:395,ml:150,r:5705,xr:78,kc:.27,tier:3,loot:'vor_crown'},
  {n:'The Dragon Lady',rank:'Asian Syndicate Chief',atk:570,def:490,ml:180,r:6852,xr:89,kc:.27,tier:3,loot:'dragon_seal'},
  {n:'Phantom',rank:'International Assassin',atk:700,def:605,ml:210,r:8000,xr:100,kc:.28,tier:3,loot:'sniper_rifle'},
  {n:'Baron von Krieg',rank:'Arms Dealer Lord',atk:520,def:440,ml:165,r:6279,xr:84,kc:.26,tier:3,loot:'kalashnikov'},
  // ── LEGENDARY ──
  {n:'Lazarus Vane',rank:'Dark Network Controller',atk:880,def:760,ml:250,r:14042,xr:120,kc:.28,tier:4,loot:'crypto_wallet'},
  {n:'The Eternal Don',rank:'Immortal Crime Lord',atk:1100,def:955,ml:300,r:16702,xr:133,kc:.29,tier:4,loot:'world_don_crown'},
  {n:'Shadow Emperor Kai',rank:'World Syndicate Boss',atk:1400,def:1210,ml:375,r:20691,xr:153,kc:.30,tier:4,loot:'samurai_sword'},
  {n:'The Devil',rank:'Primordial Evil',atk:1800,def:1560,ml:450,r:24680,xr:173,kc:.30,tier:4,loot:'golden_ak'},
  {n:'Omega Prime',rank:'Final Adversary',atk:2300,def:1990,ml:550,r:30000,xr:200,kc:.31,tier:4,loot:null},
  // ── MYTHIC ──
  {n:'God of Crime',rank:'Transcendent',atk:3000,def:2600,ml:700,r:58461,xr:334,kc:.32,tier:5,loot:null},
  {n:'The Last Enemy',rank:'End of Days',atk:5000,def:4300,ml:900,r:73846,xr:388,kc:.33,tier:5,loot:null},
  {n:'Il Diavolo',rank:'Hell\'s Don',atk:8000,def:7000,ml:1100,r:89230,xr:442,kc:.35,tier:5,loot:null},
  {n:'The Absolute',rank:'Beyond Mortal',atk:15000,def:13000,ml:1300,r:104615,xr:496,kc:.38,tier:5,loot:null},
  {n:'Maximum Don',rank:'Level 1500 Challenge',atk:25000,def:22000,ml:1480,r:118461,xr:544,kc:.40,tier:5,loot:null},
  {n:'Bag Snatcher',rank:'Petty Thief',atk:5,def:3,ml:1,r:50,xr:3,kc:.06,tier:0,loot:'stolen_wallet'},
  {n:'Graffiti Punk',rank:'Vandal',atk:7,def:4,ml:1,r:50,xr:3,kc:.05,tier:0,loot:'ski_mask'},
  {n:'Crack Dealer',rank:'Corner Boy',atk:9,def:6,ml:2,r:66,xr:3,kc:.08,tier:0,loot:'burner_phone'},
  {n:'Pawnshop Robber',rank:'Small Timer',atk:7,def:5,ml:1,r:50,xr:3,kc:.07,tier:0,loot:'lockpick_set'},
  {n:'Bar Room Brawler',rank:'Drunk',atk:10,def:7,ml:2,r:66,xr:3,kc:.07,tier:0,loot:'brass_pipe'},
  {n:'Car Radio Thief',rank:'Tweaker',atk:6,def:3,ml:1,r:50,xr:3,kc:.05,tier:0,loot:'tire_iron'},
  {n:'Switchblade Sal',rank:'Street Enforcer',atk:18,def:12,ml:5,r:150,xr:10,kc:.10,tier:1,loot:'switchblade'},
  {n:'Baseball Bat Mike',rank:'Leg Breaker',atk:22,def:14,ml:6,r:161,xr:10,kc:.10,tier:1,loot:'baseball_bat'},
  {n:'Lookout Larry',rank:'Spotter',atk:15,def:10,ml:5,r:150,xr:10,kc:.08,tier:1,loot:'police_scanner'},
  {n:'Repo Rick',rank:'Debt Collector',atk:25,def:18,ml:8,r:185,xr:11,kc:.11,tier:1,loot:'tire_iron'},
  {n:'Jimmy Locks',rank:'B&E Specialist',atk:20,def:15,ml:7,r:173,xr:10,kc:.09,tier:1,loot:'lockpick_set'},
  {n:'Razor Rodriguez',rank:'Gang Lieutenant',atk:28,def:20,ml:10,r:208,xr:11,kc:.12,tier:1,loot:'combat_knife'},
  {n:'Stonewall Jackson',rank:'Bouncer',atk:30,def:25,ml:12,r:231,xr:12,kc:.11,tier:1,loot:'kevlar_gloves'},
  {n:'Dirty Danny',rank:'Corrupt Cop',atk:24,def:22,ml:10,r:208,xr:11,kc:.10,tier:1,loot:'fbi_badge'},
  {n:'Frankie Four Fingers',rank:'Made Man',atk:55,def:40,ml:15,r:400,xr:21,kc:.13,tier:2,loot:'silenced_pistol'},
  {n:'The Accountant',rank:'Money Man',atk:40,def:35,ml:15,r:400,xr:21,kc:.10,tier:2,loot:'briefcase_of_cash'},
  {n:'Iron Mike',rank:'Enforcer',atk:65,def:50,ml:20,r:484,xr:22,kc:.14,tier:2,loot:'body_armor'},
  {n:'Scar Hernandez',rank:'Cartel Soldier',atk:70,def:45,ml:22,r:518,xr:23,kc:.14,tier:2,loot:'cartel_pistol'},
  {n:'Ghost Face',rank:'Hitman',atk:75,def:55,ml:25,r:569,xr:24,kc:.16,tier:2,loot:'night_vision'},
  {n:'Boris the Bear',rank:'Russian Muscle',atk:80,def:60,ml:28,r:620,xr:25,kc:.15,tier:2,loot:'ak47'},
  {n:'Diamond Dave',rank:'Jewel Thief',atk:50,def:38,ml:18,r:450,xr:22,kc:.12,tier:2,loot:'diamond_ring'},
  {n:'The Professor',rank:'Con Artist',atk:45,def:42,ml:20,r:484,xr:22,kc:.09,tier:2,loot:'forged_passport'},
  {n:'Machete Maria',rank:'Enforcer',atk:68,def:48,ml:24,r:552,xr:24,kc:.15,tier:2,loot:'jungle_machete'},
  {n:'Nails Nelson',rank:'Torturer',atk:72,def:52,ml:26,r:586,xr:25,kc:.16,tier:2,loot:'combat_knife'},
  {n:'Don Valentino',rank:'Family Boss',atk:150,def:120,ml:40,r:1500,xr:40,kc:.18,tier:3,loot:'don_ring'},
  {n:'The Surgeon',rank:'Professional',atk:180,def:140,ml:50,r:1882,xr:43,kc:.20,tier:3,loot:'assassination_kit'},
  {n:'General Sato',rank:'Yakuza Lord',atk:200,def:160,ml:55,r:2073,xr:45,kc:.20,tier:3,loot:'katana'},
  {n:'El Diablo',rank:'Cartel King',atk:220,def:170,ml:60,r:2264,xr:47,kc:.22,tier:3,loot:'drug_lord_crown'},
  {n:'The Duchess',rank:'Crime Baroness',atk:170,def:150,ml:45,r:1691,xr:41,kc:.18,tier:3,loot:'offshore_account'},
  {n:'Viktor Volkov',rank:'Bratva Boss',atk:190,def:155,ml:52,r:1958,xr:44,kc:.19,tier:3,loot:'gold_bar'},
  {n:'The Butcher',rank:'Psychopath',atk:240,def:130,ml:65,r:2455,xr:48,kc:.25,tier:3,loot:'grenade'},
  {n:'Phantom',rank:'Ghost Operative',atk:210,def:180,ml:58,r:2188,xr:46,kc:.21,tier:3,loot:'ghost_protocol'},
  {n:'Lady Venom',rank:'Poison Expert',atk:160,def:140,ml:42,r:1576,xr:40,kc:.17,tier:3,loot:'polonium_vial'},
  {n:'The Immortal',rank:'Undying Legend',atk:500,def:400,ml:80,r:5000,xr:75,kc:.22,tier:4,loot:'titanium_vest'},
  {n:'Black Dragon',rank:'Triad Supreme',atk:600,def:450,ml:100,r:6063,xr:80,kc:.23,tier:4,loot:'dragon_seal'},
  {n:'The President',rank:'Shadow Ruler',atk:700,def:550,ml:120,r:7127,xr:85,kc:.24,tier:4,loot:'military_intel'},
  {n:'Omega Red',rank:'Super Soldier',atk:800,def:600,ml:150,r:8723,xr:93,kc:.25,tier:4,loot:'nano_suit'},
  {n:'The Cardinal',rank:'Vatican Shadow',atk:550,def:500,ml:90,r:5531,xr:77,kc:.22,tier:4,loot:'papal_signet'},
  {n:'Ghost Emperor',rank:'The Unseen',atk:650,def:520,ml:110,r:6595,xr:82,kc:.23,tier:4,loot:'ghost_protocol'},
  {n:'Warlord Kahn',rank:'Conqueror',atk:750,def:580,ml:140,r:8191,xr:90,kc:.25,tier:4,loot:'rpg_launcher'},
  {n:'The Architect of War',rank:'World Shaper',atk:1200,def:1000,ml:200,r:20000,xr:200,kc:.27,tier:5,loot:'missile_codes'},
  {n:'The Shadowlord',rank:'Darkness Incarnate',atk:1500,def:1200,ml:250,r:23846,xr:213,kc:.28,tier:5,loot:'quantum_key'},
  {n:'Eternal One',rank:'Beyond Death',atk:2000,def:1600,ml:300,r:27692,xr:226,kc:.30,tier:5,loot:'crown_jewel'}
];

function buildFight(c){
  const avail=ENEMIES.filter(e=>G.level>=e.ml);
  const etColors=['var(--text-dim)','var(--bright-blue)','var(--bright-orange)','var(--bright-purple)','var(--bright-gold)','#ff1744'];
  if(!G.fightStreak)G.fightStreak=0;
  if(!G.fightBestStreak)G.fightBestStreak=0;

  let html=`<div class="panel"><div class="ph"><h2>⚔️ FIGHT</h2><span class="psub">${avail.length}/${ENEMIES.length} opponents unlocked</span></div><div class="pb">`;

  // Dashboard
  html+=`<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin-bottom:10px;">
    <div style="background:var(--surface2);border:1px solid var(--border);padding:6px;text-align:center"><div style="font-family:'Bebas Neue',sans-serif;font-size:16px;color:var(--bright-green)">${G.fightsWon}</div><div style="font-size:8px;color:var(--text-dim);font-family:'Cutive Mono',monospace">WINS</div></div>
    <div style="background:var(--surface2);border:1px solid var(--border);padding:6px;text-align:center"><div style="font-family:'Bebas Neue',sans-serif;font-size:16px;color:var(--crimson)">${G.fightsLost}</div><div style="font-size:8px;color:var(--text-dim);font-family:'Cutive Mono',monospace">LOSSES</div></div>
    <div style="background:var(--surface2);border:1px solid var(--border);padding:6px;text-align:center"><div style="font-family:'Bebas Neue',sans-serif;font-size:16px;color:var(--bright-orange)">${G.fightStreak}🔥</div><div style="font-size:8px;color:var(--text-dim);font-family:'Cutive Mono',monospace">STREAK</div></div>
    <div style="background:var(--surface2);border:1px solid var(--border);padding:6px;text-align:center"><div style="font-family:'Bebas Neue',sans-serif;font-size:16px;color:var(--bright-gold)">⚔️${G.attack} 🛡️${G.defense}</div><div style="font-size:8px;color:var(--text-dim);font-family:'Cutive Mono',monospace">YOUR STATS</div></div>
    <div style="background:var(--surface2);border:1px solid var(--border);padding:6px;text-align:center"><div style="font-family:'Bebas Neue',sans-serif;font-size:16px;color:var(--bright-blue)">${G.stamina}/${G.maxStamina}</div><div style="font-size:8px;color:var(--text-dim);font-family:'Cutive Mono',monospace">STAMINA</div></div>
  </div>`;
  if(G.fightStreak>=5)html+=`<div style="background:linear-gradient(90deg,rgba(255,100,0,.1),transparent);border-left:3px solid var(--bright-orange);padding:6px 10px;margin-bottom:10px;font-family:'Cutive Mono',monospace;font-size:10px;color:var(--bright-orange);">🔥 WIN STREAK ×${G.fightStreak} — Cash bonus +${G.fightStreak*3}%! (Best: ${G.fightBestStreak})</div>`;

  html+=`<div id="fr-area"></div>`;

  // Group by tier
  for(let ti=0;ti<=5;ti++){
    const tierEnemies=avail.filter(e=>e.tier===ti);
    if(!tierEnemies.length)continue;
    html+=`<div style="font-family:'Bebas Neue',sans-serif;font-size:12px;letter-spacing:.12em;color:${etColors[ti]};margin:10px 0 5px;border-bottom:1px solid var(--border);padding-bottom:3px">▸ ${ENEMY_TIERS[ti]}</div>`;
    html+=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">`;
    for(const e of tierEnemies){
      html+=`<div class="ecard" style="border-left:3px solid ${etColors[e.tier]};">
        <div class="en">${e.n}</div>
        <div class="er">${e.rank}</div>
        <div class="estats">⚔️${e.atk} 🛡️${e.def} 💰$${fmtCash(e.r)} +${e.xr}XP${e.loot?' 🎁':''}</div>
        <button class="fb" onclick="doFight('${e.n.replace(/'/g,"\\'")}')">⚔️ ATTACK (${[1,2,3,4,5,7][e.tier]||1} 💪)</button>
      </div>`;
    }
    html+=`</div>`;
  }
  if(!avail.length)html+=`<p style="color:var(--text-dim);font-family:'Special Elite',serif;">No enemies unlocked yet. Level up to face opponents.</p>`;
  html+=`</div></div>`;
  c.innerHTML=html;
}

function doFight(ename){
  const e=ENEMIES.find(x=>x.n===ename);if(!e)return;
  const stCost=[1,2,3,4,5,7][e.tier]||1;
  if(G.stamina<stCost){toast(`Need ${stCost} stamina!`,'r');return;}
  G.stamina-=stCost;
  if(!G.fightStreak)G.fightStreak=0;
  if(!G.fightBestStreak)G.fightBestStreak=0;
  const myR=G.attack*(1+Math.random()*.5)*(G.mafiaSize*.05+1);
  const eR=e.atk*(1+Math.random()*.4)*((e.def/50)+.5);
  const win=myR>eR;
  const fra=document.getElementById('fr-area');
  if(win){
    const streakBonus=G.fightStreak>=5?G.fightStreak*3:0;
    let cash=Math.floor(e.r*(1+Math.random()*.3)*(1+streakBonus/100)*getEventMult('cashMult',1));
    const xp=Math.round(e.xr*G.xpMult*G.pBonuses.xpMult*getEventMult('xpMult',1)*getNotorietyMult('xp'));
    G.cash+=cash;G.totalEarned+=cash;G.fightsWon++;
    G.fightStreak++;
    if(G.fightStreak>G.fightBestStreak)G.fightBestStreak=G.fightStreak;
    G.respect+=Math.floor(e.xr/3)+1;
    gainXP(xp);
    const kcBonus=G.crew&&G.crew['cr_reaper']?0.15:0;if(Math.random()<e.kc+kcBonus){G.kills++;addLog(`💀 ${e.n} eliminated!`,'sp');}
    if(Math.random()<G.critChance/100){const bonus=Math.floor(cash*.5);G.cash+=bonus;G.totalEarned+=bonus;cash+=bonus;addLog(`💥 CRITICAL HIT! +$${fmtCash(bonus)}`,'gold');}
    // Loot drop
    if(e.loot&&Math.random()<.12*getEventMult('lootMult',1)){addLoot(e.loot);}
    if(fra)fra.innerHTML=`<div class="fr win">✓ VICTORY — ${e.n} defeated!${G.fightStreak>=5?' 🔥×'+G.fightStreak:''}<br>You: ${myR.toFixed(0)} vs Enemy: ${eR.toFixed(0)}<br>💰 +$${fmtCash(cash)} ⭐ +${xp}XP 🎖️ +${Math.floor(e.xr/3)+1} Respect</div>`;
    addLog(`✓ Beat ${e.n} — $${fmtCash(cash)}`,'good');
  }else{
    const dmg=Math.floor((eR-myR)*.4)+8;
    G.health=Math.max(0,G.health-dmg);G.fightsLost++;
    G.fightStreak=0;
    if(fra)fra.innerHTML=`<div class="fr lose">✗ DEFEATED by ${e.n}<br>You: ${myR.toFixed(0)} vs Enemy: ${eR.toFixed(0)}<br>❤️ -${dmg} HP</div>`;
    addLog(`✗ Lost to ${e.n} — took ${dmg} dmg`,'bad');
  }
  addHeat(getEventMult('heatMult',3));
  // Notoriety only from killing higher-tier enemies
  if(win&&e.tier>=2)addNotoriety(Math.floor(e.r/20000)+1);
  try{updateAll();}catch(err){console.error('updateAll error:',err);}
  try{checkMissions();}catch(err){console.error('checkMissions error:',err);}
  save();
  try{buildFight(document.getElementById('center'));}catch(err){}
}

// ══════════════════════════════════════════
// HITLIST PANEL
// ══════════════════════════════════════════
function buildHitlist(c){
  const tierColors={Street:'var(--text-dim)',Political:'var(--bright-blue)',['Rival Don']:'var(--bright-orange)',Intelligence:'var(--bright-purple)',International:'var(--crimson)',Legendary:'var(--bright-gold)'};
  const tiers=[...new Set(HITLIST.map(t=>t.tier))];
  const totalKills=(G.hitlistKills||0);
  const totalEarned=(G.hitlistEarned||0);

  let html=`<div class="panel"><div class="ph"><h2>🏹 HITLIST</h2><span class="psub">Collect bounties. High risk, massive reward. ${HITLIST.length} targets.</span></div><div class="pb">`;
  // Stats
  html+=`<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:12px;">
    <div style="background:var(--surface2);border:1px solid var(--border);padding:8px;text-align:center"><div style="font-family:'Bebas Neue',sans-serif;font-size:20px;color:var(--crimson)">${totalKills}</div><div style="font-size:8px;color:var(--text-dim);font-family:'Cutive Mono',monospace">BOUNTIES COLLECTED</div></div>
    <div style="background:var(--surface2);border:1px solid var(--border);padding:8px;text-align:center"><div style="font-family:'Bebas Neue',sans-serif;font-size:20px;color:var(--bright-gold)">$${fmtCash(totalEarned)}</div><div style="font-size:8px;color:var(--text-dim);font-family:'Cutive Mono',monospace">TOTAL EARNED</div></div>
    <div style="background:var(--surface2);border:1px solid var(--border);padding:8px;text-align:center"><div style="font-family:'Bebas Neue',sans-serif;font-size:20px;color:var(--bright-green)">${G.stamina}/${G.maxStamina}</div><div style="font-size:8px;color:var(--text-dim);font-family:'Cutive Mono',monospace">STAMINA</div></div>
  </div>`;

  for(const tier of tiers){
    const targets=HITLIST.filter(t=>t.tier===tier);
    const tc=tierColors[tier]||'var(--text-dim)';
    html+=`<div style="font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:.12em;padding:5px 0;margin-top:8px;border-bottom:1px solid var(--border);color:${tc}">▸ ${tier.toUpperCase()}</div>`;
    for(const t of targets){
      const locked=G.level<(t.ml||1);
      const winChance=Math.max(15,Math.min(85,75-(t.st*1.5)));
      html+=`<div style="background:var(--surface2);border:1px solid var(--border);padding:10px;margin-bottom:4px;display:grid;grid-template-columns:1fr auto auto;align-items:center;gap:10px;transition:all .12s;opacity:${locked?.35:1}" ${!locked?'onmouseover="this.style.borderColor=\'var(--crimson)\'" onmouseout="this.style.borderColor=\'var(--border)\'"':''}>
        <div>
          <div style="font-family:'Bebas Neue',sans-serif;font-size:15px;">${t.n}</div>
          <div style="font-size:10px;color:var(--text-dim);font-family:'Special Elite',serif;margin-top:1px;">${t.d}</div>
          <div style="font-size:9px;color:var(--text-dim);font-family:'Cutive Mono',monospace;margin-top:3px;">${t.st} 💪 · ~${winChance}% success${t.loot?' · 🎁 Loot':''}${locked?' · 🔒 Lv'+t.ml:''}</div>
        </div>
        <div style="font-family:'Cutive Mono',monospace;color:var(--bright-gold);font-size:13px;text-align:right;">$${fmtCash(t.b)}</div>
        ${locked?`<div style="font-size:10px;color:var(--text-dim);font-family:'Bebas Neue',sans-serif;">LV ${t.ml}</div>`:
          `<button class="djb" onclick="collectBounty('${t.n.replace(/'/g,"\\'")}')" ${G.stamina>=t.st?'':'disabled'}>COLLECT</button>`}
      </div>`;
    }
  }
  html+=`</div></div>`;
  c.innerHTML=html;
}

function collectBounty(name){
  const t=HITLIST.find(x=>x.n===name);if(!t)return;
  if(G.stamina<t.st){toast(`Need ${t.st} stamina!`,'r');return;}
  if(G.level<(t.ml||1)){toast('Level too low!','r');return;}
  G.stamina-=t.st;
  const winChance=(75-(t.st*1.5))/100;
  const win=Math.random()<Math.max(.15,Math.min(.85,winChance));
  if(win){
    const cash=Math.floor(t.b*(1+Math.random()*.2));
    G.cash+=cash;G.totalEarned+=cash;G.kills++;G.respect+=Math.floor(cash/2000)+5;
    if(!G.hitlistKills)G.hitlistKills=0;G.hitlistKills++;
    if(!G.hitlistEarned)G.hitlistEarned=0;G.hitlistEarned+=cash;
    gainXP(Math.floor(cash/3000));
    addLog(`💀 BOUNTY: $${fmtCash(cash)} on ${t.n}`,'gold');
    toast(`Bounty collected! $${fmtCash(cash)}`,'gold');
    // Loot drop
    if(t.loot&&Math.random()<.35){addLoot(t.loot);}
  }else{
    const dmg=t.st*10+Math.floor(Math.random()*30);
    G.health=Math.max(1,G.health-dmg);
    addLog(`✗ Failed bounty on ${t.n} — ${dmg} dmg`,'bad');
    toast('Target escaped. You took damage.','r');
  }
  addHeat(Math.floor(t.st*0.8));
  addNotoriety(Math.floor(t.b/20000)+1);
  updateAll();checkMissions();save();
  buildHitlist(document.getElementById('center'));
}

// ══════════════════════════════════════════
// ROB PANEL
// ══════════════════════════════════════════
function buildRob(c){
  c.innerHTML=`<div class="panel"><div class="ph"><h2>🔫 ROB</h2><span class="psub">Rob other mobsters for quick cash. Uses 2 stamina.</span></div><div class="pb"><div id="rob-list"></div></div></div>`;
  const tgts=genRobTargets();
  const el=document.getElementById('rob-list');
  tgts.forEach(t=>{
    const d=document.createElement('div');
    d.style.cssText='background:var(--surface2);border:1px solid var(--border);padding:12px;margin-bottom:6px;display:grid;grid-template-columns:1fr auto auto;align-items:center;gap:10px;';
    d.innerHTML=`<div><div style="font-family:'Bebas Neue',sans-serif;font-size:17px;">${t.n}</div><div style="font-size:10px;color:var(--text-dim);font-family:'Special Elite',serif;">Lv${t.lv} ${t.rank} — DEF:${t.def}</div></div>
    <div style="font-family:'Cutive Mono',monospace;color:var(--bright-gold);">~$${t.cash.toLocaleString()}</div>
    <button class="djb" onclick="robTarget(${t.def},${t.cash})">ROB (2 💪)</button>`;
    el.appendChild(d);
  });
}

function genRobTargets(){
  const nms=['Fat Tony','Knuckles','Dimitri V','Carlos F','Wei C','Big Sal','Lucky L','Black Mamba','Razor Ray','The Weasel','Ghost Mike','Silent Pete','Diamond Joe','Two-Face Sal','Nicky Needles','Mad Dog Morales'];
  const rks=['Soldier','Capo','Enforcer','Underboss','Associate'];
  return Array.from({length:8},()=>({
    n:nms[Math.floor(Math.random()*nms.length)],
    lv:Math.max(1,G.level+Math.floor(Math.random()*8)-4),
    rank:rks[Math.floor(Math.random()*rks.length)],
    def:Math.floor(G.defense*(.6+Math.random()*.9)),
    cash:Math.floor(G.cash*(.04+Math.random()*.12))+1000,
  }));
}

function robTarget(def,cash){
  if(G.stamina<2){toast('Need 2 stamina!','r');return;}
  G.stamina-=2;
  const win=G.attack*(1+Math.random()*.4)>def*(1+Math.random()*.4);
  if(win){
    const s=Math.floor(cash*(.5+Math.random()*.5));
    G.cash+=s;G.totalEarned+=s;G.robberies++;gainXP(10);
    addLog(`🔫 Rob success: $${s.toLocaleString()}`,'gold');toast(`Robbed! +$${s.toLocaleString()}`,'gold');
  }else{
    const d=12+Math.floor(Math.random()*25);
    G.health=Math.max(1,G.health-d);
    addLog('✗ Rob failed. Got shot.','bad');toast('They were ready. Took damage.','r');
  }
  addHeat(getEventMult('heatMult',5));
  addNotoriety(2);
  updateAll();checkMissions();save();
  buildRob(document.getElementById('center'));
}

// ══════════════════════════════════════════
// GANG WAR
// ══════════════════════════════════════════
const GANG_TIERS=['Street Gangs','Organized Crime','International Cartels','Shadow Powers'];
const GANGS = [
  // ── STREET GANGS ──
  {id:'g1',n:'The Westies',e:'🍀',strength:50,ml:1,reward:1500,xpr:20,tier:0,d:'Irish street thugs. Violent but disorganized.'},
  {id:'g2',n:'Chinatown Dragons',e:'🐉',strength:120,ml:8,reward:4000,xpr:45,tier:0,d:'Control the gambling dens and smuggling routes.'},
  {id:'g3',n:'The Outfit',e:'🎩',strength:250,ml:15,reward:10000,xpr:90,tier:0,d:'Chicago\'s oldest family. Deep roots.'},
  {id:'g_bloods',n:'Bloods Coalition',e:'🔴',strength:180,ml:12,reward:7000,xpr:65,tier:0,d:'Street soldiers. Numbers over tactics.'},
  {id:'g4',n:'Ghost Street Crew',e:'👻',strength:400,ml:25,reward:18000,xpr:150,tier:0,d:'Nobody sees them coming. Nobody survives.'},
  // ── ORGANIZED CRIME ──
  {id:'g5',n:'Latin Kings Alliance',e:'👑',strength:800,ml:35,reward:35000,xpr:280,tier:1,d:'Pan-American network. From Chicago to São Paulo.'},
  {id:'g6',n:'Russian Bratva West',e:'🐻',strength:1500,ml:50,reward:70000,xpr:450,tier:1,d:'Ex-military. Disciplined. Ruthless.'},
  {id:'g_yakuza',n:'Yakuza Faction',e:'⛩️',strength:1200,ml:45,reward:55000,xpr:380,tier:1,d:'Honor code meets extreme violence.'},
  {id:'g_ndrangheta',n:'Ndrangheta Clan',e:'🇮🇹',strength:2000,ml:60,reward:90000,xpr:550,tier:1,d:'Calabrian mafia. Europe\'s most powerful.'},
  {id:'g7',n:'International Syndicate',e:'🌐',strength:3500,ml:75,reward:140000,xpr:800,tier:1,d:'Multi-national criminal enterprise.'},
  // ── INTERNATIONAL CARTELS ──
  {id:'g_sinaloa',n:'Sinaloa Cartel',e:'🌮',strength:6000,ml:100,reward:250000,xpr:1500,tier:2,d:'Controls 60% of US drug supply.'},
  {id:'g8',n:'Shadow Network Cells',e:'🕸️',strength:12000,ml:150,reward:500000,xpr:3000,tier:2,d:'Decentralized terror. Impossible to track.'},
  {id:'g_triad',n:'Sun Yee On Triad',e:'🏮',strength:8000,ml:120,reward:350000,xpr:2000,tier:2,d:'Hong Kong\'s largest organized crime group.'},
  {id:'g9',n:'World Order Cartel',e:'💀',strength:20000,ml:200,reward:800000,xpr:5000,tier:2,d:'Controls governments. Controls trade. Controls you.'},
  // ── SHADOW POWERS ──
  {id:'g_illuminati',n:'The Illuminati',e:'👁️',strength:50000,ml:350,reward:2000000,xpr:12000,tier:3,d:'They don\'t exist. That\'s what makes them dangerous.'},
  {id:'g10',n:'The Final Regime',e:'⚡',strength:100000,ml:500,reward:5000000,xpr:25000,tier:3,d:'The last organization standing between you and total power.'},
  {id:'g_omega',n:'Project OMEGA',e:'🔮',strength:250000,ml:700,reward:15000000,xpr:60000,tier:3,d:'AI-controlled criminal network. Predicts your every move.'},
  {id:'g_god',n:'The Old Gods',e:'🌟',strength:500000,ml:1000,reward:50000000,xpr:200000,tier:3,d:'They built the underworld. Now you tear it down.'},

  // ── STREET GANGS (Expanded) ──
  {id:'g11',n:'The Gutter Rats',e:'🐀',strength:30,ml:1,reward:1200,xpr:15,tier:0,d:'Sewer dwellers who rob tourists at knifepoint.'},
  {id:'g12',n:'Parking Lot Posse',e:'🅿️',strength:45,ml:2,reward:1800,xpr:18,tier:0,d:'Run every lot downtown. Cash only.'},
  {id:'g13',n:'The 40th Street Boys',e:'🏚️',strength:65,ml:4,reward:2500,xpr:22,tier:0,d:'Project housing muscle. Three blocks deep.'},
  {id:'g14',n:'Dead End Kids',e:'💀',strength:80,ml:6,reward:3200,xpr:28,tier:0,d:'Grew up with nothing. Fighting for everything.'},
  {id:'g15',n:'The Pit Bulls',e:'🐕',strength:100,ml:8,reward:4000,xpr:32,tier:0,d:'Attack dogs on two legs. No mercy.'},
  // ── ORGANIZED CRIME (Expanded) ──
  {id:'g16',n:'The Outfit Remnants',e:'🎩',strength:400,ml:15,reward:12000,xpr:65,tier:1,d:'Whats left of the old Capone crew.'},
  {id:'g17',n:'Brighton Beach Bratva',e:'🐻',strength:550,ml:20,reward:18000,xpr:80,tier:1,d:'Russian muscle in the harbor district.'},
  {id:'g18',n:'Chinatown Snakeheads',e:'🐍',strength:700,ml:25,reward:25000,xpr:95,tier:1,d:'Human smuggling empire. 200 deep.'},
  {id:'g19',n:'The Albanian Mob',e:'🦅',strength:850,ml:30,reward:35000,xpr:110,tier:1,d:'Eastern European rage. Machetes and MAC-10s.'},
  {id:'g20',n:'Cosa Nostra Holdouts',e:'🌹',strength:1000,ml:35,reward:45000,xpr:130,tier:1,d:'Old school. Blood oath. Five families remnant.'},
  {id:'g21',n:'MS-13 Chapter',e:'💀',strength:1200,ml:40,reward:55000,xpr:145,tier:1,d:'Central American brutality. No negotiation.'},
  // ── INTERNATIONAL CARTELS (Expanded) ──
  {id:'g22',n:'Medellín Cartel Revival',e:'🌿',strength:3000,ml:50,reward:120000,xpr:200,tier:2,d:'Pablos ghost still runs these streets.'},
  {id:'g23',n:'Gulf Cartel',e:'🏜️',strength:4000,ml:60,reward:180000,xpr:250,tier:2,d:'Controls the entire Texas-Mexico border.'},
  {id:'g24',n:'Solntsevskaya Bratva',e:'☀️',strength:5000,ml:70,reward:250000,xpr:300,tier:2,d:'Moscows most powerful crime syndicate.'},
  {id:'g25',n:'Camorra Napoli',e:'🇮🇹',strength:6000,ml:80,reward:350000,xpr:350,tier:2,d:'Naples finest. Garbage and guns.'},
  {id:'g26',n:'Hong Kong 14K Triad',e:'🐲',strength:8000,ml:90,reward:500000,xpr:400,tier:2,d:'25,000 members. Asia-Pacific dominance.'},
  {id:'g27',n:'Los Zetas Remnants',e:'🪖',strength:10000,ml:100,reward:700000,xpr:450,tier:2,d:'Ex-military cartel. Trained killers.'},
  // ── SHADOW POWERS (Expanded) ──
  {id:'g28',n:'The Bilderberg Guard',e:'🏛️',strength:25000,ml:120,reward:1500000,xpr:600,tier:3,d:'Protect the worlds most powerful meeting.'},
  {id:'g29',n:'Deep State Operators',e:'🕵️',strength:35000,ml:150,reward:2500000,xpr:750,tier:3,d:'They run the government from the shadows.'},
  {id:'g30',n:'The Vatican Shadow Army',e:'⛪',strength:50000,ml:180,reward:4000000,xpr:900,tier:3,d:'Gods soldiers. With real weapons.'},
  {id:'g31',n:'Quantum Collective',e:'🔮',strength:75000,ml:220,reward:6000000,xpr:1100,tier:3,d:'AI-enhanced crime syndicate from the future.'},
  {id:'g32',n:'The Architects of War',e:'⚡',strength:100000,ml:260,reward:8000000,xpr:1300,tier:3,d:'They started the last three wars. For profit.'},
  {id:'g33',n:'The Eternal Council',e:'👁️',strength:150000,ml:300,reward:12000000,xpr:1600,tier:3,d:'Theyve controlled humanity for 1000 years.'},
  {id:'g34',n:'OMEGA Syndicate',e:'Ω',strength:250000,ml:400,reward:20000000,xpr:2000,tier:3,d:'Beyond nations. Beyond law. Beyond death.'},
  {id:'g35',n:'The Void',e:'🌑',strength:500000,ml:500,reward:50000000,xpr:3000,tier:3,d:'Nobody returns from fighting The Void.'},

  {id:'g36',n:'The Favela Kings',e:'🇧🇷',ml:10,strength:60,tier:0,reward:8000,xpr:200,d:'Control the Rio slums.'},
  {id:'g37',n:'Lagos Street Pirates',e:'🏴‍☠️',ml:18,strength:115,tier:1,reward:15000,xpr:400,d:'Nigerian cyber-crime syndicate with muscle.'},
  {id:'g38',n:'Tehran Shadow Corps',e:'🇮🇷',ml:28,strength:200,tier:1,reward:30000,xpr:700,d:'Revolutionary Guard gone rogue.'},
  {id:'g39',n:'Marseille Corsicans',e:'🇫🇷',ml:35,strength:280,tier:2,reward:50000,xpr:1000,d:'French Connection reborn.'},
  {id:'g40',n:'Mumbai Underworld',e:'🇮🇳',ml:45,strength:380,tier:2,reward:75000,xpr:1500,d:'Bollywood meets bullets.'},
  {id:'g41',n:'Johannesburg Jackals',e:'🇿🇦',ml:55,strength:510,tier:2,reward:100000,xpr:2000,d:'Diamond trade enforcers.'},
  {id:'g42',n:'Seoul Kkangpae',e:'🇰🇷',ml:65,strength:650,tier:2,reward:150000,xpr:3000,d:'Korean organized crime. K-pop is a front.'},
  {id:'g43',n:'Havana Revolucionarios',e:'🇨🇺',ml:75,strength:840,tier:2,reward:200000,xpr:4000,d:'Castro loyalists running black markets.'},
  {id:'g44',n:'Stockholm Syndicate',e:'🇸🇪',ml:85,strength:1080,tier:3,reward:300000,xpr:5500,d:'Nordic crime ring. Clean. Efficient. Deadly.'},
  {id:'g45',n:'Kabul Warlords',e:'🏔️',ml:100,strength:1550,tier:3,reward:500000,xpr:8000,d:'Former mujahideen turned drug lords.'},
  {id:'g46',n:'Bogotá Cartel Reborn',e:'🇨🇴',ml:130,strength:2250,tier:3,reward:800000,xpr:12000,d:'Pablo spirit lives on.'},
  {id:'g47',n:'Bangkok Ghost Market',e:'🇹🇭',ml:160,strength:3050,tier:3,reward:1200000,xpr:18000,d:'Black market organ trade. Pure evil.'},
  {id:'g48',n:'Mossad Rogue Unit',e:'🇮🇱',ml:200,strength:4700,tier:3,reward:2000000,xpr:25000,d:'Intelligence operatives gone mercenary.'},
  {id:'g49',n:'Panama Shadow Bank',e:'🏦',ml:250,strength:6900,tier:4,reward:3500000,xpr:35000,d:'They laundered money for everyone. Now they want it all.'},
  {id:'g50',n:'Arctic Ghost Division',e:'❄️',ml:300,strength:10100,tier:4,reward:5000000,xpr:50000,d:'Russian special forces turned criminal empire. Based in the ice.'},
  {id:'g51',n:'Sahara Phantom Legion',e:'🏜️',ml:350,strength:13300,tier:4,reward:7000000,xpr:65000,d:'Control every smuggling route through Africa.'},
  {id:'g52',n:'Pacific Rim Collective',e:'🌊',ml:400,strength:16500,tier:4,reward:10000000,xpr:80000,d:'Shipping lanes. Submarine drug runs. Unstoppable.'},
  {id:'g53',n:'The Manhattan Project',e:'☢️',ml:450,strength:19700,tier:4,reward:15000000,xpr:100000,d:'They stole nuclear secrets. Now they sell them.'},
  {id:'g54',n:'Orbital Crime Station',e:'🛸',ml:550,strength:27000,tier:5,reward:25000000,xpr:150000,d:'Crime syndicate operating from international waters. And space.'},
  {id:'g55',n:'The World Engine',e:'⚙️',ml:650,strength:37500,tier:5,reward:40000000,xpr:200000,d:'They control the supply chains. All of them.'},
  {id:'g56',n:'Ragnarok Syndicate',e:'🔥',ml:800,strength:53200,tier:5,reward:60000000,xpr:300000,d:'Named for the end of the world. Working on making it literal.'},
  {id:'g57',n:'The Infinite Cartel',e:'♾️',ml:900,strength:74000,tier:5,reward:80000000,xpr:400000,d:'No beginning. No end. They have always been here.'},
  {id:'g58',n:'Heaven\'s Gate Mafia',e:'😇',ml:1100,strength:95500,tier:5,reward:100000000,xpr:500000,d:'They own churches, governments, and your soul.'},
];

function buildGangWar(c){
  const gtColors=['var(--text-dim)','var(--bright-blue)','var(--bright-orange)','#ff1744'];
  const totalWon=GANGS.filter(g=>(G.gangTerritories[g.id]||0)>=100).length;
  const totalTerr=GANGS.reduce((s,g)=>s+(G.gangTerritories[g.id]||0),0);

  let html=`<div class="panel"><div class="ph"><h2>💣 GANG WAR</h2><span class="psub">${totalWon}/${GANGS.length} defeated · Total territory: ${totalTerr}%</span></div><div class="pb">`;

  // Dashboard
  html+=`<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:12px;">
    <div style="background:var(--surface2);border:1px solid var(--border);padding:6px;text-align:center"><div style="font-family:'Bebas Neue',sans-serif;font-size:16px;color:var(--bright-gold)">${totalWon}/${GANGS.length}</div><div style="font-size:8px;color:var(--text-dim);font-family:'Cutive Mono',monospace">WARS WON</div></div>
    <div style="background:var(--surface2);border:1px solid var(--border);padding:6px;text-align:center"><div style="font-family:'Bebas Neue',sans-serif;font-size:16px;color:var(--bright-green)">⚔️${G.attack}</div><div style="font-size:8px;color:var(--text-dim);font-family:'Cutive Mono',monospace">YOUR ATK</div></div>
    <div style="background:var(--surface2);border:1px solid var(--border);padding:6px;text-align:center"><div style="font-family:'Bebas Neue',sans-serif;font-size:16px;color:var(--bright-blue)">${G.stamina}/${G.maxStamina}</div><div style="font-size:8px;color:var(--text-dim);font-family:'Cutive Mono',monospace">STAMINA</div></div>
    <div style="background:var(--surface2);border:1px solid var(--border);padding:6px;text-align:center"><div style="font-family:'Bebas Neue',sans-serif;font-size:16px;color:var(--bright-purple)">×${(G.warDmgMult||1).toFixed(1)}</div><div style="font-size:8px;color:var(--text-dim);font-family:'Cutive Mono',monospace">WAR DMG MULT</div></div>
  </div>`;

  for(let ti=0;ti<GANG_TIERS.length;ti++){
    const tierGangs=GANGS.filter(g=>g.tier===ti);
    const tierWon=tierGangs.filter(g=>(G.gangTerritories[g.id]||0)>=100).length;
    html+=`<div style="font-family:'Bebas Neue',sans-serif;font-size:12px;letter-spacing:.12em;color:${gtColors[ti]};margin:10px 0 5px;border-bottom:1px solid var(--border);padding-bottom:3px">▸ ${GANG_TIERS[ti].toUpperCase()} <span style="font-size:10px;opacity:.6">${tierWon}/${tierGangs.length}</span></div>`;
    for(const g of tierGangs){
      const locked=G.level<g.ml;
      const prog=G.gangTerritories[g.id]||0;
      const done=prog>=100;
      html+=`<div class="gw-bar" style="opacity:${locked?.35:1}">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div style="display:flex;align-items:center;gap:8px;"><span style="font-size:18px">${g.e}</span><div class="gw-name">${g.n}</div></div>
          <div style="font-size:10px;color:var(--text-dim);font-family:'Special Elite',serif;">${done?'✓ DEFEATED':locked?'🔒 Lv'+g.ml:'STR '+fmtCash(g.strength)}</div>
        </div>
        <div style="font-size:9px;color:var(--text-dim);font-family:'Special Elite',serif;margin:2px 0;">${g.d}</div>
        <div class="gw-territory"><div class="gw-us" style="width:${prog}%"></div><div class="gw-them" style="width:${100-prog}%"></div></div>
        <div style="font-size:9px;color:var(--text-dim);font-family:'Cutive Mono',monospace;">Territory: ${prog}% | Reward: $${fmtCash(g.reward)} | +${g.xpr} XP</div>
        ${!done&&!locked?`<div style="margin-top:6px;display:flex;gap:6px;">
          <button class="gw-btn" onclick="gangWarAttack('${g.id}',false)">⚔️ ATTACK (3 💪)</button>
          <button class="gw-btn" onclick="gangWarAttack('${g.id}',true)" style="background:rgba(106,13,173,.3);border-color:var(--bright-purple);">💥 BLITZ (8 💪)</button>
        </div>`:''}
        ${done?`<div style="color:var(--bright-gold);font-family:'Bebas Neue',sans-serif;font-size:12px;margin-top:4px;letter-spacing:.1em">✓ CAPTURED — +$${fmtCash(g.reward)}</div>`:''}
      </div>`;
    }
  }
  html+=`</div></div>`;
  c.innerHTML=html;
}

function gangWarAttack(gid,blitz){
  const g=GANGS.find(x=>x.id===gid);if(!g)return;
  const stCost=Math.ceil((blitz?8:3)/getEventMult('gangMult',1));
  if(G.stamina<stCost){toast(`Need ${stCost} stamina!`,'r');return;}
  if(G.level<g.ml){toast('Too low level!','r');return;}
  G.stamina-=stCost;
  const power=G.attack*(1+Math.random()*.5)*G.mafiaSize*.1*(blitz?2:1)*(G.warDmgMult||1);
  const ePow=g.strength*(1+Math.random()*.4);
  const gain=power>ePow?Math.floor((15+Math.random()*20)*(blitz?2:1)*getEventMult('gangMult',1)):Math.floor(Math.random()*5);
  G.gangTerritories[gid]=Math.min(100,(G.gangTerritories[gid]||0)+gain);
  G.gangWarProgress[gid]=G.gangTerritories[gid];
  const prog=G.gangTerritories[gid];
  addHeat(blitz?8:4);
  addNotoriety(Math.floor(g.reward/20000)+2);
  if(prog>=100&&!(G.gangWarProgress[gid+'_rewarded'])){
    G.gangWarProgress[gid+'_rewarded']=true;
    const cash=Math.floor(g.reward*(G.cashMult||1));
    G.cash+=cash;G.totalEarned+=cash;gainXP(g.xpr);G.respect+=g.xpr;
    addLog(`💣 GANG WAR WON: ${g.n} — $${fmtCash(cash)}!`,'sp');
    toast(`Gang War Victory! $${fmtCash(cash)}!`,'gold');
  }else{
    const dmg=power>ePow?Math.floor(Math.random()*15)+3:Math.floor(Math.random()*30)+10;
    G.health=Math.max(1,G.health-dmg);
    if(power>ePow)addLog(`⚔️ ${g.n}: +${gain}% territory (${prog}%)`,'good');
    else addLog(`⚔️ ${g.n}: Repelled. -${dmg} HP. Territory: ${prog}%`,'bad');
  }
  updateAll();checkMissions();save();
  buildGangWar(document.getElementById('center'));
}

// ══════════════════════════════════════════
// PROPERTIES PANEL
// ══════════════════════════════════════════
const PROP_TIERS=['I. Street Level','II. Local Business','III. City Enterprise','IV. National Operations','V. Global Empire','VI. World Domination'];
const PROPS = [
  // ── TIER I: STREET LEVEL ($1K–$20K) ──
  {id:'newsstand',n:'Newsstand',e:'📰',c:1000,i:40,max:10,tier:0,d:'Sell papers. Sell information.',ul:1},
  {id:'bodega',n:'Bodega',e:'🏪',c:3000,i:100,max:8,tier:0,d:'Corner store front. Cash business.',ul:1},
  {id:'laundromat',n:'Laundromat',e:'🧺',c:5000,i:150,max:6,tier:0,d:'Clean clothes. Clean money.',ul:1},
  {id:'food_cart',n:'Food Cart Fleet',e:'🌭',c:4000,i:120,max:8,tier:0,d:'Hot dogs on every corner.',ul:1},
  {id:'barbershop',n:'Barbershop',e:'💈',c:6000,i:200,max:5,tier:0,d:'Where deals get made.',ul:1},
  {id:'numbers_parlor',n:'Numbers Parlor',e:'🎲',c:12000,i:400,max:5,tier:0,d:'Illegal betting den.',ul:3},
  {id:'pawn_shop',n:'Pawn Shop',e:'🔑',c:8000,i:280,max:5,tier:0,d:'No questions asked.',ul:1},
  {id:'taxi_company',n:'Taxi Company',e:'🚕',c:15000,i:500,max:4,tier:0,d:'Eyes and ears everywhere.',ul:5},
  {id:'auto_garage',n:'Auto Garage',e:'🔧',c:18000,i:600,max:4,tier:0,d:'Repairs. Modifications. No records.',ul:5},

  // ── TIER II: LOCAL BUSINESS ($20K–$100K) ──
  {id:'chop_shop',n:'Chop Shop',e:'🔧',c:25000,i:1000,max:3,tier:1,d:'Vehicle processing center.',ul:8},
  {id:'strip_club',n:'Strip Club',e:'💃',c:35000,i:1400,max:3,tier:1,d:'Cash business. No paper trail.',ul:10},
  {id:'nightclub',n:'Nightclub',e:'🎵',c:50000,i:2000,max:3,tier:1,d:'The hottest spot in town.',ul:10},
  {id:'warehouse',n:'Warehouse',e:'🏭',c:40000,i:1500,max:4,tier:1,d:'Distribution hub.',ul:8},
  {id:'gun_range',n:'Gun Range',e:'🎯',c:30000,i:1200,max:3,tier:1,d:'Legal front. Illegal back room.',ul:8},
  {id:'restaurant',n:'Restaurant Chain',e:'🍝',c:60000,i:2400,max:3,tier:1,d:'Laundering front. Great pasta.',ul:12},
  {id:'construction',n:'Construction Company',e:'🏗️',c:75000,i:3000,max:2,tier:1,d:'Build buildings. Bury problems.',ul:15},
  {id:'car_dealership',n:'Car Dealership',e:'🚗',c:80000,i:3200,max:2,tier:1,d:'Luxury vehicles. Laundered titles.',ul:15},
  {id:'fight_club',n:'Underground Fight Club',e:'🥊',c:45000,i:1800,max:3,tier:1,d:'Bare knuckle. Big bets.',ul:10},

  // ── TIER III: CITY ENTERPRISE ($100K–$500K) ──
  {id:'casino',n:'Underground Casino',e:'🎰',c:100000,i:4500,max:2,tier:2,d:'High-stakes gambling empire.',ul:18},
  {id:'port',n:'Port Terminal',e:'⚓',c:200000,i:9000,max:2,tier:2,d:'Control the shipping lanes.',ul:20},
  {id:'hotel',n:'Luxury Hotel',e:'🏨',c:250000,i:11000,max:2,tier:2,d:'Five-star money machine.',ul:22},
  {id:'record_label',n:'Record Label',e:'🎤',c:180000,i:7500,max:2,tier:2,d:'Music money. Tour money. Merch money.',ul:20},
  {id:'private_security',n:'Private Security Firm',e:'🛡️',c:150000,i:6000,max:2,tier:2,d:'Protect the empire. Monitor enemies.',ul:18},
  {id:'real_estate',n:'Real Estate Agency',e:'🏠',c:300000,i:13000,max:2,tier:2,d:'Buy blocks. Sell dreams.',ul:25},
  {id:'bankfront',n:'Bank Front',e:'🏦',c:400000,i:18000,max:1,tier:2,d:'The ultimate cleaning machine.',ul:28},
  {id:'shipping_yard',n:'Container Yard',e:'📦',c:350000,i:15000,max:2,tier:2,d:'What\'s in the containers? Don\'t ask.',ul:25},
  {id:'movie_studio',n:'Movie Studio',e:'🎬',c:450000,i:20000,max:1,tier:2,d:'Hollywood accounting at its finest.',ul:30},

  // ── TIER IV: NATIONAL OPERATIONS ($500K–$5M) ──
  {id:'arms_depot',n:'Arms Depot',e:'💣',c:600000,i:28000,max:1,tier:3,d:'Weapons stockpile and distribution.',ul:35},
  {id:'offshore',n:'Offshore Account',e:'🏝️',c:800000,i:35000,max:1,tier:3,d:'Zero tax, full control. Cayman Islands.',ul:40},
  {id:'hospital_chain',n:'Hospital Chain',e:'🏥',c:1000000,i:45000,max:1,tier:3,d:'Heal the wounded. Bill the insurance.',ul:40},
  {id:'airline',n:'Regional Airline',e:'✈️',c:1500000,i:60000,max:1,tier:3,d:'Move anything. Anywhere. No customs.',ul:45},
  {id:'crypto_exchange',n:'Crypto Exchange',e:'₿',c:2000000,i:80000,max:1,tier:3,d:'Digital money river. Unstoppable.',ul:50},
  {id:'tech_company',n:'Tech Company',e:'💻',c:2500000,i:95000,max:1,tier:3,d:'Silicon cover for dark operations.',ul:55},
  {id:'pharmaceutical',n:'Pharmaceutical Corp',e:'💊',c:3000000,i:120000,max:1,tier:3,d:'Legal front, illegal margins.',ul:55},
  {id:'sports_franchise',n:'Sports Franchise',e:'🏟️',c:4000000,i:150000,max:1,tier:3,d:'Own the team. Own the city.',ul:60},
  {id:'defense_contractor',n:'Defense Contractor',e:'🛩️',c:5000000,i:190000,max:1,tier:3,d:'Government money. No oversight.',ul:65},

  // ── TIER V: GLOBAL EMPIRE ($5M–$25M) ──
  {id:'oil_refinery',n:'Oil Refinery',e:'🛢️',c:6000000,i:240000,max:1,tier:4,d:'Black gold flows to your accounts.',ul:70},
  {id:'media_empire',n:'Media Empire',e:'📺',c:8000000,i:320000,max:1,tier:4,d:'Control the narrative. Control everything.',ul:80},
  {id:'diamond_mine',n:'Diamond Mine',e:'💎',c:10000000,i:400000,max:1,tier:4,d:'Uncut profit from the earth.',ul:85},
  {id:'shipping_line',n:'Global Shipping Line',e:'🚢',c:12000000,i:480000,max:1,tier:4,d:'The ocean answers to you.',ul:90},
  {id:'satellite_network',n:'Satellite Network',e:'🛰️',c:15000000,i:600000,max:1,tier:4,d:'See everything. Know everything.',ul:95},
  {id:'private_island',n:'Private Island',e:'🌴',c:20000000,i:800000,max:1,tier:4,d:'Untouchable sovereign territory.',ul:100},

  // ── TIER VI: WORLD DOMINATION ($25M+) ──
  {id:'central_bank',n:'Central Bank',e:'🏛️',c:30000000,i:1200000,max:1,tier:5,d:'Print money. Literally.',ul:120},
  {id:'space_program',n:'Private Space Program',e:'🚀',c:50000000,i:2000000,max:1,tier:5,d:'The final frontier of laundering.',ul:150},
  {id:'sovereign_fund',n:'Sovereign Wealth Fund',e:'👑',c:80000000,i:3500000,max:1,tier:5,d:'You ARE the government.',ul:200},
  {id:'world_bank_seat',n:'World Bank Seat',e:'🌐',c:150000000,i:6000000,max:1,tier:5,d:'Control the flow of global capital.',ul:300},
  {id:'shadow_government',n:'Shadow Government',e:'🕴️',c:500000000,i:15000000,max:1,tier:5,d:'Every president. Every king. Yours.',ul:500},
];

function buildProperties(c){
  if(!G.propTab)G.propTab='all';
  const tab=G.propTab;
  const inc=calcIncome();
  const totalOwned=Object.values(G.properties).reduce((a,b)=>a+b,0);
  const totalSlots=PROPS.reduce((a,p)=>a+p.max,0);
  const now=Date.now();
  const elapsed=Math.min(12,(now-G.lastIncomeColl)/300000);
  const available=Math.floor(inc*elapsed);
  const totalInvested=PROPS.reduce((s,p)=>s+(G.properties[p.id]||0)*p.c,0);

  let html=`<div class="panel"><div class="ph"><h2>🏢 PROPERTY EMPIRE</h2><span class="psub">${totalOwned} properties | $${fmtCash(inc)}/cycle income</span></div><div class="pb">`;

  // Collect button
  html+=`<button class="collect-btn" onclick="collectIncome()">💰 COLLECT INCOME — $${available.toLocaleString()} AVAILABLE</button>`;

  // Dashboard
  html+=`<div class="prop-dash">
    <div class="prop-dash-box"><div class="n">${totalOwned}</div><div class="l">PROPERTIES</div></div>
    <div class="prop-dash-box"><div class="n" style="color:var(--bright-green)">$${fmtCash(inc)}</div><div class="l">PER CYCLE</div></div>
    <div class="prop-dash-box"><div class="n" style="color:var(--bright-gold)">$${fmtCash(totalInvested)}</div><div class="l">INVESTED</div></div>
    <div class="prop-dash-box"><div class="n" style="color:var(--bright-blue)">${totalInvested>0?((inc*12/totalInvested)*100).toFixed(1)+'%':'—'}</div><div class="l">ROI/HR</div></div>
    <div class="prop-dash-box"><div class="n" style="color:var(--bright-purple)">×${(G.incomeMult||1).toFixed(2)}</div><div class="l">INC MULT</div></div>
  </div>`;

  // Tier tabs
  html+=`<div class="prop-tabs">`;
  html+=`<div class="prop-tab ${tab==='all'?'active':''}" onclick="G.propTab='all';buildProperties(document.getElementById('center'))">ALL (${PROPS.length})</div>`;
  PROP_TIERS.forEach((t,i)=>{
    const ct=PROPS.filter(p=>p.tier===i).length;
    const owned=PROPS.filter(p=>p.tier===i).reduce((s,p)=>s+(G.properties[p.id]||0),0);
    html+=`<div class="prop-tab ${tab==='t'+i?'active':''}" onclick="G.propTab='t${i}';buildProperties(document.getElementById('center'))">${t.split('. ')[1]} <span style="opacity:.6">${owned}</span></div>`;
  });
  html+=`<div class="prop-tab ${tab==='owned'?'active':''}" onclick="G.propTab='owned';buildProperties(document.getElementById('center'))">✓ OWNED</div>`;
  html+=`</div>`;

  // Filter
  let filtered=PROPS;
  if(tab.startsWith('t'))filtered=PROPS.filter(p=>p.tier===parseInt(tab[1]));
  else if(tab==='owned')filtered=PROPS.filter(p=>(G.properties[p.id]||0)>0);

  // Group by tier
  const byTier={};
  filtered.forEach(p=>{if(!byTier[p.tier])byTier[p.tier]=[];byTier[p.tier].push(p);});

  for(const[ti,items]of Object.entries(byTier)){
    const tierInc=items.reduce((s,p)=>s+(G.properties[p.id]||0)*p.i,0);
    html+=`<div class="ptier-hdr" style="color:${ti>=5?'#ff1744':ti>=4?'var(--bright-gold)':ti>=3?'var(--bright-orange)':ti>=2?'#ab47bc':ti>=1?'var(--bright-blue)':'var(--text-dim)'}">▸ ${PROP_TIERS[ti]}${tierInc>0?` <span style="font-size:10px;color:var(--bright-green);">($${fmtCash(tierInc)}/cycle)</span>`:''}</div>`;
    html+=`<div class="pgrid">`;
    for(const p of items){
      const own=G.properties[p.id]||0;
      const maxed=own>=p.max;
      const locked=G.level<(p.ul||1);
      const can=G.cash>=p.c&&!maxed&&!locked;
      const propInc=own*p.i;
      const upgLvl=G.propUpgrades&&G.propUpgrades[p.id]||0;
      const upgCost=Math.floor(p.c*2*(upgLvl+1));
      const upgBonus=upgLvl*Math.floor(p.i*0.25);
      const totalPropInc=propInc+upgBonus*own;

      html+=`<div class="pcard ${maxed?'p-maxed':''}" style="${locked?'opacity:.35':''}">
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:22px;">${p.e}</span>
          <div style="flex:1;min-width:0;">
            <div class="pname" style="font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${p.n}</div>
            <div style="font-size:9px;color:var(--text-dim);font-family:'Special Elite',serif;">${p.d}</div>
          </div>
          ${maxed?'<div style="font-size:8px;color:var(--bright-green);font-family:\'Bebas Neue\',sans-serif;letter-spacing:.1em;">MAXED</div>':''}
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;">
          <div class="pinc">$${p.i.toLocaleString()}/ea${upgLvl>0?` <span style="color:var(--bright-gold);">(+$${fmtCash(upgBonus)} upg)</span>`:''}</div>
          <div class="powned">${own}/${p.max}${own>0?` → <span style="color:var(--bright-green)">$${fmtCash(totalPropInc)}/cyc</span>`:''}</div>
        </div>`;
      if(locked){
        html+=`<div style="font-size:9px;color:var(--crimson);margin-top:6px;font-family:'Special Elite',serif;">🔒 Requires Level ${p.ul}</div>`;
      }else{
        html+=`<div style="margin-top:6px;display:flex;gap:4px;align-items:center;flex-wrap:wrap;">`;
        if(!maxed)html+=`<button class="bbtn" onclick="buyProp('${p.id}')" ${can?'':'disabled'} style="font-size:11px;padding:4px 8px;">BUY $${fmtCash(p.c)}</button>`;
        if(own>0&&upgLvl<5)html+=`<button class="prop-upgrade-btn" onclick="upgradeProp('${p.id}')" ${G.cash>=upgCost?'':'disabled'} title="Upgrade income +25% per level">⬆ LV${upgLvl+1} $${fmtCash(upgCost)}</button>`;
        if(upgLvl>0)html+=`<span style="font-size:8px;color:var(--bright-gold);font-family:'Cutive Mono',monospace;">⬆${upgLvl}</span>`;
        html+=`</div>`;
      }
      html+=`</div>`;
    }
    html+=`</div>`;
  }
  if(!filtered.length)html+=`<div style="color:var(--text-dim);font-family:'Special Elite',serif;padding:20px;text-align:center;">No properties match this filter.</div>`;
  html+=`</div></div>`;
  c.innerHTML=html;
}

function buyProp(id){
  const p=PROPS.find(x=>x.id===id);if(!p)return;
  const propCost=Math.floor(p.c*getEventMult('propCostMult',1));if(G.cash<propCost){toast('Not enough cash!','r');return;}
  if(G.level<(p.ul||1)){toast('Level too low!','r');return;}
  if((G.properties[id]||0)>=p.max){toast('Max owned!','r');return;}
  G.cash-=propCost;G.properties[id]=(G.properties[id]||0)+1;
  addLog(`🏢 Bought ${p.n} #${G.properties[id]}`,'gold');toast(`${p.e} ${p.n} acquired!`,'gold');
  // XP for buying property
  gainXP(Math.floor(p.c/5000));
  updateAll();checkMissions();save();buildProperties(document.getElementById('center'));
}
function upgradeProp(id){
  const p=PROPS.find(x=>x.id===id);if(!p)return;
  if(!G.propUpgrades)G.propUpgrades={};
  const lvl=G.propUpgrades[id]||0;
  if(lvl>=5){toast('Max upgrade level!','r');return;}
  const cost=Math.floor(p.c*2*(lvl+1));
  if(G.cash<cost){toast(`Need $${fmtCash(cost)}!`,'r');return;}
  G.cash-=cost;
  G.propUpgrades[id]=lvl+1;
  const bonus=Math.floor(p.i*0.25);
  addLog(`⬆ Upgraded ${p.n} to Lv${lvl+1}! +$${fmtCash(bonus)}/ea`,'gold');
  toast(`${p.e} ${p.n} upgraded!`,'gold');
  updateAll();save();buildProperties(document.getElementById('center'));
}

// ══════════════════════════════════════════
// STORE PANEL
// ══════════════════════════════════════════
function buildStore(c){
  if(!G.storeTab)G.storeTab='All';
  const ft=G.storeTab;
  const tabs=['All','Weapons','Armor','Vehicles'];
  const tierTabs=['All Tiers',...STORE_TIERS.map((t,i)=>t.split('. ')[1])];
  if(!G.storeTier)G.storeTier='All Tiers';
  const st=G.storeTier;

  const totalOwned=(G.inventory.weapons||[]).length+(G.inventory.armor||[]).length+(G.inventory.vehicles||[]).length;
  const totalAtk=(G.inventory.weapons||[]).concat(G.inventory.armor||[],G.inventory.vehicles||[]).reduce((s,id)=>{const it=getItem(id);return s+(it.atk||0);},0);
  const totalDef=(G.inventory.weapons||[]).concat(G.inventory.armor||[],G.inventory.vehicles||[]).reduce((s,id)=>{const it=getItem(id);return s+(it.def||0);},0);

  let html=`<div class="panel"><div class="ph"><h2>🔧 ARMORY</h2><span class="psub">${STORE.length} items available | ${totalOwned} owned | Cash: $${fmtCash(G.cash)}</span></div><div class="pb">`;

  // Dashboard
  html+=`<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:10px;">
    <div style="background:var(--surface2);border:1px solid var(--border);padding:6px;text-align:center"><div style="font-family:'Bebas Neue',sans-serif;font-size:16px;color:var(--bright-gold)">${totalOwned}</div><div style="font-size:8px;color:var(--text-dim);font-family:'Cutive Mono',monospace">ITEMS OWNED</div></div>
    <div style="background:var(--surface2);border:1px solid var(--border);padding:6px;text-align:center"><div style="font-family:'Bebas Neue',sans-serif;font-size:16px;color:var(--crimson)">+${totalAtk}</div><div style="font-size:8px;color:var(--text-dim);font-family:'Cutive Mono',monospace">TOTAL ATK</div></div>
    <div style="background:var(--surface2);border:1px solid var(--border);padding:6px;text-align:center"><div style="font-family:'Bebas Neue',sans-serif;font-size:16px;color:var(--bright-blue)">+${totalDef}</div><div style="font-size:8px;color:var(--text-dim);font-family:'Cutive Mono',monospace">TOTAL DEF</div></div>
    <div style="background:var(--surface2);border:1px solid var(--border);padding:6px;text-align:center"><div style="font-family:'Bebas Neue',sans-serif;font-size:16px;color:var(--bright-green)">$${fmtCash(G.cash)}</div><div style="font-size:8px;color:var(--text-dim);font-family:'Cutive Mono',monospace">CASH</div></div>
  </div>`;

  // Type tabs
  html+=`<div class="tabs">${tabs.map(t=>`<div class="tab ${ft===t?'active':''}" onclick="G.storeTab='${t}';buildStore(document.getElementById('center'))">${t}</div>`).join('')}</div>`;
  // Tier tabs
  html+=`<div style="display:flex;gap:3px;margin-bottom:10px;flex-wrap:wrap;">${tierTabs.map((t,i)=>`<span style="font-size:9px;font-family:'Bebas Neue',sans-serif;cursor:pointer;padding:2px 8px;border:1px solid ${st===t?'var(--gold)':'var(--border)'};color:${st===t?'var(--bright-gold)':'var(--text-dim)'};background:${st===t?'var(--surface2)':'var(--surface3)'};" onclick="G.storeTier='${t}';buildStore(document.getElementById('center'))">${t}</span>`).join('')}</div>`;

  html+=`<div class="sgrid">`;
  for(const it of STORE){
    if(ft!=='All'){
      if(ft==='Weapons'&&it.t!=='weapon')continue;
      if(ft==='Armor'&&it.t!=='armor')continue;
      if(ft==='Vehicles'&&it.t!=='vehicle')continue;
    }
    if(st!=='All Tiers'){
      const tierIdx=tierTabs.indexOf(st)-1;
      if(tierIdx>=0&&it.tier!==tierIdx)continue;
    }
    const can=G.cash>=it.c&&G.level>=(it.ml||1);
    const locked=G.level<(it.ml||1);
    html+=`<div class="sitem" style="opacity:${locked?.35:1}">
      <div class="sit ${it.t==='weapon'?'w':it.t==='armor'?'a':it.t==='vehicle'?'v':'x'}">${it.t.toUpperCase()}</div>
      <div class="sii">${it.e}</div>
      <div class="sin">${it.n}</div>
      <div class="sist">⚔️${it.atk} 🛡️${it.def}${locked?' · 🔒 Lv'+(it.ml||1):''}</div>
      <div class="sip">$${fmtCash(it.c)}</div>
      ${locked?`<div style="font-size:8px;color:var(--crimson);margin-top:4px">LOCKED LV ${it.ml}</div>`:
        `<button class="bbtn" onclick="buyItem('${it.id}')" ${can?'':'disabled'} style="width:100%;margin-top:6px;">BUY</button>`}
    </div>`;
  }
  html+=`</div></div></div>`;
  c.innerHTML=html;
}

function buyItem(id){
  const it=STORE.find(x=>x.id===id);if(!it)return;
  if(G.cash<it.c){toast('Not enough cash!','r');return;}
  if(G.level<(it.ml||1)){toast('Level too low!','r');return;}
  G.cash-=it.c;
  if(it.t==='weapon')G.inventory.weapons.push(id);
  else if(it.t==='armor')G.inventory.armor.push(id);
  else if(it.t==='vehicle')G.inventory.vehicles.push(id);
  addLootById(id,it);
  addLog(`🔧 Bought ${it.n}`,'gold');toast(`${it.e} ${it.n}!`,'gold');
  save();updateAll();buildStore(document.getElementById('center'));
}

// ══════════════════════════════════════════
// BLACK MARKET
// ══════════════════════════════════════════
function buildBlackMarket(c){
  const owned=Object.keys(G.blackMarketBuys||{}).filter(k=>!k.startsWith('crafted_')).length;
  let html=`<div class="panel"><div class="ph"><h2>🕶️ BLACK MARKET</h2><span class="psub">Off-books acquisitions. ${owned}/${BLACK_MARKET.length} owned. Sting risk scales with heat.</span></div><div class="pb">`;

  // Dashboard
  html+=`<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:12px;">
    <div style="background:var(--surface2);border:1px solid var(--border);padding:8px;text-align:center"><div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:var(--bright-gold)">${owned}/${BLACK_MARKET.length}</div><div style="font-size:8px;color:var(--text-dim);font-family:'Cutive Mono',monospace">ACQUIRED</div></div>
    <div style="background:var(--surface2);border:1px solid var(--border);padding:8px;text-align:center"><div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:var(--bright-green)">$${fmtCash(G.cash)}</div><div style="font-size:8px;color:var(--text-dim);font-family:'Cutive Mono',monospace">CASH</div></div>
    <div style="background:var(--surface2);border:1px solid var(--border);padding:8px;text-align:center"><div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:${(G.heat||0)>50?'var(--crimson)':'var(--text-dim)'}">${Math.floor(G.heat||0)}%</div><div style="font-size:8px;color:var(--text-dim);font-family:'Cutive Mono',monospace">HEAT (STING RISK)</div></div>
  </div>`;

  // Group by tier
  for(let ti=0;ti<BM_TIERS.length;ti++){
    const items=BLACK_MARKET.filter(it=>it.tier===ti);
    if(!items.length)continue;
    const tierDone=items.filter(it=>G.blackMarketBuys[it.id]).length;
    const tierColor=ti>=4?'#ff1744':ti>=3?'var(--bright-orange)':ti>=2?'var(--bright-gold)':ti>=1?'var(--bright-blue)':'var(--text-dim)';
    html+=`<div style="font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:.12em;padding:5px 0;margin-top:8px;border-bottom:1px solid var(--border);color:${tierColor}">▸ ${BM_TIERS[ti].toUpperCase()} <span style="font-size:10px;opacity:.6">${tierDone}/${items.length}</span></div>`;
    html+=`<div class="bm-grid">`;
    for(const it of items){
      const own=G.blackMarketBuys[it.id];
      const locked=G.level<(it.ml||1);
      const stingPct=Math.min(25,Math.floor((it.p>500000?8:it.p>200000?4:1)*Math.max(1,(G.heat||0)/40)));
      html+=`<div class="bm-item" style="opacity:${locked&&!own?.35:1};${own?'border-color:rgba(120,255,120,.3);background:linear-gradient(135deg,rgba(0,30,0,.3),var(--surface2))':''}">
        <div style="font-size:26px;margin-bottom:4px;">${it.e}</div>
        <div class="bm-name">${it.n}</div>
        <div class="bm-desc">${it.d}</div>
        <div class="bm-tags">${it.tag.map(t=>`<span class="bm-tag">${t}</span>`).join('')}</div>
        ${own?'<div style="color:var(--bright-green);font-family:\'Bebas Neue\',sans-serif;font-size:13px;margin-top:6px;letter-spacing:.1em;">✓ ACTIVE</div>'
          :`<div class="bm-price">$${fmtCash(it.p)}${locked?' · 🔒 Lv'+(it.ml||1):''}</div>
        ${!locked?`<div style="font-size:8px;color:var(--crimson);font-family:'Cutive Mono',monospace;margin-top:2px;">Sting risk: ${stingPct}%</div>
        <button class="bbtn" onclick="buyBMUpgraded('${it.id}')" ${G.cash>=it.p?'':'disabled'} style="width:100%;margin-top:6px;">ACQUIRE</button>`:''}`}
      </div>`;
    }
    html+=`</div>`;
  }
  html+=`</div></div>`;
  c.innerHTML=html;
}

function buyBM(id){ buyBMUpgraded(id); }

// ══════════════════════════════════════════
// CRAFTING — EXPANDED (40+ recipes, 6 tiers)
// ══════════════════════════════════════════
const CRAFT_TIERS = ['I. Street Forge','II. Back-Alley Workshop','III. Arms Dealer','IV. Black Lab','V. War Factory','VI. Mythic Arsenal'];
const CRAFTS = [
  // ── TIER I: STREET FORGE (basic combos, low level) ──
  {id:'cr01',n:'Sawn-off Shotgun',tier:0,rarity:'common',e:'🔫',reqIds:['pistol','pistol'],result:{id:'sawed_off_craft',t:'weapon',atk:32,def:0,e:'🔫'},d:'Cut it down. Bump the damage.',cash:0,lvl:1},
  {id:'cr02',n:'Armored Jacket',tier:0,rarity:'common',e:'🧥',reqIds:['leather_jacket','stab_vest'],result:{id:'armored_jacket',t:'armor',atk:2,def:22,e:'🧥'},d:'Layered protection for the streets.',cash:0,lvl:1},
  {id:'cr03',n:'Enforcer Kit',tier:0,rarity:'common',e:'💼',reqIds:['brass_knuckles','switchblade'],result:{id:'enforcer_kit',t:'weapon',atk:12,def:2,e:'💼'},d:'The classic street package.',cash:0,lvl:1},
  {id:'cr04',n:'Street Fighter Wrap',tier:0,rarity:'common',e:'🥊',reqIds:['brass_knuckles','baseball_bat'],result:{id:'street_wrap',t:'weapon',atk:14,def:3,e:'🥊'},d:'Knuckles taped to a bat. Brutal.',cash:0,lvl:1},
  {id:'cr05',n:'Thug Vest',tier:0,rarity:'common',e:'🦺',reqIds:['leather_jacket','crowbar'],result:{id:'thug_vest',t:'armor',atk:4,def:14,e:'🦺'},d:'Reinforced with steel plates.',cash:500,lvl:1},
  {id:'cr06',n:'Pipe Bomb',tier:0,rarity:'uncommon',e:'💣',reqIds:['crowbar','dynamite'],result:{id:'pipe_bomb',t:'weapon',atk:38,def:0,e:'💣'},d:'Homemade. Highly effective.',cash:1000,lvl:3},
  // ── TIER II: BACK-ALLEY WORKSHOP ──
  {id:'cr07',n:'Shadow Pistol',tier:1,rarity:'uncommon',e:'🔫',reqIds:['pistol','silenced_pistol'],result:{id:'shadow_pistol',t:'weapon',atk:28,def:0,e:'🔫'},d:'Best of both worlds.',cash:2000,lvl:5},
  {id:'cr08',n:'Spiked Bat',tier:1,rarity:'uncommon',e:'⚾',reqIds:['baseball_bat','switchblade'],result:{id:'spiked_bat',t:'weapon',atk:18,def:0,e:'⚾'},d:'Nails through aluminum. Simple math.',cash:1500,lvl:5},
  {id:'cr09',n:'Smuggler\'s Vest',tier:1,rarity:'uncommon',e:'🧥',reqIds:['stab_vest','fake_rolex'],result:{id:'smuggler_vest',t:'armor',atk:0,def:20,e:'🧥'},d:'Hidden pockets. Hidden protection.',cash:3000,lvl:8},
  {id:'cr10',n:'Tommy Deluxe',tier:1,rarity:'uncommon',e:'🔫',reqIds:['tommy_gun','gold_chain'],result:{id:'tommy_deluxe',t:'weapon',atk:30,def:2,e:'🔫'},d:'Gold-plated drum mag. Classy.',cash:5000,lvl:8},
  {id:'cr11',n:'Getaway Package',tier:1,rarity:'rare',e:'🚗',reqIds:['muscle_car','pistol'],result:{id:'getaway_pkg',t:'vehicle',atk:18,def:12,e:'🚗'},d:'Mounted gun under the dash.',cash:8000,lvl:10},
  {id:'cr12',n:'Incendiary Rounds',tier:1,rarity:'rare',e:'🔥',reqIds:['pistol','dynamite'],result:{id:'incendiary_rounds',t:'weapon',atk:35,def:0,e:'🔥'},d:'Watch them burn.',cash:6000,lvl:10},
  // ── TIER III: ARMS DEALER ──
  {id:'cr13',n:'War Machine',tier:2,rarity:'rare',e:'💀',reqIds:['ak47','bulletproof_vest'],result:{id:'war_machine',t:'weapon',atk:55,def:25,e:'💀'},d:'Offense and defense in one package.',cash:15000,lvl:15},
  {id:'cr14',n:'Executioner',tier:2,rarity:'rare',e:'🔫',reqIds:['desert_eagle','sniper_rifle'],result:{id:'executioner',t:'weapon',atk:95,def:1,e:'🔫'},d:'One shot. One kill. Any range.',cash:25000,lvl:18},
  {id:'cr15',n:'Phantom Vest',tier:2,rarity:'rare',e:'🥷',reqIds:['bulletproof_vest','compromising_photos'],result:{id:'phantom_vest',t:'armor',atk:5,def:40,e:'🥷'},d:'Nobody sees you. Nobody touches you.',cash:20000,lvl:15},
  {id:'cr16',n:'Cartel Special',tier:2,rarity:'rare',e:'🔫',reqIds:['cartel_pistol','cuban_pistol'],result:{id:'cartel_special',t:'weapon',atk:68,def:3,e:'🔫'},d:'Dual-wielded. Latin fire.',cash:18000,lvl:20},
  {id:'cr17',n:'Armored Motorcycle',tier:2,rarity:'rare',e:'🏍️',reqIds:['motorcycle','stab_vest'],result:{id:'armored_bike',t:'vehicle',atk:18,def:22,e:'🏍️'},d:'Plated panels. Fast as hell.',cash:20000,lvl:15},
  {id:'cr18',n:'Mafia Special',tier:2,rarity:'epic',e:'🔫',reqIds:['tommy_gun','gold_watch'],result:{id:'mafia_special',t:'weapon',atk:48,def:5,e:'🔫'},d:'Golden age firepower.',cash:30000,lvl:20},
  // ── TIER IV: BLACK LAB ──
  {id:'cr19',n:'Dragon Blade',tier:3,rarity:'epic',e:'⚔️',reqIds:['katana','gold_watch'],result:{id:'dragon_blade',t:'weapon',atk:90,def:12,e:'⚔️'},d:'Legendary weapon forged in flame.',cash:50000,lvl:25},
  {id:'cr20',n:'Juggernaut Armor',tier:3,rarity:'epic',e:'🛡️',reqIds:['bulletproof_vest','jade_dragon'],result:{id:'juggernaut_armor',t:'armor',atk:10,def:70,e:'🛡️'},d:'Ancient jade fused with modern kevlar.',cash:60000,lvl:25},
  {id:'cr21',n:'Viper Rifle',tier:3,rarity:'epic',e:'🐍',reqIds:['sniper_rifle','assassination_kit'],result:{id:'viper_rifle',t:'weapon',atk:120,def:0,e:'🐍'},d:'The last thing they\'ll never see.',cash:75000,lvl:30},
  {id:'cr22',n:'Ghost Runner',tier:3,rarity:'epic',e:'🚙',reqIds:['armored_suv','hacking_rig'],result:{id:'ghost_runner',t:'vehicle',atk:20,def:50,e:'🚙'},d:'Invisible to radar. Invisible to cops.',cash:80000,lvl:30},
  {id:'cr23',n:'Poison Blade',tier:3,rarity:'epic',e:'🗡️',reqIds:['corsican_blade','polonium_vial'],result:{id:'poison_blade',t:'weapon',atk:135,def:5,e:'🗡️'},d:'One scratch. Slow death. Untraceable.',cash:100000,lvl:35},
  {id:'cr24',n:'Warlord Vest',tier:3,rarity:'epic',e:'🦺',reqIds:['tactical_vest','fbi_badge'],result:{id:'warlord_vest',t:'armor',atk:8,def:55,e:'🦺'},d:'Military-grade with federal clearance.',cash:70000,lvl:28},
  // ── TIER V: WAR FACTORY ──
  {id:'cr25',n:'Doomsday Cannon',tier:4,rarity:'legendary',e:'💥',reqIds:['rocket_launcher','kalashnikov'],result:{id:'doomsday_cannon',t:'weapon',atk:280,def:5,e:'💥'},d:'Where armies fear to tread.',cash:300000,lvl:50},
  {id:'cr26',n:'Titan Exosuit',tier:4,rarity:'legendary',e:'🤖',reqIds:['exo_frame','battle_armor'],result:{id:'titan_exosuit',t:'armor',atk:30,def:220,e:'🤖'},d:'Man becomes machine.',cash:400000,lvl:50},
  {id:'cr27',n:'Samurai Annihilator',tier:4,rarity:'legendary',e:'⚔️',reqIds:['samurai_sword','golden_ak'],result:{id:'samurai_annihilator',t:'weapon',atk:200,def:15,e:'⚔️'},d:'Blade meets bullet. Perfection.',cash:250000,lvl:45},
  {id:'cr28',n:'Phantom Warship',tier:4,rarity:'legendary',e:'⚓',reqIds:['submarine','helicopter'],result:{id:'phantom_warship',t:'vehicle',atk:100,def:100,e:'⚓'},d:'Stealth. Firepower. Dominance.',cash:500000,lvl:55},
  {id:'cr29',n:'Kingslayer',tier:4,rarity:'legendary',e:'🔫',reqIds:['rail_gun','desert_eagle'],result:{id:'kingslayer',t:'weapon',atk:270,def:8,e:'🔫'},d:'Built to kill gods.',cash:350000,lvl:50},
  {id:'cr30',n:'Oni Mask Armor',tier:4,rarity:'legendary',e:'👹',reqIds:['kevlar_suit','dragon_seal'],result:{id:'oni_mask_armor',t:'armor',atk:25,def:180,e:'👹'},d:'Demon\'s protection. Ancient power.',cash:280000,lvl:45},
  {id:'cr31',n:'Don\'s Armored Limo',tier:4,rarity:'legendary',e:'🚗',reqIds:['private_jet','tank'],result:{id:'don_limo',t:'vehicle',atk:80,def:180,e:'🚗'},d:'Bulletproof. Missile-proof. Style-proof.',cash:600000,lvl:60},
  // ── TIER VI: MYTHIC ARSENAL ──
  {id:'cr32',n:'Il Diavolo',tier:5,rarity:'mythic',e:'😈',reqIds:['plasma_rifle','samurai_sword'],result:{id:'il_diavolo',t:'weapon',atk:500,def:25,e:'😈'},d:'The Devil\'s personal weapon. Forged in hell.',cash:2000000,lvl:80},
  {id:'cr33',n:'God Armor',tier:5,rarity:'mythic',e:'⚡',reqIds:['nano_suit','world_don_crown'],result:{id:'god_armor',t:'armor',atk:50,def:500,e:'⚡'},d:'Nanomesh woven with a Don\'s legacy.',cash:3000000,lvl:90},
  {id:'cr34',n:'Armageddon',tier:5,rarity:'mythic',e:'☄️',reqIds:['rail_gun','rocket_launcher'],result:{id:'armageddon',t:'weapon',atk:600,def:0,e:'☄️'},d:'End of all things. Pure destruction.',cash:5000000,lvl:100},
  {id:'cr35',n:'Leviathan',tier:5,rarity:'mythic',e:'🐉',reqIds:['warship','tank'],result:{id:'leviathan',t:'vehicle',atk:350,def:350,e:'🐉'},d:'Sea monster. Land monster. The end.',cash:8000000,lvl:100},
  {id:'cr36',n:'Lazarus Protocol',tier:5,rarity:'mythic',e:'💀',reqIds:['nano_suit','assassination_kit'],result:{id:'lazarus_protocol',t:'armor',atk:100,def:300,e:'💀'},d:'Die once. Come back stronger. Every time.',cash:4000000,lvl:85},
  {id:'cr37',n:'Crown of Shadows',tier:5,rarity:'mythic',e:'👑',reqIds:['don_ring','vor_crown','drug_lord_crown'],result:{id:'crown_shadows',t:'special',atk:200,def:200,e:'👑'},d:'Three crowns fused. Ultimate authority.',cash:6000000,lvl:95},
  {id:'cr38',n:'Omega Strike',tier:5,rarity:'mythic',e:'🌟',reqIds:['plasma_rifle','kalashnikov','rail_gun'],result:{id:'omega_strike',t:'weapon',atk:750,def:10,e:'🌟'},d:'Every bullet a death sentence. Unstoppable.',cash:10000000,lvl:100},
];
const RARITY_COLORS={common:'#888',uncommon:'#4fc3f7',rare:'#ab47bc',epic:'#FF9800',legendary:'#FFD700',mythic:'#ff1744'};
const RARITY_ORDER=['common','uncommon','rare','epic','legendary','mythic'];

function buildCrafting(c){
  if(!G.craftTab)G.craftTab='all';
  const tab=G.craftTab;
  const invAll=[...G.inventory.weapons,...G.inventory.armor,...G.inventory.vehicles,...G.inventory.specials];
  const totalCrafted=CRAFTS.filter(cr=>G.blackMarketBuys['crafted_'+cr.id]).length;

  let html=`<div class="panel"><div class="ph"><h2>⚗️ CRAFTING WORKSHOP</h2><span class="psub">Forge weapons of war. ${totalCrafted}/${CRAFTS.length} recipes mastered | Cash: $${G.cash.toLocaleString()}</span></div><div class="pb">`;

  // Tabs
  html+=`<div class="craft-tabs">`;
  html+=`<div class="craft-tab ${tab==='all'?'active':''}" onclick="G.craftTab='all';buildCrafting(document.getElementById('center'))">ALL (${CRAFTS.length})</div>`;
  CRAFT_TIERS.forEach((t,i)=>{
    const ct=CRAFTS.filter(cr=>cr.tier===i).length;
    html+=`<div class="craft-tab ${tab==='t'+i?'active':''}" onclick="G.craftTab='t${i}';buildCrafting(document.getElementById('center'))">${t.split('. ')[1]||t} (${ct})</div>`;
  });
  html+=`<div class="craft-tab ${tab==='craftable'?'active':''}" onclick="G.craftTab='craftable';buildCrafting(document.getElementById('center'))">⚡ CRAFTABLE</div>`;
  html+=`</div>`;

  // Filter
  let filtered=CRAFTS;
  if(tab.startsWith('t'))filtered=CRAFTS.filter(cr=>cr.tier===parseInt(tab[1]));
  else if(tab==='craftable')filtered=CRAFTS.filter(cr=>{
    if(G.blackMarketBuys['crafted_'+cr.id])return false;
    return cr.reqIds.every(rid=>invAll.includes(rid))&&G.cash>=(cr.cash||0)&&G.level>=(cr.lvl||1);
  });

  // Group by tier
  const byTier={};
  filtered.forEach(cr=>{if(!byTier[cr.tier])byTier[cr.tier]=[];byTier[cr.tier].push(cr);});

  for(const[ti,items]of Object.entries(byTier)){
    html+=`<div class="craft-tier-hdr" style="color:${ti>=5?'#ff1744':ti>=4?'var(--bright-gold)':ti>=3?'var(--bright-orange)':ti>=2?'#ab47bc':'var(--text-dim)'}">▸ ${CRAFT_TIERS[ti]}</div>`;
    html+=`<div class="craft-grid">`;
    for(const cr of items){
      const done=G.blackMarketBuys['crafted_'+cr.id];
      const hasItems=cr.reqIds.every(rid=>invAll.includes(rid));
      const hasCash=G.cash>=(cr.cash||0);
      const hasLevel=G.level>=(cr.lvl||1);
      const canCraft=hasItems&&hasCash&&hasLevel&&!done;
      const rc=RARITY_COLORS[cr.rarity]||'#888';
      html+=`<div class="craft-card craft-rarity-${cr.rarity} ${done?'craft-done':''} ${!hasLevel?'craft-locked':''}">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
          <span style="font-size:22px">${cr.e}</span>
          <div style="flex:1">
            <div class="craft-name"><span class="craft-rarity-dot" style="background:${rc}"></span>${cr.n}</div>
            <div style="font-size:8px;font-family:'Cutive Mono',monospace;color:${rc};text-transform:uppercase;letter-spacing:.1em">${cr.rarity}${cr.lvl>1?' · Lv'+cr.lvl:''}</div>
          </div>
          ${done?'<div style="font-size:10px;color:var(--bright-green);font-family:\'Bebas Neue\',sans-serif;">✓ FORGED</div>':''}
        </div>
        <div style="font-size:10px;color:var(--text-dim);font-family:'Special Elite',serif;">${cr.d}</div>
        <div class="craft-result">⚔️ ATK +${cr.result.atk} &nbsp; 🛡️ DEF +${cr.result.def}</div>
        <div class="craft-mats">`;
      // Show each material with have/miss status
      const invCopy=[...invAll];
      for(const rid of cr.reqIds){
        const it=getItem(rid);
        const idx=invCopy.indexOf(rid);
        const have=idx>=0;
        if(have)invCopy.splice(idx,1);
        html+=`<span class="craft-mat ${have?'have':'miss'}">${it.e||'?'} ${it.n||rid}</span>`;
      }
      html+=`</div>`;
      if(cr.cash>0)html+=`<div class="craft-special">💰 Cost: $${cr.cash.toLocaleString()}</div>`;
      if(canCraft)html+=`<button class="bbtn" onclick="craft('${cr.id}')" style="width:100%;margin-top:8px;">⚗️ FORGE</button>`;
      else if(!done&&!hasLevel)html+=`<div style="font-size:9px;color:var(--crimson);margin-top:6px;font-family:'Special Elite',serif;">🔒 Requires Level ${cr.lvl}</div>`;
      html+=`</div>`;
    }
    html+=`</div>`;
  }
  if(!filtered.length)html+=`<div style="color:var(--text-dim);font-family:'Special Elite',serif;padding:20px;text-align:center;">No recipes match this filter.</div>`;
  html+=`</div></div>`;
  c.innerHTML=html;
}

function craft(id){
  const cr=CRAFTS.find(x=>x.id===id);if(!cr)return;
  if(G.level<(cr.lvl||1)){toast('Level too low!','r');return;}
  if(G.cash<(cr.cash||0)){toast(`Need $${(cr.cash||0).toLocaleString()}!`,'r');return;}
  // Remove ingredients
  for(const rid of cr.reqIds){
    const inv=[...G.inventory.weapons,...G.inventory.armor,...G.inventory.vehicles,...G.inventory.specials];
    if(!inv.includes(rid)){toast('Missing materials!','r');return;}
    let removed=false;
    for(const cat of ['weapons','armor','vehicles','specials']){
      const idx=G.inventory[cat].indexOf(rid);
      if(idx>=0&&!removed){G.inventory[cat].splice(idx,1);removed=true;}
    }
  }
  if(cr.cash>0)G.cash-=cr.cash;
  // Add result
  const r=cr.result;
  if(r.t==='weapon')G.inventory.weapons.push(r.id);
  else if(r.t==='armor')G.inventory.armor.push(r.id);
  else if(r.t==='vehicle')G.inventory.vehicles.push(r.id);
  else G.inventory.specials.push(r.id);
  G.blackMarketBuys['crafted_'+id]=true;
  // Register in LOOT table
  LOOT[r.id]={n:cr.n,e:r.e,t:r.t,atk:r.atk||cr.result.atk,def:r.def||cr.result.def,rarity:cr.rarity,crafted:true};
  addLog(`⚗️ FORGED: ${cr.n}! [${cr.rarity.toUpperCase()}] ATK+${cr.result.atk} DEF+${cr.result.def}`,'sp');
  toast(`⚗️ ${cr.n} forged!`,'gold');
  // Bonus XP for crafting
  const xpGain=Math.floor((cr.result.atk+cr.result.def)*(RARITY_ORDER.indexOf(cr.rarity)+1));
  if(xpGain>0)gainXP(xpGain);
  updateAll();save();buildCrafting(document.getElementById('center'));
}

// ══════════════════════════════════════════
// INVENTORY — EXPANDED
// ══════════════════════════════════════════
function getItemRarity(id){
  const l=LOOT[id];if(l&&l.rarity)return l.rarity;
  const it=getItem(id);
  const pow=(it.atk||0)+(it.def||0);
  if(pow>=300)return 'mythic';if(pow>=150)return 'legendary';if(pow>=80)return 'epic';
  if(pow>=40)return 'rare';if(pow>=15)return 'uncommon';return 'common';
}
function getItemSellValue(id){
  const it=getItem(id);
  const pow=(it.atk||0)+(it.def||0);
  const rarMult={common:1,uncommon:1.5,rare:2.5,epic:4,legendary:8,mythic:15}[getItemRarity(id)]||1;
  return Math.max(50,Math.floor(pow*150*rarMult));
}

function buildInventory(c){
  if(!G.invTab)G.invTab='all';
  if(!G.invSort)G.invSort='power';
  const tab=G.invTab;
  const sort=G.invSort;

  let all=[
    ...G.inventory.weapons.map(id=>({...getItem(id),id,cat:'weapon'})),
    ...G.inventory.armor.map(id=>({...getItem(id),id,cat:'armor'})),
    ...G.inventory.vehicles.map(id=>({...getItem(id),id,cat:'vehicle'})),
    ...G.inventory.specials.map(id=>({...getItem(id),id,cat:'special'})),
  ].filter(x=>x&&x.n);

  // Add rarity + sell value
  all.forEach(it=>{it.rarity=getItemRarity(it.id);it.sellVal=getItemSellValue(it.id);it.power=(it.atk||0)+(it.def||0);});

  // Filter by tab
  let filtered=all;
  if(tab!=='all')filtered=all.filter(x=>x.cat===tab);

  // Count uniques
  const counts={};all.forEach(x=>counts[x.id]=(counts[x.id]||0)+1);
  const uniq=filtered.filter((x,i,a)=>a.findIndex(y=>y.id===x.id)===i);

  // Sort
  if(sort==='power')uniq.sort((a,b)=>b.power-a.power);
  else if(sort==='rarity')uniq.sort((a,b)=>RARITY_ORDER.indexOf(b.rarity)-RARITY_ORDER.indexOf(a.rarity));
  else if(sort==='name')uniq.sort((a,b)=>a.n.localeCompare(b.n));
  else if(sort==='value')uniq.sort((a,b)=>b.sellVal-a.sellVal);

  const totAtk=all.reduce((s,x)=>s+(x.atk||0),0);
  const totDef=all.reduce((s,x)=>s+(x.def||0),0);
  const totalValue=all.reduce((s,x)=>s+x.sellVal,0);

  let html=`<div class="panel"><div class="ph"><h2>🎒 INVENTORY</h2><span class="psub">${all.length} items across ${Object.keys(counts).length} types</span></div><div class="pb">`;

  // Summary boxes
  html+=`<div class="inv-summary">
    <div class="inv-sum-box"><div class="n">${all.length}</div><div class="l">TOTAL ITEMS</div></div>
    <div class="inv-sum-box"><div class="n" style="color:var(--crimson)">+${totAtk}</div><div class="l">TOTAL ATK</div></div>
    <div class="inv-sum-box"><div class="n" style="color:var(--bright-blue)">+${totDef}</div><div class="l">TOTAL DEF</div></div>
    <div class="inv-sum-box"><div class="n" style="color:var(--bright-green)">$${fmtCash(totalValue)}</div><div class="l">SELL VALUE</div></div>
  </div>`;

  // Category tabs
  const catCounts={all:all.length,weapon:all.filter(x=>x.cat==='weapon').length,armor:all.filter(x=>x.cat==='armor').length,vehicle:all.filter(x=>x.cat==='vehicle').length,special:all.filter(x=>x.cat==='special').length};
  html+=`<div class="inv-tabs">
    <div class="inv-tab t-all ${tab==='all'?'active':''}" onclick="G.invTab='all';buildInventory(document.getElementById('center'))">ALL (${catCounts.all})</div>
    <div class="inv-tab t-weapon ${tab==='weapon'?'active':''}" onclick="G.invTab='weapon';buildInventory(document.getElementById('center'))">🔫 WEAPONS (${catCounts.weapon})</div>
    <div class="inv-tab t-armor ${tab==='armor'?'active':''}" onclick="G.invTab='armor';buildInventory(document.getElementById('center'))">🛡️ ARMOR (${catCounts.armor})</div>
    <div class="inv-tab t-vehicle ${tab==='vehicle'?'active':''}" onclick="G.invTab='vehicle';buildInventory(document.getElementById('center'))">🚗 VEHICLES (${catCounts.vehicle})</div>
    <div class="inv-tab t-special ${tab==='special'?'active':''}" onclick="G.invTab='special';buildInventory(document.getElementById('center'))">💎 SPECIALS (${catCounts.special})</div>
  </div>`;

  // Sort bar
  html+=`<div style="display:flex;gap:8px;margin-bottom:10px;align-items:center;">
    <span style="font-size:9px;color:var(--text-dim);font-family:'Cutive Mono',monospace;">SORT:</span>
    ${['power','rarity','value','name'].map(s=>`<span style="font-size:10px;font-family:'Bebas Neue',sans-serif;cursor:pointer;color:${sort===s?'var(--bright-gold)':'var(--text-dim)'};letter-spacing:.08em;" onclick="G.invSort='${s}';buildInventory(document.getElementById('center'))">${s.toUpperCase()}</span>`).join(' · ')}
  </div>`;

  if(!uniq.length){
    html+=`<div style="text-align:center;padding:30px;font-family:'Special Elite',serif;color:var(--text-dim);">Your stash is empty. Hit jobs, buy from the Armory, or forge in the Workshop.</div>`;
  }else{
    for(const it of uniq){
      const rc=RARITY_COLORS[it.rarity]||'#888';
      const cnt=counts[it.id]||1;
      const isCrafted=LOOT[it.id]&&LOOT[it.id].crafted;
      html+=`<div class="inv-card r-${it.rarity} ${isCrafted?'r-crafted':''}">
        <div class="inv-emoji">${it.e||'📦'}</div>
        <div>
          <div class="inv-name" style="color:${rc}">${it.n}${cnt>1?` <span style="color:var(--bright-gold);font-size:12px">×${cnt}</span>`:''}</div>
          <div class="inv-sub"><span style="color:${rc};text-transform:uppercase">${it.rarity}</span>${isCrafted?' · ⚗️ CRAFTED':''} · ${it.cat}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:3px;">
          <div class="inv-stats">
            ${(it.atk||0)>0?`<span style="color:var(--crimson)">⚔️+${it.atk}</span>`:''} 
            ${(it.def||0)>0?`<span style="color:var(--bright-blue)">🛡️+${it.def}</span>`:''}
          </div>
          <div style="font-size:9px;color:var(--text-dim);font-family:'Cutive Mono',monospace;">$${fmtCash(it.sellVal)}</div>
          <button class="inv-sell-btn" onclick="sellItem('${it.id}',${it.sellVal})">SELL 1</button>
        </div>
      </div>`;
    }
  }
  html+=`</div></div>`;
  c.innerHTML=html;
}

function sellItem(id,val){
  let removed=false;
  for(const cat of ['weapons','armor','vehicles','specials']){
    const idx=G.inventory[cat].indexOf(id);
    if(idx>=0&&!removed){G.inventory[cat].splice(idx,1);removed=true;}
  }
  if(!removed){toast('Item not found!','r');return;}
  G.cash+=val;G.totalEarned+=val;
  const it=getItem(id);
  addLog(`💰 Sold ${it.n} for $${fmtCash(val)}`,'gold');
  toast(`Sold ${it.n}! +$${fmtCash(val)}`,'gold');
  updateAll();save();buildInventory(document.getElementById('center'));
}


// ══════════════════════════════════════════
// SKILL TREE
// ══════════════════════════════════════════
function buildSkillTree(c){
  let html=`<div class="panel"><div class="ph"><h2>🌳 SKILL TREE</h2><span class="psub">Skill Points Available: <b style="color:var(--bright-gold)">${G.skillPoints}</b> — Spend wisely. Permanent upgrades.</span></div><div class="pb"><div class="stree">`;
  const cats={combat:'⚔️ Combat',hustle:'⚡ Hustle',empire:'💰 Empire'};
  for(const[cat,label]of Object.entries(cats)){
    html+=`<div class="stree-col"><div class="stcol-title" style="color:${cat==='combat'?'var(--crimson)':cat==='hustle'?'var(--bright-blue)':'var(--bright-gold)'}">${label}</div>`;
    for(const sk of SKILL_TREE[cat]){
      const own=G.skilltree[sk.id];
      const reqMet=!sk.req||G.skilltree[sk.req];
      html+=`<div class="skill-node ${own?'sbought':!reqMet?'slocked':''}" onclick="buySk('${sk.id}')">
        <div class="sn-name">${own?'✓ ':''} ${sk.n}</div>
        <div class="sn-desc">${sk.d}</div>
        ${!own?`<div class="sn-cost">Cost: ${sk.cost} SP</div>`:''}
        ${!reqMet&&sk.req?`<div class="sn-req">Requires: ${SKILL_TREE[cat].find(x=>x.id===sk.req)?.n}</div>`:''}
      </div>`;
    }
    html+=`</div>`;
  }
  html+=`</div></div></div>`;
  c.innerHTML=html;
}

function buySk(id){
  const sk=Object.values(SKILL_TREE).flat().find(x=>x.id===id);if(!sk)return;
  if(G.skilltree[id]){toast('Already unlocked!','r');return;}
  if(sk.req&&!G.skilltree[sk.req]){toast('Prerequisite not met!','r');return;}
  if(G.skillPoints<sk.cost){toast(`Need ${sk.cost} skill points!`,'r');return;}
  G.skillPoints-=sk.cost;G.skilltree[id]=true;
  // Apply effects
  if(sk.effect.atk){G.attack+=sk.effect.atk;G.baseAttack+=sk.effect.atk;}
  if(sk.effect.def){G.defense+=sk.effect.def;G.baseDef+=sk.effect.def;}
  if(sk.effect.hp){G.maxHealth+=sk.effect.hp;}
  if(sk.effect.energy){G.maxEnergy+=sk.effect.energy;}
  if(sk.effect.crit){G.critChance+=sk.effect.crit;}
  if(sk.effect.loot){G.lootBonus+=sk.effect.loot;}
  addLog(`🌳 SKILL UNLOCKED: ${sk.n}!`,'sp');toast(`${sk.n} unlocked!`,'gold');
  updateAll();save();buildSkillTree(document.getElementById('center'));
}


// ══════════════════════════════════════════
// CONTRACTS
// ══════════════════════════════════════════
function buildContracts(c){
  let html=`<div class="panel"><div class="ph"><h2>📄 CONTRACTS</h2><span class="psub">High-pay private work. Risk matches reward.</span></div><div class="pb">
  <button onclick="refreshContracts();showPanel('contracts')" style="background:var(--surface3);border:1px solid var(--border);color:var(--text-dim);font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:.08em;padding:5px 14px;cursor:pointer;margin-bottom:12px;">🔄 REFRESH CONTRACTS</button>`;
  for(const ct of G.activeContracts){
    html+=`<div class="ccard">
      <div>
        <div class="cdiff ${ct.diff}">${ct.diff.toUpperCase()}</div>
        <div class="ccn">${ct.n}</div>
        <div class="ccd">${ct.d}</div>
        <div class="ccreq">⚡ ${ct.ec} energy + 💪 ${ct.sc} stamina</div>
      </div>
      <div class="ccrew">
        <div class="cr">$${ct.cb.toLocaleString()}</div>
        <div class="cx">${ct.cx} XP</div>
        <button class="cdo" onclick="doContract('${ct.n}')">EXECUTE</button>
      </div>
    </div>`;
  }
  html+=`</div></div>`;
  c.innerHTML=html;
}
function doContract(name){
  const ct=G.activeContracts.find(x=>x.n===name);if(!ct)return;
  if(G.energy<ct.ec){toast(`Need ${ct.ec} energy!`,'r');return;}
  if(G.stamina<ct.sc){toast(`Need ${ct.sc} stamina!`,'r');return;}
  G.energy-=ct.ec;G.stamina-=ct.sc;
  let diffMult={easy:.85,med:.7,hard:.55,elite:.45}[ct.diff]||.7;if(activeEventObj&&(activeEventObj.effect==='easyMode'))diffMult=Math.max(.1,diffMult-0.20);
  const win=Math.random()>diffMult;
  if(win){
    let cash=ct.cb+(Math.floor(Math.random()*ct.cb*.25));if(G.blackMarketBuys&&G.blackMarketBuys['bm_blackmail'])cash=Math.floor(cash*1.15);
    if(G.blackMarketBuys['bm03'])cash=Math.floor(cash*1.1);
    G.cash+=cash;G.totalEarned+=cash;G.contractsDone++;
    const xp=Math.round(ct.cx*G.xpMult*G.pBonuses.xpMult);gainXP(xp);
    G.respect+=Math.floor(ct.cx/5)+10;
    addLog(`📄 CONTRACT DONE: ${ct.n} — $${cash.toLocaleString()}!`,'gold');
    toast(`Contract complete! $${cash.toLocaleString()}!`,'gold');
  }else{
    const dmg=15+Math.floor(Math.random()*35);G.health=Math.max(1,G.health-dmg);
    addLog(`✗ Contract failed: ${ct.n}. Took ${dmg} dmg.`,'bad');
    toast('Contract failed. Took damage.','r');
  }
  G.activeContracts=G.activeContracts.filter(x=>x.n!==name);
  updateAll();checkMissions();save();buildContracts(document.getElementById('center'));
}

// ══════════════════════════════════════════
// CASINO
// ══════════════════════════════════════════
function buildCasino(c){
  c.innerHTML=`<div class="panel"><div class="ph"><h2>🎲 CASINO</h2><span class="psub">High risk, high reward. Your cash: $${G.cash.toLocaleString()}</span></div><div class="pb">
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
    <div class="casino-game">
      <div class="casino-title">🎲 DICE ROLL</div>
      <div style="font-family:'Special Elite',serif;font-size:12px;color:var(--text-dim);">Roll 4-6 = double. 1-3 = lose.</div>
      <div class="cdisplay" id="dice-d">🎲</div>
      <div class="cbets">${[100,500,1000,5000,10000,50000,200000].map(a=>`<button class="cbet" onclick="rollDice(${a})">$${a>=1000?a/1000+'K':a}</button>`).join('')}</div>
    </div>
    <div class="casino-game">
      <div class="casino-title">🃏 BLACKJACK</div>
      <div style="font-family:'Special Elite',serif;font-size:12px;color:var(--text-dim);">Beat 17. Dealer stands at 17.</div>
      <div id="bj-display" style="font-family:'Cutive Mono',monospace;font-size:12px;min-height:40px;margin:6px 0;"></div>
      <div class="cbets">${[500,2500,10000,50000,250000].map(a=>`<button class="cbet" onclick="startBJ(${a})">$${a>=1000?a/1000+'K':a}</button>`).join('')}</div>
    </div>
  </div>
  <div class="casino-game" style="margin-top:12px;">
    <div class="casino-title">🎰 SLOTS</div>
    <div style="font-family:'Special Elite',serif;font-size:12px;color:var(--text-dim);">3 of a kind = jackpot. 2 = half win.</div>
    <div class="cdisplay" id="slots-d" style="font-size:50px;">🎰 🎰 🎰</div>
    <div id="slots-r" style="text-align:center;font-family:'Special Elite',serif;font-size:13px;margin:4px 0;"></div>
    <div class="cbets" style="justify-content:center;">${[200,1000,5000,25000,100000,500000].map(a=>`<button class="cbet" onclick="spinSlots(${a})">$${a>=1000?a/1000+'K':a}</button>`).join('')}</div>
  </div>
  <div class="casino-game" style="margin-top:12px;">
    <div class="casino-title">🃏 HIGH-LOW</div>
    <div style="font-family:'Special Elite',serif;font-size:12px;color:var(--text-dim);">Guess if next card is higher or lower. 55/45 odds.</div>
    <div id="hl-display" style="font-family:'Bebas Neue',sans-serif;font-size:36px;text-align:center;margin:6px 0;">?</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">
      ${[1000,5000,25000,100000].map(a=>`
        <button class="cbet" onclick="highlow('higher',${a})">⬆️ HIGHER ($${a>=1000?a/1000+'K':a})</button>
        <button class="cbet" onclick="highlow('lower',${a})" style="background:linear-gradient(135deg,#1a0040,#3a0070);">⬇️ LOWER ($${a>=1000?a/1000+'K':a})</button>
      `).join('')}
    </div>
  </div>
  </div></div>`;
}
let hlCard=0;
function rollDice(bet){
  if(G.cash<bet){toast('Not enough!','r');return;}
  G.cash-=bet;
  const r=Math.floor(Math.random()*6)+1;
  const f=['⚀','⚁','⚂','⚃','⚄','⚅'][r-1];
  const el=document.getElementById('dice-d');if(el)el.textContent=f;
  if(r>=4){G.cash+=bet*2;addLog(`🎲 Dice ${r} — Won $${bet.toLocaleString()}!`,'gold');toast(`Rolled ${r}! +$${bet.toLocaleString()}!`,'gold');}
  else if(G.crew&&G.crew['cr_bookie']&&Math.random()<0.10){G.cash+=bet*2;addLog(`🎲 Dice ${r} — Lucky Seven saved you! Won $${bet.toLocaleString()}!`,'gold');toast(`Lucky Seven! +$${bet.toLocaleString()}!`,'gold');}
  else{addLog(`🎲 Dice ${r} — Lost $${bet.toLocaleString()}.`,'bad');}
  updateAll();save();
}
let bjBet=0,bjP=[],bjD=[];
function rc(){return Math.floor(Math.random()*13)+1;}
function hv(h){let s=h.reduce((t,c)=>t+Math.min(10,c),0);if(h.includes(1)&&s+10<=21)s+=10;return s;}
function startBJ(bet){
  if(G.cash<bet){toast('Not enough!','r');return;}
  G.cash-=bet;bjBet=bet;bjP=[rc(),rc()];bjD=[rc(),rc()];renderBJ();updateAll();
}
function renderBJ(){
  const el=document.getElementById('bj-display');if(!el)return;
  const fcard=c=>c>10?['J','Q','K'][c-11]:c===1?'A':c;
  el.innerHTML=`You: ${bjP.map(fcard).join(' ')} = <b style="color:var(--bright-gold)">${hv(bjP)}</b><br>Dealer: ${fcard(bjD[0])} + ?
  <br><button class="cbet" style="margin-top:6px;" onclick="bjHit()">HIT</button> <button class="cbet" onclick="bjStand()">STAND</button>`;
}
function bjHit(){bjP.push(rc());if(hv(bjP)>21){const el=document.getElementById('bj-display');if(el)el.innerHTML=`BUST! (${hv(bjP)}) Lost $${bjBet.toLocaleString()}`;addLog(`🃏 Bust. Lost $${bjBet.toLocaleString()}.`,'bad');save();updateAll();}else renderBJ();}
function bjStand(){while(hv(bjD)<17)bjD.push(rc());const pv=hv(bjP),dv=hv(bjD);const el=document.getElementById('bj-display');if(!el)return;if(dv>21||(pv<=21&&pv>dv)){G.cash+=bjBet*2;el.innerHTML=`WIN! ${pv} vs ${dv}. +$${bjBet.toLocaleString()}`;addLog(`🃏 BJ WIN! +$${bjBet.toLocaleString()}`,'gold');}else if(pv===dv){G.cash+=bjBet;el.innerHTML=`PUSH! ${pv} tie.`;}else{el.innerHTML=`LOSE. ${pv} vs dealer ${dv}. -$${bjBet.toLocaleString()}`;addLog(`🃏 BJ loss. -$${bjBet.toLocaleString()}.`,'bad');}save();updateAll();}
function spinSlots(bet){
  if(G.cash<bet){toast('Not enough!','r');return;}
  G.cash-=bet;
  const syms=['💰','🔫','💎','🎲','💀','⭐','🌹','🦁'];
  const s=[0,1,2].map(()=>syms[Math.floor(Math.random()*syms.length)]);
  const el=document.getElementById('slots-d');const re=document.getElementById('slots-r');
  if(el)el.textContent=s.join(' ');
  let win=0;
  if(s[0]===s[1]&&s[1]===s[2]){
    if(s[0]==='💎')win=bet*20;else if(s[0]==='💰')win=bet*8;else win=bet*4;
    if(re)re.innerHTML=`<span style="color:var(--bright-gold)">JACKPOT! ×${win/bet} = $${win.toLocaleString()}</span>`;
  }else if(s[0]===s[1]||s[1]===s[2]||s[0]===s[2]){win=Math.floor(bet*1.4);if(re)re.innerHTML=`<span style="color:var(--gold)">Pair! ×1.4 = $${win.toLocaleString()}</span>`;}
  else{if(re)re.innerHTML=`<span style="color:var(--text-dim)">No match. -$${bet.toLocaleString()}</span>`;}
  if(win>0){G.cash+=win;addLog(`🎰 ${s.join('')} — $${win.toLocaleString()}!`,'gold');toast(`Slots! +$${win.toLocaleString()}!`,'gold');}
  else addLog(`🎰 ${s.join('')} — lost $${bet.toLocaleString()}.`,'bad');
  updateAll();save();
}
function highlow(guess,bet){
  if(G.cash<bet){toast('Not enough!','r');return;}
  G.cash-=bet;
  const prev=hlCard||Math.floor(Math.random()*13)+1;
  const next=Math.floor(Math.random()*13)+1;
  hlCard=next;
  const el=document.getElementById('hl-display');if(el)el.textContent=next;
  const correct=(guess==='higher'&&next>prev)||(guess==='lower'&&next<prev)||(next===prev&&Math.random()>.5);
  if(correct){G.cash+=bet*2;addLog(`🃏 High-Low WIN! ${prev}→${next}. +$${bet.toLocaleString()}`,'gold');toast(`High-Low win! +$${bet.toLocaleString()}!`,'gold');}
  else{addLog(`🃏 High-Low LOSE. ${prev}→${next}. -$${bet.toLocaleString()}.`,'bad');}
  updateAll();save();
}

// ══════════════════════════════════════════
// PRESTIGE PANEL
// ══════════════════════════════════════════



// ══════════════════════════════════════════
// BOSSES DATA
// ══════════════════════════════════════════
const BOSSES = [
  {id:'boss01',n:'Fat Tony Marchetti',city:'New York',ml:8,maxHP:2000,atk:45,def:20,reward:25000,xpr:1740,d:'The neighbourhood boss. Old school, well connected.'},
  {id:'boss02',n:'Al "Ironside" Capelli',city:'Chicago',ml:20,maxHP:8000,atk:50,def:55,reward:80000,xpr:6795,d:'Runs the whole Chicago outfit with an iron fist.'},
  {id:'boss03',n:'Carlos El Tiburón',city:'Miami',ml:40,maxHP:25000,atk:110,def:130,reward:320000,xpr:18780,d:'The shark of Miami — half the cocaine in Florida.'},
  {id:'boss04',n:'Viktor Krasnov',city:'Moscow',ml:80,maxHP:100000,atk:310,def:50,reward:640000,xpr:49225,d:'Ex-KGB, current Bratva overlord. Thought he was untouchable.'},
  {id:'boss05',n:'The Dragon',city:'Hong Kong',ml:150,maxHP:50000,atk:660,def:100,reward:1200000,xpr:116700,d:'Last surviving founder of the original Triad network.'},
  {id:'boss06',n:'Sheikh Al-Ghaib',city:'Dubai',ml:250,maxHP:200000,atk:1160,def:250,reward:2000000,xpr:238700,d:'Oil money, weapons, connections to every government on earth.'},
  {id:'boss07',n:'Il Padrino Eterno',city:'Palermo',ml:500,maxHP:2000000,atk:2400,def:500,reward:4000000,xpr:592160,d:'Eight hundred years of Sicilian crime bloodline ends here.'},
  {id:'boss08',n:'THE FINAL BOSS',city:'The Void',ml:1200,maxHP:10000000,atk:5900,def:2000,reward:10000000,xpr:2018300,d:'The shadow that has always controlled everything. Until now.'},

  // ── MID-GAME BOSSES ──
  {id:'boss09',n:'The Butcher of Brooklyn',city:'New York',ml:55,maxHP:40000,atk:150,def:120,reward:500000,xpr:30000,d:'Runs a meat processing plant. Not all the meat is beef.'},
  {id:'boss10',n:'Mama Lucia',city:'Italy',ml:65,maxHP:60000,atk:180,def:160,reward:750000,xpr:45000,d:'Grandmotherly face. Kills with kindness. And arsenic.'},
  {id:'boss11',n:'The Surgeon',city:'London',ml:75,maxHP:80000,atk:220,def:180,reward:1000000,xpr:60000,d:'Former Royal Army doctor. Now he operates on people who owe money.'},
  {id:'boss12',n:'El Fantasma',city:'Mexico City',ml:85,maxHP:100000,atk:260,def:200,reward:1500000,xpr:80000,d:'Ghost of the cartel. Nobody has seen his face and lived.'},
  {id:'boss13',n:'Iron Yuri',city:'Moscow',ml:95,maxHP:130000,atk:300,def:240,reward:2000000,xpr:100000,d:'Ex-KGB. Runs Russias arms trade from a bunker under the Kremlin.'},
  // ── LATE GAME BOSSES ──
  {id:'boss14',n:'The Dragon of Hong Kong',city:'Hong Kong',ml:120,maxHP:180000,atk:400,def:320,reward:3500000,xpr:150000,d:'Triad supreme leader. Controls every port in Southeast Asia.'},
  {id:'boss15',n:'Baron Von Death',city:'Berlin',ml:150,maxHP:250000,atk:500,def:400,reward:5000000,xpr:200000,d:'German industrialist who sells weapons to every side of every war.'},
  {id:'boss16',n:'The Pharaoh',city:'Dubai',ml:180,maxHP:350000,atk:600,def:500,reward:8000000,xpr:300000,d:'Oil money, blood diamonds, and an army of mercenaries.'},
  {id:'boss17',n:'Shogun Matsuda',city:'Tokyo',ml:200,maxHP:500000,atk:750,def:600,reward:12000000,xpr:400000,d:'The last true Shogun. Yakuza, tech, politics. He owns Japan.'},
  // ── ENDGAME BOSSES ──
  {id:'boss18',n:'The Archbishop',city:'Italy',ml:250,maxHP:750000,atk:900,def:750,reward:20000000,xpr:600000,d:'Vatican black ops. Gods wrath made flesh.'},
  {id:'boss19',n:'The Oligarch',city:'Moscow',ml:300,maxHP:1000000,atk:1100,def:900,reward:35000000,xpr:800000,d:'Owns three countries. Has his own military. Answers to nobody.'},
  {id:'boss20',n:'The Grandmaster',city:'London',ml:400,maxHP:1500000,atk:1400,def:1100,reward:50000000,xpr:1000000,d:'Chessmaster of global crime. Every move calculated 50 years ahead.'},
  {id:'boss21',n:'The Shadow King',city:'Bangkok',ml:500,maxHP:2000000,atk:1800,def:1400,reward:80000000,xpr:1500000,d:'Controls the Golden Triangle. An army of 50,000.'},
  {id:'boss22',n:'OMEGA Prime',city:'Singapore',ml:700,maxHP:3000000,atk:2500,def:2000,reward:150000000,xpr:2500000,d:'AI-enhanced human. Cybernetic implants. The future of crime.'},
  {id:'boss23',n:'The Eternal Don',city:'New York',ml:1000,maxHP:5000000,atk:4000,def:3000,reward:300000000,xpr:5000000,d:'Has ruled the underworld for 200 years. Nobody knows how.'},
  {id:'boss24',n:'God Emperor of Crime',city:'New York',ml:1200,maxHP:8000000,atk:6000,def:5000,reward:500000000,xpr:8000000,d:'The final boss. Every criminal empire on Earth answers to this one person. Defeat them and you are the undisputed ruler of the underworld.'},
  {id:'boss25',n:'Your Own Legacy',city:'New York',ml:1400,maxHP:10000000,atk:8000,def:6000,reward:1000000000,xpr:15000000,d:'The hardest enemy is yourself. The version of you that already won. Beat your own legend.'},

  {id:'boss26',n:'The Butcher of Bogotá',city:'Brazil',ml:30,maxHP:15000,atk:85,def:35,reward:80000,xpr:5000,d:'Chainsaw enthusiast. Former cartel cleaner.'},
  {id:'boss27',n:'Lady Serpent',city:'Cuba',ml:45,maxHP:30000,atk:140,def:55,reward:150000,xpr:10000,d:'Runs the Caribbean drug routes with an iron fist and a venomous smile.'},
  {id:'boss28',n:'The Accountant',city:'Las Vegas',ml:60,maxHP:50000,atk:170,def:70,reward:250000,xpr:18000,d:'Counts cards. Counts bodies. Counts your days.'},
  {id:'boss29',n:'Black Mamba',city:'Nairobi',ml:90,maxHP:90000,atk:280,def:100,reward:500000,xpr:30000,d:'Fastest killer on the continent. Named for the snake, not the basketball player.'},
  {id:'boss30',n:'The Professor',city:'Paris',ml:110,maxHP:140000,atk:360,def:130,reward:800000,xpr:50000,d:'Orchestrates heists from a lecture hall at the Sorbonne.'},
  {id:'boss31',n:'Colonel Nightmare',city:'Berlin',ml:130,maxHP:200000,atk:440,def:170,reward:1200000,xpr:70000,d:'Former Stasi. Knows every interrogation method invented. And some he created.'},
  {id:'boss32',n:'The Sultan of Sin',city:'Istanbul',ml:160,maxHP:300000,atk:550,def:220,reward:2000000,xpr:100000,d:'Controls every vice in the Eastern Mediterranean.'},
  {id:'boss33',n:'Jade Empress',city:'Singapore',ml:190,maxHP:400000,atk:680,def:280,reward:3000000,xpr:140000,d:'Triad royalty. Commands an army of 50,000.'},
  {id:'boss34',n:'The Ghost of Wall Street',city:'New York',ml:220,maxHP:550000,atk:800,def:350,reward:5000000,xpr:180000,d:'Crashed three economies for profit. Now he wants yours.'},
  {id:'boss35',n:'Warlord Kagan',city:'Moscow',ml:280,maxHP:800000,atk:1000,def:450,reward:8000000,xpr:220000,d:'Former KGB. Current nightmare. Commands a private army.'},
  {id:'boss36',n:'The Puppet Master',city:'London',ml:350,maxHP:1200000,atk:1300,def:550,reward:12000000,xpr:280000,d:'Every leader in Europe owes him. Time to collect.'},
  {id:'boss37',n:'Sun Tzu Reborn',city:'Hong Kong',ml:420,maxHP:1600000,atk:1600,def:700,reward:18000000,xpr:350000,d:'Reads The Art of War for breakfast. Writes new chapters at dinner.'},
  {id:'boss38',n:'The Void Walker',city:'Tokyo',ml:550,maxHP:2500000,atk:2100,def:900,reward:30000000,xpr:450000,d:'Moves between shadows. Kills without sound. Exists between realities.'},
  {id:'boss39',n:'Ozymandias',city:'Dubai',ml:650,maxHP:3500000,atk:2700,def:1100,reward:50000000,xpr:600000,d:'Look upon my works, ye mighty, and despair.'},
  {id:'boss40',n:'The One Who Remains',city:'Italy',ml:800,maxHP:5000000,atk:3500,def:1500,reward:80000000,xpr:800000,d:'Outlived every empire. Built three of his own. Still standing.'},
  {id:'boss41',n:'ALPHA',city:'Singapore',ml:1000,maxHP:7000000,atk:4500,def:2000,reward:120000000,xpr:1000000,d:'The first AI-enhanced criminal. Part human, part algorithm, all danger.'},
  {id:'boss42',n:'The Last Emperor',city:'New York',ml:1100,maxHP:8500000,atk:5500,def:2500,reward:200000000,xpr:1500000,d:'He unified every crime family. To beat him, you must become him.'},
  {id:'boss43',n:'Death Itself',city:'The Void',ml:1300,maxHP:12000000,atk:7000,def:3500,reward:500000000,xpr:3000000,d:'Not a metaphor. Not a nickname. You know what this is.'},
  {id:'boss44',n:'Your Reflection',city:'The Void',ml:1450,maxHP:15000000,atk:9000,def:4500,reward:1000000000,xpr:5000000,d:'The final boss is always yourself. Your stats mirrored. Your sins returned.'},
];

// ══════════════════════════════════════════
// DRUG TRADE DATA
// ══════════════════════════════════════════
const DRUG_TIERS=['Street','Club','Hard','Pharmaceutical','Exotic','Synthetic'];
const DRUGS = [
  // ── STREET ──
  {id:'weed',n:'Cannabis',e:'🌿',buyBase:200,risk:.04,tier:0,d:'Corner bags. Low risk, low reward.'},
  {id:'edibles',n:'Edibles',e:'🍫',buyBase:350,risk:.05,tier:0,d:'Gummy bears that hit different.'},
  {id:'shrooms',n:'Mushrooms',e:'🍄',buyBase:500,risk:.06,tier:0,d:'Organic. Locally sourced. Trippy.'},
  {id:'hash',n:'Hashish',e:'🟫',buyBase:450,risk:.05,tier:0,d:'Pressed resin. Old school money maker.'},
  // ── CLUB ──
  {id:'mdma',n:'MDMA',e:'🟣',buyBase:800,risk:.10,tier:1,d:'Club currency. Everyone wants it.'},
  {id:'ketamine',n:'Ketamine',e:'💊',buyBase:1200,risk:.12,tier:1,d:'K-holes and horse tranquilizer.'},
  {id:'lsd',n:'LSD',e:'🌈',buyBase:600,risk:.08,tier:1,d:'Blotter paper. Infinite mind.'},
  {id:'ghb',n:'GHB',e:'💧',buyBase:900,risk:.11,tier:1,d:'Liquid gold in nightclub circles.'},
  // ── HARD ──
  {id:'coke',n:'Cocaine',e:'❄️',buyBase:2000,risk:.18,tier:2,d:'White gold. The king of party drugs.'},
  {id:'crack',n:'Crack',e:'🪨',buyBase:1500,risk:.22,tier:2,d:'Cheap. Addictive. Extremely profitable.'},
  {id:'meth',n:'Methamphetamine',e:'🔬',buyBase:3500,risk:.20,tier:2,d:'Blue. 99% pure. You know the rest.'},
  {id:'heroin',n:'Heroin',e:'💉',buyBase:6000,risk:.25,tier:2,d:'The destroyer. Maximum margin.'},
  // ── PHARMACEUTICAL ──
  {id:'oxy',n:'Oxycontin',e:'💊',buyBase:4000,risk:.15,tier:3,d:'Prescription pills. Massive demand.'},
  {id:'adderall',n:'Adderall',e:'💊',buyBase:2500,risk:.10,tier:3,d:'Study drugs. College campuses eat this up.'},
  {id:'fentanyl',n:'Fentanyl',e:'☣️',buyBase:12000,risk:.35,tier:3,d:'Microscopic doses. Astronomical profit.'},
  {id:'xanax',n:'Xanax',e:'💊',buyBase:3000,risk:.12,tier:3,d:'Anxiety in a bottle. Huge black market.'},
  // ── EXOTIC ──
  {id:'dmt',n:'DMT',e:'🌀',buyBase:8000,risk:.15,tier:4,d:'The spirit molecule. Ultra rare.'},
  {id:'ayahuasca',n:'Ayahuasca',e:'🍵',buyBase:6000,risk:.12,tier:4,d:'Sacred vine brew. Spiritual tourists pay premium.'},
  {id:'peyote',n:'Peyote',e:'🌵',buyBase:5000,risk:.10,tier:4,d:'Desert cactus. Ancient and powerful.'},
  // ── SYNTHETIC ──
  {id:'synthetic',n:'Compound X',e:'⚗️',buyBase:20000,risk:.30,tier:5,d:'Lab-created. Unknown effects. $$$$.'},
  {id:'neuro',n:'NeuroBoost',e:'🧠',buyBase:35000,risk:.35,tier:5,d:'Cognitive enhancer. Silicon Valley\'s dirty secret.'},
  {id:'chronos',n:'Chronos',e:'⏳',buyBase:50000,risk:.40,tier:5,d:'Time perception drug. One dose = 72 hours of focus.'},
];

// ══════════════════════════════════════════
// ACHIEVEMENTS DATA
// ══════════════════════════════════════════
const ACHIEVEMENTS = [
  // ═══ COMBAT (15) ═══
  {id:'ach01',n:'First Blood',e:'🩸',d:'Win your first fight',cat:'Combat',check:()=>G.fightsWon>=1,bonus:'+3 ATK',apply:()=>{G.baseAttack+=3;G.attack+=3;}},
  {id:'ach_fight10',n:'Brawler',e:'👊',d:'Win 10 fights',cat:'Combat',check:()=>G.fightsWon>=10,bonus:'+5 ATK',apply:()=>{G.baseAttack+=5;G.attack+=5;}},
  {id:'ach05',n:'Warlord',e:'⚔️',d:'Win 100 fights',cat:'Combat',check:()=>G.fightsWon>=100,bonus:'+15 ATK',apply:()=>{G.baseAttack+=15;G.attack+=15;}},
  {id:'ach_fight500',n:'Massacre',e:'💀',d:'Win 500 fights',cat:'Combat',check:()=>G.fightsWon>=500,bonus:'+30 ATK, +15 DEF',apply:()=>{G.baseAttack+=30;G.attack+=30;G.baseDef+=15;G.defense+=15;}},
  {id:'ach_fight2k',n:'God of War',e:'🔱',d:'Win 2,000 fights',cat:'Combat',check:()=>G.fightsWon>=2000,bonus:'+50 ATK, +25 DEF',apply:()=>{G.baseAttack+=50;G.attack+=50;G.baseDef+=25;G.defense+=25;}},
  {id:'ach_kill50',n:'Serial Killer',e:'🔪',d:'Kill 50 enemies',cat:'Combat',check:()=>G.kills>=50,bonus:'+10% Crit',apply:()=>{G.critChance+=10;}},
  {id:'ach_kill500',n:'Angel of Death',e:'☠️',d:'Kill 500 enemies',cat:'Combat',check:()=>G.kills>=500,bonus:'+20% Crit, +20 ATK',apply:()=>{G.critChance+=20;G.baseAttack+=20;G.attack+=20;}},
  {id:'ach06',n:'Ghost',e:'👻',d:'Complete 20 robberies',cat:'Combat',check:()=>G.robberies>=20,bonus:'+25% Rob success',apply:()=>{G.robBonus=(G.robBonus||0)+25;}},
  {id:'ach_rob100',n:'Grand Larcenist',e:'🔓',d:'Complete 100 robberies',cat:'Combat',check:()=>G.robberies>=100,bonus:'+50% Rob success',apply:()=>{G.robBonus=(G.robBonus||0)+50;}},
  {id:'ach_survive',n:'Survivor',e:'❤️',d:'Lose 50 fights and keep going',cat:'Combat',check:()=>G.fightsLost>=50,bonus:'+30 DEF',apply:()=>{G.baseDef+=30;G.defense+=30;}},
  {id:'ach08',n:'Bounty Hunter',e:'🎯',d:'Kill 10 enemies',cat:'Combat',check:()=>G.kills>=10,bonus:'+25% Bounties',apply:()=>{G.bountyMult=(G.bountyMult||1)+.25;}},
  {id:'ach_hitman3',n:'Ghost Protocol',e:'🎯',d:'Complete 3 hitman contracts',cat:'Combat',check:()=>G.hitmanMissions&&Object.values(G.hitmanMissions).filter(x=>x===true).length>=3,bonus:'+5% Crit',apply:()=>{G.critChance+=5;}},
  {id:'ach_hitman8',n:'Shadow Operative',e:'🕵️',d:'Complete all 8 hitman contracts',cat:'Combat',check:()=>G.hitmanMissions&&Object.values(G.hitmanMissions).filter(x=>x===true).length>=8,bonus:'+25 ATK, +10% Crit',apply:()=>{G.baseAttack+=25;G.attack+=25;G.critChance+=10;}},
  {id:'ach11',n:'Boss Slayer',e:'💀',d:'Kill your first boss',cat:'Combat',check:()=>G.bossKills>=1,bonus:'Boss DMG ×2',apply:()=>{G.bossDmgMult=(G.bossDmgMult||1)*2;}},
  {id:'ach_bossall',n:'Boss Killer',e:'👹',d:'Defeat all 8 bosses',cat:'Combat',check:()=>G.bossDefeated&&Object.keys(G.bossDefeated).length>=8,bonus:'+100 ATK, +100 DEF',apply:()=>{G.baseAttack+=100;G.attack+=100;G.baseDef+=100;G.defense+=100;}},

  // ═══ JOBS & HUSTLE (12) ═══
  {id:'ach_job10',n:'Petty Thief',e:'🧤',d:'Complete 10 jobs',cat:'Jobs',check:()=>G.jobsDone>=10,bonus:'+3% Cash',apply:()=>{G.cashMult=(G.cashMult||1)+.03;}},
  {id:'ach02',n:'Hustler',e:'💼',d:'Complete 50 jobs',cat:'Jobs',check:()=>G.jobsDone>=50,bonus:'+10% Cash',apply:()=>{G.cashMult=(G.cashMult||1)+.10;}},
  {id:'ach_job200',n:'Professional',e:'🎖️',d:'Complete 200 jobs',cat:'Jobs',check:()=>G.jobsDone>=200,bonus:'+15% Cash, +5% XP',apply:()=>{G.cashMult=(G.cashMult||1)+.15;G.xpMult=(G.xpMult||1)+.05;}},
  {id:'ach_job1k',n:'Grind Lord',e:'⚙️',d:'Complete 1,000 jobs',cat:'Jobs',check:()=>G.jobsDone>=1000,bonus:'+25% Cash, +10% XP',apply:()=>{G.cashMult=(G.cashMult||1)+.25;G.xpMult=(G.xpMult||1)+.10;}},
  {id:'ach_job5k',n:'Infinite Hustle',e:'♾️',d:'Complete 5,000 jobs',cat:'Jobs',check:()=>G.jobsDone>=5000,bonus:'+40% Cash, +20% XP',apply:()=>{G.cashMult=(G.cashMult||1)+.40;G.xpMult=(G.xpMult||1)+.20;}},
  {id:'ach_master5',n:'Apprentice',e:'📚',d:'Fully master 5 jobs',cat:'Jobs',check:()=>Object.values(G.jobMastery||{}).filter(v=>v>=30).length>=5,bonus:'+5% Loot',apply:()=>{G.lootBonus+=5;}},
  {id:'ach_master20',n:'Expert',e:'🎓',d:'Fully master 20 jobs',cat:'Jobs',check:()=>Object.values(G.jobMastery||{}).filter(v=>v>=30).length>=20,bonus:'+15% Loot',apply:()=>{G.lootBonus+=15;}},
  {id:'ach_master50',n:'Grandmaster',e:'🏅',d:'Fully master 50 jobs',cat:'Jobs',check:()=>Object.values(G.jobMastery||{}).filter(v=>v>=30).length>=50,bonus:'+30% Loot, +10 ATK',apply:()=>{G.lootBonus+=30;G.baseAttack+=10;G.attack+=10;}},
  {id:'ach_contract5',n:'Contractor',e:'📄',d:'Complete 5 contracts',cat:'Jobs',check:()=>G.contractsDone>=5,bonus:'+5% Cash',apply:()=>{G.cashMult=(G.cashMult||1)+.05;}},
  {id:'ach_contract25',n:'Fixer',e:'🔧',d:'Complete 25 contracts',cat:'Jobs',check:()=>G.contractsDone>=25,bonus:'+15% Cash',apply:()=>{G.cashMult=(G.cashMult||1)+.15;}},
  {id:'ach_contract100',n:'The Cleaner',e:'🧹',d:'Complete 100 contracts',cat:'Jobs',check:()=>G.contractsDone>=100,bonus:'+30% Cash, +20 ATK',apply:()=>{G.cashMult=(G.cashMult||1)+.30;G.baseAttack+=20;G.attack+=20;}},
  {id:'ach_op8',n:'Ops Commander',e:'🎖️',d:'Complete all 8 operations',cat:'Jobs',check:()=>{const done=Object.values(G.opProgress||{}).filter(v=>v>=3).length;return done>=8;},bonus:'+20% XP, +20 ATK',apply:()=>{G.xpMult=(G.xpMult||1)+.20;G.baseAttack+=20;G.attack+=20;}},

  // ═══ EMPIRE & MONEY (14) ═══
  {id:'ach_cash50k',n:'Five Figures',e:'💵',d:'Earn $50,000 total',cat:'Empire',check:()=>G.totalEarned>=50000,bonus:'+5% Income',apply:()=>{G.incomeMult=(G.incomeMult||1)+.05;}},
  {id:'ach04',n:'Kingpin',e:'👑',d:'Earn $1,000,000 total',cat:'Empire',check:()=>G.totalEarned>=1000000,bonus:'+15% Income',apply:()=>{G.incomeMult=(G.incomeMult||1)+.15;}},
  {id:'ach_cash100m',n:'Hundred Millionaire',e:'💎',d:'Earn $100,000,000 total',cat:'Empire',check:()=>G.totalEarned>=100000000,bonus:'+30% Income, +15% Cash',apply:()=>{G.incomeMult=(G.incomeMult||1)+.30;G.cashMult=(G.cashMult||1)+.15;}},
  {id:'ach14',n:'Billionaire',e:'💰',d:'Earn $1,000,000,000 total',cat:'Empire',check:()=>G.totalEarned>=1000000000,bonus:'+25% all Cash',apply:()=>{G.cashMult=(G.cashMult||1)+.25;}},
  {id:'ach_cash10b',n:'Decabillionaire',e:'🏦',d:'Earn $10,000,000,000 total',cat:'Empire',check:()=>G.totalEarned>=10000000000,bonus:'×2 all Cash',apply:()=>{G.cashMult=(G.cashMult||1)*2;}},
  {id:'ach07',n:'Landlord',e:'🏢',d:'Own 5 properties',cat:'Empire',check:()=>Object.values(G.properties||{}).reduce((a,b)=>a+b,0)>=5,bonus:'+20% Property Income',apply:()=>{G.incomeMult=(G.incomeMult||1)+.20;}},
  {id:'ach10',n:'Property Mogul',e:'🏙️',d:'Own 15 properties',cat:'Empire',check:()=>Object.values(G.properties||{}).reduce((a,b)=>a+b,0)>=15,bonus:'+50% Property Income',apply:()=>{G.incomeMult=(G.incomeMult||1)+.50;}},
  {id:'ach_prop40',n:'Real Estate Tycoon',e:'🌆',d:'Own 40 properties',cat:'Empire',check:()=>Object.values(G.properties||{}).reduce((a,b)=>a+b,0)>=40,bonus:'×2 Property Income',apply:()=>{G.incomeMult=(G.incomeMult||1)*2;}},
  {id:'ach_mafia10',n:'Small Crew',e:'👥',d:'Grow mafia to 10 members',cat:'Empire',check:()=>G.mafiaSize>=10,bonus:'+5 ATK',apply:()=>{G.baseAttack+=5;G.attack+=5;}},
  {id:'ach_mafia50',n:'Organization',e:'🏛️',d:'Grow mafia to 50 members',cat:'Empire',check:()=>G.mafiaSize>=50,bonus:'+15 ATK, +10 DEF',apply:()=>{G.baseAttack+=15;G.attack+=15;G.baseDef+=10;G.defense+=10;}},
  {id:'ach_mafia200',n:'Syndicate',e:'🌐',d:'Grow mafia to 200 members',cat:'Empire',check:()=>G.mafiaSize>=200,bonus:'+30 ATK, +30 DEF',apply:()=>{G.baseAttack+=30;G.attack+=30;G.baseDef+=30;G.defense+=30;}},
  {id:'ach_crew5',n:'Family Business',e:'👥',d:'Hire 5 crew members',cat:'Empire',check:()=>G.crew&&Object.keys(G.crew).length>=5,bonus:'+10 ATK',apply:()=>{G.baseAttack+=10;G.attack+=10;}},
  {id:'ach_crewAll',n:'Full House',e:'🃏',d:'Hire all 10 crew members',cat:'Empire',check:()=>G.crew&&Object.keys(G.crew).length>=10,bonus:'+25 ATK, +25 DEF, +10% XP',apply:()=>{G.baseAttack+=25;G.attack+=25;G.baseDef+=25;G.defense+=25;G.xpMult=(G.xpMult||1)+.10;}},
  {id:'ach_respect5k',n:'Respected',e:'🎖️',d:'Earn 5,000 Respect',cat:'Empire',check:()=>G.respect>=5000,bonus:'+10% all Income',apply:()=>{G.incomeMult=(G.incomeMult||1)+.10;}},

  // ═══ PROGRESSION & LEVELS (10) ═══
  {id:'ach_lv10',n:'Soldier',e:'🪖',d:'Reach Level 10',cat:'Progression',check:()=>G.level>=10,bonus:'+5 Skill Points',apply:()=>{G.skillPoints+=5;}},
  {id:'ach03',n:'Made Man',e:'🤵',d:'Reach Level 20',cat:'Progression',check:()=>G.level>=20,bonus:'+10 Skill Points',apply:()=>{G.skillPoints+=10;}},
  {id:'ach_lv50',n:'Veteran',e:'⭐',d:'Reach Level 50',cat:'Progression',check:()=>G.level>=50,bonus:'+15 Skill Points',apply:()=>{G.skillPoints+=15;}},
  {id:'ach09',n:'Don',e:'🌹',d:'Reach Level 100',cat:'Progression',check:()=>G.level>=100,bonus:'All stats +5%',apply:()=>{G.baseAttack=Math.floor(G.baseAttack*1.05);G.attack=Math.floor(G.attack*1.05);G.baseDef=Math.floor(G.baseDef*1.05);G.defense=Math.floor(G.defense*1.05);}},
  {id:'ach_lv250',n:'Crime Lord',e:'🦁',d:'Reach Level 250',cat:'Progression',check:()=>G.level>=250,bonus:'+25 ATK, +25 DEF, +20 SP',apply:()=>{G.baseAttack+=25;G.attack+=25;G.baseDef+=25;G.defense+=25;G.skillPoints+=20;}},
  {id:'ach17',n:'Untouchable',e:'🛡️',d:'Reach Level 500',cat:'Progression',check:()=>G.level>=500,bonus:'+50 DEF',apply:()=>{G.baseDef+=50;G.defense+=50;}},
  {id:'ach18',n:'Legend',e:'⭐',d:'Reach Level 1000',cat:'Progression',check:()=>G.level>=1000,bonus:'All stats +20%',apply:()=>{G.baseAttack=Math.floor(G.baseAttack*1.2);G.attack=Math.floor(G.attack*1.2);G.baseDef=Math.floor(G.baseDef*1.2);G.defense=Math.floor(G.defense*1.2);}},
  {id:'ach20',n:'Capo Supremo',e:'◆',d:'Reach Level 1500',cat:'Progression',check:()=>G.level>=1500,bonus:'◆ ULTIMATE POWER ◆',apply:()=>{G.baseAttack+=1000;G.attack+=1000;G.baseDef+=1000;G.defense+=1000;}},
  {id:'ach15',n:'Prestige I',e:'✦',d:'Prestige for the first time',cat:'Progression',check:()=>G.prestige>=1,bonus:'+25% XP forever',apply:()=>{G.xpMult=(G.xpMult||1)+.25;}},
  {id:'ach_prestige5',n:'Prestige V',e:'★',d:'Prestige 5 times',cat:'Progression',check:()=>G.prestige>=5,bonus:'+50% XP, +25% Cash',apply:()=>{G.xpMult=(G.xpMult||1)+.50;G.cashMult=(G.cashMult||1)+.25;}},

  // ═══ TERRITORY & WAR (8) ═══
  {id:'ach12',n:'War General',e:'💣',d:'Win 3 gang wars',cat:'War',check:()=>Object.values(G.gangWarProgress||{}).filter(v=>typeof v==='number'&&v>=100).length>=3,bonus:'War DMG +50%',apply:()=>{G.warDmgMult=(G.warDmgMult||1)+.50;}},
  {id:'ach_gangAll',n:'Conqueror',e:'🏴',d:'Win all 10 gang wars',cat:'War',check:()=>Object.values(G.gangWarProgress||{}).filter(v=>typeof v==='number'&&v>=100).length>=10,bonus:'War DMG ×2, +50 ATK',apply:()=>{G.warDmgMult=(G.warDmgMult||1)*2;G.baseAttack+=50;G.attack+=50;}},
  {id:'ach16',n:'Global Don',e:'🌍',d:'Unlock 10 cities',cat:'War',check:()=>Object.keys(CITIES).filter(id=>G.level>=CITIES[id].unlock).length>=10,bonus:'+30% all Income',apply:()=>{G.incomeMult=(G.incomeMult||1)+.30;}},
  {id:'ach_allCities',n:'World Domination',e:'🌎',d:'Unlock all 20 cities',cat:'War',check:()=>Object.keys(CITIES).filter(id=>G.level>=CITIES[id].unlock).length>=20,bonus:'+50% all Income, +50 ATK',apply:()=>{G.incomeMult=(G.incomeMult||1)+.50;G.baseAttack+=50;G.attack+=50;}},
  {id:'ach_uw1k',n:'Underground Rep',e:'🌃',d:'Reach 1,000 Underworld Rep',cat:'War',check:()=>(G.underworldRep||0)>=1000,bonus:'+10% Cash',apply:()=>{G.cashMult=(G.cashMult||1)+.10;}},
  {id:'ach_uw10k',n:'Shadow Network',e:'🕸️',d:'Reach 10,000 Underworld Rep',cat:'War',check:()=>(G.underworldRep||0)>=10000,bonus:'+25% Cash, +20 ATK',apply:()=>{G.cashMult=(G.cashMult||1)+.25;G.baseAttack+=20;G.attack+=20;}},
  {id:'ach_uwTerr3',n:'Turf Owner',e:'🗺️',d:'Own 3 underworld territories',cat:'War',check:()=>Object.keys(G.ownedTerritories||{}).length>=3,bonus:'+15% Income',apply:()=>{G.incomeMult=(G.incomeMult||1)+.15;}},
  {id:'ach_uwTerrAll',n:'City Controller',e:'🏰',d:'Own all 6 underworld territories',cat:'War',check:()=>Object.keys(G.ownedTerritories||{}).length>=6,bonus:'×2 Income',apply:()=>{G.incomeMult=(G.incomeMult||1)*2;}},

  // ═══ STREET LIFE (10) ═══
  {id:'ach_notoriety1',n:'Known Face',e:'☠️',d:'Reach 500 notoriety',cat:'Street',check:()=>(G.notoriety||0)>=500,bonus:'+5% XP',apply:()=>{G.xpMult=(G.xpMult||1)+.05;}},
  {id:'ach_notoriety5k',n:'Street Legend',e:'🔥',d:'Reach 5,000 notoriety',cat:'Street',check:()=>(G.notoriety||0)>=5000,bonus:'+10% XP',apply:()=>{G.xpMult=(G.xpMult||1)+.10;}},
  {id:'ach_not25k',n:'The Myth',e:'👁️',d:'Reach 25,000 notoriety',cat:'Street',check:()=>(G.notoriety||0)>=25000,bonus:'+25% XP, +20 ATK',apply:()=>{G.xpMult=(G.xpMult||1)+.25;G.baseAttack+=20;G.attack+=20;}},
  {id:'ach_jailbreak',n:'Jailbird',e:'🚔',d:'Get arrested for the first time',cat:'Street',check:()=>(G.jailTimer||0)>0||((G.heat||0)>=100),bonus:'+5% Cash',apply:()=>{G.cashMult=(G.cashMult||1)+0.05;}},
  {id:'ach_heatzero',n:'Cool as Ice',e:'🧊',d:'Clear heat to 0 at high notoriety (10k+)',cat:'Street',check:()=>(G.heat||0)===0&&(G.notoriety||0)>10000,bonus:'+10 DEF',apply:()=>{G.baseDef+=10;G.defense+=10;}},
  {id:'ach13',n:'Drug Lord',e:'💊',d:'Complete 50 drug trades',cat:'Street',check:()=>(G.drugTradeCount||0)>=50,bonus:'Drug profit +25%',apply:()=>{G.drugMult=(G.drugMult||1)+.25;}},
  {id:'ach_drug200',n:'Cartel Boss',e:'🌿',d:'Complete 200 drug trades',cat:'Street',check:()=>(G.drugTradeCount||0)>=200,bonus:'Drug profit +50%',apply:()=>{G.drugMult=(G.drugMult||1)+.50;}},
  {id:'ach_race10',n:'Street Racer',e:'🏎️',d:'Win 10 street races',cat:'Street',check:()=>(G.raceWins||0)>=10,bonus:'+10% Cash',apply:()=>{G.cashMult=(G.cashMult||1)+0.1;}},
  {id:'ach_race50',n:'Speed Demon',e:'💨',d:'Win 50 street races',cat:'Street',check:()=>(G.raceWins||0)>=50,bonus:'+20% Cash, +10 ATK',apply:()=>{G.cashMult=(G.cashMult||1)+0.2;G.baseAttack+=10;G.attack+=10;}},
  {id:'ach_casino10',n:'High Roller',e:'🎲',d:'Win 10 casino games',cat:'Street',check:()=>(G.casinoWins||0)>=10,bonus:'+5% Cash',apply:()=>{G.cashMult=(G.cashMult||1)+.05;}},

  // ═══ CRAFTING & GEAR (8) ═══
  {id:'ach_craft3',n:'Tinkerer',e:'🔨',d:'Craft 3 items',cat:'Gear',check:()=>Object.keys(G.blackMarketBuys||{}).filter(k=>k.startsWith('crafted_')).length>=3,bonus:'+5% Loot',apply:()=>{G.lootBonus+=5;}},
  {id:'ach_craft10',n:'Weaponsmith',e:'⚒️',d:'Craft 10 items',cat:'Gear',check:()=>Object.keys(G.blackMarketBuys||{}).filter(k=>k.startsWith('crafted_')).length>=10,bonus:'+15% Loot',apply:()=>{G.lootBonus+=15;}},
  {id:'ach_craft25',n:'Master Forger',e:'⚗️',d:'Craft 25 items',cat:'Gear',check:()=>Object.keys(G.blackMarketBuys||{}).filter(k=>k.startsWith('crafted_')).length>=25,bonus:'+30% Loot, +15 ATK',apply:()=>{G.lootBonus+=30;G.baseAttack+=15;G.attack+=15;}},
  {id:'ach_craftMythic',n:'Mythic Forger',e:'🌟',d:'Craft a Mythic-tier item',cat:'Gear',check:()=>Object.keys(G.blackMarketBuys||{}).filter(k=>k.startsWith('crafted_cr3')).length>=1,bonus:'+50 ATK, +50 DEF',apply:()=>{G.baseAttack+=50;G.attack+=50;G.baseDef+=50;G.defense+=50;}},
  {id:'ach_inv50',n:'Hoarder',e:'🎒',d:'Own 50 total items',cat:'Gear',check:()=>{const t=(G.inventory.weapons||[]).length+(G.inventory.armor||[]).length+(G.inventory.vehicles||[]).length+(G.inventory.specials||[]).length;return t>=50;},bonus:'+10% Loot',apply:()=>{G.lootBonus+=10;}},
  {id:'ach_darkweb',n:'Ghost in the Machine',e:'🕸️',d:'Purchase any Dark Web item',cat:'Gear',check:()=>Object.keys(G.dwPurchased||{}).length>=1,bonus:'-5 Heat',apply:()=>{G.heat=Math.max(0,(G.heat||0)-5);}},
  {id:'ach_dwAll',n:'Dark Web Lord',e:'💻',d:'Purchase all Dark Web items',cat:'Gear',check:()=>Object.keys(G.dwPurchased||{}).length>=10,bonus:'+30 ATK, +30 DEF',apply:()=>{G.baseAttack+=30;G.attack+=30;G.baseDef+=30;G.defense+=30;}},
  {id:'ach_luxury10',n:'Collector',e:'💎',d:'Own 10 luxury items',cat:'Gear',check:()=>Object.keys(G.luxuryOwned||{}).length>=10,bonus:'+10% all Income',apply:()=>{G.incomeMult=(G.incomeMult||1)+.10;}},

  // ═══ LEGENDARY (5) ═══
  {id:'ach19',n:'Final Boss',e:'☠️',d:'Defeat the Final Boss',cat:'Legendary',check:()=>!!(G.bossDefeated&&G.bossDefeated['boss08']),bonus:'◆ LEGENDARY STATUS ◆',apply:()=>{G.baseAttack+=500;G.attack+=500;G.baseDef+=500;G.defense+=500;}},
  {id:'ach_allAch',n:'Completionist',e:'🏆',d:'Unlock 70 other achievements',cat:'Legendary',check:()=>Object.keys(G.achUnlocked||{}).filter(k=>k!=='ach_allAch').length>=70,bonus:'×2 XP forever',apply:()=>{G.xpMult=(G.xpMult||1)*2;}},
  {id:'ach_trillionaire',n:'Trillionaire',e:'💎',d:'Earn $100 billion total',cat:'Legendary',check:()=>G.totalEarned>=100000000000,bonus:'×3 all Cash',apply:()=>{G.cashMult=(G.cashMult||1)*3;}},
  {id:'ach_skillAll',n:'Enlightened',e:'🧘',d:'Purchase all skill tree nodes',cat:'Legendary',check:()=>Object.keys(G.skilltree||{}).length>=30,bonus:'+100 ATK, +100 DEF',apply:()=>{G.baseAttack+=100;G.attack+=100;G.baseDef+=100;G.defense+=100;}},
  {id:'ach_prestige10',n:'Eternal',e:'♾️',d:'Prestige 10 times',cat:'Legendary',check:()=>G.prestige>=10,bonus:'×2 XP, ×2 Cash, +200 ATK',apply:()=>{G.xpMult=(G.xpMult||1)*2;G.cashMult=(G.cashMult||1)*2;G.baseAttack+=200;G.attack+=200;}},
];
// no longer need NEW_ACHIEVEMENTS - everything is in ACHIEVEMENTS now

const ACH_CATS=['All','Combat','Jobs','Empire','Progression','War','Street','Gear','Legendary'];
const ACH_CAT_EMOJIS={All:'🏆',Combat:'⚔️',Jobs:'💼',Empire:'💰',Progression:'📈',War:'💣',Street:'🌃',Gear:'⚗️',Legendary:'👑'};

// ══════════════════════════════════════════
// BOSS PANEL + LOGIC
// ══════════════════════════════════════════
function buildBosses(c){
  let html=`<div class="panel"><div class="ph"><h2>💀 BOSS FIGHTS</h2><span class="psub">Epic battles. Massive rewards. Each hit costs 3 Stamina.</span></div><div class="pb">`;
  for(const b of BOSSES){
    const locked=G.level<b.ml;
    const defeated=G.bossDefeated&&G.bossDefeated[b.id];
    const hp=G.bossHP&&G.bossHP[b.id]!==undefined?G.bossHP[b.id]:b.maxHP;
    const hpPct=Math.max(0,(hp/b.maxHP)*100);
    const borderColor=defeated?'var(--bright-gold)':locked?'var(--border)':'var(--crimson)';
    const opacity=locked?'0.4':'1';
    let inner='';
    if(defeated) inner+='<div style="font-family:Bebas Neue,sans-serif;font-size:11px;letter-spacing:.2em;color:var(--bright-gold);margin-bottom:4px">DEFEATED</div>';
    if(locked) inner+=`<div style="font-size:11px;color:var(--crimson);margin-bottom:4px">LOCKED — Requires Level ${b.ml}</div>`;
    inner+=`<div style="font-family:Bebas Neue,sans-serif;font-size:20px;color:var(--bright-gold)">${b.n}</div>`;
    inner+=`<div style="font-size:10px;color:var(--crimson);margin-bottom:7px">${b.city} — ${b.d}</div>`;
    inner+=`<div style="background:var(--surface3);height:10px;border-radius:2px;overflow:hidden;margin:6px 0"><div style="background:linear-gradient(90deg,var(--blood),var(--crimson));height:100%;width:${hpPct}%;transition:width .4s"></div></div>`;
    inner+=`<div style="font-size:10px;color:var(--text-dim)">HP: ${fmtCash(hp)} / ${fmtCash(b.maxHP)} | ATK: ${fmtCash(b.atk)} | Reward: $${fmtCash(b.reward)}</div>`;
    if(!locked&&!defeated) inner+=`<button onclick="doBossFight('${b.id}')" style="margin-top:9px;background:linear-gradient(90deg,var(--blood),#5d0000);border:2px solid var(--crimson);color:var(--bright-gold);font-size:16px;letter-spacing:.12em;padding:8px 0;cursor:pointer;display:block;width:100%">ATTACK (3 Stamina)</button>`;
    html+=`<div style="background:linear-gradient(135deg,#1a0000,var(--surface2));border:2px solid ${borderColor};padding:14px;margin-bottom:9px;opacity:${opacity}">${inner}</div>`;
  }
  html+=`</div></div>`;
  c.innerHTML=html;
}
function doBossFight(bid){
  const b=BOSSES.find(x=>x.id===bid);if(!b)return;
  if(G.stamina<3){toast('Need 3 stamina!','r');return;}
  if(G.level<b.ml){toast('Level too low!','r');return;}
  if(G.bossDefeated&&G.bossDefeated[bid]){toast('Already defeated!','r');return;}
  G.stamina-=3;
  if(!G.bossHP)G.bossHP={};
  if(G.bossHP[bid]===undefined)G.bossHP[bid]=b.maxHP;
  let myAtk=G.attack*(1+Math.random()*.4);
  if(G.bossDmgMult)myAtk*=G.bossDmgMult;
  const dmgDealt=Math.max(1,Math.floor(myAtk-b.def*.2+Math.random()*myAtk*.3));
  const dmgTaken=Math.max(5,Math.floor(b.atk*.08+Math.random()*25));
  G.bossHP[bid]=Math.max(0,G.bossHP[bid]-dmgDealt);
  G.health=Math.max(1,G.health-dmgTaken);
  if(G.bossHP[bid]<=0){
    if(!G.bossDefeated)G.bossDefeated={};
    G.bossDefeated[bid]=true;
    G.bossKills=(G.bossKills||0)+1;
    G.cash+=b.reward;G.totalEarned+=b.reward;
    gainXP(b.xpr);G.respect+=b.xpr;
    addLog(`💀 BOSS DEFEATED: ${b.n}! +$${fmtCash(b.reward)}`,'sp');
    toast(`Boss Defeated! +$${fmtCash(b.reward)}!`,'gold');
  }else{
    addLog(`⚔️ Hit ${b.n} for ${fmtCash(dmgDealt)}. HP left: ${fmtCash(G.bossHP[bid])}`,'good');
    addLog(`💥 Boss hit you for ${dmgTaken}. Health: ${G.health}`,'bad');
  }
  checkAchievements();updateAll();save();
  buildBosses(document.getElementById('center'));
}

// ══════════════════════════════════════════
// DRUG TRADE PANEL + LOGIC
// ══════════════════════════════════════════


function buildDrugTrade(c){
  initDrugPrices();
  const totalHeld=Object.values(G.drugInv||{}).reduce((s,v)=>s+v,0);
  const totalValue=DRUGS.reduce((s,d)=>s+(G.drugInv[d.id]||0)*Math.floor((G.drugPrices[d.id]||d.buyBase)*1.3*(G.drugMult||1)),0);
  const dtColors=['var(--text-dim)','var(--bright-purple)','var(--crimson)','var(--bright-blue)','var(--bright-gold)','#ff1744'];

  let html=`<div class="panel"><div class="ph"><h2>💊 DRUG TRADE</h2><span class="psub">${DRUGS.length} products · Prices shift every 30s · Police risk on every sale</span></div><div class="pb">`;

  // Dashboard
  html+=`<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:12px;">
    <div style="background:var(--surface2);border:1px solid var(--border);padding:6px;text-align:center"><div style="font-family:'Bebas Neue',sans-serif;font-size:16px;color:var(--bright-gold)">${G.drugTradeCount||0}</div><div style="font-size:8px;color:var(--text-dim);font-family:'Cutive Mono',monospace">TRADES DONE</div></div>
    <div style="background:var(--surface2);border:1px solid var(--border);padding:6px;text-align:center"><div style="font-family:'Bebas Neue',sans-serif;font-size:16px;color:var(--bright-orange)">${totalHeld}</div><div style="font-size:8px;color:var(--text-dim);font-family:'Cutive Mono',monospace">UNITS HELD</div></div>
    <div style="background:var(--surface2);border:1px solid var(--border);padding:6px;text-align:center"><div style="font-family:'Bebas Neue',sans-serif;font-size:16px;color:var(--bright-green)">$${fmtCash(totalValue)}</div><div style="font-size:8px;color:var(--text-dim);font-family:'Cutive Mono',monospace">STASH VALUE</div></div>
    <div style="background:var(--surface2);border:1px solid var(--border);padding:6px;text-align:center"><div style="font-family:'Bebas Neue',sans-serif;font-size:16px;color:var(--bright-green)">$${fmtCash(G.cash)}</div><div style="font-size:8px;color:var(--text-dim);font-family:'Cutive Mono',monospace">CASH</div></div>
  </div>`;
  html+=`<div style="font-size:9px;color:var(--text-dim);font-family:'Special Elite',serif;padding:6px 8px;background:var(--surface2);border:1px solid var(--border);margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;">
    <span>⚠️ Selling adds heat. High heat = bust risk. Major busts = stash seized + jail. Drug Mult: ×${(G.drugMult||1).toFixed(2)}</span>
    <button onclick="sellAllDrugs()" style="background:var(--blood);border:1px solid var(--crimson);color:#fff;font-family:'Bebas Neue',sans-serif;font-size:10px;padding:4px 10px;cursor:pointer;letter-spacing:.05em;" ${totalHeld>0?'':'disabled'}>💰 SELL ALL STASH</button>
  </div>`;

  for(let ti=0;ti<DRUG_TIERS.length;ti++){
    const tierDrugs=DRUGS.filter(d=>d.tier===ti);
    if(!tierDrugs.length)continue;
    html+=`<div style="font-size:10px;font-family:'Bebas Neue',sans-serif;letter-spacing:.1em;color:${dtColors[ti]};margin:8px 0 4px;opacity:.8">— ${DRUG_TIERS[ti].toUpperCase()} —</div>`;
    for(const d of tierDrugs){
      const price=Math.floor(G.drugPrices[d.id]||d.buyBase);
      const sellPrice=Math.floor(price*(1.3+Math.random()*.25)*(G.drugMult||1));
      const inv=G.drugInv[d.id]||0;
      const canBuy=G.cash>=price;
      const trend=(G.drugPrices[d.id]||d.buyBase)>d.buyBase;
      const profit=sellPrice-price;
      html+=`<div style="background:var(--surface2);border:1px solid var(--border);padding:8px;margin-bottom:4px;display:grid;grid-template-columns:auto 1fr auto auto;gap:8px;align-items:center">
        <div style="font-size:20px">${d.e}</div>
        <div>
          <div style="font-family:'Bebas Neue',sans-serif;font-size:12px">${d.n} <span style="color:${trend?'var(--bright-green)':'var(--crimson)'};font-size:9px">${trend?'▲':'▼'}</span></div>
          <div style="font-size:8px;color:var(--text-dim);font-family:'Special Elite',serif">${d.d}</div>
          <div style="font-size:8px;color:var(--text-dim);font-family:'Cutive Mono',monospace;margin-top:1px">Held: <span style="color:${inv>0?'var(--bright-gold)':'var(--text-dim)'}">${inv}</span> · Risk: ${Math.round(d.risk*100)}% · Profit: <span style="color:${profit>0?'var(--bright-green)':'var(--crimson)'}">$${fmtCash(profit)}</span>/unit</div>
        </div>
        <div style="text-align:right;min-width:65px">
          <div style="font-family:'Bebas Neue',sans-serif;font-size:14px;color:var(--bright-gold)">$${fmtCash(price)}</div>
          <div style="font-size:8px;color:var(--bright-green);font-family:'Cutive Mono',monospace">Sell: $${fmtCash(sellPrice)}</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:3px;">
          <button onclick="buyDrug('${d.id}',${price})" ${canBuy?'':'disabled'} style="background:rgba(0,60,0,.5);border:1px solid ${canBuy?'var(--bright-green)':'var(--border)'};color:${canBuy?'var(--bright-green)':'var(--text-dim)'};font-family:'Bebas Neue',sans-serif;font-size:9px;padding:3px 8px;cursor:${canBuy?'pointer':'not-allowed'};opacity:${canBuy?1:.4}">BUY</button>
          <button onclick="buyDrug('${d.id}',${price},5)" ${G.cash>=price*5?'':'disabled'} style="background:rgba(0,60,0,.3);border:1px solid ${G.cash>=price*5?'var(--green)':'var(--border)'};color:${G.cash>=price*5?'var(--green)':'var(--text-dim)'};font-family:'Bebas Neue',sans-serif;font-size:8px;padding:2px 6px;cursor:pointer;opacity:${G.cash>=price*5?1:.4}">×5</button>
          <button onclick="sellDrugUpgraded('${d.id}',${sellPrice})" ${inv>0?'':'disabled'} style="background:rgba(80,0,0,.5);border:1px solid ${inv>0?'var(--crimson)':'var(--border)'};color:${inv>0?'var(--crimson)':'var(--text-dim)'};font-family:'Bebas Neue',sans-serif;font-size:9px;padding:3px 8px;cursor:${inv>0?'pointer':'not-allowed'};opacity:${inv>0?1:.4}">SELL</button>
        </div>
      </div>`;
    }
  }
  html+=`</div></div>`;
  c.innerHTML=html;
}

function buyDrug(id,price,qty){
  const amt=qty||1;
  const total=price*amt;
  if(G.cash<total){toast('Not enough cash!','r');return;}
  G.cash-=total;
  G.drugInv[id]=(G.drugInv[id]||0)+amt;
  const d=DRUGS.find(x=>x.id===id);
  addLog(`💊 Bought ${amt}× ${d.n} for $${fmtCash(total)}`,'info');
  if(amt>1)toast(`Bought ${amt}× ${d.n}!`,'g');
  updateAll();save();
  buildDrugTrade(document.getElementById('center'));
}

function sellAllDrugs(){
  let totalEarn=0,totalSold=0;
  for(const d of DRUGS){
    const inv=G.drugInv[d.id]||0;
    if(inv<=0)continue;
    const price=Math.floor((G.drugPrices[d.id]||d.buyBase)*(1.3+Math.random()*.2)*(G.drugMult||1));
    for(let i=0;i<inv;i++){
      if(Math.random()<d.risk*(1+(G.heat||0)/200)){continue;}// skip busted units silently
      totalEarn+=price;totalSold++;
    }
    G.drugInv[d.id]=0;
  }
  if(totalSold===0){toast('Nothing to sell or all units busted!','r');return;}
  G.cash+=totalEarn;G.totalEarned+=totalEarn;
  G.drugTradeCount=(G.drugTradeCount||0)+totalSold;
  addHeat(totalSold*2);
  addNotoriety(totalSold);
  addLog(`💊 SOLD ALL: ${totalSold} units for $${fmtCash(totalEarn)}`,'gold');
  toast(`Sold ${totalSold} units! +$${fmtCash(totalEarn)}`,'gold');
  checkAchievements();updateAll();save();
  buildDrugTrade(document.getElementById('center'));
}

function sellDrug(id,price){ sellDrugUpgraded(id,price); }

// ══════════════════════════════════════════
// ACHIEVEMENTS PANEL + LOGIC
// ══════════════════════════════════════════
function buildAchievements(c){
  checkAchievements();
  if(!G.achTab)G.achTab='All';
  const tab=G.achTab;
  const totalUnlocked=ACHIEVEMENTS.filter(a=>G.achUnlocked&&G.achUnlocked[a.id]).length;
  const totalAch=ACHIEVEMENTS.length;
  const pct=Math.floor((totalUnlocked/totalAch)*100);

  let html=`<div class="panel"><div class="ph"><h2>🏆 ACHIEVEMENTS</h2><span class="psub">${totalUnlocked}/${totalAch} unlocked (${pct}%) — each grants permanent bonuses</span></div><div class="pb">`;

  // Progress bar
  html+=`<div style="background:var(--surface3);height:10px;border-radius:2px;overflow:hidden;margin-bottom:12px;"><div style="background:linear-gradient(90deg,var(--gold),var(--bright-gold));height:100%;width:${pct}%;transition:width .4s;"></div></div>`;

  // Category tabs
  html+=`<div style="display:flex;gap:4px;margin-bottom:12px;flex-wrap:wrap;">`;
  for(const cat of ACH_CATS){
    const catAchs=cat==='All'?ACHIEVEMENTS:ACHIEVEMENTS.filter(a=>a.cat===cat);
    const catDone=catAchs.filter(a=>G.achUnlocked&&G.achUnlocked[a.id]).length;
    const isActive=tab===cat;
    const catColor=cat==='Legendary'?'var(--bright-gold)':cat==='Combat'?'var(--crimson)':cat==='Jobs'?'var(--bright-blue)':cat==='Empire'?'var(--bright-green)':cat==='War'?'var(--bright-orange)':cat==='Street'?'var(--bright-purple)':cat==='Gear'?'#FF9800':'var(--text-dim)';
    html+=`<div onclick="G.achTab='${cat}';buildAchievements(document.getElementById('center'))" style="background:${isActive?'var(--surface2)':'var(--surface3)'};border:1px solid ${isActive?catColor:'var(--border)'};padding:4px 10px;cursor:pointer;font-family:'Bebas Neue',sans-serif;font-size:11px;letter-spacing:.08em;color:${isActive?catColor:'var(--text-dim)'};transition:all .12s;">${ACH_CAT_EMOJIS[cat]||''} ${cat} <span style="font-size:9px;opacity:.7">${catDone}/${catAchs.length}</span></div>`;
  }
  html+=`</div>`;

  // Filter achievements
  const filtered=tab==='All'?ACHIEVEMENTS:ACHIEVEMENTS.filter(a=>a.cat===tab);

  html+=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">`;
  for(const a of filtered){
    const done=G.achUnlocked&&G.achUnlocked[a.id];
    const catColor=a.cat==='Legendary'?'var(--bright-gold)':a.cat==='Combat'?'var(--crimson)':a.cat==='Jobs'?'var(--bright-blue)':a.cat==='Empire'?'var(--bright-green)':a.cat==='War'?'var(--bright-orange)':a.cat==='Street'?'var(--bright-purple)':a.cat==='Gear'?'#FF9800':'var(--text-dim)';
    const isLegendary=a.cat==='Legendary';
    html+=`<div style="background:${done?(isLegendary?'linear-gradient(135deg,#2a1a00,#1a0a00,var(--surface2))':'linear-gradient(135deg,#1a1000,var(--surface2))'):'var(--surface2)'};border:1px solid ${done?(isLegendary?'var(--bright-gold)':'var(--gold)'):'var(--border)'};padding:10px;transition:all .2s;${isLegendary&&done?'box-shadow:0 0 15px rgba(255,215,0,.15);':''}">
      <div style="display:flex;align-items:center;gap:8px;">
        <div style="font-size:24px;${done?'':'filter:grayscale(1) opacity(.2)'}">${a.e}</div>
        <div style="flex:1;min-width:0;">
          <div style="font-family:'Bebas Neue',sans-serif;font-size:13px;color:${done?catColor:'var(--text-dim)'};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${a.n}</div>
          <div style="font-size:9px;color:var(--text-dim);font-family:'Special Elite',serif;line-height:1.4;">${a.d}</div>
        </div>
        ${done?'<div style="font-size:8px;color:var(--bright-gold);font-family:\'Bebas Neue\',sans-serif;letter-spacing:.1em;white-space:nowrap;">✓ DONE</div>':''}
      </div>
      <div style="font-size:9px;color:var(--bright-green);margin-top:4px;font-family:'Cutive Mono',monospace;">${a.bonus}</div>
      ${!done?`<div style="font-size:8px;color:${catColor};opacity:.5;margin-top:2px;font-family:'Cutive Mono',monospace;">${a.cat}</div>`:''}
    </div>`;
  }
  html+=`</div></div></div>`;
  c.innerHTML=html;
}



// ══════════════════════════════════════════
// SAVE MANAGER PANEL
// ══════════════════════════════════════════
function buildSaveMgr(c){
  const hasSave=!!localStorage.getItem('mw2_save');
  const saveSize=hasSave?Math.round(localStorage.getItem('mw2_save').length/1024)+'KB':'—';
  c.innerHTML=`<div class="panel"><div class="ph"><h2>💾 SAVE MANAGER</h2><span class="psub">Export your save to move it between devices. Import to restore.</span></div><div class="pb">

    <div style="background:var(--surface2);border:1px solid var(--border);padding:14px;margin-bottom:16px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:.15em;color:var(--text-dim);margin-bottom:8px;">CURRENT SAVE</div>
      <div style="font-family:'Cutive Mono',monospace;font-size:11px;line-height:2;color:var(--text-dim);">
        Player: <span style="color:var(--bright-gold)">${G.name}</span><br>
        Level: <span style="color:var(--bright-gold)">${G.level}</span> &nbsp;|&nbsp;
        Prestige: <span style="color:var(--bright-gold)">${G.prestige}</span> &nbsp;|&nbsp;
        Cash: <span style="color:var(--bright-green)">$${G.cash.toLocaleString()}</span><br>
        Save size: <span style="color:var(--text)">${saveSize}</span> &nbsp;|&nbsp;
        Status: <span style="color:${hasSave?'var(--bright-green)':'var(--crimson)'}">${hasSave?'SAVED':'NO SAVE FOUND'}</span>
      </div>
    </div>

    <div style="font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:.15em;color:var(--text-dim);margin-bottom:8px;">EXPORT SAVE</div>
    <p style="font-family:'Special Elite',serif;font-size:11px;color:var(--text-dim);margin-bottom:10px;">Downloads your save as a .json file. Copy it to your other device and import it there.</p>
    <button class="save-btn" onclick="exportSave()">📤 DOWNLOAD SAVE FILE</button>

    <div style="font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:.15em;color:var(--text-dim);margin:16px 0 8px;">IMPORT SAVE</div>
    <p style="font-family:'Special Elite',serif;font-size:11px;color:var(--text-dim);margin-bottom:10px;">Select a save file exported from another device. This will overwrite your current save.</p>
    <input type="file" id="import-file-input" accept=".json" style="display:none" onchange="importSave(this)">
    <button class="load-btn" onclick="document.getElementById('import-file-input').click()">📥 IMPORT SAVE FILE</button>

    <div style="font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:.15em;color:var(--text-dim);margin:16px 0 8px;">DANGER ZONE</div>
    <p style="font-family:'Special Elite',serif;font-size:11px;color:var(--text-dim);margin-bottom:10px;">Wipes your save completely and resets to a new game. Cannot be undone.</p>
    <button class="danger-btn" onclick="resetSave()">🗑️ WIPE SAVE &amp; START OVER</button>

  </div></div>`;
}

function exportSave(){
  const data=localStorage.getItem('mw2_save');
  if(!data){toast('No save to export!','r');return;}
  const blob=new Blob([data],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  const ts=new Date().toISOString().slice(0,10);
  a.href=url;
  a.download=`mafia-wars-save-${G.name.replace(/[^a-z0-9]/gi,'-')}-lv${G.level}-${ts}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast('Save exported!','g');
  addLog('💾 Save exported to file.','gold');
}

function importSave(input){
  const file=input.files[0];
  if(!file){return;}
  const reader=new FileReader();
  reader.onload=function(e){
    try{
      const data=JSON.parse(e.target.result);
      // Validate it looks like a real save
      if(!data.name||data.level===undefined){
        toast('Invalid save file!','r');return;
      }
      localStorage.setItem('mw2_save',e.target.result);
      Object.assign(G,data);
      safeInitNewFields();
      buildCityList();showPanel('jobs');updateAll();
      toast('Save imported! Welcome back, '+G.name+'!','g');
      addLog('💾 Save imported successfully.','sp');
    }catch(err){
      toast('Failed to read save file.','r');
      console.error('Import error:',err);
    }
    // Reset input so same file can be re-imported if needed
    input.value='';
  };
  reader.readAsText(file);
}

function resetSave(){
  if(!confirm('⚠️ This will PERMANENTLY WIPE your save and restart from scratch.\n\nAre you absolutely sure?')){return;}
  if(!confirm('FINAL WARNING: All progress will be lost forever. Continue?')){return;}
  // Stop all intervals to prevent auto-save from re-saving
  window._wiping=true;
  const highId=setInterval(()=>{},9999);for(let i=1;i<=highId;i++)clearInterval(i);
  // Nuke the local save (but preserve Supabase auth keys)
  try{localStorage.removeItem('mw2_save');}catch(e){}
  // Also wipe cloud save if logged in
  if(window._sb&&window._sbUser){
    try{
      window._sb.from('game_saves').delete().eq('user_id',window._sbUser.id).then(()=>{
        console.log('Cloud save wiped');
      });
    }catch(e){console.error('Cloud wipe failed:',e);}
  }
  toast('Save wiped. Reloading...','r');
  setTimeout(()=>location.reload(),1000);
}


// ══════════════════════════════════════════
// HEAT / WANTED SYSTEM
// ══════════════════════════════════════════
const HEAT_LEVELS = [
  {min:0,  max:20,  label:'CLEAN',      color:'#4CAF50', desc:'No heat. Moving freely.'},
  {min:20, max:40,  label:'NOTICED',    color:'#FF9800', desc:'Local cops watching you.'},
  {min:40, max:60,  label:'WANTED',     color:'#FF5722', desc:'Detectives on your trail.'},
  {min:60, max:80,  label:'HOT',        color:'#F44336', desc:'FBI has a file on you.'},
  {min:80, max:95,  label:'SCORCHING',  color:'#D32F2F', desc:'Task force deployed.'},
  {min:95, max:101, label:'MOST WANTED',color:'#B71C1C', desc:'National manhunt. You are the target.'},
];







function showJail(){
  const o=document.getElementById('jail-overlay');
  if(o)o.style.display='flex';
  updateJailTimer();
}



// ══════════════════════════════════════════
// UPGRADED DRUG TRADE CONSEQUENCES
// ══════════════════════════════════════════
function sellDrugUpgraded(id,price){
  const d=DRUGS.find(x=>x.id===id);if(!d)return;
  if((G.drugInv[id]||0)<=0){toast('Nothing to sell!','r');return;}

  // Heat penalty on every drug sale
  addHeat(d.risk*20);

  if(Math.random()<d.risk*(1+(G.heat||0)/200)){
    // BUSTED logic based on heat level
    const heatMult=1+(G.heat||0)/100;
    const fine=Math.floor(price*3*heatMult);

    if(G.heat>70&&Math.random()<.4){
      // Major bust - lose entire stash of this drug + jail
      const seized=G.drugInv[id];
      G.drugInv[id]=0;
      G.cash=Math.max(0,G.cash-fine);
      addLog('🚔 MAJOR BUST! Lost '+seized+'x '+d.n+' + fined $'+fmtCash(fine),'bad');
      toast('MAJOR BUST! Stash seized!','r');
      triggerJail(30+Math.floor(G.level/5));
    } else {
      // Minor bust - lose the unit + fine
      G.drugInv[id]--;
      G.cash=Math.max(0,G.cash-fine);
      addLog('🚔 BUSTED selling '+d.n+'! Fined $'+fmtCash(fine),'bad');
      toast('Busted! Fined $'+fmtCash(fine),'r');
    }
  }else{
    G.drugInv[id]--;
    G.drugTradeCount=(G.drugTradeCount||0)+1;
    G.cash+=price;G.totalEarned+=price;
    gainXP(Math.floor(price/500));
    addLog('💊 Sold '+d.n+' for $'+fmtCash(price),'gold');
    toast('+$'+fmtCash(price)+'!','gold');
    // notoriety for drug dealing
    G.notoriety=(G.notoriety||0)+1;
  }
  checkAchievements();updateAll();save();
  buildDrugTrade(document.getElementById('center'));
}

// ══════════════════════════════════════════
// BLACK MARKET - STING OPERATIONS
// ══════════════════════════════════════════
function buyBMUpgraded(id){
  const it=BLACK_MARKET.find(x=>x.id===id);if(!it)return;
  if(G.cash<it.p){toast('Not enough cash!','r');return;}
  if(G.level<(it.ml||1)){toast('Level too low!','r');return;}
  if(G.blackMarketBuys[id]){toast('Already owned!','r');return;}

  // Expensive items have sting risk, scales with heat
  const stingChance=(it.p>500000?0.08:it.p>200000?0.04:0.01)*Math.max(1,(G.heat||0)/40);

  if(Math.random()<stingChance){
    G.cash-=it.p;
    const heatAdd=15+Math.floor(it.p/100000);
    addHeat(heatAdd);
    toast('🚔 IT\'S A STING! The feds were watching!','r');
    addLog('🚔 BLACK MARKET STING! Lost $'+fmtCash(it.p),'bad');
    triggerJail(20+Math.floor(G.level/8));
    updateAll();save();
    buildBlackMarket(document.getElementById('center'));
    return;
  }

  // Success
  G.cash-=it.p;G.blackMarketBuys[id]=true;
  addHeat(5);
  G.notoriety=(G.notoriety||0)+Math.floor(it.p/200000)+1;
  // Apply specials
  if(it.special==='energybonus'){G.maxEnergy=Math.floor(G.maxEnergy*1.25);}
  else if(it.special==='lootbonus'){G.lootBonus+=20;}
  else if(it.special==='xpbonus'){G.xpMult*=2;}
  else if(it.special==='xpChip'){G.xpMult=(G.xpMult||1)+.15;}
  else if(it.special==='mafia50'){G.mafiaSize+=50;}
  else if(it.special==='mercArmy'){G.mafiaSize+=100;}
  else if(it.special==='reduceheat'){coolHeat(40);toast('Heat reduced by 40!','g');}
  else if(it.special==='heatReduction'){/* passive - handled in heat calc */}
  else if(it.special==='silencer'){/* passive - handled in fight heat */}
  else if(it.special==='fakeId'){/* passive - bail cost reduction */}
  else if(it.special==='jobCash'){G.cashMult=(G.cashMult||1)+.10;}
  else if(it.special==='contractCash'){G.cashMult=(G.cashMult||1)+.15;}
  else if(it.special==='robSuccess'){G.robBonus=(G.robBonus||0)+20;}
  else if(it.special==='cashbonus'){G.cashMult=(G.cashMult||1)+.10;}
  else if(it.special==='propbonus'){/* handled in calcIncome */}
  else if(it.special==='staminaBonus'){G.maxStamina+=15;G.stamina=Math.min(G.stamina+15,G.maxStamina);}
  else if(it.special==='bossDmg3x'){G.bossDmgMult=(G.bossDmgMult||1)*3;}
  else if(it.special==='tripleRegen'){/* handled in regen loop */}
  else if(it.special==='olympus'){G.cashMult=(G.cashMult||1)+.50;}
  else if(it.special==='reality'){G.incomeMult=(G.incomeMult||1)*3;G.xpMult=(G.xpMult||1)*2;}
  // Direct stat bonuses
  if(it.atk>0){G.attack+=it.atk;G.baseAttack+=it.atk;}
  if(it.def>0){G.defense+=it.def;G.baseDef+=it.def;}
  addLog('🕶️ BLACK MARKET: '+it.n+' acquired!','sp');
  toast(it.e+' '+it.n+' acquired!','gold');
  checkAchievements();updateAll();save();buildBlackMarket(document.getElementById('center'));
}

// ══════════════════════════════════════════
// CREW SYSTEM
// ══════════════════════════════════════════
const CREW_TIERS=['Inner Circle','Specialists','Elite Operatives','Legends','Mythic'];
const CREW_ROSTER = [
  // ── INNER CIRCLE ──
  {id:'cr01',n:'Frankie the Wheel',role:'Driver',e:'🚗',desc:'Veteran wheelman. Never missed a getaway.',cost:50000,lv:5,tier:0,bonus:'Rob success +15%',apply:()=>{G.robBonus=(G.robBonus||0)+15;}},
  {id:'cr02',n:'Doc Moretti',role:'Surgeon',e:'🩺',desc:'Keeps the crew breathing. No questions.',cost:80000,lv:8,tier:0,bonus:'Passive healing every 60s',apply:()=>{}},
  {id:'cr03',n:'The Accountant',role:'Laundryman',e:'💼',desc:'Makes dirty money clean. Skims nothing.',cost:120000,lv:12,tier:0,bonus:'All cash +10%',apply:()=>{G.cashMult=(G.cashMult||1)+.10;}},
  {id:'cr04',n:'Knife Viktor',role:'Enforcer',e:'🔪',desc:'Sends a message without saying a word.',cost:100000,lv:10,tier:0,bonus:'ATK +25, Crit +5%',apply:()=>{G.baseAttack+=25;G.attack+=25;G.critChance+=5;}},
  {id:'cr06',n:'Big Sal',role:'Muscle',e:'💪',desc:'Six foot five of pure intimidation.',cost:150000,lv:15,tier:0,bonus:'DEF +30, HP +50',apply:()=>{G.baseDef+=30;G.defense+=30;G.maxHealth+=50;G.health=Math.min(G.health+50,G.maxHealth);}},
  {id:'cr_bookie',n:'Lucky Seven',role:'Bookie',e:'🎰',desc:'Runs numbers in three boroughs.',cost:75000,lv:8,tier:0,bonus:'Casino wins +10%',apply:()=>{}},
  // ── SPECIALISTS ──
  {id:'cr05',n:'Roxanne Cruz',role:'Intel',e:'🕵️',desc:'Ex-CIA. Knows what the feds know before they do.',cost:200000,lv:18,tier:1,bonus:'Heat gain -30%',apply:()=>{}},
  {id:'cr07',n:'Chen Li',role:'Hacker',e:'💻',desc:'Can erase your record from any database.',cost:300000,lv:25,tier:1,bonus:'Heat cools 3/tick',apply:()=>{}},
  {id:'cr08',n:'Father Miguel',role:'Priest',e:'⛪',desc:'Washes sins. Also money.',cost:175000,lv:20,tier:1,bonus:'Property income +20%',apply:()=>{G.incomeMult=(G.incomeMult||1)+.20;}},
  {id:'cr_chemist',n:'Dr. Heisenberg',role:'Chemist',e:'⚗️',desc:'Produces pharmaceutical-grade product.',cost:250000,lv:22,tier:1,bonus:'Drug profit +30%',apply:()=>{G.drugMult=(G.drugMult||1)+.30;}},
  {id:'cr_forger',n:'Picasso Pete',role:'Forger',e:'🎨',desc:'Documents, money, art. All indistinguishable.',cost:220000,lv:20,tier:1,bonus:'Loot +10%',apply:()=>{G.lootBonus+=10;}},
  {id:'cr_mechanic',n:'Turbo Tony',role:'Mechanic',e:'🔧',desc:'Makes any car 20% faster. Magic hands.',cost:180000,lv:18,tier:1,bonus:'Race win chance +8%',apply:()=>{}},
  // ── ELITE OPERATIVES ──
  {id:'cr09',n:'The Ghost',role:'Assassin',e:'👻',desc:'No name. No record. Just results.',cost:500000,lv:35,tier:2,bonus:'Boss DMG +30%, Hitman +8%',apply:()=>{G.bossDmgMult=(G.bossDmgMult||1)+.30;}},
  {id:'cr10',n:'Maria Vega',role:'Consigliere',e:'👑',desc:'Has advised three Dons. All died of old age.',cost:750000,lv:45,tier:2,bonus:'XP +25%',apply:()=>{G.xpMult=(G.xpMult||1)+.25;}},
  {id:'cr_sniper',n:'One Shot',role:'Marksman',e:'🎯',desc:'3,200m confirmed kill. Current record.',cost:600000,lv:40,tier:2,bonus:'ATK +50, Crit +8%',apply:()=>{G.baseAttack+=50;G.attack+=50;G.critChance+=8;}},
  {id:'cr_lawyer',n:'Devil\'s Advocate',role:'Lawyer',e:'⚖️',desc:'Never lost a case. Witnesses disappear.',cost:800000,lv:50,tier:2,bonus:'Bail -50%, jail -30%',apply:()=>{}},
  {id:'cr_pilot',n:'Maverick',role:'Pilot',e:'✈️',desc:'Flies anything, anywhere, under any radar.',cost:500000,lv:38,tier:2,bonus:'Race +5%, DEF +10',apply:()=>{G.baseDef+=10;G.defense+=10;}},
  {id:'cr_demoman',n:'Kaboom',role:'Demolitions',e:'💣',desc:'If it\'s standing, he can bring it down.',cost:650000,lv:42,tier:2,bonus:'Gang War DMG +40%',apply:()=>{G.warDmgMult=(G.warDmgMult||1)+.40;}},
  // ── LEGENDS ──
  {id:'cr_shadow',n:'The Shadow',role:'Phantom',e:'🌑',desc:'No one has seen his face.',cost:2000000,lv:80,tier:3,bonus:'ATK +100, heat halved',apply:()=>{G.baseAttack+=100;G.attack+=100;}},
  {id:'cr_oracle',n:'The Oracle',role:'Seer',e:'🔮',desc:'Predicts every move. Every betrayal.',cost:3000000,lv:100,tier:3,bonus:'XP +50%, Cash +20%',apply:()=>{G.xpMult=(G.xpMult||1)+.50;G.cashMult=(G.cashMult||1)+.20;}},
  {id:'cr_architect',n:'The Architect',role:'Mastermind',e:'🏗️',desc:'Designs operations that never fail.',cost:5000000,lv:150,tier:3,bonus:'Income +25%',apply:()=>{G.incomeMult=(G.incomeMult||1)+.25;}},
  {id:'cr_reaper',n:'The Reaper',role:'Executioner',e:'💀',desc:'The last face 200 people ever saw.',cost:8000000,lv:200,tier:3,bonus:'ATK +200, Kill +15%',apply:()=>{G.baseAttack+=200;G.attack+=200;}},
  {id:'cr_don',n:'Don Corrado',role:'Retired Don',e:'🌹',desc:'The most powerful man alive. He chose you.',cost:15000000,lv:300,tier:3,bonus:'ALL +15%, income +30%',apply:()=>{G.baseAttack=Math.floor(G.baseAttack*1.15);G.attack=Math.floor(G.attack*1.15);G.baseDef=Math.floor(G.baseDef*1.15);G.defense=Math.floor(G.defense*1.15);G.incomeMult=(G.incomeMult||1)+.30;}},
  {id:'cr_warlord',n:'General Volkov',role:'Warlord',e:'🎖️',desc:'Commanded 50,000 troops. Now commands yours.',cost:10000000,lv:250,tier:3,bonus:'ATK +150, DEF +100',apply:()=>{G.baseAttack+=150;G.attack+=150;G.baseDef+=100;G.defense+=100;}},
  // ── MYTHIC ──
  {id:'cr_god',n:'The Unseen Hand',role:'God',e:'🌟',desc:'Controls world markets from a submarine. Nobody knows the name.',cost:30000000,lv:400,tier:4,bonus:'×2 all income, +300 ATK',apply:()=>{G.incomeMult=(G.incomeMult||1)*2;G.baseAttack+=300;G.attack+=300;}},
  {id:'cr_time',n:'The Timekeeper',role:'Temporal',e:'⏳',desc:'Always one step ahead. Literally.',cost:50000000,lv:500,tier:4,bonus:'×2 XP, energy regen ×2',apply:()=>{G.xpMult=(G.xpMult||1)*2;}},
  {id:'cr_death',n:'Azrael',role:'Death',e:'☠️',desc:'The angel of death walks beside you.',cost:80000000,lv:600,tier:4,bonus:'ATK +500, Crit +20%',apply:()=>{G.baseAttack+=500;G.attack+=500;G.critChance+=20;}},
  {id:'cr_fate',n:'The Fateweaver',role:'Destiny',e:'🔮',desc:'Weaves probability itself. Nothing is random.',cost:120000000,lv:800,tier:4,bonus:'Crit +30%, Loot +50%',apply:()=>{G.critChance+=30;G.lootBonus+=50;}},
  {id:'cr_omega',n:'OMEGA',role:'AI Overlord',e:'🤖',desc:'Post-human intelligence. Runs your empire at machine speed.',cost:200000000,lv:1000,tier:4,bonus:'×3 cash, ×3 income, +1000 ATK',apply:()=>{G.cashMult=(G.cashMult||1)*3;G.incomeMult=(G.incomeMult||1)*3;G.baseAttack+=1000;G.attack+=1000;}},
];

function buildCrew(c){
  if(!G.crew)G.crew={};
  const hired=Object.keys(G.crew).length;
  const ctColors=['var(--text-dim)','var(--bright-blue)','var(--bright-orange)','var(--bright-gold)','#ff1744'];

  let html='<div class="panel"><div class="ph"><h2>👥 YOUR CREW</h2><span class="psub">'+hired+'/'+CREW_ROSTER.length+' hired · Each gives permanent bonuses</span></div><div class="pb">';

  // Dashboard
  html+=`<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:12px;">
    <div style="background:var(--surface2);border:1px solid var(--border);padding:6px;text-align:center"><div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:var(--bright-gold)">${hired}/${CREW_ROSTER.length}</div><div style="font-size:8px;color:var(--text-dim);font-family:'Cutive Mono',monospace">CREW HIRED</div></div>
    <div style="background:var(--surface2);border:1px solid var(--border);padding:6px;text-align:center"><div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:var(--bright-green)">$${fmtCash(G.cash)}</div><div style="font-size:8px;color:var(--text-dim);font-family:'Cutive Mono',monospace">CASH</div></div>
    <div style="background:var(--surface2);border:1px solid var(--border);padding:6px;text-align:center"><div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:var(--bright-blue)">LV ${G.level}</div><div style="font-size:8px;color:var(--text-dim);font-family:'Cutive Mono',monospace">YOUR LEVEL</div></div>
  </div>`;

  for(let ti=0;ti<CREW_TIERS.length;ti++){
    const tierCrew=CREW_ROSTER.filter(m=>m.tier===ti);
    const tierHired=tierCrew.filter(m=>G.crew[m.id]).length;
    html+=`<div style="font-family:'Bebas Neue',sans-serif;font-size:12px;letter-spacing:.12em;color:${ctColors[ti]};margin:10px 0 5px;border-bottom:1px solid var(--border);padding-bottom:3px">▸ ${CREW_TIERS[ti].toUpperCase()} <span style="font-size:10px;opacity:.6">${tierHired}/${tierCrew.length}</span></div>`;
    for(const m of tierCrew){
      const isHired=G.crew[m.id];
      const locked=G.level<m.lv;
      html+='<div class="crew-card" style="opacity:'+(locked&&!isHired?'.35':'1')+';border-color:'+(isHired?'var(--bright-green)':'var(--border)')+';">';
      html+='<div class="crew-icon">'+m.e+'</div>';
      html+='<div style="flex:1"><div class="crew-name">'+m.n+'</div>';
      html+='<div class="crew-role">'+m.role+(locked&&!isHired?' · 🔒 Level '+m.lv:'')+'</div>';
      html+='<div style="font-size:9px;color:var(--text-dim);font-family:\'Special Elite\',serif;margin:2px 0;">'+m.desc+'</div>';
      html+='<div class="crew-bonus">'+m.bonus+'</div></div>';
      if(isHired){
        html+='<div style="color:var(--bright-green);font-family:\'Bebas Neue\',sans-serif;font-size:12px;letter-spacing:.1em;">✓ HIRED</div>';
      }else if(!locked){
        html+='<button class="hire-btn" onclick="hireCrew(\''+m.id+'\')" '+(G.cash<m.cost?'disabled':'')+'>HIRE<br><span style="font-size:9px;color:var(--bright-gold);">$'+fmtCash(m.cost)+'</span></button>';
      }else{
        html+='<div style="font-size:10px;color:var(--text-dim);font-family:\'Bebas Neue\',sans-serif;">LV '+m.lv+'</div>';
      }
      html+='</div>';
    }
  }
  html+='</div></div>';
  c.innerHTML=html;
}

function hireCrew(id){
  const m=CREW_ROSTER.find(x=>x.id===id);if(!m)return;
  if(G.cash<m.cost){toast('Not enough cash!','r');return;}
  if(G.level<m.lv){toast('Need Level '+m.lv+'!','r');return;}
  if(!G.crew)G.crew={};
  if(G.crew[id]){toast('Already hired!','r');return;}
  G.cash-=m.cost;
  G.crew[id]=true;
  m.apply();
  toast('👥 '+m.n+' joins your crew!','g');
  addLog('👥 Hired '+m.n+' ('+m.role+')','gold');
  G.notoriety=(G.notoriety||0)+Math.floor(m.cost/200000)+1;
  gainXP(Math.floor(m.cost/1000));
  checkAchievements();updateAll();save();
  buildCrew(document.getElementById('center'));
}

// Passive crew effects in loops

// ══════════════════════════════════════════
// HITMAN PANEL
// ══════════════════════════════════════════
const HITMAN_TARGETS = [
  // ── TIER I: LOCAL CONTRACTS ──
  {id:'hm01',n:'Petty Informant',e:'🐀',desc:'A rat feeding the local precinct. Needs to disappear.',cost:5000,reward:12000,xp:100,lv:1,heatCost:8,successRate:.85,tier:'Local'},
  {id:'hm02',n:'Rival Bookie',e:'🃏',desc:'Running numbers in your territory. Unacceptable.',cost:10000,reward:28000,xp:100,lv:5,heatCost:12,successRate:.80,tier:'Local'},
  {id:'hm03',n:'Crooked Lawyer',e:'⚖️',desc:'Was supposed to be YOUR lawyer. Now he works for them.',cost:18000,reward:50000,xp:200,lv:10,heatCost:15,successRate:.75,tier:'Local'},
  {id:'hm04',n:'Loan Shark Eddie',e:'💰',desc:'Muscling in on your territory with his own crew.',cost:25000,reward:65000,xp:300,lv:12,heatCost:14,successRate:.78,tier:'Local'},
  {id:'hm05',n:'Corrupt Union Boss',e:'🏗️',desc:'Blocking your construction projects. Profiting from delays.',cost:35000,reward:85000,xp:350,lv:15,heatCost:16,successRate:.73,tier:'Local'},
  // ── TIER II: CITY CONTRACTS ──
  {id:'hm06',n:'Undercover Detective',e:'🕵️',desc:'Has been inside your operation for 6 months.',cost:50000,reward:130000,xp:500,lv:20,heatCost:20,successRate:.70,tier:'City'},
  {id:'hm07',n:'DA\'s Star Witness',e:'📝',desc:'Their testimony puts your underboss away for life.',cost:80000,reward:200000,xp:800,lv:25,heatCost:25,successRate:.65,tier:'City'},
  {id:'hm08',n:'Police Commissioner',e:'🚔',desc:'The one cop money can\'t buy. So we use lead instead.',cost:120000,reward:300000,xp:1200,lv:30,heatCost:30,successRate:.62,tier:'City'},
  {id:'hm09',n:'Rival Cartel Leader',e:'👺',desc:'Been encroaching on your supply lines for months.',cost:180000,reward:450000,xp:1600,lv:40,heatCost:32,successRate:.58,tier:'City'},
  {id:'hm10',n:'Media Mogul',e:'📺',desc:'About to run an expose on your entire organization.',cost:250000,reward:650000,xp:2000,lv:45,heatCost:35,successRate:.55,tier:'City'},
  // ── TIER III: NATIONAL CONTRACTS ──
  {id:'hm11',n:'Federal Judge',e:'🏛️',desc:'The one judge who won\'t be bought. Remove the problem.',cost:350000,reward:900000,xp:3000,lv:55,heatCost:40,successRate:.52,tier:'National'},
  {id:'hm12',n:'DEA Task Force Leader',e:'🦅',desc:'Running the largest anti-cartel operation in history.',cost:500000,reward:1400000,xp:5000,lv:65,heatCost:45,successRate:.48,tier:'National'},
  {id:'hm13',n:'FBI Director',e:'🦅',desc:'The architect of the task force hunting you.',cost:800000,reward:2200000,xp:8000,lv:80,heatCost:50,successRate:.45,tier:'National'},
  {id:'hm14',n:'Senator Blackwell',e:'🏛️',desc:'Pushing RICO charges personally. Has a vendetta.',cost:1200000,reward:3500000,xp:12000,lv:100,heatCost:55,successRate:.42,tier:'National'},
  {id:'hm15',n:'Secret Service Director',e:'🛡️',desc:'The one person who connects everything. Remove them.',cost:2000000,reward:6000000,xp:20000,lv:120,heatCost:60,successRate:.38,tier:'National'},
  // ── TIER IV: IMPOSSIBLE CONTRACTS ──
  {id:'hm16',n:'Interpol Commander',e:'🌐',desc:'Coordinating a 40-nation manhunt. For you.',cost:4000000,reward:12000000,xp:40000,lv:150,heatCost:65,successRate:.35,tier:'Impossible'},
  {id:'hm17',n:'MI6 Ghost Agent',e:'🎩',desc:'They call him The Eraser. Ironic.',cost:8000000,reward:25000000,xp:80000,lv:200,heatCost:70,successRate:.30,tier:'Impossible'},
  {id:'hm18',n:'The Oligarch',e:'🏰',desc:'Net worth $40 billion. Private army. Impenetrable fortress.',cost:15000000,reward:50000000,xp:150000,lv:300,heatCost:75,successRate:.25,tier:'Impossible'},
  {id:'hm19',n:'The Shadow President',e:'🕴️',desc:'The real power behind three governments.',cost:30000000,reward:100000000,xp:300000,lv:400,heatCost:80,successRate:.22,tier:'Impossible'},
  {id:'hm20',n:'God',e:'☠️',desc:'Not a name. A title. The person who runs everything. Including you.',cost:100000000,reward:500000000,xp:1000000,lv:500,heatCost:100,successRate:.15,tier:'Impossible'},

  // ── LOCAL (Expanded) ──
  {id:'hm21',n:'Neighborhood Snitch',e:'🐀',desc:'Feeding info to local PD. Shut him up.',cost:3000,reward:8000,xp:80,lv:1,heatCost:6,successRate:.90,tier:'Local'},
  {id:'hm22',n:'Rival Drug Pusher',e:'💊',desc:'Selling on your block.',cost:7000,reward:18000,xp:120,lv:3,heatCost:8,successRate:.85,tier:'Local'},
  {id:'hm23',n:'Corrupt Landlord',e:'🏚️',desc:'Evicting your safe houses. Fix it.',cost:12000,reward:30000,xp:180,lv:6,heatCost:10,successRate:.80,tier:'Local'},
  {id:'hm24',n:'Crooked Accountant',e:'📊',desc:'Cooking books for the competition.',cost:15000,reward:40000,xp:220,lv:8,heatCost:10,successRate:.78,tier:'Local'},
  {id:'hm25',n:'Bar Owner Tony',e:'🍺',desc:'Letting undercovers drink free. On your dime.',cost:8000,reward:22000,xp:150,lv:5,heatCost:8,successRate:.82,tier:'Local'},
  // ── CITY (Expanded) ──
  {id:'hm26',n:'Dirty Prosecutor',e:'⚖️',desc:'Built cases against 3 of your captains.',cost:40000,reward:100000,xp:400,lv:18,heatCost:18,successRate:.68,tier:'City'},
  {id:'hm27',n:'Union Organizer',e:'🏗️',desc:'Blocking your construction rackets.',cost:50000,reward:120000,xp:450,lv:20,heatCost:20,successRate:.65,tier:'City'},
  {id:'hm28',n:'TV News Anchor',e:'📺',desc:'Running a series on your organization. Kill the story.',cost:60000,reward:150000,xp:500,lv:22,heatCost:22,successRate:.62,tier:'City'},
  {id:'hm29',n:'Police Captain Rodriguez',e:'🚔',desc:'The one clean captain. Remove him.',cost:75000,reward:200000,xp:600,lv:25,heatCost:25,successRate:.58,tier:'City'},
  {id:'hm30',n:'Rival Familys Consigliere',e:'🤵',desc:'The brains behind their operation.',cost:90000,reward:250000,xp:700,lv:28,heatCost:28,successRate:.55,tier:'City'},
  // ── NATIONAL (Expanded) ──
  {id:'hm31',n:'DEA Regional Director',e:'🏛️',desc:'Running the biggest task force in history. Against you.',cost:150000,reward:400000,xp:1000,lv:35,heatCost:30,successRate:.50,tier:'National'},
  {id:'hm32',n:'Pentagon Analyst',e:'🎖️',desc:'Connecting military contracts to your laundering.',cost:200000,reward:500000,xp:1200,lv:40,heatCost:35,successRate:.45,tier:'National'},
  {id:'hm33',n:'Supreme Court Clerk',e:'📜',desc:'About to unseal documents that end everything.',cost:250000,reward:650000,xp:1500,lv:45,heatCost:35,successRate:.42,tier:'National'},
  {id:'hm34',n:'NSA Whistleblower',e:'💻',desc:'Has recordings of your encrypted calls.',cost:300000,reward:800000,xp:1800,lv:50,heatCost:40,successRate:.40,tier:'National'},
  {id:'hm35',n:'Secret Service Agent',e:'🕶️',desc:'Presidential detail. Saw you meet the VP.',cost:400000,reward:1000000,xp:2000,lv:55,heatCost:45,successRate:.38,tier:'National'},
  {id:'hm36',n:'Federal Reserve Governor',e:'🏦',desc:'Blocking your currency manipulation scheme.',cost:500000,reward:1500000,xp:2500,lv:60,heatCost:45,successRate:.35,tier:'National'},
  // ── IMPOSSIBLE (Expanded) ──
  {id:'hm37',n:'CIA Station Chief',e:'🕵️',desc:'Runs covert ops across 12 countries. Untouchable. Until now.',cost:800000,reward:2500000,xp:3500,lv:80,heatCost:50,successRate:.30,tier:'Impossible'},
  {id:'hm38',n:'Chinese Intelligence Minister',e:'🐉',desc:'Beijing wants him gone too. Strange bedfellows.',cost:1000000,reward:3500000,xp:4000,lv:100,heatCost:55,successRate:.28,tier:'Impossible'},
  {id:'hm39',n:'The Presidents Body Double',e:'🎭',desc:'Nobody will know. Thats the point.',cost:1500000,reward:5000000,xp:5000,lv:120,heatCost:60,successRate:.25,tier:'Impossible'},
  {id:'hm40',n:'Nuclear Submarine Captain',e:'☢️',desc:'Has launch codes. Selling to the highest bidder.',cost:2000000,reward:8000000,xp:6000,lv:150,heatCost:65,successRate:.22,tier:'Impossible'},
  {id:'hm41',n:'The Mole Inside Your Crew',e:'🐀',desc:'Someone close has been talking. Find them. End them.',cost:500000,reward:3000000,xp:4500,lv:90,heatCost:50,successRate:.35,tier:'Impossible'},
  {id:'hm42',n:'Shadow Council Enforcer',e:'👁️',desc:'The council sent their best. Youre next unless you move first.',cost:3000000,reward:12000000,xp:8000,lv:200,heatCost:70,successRate:.20,tier:'Impossible'},
  {id:'hm43',n:'Death Incarnate',e:'💀',desc:'Nobody has ever succeeded against this target. 43 assassins tried. Be number 44.',cost:5000000,reward:25000000,xp:12000,lv:300,heatCost:80,successRate:.15,tier:'Impossible'},

  {id:'hm44',n:'School Board President',e:'🏫',desc:'Embezzling education funds. Using kids as cover.',cost:2000,reward:8000,xp:30,lv:2,heatCost:5,successRate:.88,tier:'Local'},
  {id:'hm45',n:'Tow Truck Scammer',e:'🚛',desc:'Towing your crew vehicles. Bad move.',cost:3000,reward:12000,xp:40,lv:4,heatCost:6,successRate:.85,tier:'Local'},
  {id:'hm46',n:'Health Inspector Briggs',e:'🔍',desc:'Shutting down your front businesses.',cost:8000,reward:25000,xp:80,lv:8,heatCost:10,successRate:.75,tier:'Local'},
  {id:'hm47',n:'Prison Warden Hayes',e:'🔐',desc:'Keeps transferring your guys to supermax.',cost:15000,reward:45000,xp:120,lv:15,heatCost:12,successRate:.68,tier:'Local'},
  {id:'hm48',n:'Coast Guard Captain',e:'⚓',desc:'Intercepting your offshore shipments.',cost:30000,reward:80000,xp:200,lv:25,heatCost:15,successRate:.60,tier:'Regional'},
  {id:'hm49',n:'State Governor',e:'🏛️',desc:'Signed the anti-racketeering bill personally.',cost:50000,reward:150000,xp:350,lv:35,heatCost:20,successRate:.52,tier:'Regional'},
  {id:'hm50',n:'Cartel Chemist',e:'🧪',desc:'Makes better product than you. Eliminate the competition.',cost:40000,reward:120000,xp:300,lv:30,heatCost:18,successRate:.55,tier:'Regional'},
  {id:'hm51',n:'Rival Arms Dealer',e:'🔫',desc:'Undercutting your weapons prices. Bad for business.',cost:60000,reward:200000,xp:400,lv:40,heatCost:22,successRate:.48,tier:'Regional'},
  {id:'hm52',n:'Treasury Secretary',e:'💰',desc:'Freezing your offshore accounts globally.',cost:100000,reward:350000,xp:600,lv:55,heatCost:25,successRate:.42,tier:'Federal'},
  {id:'hm53',n:'NATO Intelligence Chief',e:'🌐',desc:'Coordinating multinational task force against you.',cost:150000,reward:500000,xp:800,lv:70,heatCost:28,successRate:.38,tier:'Federal'},
  {id:'hm54',n:'Swiss Banker',e:'🏦',desc:'Knows where ALL the money is. Every family. Every don.',cost:200000,reward:700000,xp:1000,lv:85,heatCost:30,successRate:.35,tier:'Federal'},
  {id:'hm55',n:'MI5 Director',e:'🇬🇧',desc:'British intelligence. Stiff upper lip. Steel resolve.',cost:300000,reward:1000000,xp:1500,lv:100,heatCost:35,successRate:.30,tier:'International'},
  {id:'hm56',n:'Yakuza Oyabun',e:'🇯🇵',desc:'Head of the largest Yakuza family. Honor demands his death.',cost:400000,reward:1500000,xp:2000,lv:130,heatCost:38,successRate:.28,tier:'International'},
  {id:'hm57',n:'Former US President',e:'🇺🇸',desc:'Still pulls strings. Still a threat. Secret Service retired but his enemies didnt.',cost:500000,reward:2500000,xp:3000,lv:160,heatCost:40,successRate:.25,tier:'International'},
  {id:'hm58',n:'The Pope\'s Confessor',e:'⛪',desc:'Knows every sin of every leader. Vatican vault of secrets.',cost:800000,reward:4000000,xp:5000,lv:200,heatCost:45,successRate:.22,tier:'Mythic'},
  {id:'hm59',n:'The Illuminati Grandmaster',e:'👁️',desc:'Controls the controllers. Puppets the puppet masters.',cost:1200000,reward:8000000,xp:8000,lv:250,heatCost:50,successRate:.18,tier:'Mythic'},
  {id:'hm60',n:'The Quantum Ghost',e:'👻',desc:'Exists in multiple places at once. Quantum assassination required.',cost:2000000,reward:15000000,xp:15000,lv:350,heatCost:55,successRate:.15,tier:'Mythic'},
  {id:'hm61',n:'The Time Broker',e:'⏳',desc:'Sells futures. Literally. Knows what happens before it does.',cost:5000000,reward:30000000,xp:25000,lv:450,heatCost:60,successRate:.12,tier:'Mythic'},
  {id:'hm62',n:'The Eternal',e:'♾️',desc:'Has died seven times. Always comes back. Make it permanent.',cost:10000000,reward:50000000,xp:50000,lv:600,heatCost:70,successRate:.10,tier:'Mythic'},
  {id:'hm63',n:'Concept of Justice',e:'⚖️',desc:'Not a person. An idea. Kill the idea.',cost:25000000,reward:100000000,xp:100000,lv:800,heatCost:80,successRate:.08,tier:'Impossible'},
  {id:'hm64',n:'Your Own Conscience',e:'🪞',desc:'The last target. The hardest kill. Yourself.',cost:50000000,reward:250000000,xp:200000,lv:1000,heatCost:100,successRate:.05,tier:'Impossible'},
];

function buildHitman(c){
  if(!G.hitmanMissions)G.hitmanMissions={};
  const tiers=[...new Set(HITMAN_TARGETS.map(t=>t.tier))];
  const tierColors={Local:'var(--text-dim)',City:'var(--bright-blue)',National:'var(--bright-orange)',Impossible:'#ff1744'};
  const completed=Object.values(G.hitmanMissions).filter(x=>x===true).length;
  const totalEarned=Object.keys(G.hitmanMissions).filter(k=>G.hitmanMissions[k]===true).reduce((s,k)=>{const t=HITMAN_TARGETS.find(x=>x.id===k);return s+(t?t.reward:0);},0);

  let html='<div class="panel"><div class="ph"><h2>🎯 HITMAN FOR HIRE</h2><span class="psub">Contract eliminations. '+completed+'/'+HITMAN_TARGETS.length+' completed.</span></div><div class="pb">';

  // Dashboard
  html+=`<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:12px;">
    <div style="background:var(--surface2);border:1px solid var(--border);padding:8px;text-align:center"><div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:var(--crimson)">${completed}/${HITMAN_TARGETS.length}</div><div style="font-size:8px;color:var(--text-dim);font-family:'Cutive Mono',monospace">CONTRACTS DONE</div></div>
    <div style="background:var(--surface2);border:1px solid var(--border);padding:8px;text-align:center"><div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:var(--bright-gold)">$${fmtCash(totalEarned)}</div><div style="font-size:8px;color:var(--text-dim);font-family:'Cutive Mono',monospace">TOTAL EARNED</div></div>
    <div style="background:var(--surface2);border:1px solid var(--border);padding:8px;text-align:center"><div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:var(--bright-green)">${G.stamina}/${G.maxStamina}</div><div style="font-size:8px;color:var(--text-dim);font-family:'Cutive Mono',monospace">STAMINA</div></div>
    <div style="background:var(--surface2);border:1px solid var(--border);padding:8px;text-align:center"><div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:var(--bright-purple)">${Math.floor(G.heat||0)}%</div><div style="font-size:8px;color:var(--text-dim);font-family:'Cutive Mono',monospace">HEAT</div></div>
  </div>`;

  html+='<div style="background:var(--surface2);border:1px solid var(--border);padding:8px;margin-bottom:12px;font-family:\'Special Elite\',serif;font-size:10px;color:var(--text-dim);">Every hit adds heat. Failed hits add double. Success improves with Notoriety and Crew (The Ghost: +8%).</div>';

  for(const tier of tiers){
    const targets=HITMAN_TARGETS.filter(t=>t.tier===tier);
    const tc=tierColors[tier]||'var(--text-dim)';
    const tierDone=targets.filter(t=>G.hitmanMissions[t.id]).length;
    html+=`<div style="font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:.12em;padding:5px 0;margin-top:8px;border-bottom:1px solid var(--border);color:${tc}">▸ ${tier.toUpperCase()} CONTRACTS <span style="font-size:10px;opacity:.6">${tierDone}/${targets.length}</span></div>`;

    for(const t of targets){
      const done=G.hitmanMissions[t.id];
      const locked=G.level<t.lv;
      const notBonus=Math.min(.15,(G.notoriety||0)/2000);
      const crewBonus=(G.crew&&G.crew['cr09'])?0.08:0;
      const eventBonus=activeEventObj&&activeEventObj.effect==='hitmanBoost'?0.15:0;const realRate=Math.min(.95,t.successRate+notBonus+crewBonus+eventBonus);

      html+='<div class="hm-card" style="opacity:'+(locked?'.4':'1')+';border-color:'+(done?'var(--bright-gold)':locked?'var(--border)':'var(--border)')+';'+( done?'background:linear-gradient(135deg,rgba(30,20,0,.4),var(--surface2))':'')+'">';
      html+='<div style="font-size:28px;">'+t.e+'</div>';
      html+='<div style="flex:1">';
      html+='<div style="font-family:\'Bebas Neue\',sans-serif;font-size:15px;color:'+(done?'var(--bright-gold)':'var(--text)')+';">'+t.n+(done?' ✓':'')+'</div>';
      html+='<div style="font-size:9px;color:var(--text-dim);font-family:\'Special Elite\',serif;margin:2px 0;">'+t.desc+'</div>';
      html+='<div style="font-family:\'Cutive Mono\',monospace;font-size:9px;color:var(--text-dim);">Fee: $'+fmtCash(t.cost)+' | Reward: <span style="color:var(--bright-gold)">$'+fmtCash(t.reward)+'</span> | '+(realRate*100).toFixed(0)+'% | 🌡️+'+t.heatCost+(locked?' | 🔒 Lv'+t.lv:'')+'</div>';
      html+='</div>';
      if(done){
        html+='<div style="color:var(--bright-gold);font-family:\'Bebas Neue\',sans-serif;font-size:11px;text-align:center;letter-spacing:.1em">ELIMINATED</div>';
      } else if(!locked){
        const canHit=G.cash>=t.cost&&G.stamina>=3;
        html+='<button onclick="doHit(\''+t.id+'\')" style="background:'+( canHit?'linear-gradient(135deg,#1a0000,#3a0000)':'var(--surface3)')+';border:2px solid '+(canHit?'var(--crimson)':'var(--border)')+';color:'+(canHit?'var(--bright-gold)':'var(--text-dim)')+';font-family:\'Bebas Neue\',sans-serif;font-size:12px;letter-spacing:.1em;padding:7px 12px;cursor:'+(canHit?'pointer':'not-allowed')+';white-space:nowrap;opacity:'+(canHit?'1':'.5')+';">HIT (3💪)</button>';
      } else {
        html+='<div style="color:var(--text-dim);font-family:\'Bebas Neue\',sans-serif;font-size:11px;text-align:center;">LV '+t.lv+'</div>';
      }
      html+='</div>';
    }
  }
  html+='</div></div>';
  c.innerHTML=html;
}

function doHit(id){
  const t=HITMAN_TARGETS.find(x=>x.id===id);if(!t)return;
  if(G.cash<t.cost){toast('Not enough cash!','r');return;}
  if(G.stamina<3){toast('Need 3 Stamina!','r');return;}
  if(G.hitmanMissions[t.id]){toast('Already done!','r');return;}
  G.cash-=t.cost;G.stamina-=3;
  const notBonus=Math.min(.15,(G.notoriety||0)/2000);
  const crewBonus=G.crew&&G.crew['cr09']?0.08:0;
  const eventBonus=activeEventObj&&activeEventObj.effect==='hitmanBoost'?0.15:0;const realRate=Math.min(.95,t.successRate+notBonus+crewBonus+eventBonus);
  if(Math.random()<realRate){
    G.hitmanMissions[t.id]=true;
    const reward=Math.floor(t.reward*(1+Math.random()*.15));
    G.cash+=reward;G.totalEarned+=reward;
    gainXP(t.xp);
    addHeat(t.heatCost);
    G.notoriety=(G.notoriety||0)+Math.floor(t.reward/200000)+2;
    G.kills=(G.kills||0)+1;
    G.respect=(G.respect||0)+Math.floor(t.reward/10000);
    toast('🎯 CONTRACT COMPLETE! +$'+fmtCash(reward),'gold');
    addLog('🎯 Eliminated: '+t.n+' +$'+fmtCash(reward),'sp');
  } else {
    addHeat(t.heatCost*2);
    const dmg=Math.floor(t.heatCost*2+Math.random()*20);
    G.health=Math.max(1,G.health-dmg);
    G.notoriety=(G.notoriety||0)+1;
    toast('❌ Hit failed! Target escaped. Heat +'+t.heatCost*2,'r');
    addLog('❌ Failed hit on '+t.n+'. Heat +'+t.heatCost*2+', -'+dmg+' HP','bad');
    if(G.heat>80)triggerJail(15+Math.floor(G.level/10));
  }
  checkAchievements();updateAll();save();
  buildHitman(document.getElementById('center'));
}

// ══════════════════════════════════════════
// GLOBAL EVENTS SYSTEM
// ══════════════════════════════════════════
const GLOBAL_EVENTS = [
  {id:'ev01',n:'POLICE CRACKDOWN',e:'🚔',desc:'Law enforcement flooding the streets. Heat gain doubled. Jobs give 2× XP.',color:'#F44336',duration:180,effect:'heatDouble',reward:'2× XP on jobs',actionLabel:'SURVIVE & EARN',action:()=>{gainXP(500);toast('Survived the crackdown! +500 XP','g');}},
  {id:'ev02',n:'CARTEL WAR',e:'💣',desc:'Rival cartels are fighting. Slip in and profit.',color:'#FF9800',duration:120,effect:'cashBonus',reward:'+50% all cash',actionLabel:'EXPLOIT THE CHAOS',action:()=>{const b=Math.floor(50000*(G.cashMult||1));G.cash+=b;G.totalEarned+=b;toast('Exploited chaos! +$'+fmtCash(b),'gold');}},
  {id:'ev03',n:'FEDERAL INVESTIGATION',e:'🏛️',desc:'The feds are building a case. Buy immunity or risk arrest.',color:'#9C27B0',duration:150,effect:'heatDanger',reward:'Clear heat for $500K',actionLabel:'BUY IMMUNITY ($500K)',action:()=>{if(G.cash>=500000){G.cash-=500000;coolHeat(60);toast('Bought immunity! Heat -60','g');addLog('💰 Paid $500K. Heat cleared.','gold');}else toast('Need $500K!','r');}},
  {id:'ev04',n:'STREET FESTIVAL',e:'🎉',desc:'The whole city is partying. Perfect cover for crime.',color:'#4CAF50',duration:120,effect:'lootTriple',reward:'Triple loot on robberies',actionLabel:'HIT THE STREETS',action:()=>{const b=Math.floor(30000*(G.cashMult||1));G.cash+=b;G.totalEarned+=b;toast('Festival score! +$'+fmtCash(b),'gold');}},
  {id:'ev05',n:'DRUG DROUGHT',e:'💊',desc:'Supply is cut. Drug prices tripled. Sell everything.',color:'#00BCD4',duration:90,effect:'drugPriceX3',reward:'3× drug prices',actionLabel:'FLOOD THE MARKET',action:()=>{let t=0;Object.keys(G.drugInv).forEach(k=>{if((G.drugInv[k]||0)>0){t+=(G.drugPrices[k]||500)*2*(G.drugInv[k]);}});G.cash+=t;G.totalEarned+=t;toast('Flooded the market! +$'+fmtCash(t),'gold');}},
  {id:'ev06',n:'DIRTY MONEY NIGHT',e:'💸',desc:'Anonymous buyer wants cash. Property income ×5.',color:'#FFD700',duration:120,effect:'incomeX5',reward:'5× property income',actionLabel:'COLLECT EVERYTHING',action:()=>{const base=calcIncome();const bonus=base*4;G.cash+=bonus;G.totalEarned+=bonus;toast('Dirty money! +$'+fmtCash(bonus),'gold');}},
  {id:'ev07',n:'GANG SUMMIT',e:'🤝',desc:'Rare peace. Gang war costs halved. Territory doubled.',color:'#607D8B',duration:180,effect:'gangBonus',reward:'Cheap wars, 2× territory',actionLabel:'SEIZE TERRITORY',action:()=>{G.respect=(G.respect||0)+2000;toast('+2000 Respect!','gold');}},
  {id:'ev08',n:'BLACKOUT',e:'⚡',desc:'City power grid down. Security offline. Rob freely.',color:'#212121',duration:90,effect:'noRobHeat',reward:'Zero heat on robberies',actionLabel:'ROB EVERYTHING',action:()=>{const b=Math.floor(100000*(G.cashMult||1));G.cash+=b;G.totalEarned+=b;toast('Blackout score! +$'+fmtCash(b),'gold');}},
  // ── NEW EVENTS ──
  {id:'ev09',n:'ARMS DEAL',e:'🔫',desc:'A weapons shipment is unguarded. Grab what you can.',color:'#795548',duration:100,effect:'lootBoost',reward:'+25% loot chance',actionLabel:'RAID THE SHIPMENT',action:()=>{const items=['ak47','desert_eagle','sniper_rifle','kalashnikov'];addLoot(items[Math.floor(Math.random()*items.length)]);toast('Weapons seized!','gold');}},
  {id:'ev10',n:'STOCK CRASH',e:'📉',desc:'Markets are down. Businesses are cheap. Buy everything.',color:'#E91E63',duration:120,effect:'cheapProps',reward:'Properties cost -30%',actionLabel:'BUY THE DIP',action:()=>{gainXP(1000);G.respect+=500;toast('+1000 XP, +500 Respect!','gold');}},
  {id:'ev11',n:'TURF WAR ERUPTS',e:'🔥',desc:'Three gangs fighting at once. Massive XP from combat.',color:'#FF5722',duration:150,effect:'fightXP2x',reward:'2× fight XP',actionLabel:'JOIN THE WAR',action:()=>{G.cash+=75000;G.totalEarned+=75000;G.kills++;toast('War profit! +$75K','gold');}},
  {id:'ev12',n:'WITNESS PROTECTION LEAK',e:'📋',desc:'Witness locations leaked. Every hitman contract is easier.',color:'#3F51B5',duration:120,effect:'hitmanBoost',reward:'+15% hitman success',actionLabel:'ELIMINATE TARGETS',action:()=>{G.kills+=3;G.cash+=200000;G.totalEarned+=200000;toast('Three witnesses down! +$200K','gold');}},
  {id:'ev13',n:'CRYPTO SURGE',e:'₿',desc:'Bitcoin is at $500K. All digital income tripled.',color:'#FF9800',duration:100,effect:'cryptoBoost',reward:'3× hack rewards',actionLabel:'MINE & HACK',action:()=>{const b=Math.floor(500000*(G.cashMult||1));G.cash+=b;G.totalEarned+=b;toast('Crypto windfall! +$'+fmtCash(b),'gold');}},
  {id:'ev14',n:'PRISON RIOT',e:'🏚️',desc:'Maximum security prison in chaos. Your people inside need help.',color:'#F44336',duration:90,effect:'jailBreak',reward:'Free jailed allies',actionLabel:'COORDINATE ESCAPE',action:()=>{if(G.jailTimer>0){G.jailTimer=0;toast('Jailbreak! You\'re free!','g');}else{G.respect+=1000;G.notoriety=(G.notoriety||0)+50;toast('+1000 Respect, +500 Notoriety!','gold');}}},
  {id:'ev15',n:'DOUBLE AGENT',e:'🕵️',desc:'Your mole inside the FBI is providing intel. Everything is easier.',color:'#009688',duration:150,effect:'easyMode',reward:'All success +20%',actionLabel:'EXPLOIT INTEL',action:()=>{gainXP(2000);coolHeat(20);toast('+2000 XP, Heat -20!','gold');}},
  {id:'ev16',n:'GOLDEN HOUR',e:'🌟',desc:'Everything aligns. Cash, XP, loot — all doubled for 2 minutes.',color:'#FFD700',duration:120,effect:'goldenHour',reward:'×2 EVERYTHING',actionLabel:'SEIZE THE MOMENT',action:()=>{const b=Math.floor(250000*(G.cashMult||1));G.cash+=b;G.totalEarned+=b;gainXP(5000);toast('GOLDEN HOUR! +$'+fmtCash(b)+' +5000XP!','gold');}},
];

let activeEventObj=null;
let eventCountdown=0;

function buildEvents(c){
  const active=activeEventObj;
  let html='<div class="panel"><div class="ph"><h2>⚡ GLOBAL EVENTS</h2><span class="psub">Random city-wide events. React fast — they don\'t last long.</span></div><div class="pb">';
  if(active){
    html+='<div class="event-card" style="border-color:'+active.color+';">';
    html+='<div class="event-title" style="color:'+active.color+';">'+active.e+' '+active.n+'</div>';
    html+='<div class="event-desc">'+active.desc+'</div>';
    html+='<div style="font-family:\'Cutive Mono\',monospace;font-size:11px;color:'+active.color+';margin:6px 0;">⏱ '+eventCountdown+'s remaining | '+active.reward+'</div>';
    html+='<button class="event-btn" style="border-color:'+active.color+';background:linear-gradient(90deg,'+active.color+'33,'+active.color+'55);" onclick="doEventAction()">'+active.actionLabel+'</button>';
    html+='</div>';
  } else {
    html+='<div style="background:var(--surface2);border:1px solid var(--border);padding:20px;text-align:center;margin-bottom:14px;">';
    html+='<div style="font-family:\'Bebas Neue\',sans-serif;font-size:20px;color:var(--text-dim);letter-spacing:.15em;">NO ACTIVE EVENT</div>';
    html+='<div style="font-family:\'Special Elite\',serif;font-size:12px;color:var(--text-dim);margin-top:8px;">Events trigger randomly. Stay ready.</div>';
    html+='</div>';
  }
  html+='<div style="font-family:\'Bebas Neue\',sans-serif;font-size:13px;letter-spacing:.12em;color:var(--text-dim);margin-bottom:10px;">ALL EVENTS</div>';
  for(const ev of GLOBAL_EVENTS){
    html+='<div style="background:var(--surface2);border:1px solid var(--border);padding:10px;margin-bottom:6px;display:flex;align-items:center;gap:10px;">';
    html+='<div style="font-size:22px;">'+ev.e+'</div>';
    html+='<div><div style="font-family:\'Bebas Neue\',sans-serif;font-size:14px;color:'+ev.color+';">'+ev.n+'</div>';
    html+='<div style="font-size:10px;color:var(--text-dim);font-family:\'Special Elite\',serif;">'+ev.desc+'</div>';
    html+='<div style="font-size:9px;color:'+ev.color+';font-family:\'Cutive Mono\',monospace;margin-top:2px;">'+ev.reward+' | '+ev.duration+'s duration</div>';
    html+='</div></div>';
  }
  html+='</div></div>';
  c.innerHTML=html;
}

function triggerRandomEvent(){
  if(activeEventObj)return;
  const ev=GLOBAL_EVENTS[Math.floor(Math.random()*GLOBAL_EVENTS.length)];
  activeEventObj=ev;
  eventCountdown=ev.duration;
  G.activeEvent=ev.id;
  // Apply ongoing effects (store original values for safe undo)
  if(ev.effect==='drugPriceX3'){G._preDrugPrices=JSON.parse(JSON.stringify(G.drugPrices));Object.keys(G.drugPrices).forEach(k=>G.drugPrices[k]*=3);}
  if(ev.effect==='incomeX5'){G._preIncomeMult=G.incomeMult||1;G.incomeMult=(G.incomeMult||1)*5;}
  // Show event banner
  const banner=document.getElementById('event-banner');
  if(banner){banner.textContent='⚡ '+ev.e+' '+ev.n+' — '+ev.reward+' ⚡';banner.style.display='block';}
  toast('⚡ EVENT: '+ev.n,'gold');
  addLog('⚡ GLOBAL EVENT: '+ev.n,'sp');
  if(G.currentPanel==='events')buildEvents(document.getElementById('center'));
}

function endEvent(){
  if(!activeEventObj)return;
  const ev=activeEventObj;
  // Undo ongoing effects using stored values
  if(ev.effect==='drugPriceX3'&&G._preDrugPrices){G.drugPrices=G._preDrugPrices;delete G._preDrugPrices;}
  else if(ev.effect==='drugPriceX3'){Object.keys(G.drugPrices).forEach(k=>G.drugPrices[k]=Math.floor(G.drugPrices[k]/3));}
  if(ev.effect==='incomeX5'&&G._preIncomeMult!==undefined){G.incomeMult=G._preIncomeMult;delete G._preIncomeMult;}
  else if(ev.effect==='incomeX5'){G.incomeMult=Math.max(1,(G.incomeMult||5)/5);}
  activeEventObj=null;eventCountdown=0;G.activeEvent=null;
  const banner=document.getElementById('event-banner');
  if(banner)banner.style.display='none';
  toast('Event ended: '+ev.n,'r');
  if(G.currentPanel==='events')buildEvents(document.getElementById('center'));
}

function doEventAction(){
  if(!activeEventObj)return;
  activeEventObj.action();
  updateAll();save();
  if(G.currentPanel==='events')buildEvents(document.getElementById('center'));
}

// ══════════════════════════════════════════
// NOTORIETY SYSTEM
// ══════════════════════════════════════════
const NOTORIETY_TIERS = [
  {min:0,      n:'Unknown',         e:'👤', bonus:'No perks. You\'re nobody.',                        color:'var(--text-dim)'},
  {min:25,     n:'Whisper',          e:'👂', bonus:'+2% cash from all sources.',                       color:'#555'},
  {min:75,     n:'Rumor',            e:'💬', bonus:'+3% cash, +2% XP.',                                color:'#777'},
  {min:200,    n:'Street Name',      e:'🔥', bonus:'+5% cash, +3% XP, enemies fear you.',              color:'#FF9800'},
  {min:500,    n:'Local Legend',      e:'⚔️', bonus:'+8% ATK, +5% loot drop chance.',                   color:'#F44336'},
  {min:1000,   n:'City Fear',        e:'💀', bonus:'+10 crit, enemies drop 25% more cash.',            color:'#9C27B0'},
  {min:2000,   n:'Crime Lord',       e:'👑', bonus:'+15% XP, gang war territory +15%.',                color:'#FFD700'},
  {min:4000,   n:'Myth',             e:'🌑', bonus:'Heat decays 2× faster, +20% all income.',          color:'#E040FB'},
  {min:7000,   n:'The Untouchable',  e:'☠️', bonus:'Jail time halved, bail halved, +50 DEF.',          color:'#FF1744'},
  {min:12000,  n:'Il Leggenda',      e:'🏆', bonus:'All systems +20%. Fear incarnate.',                color:'var(--bright-gold)'},
  {min:20000,  n:'Shadow Emperor',   e:'🌑', bonus:'×2 bounty cash, +25% all income.',                 color:'#ff4444'},
  {min:35000,  n:'The Architect',    e:'🏗️', bonus:'×2 XP, +50 ATK, heat capped at 50%.',              color:'var(--bright-purple)'},
  {min:60000,  n:'Phantom King',     e:'👻', bonus:'×2 all income, fight cash ×1.5.',                   color:'#00BCD4'},
  {min:100000, n:'God of the Streets',e:'⚡', bonus:'×3 cash, ×2 XP, ×2 income.',                      color:'#ff1744'},
  {min:200000, n:'The Eternal',      e:'♾️', bonus:'×4 cash, ×3 XP. Time bends for you.',              color:'#FFD700'},
  {min:500000, n:'Beyond Legend',    e:'🌟', bonus:'×5 all. The game plays you now.',                   color:'#fff'},
];


function buildNotoriety(c){
  const n=G.notoriety||0;
  const cur=getNotorietyTier();
  const nextIdx=NOTORIETY_TIERS.indexOf(cur)+1;
  const next=NOTORIETY_TIERS[nextIdx];
  const pct=next?Math.min(100,((n-cur.min)/(next.min-cur.min))*100):100;
  let html='<div class="panel"><div class="ph"><h2>☠️ NOTORIETY</h2><span class="psub">Fear. Respect. Infamy. Earned by doing dirty work.</span></div><div class="pb">';
  html+='<div style="background:linear-gradient(135deg,#0a000a,var(--surface2));border:2px solid '+cur.color+';padding:18px;margin-bottom:16px;text-align:center;">';
  html+='<div style="font-size:40px;">'+cur.e+'</div>';
  html+='<div style="font-family:\'Bebas Neue\',sans-serif;font-size:28px;color:'+cur.color+';letter-spacing:.15em;">'+cur.n+'</div>';
  html+='<div style="font-family:\'Special Elite\',serif;font-size:12px;color:var(--text-dim);margin:6px 0;">'+cur.bonus+'</div>';
  html+='<div style="font-family:\'Cutive Mono\',monospace;font-size:12px;color:'+cur.color+';">Notoriety: '+n.toLocaleString()+'</div>';
  if(next){
    html+='<div style="background:var(--surface3);height:8px;border-radius:4px;overflow:hidden;margin:10px 0;">';
    html+='<div style="background:'+cur.color+';height:100%;width:'+pct+'%;transition:width .4s;border-radius:4px;"></div></div>';
    html+='<div style="font-size:10px;color:var(--text-dim);font-family:\'Cutive Mono\',monospace;">Next tier at '+next.min.toLocaleString()+' — '+(next.min-n).toLocaleString()+' to go</div>';
  }
  html+='</div>';
  html+='<div style="font-family:\'Bebas Neue\',sans-serif;font-size:13px;letter-spacing:.12em;color:var(--text-dim);margin-bottom:10px;">ALL TIERS</div>';
  for(const t of NOTORIETY_TIERS){
    const active=n>=t.min;
    const isCur=t.n===cur.n;
    html+='<div class="not-tier'+(isCur?' active':'')+'" style="border-color:'+(active?t.color:'var(--border)')+';">';
    html+='<div style="display:flex;align-items:center;gap:10px;"><div style="font-size:20px;">'+t.e+'</div>';
    html+='<div><div style="font-family:\'Bebas Neue\',sans-serif;color:'+(active?t.color:'var(--text-dim)')+';">'+t.n+'</div>';
    html+='<div style="font-size:10px;color:var(--text-dim);font-family:\'Special Elite\',serif;">'+t.bonus+'</div></div></div>';
    html+='<div style="font-family:\'Cutive Mono\',monospace;font-size:10px;color:'+(active?'var(--bright-green)':'var(--text-dim)')+';">'+(active?'✓ ACTIVE':t.min.toLocaleString())+'</div>';
    html+='</div>';
  }
  html+='<div style="font-family:\'Special Elite\',serif;font-size:11px;color:var(--text-dim);margin-top:14px;padding:10px;background:var(--surface2);border:1px solid var(--border);">Notoriety earned by: Drug trades, Hitman contracts, Black Market buys, Boss kills, winning Gang Wars, high-level jobs.</div>';
  html+='</div></div>';
  c.innerHTML=html;
}

// Apply notoriety bonuses passively



// ══════════════════════════════════════════
// ══════════════════════════════════════════
// LUXURY SHOP - FLEX YOUR EMPIRE
// ══════════════════════════════════════════
const LUXURY_ITEMS = [
{id:'lx_c01', cat:'Collectibles', n:'1952 Topps Mickey Mantle Rookie Card', e:'⚾', brand:'Topps',
   desc:'PSA 9. The Holy Grail of baseball cards. One of fewer than 10 known in this grade.',
   price:5750000, notReq:0, bonus:null, flex:'The card that started it all.'},
{id:'lx_c02', cat:'Collectibles', n:'1986 Fleer Michael Jordan Rookie Card', e:'🏀', brand:'Fleer',
   desc:'BGS 9.5. The most iconic basketball card ever printed. Unquestionable.',
   price:750000, notReq:0, bonus:null, flex:'Chicago. Bulls. Legend.'},
{id:'lx_c03', cat:'Collectibles', n:'Tom Brady 2000 Bowman Chrome RC Auto', e:'🏈', brand:'Bowman',
   desc:'PSA 10. Greatest of all time. The card proves it.',
   price:2100000, notReq:0, bonus:null, flex:'7 rings on cardboard.'},
{id:'lx_c04', cat:'Collectibles', n:'1966 Batman #1 CGC 9.6', e:'🦇', brand:'DC Comics',
   desc:'Near mint. The rarest Batman first issue in existence. Museum quality.',
   price:480000, notReq:0, bonus:null, flex:'Dark Knight on your wall.'},
{id:'lx_c05', cat:'Collectibles', n:'Action Comics #1 Facsimile CGC 9.8', e:'🦸', brand:'DC Comics',
   desc:'The debut of Superman. Facsimile but certified perfect grade.',
   price:320000, notReq:0, bonus:null, flex:'Where it all began.'},
{id:'lx_c06', cat:'Collectibles', n:'Pokémon Shadowless Charizard PSA 10', e:'🔥', brand:'Pokémon TCG',
   desc:'1999 Base Set. Only 121 copies exist at PSA 10. The white whale of modern cards.',
   price:420000, notReq:0, bonus:null, flex:'Gotta catch \'em all? Already did.'},
{id:'lx_c07', cat:'Collectibles', n:'LeBron James 2003 Topps Chrome RC Auto', e:'👑', brand:'Topps',
   desc:'PSA 10. The King\'s rookie auto. First year, maximum grade.',
   price:1800000, notReq:0, bonus:null, flex:'Witness.'},
{id:'lx_c08', cat:'Collectibles', n:'1963 Topps Pete Rose Rookie PSA 9', e:'⚾', brand:'Topps',
   desc:'The Hit King. Controversial, expensive, irreplaceable.',
   price:180000, notReq:0, bonus:null, flex:'4256 hits and this card.'},
{id:'lx_c09', cat:'Collectibles', n:'Wayne Gretzky 1979 O-Pee-Chee RC PSA 10', e:'🏒', brand:'O-Pee-Chee',
   desc:'The Great One. Only one PSA 10 exists. This is it.',
   price:3750000, notReq:0, bonus:null, flex:'99 problems, this ain\'t one.'},
{id:'lx_c10', cat:'Collectibles', n:'2009 Bowman Chrome Stephen Curry RC Auto', e:'🏀', brand:'Bowman',
   desc:'BGS 9.5/10 Auto. Before the rings. Before the records.',
   price:900000, notReq:0, bonus:null, flex:'Night night.'},
{id:'lx_c11', cat:'Collectibles', n:'Babe Ruth 1916 M101 Sporting News Card', e:'⚾', brand:'Sporting News',
   desc:'Over 100 years old. The Babe. Original ink on original cardboard.',
   price:8500000, notReq:0, bonus:null, flex:'The Sultan of Swat on your desk.'},
{id:'lx_c12', cat:'Collectibles', n:'Derek Jeter 1993 SP Foil Rookie RC PSA 10', e:'⚾', brand:'Upper Deck',
   desc:'The rarest modern Jeter. Only 5 PSA 10s exist. Captain forever.',
   price:370000, notReq:0, bonus:null, flex:'5 rings, 1 card.'},
{id:'lx_c13', cat:'Collectibles', n:'2000 Bowman Chrome Tom Brady Auto /100', e:'🏈', brand:'Bowman',
   desc:'Numbered /100. Certified autograph. One of the rarest Brady autos in existence.',
   price:2800000, notReq:0, bonus:null, flex:'The GOAT signed this.'},
{id:'lx_c14', cat:'Collectibles', n:'Mike Trout 2009 Bowman Chrome RC Auto PSA 10', e:'⚾', brand:'Bowman',
   desc:'The best player of his generation. PSA 10. Industry apex.',
   price:700000, notReq:0, bonus:null, flex:'Best player on the planet.'},
{id:'lx_c15', cat:'Collectibles', n:'Wilt Chamberlain 1961 Fleer Rookie PSA 8', e:'🏀', brand:'Fleer',
   desc:'100 points in a game. This is the card from that era.',
   price:280000, notReq:0, bonus:null, flex:'100 points. One card.'},
{id:'lx_w01', cat:'Watches', n:'Rolex Daytona "Paul Newman" Ref. 6239', e:'⌚', brand:'Rolex',
   desc:'The rarest Daytona dial configuration. Only a few thousand made. The watch that defines watch collecting.',
   price:850000, notReq:0, bonus:{type:'cashMult',val:.02}, flex:'+2% cash income'},
{id:'lx_w02', cat:'Watches', n:'Patek Philippe Nautilus 5711/1A-010', e:'⌚', brand:'Patek Philippe',
   desc:'Discontinued in 2021. Steel sports watch with a 5-year waitlist before they killed it. Museum piece.',
   price:175000, notReq:0, bonus:null, flex:'The watch that broke the internet.'},
{id:'lx_w03', cat:'Watches', n:'Audemars Piguet Royal Oak Offshore Tourbillon', e:'⌚', brand:'Audemars Piguet',
   desc:'18k rose gold case. Flying tourbillon movement visible through sapphire crystal.',
   price:320000, notReq:0, bonus:{type:'critChance',val:2}, flex:'+2% crit chance'},
{id:'lx_w04', cat:'Watches', n:'Richard Mille RM 011 Felipe Massa', e:'⌚', brand:'Richard Mille',
   desc:'Carbon TPT case. Flyback chronograph. F1 pedigree. The watch that changed everything.',
   price:500000, notReq:0, bonus:{type:'stamina',val:5}, flex:'+5 max stamina'},
{id:'lx_w05', cat:'Watches', n:'F.P. Journe Chronomètre Bleu', e:'⌚', brand:'F.P. Journe',
   desc:'Tantalum and blue dial. The connoisseur\'s watch. No one outside the world knows this brand. Everyone inside does.',
   price:280000, notReq:0, bonus:null, flex:'The watch for people who know watches.'},
{id:'lx_w06', cat:'Watches', n:'Rolex Submariner Date "Kermit" 116610LV', e:'⌚', brand:'Rolex',
   desc:'Green bezel. Black dial. The watch of kings and divers. Discontinued.',
   price:22000, notReq:0, bonus:null, flex:'Classic. Period.'},
{id:'lx_w07', cat:'Watches', n:'Rolex GMT-Master II "Pepsi" 126710BLRO', e:'⌚', brand:'Rolex',
   desc:'Jubilee bracelet. Red/blue ceramic bezel. 3-timezone functionality.',
   price:20000, notReq:0, bonus:null, flex:'Pilot\'s watch for the underworld.'},
{id:'lx_w08', cat:'Watches', n:'Omega Speedmaster "Moonwatch" 311.30.42.30.01.005', e:'⌚', brand:'Omega',
   desc:'The watch that went to the moon. Still hand-wound. Still perfect.',
   price:7500, notReq:0, bonus:null, flex:'Moon certified.'},
{id:'lx_w09', cat:'Watches', n:'Hublot Big Bang Unico King Gold 45mm', e:'⌚', brand:'Hublot',
   desc:'18k King Gold case. UNICO manufacture movement. 72-hour power reserve.',
   price:45000, notReq:0, bonus:null, flex:'The watch rappers actually know.'},
{id:'lx_w10', cat:'Watches', n:'Patek Philippe Grand Complications 5270P', e:'⌚', brand:'Patek Philippe',
   desc:'Perpetual calendar, chronograph, moonphase. Platinum case. 20-year waitlist.',
   price:450000, notReq:0, bonus:{type:'xpMult',val:.05}, flex:'+5% XP gain'},
{id:'lx_w11', cat:'Watches', n:'Lange & Söhne Datograph Perpetual Tourbillon', e:'⌚', brand:'A. Lange & Söhne',
   desc:'German horology at its absolute peak. Hand-engraved movement, 585-part perpetual calendar.',
   price:520000, notReq:0, bonus:{type:'cashMult',val:.03}, flex:'+3% cash income'},
{id:'lx_w12', cat:'Watches', n:'Jacob & Co. Astronomia Solar Planetary Watch', e:'⌚', brand:'Jacob & Co.',
   desc:'The solar system on your wrist. Earth rotates. Sun orbits. Diamond cuts light.',
   price:780000, notReq:0, bonus:null, flex:'The universe, miniaturized.'},
{id:'lx_j01', cat:'Jewelry', n:'Harry Winston "Flame" Diamond Necklace', e:'💎', brand:'Harry Winston',
   desc:'30-carat D-Flawless center stone surrounded by 200 carats of pavé diamonds. One of a kind.',
   price:18000000, notReq:0, bonus:{type:'notoriety',val:200}, flex:'+200 Notoriety instantly'},
{id:'lx_j02', cat:'Jewelry', n:'Cartier Panthère de Cartier Full Pavé Bracelet', e:'💍', brand:'Cartier',
   desc:'Onyx spots, emerald eyes. Fully set in brilliant-cut diamonds. The panther watches.',
   price:380000, notReq:0, bonus:null, flex:'The panther judges you.'},
{id:'lx_j03', cat:'Jewelry', n:'Tiffany & Co. Yellow Diamond Ring — 128.54 ct', e:'💛', brand:'Tiffany & Co.',
   desc:'The Tiffany Diamond. One of the largest and finest yellow diamonds in the world.',
   price:32000000, notReq:0, bonus:{type:'cashMult',val:.05}, flex:'+5% all cash income forever'},
{id:'lx_j04', cat:'Jewelry', n:'Van Cleef & Arpels Alhambra Diamond Necklace', e:'🍀', brand:'Van Cleef & Arpels',
   desc:'Vintage. 20-motif. D-Flawless stones. The original. Not a reproduction.',
   price:225000, notReq:0, bonus:null, flex:'Luck follows money.'},
{id:'lx_j05', cat:'Jewelry', n:'Bvlgari Serpenti Diamond Bracelet Watch', e:'🐍', brand:'Bvlgari',
   desc:'18k white gold. The snake wraps the wrist. 1500 diamonds. The time is irrelevant.',
   price:175000, notReq:0, bonus:null, flex:'The snake never sleeps.'},
{id:'lx_j06', cat:'Jewelry', n:'Chopard Happy Diamonds Floating 3-Stone Ring', e:'💠', brand:'Chopard',
   desc:'Three D-Flawless diamonds float freely inside the sapphire crystal case.',
   price:95000, notReq:0, bonus:null, flex:'Diamonds that dance.'},
{id:'lx_j07', cat:'Jewelry', n:'10-Carat VVS1 Cuban Link Chain — 14k Gold', e:'⛓️', brand:'Custom',
   desc:'Custom fabricated. 150 links. 14k solid gold. No hollow. The chain that speaks before you do.',
   price:420000, notReq:0, bonus:{type:'attack',val:20}, flex:'+20 ATK (intimidation factor)'},
{id:'lx_j08', cat:'Jewelry', n:'Graff Pink Diamond Ring — 24.78 ct', e:'🩷', brand:'Graff',
   desc:'Fancy Intense Pink. Internally Flawless. The Graff Pink ring. One of the rarest diamonds alive.',
   price:46000000, notReq:0, bonus:{type:'notoriety',val:500}, flex:'+500 Notoriety. Everyone knows.'},
{id:'lx_j09', cat:'Jewelry', n:'Presidential Rolex — Fully Iced Baguette', e:'⌚', brand:'Rolex / Custom',
   desc:'Day-Date 40. Custom set with 200 baguette diamonds by a Beverly Hills jeweler. Blinding.',
   price:650000, notReq:0, bonus:{type:'critChance',val:5}, flex:'+5% crit chance'},
{id:'lx_j10', cat:'Jewelry', n:'Mikimoto Black South Sea Pearl Strand', e:'🦪', brand:'Mikimoto',
   desc:'18 perfectly matched 18mm south sea pearls. Platinum clasp. 70 years to assemble.',
   price:280000, notReq:0, bonus:null, flex:'Patience incarnate.'},
{id:'lx_car01', cat:'Cars', n:'Bugatti Chiron Super Sport 300+', e:'🚗', brand:'Bugatti',
   desc:'1,578 hp. 304 mph top speed. Only 30 built. The fastest production car ever made at time of release.',
   price:4500000, notReq:0, bonus:{type:'stamina',val:15}, flex:'+15 max stamina'},
{id:'lx_car02', cat:'Cars', n:'Ferrari LaFerrari Aperta', e:'🏎️', brand:'Ferrari',
   desc:'950 hp hybrid V12. Open top. 210 produced. A letter from Ferrari was required just to buy one.',
   price:7800000, notReq:0, bonus:{type:'cashMult',val:.04}, flex:'+4% cash income'},
{id:'lx_car03', cat:'Cars', n:'Lamborghini Sián FKP 37', e:'🚗', brand:'Lamborghini',
   desc:'819 hp hybrid V12. Supercapacitor tech. 63 built for 2020. Named after Feruccio Lamborghini.',
   price:3600000, notReq:0, bonus:{type:'attack',val:35}, flex:'+35 ATK'},
{id:'lx_car04', cat:'Cars', n:'Koenigsegg Jesko Absolut', e:'🚗', brand:'Koenigsegg',
   desc:'1,600 hp. Predicted 330 mph top speed. Twin-turbo V8. 125 units total. Swedish engineering singularity.',
   price:3000000, notReq:0, bonus:{type:'energy',val:20}, flex:'+20 max energy'},
{id:'lx_car05', cat:'Cars', n:'McLaren Speedtail', e:'🚗', brand:'McLaren',
   desc:'1,035 hp. 250 mph. Three-seat central-drive configuration. 106 built.',
   price:2300000, notReq:0, bonus:null, flex:'Three seats. One driver. No equal.'},
{id:'lx_car06', cat:'Cars', n:'Pagani Huayra Roadster BC', e:'🚗', brand:'Pagani',
   desc:'829 hp. AMG V12 twin-turbo. Carbon fiber from F1 tech. 40 units.',
   price:3500000, notReq:0, bonus:{type:'defense',val:30}, flex:'+30 DEF'},
{id:'lx_car07', cat:'Cars', n:'Rolls-Royce Boat Tail Bespoke Commission', e:'🚙', brand:'Rolls-Royce',
   desc:'The most expensive new car ever sold. Bespoke commission. Interior includes a champagne chiller, parasol storage, and custom clock.',
   price:28000000, notReq:0, bonus:{type:'incomeMult',val:.10}, flex:'+10% property income'},
{id:'lx_car08', cat:'Cars', n:'Bentley Mulliner Bacalar', e:'🚗', brand:'Bentley',
   desc:'650 hp W12. 12 cars built. Each unique. Convertible. Named after the Caribbean lake.',
   price:1800000, notReq:0, bonus:null, flex:'12 in the world. You have 1.'},
{id:'lx_car09', cat:'Cars', n:'Mercedes-AMG One Hypercar', e:'🚗', brand:'Mercedes-AMG',
   desc:'F1 engine in a road car. 1,063 hp. 275 mph. Hybrid. 275 cars. Lewis Hamilton helped design it.',
   price:2700000, notReq:0, bonus:{type:'stamina',val:10}, flex:'+10 max stamina'},
{id:'lx_car10', cat:'Cars', n:'Aston Martin Valkyrie AMR Pro', e:'🏎️', brand:'Aston Martin',
   desc:'1,000+ hp. F1 aerodynamics on public roads. 25 track-only versions built.',
   price:3200000, notReq:0, bonus:{type:'attack',val:25}, flex:'+25 ATK'},
{id:'lx_car11', cat:'Cars', n:'Porsche 918 Spyder Weissach Package', e:'🚗', brand:'Porsche',
   desc:'887 hp hybrid. Weissach adds carbon fiber everywhere. 918 units. Sub-7 minute Nürburgring.',
   price:1650000, notReq:0, bonus:null, flex:'The ring record holder.'},
{id:'lx_car12', cat:'Cars', n:'Ferrari F40 — 1 of 1,315', e:'🏎️', brand:'Ferrari',
   desc:'478 hp. No driver aids. No radio. No cup holders. The last car Enzo Ferrari approved.',
   price:2200000, notReq:0, bonus:{type:'critChance',val:8}, flex:'+8% crit chance. Enzo would approve.'},
{id:'lx_car13', cat:'Cars', n:'Ford GT Heritage Edition — 2023', e:'🚗', brand:'Ford',
   desc:'660 hp EcoBoost V6. Le Mans heritage livery. Application-only. 1,350 total.',
   price:620000, notReq:0, bonus:null, flex:'Le Mans. Five times.'},
{id:'lx_car14', cat:'Cars', n:'Chevrolet Corvette Z06 70th Anniversary Edition', e:'🚗', brand:'Chevrolet',
   desc:'670 hp flat-plane crank V8. The American answer to everything Europe makes.',
   price:145000, notReq:0, bonus:null, flex:'All-American muscle. No apologies.'},
{id:'lx_car15', cat:'Cars', n:'Rimac Nevera Electric Hypercar', e:'⚡', brand:'Rimac',
   desc:'1,914 hp. 0-60 in 1.85s. 412 km/h. 150 units. The future arrived early.',
   price:2400000, notReq:0, bonus:{type:'energy',val:15}, flex:'+15 max energy'},
{id:'lx_car16', cat:'Cars', n:'Rolls-Royce Phantom EWB "Tempus" Collection', e:'🚙', brand:'Rolls-Royce',
   desc:'Extended wheelbase. Star Ceiling with constellation depicting the moment of your birth.',
   price:750000, notReq:0, bonus:{type:'cashMult',val:.02}, flex:'+2% cash income'},
{id:'lx_car17', cat:'Cars', n:'Bugatti Mistral Roadster', e:'🚗', brand:'Bugatti',
   desc:'The last Bugatti with the W16 engine. Open-top. 99 units. Goodbye W16. We loved you.',
   price:5000000, notReq:0, bonus:{type:'stamina',val:20}, flex:'+20 max stamina'},
{id:'lx_car18', cat:'Cars', n:'1962 Ferrari 250 GTO — Original', e:'🏎️', brand:'Ferrari',
   desc:'The most valuable car in the world. 36 built. Racing pedigree. Every one is documented.',
   price:70000000, notReq:0, bonus:{type:'cashMult',val:.15}, flex:'+15% all cash income. The crown jewel.'},
{id:'lx_jy01', cat:'Jets & Yachts', n:'Gulfstream G700 Private Jet', e:'✈️', brand:'Gulfstream',
   desc:'7,500 nm range. 19 passengers. Bose Panaray sound system. Circadian lighting. Your own sky.',
   price:78000000, notReq:300, bonus:{type:'energy',val:50}, flex:'+50 max energy. The world is your runway.'},
{id:'lx_jy02', cat:'Jets & Yachts', n:'Bombardier Global 7500 Private Jet', e:'✈️', brand:'Bombardier',
   desc:'7,700 nm range. The longest range business jet ever. Four living spaces. Full kitchen. Actual bedroom.',
   price:75000000, notReq:300, bonus:{type:'cashMult',val:.06}, flex:'+6% cash income'},
{id:'lx_jy03', cat:'Jets & Yachts', n:'Airbus ACJ TwoTwenty Corporate Jet', e:'✈️', brand:'Airbus',
   desc:'A220 airframe customized for private use. Double beds. Full stand-up height. 6,750 nm range.',
   price:92000000, notReq:400, bonus:{type:'incomeMult',val:.15}, flex:'+15% property income'},
{id:'lx_jy04', cat:'Jets & Yachts', n:'Lurssen 88m Superyacht "Phantom"', e:'⛵', brand:'Lürssen',
   desc:'88 meters of German engineering. 12 guests, 26 crew. Pool, helipad, submarine bay. Your sea palace.',
   price:180000000, notReq:500, bonus:{type:'cashMult',val:.12}, flex:'+12% cash income'},
{id:'lx_jy05', cat:'Jets & Yachts', n:'Feadship 65m Explorer Yacht', e:'⛵', brand:'Feadship',
   desc:'Dutch craftsmanship. 14,000-mile range. Submersible. Beach club. Trophy room for your cards.',
   price:95000000, notReq:400, bonus:{type:'energy',val:30}, flex:'+30 max energy'},
{id:'lx_jy06', cat:'Jets & Yachts', n:'Benetti Motopanfilo 37M', e:'⛵', brand:'Benetti',
   desc:'37 meters. Italian soul. Teak deck. Master suite with panoramic ocean view. Entry level superyacht.',
   price:22000000, notReq:200, bonus:null, flex:'The starting point for serious collectors.'},
{id:'lx_jy07', cat:'Jets & Yachts', n:'Cessna Citation Longitude Business Jet', e:'✈️', brand:'Cessna',
   desc:'3,500 nm range. 12 passengers. The entry-level private jet with full-standing cabin.',
   price:26000000, notReq:100, bonus:{type:'stamina',val:25}, flex:'+25 max stamina'},
{id:'lx_jy08', cat:'Jets & Yachts', n:'Perini Navi 56m Sailing Yacht', e:'⛵', brand:'Perini Navi',
   desc:'Aluminum hull. Carbon mast. Five cabins. Ghost-quiet under sail. 6,000 nm range.',
   price:42000000, notReq:250, bonus:{type:'defense',val:50}, flex:'+50 DEF'},
{id:'lx_jy09', cat:'Jets & Yachts', n:'Sikorsky S-92 VIP Helicopter', e:'🚁', brand:'Sikorsky',
   desc:'VIP configured. Range 800 nm. The helicopter of presidents, moguls, and Dons.',
   price:18000000, notReq:150, bonus:{type:'attack',val:40}, flex:'+40 ATK. Fast arrival = power.'},
{id:'lx_jy10', cat:'Jets & Yachts', n:'AgustaWestland AW101 VVIP "VIP Nighthawk"', e:'🚁', brand:'Leonardo',
   desc:'Presidential spec helicopter. Armor-plated. ECM equipped. Range 1,000 nm.',
   price:32000000, notReq:300, bonus:{type:'defense',val:75}, flex:'+75 DEF. Presidential protection.'},
{id:'lx_re01', cat:'Real Estate', n:'Bel-Air Compound — 35,000 sq ft', e:'🏛️', brand:'Los Angeles',
   desc:'12 beds, 18 baths. 4 pools. Tennis court. IMAX theater. Guard house. 10-car underground garage. 6 acres.',
   price:95000000, notReq:0, bonus:{type:'incomeMult',val:.20}, flex:'+20% all property income'},
{id:'lx_re02', cat:'Real Estate', n:'Palm Beach Oceanfront Estate — 22,000 sq ft', e:'🏠', brand:'Palm Beach',
   desc:'580 ft of private Atlantic Ocean frontage. Boat dock. 8 bedrooms. Infinity pool. Art storage vault.',
   price:84000000, notReq:0, bonus:{type:'cashMult',val:.08}, flex:'+8% cash income'},
{id:'lx_re03', cat:'Real Estate', n:'Manhattan Penthouse — 432 Park Ave 96th Floor', e:'🏙️', brand:'New York',
   desc:'6,000 sq ft in the sky. Wraparound terrace. Entire city below you. Concierge. Private elevator.',
   price:68000000, notReq:0, bonus:{type:'notoriety',val:300}, flex:'+300 Notoriety. NYC royalty.'},
{id:'lx_re04', cat:'Real Estate', n:'Monaco Waterfront Villa — Cap Ferrat', e:'🌊', brand:'French Riviera',
   desc:'Private peninsula. 15,000 sq ft. Views of Monte Carlo. 300 days of sun. Zero local tax.',
   price:120000000, notReq:0, bonus:{type:'cashMult',val:.10}, flex:'+10% cash income. Tax haven bonus.'},
{id:'lx_re05', cat:'Real Estate', n:'Dubai Palm Jumeirah Signature Villa', e:'🌴', brand:'Dubai',
   desc:'6 beds, private beach, 180° gulf views. Penthouses above, water below. Palm frond address.',
   price:28000000, notReq:0, bonus:{type:'energy',val:25}, flex:'+25 max energy'},
{id:'lx_re06', cat:'Real Estate', n:'Malibu Carbon Beach Compound', e:'🏄', brand:'Malibu',
   desc:'Billionaire\'s Beach. 80 ft frontage. Where Spielberg, Geffen, and Cher live. Now you.',
   price:52000000, notReq:0, bonus:{type:'lootBonus',val:10}, flex:'+10% loot drop rate'},
{id:'lx_re07', cat:'Real Estate', n:'Hamptons Southampton Estate — 12 acres', e:'🌾', brand:'Southampton',
   desc:'12 acres. 28,000 sq ft main house. Pool house bigger than most mansions. Horse stable. Helicopter pad.',
   price:45000000, notReq:0, bonus:{type:'incomeMult',val:.12}, flex:'+12% property income'},
{id:'lx_re08', cat:'Real Estate', n:'London Mayfair Georgian Townhouse — 10,000 sq ft', e:'🏛️', brand:'London',
   desc:'5 floors. Staff quarters. Wine cellar. Roof terrace. The most expensive postcode on earth.',
   price:38000000, notReq:0, bonus:{type:'defense',val:60}, flex:'+60 DEF. British establishment.'},
{id:'lx_re09', cat:'Real Estate', n:'Private Island — Bahamas, 72 Acres', e:'🏝️', brand:'Bahamas',
   desc:'Your own island. 3 villas. Deepwater port. Airstrip. The only address where no one can find you.',
   price:145000000, notReq:600, bonus:{type:'heat',val:-50}, flex:'Heat -50 permanently. You don\'t exist.'},
{id:'lx_re10', cat:'Real Estate', n:'Tokyo Roppongi Hills Penthouse — Mori Tower', e:'🗼', brand:'Tokyo',
   desc:'53rd floor. Mt. Fuji view on clear days. 4,500 sq ft. Restaurant access. Museum below.',
   price:32000000, notReq:0, bonus:{type:'xpMult',val:.10}, flex:'+10% XP gain'},
{id:'lx_re11', cat:'Real Estate', n:'Swiss Alps Chalet — Gstaad, 18,000 sq ft', e:'⛷️', brand:'Gstaad',
   desc:'6 ensuite bedrooms. Ski-in ski-out. Heated outdoor pool. Spa. Views across three countries.',
   price:42000000, notReq:0, bonus:{type:'stamina',val:30}, flex:'+30 max stamina'},
{id:'lx_re12', cat:'Real Estate', n:'Napa Valley Wine Estate — 400 Acres', e:'🍷', brand:'Napa Valley',
   desc:'400 acres. 200 planted in Cabernet. 20,000 sq ft main house. Cave cellar. 10,000 bottle library.',
   price:78000000, notReq:0, bonus:{type:'incomeMult',val:.25}, flex:'+25% property income. Legit front.'},
{id:'lx_a01', cat:'Art & Objects', n:'Basquiat "Untitled (Devil)" 1984 — Original', e:'🎨', brand:'Basquiat',
   desc:'Purchased at Sotheby\'s. 48x48 inches. Skull motif. Authenticated. One of only three in private hands.',
   price:68000000, notReq:0, bonus:{type:'notoriety',val:400}, flex:'+400 Notoriety. Culture.'},
{id:'lx_a02', cat:'Art & Objects', n:'Banksy "Girl with Balloon" (Pre-Shred Original)', e:'🎨', brand:'Banksy',
   desc:'THE original, before the shredder. Authenticated by Pest Control. The most famous living artist.',
   price:25000000, notReq:0, bonus:null, flex:'Worth more than you know.'},
{id:'lx_a03', cat:'Art & Objects', n:'Andy Warhol "Marilyn Diptych" Print Series', e:'🎨', brand:'Warhol',
   desc:'Complete silk-screen series from the 1962 edition. 100 prints on cotton-rag paper. Estate certified.',
   price:18000000, notReq:0, bonus:{type:'cashMult',val:.03}, flex:'+3% cash income'},
{id:'lx_a04', cat:'Art & Objects', n:'1969 Moon Landing Mission Control Console — NASA', e:'🚀', brand:'NASA',
   desc:'An actual Mission Control console used during Apollo 11. Deaccessioned. History on a desk.',
   price:2800000, notReq:0, bonus:{type:'energy',val:30}, flex:'+30 max energy'},
{id:'lx_a05', cat:'Art & Objects', n:'T-Rex Skull — Museum Grade, 65M Years Old', e:'🦴', brand:'Palaeontology',
   desc:'Complete at 87%. Professionally excavated and restored. Rivals the Smithsonian\'s Stan specimen.',
   price:8000000, notReq:0, bonus:{type:'attack',val:50}, flex:'+50 ATK. The apex predator.'},
{id:'lx_a06', cat:'Art & Objects', n:'Medieval Suit of Armor — 15th Century Milan', e:'⚔️', brand:'Milanese',
   desc:'Complete Milanese full-plate armor, dated 1470s. Engravings on chest. Functional. Museum certified.',
   price:4200000, notReq:0, bonus:{type:'defense',val:80}, flex:'+80 DEF. Literally armored.'},
{id:'lx_a07', cat:'Art & Objects', n:'Koons "Rabbit" Silver Stainless Steel Sculpture', e:'🐰', brand:'Jeff Koons',
   desc:'The 1986 sculpture that sold for $91M in 2019. A reproduction of the edition of 3. Certified.',
   price:22000000, notReq:0, bonus:null, flex:'$91 million rabbit. Don\'t explain it.'},
{id:'lx_a08', cat:'Art & Objects', n:'Fabergé Imperial Easter Egg — Kremlin Collection', e:'🥚', brand:'Fabergé',
   desc:'One of the 52 Imperial eggs. Russian imperial family provenance. Museum refused to sell. You didn\'t ask.',
   price:45000000, notReq:0, bonus:{type:'notoriety',val:600}, flex:'+600 Notoriety. The Romanovs had this.'},
{id:'lx_a09', cat:'Art & Objects', n:'Stradivarius Violin — "The Kreutzer" 1731', e:'🎻', brand:'Stradivari',
   desc:'One of approximately 244 surviving Stradivarius instruments. Italian tone. 300-year-old maple.',
   price:14000000, notReq:0, bonus:{type:'cashMult',val:.04}, flex:'+4% cash income'},
{id:'lx_a10', cat:'Art & Objects', n:'Gutenberg Bible — Perfect Vellum Copy', e:'📖', brand:'Gutenberg',
   desc:'One of 49 surviving copies. Vellum (not paper). Two columns of 42 lines. 1455. The first printed book.',
   price:35000000, notReq:0, bonus:{type:'xpMult',val:.15}, flex:'+15% XP gain. Knowledge is power.'},
{id:'lx_f01', cat:'Fashion', n:'Hermès Birkin 40 — Himalayan Niloticus Crocodile', e:'👜', brand:'Hermès',
   desc:'The rarest Birkin configuration. Himalayan skin. Palladium hardware. Diamond clasp. 10-year waitlist bypassed.',
   price:500000, notReq:0, bonus:null, flex:'The only bag with a 10-year waitlist.'},
{id:'lx_f02', cat:'Fashion', n:'Bespoke Brioni Suit Collection — 50 Pieces', e:'🤵', brand:'Brioni',
   desc:'Full hand-stitched Brioni wardrobe. Cashmere, silk, vicuña. Fitted in Rome. Delivered worldwide.',
   price:350000, notReq:0, bonus:{type:'notoriety',val:75}, flex:'+75 Notoriety. Dress the part.'},
{id:'lx_f03', cat:'Fashion', n:'Louis Vuitton Millionaire Speedy Monogram — Custom', e:'👜', brand:'Louis Vuitton',
   desc:'Special Order. Monogram with custom initials woven into canvas. Alligator trim. One made.',
   price:180000, notReq:0, bonus:null, flex:'Monogrammed for exactly you.'},
{id:'lx_f04', cat:'Fashion', n:'Berluti Alessandro Dress Shoe Collection', e:'👞', brand:'Berluti',
   desc:'28 pairs. Venezia leather. Hand-patinated by the Berluti workshop. Includes a pair for each occasion.',
   price:120000, notReq:0, bonus:null, flex:'28 pairs. One for every mood.'},
{id:'lx_f05', cat:'Fashion', n:'Loro Piana Vicuña Coat — Full Length', e:'🧥', brand:'Loro Piana',
   desc:'Vicuña is the rarest fiber in the world. Softer than cashmere. The coat costs more than most cars.',
   price:75000, notReq:0, bonus:null, flex:'The world\'s rarest fiber.'},
{id:'lx_f06', cat:'Fashion', n:'Tom Ford Bespoke Eyewear Collection — Platinum', e:'🕶️', brand:'Tom Ford',
   desc:'Platinum frames. Hand-ground optical lenses. 12 pairs, personalized prescription.',
   price:85000, notReq:0, bonus:null, flex:'See the world through platinum.'},
{id:'lx_f07', cat:'Fashion', n:'Stefano Ricci Crocodile Leather Belt — 24k Gold Buckle', e:'🥋', brand:'Stefano Ricci',
   desc:'Niloticus crocodile. 24k gold buckle with the Stefano Ricci eagle. The belt of emperors.',
   price:42000, notReq:0, bonus:null, flex:'The most expensive thing you\'re wearing.'},
{id:'lx_f08', cat:'Fashion', n:'Patek Philippe Nautilus Tiffany Blue — Limited 170', e:'⌚', brand:'Patek × Tiffany',
   desc:'The Patek x Tiffany collaboration. 170 pieces for the NY Tiffany store. Retail $52K. Market $6.5M.',
   price:6500000, notReq:0, bonus:{type:'cashMult',val:.05}, flex:'+5% cash income. The collaboration heard round the world.'},
{id:'lx_f09', cat:'Fashion', n:'Louis Vuitton x Supreme Wardrobe Trunk', e:'🧳', brand:'LV x Supreme',
   desc:'The collaboration trunk. Monogram canvas, Supreme box logo. One-week drop. Never reprinted.',
   price:120000, notReq:0, bonus:null, flex:'The collab that stopped the internet.'},
{id:'lx_f10', cat:'Fashion', n:'Dior Oblique Saddle Bag — Special Edition Gold', e:'👝', brand:'Christian Dior',
   desc:'24k gold-plated hardware, Oblique embroidery, natural python leather body. 1 produced.',
   price:95000, notReq:0, bonus:null, flex:'Couture on your arm.'},
{id:'lx_ex01', cat:'Experiences', n:'Formula 1 Private Testing Day — Ferrari', e:'🏎️', brand:'Ferrari',
   desc:'Full day at Fiorano. Your hands on the wheel of a current-spec F1 car. Ferrari engineer co-pilot.',
   price:1200000, notReq:0, bonus:{type:'stamina',val:20}, flex:'+20 max stamina. F1 reflexes.'},
{id:'lx_ex02', cat:'Experiences', n:'Private Everest Base Camp Trek — Elite Team', e:'🏔️', brand:'Alpenglow',
   desc:'Dedicated Sherpa team, 30-person support crew, helicopter evac on standby. The mountain, privately.',
   price:450000, notReq:0, bonus:{type:'health',val:100}, flex:'+100 max health'},
{id:'lx_ex03', cat:'Experiences', n:'Suborbital Space Flight — Virgin Galactic', e:'🚀', brand:'Virgin Galactic',
   desc:'2.5 hours. Mach 3. 55 miles altitude. 4 minutes of weightlessness. You are an astronaut.',
   price:750000, notReq:0, bonus:{type:'energy',val:40}, flex:'+40 max energy. Space-level perspective.'},
{id:'lx_ex04', cat:'Experiences', n:'Super Bowl Suite — Owner\'s Box, 50 Guests', e:'🏈', brand:'NFL',
   desc:'50-person owner\'s suite. All-inclusive. On-field access. Owner introductions. Halftime backstage.',
   price:3500000, notReq:0, bonus:{type:'notoriety',val:150}, flex:'+150 Notoriety. Everyone saw you there.'},
{id:'lx_ex05', cat:'Experiences', n:'Kentucky Derby — Churchill Downs Owner Access', e:'🐎', brand:'Churchill Downs',
   desc:'Twin Spires Suite. Paddock access. Winners Circle photo. Horse ownership paper included.',
   price:850000, notReq:0, bonus:{type:'cashMult',val:.02}, flex:'+2% cash income. Own a piece of the race.'},
{id:'lx_ex06', cat:'Experiences', n:'Full Buyout of Nobu Malibu — Private Dinner', e:'🍣', brand:'Nobu',
   desc:'The entire restaurant, one night. Chef Matsuhisa present. 12-course omakase. Your rules.',
   price:750000, notReq:0, bonus:null, flex:'Nobu cooked for only you.'},
{id:'lx_ex07', cat:'Experiences', n:'Monaco Grand Prix — Paddock Club, Yacht Berth', e:'🏎️', brand:'Formula 1',
   desc:'Three-day paddock pass. Yacht berth in the harbor. Driver meet and greet. Prince\'s Tribune access.',
   price:2200000, notReq:0, bonus:{type:'notoriety',val:200}, flex:'+200 Notoriety. Monaco knows your face.'},
{id:'lx_ex08', cat:'Experiences', n:'Deep Ocean Dive — Titanic Wreck, OceanGate Class', e:'🌊', brand:'Custom',
   desc:'A privately organized dive to the Titanic wreck site in a new submersible. 12,500 feet down.',
   price:1800000, notReq:0, bonus:{type:'health',val:50}, flex:'+50 max health. You faced the deep.'},
{id:'lx_col01', cat:'Collectibles', n:'1969 Topps Mickey Mantle Final Card PSA 9', e:'⚾', brand:'Topps',
   desc:'Last Mantle card ever printed. Near mint. Pulled from a Collector\'s estate.',
   price:620000, notReq:0, bonus:null, flex:'The end of an era. In your safe.'},
{id:'lx_col02', cat:'Collectibles', n:'2000 Bowman Chrome Tom Brady Rookie Auto PSA 10', e:'🏈', brand:'Bowman',
   desc:'One of the rarest auto rookies in football. Brady signed this before he was Brady.',
   price:3800000, notReq:0, bonus:{type:'attack',val:15}, flex:'+15 ATK — GOAT energy'},
{id:'lx_col03', cat:'Collectibles', n:'LeBron James Topps Chrome Refractor Rookie BGS 9.5', e:'🏀', brand:'Topps',
   desc:'The chrome refractor. The king\'s first card in mint condition.',
   price:5600000, notReq:0, bonus:{type:'xpMult',val:0.10}, flex:'+10% XP permanently'},
{id:'lx_col04', cat:'Collectibles', n:'Wayne Gretzky 1979 O-Pee-Chee Rookie PSA 10', e:'🏒', brand:'O-Pee-Chee',
   desc:'The Great One\'s rookie. Only one PSA 10 known to exist.',
   price:3750000, notReq:0, bonus:null, flex:'The rarest hockey card in existence.'},
{id:'lx_col05', cat:'Collectibles', n:'Lionel Messi 2004 Panini Rookie 1/1 Auto', e:'⚽', brand:'Panini',
   desc:'Original rookie patch auto. 1-of-1. Authenticated by Panini direct.',
   price:2900000, notReq:0, bonus:{type:'cashMult',val:0.08}, flex:'+8% all cash income'},
{id:'lx_col06', cat:'Collectibles', n:'Tiger Woods 2001 Upper Deck Signed Masters Flag', e:'⛳', brand:'Upper Deck',
   desc:'Signed hole-18 flag from his historic 2001 Masters win. COA.',
   price:425000, notReq:0, bonus:null, flex:'The flag from the greatest win ever.'},
{id:'lx_col07', cat:'Collectibles', n:'Muhammad Ali\'s Fight-Worn Gloves — Foreman, Kinshasa 1974', e:'🥊', brand:'Everlast',
   desc:'Worn during the Rumble in the Jungle. Dried blood still visible. Authenticated.',
   price:6500000, notReq:0, bonus:{type:'critChance',val:8}, flex:'+8% crit chance'},
{id:'lx_col08', cat:'Collectibles', n:'Original Apple-1 Computer (Signed by Wozniak)', e:'💻', brand:'Apple',
   desc:'One of 200 made in 1976. Signed by Woz on the board. Fully functional.',
   price:905000, notReq:0, bonus:{type:'energy',val:20}, flex:'+20 max energy'},
{id:'lx_col09', cat:'Collectibles', n:'Neil Armstrong\'s Apollo 11 Mission-Worn Spacesuit Glove', e:'🚀', brand:'NASA',
   desc:'One of the gloves worn during the first Moon landing. Certificate of authenticity.',
   price:19000000, notReq:500, bonus:{type:'notoriety',val:3000}, flex:'+3000 Notoriety. You own the Moon.'},
{id:'lx_col10', cat:'Collectibles', n:'Pablo Picasso\'s Personal Palette', e:'🎨', brand:'Picasso Estate',
   desc:'Paint-covered. Provenance from his Mougins studio. Last used 1972.',
   price:3200000, notReq:0, bonus:null, flex:'The actual palette. Still has paint from the masterworks.'},
{id:'lx_col11', cat:'Collectibles', n:'Babe Ruth\'s 714th Home Run Bat', e:'⚾', brand:'Hillerich & Bradsby',
   desc:'The bat from the record-breaking 714th home run. Certified by MLB.',
   price:1800000, notReq:0, bonus:{type:'attack',val:30}, flex:'+30 ATK — swing for the fences'},
{id:'lx_col12', cat:'Collectibles', n:'Original Star Wars Episode IV Production Script (Lucas Annotated)', e:'🎬', brand:'Lucasfilm',
   desc:'George Lucas\'s personal annotated shooting script. Margin notes throughout.',
   price:4500000, notReq:0, bonus:null, flex:'May the Force be with your collection.'},
{id:'lx_col13', cat:'Collectibles', n:'2003 Exquisite LeBron James Rookie Patch Auto 1/1', e:'🏀', brand:'Upper Deck Exquisite',
   desc:'The card that defined modern collecting. Triple prime patch. One of one.',
   price:9500000, notReq:0, bonus:{type:'xpMult',val:0.25}, flex:'+25% XP permanently'},
{id:'lx_col14', cat:'Collectibles', n:'Michael Jordan\'s 1992 Dream Team Game-Worn Jersey', e:'🏀', brand:'Champion',
   desc:'Worn at the Barcelona Olympics. Gold medal game. COA from MJ\'s personal collection.',
   price:10800000, notReq:300, bonus:{type:'attack',val:50}, flex:'+50 ATK. Dream Team energy.'},
{id:'lx_col15', cat:'Collectibles', n:'Rare Earth Element Collection — Full Periodic Set', e:'⚗️', brand:'Custom — Scientific',
   desc:'Every stable element. Museum display case. 118 samples. Talking piece.',
   price:890000, notReq:0, bonus:{type:'defense',val:20}, flex:'+20 DEF'},
{id:'lx_w01', cat:'Watches', n:'Patek Philippe Nautilus 5726A Annual Calendar', e:'⌚', brand:'Patek Philippe',
   desc:'Stainless steel. Midnight blue dial. Annual calendar. Made for people who hate complications.',
   price:180000, notReq:0, bonus:null, flex:'Understated flex. Steel sports watch at six figures.'},
{id:'lx_w02', cat:'Watches', n:'Rolex Daytona 116500LN "Panda" Ceramic', e:'⌚', brand:'Rolex',
   desc:'2016 release. Ceramic bezel. White panda dial. Years of waitlist. You skipped it.',
   price:45000, notReq:0, bonus:null, flex:'The grail on everyone\'s wrist but yours first.'},
{id:'lx_w03', cat:'Watches', n:'AP Royal Oak "Jumbo" 15202ST 39mm', e:'⌚', brand:'Audemars Piguet',
   desc:'The original 1972 design. Extra thin. Petite tapisserie. Steel. Perfection.',
   price:95000, notReq:0, bonus:null, flex:'Gérald Genta\'s masterpiece on your wrist.'},
{id:'lx_w04', cat:'Watches', n:'Richard Mille RM 11-03 McLaren Flyback', e:'⌚', brand:'Richard Mille',
   desc:'Triple axis tourbillon. GMT flyback. Carbon TPT. 150 pieces.',
   price:480000, notReq:0, bonus:{type:'critChance',val:3}, flex:'+3% crit chance'},
{id:'lx_w05', cat:'Watches', n:'A. Lange & Söhne Lange 1 "Luna Mundi"', e:'⌚', brand:'A. Lange & Söhne',
   desc:'Southern hemisphere moon phase. 150th anniversary. Platinum. 150 pieces.',
   price:320000, notReq:0, bonus:null, flex:'German precision. Lunar poetry.'},
{id:'lx_w06', cat:'Watches', n:'Girard-Perregaux Tourbillon with Three Gold Bridges', e:'⌚', brand:'Girard-Perregaux',
   desc:'Three parallel gold bridges. Flying tourbillon. Skeleton case. 1860 design still made today.',
   price:200000, notReq:0, bonus:null, flex:'The bridge between art and horology.'},
{id:'lx_w07', cat:'Watches', n:'Jaeger-LeCoultre Master Ultra Thin Minute Repeater Flying Tourbillon', e:'⌚', brand:'Jaeger-LeCoultre',
   desc:'Chimes the time. Flying tourbillon. Thinnest minute repeater with tourbillon ever made.',
   price:820000, notReq:0, bonus:{type:'energy',val:10}, flex:'+10 max energy'},
{id:'lx_w08', cat:'Watches', n:'Vacheron Constantin Traditionnelle Twin Beat Perpetual Calendar', e:'⌚', brand:'Vacheron Constantin',
   desc:'Dual oscillation frequency. Saves power when stored. Never needs setting.',
   price:190000, notReq:0, bonus:null, flex:'Zero maintenance. Maximum complexity.'},
{id:'lx_w09', cat:'Watches', n:'Breguet Tourbillon Extra-Plat Automatique 5367', e:'⌚', brand:'Breguet',
   desc:'Thinnest automatic tourbillon in the world. Titanium. Silvered gold dial.',
   price:240000, notReq:0, bonus:null, flex:'The inventor of the tourbillon\'s finest modern work.'},
{id:'lx_w10', cat:'Watches', n:'FP Journe Chronomètre Bleu Tantalum', e:'⌚', brand:'F.P. Journe',
   desc:'Tantalum case. Blue brass movement. Limited edition. Boutique only.',
   price:280000, notReq:0, bonus:{type:'cashMult',val:0.05}, flex:'+5% cash income'},
{id:'lx_w11', cat:'Watches', n:'Philippe Dufour Simplicity 37mm (White Gold)', e:'⌚', brand:'Philippe Dufour',
   desc:'Entirely hand-made by one man. Fewer than 200 in existence. The pinnacle of watchmaking.',
   price:750000, notReq:0, bonus:{type:'xpMult',val:0.05}, flex:'+5% XP — the purist\'s choice'},
{id:'lx_w12', cat:'Watches', n:'H. Moser & Cie Endeavour Perpetual Moon "Concept"', e:'⌚', brand:'H. Moser & Cie',
   desc:'No logo on the dial. Fumé blue. Perpetual moon. The anti-logo statement.',
   price:48000, notReq:0, bonus:null, flex:'Confidence so high you don\'t need a logo.'},
{id:'lx_car21', cat:'Cars', n:'Ferrari 250 GTO (1962, Serial 3413GT)', e:'🚗', brand:'Ferrari',
   desc:'The most valuable car ever made. $70M+ at recent auction. Racing pedigree. You have it.',
   price:70000000, notReq:1000, bonus:{type:'cashMult',val:0.20}, flex:'+20% cash income. The crown jewel.'},
{id:'lx_car22', cat:'Cars', n:'Bugatti Bolide Hypercar', e:'🏎️', brand:'Bugatti',
   desc:'1,825 hp. 0-60 in 2.17 seconds. Track-only. 40 units. W16 engine at full scream.',
   price:4200000, notReq:0, bonus:{type:'stamina',val:15}, flex:'+15 max stamina'},
{id:'lx_car23', cat:'Cars', n:'Koenigsegg One:1 (1-of-7)', e:'🏎️', brand:'Koenigsegg',
   desc:'1,360hp. 1360kg. 1:1 power-to-weight. 7 made. You found one.',
   price:6000000, notReq:0, bonus:{type:'attack',val:40}, flex:'+40 ATK — total power ratio'},
{id:'lx_car24', cat:'Cars', n:'McLaren F1 (1994, Low Mileage)', e:'🏎️', brand:'McLaren',
   desc:'627hp. Central driving position. Gold-lined engine bay. 240mph. The original hypercar.',
   price:20000000, notReq:300, bonus:{type:'critChance',val:5}, flex:'+5% crit chance'},
{id:'lx_car25', cat:'Cars', n:'Porsche 917K Le Mans Racer (Gulf Livery)', e:'🏎️', brand:'Porsche',
   desc:'The most iconic racing car in history. Steve McQueen\'s favorite. Gulf orange and blue.',
   price:14000000, notReq:200, bonus:{type:'defense',val:25}, flex:'+25 DEF — Le Mans tested'},
{id:'lx_car26', cat:'Cars', n:'Mercedes-Benz CLK GTR (Street Version)', e:'🏎️', brand:'Mercedes-AMG',
   desc:'Racing homologation special. 612hp. 26 built. Born on the track. Barely street-legal.',
   price:11000000, notReq:0, bonus:{type:'attack',val:35}, flex:'+35 ATK'},
{id:'lx_car27', cat:'Cars', n:'Lamborghini Miura SV (Restored)', e:'🚗', brand:'Lamborghini',
   desc:'1972. The car that defined supercar design. Concours-grade restoration. Mid-engine V12.',
   price:3900000, notReq:0, bonus:null, flex:'The car that started it all.'},
{id:'lx_car28', cat:'Cars', n:'Bugatti Chiron Super Sport 300+', e:'🏎️', brand:'Bugatti',
   desc:'First car to break 300mph. Special edition. 1578hp. 30 units.',
   price:3900000, notReq:0, bonus:{type:'stamina',val:10}, flex:'+10 max stamina'},
{id:'lx_car29', cat:'Cars', n:'Zenvo Aurora Tur Hypercar', e:'🏎️', brand:'Zenvo',
   desc:'V12 bi-turbo. Dual-axis tilting rear wing. Danish insanity. Hand-built.',
   price:5200000, notReq:0, bonus:{type:'attack',val:30}, flex:'+30 ATK'},
{id:'lx_car30', cat:'Cars', n:'Cadillac Eldorado Biarritz (1959, Fully Restored)', e:'🚗', brand:'Cadillac',
   desc:'Tail fins. Chrome. Baby blue. The American dream made metal. Show quality.',
   price:350000, notReq:0, bonus:null, flex:'The most American car ever made.'},
{id:'lx_car31', cat:'Cars', n:'Land Rover Defender 130 "Dark Hunter" Custom', e:'🚙', brand:'Land Rover x Overfinch',
   desc:'V8 supercharged. Matte black. Night-vision dash. Custom interior. Your field command car.',
   price:420000, notReq:0, bonus:{type:'defense',val:15}, flex:'+15 DEF — ready for anything'},
{id:'lx_car32', cat:'Cars', n:'Ferrari Enzo (Last Known Unsold Example)', e:'🏎️', brand:'Ferrari',
   desc:'660hp. Ceramic brakes. F1-derived gearbox. 400 built. One had never been sold.',
   price:4400000, notReq:0, bonus:{type:'critChance',val:4}, flex:'+4% crit chance'},
{id:'lx_re01', cat:'Real Estate', n:'Gianni Versace\'s Casa Casuarina, Miami Beach', e:'🏠', brand:'Versace Estate',
   desc:'The original Versace mansion. 10 bedrooms. Mosaic pool. Full South Beach block.',
   price:38000000, notReq:0, bonus:{type:'incomeMult',val:0.15}, flex:'+15% property income'},
{id:'lx_re02', cat:'Real Estate', n:'Hearst Castle — San Simeon, California', e:'🏰', brand:'Hearst Corporation Heritage',
   desc:'165 rooms. 4 pools. 3 guesthouses. Private airstrip. 82,000 acres. The real Citizen Kane.',
   price:190000000, notReq:2000, bonus:{type:'incomeMult',val:0.30}, flex:'+30% property income'},
{id:'lx_re03', cat:'Real Estate', n:'Skyfall Lodge — Glencoe, Scotland', e:'🏔️', brand:'Private',
   desc:'The actual filming location for Skyfall. Remote. Fully operational. Helicopter access only.',
   price:8500000, notReq:0, bonus:{type:'defense',val:40}, flex:'+40 DEF — harder to find than 007'},
{id:'lx_re04', cat:'Real Estate', n:'Antilia — Mumbai (Full 27 Floors)', e:'🏢', brand:'Reliance Architecture',
   desc:'The world\'s second most expensive private home. 27 stories. 600 staff. Air traffic room.',
   price:2000000000, notReq:5000, bonus:{type:'cashMult',val:0.50}, flex:'+50% CASH INCOME. The ultimate flex.'},
{id:'lx_re05', cat:'Real Estate', n:'Finca Cortesin Estate, Marbella', e:'🌴', brand:'Custom — Andalusia',
   desc:'15 acres. Golf course. Full hotel staff. 40 bedrooms. Private beach.',
   price:92000000, notReq:0, bonus:{type:'incomeMult',val:0.12}, flex:'+12% property income'},
{id:'lx_re06', cat:'Real Estate', n:'Woolworth Mansion, East 80s, Manhattan', e:'🏙️', brand:'Woolworth Estate',
   desc:'Triplex penthouse. 34 rooms. Gilded Age detail. Your Manhattan fortress.',
   price:79000000, notReq:0, bonus:{type:'cashMult',val:0.10}, flex:'+10% cash income'},
{id:'lx_re07', cat:'Real Estate', n:'Billionaire\'s Row Sky Penthouse — 111 W 57th, NYC', e:'🏙️', brand:'JDS Development',
   desc:'Entire top floor. 8,000sqft. 1,428ft above Manhattan. See five states.',
   price:66000000, notReq:0, bonus:{type:'notoriety',val:5000}, flex:'+5000 Notoriety'},
{id:'lx_re08', cat:'Real Estate', n:'Private Sovereign Island, Fiji (4,000 acres)', e:'🌊', brand:'Private Listing',
   desc:'Titled sovereign territory. Your own laws. 4,000 tropical acres. Two private lagoons.',
   price:450000000, notReq:3000, bonus:{type:'cashMult',val:0.25}, flex:'+25% cash income. Your own country.'},
{id:'lx_re09', cat:'Real Estate', n:'The Crown Estate, Buckinghamshire', e:'🏡', brand:'English Heritage',
   desc:'Tudor mansion. 60 rooms. Moat. 400 acres. Churchill used it during WWII.',
   price:55000000, notReq:0, bonus:{type:'defense',val:50}, flex:'+50 DEF — Churchill-grade security'},
{id:'lx_re10', cat:'Real Estate', n:'Dubai Marina Sky Villa (Full Building)', e:'🌆', brand:'Emaar Properties',
   desc:'You bought the entire 72-story tower. 400 units. Rental income. Your name on the lobby.',
   price:800000000, notReq:4000, bonus:{type:'incomeMult',val:0.40}, flex:'+40% property income. You own the tower.'},
{id:'lx_re11', cat:'Real Estate', n:'Sun Valley Ranch, Idaho (10,000 acres)', e:'🏔️', brand:'Private — Wood River Valley',
   desc:'10,000 acres. Private ski mountain. Three rivers. Hunting. Six guesthouses.',
   price:95000000, notReq:0, bonus:{type:'health',val:100}, flex:'+100 max health'},
{id:'lx_re12', cat:'Real Estate', n:'Greystone Mansion, Beverly Hills', e:'🏡', brand:'Beverly Hills City Heritage',
   desc:'1928. 46 rooms. 18.3 acres. The most filmed mansion in Hollywood history.',
   price:72000000, notReq:0, bonus:{type:'cashMult',val:0.08}, flex:'+8% cash income'},
{id:'lx_jy01', cat:'Jets & Yachts', n:'Boeing 747-8 VIP (Full Interior)', e:'✈️', brand:'Boeing Business Jets',
   desc:'Full 747. Staterooms. Conference room. Infirmary. Cinema. 500 sqft master suite.',
   price:403000000, notReq:2000, bonus:{type:'incomeMult',val:0.20}, flex:'+20% income. You travel like a nation.'},
{id:'lx_jy02', cat:'Jets & Yachts', n:'F-18 Hornet (Demilitarized, Airworthy)', e:'🛩️', brand:'Boeing / USMC Surplus',
   desc:'Fully demilitarized but airworthy. Registered civil aircraft. You can fly it.',
   price:35000000, notReq:500, bonus:{type:'attack',val:80}, flex:'+80 ATK — actual military jet'},
{id:'lx_jy03', cat:'Jets & Yachts', n:'Dassault Falcon 10X', e:'✈️', brand:'Dassault Aviation',
   desc:'9,200nm range. Widest cabin in class. London to Singapore direct. 2024 newest flagship.',
   price:80000000, notReq:0, bonus:{type:'cashMult',val:0.07}, flex:'+7% cash income'},
{id:'lx_jy04', cat:'Jets & Yachts', n:'Project Cayman 160m Superyacht (Custom)', e:'🛥️', brand:'Oceanco',
   desc:'Custom commission. Submarine bay. IMAX cinema. Two swimming pools. 40 guests.',
   price:350000000, notReq:3000, bonus:{type:'incomeMult',val:0.25}, flex:'+25% property income'},
{id:'lx_jy05', cat:'Jets & Yachts', n:'Lurssen 77m "Solandge" Class', e:'⛵', brand:'Lürssen',
   desc:'77m. 5 decks. Helipad. Beach club. Toys garage. Cinema. The perfect 250ft yacht.',
   price:95000000, notReq:0, bonus:{type:'cashMult',val:0.10}, flex:'+10% cash income'},
{id:'lx_jy06', cat:'Jets & Yachts', n:'Hinckley Picnic Boat Mk2 Custom', e:'🚤', brand:'Hinckley',
   desc:'Electric drive. Teak deck. Custom hull. Classic New England style. Quietest boat ever.',
   price:425000, notReq:0, bonus:null, flex:'The quietest, most beautiful runabout ever made.'},
{id:'lx_jy07', cat:'Jets & Yachts', n:'Bell 429 GlobalRanger (VIP, Medical Config)', e:'🚁', brand:'Bell',
   desc:'VIP interior. Medical suite. Your personal air ambulance and commuter in one.',
   price:8000000, notReq:0, bonus:{type:'health',val:50}, flex:'+50 max health'},
{id:'lx_jy08', cat:'Jets & Yachts', n:'Cessna Citation Longitude (Fleet of 3)', e:'✈️', brand:'Cessna',
   desc:'Three identical Citations. One per coast. Plus Europe. Always a jet waiting.',
   price:22000000, notReq:0, bonus:{type:'energy',val:30}, flex:'+30 max energy — always moving'},
{id:'lx_jy09', cat:'Jets & Yachts', n:'Triton 36000/2 Submersible (Full Ocean Depth)', e:'🌊', brand:'Triton Submarines',
   desc:'Certified to 36,000ft — full ocean depth. One of three in private hands.',
   price:48000000, notReq:500, bonus:{type:'lootBonus',val:30}, flex:'+30% loot chance — go where no one has been'},
{id:'lx_jy10', cat:'Jets & Yachts', n:'Aeroscraft ML866 Private Airship', e:'🎈', brand:'Worldwide Aeros Corp',
   desc:'Rigid airship. Cruise at 2,000ft. Private staterooms. The ultimate slow travel.',
   price:65000000, notReq:0, bonus:{type:'cashMult',val:0.06}, flex:'+6% cash income'},
{id:'lx_fa01', cat:'Fashion', n:'Hermès Birkin 40 Noir (Togo, GHW)', e:'👜', brand:'Hermès',
   desc:'The entry point to the Birkin world. Still $80K+ on secondary. 10 month wait.',
   price:82000, notReq:0, bonus:null, flex:'The wait was worth it.'},
{id:'lx_fa02', cat:'Fashion', n:'Chanel 2.55 Reissue 227 (Black Lambskin, 24K Gold)', e:'👜', brand:'Chanel',
   desc:'Redesigned with 24K hardware. Original Mademoiselle lock. Bordeaux lining.',
   price:12000, notReq:0, bonus:null, flex:'Coco\'s original design. Never out of style.'},
{id:'lx_fa03', cat:'Fashion', n:'Dior Haute Couture 7-Piece Wardrobe (Custom)', e:'👗', brand:'Dior Haute Couture',
   desc:'Seven one-of-a-kind pieces. 3,000+ hours of stitching. Paris atelier made.',
   price:500000, notReq:0, bonus:null, flex:'Nobody owns this. Except you.'},
{id:'lx_fa04', cat:'Fashion', n:'Nike x Off-White "The Ten" Complete Set (DS)', e:'👟', brand:'Nike x Virgil Abloh',
   desc:'All 10 pairs. Deadstock. Still in OG bags with zip-ties. Never worn.',
   price:180000, notReq:0, bonus:{type:'energy',val:5}, flex:'+5 energy — fresh kicks, fast feet'},
{id:'lx_fa05', cat:'Fashion', n:'Air Jordan 1 "Shattered Backboard" Player Exclusive', e:'👟', brand:'Nike',
   desc:'Jordan wore these in Italy in 1985. Player exclusive colorway. Only 3 pairs known.',
   price:620000, notReq:0, bonus:{type:'attack',val:10}, flex:'+10 ATK — MJ energy'},
{id:'lx_fa06', cat:'Fashion', n:'Gucci x Balenciaga "Hacker Project" Full Look', e:'🧥', brand:'Gucci x Balenciaga',
   desc:'The collab of the decade. GG logo inside Balenciaga typeface. Full runway look.',
   price:45000, notReq:0, bonus:null, flex:'Two houses. One look. All you.'},
{id:'lx_fa07', cat:'Fashion', n:'Bottega Veneta Intrecciato Crocodile Maxi Bag', e:'👜', brand:'Bottega Veneta',
   desc:'Crocodile skin. Woven by hand. No logo. The label for people who don\'t need one.',
   price:75000, notReq:0, bonus:null, flex:'The anti-logo flex. Harder to spot. Harder to ignore.'},
{id:'lx_fa08', cat:'Fashion', n:'Louis Vuitton x Yayoi Kusama Dot Trunk', e:'🧳', brand:'Louis Vuitton x Yayoi Kusama',
   desc:'Full polka-dot LV monogram trunk. Hand-painted by Kusama herself. One commissioned.',
   price:2200000, notReq:0, bonus:{type:'notoriety',val:500}, flex:'+500 Notoriety'},
{id:'lx_fa09', cat:'Fashion', n:'Berluti Scritto Leather Briefcase (Bespoke)', e:'💼', brand:'Berluti',
   desc:'Hand-patinated leather. Your initials carved into the grain. 6-month wait.',
   price:22000, notReq:0, bonus:null, flex:'The briefcase that closes every deal.'},
{id:'lx_fa10', cat:'Fashion', n:'Stefano Bemer MTM Oxford Shoes (Bespoke)', e:'👞', brand:'Stefano Bemer',
   desc:'Hand-lasted to your foot. 40 hours of cobbling. Finest calf leather. Florence.',
   price:8500, notReq:0, bonus:null, flex:'The best shoes money can buy. Period.'},
{id:'lx_fa11', cat:'Fashion', n:'Canada Goose x OVO Drake Edition Parka (1/1)', e:'🧥', brand:'Canada Goose x OVO',
   desc:'Custom Drake collaboration. Gold OVO owl embroidered. Signed interior tag.',
   price:95000, notReq:0, bonus:{type:'defense',val:8}, flex:'+8 DEF — proper cold weather armor'},
{id:'lx_fa12', cat:'Fashion', n:'Rolex Explorer II "Steve McQueen" Ref.1655 (Original)', e:'⌚', brand:'Rolex',
   desc:'Steve McQueen\'s personal Explorer II. Proven provenance. Orange hand.',
   price:280000, notReq:0, bonus:{type:'critChance',val:2}, flex:'+2% crit chance — McQueen cool'},
{id:'lx_ao01', cat:'Art & Objects', n:'Jeff Koons "Balloon Dog" (Orange, Stainless)', e:'🎨', brand:'Jeff Koons Studio',
   desc:'The most expensive work by a living American artist sold at auction. $58.4M. Yours now.',
   price:58400000, notReq:0, bonus:{type:'notoriety',val:8000}, flex:'+8000 Notoriety'},
{id:'lx_ao02', cat:'Art & Objects', n:'Damien Hirst "For the Love of God" Diamond Skull', e:'💀', brand:'Damien Hirst',
   desc:'8,601 diamonds. Platinum cast of a human skull. $100M. The most expensive artwork at launch.',
   price:100000000, notReq:1000, bonus:{type:'notoriety',val:15000}, flex:'+15000 Notoriety. The flex of flexes.'},
{id:'lx_ao03', cat:'Art & Objects', n:'Jean-Michel Basquiat "Untitled" (1982, Crown)', e:'🎨', brand:'Basquiat Estate',
   desc:'Acquired at Sotheby\'s for $110.5M. The King Alphonso piece. Street to auction house.',
   price:110500000, notReq:0, bonus:{type:'cashMult',val:0.15}, flex:'+15% cash income'},
{id:'lx_ao04', cat:'Art & Objects', n:'Warhol "Gold Marilyn Monroe" (1962 Original)', e:'🎨', brand:'Warhol Foundation',
   desc:'Gold background. Original 1962 silkscreen. Provenance back to 1970 auction.',
   price:195000000, notReq:2000, bonus:{type:'notoriety',val:20000}, flex:'+20000 Notoriety'},
{id:'lx_ao05', cat:'Art & Objects', n:'Fabergé Winter Egg (Imperial, 1913)', e:'🥚', brand:'Fabergé',
   desc:'Rock crystal. Platinum. Imperial provenance. One of only 43 Imperial Fabergé Eggs known.',
   price:9500000, notReq:0, bonus:{type:'incomeMult',val:0.08}, flex:'+8% property income'},
{id:'lx_ao06', cat:'Art & Objects', n:'Michelangelo Marble Study (Authenticated Fragment)', e:'🗿', brand:'Uffizi Provenance',
   desc:'3kg marble fragment. Michelangelo\'s studio documented. Full provenance.',
   price:12000000, notReq:0, bonus:{type:'defense',val:30}, flex:'+30 DEF'},
{id:'lx_ao07', cat:'Art & Objects', n:'Rembrandt "Self Portrait" (1659 Original)', e:'🎨', brand:'Private Dutch Collection',
   desc:'Emerged from a private Dutch estate. Authenticated in 2022. Never publicly shown.',
   price:89000000, notReq:0, bonus:{type:'xpMult',val:0.15}, flex:'+15% XP'},
{id:'lx_ao08', cat:'Art & Objects', n:'Cy Twombly "Untitled (New York City)" 1968', e:'🎨', brand:'Gagosian',
   desc:'Blackboard series. Chalk loops on grey. The most copied painting of the century.',
   price:22000000, notReq:0, bonus:{type:'cashMult',val:0.06}, flex:'+6% cash'},
{id:'lx_ao09', cat:'Art & Objects', n:'Ancient Roman Marble Gladiator Helmet (100 AD)', e:'🪖', brand:'Roman Antiquities — Sotheby\'s',
   desc:'Full bronze-lined marble replica used in gladiatorial display. Provenance from Naples dig.',
   price:5500000, notReq:0, bonus:{type:'defense',val:25}, flex:'+25 DEF — Roman-tested'},
{id:'lx_ao10', cat:'Art & Objects', n:'Banksy "Devolved Parliament" (Original)', e:'🎨', brand:'Banksy',
   desc:'Brexit chimpanzees in Parliament. Sold for $12.2M in 2019. Largest Banksy at auction.',
   price:12200000, notReq:0, bonus:{type:'notoriety',val:2000}, flex:'+2000 Notoriety'},
{id:'lx_tg01', cat:'Tech & Gadgets', n:'Neuralink Neural Interface (V2 Private)', e:'🧠', brand:'Neuralink',
   desc:'Not public yet. But your money gets you the second-generation device. Mind-machine.',
   price:2500000, notReq:0, bonus:{type:'energy',val:50}, flex:'+50 max energy — direct neural tap'},
{id:'lx_tg02', cat:'Tech & Gadgets', n:'Full Nuclear Bunker (DEFCON 1 Spec)', e:'🏗️', brand:'Atlas Survival Shelters',
   desc:'Underground. 10,000sqft. 5-year supply. NBC filtration. Your city-proof fortress.',
   price:15000000, notReq:0, bonus:{type:'health',val:200}, flex:'+200 max health — you survive everything'},
{id:'lx_tg03', cat:'Tech & Gadgets', n:'FLIR-Equipped Predator Drone (Demil)', e:'🛸', brand:'General Atomics (Demil)',
   desc:'Full-size surveillance drone. Demilitarized. FLIR thermal. GPS tracking. Operational.',
   price:5000000, notReq:500, bonus:{type:'lootBonus',val:25}, flex:'+25% loot chance — eyes everywhere'},
{id:'lx_tg04', cat:'Tech & Gadgets', n:'Rolls-Royce Merlin V12 Aircraft Engine (Display)', e:'⚙️', brand:'Rolls-Royce',
   desc:'1943 Spitfire-spec Merlin. Fully restored and running. Museum quality. 1,470hp.',
   price:2800000, notReq:0, bonus:{type:'attack',val:20}, flex:'+20 ATK'},
{id:'lx_tg05', cat:'Tech & Gadgets', n:'IBM Quantum Computer (5000 Qubit Array)', e:'💻', brand:'IBM Quantum',
   desc:'Private lab quantum computer. 5,000 qubit. Climate-controlled room. AI applications.',
   price:100000000, notReq:2000, bonus:{type:'cashMult',val:0.20}, flex:'+20% cash income. Compute everything.'},
{id:'lx_tg06', cat:'Tech & Gadgets', n:'Custom Armored iPhone (Caviar + IronCase)', e:'📱', brand:'Caviar x Apple',
   desc:'Titanium shell. Patek Philippe dial insert. Bulletproof glass. One built.',
   price:1800000, notReq:0, bonus:{type:'defense',val:10}, flex:'+10 DEF'},
{id:'lx_tg07', cat:'Tech & Gadgets', n:'Wilson Audio WAMM Master Chronosonic Speakers', e:'🔊', brand:'Wilson Audio',
   desc:'$685,000 per pair. Most accurate speakers ever measured. Your listening room.',
   price:685000, notReq:0, bonus:null, flex:'The most accurate sound reproduction in history.'},
{id:'lx_tg08', cat:'Tech & Gadgets', n:'Palladium Membership — Davos Inner Circle', e:'🌍', brand:'World Economic Forum',
   desc:'Year-round private access. Pre-Davos briefings. The rooms where decisions are made.',
   price:50000000, notReq:3000, bonus:{type:'cashMult',val:0.30}, flex:'+30% cash income. You\'re in the room.'},
{id:'lx_fd01', cat:'Food & Drink', n:'Kopi Luwak Private Estate Reserve (1kg)', e:'☕', brand:'Heritage Bali Estate',
   desc:'Civet-processed. Single-estate. Shade-grown. The rarest coffee on earth.',
   price:1200, notReq:0, bonus:null, flex:'The world\'s most exclusive cup.'},
{id:'lx_fd02', cat:'Food & Drink', n:'Almas Beluga Caviar — 1kg Tin (White)', e:'🫧', brand:'House of Caviar',
   desc:'From 100+ year old albino Beluga sturgeon. $34,000 per kilo. White gold.',
   price:34000, notReq:0, bonus:null, flex:'White caviar from a 100-year-old fish.'},
{id:'lx_fd03', cat:'Food & Drink', n:'Pappy Van Winkle 23yr (Case of 12)', e:'🥃', brand:'Buffalo Trace Distillery',
   desc:'The unicorn bourbon. 12 bottles. Direct allocation. Worth $50K retail if you can find it.',
   price:50000, notReq:0, bonus:null, flex:'Bourbon that people have actually committed crimes for.'},
{id:'lx_fd04', cat:'Food & Drink', n:'1945 Romanée-Conti Bottle (Single, Certified)', e:'🍷', brand:'Domaine de la Romanée-Conti',
   desc:'$558,000 at Sotheby\'s. Pre-phylloxera vines. The rarest wine bottle in the world.',
   price:558000, notReq:0, bonus:{type:'cashMult',val:0.03}, flex:'+3% cash income'},
{id:'lx_fd05', cat:'Food & Drink', n:'Nusret "Salt Bae" Private Gold Steak Dinner', e:'🥩', brand:'Nusr-Et Private',
   desc:'$1,800 gold-leaf steak. Reserved private dining room. Gold flake poured tableside.',
   price:25000, notReq:0, bonus:{type:'health',val:25}, flex:'+25 max health — the steak of champions'},
{id:'lx_fd06', cat:'Food & Drink', n:'Louis XIII Rare Cask 42.6 Cognac', e:'🍶', brand:'Rémy Martin',
   desc:'100-year blend. 41.6% ABV. 738 decanters. Each numbered. Crystal flacon.',
   price:22000, notReq:0, bonus:null, flex:'A hundred years in every glass.'},
{id:'lx_fd07', cat:'Food & Drink', n:'Dom Pérignon P3 1970 (Jeroboam)', e:'🍾', brand:'Dom Pérignon',
   desc:'Third-plénitude release. Third fermentation cycle. 50+ year Champagne in 3L format.',
   price:42000, notReq:0, bonus:null, flex:'50-year-old Champagne. For the night you earned this.'},
{id:'lx_fd08', cat:'Food & Drink', n:'Cigar Collection — H. Upmann 1844 Reserve Master Set', e:'🚬', brand:'H. Upmann',
   desc:'500-cigar humidor. Six year aged. Hand-rolled by master rollers. Cedar-lined.',
   price:65000, notReq:0, bonus:null, flex:'The Don always has a cigar for a moment like this.'},
{id:'lx_ea01', cat:'Exotic Animals', n:'Silver Arowana "Super Red" Pair', e:'🐟', brand:'Indonesian Breeder',
   desc:'Known as the dragon fish. Blood-red scales. $400K for a pair this color.',
   price:400000, notReq:0, bonus:null, flex:'The fish that brings fortune. Displayed in the office.'},
{id:'lx_ea02', cat:'Exotic Animals', n:'White Peacock Flock (6 birds)', e:'🦚', brand:'Royal Wildlife Estate, UK',
   desc:'Six white Indian peafowl. From Windsor Estate stock. Roam the grounds.',
   price:180000, notReq:0, bonus:null, flex:'Windsor Castle rejected this offer. You accepted.'},
{id:'lx_ea03', cat:'Exotic Animals', n:'Clouded Leopard (Captive-bred, F5)', e:'🐱', brand:'Exotic Feline Rescue',
   desc:'Rarest big cat in private hands. Spotted coat. Docile F5 generation.',
   price:850000, notReq:0, bonus:{type:'critChance',val:5}, flex:'+5% crit chance — predator energy'},
{id:'lx_ea04', cat:'Exotic Animals', n:'Komodo Dragon Enclosure (Private)', e:'🦎', brand:'Indonisian Wildlife Authority',
   desc:'Three male Komodo dragons in a custom 5,000sqft enclosure. Venomous. Terrifying.',
   price:2500000, notReq:0, bonus:{type:'defense',val:35}, flex:'+35 DEF — nobody tests you'},
{id:'lx_ea05', cat:'Exotic Animals', n:'Thoroughbred Racehorse — Grade 1 Winner', e:'🐎', brand:'Coolmore / Private',
   desc:'Won two Grade 1s. Stud fee at $300K/year. Racing bloodline. Your colors.',
   price:12000000, notReq:0, bonus:{type:'incomeMult',val:0.10}, flex:'+10% income — the horse pays for itself'},
{id:'lx_ea06', cat:'Exotic Animals', n:'Giant Pacific Octopus (Custom Aquarium)', e:'🐙', brand:'Monterey Aquarium Surplus',
   desc:'2,000-gallon custom tank. Temperature-controlled. The most intelligent invertebrate.',
   price:350000, notReq:0, bonus:null, flex:'The smartest animal in any room you\'re in.'},
{id:'lx_n302', cat:'Trading Cards', n:'Pokemon Base Set Booster Pack', e:'🃏', brand:'Pokemon',
   desc:'Sealed 1999 pack. Could be a Charizard.',
   price:500, notReq:0, bonus:null, flex:'The nostalgia tax is real.'},
{id:'lx_n303', cat:'Trading Cards', n:'Yu-Gi-Oh! Blue-Eyes White Dragon 1st Ed', e:'🐉', brand:'Konami',
   desc:'LOB-001. The OG boss monster.',
   price:2500, notReq:0, bonus:null, flex:'Heart of the cards, baby.'},
{id:'lx_n304', cat:'Trading Cards', n:'Magic: The Gathering Black Lotus', e:'🌸', brand:'WotC',
   desc:'Alpha edition. The most expensive card in gaming history.',
   price:250000, notReq:0, bonus:null, flex:'You dont play it. You frame it.'},
{id:'lx_n305', cat:'Trading Cards', n:'Pokemon 1st Ed Charizard PSA 10', e:'🔥', brand:'Pokemon',
   desc:'The card that broke eBay.',
   price:300000, notReq:0, bonus:null, flex:'$300K for a piece of cardboard. Worth it.'},
{id:'lx_n306', cat:'Trading Cards', n:'2003 LeBron Topps Chrome Refractor', e:'🏀', brand:'Topps',
   desc:'RC PSA 10. The King as a rookie.',
   price:180000, notReq:0, bonus:null, flex:'Before the headband era.'},
{id:'lx_n307', cat:'Trading Cards', n:'1989 Upper Deck Ken Griffey Jr RC', e:'⚾', brand:'Upper Deck',
   desc:'The card that defined the 90s.',
   price:1500, notReq:0, bonus:null, flex:'Junior was different.'},
{id:'lx_n308', cat:'Trading Cards', n:'2009 Bowman Chrome Mike Trout Auto', e:'⚾', brand:'Bowman',
   desc:'Superfractor 1/1. The unicorn.',
   price:4000000, notReq:0, bonus:null, flex:'One of one. Literally.'},
{id:'lx_n309', cat:'Trading Cards', n:'1993 Finest Refractor Michael Jordan', e:'🏀', brand:'Topps',
   desc:'The most beautiful basketball card ever made.',
   price:50000, notReq:0, bonus:null, flex:'That refractor shine.'},
{id:'lx_n310', cat:'Trading Cards', n:'Panini Prizm Luka Doncic Silver RC', e:'🏀', brand:'Panini',
   desc:'2018-19. The next big thing.',
   price:8000, notReq:0, bonus:null, flex:'Generational talent, generational card.'},
{id:'lx_n311', cat:'Trading Cards', n:'2021 Topps Chrome Shohei Ohtani Auto', e:'⚾', brand:'Topps',
   desc:'Numbered /25. Two-way GOAT.',
   price:25000, notReq:0, bonus:null, flex:'He pitches AND hits.'},
{id:'lx_n312', cat:'Trading Cards', n:'1986 Garbage Pail Kids Series 1 Set', e:'🤮', brand:'Topps',
   desc:'Complete set. Peak gross-out humor.',
   price:800, notReq:0, bonus:null, flex:'Adam Bomb forever.'},
{id:'lx_n313', cat:'Gaming', n:'Used PS2 from Goodwill', e:'🎮', brand:'Sony',
   desc:'Scratched but works. Comes with 1 controller.',
   price:25, notReq:0, bonus:null, flex:'The nostalgia machine.'},
{id:'lx_n314', cat:'Gaming', n:'Nintendo Switch', e:'🎮', brand:'Nintendo',
   desc:'Standard edition. Zelda not included.',
   price:300, notReq:0, bonus:null, flex:'Portable gaming perfection.'},
{id:'lx_n315', cat:'Gaming', n:'PlayStation 5 Pro', e:'🎮', brand:'Sony',
   desc:'The most powerful PlayStation ever.',
   price:700, notReq:0, bonus:null, flex:'4K 120fps. Your TV cant even do that.'},
{id:'lx_n316', cat:'Gaming', n:'Xbox Series X', e:'🎮', brand:'Microsoft',
   desc:'12 teraflops of raw power.',
   price:500, notReq:0, bonus:null, flex:'Game Pass makes it worth it.'},
{id:'lx_n317', cat:'Gaming', n:'Nintendo 64 CIB', e:'🕹️', brand:'Nintendo',
   desc:'Complete in box. GoldenEye included.',
   price:350, notReq:0, bonus:null, flex:'The party console.'},
{id:'lx_n318', cat:'Gaming', n:'Custom Gaming PC', e:'💻', brand:'Custom',
   desc:'RTX 4090, i9-14900K, 64GB RAM, 4TB SSD.',
   price:5000, notReq:0, bonus:null, flex:'More power than NASA in the 60s.'},
{id:'lx_n319', cat:'Gaming', n:'Sealed NES Super Mario Bros', e:'🍄', brand:'Nintendo',
   desc:'Wata 9.6 A+. Museum piece.',
   price:1500000, notReq:0, bonus:null, flex:'A sealed box worth more than most houses.'},
{id:'lx_n320', cat:'Gaming', n:'Arcade Cabinet — Street Fighter II', e:'🕹️', brand:'Capcom',
   desc:'Original 1991 cabinet. Working.',
   price:8000, notReq:0, bonus:null, flex:'HADOUKEN in your living room.'},
{id:'lx_n321', cat:'Gaming', n:'Steam Deck OLED', e:'🎮', brand:'Valve',
   desc:'Handheld PC gaming. 1TB.',
   price:650, notReq:0, bonus:null, flex:'PC gaming on the toilet.'},
{id:'lx_n322', cat:'Gaming', n:'Retro Game Collection (500 games)', e:'📦', brand:'Various',
   desc:'NES through PS2. The full childhood.',
   price:2500, notReq:0, bonus:null, flex:'Every game you rented from Blockbuster.'},
{id:'lx_n323', cat:'Gaming', n:'VR Headset — Meta Quest 3', e:'🥽', brand:'Meta',
   desc:'Mixed reality. The future is now.',
   price:500, notReq:0, bonus:null, flex:'Punching your TV not included.'},
{id:'lx_n324', cat:'Gaming', n:'Limited Edition Gold PS5 Controller', e:'🎮', brand:'Sony',
   desc:'24K gold plated. Purely flex.',
   price:15000, notReq:0, bonus:null, flex:'Gaming in luxury.'},
{id:'lx_n325', cat:'Electronics', n:'32" Walmart Special TV', e:'📺', brand:'TCL',
   desc:'720p. It works. Thats about it.',
   price:100, notReq:0, bonus:null, flex:'Budget king.'},
{id:'lx_n326', cat:'Electronics', n:'55" Samsung QLED 4K', e:'📺', brand:'Samsung',
   desc:'Quantum dots. Pretty colors.',
   price:800, notReq:0, bonus:null, flex:'The sweet spot.'},
{id:'lx_n327', cat:'Electronics', n:'65" LG C4 OLED', e:'📺', brand:'LG',
   desc:'Perfect blacks. Gaming ready.',
   price:2000, notReq:0, bonus:null, flex:'Once you go OLED you never go back.'},
{id:'lx_n328', cat:'Electronics', n:'77" Sony Bravia XR OLED', e:'📺', brand:'Sony',
   desc:'The TV that makes you hate your old one.',
   price:3500, notReq:0, bonus:null, flex:'Every pixel is perfect.'},
{id:'lx_n329', cat:'Electronics', n:'85" Samsung The Wall', e:'📺', brand:'Samsung',
   desc:'MicroLED. Modular. Absurd.',
   price:80000, notReq:0, bonus:null, flex:'Its literally a wall that shows TV.'},
{id:'lx_n330', cat:'Electronics', n:'110" Samsung MicroLED', e:'📺', brand:'Samsung',
   desc:'$150K TV. For when 85" isnt enough.',
   price:150000, notReq:0, bonus:null, flex:'Your living room is now a theater.'},
{id:'lx_n331', cat:'Electronics', n:'AirPods Pro 2', e:'🎧', brand:'Apple',
   desc:'Active noise canceling. Spatial audio.',
   price:250, notReq:0, bonus:null, flex:'The white earbuds that took over the world.'},
{id:'lx_n332', cat:'Electronics', n:'Sony WH-1000XM5', e:'🎧', brand:'Sony',
   desc:'Best noise canceling headphones. Period.',
   price:350, notReq:0, bonus:null, flex:'Silence is golden.'},
{id:'lx_n333', cat:'Electronics', n:'Sonos Arc Soundbar', e:'🔊', brand:'Sonos',
   desc:'Dolby Atmos. 11 speakers.',
   price:900, notReq:0, bonus:null, flex:'Your neighbors will hate you.'},
{id:'lx_n334', cat:'Electronics', n:'MacBook Pro M4 Max', e:'💻', brand:'Apple',
   desc:'64GB RAM. Creative powerhouse.',
   price:4000, notReq:0, bonus:null, flex:'The laptop that replaced desktops.'},
{id:'lx_n335', cat:'Electronics', n:'iPhone 16 Pro Max', e:'📱', brand:'Apple',
   desc:'1TB Titanium. Desert Titanium.',
   price:1600, notReq:0, bonus:null, flex:'The phone that costs more than rent.'},
{id:'lx_n336', cat:'Electronics', n:'Samsung Galaxy Z Fold 6', e:'📱', brand:'Samsung',
   desc:'Foldable. The future, sort of.',
   price:1900, notReq:0, bonus:null, flex:'A tablet that fits in your pocket.'},
{id:'lx_n337', cat:'Electronics', n:'Dyson Purifier', e:'🌬️', brand:'Dyson',
   desc:'HEPA filter. Flex for clean air.',
   price:600, notReq:0, bonus:null, flex:'Breathing expensive air.'},
{id:'lx_n338', cat:'Electronics', n:'B&O Beolab 90 Speakers', e:'🔊', brand:'B&O',
   desc:'Pair. The worlds best speakers.',
   price:80000, notReq:0, bonus:null, flex:'Sound so good it makes you cry.'},
{id:'lx_n339', cat:'Electronics', n:'Hasselblad X2D Camera', e:'📷', brand:'Hasselblad',
   desc:'100MP medium format. For real photographers.',
   price:8000, notReq:0, bonus:null, flex:'NASA used these on the moon.'},
{id:'lx_n340', cat:'Beaters', n:'1997 Honda Civic with 250K miles', e:'🚗', brand:'Honda',
   desc:'Check engine light is always on. Runs great.',
   price:1500, notReq:0, bonus:null, flex:'The cockroach of cars.'},
{id:'lx_n341', cat:'Beaters', n:'2004 Toyota Camry', e:'🚗', brand:'Toyota',
   desc:'Beige. 180K miles. Unkillable.',
   price:3000, notReq:0, bonus:null, flex:'Your grandmas car.'},
{id:'lx_n342', cat:'Beaters', n:'1999 Ford Taurus', e:'🚗', brand:'Ford',
   desc:'The official car of not caring.',
   price:800, notReq:0, bonus:null, flex:'It gets you there. Eventually.'},
{id:'lx_n343', cat:'Beaters', n:'2001 Nissan Altima', e:'🚗', brand:'Nissan',
   desc:'No bumper. Temporary tag. Runs.',
   price:2000, notReq:0, bonus:null, flex:'The official car of no insurance.'},
{id:'lx_n344', cat:'Beaters', n:'2006 Pontiac Grand Prix', e:'🚗', brand:'Pontiac',
   desc:'From a brand that doesnt exist anymore.',
   price:1200, notReq:0, bonus:null, flex:'RIP Pontiac.'},
{id:'lx_n345', cat:'Beaters', n:'2008 Chevy Impala', e:'🚗', brand:'Chevrolet',
   desc:'Ex-police. Spotlight still attached.',
   price:2500, notReq:0, bonus:null, flex:'Undercover vibes.'},
{id:'lx_n346', cat:'Beaters', n:'1995 Jeep Cherokee', e:'🚙', brand:'Jeep',
   desc:'Rust is structural at this point.',
   price:1800, notReq:0, bonus:null, flex:'The original SUV.'},
{id:'lx_n347', cat:'Beaters', n:'2010 Kia Forte', e:'🚗', brand:'Kia',
   desc:'Surprisingly reliable. Ugly though.',
   price:4000, notReq:0, bonus:null, flex:'Kia: Killed In Action (your pride).'},
{id:'lx_n348', cat:'Beaters', n:'2003 Ford F-150', e:'🛻', brand:'Ford',
   desc:'300K miles. Bed is rusted through.',
   price:5000, notReq:0, bonus:null, flex:'Americas truck.'},
{id:'lx_n349', cat:'Beaters', n:'2012 Hyundai Elantra', e:'🚗', brand:'Hyundai',
   desc:'Base model. Manual windows.',
   price:4500, notReq:0, bonus:null, flex:'It has AC. Thats the feature.'},
{id:'lx_n350', cat:'Beaters', n:'Craigslist Mystery Van', e:'🚐', brand:'Unknown',
   desc:'No title. Cash only. Runs...sometimes.',
   price:500, notReq:0, bonus:null, flex:'What could go wrong?'},
{id:'lx_n351', cat:'Golf', n:'Bucket of Range Balls', e:'⛳', brand:'Generic',
   desc:'100 balls. Go hit some.',
   price:5, notReq:0, bonus:null, flex:'Therapy is cheaper than a round.'},
{id:'lx_n352', cat:'Golf', n:'Used Putter from Play It Again Sports', e:'⛳', brand:'Various',
   desc:'Odyssey 2-Ball. Scuffed but rolls true.',
   price:25, notReq:0, bonus:null, flex:'Pre-owned strokes saved.'},
{id:'lx_n353', cat:'Golf', n:'Callaway Strata Complete Set', e:'⛳', brand:'Callaway',
   desc:'Beginner set. Everything you need.',
   price:500, notReq:0, bonus:null, flex:'Good enough to lose in the woods.'},
{id:'lx_n354', cat:'Golf', n:'TaylorMade Stealth 2 Driver', e:'⛳', brand:'TaylorMade',
   desc:'Carbon face. Pure distance.',
   price:580, notReq:0, bonus:null, flex:'The excuse for your slice.'},
{id:'lx_n355', cat:'Golf', n:'Titleist Pro V1 (Dozen)', e:'⛳', brand:'Titleist',
   desc:'The gold standard of golf balls.',
   price:55, notReq:0, bonus:null, flex:'$4.50 per ball you lose in the water.'},
{id:'lx_n356', cat:'Golf', n:'Scotty Cameron Putter', e:'⛳', brand:'Titleist',
   desc:'Newport 2. Tour proven.',
   price:400, notReq:0, bonus:null, flex:'The putter that costs more than your driver.'},
{id:'lx_n357', cat:'Golf', n:'Full Custom Fitting Session', e:'⛳', brand:'Trackman',
   desc:'Launch monitor. Every club fitted.',
   price:3000, notReq:0, bonus:null, flex:'Data-driven disappointment.'},
{id:'lx_n358', cat:'Golf', n:'Augusta National Guest Pass', e:'⛳', brand:'Augusta',
   desc:'One round. Caddied. Life changing.',
   price:50000, notReq:0, bonus:null, flex:'The cathedral of golf.'},
{id:'lx_n359', cat:'Golf', n:'Golf Simulator Room', e:'⛳', brand:'TrackMan',
   desc:'Full setup. Play any course from home.',
   price:75000, notReq:0, bonus:null, flex:'Pebble Beach in your basement.'},
{id:'lx_n360', cat:'Golf', n:'PXG Full Bag Custom', e:'⛳', brand:'PXG',
   desc:'0311 irons, driver, woods, wedges. All fitted.',
   price:8000, notReq:0, bonus:null, flex:'The bag that says I have money.'},
{id:'lx_n361', cat:'Golf', n:'Cart Girl Tip Fund', e:'⛳', brand:'N/A',
   desc:'$100 tab for beer and snacks on course.',
   price:100, notReq:0, bonus:null, flex:'The real reason you play.'},
{id:'lx_n362', cat:'Experiences', n:'Greyhound Bus Ticket (One Way)', e:'🚌', brand:'Greyhound',
   desc:'Cross country. Questionable seatmates.',
   price:50, notReq:0, bonus:null, flex:'The humbling experience.'},
{id:'lx_n363', cat:'Experiences', n:'Weekend in Vegas', e:'🎰', brand:'Vegas',
   desc:'Flight + 2 nights at Bellagio.',
   price:1500, notReq:0, bonus:null, flex:'What happens in Vegas shows up on your credit card.'},
{id:'lx_n364', cat:'Experiences', n:'Coachella VIP Weekend', e:'🎵', brand:'AEG',
   desc:'VIP tent. All 3 days.',
   price:2500, notReq:0, bonus:null, flex:'Festival flu is real.'},
{id:'lx_n365', cat:'Experiences', n:'African Safari (2 weeks)', e:'🦁', brand:'Private',
   desc:'Kenya + Tanzania. Big 5.',
   price:25000, notReq:0, bonus:null, flex:'The bucket list trip.'},
{id:'lx_n366', cat:'Experiences', n:'Northern Lights Private Trip', e:'🌌', brand:'Iceland',
   desc:'Week in Iceland. Private guide.',
   price:15000, notReq:0, bonus:null, flex:'Natures LED display.'},
{id:'lx_n367', cat:'Experiences', n:'Climb Mount Everest', e:'🏔️', brand:'Nepal',
   desc:'Full guided expedition. Oxygen included.',
   price:85000, notReq:0, bonus:null, flex:'Because its there.'},
{id:'lx_n368', cat:'Experiences', n:'Zero Gravity Flight', e:'🚀', brand:'Zero-G',
   desc:'Parabolic flight. Float like an astronaut.',
   price:8000, notReq:0, bonus:null, flex:'Vomit comet, luxury edition.'},
{id:'lx_n369', cat:'Experiences', n:'Richard Branson Space Flight', e:'🚀', brand:'Virgin',
   desc:'Suborbital. See Earth from space.',
   price:450000, notReq:0, bonus:null, flex:'The ultimate flex.'},
{id:'lx_n370', cat:'Experiences', n:'Private Island Week (Maldives)', e:'🏝️', brand:'Four Seasons',
   desc:'Entire island. Staff of 40.',
   price:200000, notReq:0, bonus:null, flex:'Population: you.'},
{id:'lx_n371', cat:'Experiences', n:'Submarine Tour of Titanic', e:'🔱', brand:'OceanGate',
   desc:'Visit the wreck. 12,500 feet down.',
   price:250000, notReq:0, bonus:null, flex:'Too soon? Maybe.'},
{id:'lx_n372', cat:'Experiences', n:'Around the World in 80 Days', e:'✈️', brand:'Private',
   desc:'Private jet. 15 countries.',
   price:500000, notReq:0, bonus:null, flex:'Jules Verne had it right.'},
{id:'lx_n373', cat:'Experiences', n:'Buy a Seat on SpaceX Starship', e:'🚀', brand:'SpaceX',
   desc:'Orbital flight. Multi-day.',
   price:5000000, notReq:0, bonus:null, flex:'The final frontier of flexing.'},
{id:'lx_n374', cat:'Watches', n:'Casio F-91W', e:'⌚', brand:'Casio',
   desc:'The $10 watch that works better than most.',
   price:10, notReq:0, bonus:null, flex:'The terrorist watch that tells perfect time.'},
{id:'lx_n375', cat:'Watches', n:'Timex Weekender', e:'⌚', brand:'Timex',
   desc:'Takes a licking, keeps on ticking.',
   price:40, notReq:0, bonus:null, flex:'Your grandpas go-to.'},
{id:'lx_n376', cat:'Watches', n:'Seiko 5 Automatic', e:'⌚', brand:'Seiko',
   desc:'The gateway drug to watch collecting.',
   price:100, notReq:0, bonus:null, flex:'The best $100 youll spend.'},
{id:'lx_n377', cat:'Watches', n:'G-Shock DW5600', e:'⌚', brand:'Casio',
   desc:'Indestructible. Military approved.',
   price:60, notReq:0, bonus:null, flex:'The watch that survived everything.'},
{id:'lx_n378', cat:'Watches', n:'Apple Watch Ultra 2', e:'⌚', brand:'Apple',
   desc:'Titanium. GPS. Your wrist computer.',
   price:800, notReq:0, bonus:null, flex:'Notifies you about standing too much.'},
{id:'lx_n379', cat:'Watches', n:'Garmin Fenix 8', e:'⌚', brand:'Garmin',
   desc:'Adventure watch. 30-day battery.',
   price:1000, notReq:0, bonus:null, flex:'For people who run ultramarathons.'},
{id:'lx_n380', cat:'Watches', n:'Tag Heuer Monaco', e:'⌚', brand:'Tag Heuer',
   desc:'Steve McQueen wore this in Le Mans.',
   price:6500, notReq:0, bonus:null, flex:'Motorsport heritage on your wrist.'},
{id:'lx_n381', cat:'Watches', n:'Omega Seamaster', e:'⌚', brand:'Omega',
   desc:'James Bond approved.',
   price:5500, notReq:0, bonus:null, flex:'Shaken, not stirred.'},
{id:'lx_n382', cat:'Real Estate', n:'Abandoned Detroit House', e:'🏚️', brand:'City',
   desc:'Needs everything. $1 if you pay the taxes.',
   price:5000, notReq:0, bonus:null, flex:'Fixer-upper is generous.'},
{id:'lx_n383', cat:'Real Estate', n:'Mobile Home in Florida', e:'🏠', brand:'Various',
   desc:'1998 single-wide. AC works sometimes.',
   price:15000, notReq:0, bonus:null, flex:'Tornado magnet.'},
{id:'lx_n384', cat:'Real Estate', n:'Studio Apartment (NYC, Cash)', e:'🏢', brand:'Manhattan',
   desc:'400 sqft. East Village.',
   price:800000, notReq:0, bonus:null, flex:'Smaller than your parking spot back home.'},
{id:'lx_n385', cat:'Real Estate', n:'McMansion in Texas', e:'🏘️', brand:'Builder',
   desc:'6,000 sqft. HOA is insane.',
   price:500000, notReq:0, bonus:null, flex:'Everything is bigger in Texas.'},
{id:'lx_n386', cat:'Real Estate', n:'Ranch in Montana', e:'🏡', brand:'Private',
   desc:'500 acres. Mountains. Freedom.',
   price:3000000, notReq:0, bonus:null, flex:'Yellowstone vibes.'},
{id:'lx_n387', cat:'Real Estate', n:'Malibu Beach House', e:'🏖️', brand:'Private',
   desc:'Oceanfront. 4BR. PCH address.',
   price:15000000, notReq:0, bonus:null, flex:'Salt air and celebrities.'},
{id:'lx_n388', cat:'Real Estate', n:'Manhattan Penthouse', e:'🏙️', brand:'Private',
   desc:'Central Park views. 8,000 sqft.',
   price:45000000, notReq:0, bonus:null, flex:'The ultimate NYC flex.'},
{id:'lx_n389', cat:'Real Estate', n:'Private Island (Caribbean)', e:'🏝️', brand:'Private',
   desc:'50 acres. Fully developed. Staff.',
   price:75000000, notReq:0, bonus:null, flex:'Your own country, basically.'},
{id:'lx_n390', cat:'Real Estate', n:'Buckingham Palace', e:'🏰', brand:'Crown',
   desc:'Just kidding. But what if?',
   price:500000000, notReq:0, bonus:null, flex:'The ultimate real estate flex.'},
{id:'lx_n391', cat:'Food & Drink', n:'Gas Station Hot Dog', e:'🌭', brand:'7-Eleven',
   desc:'Been on the roller since Tuesday.',
   price:2, notReq:0, bonus:null, flex:'Living dangerously.'},
{id:'lx_n392', cat:'Food & Drink', n:'Costco Hot Dog Combo', e:'🌭', brand:'Costco',
   desc:'$1.50 forever. The unbreakable deal.',
   price:2, notReq:0, bonus:null, flex:'The best deal in America.'},
{id:'lx_n393', cat:'Food & Drink', n:'Case of Natty Light', e:'🍺', brand:'Natural Light',
   desc:'30-rack. The college special.',
   price:20, notReq:0, bonus:null, flex:'Hydration station.'},
{id:'lx_n394', cat:'Food & Drink', n:'Wagyu A5 Steak Dinner', e:'🥩', brand:'Japanese',
   desc:'4oz strip. Melts on your tongue.',
   price:250, notReq:0, bonus:null, flex:'The steak that ruins all other steaks.'},
{id:'lx_n395', cat:'Food & Drink', n:'Dom Pérignon 2012', e:'🍾', brand:'Moët',
   desc:'The celebration bottle.',
   price:250, notReq:0, bonus:null, flex:'Pop it when you prestige.'},
{id:'lx_n396', cat:'Food & Drink', n:'Macallan 25 Year Scotch', e:'🥃', brand:'Macallan',
   desc:'Quarter century of aging.',
   price:2000, notReq:0, bonus:null, flex:'Liquid time capsule.'},
{id:'lx_n397', cat:'Food & Drink', n:'White Truffle (1 lb)', e:'🍄', brand:'Italian',
   desc:'Alba truffle. Worth more than gold.',
   price:5000, notReq:0, bonus:null, flex:'Shaved on everything.'},
{id:'lx_n398', cat:'Food & Drink', n:'Omakase at Jiro', e:'🍣', brand:'Jiro',
   desc:'Tokyo. 20 courses. Reservation impossible.',
   price:500, notReq:0, bonus:null, flex:'Worth the 6 month wait.'},
{id:'lx_n399', cat:'Food & Drink', n:'Romanée-Conti 1945', e:'🍷', brand:'DRC',
   desc:'The most expensive wine ever sold.',
   price:558000, notReq:0, bonus:null, flex:'$558K for a bottle of grape juice.'},
{id:'lx_n400', cat:'Food & Drink', n:'McDonalds Dollar Menu Meal', e:'🍔', brand:'McDonalds',
   desc:'McChicken, fries, drink. The classic.',
   price:4, notReq:0, bonus:null, flex:'The struggle meal that slaps.'},
{id:'lx_n401', cat:'Food & Drink', n:'Taco Bell Cravings Box', e:'🌮', brand:'Taco Bell',
   desc:'More food than you need for $5.',
   price:5, notReq:0, bonus:null, flex:'Live Mas.'},
{id:'lx_n402', cat:'Food & Drink', n:'Personal Chef (1 Year)', e:'👨‍🍳', brand:'Private',
   desc:'Michelin-trained. Cooks 3 meals daily.',
   price:250000, notReq:0, bonus:null, flex:'Never cooking again.'},
{id:'lx_n403', cat:'Fashion', n:'Walmart White Tees (5 Pack)', e:'👕', brand:'Fruit of the Loom',
   desc:'The essentials.',
   price:8, notReq:0, bonus:null, flex:'The foundation of any wardrobe.'},
{id:'lx_n404', cat:'Fashion', n:'Air Force 1s', e:'👟', brand:'Nike',
   desc:'White on white. The classic.',
   price:120, notReq:0, bonus:null, flex:'The shoe that goes with everything.'},
{id:'lx_n405', cat:'Fashion', n:'Carhartt Beanie', e:'🧢', brand:'Carhartt',
   desc:'Every hipster and construction worker.',
   price:20, notReq:0, bonus:null, flex:'Blue collar drip.'},
{id:'lx_n406', cat:'Fashion', n:'Jordan 1 Retro High OG', e:'👟', brand:'Nike',
   desc:'Chicago colorway. The GOAT shoe.',
   price:180, notReq:0, bonus:null, flex:'MJ approved.'},
{id:'lx_n407', cat:'Fashion', n:'Thrift Store Fur Coat', e:'🧥', brand:'Unknown',
   desc:'Could be mink. Could be cat.',
   price:45, notReq:0, bonus:null, flex:'Vintage vibes.'},
{id:'lx_n408', cat:'Fashion', n:'Canada Goose Parka', e:'🧥', brand:'CG',
   desc:'$1000 to be warm. Or $50 for a Carhartt.',
   price:1200, notReq:0, bonus:null, flex:'The overpriced warmth.'},
{id:'lx_n409', cat:'Fashion', n:'Off-White x Nike Collab', e:'👟', brand:'Off-White',
   desc:'Virgil Abloh design. "SHOELACES".',
   price:2500, notReq:0, bonus:null, flex:'Quotes on everything.'},
{id:'lx_n410', cat:'Fashion', n:'Hermès Birkin Bag', e:'👜', brand:'Hermès',
   desc:'Togo leather. Wait list: 3 years.',
   price:15000, notReq:0, bonus:null, flex:'The bag that appreciates like stock.'},
{id:'lx_n411', cat:'Fashion', n:'Travis Scott x Fragment Jordan 1', e:'👟', brand:'Nike',
   desc:'The grail. Low.',
   price:3500, notReq:0, bonus:null, flex:'Reverse mocha madness.'},
{id:'lx_n412', cat:'Jewelry', n:'Vending Machine Ring', e:'💍', brand:'Generic',
   desc:'25 cents. Turns your finger green.',
   price:1, notReq:0, bonus:null, flex:'True love on a budget.'},
{id:'lx_n413', cat:'Jewelry', n:'Cubic Zirconia Studs', e:'💎', brand:'Generic',
   desc:'They look real from 5 feet away.',
   price:15, notReq:0, bonus:null, flex:'Fake it til you make it.'},
{id:'lx_n414', cat:'Jewelry', n:'Sterling Silver Chain', e:'⛓️', brand:'Generic',
   desc:'925. Doesnt turn green.',
   price:50, notReq:0, bonus:null, flex:'Starter chain.'},
{id:'lx_n415', cat:'Jewelry', n:'Gold Plated Cuban Link', e:'⛓️', brand:'Generic',
   desc:'Looks good for about 3 months.',
   price:80, notReq:0, bonus:null, flex:'The temporary flex.'},
{id:'lx_n416', cat:'Jewelry', n:'14K Gold Rope Chain', e:'⛓️', brand:'14K',
   desc:'Real gold. 24 inch.',
   price:800, notReq:0, bonus:null, flex:'The real deal.'},
{id:'lx_n417', cat:'Sports', n:'Used Yoga Mat from TJ Maxx', e:'🧘', brand:'Generic',
   desc:'Slightly used. Smells like lavender and regret.',
   price:10, notReq:0, bonus:null, flex:'Namaste on a budget.'},
{id:'lx_n418', cat:'Sports', n:'Peloton Bike', e:'🚴', brand:'Peloton',
   desc:'The $2000 clothes hanger.',
   price:2000, notReq:0, bonus:null, flex:'Guilt subscription: $44/month.'},
{id:'lx_n419', cat:'Sports', n:'Courtside NBA Tickets', e:'🏀', brand:'NBA',
   desc:'Lakers vs Celtics. Front row.',
   price:15000, notReq:0, bonus:null, flex:'Close enough to smell the sweat.'},
{id:'lx_n420', cat:'Sports', n:'Super Bowl Tickets (50 yd line)', e:'🏈', brand:'NFL',
   desc:'The biggest game. Best seats.',
   price:25000, notReq:0, bonus:null, flex:'Once in a lifetime.'},
{id:'lx_n421', cat:'Sports', n:'UFC Octagonside Seats', e:'🥊', brand:'UFC',
   desc:'Feel the blood spray.',
   price:5000, notReq:0, bonus:null, flex:'Violence up close.'},
{id:'lx_n422', cat:'Sports', n:'Home Gym Setup', e:'🏋️', brand:'Rogue',
   desc:'Full rack, bench, plates, dumbbells.',
   price:5000, notReq:0, bonus:null, flex:'No more gym bros.'},
{id:'lx_n423', cat:'Sports', n:'Professional Boxing Ring', e:'🥊', brand:'Everlast',
   desc:'Full size. In your backyard.',
   price:15000, notReq:0, bonus:null, flex:'Rocky training montage ready.'},
{id:'lx_n424', cat:'Sports', n:'Custom Basketball Court', e:'🏀', brand:'Sport Court',
   desc:'Full court. Your logo.',
   price:100000, notReq:0, bonus:null, flex:'Shoot around any time.'},
{id:'lx_n425', cat:'Exotic Animals', n:'Goldfish', e:'🐠', brand:'PetSmart',
   desc:'Your first pet. $0.30.',
   price:1, notReq:0, bonus:null, flex:'Lives 2 weeks. Maybe.'},
{id:'lx_n426', cat:'Exotic Animals', n:'French Bulldog Puppy', e:'🐕', brand:'Breeder',
   desc:'Instagram-ready. Breathing issues included.',
   price:5000, notReq:0, bonus:null, flex:'The influencer pet.'},
{id:'lx_n427', cat:'Exotic Animals', n:'Thoroughbred Racehorse', e:'🐎', brand:'Kentucky',
   desc:'Untested 2-year-old. Dreams of the Derby.',
   price:500000, notReq:0, bonus:null, flex:'Money pit with legs.'},
{id:'lx_n428', cat:'Exotic Animals', n:'Albino Python', e:'🐍', brand:'Exotic',
   desc:'12 feet. Gentle giant.',
   price:8000, notReq:0, bonus:null, flex:'The conversation starter.'},
{id:'lx_n429', cat:'Ridiculous', n:'NFT of a Rock', e:'🪨', brand:'EtherRock',
   desc:'Yes, really. Its a jpeg of a rock.',
   price:100, notReq:0, bonus:null, flex:'Web3 was a mistake.'},
{id:'lx_n430', cat:'Ridiculous', n:'Star Named After You', e:'⭐', brand:'Star Registry',
   desc:'Not official. Not recognized. But romantic.',
   price:30, notReq:0, bonus:null, flex:'Its right there next to the other scam stars.'},
{id:'lx_n431', cat:'Ridiculous', n:'1 Bitcoin', e:'₿', brand:'Satoshi',
   desc:'Digital gold. Or digital tulip.',
   price:100000, notReq:0, bonus:null, flex:'HODL.'},
{id:'lx_n432', cat:'Ridiculous', n:'Decommissioned Tank', e:'🪖', brand:'Military',
   desc:'T-72. Street legal in some states.',
   price:50000, notReq:0, bonus:null, flex:'Rush hour is YOUR hour.'},
{id:'lx_n433', cat:'Ridiculous', n:'Meteorite Fragment', e:'☄️', brand:'Space',
   desc:'4.6 billion years old. Older than everything.',
   price:15000, notReq:0, bonus:null, flex:'Literally out of this world.'},
{id:'lx_n434', cat:'Ridiculous', n:'Giant Inflatable Duck', e:'🦆', brand:'Amazon',
   desc:'30 feet tall. For your pool.',
   price:200, notReq:0, bonus:null, flex:'Assert dominance over your HOA.'},
{id:'lx_n435', cat:'Ridiculous', n:'Title of Lord/Lady', e:'👑', brand:'Scotland',
   desc:'1 square foot of Scottish land.',
   price:50, notReq:0, bonus:null, flex:'Technically royalty.'},
{id:'lx_n436', cat:'Ridiculous', n:'Cold War Bunker', e:'🏗️', brand:'Government',
   desc:'Nebraska. Blast-proof. Needs work.',
   price:300000, notReq:0, bonus:null, flex:'For when things get real.'},
{id:'lx_n437', cat:'Ridiculous', n:'Dinosaur Skull (T-Rex)', e:'🦖', brand:'Auction',
   desc:'Partially complete. Museum quality.',
   price:12000000, notReq:0, bonus:null, flex:'65 million years of flex.'},
{id:'lx_n438', cat:'Ridiculous', n:'Trip to the Bottom of the Ocean', e:'🌊', brand:'Triton',
   desc:'Mariana Trench. 7 miles down.',
   price:750000, notReq:0, bonus:null, flex:'Deeper than your pockets.'},
{id:'lx_n439', cat:'Ridiculous', n:'Name a Cockroach After Your Ex', e:'🪳', brand:'Bronx Zoo',
   desc:'The Bronx Zoo actually does this.',
   price:10, notReq:0, bonus:null, flex:'Petty but satisfying.'},
{id:'lx_m501', cat:'Sneakers', n:'Payless Velcro Shoes', e:'👟', brand:'Payless',
   desc:'$12 and zero respect.',
   price:12, notReq:0, bonus:null, flex:'Rock bottom.'},
{id:'lx_m502', cat:'Sneakers', n:'Crocs Classic Clog', e:'👟', brand:'Crocs',
   desc:'Comfort over everything.',
   price:45, notReq:0, bonus:null, flex:'Sport mode engaged.'},
{id:'lx_m503', cat:'Sneakers', n:'New Balance 550', e:'👟', brand:'NB',
   desc:'The dad shoe that became cool.',
   price:110, notReq:0, bonus:null, flex:'Normcore king.'},
{id:'lx_m504', cat:'Sneakers', n:'Yeezy 350 v2 Zebra', e:'👟', brand:'Adidas',
   desc:'Kanyes magnum opus.',
   price:300, notReq:0, bonus:null, flex:'Walking on boost.'},
{id:'lx_m505', cat:'Sneakers', n:'Nike Dunk Low Panda', e:'👟', brand:'Nike',
   desc:'The shoe that crashed SNKRS.',
   price:120, notReq:0, bonus:null, flex:'Everyone has them. You need them.'},
{id:'lx_m506', cat:'Sneakers', n:'Jordan 4 Retro Military Black', e:'👟', brand:'Nike',
   desc:'The silhouette that wont die.',
   price:250, notReq:0, bonus:null, flex:'MJ signed off on these.'},
{id:'lx_m507', cat:'Sneakers', n:'Nike MAG Back to the Future', e:'👟', brand:'Nike',
   desc:'Self-lacing. Limited to 89 pairs.',
   price:100000, notReq:0, bonus:null, flex:'Power laces!'},
{id:'lx_m508', cat:'Sneakers', n:'Nike Air Yeezy 2 Red October', e:'👟', brand:'Nike',
   desc:'The shoe that changed everything.',
   price:15000, notReq:0, bonus:null, flex:'Pre-Adidas Kanye peak.'},
{id:'lx_m509', cat:'Sneakers', n:'Jordan 1 Dior', e:'👟', brand:'Dior',
   desc:'8500 pairs made. Air Dior.',
   price:12000, notReq:0, bonus:null, flex:'Fashion meets basketball.'},
{id:'lx_m510', cat:'Sneakers', n:'Louis Vuitton x Nike AF1', e:'👟', brand:'LV',
   desc:'Virgil Abloh Sothebys auction pair.',
   price:350000, notReq:0, bonus:null, flex:'The most expensive AF1 ever.'},
{id:'lx_m511', cat:'Music', n:'Kazoo', e:'🎵', brand:'Generic',
   desc:'The instrument that requires zero talent.',
   price:3, notReq:0, bonus:null, flex:'Musical genius.'},
{id:'lx_m512', cat:'Music', n:'Yamaha Acoustic Guitar', e:'🎸', brand:'Yamaha',
   desc:'FG800. Starter guitar legend.',
   price:200, notReq:0, bonus:null, flex:'Wonderwall awaits.'},
{id:'lx_m513', cat:'Music', n:'Fender Stratocaster', e:'🎸', brand:'Fender',
   desc:'American Professional II. The sound of rock.',
   price:1800, notReq:0, bonus:null, flex:'Hendrix played one.'},
{id:'lx_m514', cat:'Music', n:'Gibson Les Paul Custom', e:'🎸', brand:'Gibson',
   desc:'Ebony finish. The tuxedo guitar.',
   price:5000, notReq:0, bonus:null, flex:'Pure sustain.'},
{id:'lx_m515', cat:'Music', n:'Steinway Grand Piano', e:'🎹', brand:'Steinway',
   desc:'Model D Concert Grand. 9 feet of perfection.',
   price:180000, notReq:0, bonus:null, flex:'The piano that plays in Carnegie Hall.'},
{id:'lx_m516', cat:'Music', n:'Stradivarius Violin', e:'🎻', brand:'Stradivari',
   desc:'1714 ex-Joachim. Priceless history.',
   price:16000000, notReq:0, bonus:null, flex:'300 years old. Still the best.'},
{id:'lx_m517', cat:'Music', n:'Vinyl Record Collection (10,000)', e:'🎵', brand:'Various',
   desc:'Every genre. Every era.',
   price:50000, notReq:0, bonus:null, flex:'The ultimate music library.'},
{id:'lx_m518', cat:'Music', n:'Recording Studio Setup', e:'🎙️', brand:'Pro',
   desc:'SSL console, monitors, mics, the works.',
   price:500000, notReq:0, bonus:null, flex:'Hit factory.'},
{id:'lx_m519', cat:'Music', n:'Marshall Full Stack', e:'🔊', brand:'Marshall',
   desc:'JCM800 head + 2 cabs. Deafening.',
   price:4000, notReq:0, bonus:null, flex:'Spinal Tap approved.'},
{id:'lx_m520', cat:'Books', n:'Used Paperback from Goodwill', e:'📖', brand:'Various',
   desc:'Smells like basement. $1.',
   price:1, notReq:0, bonus:null, flex:'Knowledge for pennies.'},
{id:'lx_m521', cat:'Books', n:'Kindle Paperwhite', e:'📱', brand:'Amazon',
   desc:'10,000 books in your hand.',
   price:150, notReq:0, bonus:null, flex:'The book lovers gadget.'},
{id:'lx_m522', cat:'Books', n:'First Edition Harry Potter', e:'📖', brand:'Bloomsbury',
   desc:'Philosophers Stone. 1997. 500 printed.',
   price:80000, notReq:0, bonus:null, flex:'The book that made reading cool again.'},
{id:'lx_m523', cat:'Books', n:'Gutenberg Bible Page', e:'📜', brand:'Gutenberg',
   desc:'Single leaf. 1455. Museum quality.',
   price:300000, notReq:0, bonus:null, flex:'The first printed anything.'},
{id:'lx_m524', cat:'Books', n:'Harvard MBA', e:'🎓', brand:'Harvard',
   desc:'2 years. The ultimate networking event.',
   price:200000, notReq:0, bonus:null, flex:'The three letters that open doors.'},
{id:'lx_m525', cat:'Books', n:'Private Library (5000 books)', e:'📚', brand:'Custom',
   desc:'Floor to ceiling. Leather bound.',
   price:100000, notReq:0, bonus:null, flex:'Beauty and the Beast vibes.'},
{id:'lx_m526', cat:'Motorcycles', n:'Walmart Mountain Bike', e:'🚲', brand:'Mongoose',
   desc:'$99 special. Brakes optional.',
   price:99, notReq:0, bonus:null, flex:'Tour de Walmart.'},
{id:'lx_m527', cat:'Motorcycles', n:'Trek Domane SL7', e:'🚲', brand:'Trek',
   desc:'Full carbon. Di2 electronic shifting.',
   price:12000, notReq:0, bonus:null, flex:'Lance Armstrong speed.'},
{id:'lx_m528', cat:'Motorcycles', n:'Harley Davidson Fat Boy', e:'🏍️', brand:'Harley',
   desc:'Terminator vibes. 114ci Milwaukee Eight.',
   price:22000, notReq:0, bonus:null, flex:'Born to be wild.'},
{id:'lx_m529', cat:'Motorcycles', n:'Ducati Panigale V4R', e:'🏍️', brand:'Ducati',
   desc:'998cc. 234hp. Italian missile.',
   price:40000, notReq:0, bonus:null, flex:'Street legal MotoGP.'},
{id:'lx_m530', cat:'Motorcycles', n:'Confederate Hellcat', e:'🏍️', brand:'Confederate',
   desc:'$100K custom chopper. Rolling sculpture.',
   price:100000, notReq:0, bonus:null, flex:'Art that goes 160mph.'},
{id:'lx_m531', cat:'Motorcycles', n:'Vespa GTS 300', e:'🛵', brand:'Vespa',
   desc:'Roman Holiday energy.',
   price:8000, notReq:0, bonus:null, flex:'European scooter chic.'},
{id:'lx_m532', cat:'Cigars & Spirits', n:'Gas Station Cigar', e:'🚬', brand:'Swisher',
   desc:'Swisher Sweet. Grape.',
   price:2, notReq:0, bonus:null, flex:'The hood classic.'},
{id:'lx_m533', cat:'Cigars & Spirits', n:'Cuban Cohiba Behike', e:'🚬', brand:'Cohiba',
   desc:'BHK 56. The king of Cubans.',
   price:80, notReq:0, bonus:null, flex:'Fidels favorite.'},
{id:'lx_m534', cat:'Cigars & Spirits', n:'Box of Padron 1926 (24)', e:'🚬', brand:'Padron',
   desc:'80th Anniversary. God tier.',
   price:800, notReq:0, bonus:null, flex:'The cigar snobs choice.'},
{id:'lx_m535', cat:'Cigars & Spirits', n:'Hennessy Paradis', e:'🥃', brand:'Hennessy',
   desc:'100+ eaux-de-vie. Velvet in a bottle.',
   price:900, notReq:0, bonus:null, flex:'Rap royalty approved.'},
{id:'lx_m536', cat:'Cigars & Spirits', n:'Louis XIII Cognac', e:'🥃', brand:'Rémy Martin',
   desc:'1,200 eaux-de-vie. Crystal decanter.',
   price:4000, notReq:0, bonus:null, flex:'Sipped, never shot.'},
{id:'lx_m537', cat:'Cigars & Spirits', n:'Pappy Van Winkle 23 Year', e:'🥃', brand:'Buffalo Trace',
   desc:'The unicorn of bourbon.',
   price:5000, notReq:0, bonus:null, flex:'Harder to find than a honest politician.'},
{id:'lx_m538', cat:'Cigars & Spirits', n:'Dalmore 62 Year', e:'🥃', brand:'Dalmore',
   desc:'Only 12 bottles exist.',
   price:250000, notReq:0, bonus:null, flex:'Liquid history.'},
{id:'lx_m539', cat:'Toys & Nostalgia', n:'Hot Wheels Car', e:'🚗', brand:'Mattel',
   desc:'$1 and infinite imagination.',
   price:1, notReq:0, bonus:null, flex:'Every kid had 200 of these.'},
{id:'lx_m540', cat:'Toys & Nostalgia', n:'LEGO Star Wars Millennium Falcon', e:'🧱', brand:'LEGO',
   desc:'UCS 75192. 7,541 pieces.',
   price:850, notReq:0, bonus:null, flex:'3 days to build. Worth it.'},
{id:'lx_m541', cat:'Toys & Nostalgia', n:'Original 1977 Star Wars Figures (Set)', e:'🧸', brand:'Kenner',
   desc:'All 12. Carded.',
   price:50000, notReq:0, bonus:null, flex:'The toys that started it all.'},
{id:'lx_m542', cat:'Toys & Nostalgia', n:'Beanie Baby Princess Diana', e:'🧸', brand:'Ty',
   desc:'The holy grail of Beanie Babies.',
   price:500000, notReq:0, bonus:null, flex:'Your moms retirement fund.'},
{id:'lx_m543', cat:'Toys & Nostalgia', n:'Vintage G.I. Joe Collection', e:'🧸', brand:'Hasbro',
   desc:'1964 originals. Complete.',
   price:25000, notReq:0, bonus:null, flex:'Real American Hero.'},
{id:'lx_m544', cat:'Toys & Nostalgia', n:'Nintendo Game Boy (Mint)', e:'🎮', brand:'Nintendo',
   desc:'1989. In original box.',
   price:500, notReq:0, bonus:null, flex:'Tetris machine.'},
{id:'lx_m545', cat:'Toys & Nostalgia', n:'Furby (1998 Original)', e:'🦉', brand:'Tiger',
   desc:'First edition. Still creepy.',
   price:100, notReq:0, bonus:null, flex:'It never shuts up.'},
{id:'lx_m546', cat:'Toys & Nostalgia', n:'Tamagotchi', e:'🥚', brand:'Bandai',
   desc:'Keep it alive. Or dont.',
   price:25, notReq:0, bonus:null, flex:'Digital pet cemetery.'},
{id:'lx_m547', cat:'Tools & Garage', n:'Harbor Freight Toolset', e:'🔧', brand:'HF',
   desc:'170 pieces. Will break within a year.',
   price:50, notReq:0, bonus:null, flex:'Good enough.'},
{id:'lx_m548', cat:'Tools & Garage', n:'Snap-On Tool Chest', e:'🔧', brand:'Snap-On',
   desc:'Full rollaway. Cherry red.',
   price:15000, notReq:0, bonus:null, flex:'The mechanics flex.'},
{id:'lx_m549', cat:'Tools & Garage', n:'Welder', e:'🔥', brand:'Lincoln',
   desc:'MIG 255. Build anything.',
   price:3000, notReq:0, bonus:null, flex:'Blue collar creation.'},
{id:'lx_m550', cat:'Tools & Garage', n:'CNC Machine', e:'⚙️', brand:'Haas',
   desc:'VF-2. Make your own parts.',
   price:80000, notReq:0, bonus:null, flex:'Manufacturing power.'},
{id:'lx_m551', cat:'Tools & Garage', n:'3D Printer Farm (10 units)', e:'🖨️', brand:'Prusa',
   desc:'Print anything. 24/7.',
   price:15000, notReq:0, bonus:null, flex:'The factory of the future.'},
{id:'lx_m552', cat:'Home', n:'IKEA KALLAX Shelf', e:'🪑', brand:'IKEA',
   desc:'The shelf in every apartment.',
   price:70, notReq:0, bonus:null, flex:'Adult LEGO.'},
{id:'lx_m553', cat:'Home', n:'Herman Miller Aeron Chair', e:'🪑', brand:'HM',
   desc:'The office chair that costs more than your desk.',
   price:1800, notReq:0, bonus:null, flex:'Silicon Valley standard.'},
{id:'lx_m554', cat:'Home', n:'La-Z-Boy Recliner', e:'🛋️', brand:'La-Z-Boy',
   desc:'Peak comfort. Zero ambition.',
   price:1200, notReq:0, bonus:null, flex:'Sunday mode activated.'},
{id:'lx_m555', cat:'Home', n:'Custom Home Theater', e:'📽️', brand:'Custom',
   desc:'4K projector, 150 screen, Dolby Atmos.',
   price:50000, notReq:0, bonus:null, flex:'Movie theater at home.'},
{id:'lx_m556', cat:'Home', n:'Italian Marble Kitchen', e:'🏠', brand:'Custom',
   desc:'Full renovation. Carrara marble.',
   price:200000, notReq:0, bonus:null, flex:'Cooking in luxury.'},
{id:'lx_m557', cat:'Home', n:'Infinity Pool', e:'🏊', brand:'Custom',
   desc:'Edge-to-edge. Heated. LED lit.',
   price:150000, notReq:0, bonus:null, flex:'The Instagram pool.'},
{id:'lx_m558', cat:'Home', n:'Smart Home System', e:'🏠', brand:'Control4',
   desc:'Every light, lock, camera automated.',
   price:25000, notReq:0, bonus:null, flex:'The house runs itself.'},
{id:'lx_m559', cat:'Home', n:'Wine Cellar (500 bottle)', e:'🍷', brand:'Custom',
   desc:'Climate controlled. Display worthy.',
   price:80000, notReq:0, bonus:null, flex:'Temperature-controlled flexing.'},
{id:'lx_m560', cat:'Crypto & Finance', n:'$5 in Dogecoin', e:'🐕', brand:'DOGE',
   desc:'Much wow. Very investment.',
   price:5, notReq:0, bonus:null, flex:'To the moon. Someday.'},
{id:'lx_m561', cat:'Crypto & Finance', n:'1 Ethereum', e:'💎', brand:'ETH',
   desc:'Smart contracts. Smart money.',
   price:4000, notReq:0, bonus:null, flex:'The programmable flex.'},
{id:'lx_m562', cat:'Crypto & Finance', n:'10 Bitcoin', e:'₿', brand:'BTC',
   desc:'Digital gold. 10 whole coins.',
   price:1000000, notReq:0, bonus:null, flex:'Satoshi would be proud.'},
{id:'lx_m563', cat:'Crypto & Finance', n:'Bored Ape NFT', e:'🐒', brand:'BAYC',
   desc:'The $200K jpeg of a monkey.',
   price:200000, notReq:0, bonus:null, flex:'Web3 clout.'},
{id:'lx_m564', cat:'Crypto & Finance', n:'Berkshire Hathaway Class A Share', e:'📈', brand:'BRK.A',
   desc:'One share. The most expensive stock.',
   price:600000, notReq:0, bonus:null, flex:'Warren Buffett energy.'},
{id:'lx_m565', cat:'Space', n:'Meteorite Necklace', e:'☄️', brand:'Space',
   desc:'Fragment pendant. 4 billion years old.',
   price:200, notReq:0, bonus:null, flex:'Wearing the cosmos.'},
{id:'lx_m566', cat:'Space', n:'NASA Astronaut Suit (Replica)', e:'🧑‍🚀', brand:'NASA',
   desc:'EVA suit replica. Museum grade.',
   price:10000, notReq:0, bonus:null, flex:'One small step for drip.'},
{id:'lx_m567', cat:'Space', n:'Moon Rock Fragment', e:'🌕', brand:'NASA',
   desc:'Actual lunar sample. Certified.',
   price:2000000, notReq:0, bonus:null, flex:'32 came back. You own one.'},
{id:'lx_m568', cat:'Space', n:'Name a Star', e:'⭐', brand:'Registry',
   desc:'Not official. Still romantic.',
   price:30, notReq:0, bonus:null, flex:'Technically meaningless.'},
{id:'lx_m569', cat:'Space', n:'Satellite Launch', e:'🛰️', brand:'SpaceX',
   desc:'Put your payload in orbit.',
   price:5000000, notReq:0, bonus:null, flex:'Your own satellite.'},
{id:'lx_m570', cat:'Space', n:'Mars Colony Reservation', e:'🔴', brand:'SpaceX',
   desc:'Deposit for a seat to Mars.',
   price:250000, notReq:0, bonus:null, flex:'Elon promised 2029.'},
{id:'lx_m571', cat:'Art', n:'Velvet Elvis Painting', e:'🖼️', brand:'Unknown',
   desc:'From a garage sale. Ironically cool.',
   price:15, notReq:0, bonus:null, flex:'Peak taste.'},
{id:'lx_m572', cat:'Art', n:'Banksy Print', e:'🖼️', brand:'Banksy',
   desc:'Girl With Balloon. Numbered.',
   price:25000, notReq:0, bonus:null, flex:'Shreds itself for extra value.'},
{id:'lx_m573', cat:'Art', n:'Andy Warhol Campbell Soup', e:'🖼️', brand:'Warhol',
   desc:'Signed screenprint. Pop art icon.',
   price:500000, notReq:0, bonus:null, flex:'Mmm mmm good.'},
{id:'lx_m574', cat:'Art', n:'Da Vinci Salvator Mundi', e:'🖼️', brand:'Da Vinci',
   desc:'The most expensive painting ever sold.',
   price:450000000, notReq:0, bonus:null, flex:'$450M for Jesus with a crystal ball.'},
{id:'lx_m575', cat:'Weapons', n:'Butterfly Knife', e:'🔪', brand:'Custom',
   desc:'Balisong. Titanium. Flip tricks.',
   price:200, notReq:0, bonus:null, flex:'All skill, no damage.'},
{id:'lx_m576', cat:'Weapons', n:'Custom Katana', e:'⚔️', brand:'Japanese',
   desc:'Hand-forged tamahagane steel.',
   price:5000, notReq:0, bonus:null, flex:'Bushido code included.'},
{id:'lx_m577', cat:'Weapons', n:'Medieval Suit of Armor', e:'🛡️', brand:'Replica',
   desc:'Full plate. Display ready.',
   price:8000, notReq:0, bonus:null, flex:'Knight at your front door.'},
{id:'lx_m578', cat:'Weapons', n:'Civil War Cannon', e:'💣', brand:'Antique',
   desc:'12-pounder Napoleon. Restored.',
   price:50000, notReq:0, bonus:null, flex:'HOA violation guaranteed.'},
{id:'lx_m579', cat:'Weapons', n:'Decommissioned Fighter Jet', e:'✈️', brand:'Military',
   desc:'F-4 Phantom. No weapons. Display only.',
   price:300000, notReq:0, bonus:null, flex:'Your lawn ornament.'},
{id:'lx_m580', cat:'Memes & Internet', n:'Doge Original Photo Print', e:'🐕', brand:'Kabosu',
   desc:'The Shiba that launched crypto.',
   price:500, notReq:0, bonus:null, flex:'Much frame. Very art.'},
{id:'lx_m581', cat:'Memes & Internet', n:'Grumpy Cat Portrait', e:'🐱', brand:'Tardar Sauce',
   desc:'RIP. The face that defined the internet.',
   price:200, notReq:0, bonus:null, flex:'No.'},
{id:'lx_m582', cat:'Memes & Internet', n:'Original Nyan Cat NFT', e:'🌈', brand:'Chris Torres',
   desc:'The rainbow pop-tart cat.',
   price:600000, notReq:0, bonus:null, flex:'Peak internet culture.'},
{id:'lx_m583', cat:'Memes & Internet', n:'Twitter Blue Check (Pre-Elon)', e:'✓', brand:'Twitter',
   desc:'The OG verification. RIP.',
   price:8, notReq:0, bonus:null, flex:'Back when it meant something.'},
{id:'lx_m584', cat:'Memes & Internet', n:'Keyboard Cat Figurine', e:'🐱', brand:'YouTube',
   desc:'The OG viral video tribute.',
   price:50, notReq:0, bonus:null, flex:'Play him off.'},
{id:'lx_m585', cat:'Memes & Internet', n:'Rickroll Vinyl Record', e:'🎵', brand:'Rick Astley',
   desc:'Never gonna give you up. On vinyl.',
   price:30, notReq:0, bonus:null, flex:'Never gonna let you down.'},
{id:'lx_m586', cat:'Theme Parks', n:'Six Flags Season Pass', e:'🎢', brand:'Six Flags',
   desc:'All parks. All season.',
   price:100, notReq:0, bonus:null, flex:'Roller coaster therapy.'},
{id:'lx_m587', cat:'Theme Parks', n:'Disney World VIP Tour', e:'🏰', brand:'Disney',
   desc:'Private guide. Skip every line.',
   price:12000, notReq:0, bonus:null, flex:'The happiest flex on Earth.'},
{id:'lx_m588', cat:'Theme Parks', n:'Private Roller Coaster', e:'🎢', brand:'Custom',
   desc:'In your backyard. 60mph.',
   price:2000000, notReq:0, bonus:null, flex:'HOA meeting is going to be interesting.'},
{id:'lx_m589', cat:'Theme Parks', n:'Build Your Own Theme Park', e:'🎪', brand:'Custom',
   desc:'10 rides. Food court. Your rules.',
   price:50000000, notReq:0, bonus:null, flex:'Walt Disney started somewhere.'},
{id:'lx_m590', cat:'Self Care', n:'Dollar Store Lotion', e:'🧴', brand:'Generic',
   desc:'Moisturizes. Barely.',
   price:1, notReq:0, bonus:null, flex:'The bare minimum.'},
{id:'lx_m591', cat:'Self Care', n:'Gym Membership (Lifetime)', e:'💪', brand:'Equinox',
   desc:'Never expires. $300/mo value.',
   price:50000, notReq:0, bonus:null, flex:'The flex membership.'},
{id:'lx_m592', cat:'Self Care', n:'Personal Trainer (1 Year)', e:'💪', brand:'Private',
   desc:'5x/week. Former NFL.',
   price:100000, notReq:0, bonus:null, flex:'No excuses.'},
{id:'lx_m593', cat:'Self Care', n:'Full Body Cryotherapy Chamber', e:'🥶', brand:'Custom',
   desc:'In your home. -200°F.',
   price:150000, notReq:0, bonus:null, flex:'Freeze yourself young.'},
{id:'lx_m594', cat:'Self Care', n:'Private Spa (Built In)', e:'🧖', brand:'Custom',
   desc:'Sauna, steam, cold plunge, massage table.',
   price:250000, notReq:0, bonus:null, flex:'Resort at home.'},
{id:'lx_m595', cat:'Historical', n:'WWII Dog Tags', e:'🪖', brand:'Military',
   desc:'Original. Unknown soldier.',
   price:50, notReq:0, bonus:null, flex:'Someone elses story.'},
{id:'lx_m596', cat:'Historical', n:'JFK Assassination Newspaper', e:'📰', brand:'1963',
   desc:'Dallas Morning News. Original.',
   price:500, notReq:0, bonus:null, flex:'The day the world changed.'},
{id:'lx_m597', cat:'Historical', n:'Declaration of Independence (Replica)', e:'📜', brand:'Archives',
   desc:'Museum quality reproduction.',
   price:200, notReq:0, bonus:null, flex:'We the People.'},
{id:'lx_m598', cat:'Historical', n:'Egyptian Sarcophagus', e:'⚱️', brand:'Ancient',
   desc:'Late Period. 2,500 years old.',
   price:100000, notReq:0, bonus:null, flex:'Your forever bed.'},
{id:'lx_m599', cat:'Historical', n:'Actual Castle (Scotland)', e:'🏰', brand:'Historic',
   desc:'15th century. 40 rooms. Needs work.',
   price:5000000, notReq:0, bonus:null, flex:'Your own castle.'},
{id:'lx_m600', cat:'Historical', n:'Napoleons Sword', e:'⚔️', brand:'19th Century',
   desc:'Authenticated. Battle of Austerlitz.',
   price:5000000, notReq:0, bonus:null, flex:'Conquered Europe with this.'},
{id:'lx_m601', cat:'Cars', n:'Porsche 911 GT3 RS', e:'🏎️', brand:'Porsche',
   desc:'Naturally aspirated flat-6. Track monster.',
   price:230000, notReq:0, bonus:null, flex:'The drivers Porsche.'},
{id:'lx_m602', cat:'Cars', n:'Tesla Cybertruck', e:'🛻', brand:'Tesla',
   desc:'Stainless steel. Bulletproof. Ugly-cool.',
   price:80000, notReq:0, bonus:null, flex:'The future is angular.'},
{id:'lx_m603', cat:'Cars', n:'1967 Shelby GT500', e:'🏎️', brand:'Ford',
   desc:'Eleanor. Gone in 60 Seconds.',
   price:2000000, notReq:0, bonus:null, flex:'The most famous Mustang.'},
{id:'lx_m604', cat:'Cars', n:'Koenigsegg Jesko', e:'🏎️', brand:'Koenigsegg',
   desc:'1,600hp. 330mph theoretical.',
   price:3300000, notReq:0, bonus:null, flex:'Swedish hypercar perfection.'},
{id:'lx_m605', cat:'Cars', n:'Aston Martin DB5', e:'🏎️', brand:'Aston',
   desc:'Bond car. With gadgets.',
   price:6500000, notReq:0, bonus:null, flex:'Shaken, not stirred.'},
{id:'lx_m606', cat:'Jets & Yachts', n:'Used Cessna 172', e:'✈️', brand:'Cessna',
   desc:'1985. High hours. Flies fine.',
   price:50000, notReq:0, bonus:null, flex:'The Honda Civic of aviation.'},
{id:'lx_m607', cat:'Jets & Yachts', n:'Bell 407 Helicopter', e:'🚁', brand:'Bell',
   desc:'Skip traffic forever.',
   price:4000000, notReq:0, bonus:null, flex:'Commute in 10 minutes.'},
{id:'lx_m608', cat:'Jets & Yachts', n:'Gulfstream G700', e:'✈️', brand:'Gulfstream',
   desc:'The boardroom at 45,000 feet.',
   price:75000000, notReq:0, bonus:null, flex:'Fly anywhere, anytime.'},
{id:'lx_m609', cat:'Jets & Yachts', n:'Azzam Superyacht', e:'🛥️', brand:'Custom',
   desc:'590 feet. The worlds largest.',
   price:600000000, notReq:0, bonus:null, flex:'A floating city.'},
  {id:'lx_n301', cat:'Trading Cards', n:'2024 Topps Series 1 Pack', e:'🃏', brand:'Topps',
   desc:'Standard hobby pack. Maybe you pull something.',
   price:3, notReq:0, bonus:null, flex:'Ripping packs like a kid.'},
];

const LUXURY_CSS = `
#lux-wrap{display:flex;flex-direction:column;height:100%;}
.lux-tabs{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:12px;}
.lux-tab{background:var(--surface2);border:1px solid var(--border);color:var(--text-dim);
  font-family:'Bebas Neue',sans-serif;font-size:12px;letter-spacing:.1em;padding:5px 12px;cursor:pointer;transition:all .15s;}
.lux-tab.active{background:linear-gradient(135deg,var(--blood),#3a0000);border-color:var(--crimson);color:var(--bright-gold);}
.lux-tab:hover{border-color:var(--gold);}
.lux-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px;}
.lux-card{background:linear-gradient(135deg,#0a0005,var(--surface2));border:1px solid var(--border);
  padding:14px;display:flex;flex-direction:column;gap:6px;transition:all .15s;position:relative;}
.lux-card:hover{border-color:var(--gold);box-shadow:0 0 20px rgba(184,134,11,.15);}
.lux-card.owned{border-color:var(--bright-gold);background:linear-gradient(135deg,#0a0800,#1a1200);}
.lux-card-top{display:flex;align-items:flex-start;gap:10px;}
.lux-emoji{font-size:32px;flex-shrink:0;}
.lux-name{font-family:'Bebas Neue',sans-serif;font-size:16px;color:var(--text);line-height:1.2;}
.lux-brand{font-size:9px;letter-spacing:.2em;color:var(--gold);font-family:'Bebas Neue',sans-serif;}
.lux-desc{font-family:'Special Elite',serif;font-size:10px;color:var(--text-dim);line-height:1.6;}
.lux-price{font-family:'Bebas Neue',sans-serif;font-size:18px;color:var(--bright-gold);}
.lux-bonus{font-family:'Cutive Mono',monospace;font-size:9px;color:var(--bright-green);margin-top:2px;}
.lux-flex{font-family:'Special Elite',serif;font-size:9px;color:var(--text-dim);font-style:italic;}
.lux-owned-badge{position:absolute;top:8px;right:8px;background:linear-gradient(90deg,var(--gold),var(--bright-gold));
  color:#000;font-family:'Bebas Neue',sans-serif;font-size:10px;letter-spacing:.15em;padding:2px 8px;}
.lux-buy-btn{background:linear-gradient(135deg,var(--blood),#3a0000);border:2px solid var(--crimson);
  color:var(--bright-gold);font-family:'Bebas Neue',sans-serif;font-size:14px;letter-spacing:.1em;
  padding:8px;cursor:pointer;transition:all .2s;margin-top:4px;width:100%;}
.lux-buy-btn:hover{background:linear-gradient(135deg,var(--crimson),var(--blood));box-shadow:0 0 15px rgba(196,30,58,.4);}
.lux-buy-btn:disabled{opacity:.35;cursor:not-allowed;}
.lux-stats{display:flex;justify-content:space-between;align-items:center;background:var(--surface);
  padding:10px 14px;margin-bottom:14px;border:1px solid var(--border);}
.lux-not-req{font-size:9px;color:var(--crimson);font-family:'Cutive Mono',monospace;margin-top:3px;}
`;

function buildLuxury(c){
  if(!G.luxuryOwned)G.luxuryOwned={};
  const tab=G.luxuryTab||'Collectibles';
  const cats=[...new Set(LUXURY_ITEMS.map(i=>i.cat))];
  const items=LUXURY_ITEMS.filter(i=>i.cat===tab);
  const totalOwned=Object.keys(G.luxuryOwned).length;
  const totalValue=LUXURY_ITEMS.filter(i=>G.luxuryOwned[i.id]).reduce((s,i)=>s+i.price,0);

  // Inject CSS once
  if(!document.getElementById('lux-css')){
    const style=document.createElement('style');
    style.id='lux-css';style.textContent=LUXURY_CSS;
    document.head.appendChild(style);
  }

  let html='<div class="panel"><div class="ph"><h2>💎 LUXURY SHOP</h2><span class="psub">Real brand names. Real prices. No limits on how much you can flex.</span></div><div class="pb">';
  html+='<div class="lux-stats">';
  html+='<div><div style="font-family:\'Bebas Neue\',sans-serif;font-size:13px;color:var(--text-dim);letter-spacing:.12em;">COLLECTION</div>';
  html+='<div style="font-family:\'Bebas Neue\',sans-serif;font-size:22px;color:var(--bright-gold);">'+totalOwned+' / '+LUXURY_ITEMS.length+' Items</div></div>';
  html+='<div style="text-align:right;"><div style="font-family:\'Bebas Neue\',sans-serif;font-size:13px;color:var(--text-dim);letter-spacing:.12em;">PORTFOLIO VALUE</div>';
  html+='<div style="font-family:\'Bebas Neue\',sans-serif;font-size:22px;color:var(--bright-green);">$'+totalValue.toLocaleString()+'</div></div>';
  html+='</div>';
  html+='<div class="lux-tabs">';
  for(const cat of cats){
    const ownedInCat=LUXURY_ITEMS.filter(i=>i.cat===cat&&G.luxuryOwned[i.id]).length;
    const totalInCat=LUXURY_ITEMS.filter(i=>i.cat===cat).length;
    html+=`<div class="lux-tab ${tab===cat?'active':''}" onclick="G.luxuryTab='${cat}';buildLuxury(document.getElementById('center'))">${cat} (${ownedInCat}/${totalInCat})</div>`;
  }
  html+='</div>';
  html+='<div class="lux-grid">';
  for(const it of items){
    const owned=G.luxuryOwned[it.id];
    const canAfford=G.cash>=it.price;
    const notMet=it.notReq>0&&(G.notoriety||0)<it.notReq;
    html+=`<div class="lux-card ${owned?'owned':''}">`;
    if(owned)html+='<div class="lux-owned-badge">✓ OWNED</div>';
    html+='<div class="lux-card-top">';
    html+='<div class="lux-emoji">'+it.e+'</div>';
    html+='<div><div class="lux-name">'+it.n+'</div>';
    html+='<div class="lux-brand">'+it.brand+'</div></div></div>';
    html+='<div class="lux-desc">'+it.desc+'</div>';
    if(it.bonus)html+='<div class="lux-bonus">⬆ '+it.flex+'</div>';
    else html+='<div class="lux-flex">'+it.flex+'</div>';
    if(notMet&&!owned)html+='<div class="lux-not-req">🔒 Requires '+it.notReq.toLocaleString()+' Notoriety</div>';
    if(!owned){
      html+='<div class="lux-price">$'+it.price.toLocaleString()+'</div>';
      html+='<button class="lux-buy-btn" onclick="buyLuxury(\''+it.id+'\')" '+(canAfford&&!notMet?'':'disabled')+'>'+( notMet?'🔒 LOCKED':canAfford?'BUY NOW':'INSUFFICIENT FUNDS')+'</button>';
    }
    html+='</div>';
  }
  html+='</div></div></div>';
  c.innerHTML=html;
}

function buyLuxury(id){
  const it=LUXURY_ITEMS.find(x=>x.id===id);if(!it)return;
  if(!G.luxuryOwned)G.luxuryOwned={};
  if(G.luxuryOwned[id]){toast('Already owned!','r');return;}
  if(G.cash<it.price){toast('Not enough cash!','r');return;}
  if(it.notReq>0&&(G.notoriety||0)<it.notReq){toast('Need '+it.notReq+' Notoriety!','r');return;}
  G.cash-=it.price;
  G.luxuryOwned[id]=true;
  // Apply bonus
  if(it.bonus){
    const b=it.bonus;
    if(b.type==='cashMult')G.cashMult=(G.cashMult||1)+b.val;
    else if(b.type==='xpMult')G.xpMult=(G.xpMult||1)+b.val;
    else if(b.type==='incomeMult')G.incomeMult=(G.incomeMult||1)+b.val;
    else if(b.type==='attack'){G.attack+=b.val;G.baseAttack+=b.val;}
    else if(b.type==='defense'){G.defense+=b.val;G.baseDef+=b.val;}
    else if(b.type==='energy'){G.maxEnergy+=b.val;G.energy=Math.min(G.energy+b.val,G.maxEnergy);}
    else if(b.type==='stamina'){G.maxStamina+=b.val;G.stamina=Math.min(G.stamina+b.val,G.maxStamina);}
    else if(b.type==='health'){G.maxHealth+=b.val;G.health=Math.min(G.health+b.val,G.maxHealth);}
    else if(b.type==='critChance')G.critChance+=b.val;
    else if(b.type==='lootBonus')G.lootBonus+=b.val;
    else if(b.type==='notoriety')G.notoriety=(G.notoriety||0)+b.val;
    else if(b.type==='heat')coolHeat(Math.abs(b.val));
  }
  G.notoriety=(G.notoriety||0)+Math.floor(it.price/1000000);
  addLog('💎 PURCHASED: '+it.n+' — $'+it.price.toLocaleString(),'sp');
  toast('💎 '+it.n+' is yours!','gold');
  updateAll();save();
  buildLuxury(document.getElementById('center'));
}


function buildPrestige(c){
  const next=G.prestige+1;
  const canPrestige=G.level>=100;
  let html=`<div class="panel"><div class="ph"><h2>⭐ PRESTIGE</h2><span class="psub">Reset your level, keep your power. Become stronger with each cycle.</span></div><div class="pb">
  <div class="prestige-panel">
    <div class="prestige-title">${'★'.repeat(Math.min(10,G.prestige))||'☆'} PRESTIGE ${G.prestige}</div>
    <div class="prestige-desc">Current bonuses: ×${G.pBonuses.xpMult.toFixed(2)} XP | ×${G.pBonuses.cashMult.toFixed(2)} Cash | +${G.pBonuses.attackBonus} ATK | +${G.pBonuses.defBonus} DEF</div>
    ${canPrestige?`
      <div style="font-family:'Special Elite',serif;color:var(--text-dim);font-size:13px;margin-bottom:12px;">You are Level ${G.level}. Prestige resets you to Level 1, but grants permanent multipliers.<br>You keep: all items, properties, skills, skill tree purchases.</div>
      <button class="prestige-btn" onclick="doPrestige()">⭐ PRESTIGE NOW (Level 100 Required)</button>
    `:`<div style="font-family:'Special Elite',serif;color:var(--text-dim);margin-top:10px;">Reach Level 100 to Prestige. You are Level ${G.level}.</div>`}
  </div>
  <div style="font-family:'Bebas Neue',sans-serif;font-size:16px;color:var(--crimson);margin-bottom:10px;letter-spacing:.1em;">PRESTIGE REWARDS</div>
  <div style="display:grid;gap:8px;">`;
  for(let p=1;p<=10;p++){
    const xpM=1+(p*.15);const cashM=1+(p*.10);const atkB=p*5;const defB=p*3;
    const done=G.prestige>=p;
    html+=`<div style="background:var(--surface2);border:1px solid ${done?'var(--bright-purple)':'var(--border)'};padding:10px;display:grid;grid-template-columns:auto 1fr;gap:12px;align-items:center;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:24px;color:${done?'var(--bright-purple)':'var(--text-dim)'};">${done?'★':'☆'}${p}</div>
      <div>
        <div style="font-family:'Bebas Neue',sans-serif;font-size:15px;color:${done?'var(--bright-gold)':'var(--text-dim)'};">PRESTIGE ${p}</div>
        <div style="font-size:11px;color:var(--text-dim);font-family:'Cutive Mono',monospace;">×${xpM.toFixed(2)} XP | ×${cashM.toFixed(2)} Cash | +${atkB} ATK | +${defB} DEF</div>
      </div>
    </div>`;
  }
  html+=`</div></div></div>`;
  c.innerHTML=html;
}

function doPrestige(){
  if(G.level<100){toast('Need Level 100!','r');return;}
  G.prestige++;
  G.pBonuses.xpMult=1+(G.prestige*.15);
  G.pBonuses.cashMult=1+(G.prestige*.10);
  G.pBonuses.attackBonus+=5;
  G.pBonuses.defBonus+=3;
  G.pBonuses.lootMult=1+(G.prestige*.05);
  // Reset level but keep most things
  G.level=1;G.xp=0;G.xpToNext=Math.floor(45*1+1.5*Math.pow(1,1.65));G.skillPoints+=10;
  G._baseMaxStamina=Math.floor(20+1*.3);G._baseMaxHealth=Math.floor(100+1*5);
  G.energy=G.maxEnergy;G.stamina=G.maxStamina;G.health=G.maxHealth;
  G.attack=G.baseAttack+G.pBonuses.attackBonus+getSkillBonus('atk')+calcInventoryStats().atk;
  G.defense=G.baseDef+G.pBonuses.defBonus+getSkillBonus('def')+calcInventoryStats().def;
  addLog(`⭐ PRESTIGE ${G.prestige}! Born again as a god.`,'sp');
  toast(`Prestige ${G.prestige}! Reborn!`,'gold');
  buildCityList();updateAll();save();buildPrestige(document.getElementById('center'));
}

// ══════════════════════════════════════════
// MISSIONS
// ══════════════════════════════════════════
function buildMissions(c){
  let html=`<div class="panel"><div class="ph"><h2>📋 MISSIONS</h2><span class="psub">Story missions. Complete objectives for massive rewards.</span></div><div class="pb">`;
  for(const m of MISSIONS){
    const locked=G.level<(m.ul||1)&&G.prestige===0;
    const prog=G.missionProgress[m.id]||0;
    const done=prog>=m.steps.length;
    const pct=(prog/m.steps.length)*100;
    html+=`<div class="mcard ${done?'mcomplete':''}" style="${locked?'opacity:.35':''}">
      ${done?'<div style="font-family:\'Bebas Neue\',sans-serif;font-size:12px;letter-spacing:.2em;color:var(--bright-gold);margin-bottom:4px;">✓ COMPLETED</div>':''}
      ${locked?`<div style="font-family:'Bebas Neue',sans-serif;font-size:11px;color:var(--crimson);margin-bottom:4px;">🔒 LOCKED — Level ${m.ul}</div>`:''}
      <div class="mtitle">${m.t}</div>
      <div class="mstory">${m.s}</div>
      <div class="mprog"><div class="mpfill" style="width:${pct}%"></div></div>
      <div style="font-size:10px;color:var(--text-dim);font-family:'Cutive Mono',monospace;">${prog}/${m.steps.length} objectives</div>
      ${m.steps.map((s,i)=>`<div class="mstep ${i<prog?'done':'todo'}">${i<prog?'✓':'○'} ${s}</div>`).join('')}
    </div>`;
  }
  html+=`</div></div>`;
  c.innerHTML=html;
}

// ══════════════════════════════════════════
// OPERATIONS
// ══════════════════════════════════════════
const OP_TIERS=['I. Local','II. National','III. International','IV. Endgame'];
const OPS = [
  // ── LOCAL ──
  {id:'OP01',n:'Take Down the Bratva',e:15,s:4,c:14000,x:36,ml:1,tier:0,d:'Coordinated strike on Russian organized crime.'},
  {id:'OP02',n:'Dismantle the Triads',e:18,s:5,c:24500,x:48,ml:8,tier:0,d:'Chinese gangs moving on your territory.'},
  {id:'OP03',n:'Ghost Town Protocol',e:22,s:6,c:38500,x:66,ml:12,tier:0,d:'Make a district disappear from police records.'},
  {id:'OP04',n:'Warehouse Raid',e:20,s:5,c:28000,x:54,ml:10,tier:0,d:'Enemy stash house. Hit it hard.'},
  {id:'OP05',n:'Tunnel Network',e:25,s:7,c:49000,x:78,ml:15,tier:0,d:'Build smuggling tunnels under the border.'},
  // ── NATIONAL ──
  {id:'OP06',n:'Federal Compromise',e:35,s:8,c:84000,x:120,ml:25,tier:1,d:'Turn a Federal prosecutor into an asset.'},
  {id:'OP07',n:'Cartel War',e:40,s:12,c:140000,x:168,ml:30,tier:1,d:'Scorched earth against the incoming cartel.'},
  {id:'OP08',n:'Prison Break',e:30,s:10,c:105000,x:132,ml:28,tier:1,d:'Your underboss is locked up. Extract him.'},
  {id:'OP09',n:'Bank Heist Sequence',e:45,s:14,c:244999,x:228,ml:40,tier:1,d:'Three banks, one night. Perfect coordination.'},
  {id:'OP10',n:'Shadow Network',e:50,s:15,c:350000,x:270,ml:50,tier:1,d:'Infiltrate a rival intelligence network.'},
  // ── INTERNATIONAL ──
  {id:'OP11',n:'Operation Black Crown',e:60,s:18,c:560000,x:360,ml:65,tier:2,d:'Topple a foreign government. Install your puppet.'},
  {id:'OP12',n:'Silk Road Redux',e:55,s:16,c:455000,x:312,ml:55,tier:2,d:'Rebuild the darknet marketplace. Your way.'},
  {id:'OP13',n:'Arctic Extraction',e:70,s:20,c:840000,x:480,ml:80,tier:2,d:'Black site in Siberia. One shot to extract the asset.'},
  {id:'OP14',n:'Mediterranean Fleet',e:65,s:22,c:700000,x:420,ml:75,tier:2,d:'Hijack a shipping fleet. Control the Mediterranean.'},
  {id:'OP15',n:'Tokyo Takeover',e:75,s:25,c:1400000,x:600,ml:100,tier:2,d:'Seize control of the Yakuza council.'},
  // ── ENDGAME ──
  {id:'OP16',n:'The Final War',e:100,s:30,c:3500000,x:900,ml:150,tier:3,d:'Winner takes everything. No survivors.'},
  {id:'OP17',n:'Coup d\'État',e:120,s:35,c:7000000,x:1800,ml:250,tier:3,d:'Overthrow a superpower. From the inside.'},
  {id:'OP18',n:'Satellite Dominance',e:150,s:40,c:17500000,x:3600,ml:400,tier:3,d:'Control the orbital network. See everything.'},
  {id:'OP19',n:'World Reset Protocol',e:180,s:45,c:35000000,x:7200,ml:600,tier:3,d:'Erase every record. Rewrite history.'},
  {id:'OP20',n:'Operation Godfall',e:200,s:50,c:70000000,x:18000,ml:800,tier:3,d:'Bring down every government. All of them. At once.'},
];
function buildOperations(c){
  const totalDone=OPS.filter(op=>(G.opProgress[op.id]||0)>=3).length;
  const totalPhases=OPS.reduce((s,op)=>s+Math.min(3,G.opProgress[op.id]||0),0);
  const otColors=['var(--text-dim)','var(--bright-blue)','var(--bright-orange)','#ff1744'];

  let html=`<div class="panel"><div class="ph"><h2>🎯 OPERATIONS</h2><span class="psub">${totalDone}/${OPS.length} complete · ${totalPhases} phases done · 3 phases each</span></div><div class="pb">`;

  // Dashboard
  html+=`<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:12px;">
    <div style="background:var(--surface2);border:1px solid var(--border);padding:6px;text-align:center"><div style="font-family:'Bebas Neue',sans-serif;font-size:16px;color:var(--bright-gold)">${totalDone}/${OPS.length}</div><div style="font-size:8px;color:var(--text-dim);font-family:'Cutive Mono',monospace">COMPLETED</div></div>
    <div style="background:var(--surface2);border:1px solid var(--border);padding:6px;text-align:center"><div style="font-family:'Bebas Neue',sans-serif;font-size:16px;color:var(--bright-green)">${G.energy}/${G.maxEnergy}</div><div style="font-size:8px;color:var(--text-dim);font-family:'Cutive Mono',monospace">ENERGY</div></div>
    <div style="background:var(--surface2);border:1px solid var(--border);padding:6px;text-align:center"><div style="font-family:'Bebas Neue',sans-serif;font-size:16px;color:var(--bright-blue)">${G.stamina}/${G.maxStamina}</div><div style="font-size:8px;color:var(--text-dim);font-family:'Cutive Mono',monospace">STAMINA</div></div>
    <div style="background:var(--surface2);border:1px solid var(--border);padding:6px;text-align:center"><div style="font-family:'Bebas Neue',sans-serif;font-size:16px;color:var(--bright-green)">$${fmtCash(G.cash)}</div><div style="font-size:8px;color:var(--text-dim);font-family:'Cutive Mono',monospace">CASH</div></div>
  </div>`;

  for(let ti=0;ti<OP_TIERS.length;ti++){
    const tierOps=OPS.filter(op=>op.tier===ti);
    const tierDone=tierOps.filter(op=>(G.opProgress[op.id]||0)>=3).length;
    html+=`<div style="font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:.12em;padding:5px 0;margin-top:8px;border-bottom:1px solid var(--border);color:${otColors[ti]}">▸ ${OP_TIERS[ti]} <span style="font-size:10px;opacity:.6">${tierDone}/${tierOps.length}</span></div>`;
    for(const op of tierOps){
      const prog=G.opProgress[op.id]||0;const done=prog>=3;
      const locked=G.level<(op.ml||1);
      const canDo=!done&&!locked&&G.energy>=op.e&&G.stamina>=op.s;
      html+=`<div class="opcard" style="opacity:${locked?.35:1};${done?'border-color:var(--bright-gold);background:linear-gradient(135deg,rgba(30,20,0,.2),var(--surface2))':''}">
        <div>
          <div class="opname" style="color:${done?'var(--bright-gold)':'var(--text)'}">${done?'✓ ':''}${op.n}</div>
          <div class="opdesc">${op.d}</div>
          <div class="ccreq">⚡${op.e} + 💪${op.s} per phase${locked?' · 🔒 Lv'+(op.ml||1):''}</div>
          <div class="opprog">
            <div style="font-size:10px;color:var(--text-dim);font-family:'Cutive Mono',monospace;">Phase ${Math.min(3,prog)}/3</div>
            <div class="oppb"><div class="oppf" style="width:${Math.min(100,prog/3*100)}%;background:${done?'var(--bright-gold)':'var(--crimson)'}"></div></div>
          </div>
        </div>
        <div>
          <div class="oprew">$${fmtCash(op.c)}<br>${op.x} XP</div>
          ${done?'<div style="color:var(--bright-gold);font-family:\'Bebas Neue\',sans-serif;font-size:12px;margin-top:8px;letter-spacing:.1em;">COMPLETE</div>':
            locked?`<div style="font-size:10px;color:var(--text-dim);margin-top:8px;">LV ${op.ml}</div>`:
            `<button class="opdo" onclick="doOp('${op.id}')" ${canDo?'':'disabled'} style="opacity:${canDo?1:.5}">EXECUTE</button>`}
        </div>
      </div>`;
    }
  }
  html+=`</div></div>`;
  c.innerHTML=html;
}
function doOp(id){
  const op=OPS.find(x=>x.id===id);if(!op)return;
  if(G.energy<op.e){toast(`Need ${op.e} energy!`,'r');return;}
  if(G.stamina<op.s){toast(`Need ${op.s} stamina!`,'r');return;}
  if(G.level<(op.ml||1)){toast('Level too low!','r');return;}
  const prog=G.opProgress[op.id]||0;
  if(prog>=3){toast('Already complete!','r');return;}
  G.energy-=op.e;G.stamina-=op.s;
  G.opProgress[op.id]=prog+1;
  const p=G.opProgress[op.id];
  addHeat(5+op.tier*3);
  if(p>=3){
    let cash=Math.floor(op.c*(G.cashMult||1));if(G.crew&&G.crew['cr_architect'])cash=cash*2;
    G.cash+=cash;G.totalEarned+=cash;gainXP(op.x);G.respect+=Math.floor(op.x/2);
    addNotoriety(Math.floor(op.c/50000)+2);
    addLog(`✓ OPERATION: ${op.n} — $${fmtCash(cash)}!`,'sp');
    toast(`Operation complete! $${fmtCash(cash)}!`,'gold');
  }else{
    addLog(`⚙️ ${op.n}: Phase ${p}/3`,'info');
    toast(`Phase ${p}/3 complete`,'g');
  }
  updateAll();checkMissions();save();buildOperations(document.getElementById('center'));
}

// ══════════════════════════════════════════
// XP & LEVEL
// ══════════════════════════════════════════

// ══════════════════════════════════════════
// SKILL POINTS
// ══════════════════════════════════════════
function spendSP(s){
  if(G.skillPoints<=0){toast('No skill points!','r');return;}
  G.skillPoints--;
  if(s==='energy'){G.maxEnergy+=6;G.energy=Math.min(G.energy+6,G.maxEnergy);}
  else if(s==='stamina'){G.maxStamina+=4;G.stamina=Math.min(G.stamina+4,G.maxStamina);}
  else if(s==='health'){G.maxHealth+=25;G.health=Math.min(G.health+25,G.maxHealth);}
  else if(s==='attack'){G.attack+=4;G.baseAttack+=4;}
  else if(s==='defense'){G.defense+=4;G.baseDef+=4;}
  updateAll();save();
}
function healPlayer(){
  if(G.health>=G.maxHealth){toast('Already at full HP!','r');return;}
  // Cost scales with level squared + maxHealth — gets expensive fast
  const baseCost=Math.floor(G.maxHealth*3 + Math.pow(G.level,1.5)*10);
  // Cooldown: 30 seconds between heals
  const now=Date.now();
  if(G._lastHeal&&now-G._lastHeal<30000){
    const wait=Math.ceil((30000-(now-G._lastHeal))/1000);
    toast('Heal cooldown: '+wait+'s','r');return;
  }
  if(G.cash<baseCost){toast(`Heal costs $${baseCost.toLocaleString()}!`,'r');return;}
  G.cash-=baseCost;
  // Heal 50% of max HP, not full (unless below 50%)
  const healAmt=G.health<G.maxHealth*0.5?G.maxHealth:Math.floor(G.maxHealth*0.5);
  G.health=Math.min(G.maxHealth, G.health+healAmt);
  G._lastHeal=now;
  const fullText=G.health>=G.maxHealth?'Full HP!':'HP +'+healAmt;
  addLog(`💊 Healed for $${baseCost.toLocaleString()} — ${fullText}`,'good');toast(fullText,'g');
  updateAll();save();
}
function recruitMember(){
  if(G.cash<5000){toast('Need $5,000!','r');return;}
  G.cash-=5000;G.mafiaSize++;
  addLog(`👥 Recruited! Size: ${G.mafiaSize}`,'gold');toast(`Mafia: ${G.mafiaSize} members!`,'gold');
  updateAll();save();
}

// ══════════════════════════════════════════
// MISSION CHECK
// ══════════════════════════════════════════

// ══════════════════════════════════════════
// UPDATE UI
// ══════════════════════════════════════════
function applyNotorietyPerks(){
  const tier = getNotorietyTier();
  // perks are passive stat checks, not re-applied each tick (stored in G)
}
function updateMafia(){
  const el=document.getElementById('mdots');if(!el)return;
  el.innerHTML='';
  const show=Math.min(60,G.mafiaSize);
  for(let i=0;i<show;i++){const d=document.createElement('div');d.className='md';el.appendChild(d);}
  if(G.mafiaSize>60){const s=document.createElement('span');s.style.cssText='font-size:9px;color:var(--text-dim);font-family:\'Cutive Mono\',monospace;margin-left:3px;';s.textContent=`+${G.mafiaSize-60}`;el.appendChild(s);}
}

// ══════════════════════════════════════════
// LOG
// ══════════════════════════════════════════

// ══════════════════════════════════════════
// TOAST
// ══════════════════════════════════════════

// ══════════════════════════════════════════
// REGEN LOOPS
// ══════════════════════════════════════════

// ══════════════════════════════════════════════════════════════════
// FULL EXPANSION PACK


// ══════════════════════════════════════════════════════════
// STREET RACING
// ══════════════════════════════════════════════════════════
const CAR_TIERS=['Street','Sport','Supercar','Hypercar'];
const RACE_CARS = [
  // ── STREET ──
  {id:'rc01',n:'Stolen Honda',    e:'🚗',speed:10, cost:0,        ml:1,  tier:0,d:'Hot-wired from a parking lot.'},
  {id:'rc02',n:'Tuned Civic',     e:'🏎️',speed:20, cost:12000,    ml:3,  tier:0,d:'200hp of pure street cred.'},
  {id:'rc03',n:'Nissan 350Z',     e:'🚗',speed:30, cost:35000,    ml:8,  tier:0,d:'Drift king potential.'},
  {id:'rc04',n:'WRX STI',         e:'🚙',speed:40, cost:80000,    ml:15, tier:0,d:'All-wheel grip. Corners like rails.'},
  // ── SPORT ──
  {id:'rc05',n:'Mustang GT',      e:'🐎',speed:55, cost:200000,   ml:25, tier:1,d:'American muscle. Straight line king.'},
  {id:'rc06',n:'BMW M5',          e:'🚗',speed:65, cost:400000,   ml:35, tier:1,d:'Gentleman\'s rocket. Deceptively fast.'},
  {id:'rc07',n:'Nissan GT-R',     e:'⚡',speed:78, cost:800000,   ml:50, tier:1,d:'The Godzilla. Street-legal racecar.'},
  // ── SUPERCAR ──
  {id:'rc08',n:'Porsche 911 GT3', e:'🏁',speed:90, cost:1500000,  ml:70, tier:2,d:'Engineered perfection. Track monster.'},
  {id:'rc09',n:'Lamborghini Huracán',e:'🐂',speed:105,cost:3000000,ml:100,tier:2,d:'V10 screaming at 8000 RPM.'},
  {id:'rc10',n:'Ferrari SF90',    e:'🏎️',speed:118,cost:6000000,  ml:150,tier:2,d:'Hybrid hypercar. 986hp of Italian fire.'},
  // ── HYPERCAR ──
  {id:'rc11',n:'Bugatti Chiron',   e:'👑',speed:135,cost:12000000, ml:250,tier:3,d:'1500hp. 0-60 in 2.4s. Obscene.'},
  {id:'rc12',n:'Koenigsegg Jesko', e:'🔱',speed:155,cost:25000000, ml:350,tier:3,d:'1600hp. Holds speed records. Alien tech.'},
  {id:'rc13',n:'SSC Tuatara',      e:'🦎',speed:175,cost:50000000, ml:500,tier:3,d:'316mph top speed. Fastest road car ever.'},
  {id:'rc14',n:'Custom One-Off',   e:'💀',speed:200,cost:100000000,ml:700,tier:3,d:'Built by your engineers. No VIN. No limits.'},
];
const RACE_TIER_NAMES=['I. Street Circuits','II. City Events','III. Professional','IV. Legendary'];
const RACE_TIERS = [
  // ── STREET CIRCUITS ──
  {id:'rt01',n:'Backstreet Sprint',    e:'🛣️',diff:12, cash:800,     xp:15,   ml:1,  heat:3,  stamina:2, tier:0, cd:45,  d:'Quarter-mile on the industrial strip.'},
  {id:'rt02',n:'Parking Garage Drift', e:'🅿️',diff:18, cash:2000,    xp:25,   ml:5,  heat:3,  stamina:2, tier:0, cd:50,  d:'Tight corners. Concrete walls. One mistake.'},
  {id:'rt03',n:'Canal Run',            e:'🌊',diff:25, cash:5000,    xp:40,   ml:12, heat:4,  stamina:2, tier:0, cd:55,  d:'Along the waterfront at midnight.'},
  // ── CITY EVENTS ──
  {id:'rt04',n:'Harbor Run',           e:'🌉',diff:35, cash:15000,   xp:80,   ml:20, heat:6,  stamina:2, tier:1, cd:60,  d:'Bridge to bridge under the moonlight.'},
  {id:'rt05',n:'Downtown Circuit',     e:'🏙️',diff:50, cash:40000,   xp:150,  ml:35, heat:8,  stamina:3, tier:1, cd:70,  d:'Three laps through downtown traffic.'},
  {id:'rt06',n:'Tunnel Blitz',         e:'🚇',diff:60, cash:80000,   xp:250,  ml:50, heat:10, stamina:3, tier:1, cd:80,  d:'Under the city. No light. Pure speed.'},
  // ── PROFESSIONAL ──
  {id:'rt07',n:'Highway Gauntlet',     e:'🛤️',diff:80, cash:200000,  xp:500,  ml:80, heat:12, stamina:3, tier:2, cd:90,  d:'30 miles of closed freeway. 200mph+.'},
  {id:'rt08',n:'Mountain Pass',        e:'⛰️',diff:100,cash:500000,  xp:800,  ml:120,heat:15, stamina:4, tier:2, cd:100, d:'Blind corners at 150mph. Legends only.'},
  {id:'rt09',n:'Airport Strip',        e:'✈️',diff:120,cash:1000000, xp:1500, ml:200,heat:18, stamina:4, tier:2, cd:120, d:'Mile-long runway. Top speed challenge.'},
  // ── LEGENDARY ──
  {id:'rt10',n:'International Grand Prix',e:'🌍',diff:150,cash:3000000,xp:3000,ml:300,heat:22,stamina:5,tier:3,cd:150,d:'The world\'s best. One winner.'},
  {id:'rt11',n:'The Cannonball',       e:'🏴',diff:180,cash:8000000, xp:8000, ml:450,heat:25, stamina:5, tier:3, cd:180, d:'Coast to coast. No rules. Pure chaos.'},
  {id:'rt12',n:'The Death Race',       e:'💀',diff:220,cash:25000000,xp:20000,ml:600,heat:30, stamina:6, tier:3, cd:240, d:'Last car standing wins. No mercy.'},
];

function buildRacing(c){
  if(!G.raceCar)G.raceCar='rc01';
  if(!G.raceWins)G.raceWins=0;
  if(!G.raceLosses)G.raceLosses=0;
  if(!G.raceStreak)G.raceStreak=0;
  if(!G.raceBestStreak)G.raceBestStreak=0;
  if(!G.raceEarned)G.raceEarned=0;
  if(!G.raceCooldowns)G.raceCooldowns={};
  if(!G.racePurchased)G.racePurchased={};
  if(!G.carUpgrades)G.carUpgrades={};
  const now=Date.now();
  const ownedCar=RACE_CARS.find(r=>r.id===G.raceCar)||RACE_CARS[0];
  const carUpg=G.carUpgrades[G.raceCar]||0;
  const effectiveSpeed=ownedCar.speed+carUpg*Math.floor(ownedCar.speed*0.1);
  const carsOwned=RACE_CARS.filter(c=>G.racePurchased[c.id]||c.cost===0).length;

  let html=`<div class="panel"><div class="ph"><h2>🏎️ STREET RACING</h2><span class="psub">${RACE_CARS.length} cars · ${RACE_TIERS.length} events · ${carsOwned} cars owned</span></div><div class="pb">`;

  // Dashboard
  html+=`<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin-bottom:12px">
    <div style="background:var(--surface2);border:1px solid var(--border);padding:6px;text-align:center"><div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:var(--bright-gold)">${G.raceWins}</div><div style="font-size:8px;color:var(--text-dim);font-family:'Cutive Mono',monospace">WINS</div></div>
    <div style="background:var(--surface2);border:1px solid var(--border);padding:6px;text-align:center"><div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:var(--crimson)">${G.raceLosses}</div><div style="font-size:8px;color:var(--text-dim);font-family:'Cutive Mono',monospace">LOSSES</div></div>
    <div style="background:var(--surface2);border:1px solid var(--border);padding:6px;text-align:center"><div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:var(--bright-orange)">${G.raceStreak}🔥</div><div style="font-size:8px;color:var(--text-dim);font-family:'Cutive Mono',monospace">STREAK (BEST: ${G.raceBestStreak})</div></div>
    <div style="background:var(--surface2);border:1px solid var(--border);padding:6px;text-align:center"><div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:var(--bright-green)">$${fmtCash(G.raceEarned)}</div><div style="font-size:8px;color:var(--text-dim);font-family:'Cutive Mono',monospace">TOTAL WON</div></div>
    <div style="background:var(--surface2);border:1px solid var(--border);padding:6px;text-align:center"><div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:var(--bright-blue)">${G.stamina}/${G.maxStamina}</div><div style="font-size:8px;color:var(--text-dim);font-family:'Cutive Mono',monospace">STAMINA</div></div>
  </div>`;

  // Current car highlight
  html+=`<div style="background:linear-gradient(135deg,rgba(139,0,0,.15),var(--surface2));border:1px solid var(--crimson);padding:10px;margin-bottom:12px;display:flex;align-items:center;gap:12px;">
    <div style="font-size:36px">${ownedCar.e}</div>
    <div style="flex:1">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:var(--bright-gold)">${ownedCar.n}${carUpg>0?' ⬆'+carUpg:''}</div>
      <div style="font-size:10px;color:var(--text-dim);font-family:'Special Elite',serif">${ownedCar.d}</div>
      <div style="font-family:'Cutive Mono',monospace;font-size:10px;color:var(--bright-green);margin-top:3px">SPD ${effectiveSpeed}${carUpg>0?' (base '+ownedCar.speed+' +'+carUpg*Math.floor(ownedCar.speed*0.1)+' upgrades)':''}</div>
    </div>
    ${carUpg<5?`<button onclick="upgradeCar()" ${G.cash>=getCarUpgCost()?'':'disabled'} style="background:var(--surface3);border:1px solid var(--gold);color:var(--gold);font-family:'Bebas Neue',sans-serif;font-size:10px;padding:5px 10px;cursor:pointer;white-space:nowrap">⬆ LV${carUpg+1}<br><span style="font-size:8px">$${fmtCash(getCarUpgCost())}</span></button>`:'<div style="font-size:9px;color:var(--bright-gold);font-family:\'Bebas Neue\',sans-serif">MAX UPG</div>'}
  </div>`;

  // Garage by tier
  html+=`<div style="font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:.1em;color:var(--text-dim);border-bottom:1px solid var(--border);margin-bottom:8px;padding-bottom:4px">🚗 GARAGE — ${carsOwned}/${RACE_CARS.length} OWNED</div>`;
  for(let ti=0;ti<CAR_TIERS.length;ti++){
    const cars=RACE_CARS.filter(c=>c.tier===ti);
    const tierColors=['var(--text-dim)','var(--bright-blue)','var(--bright-orange)','var(--bright-gold)'];
    html+=`<div style="font-size:9px;font-family:'Bebas Neue',sans-serif;letter-spacing:.1em;color:${tierColors[ti]};margin:6px 0 3px;opacity:.7">— ${CAR_TIERS[ti].toUpperCase()} —</div>`;
    html+=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-bottom:8px">`;
    for(const car of cars){
      const active=G.raceCar===car.id;
      const canAfford=G.cash>=car.cost;
      const locked=G.level<car.ml;
      const purchased=G.racePurchased[car.id]||car.cost===0;
      const cupg=G.carUpgrades[car.id]||0;
      html+=`<div style="background:${active?'linear-gradient(135deg,rgba(139,0,0,.2),var(--surface2))':'var(--surface2)'};border:1px solid ${active?'var(--crimson)':'var(--border)'};padding:7px;display:flex;align-items:center;gap:6px;opacity:${locked&&!purchased?'.35':'1'}">
        <div style="font-size:20px">${car.e}</div>
        <div style="flex:1;min-width:0">
          <div style="font-family:'Bebas Neue',sans-serif;font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${car.n}${cupg>0?' ⬆'+cupg:''}</div>
          <div style="font-size:7px;color:var(--text-dim);font-family:'Cutive Mono',monospace">SPD ${car.speed+(cupg*Math.floor(car.speed*0.1))}${car.cost>0?' · $'+fmtCash(car.cost):' · FREE'}${locked?' · Lv'+car.ml:''}</div>
        </div>
        ${active?'<div style="font-size:8px;color:var(--bright-gold);font-family:\'Bebas Neue\',sans-serif">ACTIVE</div>':
          locked&&!purchased?'':
          purchased?`<button onclick="selectCar('${car.id}')" style="background:var(--green);border:1px solid var(--bright-green);color:#fff;font-family:'Bebas Neue',sans-serif;font-size:9px;padding:2px 6px;cursor:pointer">USE</button>`:
          `<button onclick="buyCar('${car.id}')" ${canAfford?'':'disabled'} style="background:${canAfford?'var(--gold)':'var(--surface3)'};border:none;color:#000;font-family:'Bebas Neue',sans-serif;font-size:9px;padding:2px 6px;cursor:${canAfford?'pointer':'not-allowed'};opacity:${canAfford?1:.5}">BUY</button>`
        }
      </div>`;
    }
    html+=`</div>`;
  }

  // Race events by tier
  html+=`<div style="font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:.1em;color:var(--text-dim);border-bottom:1px solid var(--border);margin-bottom:8px;padding-bottom:4px">🏁 RACE EVENTS${G.raceStreak>=3?' · <span style="color:var(--bright-orange)">🔥 STREAK BONUS +'+G.raceStreak*5+'% CASH</span>':''}</div>`;
  for(let ti=0;ti<RACE_TIER_NAMES.length;ti++){
    const races=RACE_TIERS.filter(r=>r.tier===ti);
    const rtColors=['var(--text-dim)','var(--bright-blue)','var(--bright-orange)','#ff1744'];
    html+=`<div style="font-size:9px;font-family:'Bebas Neue',sans-serif;letter-spacing:.1em;color:${rtColors[ti]};margin:6px 0 3px;opacity:.7">— ${RACE_TIER_NAMES[ti]} —</div>`;
    for(const race of races){
      const locked=G.level<race.ml;
      const cd=G.raceCooldowns[race.id]||0;
      const cdLeft=Math.max(0,Math.ceil((cd-now)/1000));
      const onCd=cdLeft>0;
      let winChance=Math.min(0.95,Math.max(0.05,(effectiveSpeed/race.diff)*0.7+0.15));if(G.crew&&G.crew['cr_mechanic'])winChance=Math.min(0.95,winChance+0.08);if(G.crew&&G.crew['cr_pilot'])winChance=Math.min(0.95,winChance+0.05);
      const streakBonus=G.raceStreak>=3?G.raceStreak*5:0;
      const adjustedCash=Math.floor(race.cash*(1+streakBonus/100));
      const canRace=!locked&&!onCd&&G.stamina>=race.stamina;
      html+=`<div style="background:var(--surface2);border:1px solid var(--border);padding:8px;margin-bottom:4px;display:grid;grid-template-columns:auto 1fr auto;gap:8px;align-items:center;opacity:${locked?.35:1}">
        <div style="font-size:22px">${race.e}</div>
        <div>
          <div style="font-family:'Bebas Neue',sans-serif;font-size:13px">${race.n}</div>
          <div style="font-size:8px;color:var(--text-dim);font-family:'Special Elite',serif">${race.d}</div>
          <div style="font-size:8px;color:var(--text-dim);font-family:'Cutive Mono',monospace;margin-top:2px">$${fmtCash(adjustedCash)}${streakBonus>0?' <span style="color:var(--bright-orange)">(+'+streakBonus+'%)</span>':''} · +${race.xp}XP · ${race.stamina}💪 · ${Math.round(winChance*100)}% win${locked?' · 🔒 Lv'+race.ml:''}</div>
        </div>
        <div style="text-align:center;min-width:60px">
          ${locked?`<div style="font-size:9px;color:var(--text-dim)">LV ${race.ml}</div>`:
            onCd?`<div style="font-family:'Cutive Mono',monospace;font-size:9px;color:var(--text-dim)">${cdLeft}s</div>`:
            `<button onclick="doRace('${race.id}')" ${canRace?'':'disabled'} style="background:${canRace?'var(--crimson)':'var(--surface3)'};border:1px solid ${canRace?'rgba(255,80,80,.5)':'var(--border)'};color:#fff;font-family:'Bebas Neue',sans-serif;font-size:11px;letter-spacing:.06em;padding:5px 10px;cursor:${canRace?'pointer':'not-allowed'};opacity:${canRace?1:.5}">RACE</button>`
          }
        </div>
      </div>`;
    }
  }
  html+=`</div></div>`;
  c.innerHTML=html;
}
function getCarUpgCost(){const car=RACE_CARS.find(c=>c.id===G.raceCar);if(!car)return 999999999;const lvl=G.carUpgrades&&G.carUpgrades[G.raceCar]||0;return Math.floor(Math.max(car.cost||10000,50000)*(lvl+1)*1.5);}
function upgradeCar(){
  const cost=getCarUpgCost();
  if(G.cash<cost){toast('Not enough cash!','r');return;}
  if(!G.carUpgrades)G.carUpgrades={};
  const lvl=G.carUpgrades[G.raceCar]||0;
  if(lvl>=5){toast('Max upgrade!','r');return;}
  G.cash-=cost;G.carUpgrades[G.raceCar]=lvl+1;
  const car=RACE_CARS.find(c=>c.id===G.raceCar);
  const bonus=Math.floor((car?car.speed:10)*0.1);
  toast(`${car?car.e:''} Speed +${bonus}!`,'gold');
  addLog(`🔧 Upgraded ${car?car.n:'car'} to Lv${lvl+1}! SPD +${bonus}`,'gold');
  updateAll();save();buildRacing(document.getElementById('center'));
}
function buyCar(id){
  const car=RACE_CARS.find(c=>c.id===id);if(!car)return;
  if(G.cash<car.cost){toast('Not enough cash!','r');return;}
  if(G.level<car.ml){toast('Level too low!','r');return;}
  G.cash-=car.cost;
  if(!G.racePurchased)G.racePurchased={};
  G.racePurchased[id]=true;G.raceCar=id;
  addLog(`🚗 Bought ${car.n}!`,'gold');toast(`${car.n} acquired!`,'gold');
  addNotoriety(Math.floor(car.cost/200000)+1);
  updateAll();save();buildRacing(document.getElementById('center'));
}
function selectCar(id){
  G.raceCar=id;const car=RACE_CARS.find(c=>c.id===id);
  toast(`${car?car.n:id} equipped!`,'gold');save();
  buildRacing(document.getElementById('center'));
}
function doRace(rid){
  const race=RACE_TIERS.find(r=>r.id===rid);if(!race)return;
  if(G.stamina<race.stamina){toast(`Need ${race.stamina} stamina!`,'r');return;}
  if(G.level<race.ml){toast('Level too low!','r');return;}
  const now=Date.now();
  if(G.raceCooldowns&&G.raceCooldowns[rid]>now){toast('Race on cooldown!','r');return;}
  const car=RACE_CARS.find(c=>c.id===G.raceCar)||RACE_CARS[0];
  const carUpg=G.carUpgrades&&G.carUpgrades[G.raceCar]||0;
  const effectiveSpeed=car.speed+carUpg*Math.floor(car.speed*0.1);
  G.stamina-=race.stamina;addHeat(race.heat);
  let winChance=Math.min(0.95,Math.max(0.05,(effectiveSpeed/race.diff)*0.7+0.15));if(G.crew&&G.crew['cr_mechanic'])winChance=Math.min(0.95,winChance+0.08);if(G.crew&&G.crew['cr_pilot'])winChance=Math.min(0.95,winChance+0.05);
  const won=Math.random()<winChance;
  if(!G.raceCooldowns)G.raceCooldowns={};
  G.raceCooldowns[rid]=now+(race.cd||60)*1000;
  if(won){
    if(!G.raceWins)G.raceWins=0;G.raceWins++;
    if(!G.raceStreak)G.raceStreak=0;G.raceStreak++;
    if(!G.raceBestStreak)G.raceBestStreak=0;
    if(G.raceStreak>G.raceBestStreak)G.raceBestStreak=G.raceStreak;
    const streakBonus=G.raceStreak>=3?G.raceStreak*5:0;
    const earn=Math.floor(race.cash*(G.cashMult||1)*(1+streakBonus/100));
    G.cash+=earn;G.totalEarned+=earn;
    if(!G.raceEarned)G.raceEarned=0;G.raceEarned+=earn;
    gainXP(race.xp);
    addNotoriety(Math.floor(race.cash/50000)+1);
    G.respect=(G.respect||0)+Math.floor(race.xp/10);
    addLog(`🏁 WON: ${race.n}! +$${fmtCash(earn)} +${race.xp}XP${G.raceStreak>=3?' 🔥×'+G.raceStreak:''}`,'gold');
    toast(`Race Won! +$${fmtCash(earn)}!${G.raceStreak>=3?' 🔥 Streak ×'+G.raceStreak:''}`,'gold');
  }else{
    if(!G.raceLosses)G.raceLosses=0;G.raceLosses++;
    G.raceStreak=0;
    const fine=Math.floor(race.cash*0.15);
    const dmg=Math.floor(race.stamina*8+Math.random()*15);
    G.cash=Math.max(0,G.cash-fine);
    G.health=Math.max(1,G.health-dmg);
    addLog(`💥 LOST: ${race.n}. Crashed. -$${fmtCash(fine)} -${dmg}HP`,'bad');
    toast(`Race Lost! -$${fmtCash(fine)} -${dmg}HP`,'r');
  }
  checkAchievements();updateAll();save();buildRacing(document.getElementById('center'));
}

// ══════════════════════════════════════════════════════════
// DARK WEB
// ══════════════════════════════════════════════════════════
const DW_LISTING_TIERS=['Surface Access','Deep Web','Black Net','Zero-Day Vault','Ghost Protocol'];
const DARK_WEB_LISTINGS = [
  // ── SURFACE ACCESS ──
  {id:'dw01',n:'Leaked FBI Database',       e:'🗄️',cost:50000,   ml:5,  bonus:'lootBonus',val:5,   tier:0,d:'Every target\'s file. Addresses. Habits. Weaknesses.'},
  {id:'dw_vpn',n:'Military VPN Access',     e:'🔒',cost:30000,   ml:3,  bonus:'heatDec',  val:0.5, tier:0,d:'Route through 12 countries. Untraceable.'},
  {id:'dw_scanner',n:'Police Scanner Network',e:'📡',cost:80000,  ml:8,  bonus:'heatDec',  val:1,   tier:0,d:'Real-time feed from every precinct.'},
  {id:'dw_forger',n:'Document Forger Contact',e:'📄',cost:60000,  ml:6,  bonus:'lootBonus',val:3,   tier:0,d:'Passports, licenses, diplomas. All perfect.'},
  // ── DEEP WEB ──
  {id:'dw02',n:'Untraceable Crypto Wallet', e:'₿',  cost:200000,  ml:18, bonus:'cashMult', val:0.05,tier:1,d:'Move millions without a trace.'},
  {id:'dw_botnet',n:'Botnet Army',          e:'🤖', cost:250000,  ml:20, bonus:'xpMult',   val:0.05,tier:1,d:'10K compromised machines. Passive income stream.'},
  {id:'dw04',n:'Darknet Arms Broker',       e:'🔫', cost:400000,  ml:25, bonus:'atk',      val:20,  tier:1,d:'Military surplus. No serial numbers.'},
  {id:'dw_drugs',n:'Pharmaceutical Pipeline',e:'💊', cost:350000,  ml:22, bonus:'cashMult', val:0.04,tier:1,d:'Factory-direct at 5% market price.'},
  // ── BLACK NET ──
  {id:'dw05',n:'Corporate Espionage Kit',   e:'💻', cost:800000,  ml:40, bonus:'cashMult', val:0.08,tier:2,d:'Zero-days. Insider access. Corporate secrets.'},
  {id:'dw06',n:'Shadow Identity Package',   e:'🪪', cost:1200000, ml:55, bonus:'heatDec',  val:2,   tier:2,d:'Three clean IDs, passports, new face.'},
  {id:'dw_launder',n:'Money Laundering AI',  e:'💸', cost:1500000, ml:60, bonus:'cashMult', val:0.06,tier:2,d:'Self-routing through 200 shell companies.'},
  {id:'dw07',n:'Mercenary Network',         e:'⚔️', cost:2500000, ml:75, bonus:'atk',      val:50,  tier:2,d:'500 contractors on standby.'},
  // ── ZERO-DAY VAULT ──
  {id:'dw08',n:'SWIFT Banking Exploit',     e:'💸', cost:6000000, ml:120,bonus:'cashMult', val:0.10,tier:3,d:'Route money through 40 banks in 3 seconds.'},
  {id:'dw_quantum',n:'Quantum Decrypt Key',  e:'🔑', cost:8000000, ml:150,bonus:'lootBonus',val:15,  tier:3,d:'Break any encryption. Access anything.'},
  {id:'dw09',n:'Global Surveillance Feed',  e:'🛰️', cost:15000000,ml:200,bonus:'xpMult',   val:0.15,tier:3,d:'Every camera. Every phone. Everything.'},
  {id:'dw_nuke',n:'Nuclear Launch Codes',    e:'☢️', cost:20000000,ml:250,bonus:'atk',      val:100, tier:3,d:'The ultimate leverage. Nobody argues.'},
  // ── GHOST PROTOCOL ──
  {id:'dw10',n:'AI Crime Network',          e:'🤖', cost:40000000,ml:350,bonus:'cashMult', val:0.15,tier:4,d:'Self-learning network. Operates while you sleep.'},
  {id:'dw_god',n:'Omniscience Engine',       e:'👁️', cost:80000000,ml:500,bonus:'xpMult',   val:0.25,tier:4,d:'Predict the future. Control the present.'},
  {id:'dw_matrix',n:'Reality Override',      e:'🔮', cost:150000000,ml:700,bonus:'cashMult',val:0.25,tier:4,d:'Rewrite the rules of the game itself.'},
  {id:'dw_singularity',n:'The Singularity', e:'🌟', cost:500000000,ml:1000,bonus:'xpMult', val:0.50,tier:4,d:'You transcend. The machine becomes you.'},
];
const HACK_TIERS=['Script Kiddie','Grey Hat','Black Hat','State-Level'];
const DW_HACKS = [
  // ── SCRIPT KIDDIE ──
  {id:'hk01',n:'Skim ATM Network',      e:'🏧',cost:500,     reward:3000,    xp:8,    risk:0.12,ml:1,  energy:4,  tier:0,cd:45, d:'Plant skimmers on 20 ATMs.'},
  {id:'hk02',n:'Phishing Campaign',     e:'📧',cost:2000,    reward:12000,   xp:20,   risk:0.15,ml:5,  energy:6,  tier:0,cd:55, d:'Blast 50K emails. 0.1% is profit.'},
  {id:'hk_wifi',n:'WiFi Credential Harvest',e:'📶',cost:1000,reward:6000,    xp:12,   risk:0.13,ml:3,  energy:5,  tier:0,cd:50, d:'Sniff coffee shop passwords.'},
  // ── GREY HAT ──
  {id:'hk03',n:'Ransomware Deploy',     e:'🔒',cost:10000,   reward:60000,   xp:60,   risk:0.20,ml:15, energy:10, tier:1,cd:70, d:'Lock a business\'s servers.'},
  {id:'hk_social',n:'Social Engineering',e:'🎭',cost:5000,   reward:30000,   xp:35,   risk:0.18,ml:10, energy:8,  tier:1,cd:60, d:'Call the CEO. Be convincing.'},
  {id:'hk_ddos',n:'DDoS Extortion',     e:'💥',cost:20000,   reward:100000,  xp:90,   risk:0.22,ml:25, energy:12, tier:1,cd:80, d:'Take down their site. Name your price.'},
  // ── BLACK HAT ──
  {id:'hk04',n:'Crypto Exchange Heist', e:'💰',cost:50000,   reward:350000,  xp:200,  risk:0.26,ml:40, energy:16, tier:2,cd:100,d:'Exploit the deposit contract.'},
  {id:'hk05',n:'Bank Wire Intercept',   e:'🏦',cost:200000,  reward:1500000, xp:600,  risk:0.30,ml:80, energy:22, tier:2,cd:120,d:'Man-in-the-middle on corporate transfer.'},
  {id:'hk_stock',n:'Stock Market Manipulation',e:'📈',cost:100000,reward:800000,xp:400,risk:0.28,ml:60,energy:18,tier:2,cd:110,d:'Insider algo. Pump and dump.'},
  // ── STATE-LEVEL ──
  {id:'hk06',n:'State Treasury Breach', e:'🏛️',cost:1000000, reward:8000000, xp:2000, risk:0.35,ml:200,energy:35, tier:3,cd:180,d:'National reserve hack.'},
  {id:'hk_satellite',n:'Satellite Hijack',e:'🛰️',cost:3000000,reward:20000000,xp:5000,risk:0.38,ml:350,energy:40,tier:3,cd:240,d:'Redirect a military satellite.'},
  {id:'hk_grid',n:'Power Grid Takeover',e:'⚡',cost:8000000,reward:60000000,xp:15000,risk:0.42,ml:500,energy:50,tier:3,cd:360,d:'Hold an entire city hostage.'},
];
function buildDarkWeb(c){
  if(!G.dwPurchased)G.dwPurchased={};
  if(!G.dwHackCooldowns)G.dwHackCooldowns={};
  if(!G.hackSuccesses)G.hackSuccesses=0;
  if(!G.hackEarned)G.hackEarned=0;
  const now=Date.now();
  const dwOwned=Object.keys(G.dwPurchased).length;
  const dwColor='#7b2fff';

  let html=`<div class="panel"><div class="ph"><h2>🕸️ DARK WEB</h2><span class="psub">${dwOwned}/${DARK_WEB_LISTINGS.length} upgrades · ${DW_HACKS.length} hacking ops</span></div><div class="pb">`;

  // Dashboard
  html+=`<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:12px">
    <div style="background:var(--surface2);border:1px solid var(--border);padding:6px;text-align:center"><div style="font-family:'Bebas Neue',sans-serif;font-size:16px;color:${dwColor}">${dwOwned}/${DARK_WEB_LISTINGS.length}</div><div style="font-size:8px;color:var(--text-dim);font-family:'Cutive Mono',monospace">UPGRADES</div></div>
    <div style="background:var(--surface2);border:1px solid var(--border);padding:6px;text-align:center"><div style="font-family:'Bebas Neue',sans-serif;font-size:16px;color:var(--bright-green)">${G.hackSuccesses}</div><div style="font-size:8px;color:var(--text-dim);font-family:'Cutive Mono',monospace">HACKS DONE</div></div>
    <div style="background:var(--surface2);border:1px solid var(--border);padding:6px;text-align:center"><div style="font-family:'Bebas Neue',sans-serif;font-size:16px;color:var(--bright-gold)">$${fmtCash(G.hackEarned)}</div><div style="font-size:8px;color:var(--text-dim);font-family:'Cutive Mono',monospace">HACKING INCOME</div></div>
    <div style="background:var(--surface2);border:1px solid var(--border);padding:6px;text-align:center"><div style="font-family:'Bebas Neue',sans-serif;font-size:16px;color:var(--bright-green)">$${fmtCash(G.cash)}</div><div style="font-size:8px;color:var(--text-dim);font-family:'Cutive Mono',monospace">CASH</div></div>
  </div>`;

  // Marketplace by tier
  html+=`<div style="font-family:'Bebas Neue',sans-serif;font-size:14px;letter-spacing:.12em;color:${dwColor};border-bottom:1px solid ${dwColor}44;margin-bottom:8px;padding-bottom:4px">🛒 ANONYMOUS MARKETPLACE</div>`;
  const ltColors=['var(--text-dim)','var(--bright-blue)','var(--bright-purple)','var(--bright-orange)','#ff1744'];
  for(let ti=0;ti<DW_LISTING_TIERS.length;ti++){
    const items=DARK_WEB_LISTINGS.filter(it=>it.tier===ti);
    if(!items.length)continue;
    const tierDone=items.filter(it=>G.dwPurchased[it.id]).length;
    html+=`<div style="font-size:10px;font-family:'Bebas Neue',sans-serif;letter-spacing:.1em;color:${ltColors[ti]};margin:8px 0 4px;opacity:.8">— ${DW_LISTING_TIERS[ti].toUpperCase()} (${tierDone}/${items.length}) —</div>`;
    for(const item of items){
      const owned=G.dwPurchased[item.id];
      const canAfford=G.cash>=item.cost;
      const locked=G.level<item.ml;
      const bonusLabel={cashMult:'Cash +'+Math.round(item.val*100)+'%',xpMult:'XP +'+Math.round(item.val*100)+'%',lootBonus:'Loot +'+item.val+'%',atk:'ATK +'+item.val,heatDec:'Heat decay +'+item.val}[item.bonus]||item.bonus;
      html+=`<div style="background:${owned?'linear-gradient(135deg,rgba(0,30,0,.3),var(--surface2))':'var(--surface2)'};border:1px solid ${owned?'rgba(120,255,120,.25)':'var(--border)'};padding:9px;margin-bottom:4px;display:grid;grid-template-columns:auto 1fr auto;gap:8px;align-items:center;opacity:${locked&&!owned?.35:1}">
        <div style="font-size:20px">${item.e}</div>
        <div>
          <div style="font-family:'Bebas Neue',sans-serif;font-size:12px;color:${owned?'#a0ff80':'var(--text)'}">${item.n}${owned?' ✓':''}</div>
          <div style="font-size:8px;color:var(--text-dim);font-family:'Special Elite',serif">${item.d}</div>
          <div style="font-size:8px;color:#a0ff80;font-family:'Cutive Mono',monospace;margin-top:1px">${bonusLabel}${locked&&!owned?' · 🔒 Lv'+item.ml:''}</div>
        </div>
        ${owned?'<div style="font-size:8px;color:#a0ff80;font-family:\'Bebas Neue\',sans-serif">OWNED</div>':
          locked?`<div style="font-size:9px;color:var(--text-dim)">LV ${item.ml}</div>`:
          `<button onclick="buyDarkWeb('${item.id}')" ${canAfford?'':'disabled'} style="background:${canAfford?'#110820':'var(--surface3)'};border:1px solid ${canAfford?dwColor:'var(--border)'};color:${canAfford?'#c9a0ff':'var(--text-dim)'};font-family:'Bebas Neue',sans-serif;font-size:10px;padding:4px 8px;cursor:${canAfford?'pointer':'not-allowed'};opacity:${canAfford?1:.5}">$${fmtCash(item.cost)}</button>`
        }
      </div>`;
    }
  }

  // Hacking by tier
  html+=`<div style="font-family:'Bebas Neue',sans-serif;font-size:14px;letter-spacing:.12em;color:${dwColor};border-bottom:1px solid ${dwColor}44;margin:14px 0 8px;padding-bottom:4px">💻 HACKING OPERATIONS</div>`;
  const htColors=['var(--text-dim)','var(--bright-green)','var(--bright-orange)','#ff1744'];
  for(let ti=0;ti<HACK_TIERS.length;ti++){
    const hacks=DW_HACKS.filter(h=>h.tier===ti);
    if(!hacks.length)continue;
    html+=`<div style="font-size:10px;font-family:'Bebas Neue',sans-serif;letter-spacing:.1em;color:${htColors[ti]};margin:8px 0 4px;opacity:.8">— ${HACK_TIERS[ti].toUpperCase()} —</div>`;
    for(const hack of hacks){
      const locked=G.level<hack.ml;
      const cd=G.dwHackCooldowns[hack.id]||0;
      const cdLeft=Math.max(0,Math.ceil((cd-now)/1000));
      const onCd=cdLeft>0;
      const canHack=!locked&&!onCd&&G.energy>=hack.energy&&G.cash>=hack.cost;
      const roi=((hack.reward/hack.cost-1)*100).toFixed(0);
      html+=`<div style="background:var(--surface2);border:1px solid var(--border);padding:9px;margin-bottom:4px;display:grid;grid-template-columns:auto 1fr auto;gap:8px;align-items:center;opacity:${locked?.35:1}">
        <div style="font-size:20px">${hack.e}</div>
        <div>
          <div style="font-family:'Bebas Neue',sans-serif;font-size:12px">${hack.n}</div>
          <div style="font-size:8px;color:var(--text-dim);font-family:'Special Elite',serif">${hack.d}</div>
          <div style="font-size:8px;font-family:'Cutive Mono',monospace;margin-top:2px"><span style="color:var(--bright-gold)">$${fmtCash(hack.cost)}</span> → <span style="color:#a0ff80">$${fmtCash(hack.reward)}</span> <span style="color:var(--text-dim)">(${roi}% ROI) · Risk ${Math.round(hack.risk*100)}% · ${hack.energy}⚡${locked?' · 🔒 Lv'+hack.ml:''}</span></div>
        </div>
        <div style="text-align:center;min-width:60px">
          ${locked?`<div style="font-size:9px;color:var(--text-dim)">LV ${hack.ml}</div>`:
            onCd?`<div style="font-family:'Cutive Mono',monospace;font-size:9px;color:var(--text-dim)">${cdLeft}s</div>`:
            `<button onclick="doHack('${hack.id}')" ${canHack?'':'disabled'} style="background:${canHack?'#110820':'var(--surface3)'};border:1px solid ${canHack?dwColor:'var(--border)'};color:${canHack?'#c9a0ff':'var(--text-dim)'};font-family:'Bebas Neue',sans-serif;font-size:10px;padding:5px 9px;cursor:${canHack?'pointer':'not-allowed'};opacity:${canHack?1:.5}">EXECUTE</button>`
          }
        </div>
      </div>`;
    }
  }
  html+=`</div></div>`;
  c.innerHTML=html;
}
function buyDarkWeb(id){
  const item=DARK_WEB_LISTINGS.find(i=>i.id===id);if(!item||G.dwPurchased[id])return;
  if(G.cash<item.cost){toast('Not enough cash!','r');return;}
  if(G.level<item.ml){toast('Level too low!','r');return;}
  G.cash-=item.cost;
  if(!G.dwPurchased)G.dwPurchased={};
  G.dwPurchased[id]=true;
  if(item.bonus==='cashMult')G.cashMult=(G.cashMult||1)+item.val;
  else if(item.bonus==='xpMult')G.xpMult=(G.xpMult||1)+item.val;
  else if(item.bonus==='lootBonus')G.lootBonus=(G.lootBonus||0)+item.val;
  else if(item.bonus==='atk'){G.baseAttack=(G.baseAttack||10)+item.val;G.attack=(G.attack||10)+item.val;}
  else if(item.bonus==='heatDec')G.heatDecayBonus=(G.heatDecayBonus||0)+item.val;
  addNotoriety(Math.floor(item.cost/500000)+1);
  addLog(`🕸️ Dark Web: ${item.n} acquired`,'sp');
  toast(`${item.n} acquired!`,'gold');
  checkAchievements();updateAll();save();buildDarkWeb(document.getElementById('center'));
}
function doHack(hid){
  const hack=DW_HACKS.find(h=>h.id===hid);if(!hack)return;
  if(G.energy<hack.energy){toast(`Need ${hack.energy} energy!`,'r');return;}
  if(G.cash<hack.cost){toast('Not enough cash!','r');return;}
  if(G.level<hack.ml){toast('Level too low!','r');return;}
  const now=Date.now();
  G.energy-=hack.energy;G.cash-=hack.cost;
  if(!G.dwHackCooldowns)G.dwHackCooldowns={};
  G.dwHackCooldowns[hid]=now+(hack.cd||90)*1000;
  addHeat(6+hack.tier*3);
  if(Math.random()>hack.risk){
    const earn=Math.floor(hack.reward*(G.cashMult||1)*getEventMult('hackMult',1));
    G.cash+=earn;G.totalEarned+=earn;
    if(!G.hackSuccesses)G.hackSuccesses=0;G.hackSuccesses++;
    if(!G.hackEarned)G.hackEarned=0;G.hackEarned+=earn;
    gainXP(hack.xp);
    addNotoriety(Math.floor(hack.reward/500000)+1);
    addLog(`💻 HACK SUCCESS: ${hack.n} +$${fmtCash(earn)}`,'gold');
    toast(`Hack Succeeded! +$${fmtCash(earn)}!`,'gold');
  }else{
    const heatPenalty=10+hack.tier*5;
    addHeat(heatPenalty);
    const dmg=Math.floor(hack.tier*8+Math.random()*15);
    G.health=Math.max(1,G.health-dmg);
    addLog(`🚨 HACK FAILED: ${hack.n} — traced! Heat +${heatPenalty}`,'bad');
    toast(`Hack Failed! Traced! Heat +${heatPenalty}`,'r');
    if(G.heat>85)triggerJail(10+hack.tier*5);
  }
  checkAchievements();updateAll();save();buildDarkWeb(document.getElementById('center'));
}

// ══════════════════════════════════════════════════════════
// UNDERWORLD HUB
// ══════════════════════════════════════════════════════════
const UW_BOUNTIES=[
  // ── STREET TIER ──
  {id:'sb01',n:'Rival Pusher',            e:'🚬',cash:5000,    rep:40,   ml:1,  energy:3,  heat:4,  cd:60,  tier:'Street',d:'Selling on your corners.'},
  {id:'sb02',n:'Corner Snitch',           e:'🐀',cash:10000,   rep:80,   ml:3,  energy:4,  heat:6,  cd:90,  tier:'Street',d:'Running his mouth to badges.'},
  {id:'sb03',n:'Graffiti Crew',           e:'🎨',cash:8000,    rep:60,   ml:1,  energy:3,  heat:3,  cd:75,  tier:'Street',d:'Tagging over your marks.'},
  {id:'sb04',n:'Shopkeeper Shakedown',    e:'🏪',cash:15000,   rep:100,  ml:5,  energy:5,  heat:5,  cd:120, tier:'Street',d:'Protection money is due.'},
  // ── DISTRICT TIER ──
  {id:'sb05',n:'Territory Tax',           e:'💰',cash:30000,   rep:200,  ml:10, energy:7,  heat:8,  cd:180, tier:'District',d:'Collecting from the whole block.'},
  {id:'sb06',n:'Gang Enforcer',           e:'💪',cash:50000,   rep:350,  ml:18, energy:8,  heat:10, cd:240, tier:'District',d:'Rival muscle. Send a message.'},
  {id:'sb07',n:'Fence Network',           e:'🔗',cash:75000,   rep:500,  ml:25, energy:10, heat:12, cd:300, tier:'District',d:'Moving stolen goods. Big volume.'},
  // ── CITY TIER ──
  {id:'sb08',n:"Rival Boss's Runner",     e:'🏃',cash:120000,  rep:800,  ml:40, energy:12, heat:15, cd:360, tier:'City',d:'Intercepting enemy supply lines.'},
  {id:'sb09',n:'Police Payroll',          e:'🚔',cash:200000,  rep:1200, ml:55, energy:15, heat:18, cd:420, tier:'City',d:'Buying the precinct. Monthly.',},
  {id:'sb10',n:'Port Authority',          e:'⚓',cash:350000,  rep:2000, ml:70, energy:18, heat:20, cd:480, tier:'City',d:'Controlling what comes through the harbor.'},
  // ── INTERNATIONAL TIER ──
  {id:'sb11',n:'Cartel Liaison',          e:'🌮',cash:600000,  rep:3500, ml:100,energy:22, heat:22, cd:600, tier:'International',d:'Mexico wants to do business.'},
  {id:'sb12',n:'Weapons Shipment',        e:'💣',cash:1000000, rep:5000, ml:150,energy:28, heat:25, cd:720, tier:'International',d:'Military hardware. No serial numbers.'},
  {id:'sb13',n:'Shadow Network Agent',    e:'🕵️',cash:2500000, rep:10000,ml:250,energy:35, heat:30, cd:900, tier:'International',d:'Intelligence is the real currency.'},
  {id:'sb14',n:'Sovereign Deal',          e:'🏛️',cash:5000000, rep:20000,ml:400,energy:40, heat:35, cd:1200,tier:'International',d:'Governments are customers too.'},
  {id:'sb15',n:'World Order Contract',    e:'🌐',cash:15000000,rep:50000,ml:600,energy:50, heat:40, cd:1800,tier:'International',d:'Reshape the global balance of power.'},
];
const UW_TERRITORIES=[
  // ── STREET ──
  {id:'tc01',n:'The Corners',        pct:3,  cost:30000,    ml:1,  rep:100,   incBonus:.03,tier:'Street'},
  {id:'tc02',n:'The Block',          pct:4,  cost:75000,    ml:8,  rep:300,   incBonus:.04,tier:'Street'},
  {id:'tc03',n:'The Strip',          pct:5,  cost:150000,   ml:15, rep:600,   incBonus:.05,tier:'Street'},
  // ── DISTRICT ──
  {id:'tc04',n:'The Docks',          pct:6,  cost:300000,   ml:25, rep:1000,  incBonus:.06,tier:'District'},
  {id:'tc05',n:'Warehouse District', pct:7,  cost:600000,   ml:40, rep:2000,  incBonus:.07,tier:'District'},
  {id:'tc06',n:'Entertainment Row',  pct:8,  cost:1000000,  ml:55, rep:3500,  incBonus:.08,tier:'District'},
  // ── CITY ──
  {id:'tc07',n:'The Projects',       pct:10, cost:2500000,  ml:80, rep:6000,  incBonus:.10,tier:'City'},
  {id:'tc08',n:'Financial District', pct:12, cost:5000000,  ml:120,rep:10000, incBonus:.12,tier:'City'},
  {id:'tc09',n:'City Hall',          pct:15, cost:10000000, ml:180,rep:18000, incBonus:.15,tier:'City'},
  // ── DOMINION ──
  {id:'tc10',n:'The Port Authority', pct:18, cost:25000000, ml:300,rep:30000, incBonus:.18,tier:'Dominion'},
  {id:'tc11',n:'The Entire City',    pct:25, cost:60000000, ml:450,rep:50000, incBonus:.25,tier:'Dominion'},
  {id:'tc12',n:'The Shadow State',   pct:50, cost:200000000,ml:700,rep:100000,incBonus:.50,tier:'Dominion'},
];
const UW_REP_TIERS=[
  {rep:0,     title:'Nobody',            color:'var(--text-dim)',  bonus:'No perks yet.'},
  {rep:200,   title:'Known Face',        color:'#888',             bonus:'+2% Cash from bounties'},
  {rep:800,   title:'Street Name',       color:'#b0b0b0',         bonus:'+5% Cash, heat decays faster'},
  {rep:2000,  title:'Connected',         color:'var(--gold)',      bonus:'+8% Cash, +5% XP'},
  {rep:5000,  title:'Underground Legend', color:'var(--bright-gold)',bonus:'+12% Cash, +10% XP, cheaper territories'},
  {rep:12000, title:'The Shadow',        color:'var(--bright-orange)',bonus:'+18% Cash, +15% XP, bounty cooldowns halved'},
  {rep:30000, title:'Ghost King',        color:'var(--crimson)',   bonus:'+25% Cash, +20% XP, heat immunity below 50'},
  {rep:60000, title:'The Network',       color:'#ff4444',         bonus:'+35% all income, +30% XP'},
  {rep:100000,title:'The Architect',     color:'var(--bright-purple)',bonus:'×2 bounty rewards, +50% all income'},
  {rep:250000,title:'God of the Underground',color:'#ff1744',     bonus:'×3 bounty rewards, ×2 all income, legend.'},
];
function buildUnderworld(c){
  if(!G.underworldRep)G.underworldRep=0;
  if(!G.streetBounties)G.streetBounties={};
  if(!G.ownedTerritories)G.ownedTerritories={};
  initDrugPrices();
  const now=Date.now();
  const repTier=UW_REP_TIERS.slice().reverse().find(t=>G.underworldRep>=t.rep)||UW_REP_TIERS[0];
  const totalTerr=UW_TERRITORIES.reduce((s,t)=>s+(G.ownedTerritories[t.id]?t.pct:0),0);
  let html=`<div class="panel"><div class="ph"><h2>🌆 UNDERWORLD</h2><span class="psub">The economy beneath the economy. Drugs. Territory. Bounties. Shadow deals.</span></div><div class="pb">`;
  // Rep banner
  html+=`<div style="background:linear-gradient(135deg,#0a0005,var(--surface2));border:1px solid var(--crimson);padding:12px;margin-bottom:14px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;text-align:center">
    <div><div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:${repTier.color}">${repTier.title}</div><div style="font-size:9px;color:var(--text-dim);font-family:'Cutive Mono',monospace">REP: ${(G.underworldRep||0).toLocaleString()}</div></div>
    <div><div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:var(--bright-gold)">${totalTerr}%</div><div style="font-size:9px;color:var(--text-dim);font-family:'Cutive Mono',monospace">TERRITORY</div></div>
    <div><div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:var(--bright-green)">$${fmtCash(G.cash)}</div><div style="font-size:9px;color:var(--text-dim);font-family:'Cutive Mono',monospace">STREET CASH</div></div>
  </div>`;
  // Drug Trade
  html+=`<div style="font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:.1em;color:var(--text-dim);border-bottom:1px solid var(--border);margin-bottom:8px;padding-bottom:4px">💊 DRUG TRADE — Prices fluctuate every 30s</div>`;
  for(const d of DRUGS){
    const price=Math.floor(G.drugPrices[d.id]||d.buyBase);
    const sellPrice=Math.floor(price*(1.3+Math.random()*.2)*(G.drugMult||1));
    const inv=G.drugInv[d.id]||0;
    const canBuy=G.cash>=price;
    const trend=(G.drugPrices[d.id]||d.buyBase)>d.buyBase;
    html+=`<div style="background:var(--surface2);border:1px solid var(--border);padding:9px;margin-bottom:5px;display:grid;grid-template-columns:auto 1fr auto auto auto;gap:8px;align-items:center">
      <div style="font-size:20px">${d.e}</div>
      <div>
        <div style="font-family:'Bebas Neue',sans-serif;font-size:12px">${d.n} <span style="color:${trend?'var(--bright-green)':'var(--crimson)'};font-size:10px">${trend?'↑':'↓'}</span></div>
        <div style="font-size:8px;color:var(--text-dim);font-family:'Cutive Mono',monospace">Held: ${inv} · Risk: ${Math.round(d.risk*100)}%</div>
      </div>
      <div style="font-size:11px;color:var(--bright-gold);font-family:'Cutive Mono',monospace">$${fmtCash(price)}</div>
      <button onclick="buyDrug('${d.id}',${price})" ${canBuy?'':'disabled'} style="background:rgba(0,60,0,.5);border:1px solid ${canBuy?'var(--bright-green)':'var(--border)'};color:${canBuy?'var(--bright-green)':'var(--text-dim)'};font-family:'Bebas Neue',sans-serif;font-size:10px;padding:3px 7px;cursor:${canBuy?'pointer':'not-allowed'};opacity:${canBuy?1:.5}">BUY</button>
      <button onclick="sellDrugUpgraded('${d.id}',${sellPrice})" ${inv>0?'':'disabled'} style="background:rgba(80,0,0,.5);border:1px solid ${inv>0?'var(--crimson)':'var(--border)'};color:${inv>0?'var(--crimson)':'var(--text-dim)'};font-family:'Bebas Neue',sans-serif;font-size:10px;padding:3px 7px;cursor:${inv>0?'pointer':'not-allowed'};opacity:${inv>0?1:.5}">SELL</button>
    </div>`;
  }
  // Street Bounties
  html+=`<div style="font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:.1em;color:var(--text-dim);border-bottom:1px solid var(--border);margin:14px 0 8px;padding-bottom:4px">🎯 STREET BOUNTIES — earn Underworld Rep (${UW_BOUNTIES.length} available)</div>`;
  const bTiers=[...new Set(UW_BOUNTIES.map(b=>b.tier))];
  const bTierColors={Street:'var(--text-dim)',District:'var(--bright-blue)',City:'var(--bright-orange)',International:'#ff1744'};
  for(const bt of bTiers){
    const bList=UW_BOUNTIES.filter(b=>b.tier===bt);
    html+=`<div style="font-size:10px;font-family:'Bebas Neue',sans-serif;letter-spacing:.1em;color:${bTierColors[bt]||'var(--text-dim)'};margin:8px 0 4px;opacity:.7">— ${bt.toUpperCase()} —</div>`;
    for(const b of bList){
    const locked=G.level<b.ml;
    const cd=G.streetBounties[b.id]||0;
    const cdLeft=Math.max(0,Math.ceil((cd-now)/1000));
    const onCd=cdLeft>0;
    const canDo=!locked&&!onCd&&G.energy>=b.energy;
    html+=`<div style="background:var(--surface2);border:1px solid var(--border);padding:9px;margin-bottom:4px;display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:center;opacity:${locked?.35:1}">
      <div style="font-size:20px">${b.e}</div>
      <div>
        <div style="font-family:'Bebas Neue',sans-serif;font-size:12px">${b.n}</div>
        <div style="font-size:8px;color:var(--text-dim);font-family:'Special Elite',serif">${b.d||''}</div>
        <div style="font-size:8px;color:var(--text-dim);font-family:'Cutive Mono',monospace;margin-top:2px">$${fmtCash(b.cash)} · +${b.rep} rep · ${b.energy}⚡ · 🌡️+${b.heat}${locked?' · 🔒 Lv'+b.ml:''}</div>
      </div>
      ${locked?`<div style="font-size:10px;color:var(--text-dim)">LV ${b.ml}</div>`:
        onCd?`<div style="font-family:'Cutive Mono',monospace;font-size:10px;color:var(--text-dim);min-width:48px;text-align:center">${cdLeft}s</div>`:
        `<button onclick="doStreetBounty('${b.id}')" ${canDo?'':'disabled'} style="background:${canDo?'rgba(80,0,0,.6)':'var(--surface3)'};border:1px solid ${canDo?'var(--crimson)':'var(--border)'};color:${canDo?'var(--crimson)':'var(--text-dim)'};font-family:'Bebas Neue',sans-serif;font-size:10px;padding:5px 10px;cursor:${canDo?'pointer':'not-allowed'};opacity:${canDo?1:.5}">COLLECT</button>`
      }
    </div>`;
    }
  }
  // Territory
  html+=`<div style="font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:.1em;color:var(--text-dim);border-bottom:1px solid var(--border);margin:14px 0 8px;padding-bottom:4px">🗺️ TERRITORY — ${UW_TERRITORIES.length} zones · each boosts passive income</div>`;
  const tTiers=[...new Set(UW_TERRITORIES.map(t=>t.tier))];
  const tTierColors={Street:'var(--text-dim)',District:'var(--bright-blue)',City:'var(--bright-orange)',Dominion:'#ff1744'};
  for(const tt of tTiers){
    const tList=UW_TERRITORIES.filter(t=>t.tier===tt);
    html+=`<div style="font-size:10px;font-family:'Bebas Neue',sans-serif;letter-spacing:.1em;color:${tTierColors[tt]||'var(--text-dim)'};margin:8px 0 4px;opacity:.7">— ${tt.toUpperCase()} —</div>`;
    for(const t of tList){
    const owned=G.ownedTerritories[t.id];
    const canAfford=G.cash>=t.cost;
    const locked=G.level<t.ml||(G.underworldRep||0)<t.rep;
    html+=`<div style="background:${owned?'linear-gradient(135deg,rgba(80,0,0,.2),var(--surface2))':'var(--surface2)'};border:1px solid ${owned?'var(--crimson)':'var(--border)'};padding:9px;margin-bottom:5px;display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center;opacity:${locked&&!owned?.5:1}">
      <div>
        <div style="font-family:'Bebas Neue',sans-serif;font-size:12px">${t.n} <span style="color:var(--bright-green);font-size:10px">+${Math.round((t.incBonus||.05)*100)}% income</span></div>
        <div style="font-size:9px;color:var(--text-dim);font-family:'Cutive Mono',monospace">${owned?'OWNED — income +'+Math.round((t.incBonus||.05)*100)+'%':locked?'Lv'+t.ml+' + '+t.rep.toLocaleString()+' rep required':'$'+fmtCash(t.cost)+' · Lv'+t.ml+' · '+t.rep.toLocaleString()+' rep'}</div>
      </div>
      ${owned?'<div style="font-size:10px;color:var(--crimson);font-family:\'Bebas Neue\',sans-serif">OWNED</div>':
        locked?`<div style="font-size:9px;color:var(--text-dim)">LOCKED</div>`:
        `<button onclick="buyTerritory('${t.id}')" ${canAfford?'':'disabled'} style="background:${canAfford?'rgba(80,0,0,.6)':'var(--surface3)'};border:1px solid ${canAfford?'var(--crimson)':'var(--border)'};color:${canAfford?'var(--crimson)':'var(--text-dim)'};font-family:'Bebas Neue',sans-serif;font-size:11px;padding:5px 10px;cursor:${canAfford?'pointer':'not-allowed'};opacity:${canAfford?1:.5}">CLAIM</button>`
      }
    </div>`;
  }
  }
  // Rep tiers display
  html+=`<div style="font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:.1em;color:var(--text-dim);border-bottom:1px solid var(--border);margin:14px 0 8px;padding-bottom:4px">🏆 REP TIERS — ${UW_REP_TIERS.length} ranks</div>`;
  html+=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;">`;
  for(const rt of UW_REP_TIERS){
    const active=(G.underworldRep||0)>=rt.rep;
    html+=`<div style="background:${active?'linear-gradient(135deg,rgba(80,0,0,.15),var(--surface2))':'var(--surface2)'};border:1px solid ${active?rt.color:'var(--border)'};padding:6px;opacity:${active?1:.4}">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:11px;color:${rt.color}">${rt.title}</div>
      <div style="font-size:8px;color:var(--text-dim);font-family:'Cutive Mono',monospace">${rt.rep.toLocaleString()} rep · ${rt.bonus}</div>
    </div>`;
  }
  html+=`</div>`;
  html+=`</div></div>`;
  c.innerHTML=html;
}
function doStreetBounty(bid){
  const b=UW_BOUNTIES.find(x=>x.id===bid);if(!b)return;
  if(G.energy<b.energy){toast(`Need ${b.energy} energy!`,'r');return;}
  G.energy-=b.energy;addHeat(b.heat);
  // Rep tier multiplier for cash
  const repTier=UW_REP_TIERS.slice().reverse().find(t=>(G.underworldRep||0)>=t.rep)||UW_REP_TIERS[0];
  const earn=Math.floor(b.reward*repTier.mult*(G.cashMult||1));
  G.cash+=earn;G.totalEarned+=earn;
  G.underworldRep=(G.underworldRep||0)+b.rep;
  gainXP(Math.floor(earn/500));
  addNotoriety(Math.floor(b.rep/50));
  G.streetBounties[bid]=Date.now()+b.cd*1000;
  addLog(`🌆 Bounty: +$${fmtCash(earn)} +${b.rep} UW Rep!`,'gold');
  toast(`+$${fmtCash(earn)} +${b.rep} UW Rep!`,'gold');
  checkAchievements();updateAll();save();
  buildUnderworld(document.getElementById('center'));
}
function buyTerritory(tid){
  const t=UW_TERRITORIES.find(x=>x.id===tid);if(!t)return;
  if(G.cash<t.cost){toast('Not enough cash!','r');return;}
  if(G.level<t.ml){toast('Level too low!','r');return;}
  if((G.underworldRep||0)<t.rep){toast('Need more Underworld Rep!','r');return;}
  G.cash-=t.cost;
  if(!G.ownedTerritories)G.ownedTerritories={};
  G.ownedTerritories[tid]=true;
  const bonus=t.incBonus||0.05;
  G.incomeMult=(G.incomeMult||1)+bonus;
  addLog(`🗺️ Territory: ${t.n} claimed! Income +${Math.round(bonus*100)}%`,'gold');
  toast(`${t.n} claimed! Income +${Math.round(bonus*100)}%!`,'gold');
  addNotoriety(Math.floor(t.cost/500000));
  checkAchievements();updateAll();save();
  buildUnderworld(document.getElementById('center'));
}

// ══════════════════════════════════════════
// BACKPACK PANEL
// ══════════════════════════════════════════
function buildBackpack(c){
  if(!G.backpack)G.backpack={};
  const items=Object.entries(G.backpack).filter(([k,v])=>v>0);
  const totalItems=items.reduce((s,[k,v])=>s+v,0);

  // Next daily reward info
  const now=Date.now();
  const last=G.lastDailyClaim||0;
  const elapsed=now-last;
  const oneDay=86400000;
  const canClaim=elapsed>=oneDay;
  const nextIn=canClaim?0:Math.ceil((oneDay-elapsed)/60000);
  const nextHrs=Math.floor(nextIn/60);
  const nextMins=nextIn%60;

  let html=`<div class="panel"><div class="ph"><h2>🎒 BACKPACK</h2><span class="psub">${totalItems} consumable items | Use anytime</span></div><div class="pb">`;

  // Daily reward status
  html+=`<div style="background:linear-gradient(135deg,rgba(218,165,32,.08),var(--surface2));border:1px solid ${canClaim?'var(--bright-gold)':'var(--border)'};padding:12px;margin-bottom:14px;text-align:center;">
    <div style="font-family:'Bebas Neue',sans-serif;font-size:16px;color:var(--bright-gold);letter-spacing:.12em;">🎁 DAILY REWARD — DAY ${(G.dailyStreak||0)+1}</div>
    <div style="font-family:'Cutive Mono',monospace;font-size:11px;color:var(--text-dim);margin-top:4px;">Streak: ${G.dailyStreak||0} days${(G.dailyStreak||0)%7>=6?' — BONUS DAY NEXT!':''}</div>
    ${canClaim?
      `<button onclick="showDailyRewardPopup()" style="background:var(--blood);border:2px solid var(--gold);color:var(--bright-gold);font-family:'Bebas Neue',sans-serif;font-size:16px;letter-spacing:.12em;padding:10px 30px;cursor:pointer;margin-top:10px;width:100%;transition:all .2s;">🎁 CLAIM TODAY'S REWARD</button>`:
      `<div style="font-family:'Cutive Mono',monospace;font-size:12px;color:var(--text-dim);margin-top:8px;">Next reward in: <span style="color:var(--bright-gold)">${nextHrs}h ${nextMins}m</span></div>`
    }
  </div>`;

  // Play time display
  html+=`<div style="background:var(--surface2);border:1px solid var(--border);padding:10px;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;">
    <div><div style="font-family:'Bebas Neue',sans-serif;font-size:13px;color:var(--text-dim);letter-spacing:.1em;">⏱️ ACTIVE PLAY TIME</div>
    <div style="font-family:'Cutive Mono',monospace;font-size:10px;color:var(--text-dim);">Only counts when you're clicking</div></div>
    <div style="font-family:'Bebas Neue',sans-serif;font-size:22px;color:var(--bright-gold);" id="play-timer-panel">${typeof formatPlayTime==='function'?formatPlayTime(G.playTime||0):'0s'}</div>
  </div>`;

  // Backpack items
  if(items.length===0){
    html+=`<div style="text-align:center;padding:30px;color:var(--text-dim);font-family:'Special Elite',serif;font-size:13px;">Your backpack is empty.<br>Claim daily rewards to fill it up!</div>`;
  }else{
    html+=`<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px;">`;
    for(const[id,qty] of items){
      const reward=DAILY_REWARDS.find(r=>r.id===id);
      if(!reward)continue;
      html+=`<div style="background:var(--surface2);border:1px solid var(--border);padding:12px;text-align:center;transition:all .15s;cursor:pointer;" onmouseover="this.style.borderColor='var(--gold)'" onmouseout="this.style.borderColor='var(--border)'">
        <div style="font-size:32px;margin-bottom:4px;">${reward.e}</div>
        <div style="font-family:'Bebas Neue',sans-serif;font-size:14px;color:var(--text);">${reward.n}</div>
        <div style="font-family:'Cutive Mono',monospace;font-size:10px;color:var(--text-dim);margin:3px 0;">${reward.d}</div>
        <div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:var(--bright-gold);margin:4px 0;">×${qty}</div>
        <button onclick="useBackpackItem('${id}')" style="background:var(--blood);border:1px solid var(--crimson);color:#fff;font-family:'Bebas Neue',sans-serif;font-size:12px;letter-spacing:.08em;padding:6px 16px;cursor:pointer;width:100%;transition:all .15s;">USE</button>
      </div>`;
    }
    html+=`</div>`;
  }

  html+=`</div></div>`;
  c.innerHTML=html;
}
