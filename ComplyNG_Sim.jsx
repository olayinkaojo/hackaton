import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   GAME DATA & CONSTANTS
═══════════════════════════════════════════════════════════════ */

const BUSINESS_TYPES = [
  { id:"food",    name:"Mama's Kitchen",       emoji:"🍲", sector:"Food & Bev",   startCash:80000,  desc:"Small restaurant in Yaba", difficulty:"Easy" },
  { id:"fashion", name:"Lagos Threads",        emoji:"👗", sector:"Fashion",      startCash:60000,  desc:"Clothing boutique in Surulere", difficulty:"Easy" },
  { id:"tech",    name:"NaijaTech Solutions",  emoji:"💻", sector:"Technology",   startCash:120000, desc:"Software agency in Yaba Tech Hub", difficulty:"Medium" },
  { id:"agro",    name:"Green Fields Agro",    emoji:"🌾", sector:"Agriculture",  startCash:90000,  desc:"Food processing & export, Kano", difficulty:"Medium" },
  { id:"health",  name:"LifeCare Pharmacy",    emoji:"💊", sector:"Healthcare",   startCash:150000, desc:"Pharmacy & wellness, Abuja", difficulty:"Hard" },
  { id:"fintech", name:"PaySwift Fintech",     emoji:"📱", sector:"Fintech",      startCash:200000, desc:"Mobile payments startup, Lagos Island", difficulty:"Hard" },
];

const AVATARS = [
  { id:"amaka",  name:"Amaka O.",  emoji:"👩🏾‍💼", color:"#FF6B35", city:"Lagos",   trait:"Sharp negotiator" },
  { id:"emeka",  name:"Emeka N.",  emoji:"👨🏿‍💻", color:"#4ECDC4", city:"Abuja",   trait:"Tech-savvy founder" },
  { id:"fatima", name:"Fatima B.", emoji:"👩🏽‍🌾", color:"#95D44A", city:"Kano",    trait:"Agro export expert" },
  { id:"segun",  name:"Segun A.",  emoji:"👨🏾‍⚕️", color:"#A78BFA", city:"PH",      trait:"Healthcare veteran" },
];

// Compliance categories — each has a 0-100 health bar
const COMPLIANCE_CATS = [
  { id:"registration", label:"Registration",  icon:"📜", color:"#4ECDC4" },
  { id:"tax",          label:"Tax",           icon:"💰", color:"#FFE566" },
  { id:"employment",   label:"Employment",    icon:"👥", color:"#95D44A" },
  { id:"data",         label:"Data & Privacy",icon:"🔐", color:"#A78BFA" },
  { id:"licences",     label:"Licences",      icon:"✅", color:"#FF6B35" },
];

