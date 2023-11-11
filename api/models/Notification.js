// const mongoose = require("mongoose");

// const notificationSchema = mongoose.Schema({
//   postId: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//   },
//   message: {
//     type: String,
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const Notification = mongoose.model("notification", notificationSchema);

// module.exports = Notification;

const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const NotificationSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User' },
  receiver: { type: Schema.Types.ObjectId, ref: 'User' },
  type: String,
  post: { type: Schema.Types.ObjectId, ref: 'Post' },
  isRead: { type: Boolean, default: false },
});

const NotificationModel = model('Notification', NotificationSchema);

module.exports = NotificationModel;
