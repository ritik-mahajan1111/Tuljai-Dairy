// ==========================================
// Tuljai Dairy
// Local Customer Name Transliteration
// Hindi / Marathi
// No API - No Internet Required
// ==========================================

// ==========================================
// Common Names - Accurate Transliteration
// ==========================================
const commonNames = {
    rahul: "राहुल",
    ramesh: "रमेश",
    suresh: "सुरेश",
    mahesh: "महेश",
    ganesh: "गणेश",
    gajanan: "गजानन",
    rajesh: "राजेश",
    mukesh: "मुकेश",
    dinesh: "दिनेश",
    anil: "अनिल",
    sunil: "सुनील",
    amit: "अमित",
    sumit: "सुमित",
    rohit: "रोहित",
    mohit: "मोहित",
    vikas: "विकास",
    vijay: "विजय",
    sanjay: "संजय",
    ajay: "अजय",
    prakash: "प्रकाश",
    raju: "राजू",
    santosh: "संतोष",
    manoj: "मनोज",
    arvind: "अरविंद",
    sachin: "सचिन",
    akash: "आकाश",
    raj: "राज",
    pooja: "पूजा",
    priya: "प्रिया",
    neha: "नेहा",
    sneha: "स्नेहा",
    kavita: "कविता",
    sunita: "सुनीता",
    anita: "अनिता",
    rekha: "रेखा",
    seema: "सीमा",
    meena: "मीना",
    radha: "राधा",
    savita: "सविता",
    asha: "आशा",
  
    // Additional common names
    kishor: "किशोर",
    kishan: "किशन",
    krishna: "कृष्ण",
    shankar: "शंकर",
    mahendra: "महेंद्र",
    narendra: "नरेंद्र",
    rakesh: "राकेश",
    naresh: "नरेश",
    yogesh: "योगेश",
    lokesh: "लोकेश",
    rupesh: "रुपेश",
    suresh: "सुरेश",
    umesh: "उमेश",
    hitesh: "हितेश",
    nitesh: "नितेश",
    nitin: "नितिन",
    roshan: "रोशन",
    manish: "मनीष",
    dheeraj: "धीरज",
    deepak: "दीपक",
    pawan: "पवन",
    pankaj: "पंकज",
    vivek: "विवेक",
    vinod: "विनोद",
    sunil: "सुनील",
    rahul: "राहुल",
    amar: "अमर",
    vijay: "विजय",
    vishal: "विशाल",
    omkar: "ओंकार",
    shubham: "शुभम",
    suman: "सुमन",
    rekha: "रेखा",
    rani: "रानी",
    rina: "रीना",
    komal: "कोमल",
    monika: "मोनिका",
    sonali: "सोनाली",
    swati: "स्वाती",
    jyoti: "ज्योति",
    archana: "अर्चना",
    vandana: "वंदना",
    aarti: "आरती",
    mamta: "ममता",
    lata: "लता",
    geeta: "गीता",
    sarita: "सरिता",
  };
  
  // ==========================================
  // Common Surnames
  // ==========================================
  const commonSurnames = {
    patil: "पाटील",
    mahajan: "महाजन",
    sharma: "शर्मा",
    verma: "वर्मा",
    jadhav: "जाधव",
    pawar: "पवार",
    deshmukh: "देशमुख",
    shinde: "शिंदे",
    more: "मोरे",
    kale: "काळे",
    chavan: "चव्हाण",
    bhosale: "भोसले",
    joshi: "जोशी",
    kulkarni: "कुलकर्णी",
    desai: "देसाई",
    thakur: "ठाकूर",
    yadav: "यादव",
    singh: "सिंह",
    gupta: "गुप्ता",
    agrawal: "अग्रवाल",
    pawar: "पवार",
    gaikwad: "गायकवाड",
    kadam: "कदम",
    salve: "साळवे",
    wagh: "वाघ",
    rathod: "राठोड",
    shelar: "शेलार",
    borkar: "बोरकर",
    bhagat: "भगत",
    patil: "पाटील",
  };
  
  // ==========================================
  // English → Devanagari Sound Map
  // Longest patterns first
  // ==========================================
  const soundMap = {
    // 3-letter sounds
    chh: "छ",
    dhr: "ध्र",
    thr: "थ्र",
    shr: "श्र",
    ksh: "क्ष",
    tr: "त्र",
    gy: "ज्ञ",
  
    // Aspirated sounds
    kh: "ख",
    gh: "घ",
    ch: "च",
    jh: "झ",
    th: "थ",
    dh: "ध",
    ph: "फ",
    bh: "भ",
  
    // Consonants
    k: "क",
    g: "ग",
    j: "ज",
    t: "त",
    d: "द",
    n: "न",
    p: "प",
    b: "ब",
    m: "म",
    y: "य",
    r: "र",
    l: "ल",
    v: "व",
    w: "व",
    s: "स",
    h: "ह",
    f: "फ",
    z: "ज़",
    q: "क",
    x: "क्स",
    c: "क",
  
    // Special consonants
    sh: "श",
  };
  
  // ==========================================
  // Vowel Map
  // ==========================================
  const vowelMap = {
    aa: "ा",
    a: "",
    ee: "ी",
    ii: "ी",
    i: "ि",
    oo: "ू",
    uu: "ू",
    u: "ु",
    ai: "ै",
    au: "ौ",
    e: "े",
    o: "ो",
  };
  
  // ==========================================
  // Check Devanagari
  // ==========================================
  const isDevanagari = (text) => {
    return /[\u0900-\u097F]/.test(text);
  };
  
  // ==========================================
  // Translate Single Word
  // ==========================================
  const transliterateWord = (word) => {
    const clean = word.trim();
  
    if (!clean) {
      return "";
    }
  
    // Already Hindi / Marathi
    if (isDevanagari(clean)) {
      return clean;
    }
  
    const lower = clean.toLowerCase();
  
    // Accurate common name
    if (commonNames[lower]) {
      return commonNames[lower];
    }
  
    // Accurate surname
    if (commonSurnames[lower]) {
      return commonSurnames[lower];
    }
  
    let result = "";
    let i = 0;
  
    while (i < lower.length) {
  
      // ------------------------------------------
      // Try vowels first
      // ------------------------------------------
      let vowelFound = false;
  
      const vowelPatterns = [
        "aa",
        "ee",
        "ii",
        "oo",
        "uu",
        "ai",
        "au",
        "a",
        "i",
        "u",
        "e",
        "o",
      ];
  
      for (const vowel of vowelPatterns) {
  
        if (lower.startsWith(vowel, i)) {
  
          // If word starts with vowel
          if (result === "") {
  
            const independentVowels = {
              a: "अ",
              aa: "आ",
              i: "इ",
              ii: "ई",
              ee: "ई",
              u: "उ",
              uu: "ऊ",
              oo: "ऊ",
              e: "ए",
              ai: "ऐ",
              o: "ओ",
              au: "औ",
            };
  
            result += independentVowels[vowel];
  
          } else {
  
            result += vowelMap[vowel];
  
          }
  
          i += vowel.length;
          vowelFound = true;
          break;
        }
      }
  
      if (vowelFound) {
        continue;
      }
  
      // ------------------------------------------
      // Try consonant sounds
      // ------------------------------------------
      let consonantFound = false;
  
      const consonantPatterns = [
        "chh",
        "shr",
        "ksh",
        "dhr",
        "thr",
        "kh",
        "gh",
        "ch",
        "jh",
        "th",
        "dh",
        "ph",
        "bh",
        "sh",
        "tr",
        "gy",
        "k",
        "g",
        "j",
        "t",
        "d",
        "n",
        "p",
        "b",
        "m",
        "y",
        "r",
        "l",
        "v",
        "w",
        "s",
        "h",
        "f",
        "z",
        "q",
        "x",
        "c",
      ];
  
      for (const consonant of consonantPatterns) {
  
        if (lower.startsWith(consonant, i)) {
  
          result += soundMap[consonant];
  
          i += consonant.length;
  
          consonantFound = true;
  
          break;
        }
      }
  
      if (consonantFound) {
        continue;
      }
  
      // Unknown character
      result += lower[i];
  
      i++;
    }
  
    return result;
  };
  
  // ==========================================
  // Translate Full Customer Name
  // ==========================================
  export const translateCustomerName = (
    name,
    language
  ) => {
  
    if (!name) {
      return "";
    }
  
    // English selected
    if (language === "en") {
      return name;
    }
  
    // Already Hindi / Marathi
    if (isDevanagari(name)) {
      return name;
    }
  
    return name
      .trim()
      .split(/\s+/)
      .map((word) => transliterateWord(word))
      .join(" ");
  };