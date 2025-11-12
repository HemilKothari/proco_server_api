const mongoose = require("mongoose");

const FilterSchema = new mongoose.Schema({
  selectedOptions: {
    type: [String], // Array of strings for selected options like 'Web Development', etc.
    default: [],
  },
  opportunityTypes: {
    type: Map, // Map for storing boolean values of opportunity types
    of: Boolean,
    default: {
      Internship: false,
      Research: false,
      Freelance: false,
      Competition: false,
    },
  },
  selectedLocationOption: {
    type: String, // Location type selected: 'City', 'State', or 'Country'
    enum: ["City", "State", "Country", ""], // Include empty string for no selection
    default: "",
  },
  locationDistance: {
    type: Number, // Distance in kilometers for 'City' filter
    default: 10.0, // Default value for the slider
  },
  selectedState: {
    type: String, // State selected from the dropdown
    default: "",
  },
  enteredCountry: {
    type: String, // Country name entered manually
    default: "",
  },
  customOptions: {
    type: String, // Array to store custom options added by the user
    default: [],
    required: false,
  },
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Filter", FilterSchema);
