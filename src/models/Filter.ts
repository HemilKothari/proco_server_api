import { Schema, model, models } from "mongoose";

/* ======================== FILTER SCHEMA ======================== */
const FilterSchema = new Schema(
  {
    selectedOptions: {
      type: [String],
      default: [],
    },

    opportunityTypes: {
      type: Map,
      of: Boolean,
      default: {
        Internship: false,
        Research: false,
        Freelance: false,
        Competition: false,
      },
    },

    selectedLocationOption: {
      type: String,
      enum: ["City", "State", "Country", ""],
      default: "",
    },

    selectedCity: {
      type: String,
      default: "",
    },

    selectedState: {
      type: String,
      default: "",
    },

    selectedCountry: {
      type: String,
      default: "",
    },

    customOptions: {
      type: [String],
      default: [],
    },

    skills: {
      type: [String],
      default: [],
    },

    agentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);


/* ======================== MODEL ======================== */
const Filter = models.Filter || model("Filter", FilterSchema);
export default Filter;
