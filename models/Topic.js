const mongoose = require("mongoose");
const { Schema } = mongoose;

const TopicSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    lowercase: true,
    required: true,
    unique: true
  },
  __v: false
});

module.exports = mongoose.model("topics", TopicSchema);
