// ==========================================
// Local Hindi Customer Name Transliteration
// No API / No Internet Required
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
    jeevan: "जीवन",
  };
  
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
    chaudhari: "चौधरी",
    chaudhary: "चौधरी",
    bhosale: "भोसले",
    joshi: "जोशी",
    kulkarni: "कुलकर्णी",
    desai: "देसाई",
    thakur: "ठाकूर",
    yadav: "यादव",
    singh: "सिंह",
    gupta: "गुप्ता",
    agrawal: "अग्रवाल",
  };
  
  
  // ==========================================
  // Basic English -> Hindi mapping
  // ==========================================
  
  const consonants = {
    kh: "ख",
    gh: "घ",
    ch: "च",
    chh: "छ",
    jh: "झ",
    th: "थ",
    dh: "ध",
    ph: "फ",
    bh: "भ",
    sh: "श",
  
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
    q: "क",
    x: "क्स",
    z: "ज़",
  };
  
  const vowels = {
    aa: "आ",
    ai: "ऐ",
    au: "औ",
    ee: "ई",
    ii: "ई",
    oo: "ऊ",
    uu: "ऊ",
  
    a: "अ",
    i: "इ",
    u: "उ",
    e: "ए",
    o: "ओ",
  };
  
  
  // ==========================================
  // Transliterate single unknown word
  // ==========================================
  
  const transliterateUnknownWord = (word) => {
  
    let input = word.toLowerCase();
  
    let result = "";
  
    let i = 0;
  
    while (i < input.length) {
  
      // ------------------------------
      // Vowels
      // ------------------------------
  
      let matchedVowel = false;
  
      const vowelKeys = Object.keys(vowels)
        .sort((a, b) => b.length - a.length);
  
      for (const key of vowelKeys) {
  
        if (input.startsWith(key, i)) {
  
          result += vowels[key];
  
          i += key.length;
  
          matchedVowel = true;
  
          break;
        }
      }
  
      if (matchedVowel) {
        continue;
      }
  
  
      // ------------------------------
      // Consonants
      // ------------------------------
  
      let matchedConsonant = false;
  
      const consonantKeys = Object.keys(consonants)
        .sort((a, b) => b.length - a.length);
  
      for (const key of consonantKeys) {
  
        if (input.startsWith(key, i)) {
  
          result += consonants[key];
  
          i += key.length;
  
          matchedConsonant = true;
  
          break;
        }
      }
  
      if (matchedConsonant) {
        continue;
      }
  
  
      // ------------------------------
      // Unknown character
      // ------------------------------
  
      result += input[i];
  
      i++;
  
    }
  
    return result;
  };
  
  
  // ==========================================
  // Translate Single Word
  // ==========================================
  
  const translateWord = (word) => {
  
    const clean = word.trim();
  
    if (!clean) {
      return "";
    }
  
  
    // Already Hindi / Marathi
    if (/[\u0900-\u097F]/.test(clean)) {
      return clean;
    }
  
  
    const lower = clean.toLowerCase();
  
  
    // Common name
    if (commonNames[lower]) {
      return commonNames[lower];
    }
  
  
    // Common surname
    if (commonSurnames[lower]) {
      return commonSurnames[lower];
    }
  
  
    // Unknown name
    return transliterateUnknownWord(clean);
  };
  
  
  // ==========================================
  // Main Export
  // ==========================================
  
  export const transliterateCustomerName = (name) => {
  
    if (!name) {
      return "";
    }
  
  
    // Already Hindi / Marathi
    if (/[\u0900-\u097F]/.test(name)) {
      return name;
    }
  
  
    return name
      .trim()
      .split(/\s+/)
      .map((word) => translateWord(word))
      .join(" ");
  
  };