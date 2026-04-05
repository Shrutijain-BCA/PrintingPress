import mongoose, { Schema, models } from "mongoose";

const StationeryRequestSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    item: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "preparing", "ready"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default models.StationeryRequest ||
  mongoose.model("StationeryRequest", StationeryRequestSchema);
