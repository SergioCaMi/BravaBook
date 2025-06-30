import express from "express";
const router = express.Router();
import { Apartment, Reservation } from "../models/brababook.model.js";

// ********** Función para renderizar con todos los datos necesarios **********
function getRenderObject(
  title,
  dataApartments = null,
  dataReservations = null,
  req = null,
  user = null,
  message,
  currentPage
) {
  const userData =
    user ||
    (req.isAuthenticated?.() &&
    req.user &&
    req.user.photos &&
    req.user.photos.length > 0
      ? { photo: req.user.photos[0].value }
      : null);

  return {
    title,
    dataApartments,
    dataReservations,
    message,
    user: userData,
    currentPage,
  };
}

// ****************************** Rutas ******************************

// ******************** Home ********************
// *** Mostramos todos los apartamentos activos ***
router.get("/", async (req, res) => {
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
});

// ******************** Endpoint de Acerca de... ********************
// *** Mostramos la pagina de Acerca de... ***
// TODO: gestionar quién puede entrar
router.get("/about", (req, res) => {
  const renderData = getRenderObject(
    "Acerca de...",
    [],
    [],
    req,
    null,
    undefined,
    "about"
  );
  res.status(200).render("aboutUs.ejs", renderData);
});

// ******************** Endpoint de Contact ********************
// *** Mostramos la pagina de Contacto ***
// TODO: gestionar quién puede entrar
router.get("/contact", (req, res) => {
  const renderData = getRenderObject(
    "Contacta con nosotros",
    [],
    [],
    req,
    null,
    undefined,
    "contact"
  );
  res.status(200).render("contactUs.ejs", renderData);
});

// ******************** Endpoint de Admnin ********************
// *** Mostramos la pagina de administradores ***
// TODO: gestionar quién puede entrar
router.get("/admin", (req, res) => {
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
});

// ******************** Añadir nuevo apartamento ********************
// ******************** Formulario para añadir nuevo apartamento ********************
// *** Mostramos El formulario para añadir un nuevo apartamento ***
router.get("/admin/apartment/new", async (req, res) => {
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
});

// ******************** Recuperamos datos del nuevo apartamento ********************
// *** Procesamos los datos del nuevo apartamento y lo guardamos en la BBDD ***
router.post("/admin/apartment", async (req, res) => {
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

// ******************** Listar apartamentos ********************
// *** Mostramos todos los apartamentos ***
router.get("/apartments", async (req, res) => {
  try {
    const dataApartments = await Apartment.find({ active: true });
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
    res.status(200).render("searchApartmens.ejs", renderData);
  } catch (error) {
    console.error("Error al obtener apartamentos:", error);
    res.status(500).render("error.ejs", {
      message: "Error interno del servidor",
      status: 404,
    });
  }
});

// ********** Reservas **********
// *** Mostramos todas las reservas ***
router.get("/reservations", async (req, res) => {
  try {
    const dataReservations = await Reservation.find();
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
});

// ********** Buscar apartamento con filtros **********
// *** Devuelve los apartamentos que cumplen los requisitos que recibe ***
router.get("/apartments/search", async (req, res) => {
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
  try {
    console.log("Query final:", query);
    const apartments = await Apartment.find(query);
    console.log("Resultados:", apartments.length);
    const renderData = getRenderObject(
      apartments.title,
      apartments,
      [],
      req,
      null,
      undefined,
      "home"
    );
    res.status(200).render("searchApartmens.ejs", renderData);

    // res.json(apartments);
  } catch (error) {
    console.error("Error al buscar apartamentos:", error);
    res.status(500).render("error.ejs", {
      message: "Error interno del servidor",
      status: 404,
    });
  }
});

// ********** Detalle del apartamento por :id **********
// *** Mostramos datos de un apartamento en partícular con un :id ***
router.get("/apartments/:id", async (req, res) => {
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
      "home"
    );
    res.status(200).render("detailApartment.ejs", renderData);
  } catch (err) {
    res.status(500).render("error.ejs", {
      message: "Error interno del servidor",
      status: 404,
    });
  }
});

// ********** Reservas nuevas **********
router.post("/reservations/new-reservation", async (req, res) => {
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

  // -*-*-*
});

// /admin/apartment/1205 - Actualizar apartamento
// /admin/apartment/1205/edit - Mostrar formulario de edición
// /admin/apartments

// /apartment/1205 - Detalle del apartamento
// /apartments - Todos los apartamentos

// app.get('/recipes/:id', async (req, res) => {
//     const { id } = req.params;
//     try {
//             const recipes = await Recipe.find({ _id: id });
//             res.status(200).json({ recipes });

//     }   catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// app.put('/recipes/:id', async (req, res) => {
//     const { id } = req.params;
//     try {
//             const recipes = await Recipe.findByIdAndUpdate(id, req.body, { new: true });
//             res.status(200).json({ recipes });

//     }   catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// app.delete('/recipes/:id', async (req, res) => {
//     const { id } = req.params;
//     try {
//             const recipes = await Recipe.findByIdAndDelete(id);
//             res.status(200).json({ recipes });

//     }   catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// ********** Exportar el router **********
export default router;
