import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaPhone,
  FaMapMarkerAlt,
  FaTint,
  FaMoneyBillWave,
  FaBook,
  FaPrint,
  FaUser,
  FaChevronDown,
  FaChevronUp,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

import toast from "react-hot-toast";

import {
  getCustomerDetails,
  addMilk,
  updateMilk,
  deleteMilk,
  addPayment,
  updatePayment,
  deletePayment,
} from "../services/customerDetailsService";

import { useLanguage } from "../i18n/LanguageContext";
import { translateCustomerName } from "../utils/nameTranslator";

const CustomerDetails = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const { language } = useLanguage();

  // ==========================================
  // LOCAL TRANSLATION
  // ==========================================

  const tr = (en, hi, mr) => {

    if (language === "hi") {
      return hi;
    }

    if (language === "mr") {
      return mr;
    }

    return en;
  };

  // ==========================================
  // STATES
  // ==========================================

  const [loading, setLoading] = useState(true);

  const [customerData, setCustomerData] =
    useState(null);

  const [showMilkForm, setShowMilkForm] =
    useState(false);

  const [showPaymentForm, setShowPaymentForm] =
    useState(false);

  const [showPayments, setShowPayments] =
    useState(false);

  const [showStatement, setShowStatement] =
    useState(false);

  const [milkLoading, setMilkLoading] =
    useState(false);

  const [paymentLoading, setPaymentLoading] =
    useState(false);

  const [editingMilkId, setEditingMilkId] =
    useState(null);

  const [editingPaymentId, setEditingPaymentId] =
    useState(null);

  const [milkUpdateLoading, setMilkUpdateLoading] =
    useState(false);

  const [
    paymentUpdateLoading,
    setPaymentUpdateLoading,
  ] = useState(false);

  const today = new Date()
    .toISOString()
    .split("T")[0];

  // ==========================================
  // FORMS
  // ==========================================

  const [milkForm, setMilkForm] = useState({
    entryDate: today,
    session: "Morning",
    quantity: "",
    rate: "",
    remarks: "",
  });

  const [paymentForm, setPaymentForm] =
    useState({
      paymentDate: today,
      amount: "",
      paymentMode: "Cash",
      description: "",
    });

  // ==========================================
  // LOAD CUSTOMER
  // ==========================================

  const loadCustomer = async () => {

    try {

      setLoading(true);

      const data =
        await getCustomerDetails(id);

      if (!data.success) {

        toast.error(
          data.message ||
          tr(
            "Unable to load customer",
            "ग्राहक की जानकारी लोड नहीं हो सकी",
            "ग्राहकाची माहिती लोड करता आली नाही"
          )
        );

        return;
      }

      setCustomerData(data);

      if (data.customer?.defaultRate) {

        setMilkForm((prev) => ({
          ...prev,
          rate: data.customer.defaultRate,
        }));

      }

    } catch (error) {

      console.error(error);

      toast.error(
        error?.response?.data?.message ||
        tr(
          "Unable to load customer details",
          "ग्राहक की जानकारी लोड नहीं हो सकी",
          "ग्राहकाची माहिती लोड करता आली नाही"
        )
      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    loadCustomer();
  }, [id]);

  // ==========================================
  // FORM CHANGES
  // ==========================================

  const handleMilkChange = (e) => {

    const { name, value } = e.target;

    setMilkForm((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  const handlePaymentChange = (e) => {

    const { name, value } = e.target;

    setPaymentForm((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  // ==========================================
  // MILK AMOUNT
  // ==========================================

  const milkAmount =
    Number(milkForm.quantity || 0) *
    Number(milkForm.rate || 0);

  // ==========================================
  // ADD MILK
  // ==========================================

  const handleAddMilk = async (e) => {

    e.preventDefault();

    if (
      !milkForm.quantity ||
      Number(milkForm.quantity) <= 0
    ) {

      toast.error(
        tr(
          "Enter valid milk quantity",
          "सही दूध की मात्रा दर्ज करें",
          "योग्य दूधाचे प्रमाण भरा"
        )
      );

      return;
    }

    if (
      !milkForm.rate ||
      Number(milkForm.rate) <= 0
    ) {

      toast.error(
        tr(
          "Enter valid milk rate",
          "सही दूध का भाव दर्ज करें",
          "योग्य दूधाचा दर भरा"
        )
      );

      return;
    }

    try {

      setMilkLoading(true);

      const response = await addMilk({
        customerId: Number(id),
        entryDate: milkForm.entryDate,
        session: milkForm.session,
        quantity: Number(milkForm.quantity),
        rate: Number(milkForm.rate),
        remarks: milkForm.remarks,
      });

      if (!response.success) {

        toast.error(
          response.message ||
          tr(
            "Milk entry failed",
            "दूध की एंट्री नहीं हो सकी",
            "दुधाची नोंद करता आली नाही"
          )
        );

        return;
      }

      toast.success(
        tr(
          "Milk added successfully",
          "दूध सफलतापूर्वक जोड़ा गया",
          "दूध यशस्वीरित्या जोडले"
        )
      );

      resetMilkForm();

      await loadCustomer();

    } catch (error) {

      console.error(error);

      toast.error(
        error?.response?.data?.message ||
        tr(
          "Unable to add milk entry",
          "दूध की एंट्री नहीं हो सकी",
          "दुधाची नोंद करता आली नाही"
        )
      );

    } finally {

      setMilkLoading(false);

    }

  };

  // ==========================================
  // EDIT MILK
  // ==========================================

  const handleEditMilk = (milk) => {

    setEditingMilkId(milk.id);

    setMilkForm({
      entryDate: milk.entryDate,
      session: milk.session,
      quantity: milk.quantity,
      rate: milk.rate,
      remarks: milk.remarks || "",
    });

    setShowMilkForm(true);
    setShowPaymentForm(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };

  // ==========================================
  // UPDATE MILK
  // ==========================================

  const handleUpdateMilk = async (e) => {

    e.preventDefault();

    if (
      !milkForm.quantity ||
      Number(milkForm.quantity) <= 0
    ) {

      toast.error(
        tr(
          "Enter valid milk quantity",
          "सही दूध की मात्रा दर्ज करें",
          "योग्य दूधाचे प्रमाण भरा"
        )
      );

      return;
    }

    if (
      !milkForm.rate ||
      Number(milkForm.rate) <= 0
    ) {

      toast.error(
        tr(
          "Enter valid milk rate",
          "सही दूध का भाव दर्ज करें",
          "योग्य दूधाचा दर भरा"
        )
      );

      return;
    }

    try {

      setMilkUpdateLoading(true);

      const response = await updateMilk(
        editingMilkId,
        {
          entryDate: milkForm.entryDate,
          session: milkForm.session,
          quantity: Number(milkForm.quantity),
          rate: Number(milkForm.rate),
          remarks: milkForm.remarks,
        }
      );

      if (!response.success) {

        toast.error(
          response.message ||
          tr(
            "Milk update failed",
            "दूध की एंट्री अपडेट नहीं हो सकी",
            "दुधाची नोंद अपडेट करता आली नाही"
          )
        );

        return;
      }

      toast.success(
        tr(
          "Milk entry updated successfully",
          "दूध की एंट्री सफलतापूर्वक अपडेट हुई",
          "दुधाची नोंद यशस्वीरित्या अपडेट झाली"
        )
      );

      resetMilkForm();

      await loadCustomer();

    } catch (error) {

      console.error(error);

      toast.error(
        error?.response?.data?.message ||
        tr(
          "Unable to update milk",
          "दूध अपडेट नहीं हो सका",
          "दूध अपडेट करता आले नाही"
        )
      );

    } finally {

      setMilkUpdateLoading(false);

    }

  };

  // ==========================================
  // DELETE MILK
  // ==========================================

  const handleDeleteMilk = async (milkId) => {

    if (
      !window.confirm(
        tr(
          "Are you sure you want to delete this milk entry?",
          "क्या आप इस दूध की एंट्री को हटाना चाहते हैं?",
          "तुम्हाला ही दुधाची नोंद हटवायची आहे का?"
        )
      )
    ) {
      return;
    }

    try {

      const response =
        await deleteMilk(milkId);

      if (!response.success) {

        toast.error(
          response.message ||
          tr(
            "Delete failed",
            "हटाया नहीं जा सका",
            "हटवता आले नाही"
          )
        );

        return;
      }

      toast.success(
        tr(
          "Milk entry deleted successfully",
          "दूध की एंट्री सफलतापूर्वक हटाई गई",
          "दुधाची नोंद यशस्वीरित्या हटवली"
        )
      );

      await loadCustomer();

    } catch (error) {

      console.error(error);

      toast.error(
        error?.response?.data?.message ||
        tr(
          "Unable to delete milk",
          "दूध की एंट्री हटाई नहीं जा सकी",
          "दुधाची नोंद हटवता आली नाही"
        )
      );

    }

  };

  // ==========================================
  // RESET MILK FORM
  // ==========================================

  const resetMilkForm = () => {

    setEditingMilkId(null);

    setShowMilkForm(false);

    setMilkForm({
      entryDate: today,
      session: "Morning",
      quantity: "",
      rate:
        customerData?.customer?.defaultRate || "",
      remarks: "",
    });

  };

  // ==========================================
  // ADD PAYMENT
  // ==========================================

  const handleAddPayment = async (e) => {

    e.preventDefault();

    if (
      !paymentForm.amount ||
      Number(paymentForm.amount) <= 0
    ) {

      toast.error(
        tr(
          "Enter valid payment amount",
          "सही भुगतान राशि दर्ज करें",
          "योग्य पेमेंट रक्कम भरा"
        )
      );

      return;
    }

    try {

      setPaymentLoading(true);

      const response = await addPayment({
        customerId: Number(id),
        amount: Number(paymentForm.amount),
        paymentMode: paymentForm.paymentMode,
        description:
          paymentForm.description ||
          "Payment Received",
        paymentDate:
          paymentForm.paymentDate,
      });

      if (!response.success) {

        toast.error(
          response.message ||
          tr(
            "Payment failed",
            "भुगतान नहीं हो सका",
            "पेमेंट करता आली नाही"
          )
        );

        return;
      }

      toast.success(
        tr(
          "Payment added successfully",
          "भुगतान सफलतापूर्वक जोड़ा गया",
          "पेमेंट यशस्वीरित्या जोडले"
        )
      );

      resetPaymentForm();

      await loadCustomer();

    } catch (error) {

      console.error(error);

      toast.error(
        error?.response?.data?.message ||
        tr(
          "Unable to add payment",
          "भुगतान नहीं हो सका",
          "पेमेंट करता आली नाही"
        )
      );

    } finally {

      setPaymentLoading(false);

    }

  };

  // ==========================================
  // EDIT PAYMENT
  // ==========================================

  const handleEditPayment = (payment) => {

    setEditingPaymentId(payment.id);

    setPaymentForm({
      paymentDate:
        payment.transactionDate,
      amount: payment.debit,
      paymentMode:
        payment.paymentMode || "Cash",
      description:
        payment.description || "",
    });

    setShowPaymentForm(true);
    setShowMilkForm(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };

  // ==========================================
  // UPDATE PAYMENT
  // ==========================================

  const handleUpdatePayment =
    async (e) => {

      e.preventDefault();

      if (
        !paymentForm.amount ||
        Number(paymentForm.amount) <= 0
      ) {

        toast.error(
          tr(
            "Enter valid payment amount",
            "सही भुगतान राशि दर्ज करें",
            "योग्य पेमेंट रक्कम भरा"
          )
        );

        return;
      }

      try {

        setPaymentUpdateLoading(true);

        const response =
          await updatePayment(
            editingPaymentId,
            {
              paymentDate:
                paymentForm.paymentDate,

              amount: Number(
                paymentForm.amount
              ),

              paymentMode:
                paymentForm.paymentMode,

              description:
                paymentForm.description ||
                "Payment Received",
            }
          );

        if (!response.success) {

          toast.error(
            response.message ||
            tr(
              "Payment update failed",
              "भुगतान अपडेट नहीं हो सका",
              "पेमेंट अपडेट करता आले नाही"
            )
          );

          return;
        }

        toast.success(
          tr(
            "Payment updated successfully",
            "भुगतान सफलतापूर्वक अपडेट हुआ",
            "पेमेंट यशस्वीरित्या अपडेट झाले"
          )
        );

        resetPaymentForm();

        await loadCustomer();

      } catch (error) {

        console.error(error);

        toast.error(
          error?.response?.data?.message ||
          tr(
            "Unable to update payment",
            "भुगतान अपडेट नहीं हो सका",
            "पेमेंट अपडेट करता आले नाही"
          )
        );

      } finally {

        setPaymentUpdateLoading(false);

      }

    };

  // ==========================================
  // DELETE PAYMENT
  // ==========================================

  const handleDeletePayment =
    async (paymentId) => {

      if (
        !window.confirm(
          tr(
            "Are you sure you want to delete this payment?",
            "क्या आप इस भुगतान को हटाना चाहते हैं?",
            "तुम्हाला हे पेमेंट हटवायचे आहे का?"
          )
        )
      ) {
        return;
      }

      try {

        const response =
          await deletePayment(paymentId);

        if (!response.success) {

          toast.error(
            response.message ||
            tr(
              "Delete failed",
              "हटाया नहीं जा सका",
              "हटवता आले नाही"
            )
          );

          return;
        }

        toast.success(
          tr(
            "Payment deleted successfully",
            "भुगतान सफलतापूर्वक हटाया गया",
            "पेमेंट यशस्वीरित्या हटवले"
          )
        );

        await loadCustomer();

      } catch (error) {

        console.error(error);

        toast.error(
          error?.response?.data?.message ||
          tr(
            "Unable to delete payment",
            "भुगतान हटाया नहीं जा सका",
            "पेमेंट हटवता आले नाही"
          )
        );

      }

    };

  // ==========================================
  // RESET PAYMENT FORM
  // ==========================================

  const resetPaymentForm = () => {

    setEditingPaymentId(null);

    setShowPaymentForm(false);

    setPaymentForm({
      paymentDate: today,
      amount: "",
      paymentMode: "Cash",
      description: "",
    });

  };

  // ==========================================
  // PRINT
  // ==========================================

  const handlePrint = () => {
    window.print();
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (
      <div className="container-fluid py-5 text-center">

        <div className="spinner-border text-primary" />

        <p className="mt-3 text-muted">
          {tr(
            "Loading customer...",
            "ग्राहक की जानकारी लोड हो रही है...",
            "ग्राहकाची माहिती लोड होत आहे..."
          )}
        </p>

      </div>
    );

  }

  if (!customerData?.customer) {

    return (
      <div className="container-fluid py-5 text-center">

        <h4>
          {tr(
            "Customer Not Found",
            "ग्राहक नहीं मिला",
            "ग्राहक सापडला नाही"
          )}
        </h4>

        <button
          className="btn btn-primary mt-3"
          onClick={() =>
            navigate("/customers")
          }
        >
          {tr(
            "Back to Customers",
            "ग्राहकों पर वापस जाएँ",
            "ग्राहकांकडे परत जा"
          )}
        </button>

      </div>
    );

  }

  const customer =
    customerData.customer;

  const summary =
    customerData.summary || {};

  const milkHistory =
    customerData.milkHistory || [];

  const paymentHistory =
    customerData.paymentHistory || [];

  const statement =
    customerData.statement || [];

  const currentBalance = Number(
    summary.currentBalance || 0
  );

  // ==========================================
  // TRANSLATED CUSTOMER NAME
  // ==========================================

  const customerName =
    translateCustomerName(
      customer.fullName,
      language
    );

  // ==========================================
  // TRANSLATED SESSION
  // ==========================================

  const translateSession = (session) => {

    if (session === "Morning") {
      return tr(
        "Morning",
        "सुबह",
        "सकाळ"
      );
    }

    if (session === "Evening") {
      return tr(
        "Evening",
        "शाम",
        "संध्याकाळ"
      );
    }

    return session;

  };

  // ==========================================
  // TRANSLATED PAYMENT MODE
  // ==========================================

  const translatePaymentMode = (mode) => {

    if (mode === "Cash") {
      return tr(
        "Cash",
        "नकद",
        "रोख"
      );
    }

    if (mode === "UPI") {
      return "UPI";
    }

    if (mode === "Bank") {
      return tr(
        "Bank",
        "बैंक",
        "बँक"
      );
    }

    return mode;

  };

  // ==========================================
  // TRANSLATED TRANSACTION TYPE
  // ==========================================

  const translateTransactionType = (type) => {

    if (type === "Milk") {
      return tr(
        "Milk",
        "दूध",
        "दूध"
      );
    }

    if (type === "Payment") {
      return tr(
        "Payment",
        "भुगतान",
        "पेमेंट"
      );
    }

    if (type === "Opening") {
      return tr(
        "Opening",
        "प्रारंभिक शेष",
        "प्रारंभिक शिल्लक"
      );
    }

    return type;

  };

  return (

    <div className="container-fluid pb-5 customer-details-page">

      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="d-flex justify-content-between align-items-center mb-3">

        <button
          className="btn btn-light border rounded-circle"
          style={{
            width: "42px",
            height: "42px",
          }}
          onClick={() =>
            navigate("/customers")
          }
        >
          <FaArrowLeft />
        </button>

        <button
          className="btn btn-outline-primary d-none d-md-block"
          onClick={handlePrint}
        >
          <FaPrint className="me-2" />
          {tr(
            "Print",
            "प्रिंट",
            "प्रिंट"
          )}
        </button>

      </div>

      {/* ==========================================
          CUSTOMER HEADER
      ========================================== */}

      <div className="card border-0 shadow-sm mb-3">

        <div className="card-body">

          <div className="d-flex align-items-center gap-3">

            <div
              className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
              style={{
                width: "58px",
                height: "58px",
                background: "#eaf3ff",
                color: "#0d6efd",
                fontSize: "22px",
              }}
            >
              <FaUser />
            </div>

            <div className="flex-grow-1">

              <h3 className="mb-1 fw-bold">
                {customerName}
              </h3>

              <div className="small text-muted">
                {tr(
                  "Code",
                  "कोड",
                  "कोड"
                )}:{" "}
                <strong>
                  {customer.customerCode}
                </strong>
              </div>

            </div>

          </div>

          <div className="row g-2 mt-3">

            <div className="col-12 col-sm-6">

              <a
                href={`tel:${customer.mobile}`}
                className="text-decoration-none"
              >

                <div className="border rounded p-2 d-flex align-items-center gap-2">

                  <FaPhone className="text-primary" />

                  <div>

                    <small className="text-muted d-block">
                      {tr(
                        "Mobile",
                        "मोबाइल",
                        "मोबाईल"
                      )}
                    </small>

                    <strong>
                      {customer.mobile}
                    </strong>

                  </div>

                </div>

              </a>

            </div>

            <div className="col-12 col-sm-6">

              <div className="border rounded p-2 d-flex align-items-center gap-2">

                <FaMapMarkerAlt className="text-primary" />

                <div>

                  <small className="text-muted d-block">
                    {tr(
                      "Address",
                      "पता",
                      "पत्ता"
                    )}
                  </small>

                  <strong>
                    {customer.village ||
                      customer.address ||
                      "-"}
                  </strong>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ==========================================
          SUMMARY
      ========================================== */}

      <div className="row g-2 mb-3">

        <div className="col-6 col-lg-3">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body p-3">

              <small className="text-muted">
                {tr(
                  "Balance",
                  "बकाया",
                  "शिल्लक"
                )}
              </small>

              <h4
                className={`fw-bold mb-0 ${
                  currentBalance > 0
                    ? "text-danger"
                    : currentBalance < 0
                    ? "text-primary"
                    : "text-success"
                }`}
              >
                ₹
                {Math.abs(
                  currentBalance
                ).toFixed(2)}
              </h4>

              <small className="text-muted">

                {currentBalance > 0
                  ? tr(
                      "Amount Due",
                      "देय राशि",
                      "देय रक्कम"
                    )
                  : currentBalance < 0
                  ? tr(
                      "Advance / Credit",
                      "अग्रिम / जमा",
                      "आगाऊ / जमा"
                    )
                  : tr(
                      "Settled",
                      "हिसाब पूरा",
                      "हिशोब पूर्ण"
                    )}

              </small>

            </div>

          </div>

        </div>

        <div className="col-6 col-lg-3">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body p-3">

              <small className="text-muted">
                {tr(
                  "Total Milk",
                  "कुल दूध",
                  "एकूण दूध"
                )}
              </small>

              <h4 className="fw-bold text-primary mb-0">

                {Number(
                  summary.totalMilkQuantity || 0
                ).toFixed(2)}

                L

              </h4>

              <small className="text-muted">
                ₹
                {Number(
                  summary.totalMilkAmount || 0
                ).toFixed(2)}
              </small>

            </div>

          </div>

        </div>

        <div className="col-6 col-lg-3">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body p-3">

              <small className="text-muted">
                {tr(
                  "Payments",
                  "भुगतान",
                  "पेमेंट"
                )}
              </small>

              <h4 className="fw-bold text-success mb-0">
                ₹
                {Number(
                  summary.totalPayments || 0
                ).toFixed(2)}
              </h4>

              <small className="text-muted">

                {summary.totalPaymentEntries || 0}{" "}

                {tr(
                  "entries",
                  "एंट्री",
                  "नोंदी"
                )}

              </small>

            </div>

          </div>

        </div>

        <div className="col-6 col-lg-3">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body p-3">

              <small className="text-muted">
                {tr(
                  "Milk Rate",
                  "दूध का भाव",
                  "दुधाचा दर"
                )}
              </small>

              <h4 className="fw-bold mb-0">
                ₹
                {Number(
                  customer.defaultRate || 0
                ).toFixed(2)}
              </h4>

              <small className="text-muted">

                {customer.milkType === "Cow"
                  ? tr("Cow", "गाय", "गाय")
                  : customer.milkType === "Buffalo"
                  ? tr("Buffalo", "भैंस", "म्हैस")
                  : customer.milkType === "Mixed"
                  ? tr("Mixed", "मिश्रित", "मिश्र")
                  : customer.milkType}

                {" • "}

                {customer.shift === "Morning"
                  ? tr("Morning", "सुबह", "सकाळ")
                  : customer.shift === "Evening"
                  ? tr("Evening", "शाम", "संध्याकाळ")
                  : customer.shift === "Both"
                  ? tr("Both", "दोनों", "दोन्ही")
                  : customer.shift}

              </small>

            </div>

          </div>

        </div>

      </div>

      {/* ==========================================
          ACTION BUTTONS
      ========================================== */}

      <div className="row g-2 mb-3">

        <div className="col-6">

          <button
            className="btn btn-primary w-100 py-3 fw-semibold"
            onClick={() => {

              setShowMilkForm(
                !showMilkForm
              );

              setShowPaymentForm(false);

              setEditingMilkId(null);

            }}
          >

            <FaTint className="me-2" />

            {tr(
              "Add Milk",
              "दूध जोड़ें",
              "दूध जोडा"
            )}

          </button>

        </div>

        <div className="col-6">

          <button
            className="btn btn-success w-100 py-3 fw-semibold"
            onClick={() => {

              setShowPaymentForm(
                !showPaymentForm
              );

              setShowMilkForm(false);

              setEditingPaymentId(null);

            }}
          >

            <FaMoneyBillWave className="me-2" />

            {tr(
              "Payment",
              "भुगतान",
              "पेमेंट"
            )}

          </button>

        </div>

      </div>

      {/* ==========================================
          MILK FORM
      ========================================== */}

      {showMilkForm && (

        <div className="card border-0 shadow-sm mb-3">

          <div className="card-header bg-primary text-white">

            <strong>

              <FaTint className="me-2" />

              {editingMilkId
                ? tr(
                    "Edit Milk Entry",
                    "दूध की एंट्री संपादित करें",
                    "दुधाची नोंद संपादित करा"
                  )
                : tr(
                    "Add Milk",
                    "दूध जोड़ें",
                    "दूध जोडा"
                  )}

            </strong>

          </div>

          <div className="card-body">

            <form
              onSubmit={
                editingMilkId
                  ? handleUpdateMilk
                  : handleAddMilk
              }
            >

              <div className="row g-3">

                <div className="col-12 col-md-4">

                  <label className="form-label fw-semibold">
                    {tr(
                      "Date",
                      "तारीख",
                      "तारीख"
                    )}
                  </label>

                  <input
                    type="date"
                    className="form-control"
                    name="entryDate"
                    value={
                      milkForm.entryDate
                    }
                    onChange={
                      handleMilkChange
                    }
                    required
                  />

                </div>

                <div className="col-12 col-md-4">

                  <label className="form-label fw-semibold">
                    {tr(
                      "Session",
                      "समय",
                      "वेळ"
                    )}
                  </label>

                  <select
                    className="form-select"
                    name="session"
                    value={
                      milkForm.session
                    }
                    onChange={
                      handleMilkChange
                    }
                  >

                    <option value="Morning">
                      {tr(
                        "Morning",
                        "सुबह",
                        "सकाळ"
                      )}
                    </option>

                    <option value="Evening">
                      {tr(
                        "Evening",
                        "शाम",
                        "संध्याकाळ"
                      )}
                    </option>

                  </select>

                </div>

                <div className="col-12 col-md-4">

                  <label className="form-label fw-semibold">
                    {tr(
                      "Milk Quantity (L)",
                      "दूध की मात्रा (लीटर)",
                      "दुधाचे प्रमाण (लिटर)"
                    )}
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    inputMode="decimal"
                    className="form-control"
                    name="quantity"
                    value={
                      milkForm.quantity
                    }
                    onChange={
                      handleMilkChange
                    }
                    placeholder="5"
                    required
                  />

                </div>

                <div className="col-12 col-md-6">

                  <label className="form-label fw-semibold">
                    {tr(
                      "Rate / Litre",
                      "प्रति लीटर भाव",
                      "प्रति लिटर दर"
                    )}
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    inputMode="decimal"
                    className="form-control"
                    name="rate"
                    value={milkForm.rate}
                    onChange={
                      handleMilkChange
                    }
                    required
                  />

                </div>

                <div className="col-12 col-md-6">

                  <label className="form-label fw-semibold">
                    {tr(
                      "Total Amount",
                      "कुल राशि",
                      "एकूण रक्कम"
                    )}
                  </label>

                  <div className="form-control bg-light fw-bold text-success">
                    ₹ {milkAmount.toFixed(2)}
                  </div>

                </div>

                <div className="col-12">

                  <label className="form-label fw-semibold">
                    {tr(
                      "Remarks",
                      "टिप्पणी",
                      "शेरा"
                    )}
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    name="remarks"
                    value={
                      milkForm.remarks
                    }
                    onChange={
                      handleMilkChange
                    }
                    placeholder={tr(
                      "Optional",
                      "वैकल्पिक",
                      "ऐच्छिक"
                    )}
                  />

                </div>

              </div>

              <div className="d-grid mt-3">

                <button
                  type="submit"
                  className="btn btn-primary py-2"
                  disabled={
                    milkLoading ||
                    milkUpdateLoading
                  }
                >

                  {editingMilkId
                    ? milkUpdateLoading
                      ? tr(
                          "Updating...",
                          "अपडेट हो रहा है...",
                          "अपडेट होत आहे..."
                        )
                      : tr(
                          "Update Milk Entry",
                          "दूध की एंट्री अपडेट करें",
                          "दुधाची नोंद अपडेट करा"
                        )
                    : milkLoading
                    ? tr(
                        "Saving...",
                        "सेव हो रहा है...",
                        "सेव्ह होत आहे..."
                      )
                    : tr(
                        "Save Milk Entry",
                        "दूध की एंट्री सेव करें",
                        "दुधाची नोंद सेव्ह करा"
                      )}

                </button>

                {editingMilkId && (

                  <button
                    type="button"
                    className="btn btn-outline-secondary py-2 mt-2"
                    onClick={
                      resetMilkForm
                    }
                  >
                    {tr(
                      "Cancel Edit",
                      "बदल रद्द करें",
                      "बदल रद्द करा"
                    )}
                  </button>

                )}

              </div>

            </form>

          </div>

        </div>

      )}

      {/* ==========================================
          PAYMENT FORM
      ========================================== */}

      {showPaymentForm && (

        <div className="card border-0 shadow-sm mb-3">

          <div className="card-header bg-success text-white">

            <strong>

              <FaMoneyBillWave className="me-2" />

              {editingPaymentId
                ? tr(
                    "Edit Payment",
                    "भुगतान संपादित करें",
                    "पेमेंट संपादित करा"
                  )
                : tr(
                    "Add Payment",
                    "भुगतान जोड़ें",
                    "पेमेंट जोडा"
                  )}

            </strong>

          </div>

          <div className="card-body">

            <form
              onSubmit={
                editingPaymentId
                  ? handleUpdatePayment
                  : handleAddPayment
              }
            >

              <div className="row g-3">

                <div className="col-12 col-md-6">

                  <label className="form-label fw-semibold">
                    {tr(
                      "Date",
                      "तारीख",
                      "तारीख"
                    )}
                  </label>

                  <input
                    type="date"
                    className="form-control"
                    name="paymentDate"
                    value={
                      paymentForm.paymentDate
                    }
                    onChange={
                      handlePaymentChange
                    }
                    required
                  />

                </div>

                <div className="col-12 col-md-6">

                  <label className="form-label fw-semibold">
                    {tr(
                      "Amount",
                      "राशि",
                      "रक्कम"
                    )}
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    inputMode="decimal"
                    className="form-control"
                    name="amount"
                    value={
                      paymentForm.amount
                    }
                    onChange={
                      handlePaymentChange
                    }
                    placeholder="₹"
                    required
                  />

                </div>

                <div className="col-12 col-md-6">

                  <label className="form-label fw-semibold">
                    {tr(
                      "Payment Mode",
                      "भुगतान का तरीका",
                      "पेमेंटचा प्रकार"
                    )}
                  </label>

                  <select
                    className="form-select"
                    name="paymentMode"
                    value={
                      paymentForm.paymentMode
                    }
                    onChange={
                      handlePaymentChange
                    }
                  >

                    <option value="Cash">
                      {tr(
                        "Cash",
                        "नकद",
                        "रोख"
                      )}
                    </option>

                    <option value="UPI">
                      UPI
                    </option>

                    <option value="Bank">
                      {tr(
                        "Bank",
                        "बैंक",
                        "बँक"
                      )}
                    </option>

                  </select>

                </div>

                <div className="col-12 col-md-6">

                  <label className="form-label fw-semibold">
                    {tr(
                      "Description",
                      "विवरण",
                      "वर्णन"
                    )}
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    name="description"
                    value={
                      paymentForm.description
                    }
                    onChange={
                      handlePaymentChange
                    }
                    placeholder={tr(
                      "Optional",
                      "वैकल्पिक",
                      "ऐच्छिक"
                    )}
                  />

                </div>

              </div>

              <div className="d-grid mt-3">

                <button
                  type="submit"
                  className="btn btn-success py-2"
                  disabled={
                    paymentLoading ||
                    paymentUpdateLoading
                  }
                >

                  {editingPaymentId
                    ? paymentUpdateLoading
                      ? tr(
                          "Updating...",
                          "अपडेट हो रहा है...",
                          "अपडेट होत आहे..."
                        )
                      : tr(
                          "Update Payment",
                          "भुगतान अपडेट करें",
                          "पेमेंट अपडेट करा"
                        )
                    : paymentLoading
                    ? tr(
                        "Saving...",
                        "सेव हो रहा है...",
                        "सेव्ह होत आहे..."
                      )
                    : tr(
                        "Save Payment",
                        "भुगतान सेव करें",
                        "पेमेंट सेव्ह करा"
                      )}

                </button>

                {editingPaymentId && (

                  <button
                    type="button"
                    className="btn btn-outline-secondary py-2 mt-2"
                    onClick={
                      resetPaymentForm
                    }
                  >
                    {tr(
                      "Cancel Edit",
                      "बदल रद्द करें",
                      "बदल रद्द करा"
                    )}
                  </button>

                )}

              </div>

            </form>

          </div>

        </div>

      )}

      {/* ==========================================
          MILK HISTORY
      ========================================== */}

      <div className="card border-0 shadow-sm mb-3">

        <div className="card-header bg-white d-flex justify-content-between align-items-center">

          <h5 className="mb-0 fw-bold">

            <FaTint className="text-primary me-2" />

            {tr(
              "Milk History",
              "दूध का इतिहास",
              "दूधाचा इतिहास"
            )}

          </h5>

          <span className="badge bg-primary">
            {milkHistory.length}
          </span>

        </div>

        <div className="card-body p-2">

          {milkHistory.length === 0 ? (

            <div className="text-center text-muted py-4">

              {tr(
                "No milk entries found",
                "दूध की कोई एंट्री नहीं मिली",
                "दुधाच्या नोंदी सापडल्या नाहीत"
              )}

            </div>

          ) : (

            <div className="d-flex flex-column gap-2">

              {milkHistory.map((milk) => (

                <div
                  key={milk.id}
                  className="border rounded p-3"
                >

                  <div className="d-flex justify-content-between align-items-start">

                    <div>

                      <div className="fw-bold">
                        {milk.entryDate}
                      </div>

                      <span
                        className={`badge mt-1 ${
                          milk.session ===
                          "Morning"
                            ? "bg-warning text-dark"
                            : "bg-info"
                        }`}
                      >
                        {translateSession(
                          milk.session
                        )}
                      </span>

                    </div>

                    <div className="text-end">

                      <div className="fw-bold text-success fs-5">
                        ₹
                        {Number(
                          milk.amount || 0
                        ).toFixed(2)}
                      </div>

                      <small className="text-muted">

                        {Number(
                          milk.quantity || 0
                        ).toFixed(2)}{" "}
                        L × ₹
                        {Number(
                          milk.rate || 0
                        ).toFixed(2)}

                      </small>

                    </div>

                  </div>

                  {milk.remarks && (

                    <div className="small text-muted mt-2">
                      {milk.remarks}
                    </div>

                  )}

                  <div className="d-flex gap-2 mt-3">

                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm flex-grow-1"
                      onClick={() =>
                        handleEditMilk(milk)
                      }
                    >

                      <FaEdit className="me-1" />

                      {tr(
                        "Edit",
                        "संपादित करें",
                        "संपादित करा"
                      )}

                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm flex-grow-1"
                      onClick={() =>
                        handleDeleteMilk(
                          milk.id
                        )
                      }
                    >

                      <FaTrash className="me-1" />

                      {tr(
                        "Delete",
                        "हटाएँ",
                        "हटवा"
                      )}

                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

      {/* ==========================================
          PAYMENT HISTORY
      ========================================== */}

      <div className="card border-0 shadow-sm mb-3">

        <button
          type="button"
          className="btn btn-white text-start w-100 p-3"
          onClick={() =>
            setShowPayments(
              !showPayments
            )
          }
        >

          <div className="d-flex justify-content-between align-items-center">

            <div>

              <FaMoneyBillWave className="text-success me-2" />

              <strong>
                {tr(
                  "Payment History",
                  "भुगतान इतिहास",
                  "पेमेंट इतिहास"
                )}
              </strong>

              <span className="badge bg-success ms-2">
                {paymentHistory.length}
              </span>

            </div>

            {showPayments ? (
              <FaChevronUp />
            ) : (
              <FaChevronDown />
            )}

          </div>

        </button>

        {showPayments && (

          <div className="card-body pt-0">

            {paymentHistory.length === 0 ? (

              <div className="text-center text-muted py-3">

                {tr(
                  "No payments found",
                  "कोई भुगतान नहीं मिला",
                  "पेमेंट सापडले नाही"
                )}

              </div>

            ) : (

              <div className="d-flex flex-column gap-2">

                {paymentHistory.map(
                  (payment) => (

                    <div
                      key={payment.id}
                      className="border rounded p-3"
                    >

                      <div className="d-flex justify-content-between">

                        <div>

                          <div className="fw-bold">
                            {
                              payment.transactionDate
                            }
                          </div>

                          <span className="badge bg-light text-dark border mt-1">

                            {translatePaymentMode(
                              payment.paymentMode
                            )}

                          </span>

                        </div>

                        <div className="text-end">

                          <div className="fw-bold text-success fs-5">

                            ₹
                            {Number(
                              payment.debit || 0
                            ).toFixed(2)}

                          </div>

                        </div>

                      </div>

                      {payment.description && (

                        <div className="small text-muted mt-2">
                          {payment.description}
                        </div>

                      )}

                      <div className="d-flex gap-2 mt-3">

                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm flex-grow-1"
                          onClick={() =>
                            handleEditPayment(
                              payment
                            )
                          }
                        >

                          <FaEdit className="me-1" />

                          {tr(
                            "Edit",
                            "संपादित करें",
                            "संपादित करा"
                          )}

                        </button>

                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm flex-grow-1"
                          onClick={() =>
                            handleDeletePayment(
                              payment.id
                            )
                          }
                        >

                          <FaTrash className="me-1" />

                          {tr(
                            "Delete",
                            "हटाएँ",
                            "हटवा"
                          )}

                        </button>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

        )}

      </div>

      {/* ==========================================
          STATEMENT
      ========================================== */}

      <div className="card border-0 shadow-sm mb-4">

        <button
          type="button"
          className="btn btn-white text-start w-100 p-3"
          onClick={() =>
            setShowStatement(
              !showStatement
            )
          }
        >

          <div className="d-flex justify-content-between align-items-center">

            <div>

              <FaBook className="text-primary me-2" />

              <strong>
                {tr(
                  "Account Statement",
                  "खाता विवरण",
                  "खाते विवरण"
                )}
              </strong>

              <span className="badge bg-secondary ms-2">
                {statement.length}
              </span>

            </div>

            {showStatement ? (
              <FaChevronUp />
            ) : (
              <FaChevronDown />
            )}

          </div>

        </button>

        {showStatement && (

          <div className="card-body pt-0">

            {statement.length === 0 ? (

              <div className="text-center text-muted py-3">

                {tr(
                  "No transactions found",
                  "कोई लेन-देन नहीं मिला",
                  "कोणतेही व्यवहार सापडले नाहीत"
                )}

              </div>

            ) : (

              <div className="d-flex flex-column gap-2">

                {statement.map(
                  (transaction) => (

                    <div
                      key={transaction.id}
                      className="border rounded p-3"
                    >

                      <div className="d-flex justify-content-between align-items-start">

                        <div>

                          <div className="fw-bold">
                            {
                              transaction.transactionDate
                            }
                          </div>

                          <span
                            className={`badge mt-1 ${
                              transaction.type ===
                              "Milk"
                                ? "bg-success"
                                : transaction.type ===
                                  "Payment"
                                ? "bg-primary"
                                : "bg-secondary"
                            }`}
                          >

                            {translateTransactionType(
                              transaction.type
                            )}

                          </span>

                        </div>

                        <div className="text-end">

                          {Number(
                            transaction.credit || 0
                          ) > 0 && (

                            <div className="text-success fw-bold">

                              + ₹
                              {Number(
                                transaction.credit
                              ).toFixed(2)}

                            </div>

                          )}

                          {Number(
                            transaction.debit || 0
                          ) > 0 && (

                            <div className="text-danger fw-bold">

                              - ₹
                              {Number(
                                transaction.debit
                              ).toFixed(2)}

                            </div>

                          )}

                        </div>

                      </div>

                      <div className="small text-muted mt-2">

                        {
                          transaction.description ||
                          "-"
                        }

                      </div>

                      <div className="border-top mt-2 pt-2 d-flex justify-content-between">

                        <small className="text-muted">

                          {tr(
                            "Balance",
                            "बकाया",
                            "शिल्लक"
                          )}

                        </small>

                        <strong>

                          ₹
                          {Number(
                            transaction.balance || 0
                          ).toFixed(2)}

                        </strong>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

        )}

      </div>

      {/* MOBILE PRINT */}

      <div className="d-md-none d-grid mb-4">

        <button
          className="btn btn-outline-primary"
          onClick={handlePrint}
        >

          <FaPrint className="me-2" />

          {tr(
            "Print Statement",
            "खाता विवरण प्रिंट करें",
            "खाते विवरण प्रिंट करा"
          )}

        </button>

      </div>

    </div>

  );

};

export default CustomerDetails;