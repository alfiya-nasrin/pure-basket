import User from "../backend/models/User.js";
import Seller from "../backend/models/Seller.js";
import SellerDocuments from "../backend/models/SellerDocuments.js";

export const registerSeller = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,

      brandName,
      description,
      location,
      instagram,

      accountHolderName,
      accountNumber,
      ifscCode,

      fssaiNumber,
      aadhaarNumber,
      gstDocUrl,
    } = req.body;

    // basic validation
    if (
      !fullName ||
      !email ||
      !password ||
      !phone ||
      !brandName ||
      !description ||
      !location ||
      !accountHolderName ||
      !accountNumber ||
      !ifscCode ||
      !fssaiNumber ||
      !aadhaarNumber
    ) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // create user
    const newUser = await User.create({
      name: fullName,
      email,
      phone,
      password,
      role: "seller",
    });

    // create seller profile
    const seller = await Seller.create({
      userId: newUser._id,
      name: fullName, // FIXED
      brandName,
      description,
      location,
      socialLinks: {
        instagram: instagram || "",
      },
      status: "pending",
    });

    // create seller documents
    const sellerDocs = await SellerDocuments.create({
      sellerId: seller._id,
      fssaiNumber,
      aadhaarNumber,
      gstDocUrl: gstDocUrl || "",
      bankDetails: {
        accountHolderName,
        accountNumber,
        ifscCode,
      },
      kitchenPhotos: [],
    });

    return res.status(201).json({
      message: "Seller registered successfully",
      userId: newUser._id,
      sellerId: seller._id,
      documentsId: sellerDocs._id,
    });
  } catch (error) {
    console.error("Error registering seller:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
