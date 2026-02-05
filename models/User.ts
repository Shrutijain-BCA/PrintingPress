import mongoose, { Schema, models } from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new Schema(
  {
    role: {
      type: String,
      enum: ["student", "shop"],
      required: true,
    },
    identifier: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next: any) {
  if (!this.isModified("password")){
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});
export default models.User || mongoose.model("User", UserSchema);
