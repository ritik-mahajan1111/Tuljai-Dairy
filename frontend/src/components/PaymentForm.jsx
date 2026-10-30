import { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";

const PaymentForm = ({ customers, onSubmit }) => {

  const { t } = useLanguage();

  const [form, setForm] = useState({
    customerId: "",
    paymentDate: new Date().toISOString().split("T")[0],
    amount: "",
    paymentMode: "Cash",
    description: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={submit}>

      <div className="row">

        <div className="col-md-6 mb-3">

          <label>{t("customer")}</label>

          <select
            className="form-select"
            name="customerId"
            value={form.customerId}
            onChange={handleChange}
            required
          >

            <option value="">
              {t("selectCustomerOption")}
            </option>

            {customers.map((c) => (

              <option key={c.id} value={c.id}>
                {c.fullName}
              </option>

            ))}

          </select>

        </div>

        <div className="col-md-3 mb-3">

          <label>{t("date")}</label>

          <input
            type="date"
            className="form-control"
            name="paymentDate"
            value={form.paymentDate}
            onChange={handleChange}
          />

        </div>

        <div className="col-md-3 mb-3">

          <label>{t("amount")}</label>

          <input
            className="form-control"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            required
          />

        </div>

        <div className="col-md-6 mb-3">

          <label>{t("paymentMode")}</label>

          <select
            className="form-select"
            name="paymentMode"
            value={form.paymentMode}
            onChange={handleChange}
          >

            <option value="Cash">
              {t("cash")}
            </option>

            <option value="UPI">
              UPI
            </option>

            <option value="Bank">
              {languageBankLabel(t)}
            </option>

          </select>

        </div>

        <div className="col-md-6 mb-3">

          <label>{t("description")}</label>

          <input
            className="form-control"
            name="description"
            value={form.description}
            onChange={handleChange}
          />

        </div>

      </div>

      <button className="btn btn-success">
        {t("savePayment")}
      </button>

    </form>
  );
};

const languageBankLabel = (t) => {
  const translated = t("bank");

  return translated === "bank"
    ? "Bank"
    : translated;
};

export default PaymentForm;