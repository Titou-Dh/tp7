const mongoose = require("mongoose");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/bibliotheque";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connexion à MongoDB réussie");
    console.log(` Base de données: ${mongoose.connection.name}`);
  } catch (error) {
    console.error(" Erreur de connexion à MongoDB:", error.message);
    process.exit(1);
  }
};

mongoose.connection.on("error", (err) => {
  console.error(" Erreur MongoDB:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log(" MongoDB déconnecté");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("👋 Connexion MongoDB fermée");
  process.exit(0);
});

module.exports = connectDB;
