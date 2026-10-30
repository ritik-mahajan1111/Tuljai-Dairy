// ==========================================
// MSG91 SMS Service
// ==========================================

const MSG91_URL = "https://api.msg91.com/api/v5/flow/";

export const sendCustomerSMS = async ({
  mobile,
  variables = {},
}) => {
  try {
    if (!mobile) {
      return {
        success: false,
        message: "Customer mobile number is missing",
      };
    }

    if (!process.env.MSG91_AUTH_KEY) {
      console.log("⚠️ MSG91_AUTH_KEY is not configured");

      return {
        success: false,
        message: "MSG91 Auth Key not configured",
      };
    }

    if (!process.env.MSG91_FLOW_ID) {
      console.log("⚠️ MSG91_FLOW_ID is not configured");

      return {
        success: false,
        message: "MSG91 Flow ID not configured",
      };
    }

    if (!process.env.MSG91_SENDER_ID) {
      console.log("⚠️ MSG91_SENDER_ID is not configured");

      return {
        success: false,
        message: "MSG91 Sender ID not configured",
      };
    }

    // Convert Indian 10 digit number to 91XXXXXXXXXX
    let formattedMobile = String(mobile).replace(/\D/g, "");

    if (formattedMobile.length === 10) {
      formattedMobile = `91${formattedMobile}`;
    }

    const recipient = {
      mobiles: formattedMobile,
      ...variables,
    };

    const response = await fetch(MSG91_URL, {
      method: "POST",

      headers: {
        authkey: process.env.MSG91_AUTH_KEY,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        flow_id: process.env.MSG91_FLOW_ID,
        sender: process.env.MSG91_SENDER_ID,
        recipients: [recipient],
      }),
    });

    const data = await response.json();

    console.log("MSG91 Response:", data);

    if (!response.ok || data?.type === "error") {
      return {
        success: false,
        message: data?.message || "MSG91 SMS failed",
        response: data,
      };
    }

    return {
      success: true,
      message: "SMS sent successfully",
      response: data,
    };

  } catch (error) {
    console.error("MSG91 SMS Error:", error);

    return {
      success: false,
      message: error.message,
    };
  }
};