// Every decision card
const ALL_EVENTS = [
  /* ─── REGISTRATION ─── */
  {
    id:"cac_reg", week:1, category:"registration", priority:"critical",
    title:"Register Your Business",
    scene:"🏛️ You're standing outside the CAC office in Lagos. Your business needs to be formally registered before you open.",
    decision:"Do you register your business with the Corporate Affairs Commission (CAC)?",
    choices:[
      { text:"✅ Register now as a Business Name (₦10,000)", cost:10000, compliance:{registration:+30}, xp:80, outcome:"Smart! CAC registration protects your business name, opens a corporate bank account, and is the legal foundation of your business under CAMA 2020.", law:"CAMA 2020 §795" },
      { text:"⏳ Wait — too expensive right now", cost:0, compliance:{registration:-20}, xp:0, outcome:"Dangerous delay. Operating without CAC registration is illegal under CAMA 2020. You're also locked out of contracts and bank loans.", law:"CAMA 2020 §795", warning:true },
      { text:"❌ Skip it — I'll operate informally", cost:0, compliance:{registration:-40}, xp:0, outcome:"Big mistake. Without CAC registration you cannot open a corporate bank account, bid for contracts, or protect your business name. You risk a ₦50,000+ fine if caught.", law:"CAMA 2020 §795", penalty:50000, isWrong:true },
    ]
  },
  {
    id:"tin_reg", week:2, category:"tax", priority:"critical",
    title:"Get Your Tax ID (TIN)",
    scene:"💼 Your bank is asking for a Tax Identification Number before opening a business account.",
    decision:"Will you obtain a TIN from FIRS?",
    choices:[
      { text:"✅ Register for free TIN at tin.jtb.gov.ng", cost:0, compliance:{tax:+25, registration:+10}, xp:80, outcome:"Excellent! Your TIN is free and essential. Every business transaction, bank account, contract, and import/export license requires it. It also starts your tax filing history with FIRS.", law:"FIRS Act §10" },
      { text:"⏳ Use my personal BVN for now", cost:0, compliance:{tax:-15}, xp:0, outcome:"This won't work for a business account. Personal BVN and business TIN serve different legal purposes. You'll be blocked from corporate banking.", law:"FIRS Act §10", warning:true },
    ]
  },
  {
    id:"lga_permit", week:3, category:"licences", priority:"medium",
    title:"Local Government Permit",
    scene:"🏛️ An LGA officer knocks on your shop door asking for your business premises permit.",
    decision:"Do you pay the annual LGA business premises levy?",
    choices:[
      { text:"✅ Pay the annual levy (₦25,000)", cost:25000, compliance:{licences:+20}, xp:60, outcome:"Good call. State and local governments impose business premises levies under State Revenue Laws. The LIRS handles this in Lagos. Staying current avoids enforcement raids.", law:"Lagos State Revenue Law 2010" },
      { text:"💬 Negotiate and pay reduced amount (₦10,000)", cost:10000, compliance:{licences:+5}, xp:20, outcome:"Partial compliance. You've bought time but this isn't a settled account. Expect a follow-up visit and possible back-payment demands.", law:"Lagos State Revenue Law 2010", warning:true },
      { text:"🚪 Refuse — it's extortion", cost:0, compliance:{licences:-30}, xp:0, outcome:"Risky. While corruption exists, outright refusal to any levy puts you on record as non-compliant. LGA task forces can seal your premises. The cost of re-opening far exceeds the levy.", law:"Lagos State Revenue Law 2010", penalty:40000, isWrong:true },
    ]
  },

  /* ─── TAX ─── */
  {
    id:"vat_setup", week:4, category:"tax", priority:"high",
    title:"VAT Registration",
    scene:"📊 Your accountant calls: your monthly revenue has crossed ₦25 million. You're now legally required to register for VAT.",
    decision:"How do you handle VAT registration?",
    choices:[
      { text:"✅ Register immediately with FIRS for VAT", cost:0, compliance:{tax:+30}, xp:100, revenue:0, outcome:"Perfect. Once turnover exceeds ₦25M/year you must register for VAT, charge 7.5% to customers, and remit monthly by the 21st. Use FIRS TaxPro-Max portal. Voluntary registration is also possible below the threshold.", law:"VAT Act §8 (as amended by Finance Act 2020)" },
      { text:"⏳ Register next quarter", cost:0, compliance:{tax:-20}, xp:0, outcome:"Every month you delay, you're accumulating unremitted VAT liability. FIRS can demand back-payment plus ₦50,000/month penalty and 150% of tax due for the entire period.", law:"VAT Act §15", warning:true },
      { text:"❌ I'll just not charge VAT — customers prefer it", cost:0, compliance:{tax:-50}, xp:0, outcome:"Illegal. Failure to register and charge VAT when required is a criminal offence. FIRS can prosecute your company AND directors personally. Fine: ₦50,000/month + 150% of all VAT due.", law:"VAT Act §15", penalty:150000, isWrong:true },
    ]
  },
  {
    id:"monthly_vat", week:5, category:"tax", priority:"high",
    title:"Monthly VAT Return Due",
    scene:"📅 It's the 21st of the month. Your VAT return is due today for last month's sales of ₦3.2M.",
    decision:"VAT collected was ₦240,000. What do you do?",
    choices:[
      { text:"✅ File and remit ₦240,000 to FIRS today", cost:240000, compliance:{tax:+15}, xp:70, outcome:"Excellent compliance! VAT remittance by the 21st each month keeps your FIRS record clean, protects your Tax Clearance Certificate eligibility, and avoids the ₦50,000 monthly late filing penalty.", law:"VAT Act §15 — 21st filing deadline" },
      { text:"⏳ File the return but delay payment 2 weeks", cost:240000, compliance:{tax:-10}, xp:20, outcome:"Filing without payment triggers interest charges at the prevailing CBN minimum rediscount rate. You've filed, which is good — but the payment delay creates a liability that compounds.", law:"VAT Act §15", warning:true },
      { text:"❌ Skip this month — too busy", cost:0, compliance:{tax:-35}, xp:0, outcome:"₦50,000 penalty this month. If this becomes a pattern, FIRS can issue a Substitution Notice — forcing your bank to deduct tax directly from your account without warning.", law:"VAT Act §15 — Non-remittance penalty", penalty:50000, isWrong:true },
    ]
  },
  {
    id:"cit_filing", week:8, category:"tax", priority:"critical",
    title:"Annual Company Tax Return",
    scene:"📋 Your accountant reminds you: CIT returns are due 6 months after your financial year-end. The deadline is in 2 weeks.",
    decision:"Your company turnover is ₦45M. What's your CIT situation?",
    choices:[
      { text:"✅ File returns and pay 20% CIT (medium company rate)", cost:0, compliance:{tax:+25}, xp:120, outcome:"Excellent! At ₦45M turnover, you're a 'medium company' under Finance Act 2021 — 20% CIT rate (not 30%). Filing on time keeps your Tax Clearance Certificate active, which is required for ALL government contracts.", law:"CITA §39 + Finance Act 2021 — medium company rate" },
      { text:"⏳ File for 3-month extension", cost:5000, compliance:{tax:-5}, xp:40, outcome:"FIRS allows extensions but you must apply formally before the deadline. A ₦5,000 application fee applies. Penalty clock stops but interest on any tax due continues.", law:"CITA §55 — extension provisions", warning:true },
      { text:"❌ Wait until FIRS contacts me", cost:0, compliance:{tax:-45}, xp:0, outcome:"FIRS will issue a Best-of-Judgement (BOJ) assessment — they estimate your tax and bill you that amount plus 10% penalty plus ₦25,000/month. BOJ assessments are almost always higher than actual liability.", law:"CITA §53 — BOJ assessment", penalty:80000, isWrong:true },
    ]
  },
  {
    id:"small_company", week:6, category:"tax", priority:"medium",
    title:"Small Company Tax Exemption",
    scene:"📊 Your new accountant discovers your annual turnover is ₦18M — below the ₦25M threshold.",
    decision:"Did you know small companies are exempt from CIT?",
    choices:[
      { text:"✅ Apply for small company exemption with FIRS", cost:0, compliance:{tax:+20}, xp:80, revenue:0, outcome:"Smart! Under Finance Act 2021, companies with turnover below ₦25M pay 0% Companies Income Tax. You still need to file annual returns — just with zero tax payable. This frees up cash for growth.", law:"Finance Act 2021 — CIT small company exemption" },
      { text:"❓ Continue paying 30% CIT out of ignorance", cost:0, compliance:{tax:-5}, xp:0, outcome:"You're overpaying tax! The Finance Act 2021 created three tiers: small (<₦25M) = 0%, medium (₦25M–₦100M) = 20%, large (>₦100M) = 30%. Get a proper tax advisor.", law:"Finance Act 2021 — tiered CIT", warning:true },
    ]
  },

  /* ─── EMPLOYMENT ─── */
  {
    id:"hire_staff", week:3, category:"employment", priority:"high",
    title:"You're Hiring — 4 Employees!",
    scene:"🎉 Business is growing! You've decided to hire 4 full-time staff. Congratulations! But with staff come legal obligations.",
    decision:"What employment obligations do you fulfil first?",
    choices:[
      { text:"✅ Register for PAYE, PENCOM and NSITF simultaneously", cost:8000, compliance:{employment:+40}, xp:120, outcome:"Perfect compliance stack! PAYE (deduct from salaries → remit to State IRS), PENCOM (8% employee + 10% employer pension), NSITF (1% monthly payroll for employee compensation). All three are mandatory the moment you have staff.", law:"PITA §81 + PRA 2014 §11 + ECA 2010" },
      { text:"⏳ Just pay salaries for now, sort compliance later", cost:0, compliance:{employment:-30}, xp:0, outcome:"Every month you delay PAYE remittance, 10% penalty accumulates. Every month without PENCOM, a 2% monthly surcharge is building. These debts compound silently until enforcement.", law:"PITA §81 — PAYE penalty", warning:true },
      { text:"❌ Pay everyone as contractors to avoid obligations", cost:0, compliance:{employment:-35}, xp:0, outcome:"Misclassifying employees as contractors is a serious offence. LIRS and PENCOM have clear tests for employment relationships. If caught, you owe all back-taxes, pension, and NSITF contributions plus penalties — potentially years of arrears.", law:"PITA — employment vs contractor test", penalty:60000, isWrong:true },
    ]
  },
  {
    id:"paye_monthly", week:5, category:"employment", priority:"high",
    title:"Monthly PAYE Remittance Due",
    scene:"📅 Payday is here. Your 4 staff earned ₦650,000 combined this month. PAYE must be deducted and remitted.",
    decision:"What is the deadline and where does PAYE go?",
    choices:[
      { text:"✅ Deduct PAYE and remit to LIRS by the 10th of next month", cost:0, compliance:{employment:+15}, xp:70, outcome:"Correct! PAYE is deducted from employee salaries (not a business cost) and remitted to the State IRS — LIRS in Lagos, ABIRS in Abuja, RIRS in Rivers — by the 10th of the following month. Keep remittance receipts for 6 years.", law:"PITA §81 — 10th-of-month deadline, State IRS jurisdiction" },
      { text:"❌ Remit to FIRS instead of LIRS", cost:0, compliance:{employment:-25}, xp:0, outcome:"Wrong body! PAYE goes to State Internal Revenue Service, not FIRS. FIRS collects CIT and VAT. LIRS collects PAYE in Lagos. Paying the wrong body doesn't discharge your obligation — you'll still owe LIRS.", law:"PITA §87 — State IRS jurisdiction for PAYE", isWrong:true },
    ]
  },
  {
    id:"pension_enroll", week:4, category:"employment", priority:"high",
    title:"Pension Enrollment",
    scene:"🏦 Your HR manager asks which Pension Fund Administrator (PFA) to register with under PENCOM.",
    decision:"How do you handle pension for your staff?",
    choices:[
      { text:"✅ Register with a licensed PFA — employee picks their PFA", cost:0, compliance:{employment:+25}, xp:80, outcome:"Correct process. Each employee has the right to choose their own licensed PFA. Employer contributes 10%, employee contributes 8% of monthly emoluments. Contributions are remitted monthly. This is mandatory for companies with 3+ employees.", law:"PRA 2014 §11 — mandatory contribution rates" },
      { text:"💰 Set up an internal 'company savings' instead", cost:0, compliance:{employment:-40}, xp:0, outcome:"Illegal. Internal savings schemes do not satisfy the Pension Reform Act 2014. Only PENCOM-licensed PFAs qualify. Penalty: 2% of the total pension contributions due per month, recoverable as a debt.", law:"PRA 2014 §11 + §26 — PENCOM enforcement", penalty:30000, isWrong:true },
    ]
  },
  {
    id:"itf_levy", week:7, category:"employment", priority:"medium",
    title:"Industrial Training Fund Levy",
    scene:"📬 You receive a letter from the Industrial Training Fund (ITF) requesting your annual 1% payroll levy.",
    decision:"Your annual payroll is ₦7.8M. How do you respond?",
    choices:[
      { text:"✅ Pay 1% of annual payroll (₦78,000) to ITF", cost:78000, compliance:{employment:+15}, xp:60, outcome:"Correct. Companies with annual payroll above ₦50M OR 25+ employees must pay 1% of payroll to the ITF. Your payroll is below ₦50M — check if you're actually obligated, but paying is always safe. ITF funds staff training across Nigeria.", law:"ITF Act §6 — levy threshold and rate" },
      { text:"🔍 Check if you're actually required to pay (payroll <₦50M)", cost:0, compliance:{employment:+5}, xp:30, outcome:"Good diligence! ITF levy applies to companies with annual payroll above ₦50M OR 25+ employees. At ₦7.8M payroll and 4 staff, you may be exempt. Always verify before paying — but don't ignore the letter.", law:"ITF Act §6 — exemption threshold", warning:true },
    ]
  },

  /* ─── DATA & PRIVACY ─── */
  {
    id:"privacy_policy", week:4, category:"data", priority:"high",
    title:"Do You Have a Privacy Policy?",
    scene:"🔐 Your website is live and collecting customer emails and phone numbers. A customer asks to see your Privacy Policy.",
    decision:"How do you comply with Nigeria's data protection law?",
    choices:[
      { text:"✅ Publish NDPA-compliant Privacy Policy and get consent", cost:15000, compliance:{data:+35}, xp:100, outcome:"Essential. The Nigeria Data Protection Act 2023 requires a clear Privacy Policy, lawful basis for processing, user consent, and breach reporting within 72 hours. Fine for violation: ₦10M or 2% of annual gross revenue — whichever is higher.", law:"NDPA 2023 §24 + §48" },
      { text:"💬 Copy a template Privacy Policy from the internet", cost:0, compliance:{data:+10}, xp:20, outcome:"Better than nothing but risky. Generic templates rarely satisfy NDPA 2023 requirements specific to Nigerian law. You need to address your specific data flows, storage location, and user rights under Nigerian law.", law:"NDPA 2023 §24", warning:true },
      { text:"❌ Websites don't need privacy policies in Nigeria", cost:0, compliance:{data:-40}, xp:0, outcome:"False and dangerous. NDPA 2023 has been in force since June 2023 and applies to ALL organisations processing Nigerian citizens' data. The Nigeria Data Protection Commission (NDPC) is actively enforcing it. Fine: ₦10M or 2% annual revenue.", law:"NDPA 2023 §24 — mandatory Privacy Policy", penalty:100000, isWrong:true },
    ]
  },
  {
    id:"data_breach", week:9, category:"data", priority:"critical",
    title:"🚨 Data Breach Alert!",
    scene:"🚨 Your IT team discovers that customer data — 5,000 names and phone numbers — was exposed due to a server misconfiguration. It's 9am Monday.",
    decision:"NDPA 2023 requires breach notification within 72 hours. What do you do?",
    choices:[
      { text:"✅ Report to NDPC within 72 hours + notify affected customers", cost:20000, compliance:{data:+20}, xp:150, outcome:"Correct response. NDPA 2023 §40 mandates reporting personal data breaches to the Nigeria Data Protection Commission within 72 hours of becoming aware. Also notify affected customers if there's high risk to their rights. Document everything.", law:"NDPA 2023 §40 — 72-hour breach notification" },
      { text:"🤫 Fix quietly — nobody noticed", cost:0, compliance:{data:-45}, xp:0, outcome:"Cover-up makes it far worse. NDPA 2023 treats failure to report a breach as a separate and aggravated offence. Fine: up to ₦10M PLUS prosecution of company directors. Whistleblowers from your IT team could also report directly to NDPC.", law:"NDPA 2023 §40 + §48 — breach concealment penalty", penalty:200000, isWrong:true },
    ]
  },
  {
    id:"dpo_appoint", week:6, category:"data", priority:"medium",
    title:"Appoint a Data Protection Officer?",
    scene:"📋 NDPC sends a circular: organisations processing large volumes of sensitive data must appoint a Data Protection Officer (DPO).",
    decision:"Your business processes medical records / financial data / large customer databases. Do you appoint a DPO?",
    choices:[
      { text:"✅ Appoint internal DPO and register with NDPC", cost:0, compliance:{data:+20}, xp:70, outcome:"Required for high-risk processors. The DPO monitors compliance, trains staff, and is the point of contact for NDPC. You can appoint an existing employee if they have no conflict of interest. Register the DPO appointment with NDPC.", law:"NDPA 2023 §32 — DPO requirement" },
      { text:"💰 Outsource to a licensed Data Protection Compliance Organisation (DPCO)", cost:30000, compliance:{data:+25}, xp:80, outcome:"Smart and compliant. DPCOs are licensed by NDPC to help organisations achieve and maintain NDPA compliance. Cost-effective for SMEs. Ensure they provide a formal compliance report annually.", law:"NDPA 2023 §33 — DPCO licensing" },
    ]
  },

  /* ─── LICENCES ─── */
  {
    id:"nafdac_food", week:3, category:"licences", priority:"critical",
    title:"NAFDAC Registration (Food Business)",
    scene:"🧪 You're ready to package and sell your food products in supermarkets. A retailer asks for your NAFDAC number.",
    decision:"All packaged food products must be registered with NAFDAC before sale. What do you do?",
    choices:[
      { text:"✅ Apply for NAFDAC product registration (90–180 days)", cost:50000, compliance:{licences:+40}, xp:120, outcome:"Mandatory and non-negotiable. Every packaged food, drug, cosmetic, or beverage sold in Nigeria must be NAFDAC-registered. The registration number (e.g. NAFDAC/FD/XX/XXXXX) must appear on all product packaging. Start early — it takes 3–6 months.", law:"NAFDAC Act §5 — mandatory product registration" },
      { text:"⏳ Start selling, apply for NAFDAC while selling", cost:0, compliance:{licences:-35}, xp:0, outcome:"Illegal. Selling unregistered food products is a criminal offence. NAFDAC can seize your entire inventory, destroy it at your cost, issue a public recall, and prosecute directors. Penalty: fines up to ₦1M and/or imprisonment.", law:"NAFDAC Act §33 — penalty for unregistered products", penalty:100000, isWrong:true },
    ]
  },
  {
    id:"cbn_fintech", week:3, category:"licences", priority:"critical",
    title:"CBN Licence for Payment Services",
    scene:"🏦 Your fintech app wants to hold customer funds and process payments. Your investors are asking about your CBN licence.",
    decision:"Operating a payment service without CBN approval is illegal. What's your path?",
    choices:[
      { text:"✅ Apply for CBN Sandbox approval (start here)", cost:0, compliance:{licences:+30}, xp:100, outcome:"Correct first step. CBN's Regulatory Sandbox allows fintech startups to test payment products under supervision before full licensing. Apply at sandbox.cbn.gov.ng. Full Payment Service Bank licence takes 12–18 months and requires ₦5B capital.", law:"CBN PSB Guidelines 2021 + Sandbox Framework 2021" },
      { text:"🚀 Launch the app — get the licence later", cost:0, compliance:{licences:-50}, xp:0, outcome:"Catastrophic. Unlicensed payment services are shut down immediately by CBN. Penalty starts at ₦2M per day of operation. Directors face personal criminal liability. CBN has shut down dozens of Nigerian fintech apps for exactly this.", law:"CBN Act §47 + Banks & OFI Act §59 — unlicensed operation", penalty:250000, isWrong:true },
    ]
  },
  {
    id:"son_standards", week:5, category:"licences", priority:"medium",
    title:"SON Product Standards Certification",
    scene:"🔬 A major retailer wants to stock your manufactured product but requires a Standards Organisation of Nigeria (SON) certification mark.",
    decision:"Your product (electronics/household goods/building materials) must meet SON standards.",
    choices:[
      { text:"✅ Apply for MANCAP (Mandatory Conformity Assessment Programme)", cost:35000, compliance:{licences:+20}, xp:80, outcome:"Correct. SON's MANCAP certification is mandatory for locally manufactured goods. It confirms your product meets Nigerian Industrial Standards (NIS). Required for: electronics, food packaging, building materials, motor vehicle parts.", law:"SON Act §5 — MANCAP mandatory certification" },
      { text:"⏳ Sell without — most small businesses do", cost:0, compliance:{licences:-20}, xp:0, outcome:"Risky normalisation. SON enforcement has intensified. Non-certified products can be seized from retailers, attracting fines and recall costs. More importantly, you lose access to major retail chains that require certification.", law:"SON Act §32 — enforcement powers", warning:true },
    ]
  },

  /* ─── GROWTH & STRATEGIC EVENTS ─── */
  {
    id:"govt_contract", week:8, category:"tax", priority:"high",
    title:"Government Contract Opportunity! ₦5M",
    scene:"🏛️ A Federal Government ministry wants to award your company a ₦5M contract. The procurement officer is asking for specific documents.",
    decision:"Which documents does every government contractor need?",
    choices:[
      { text:"✅ Present: CAC cert + 3-year TCC + PENCOM clearance + ITDA cert", cost:0, compliance:{tax:+15, registration:+10}, xp:150, revenue:5000000, outcome:"Perfect! Government procurement under BPP Act requires: CAC Certificate, Tax Clearance Certificate (3 years), PENCOM Compliance Certificate, ITF Certificate, and NSITF Certificate. Missing any one disqualifies your bid regardless of price or quality.", law:"Public Procurement Act 2007 + BPP Guidelines" },
      { text:"❌ I have CAC cert — that should be enough", cost:0, compliance:{tax:-10}, xp:0, outcome:"Bid rejected. The Bureau of Public Procurement (BPP) has mandatory checklists. CAC alone is insufficient. You need tax clearance (proving 3 years of filing) and all labour compliance certificates. Start building this portfolio now.", law:"PPA 2007 §16 — mandatory bid requirements", isWrong:true },
    ]
  },
  {
    id:"foreign_investment", week:10, category:"registration", priority:"high",
    title:"Foreign Investor Wants In! $200,000",
    scene:"💰 A UK-based investor wants to put $200,000 into your company. The money is ready to wire.",
    decision:"How do you properly receive foreign investment in Nigeria?",
    choices:[
      { text:"✅ Process through Nigerian bank → obtain Certificate of Capital Importation (CCI)", cost:5000, compliance:{registration:+20}, xp:120, revenue:0, outcome:"Essential step. All foreign capital inflows must be processed through a Nigerian commercial bank which issues a Certificate of Capital Importation (CCI) from CBN. Without CCI, you CANNOT legally repatriate dividends or exit proceeds. This is how capital controls work in Nigeria.", law:"CBN Foreign Exchange Manual — CCI requirement" },
      { text:"💸 Receive directly to personal account — simpler", cost:0, compliance:{registration:-30}, xp:0, outcome:"Illegal and disastrous. Bypassing the CCI process violates CBN foreign exchange regulations. The investor cannot legally repatriate their funds later. EFCC and CBN can freeze your accounts. Your investor's lawyers will withdraw immediately.", law:"BOFIA 2020 + CBN FX Manual — CCI mandatory", penalty:0, isWrong:true },
    ]
  },
  {
    id:"export_docs", week:9, category:"licences", priority:"high",
    title:"Ready to Export! But Are You Compliant?",
    scene:"🚢 Your Kano agro-processing plant has a $50,000 order from a UK buyer. Shipping in 3 weeks.",
    decision:"What export compliance documents do you need?",
    choices:[
      { text:"✅ Get: NAFDAC cert + NAQS phytosanitary cert + NEPC registration + Form NXP", cost:40000, compliance:{licences:+30}, xp:130, revenue:0, outcome:"Complete export compliance stack! NAFDAC certifies the product, NAQS issues phytosanitary certificate (pest-free certification required by all importing countries), NEPC registration unlocks export incentives, Form NXP is the CBN export declaration form. Miss any one = shipment detained.", law:"NAFDAC Act + NAQS Regs + NEPC Act + CBN FX Manual" },
      { text:"⏳ Just ship — the UK buyer handles their side", cost:0, compliance:{licences:-30}, xp:0, outcome:"Your cargo will be rejected at the UK port of entry. NAQS phytosanitary certificate is an international requirement under the International Plant Protection Convention. Your ₦20M in goods is stranded at sea at your cost.", law:"NAQS Regulations + IPPC Convention", penalty:50000, isWrong:true },
    ]
  },
  {
    id:"startup_act", week:5, category:"registration", priority:"medium",
    title:"Nigeria Startup Act Benefits",
    scene:"🚀 Your tech company qualifies as a Nigerian startup. The Startup Act 2022 has significant benefits.",
    decision:"Do you apply for Startup Label certification?",
    choices:[
      { text:"✅ Apply for Startup Label at startups.gov.ng", cost:0, compliance:{registration:+15}, xp:100, revenue:0, outcome:"Excellent! Nigeria Startup Act 2022 benefits for labelled startups include: pioneer status tax holiday (up to 5 years), 0% import duty on equipment, work permit fast-track for foreign talent, and access to Startup Investment Seed Fund. Apply at startups.gov.ng.", law:"Nigeria Startup Act 2022 §19 — Startup Label benefits" },
      { text:"❓ I didn't know this existed", cost:0, compliance:{registration:0}, xp:50, revenue:0, outcome:"Now you do! The Nigeria Startup Act 2022 was signed to support tech-enabled startups. Eligible companies: incorporated in Nigeria, 1–7 years old, innovative/tech-enabled, not a subsidiary of a large corporation. Free to apply.", law:"Nigeria Startup Act 2022 — eligibility criteria", warning:true },
    ]
  },

  /* ─── ENFORCEMENT EVENTS (triggered by low compliance) ─── */
  {
    id:"firs_audit", week:10, category:"tax", priority:"critical", triggerOnLowCompliance:"tax",
    title:"🚨 FIRS Audit Notice Received",
    scene:"📬 A registered letter arrives from FIRS. You are selected for a tax audit covering the last 3 years. An audit team arrives Monday.",
    decision:"Your books aren't fully in order. How do you respond?",
    choices:[
      { text:"✅ Engage a tax consultant immediately, prepare all records", cost:80000, compliance:{tax:+10}, xp:80, outcome:"Correct response. A qualified tax consultant can represent you, negotiate with FIRS, and ensure you only pay what's legitimately owed. FIRS auditors can assess Best-of-Judgement (BOJ) if your records are incomplete — always worse than actual liability.", law:"FIRS Act §26 — audit powers and taxpayer rights" },
      { text:"🤫 Destroy/hide damaging records before Monday", cost:0, compliance:{tax:-60}, xp:0, outcome:"Criminal offence. Destroying records during a tax investigation is obstruction of justice. FIRS can apply to court for seizure of ALL business assets. Directors face personal criminal prosecution. This escalates to EFCC territory.", law:"FIRS Act §29 — obstruction of tax investigation", penalty:300000, isWrong:true },
    ]
  },
  {
    id:"lga_enforcement", week:7, category:"licences", priority:"medium", triggerOnLowCompliance:"licences",
    title:"LGA Task Force Arrives!",
    scene:"🚔 Four LGA enforcement officers arrive at your premises at 8am with a sealing order. Your business premises levy is 2 years overdue.",
    decision:"They're about to seal your shop. What do you do?",
    choices:[
      { text:"✅ Pay all arrears on the spot + negotiate reopening", cost:60000, compliance:{licences:+15}, xp:50, outcome:"Best available option in a bad situation. Pay the arrears plus any penalties on-site. Get a receipt. Document everything. Request their supervisor's details. The sealing order can typically be lifted same day upon payment.", law:"State Revenue Law — enforcement and recovery" },
      { text:"📞 Call a lawyer and resist the sealing", cost:30000, compliance:{licences:-5}, xp:30, outcome:"Risky strategy. Physically resisting LGA enforcement can escalate to police involvement. Legal challenge takes weeks during which your business stays sealed. Better to pay and challenge excessive fees in court after reopening.", law:"State Revenue Law — appeals process", warning:true },
    ]
  },

  /* ─── ADVANCED / SECTOR-SPECIFIC ─── */
  {
    id:"sec_investment", week:11, category:"licences", priority:"high",
    title:"Raising Capital from the Public?",
    scene:"📈 You want to raise ₦50M from 200+ investors via an online investment platform.",
    decision:"Does this require SEC approval?",
    choices:[
      { text:"✅ Register the offer with SEC and use a licensed issuing house", cost:100000, compliance:{licences:+25}, xp:130, outcome:"Mandatory. Any public offering of securities — including crowdfunding above certain thresholds — requires Securities and Exchange Commission (SEC) registration under the Investment and Securities Act (ISA) 2007. The 2024 ISA amendment has updated thresholds for crowdfunding.", law:"ISA 2007 §67 + SEC Crowdfunding Rules 2021" },
      { text:"❌ It's just friends and acquaintances — no need for SEC", cost:0, compliance:{licences:-40}, xp:0, outcome:"At 200+ investors it's a public offer under Nigerian law regardless of how you describe it. SEC can void the entire transaction, order refunds, and prosecute company directors. Your investors may also sue under ISA.", law:"ISA 2007 §67 — public offer definition + penalty", penalty:200000, isWrong:true },
    ]
  },
  {
    id:"nesrea_environment", week:9, category:"licences", priority:"medium",
    title:"Environmental Impact Assessment",
    scene:"🌿 You're opening a production facility. NESREA (National Environmental Standards and Regulations Enforcement Agency) requires an EIA.",
    decision:"Do you conduct an Environmental Impact Assessment before construction?",
    choices:[
      { text:"✅ Commission a licensed EIA consultant and obtain NESREA approval", cost:200000, compliance:{licences:+20}, xp:90, outcome:"Required for industrial, manufacturing, and large food processing facilities. NESREA EIA approval is mandatory before construction begins. Operating without it: ₦1M fine per day plus facility closure. Also required for Lagos LASEPA compliance.", law:"NESREA Act §7 + EIA Act §2 — mandatory assessment" },
      { text:"⏳ Build first, get EIA retrospectively", cost:0, compliance:{licences:-25}, xp:0, outcome:"Retroactive EIA approval is extremely difficult and rarely granted. NESREA has issued stop-work orders on multi-billion naira facilities for this. You could be forced to demolish non-compliant structures at your cost.", law:"NESREA Act §27 — stop-work order powers", warning:true },
    ]
  },
  {
    id:"insurance_required", week:6, category:"employment", priority:"medium",
    title:"Group Life Insurance — Required by Law",
    scene:"👥 Your HR manager flags a mandatory requirement you may have missed.",
    decision:"The Pension Reform Act requires employers to provide Group Life Insurance for all staff.",
    choices:[
      { text:"✅ Purchase Group Life Insurance for all employees (min 3x annual salary)", cost:45000, compliance:{employment:+15}, xp:70, outcome:"Mandatory. PRA 2014 §9 requires employers to maintain a Group Life Insurance policy for all employees for a minimum of 3 times the annual total emolument. On employee death, beneficiaries receive this benefit alongside pension savings.", law:"PRA 2014 §9 — Group Life Insurance requirement" },
      { text:"❓ I thought only pension was required", cost:0, compliance:{employment:-10}, xp:0, outcome:"Common misconception. Beyond pension, employers must also provide Group Life Insurance (PRA 2014 §9) and employee compensation through NSITF (ECA 2010). These are three separate obligations.", law:"PRA 2014 §9 — separate from pension obligation", warning:true },
    ]
  },
  {
    id:"witholding_tax", week:7, category:"tax", priority:"medium",
    title:"Withholding Tax on Contractor Payments",
    scene:"💼 You paid ₦800,000 to a contractor for renovation work this month.",
    decision:"Should you deduct Withholding Tax (WHT) from this payment?",
    choices:[
      { text:"✅ Deduct 10% WHT (₦80,000) and remit to FIRS", cost:0, compliance:{tax:+15}, xp:70, outcome:"Correct. WHT is deducted at source on specified payments: contractor services 10%, rent 10%, dividends 10%, management fees 10%, professional fees 5%. The contractor receives ₦720,000. You remit ₦80,000 to FIRS and issue a WHT credit note to the contractor.", law:"CITA §78 + WHT Regulations — rates and deadlines" },
      { text:"❌ Pay the full ₦800,000 — that's the contractor's problem", cost:0, compliance:{tax:-20}, xp:0, outcome:"Wrong. The paying company is the WHT agent — legal responsibility to deduct and remit rests on you, not the contractor. FIRS will pursue you for the undeducted WHT plus 10% penalty and interest.", law:"CITA §78 — withholding agent responsibility", isWrong:true },
    ]
  },
  {
    id:"stamp_duty", week:8, category:"tax", priority:"low",
    title:"Stamp Duty on Business Contracts",
    scene:"📝 You're signing a ₦2M office lease agreement. Your lawyer mentions stamp duty.",
    decision:"Is stamp duty required on business contracts in Nigeria?",
    choices:[
      { text:"✅ Stamp the lease at FIRS — 0.78% on lease value", cost:15600, compliance:{tax:+10}, xp:50, outcome:"Required. Stamp Duties Act requires stamping of: leases, loan agreements, debentures, share transfers, and certain receipts. An unstamped document is inadmissible as evidence in Nigerian courts — meaning you cannot enforce a ₦2M lease if there's a dispute.", law:"Stamp Duties Act Cap S8 LFN — admissibility requirement" },
      { text:"❓ I've never heard of this requirement", cost:0, compliance:{tax:-5}, xp:30, outcome:"Common knowledge gap. Many Nigerian businesses sign contracts without stamp duty and only discover the problem when they need to enforce the contract in court. An unstamped instrument is inadmissible as legal evidence.", law:"Stamp Duties Act — stamp duty on instruments", warning:true },
    ]
  },
  {
    id:"tef_grant", week:6, category:"registration", priority:"low",
    title:"Tony Elumelu Foundation Grant",
    scene:"🏆 You've been shortlisted for a ₦500,000 TEF grant. The final requirement: proof of formal business registration.",
    decision:"Which documents does the TEF require?",
    choices:[
      { text:"✅ Submit: CAC cert + TIN + audited accounts + business plan", cost:0, compliance:{registration:+10}, xp:80, revenue:500000, outcome:"You've won the grant! Most Nigerian and international business grants (TEF, BOI, GEEP, CBN interventions) require at minimum: CAC registration, TIN, and financial statements. This is why compliance pays — literally.", law:"TEF Eligibility Requirements + BOI SME Guidelines" },
      { text:"❌ I'm not formally registered — I'll miss this", cost:0, compliance:{registration:-5}, xp:40, outcome:"You've lost ₦500,000 because of non-registration. This happens to thousands of Nigerian entrepreneurs every cycle. CAC registration costs ₦10,000 and takes 48 hours online. The opportunity cost of non-compliance is enormous.", law:"TEF eligibility — CAC mandatory", isWrong:true },
    ]
  },
];

