import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaPhone,
  FaMapMarkerAlt,
  FaUser,
  FaEdit,
  FaTrash,
  FaExternalLinkAlt,
} from "react-icons/fa";

import toast from "react-hot-toast";

import SearchBar from "../components/SearchBar";

import {
  getCustomers,
  deleteCustomer,
} from "../services/customerService";

import { useLanguage } from "../i18n/LanguageContext";


// =====================================================
// ENGLISH → HINDI NAME MAP
// =====================================================

const hindiMap = {

  // Common names
  rahul: "राहुल",
  gajanan: "गजानन",
  ritik: "रितिक",
  mahajan: "महाजन",
  karange: "करांगे",
  jeevan: "जीवन",
  chaudhari: "चौधरी",
  choudhary: "चौधरी",
  chaudhary: "चौधरी",

  amit: "अमित",
  sumit: "सुमित",
  rohit: "रोहित",
  mohit: "मोहित",
  raj: "राज",
  raju: "राजू",
  vijay: "विजय",
  sanjay: "संजय",
  ajay: "अजय",
  anil: "अनिल",
  sunil: "सुनील",
  sachin: "सचिन",
  akshay: "अक्षय",
  pratik: "प्रतीक",
  prashant: "प्रशांत",
  santosh: "संतोष",
  suresh: "सुरेश",
  ramesh: "रमेश",
  mahesh: "महेश",
  dinesh: "दिनेश",
  mukesh: "मुकेश",
  naresh: "नरेश",
  manoj: "मनोज",
  vinod: "विनोद",
  deepak: "दीपक",
  dipak: "दिपक",
  pankaj: "पंकज",
  ganesh: "गणेश",
  govind: "गोविंद",
  narendra: "नरेंद्र",
  rajendra: "राजेंद्र",
  shankar: "शंकर",
  prakash: "प्रकाश",
  mahendra: "महेंद्र",
  surendra: "सुरेंद्र",
  arvind: "अरविंद",
  ravindra: "रविंद्र",
  manish: "मनीष",
  nitin: "नितीन",
  nikhil: "निखिल",
  vikas: "विकास",
  vivek: "विवेक",
  vinay: "विनय",
  rohan: "रोहन",
  suman: "सुमन",

  // Female names
  pooja: "पूजा",
  puja: "पूजा",
  neha: "नेहा",
  priya: "प्रिया",
  kavita: "कविता",
  seema: "सीमा",
  rekha: "रेखा",
  anita: "अनिता",
  sunita: "सुनीता",
  mamta: "ममता",
  savita: "सविता",
  swati: "स्वाती",
  sneha: "स्नेहा",
  sakshi: "साक्षी",
  nikita: "निकिता",
  payal: "पायल",
  rani: "रानी",
  radha: "राधा",
  meena: "मीना",
  geeta: "गीता",
  sita: "सीता",

  // Surnames
  sharma: "शर्मा",
  verma: "वर्मा",
  singh: "सिंह",
  yadav: "यादव",
  pawar: "पवार",
  deshmukh: "देशमुख",
  more: "मोरे",
  jadhav: "जाधव",
  thakur: "ठाकुर",
  shinde: "शिंदे",
  bhosale: "भोसले",
  bhosle: "भोसले",
  kale: "काळे",
  patil: "पाटील",
};


// =====================================================
// BASIC ENGLISH → DEVANAGARI TRANSLITERATION
// =====================================================

