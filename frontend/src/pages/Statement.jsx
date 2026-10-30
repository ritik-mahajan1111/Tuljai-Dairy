import { useEffect, useState } from "react";
import { getCustomers } from "../services/customerService";
import { getStatement } from "../services/statementService";

import { useLanguage } from "../i18n/LanguageContext";
import { translateCustomerName } from "../utils/nameTranslator";

const Statement = () => {

  const { t, language } = useLanguage();

  const [customers, setCustomers] = useState([]);

  const [selectedCustomer, setSelectedCustomer] = useState("");

  const [statement, setStatement] = useState(null);

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

  const loadStatement = async (customerId) => {

    if (!customerId) return;

    try {

      const data = await getStatement(customerId);

      setStatement(data);

    } catch (err) {

      console.log(err);

    }

  };

  // ==========================================
  // Translate Transaction Type
  // ==========================================
  const getTransactionType = (type) => {

    if (type === "Milk") {
      return t("milk");
    }

    if (type === "Payment") {
      return t("payment");
    }

    if (type === "Opening") {
      return t("opening");
    }

    return type;

  };

  return (

    <div className="container-fluid">

      <div className="card shadow p-4">

        <h3 className="mb-4">

          {t("customerStatement")}

        </h3>

        <div className="row mb-4">

          <div className="col-md-5">

            <select
              className="form-select"
              value={selectedCustomer}
              onChange={(e) => {

                setSelectedCustomer(e.target.value);

                loadStatement(e.target.value);

              }}
            >

              <option value="">

                {t("selectCustomerOption")}

              </option>

              {

                customers.map((customer) => (

                  <option
                    key={customer.id}
                    value={customer.id}
                  >

                    {translateCustomerName(
                      customer.fullName,
                      language
                    )}

                  </option>

                ))

              }

            </select>

          </div>

        </div>

        {

          statement && (

            <>

              <div className="row mb-4">

                <div className="col-md-3">

                  <div className="card p-3">

                    <h6>

                      {t("name")}

                    </h6>

                    <strong>

                      {translateCustomerName(
                        statement.customer.fullName,
                        language
                      )}

                    </strong>

                  </div>

                </div>

                <div className="col-md-3">

                  <div className="card p-3">

                    <h6>

                      {t("opening")}

                    </h6>

                    <strong>

                      ₹ {statement.openingBalance}

                    </strong>

                  </div>

                </div>

                <div className="col-md-3">

                  <div className="card p-3">

                    <h6>

                      {t("current")}

                    </h6>

                    <strong>

                      ₹ {statement.currentBalance}

                    </strong>

                  </div>

                </div>

                <div className="col-md-3">

                  <div className="card p-3">

                    <h6>

                      {t("transactions")}

                    </h6>

                    <strong>

                      {statement.totalTransactions}

                    </strong>

                  </div>

                </div>

              </div>

              <div className="table-responsive">

                <table className="table table-bordered">

                  <thead className="table-success">

                    <tr>

                      <th>
                        {t("date")}
                      </th>

                      <th>
                        {t("type")}
                      </th>

                      <th>
                        {t("description")}
                      </th>

                      <th>
                        {t("credit")}
                      </th>

                      <th>
                        {t("debit")}
                      </th>

                      <th>
                        {t("balance")}
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {

                      statement.transactions.map((item) => (

                        <tr key={item.id}>

                          <td>
                            {item.transactionDate}
                          </td>

                          <td>
                            {getTransactionType(item.type)}
                          </td>

                          <td>
                            {item.description}
                          </td>

                          <td className="text-success">
                            ₹ {item.credit}
                          </td>

                          <td className="text-danger">
                            ₹ {item.debit}
                          </td>

                          <td>
                            ₹ {item.balance}
                          </td>

                        </tr>

                      ))

                    }

                  </tbody>

                </table>

              </div>

              <div className="mt-4">

                <button
                  className="btn btn-primary"
                  onClick={() => window.print()}
                >

                  {t("printStatement")}

                </button>

              </div>

            </>

          )

        }

      </div>

    </div>

  );

};

export default Statement;