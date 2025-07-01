import { Apartment, Reservation } from "../models/bravabook.model.js";
// import { getRenderObject } from '../controller/bravabookControllers.js';
import { getRenderObject } from '../utils/getRender.js';



// ******************** Endpoint de Admnin ********************
// *** Mostramos la pagina de administradores ***
export const getAdminPanel = (req, res) => {
  const renderData = getRenderObject(
    "Administrador",
    [],
    [],
    req,
    null,
    undefined,
    "admin"
  );
  res.status(200).render("adminApartment.ejs", renderData);
};

// ******************** Formulario para añadir nuevo apartamento ********************
// *** Mostramos El formulario para añadir un nuevo apartamento ***
export const getNewApartment = async (req, res) => {
  const renderData = getRenderObject(
    "Añadir nuevo apartamento",
    [],
    [],
    req,
    null,
    undefined,
    "admin"
  );
  console.log("addApartment.ejs");
  console.log("desde GET /admin/apartment/new hasta addApartment.ejs");

  res.status(200).render("addApartment.ejs", renderData);
};


// ********** Reservas **********
// *** Mostramos todas las reservas ***
export const getReservations = async (req, res) => {
  try {
    const dataReservations = await Reservation.find().sort("startDate");
    const renderData = getRenderObject(
      "Inicio",
      [],
      dataReservations,
      req,
      null,
      undefined,
      "home"
    );
    console.log("desde GET / hasta home.ejs");
    res.status(200).render("reservations.ejs", renderData);
  } catch (error) {
    console.error("Error al obtener apartamentos:", error);
    res.status(500).render("error.ejs", {
      message: "Error interno del servidor",
      status: 404,
    });
  }
};
