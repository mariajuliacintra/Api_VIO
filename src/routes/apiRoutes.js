const router = require("express").Router();
const verifyJWT = require("../services/verifyJWT")

const organizadorController = require("../controllers/organizadorController");
const userController = require("../controllers/userController");
const eventoController = require("../controllers/eventoController");
const ingressoController = require("../controllers/ingressoController");
const compraController = require("../controllers/compraController");

//http://localhost:5000/api/v1
//rotas users
router.post("/user/", userController.createUser);
router.get("/user/", verifyJWT, userController.getAllUsers);
router.put("/user/", userController.updateUser);
router.delete("/user/:id", userController.deleteUser);
router.post("/login", userController.loginUser);

//rotas organizadores
router.post("/org/", organizadorController.createOrganizador);
router.get("/org/", organizadorController.getAllOrganizadores);
router.put("/org/", organizadorController.updateOrg);
router.delete("/org/:id", organizadorController.deleteOrg);

//rotas eventos
router.post("/evento", eventoController.createEvento);
router.get("/evento", eventoController.getAllEventos);
router.put("/evento", eventoController.updateEvento);
router.delete("/evento/:id", eventoController.deleteEvento);
router.get("/evento/data", eventoController.getEventosPorData);
router.get("/evento/:data", eventoController.getEventosSeteDias);

//Rotas ingresso
router.post("/ingresso", ingressoController.createIngresso);
router.get("/ingresso", ingressoController.getAllIngresso);
router.put("/ingresso", ingressoController.updateIngresso);
router.delete("/ingresso/:id", ingressoController.deleteIngresso);
router.get('/ingresso/evento/:id', ingressoController.getByIdEvento);

//Rotas Procedure
router.post("/comprasimples", compraController.registrarCompraSimples);
router.post("/compra", compraController.registrarCompra);



module.exports = router;
