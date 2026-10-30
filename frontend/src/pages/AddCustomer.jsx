import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUserPlus } from "react-icons/fa";
import toast from "react-hot-toast";

import CustomerForm from "../components/CustomerForm";
import { addCustomer } from "../services/customerService";

import { useLanguage } from "../i18n/LanguageContext";

const AddCustomer = () => {
  const navigate = useNavigate();

  const { t } = useLanguage();

  const initialData = {
    fullName: "",
    mobile: "",
    village: "",
    address: "",
    milkType: "Cow",
    defaultRate: "",
    openingBalance: "",
  };

  const saveCustomer = async (form) => {
    try {
      await addCustomer(form);

      toast.success(t("customerAdded"));

      navigate("/customers");
    } catch (error) {
      console.error("Add customer error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to add customer"
      );
    }
  };

  return (
    <div className="container-fluid pb-5">

      {/* ==========================================
          HEADER
      ========================================== */}
      <div className="d-flex align-items-center gap-3 mb-3">

        <button
          type="button"
          className="btn btn-light border rounded-circle"
          style={{
            width: "42px",
            height: "42px",
          }}
          onClick={() => navigate("/customers")}
        >
          <FaArrowLeft />
        </button>

        <div>
          <h3 className="fw-bold mb-0">
            {t("addCustomer")}
          </h3>

          <small className="text-muted">
            {t("createNewCustomer")}
          </small>
        </div>

      </div>

      {/* ==========================================
          FORM
      ========================================== */}
      <div className="card border-0 shadow-sm">

        <div className="card-header bg-success text-white py-3">

          <div className="d-flex align-items-center">

            <FaUserPlus className="me-2" />

            <strong>
              {t("customerDetails")}
            </strong>

          </div>

        </div>

        <div className="card-body p-3 p-md-4">

          <CustomerForm
            initialData={initialData}
            onSubmit={saveCustomer}
            buttonText={t("saveCustomer")}
          />

        </div>

      </div>

    </div>
  );
};

export default AddCustomer;