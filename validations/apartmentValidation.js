import { body } from "express-validator";

export const apartmentValidation = [
  body("title").isString().isLength({ min: 3, max: 100 }),
  body("description").isString().isLength({ min: 10 }),
  body("rooms").isInt({ min: 1, max: 100 }),
  body("bedsPerRoom").isArray({ min: 1 }).withMessage("Debes indicar al menos una cama por habitación."),
  body("bedsPerRoom.*").isInt({ min: 0, max: 10 }).withMessage("El número de camas por habitación debe ser entre 0 y 10."),
  body("bathrooms").isInt({ min: 0, max: 20 }),
  // Validación de photos
  body("photos").isArray({ min: 1 }).withMessage("Debes añadir al menos una foto."),
  body("photos.*.url").isURL().withMessage("La URL de la foto es obligatoria y debe ser válida."),
  body("photos.*.description").isString().notEmpty().withMessage("La descripción de la foto es obligatoria."),
  body("photos.*.isMain").isBoolean().withMessage("Debes indicar si la foto es principal o no."),
  body("price").isFloat({ min: 1 }),
  body("maxGuests").isInt({ min: 1 }),
  body("squareMeters").isInt({ min: 1 }),
  // Validación de services
  body("services").isObject().withMessage("Debes indicar los servicios."),
  body("services.airConditioning").isBoolean().withMessage("Debes indicar si hay aire acondicionado."),
  body("services.heating").isBoolean().withMessage("Debes indicar si hay calefacción."),
  body("services.accessibility").isBoolean().withMessage("Debes indicar si hay accesibilidad."),
  body("services.television").isBoolean().withMessage("Debes indicar si hay televisión."),
  body("services.kitchen").isBoolean().withMessage("Debes indicar si hay cocina."),
  body("services.internet").isBoolean().withMessage("Debes indicar si hay internet."),
  // Localización
  body("location.province").isString().notEmpty(),
  body("location.city").isString().notEmpty(),
  body("location.gpsCoordinates.lat").isFloat().withMessage("La latitud es obligatoria y debe ser un número."),
  body("location.gpsCoordinates.lng").isFloat().withMessage("La longitud es obligatoria y debe ser un número."),
  body("active").isBoolean().withMessage("Debes indicar si el apartamento está activo."),
];
