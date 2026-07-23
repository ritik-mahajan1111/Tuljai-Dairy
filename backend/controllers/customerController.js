import { Customer } from "../models/index.js";

// Add Customer
export const addCustomer = async (req, res) => {
  try {
    const {
      fullName,
      mobile,
      address,
      village,
      milkType,
      defaultRate,
      shift,
      notes,
      openingBalance,
    } = req.body;

    if (!fullName || !mobile) {
      return res.status(400).json({
        success: false,
        message: "Full Name and Mobile are required",
      });
    }

    // Check duplicate customer for same user
    const existingCustomer = await Customer.findOne({
      where: {
        mobile,
        userId: req.user.id,
      },
    });

    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: "Customer already exists",
      });
    }

    // Auto Generate Customer Code
const totalCustomers = await Customer.count({
  where: {
    userId: req.user.id,
  },
});

const customer = await Customer.create({
  customerCode: `TD${String(totalCustomers + 1).padStart(4, "0")}`,
  fullName,
  mobile,
  address,
  village,
  milkType,
  defaultRate,
  shift,
  notes,
  openingBalance: openingBalance || 0,
  currentBalance: openingBalance || 0,
  userId: req.user.id,
});

    return res.status(201).json({
      success: true,
      message: "Customer Added Successfully",
      customer,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// Get All Customers
export const getCustomers = async (req, res) => {

  try {

    const customers = await Customer.findAll({

      where: {
        userId: req.user.id,
        status: "Active",
      },

      order: [["createdAt", "DESC"]],

    });

    res.json({
      success: true,
      total: customers.length,
      customers,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
 

  // Get Customer By ID
export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findOne({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer Not Found",
      });
    }

    res.status(200).json({
      success: true,
      customer,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// Update Customer
export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findOne({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer Not Found",
      });
    }

    const {
      fullName,
      mobile,
      address,
      openingBalance,
      currentBalance,
      status,
    } = req.body;

    await customer.update({
      fullName,
      mobile,
      address,
      openingBalance,
      currentBalance,
      status,
    });

    return res.status(200).json({
      success: true,
      message: "Customer Updated Successfully",
      customer,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

//delete customer

export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findOne({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer Not Found",
      });
    }

    await customer.update({
      status: "Inactive",
    });

    return res.status(200).json({
      success: true,
      message: "Customer Deleted Successfully",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};