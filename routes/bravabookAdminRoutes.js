import express from "express";
const router = express.Router();
import { Apartment, Reservation } from "../models/bravabook.model.js";
// *** Admin ***
import { getAdminPanel, getNewApartment, postNewApartment, getReservations, getAllApartments, getAdminEdit, putAdminEdit } from '../controller/bravabookAdminControllers.js';

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

// ******************** Recuperamos datos del apartamento para guardarlo ********************
// *** Procesamos los datos del apartamento y lo guardamos en la BBDD ***
router.post("/apartment", postNewApartment);

// ******************** Formulario para editarun apartamento ********************
// *** Mostramos El formulario para editar un apartamento ***
router.get("/apartments/:id/edit", getAdminEdit);

// ******************** Recuperamos datos del apartamento para editarlo ********************
// *** Procesamos los datos del apartamento y lo actualizamos en la BBDD ***
router.post("/apartment/:id/edit/save", putAdminEdit);


// ********** Reservas **********
// *** Mostramos todas las reservas ***
router.get("/reservations", getReservations);

// ******************** Listar apartamentos ********************
// *** Mostramos todos los apartamentos ***
router.get("/apartments", getAllApartments);


export default router;
