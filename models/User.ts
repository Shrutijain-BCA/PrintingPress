import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    role: {
      type: String,
      enum: ["student", "shop"],
      required: true,
    },
    identifier: {
      type: String,
      required: true, // roll no or shop id
    },
  },
  { timestamps: true }
);

export default models.User || mongoose.model("User", UserSchema);
