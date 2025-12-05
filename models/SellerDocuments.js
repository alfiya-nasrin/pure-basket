import mongoose from "mongoose";

const sellerDocumentsSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    fssaiNumber: {
      type: String,
      required: true,
    },
    fssaiDocUrl: {
      type: String, // later when you add upload
    },
    aadhaarNumber: {
      type: String,
      required: true,
    },
    aadhaarDocUrl: {
      type: String, // later when you add upload
    },
    gstDocUrl: {
      type: String, // optional
    },
    bankDetails: {
      accountHolderName: { type: String, required: true },
      accountNumber: { type: String, required: true },
      ifscCode: { type: String, required: true },
    },
    kitchenPhotos: [String], // later
  },
  { timestamps: true }
);

const SellerDocuments = mongoose.model(
  "SellerDocuments",
  sellerDocumentsSchema
);
export default SellerDocuments;
