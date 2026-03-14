import React, { useState, useEffect, useRef } from 'react';

/* ═══════════════════════════════════════════════════════════════════
   SERVICE LOGO — MULTI-SOURCE WITH WATERFALL FALLBACK
   Sources tried in order:
     1. Google Favicon HD  (t3.gstatic.com) — most reliable, free
     2. DuckDuckGo icons   (icons.duckduckgo.com) — good coverage
     3. Brandfetch          (cdn.brandfetch.io) — high quality
     4. Clearbit            (logo.clearbit.com) — legacy fallback
     5. Letter avatar       — always works
   ═══════════════════════════════════════════════════════════════════ */

const SERVICE_DOMAIN_MAP = {
  // ── Google / Apple / Microsoft ──
  google: 'google.com', gmail: 'google.com', youtube: 'youtube.com',
  googledrive: 'drive.google.com', googlemeet: 'meet.google.com',
  googlephotos: 'photos.google.com', googleplay: 'play.google.com',
  microsoft: 'microsoft.com', outlook: 'outlook.com', office: 'office.com',
  office365: 'office.com', onedrive: 'onedrive.live.com', teams: 'microsoft.com',
  xbox: 'xbox.com', msn: 'msn.com', bing: 'bing.com',
  apple: 'apple.com', icloud: 'icloud.com', appstore: 'apple.com',
  itunes: 'apple.com', facetime: 'apple.com', imessage: 'apple.com',

  // ── Social Media ──
  facebook: 'facebook.com', fb: 'facebook.com',
  instagram: 'instagram.com', insta: 'instagram.com',
  twitter: 'twitter.com', x: 'x.com',
  linkedin: 'linkedin.com',
  tiktok: 'tiktok.com',
  snapchat: 'snapchat.com', snap: 'snapchat.com',
  pinterest: 'pinterest.com',
  reddit: 'reddit.com',
  tumblr: 'tumblr.com',
  mastodon: 'mastodon.social',
  threads: 'threads.net',
  bereal: 'bere.al',
  clubhouse: 'clubhouse.com',
  vk: 'vk.com',

  // ── Messaging / Comms ──
  whatsapp: 'whatsapp.com',
  telegram: 'telegram.org',
  signal: 'signal.org',
  discord: 'discord.com',
  slack: 'slack.com',
  skype: 'skype.com',
  viber: 'viber.com',
  line: 'line.me',
  wechat: 'wechat.com',
  messenger: 'messenger.com',
  zoom: 'zoom.us',
  googlechat: 'chat.google.com',

  // ── Dating Apps ──
  tinder: 'tinder.com',
  bumble: 'bumble.com',
  hinge: 'hinge.co',
  okcupid: 'okcupid.com',
  match: 'match.com',
  pof: 'pof.com',
  plentyoffish: 'pof.com',
  badoo: 'badoo.com',
  grindr: 'grindr.com',
  happn: 'happn.com',
  coffeemeetsbagel: 'coffeemeetsbagel.com',
  cmb: 'coffeemeetsbagel.com',
  zoosk: 'zoosk.com',
  eharmony: 'eharmony.com',
  lovoo: 'lovoo.com',
  tagged: 'tagged.com',
  moco: 'mocospace.com',
  skout: 'skout.com',
  meetme: 'meetme.com',
  her: 'weareher.com',

  // ════════════════════════════════════════════════════════
  // GAMES — COMPREHENSIVE DATABASE
  // ════════════════════════════════════════════════════════

  // ── GTA — Every Version ──
  gta: 'rockstargames.com',
  grandtheftauto: 'rockstargames.com',
  gta1: 'rockstargames.com',
  gta2: 'rockstargames.com',
  gta3: 'rockstargames.com',
  gtaiii: 'rockstargames.com',
  gtavicecity: 'rockstargames.com',
  vicecity: 'rockstargames.com',
  gtasanandreas: 'rockstargames.com',
  sanandreas: 'rockstargames.com',
  gtaiv: 'rockstargames.com',
  gta4: 'rockstargames.com',
  gtav: 'rockstargames.com',
  gta5: 'rockstargames.com',
  gtavi: 'rockstargames.com',
  gta6: 'rockstargames.com',
  gtaonline: 'rockstargames.com',
  gtavonline: 'rockstargames.com',
  gtalibertycity: 'rockstargames.com',
  libertycity: 'rockstargames.com',
  gtaadvance: 'rockstargames.com',
  gtachinaltown: 'rockstargames.com',
  chinatownwars: 'rockstargames.com',
  gtalcs: 'rockstargames.com',
  gtavcs: 'rockstargames.com',
  rockstar: 'rockstargames.com',
  rockstargames: 'rockstargames.com',
  rockstarclub: 'rockstargames.com',
  socialclub: 'rockstargames.com',
  rgl: 'rockstargames.com',

  // ── Rockstar Other Titles ──
  rdr: 'rockstargames.com',
  rdr2: 'rockstargames.com',
  reddeadredemption: 'rockstargames.com',
  reddeadredemption2: 'rockstargames.com',
  reddeadonline: 'rockstargames.com',
  maxpayne: 'rockstargames.com',
  maxpayne3: 'rockstargames.com',
  bully: 'rockstargames.com',
  bullyscolarship: 'rockstargames.com',
  manhunt: 'rockstargames.com',
  nikkiassassin: 'rockstargames.com',
  ladynoire: 'rockstargames.com',
  agentgame: 'rockstargames.com',

  // ── Battle Royale / Shooters ──
  freefire: 'ff.garena.com',
  freefiremax: 'ff.garena.com',
  ff: 'ff.garena.com',
  ffmax: 'ff.garena.com',
  garena: 'garena.com',
  garenafreefire: 'ff.garena.com',
  pubg: 'pubg.com',
  pubgmobile: 'pubgmobile.com',
  pubgm: 'pubgmobile.com',
  battlegrounds: 'pubg.com',
  bgmi: 'pubgmobile.com',
  battlegroundsmobileindia: 'pubgmobile.com',
  pubgnew: 'pubg.com',
  pubgpc: 'pubg.com',
  codmobile: 'callofduty.com',
  callofduty: 'callofduty.com',
  cod: 'callofduty.com',
  warzone: 'callofduty.com',
  warzone2: 'callofduty.com',
  wzm: 'callofduty.com',
  codwarzone: 'callofduty.com',
  modernwarfare: 'callofduty.com',
  modernwarfare2: 'callofduty.com',
  modernwarfare3: 'callofduty.com',
  blackops: 'callofduty.com',
  blackops2: 'callofduty.com',
  blackops3: 'callofduty.com',
  blackops4: 'callofduty.com',
  blackops6: 'callofduty.com',
  coldwar: 'callofduty.com',
  vanguard: 'callofduty.com',
  infinitewarfare: 'callofduty.com',
  ghosts: 'callofduty.com',
  advancedwarfare: 'callofduty.com',
  ww2: 'callofduty.com',
  fortnite: 'fortnite.com',
  epicgames: 'epicgames.com',
  epic: 'epicgames.com',
  apexlegends: 'ea.com',
  apex: 'ea.com',
  valorant: 'playvalorant.com',
  csgo: 'store.steampowered.com',
  cs2: 'store.steampowered.com',
  counterstrike: 'store.steampowered.com',
  counterstrikecsgo: 'store.steampowered.com',
  counterstrikegs: 'store.steampowered.com',
  cs: 'counter-strike.net',
  battlebit: 'battlebitremastered.com',
  splitgate: 'splitgate.com',
  hyperscape: 'ubisoft.com',
  darwin: 'ubisoft.com',
  fallguys: 'fallguys.com',
  naraka: 'narakathegame.com',
  narakabladepoint: 'narakathegame.com',
  supercellbrawlstars: 'supercell.com',
  sausageman: 'yoozoo.com',
  zula: 'zulagame.com',
  ruleofsurvival: 'netease.com',
  knivesout: 'netease.com',
  survivalrules: 'netease.com',
  creative: 'fortnite.com',

  // ── MOBA / Strategy ──
  mobilelegends: 'mobilelegends.com',
  mlbb: 'mobilelegends.com',
  mobilelegendsbb: 'mobilelegends.com',
  mlbangbang: 'mobilelegends.com',
  arenaofvalor: 'arenaofvalor.com',
  aov: 'arenaofvalor.com',
  honorofkings: 'honorofkings.com',
  honor: 'honorofkings.com',
  hok: 'honorofkings.com',
  wildrift: 'wildrift.leagueoflegends.com',
  lolwildrift: 'wildrift.leagueoflegends.com',
  leagueoflegends: 'leagueoflegends.com',
  lol: 'leagueoflegends.com',
  dota2: 'dota2.com',
  dota: 'dota2.com',
  smite: 'smitegame.com',
  pokemonunite: 'unite.pokemon.com',
  battlerite: 'battlerite.com',
  vainglory: 'vainglorygame.com',
  legendsofruneterra: 'legendsofruneterra.com',
  lor: 'legendsofruneterra.com',
  tetrisfight: 'n3twork.com',
  commandconquer: 'ea.com',
  starcraft: 'starcraft2.com',
  starcraft2: 'starcraft2.com',
  hearthstone: 'hearthstone.com',

  // ── Supercell Games ──
  supercell: 'supercell.com',
  clashofclans: 'clashofclans.com',
  coc: 'clashofclans.com',
  clashroyale: 'clashroyale.com',
  cr: 'clashroyale.com',
  brawlstars: 'brawlstars.com',
  bs: 'brawlstars.com',
  hayday: 'supercell.com',
  boombeach: 'supercell.com',
  squadbusters: 'supercell.com',

  // ── Mihoyo / HoYoverse ──
  mihoyo: 'mihoyo.com',
  hoyoverse: 'hoyoverse.com',
  genshinimpact: 'genshin.hoyoverse.com',
  genshin: 'genshin.hoyoverse.com',
  gi: 'genshin.hoyoverse.com',
  honkaistarrail: 'hsr.hoyoverse.com',
  hsr: 'hsr.hoyoverse.com',
  starrail: 'hsr.hoyoverse.com',
  honkai: 'honkaiimpact3.mihoyo.com',
  honkaiimpact: 'honkaiimpact3.mihoyo.com',
  honkaiimpact3: 'honkaiimpact3.mihoyo.com',
  zenlesszonezeroo: 'zenless.hoyoverse.com',
  zzz: 'zenless.hoyoverse.com',
  zzzero: 'zenless.hoyoverse.com',
  zenless: 'zenless.hoyoverse.com',
  tearsofthemis: 'tot.mihoyo.com',

  // ── Gacha / RPG Mobile ──
  fatego: 'fate-go.us',
  fategrandorder: 'fate-go.us',
  fgo: 'fate-go.us',
  arknights: 'arknights.global',
  azurlane: 'azurlane.yo-star.com',
  granblue: 'granbluefantasy.jp',
  granblueversus: 'granbluefantasy.jp',
  revuestarlight: 'kiraraapp.com',
  sinoalice: 'sinoalice.com',
  another: 'nexon.com',
  saoalicization: 'bandainamco.com',
  toramobile: 'toram-online.com',
  toram: 'toram-online.com',
  ragnarmobile: 'gravity.com',
  ragnarok: 'gravity.com',
  ragnarokmobile: 'gravity.com',
  eversoul: 'kakao.com',
  eternalcity: 'netease.com',
  mavelousadventure: 'netease.com',
  langrisser: 'zlongame.com',
  epicseventeen: 'stove.com',
  epicseven: 'stove.com',
  grandchase: 'ko.grandchase.com',
  ninopathmobile: 'ko.bandainamco.com',
  exosbattles: 'exosbattles.com',
  browndust: 'neowiz.com',
  illusiomconnnect: 'bilibili.com',
  idolmaster: 'idolmaster.jp',
  lovelive: 'lovelive-anime.jp',
  dungeondefenders: 'dungeondefenders.com',
  kingdomhearts: 'kingdomhearts.square-enix-games.com',
  summonerswar: 'withhive.com',
  summoners: 'withhive.com',
  sw: 'withhive.com',
  sevenknight: 'netmarble.com',
  sevenknights: 'netmarble.com',
  lineageternal: 'ncsoft.com',
  lineage: 'ncsoft.com',
  bladesoftime: 'nexon.com',
  bladesoftime2: 'nexon.com',
  nier: 'nierreincarnation.com',
  nierreincarnation: 'nierreincarnation.com',
  watcher: 'watchers.com',
  afkarena: 'lilith.com',
  afk: 'lilith.com',
  afkjourney: 'farlight-games.com',
  lordsmobile: 'igg.com',
  raiders: 'lilith.com',
  callofdragons: 'lilith.com',
  mobius: 'nexon.com',
  neverwinter: 'arcgames.com',
  aliceorder: 'drecom.co.jp',

  // ── Netease Games ──
  netease: 'netease.com',
  lifteafter: 'netease.com',
  lifeafter: 'lifeafter.game',
  rules: 'netease.com',
  mystical: 'netease.com',
  hyper: 'netease.com',
  vikingrise: 'netease.com',
  identityv: 'netease.com',
  identity: 'netease.com',
  onmyoji: 'onmyoji.com',
  onmyojiarena: 'onmyoji.com',
  diablo: 'blizzard.com',
  diablo4: 'diablo4.blizzard.com',
  diabloimmortal: 'diabloimmortal.blizzard.com',

  // ── Level Infinite / Tencent ──
  tencent: 'tencent.com',
  levelinfinite: 'levelinfinite.com',
  torchlight: 'levelinfinite.com',
  torchlightinfinite: 'levelinfinite.com',
  deltaforce: 'levelinfinite.com',
  metalslug: 'levelinfinite.com',
  undawn: 'levelinfinite.com',
  warbreachers: 'levelinfinite.com',

  // ── Nintendo Games ──
  nintendo: 'nintendo.com',
  nintendoswitch: 'nintendo.com',
  mario: 'nintendo.com',
  supermario: 'nintendo.com',
  supermariorun: 'mario.nintendo.com',
  mariorun: 'mario.nintendo.com',
  mariokart: 'mariokart.nintendo.com',
  mariokarttour: 'mariokarttour.com',
  zelda: 'zelda.com',
  legendofzelda: 'zelda.com',
  breathofwild: 'zelda.com',
  tearsofkingdom: 'zelda.com',
  pokemon: 'pokemon.com',
  pokemongo: 'pokemongolive.com',
  pokemonmasters: 'pokemon.com',
  pokemonsleep: 'pokemon.com',
  pikachu: 'pokemon.com',
  pikmin: 'nintendo.com',
  pikminbloom: 'nianticlabs.com',
  animalcrossing: 'animal-crossing.com',
  splatoon: 'nintendo.com',
  splatoon3: 'nintendo.com',
  kirby: 'nintendo.com',
  metroid: 'nintendo.com',
  fireemblem: 'nintendo.com',
  fireemblemheroes: 'fire-emblem-heroes.com',
  dragonquest: 'square-enix.com',

  // ── Sony / PlayStation ──
  playstation: 'playstation.com',
  ps4: 'playstation.com',
  ps5: 'playstation.com',
  psn: 'playstation.com',
  psnow: 'playstation.com',
  psplus: 'playstation.com',
  spiderman: 'playstation.com',
  godofwar: 'playstation.com',
  gow: 'playstation.com',
  tlou: 'playstation.com',
  lastuofus: 'playstation.com',
  horizon: 'playstation.com',
  uncharted: 'playstation.com',
  bloodborne: 'playstation.com',
  ghosts: 'playstation.com',

  // ── Steam / PC Gaming ──
  steam: 'store.steampowered.com',
  steampowered: 'store.steampowered.com',
  gog: 'gog.com',
  itch: 'itch.io',
  itchio: 'itch.io',
  gamepass: 'xbox.com',
  microsoftgaming: 'xbox.com',
  xbox: 'xbox.com',
  xboxone: 'xbox.com',
  xboxseries: 'xbox.com',
  xgp: 'xbox.com',
  playnite: 'playnite.link',

  // ── EA / Origin / Battlefield ──
  ea: 'ea.com',
  electronicarts: 'ea.com',
  origin: 'ea.com',
  eaplay: 'ea.com',
  eaapp: 'ea.com',
  battlefield: 'ea.com',
  battlefield1: 'ea.com',
  battlefield4: 'ea.com',
  battlefield5: 'ea.com',
  bf2042: 'ea.com',
  battlefield2042: 'ea.com',
  fifa: 'ea.com',
  fifa22: 'ea.com',
  fifa23: 'ea.com',
  fc24: 'ea.com',
  eafc24: 'ea.com',
  eafc25: 'ea.com',
  fc25: 'ea.com',
  nfl: 'ea.com',
  madden: 'ea.com',
  nba: 'ea.com',
  thenhl: 'ea.com',
  thesims: 'ea.com',
  sims: 'ea.com',
  sims4: 'ea.com',
  needforspeed: 'ea.com',
  nfs: 'ea.com',
  masseffect: 'ea.com',
  dragonage: 'ea.com',
  swbattlefront: 'ea.com',
  starwars: 'ea.com',
  titanfall: 'ea.com',
  deadspace: 'ea.com',
  plantsvszombies: 'ea.com',
  pvz: 'ea.com',

  // ── Ubisoft Games ──
  ubisoft: 'ubisoft.com',
  ubisoftconnect: 'ubisoft.com',
  assassinscreed: 'ubisoft.com',
  ac: 'ubisoft.com',
  acorigins: 'ubisoft.com',
  acodyssey: 'ubisoft.com',
  acvalhalla: 'ubisoft.com',
  acmirage: 'ubisoft.com',
  acshadows: 'ubisoft.com',
  farcry: 'ubisoft.com',
  farcry5: 'ubisoft.com',
  farcry6: 'ubisoft.com',
  watchdogs: 'ubisoft.com',
  watchdogs2: 'ubisoft.com',
  watchdogslegion: 'ubisoft.com',
  rainbow6: 'ubisoft.com',
  rainbowsix: 'ubisoft.com',
  r6: 'ubisoft.com',
  r6siege: 'ubisoft.com',
  ghostrecon: 'ubisoft.com',
  thecrewmotorfest: 'ubisoft.com',
  thecrew: 'ubisoft.com',
  division: 'ubisoft.com',
  thedivision: 'ubisoft.com',
  justdance: 'ubisoft.com',
  immortalsfenyx: 'ubisoft.com',
  immortals: 'ubisoft.com',
  anno: 'ubisoft.com',
  skullandbones: 'ubisoft.com',

  // ── Activision / Blizzard ──
  activision: 'activision.com',
  blizzard: 'blizzard.com',
  battlenet: 'battle.net',
  overwatch: 'playoverwatch.com',
  overwatch2: 'playoverwatch.com',
  ow2: 'playoverwatch.com',
  worldofwarcraft: 'worldofwarcraft.com',
  wow: 'worldofwarcraft.com',
  wowclassic: 'worldofwarcraft.com',
  diablo3: 'diablo3.com',
  spyro: 'activision.com',
  crashbandicoot: 'activision.com',
  crash: 'activision.com',
  tony: 'activision.com',
  skylanders: 'activision.com',

  // ── Bandai Namco ──
  bandainamco: 'bandainamco.com',
  tekken: 'tekken.com',
  tekken7: 'tekken.com',
  tekken8: 'tekken.com',
  soulcalibur: 'soulcalibur.com',
  talesofarise: 'bandainamco.com',
  tales: 'bandainamco.com',
  darksouls: 'bandainamco.com',
  darksouls2: 'bandainamco.com',
  darksouls3: 'bandainamco.com',
  eldenring: 'eldenring.com',
  elden: 'eldenring.com',
  sekiro: 'bandainamco.com',
  armored: 'bandainamco.com',
  acvi: 'bandainamco.com',
  ace: 'bandainamco.com',
  dragonballz: 'bandainamco.com',
  dbz: 'bandainamco.com',
  dragonball: 'dragonball-legends.com',
  dragonballlegends: 'dragonball-legends.com',
  dblegends: 'dragonball-legends.com',
  onepiece: 'bandainamco.com',
  naruto: 'bandainamco.com',
  narutoshipuden: 'bandainamco.com',
  narutoultimate: 'bandainamco.com',
  nsuns: 'bandainamco.com',
  gundam: 'bandainamco.com',
  sao: 'bandainamco.com',
  swordartonline: 'bandainamco.com',

  // ── Capcom ──
  capcom: 'capcom.com',
  streetfighter: 'streetfighter.com',
  sf6: 'streetfighter.com',
  streetfighter6: 'streetfighter.com',
  residentevil: 'residentevil.net',
  re: 'residentevil.net',
  re2: 'residentevil.net',
  re4: 'residentevil.net',
  re7: 'residentevil.net',
  re8: 'residentevil.net',
  re4remake: 'residentevil.net',
  monsterhunter: 'monsterhunter.com',
  mhw: 'monsterhunter.com',
  mhrise: 'monsterhunter.com',
  mhwilds: 'monsterhunter.com',
  devilmaycry: 'capcom.com',
  dmc: 'capcom.com',
  megaman: 'capcom.com',
  megamanx: 'capcom.com',
  deathstranding: 'kojimaproductions.jp',

  // ── Square Enix ──
  squareenix: 'square-enix.com',
  finalfantasy: 'finalfantasyxiv.com',
  ff14: 'finalfantasyxiv.com',
  ffxiv: 'finalfantasyxiv.com',
  ff7: 'ff7remake.square-enix-games.com',
  ff7remake: 'ff7remake.square-enix-games.com',
  ff16: 'square-enix.com',
  ff15: 'square-enix.com',
  finalfantasy7: 'ff7remake.square-enix-games.com',
  crisis: 'square-enix.com',
  chrono: 'square-enix.com',
  tomb: 'square-enix.com',
  tombraider: 'tombraider.com',
  shadowofthetombraider: 'tombraider.com',
  riseofthetombraider: 'tombraider.com',
  eidos: 'square-enix.com',
  justcause: 'square-enix.com',
  avengers: 'square-enix.com',
  guardiansofgalaxy: 'square-enix.com',
  nierautomata: 'nier.square-enix-games.com',
  nier: 'nier.square-enix-games.com',
  octopath: 'square-enix.com',
  octopathtraversler: 'square-enix.com',
  bravely: 'square-enix.com',

  // ── Sega ──
  sega: 'sega.com',
  sonic: 'sonicthehedgehog.com',
  sonicthehedgehog: 'sonicthehedgehog.com',
  sonicfrontiers: 'sonicthehedgehog.com',
  yakuza: 'yakuza.sega.com',
  likeadragon: 'yakuza.sega.com',
  persona: 'atlus.com',
  persona5: 'atlus.com',
  smt: 'atlus.com',
  shinmegami: 'atlus.com',
  atlus: 'atlus.com',
  football: 'sega.com',
  totalwar: 'sega.com',

  // ── CD Projekt Red ──
  cdprojekt: 'cdprojektred.com',
  cdprojektred: 'cdprojektred.com',
  cyberpunk: 'cyberpunk.net',
  cyberpunk2077: 'cyberpunk.net',
  witcher: 'thewitcher.com',
  witcher3: 'thewitcher.com',
  thewitcher: 'thewitcher.com',
  thewitcher3: 'thewitcher.com',
  gwent: 'playgwent.com',

  // ── Bethesda ──
  bethesda: 'bethesda.net',
  elderscrolls: 'elderscrolls.com',
  skyrim: 'elderscrolls.com',
  tesv: 'elderscrolls.com',
  starfield: 'bethesda.net',
  fallout: 'fallout.com',
  fallout4: 'fallout.com',
  fallout76: 'fallout.com',
  falloutnew: 'bethesda.net',
  newvegas: 'bethesda.net',
  doom: 'bethesda.net',
  doom2016: 'bethesda.net',
  doometernal: 'bethesda.net',
  quake: 'bethesda.net',
  rage: 'bethesda.net',
  dishonored: 'bethesda.net',
  prey: 'bethesda.net',
  wolfenstein: 'bethesda.net',
  evil: 'bethesda.net',
  evilwithin: 'bethesda.net',
  deathloop: 'bethesda.net',

  // ── 2K Games ──
  2k: '2k.com',
  nba2k: '2k.com',
  nba2k24: '2k.com',
  nba2k25: '2k.com',
  bioshock: '2k.com',
  xcom: '2k.com',
  civilization: '2k.com',
  civ: '2k.com',
  civ6: '2k.com',
  borderlands: '2k.com',
  borderlands3: '2k.com',
  tinytina: '2k.com',
  mafia: '2k.com',
  mafia3: '2k.com',
  mafia4: '2k.com',
  bullshark: '2k.com',
  wrestlingwwe: '2k.com',
  wwe2k: '2k.com',

  // ── Minecraft / Mojang ──
  minecraft: 'minecraft.net',
  mojang: 'mojang.com',
  minecraftbedrock: 'minecraft.net',
  minecraftjava: 'minecraft.net',
  minecraftdungeons: 'minecraft.net',
  minecraftlegends: 'minecraft.net',

  // ── Roblox ──
  roblox: 'roblox.com',
  robux: 'roblox.com',
  adopt: 'roblox.com',
  bloxfruits: 'roblox.com',
  murdersmystery: 'roblox.com',

  // ── Riot Games ──
  riotgames: 'riotgames.com',
  riot: 'riotgames.com',
  tft: 'teamfighttactics.com',
  teamfighttactics: 'teamfighttactics.com',
  legendsofruneterra: 'legendsofruneterra.com',
  lollegends: 'legendsofruneterra.com',

  // ── Fortnite / Epic ──
  fortnitebr: 'fortnite.com',
  fortnitemobile: 'fortnite.com',
  fortnitepc: 'fortnite.com',
  epicgamesstore: 'epicgames.com',

  // ── Racing Games ──
  asphalt: 'gameloft.com',
  asphalt9: 'gameloft.com',
  asphalt8: 'gameloft.com',
  gameloft: 'gameloft.com',
  realracing: 'ea.com',
  realracing3: 'ea.com',
  nfsno: 'ea.com',
  nfsnolimits: 'ea.com',
  csr: 'naturalmotion.com',
  csrracing: 'naturalmotion.com',
  csrracing2: 'naturalmotion.com',
  forza: 'forza.net',
  forzahorizon: 'forza.net',
  forzamotorsport: 'forza.net',
  granturismo: 'gran-turismo.com',
  gt7: 'gran-turismo.com',
  f1: 'f1mobile.com',
  f12023: 'ea.com',
  moto: 'milestone.it',
  motogp: 'motogp.com',
  dirt: 'ea.com',
  wrc: 'wrcthegame.com',
  driveclub: 'playstation.com',
  project: 'projectcars.com',
  accetto: 'assettocorsa.net',
  assettocorsa: 'assettocorsa.net',
  wreckfest: 'wreckfest.com',
  crashdrive: 'byterockit.com',
  beamng: 'beamng.com',
  beam: 'beamng.com',
  turbo: 'turbo.com',
  turbodismount: 'realisticrockstar.com',

  // ── Sports Games ──
  efootball: 'konami.com',
  pes: 'konami.com',
  konami: 'konami.com',
  eafc: 'ea.com',
  topeleven: 'nordeus.com',
  top11: 'nordeus.com',
  dreamleague: 'firsttouchgames.com',
  dls: 'firsttouchgames.com',
  firsttouch: 'firsttouchgames.com',
  nbalivemobile: 'ea.com',
  nbalive: 'ea.com',
  basketballstars: 'miniclip.com',
  nfl: 'ea.com',
  soccerstars: 'miniclip.com',
  freekicksoccer: 'ea.com',
  ufc: 'ea.com',
  ufc4: 'ea.com',
  wwe: '2k.com',
  wrestlemania: '2k.com',
  archery: 'oc3d.com',
  golfdash: 'playdemic.com',
  minigolf: 'playdemic.com',
  badminton: 'ubisoft.com',
  tenniselite: 'tenniselite.com',
  tabletennis: 'yoozoo.com',

  // ── Puzzle / Casual ──
  candy: 'king.com',
  candycrush: 'king.com',
  candycrushsaga: 'king.com',
  candycrushsoda: 'king.com',
  candyfriends: 'king.com',
  king: 'king.com',
  farmhero: 'king.com',
  farmheroes: 'king.com',
  bubblewitch: 'king.com',
  bubblewitchsaga: 'king.com',
  petrescue: 'king.com',
  diamond: 'king.com',
  diamonds: 'king.com',
  papa: 'flipline.com',
  papas: 'flipline.com',
  2048: '2048.io',
  wordscapes: 'peoplefun.com',
  wordstacks: 'peoplefun.com',
  wordle: 'nytimes.com',
  wordlink: 'zenjoy.com',
  wordconnect: 'wordgames.com',
  crossword: 'nytimes.com',
  lingo: 'wordgames.com',
  trivia: 'triviacrack.com',
  triviacrack: 'triviacrack.com',
  triviaquest: 'etermax.com',
  etermax: 'etermax.com',
  quizlet: 'quizlet.com',
  lumosity: 'lumosity.com',
  elevate: 'elevateapp.com',
  peak: 'peak.net',
  brainwave: 'brainwave.com',
  sudoku: 'sudoku.com',
  chess: 'chess.com',
  chesspuzzle: 'chess.com',
  chesscom: 'chess.com',
  lichess: 'lichess.org',
  checkers: 'zone.msn.com',
  ludo: 'ludoking.com',
  ludoking: 'ludoking.com',
  snakes: 'snakesandladders.com',
  snakesladders: 'snakesandladders.com',
  carrom: 'carrompool.app',
  carrompool: 'carrompool.app',
  poolstars: 'miniclip.com',
  minipool: 'miniclip.com',
  8ballpool: 'miniclip.com',
  miniclip: 'miniclip.com',
  bowlingking: 'bowlingking.com',
  golf: 'golf.com',
  golfclash: 'golf.com',
  toon: 'toon.io',
  zuma: 'popcap.com',
  peggle: 'popcap.com',
  bejeweled: 'popcap.com',
  popcap: 'popcap.com',
  plantvszombies: 'ea.com',
  pvzheroes: 'ea.com',
  pvzgw: 'ea.com',
  anipopfightofanimals: 'com2us.com',
  anipop: 'com2us.com',

  // ── Simulation / City / Farm ──
  simcity: 'ea.com',
  simcitybuildit: 'ea.com',
  simcitybuild: 'ea.com',
  farmville: 'zynga.com',
  zynga: 'zynga.com',
  cityville: 'zynga.com',
  buildnow: 'zynga.com',
  words: 'zynga.com',
  wordswithfriends: 'zynga.com',
  chess2: 'zynga.com',
  cowboyville: 'zynga.com',
  hay: 'supercell.com',
  haydaysupercell: 'supercell.com',
  farmerstales: 'goodgamestudios.com',
  goodgame: 'goodgamestudios.com',
  faraway: 'fivebnmobile.com',
  stardew: 'stardewvalley.com',
  stardewvalley: 'stardewvalley.com',
  myrestaurant: 'yotta.com',
  cooking: 'bigfishgames.com',
  cookingmadness: 'bigfishgames.com',
  cookingdiary: 'nexters.com',
  nexters: 'nexters.com',
  restaurant: 'restaurantgames.net',
  foodstreet: 'savygames.com',
  cheflife: 'ubisoft.com',
  township: 'playrix.com',
  playrix: 'playrix.com',
  homescapes: 'playrix.com',
  gardenscapes: 'playrix.com',
  fishdom: 'playrix.com',
  wildscapes: 'playrix.com',
  merge: 'gram.games',
  mergegames: 'mergegames.com',
  mergemansion: 'metacore.com',
  metacore: 'metacore.com',
  toon: 'toon.io',

  // ── Tower Defense ──
  bloonstd: 'ninjakiwi.com',
  bloonstd6: 'ninjakiwi.com',
  ninjakiwi: 'ninjakiwi.com',
  btd: 'ninjakiwi.com',
  btd6: 'ninjakiwi.com',
  kingdomrush: 'ironhidegames.com',
  ironhide: 'ironhidegames.com',
  plantvszombiestd: 'ea.com',
  arcomage: 'ea.com',
  infinitode: 'inflo.studio',

  // ── Horror / Survival ──
  fnafsecuritybreach: 'scottgames.com',
  fnaf: 'scottgames.com',
  scottgames: 'scottgames.com',
  fivenight: 'scottgames.com',
  fivenitghtsatfreddys: 'scottgames.com',
  granny: 'dvlopersgames.com',
  granny2: 'dvlopersgames.com',
  grannychapter: 'dvlopersgames.com',
  dvlopers: 'dvlopersgames.com',
  horrorfield: 'hypemasters.com',
  evildead: 'saber.games',
  deadbydaylight: 'deadbydaylight.com',
  dbd: 'deadbydaylight.com',
  letmesolo: 'bandainamco.com',
  phasmo: 'kineticlabs.io',
  phasmophobia: 'kineticlabs.io',
  outlast: 'redbarrelsgames.com',

  // ── Sandbox / Open World Mobile ──
  minecraftpe: 'minecraft.net',
  terraria: 'terraria.org',
  sandbox: 'thesandboxgame.com',
  sandboxevo: 'thesandboxgame.com',
  lego: 'lego.com',
  legoworlds: 'lego.com',
  legoninjago: 'lego.com',
  creativedestruction: 'yoozoo.com',
  yoozoo: 'yoozoo.com',
  survivalcraft: 'survivalcraft.com',
  ldoe: 'lastdayonearth.io',
  lastdayonearth: 'lastdayonearth.io',
  daymare: 'invader.games',
  miniworld: 'miniworld.cc',
  planet: 'planetcraft.net',
  buildcraft: 'buildcraft.info',

  // ── Adventure / Story ──
  among: 'innersloth.com',
  amongus: 'innersloth.com',
  innersloth: 'innersloth.com',
  crewmate: 'innersloth.com',
  projectzero: 'koeitecmoamerica.com',
  lifeisstranger: 'squareenix.com',
  lifesstrange: 'lifeisstrange.com',
  lifesstrange2: 'lifeisstrange.com',
  telltale: 'telltale.com',
  thewalkingdead: 'skybound.com',
  wolfamong: 'telltale.com',
  batman: 'telltale.com',
  detroitbecomehuman: 'quanticdream.com',
  heavyrain: 'quanticdream.com',
  omikron: 'quantic.com',
  oxenfree: 'nightschoolstudio.com',
  firewatch: 'firewatchgame.com',
  disco: 'zaum.co',
  discoelysium: 'zaum.co',

  // ── MMORPG / Online RPG ──
  maplestory: 'maplestory.nexon.com',
  maple: 'maplestory.nexon.com',
  maplestorym: 'nexon.com',
  nexon: 'nexon.com',
  dungeonfighter: 'nexon.com',
  dnf: 'nexon.com',
  elsword: 'elsword.com',
  aion: 'aiononline.com',
  bns: 'bladeandsoul.com',
  bladeandsoul: 'bladeandsoul.com',
  archeage: 'archeage.com',
  lostarksark: 'lostark.com',
  lostark: 'lostark.com',
  guildwars: 'guildwars2.com',
  guildwars2: 'guildwars2.com',
  gw2: 'guildwars2.com',
  ff11: 'finalfantasyxiv.com',
  terraria: 'terraria.org',
  perpetuam: 'perpetuum-online.com',
  albion: 'albiononline.com',
  albiononline: 'albiononline.com',
  runescape: 'runescape.com',
  osrs: 'oldschool.runescape.com',
  oldschoolrs: 'oldschool.runescape.com',
  tibia: 'tibia.com',
  metin2: 'gameforge.com',
  conquer: 'conqueronline.com',
  knight: 'mgame.com',
  muonline: 'webzen.com',
  webzen: 'webzen.com',
  rappelz: 'gala.net',
  blackdesert: 'playblackdesert.com',
  bdo: 'playblackdesert.com',
  eso: 'elderscrollsonline.com',
  elderscrollsonline: 'elderscrollsonline.com',

  // ── Platformer / Indie ──
  hollow: 'hollowknight.com',
  hollowknight: 'hollowknight.com',
  deadcells: 'deadcells.com',
  hades: 'supergiantgames.com',
  hades2: 'supergiantgames.com',
  supergiant: 'supergiantgames.com',
  bastion: 'supergiantgames.com',
  transistor: 'supergiantgames.com',
  pyre: 'supergiantgames.com',
  cuphead: 'cupheadgame.com',
  shovel: 'yachtclubgames.com',
  shovelknight: 'yachtclubgames.com',
  celeste: 'celestegame.com',
  ori: 'orithegame.com',
  origame: 'orithegame.com',
  rayman: 'ubisoft.com',
  badland: 'frogmind.com',
  badland2: 'frogmind.com',
  subway: 'kiloo.com',
  subwaysurf: 'kiloo.com',
  subwaysurfers: 'kiloo.com',
  kiloo: 'kiloo.com',
  templerun: 'imangistudios.com',
  templerun2: 'imangistudios.com',
  imangi: 'imangistudios.com',
  jetpack: 'halfbrick.com',
  jetpackjoyride: 'halfbrick.com',
  halfbrick: 'halfbrick.com',
  fruitninja: 'halfbrick.com',
  angrybirds: 'rovio.com',
  rovio: 'rovio.com',
  angrybirdreloaded: 'rovio.com',
  angrybirdsgo: 'rovio.com',
  badpiggies: 'rovio.com',
  cutethirope: 'zeptolab.com',
  cuttherope: 'zeptolab.com',
  zeptolab: 'zeptolab.com',
  talkingtom: 'outfit7.com',
  talkingangelina: 'outfit7.com',
  outfit7: 'outfit7.com',
  talkingginger: 'outfit7.com',

  // ── Card / Board Games ──
  hearthstonecard: 'hearthstone.com',
  magic: 'magic.wizards.com',
  mtg: 'magic.wizards.com',
  magicthegathering: 'magic.wizards.com',
  mtgarena: 'magic.wizards.com',
  yugioh: 'konami.com',
  ygomaster: 'konami.com',
  yugiohmasterduel: 'konami.com',
  masterduel: 'konami.com',
  gwent: 'playgwent.com',
  shadowverse: 'shadowverse.com',
  runeterra: 'legendsofruneterra.com',
  ptcg: 'pokemon.com',
  pokemoncard: 'pokemon.com',
  pokemontcg: 'pokemon.com',
  gwentcard: 'playgwent.com',
  solitaire: 'microsoftsolitary.com',
  microsoft: 'microsoft.com',
  monopoly: 'monopoly.com',
  monopolygo: 'monopoly.com',
  clue: 'hasbro.com',
  hasbro: 'hasbro.com',
  scrabble: 'scrabble.com',
  uno: 'mattel.com',
  mattel: 'mattel.com',

  // ── Rhythm / Music Games ──
  beatstar: 'space-ape.com',
  spaceape: 'space-ape.com',
  arcaea: 'lowiro.com',
  lowiro: 'lowiro.com',
  cytus: 'rayark.com',
  cytus2: 'rayark.com',
  rayark: 'rayark.com',
  dynamix: 'c4cat.com',
  osulazer: 'osu.ppy.sh',
  osu: 'osu.ppy.sh',
  guitarherohero: 'guitarhero.com',
  rockband: 'harmonixmusic.com',
  audioshield: 'dysodesign.com',
  justdance: 'ubisoft.com',
  superstarsmtown: 'dalcomsoft.com',
  superstar: 'dalcomsoft.com',

  // ── Niantic AR ──
  niantic: 'nianticlabs.com',
  pokemongo: 'pokemongolive.com',
  ingress: 'ingress.com',
  pikminbloom: 'nianticlabs.com',
  harrypotterwizardsunite: 'nianticlabs.com',
  transformersreality: 'nianticlabs.com',
  nba: 'nianticlabs.com',

  // ── Game Distribution / Voice ──
  gog: 'gog.com',
  itch: 'itch.io',
  itchio: 'itch.io',
  gamepass: 'xbox.com',
  microsoftgaming: 'xbox.com',
  playnite: 'playnite.link',
  heroiclauncher: 'heroicgameslauncher.com',
  gamesplanet: 'gamesplanet.com',
  greenmangaming: 'greenmangaming.com',
  gmg: 'greenmangaming.com',
  humble: 'humblebundle.com',
  humblebundle: 'humblebundle.com',
  fanatical: 'fanatical.com',
  nuuvem: 'nuuvem.com',

  // ── Streaming / Video ──
  netflix: 'netflix.com',
  spotify: 'spotify.com',
  disney: 'disneyplus.com',
  hulu: 'hulu.com',
  amazon: 'amazon.com',
  prime: 'primevideo.com',
  primevideo: 'primevideo.com',
  twitch: 'twitch.tv',
  vimeo: 'vimeo.com',
  youtube: 'youtube.com',
  youtubemusic: 'music.youtube.com',
  appletv: 'tv.apple.com',
  hbomax: 'max.com',
  max: 'max.com',
  peacock: 'peacocktv.com',
  paramountplus: 'paramountplus.com',
  paramount: 'paramountplus.com',
  crunchyroll: 'crunchyroll.com',
  funimation: 'funimation.com',
  dazn: 'dazn.com',
  mxplayer: 'mxplayer.in',
  hotstar: 'hotstar.com',
  jiocinema: 'jiocinema.com',
  sonyliv: 'sonyliv.com',
  zee5: 'zee5.com',
  altbalaji: 'altbalaji.com',
  erosnow: 'erosnow.com',
  soundcloud: 'soundcloud.com',
  deezer: 'deezer.com',
  tidal: 'tidal.com',
  pandora: 'pandora.com',
  applemusic: 'apple.com',

  // ── Food Delivery / Restaurants ──
  swiggy: 'swiggy.com',
  zomato: 'zomato.com',
  ubereats: 'ubereats.com',
  doordash: 'doordash.com',
  grubhub: 'grubhub.com',
  instacart: 'instacart.com',
  postmates: 'postmates.com',
  deliveroo: 'deliveroo.com',
  justeat: 'just-eat.com',
  talabat: 'talabat.com',
  blinkit: 'blinkit.com',
  zepto: 'zeptonow.com',
  dunzo: 'dunzo.com',
  dominos: 'dominos.com',
  pizzahut: 'pizzahut.com',
  mcdonalds: 'mcdonalds.com',
  kfc: 'kfc.com',
  burgerking: 'burgerking.com',
  starbucks: 'starbucks.com',
  subway: 'subway.com',

  // ── E-Commerce / Shopping ──
  ebay: 'ebay.com',
  etsy: 'etsy.com',
  shopify: 'shopify.com',
  flipkart: 'flipkart.com',
  meesho: 'meesho.com',
  myntra: 'myntra.com',
  ajio: 'ajio.com',
  snapdeal: 'snapdeal.com',
  nykaa: 'nykaa.com',
  alibaba: 'alibaba.com',
  aliexpress: 'aliexpress.com',
  shein: 'shein.com',
  temu: 'temu.com',
  wish: 'wish.com',
  lazada: 'lazada.com',
  shopee: 'shopee.com',
  noon: 'noon.com',
  daraz: 'daraz.com',

  // ── Finance / Payments / Crypto ──
  paypal: 'paypal.com',
  stripe: 'stripe.com',
  coinbase: 'coinbase.com',
  binance: 'binance.com',
  robinhood: 'robinhood.com',
  chase: 'chase.com',
  wellsfargo: 'wellsfargo.com',
  revolut: 'revolut.com',
  wise: 'wise.com',
  transferwise: 'wise.com',
  venmo: 'venmo.com',
  cashapp: 'cash.app',
  zelle: 'zellepay.com',
  gpay: 'pay.google.com',
  googlepay: 'pay.google.com',
  phonepe: 'phonepe.com',
  paytm: 'paytm.com',
  razorpay: 'razorpay.com',
  upstox: 'upstox.com',
  zerodha: 'zerodha.com',
  kraken: 'kraken.com',
  kucoin: 'kucoin.com',
  bybit: 'bybit.com',
  okx: 'okx.com',
  metamask: 'metamask.io',
  phantom: 'phantom.app',
  ledger: 'ledger.com',
  hdfc: 'hdfcbank.com',
  icici: 'icicibank.com',
  sbi: 'sbi.co.in',
  axisbank: 'axisbank.com',
  kotak: 'kotak.com',

  // ── Dev / Code ──
  github: 'github.com', gitlab: 'gitlab.com', bitbucket: 'bitbucket.org',
  stackoverflow: 'stackoverflow.com', codepen: 'codepen.io',
  replit: 'replit.com', huggingface: 'huggingface.co',
  openai: 'openai.com', anthropic: 'anthropic.com',
  chatgpt: 'chat.openai.com',
  claude: 'claude.ai',
  gemini: 'gemini.google.com',
  copilot: 'copilot.microsoft.com',
  cursor: 'cursor.sh',
  vscode: 'code.visualstudio.com',
  jetbrains: 'jetbrains.com',
  postman: 'postman.com',
  jira: 'atlassian.com', confluence: 'atlassian.com', trello: 'trello.com',
  notion: 'notion.so',
  airtable: 'airtable.com', monday: 'monday.com',
  clickup: 'clickup.com', linear: 'linear.app',
  figma: 'figma.com', sketch: 'sketch.com',
  canva: 'canva.com',
  adobe: 'adobe.com',
  photoshop: 'adobe.com', illustrator: 'adobe.com',

  // ── Cloud / Infra ──
  aws: 'aws.amazon.com', azure: 'azure.microsoft.com',
  gcp: 'cloud.google.com', googlecloud: 'cloud.google.com',
  digitalocean: 'digitalocean.com', heroku: 'heroku.com',
  vercel: 'vercel.com', netlify: 'netlify.com',
  cloudflare: 'cloudflare.com', npm: 'npmjs.com',
  docker: 'docker.com', kubernetes: 'kubernetes.io',
  firebase: 'firebase.google.com',
  supabase: 'supabase.com',

  // ── Security / VPN ──
  protonmail: 'proton.me', proton: 'proton.me',
  lastpass: 'lastpass.com', bitwarden: 'bitwarden.com',
  dashlane: 'dashlane.com', nordpass: 'nordpass.com',
  nordvpn: 'nordvpn.com',
  expressvpn: 'expressvpn.com',
  surfshark: 'surfshark.com',

  // ── Travel / Transport / Maps ──
  airbnb: 'airbnb.com', uber: 'uber.com', lyft: 'lyft.com',
  booking: 'booking.com', expedia: 'expedia.com',
  ola: 'olacabs.com',
  rapido: 'rapido.bike',
  makemytrip: 'makemytrip.com',
  goibibo: 'goibibo.com',
  irctc: 'irctc.co.in',
  googlemaps: 'maps.google.com',
  waze: 'waze.com',

  // ── Health / Fitness ──
  strava: 'strava.com',
  fitbit: 'fitbit.com',
  myfitnesspal: 'myfitnesspal.com',
  headspace: 'headspace.com',
  calm: 'calm.com',
  noom: 'noom.com',
  healthifyme: 'healthifyme.com',
  practo: 'practo.com',

  // ── Education ──
  udemy: 'udemy.com',
  coursera: 'coursera.org',
  skillshare: 'skillshare.com',
  duolingo: 'duolingo.com',
  byjus: 'byjus.com',
  unacademy: 'unacademy.com',
  khan: 'khanacademy.org',
  khanacademy: 'khanacademy.org',
  leetcode: 'leetcode.com',
  hackerrank: 'hackerrank.com',

  // ── Productivity / Storage ──
  dropbox: 'dropbox.com',
  evernote: 'evernote.com',
  todoist: 'todoist.com',
  obsidian: 'obsidian.md',
  roamresearch: 'roamresearch.com',
  asana: 'asana.com',

  // ── Misc popular ──
  amazon: 'amazon.com',
  ebay: 'ebay.com',
  wikipedia: 'wikipedia.org',
  medium: 'medium.com',
  substack: 'substack.com',
  wordpress: 'wordpress.com',
  wix: 'wix.com',
  squarespace: 'squarespace.com',
};

