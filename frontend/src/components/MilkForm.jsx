import { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";

const MilkForm = ({
  customers,
  onSubmit,
}) => {

  const { t } = useLanguage();

  const [form, setForm] = useState({

    customerId: "",

    entryDate: new Date()
      .toISOString()
      .split("T")[0],

    session: "Morning",

    quantity: "",

    rate: "",

    remarks: "",

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

              <option

                key={c.id}

                value={c.id}

              >

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

            name="entryDate"

            value={form.entryDate}

            onChange={handleChange}

          />

        </div>

        <div className="col-md-3 mb-3">

          <label>{t("session")}</label>

          <select

            className="form-select"

            name="session"

            value={form.session}

            onChange={handleChange}

          >

            <option value="Morning">

              {t("morning")}

            </option>

            <option value="Evening">

              {t("evening")}

            </option>

          </select>

        </div>

        <div className="col-md-4 mb-3">

          <label>{t("quantityLiters")}</label>

          <input

            className="form-control"

            name="quantity"

            value={form.quantity}

            onChange={handleChange}

            required

          />

        </div>

        <div className="col-md-4 mb-3">

          <label>{t("rate")}</label>

          <input

            className="form-control"

            name="rate"

            value={form.rate}

            onChange={handleChange}

          />

        </div>

        <div className="col-md-4 mb-3">

          <label>{t("remarks")}</label>

          <input

            className="form-control"

            name="remarks"

            value={form.remarks}

            onChange={handleChange}

          />

        </div>

      </div>

      <button className="btn btn-success">

        {t("saveMilkEntry")}

      </button>

    </form>

  );

};

export default MilkForm;