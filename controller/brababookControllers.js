import { Apartment, Reservation } from "../models/brababook.model.js";

export const getApartments = async (req, res) => {
  try {
    const dataApartments = await Apartment.find({ active: true }).limit(12);
    const renderData = getRenderObject(
      "Inicio",
      dataApartments,
      [],
      req,
      null,
      undefined,
      "home"
    );
    console.log("desde GET / hasta home.ejs");
    res.status(200).render("home.ejs", renderData);
  } catch (error) {
    console.error("Error al obtener apartamentos:", error);
    res.status(500).render("error.ejs", {
      message: "Error interno del servidor",
      status: 404,
    });
  }
};


