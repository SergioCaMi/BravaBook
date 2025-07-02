import { Apartment, Reservation } from "../models/bravabook.model.js";
import { getRenderObject, getPaginatedData } from "../utils/getRender.js";

// // ********** Función para renderizar con todos los datos necesarios **********
// export function getRenderObject(
//   title,
//   dataApartments = null,
//   dataReservations = null,
//   req = null,
//   user = null,
//   message,
//   currentPage
// ) {
//   const userData =
//     user ||
//     (req.isAuthenticated?.() &&
//     req.user &&
//     req.user.photos &&
//     req.user.photos.length > 0
//       ? { photo: req.user.photos[0].value }
//       : null);

//   return {
//     title,
//     dataApartments,
//     dataReservations,
//     message,
//     user: userData,
//     currentPage,
//   };
// }

// ****************************** Rutas ******************************
// ******************** Home ********************
// *** Mostramos todos los apartamentos activos ***
export const getAllApartments = async (req, res) => {
  try {
    const pagination = await getPaginatedData(Apartment, { active: true }, req, 6);
    const dataApartments = await Apartment.find({ active: true }).limit(12);
    const renderData = getRenderObject(
      "Inicio",
      dataApartments,
      [],
      req,
      null,
      undefined,
      1,
      "home"
    );
    console.log("desde GET / hasta home.ejs");
res.status(200).render("home.ejs", { ...renderData, ...pagination });
  } catch (error) {
    console.error("Error al obtener apartamentos:", error);
    res.status(500).render("error.ejs", {
      message: "Error interno del servidor",
      status: 404,
    });
  }
};

// ******************** Endpoint de Acerca de... ********************
// *** Mostramos la pagina de Acerca de... ***
export const getAbout = (req, res) => {
  const renderData = getRenderObject(
    "Acerca de...",
    [],
    [],
    req,
    null,
    undefined,
    1,
    "about"
  );
  res.status(200).render("aboutUs.ejs", renderData);
};

// ******************** Endpoint de Contact ********************
// *** Mostramos la pagina de Contacto ***
export const getContact = (req, res) => {
  const renderData = getRenderObject(
    "Contacta con nosotros",
    [],
    [],
    req,
    null,
    undefined,
    1,
    "contact"
  );
  res.status(200).render("contactUs.ejs", renderData);
};

