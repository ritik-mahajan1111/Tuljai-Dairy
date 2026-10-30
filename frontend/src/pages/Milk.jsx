import { useEffect, useState } from "react";

import MilkForm from "../components/MilkForm";

import { getCustomers } from "../services/customerService";

import {
  addMilkEntry,
  getMilkHistory,
  deleteMilkEntry,
} from "../services/milkService";

import { useLanguage } from "../i18n/LanguageContext";

import { translateCustomerName } from "../utils/nameTranslator";

const Milk = () => {

  const { t, language } = useLanguage();

  const [customers, setCustomers] = useState([]);

  const [selectedCustomer, setSelectedCustomer] = useState("");

  const [history, setHistory] = useState([]);

  useEffect(() => {

    loadCustomers();

  }, []);

  const loadCustomers = async () => {

    try {

      const data = await getCustomers();

      setCustomers(data.customers);

    } catch (err) {

      console.log(err);

    }

  };

  const loadHistory = async (id) => {

    if (!id) return;

    const data = await getMilkHistory(id);

    setHistory(data.history);

  };

  const saveMilk = async (form) => {

    try {

      await addMilkEntry(form);

      alert(t("milkEntryAdded"));

      setSelectedCustomer(form.customerId);

      loadHistory(form.customerId);

    }

    catch (err) {

      alert(
        err.response?.data?.message ||
        t("unableToAddMilkEntry")
      );

    }

  };

  const removeMilk = async (id) => {

    if (
      !window.confirm(
        t("deleteMilkConfirm")
      )
    ) {
      return;
    }

    await deleteMilkEntry(id);

    loadHistory(selectedCustomer);

  };

  return (

    <div>

      <div className="card shadow p-4 mb-4">

        <h3>

          {t("addMilkEntry")}

        </h3>

        <MilkForm

          customers={customers}

          onSubmit={saveMilk}

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

                loadHistory(e.target.value);

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

              <th>{t("session")}</th>

              <th>{t("qty")}</th>

              <th>{t("rate")}</th>

              <th>{t("amount")}</th>

              <th>{t("action")}</th>

            </tr>

          </thead>

          <tbody>

            {

              history.map((item) => (

                <tr key={item.id}>

                  <td>

                    {item.entryDate}

                  </td>

                  <td>

                    {item.session === "Morning"
                      ? t("morning")
                      : item.session === "Evening"
                      ? t("evening")
                      : item.session}

                  </td>

                  <td>

                    {item.quantity}

                  </td>

                  <td>

                    {item.rate}

                  </td>

                  <td>

                    ₹ {item.amount}

                  </td>

                  <td>

                    <button

                      className="btn btn-danger btn-sm"

                      onClick={() =>
                        removeMilk(item.id)
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

export default Milk;