const transliterateWord = (word) => {

  const clean = word
    .toLowerCase()
    .trim();

  if (!clean) {
    return "";
  }

  // Exact dictionary match
  if (hindiMap[clean]) {
    return hindiMap[clean];
  }

  let result = "";
  let i = 0;

  const consonants = {
    kh: "ख",
    gh: "घ",
    ch: "च",
    jh: "झ",
    th: "थ",
    dh: "ध",
    ph: "फ",
    bh: "भ",
    sh: "श",
    tr: "त्र",
    kr: "क्र",
    pr: "प्र",
    br: "ब्र",
    dr: "द्र",
    gr: "ग्र",
    fr: "फ्र",
    kl: "क्ल",
    pl: "प्ल",
    bl: "ब्ल",
    st: "स्ट",
    sk: "स्क",
    sp: "स्प",
    sw: "स्व",
  };

  const singleConsonants = {
    k: "क",
    g: "ग",
    c: "क",
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
    aa: "ा",
    ee: "ी",
    ii: "ी",
    oo: "ू",
    uu: "ू",
    ai: "ै",
    au: "ौ",
    a: "",
    i: "ि",
    u: "ु",
    e: "े",
    o: "ो",
  };

  while (i < clean.length) {

    // Two-letter consonant
    const two = clean.substring(i, i + 2);

    if (consonants[two]) {

      result += consonants[two];

      i += 2;

      const nextTwo =
        clean.substring(i, i + 2);

      const nextOne =
        clean.substring(i, i + 1);

      if (vowels[nextTwo] !== undefined) {

        result += vowels[nextTwo];

        i += 2;

      } else if (
        vowels[nextOne] !== undefined
      ) {

        result += vowels[nextOne];

        i += 1;

      } else {

        result += "्";
      }

      continue;
    }


    // Vowel
    const twoVowel =
      clean.substring(i, i + 2);

    const oneVowel =
      clean.substring(i, i + 1);


    if (vowels[twoVowel] !== undefined) {

      result += vowels[twoVowel];

      i += 2;

      continue;
    }


    if (vowels[oneVowel] !== undefined) {

      result += vowels[oneVowel];

      i += 1;

      continue;
    }


    // Single consonant
    if (singleConsonants[oneVowel]) {

      result +=
        singleConsonants[oneVowel];

      i += 1;

      const nextTwo =
        clean.substring(i, i + 2);

      const nextOne =
        clean.substring(i, i + 1);


      if (vowels[nextTwo] !== undefined) {

        result += vowels[nextTwo];

        i += 2;

      } else if (
        vowels[nextOne] !== undefined
      ) {

        result += vowels[nextOne];

        i += 1;

      } else if (i < clean.length) {

        result += "्";
      }

      continue;
    }


    i += 1;
  }

  return result;
};


// =====================================================
// COMPLETE NAME TRANSLITERATION
// =====================================================

const convertNameToHindi = (name) => {

  if (!name) {
    return "";
  }

  // Already Hindi/Devanagari
  if (/[\u0900-\u097F]/.test(name)) {
    return name.trim();
  }

  return name
    .trim()
    .split(/\s+/)
    .map((word) =>
      transliterateWord(word)
    )
    .join(" ");
};


// =====================================================
// CUSTOMERS COMPONENT
// =====================================================

