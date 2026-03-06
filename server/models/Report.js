const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    reportId: { type: String, unique: true, required: true },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    waterSource: {
      type: String,
      enum: [
        "Borewell",
        "Municipal Supply",
        "Surface Water (River/Lake)",
        "Open Well",
        "Pond",
      ],
      required: true,
    },
    pH: { type: Number, required: true },
    turbidity: { type: Number, required: true },
    dissolvedOxygen: { type: Number },
    nitrateLevel: { type: Number },
    contaminantLevel: { type: Number },
    bacteriaCount: { type: Number },
    fecalColiform: {
      type: String,
      enum: ["Absent", "Present (Trace)", "Present (Significant)"],
      default: "Absent",
    },
    totalColiform: { type: Number },
    locationName: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    prediction: {
      riskLevel: {
        type: String,
        enum: ["low", "moderate", "high"],
      },
      riskPercent: Number,
      diseases: [
        {
          name: String,
          probability: Number,
        },
      ],
    },
    status: {
      type: String,
      enum: ["pending", "reviewed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
