import { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";

const CustomerForm = ({
  initialData,
  onSubmit,
  buttonText,
}) => {

  const { t, language } = useLanguage();

  const [form, setForm] = useState({
    fullName: initialData?.fullName || "",
    mobile: initialData?.mobile || "",
    village: initialData?.village || "",
    address: initialData?.address || "",
    milkType: initialData?.milkType || "Cow",
    defaultRate: initialData?.defaultRate || "",
    openingBalance: initialData?.openingBalance || "",
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

  // ==========================================
  // Customer Name Label
  // ==========================================
  const getNameLabel = () => {

    if (language === "mr") {
      return "नाव";
    }

    if (language === "en") {
      return "Name";
    }

    return "नाम";
  };

  // ==========================================
  // Customer Name Placeholder
  // ==========================================
  const getNamePlaceholder = () => {

    if (language === "mr") {
      return "ग्राहकाचे नाव लिहा";
    }

    if (language === "en") {
      return "Enter customer name";
    }

    return "ग्राहक का नाम लिखें";
  };

  return (

    <form onSubmit={submit}>

      <div className="row">

        {/* ==========================================
            Customer Name
        ========================================== */}
        <div className="col-md-6 mb-3">

          <label>
            {getNameLabel()}
          </label>

          <input
            type="text"
            className="form-control"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder={getNamePlaceholder()}
            required
          />

        </div>

        {/* ==========================================
            Mobile
        ========================================== */}
        <div className="col-md-6 mb-3">

          <label>
            {t("mobile")}
          </label>

          <input
            type="text"
            className="form-control"
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            required
          />

        </div>

        {/* ==========================================
            Village
        ========================================== */}
        <div className="col-md-6 mb-3">

          <label>
            {t("village")}
          </label>

          <input
            type="text"
            className="form-control"
            name="village"
            value={form.village}
            onChange={handleChange}
          />

        </div>

        {/* ==========================================
            Address
        ========================================== */}
        <div className="col-md-6 mb-3">

          <label>
            {t("address")}
          </label>

          <input
            type="text"
            className="form-control"
            name="address"
            value={form.address}
            onChange={handleChange}
          />

        </div>

        {/* ==========================================
            Milk Type
        ========================================== */}
        <div className="col-md-4 mb-3">

          <label>
            {t("milkType")}
          </label>

          <select
            className="form-select"
            name="milkType"
            value={form.milkType}
            onChange={handleChange}
          >

            <option value="Cow">
              {t("cow")}
            </option>

            <option value="Buffalo">
              {t("buffalo")}
            </option>

            <option value="Mixed">
              {t("mixed")}
            </option>

          </select>

        </div>

        {/* ==========================================
            Rate
        ========================================== */}
        <div className="col-md-4 mb-3">

          <label>
            {t("rate")}
          </label>

          <input
            type="number"
            className="form-control"
            name="defaultRate"
            value={form.defaultRate}
            onChange={handleChange}
          />

        </div>

        {/* ==========================================
            Opening Balance
        ========================================== */}
        <div className="col-md-4 mb-3">

          <label>
            {t("openingBalance")}
          </label>

          <input
            type="number"
            className="form-control"
            name="openingBalance"
            value={form.openingBalance}
            onChange={handleChange}
          />

        </div>

      </div>

      <button
        type="submit"
        className="btn btn-success"
      >
        {buttonText}
      </button>

    </form>

  );

};

export default CustomerForm;