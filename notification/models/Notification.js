
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const NotificationSchema = new Schema({
  username: String,
  title:String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const NotificationModel = model('Notification', NotificationSchema);

module.exports = NotificationModel;
