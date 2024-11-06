const router = require("express").Router();

const organizadorController = require("../controllers/organizadorController");
const userController = require("../controllers/userController");
const eventoController = require("../controllers/eventoController");


//rotas users
router.post("/user/", userController.createUser);
router.get("/user/", userController.getAllUsers);
router.put("/user/", userController.updateUser);
router.delete("/user/:id", userController.deleteUser);

//rotas organizadores
router.post("/org/", organizadorController.createOrganizador);
router.get("/org/", organizadorController.getAllOrganizadores);
router.put("/org/", organizadorController.updateOrg);
router.delete("/org/:id", organizadorController.deleteOrg);

//rotas eventos
router.post("/evento", eventoController.createEvento);
router.get("/evento", eventoController.getAllEventos);
router.put("/evento", eventoController.updateEvento);
module.exports = router;