/**
 * Resolve any service/game name → domain using 5 strategies:
 * 1. Exact map match (after full normalisation)
 * 2. Space-variant: "Free Fire" → "freefire", "GTA V" → "gtav"
 * 3. Contains scan — key is substring of input OR vice-versa (min 4 chars)
 * 4. Already a domain
 * 5. Universal fallback: use normalised name as guessed .com domain
 *    (Google Favicon API returns a generic icon gracefully for unknown domains)
 */
function resolveDomain(name) {
  if (!name || !name.trim()) return null;

  const raw     = name.trim().toLowerCase();
  // Full strip — removes spaces, hyphens, underscores, dots, numbers for broad matching
  const full    = raw.replace(/[^a-z0-9]/g, '');
  // Keep numbers but remove symbols — preserves "gta5", "cod4"
  const withNums = raw.replace(/[^a-z0-9]/g, '');

  if (!full) return null;

  // Strategy 1: exact match (full strip)
  if (SERVICE_DOMAIN_MAP[full])      return SERVICE_DOMAIN_MAP[full];
  if (SERVICE_DOMAIN_MAP[withNums])  return SERVICE_DOMAIN_MAP[withNums];

  // Strategy 2: try common abbreviation expansions
  const expansions = {
    ff:   'freefire', bg:  'battlegrounds', ml:   'mobilelegends',
    cr:   'clashroyale', coc: 'clashofclans', bs:  'brawlstars',
    cod:  'callofduty', bf:  'battlefield', ow:   'overwatch',
    lol:  'leagueoflegends', tft: 'teamfighttactics',
    eso:  'elderscrollsonline', rdr: 'reddeadredemption',
    mc:   'minecraft', rs: 'runescape', bdo: 'blackdesert',
    dbd:  'deadbydaylight', fn: 'fortnite',
  };
  if (expansions[full] && SERVICE_DOMAIN_MAP[expansions[full]])
    return SERVICE_DOMAIN_MAP[expansions[full]];

  // Strategy 3: contains match — input contains a known key (or vice-versa), min 4 chars
  // Sort by key length descending so longer/more specific keys match first
  const sorted = Object.entries(SERVICE_DOMAIN_MAP).sort((a, b) => b[0].length - a[0].length);
  for (const [k, d] of sorted) {
    if (k.length < 4) continue;
    if (full.includes(k) || k.includes(full)) return d;
  }

  // Strategy 4: already a domain
  if (/^[a-z0-9-]+\.[a-z]{2,}/.test(raw)) return raw;

  // Strategy 5: universal smart guess — normalised name as .com
  // Works for any game/app with a matching website (Google Favicon API handles gracefully)
  if (full.length >= 3) return `${full}.com`;

  return null;
}

