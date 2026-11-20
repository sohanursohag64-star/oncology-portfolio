/**
 * All site copy lives here.
 *
 * IMPORTANT — nothing about the doctor is invented. Every value wrapped in
 * square brackets ("[...]") is a placeholder that must be replaced with the
 * doctor's real, verifiable details before launch. Sections that would need
 * real facts (credentials, affiliations, publications) render as clearly
 * marked placeholders until filled in.
 *
 * Language rule: Bengali-first. Established medical terms stay in English.
 */

export const doctor = {
  name: "ডা. মোঃ সোহানুর রহমান",
  nameEn: "Dr. Md. Sohanur Rahman",
  title: "Medical Oncologist",
  /** e.g. "MBBS, FCPS (Medicine), MD (Oncology)" — leave empty until verified. */
  degrees: "MBBS, MD (Medical Oncology)",
  /** Real hospital / chamber name. */
  affiliation: "SMSS Cancer Centre",
  /** Path under /public, e.g. "/doctor.jpg" (portrait, ~4:5). null → illustrated placeholder. */
  portrait: "/doctor.webp" as string | null,
  phone: "[ফোন নম্বর]",
  email: "[ইমেইল]",
  address: "বগুড়া",
  hours: "[সাক্ষাতের সময়]",
};

export const nav = [
  { href: "#about", label: "পরিচিতি" },
  { href: "#expertise", label: "Expertise" },
  { href: "#approach", label: "চিকিৎসা পদ্ধতি" },
  { href: "#publications", label: "Publications" },
  { href: "#contact", label: "যোগাযোগ" },
];

export const hero = {
  eyebrow: "Medical Oncology",
  titleLines: ["বিজ্ঞানভিত্তিক", "ক্যান্সার চিকিৎসা,", "মানবিক যত্নে"],
  lede:
    "প্রতিটি রোগীর রোগ, শরীর ও জীবন আলাদা। আধুনিক গবেষণালব্ধ প্রমাণ আর ব্যক্তিগত মনোযোগ মিলিয়ে তৈরি হোক আপনার চিকিৎসা পরিকল্পনা।",
  primaryCta: "অ্যাপয়েন্টমেন্ট নিন",
  secondaryCta: "চিকিৎসা পদ্ধতি দেখুন",
  /** Care principle shown on the floating glass card (a philosophy, not a claim). */
  principle: {
    title: "ব্যক্তিগত চিকিৎসা পরিকল্পনা",
    text: "রোগের ধরন, Biomarker ও আপনার জীবনযাত্রা বিবেচনা করে তৈরি পরিকল্পনা।",
  },
  /** Patient-education teaser card (no clinical claims). */
  card: {
    kicker: "রোগী শিক্ষা",
    title: "Biopsy রিপোর্ট হাতে পেলে প্রথমে কী জানা দরকার?",
    meta: "পড়ুন · ৪ মিনিট",
  },
};

export const about = {
  kicker: "পরিচিতি",
  title: ["রোগ নয়,", "মানুষকে কেন্দ্র করে", "চিকিৎসা"],
  body: [
    "ডা. মোঃ সোহানুর রহমান একজন Medical Oncologist। তিনি MBBS ও Medical Oncology-তে MD ডিগ্রিধারী এবং বগুড়ার SMSS Cancer Centre-এ ক্যান্সার রোগীদের চিকিৎসা দিচ্ছেন।",
    "Medical Oncology হলো ক্যান্সারের ওষুধভিত্তিক চিকিৎসার শাখা — যেমন Chemotherapy, Targeted Therapy, Immunotherapy ও Hormonal Therapy। Surgeon ও Radiation Oncologist-এর সঙ্গে সমন্বয় করে পুরো চিকিৎসাযাত্রা পরিচালনা করা এর মূল দায়িত্ব।",
  ],
  /** Credential slots — fill with real, verifiable facts only. */
  facts: [
    { label: "যোগ্যতা", value: "MBBS, MD (Medical Oncology)" },
    { label: "কর্মস্থল", value: "SMSS Cancer Centre, বগুড়া" },
  ],
  /** Optional — the doctor's own words. Leave empty to hide the quote card. */
  quote: "",
};

export type ModelKind = "dna" | "cell" | "antibody" | "molecule";

/**
 * Areas of Medical Oncology explained for patients. These describe the field,
 * not the doctor's personal record — confirm the list matches their practice.
 */
