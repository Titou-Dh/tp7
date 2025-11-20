const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./database");
const Livre = require("./models/Livre");

const app = express();

connectDB();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.post("/livres", async (req, res) => {
  try {
    const { titre, auteur, date_publication, genre, disponible } = req.body;

    if (!titre || !auteur || !date_publication || !genre) {
      return res.status(400).json({
        success: false,
        message:
          "Tous les champs sont obligatoires (titre, auteur, date_publication, genre)",
      });
    }

    const nouveauLivre = new Livre({
      titre,
      auteur,
      date_publication: new Date(date_publication),
      genre,
      disponible: disponible !== undefined ? disponible : true,
    });

    const livreSauvegarde = await nouveauLivre.save();

    res.status(201).json({
      success: true,
      message: "Livre ajouté avec succès",
      data: livreSauvegarde,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Erreur lors de l'ajout du livre",
      error: error.message,
    });
  }
});

app.get("/livres", async (req, res) => {
  try {
    const livres = await Livre.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: livres.length,
      data: livres,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des livres",
      error: error.message,
    });
  }
});

app.put("/livres/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { titre, auteur, date_publication, genre, disponible } = req.body;

    const livre = await Livre.findById(id);
    if (!livre) {
      return res.status(404).json({
        success: false,
        message: "Livre non trouvé",
      });
    }

    if (titre) livre.titre = titre;
    if (auteur) livre.auteur = auteur;
    if (date_publication) livre.date_publication = new Date(date_publication);
    if (genre) livre.genre = genre;
    if (disponible !== undefined) livre.disponible = disponible;

    const livreModifie = await livre.save();

    res.status(200).json({
      success: true,
      message: "Livre modifié avec succès",
      data: livreModifie,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "ID invalide",
      });
    }
    res.status(500).json({
      success: false,
      message: "Erreur lors de la modification du livre",
      error: error.message,
    });
  }
});

app.delete("/livres/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const livre = await Livre.findByIdAndDelete(id);

    if (!livre) {
      return res.status(404).json({
        success: false,
        message: "Livre non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      message: "Livre supprimé avec succès",
      data: livre,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "ID invalide",
      });
    }
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression du livre",
      error: error.message,
    });
  }
});

app.get("/livres/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const livre = await Livre.findById(id);

    if (!livre) {
      return res.status(404).json({
        success: false,
        message: "Livre non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      data: livre,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "ID invalide",
      });
    }
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du livre",
      error: error.message,
    });
  }
});

app.get("/", (req, res) => {
  res.json({
    message: "API REST Bibliothèque - MongoDB TP7",
    endpoints: {
      "POST /livres": "Ajouter un livre",
      "GET /livres": "Lister tous les livres",
      "GET /livres/:id": "Récupérer un livre par ID",
      "PUT /livres/:id": "Modifier un livre",
      "DELETE /livres/:id": "Supprimer un livre",
    },
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route non trouvée",
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Erreur serveur",
    error: err.message,
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`URL: http://localhost:${PORT}`);
});

module.exports = app;
