const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      lowercase: true,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    avatar_url: {
      type: String,
      required: true
    },
    votes: {
      articles: { type: Schema.Types.Mixed, default: {} },
      comments: { type: Schema.Types.Mixed, default: {} }
    },
    password: {
      type: String,
      required: true
    }
  },
  { minimize: false }
);

module.exports = mongoose.model("users", UserSchema);