// Enforcement consequences for ignoring low compliance
const ENFORCEMENT_EVENTS = [
  { category:"tax",          threshold:30, title:"FIRS Account Freeze",       penalty:150000, desc:"FIRS issues a Substitution Notice — your bank is ordered to deduct overdue taxes directly from your account." },
  { category:"registration", threshold:25, title:"CAC Strike-Off Notice",     penalty:50000,  desc:"CAC has begun proceedings to strike your company off the register for non-compliance. All directors are personally liable." },
  { category:"employment",   threshold:25, title:"PENCOM Enforcement",        penalty:80000,  desc:"PENCOM investigators audit your premises. Unremitted pension contributions + 2% monthly surcharge demanded immediately." },
  { category:"data",         threshold:20, title:"NDPC Investigation",        penalty:200000, desc:"NDPC opens a formal investigation into your data practices. Business operations suspended pending audit." },
  { category:"licences",     threshold:20, title:"Multi-Agency Task Force",   penalty:120000, desc:"A joint NAFDAC/SON/LGA task force seals your premises. All products seized pending compliance verification." },
];

// Journey progression: climb from base camp to summit by meeting compliance + score targets
const JOURNEY_STAGES = [
  { id:"base_camp", label:"Base Camp", icon:"⛺", requirement:{ compliance:0, score:0 }, reward:{ cash:0, xp:0 } },
  { id:"valley_block", label:"Valley Block", icon:"🏞️", requirement:{ compliance:30, score:900 }, reward:{ cash:3000, xp:40 } },
  { id:"rock_block", label:"Rock Block", icon:"🪨", requirement:{ compliance:45, score:2000 }, reward:{ cash:5000, xp:60 } },
  { id:"hill_block", label:"Hill Block", icon:"⛰️", requirement:{ compliance:60, score:3500 }, reward:{ cash:8000, xp:80 } },
  { id:"summit", label:"Summit", icon:"🏔️", requirement:{ compliance:75, score:5500 }, reward:{ cash:12000, xp:120 } },
];

const ADVENTURE_LEVELS = [
  {
    id:"lvl_cac",
    name:"CAC Ridge",
    terrain:"hill",
    mechanic:"climb",
    obstacleIcon:"🏛️",
    objective:"Climb the registration ridge to unlock legal status.",
    regulationTag:"CAMA 2020 §795",
    category:"registration",
    reward:{ cash:7000, xp:90, compliance:12 },
    quiz:{
      q:"What is the first legal step to operate formally in Nigeria?",
      options:["Open an Instagram page", "Register with CAC", "Pay VAT first"],
      correct:1,
    },
  },
  {
    id:"lvl_tin",
    name:"TIN Valley",
    terrain:"valley",
    mechanic:"jump",
    obstacleIcon:"🕳️",
    objective:"Jump the valley by setting the right launch power.",
    regulationTag:"FIRS Act §10",
    category:"tax",
    reward:{ cash:5000, xp:80, compliance:10 },
    powerRange:[42, 70],
    quiz:{
      q:"A business TIN is used for what?",
      options:["Only social media ads", "Corporate tax identity and filings", "Employee leave requests"],
      correct:1,
    },
  },
  {
    id:"lvl_vat",
    name:"VAT Fortress",
    terrain:"wall",
    mechanic:"shoot",
    obstacleIcon:"🎯",
    objective:"Fire an arrow to hit the VAT filing switch.",
    regulationTag:"VAT Act §15",
    category:"tax",
    reward:{ cash:9000, xp:110, compliance:13 },
    angleRange:[32, 58],
    powerRange:[45, 75],
    quiz:{
      q:"When is monthly VAT return generally due?",
      options:["By 21st of next month", "By year end", "Only when audited"],
      correct:0,
    },
  },
  {
    id:"lvl_pension",
    name:"Pension Cliffs",
    terrain:"hill",
    mechanic:"climb",
    obstacleIcon:"🧗",
    objective:"Scale the cliff face to secure employee pension compliance.",
    regulationTag:"PRA 2014 §11",
    category:"employment",
    reward:{ cash:7000, xp:95, compliance:12 },
    quiz:{
      q:"Mandatory pension contribution rates are:",
      options:["8% employee + 10% employer", "2% each", "Employer optional"],
      correct:0,
    },
  },
  {
    id:"lvl_ndpa",
    name:"Data Canyon",
    terrain:"valley",
    mechanic:"jump",
    obstacleIcon:"🔐",
    objective:"Jump across the canyon and secure customer data rights.",
    regulationTag:"NDPA 2023 §24",
    category:"data",
    reward:{ cash:8500, xp:100, compliance:12 },
    powerRange:[48, 76],
    quiz:{
      q:"A clear privacy policy in Nigeria is:",
      options:["Optional", "Mandatory for data processors", "Needed only for banks"],
      correct:1,
    },
  },
  {
    id:"lvl_licence",
    name:"Licence Summit",
    terrain:"wall",
    mechanic:"shoot",
    obstacleIcon:"✅",
    objective:"Shoot approval beacons and clear your licence route.",
    regulationTag:"Sector Licences",
    category:"licences",
    reward:{ cash:12000, xp:140, compliance:15 },
    angleRange:[36, 60],
    powerRange:[50, 80],
    quiz:{
      q:"For packaged food products, what is required before sale?",
      options:["NAFDAC registration", "Only Instagram ads", "No requirement"],
      correct:0,
    },
  },
];

