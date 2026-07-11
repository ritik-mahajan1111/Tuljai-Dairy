import bcrypt from "bcryptjs";
import { User } from "../models/index.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const {
      fullName,
      mobile,
      email,
      password,
      address,
    } = req.body;

    if (!fullName || !mobile || !password) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    const existingUser = await User.findOne({
      where: { mobile },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Mobile already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      mobile,
      email,
      password: hashedPassword,
      address,
    });

    res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      user,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

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
  
      const isMatch = await bcrypt.compare(password, user.password);
  
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
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );
  
      res.status(200).json({
        success: true,
        message: "Login Successful",
        token,
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
      console.log(error);
  
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };