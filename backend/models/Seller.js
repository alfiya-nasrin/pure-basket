import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    brandName: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    location: {
        type: String,
        required: true,
    },

    socialLinks: {
        instagram: { type: String, default: "" },
    },

    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    }

}, { timestamps: true });

const Seller = mongoose.model("Seller", sellerSchema);

export default Seller;
