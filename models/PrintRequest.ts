import mongoose, { Schema, models } from "mongoose";

const PrintRequestSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fromPage: {
      type: Number,
      required: true,
    },
    toPage: {
      type: Number,
      required: true,
    },
    copies: {
      type: Number,
      default: 1,
    },
    printType: {
      type: String,
      enum: ["bw", "color"],
      default: "bw",
    },
    status: {
      type: String,
      enum: ["pending", "preparing", "ready"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default models.PrintRequest ||
  mongoose.model("PrintRequest", PrintRequestSchema);