/* ═══════════════════════════════════════════════════════════════
   CSS
═══════════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
html,body{height:100%;overflow:hidden;}
body{font-family:'Nunito',sans-serif;background:#060614;}
.root{width:100%;height:100dvh;max-width:430px;margin:0 auto;position:relative;background:#060614;overflow:hidden;display:flex;flex-direction:column;}
.screen{flex:1;overflow-y:auto;padding-bottom:80px;}
.btn{cursor:pointer;border:none;font-family:'Nunito',sans-serif;font-weight:800;transition:all .15s;}
.btn:active{transform:scale(.95)!important;}
.card{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:18px;}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
@keyframes slideUp{from{transform:translateY(60px);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes neon{0%,100%{text-shadow:0 0 10px currentColor,0 0 30px currentColor}50%{text-shadow:0 0 20px currentColor,0 0 60px currentColor}}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
@keyframes cardIn{from{opacity:0;transform:scale(.9) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}
@keyframes barGrow{from{width:0}to{width:var(--w)}}
@keyframes penaltyShake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}
@keyframes xpPop{0%{opacity:0;transform:translateY(0) scale(.5)}40%{opacity:1;transform:translateY(-16px) scale(1.2)}100%{opacity:0;transform:translateY(-40px) scale(.8)}}
@keyframes slideInR{from{transform:translateX(110%)}to{transform:translateX(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes alertPulse{0%,100%{box-shadow:0 0 0 0 rgba(255,68,68,.4)}70%{box-shadow:0 0 0 12px rgba(255,68,68,0)}}
`;

/* ═══════════════════════════════════════════════════════════════
   GAME ENGINE HOOK
═══════════════════════════════════════════════════════════════ */
function useGameEngine(businessType, avatar) {
  const [week, setWeek] = useState(1);
  const [cash, setCash] = useState(businessType?.startCash || 100000);
  const [revenue, setRevenue] = useState(0);
  const [xp, setXp] = useState(0);
  const [compliance, setCompliance] = useState({ registration:15, tax:10, employment:10, data:10, licences:15 });
  const [eventQueue, setEventQueue] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [completedEvents, setCompletedEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [gameLog, setGameLog] = useState([]);
  const [penalties, setPenalties] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(null);
  const [weeklyRevenue, setWeeklyRevenue] = useState(0);
  const [collectiblesEarned, setCollectiblesEarned] = useState([]);
  const [journeyIndex, setJourneyIndex] = useState(0);
  const [adventureWins, setAdventureWins] = useState(0);
  const complianceAvg = Math.round(Object.values(compliance).reduce((a,b)=>a+b,0)/5);

  // Build event queue based on business type
  useEffect(() => {
    if (!businessType) return;
    // Filter relevant events + sector-specific ones
    const sectorEvents = ALL_EVENTS.filter(e => {
      if (businessType.id === "food" && e.id === "nafdac_food") return true;
      if (businessType.id === "fintech" && e.id === "cbn_fintech") return true;
      if (businessType.id === "agro" && e.id === "export_docs") return true;
      if (["tech","fintech"].includes(businessType.id) && e.id === "startup_act") return true;
      if (["food","agro"].includes(businessType.id) && e.id === "nesrea_environment") return true;
      return !["nafdac_food","cbn_fintech","export_docs"].includes(e.id);
    });
    const sorted = [...sectorEvents].sort((a,b) => (a.week||5) - (b.week||5));
    setEventQueue(sorted);
  }, [businessType]);

  // Advance week
  const advanceWeek = useCallback(() => {
    setWeek(w => {
      const newWeek = w + 1;
      // Natural weekly revenue based on compliance score
      const complianceAvg = Object.values(compliance).reduce((a,b)=>a+b,0)/5;
      const baseRev = businessType ? businessType.startCash * 0.08 : 5000;
      const journeyBoost = 1 + (journeyIndex * 0.08);
      const weekRev = Math.round(baseRev * journeyBoost * (0.6 + complianceAvg/200));
      const weeklyCost = Math.round(baseRev * (0.4 + journeyIndex * 0.03));
      setCash(c => c + weekRev - weeklyCost);
      setRevenue(r => r + weekRev);
      setWeeklyRevenue(weekRev);
      // Check enforcement events
      Object.entries(compliance).forEach(([cat, val]) => {
        const ef = ENFORCEMENT_EVENTS.find(e => e.category === cat && val < e.threshold);
        if (ef && Math.random() < 0.35) {
          setCash(c => Math.max(0, c - ef.penalty));
          setPenalties(p => p + ef.penalty);
          addNotification({ type:"danger", title:ef.title, msg:ef.desc, penalty:ef.penalty });
          addLog({ type:"penalty", text:`ENFORCEMENT: ${ef.title} — ₦${ef.penalty.toLocaleString()} seized`, week:newWeek });
        }
      });
      // Compliance natural decay
      setCompliance(prev => {
        const decayed = {};
        Object.entries(prev).forEach(([k,v]) => { decayed[k] = Math.max(0, v - (Math.random() < 0.4 ? 3 : 0)); });
        return decayed;
      });
      // Score
      const compAvg2 = Object.values(compliance).reduce((a,b)=>a+b,0)/5;
      setScore(Math.round((revenue/1000) + xp + compAvg2 * 10 + journeyIndex * 250));
      if (newWeek > 12) setGameOver("complete");
      return newWeek;
    });
  }, [compliance, businessType, revenue, xp, journeyIndex]);

  const journeyStage = JOURNEY_STAGES[journeyIndex] || JOURNEY_STAGES[JOURNEY_STAGES.length - 1];
  const nextJourneyStage = JOURNEY_STAGES[journeyIndex + 1] || null;
  const canClimb = !!nextJourneyStage && complianceAvg >= nextJourneyStage.requirement.compliance && score >= nextJourneyStage.requirement.score;

  const climbJourney = useCallback(() => {
    if (!nextJourneyStage) {
      addNotification({ type:"info", title:"Summit reached", msg:"You are already at the highest block on the map." });
      return;
    }

    if (!canClimb) {
      const missingCompliance = Math.max(0, nextJourneyStage.requirement.compliance - complianceAvg);
      const missingScore = Math.max(0, nextJourneyStage.requirement.score - score);
      addNotification({
        type:"warning",
        title:`Need more to reach ${nextJourneyStage.label}`,
        msg:`You need ${nextJourneyStage.requirement.compliance}% compliance and a score of ${nextJourneyStage.requirement.score}. Missing ${missingCompliance}% compliance and ${missingScore.toLocaleString()} score.`,
      });
      addLog({ type:"warning", text:`Climb attempt blocked: ${nextJourneyStage.label} still locked`, week });
      return;
    }

    setJourneyIndex(i => Math.min(i + 1, JOURNEY_STAGES.length - 1));
    setCash(c => c + nextJourneyStage.reward.cash);
    setXp(x => x + nextJourneyStage.reward.xp);
    setScore(s => s + Math.round(nextJourneyStage.reward.xp * 4));
    addNotification({
      type:"success",
      title:`Climbed to ${nextJourneyStage.label}`,
      msg:`You reached a new business level. Reward unlocked: ₦${nextJourneyStage.reward.cash.toLocaleString()} and +${nextJourneyStage.reward.xp} XP.`,
    });
    addLog({ type:"success", text:`LEVEL UP: reached ${nextJourneyStage.label}`, week });
  }, [canClimb, complianceAvg, nextJourneyStage, score, week]);

  const completeAdventureLevel = useCallback((level) => {
    if (!level) return;
    const reward = level.reward || { cash:0, xp:0, compliance:0 };
    setCash(c => c + (reward.cash || 0));
    setXp(x => x + (reward.xp || 0));
    if (level.category && reward.compliance) {
      setCompliance(prev => ({
        ...prev,
        [level.category]: Math.min(100, (prev[level.category] || 0) + reward.compliance),
      }));
    }
    setScore(s => s + Math.round((reward.xp || 0) * 3 + (reward.cash || 0) / 1500));
    setAdventureWins(v => v + 1);
    addNotification({
      type:"success",
      title:`Adventure cleared: ${level.name}`,
      msg:`Rewards unlocked: ₦${(reward.cash || 0).toLocaleString()} +${reward.xp || 0} XP +${reward.compliance || 0}% ${level.category || "compliance"}.`,
    });
    addLog({ type:"success", text:`ADVENTURE: cleared ${level.name} (${level.regulationTag})`, week });
  }, [week]);

  // Pop next event
  const popEvent = useCallback(() => {
    const remaining = eventQueue.filter(e => !completedEvents.includes(e.id));
    if (remaining.length === 0) { setCurrentEvent(null); return; }
    // Priority: critical first, then in order
    const critical = remaining.filter(e => e.priority === "critical");
    const next = critical.length > 0 ? critical[0] : remaining[0];
    setCurrentEvent(next);
  }, [eventQueue, completedEvents]);

  useEffect(() => { if (!currentEvent && eventQueue.length > 0) popEvent(); }, [eventQueue, completedEvents]);

  function resolveEvent(choice) {
    if (!currentEvent) return;
    // Apply effects
    if (choice.cost > 0) setCash(c => c - choice.cost);
    if (choice.penalty) { setCash(c => Math.max(0, c - choice.penalty)); setPenalties(p => p + choice.penalty); }
    if (choice.revenue) { setCash(c => c + choice.revenue); setRevenue(r => r + choice.revenue); }
    if (choice.xp) setXp(x => x + choice.xp);
    if (choice.compliance) {
      setCompliance(prev => {
        const next = {...prev};
        Object.entries(choice.compliance).forEach(([k,v]) => { next[k] = Math.min(100, Math.max(0, (next[k]||0) + v)); });
        return next;
      });
    }
    addLog({
      type: choice.isWrong ? "warning" : choice.penalty ? "danger" : "success",
      text: `Week ${week}: ${currentEvent.title} — ${choice.isWrong ? "❌ Non-compliant" : "✅ Compliant"}`,
      law: choice.law, week,
    });
    if (!choice.isWrong) setCollectiblesEarned(prev => {
      const token = currentEvent.category + "_" + currentEvent.id;
      return prev.includes(token) ? prev : [...prev, token];
    });
    setCompletedEvents(prev => [...prev, currentEvent.id]);
    setCurrentEvent(null);
    setTimeout(popEvent, 300);
    // Check cash game-over
    if (cash - (choice.cost||0) - (choice.penalty||0) < -50000) setGameOver("bankrupt");
  }

  function addNotification(n) {
    const id = Date.now();
    setNotifications(prev => [...prev, {...n, id}]);
    setTimeout(() => setNotifications(prev => prev.filter(x => x.id !== id)), 4000);
  }
  function addLog(entry) { setGameLog(prev => [entry, ...prev.slice(0,49)]); }

  return {
    week, cash, revenue, xp, compliance, complianceAvg,
    currentEvent, gameLog, notifications, penalties, score,
    weeklyRevenue, collectiblesEarned, gameOver,
    journeyStage, nextJourneyStage, canClimb, journeyIndex, adventureWins,
    resolveEvent, advanceWeek, climbJourney, completeAdventureLevel, popEvent,
  };
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENTS
═══════════════════════════════════════════════════════════════ */

function ComplianceBar({ label, icon, value, color }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div style={{marginBottom:8}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
        <span style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,.65)"}}>{icon} {label}</span>
        <span style={{fontSize:11,fontWeight:800,color:pct>60?"#00c864":pct>35?"#FFB800":"#FF4444"}}>{pct}%</span>
      </div>
      <div style={{background:"rgba(255,255,255,.08)",borderRadius:99,height:7,overflow:"hidden"}}>
        <div style={{
          width:`${pct}%`, height:"100%", borderRadius:99,
          background:pct>60?color:pct>35?"#FFB800":"#FF4444",
          transition:"width .6s ease",
          boxShadow:pct<35?`0 0 8px #FF4444`:"none",
        }}/>
      </div>
    </div>
  );
}

function Notification({ n }) {
  const colors = { danger:"#FF4444", success:"#00c864", warning:"#FFB800", info:"#4ECDC4" };
  return (
    <div style={{
      background:`rgba(0,0,0,.92)`,
      border:`1.5px solid ${colors[n.type]||"#4ECDC4"}`,
      borderRadius:14, padding:"10px 14px",
      marginBottom:8, animation:"slideDown .3s ease",
      boxShadow:`0 4px 20px ${colors[n.type]||"#4ECDC4"}33`,
    }}>
      <p style={{color:colors[n.type],fontWeight:800,fontSize:13,margin:"0 0 2px"}}>{n.title}</p>
      <p style={{color:"rgba(255,255,255,.7)",fontSize:12,margin:0,lineHeight:1.4}}>{n.msg}</p>
      {n.penalty&&<p style={{color:"#FF4444",fontSize:11,fontWeight:700,margin:"4px 0 0"}}>💸 ₦{n.penalty.toLocaleString()} deducted</p>}
    </div>
  );
}

function ComplianceHillScene({ journeyStage, nextJourneyStage, canClimb, compliance, complianceAvg, score, onClimb, compact }) {
  const currentIndex = JOURNEY_STAGES.findIndex(s => s.id === journeyStage?.id);
  const points = [
    { x:8,  y:84 },
    { x:26, y:74 },
    { x:46, y:61 },
    { x:66, y:45 },
    { x:84, y:30 },
  ];

  const obstacleByStage = {
    base_camp: { title:"Launch",     desc:"Open for business",      icon:"🚀", cat:null },
    valley_block: { title:"CAC + TIN",  desc:"Registration and tax ID", icon:"📜", cat:"registration" },
    rock_block: { title:"VAT + PAYE",  desc:"Monthly tax discipline",  icon:"💰", cat:"tax" },
    hill_block: { title:"Staff + Data", desc:"Pension and NDPA",       icon:"👥", cat:"employment" },
    summit: { title:"Licences",   desc:"Approvals and audits",   icon:"✅", cat:"licences" },
  };

  const playerPoint = points[Math.max(0, currentIndex)] || points[0];
  const h = compact ? 170 : 220;

  return (
    <div style={{
      background:"linear-gradient(180deg,#11203e 0%, #14345b 36%, #1e6b4f 70%, #194637 100%)",
      border:"1px solid rgba(255,255,255,.15)",
      borderRadius:16,
      overflow:"hidden",
      position:"relative",
      boxShadow:"inset 0 -20px 40px rgba(0,0,0,.25)",
    }}>
      <div style={{position:"absolute",inset:0,pointerEvents:"none",opacity:.42}}>
        <div style={{position:"absolute",top:18,left:28,width:42,height:42,borderRadius:"50%",background:"rgba(255,228,102,.4)",filter:"blur(2px)"}}/>
        <div style={{position:"absolute",top:46,left:84,width:56,height:18,borderRadius:40,background:"rgba(255,255,255,.18)"}}/>
        <div style={{position:"absolute",top:32,left:130,width:44,height:14,borderRadius:40,background:"rgba(255,255,255,.14)"}}/>
      </div>

      <svg viewBox="0 0 100 100" style={{width:"100%",height:h,display:"block"}}>
        <path d="M0 90 L0 70 Q15 66 25 72 Q37 63 47 58 Q56 48 66 44 Q76 33 84 29 Q92 25 100 22 L100 100 L0 100 Z" fill="rgba(57,118,70,.8)"/>
        <path d="M0 90 Q16 83 26 74 Q36 64 46 61 Q58 53 66 45 Q76 36 84 30" fill="none" stroke="rgba(255,244,177,.9)" strokeWidth="1.8" strokeDasharray="2.8 2.2"/>
      </svg>

      {JOURNEY_STAGES.map((stage, i) => {
        const p = points[i];
        const unlocked = i <= currentIndex;
        const meta = obstacleByStage[stage.id];
        const catVal = meta?.cat ? (compliance?.[meta.cat] || 0) : complianceAvg;

        return (
          <div key={stage.id} style={{position:"absolute",left:`${p.x}%`,top:`${p.y}%`,transform:"translate(-50%,-50%)",textAlign:"center",width:86}}>
            <div style={{
              width:34,height:34,borderRadius:"50%",
              background: unlocked ? "linear-gradient(135deg,#00c864,#008751)" : "rgba(0,0,0,.35)",
              border: unlocked ? "2px solid rgba(255,255,255,.75)" : "1px solid rgba(255,255,255,.35)",
              display:"flex",alignItems:"center",justifyContent:"center",
              color:"#fff",fontSize:16,fontWeight:800,
              margin:"0 auto",
              boxShadow: unlocked ? "0 0 16px rgba(0,200,100,.42)" : "none",
            }}>
              {meta?.icon || stage.icon}
            </div>
            <p style={{margin:"3px 0 0",fontSize:10,fontWeight:900,color:unlocked?"#fff":"rgba(255,255,255,.58)",lineHeight:1.15}}>{meta?.title}</p>
            <p style={{margin:0,fontSize:9,color:"rgba(255,255,255,.65)",lineHeight:1.2}}>{meta?.desc}</p>
            <p style={{margin:"1px 0 0",fontSize:9,color:catVal >= stage.requirement.compliance ? "#95D44A" : "#FFB800",fontWeight:800}}>
              {catVal}% / {stage.requirement.compliance}%
            </p>
          </div>
        );
      })}

      <div style={{
        position:"absolute",
        left:`${playerPoint.x}%`,
        top:`calc(${playerPoint.y}% - 45px)`,
        transform:"translateX(-50%)",
        background:"rgba(0,0,0,.56)",
        border:"1px solid rgba(255,255,255,.3)",
        borderRadius:99,
        padding:"4px 8px",
        display:"flex",
        alignItems:"center",
        gap:5,
      }}>
        <span style={{fontSize:14}}>🏃🏾</span>
        <span style={{fontSize:10,color:"#fff",fontWeight:900}}>You</span>
      </div>

      <div style={{padding:compact?"8px 10px 10px":"10px 12px 12px",background:"rgba(0,0,0,.2)",borderTop:"1px solid rgba(255,255,255,.08)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
          <div>
            <p style={{margin:0,fontSize:10,color:"rgba(255,255,255,.55)",fontWeight:700,letterSpacing:1.2}}>REGULATION CLIMB</p>
            <p style={{margin:"2px 0 0",fontSize:12,color:"#fff",fontWeight:800}}>
              {journeyStage?.icon} {journeyStage?.label}
              {nextJourneyStage ? ` -> ${nextJourneyStage.icon} ${nextJourneyStage.label}` : " -> Summit reached"}
            </p>
            {nextJourneyStage && (
              <p style={{margin:"2px 0 0",fontSize:11,color:"rgba(255,255,255,.75)"}}>
                Need {nextJourneyStage.requirement.compliance}% compliance and {nextJourneyStage.requirement.score.toLocaleString()} score
              </p>
            )}
          </div>
          <button className="btn" onClick={onClimb} disabled={!nextJourneyStage} style={{
            padding: compact ? "9px 10px" : "10px 12px",
            borderRadius:10,
            fontSize:11,
            fontWeight:900,
            background: nextJourneyStage ? (canClimb ? "linear-gradient(135deg,#008751,#00c46b)" : "rgba(255,184,0,.2)") : "rgba(255,255,255,.1)",
            color: nextJourneyStage ? (canClimb ? "#fff" : "#FFE566") : "rgba(255,255,255,.42)",
            whiteSpace:"nowrap",
          }}>
            {nextJourneyStage ? (canClimb ? "Climb" : "Locked") : "Peak"}
          </button>
        </div>
      </div>
    </div>
  );
}

function JourneyRibbon({ journeyStage, nextJourneyStage, canClimb, compliance, complianceAvg, score, onClimb }) {
  return (
    <div style={{padding:"10px 14px 8px"}}>
      <ComplianceHillScene
        journeyStage={journeyStage}
        nextJourneyStage={nextJourneyStage}
        canClimb={canClimb}
        compliance={compliance}
        complianceAvg={complianceAvg}
        score={score}
        onClimb={onClimb}
        compact={true}
      />
    </div>
  );
}

/* ─── EVENT / DECISION CARD ─── */
function EventCard({ event, onResolve, avatar, businessType }) {
  const [revealed, setRevealed] = useState(null);
  const [chosen, setChosen] = useState(null);
  const [showAdvisor, setShowAdvisor] = useState(false);
  const [advisorMsg, setAdvisorMsg] = useState("");
  const [loadingAdvisor, setLoadingAdvisor] = useState(false);

  async function askAdvisor() {
    setShowAdvisor(true);
    if (advisorMsg) return;
    setLoadingAdvisor(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:1000,
          system:`You are a friendly Nigerian compliance advisor in a business simulation game. Give SHORT, practical advice (3-5 sentences max). Cite specific laws. Use ₦ for naira. Be warm and encouraging. The player is a ${businessType?.name} owner.`,
          messages:[{ role:"user", content:`I'm facing this compliance decision in my game: "${event.title}". The scenario: "${event.scene}". The decision: "${event.decision}". Give me a quick hint on what the right thing to do is and why, without just telling me which option to pick.` }]
        })
      });
      const d = await res.json();
      setAdvisorMsg(d.content?.[0]?.text || "Apply the principle of proactive compliance — it always costs less than reactive penalty.");
    } catch { setAdvisorMsg("Always choose compliance over convenience. The penalty for non-compliance is always higher than the cost of compliance in Nigerian law."); }
    setLoadingAdvisor(false);
  }

  function pick(choice, idx) {
    setChosen(idx); setRevealed(choice);
  }

  const priorityColor = { critical:"#FF4444", high:"#FFB800", medium:"#4ECDC4", low:"#95D44A" };
  const catIcons = { registration:"📜", tax:"💰", employment:"👥", data:"🔐", licences:"✅" };

  return (
    <div style={{animation:"cardIn .4s ease",padding:"0 0 20px"}}>
      {/* Event header */}
      <div style={{
        background:`linear-gradient(135deg,rgba(0,0,0,.8),rgba(10,10,30,.9))`,
        borderBottom:`3px solid ${priorityColor[event.priority]}`,
        padding:"16px 16px 14px",
      }}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
          <span style={{background:`${priorityColor[event.priority]}22`,border:`1px solid ${priorityColor[event.priority]}66`,color:priorityColor[event.priority],fontSize:10,fontWeight:800,padding:"3px 10px",borderRadius:99,letterSpacing:1}}>
            {event.priority.toUpperCase()} · {catIcons[event.category]} {event.category.toUpperCase()}
          </span>
        </div>
        <h2 style={{fontFamily:"'Fredoka One',cursive",fontSize:24,color:"#fff",margin:"0 0 6px",lineHeight:1.2}}>{event.title}</h2>
        <p style={{color:"rgba(255,255,255,.6)",fontSize:13,lineHeight:1.6,margin:0}}>{event.scene}</p>
      </div>

      <div style={{padding:"16px"}}>
        {/* Decision prompt */}
        <div style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.1)",borderRadius:14,padding:"12px 14px",marginBottom:16}}>
          <p style={{color:"#FFE566",fontSize:13,fontWeight:800,margin:"0 0 4px"}}>⚖️ Decision Required</p>
          <p style={{color:"rgba(255,255,255,.85)",fontSize:14,lineHeight:1.6,margin:0}}>{event.decision}</p>
        </div>

        {/* AI Advisor button */}
        {!revealed && (
          <button className="btn" onClick={askAdvisor} style={{
            width:"100%",padding:"10px",background:"rgba(167,139,250,.12)",
            border:"1px solid rgba(167,139,250,.3)",borderRadius:12,
            color:"#A78BFA",fontSize:13,fontWeight:700,marginBottom:14,
            display:"flex",alignItems:"center",justifyContent:"center",gap:8,
          }}>
            🤖 Ask AI Compliance Advisor
          </button>
        )}

        {/* Advisor message */}
        {showAdvisor && (
          <div style={{background:"rgba(167,139,250,.1)",border:"1px solid rgba(167,139,250,.3)",borderRadius:12,padding:"12px",marginBottom:14,animation:"fadeIn .3s"}}>
            <p style={{color:"#A78BFA",fontSize:11,fontWeight:700,marginBottom:4}}>🤖 ADVISOR SAYS:</p>
            {loadingAdvisor ? (
              <div style={{display:"flex",gap:5,alignItems:"center"}}>
                {[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:"#A78BFA",animation:`pulse 1.2s ${i*.2}s infinite`}}/>)}
              </div>
            ) : (
              <p style={{color:"rgba(255,255,255,.8)",fontSize:12,lineHeight:1.6,margin:0}}>{advisorMsg}</p>
            )}
          </div>
        )}

        {/* Choices */}
        {!revealed && (
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {event.choices.map((c,i)=>(
              <button key={i} className="btn" onClick={()=>pick(c,i)} style={{
                background: c.isWrong ? "rgba(255,68,68,.07)" : "rgba(255,255,255,.05)",
                border: c.isWrong ? "1px solid rgba(255,68,68,.2)" : "1px solid rgba(255,255,255,.12)",
                borderRadius:14, padding:"14px",
                textAlign:"left", color:"#fff",
                display:"flex", gap:12, alignItems:"flex-start",
              }}>
                <div style={{
                  width:28,height:28,borderRadius:"50%",flexShrink:0,
                  background:"rgba(255,255,255,.08)",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:11,fontWeight:800,color:"rgba(255,255,255,.5)",marginTop:1,
                }}>{String.fromCharCode(65+i)}</div>
                <div>
                  <p style={{fontSize:14,fontWeight:700,margin:"0 0 4px",lineHeight:1.4}}>{c.text}</p>
                  {c.cost>0&&<span style={{fontSize:11,color:"#FFB800",fontWeight:700}}>💸 Cost: ₦{c.cost.toLocaleString()}</span>}
                  {c.xp>0&&<span style={{fontSize:11,color:"#95D44A",fontWeight:700,marginLeft:c.cost>0?10:0}}>⚡ +{c.xp} XP</span>}
                  {c.revenue>0&&<span style={{fontSize:11,color:"#4ECDC4",fontWeight:700,marginLeft:8}}>📈 +₦{c.revenue.toLocaleString()}</span>}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Outcome */}
        {revealed && (
          <div style={{animation:"cardIn .3s ease"}}>
            <div style={{
              background: revealed.isWrong ? "rgba(255,68,68,.1)" : "rgba(0,200,100,.1)",
              border:`1.5px solid ${revealed.isWrong?"#FF4444":"#00c864"}`,
              borderRadius:16,padding:"16px",marginBottom:14,
            }}>
              <p style={{color:revealed.isWrong?"#FF4444":"#00c864",fontWeight:900,fontSize:15,marginBottom:8}}>
                {revealed.isWrong ? "❌ Non-Compliant Decision!" : "✅ Compliant Decision!"}
              </p>
              <p style={{color:"rgba(255,255,255,.85)",fontSize:13,lineHeight:1.7,marginBottom:10}}>{revealed.outcome}</p>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <span style={{background:"rgba(78,205,196,.15)",border:"1px solid rgba(78,205,196,.3)",color:"#4ECDC4",fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:99}}>
                  📚 {revealed.law}
                </span>
                {revealed.penalty&&<span style={{background:"rgba(255,68,68,.15)",border:"1px solid rgba(255,68,68,.3)",color:"#FF8888",fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:99}}>
                  💸 Penalty: ₦{revealed.penalty.toLocaleString()}
                </span>}
                {revealed.xp>0&&<span style={{background:"rgba(149,212,74,.15)",border:"1px solid rgba(149,212,74,.3)",color:"#95D44A",fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:99}}>
                  ⚡ +{revealed.xp} XP earned
                </span>}
              </div>
            </div>
            <button className="btn" onClick={()=>onResolve(revealed)} style={{
              width:"100%",padding:"16px",
              background:"linear-gradient(135deg,#008751,#00c46b)",
              color:"#fff",borderRadius:14,fontSize:16,fontWeight:900,
              boxShadow:"0 6px 24px rgba(0,135,81,.4)",
              fontFamily:"'Fredoka One',cursive",letterSpacing:.5,
            }}>
              Continue Running My Business →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── DASHBOARD ─── */
function Dashboard({ week, cash, revenue, xp, compliance, complianceAvg, weeklyRevenue, gameLog, collectiblesEarned, businessType, avatar, onAdvanceWeek, journeyStage, nextJourneyStage, canClimb, climbJourney, score }) {
  const getComplianceStatus = (avg) => {
    if (avg >= 70) return { label:"Excellent", color:"#00c864", emoji:"🟢" };
    if (avg >= 50) return { label:"Good", color:"#FFE566", emoji:"🟡" };
    if (avg >= 30) return { label:"At Risk", color:"#FFB800", emoji:"🟠" };
    return { label:"Critical", color:"#FF4444", emoji:"🔴" };
  };
  const status = getComplianceStatus(complianceAvg);
  const weeks_left = 12 - week;

  return (
    <div style={{padding:"0 14px 10px"}}>
      {/* Business hero */}
      <div style={{
        background:"linear-gradient(135deg,rgba(0,0,0,.8),rgba(10,10,40,.9))",
        borderRadius:20,border:`1px solid rgba(255,255,255,.1)`,
        padding:"16px",marginBottom:14,
        borderBottom:`3px solid ${avatar?.color||"#4ECDC4"}`,
      }}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
          <div style={{fontSize:40,filter:`drop-shadow(0 0 10px ${avatar?.color||"#4ECDC4"})`,animation:"float 3s ease-in-out infinite"}}>{businessType?.emoji}</div>
          <div style={{flex:1}}>
            <p style={{fontFamily:"'Fredoka One',cursive",fontSize:18,color:"#fff",margin:0}}>{businessType?.name}</p>
            <p style={{color:"rgba(255,255,255,.5)",fontSize:12,margin:0}}>{avatar?.emoji} {avatar?.name} · {businessType?.sector} · Week {week}/12</p>
          </div>
          <div style={{textAlign:"right"}}>
            <p style={{fontSize:10,color:"rgba(255,255,255,.4)",margin:0}}>CASH</p>
            <p style={{fontFamily:"'Fredoka One',cursive",fontSize:20,color:cash>0?"#FFE566":"#FF4444",margin:0}}>₦{Math.round(cash).toLocaleString()}</p>
          </div>
        </div>
        {/* Stats row */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
          {[
            { label:"Revenue", value:`₦${Math.round(revenue/1000)}K`, color:"#4ECDC4", icon:"📈" },
            { label:"XP", value:xp, color:"#FFE566", icon:"⚡" },
            { label:"Compliance", value:`${complianceAvg}%`, color:status.color, icon:status.emoji },
          ].map(s=>(
            <div key={s.label} style={{background:"rgba(255,255,255,.05)",borderRadius:12,padding:"8px 10px",textAlign:"center"}}>
              <p style={{fontSize:16,margin:0}}>{s.icon}</p>
              <p style={{fontFamily:"'Fredoka One',cursive",fontSize:16,color:s.color,margin:0}}>{s.value}</p>
              <p style={{fontSize:10,color:"rgba(255,255,255,.4)",margin:0}}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Week progress */}
      <div style={{marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
          <span style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,.5)"}}>Business Journey</span>
          <span style={{fontSize:12,fontWeight:700,color:"#4ECDC4"}}>{weeks_left} weeks remaining</span>
        </div>
        <div style={{background:"rgba(255,255,255,.08)",borderRadius:99,height:8,overflow:"hidden"}}>
          <div style={{width:`${(week/12)*100}%`,height:"100%",background:"linear-gradient(90deg,#008751,#4ECDC4)",borderRadius:99,transition:"width .5s"}}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:3}}>
          {[1,2,3,4,5,6,7,8,9,10,11,12].map(w=>(
            <div key={w} style={{width:8,height:8,borderRadius:"50%",background:w<=week?"#4ECDC4":"rgba(255,255,255,.1)"}}/>
          ))}
        </div>
      </div>

      {/* Graphical hill climb */}
      <div style={{marginBottom:14}}>
        <ComplianceHillScene
          journeyStage={journeyStage}
          nextJourneyStage={nextJourneyStage}
          canClimb={canClimb}
          compliance={compliance}
          complianceAvg={complianceAvg}
          score={score}
          onClimb={climbJourney}
          compact={false}
        />
      </div>

      {/* Compliance bars */}
      <div style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.08)",borderRadius:16,padding:"14px",marginBottom:14}}>
        <p style={{color:"rgba(255,255,255,.5)",fontSize:11,fontWeight:700,letterSpacing:1.5,marginBottom:10}}>COMPLIANCE HEALTH</p>
        {COMPLIANCE_CATS.map(c=>(
          <ComplianceBar key={c.id} label={c.label} icon={c.icon} value={compliance[c.id]||0} color={c.color}/>
        ))}
      </div>

      {/* Collectibles earned */}
      {collectiblesEarned.length > 0 && (
        <div style={{marginBottom:14}}>
          <p style={{color:"rgba(255,255,255,.5)",fontSize:11,fontWeight:700,letterSpacing:1.5,marginBottom:8}}>COMPLIANCE WINS EARNED</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {collectiblesEarned.slice(0,8).map((c,i)=>(
              <span key={i} style={{background:"rgba(0,200,100,.12)",border:"1px solid rgba(0,200,100,.3)",color:"#00c864",fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:99}}>✅ {c.split("_")[0]}</span>
            ))}
          </div>
        </div>
      )}

      {/* Advance week */}
      <button className="btn" onClick={onAdvanceWeek} style={{
        width:"100%",padding:"16px",
        background:"linear-gradient(135deg,#008751,#00c46b)",
        color:"#fff",borderRadius:14,fontSize:16,fontWeight:900,
        boxShadow:"0 6px 24px rgba(0,135,81,.4)",
        fontFamily:"'Fredoka One',cursive",letterSpacing:.5,
        marginBottom:14,
      }}>
        ⏩ Advance to Week {week+1}
      </button>

      {/* Recent log */}
      {gameLog.length > 0 && (
        <div>
          <p style={{color:"rgba(255,255,255,.5)",fontSize:11,fontWeight:700,letterSpacing:1.5,marginBottom:8}}>RECENT ACTIVITY</p>
          {gameLog.slice(0,4).map((l,i)=>(
            <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:8,opacity:1-i*.15}}>
              <span style={{fontSize:12,marginTop:1}}>{l.type==="success"?"✅":l.type==="warning"?"⚠️":l.type==="penalty"?"💸":"ℹ️"}</span>
              <div>
                <p style={{fontSize:12,color:"rgba(255,255,255,.75)",margin:0,lineHeight:1.4}}>{l.text}</p>
                {l.law&&<p style={{fontSize:10,color:"#4ECDC4",margin:0,marginTop:2}}>{l.law}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdventureMode({ avatar, businessType, complianceAvg, onCompleteLevel }) {
  const [levelIndex, setLevelIndex] = useState(0);
  const [climbMeter, setClimbMeter] = useState(0);
  const [jumpPower, setJumpPower] = useState(55);
  const [shotPower, setShotPower] = useState(55);
  const [shotAngle, setShotAngle] = useState(45);
  const [obstacleCleared, setObstacleCleared] = useState(false);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [feedback, setFeedback] = useState("Use the controls below to clear the first obstacle.");

  const level = ADVENTURE_LEVELS[levelIndex];
  const completedCount = levelIndex;

  useEffect(() => {
    setClimbMeter(0);
    setJumpPower(55);
    setShotPower(55);
    setShotAngle(45);
    setObstacleCleared(false);
    setQuizAnswered(false);
    setFeedback("New obstacle ahead. Clear it, then answer the compliance question.");
  }, [levelIndex]);

  function doClimbStep() {
    if (obstacleCleared) return;
    const next = Math.min(100, climbMeter + 12 + Math.floor(Math.random() * 15));
    setClimbMeter(next);
    if (next >= 100) {
      setObstacleCleared(true);
      setFeedback("Ridge cleared. Compliance quiz unlocked.");
    } else {
      setFeedback(`Climbing... grip stability ${next}%`);
    }
  }

  function attemptJump() {
    if (obstacleCleared) return;
    const [minP, maxP] = level.powerRange || [45, 75];
    const ok = jumpPower >= minP && jumpPower <= maxP;
    if (ok) {
      setObstacleCleared(true);
      setFeedback("Perfect jump. You crossed the valley.");
    } else {
      setFeedback(`Missed jump. Target power: ${minP}-${maxP}. Your power: ${jumpPower}.`);
    }
  }

  function attemptShot() {
    if (obstacleCleared) return;
    const [minA, maxA] = level.angleRange || [35, 60];
    const [minP, maxP] = level.powerRange || [45, 78];
    const ok = shotAngle >= minA && shotAngle <= maxA && shotPower >= minP && shotPower <= maxP;
    if (ok) {
      setObstacleCleared(true);
      setFeedback("Direct hit. Route unlocked.");
    } else {
      setFeedback(`Shot missed. Aim ${minA}-${maxA} deg and power ${minP}-${maxP}.`);
    }
  }

  function answerQuiz(index) {
    if (!obstacleCleared || quizAnswered) return;
    if (index === level.quiz.correct) {
      setQuizAnswered(true);
      onCompleteLevel(level);
      setFeedback("Correct. Regulation checkpoint completed.");
      return;
    }
    setFeedback("Not correct. Review the regulation hint and try again.");
  }

  function nextLevel() {
    if (!quizAnswered) return;
    setLevelIndex(i => Math.min(i + 1, ADVENTURE_LEVELS.length));
  }

  if (levelIndex >= ADVENTURE_LEVELS.length) {
    return (
      <div style={{padding:"8px 14px 12px"}}>
        <div style={{background:"linear-gradient(160deg,#0f2142,#1f6c50)",border:"1px solid rgba(255,255,255,.15)",borderRadius:18,padding:"18px",textAlign:"center"}}>
          <div style={{fontSize:46,marginBottom:8}}>🏆</div>
          <p style={{fontFamily:"'Fredoka One',cursive",fontSize:23,color:"#FFE566",margin:"0 0 6px"}}>Adventure Complete</p>
          <p style={{color:"rgba(255,255,255,.75)",fontSize:13,lineHeight:1.6,margin:"0 0 10px"}}>
            {avatar?.name || "You"} cleared all compliance terrains for {businessType?.name}. Keep playing decisions to improve your final score.
          </p>
          <p style={{color:"#95D44A",fontSize:13,fontWeight:800,margin:0}}>Levels cleared: {ADVENTURE_LEVELS.length}</p>
        </div>
      </div>
    );
  }

  const progressPct = Math.round((completedCount / ADVENTURE_LEVELS.length) * 100);
  const trackLeft = 12 + (completedCount / Math.max(1, ADVENTURE_LEVELS.length - 1)) * 76;

  return (
    <div style={{padding:"8px 14px 12px"}}>
      <div style={{background:"linear-gradient(160deg,#11213d,#184970 45%,#1d6e4f)",border:"1px solid rgba(255,255,255,.12)",borderRadius:18,overflow:"hidden",marginBottom:12}}>
        <div style={{padding:"12px 12px 8px",borderBottom:"1px solid rgba(255,255,255,.08)",display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
          <div>
            <p style={{color:"rgba(255,255,255,.5)",fontSize:10,fontWeight:700,letterSpacing:1.5,margin:0}}>ADVENTURE MODE</p>
            <p style={{color:"#fff",fontFamily:"'Fredoka One',cursive",fontSize:18,margin:"2px 0 0"}}>{level.name}</p>
            <p style={{color:"#FFE566",fontSize:11,fontWeight:700,margin:0}}>{level.regulationTag}</p>
          </div>
          <div style={{textAlign:"right"}}>
            <p style={{fontSize:11,color:"rgba(255,255,255,.5)",margin:0}}>Compliance Avg</p>
            <p style={{fontSize:18,color:complianceAvg > 55 ? "#00c864" : "#FFB800",fontFamily:"'Fredoka One',cursive",margin:0}}>{complianceAvg}%</p>
          </div>
        </div>

        <div style={{position:"relative",height:200,background:"linear-gradient(180deg,rgba(255,255,255,.07),rgba(0,0,0,.15))",overflow:"hidden"}}>
          <div style={{position:"absolute",left:0,right:0,bottom:-36,height:130,borderRadius:"55% 55% 0 0",background:"linear-gradient(180deg,#2c8f63,#1b5a43)"}}/>
          <div style={{position:"absolute",left:0,right:0,bottom:-44,height:92,borderRadius:"50% 50% 0 0",background:"linear-gradient(180deg,#3fa068,#27684a)"}}/>

          <svg viewBox="0 0 100 100" style={{position:"absolute",inset:0,width:"100%",height:"100%"}}>
            <path d="M5 84 Q24 69 40 64 Q55 55 67 44 Q79 33 92 26" fill="none" stroke="rgba(255,245,190,.9)" strokeWidth="2" strokeDasharray="3 2"/>
          </svg>

          <div style={{position:"absolute",left:"72%",bottom:level.terrain === "hill" ? "56%" : level.terrain === "valley" ? "35%" : "49%",fontSize:34,filter:"drop-shadow(0 6px 10px rgba(0,0,0,.35))"}}>
            {level.obstacleIcon}
          </div>

          <div style={{position:"absolute",left:`${trackLeft}%`,bottom:"40%",transform:"translateX(-50%)",fontSize:32,transition:"left .35s ease"}}>
            {avatar?.emoji || "🧑🏾‍💼"}
          </div>

          <div style={{position:"absolute",left:12,right:12,bottom:10,display:"flex",justifyContent:"space-between",gap:8}}>
            <span style={{background:"rgba(0,0,0,.42)",border:"1px solid rgba(255,255,255,.22)",borderRadius:99,padding:"4px 9px",fontSize:10,color:"#fff",fontWeight:800}}>
              Level {levelIndex + 1}/{ADVENTURE_LEVELS.length}
            </span>
            <span style={{background:"rgba(0,0,0,.42)",border:"1px solid rgba(255,255,255,.22)",borderRadius:99,padding:"4px 9px",fontSize:10,color:"#FFE566",fontWeight:800}}>
              Progress {progressPct}%
            </span>
          </div>
        </div>

        <div style={{padding:"12px",borderTop:"1px solid rgba(255,255,255,.08)"}}>
          <p style={{color:"rgba(255,255,255,.82)",fontSize:13,lineHeight:1.5,margin:"0 0 10px"}}>{level.objective}</p>

          {!obstacleCleared && level.mechanic === "climb" && (
            <div style={{display:"grid",gap:8}}>
              <div style={{background:"rgba(255,255,255,.08)",height:8,borderRadius:99,overflow:"hidden"}}>
                <div style={{width:`${climbMeter}%`,height:"100%",background:"linear-gradient(90deg,#00c864,#95D44A)",transition:"width .25s ease"}}/>
              </div>
              <button className="btn" onClick={doClimbStep} style={{padding:"11px",borderRadius:12,background:"linear-gradient(135deg,#2f8f5f,#00c46b)",color:"#fff",fontWeight:900}}>🧗 Grip and Climb</button>
            </div>
          )}

          {!obstacleCleared && level.mechanic === "jump" && (
            <div style={{display:"grid",gap:8}}>
              <label style={{color:"rgba(255,255,255,.7)",fontSize:11,fontWeight:700}}>Jump Power: {jumpPower}</label>
              <input type="range" min="0" max="100" value={jumpPower} onChange={(e)=>setJumpPower(Number(e.target.value))}/>
              <button className="btn" onClick={attemptJump} style={{padding:"11px",borderRadius:12,background:"linear-gradient(135deg,#2f8f5f,#00c46b)",color:"#fff",fontWeight:900}}>🏃 Jump Valley</button>
            </div>
          )}

          {!obstacleCleared && level.mechanic === "shoot" && (
            <div style={{display:"grid",gap:8}}>
              <label style={{color:"rgba(255,255,255,.7)",fontSize:11,fontWeight:700}}>Angle: {shotAngle} deg</label>
              <input type="range" min="10" max="80" value={shotAngle} onChange={(e)=>setShotAngle(Number(e.target.value))}/>
              <label style={{color:"rgba(255,255,255,.7)",fontSize:11,fontWeight:700}}>Power: {shotPower}</label>
              <input type="range" min="0" max="100" value={shotPower} onChange={(e)=>setShotPower(Number(e.target.value))}/>
              <button className="btn" onClick={attemptShot} style={{padding:"11px",borderRadius:12,background:"linear-gradient(135deg,#2f8f5f,#00c46b)",color:"#fff",fontWeight:900}}>🏹 Fire Arrow</button>
            </div>
          )}

          {obstacleCleared && (
            <div style={{marginTop:8,background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.12)",borderRadius:12,padding:"10px"}}>
              <p style={{color:"#FFE566",fontSize:12,fontWeight:800,margin:"0 0 6px"}}>Regulation Checkpoint</p>
              <p style={{color:"#fff",fontSize:13,lineHeight:1.5,margin:"0 0 8px"}}>{level.quiz.q}</p>
              <div style={{display:"grid",gap:6}}>
                {level.quiz.options.map((opt, idx)=>(
                  <button key={opt} className="btn" onClick={()=>answerQuiz(idx)} disabled={quizAnswered} style={{padding:"10px",borderRadius:10,textAlign:"left",background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.12)",color:"#fff",fontWeight:700}}>{String.fromCharCode(65 + idx)}. {opt}</button>
                ))}
              </div>

              {quizAnswered && (
                <button className="btn" onClick={nextLevel} style={{marginTop:10,width:"100%",padding:"12px",borderRadius:12,background:"linear-gradient(135deg,#008751,#00c46b)",color:"#fff",fontWeight:900}}>
                  Continue to Next Terrain →
                </button>
              )}
            </div>
          )}

          <p style={{margin:"10px 0 0",fontSize:12,color:"rgba(255,255,255,.72)",lineHeight:1.5}}>{feedback}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── GAME OVER / RESULTS ─── */
function Results({ week, cash, revenue, xp, compliance, complianceAvg, penalties, score, gameOver, businessType, avatar, journeyStage, onReplay, onMenu }) {
  const won = gameOver === "complete";
  const compTier = complianceAvg >= 70 ? "Compliance Champion 🏆" : complianceAvg >= 50 ? "Compliant Business ✅" : complianceAvg >= 30 ? "Needs Improvement ⚠️" : "Non-Compliant ❌";

  return (
    <div style={{width:"100%",height:"100dvh",background:`linear-gradient(160deg,${won?"#060614":"#1a0606"},${won?"#0d2137":"#2a0808"})`,display:"flex",flexDirection:"column",overflowY:"auto",padding:"0 16px 40px"}}>
      <div style={{paddingTop:50,textAlign:"center",marginBottom:24}}>
        <div style={{fontSize:80,marginBottom:12,animation:"bounce 2s ease-in-out infinite"}}>{won?"🏆":"💀"}</div>
        <h1 style={{fontFamily:"'Fredoka One',cursive",fontSize:36,color:won?"#FFE566":"#FF4444",textShadow:`0 0 24px ${won?"rgba(255,228,102,.5)":"rgba(255,68,68,.5)"}`,marginBottom:6}}>
          {won?"Business Complete!":"Business Closed!"}
        </h1>
        <p style={{color:"rgba(255,255,255,.5)",fontSize:14,marginBottom:4}}>
          {won?`${avatar?.name} ran ${businessType?.name} for 12 weeks`:`Compliance violations forced closure at Week ${week}`}
        </p>
        <p style={{color:"rgba(255,255,255,.35)",fontSize:12}}>{businessType?.desc}</p>
      </div>

      {/* Score card */}
      <div style={{background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",borderRadius:20,padding:"20px",marginBottom:20}}>
        <p style={{color:"rgba(255,255,255,.5)",fontSize:11,fontWeight:700,letterSpacing:2,marginBottom:14,textAlign:"center"}}>FINAL REPORT CARD</p>
        <div style={{display:"flex",justifyContent:"center",marginBottom:14}}>
          <span style={{background:"rgba(78,205,196,.12)",border:"1px solid rgba(78,205,196,.25)",color:"#4ECDC4",fontSize:11,fontWeight:800,padding:"5px 12px",borderRadius:99}}>
            {journeyStage?.icon} Reached: {journeyStage?.label || "Base Camp"}
          </span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
          {[
            { label:"Final Score",  value:score.toLocaleString(),          color:"#FFE566", icon:"🏆" },
            { label:"XP Earned",    value:xp,                              color:"#4ECDC4", icon:"⚡" },
            { label:"Revenue",      value:`₦${Math.round(revenue/1000)}K`, color:"#95D44A", icon:"📈" },
            { label:"Penalties",    value:`₦${Math.round(penalties/1000)}K`, color:"#FF4444", icon:"💸" },
            { label:"Cash Balance", value:`₦${Math.round(Math.max(0,cash)/1000)}K`, color: cash>0?"#FFE566":"#FF4444", icon:"💰" },
            { label:"Compliance",   value:`${complianceAvg}%`,             color:complianceAvg>60?"#00c864":complianceAvg>35?"#FFB800":"#FF4444", icon:"📊" },
          ].map(s=>(
            <div key={s.label} style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",borderRadius:14,padding:"12px",textAlign:"center"}}>
              <p style={{fontSize:20,margin:0}}>{s.icon}</p>
              <p style={{fontFamily:"'Fredoka One',cursive",fontSize:20,color:s.color,margin:"2px 0"}}>{s.value}</p>
              <p style={{fontSize:11,color:"rgba(255,255,255,.4)",margin:0}}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Compliance breakdown */}
        <p style={{color:"rgba(255,255,255,.5)",fontSize:11,fontWeight:700,letterSpacing:1.5,marginBottom:10}}>COMPLIANCE BREAKDOWN</p>
        {COMPLIANCE_CATS.map(c=><ComplianceBar key={c.id} label={c.label} icon={c.icon} value={compliance[c.id]||0} color={c.color}/>)}
      </div>

      {/* Verdict */}
      <div style={{
        background: complianceAvg>=70?"rgba(0,200,100,.1)":complianceAvg>=40?"rgba(255,184,0,.1)":"rgba(255,68,68,.1)",
        border:`1.5px solid ${complianceAvg>=70?"#00c864":complianceAvg>=40?"#FFB800":"#FF4444"}`,
        borderRadius:16,padding:"16px",marginBottom:20,textAlign:"center",
      }}>
        <p style={{fontFamily:"'Fredoka One',cursive",fontSize:22,color:complianceAvg>=70?"#00c864":complianceAvg>=40?"#FFB800":"#FF4444",marginBottom:6}}>{compTier}</p>
        <p style={{color:"rgba(255,255,255,.7)",fontSize:13,lineHeight:1.6,margin:0}}>
          {complianceAvg>=70
            ? "Outstanding! Your business maintained excellent compliance throughout. You're a model Nigerian entrepreneur."
            : complianceAvg>=50
            ? "Good effort! A few compliance gaps remain. In real life, these would attract regulatory attention. Study the law cards you missed."
            : complianceAvg>=30
            ? "Your business survived but is vulnerable. Non-compliant businesses face sudden shutdowns, frozen accounts, and personal liability for directors."
            : "Critical compliance failures. In real life, your business would have been shut down, directors prosecuted, and assets seized."
          }
        </p>
      </div>

      <button className="btn" onClick={onReplay} style={{width:"100%",padding:"16px",background:"linear-gradient(135deg,#008751,#00c46b)",color:"#fff",fontSize:18,borderRadius:14,fontFamily:"'Fredoka One',cursive",letterSpacing:.5,boxShadow:"0 6px 24px rgba(0,135,81,.4)",marginBottom:12}}>
        🔄 Play Again
      </button>
      <button className="btn" onClick={onMenu} style={{width:"100%",padding:"14px",background:"rgba(255,255,255,.07)",color:"rgba(255,255,255,.6)",fontSize:15,fontWeight:700,borderRadius:14,border:"1px solid rgba(255,255,255,.12)"}}>
        🏠 Main Menu
      </button>
    </div>
  );
}

/* ─── CHATBOT ─── */
function ChatScreen({ avatar, businessType, onBack }) {
  const [msgs, setMsgs] = useState([{r:"ai",t:`Ẹ káàbọ̀! 👋 I'm your ComplyNG AI Advisor. You're running ${businessType?.name} — ask me anything about your compliance obligations! 🇳🇬`}]);
  const [inp, setInp] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  useEffect(()=>endRef.current?.scrollIntoView({behavior:"smooth"}),[msgs]);

  const QUICK = ["Do I need NAFDAC?","What is WHT?","Explain PENCOM","Startup Act benefits","PAYE vs CIT difference"];

  async function send() {
    if(!inp.trim()||loading) return;
    const t=inp.trim(); setInp(""); setMsgs(m=>[...m,{r:"user",t}]); setLoading(true);
    try {
      const h=msgs.slice(-6).map(m=>({role:m.r==="ai"?"assistant":"user",content:m.t}));
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:`You are ComplyNG AI Advisor embedded in a Nigerian business compliance simulation game. The player is running "${businessType?.name}" in the ${businessType?.sector} sector. Keep answers concise (3-5 sentences). Cite specific Nigerian laws. Be warm and encouraging. Key facts: VAT=7.5%, small company CIT=0% (<₦25M), medium=20%, large=30%, PAYE to State IRS, pension=8%employee+10%employer, NSITF=1% payroll, NDPA 2023 fine=₦10M or 2% revenue.`,messages:[...h,{role:"user",content:t}]})});
      const d=await res.json();
      setMsgs(m=>[...m,{r:"ai",t:d.content?.[0]?.text||"Sorry, try again!"}]);
    } catch {setMsgs(m=>[...m,{r:"ai",t:"Network issue. Try again!"}]);}
    setLoading(false);
  }

  return (
    <div style={{position:"fixed",inset:0,zIndex:300,background:"linear-gradient(160deg,#0a0a1a,#1a1a2e)",display:"flex",flexDirection:"column",animation:"slideInR .3s ease",maxWidth:430,margin:"0 auto"}}>
      <div style={{padding:"46px 16px 14px",borderBottom:"1px solid rgba(255,255,255,.08)",display:"flex",alignItems:"center",gap:12,background:"rgba(0,0,0,.4)"}}>
        <div style={{fontSize:38,filter:"drop-shadow(0 0 8px #A78BFA)",animation:"float 3s ease-in-out infinite"}}>🤖</div>
        <div>
          <p style={{fontFamily:"'Fredoka One',cursive",color:"#A78BFA",fontSize:18,margin:0}}>ComplyNG AI</p>
          <p style={{color:"rgba(255,255,255,.4)",fontSize:11,margin:0}}>{businessType?.name} Compliance Advisor</p>
        </div>
        <button className="btn" onClick={onBack} style={{marginLeft:"auto",background:"rgba(255,255,255,.1)",color:"#fff",width:36,height:36,borderRadius:"50%",fontSize:18}}>×</button>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:16}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.r==="user"?"flex-end":"flex-start",marginBottom:12}}>
            {m.r==="ai"&&<div style={{width:30,height:30,borderRadius:"50%",background:"rgba(167,139,250,.2)",border:"1px solid rgba(167,139,250,.4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,marginRight:8,flexShrink:0,marginTop:2}}>🤖</div>}
            <div style={{maxWidth:"82%",background:m.r==="user"?"linear-gradient(135deg,#008751,#00c46b)":"rgba(255,255,255,.07)",borderRadius:m.r==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",padding:"11px 14px",fontSize:13,lineHeight:1.65,color:"#fff",border:m.r==="ai"?"1px solid rgba(255,255,255,.08)":"none",whiteSpace:"pre-wrap"}}>{m.t}</div>
          </div>
        ))}
        {loading&&<div style={{display:"flex",gap:8,marginBottom:12}}><div style={{width:30,height:30,borderRadius:"50%",background:"rgba(167,139,250,.2)",border:"1px solid rgba(167,139,250,.4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>🤖</div><div style={{background:"rgba(255,255,255,.07)",borderRadius:"18px 18px 18px 4px",padding:14,display:"flex",gap:5,alignItems:"center"}}>{[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:"#A78BFA",animation:`pulse 1.2s ${i*.2}s infinite`}}/>)}</div></div>}
        <div ref={endRef}/>
      </div>
      {msgs.length<=1&&<div style={{padding:"0 16px 8px",display:"flex",gap:8,overflowX:"auto"}}>{QUICK.map(q=><button key={q} className="btn" onClick={()=>setInp(q)} style={{background:"rgba(167,139,250,.15)",border:"1px solid rgba(167,139,250,.3)",borderRadius:99,padding:"6px 12px",whiteSpace:"nowrap",fontSize:12,fontWeight:700,color:"#A78BFA"}}>{q}</button>)}</div>}
      <div style={{padding:"10px 16px 28px",background:"rgba(0,0,0,.5)",borderTop:"1px solid rgba(255,255,255,.08)",display:"flex",gap:10}}>
        <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask about Nigerian compliance..." style={{flex:1,padding:"12px 16px",borderRadius:99,background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.15)",color:"#fff",fontSize:14,outline:"none"}}/>
        <button className="btn" onClick={send} disabled={!inp.trim()||loading} style={{width:46,height:46,borderRadius:"50%",background:inp.trim()?"#A78BFA":"rgba(255,255,255,.1)",color:inp.trim()?"#000":"#666",fontSize:20}}>↑</button>
      </div>
    </div>
  );
}

/* ─── LEADERBOARD ─── */
function LeaderboardScreen({ score, avatar, businessType, onBack }) {
  const mock = [
    {name:"Adaeze O.", score:4850, avatar:"👩🏾‍💼", biz:"Mama's Kitchen",    compliance:88},
    {name:"Emeka N.",  score:4200, avatar:"👨🏿‍💻", biz:"NaijaTech",         compliance:82},
    {name:"Fatima B.", score:3800, avatar:"👩🏽‍🌾", biz:"Green Fields Agro", compliance:79},
    {name:"Segun A.",  score:3200, avatar:"👨🏾‍⚕️", biz:"LifeCare Pharmacy", compliance:74},
    {name:"Ngozi E.",  score:2700, avatar:"👩🏾‍💼", biz:"Lagos Threads",     compliance:65},
    {name:"Bello M.",  score:1900, avatar:"👨🏿‍💻", biz:"PaySwift",          compliance:55},
  ];
  const all = [...mock, {name:"You", score, avatar:avatar?.emoji||"👤", biz:businessType?.name||"Your Business", compliance:50, isMe:true}].sort((a,b)=>b.score-a.score).map((u,i)=>({...u,rank:i+1}));
  const my = all.find(u=>u.isMe)?.rank||"—";

  return (
    <div style={{position:"fixed",inset:0,zIndex:300,background:"linear-gradient(160deg,#0a0a1a,#1a0d2e)",display:"flex",flexDirection:"column",animation:"slideInR .3s ease",maxWidth:430,margin:"0 auto"}}>
      <div style={{padding:"46px 16px 14px",borderBottom:"1px solid rgba(255,255,255,.08)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <p style={{color:"#FFE566",fontSize:11,fontWeight:700,letterSpacing:2,margin:0}}>COMPLIANCE CHAMPIONS</p>
          <h2 style={{fontFamily:"'Fredoka One',cursive",fontSize:28,color:"#fff",margin:0}}>Leaderboard 🏆</h2>
        </div>
        <button className="btn" onClick={onBack} style={{background:"rgba(255,255,255,.1)",color:"#fff",width:36,height:36,borderRadius:"50%",fontSize:18}}>×</button>
      </div>
      <div style={{padding:"12px 16px",background:"rgba(255,228,102,.07)",borderBottom:"1px solid rgba(255,228,102,.15)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:32}}>{avatar?.emoji}</span>
          <div><p style={{fontFamily:"'Fredoka One',cursive",color:"#FFE566",fontSize:15,margin:0}}>Your Rank: #{my}</p><p style={{color:"rgba(255,255,255,.45)",fontSize:11,margin:0}}>{businessType?.name}</p></div>
        </div>
        <span style={{fontFamily:"'Fredoka One',cursive",color:"#fff",fontSize:20}}>{score.toLocaleString()}</span>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:14}}>
        {all.map(u=>(
          <div key={u.name} style={{display:"flex",alignItems:"center",gap:10,background:u.isMe?"rgba(255,228,102,.1)":"rgba(255,255,255,.03)",border:u.isMe?"1px solid rgba(255,228,102,.3)":"1px solid rgba(255,255,255,.06)",borderRadius:14,padding:"11px 12px",marginBottom:8}}>
            <div style={{width:32,height:32,borderRadius:"50%",background:u.rank<=3?["rgba(255,215,0,.2)","rgba(192,192,192,.2)","rgba(205,127,50,.2)"][u.rank-1]:"rgba(255,255,255,.05)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:u.rank<=3?18:12,fontWeight:800,color:u.rank<=3?["#FFD700","#C0C0C0","#CD7F32"][u.rank-1]:"rgba(255,255,255,.4)"}}>{u.rank<=3?["🥇","🥈","🥉"][u.rank-1]:`#${u.rank}`}</div>
            <span style={{fontSize:24}}>{u.avatar}</span>
            <div style={{flex:1}}>
              <p style={{fontWeight:800,color:u.isMe?"#FFE566":"#fff",fontSize:13,margin:0}}>{u.name}{u.isMe?" (You)":""}</p>
              <div style={{display:"flex",alignItems:"center",gap:6,marginTop:2}}>
                <div style={{flex:1,background:"rgba(255,255,255,.1)",borderRadius:99,height:3,overflow:"hidden",maxWidth:60}}><div style={{width:`${u.compliance}%`,height:"100%",background:"#00c864",borderRadius:99}}/></div>
                <p style={{color:"rgba(255,255,255,.35)",fontSize:10,margin:0}}>{u.biz}</p>
              </div>
            </div>
            <span style={{fontFamily:"'Fredoka One',cursive",color:u.isMe?"#FFE566":"#4ECDC4",fontSize:13}}>{u.score.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── BOTTOM NAV ─── */
function BottomNav({ tab, setTab }) {
  return (
    <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:"rgba(6,6,20,.95)",borderTop:"1px solid rgba(255,255,255,.08)",display:"flex",zIndex:100,backdropFilter:"blur(12px)"}}>
      {[
        {id:"adventure", icon:"🏹", label:"Adventure"},
        {id:"game",  icon:"🏢", label:"Business"},
        {id:"chat",  icon:"🤖", label:"AI Advisor"},
        {id:"board", icon:"🏆", label:"Rankings"},
      ].map(item=>(
        <button key={item.id} className="btn" onClick={()=>setTab(item.id)} style={{flex:1,padding:"10px 4px 14px",background:"none",display:"flex",flexDirection:"column",alignItems:"center",gap:2,borderBottom:`3px solid ${tab===item.id?"#4ECDC4":"transparent"}`}}>
          <span style={{fontSize:20}}>{item.icon}</span>
          <span style={{fontSize:10,fontWeight:700,color:tab===item.id?"#4ECDC4":"rgba(255,255,255,.4)",letterSpacing:.5}}>{item.label}</span>
        </button>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SPLASH & SETUP SCREENS
═══════════════════════════════════════════════════════════════ */
function Splash({ onStart }) {
  return (
    <div style={{width:"100%",height:"100dvh",background:"linear-gradient(150deg,#060614,#0d1f3c 55%,#1a0a2e)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
      {Array.from({length:55}).map((_,i)=><div key={i} style={{position:"absolute",left:`${(i*73)%100}%`,top:`${(i*47)%100}%`,width:Math.random()*2.5+1,height:Math.random()*2.5+1,borderRadius:"50%",background:"#fff",animation:`pulse ${1+Math.random()*2}s ${Math.random()*2}s infinite`}}/>)}
      <div style={{position:"absolute",top:0,left:0,right:0,height:6,background:"linear-gradient(90deg,#008751 33%,#fff 33% 66%,#008751 66%)"}}/>
      <div style={{position:"absolute",top:14,right:14,background:"rgba(0,200,100,.16)",border:"1px solid rgba(0,200,100,.4)",borderRadius:99,padding:"6px 10px",color:"#00c864",fontSize:10,fontWeight:900,letterSpacing:1.1}}>
        CLIMB MODE V2 LIVE
      </div>
      <div style={{textAlign:"center",padding:"0 24px",position:"relative",animation:"fadeIn .8s ease"}}>
        <div style={{fontSize:84,marginBottom:10,animation:"float 3s ease-in-out infinite"}}>🇳🇬</div>
        <h1 style={{fontFamily:"'Fredoka One',cursive",fontSize:58,color:"#4ECDC4",letterSpacing:2,lineHeight:1,margin:"0 0 4px",animation:"neon 2.5s ease-in-out infinite"}}>ComplyNG</h1>
        <p style={{color:"#FFE566",fontSize:13,fontWeight:800,letterSpacing:4,marginBottom:6}}>BUILD · COMPLY · THRIVE</p>
        <p style={{color:"rgba(255,255,255,.5)",fontSize:13,margin:"0 auto 14px",maxWidth:290,lineHeight:1.65}}>
          Run a Nigerian business for 12 weeks. Make real compliance decisions. Face real consequences. Learn what it truly costs to operate legally in Nigeria.
        </p>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,184,0,.12)",border:"1px solid rgba(255,184,0,.35)",borderRadius:99,padding:"6px 12px",marginBottom:12}}>
          <span style={{fontSize:13}}>⛰️</span>
          <span style={{color:"#FFE566",fontSize:11,fontWeight:800,letterSpacing:.7}}>NEW: Block-to-Block Journey Progression</span>
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap",marginBottom:36}}>
          {["CAC","FIRS","CBN","NAFDAC","PENCOM","NDPA"].map(tag=><span key={tag} style={{background:"rgba(78,205,196,.12)",border:"1px solid rgba(78,205,196,.25)",color:"#4ECDC4",fontSize:10,fontWeight:700,padding:"4px 10px",borderRadius:99}}>{tag}</span>)}
        </div>
        <button className="btn" onClick={onStart} style={{background:"linear-gradient(135deg,#008751,#00c46b)",color:"#fff",fontSize:20,padding:"18px 54px",borderRadius:99,boxShadow:"0 8px 36px rgba(0,135,81,.55)",fontFamily:"'Fredoka One',cursive",letterSpacing:1,animation:"bounce 2s ease-in-out infinite"}}>
          START BUSINESS 🚀
        </button>
        <p style={{color:"rgba(255,255,255,.25)",fontSize:10,marginTop:18,letterSpacing:2}}>MICROSOFT AI SKILLS WEEK 2026 · REGTECH HACKATHON</p>
      </div>
    </div>
  );
}

function AvatarSelect({ onSelect }) {
  const [chosen, setChosen] = useState(null);
  return (
    <div style={{width:"100%",height:"100dvh",background:"linear-gradient(160deg,#0a0a1a,#1a0a2e)",overflowY:"auto"}}>
      <div style={{padding:"52px 16px 32px"}}>
        <p style={{color:"#4ECDC4",fontSize:11,fontWeight:700,letterSpacing:3,textAlign:"center",marginBottom:6}}>STEP 1 OF 2</p>
        <h2 style={{fontFamily:"'Fredoka One',cursive",fontSize:32,color:"#fff",textAlign:"center",marginBottom:4}}>Choose Your Entrepreneur</h2>
        <p style={{color:"rgba(255,255,255,.45)",textAlign:"center",fontSize:13,marginBottom:28}}>Who's building this business?</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:24}}>
          {AVATARS.map(av=>(
            <button key={av.id} className="btn" onClick={()=>setChosen(av.id)} style={{background:chosen===av.id?`linear-gradient(135deg,${av.color}30,${av.color}15)`:"rgba(255,255,255,.05)",border:chosen===av.id?`2px solid ${av.color}`:"1px solid rgba(255,255,255,.1)",borderRadius:20,padding:"20px 12px",display:"flex",flexDirection:"column",alignItems:"center",gap:7,transform:chosen===av.id?"scale(1.04)":"scale(1)",boxShadow:chosen===av.id?`0 8px 28px ${av.color}35`:"none",transition:"all .2s"}}>
              <div style={{fontSize:50,filter:chosen===av.id?`drop-shadow(0 0 12px ${av.color})`:"none",animation:chosen===av.id?"float 2s ease-in-out infinite":"none"}}>{av.emoji}</div>
              <span style={{fontFamily:"'Fredoka One',cursive",fontSize:16,color:chosen===av.id?av.color:"#fff"}}>{av.name}</span>
              <span style={{fontSize:10,color:"rgba(255,255,255,.5)",textAlign:"center"}}>{av.city} · {av.trait}</span>
              {chosen===av.id&&<span style={{background:av.color,color:"#000",fontSize:10,fontWeight:800,padding:"3px 10px",borderRadius:99}}>SELECTED ✓</span>}
            </button>
          ))}
        </div>
        <button className="btn" onClick={()=>chosen&&onSelect(AVATARS.find(a=>a.id===chosen))} style={{width:"100%",padding:"16px",borderRadius:99,fontSize:17,fontFamily:"'Fredoka One',cursive",background:chosen?"linear-gradient(135deg,#008751,#00c46b)":"rgba(255,255,255,.08)",color:chosen?"#fff":"rgba(255,255,255,.3)",boxShadow:chosen?"0 8px 30px rgba(0,135,81,.4)":"none"}}>
          {chosen?"Next: Choose Business →":"Select an entrepreneur first"}
        </button>
      </div>
    </div>
  );
}

function BusinessSelect({ onSelect }) {
  const [chosen, setChosen] = useState(null);
  const diffColor = { Easy:"#00c864", Medium:"#FFB800", Hard:"#FF6B35" };
  return (
    <div style={{width:"100%",height:"100dvh",background:"linear-gradient(160deg,#0a0a1a,#0d2137)",overflowY:"auto"}}>
      <div style={{padding:"52px 16px 32px"}}>
        <p style={{color:"#FFE566",fontSize:11,fontWeight:700,letterSpacing:3,textAlign:"center",marginBottom:6}}>STEP 2 OF 2</p>
        <h2 style={{fontFamily:"'Fredoka One',cursive",fontSize:32,color:"#fff",textAlign:"center",marginBottom:4}}>Choose Your Business</h2>
        <p style={{color:"rgba(255,255,255,.45)",textAlign:"center",fontSize:13,marginBottom:24}}>Each sector has unique compliance obligations</p>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>
          {BUSINESS_TYPES.map(bt=>(
            <button key={bt.id} className="btn" onClick={()=>setChosen(bt.id)} style={{background:chosen===bt.id?"rgba(255,255,255,.09)":"rgba(255,255,255,.04)",border:chosen===bt.id?"2px solid rgba(78,205,196,.6)":"1px solid rgba(255,255,255,.1)",borderRadius:16,padding:"14px 16px",textAlign:"left",display:"flex",alignItems:"center",gap:12,transform:chosen===bt.id?"scale(1.01)":"scale(1)",transition:"all .15s"}}>
              <div style={{width:48,height:48,borderRadius:12,background:"rgba(255,255,255,.06)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{bt.emoji}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2}}>
                  <p style={{fontFamily:"'Fredoka One',cursive",fontSize:16,color:"#fff",margin:0}}>{bt.name}</p>
                  <span style={{fontSize:10,fontWeight:800,color:diffColor[bt.difficulty],background:`${diffColor[bt.difficulty]}18`,border:`1px solid ${diffColor[bt.difficulty]}44`,padding:"2px 7px",borderRadius:99}}>{bt.difficulty}</span>
                </div>
                <p style={{color:"rgba(255,255,255,.45)",fontSize:12,margin:0}}>{bt.desc}</p>
                <p style={{color:"#FFE566",fontSize:11,fontWeight:700,margin:"3px 0 0"}}>Start Capital: ₦{bt.startCash.toLocaleString()}</p>
              </div>
              {chosen===bt.id&&<span style={{color:"#4ECDC4",fontSize:22,flexShrink:0}}>✓</span>}
            </button>
          ))}
        </div>
        <button className="btn" onClick={()=>chosen&&onSelect(BUSINESS_TYPES.find(b=>b.id===chosen))} style={{width:"100%",padding:"16px",borderRadius:99,fontSize:17,fontFamily:"'Fredoka One',cursive",background:chosen?"linear-gradient(135deg,#008751,#00c46b)":"rgba(255,255,255,.08)",color:chosen?"#fff":"rgba(255,255,255,.3)",boxShadow:chosen?"0 8px 30px rgba(0,135,81,.4)":"none"}}>
          {chosen?"Start My Business! 🚀":"Select a business first"}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════════════ */
export default function App() {
  const [screen, setScreen] = useState("splash");
  const [avatar, setAvatar] = useState(null);
  const [businessType, setBusinessType] = useState(null);
  const [tab, setTab] = useState("adventure");

  const engine = useGameEngine(businessType, avatar);

  function handleStart() { setScreen("avatarSelect"); }
  function handleAvatarSelect(av) { setAvatar(av); setScreen("businessSelect"); }
  function handleBusinessSelect(bt) { setBusinessType(bt); setScreen("game"); }
  function handleReplay() { setAvatar(null); setBusinessType(null); setTab("adventure"); setScreen("splash"); }

  // Game over
  useEffect(() => {
    if (engine.gameOver && screen === "game") setScreen("results");
  }, [engine.gameOver]);

  if (screen === "splash") return <><style>{CSS}</style><div className="root"><Splash onStart={handleStart}/></div></>;
  if (screen === "avatarSelect") return <><style>{CSS}</style><div className="root"><AvatarSelect onSelect={handleAvatarSelect}/></div></>;
  if (screen === "businessSelect") return <><style>{CSS}</style><div className="root"><BusinessSelect onSelect={handleBusinessSelect}/></div></>;
  if (screen === "results") return <><style>{CSS}</style><div className="root"><Results {...engine} businessType={businessType} avatar={avatar} onReplay={handleReplay} onMenu={handleReplay}/></div></>;

  return (
    <>
      <style>{CSS}</style>
      <div className="root">
        {/* Notifications overlay */}
        <div style={{position:"fixed",top:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,zIndex:500,padding:"10px 12px 0",pointerEvents:"none"}}>
          {engine.notifications.map(n=><Notification key={n.id} n={n}/>)}
        </div>

        {/* Top bar */}
        <div style={{
          background:"rgba(6,6,20,.95)",borderBottom:"1px solid rgba(255,255,255,.08)",
          padding:"46px 14px 10px",flexShrink:0,
          backdropFilter:"blur(12px)",
        }}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:22}}>🇳🇬</span>
              <span style={{fontFamily:"'Fredoka One',cursive",fontSize:20,color:"#4ECDC4",animation:"neon 3s ease-in-out infinite"}}>ComplyNG</span>
              <span style={{background:"rgba(0,200,100,.15)",border:"1px solid rgba(0,200,100,.35)",color:"#00c864",fontSize:9,fontWeight:900,padding:"3px 8px",borderRadius:99,letterSpacing:.7}}>CLIMB V2</span>
            </div>
            <div style={{display:"flex",gap:8}}>
              <div style={{background:"rgba(255,228,102,.12)",border:"1px solid rgba(255,228,102,.25)",borderRadius:99,padding:"4px 12px",display:"flex",alignItems:"center",gap:4}}>
                <span style={{fontSize:12}}>⚡</span>
                <span style={{fontFamily:"'Fredoka One',cursive",fontSize:14,color:"#FFE566"}}>{engine.xp}</span>
              </div>
              <div style={{background:"rgba(0,200,100,.12)",border:"1px solid rgba(0,200,100,.25)",borderRadius:99,padding:"4px 12px",display:"flex",alignItems:"center",gap:4}}>
                <span style={{fontSize:12}}>📊</span>
                <span style={{fontFamily:"'Fredoka One',cursive",fontSize:14,color:"#00c864"}}>{engine.complianceAvg}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="screen">
          {tab === "game" && (
            <JourneyRibbon
              journeyStage={engine.journeyStage}
              nextJourneyStage={engine.nextJourneyStage}
              canClimb={engine.canClimb}
              compliance={engine.compliance}
              complianceAvg={engine.complianceAvg}
              score={engine.score}
              onClimb={engine.climbJourney}
            />
          )}

          {tab === "adventure" && (
            <AdventureMode
              avatar={avatar}
              businessType={businessType}
              complianceAvg={engine.complianceAvg}
              onCompleteLevel={engine.completeAdventureLevel}
            />
          )}

          {tab === "game" && (
            engine.currentEvent ? (
              <EventCard
                event={engine.currentEvent}
                onResolve={engine.resolveEvent}
                avatar={avatar}
                businessType={businessType}
              />
            ) : (
              <Dashboard
                {...engine}
                businessType={businessType}
                avatar={avatar}
                onAdvanceWeek={engine.advanceWeek}
                journeyStage={engine.journeyStage}
                nextJourneyStage={engine.nextJourneyStage}
                canClimb={engine.canClimb}
                climbJourney={engine.climbJourney}
                score={engine.score}
              />
            )
          )}
          {tab === "chat" && <ChatScreen avatar={avatar} businessType={businessType} onBack={()=>setTab("game")}/>}
          {tab === "board" && <LeaderboardScreen score={engine.score} avatar={avatar} businessType={businessType} onBack={()=>setTab("game")}/>}
        </div>

        <BottomNav tab={tab} setTab={setTab}/>
      </div>
    </>
  );
}
