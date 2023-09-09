const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const yourSchema = new Schema({
  // Define your schema fields here
  fieldName1: String,
  fieldName2: Number,
});

// Create a model for the schema
const YourModel = mongoose.model('YourModel', yourSchema);

module.exports = YourModel;