import { useEffect, useState } from "react";

import PaymentForm from "../components/PaymentForm";

import { getCustomers } from "../services/customerService";

import {
  addPayment,
  getPaymentHistory,
  deletePayment,
} from "../services/paymentService";

import { useLanguage } from "../i18n/LanguageContext";

import { translateCustomerName } from "../utils/nameTranslator";

const Payments = () => {

  const { t, language } = useLanguage();

  const [customers, setCustomers] = useState([]);

  const [selectedCustomer, setSelectedCustomer] = useState("");

  const [payments, setPayments] = useState([]);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const data = await getCustomers();
    setCustomers(data.customers);
  };

  const loadPayments = async (id) => {

    if (!id) return;

    const data = await getPaymentHistory(id);

    setPayments(data.payments);

  };

  const savePayment = async (form) => {

    await addPayment(form);

    alert(t("paymentSaved"));

    setSelectedCustomer(form.customerId);

    loadPayments(form.customerId);

  };

  const removePayment = async (id) => {

    if (
      !window.confirm(
        t("deletePaymentConfirm")
      )
    ) {
      return;
    }

    await deletePayment(id);

    loadPayments(selectedCustomer);

  };

  return (

    <div>

      <div className="card shadow p-4 mb-4">

        <h3>
          {t("addPayment")}
        </h3>

        <PaymentForm

          customers={customers}

          onSubmit={savePayment}

        />

      </div>

      <div className="card shadow p-4">

        <div className="row mb-3">

          <div className="col-md-5">

            <select
              className="form-select"
              value={selectedCustomer}
              onChange={(e) => {

                setSelectedCustomer(e.target.value);

                loadPayments(e.target.value);

              }}
            >

              <option value="">

                {t("selectCustomerOption")}

              </option>

              {

                customers.map((c) => (

                  <option
                    key={c.id}
                    value={c.id}
                  >

                    {translateCustomerName(
                      c.fullName,
                      language
                    )}

                  </option>

                ))

              }

            </select>

          </div>

        </div>

        <table className="table table-bordered">

          <thead>

            <tr>

              <th>{t("date")}</th>

              <th>{t("amount")}</th>

              <th>{t("mode")}</th>

              <th>{t("description")}</th>

              <th>{t("action")}</th>

            </tr>

          </thead>

          <tbody>

            {

              payments.map((p) => (

                <tr key={p.id}>

                  <td>
                    {p.transactionDate}
                  </td>

                  <td>
                    ₹ {p.debit}
                  </td>

                  <td>

                    {p.paymentMode === "Cash"
                      ? t("cash")
                      : p.paymentMode === "Bank"
                      ? t("bank")
                      : p.paymentMode}

                  </td>

                  <td>
                    {p.description}
                  </td>

                  <td>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        removePayment(p.id)
                      }
                    >

                      {t("delete")}

                    </button>

                  </td>

                </tr>

              ))

            }

          </tbody>

        </table>

      </div>

    </div>

  );

};

export default Payments;