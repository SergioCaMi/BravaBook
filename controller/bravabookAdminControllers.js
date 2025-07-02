import { Apartment, Reservation } from "../models/bravabook.model.js";
// import { getRenderObject } from '../controller/bravabookControllers.js';
import { getRenderObject, getPaginatedData } from "../utils/getRender.js";

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
    1,
    "admin"
  );
  console.log("ROL:", renderData.currentPage);
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
    1,
    "admin"
  );
  console.log("ROL:", renderData.currentPage);
  console.log("addApartment.ejs");
  console.log("desde GET /admin/apartment/new hasta addApartment.ejs");

  res.status(200).render("addApartment.ejs", renderData);
};

// ******************** Recuperamos datos del nuevo apartamento ********************
// *** Procesamos los datos del nuevo apartamento y lo guardamos en la BBDD ***
export const postNewApartment = async (req, res) => {
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
      1,
      "admin"
    );
    res.status(200).render("adminApartment.ejs", renderData);
  } catch (error) {
    console.error("Error:", error);
  }
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
      1,
      "admin"
    );
    console.log("ROL:", renderData.currentPage);
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

// ******************** Listar apartamentos ********************
// *** Mostramos todos los apartamentos ***
export const getAllApartments = async (req, res) => {
  try {
    const dataApartments = await Apartment.find({ active: true });
    const renderData = getRenderObject(
      "Inicio",
      dataApartments,
      [],
      req,
      null,
      undefined,
      1,
      "admin"
    );
    console.log("ROL:", renderData.currentPage);
    console.log("desde GET / hasta home.ejs");
    const pagination = await getPaginatedData(Apartment, {}, req, 6);
    res.status(200).render("home.ejs", { ...renderData, ...pagination });
  } catch (error) {
    console.error("Error al obtener apartamentos:", error);
    res.status(500).render("error.ejs", {
      message: "Error interno del servidor",
      status: 404,
    });
  }
};

// ********** Detalle del apartamento por :id **********
// *** Mostramos datos de un apartamento en partícular con un :id ***

export const getAdminEdit = async (req, res) => {
  const { id } = req.params;
  console.log(req.params);
  try {
    const dataApartments = await Apartment.findById(id);
    if (!dataApartments) {
      return res.status(404).json({ message: "Apartamento no encontrado" });
    }
    const renderData = getRenderObject(
      dataApartments.title,
      dataApartments,
      [],
      req,
      null,
      undefined,
      1,
      "admin"
    );

    res.status(200).render("editApartment.ejs", renderData);
  } catch (err) {
    res.status(500).render("error.ejs", {
      message: "Error interno del servidor",
      status: 404,
    });
  }
};






export const putAdminEdit = async (req, res) => {
  console.log(req.body);

  const { id } = req.params;
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
    const updateApartment = {
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
    };
    const apartment = await Apartment.findByIdAndUpdate(id, updateApartment, {
      new: true,
    });
    const renderData = getRenderObject(
      "Inicio",
      apartment,
      [],
      req,
      null,
      undefined,
      1,
      "admin"
    );
    console.log("Updated!");
    const pagination = await getPaginatedData(Apartment, {}, req, 6);
    res.status(200).render("home.ejs", { ...renderData, ...pagination });
  } catch (error) {
    console.error("Error al obtener apartamentos:", error);
    res.status(500).render("error.ejs", {
      message: "Error interno del servidor",
      status: 404,
    });
  }
};
