import type { Category, Letter, Usage } from "@/types";
export const categories: {
  id: Category;
  name: string;
  malayalam: string;
  description: string;
  glyph: string;
  color: string;
}[] = [
  {
    id: "vowels",
    name: "Vowels",
    malayalam: "സ്വരങ്ങൾ",
    description: "The sounds where it all begins",
    glyph: "അ",
    color: "sage",
  },
  {
    id: "consonants",
    name: "Consonants",
    malayalam: "വ്യഞ്ജനങ്ങൾ",
    description: "The building blocks of words",
    glyph: "ക",
    color: "peach",
  },
  {
    id: "chillu",
    name: "Chillu letters",
    malayalam: "ചില്ലക്ഷരങ്ങൾ",
    description: "Consonants without a vowel",
    glyph: "ൻ",
    color: "lavender",
  },
  {
    id: "signs",
    name: "Vowel signs",
    malayalam: "സ്വരചിഹ്നങ്ങൾ",
    description: "Give a consonant a new sound",
    glyph: "കാ",
    color: "yellow",
  },
  {
    id: "special",
    name: "Special signs",
    malayalam: "ചിഹ്നങ്ങൾ",
    description: "Small marks, meaningful changes",
    glyph: "ം",
    color: "blue",
  },
  {
    id: "conjuncts",
    name: "Conjuncts",
    malayalam: "കൂട്ടക്ഷരങ്ങൾ",
    description: "Discover how letters come together",
    glyph: "ക്ഷ",
    color: "pink",
  },
];
type Row = [string, string, string, string, Usage?];
const vowelRows: Row[] = [
  [
    "അ",
    "a",
    "a, as in about",
    "Short central /ɐ/; the inherent vowel of a bare consonant.",
  ],
  [
    "ആ",
    "ā",
    "long aa",
    "Open /aː/. Hold it longer than അ; vowel length changes meaning.",
  ],
  ["ഇ", "i", "short ee", "Short /i/. Keep it brief, unlike ഈ."],
  [
    "ഈ",
    "ī",
    "long ee, as in see",
    "Long /iː/. Same basic vowel quality as ഇ, held longer.",
  ],
  ["ഉ", "u", "short oo", "Short /u/, with rounded lips. Contrast with ഊ."],
  [
    "ഊ",
    "ū",
    "long oo, as in moon",
    "Long /uː/; hold the rounded vowel longer than ഉ.",
  ],
  [
    "ഋ",
    "r̥",
    "roughly ri",
    "Vocalic r; commonly realized with a short r-plus-vowel sound in Malayalam Sanskrit vocabulary. English ri is only a cue.",
  ],
  [
    "ഌ",
    "l̥",
    "",
    "Vocalic l, used in Sanskrit texts; not an everyday Malayalam vowel.",
    "scholarly",
  ],
  [
    "എ",
    "e",
    "short eh",
    "Short /e/. Keep the vowel steady without an English-style glide.",
  ],
  [
    "ഏ",
    "ē",
    "long eh",
    "Long /eː/; a steady vowel, not the diphthong in English day.",
  ],
  ["ഐ", "ai", "eye", "Diphthong /ai̯/: move from a toward i."],
  ["ഒ", "o", "short o", "Short /o/, rounded and steady. Contrast with ഓ."],
  ["ഓ", "ō", "long o", "Long /oː/. Avoid the strong glide of English go."],
  ["ഔ", "au", "ow, as in cow", "Diphthong /au̯/: move from a toward u."],
  [
    "ൠ",
    "r̥̄",
    "",
    "Long vocalic r in Sanskrit texts; uncommon in Malayalam.",
    "scholarly",
  ],
  [
    "ൡ",
    "l̥̄",
    "",
    "Long vocalic l in Sanskrit texts; not an everyday Malayalam vowel.",
    "scholarly",
  ],
  [
    "ൟ",
    "ī",
    "",
    "Archaic form of long ī; retained for historical texts.",
    "historic",
  ],
];
const consonantRows: Row[] = [
  [
    "ക",
    "ka",
    "kuh",
    "Velar /k/: the back of the tongue meets the soft palate. Includes the inherent a.",
  ],
  [
    "ഖ",
    "kha",
    "k with a puff of air",
    "Aspirated /kʰ/ in careful Sanskrit-derived pronunciation. Not the ch in Scottish loch.",
  ],
  ["ഗ", "ga", "g, as in go", "Voiced velar /ɡ/ with inherent a."],
  [
    "ഘ",
    "gha",
    "g with a puff of air",
    "Voiced aspirated velar stop in careful Sanskrit-derived pronunciation.",
  ],
  [
    "ങ",
    "ṅa",
    "ng, as in sing",
    "Velar nasal /ŋ/, made at the back of the mouth; letter form includes a.",
  ],
  [
    "ച",
    "ca",
    "ch, as in chin",
    "Unaspirated affricate /tʃ/; may vary with position. Roman c represents this sound.",
  ],
  [
    "ഛ",
    "cha",
    "ch with a puff of air",
    "Aspirated counterpart of ച, especially in Sanskrit-derived words.",
  ],
  ["ജ", "ja", "j, as in jam", "Voiced affricate /dʒ/ with inherent a."],
  [
    "ഝ",
    "jha",
    "j with a puff of air",
    "Aspirated counterpart of ജ, mainly in Sanskrit vocabulary.",
    "uncommon",
  ],
  [
    "ഞ",
    "ña",
    "ny, as in canyon",
    "Palatal nasal /ɲ/; tongue toward the hard palate.",
  ],
  [
    "ട",
    "ṭa",
    "t with tongue curled back",
    "Retroflex /ʈ/. Curl the tongue tip back; distinct from dental ത.",
  ],
  [
    "ഠ",
    "ṭha",
    "retroflex t with a puff",
    "Aspirated retroflex stop; tongue curled back.",
  ],
  [
    "ഡ",
    "ḍa",
    "d with tongue curled back",
    "Voiced retroflex /ɖ/. Distinct from dental ദ.",
  ],
  [
    "ഢ",
    "ḍha",
    "retroflex d with a puff",
    "Aspirated retroflex voiced stop, mainly in Sanskrit vocabulary.",
  ],
  [
    "ണ",
    "ṇa",
    "n with tongue curled back",
    "Retroflex nasal /ɳ/. Unlike dental ന; ൻ is a vowel-less n form.",
  ],
  [
    "ത",
    "ta",
    "t at the teeth",
    "Dental /t̪/: tongue touches the upper teeth, not curled back as for ട.",
  ],
  [
    "ഥ",
    "tha",
    "dental t with a puff",
    "Aspirated /t̪ʰ/, not English th in thin.",
  ],
  [
    "ദ",
    "da",
    "d at the teeth",
    "Voiced dental /d̪/: tongue at the upper teeth.",
  ],
  [
    "ധ",
    "dha",
    "dental d with a puff",
    "Aspirated voiced dental stop, not English th in this.",
  ],
  [
    "ന",
    "na",
    "n at the teeth",
    "Dental nasal /n̪/ in its dental context; position can affect realization. ണ is retroflex; ൻ has no inherent a.",
  ],
  ["പ", "pa", "p, as in spin", "Unaspirated /p/ with inherent a."],
  [
    "ഫ",
    "pha",
    "p with a puff of air",
    "Traditionally /pʰ/; also used for /f/ in some loanwords.",
  ],
  ["ബ", "ba", "b, as in bat", "Voiced bilabial /b/ with inherent a."],
  [
    "ഭ",
    "bha",
    "b with a puff of air",
    "Voiced aspirated bilabial stop in careful Sanskrit-derived pronunciation.",
  ],
  ["മ", "ma", "m, as in mother", "Bilabial nasal /m/: close both lips."],
  ["യ", "ya", "y, as in yes", "Palatal approximant /j/."],
  [
    "ര",
    "ra",
    "a light tapped r",
    "Usually a light alveolar tap /ɾ/, distinct from റ.",
  ],
  [
    "ല",
    "la",
    "l, as in leaf",
    "Alveolar lateral /l/. ള is retroflex; ഴ is a retroflex approximant with no exact English equivalent.",
  ],
  [
    "വ",
    "va",
    "between English v and w",
    "Labiodental approximant /ʋ/; English v or w is only an approximation.",
  ],
  [
    "ശ",
    "śa",
    "a light sh",
    "Palatal sibilant, often /ɕ/ or /ʃ/. Distinct letter from ഷ.",
  ],
  [
    "ഷ",
    "ṣa",
    "sh with tongue back",
    "Retroflex sibilant /ʂ/ in careful Sanskrit pronunciation; may merge with ശ in speech.",
  ],
  ["സ", "sa", "s, as in sun", "Voiceless /s/."],
  ["ഹ", "ha", "h, as in house", "Glottal /h/ with inherent a."],
  [
    "ള",
    "ḷa",
    "l with tongue curled back",
    "Retroflex lateral /ɭ/; air passes at the sides. Distinct from ല and ഴ.",
  ],
  [
    "ഴ",
    "ḻa",
    "often written zha",
    "Retroflex approximant /ɻ/; curl the tongue back without making a lateral l. English zh is a spelling cue, not /ʒ/.",
  ],
  [
    "റ",
    "ṟa",
    "a stronger r",
    "Alveolar trill /r/ in many contexts, contrasting with ര; doubled forms have special stop readings.",
  ],
  [
    "ഩ",
    "ṉa",
    "",
    "Scholarly alveolar nasal letter; not ordinarily used in modern spelling.",
    "scholarly",
  ],
  [
    "ഺ",
    "ṯa",
    "",
    "Scholarly alveolar stop letter; not ordinarily used in modern spelling.",
    "scholarly",
  ],
];
const chilluRows: Row[] = [
  [
    "ൺ",
    "ṇ",
    "retroflex n",
    "Vowel-less retroflex nasal, related to ണ. Do not add a.",
  ],
  [
    "ൻ",
    "n",
    "n without a vowel",
    "Vowel-less n. Unlike ന (na), this chillu has no inherent vowel; not the retroflex nasal ണ.",
  ],
  [
    "ർ",
    "r",
    "r without a vowel",
    "Vowel-less r. A chillu is not an independent vowel or a vowel sign.",
  ],
  ["ൽ", "l", "l without a vowel", "Vowel-less alveolar l, related to ല."],
  [
    "ൾ",
    "ḷ",
    "retroflex l without a vowel",
    "Vowel-less retroflex lateral, related to ള.",
  ],
  [
    "ൿ",
    "k",
    "k without a vowel",
    "Encoded chillu k; uncommon in ordinary modern Malayalam.",
    "uncommon",
  ],
  ["ൔ", "m", "", "Historic chillu m; no inherent vowel.", "historic"],
  ["ൕ", "y", "", "Historic chillu y; no inherent vowel.", "historic"],
  [
    "ൖ",
    "ḻ",
    "",
    "Historic chillu retroflex approximant; no inherent vowel.",
    "historic",
  ],
];
const signRows: Row[] = [
  ["ാ", "ā", "long aa", "Replaces the inherent a with ā: ക + ാ → കാ."],
  ["ി", "i", "short ee", "Short i after a consonant: കി (ki)."],
  ["ീ", "ī", "long ee", "Long ī after a consonant: കീ (kī)."],
  ["ു", "u", "short oo", "Short u after a consonant: കു (ku)."],
  ["ൂ", "ū", "long oo", "Long ū after a consonant: കൂ (kū)."],
  [
    "ൃ",
    "r̥",
    "roughly ri",
    "Dependent vocalic r: കൃ (kr̥). Mainly in Sanskrit-derived vocabulary.",
  ],
  [
    "െ",
    "e",
    "short eh",
    "Short e: കെ (ke). Stored after the consonant though rendered to its left.",
  ],
  ["േ", "ē", "long eh", "Long ē: കേ (kē). Distinct from short െ."],
  ["ൈ", "ai", "eye", "Diphthong ai: കൈ (kai)."],
  [
    "ൊ",
    "o",
    "short o",
    "Short o: കൊ (ko). Parts display on either side of the consonant.",
  ],
  ["ോ", "ō", "long o", "Long ō: കോ (kō). Do not confuse with short ൊ."],
  [
    "ൗ",
    "au",
    "ow",
    "Modern au sign: കൗ (kau). Unicode names this the AU LENGTH MARK.",
  ],
  [
    "ൌ",
    "au",
    "ow",
    "Two-part au sign: കൌ. Traditional variant, not an additional vowel sound.",
    "uncommon",
  ],
  ["ൄ", "r̥̄", "", "Dependent long vocalic r for Sanskrit.", "scholarly"],
  ["ൢ", "l̥", "", "Dependent vocalic l for Sanskrit.", "scholarly"],
  ["ൣ", "l̥̄", "", "Dependent long vocalic l for Sanskrit.", "scholarly"],
];
const specialRows: Row[] = [
  [
    "ം",
    "ṁ",
    "a closing nasal",
    "Anusvara. Commonly represents a syllable-final m-like nasal in Malayalam; context matters.",
  ],
  [
    "ഃ",
    "ḥ",
    "a breath after the vowel",
    "Visarga, mainly in Sanskrit-derived vocabulary.",
  ],
  [
    "്",
    "∅",
    "",
    "Chandrakkala (virama) removes the inherent vowel and joins consonants. Word-finally it can also indicate a short reduced vowel, called half-u.",
  ],
  [
    "ഁ",
    "m̐",
    "",
    "Candrabindu: a nasalization sign used in Sanskrit texts.",
    "scholarly",
  ],
  [
    "ഽ",
    "’",
    "",
    "Avagraha: marks an elided vowel in Sanskrit texts; not a pronounced letter.",
    "scholarly",
  ],
  [
    "ഀ",
    "ṁ (historic)",
    "",
    "Combining anusvara above, used in certain Prakrit texts; not an everyday Malayalam sign.",
    "historic",
  ],
  [
    "ഄ",
    "ṁ (Vedic)",
    "",
    "Vedic anusvara letter; a specialized textual sign.",
    "scholarly",
  ],
  [
    "഻",
    "∅ (vertical)",
    "",
    "Historic vertical-bar virama: indicates a consonant without its inherent vowel.",
    "historic",
  ],
  [
    "഼",
    "∅ (circular)",
    "",
    "Historic circular virama: indicates a consonant without its inherent vowel.",
    "historic",
  ],
  [
    "ൎ",
    "r (reph)",
    "",
    "Dot reph, an alternate representation of initial r in a consonant cluster; mainly traditional orthography.",
    "uncommon",
  ],
];
const conjunctRows: Row[] = [
  [
    "ക്ക",
    "kka",
    "held k",
    "ക + ് + ക. A geminate (long) k, not two separate syllables.",
  ],
  ["ങ്ങ", "ṅṅa", "held ng", "ങ + ് + ങ. A long velar nasal."],
  ["ച്ച", "cca", "held ch", "ച + ് + ച. A geminate affricate."],
  ["ഞ്ഞ", "ñña", "held ny", "ഞ + ് + ഞ. A long palatal nasal."],
  [
    "ട്ട",
    "ṭṭa",
    "held retroflex t",
    "ട + ് + ട. Tongue curled back; keep the closure longer.",
  ],
  ["ണ്ണ", "ṇṇa", "held retroflex n", "ണ + ് + ണ. A long retroflex nasal."],
  ["ത്ത", "tta", "held dental t", "ത + ് + ത. Dental, unlike retroflex ട്ട."],
  [
    "ന്ന",
    "nna",
    "held n",
    "ന + ് + ന. A long nasal; realization depends on context.",
  ],
  ["പ്പ", "ppa", "held p", "പ + ് + പ. A long bilabial stop."],
  ["മ്മ", "mma", "held m", "മ + ് + മ. A long bilabial nasal."],
  ["ല്ല", "lla", "held l", "ല + ് + ല. A long alveolar lateral."],
  ["ള്ള", "ḷḷa", "held retroflex l", "ള + ് + ള. A long retroflex lateral."],
  ["ങ്ക", "ṅka", "ng followed by k", "ങ + ് + ക. Velar nasal followed by k."],
  [
    "ന്ത",
    "nta",
    "n followed by dental t",
    "ന + ് + ത. Dental nasal-stop sequence.",
  ],
  ["മ്പ", "mpa", "m followed by p", "മ + ് + പ. Bilabial nasal-stop sequence."],
  [
    "ക്ഷ",
    "kṣa",
    "k followed by retroflex sh",
    "ക + ് + ഷ. A consonant combination, not a separate base letter.",
  ],
  [
    "ജ്ഞ",
    "jña",
    "",
    "ജ + ് + ഞ. Conventional transliteration jña; Malayalam pronunciation is context-dependent, often a long palatal nasal.",
  ],
  [
    "ത്ര",
    "tra",
    "dental t followed by r",
    "ത + ് + ര. The r component may appear to the left of the base glyph.",
  ],
  [
    "ശ്ര",
    "śra",
    "sh followed by r",
    "ശ + ് + ര. A common Sanskrit-derived combination.",
  ],
];
function make(
  category: Category,
  rows: Row[],
  subgroup: (i: number) => string,
): Letter[] {
  return rows.map(
    ([glyph, romanization, approximation, note, usage = "core"], i) => ({
      id: `${category}-${Array.from(glyph)
        .map((c) => c.codePointAt(0)!.toString(16))
        .join("-")}`,
      glyph,
      category,
      romanization,
      approximation: approximation || undefined,
      note,
      usage,
      subgroup: subgroup(i),
      order: i,
      display:
        category === "signs" ||
        (category === "special" && !["ഽ", "ഄ"].includes(glyph))
          ? `◌${glyph}`
          : glyph,
    }),
  );
}
export const letters: Letter[] = [
  ...make("vowels", vowelRows, () => "Independent vowels"),
  ...make("consonants", consonantRows, (i) =>
    i < 25
      ? ["Velar", "Palatal", "Retroflex", "Dental", "Labial"][Math.floor(i / 5)]
      : i < 36
        ? "Other consonants"
        : "Scholarly forms",
  ),
  ...make("chillu", chilluRows, () => "Pure consonants"),
  ...make("signs", signRows, () => "Dependent vowels"),
  ...make("special", specialRows, () => "Orthographic signs"),
  ...make("conjuncts", conjunctRows, (i) =>
    i < 12 ? "Doubled consonants" : "Consonant combinations",
  ),
];
export const letterById = Object.fromEntries(
  letters.map((l) => [l.id, l]),
) as Record<string, Letter>;
export const coreLetters = letters.filter((l) => l.usage === "core");
export const sources = [
  {
    name: "Unicode Malayalam character chart",
    url: "https://www.unicode.org/charts/PDF/U0D00.pdf",
  },
  {
    name: "Unicode Standard · Malayalam orthography",
    url: "https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-12/#G6969",
  },
  {
    name: "Richard Ishida · Malayalam orthography notes",
    url: "https://r12a.github.io/scripts/mlym/ml.html",
  },
];
