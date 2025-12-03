// /server/models/Seller.js
import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    shopName: { type: String, trim: true },
    phone: { type: String, trim: true },
    fssaiNumber: { type: String, trim: true },
    docs: [{ url: String, publicId: String }], // uploaded doc references
    location: {
      city: String,
      district: String,
      pin: String,
    },
    status: {
      type: String,
      enum: ["draft", "submitted", "under_review", "verified", "rejected"],
      default: "draft",
    },
    verificationTicket: { type: mongoose.Schema.Types.ObjectId, ref: "VerificationTicket" },
  },
  { timestamps: true }
);

const Seller = mongoose.model("Seller", sellerSchema);
export default Seller;
