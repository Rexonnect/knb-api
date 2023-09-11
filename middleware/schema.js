const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const UsersSchema = new Schema({
    email: {
        type: String, 
        required: true, 
        trim: true,
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
    wagersCount: Number
});

module.exports = mongoose.model('Book', UsersSchema);