import express from "express";
const router = express.Router();
import { Apartment, Reservation } from "../models/bravabook.model.js";
// *** Admin ***
import { getAdminPanel, getNewApartment, getReservations, getSearchApartment } from '../controller/bravabookAdminControllers.js';
// *** Usuario ***
// import { getAllApartments, getAbout, getContact, getReservations } from '../controller/bravabookControllers.js';



// ****************************** Rutas ******************************
// ******************** Endpoint de Admnin ********************
// *** Mostramos la pagina de administradores ***
router.get("/", getAdminPanel);

// ******************** Añadir nuevo apartamento ********************
// ******************** Formulario para añadir nuevo apartamento ********************
// *** Mostramos El formulario para añadir un nuevo apartamento ***
router.get("/apartment/new", getNewApartment);

// ******************** Recuperamos datos del nuevo apartamento ********************
// *** Procesamos los datos del nuevo apartamento y lo guardamos en la BBDD ***
router.post("/apartment", async (req, res) => {
  console.log(req.body);
  try {
    const {
      title,
      description,
      rooms,
      bathrooms,
      price,
      maxGuests,
      squareMeters,
    } = req.body;

    // *** Normas ***
    const rules = Array.isArray(req.body.rules)
      ? req.body.rules.map((r) => r.trim()).filter((r) => r.length > 0)
      : [];

    // *** Fotos ***
    const photos = Array.isArray(req.body.photos)
      ? req.body.photos
          .filter((photo) => photo.url?.trim())
          .map((photo, index) => ({
            ...photo,
            url: photo.url.trim(),
            description: photo.description || "",
            isMain: String(index) === String(req.body.mainPhotoIndex),
          }))
      : [];

    //  *** Servicios ***
    // existe el servicio? es igual a 'on'? true/false
    const services = {
      airConditioning: req.body.services?.airConditioning === "on",
      heating: req.body.services?.heating === "on",
      accessibility: req.body.services?.accessibility === "on",
      television: req.body.services?.television === "on",
      kitchen: req.body.services?.kitchen === "on",
      internet: req.body.services?.internet === "on",
    };

    //  *** Localización ***
    const location = {
      province: req.body.location?.province || "No especificado",
      city: req.body.location?.city || "No especificado",
      gpsCoordinates: {
        lat: req.body.location?.gpsCoordinates?.lat
          ? Number(req.body.location.gpsCoordinates.lat)
          : 0,
        lng: req.body.location?.gpsCoordinates?.lng
          ? Number(req.body.location.gpsCoordinates.lng)
          : 0,
      },
    };

    //  *** Camas por habitación ***
    let bedsPerRoom = [];
    if (Array.isArray(req.body.bedsPerRoom)) {
      bedsPerRoom = req.body.bedsPerRoom
        .map((num) => parseInt(num, 10))
        .filter((num) => !isNaN(num) && num >= 0);
    }

    // *** Crear la nueva instancia ***
    const newApartment = new Apartment({
      title,
      description,
      rules,
      rooms: Number(rooms),
      bedsPerRoom,
      bathrooms: Number(bathrooms),
      photos,
      price: Number(price),
      maxGuests: Number(maxGuests),
      squareMeters: Number(squareMeters),
      services,
      location,
      active: true,
    });

    await newApartment.save();
    console.log("desde POST /admin/apartment hasta home.ejs");
    const renderData = getRenderObject(
      "",
      [],
      [],
      req,
      null,
      undefined,
      "admin"
    );
    res.status(200).render("adminApartment.ejs", renderData);
  } catch (error) {
    console.error("Error:", error);
  }
});

// ********** Reservas **********
// *** Mostramos todas las reservas ***
router.get("/reservations", getReservations);

// ******************** Listar apartamentos ********************
// *** Mostramos todos los apartamentos ***
router.get("/apartments", getSearchApartment);


export default router;
