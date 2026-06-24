const mongoose = require('mongoose');

const historySchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    type: {
      type: String,
      required: true,
      enum: ['logo', 'post', 'name', 'general', 'email', 'product', 'summarize'],
    },
    prompt: {
      type: String,
      required: true,
    },
    result: {
      type: String, // Can be text or an image URL
      required: true,
    },
    isImage: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

const History = mongoose.model('History', historySchema);
module.exports = History;