export const expertise: {
  id: string;
  model: ModelKind;
  tag: string;
  title: string;
  summary: string;
  points: string[];
  caption: string;
}[] = [
  {
    id: "precision",
    model: "dna",
    tag: "Precision Oncology",
    title: "জিনগত পরিবর্তন বুঝে চিকিৎসা",
    summary:
      "কিছু ক্যান্সারে নির্দিষ্ট জিনগত পরিবর্তন (mutation) পাওয়া যায়। Biomarker ও Genomic testing সেই পরিবর্তন শনাক্ত করে, যাতে উপযুক্ত ক্ষেত্রে Targeted Therapy বেছে নেওয়া যায়।",
    points: ["Biomarker testing", "Targeted Therapy", "Genetic counselling-এ রেফারাল"],
    caption: "চিত্র: DNA double helix — base pair-গুলো দুই strand-কে যুক্ত রাখে। সরলীকৃত মডেল।",
  },
  {
    id: "chemo",
    model: "molecule",
    tag: "Chemotherapy",
    title: "দ্রুত বিভাজিত কোষকে লক্ষ্য করে",
    summary:
      "Chemotherapy-র ওষুধ মূলত দ্রুত বিভাজনরত কোষের বৃদ্ধি থামায়। ডোজ, সময়সূচি ও পার্শ্বপ্রতিক্রিয়া ব্যবস্থাপনা প্রতিটি রোগীর জন্য আলাদাভাবে পরিকল্পনা করা হয়।",
    points: ["Treatment cycle পরিকল্পনা", "Side-effect ব্যবস্থাপনা", "Day-care চিকিৎসা সমন্বয়"],
    caption: "চিত্র: ছোট অণুর ball-and-stick মডেল — কোনো নির্দিষ্ট ওষুধের প্রকৃত গঠন নয়।",
  },
  {
    id: "immuno",
    model: "antibody",
    tag: "Immunotherapy",
    title: "রোগ প্রতিরোধ ব্যবস্থাকে সক্রিয় করা",
    summary:
      "Immunotherapy শরীরের নিজস্ব রোগ প্রতিরোধ ব্যবস্থাকে ক্যান্সার কোষ চিনতে সাহায্য করে। অনেক Immunotherapy ওষুধ হলো monoclonal antibody — Y-আকৃতির প্রোটিন।",
    points: ["Checkpoint inhibitor", "Monoclonal antibody", "Immune-related side-effect পর্যবেক্ষণ"],
    caption: "চিত্র: Antibody (IgG)-এর সরলীকৃত Y-আকৃতি — দুটি heavy ও দুটি light chain।",
  },
  {
    id: "cell",
    model: "cell",
    tag: "Cancer Biology",
    title: "কোষ থেকেই শুরু বোঝাপড়া",
    summary:
      "ক্যান্সার হলো কোষের অনিয়ন্ত্রিত বৃদ্ধি। রোগের ধরন, stage ও কোষের বৈশিষ্ট্য বুঝে Surgery, Radiotherapy ও ওষুধের সঠিক ক্রম ঠিক করা হয় — multidisciplinary আলোচনার মাধ্যমে।",
    points: ["Staging ও রিপোর্ট ব্যাখ্যা", "Multidisciplinary পরিকল্পনা", "Palliative ও Supportive care"],
    caption: "চিত্র: কোষের সরলীকৃত cross-section — nucleus, cytoplasm ও কোষঝিল্লি।",
  },
];

export const approach = {
  kicker: "চিকিৎসা পদ্ধতি",
  title: "পরিকল্পিত, স্বচ্ছ, ধাপে ধাপে",
  steps: [
    { n: "০১", title: "প্রথম পরামর্শ", text: "রোগের ইতিহাস, পূর্ববর্তী রিপোর্ট ও আপনার প্রশ্ন — সময় নিয়ে শোনা।" },
    { n: "০২", title: "রোগ নির্ণয় পর্যালোচনা", text: "Biopsy, Imaging ও প্রয়োজনীয় Biomarker পরীক্ষার ভিত্তিতে Staging।" },
    { n: "০৩", title: "চিকিৎসা পরিকল্পনা", text: "Evidence-based guideline অনুসরণ করে, আপনার পছন্দ ও জীবনযাত্রা বিবেচনায়।" },
    { n: "০৪", title: "চিকিৎসা ও Follow-up", text: "নিয়মিত পর্যবেক্ষণ, পার্শ্বপ্রতিক্রিয়া ব্যবস্থাপনা ও পরিবারের সঙ্গে যোগাযোগ।" },
  ],
};

/**
 * Publications — intentionally empty placeholders. Replace with the doctor's
 * real papers (title, journal, year, DOI). Cards with `placeholder: true`
 * show a "যোগ করুন" label so nothing fictional is ever presented as real.
 */
export const publications: {
  title: string;
  journal: string;
  year: string;
  href?: string;
  cover: "helix" | "cells" | "network" | "waves";
  placeholder?: boolean;
}[] = [
  { title: "[প্রকাশনার শিরোনাম]", journal: "[Journal]", year: "[Year]", cover: "helix", placeholder: true },
  { title: "[প্রকাশনার শিরোনাম]", journal: "[Journal]", year: "[Year]", cover: "cells", placeholder: true },
  { title: "[প্রকাশনার শিরোনাম]", journal: "[Journal]", year: "[Year]", cover: "network", placeholder: true },
  { title: "[প্রকাশনার শিরোনাম]", journal: "[Journal]", year: "[Year]", cover: "waves", placeholder: true },
];

export const contact = {
  kicker: "যোগাযোগ",
  title: "আপনার প্রশ্ন নিয়ে কথা বলুন",
  text: "অ্যাপয়েন্টমেন্টের সময় আগের সব রিপোর্ট, Biopsy slide/block-এর তথ্য ও চলমান ওষুধের তালিকা সঙ্গে আনুন।",
  disclaimer:
    "এই ওয়েবসাইটের তথ্য শুধুমাত্র সাধারণ শিক্ষার উদ্দেশ্যে; এটি ব্যক্তিগত চিকিৎসা পরামর্শের বিকল্প নয়। জরুরি অবস্থায় নিকটস্থ হাসপাতালে যোগাযোগ করুন।",
};