/* Build the ordered list of URLs to try for a given domain */
function buildLogoUrls(domain) {
  if (!domain) return [];
  const enc = encodeURIComponent(domain);
  return [
    // 1. Google favicon HD — extremely reliable
    `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=64`,
    // 2. DuckDuckGo favicon service
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
    // 3. Clearbit
    `https://logo.clearbit.com/${domain}?size=64`,
    // 4. Favicon.io
    `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
  ];
}

const AVATAR_COLORS = ['#ffd750','#3ecf8e','#5b8dee','#e879a4','#a78bfa','#fb923c'];

/** Letter avatar fallback */
function LetterAvatar({ name }) {
  const colorIdx = (name.charCodeAt(0) || 0) % AVATAR_COLORS.length;
  const color    = AVATAR_COLORS[colorIdx];
  return (
    <div style={{
      width: 34, height: 34, borderRadius: 9, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: `${color}18`, border: `1px solid ${color}40`,
    }}>
      <span style={{ fontSize: 14, fontWeight: 800, color, fontFamily: 'var(--font-display)' }}>
        {(name[0] || '?').toUpperCase()}
      </span>
    </div>
  );
}

/**
 * ServiceLogo — waterfall through 4 logo APIs, then letter avatar.
 * Renders a shimmer placeholder while loading.
 */
export function ServiceLogo({ name = '?' }) {
  const domain = resolveDomain(name);
  const urls   = buildLogoUrls(domain);

  // urlIndex: -1 = loading, 0..n = trying urls[urlIndex], urls.length = all failed
  const [idx,    setIdx]    = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Reset when name changes
  useEffect(() => { setIdx(0); setLoaded(false); }, [name]);

  const allFailed = idx >= urls.length;

  if (!domain || allFailed) return <LetterAvatar name={name} />;

  return (
    <div style={{
      width: 34, height: 34, borderRadius: 9, flexShrink: 0,
      overflow: 'hidden', position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: loaded ? 'rgba(255,255,255,0.05)' : 'rgba(255,215,80,0.06)',
      border: `1px solid ${loaded ? 'rgba(255,255,255,0.1)' : 'rgba(255,215,80,0.15)'}`,
      transition: 'background 0.3s, border 0.3s',
    }}>
      {/* Shimmer while not yet loaded */}
      {!loaded && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,215,80,0.08) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
          animation: 'shimmerSlide 1.4s infinite',
        }} />
      )}

      <img
        key={`${name}-${idx}`}
        src={urls[idx]}
        alt={name}
        onLoad={() => setLoaded(true)}
        onError={() => { setLoaded(false); setIdx(i => i + 1); }}
        style={{
          width: 22, height: 22,
          objectFit: 'contain',
          borderRadius: 3,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.25s ease',
          imageRendering: 'auto',
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   REGISTRATION VAULT BACKGROUND
   Visual concept: Deep-space encryption grid
   • Dense hexagonal tessellation that slowly pulses
   • Radial "encryption rings" expanding from cursor-tracked center
   • Floating binary streams (vertical columns)
   • Corner bracket decorations
   ═══════════════════════════════════════════════════════════════════ */
export function VaultCyberBg() {
  const canvasRef = useRef(null);
  const mouseRef  = useRef({ x: 0.5, y: 0.5 }); // normalized 0-1

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId, w, h, frame = 0;

    const resize = () => {
      w = canvas.width  = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = e => {
      mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    };
    window.addEventListener('mousemove', onMove);

    /* ── Hex grid ── */
    const HEX_R = 28; // outer radius
    const HEX_W = HEX_R * Math.sqrt(3);
    const HEX_H = HEX_R * 2;

    function hexPath(cx, cy, r) {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
    }

    /* ── Binary column streams ── */
    const COL_W = 18;
    const colCount = Math.ceil(window.innerWidth / COL_W);
    const cols = Array.from({ length: colCount }, () => ({
      y:       Math.random() * -window.innerHeight,
      speed:   Math.random() * 0.8 + 0.3,
      len:     Math.floor(Math.random() * 8) + 3,
      active:  Math.random() < 0.18,
      dormant: Math.floor(Math.random() * 400),
      chars:   Array.from({ length: 12 }, () => Math.random() < 0.5 ? '1' : '0'),
      mutT:    0, mutRate: Math.floor(Math.random() * 12) + 6,
    }));

    /* ── Encryption rings from mouse ── */
    const rings = [];
    let ringTimer = 0;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      frame++;

      /* ── Hex grid ── */
      const mx = mouseRef.current.x * w;
      const my = mouseRef.current.y * h;

      let row = 0;
      for (let y = -HEX_H; y < h + HEX_H; y += HEX_H * 0.75) {
        const offset = (row % 2) * (HEX_W / 2);
        for (let x = -HEX_W; x < w + HEX_W; x += HEX_W) {
          const cx = x + offset;
          const cy = y;
          const dist = Math.sqrt((cx - mx) ** 2 + (cy - my) ** 2);
          const proximity = Math.max(0, 1 - dist / 300);
          const pulse = Math.sin(frame * 0.018 + dist * 0.012) * 0.5 + 0.5;
          const alpha  = 0.028 + proximity * 0.055 + pulse * 0.012;

          hexPath(cx, cy, HEX_R - 1);
          ctx.strokeStyle = `rgba(255,215,80,${alpha})`;
          ctx.lineWidth   = 0.6;
          ctx.stroke();

          // Occasional filled hex near mouse
          if (proximity > 0.6 && pulse > 0.85) {
            hexPath(cx, cy, HEX_R - 1);
            ctx.fillStyle = `rgba(255,215,80,${proximity * 0.04})`;
            ctx.fill();
          }
        }
        row++;
      }

      /* ── Mouse-tracked encryption rings ── */
      ringTimer++;
      if (ringTimer % 90 === 0) {
        rings.push({ x: mx, y: my, r: 0, maxR: 180, alpha: 0.35 });
      }
      for (let i = rings.length - 1; i >= 0; i--) {
        const rg = rings[i];
        rg.r    += 1.4;
        rg.alpha = 0.35 * (1 - rg.r / rg.maxR);
        // Draw double ring for encryption feel
        for (const dr of [0, 6]) {
          ctx.beginPath();
          ctx.arc(rg.x, rg.y, rg.r + dr, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255,215,80,${rg.alpha * (dr === 0 ? 1 : 0.4)})`;
          ctx.lineWidth   = dr === 0 ? 0.9 : 0.4;
          ctx.stroke();
        }
        if (rg.r >= rg.maxR) rings.splice(i, 1);
      }

      /* ── Binary streams ── */
      cols.forEach((c, ci) => {
        if (!c.active) {
          c.dormant--;
          if (c.dormant <= 0) { c.active = true; c.y = -c.len * COL_W; }
          return;
        }
        c.mutT++;
        if (c.mutT >= c.mutRate) {
          c.chars[Math.floor(Math.random() * c.chars.length)] = Math.random() < 0.5 ? '1' : '0';
          c.mutT = 0;
        }
        ctx.font = '10px "JetBrains Mono", monospace';
        for (let i = 0; i < c.len; i++) {
          const cy2  = c.y - i * COL_W;
          if (cy2 < -20 || cy2 > h + 20) continue;
          const frac = i / c.len;
          const a    = i === 0 ? 0.38 : (1 - frac) * 0.1 + 0.015;
          ctx.fillStyle = i === 0 ? `rgba(255,230,100,${a})` : `rgba(255,215,80,${a})`;
          ctx.fillText(c.chars[i % c.chars.length], ci * COL_W + 4, cy2);
        }
        c.y += c.speed;
        if (c.y > h + c.len * COL_W) {
          c.y = -c.len * COL_W;
          c.active  = Math.random() < 0.45;
          c.dormant = Math.floor(Math.random() * 350) + 80;
          c.speed   = Math.random() * 0.8 + 0.3;
        }
      });

      /* ── Corner bracket decorations ── */
      const bSize = 22, bGap = 16;
      const corners = [
        [bGap, bGap, 1, 1], [w-bGap, bGap, -1, 1],
        [bGap, h-bGap, 1, -1], [w-bGap, h-bGap, -1, -1],
      ];
      corners.forEach(([cx, cy, sx, sy]) => {
        ctx.strokeStyle = `rgba(255,215,80,${0.18 + Math.sin(frame*0.04)*0.06})`;
        ctx.lineWidth   = 1.2;
        ctx.beginPath();
        ctx.moveTo(cx + sx*bSize, cy); ctx.lineTo(cx, cy); ctx.lineTo(cx, cy + sy*bSize);
        ctx.stroke();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <>
      <style>{`@keyframes shimmerSlide{0%{background-position:-200% 0}100%{background-position:200% 0}}`}</style>
      <canvas ref={canvasRef} style={{
        position: 'fixed', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0,
      }} />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   VAULT PAGE BACKGROUND
   Visual concept: Live threat-map / SOC dashboard
   • Dot-matrix world-map silhouette (sparse)
   • Animated "threat arcs" connecting random geo points
   • Pulsing alert nodes in gold/red/cyan
   • Scrolling encrypted log lines at bottom
   • Diagonal scan sweep
   ═══════════════════════════════════════════════════════════════════ */
export function VaultPageCyberBg() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId, w, h, frame = 0;

    const resize = () => {
      w = canvas.width  = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    /* ── Alert nodes (geo-positioned feel) ── */
    const NODE_COUNT = 22;
    const alertNodes = Array.from({ length: NODE_COUNT }, () => ({
      x:     0.05 + Math.random() * 0.9,   // normalized
      y:     0.1  + Math.random() * 0.8,
      r:     Math.random() * 2.5 + 1.5,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.03 + 0.015,
      color: ['#ffd750','#ffd750','#3ecf8e','#5b8dee','rgba(248,113,113,1)'][Math.floor(Math.random()*5)],
      label: ['US','EU','APAC','RU','CN','IN','BR','AU'][Math.floor(Math.random()*8)],
    }));

    /* ── Threat arcs between nodes ── */
    const arcs = [];
    let arcTimer = 0;

    const spawnArc = () => {
      const a = Math.floor(Math.random() * NODE_COUNT);
      let b = Math.floor(Math.random() * NODE_COUNT);
      while (b === a) b = Math.floor(Math.random() * NODE_COUNT);
      arcs.push({
        a, b,
        t: 0,
        speed: Math.random() * 0.008 + 0.004,
        threat: Math.random() < 0.3,   // 30% = red threat arc
        trail: [],
      });
    };
    // seed initial arcs
    for (let i = 0; i < 4; i++) spawnArc();

    /* ── Scrolling log lines ── */
    const LOG_POOL = [
      'DECRYPT_ATTEMPT >> SHA-256 verified',
      'VAULT_ACCESS >> key_fragment[2] matched',
      'AUTH_TOKEN >> HMAC-SHA512 valid',
      'SHAMIR_SHARE >> threshold 2/3 achieved',
      'INTEGRITY_CHECK >> merkle root OK',
      'SESSION_KEYS >> AES-256-GCM active',
      'ANOMALY_SCAN >> no threats detected',
      'AUDIT_LOG >> entry signed & sealed',
    ];
    const logs = Array.from({ length: 6 }, (_, i) => ({
      text:  LOG_POOL[i % LOG_POOL.length],
      x:     Math.random() * 0.6,
      alpha: Math.random() * 0.07 + 0.03,
      speed: Math.random() * 0.12 + 0.06,
    }));
    let logOffset = 0;

    /* ── Diagonal scan sweep ── */
    let sweepX = -200;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      frame++;

      /* ── Dot matrix background grid ── */
      ctx.fillStyle = 'rgba(255,215,80,0.04)';
      const gs = 32;
      for (let x = gs; x < w; x += gs)
        for (let y = gs; y < h; y += gs) {
          ctx.beginPath(); ctx.arc(x, y, 0.65, 0, Math.PI*2); ctx.fill();
        }

      /* ── Diagonal sweep line ── */
      sweepX += 1.2;
      if (sweepX > w + 200) sweepX = -200;
      const swGrad = ctx.createLinearGradient(sweepX-80, 0, sweepX+80, 0);
      swGrad.addColorStop(0,   'rgba(255,215,80,0)');
      swGrad.addColorStop(0.5, 'rgba(255,215,80,0.04)');
      swGrad.addColorStop(1,   'rgba(255,215,80,0)');
      ctx.fillStyle = swGrad;
      ctx.fillRect(sweepX-80, 0, 160, h);
      ctx.strokeStyle = 'rgba(255,215,80,0.06)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(sweepX, 0); ctx.lineTo(sweepX, h); ctx.stroke();

      /* ── Threat arcs ── */
      arcTimer++;
      if (arcTimer % 140 === 0 && arcs.length < 10) spawnArc();

      for (let i = arcs.length - 1; i >= 0; i--) {
        const arc = arcs[i];
        const na  = alertNodes[arc.a], nb = alertNodes[arc.b];
        const ax  = na.x * w, ay = na.y * h;
        const bx  = nb.x * w, by = nb.y * h;

        // Bezier control point (arc upward)
        const cpx = (ax + bx) / 2;
        const cpy = Math.min(ay, by) - Math.abs(bx - ax) * 0.35;

        arc.t += arc.speed;
        const t = Math.min(arc.t, 1);

        // Record trail
        const px = (1-t)**2*ax + 2*(1-t)*t*cpx + t**2*bx;
        const py = (1-t)**2*ay + 2*(1-t)*t*cpy + t**2*by;
        arc.trail.push({ x: px, y: py });
        if (arc.trail.length > 32) arc.trail.shift();

        // Draw trail
        if (arc.trail.length > 1) {
          for (let j = 1; j < arc.trail.length; j++) {
            const frac  = j / arc.trail.length;
            const color = arc.threat ? `rgba(248,113,113,${frac*0.55})` : `rgba(255,215,80,${frac*0.35})`;
            ctx.strokeStyle = color;
            ctx.lineWidth   = arc.threat ? 1.2 : 0.8;
            ctx.beginPath();
            ctx.moveTo(arc.trail[j-1].x, arc.trail[j-1].y);
            ctx.lineTo(arc.trail[j].x, arc.trail[j].y);
            ctx.stroke();
          }
        }

        // Head dot
        ctx.beginPath(); ctx.arc(px, py, arc.threat ? 2.5 : 1.8, 0, Math.PI*2);
        ctx.fillStyle = arc.threat ? 'rgba(248,113,113,0.9)' : 'rgba(255,215,80,0.8)';
        ctx.fill();

        if (arc.t >= 1) arcs.splice(i, 1);
      }

      /* ── Alert nodes ── */
      alertNodes.forEach(n => {
        const nx = n.x * w, ny = n.y * h;
        n.phase += n.speed;
        const pulse = Math.sin(n.phase) * 0.5 + 0.5;

        // Outer pulse ring
        ctx.beginPath(); ctx.arc(nx, ny, n.r + 4 + pulse * 6, 0, Math.PI*2);
        ctx.strokeStyle = n.color.replace('1)', `${0.08 + pulse * 0.12})`).replace('#', 'rgba(').replace('rgba(ffd750)', 'rgba(255,215,80,').replace('rgba(3ecf8e)', 'rgba(62,207,142,').replace('rgba(5b8dee)', 'rgba(91,141,238,');
        // simplified — just use string directly
        const ringAlpha = 0.08 + pulse * 0.12;
        ctx.strokeStyle = n.color === '#ffd750'
          ? `rgba(255,215,80,${ringAlpha})`
          : n.color === '#3ecf8e'
            ? `rgba(62,207,142,${ringAlpha})`
            : n.color === '#5b8dee'
              ? `rgba(91,141,238,${ringAlpha})`
              : `rgba(248,113,113,${ringAlpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Core dot
        ctx.beginPath(); ctx.arc(nx, ny, n.r, 0, Math.PI*2);
        ctx.fillStyle = n.color === '#ffd750' ? 'rgba(255,215,80,0.7)'
          : n.color === '#3ecf8e' ? 'rgba(62,207,142,0.7)'
          : n.color === '#5b8dee' ? 'rgba(91,141,238,0.7)'
          : 'rgba(248,113,113,0.7)';
        ctx.fill();

        // Region label
        ctx.font = '8px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(255,215,80,0.25)';
        ctx.fillText(n.label, nx + n.r + 3, ny + 3);
      });

      /* ── Scrolling log lines at bottom ── */
      logOffset += 0.07;
      ctx.font = '9px "JetBrains Mono", monospace';
      logs.forEach((log, i) => {
        const y = h - 14 - i * 16 + (logOffset % 16);
        if (y < h - 120 || y > h) return;
        const a = Math.min(log.alpha, ((h - y) / 80) * log.alpha);
        ctx.fillStyle = `rgba(90,210,190,${a})`;
        ctx.fillText('> ' + log.text, log.x * w * 0.6, y);
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position: 'fixed', inset: 0,
      width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 0,
    }} />
  );
}
