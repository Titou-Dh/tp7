const mongoose = require("mongoose");

const livreSchema = new mongoose.Schema(
  {
    titre: {
      type: String,
      required: [true, "Le titre est obligatoire"],
      trim: true,
    },
    auteur: {
      type: String,
      required: [true, "L'auteur est obligatoire"],
      trim: true,
    },
    date_publication: {
      type: Date,
      required: [true, "La date de publication est obligatoire"],
    },
    genre: {
      type: String,
      required: [true, "Le genre est obligatoire"],
      trim: true,
    },
    disponible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Livre = mongoose.model("Livre", livreSchema);

module.exports = Livre;
