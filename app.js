// ********** Configurar dotenv **********
import dotenv from "dotenv";
dotenv.config();

// ********** Server **********
import express from "express";
const app = express();
const PORT = process.env.PORT || 3000;

// ******************** Configura la sesión del usuario ********************
// ********** Configura una sesión segura para cada usuario **********
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// ********** Iniciar Passport y lo conecta con las sesiones de Express **********
import session from "express-session";
import passport from "passport";
app.use(passport.initialize());
app.use(passport.session());

// ********** Morgan para visualizar el flujo por consola **********
import morgan from "morgan";
app.use(morgan("dev"));

// ********** Procesar datos de formularios y JSON **********
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ********** Motor de vistas EJS **********
app.set("view engine", "ejs");

// ********** Motor de vistas EJS **********
app.use(express.static("public"));
app.use("/data", express.static("data"));

// ******************** Rutas de login y logout con Google ********************
// ********** Ruta que manda al usuario a iniciar sesión con Google **********
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

// ********** Ruta a la que vuelve Google después del login **********
app.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    res.render("welcome", { user: req.user });
  }
);

// ********** Ruta a la que va después de cerrar sesión **********
app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error al cerrar sesión:", err);
      return res.status(500).render("error", {
        message: "Error interno al cerrar sesión",
        status: 500,
      });
    }
    res.redirect("/");
  });
});

// ********** Conexión a la base de datos **********
import { connectDB } from "./config/db.js";
await connectDB().catch((err) => console.log(err));

// ********** Rutas modularizadas **********
const brababookRoutes = (await import("./routes/brababookRoutes.js")).default;
app.use("/", brababookRoutes);

// ****************************** Iniciar servidor ****************************************
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

// ******************** URL inválida Error 404 ********************
app.use((req, res) => {
  res
    .status(404)
    .render("error.ejs", { message: "Página no encontrada", status: 404 });
});

// ******************** Manejo de errores internos (500) ********************
app.use((err, req, res, next) => {
  console.error("Error interno del servidor:", err.message);

  res.status(500).render("error", {
    message: "Ups! Ha ocurrido un error. Vuelve a intentarlo más tarde",
    status: 500,
  });
});
// }
