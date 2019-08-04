const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const signInSchema = new Schema({
    email: String,
    password: String,
    userFrom: Boolean,
    role: String,
    hospitalPin: String,
    hospitalName: String,
});
module.exports = mongoose.model('signInModel', signInSchema);
