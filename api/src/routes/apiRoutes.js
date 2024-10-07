const router = require("express").Router();

const organizadorController = require("../controllers/organizadorController");
const userController = require("../controllers/userController");

router.post("/user/", userController.createUser);
router.get("/user/", userController.getAllUsers);
router.put("/user/", userController.updateUser);
router.delete("/user/:cpf", userController.deleteUser);

router.post("/org/", organizadorController.createOrganizador);
router.get("/org/", organizadorController.getAllOrganizadores);
router.put("/org/", organizadorController.updateOrg);
router.delete("/org/:id", organizadorController.deleteOrg);

module.exports = router;
