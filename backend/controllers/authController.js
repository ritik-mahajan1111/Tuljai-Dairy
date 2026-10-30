import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

// ==========================================
// REGISTER DAIRY OWNER
// ==========================================
export const register = async (req, res) => {
  try {
    const {
      fullName,
      dairyName,
      mobile,
      email,
      password,
      address,
    } = req.body;

    // Validation
    if (!fullName || !dairyName || !mobile || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Full Name, Dairy Name, Mobile and Password are required",
      });
    }

    // Mobile validation
    if (!/^[0-9]{10}$/.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10 digit mobile number",
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Check mobile
    const existingMobile = await User.findOne({
      where: { mobile },
    });

    if (existingMobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number already registered",
      });
    }

    // Check email if provided
    if (email) {
      const existingEmail = await User.findOne({
        where: { email },
      });

      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already registered",
        });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create owner
    const user = await User.create({
      fullName,
      dairyName,
      mobile,
      email: email || null,
      password: hashedPassword,
      address: address || "",
      role: "user",
    });

    return res.status(201).json({
      success: true,
      message: "Dairy Owner Registered Successfully",

      user: {
        id: user.id,
        fullName: user.fullName,
        dairyName: user.dairyName,
        mobile: user.mobile,
        email: user.email,
        address: user.address,
        profileImage: user.profileImage,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// LOGIN
// ==========================================
export const login = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
      return res.status(400).json({
        success: false,
        message: "Mobile and Password are required",
      });
    }

    const user = await User.findOne({
      where: { mobile },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        mobile: user.mobile,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login Successful",

      token,

      user: {
        id: user.id,
        fullName: user.fullName,
        dairyName: user.dairyName,
        mobile: user.mobile,
        email: user.email,
        address: user.address,
        profileImage: user.profileImage,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};