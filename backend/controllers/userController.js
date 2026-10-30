import bcrypt from "bcryptjs";
import { User } from "../models/index.js";

// ==========================================
// Get Profile
// ==========================================
export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: {
        exclude: ["password"],
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.log("Get Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Update Profile
// ==========================================
export const updateProfile = async (req, res) => {
  try {
    const {
      fullName,
      email,
      mobile,
      address,
    } = req.body;

    if (!fullName || !mobile) {
      return res.status(400).json({
        success: false,
        message: "Name and Mobile are required",
      });
    }

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    // Check mobile belongs to another account
    const mobileExists = await User.findOne({
      where: {
        mobile,
      },
    });

    if (
      mobileExists &&
      Number(mobileExists.id) !== Number(user.id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Mobile number already registered",
      });
    }

    // Check email belongs to another account
    if (email) {
      const emailExists = await User.findOne({
        where: {
          email,
        },
      });

      if (
        emailExists &&
        Number(emailExists.id) !== Number(user.id)
      ) {
        return res.status(400).json({
          success: false,
          message: "Email already registered",
        });
      }
    }

    await user.update({
      fullName,
      email: email || null,
      mobile,
      address: address || "",
    });

    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      user: {
        id: user.id,
        fullName: user.fullName,
        mobile: user.mobile,
        email: user.email,
        address: user.address,
        profileImage: user.profileImage,
        role: user.role,
      },
    });

  } catch (error) {
    console.log("Update Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Change Password
// ==========================================
export const changePassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "All password fields are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be at least 6 characters",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "New password and confirm password do not match",
      });
    }

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    // Verify current password
    const passwordMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    await user.update({
      password: hashedPassword,
    });

    return res.status(200).json({
      success: true,
      message: "Password Changed Successfully",
    });

  } catch (error) {
    console.log("Change Password Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};