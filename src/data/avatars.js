export const AVATAR_CATEGORIES = [
  {
    id:'business', label:'Business Person', emoji:'💼',
    desc:'Trader, entrepreneur, merchant',
    color:'#FFE566', bgColor:'rgba(255,229,102,0.12)',
    subcategories:[
      {id:'trader',     label:'Market Trader',    emoji:'🛒',desc:'Open market, Oshodi/Onitsha',    identifier:'Tray & goods',    scene:'market'},
      {id:'retailer',   label:'Shop Owner',       emoji:'🏪',desc:'Retail shop, supermarket',       identifier:'Apron & till',    scene:'shop'},
      {id:'importer',   label:'Importer/Exporter',emoji:'🚢',desc:'Goods import/export business',   identifier:'Clipboard',       scene:'port'},
      {id:'restaurant', label:'Restaurant Owner', emoji:'🍲',desc:'Eatery, fast food, catering',    identifier:'Chef hat',        scene:'kitchen'},
    ],
  },
  {
    id:'artisan', label:'Artisan / Craftsperson', emoji:'🔨',
    desc:'Skilled trade, craft, manual work',
    color:'#FF6B35', bgColor:'rgba(255,107,53,0.12)',
    subcategories:[
      {id:'mason',       label:'Mason / Builder',    emoji:'🧱',desc:'Bricklaying, plastering',       identifier:'Yellow helmet',     scene:'construction'},
      {id:'carpenter',   label:'Carpenter',          emoji:'🪚',desc:'Woodwork, furniture making',    identifier:'Tool belt',         scene:'workshop'},
      {id:'tailor',      label:'Tailor / Seamstress',emoji:'🧵',desc:'Clothing, fashion design',      identifier:'Tape measure',      scene:'atelier'},
      {id:'mechanic',    label:'Auto Mechanic',      emoji:'🔧',desc:'Vehicle repairs, vulcanizer',   identifier:'Spanner & overalls',scene:'garage'},
      {id:'welder',      label:'Welder / Fabricator',emoji:'⚙️', desc:'Metal works, fabrication',      identifier:'Welding mask',      scene:'factory'},
      {id:'electrician', label:'Electrician',        emoji:'⚡',desc:'Wiring, electrical works',      identifier:'Hard hat & wire',   scene:'site'},
    ],
  },
  {
    id:'tech', label:'Tech Worker', emoji:'💻',
    desc:'Developer, designer, digital professional',
    color:'#4ECDC4', bgColor:'rgba(78,205,196,0.12)',
    subcategories:[
      {id:'developer',emoji:'👨‍💻',label:'Software Developer',desc:'Apps, web, backend systems',   identifier:'Laptop & code',  scene:'techhub'},
      {id:'designer', emoji:'🎨',label:'UI/UX Designer',      desc:'Product design, graphics',     identifier:'Tablet & stylus',scene:'studio'},
      {id:'fintech',  emoji:'📱',label:'Fintech Founder',     desc:'Payment apps, digital finance',identifier:'Phone & chart',  scene:'fintech'},
      {id:'data',     emoji:'📊',label:'Data Analyst',        desc:'Data, AI, business intel',     identifier:'Dashboard',      scene:'techhub'},
    ],
  },
  {
    id:'professional', label:'Professional / 9-5', emoji:'🏢',
    desc:'Employed professional, civil servant',
    color:'#A78BFA', bgColor:'rgba(167,139,250,0.12)',
    subcategories:[
      {id:'accountant',emoji:'🧮',label:'Accountant',  desc:'Finance, audit, tax',             identifier:'Calculator & ledger',scene:'office'},
      {id:'lawyer',    emoji:'⚖️', label:'Lawyer',      desc:'Legal, compliance, contracts',    identifier:'Wig & gown',         scene:'court'},
      {id:'civil',     emoji:'🏛️', label:'Civil Servant',desc:'Government, MDAs, public sector',identifier:'Name badge',         scene:'ministry'},
      {id:'banker',    emoji:'🏦',label:'Banker',      desc:'Financial services, banking',     identifier:'Tie & briefcase',    scene:'bank'},
    ],
  },
  {
    id:'creative', label:'Creative / Media', emoji:'🎬',
    desc:'Artist, content creator, entertainer',
    color:'#95D44A', bgColor:'rgba(149,212,74,0.12)',
    subcategories:[
      {id:'content',   emoji:'📸',label:'Content Creator',desc:'YouTube, TikTok, Instagram',  identifier:'Camera & ring light',scene:'studio'},
      {id:'musician',  emoji:'🎵',label:'Musician / Artist',desc:'Music, performance, events',identifier:'Microphone',         scene:'stage'},
      {id:'journalist',emoji:'📰',label:'Journalist',      desc:'Print, online, broadcast',   identifier:'Press badge & mic', scene:'newsroom'},
    ],
  },
];

