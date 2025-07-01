import express from "express";
const router = express.Router();
import { getAllApartments, getAbout, getContact, getSearchApartment, getFilterApartments, getApartmentsById, postNewReservation } from '../controller/bravabookControllers.js';

// ****************************** Rutas ******************************
// ******************** Home ********************
// *** Mostramos todos los apartamentos activos ***
router.get("/", getAllApartments);

// ******************** Endpoint de Acerca de... ********************
// *** Mostramos la pagina de Acerca de... ***
router.get("/about", getAbout);

// ******************** Endpoint de Contact ********************
// *** Mostramos la pagina de Contacto ***
router.get("/contact", getContact);

// ******************** Listar apartamentos ********************
// *** Mostramos todos los apartamentos ***
router.get("/apartments", getSearchApartment);

// ********** Buscar apartamento con filtros **********
// *** Devuelve los apartamentos que cumplen los requisitos que recibe ***
router.get("/apartments/search", getFilterApartments);

// ********** Detalle del apartamento por :id **********
// *** Mostramos datos de un apartamento en partícular con un :id ***
router.get("/apartments/:id", getApartmentsById);

// ********** Reservas nuevas **********
// ********** Recibimos el formulario de la nueva reserva y la creamos en la BBDD **********
router.post("/reservations/new-reservation", postNewReservation);

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