const Customers = () => {

  const [customers, setCustomers] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const navigate = useNavigate();

  const {
    t,
    language,
  } = useLanguage();


  // ===================================================
  // LOAD CUSTOMERS
  // ===================================================

  const loadCustomers = async () => {

    try {

      setLoading(true);

      const data =
        await getCustomers();

      setCustomers(
        data.customers || []
      );

    } catch (error) {

      console.error(
        "Customer loading error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Unable to load customers"
      );

    } finally {

      setLoading(false);
    }
  };


  useEffect(() => {

    loadCustomers();

  }, []);


  // ===================================================
  // DELETE CUSTOMER
  // ===================================================

  const removeCustomer = async (id) => {

    const confirmed =
      window.confirm(
        t("deleteCustomerConfirm")
      );

    if (!confirmed) {
      return;
    }

    try {

      await deleteCustomer(id);

      toast.success(
        t("customerDeleted")
      );

      await loadCustomers();

    } catch (error) {

      console.error(
        "Delete customer error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Unable to delete customer"
      );
    }
  };


  // ===================================================
  // DISPLAY CUSTOMER NAME
  // ===================================================

  const getDisplayName = (customer) => {

    if (!customer?.fullName) {
      return "";
    }

    const originalName =
      customer.fullName.trim();


    // ================================================
    // ENGLISH
    // ================================================

    if (
      language === "en" ||
      language === "english" ||
      language === "English"
    ) {

      return originalName;
    }


    // ================================================
    // HINDI
    // ================================================

    if (
      language === "hi" ||
      language === "hindi" ||
      language === "Hindi" ||
      language === "हिन्दी"
    ) {

      // Already Hindi
      if (
        /[\u0900-\u097F]/.test(
          originalName
        )
      ) {

        return originalName;
      }


      // First preference:
      // Backend generated hindiName

      if (
        customer.hindiName &&
        customer.hindiName.trim()
      ) {

        return customer.hindiName.trim();
      }


      // Fallback:
      // Convert existing English name

      const converted =
        convertNameToHindi(
          originalName
        );

      return (
        converted ||
        originalName
      );
    }


    // ================================================
    // MARATHI
    // ================================================

    if (
      language === "mr" ||
      language === "marathi" ||
      language === "Marathi" ||
      language === "मराठी"
    ) {

      if (
        /[\u0900-\u097F]/.test(
          originalName
        )
      ) {

        return originalName;
      }

      return (
        customer.hindiName?.trim() ||
        convertNameToHindi(
          originalName
        ) ||
        originalName
      );
    }


    // ================================================
    // DEFAULT
    // ================================================

    return originalName;
  };


  // ===================================================
  // SEARCH
  // ===================================================

  const searchText =
    search
      .trim()
      .toLowerCase();


  const filtered =
    customers.filter(
      (customer) => {

        const originalName =
          customer.fullName
            ?.toLowerCase() || "";

        const hindiName =
          customer.hindiName
            ?.toLowerCase() || "";

        const displayName =
          getDisplayName(customer)
            ?.toLowerCase() || "";

        const mobile =
          customer.mobile
            ?.toLowerCase() || "";

        const village =
          customer.village
            ?.toLowerCase() || "";

        const customerCode =
          customer.customerCode
            ?.toLowerCase() || "";


        return (
          originalName.includes(
            searchText
          ) ||

          hindiName.includes(
            searchText
          ) ||

          displayName.includes(
            searchText
          ) ||

          mobile.includes(
            searchText
          ) ||

          village.includes(
            searchText
          ) ||

          customerCode.includes(
            searchText
          )
        );
      }
    );


  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {

    return (
      <div className="container-fluid py-5 text-center">

        <div className="spinner-border text-success" />

        <p className="mt-3 text-muted">
          {t("loading")}
        </p>

      </div>
    );
  }


  // ===================================================
  // UI
  // ===================================================

  return (

    <div className="container-fluid pb-5">


      {/* HEADER */}

      <div className="d-flex justify-content-between align-items-center mb-3">

        <div>

          <h3 className="fw-bold mb-1">
            {t("customers")}
          </h3>

          <small className="text-muted">

            {customers.length}{" "}
            {t("customers")}

          </small>

        </div>


        <Link
          to="/customers/add"
          className="btn btn-success"
        >

          + {t("addCustomer")}

        </Link>

      </div>


      {/* SEARCH */}

      <div className="mb-3">

        <SearchBar
          value={search}
          onChange={setSearch}
        />

      </div>


      {/* SEARCH RESULT */}

      {search && (

        <div className="small text-muted mb-2">

          {filtered.length}{" "}
          {t("customers")}

        </div>

      )}


      {/* NO CUSTOMERS */}

      {filtered.length === 0 ? (

        <div className="card border-0 shadow-sm">

          <div className="card-body text-center py-5">

            <div
              className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{
                width: "65px",
                height: "65px",
                background: "#e8f5e9",
                color: "#198754",
                fontSize: "25px",
              }}
            >

              <FaUser />

            </div>


            <h5 className="text-muted mb-1">

              {t("noCustomers")}

            </h5>


            <p className="text-muted small mb-3">

              {search
                ? t("tryAnotherSearch")
                : t("addFirstCustomer")}

            </p>


            {!search && (

              <Link
                to="/customers/add"
                className="btn btn-success"
              >

                + {t("addCustomer")}

              </Link>

            )}

          </div>

        </div>

      ) : (

        /* CUSTOMER LIST */

        <div className="d-flex flex-column gap-2">

          {filtered.map(
            (customer) => {

              const balance =
                Number(
                  customer.currentBalance ||
                    0
                );


              return (

                <div
                  key={customer.id}
                  className="card border-0 shadow-sm"
                >

                  <div className="card-body p-3">


                    {/* CUSTOMER TOP */}

                    <div className="d-flex align-items-center">

                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{
                          width: "50px",
                          height: "50px",
                          background: "#e8f5e9",
                          color: "#198754",
                          fontSize: "20px",
                        }}
                      >

                        <FaUser />

                      </div>


                      <div className="ms-3 flex-grow-1">

                        <h5 className="mb-0 fw-bold">

                          {getDisplayName(
                            customer
                          )}

                        </h5>


                        <small className="text-muted">

                          {customer.customerCode ||
                            ""}

                        </small>

                      </div>


                      {/* BALANCE */}

                      <div className="text-end">

                        <div
                          className={
                            balance < 0
                              ? "fw-bold text-danger"
                              : balance > 0
                              ? "fw-bold text-success"
                              : "fw-bold text-secondary"
                          }
                        >

                          ₹{" "}

                          {Math.abs(
                            balance
                          ).toFixed(2)}

                        </div>


                        <small className="text-muted">

                          {balance < 0
                            ? t("advance")
                            : balance > 0
                            ? t("due")
                            : t("settled")}

                        </small>

                      </div>

                    </div>


                    {/* CUSTOMER INFO */}

                    <div className="row g-2 mt-2">


                      {/* MOBILE */}

                      <div className="col-12 col-sm-6">

                        <a
                          href={`tel:${customer.mobile}`}
                          className="text-decoration-none"
                        >

                          <div className="border rounded p-2 d-flex align-items-center gap-2">

                            <FaPhone className="text-success" />

                            <div>

                              <small className="text-muted d-block">

                                {t("mobile")}

                              </small>

                              <strong className="text-dark">

                                {customer.mobile}

                              </strong>

                            </div>

                          </div>

                        </a>

                      </div>


                      {/* VILLAGE */}

                      <div className="col-12 col-sm-6">

                        <div className="border rounded p-2 d-flex align-items-center gap-2">

                          <FaMapMarkerAlt className="text-success" />

                          <div>

                            <small className="text-muted d-block">

                              {t("village")}

                            </small>

                            <strong>

                              {customer.village ||
                                "-"}

                            </strong>

                          </div>

                        </div>

                      </div>

                    </div>


                    {/* ACTIONS */}

                    <div className="row g-2 mt-2">


                      {/* OPEN */}

                      <div className="col-12">

                        <button
                          type="button"
                          className="btn btn-success w-100"
                          onClick={() =>
                            navigate(
                              `/customers/${customer.id}`
                            )
                          }
                        >

                          <FaExternalLinkAlt className="me-2" />

                          {t(
                            "openCustomer"
                          )}

                        </button>

                      </div>


                      {/* EDIT */}

                      <div className="col-6">

                        <Link
                          to={`/customers/edit/${customer.id}`}
                          className="btn btn-outline-warning w-100"
                        >

                          <FaEdit className="me-1" />

                          {t("edit")}

                        </Link>

                      </div>


                      {/* DELETE */}

                      <div className="col-6">

                        <button
                          type="button"
                          className="btn btn-outline-danger w-100"
                          onClick={() =>
                            removeCustomer(
                              customer.id
                            )
                          }
                        >

                          <FaTrash className="me-1" />

                          {t("delete")}

                        </button>

                      </div>

                    </div>

                  </div>

                </div>

              );
            }
          )}

        </div>

      )}

    </div>
  );
};

export default Customers;