// ********** Buscar apartamento con filtros **********
// *** Devuelve los apartamentos que cumplen los requisitos que recibe ***
export const getSearchApartments = async (req, res) => {
  console.log(req.query);
  const {
    minPrice,
    maxPrice,
    maxGuests,
    squareMeters,
    "rules[]": rules,
    "bedsPerRoom[]": bedsPerRoom,
    "services.airConditioning": airConditioning,
    "services.heating": heating,
    "services.accessibility": accessibility,
    "services.television": television,
    "services.kitchen": kitchen,
    "services.internet": internet,
    rol
  } = req.query;

  const province = req.query["location[province]"];
  const city = req.query["location[city]"];

  console.log("Provincia recibida:", province);

  const query = {};
  query.active = true;

  // *** Ciudad ***
  if (city) {
    query["location.city"] = {
      $exists: true,
      $ne: "",
      $regex: city.trim(),
      $options: "i",
    };
  }
  // *** Provincia ***
  if (province) {
    query["location.province"] = {
      $exists: true,
      $ne: "",
      $regex: province.trim(),
      $options: "i",
    };
  }
  // *** Precio ***
  // Desestructuramos para no sobreescribir otra consulta anterior (min o max) sobre el mismo campo
  if (minPrice) {
    const numMinPrice = Number(minPrice);
    if (!isNaN(numMinPrice)) {
      query.price = { ...query.price, $gte: numMinPrice };
    }
  }
  if (maxPrice) {
    const numMaxPrice = Number(maxPrice);
    if (!isNaN(numMaxPrice)) {
      query.price = { ...query.price, $lte: numMaxPrice };
    }
  }
  // *** Huéspedes ***
  if (maxGuests) {
    const numGuests = Number(maxGuests);
    if (!isNaN(numGuests)) {
      query.maxGuests = { $lte: numGuests };
    }
  }
  // *** Metros cuadrados ***
  if (squareMeters) {
    const parsedSquareMeters = Number(squareMeters);
    if (!isNaN(parsedSquareMeters)) {
      query.squareMeters = { $gte: parsedSquareMeters };
    }
  }
  const servicesConditions = {};
  if (airConditioning === "on") servicesConditions.airConditioning = true;
  if (heating === "on") servicesConditions.heating = true;
  if (accessibility === "on") servicesConditions.accessibility = true;
  if (television === "on") servicesConditions.television = true;
  if (kitchen === "on") servicesConditions.kitchen = true;
  if (internet === "on") servicesConditions.internet = true;
  console.log(internet); // "on"
  if (Object.keys(servicesConditions).length > 0) {
    Object.entries(servicesConditions).forEach(([key, value]) => {
      query[`services.${key}`] = value;
    });
  }
  // *** Fechas ***
  let reservedApartmentIds = [];

  if (req.query.startDate && req.query.endDate) {
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);
    const normalizedStart = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate()
    );
    const normalizedEnd = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate()
    );
    const ocupados = await Reservation.find({
      apartmentId: { $exists: true },
      startDate: { $lt: endDate },
      endDate: { $gt: startDate },
    });

    reservedApartmentIds = ocupados.map((r) => r.apartmentId);
  }

  if (req.query.startDate && req.query.endDate) {
    query._id = { $nin: reservedApartmentIds };
  }

  try {
    console.log("Query final:", query);
    const apartments = await Apartment.find(query);
    console.log("Resultados:", apartments.length);
    if (apartments.length > 0) {
      query._id = { $nin: reservedApartmentIds };
    }
    const renderData = getRenderObject(
      apartments.title,
      apartments,
      [],
      req,
      null,
      undefined,
      1,
      rol
    );
    res.status(200).render("home.ejs", renderData);

    // res.json(apartments);
  } catch (error) {
    console.error("Error al buscar apartamentos:", error);
    res.status(500).render("error.ejs", {
      message: "Error interno del servidor",
      status: 404,
    });
  }
};

// ********** Detalle del apartamento por :id **********
// *** Mostramos datos de un apartamento en partícular con un :id ***
export const getApartmentsById = async (req, res) => {
  const { id } = req.params;

  try {
    const dataApartments = await Apartment.findOne({ _id: id, active: true });
    if (!dataApartments) {
      return res.status(404).json({ message: "Apartamento no encontrado" });
    }
    console.log("desde GET /apartments/:id hasta detailApartment.ejs");
    const renderData = getRenderObject(
      dataApartments.title,
      dataApartments,
      [],
      req,
      null,
      undefined,
      1,
      "home"
    );
    res.status(200).render("detailApartment.ejs", renderData);
  } catch (err) {
    res.status(500).render("error.ejs", {
      message: "Error interno del servidor",
      status: 404,
    });
  }
};

// ********** Reservas nuevas **********
// ********** Recibimos el formulario de la nueva reserva y la creamos en la BBDD **********
export const postNewReservation = async (req, res) => {
  const { apartmentId, guestName, guestEmail } = req.body;
  const startDate = new Date(req.body.startDate);
  const endDate = new Date(req.body.endDate);
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return res.status(400).send("Fechas inválidas");
  }
  //TODO: qué hacemos después de informar sobre fechas inválidas?

  const status = "confirmed";
  const paid = true;
  console.log(req.body, status, paid);
  try {
    const dataReservations = await Reservation.find({
      apartmentId: apartmentId,
      $and: [{ endDate: { $gt: startDate } }, { startDate: { $lt: endDate } }],
    });
    if (dataReservations.length === 0) {
      const newReservation = new Reservation({
        apartmentId,
        guestName,
        guestEmail,
        startDate,
        endDate,
        status,
        paid,
        // TODO: mensaje de Reserva realizada con éxito
      });
      await newReservation.save();
      console.log("hecho!");
      res.redirect("/");
    } else {
      console.log("No realizado");
    }
  } catch (err) {
    res.status(500).render("error.ejs", {
      message: "Error interno del servidor",
      status: 404,
    });
  }
};