export const LEVELS = [
  {level:1, title:'Novice',             dress:'Singlet & shorts',         emoji:'🌱',obstacle:'valley',  obstacleLabel:'Register Business Name (CAC)',    desc:'Cross the valley by registering with CAC'},
  {level:2, title:'Discovery',          dress:'Polo shirt & shorts',       emoji:'🔍',obstacle:'hill',    obstacleLabel:'Climb the Compliance Hill (TIN)',  desc:'Climb the hill — file your TIN with FIRS'},
  {level:3, title:'Enthusiast',         dress:'Chinos & tucked shirt',     emoji:'📚',obstacle:'descent', obstacleLabel:'Descend the Tax Valley (VAT)',      desc:'Navigate down — understand VAT obligations'},
  {level:4, title:'Junior Professional',dress:'Shirt & tie',               emoji:'👔',obstacle:'spear',   obstacleLabel:'Hit the Target (PAYE)',             desc:'Throw a spear — nail your PAYE remittance'},
  {level:5, title:'Practitioner',       dress:'Full trousers & tie',       emoji:'💪',obstacle:'river',   obstacleLabel:'Cross the Revenue River (Pension)', desc:'Cross the river — pension & NSITF registration'},
  {level:6, title:'Compliant Citizen',  dress:'Blazer & tie',              emoji:'✅',obstacle:'predator',obstacleLabel:'Outrun the Task Force! (Audit)',    desc:'Sprint! — File before the FIRS audit team arrives'},
  {level:7, title:'Regulatory Aware',   dress:'Full suit (no jacket)',      emoji:'🧠',obstacle:'ladder',  obstacleLabel:'Build the Compliance Ladder (NDPA)',desc:'Build a ladder — master data protection'},
  {level:8, title:'Business Pro',       dress:'Full suit & pocket square', emoji:'🏆',obstacle:'swing',   obstacleLabel:'Swing Over the Volcano (Licences)',desc:'Swing the rope — navigate sector licensing'},
  {level:9, title:'Compliance Officer', dress:'Suit & laptop bag',         emoji:'🔐',obstacle:'valley',  obstacleLabel:'Deep Valley — Tax Clearance (TCC)',desc:'Cross this deep gorge — obtain your TCC'},
  {level:10,title:'RegTech Specialist', dress:'Suit, laptop bag & shades', emoji:'💡',obstacle:'hill',    obstacleLabel:'Steep Hill — Audit Mastery',       desc:'Summit the hill — survive a FIRS/CAC audit'},
  {level:11,title:'Compliance Leader',  dress:'Premium suit & briefcase',  emoji:'🌟',obstacle:'spear',   obstacleLabel:'Precision Shot — SEC & CBN',       desc:'Precision spear — navigate SEC/CBN regulation'},
  {level:12,title:'RegTech Champion',   dress:'Suit, briefcase & medal',   emoji:'🏅',obstacle:'swing',   obstacleLabel:'Final Swing — Export Mastery',     desc:'Massive swing — export and cross-border compliance'},
  {level:13,title:'Compliance Legend',  dress:'Full chairman outfit',      emoji:'👑',obstacle:'predator',obstacleLabel:'Outrun Everything — LEGEND!',      desc:'Legendary run — you know everything'},
];

export const AVATAR_DRESS = {
  1: {top:'#888',   bottom:'#666',   shoes:'#333',   suit:null},
  2: {top:'#3498DB',bottom:'#666',   shoes:'#4a3728',suit:null},
  3: {top:'#2980B9',bottom:'#2C3E50',shoes:'#4a3728',suit:null},
  4: {top:'#FFFFFF',bottom:'#2C3E50',shoes:'#1a1a1a',suit:null,      accessory:'tie'},
  5: {top:'#FFFFFF',bottom:'#1a1a2e',shoes:'#1a1a1a',suit:null,      accessory:'tie'},
  6: {top:'#FFFFFF',bottom:'#1a1a2e',shoes:'#1a1a1a',suit:'#2d3561', accessory:'tie'},
  7: {top:'#FFFFFF',bottom:'#0d0d0d',shoes:'#1a1a1a',suit:'#1C2951', accessory:'tie'},
  8: {top:'#FFFFFF',bottom:'#0d0d0d',shoes:'#1a1a1a',suit:'#0d1b2a', accessory:'pocket'},
  9: {top:'#FFFFFF',bottom:'#0d0d0d',shoes:'#1a1a1a',suit:'#1a1a2e', accessory:'bag'},
  10:{top:'#FFFFFF',bottom:'#0d0d0d',shoes:'#1a1a1a',suit:'#0a0a14', accessory:'bagshades'},
  11:{top:'#FFFFFF',bottom:'#0d0d0d',shoes:'#1a1a1a',suit:'#000814', accessory:'briefcase'},
  12:{top:'#FFFFFF',bottom:'#0d0d0d',shoes:'#1a1a1a',suit:'#000814', accessory:'medal'},
  13:{top:'#FFE566',bottom:'#000814',shoes:'#FFD700',suit:'#000814', accessory:'crown'},
};
