const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const UsersSchema = new Schema({
    email: {
        type: String, 
        required: true, 
        trim: true,
        unique: true,
    },
    password: {
        type: String, 
        required: true,
    },
    dateSignedUp: {
        type: Date, 
        required: true,
    },
    username: String,
    wagers: [],
    wagered: Number,
    wagersCount: Number,
    balance: Number,
});

module.exports = mongoose.model('Book', UsersSchema);