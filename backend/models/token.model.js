import mongoose, { mongo } from "mongoose";

const schema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  refreshToken: String,
  expiresAt: {
    type: Date,
    default: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
});

schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const tokenModel = mongoose.model("token", schema);

export default tokenModel;
