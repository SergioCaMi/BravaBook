import express from "express";
const router = express.Router();
import { Apartment, Reservation } from "../models/brababook.model.js";

// ********** Función para renderizar con todos los datos necesarios **********
function getRenderObject(
  title,
  dataApartments = null,
  req = null,
  message = undefined,
  user = null
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
    message,
    user: userData,
  };
}

// ****************************** Rutas ******************************

// ******************** Home ********************
// *** Mostramos todos los apartamentos activos ***
router.get("/", async (req, res) => {
  try {
    const dataApartments = await Apartment.find({ active: true }).limit(12);
    const renderData = getRenderObject(
      "BravaBook - Inicio",
      dataApartments,
      req,
      undefined,
      "black"
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

// ******************** Añadir nuevo apartamento ********************
// ******************** Formulario para añadir nuevo apartamento ********************
// *** Mostramos El formulario para añadir un nuevo apartamento ***
router.get("/admin/apartment/new", async (req, res) => {
  const dataApartments = [];
  const renderData = getRenderObject(
    "BravaBook - New Apartment",
    dataApartments,
    req,
    undefined
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

    // TODO: valores alternativos a null en todas las variables simples
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
    res.redirect("/");
  } catch (error) {
    console.error("Error:", error);

    // Otros errores internos
  }
});

// ******************** Listar apartamentos ********************
// *** Mostramos todos los apartamentos ***
router.get("/apartments", async (req, res) => {
  try {
    const apartments = await Apartment.find({ active: true });
    console.log("desde GET /apartments hasta home.ejs");
    res.status(200).json({ apartments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ********** Buscar apartamento con filtros **********
// *** Devuelve los apartamentos que cumplen los requisitos que recibe ***
router.get("/apartments/search", async (req, res) => {
  console.log(req.query);
  const {
    // title,
    // description,
    rooms,
    bathrooms,
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
    "location.province": province,
    "location.city": city,
    "location.gpsCoordinates.lat": lat,
    "location.gpsCoordinates.lng": lng,
  } = req.query;

  const query = {};
  query.active = true;
  if (rooms) {
    const parsedRooms = Number(rooms);
    if (!isNaN(parsedRooms)) {
      query.rooms = parsedRooms;
    }
  }
  if (bedsPerRoom) {
    const bedsArray = Array.isArray(bedsPerRoom)
      ? bedsPerRoom.map(Number).filter((n) => !isNaN(n))
      : [];

    if (bedsArray.length > 0) {
      query.bedsPerRoom = { $all: bedsArray };
    }
  }
  if (bathrooms) {
    const parsedBathrooms = Number(bathrooms);
    if (!isNaN(parsedBathrooms)) {
      query.bathrooms = parsedBathrooms;
    }
  }
  if (city) {
    query["location.city"] = {
      $exists: true,
      $ne: "",
      $regex: city.trim(),
      $options: "i",
    };
  }

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
if (maxGuests){
    const numGuests = Number(maxGuests);
    if (!isNaN(numGuests)) {
      query.maxGuests = { $lte: numGuests };
    }
}

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

    res.json(apartments);
  } catch (error) {
    console.error("🚨 Error al buscar apartamentos:", error);
    res.status(500).json({ message: "Error interno del servidor" });
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
    console.log("desde GET /apartments/:id hasta viewApartment.ejs");
    const renderData = getRenderObject(
      dataApartments.title,
      dataApartments,
      req,
      undefined,
      "black"
    );
    res.status(200).render("viewApartment.ejs", renderData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ********** RECURSOS **********

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
