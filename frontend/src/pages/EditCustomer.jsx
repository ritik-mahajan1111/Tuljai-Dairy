import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import CustomerForm from "../components/CustomerForm";

import {

getCustomerById,

updateCustomer,

} from "../services/customerService";

const EditCustomer = () => {

const { id } = useParams();

const navigate = useNavigate();

const [customer, setCustomer] = useState(null);

const loadCustomer = async () => {

try {

const data = await getCustomerById(id);

setCustomer(data.customer);

}

catch (err) {

console.log(err);

}

};

useEffect(() => {

loadCustomer();

}, []);

const update = async (form) => {

try {

await updateCustomer(id, form);

alert("Customer Updated");

navigate("/customers");

}

catch (err) {

alert(err.response?.data?.message);

}

};

if (!customer)

return <h3>Loading...</h3>;

return (

<div className="card shadow p-4">

<h3 className="mb-4">

Edit Customer

</h3>

<CustomerForm

initialData={customer}

onSubmit={update}

buttonText="Update Customer"

/>

</div>

);

};

export default EditCustomer;