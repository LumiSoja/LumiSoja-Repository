var express = require("express");
var router = express.Router();
var adminController = require("../controllers/adminController");

router.get("/perfis", function (req, res) {
    adminController.listarPerfis(req, res);
});

router.get("/usuarios", function (req, res) {
    adminController.listarUsuarios(req, res);
});

router.post("/usuarios", function (req, res) {
    adminController.cadastrarUsuario(req, res);
});

router.patch("/usuarios/:id/acesso", function (req, res) {
    adminController.atualizarAcesso(req, res);
});

router.get("/empresas", function (req, res) {
    adminController.listarEmpresas(req, res);
});

router.post("/empresas", function (req, res) {
    adminController.cadastrarEmpresa(req, res);
});

router.get("/fazendas", function (req, res) {
    adminController.listarFazendas(req, res);
});

router.post("/fazendas", function (req, res) {
    adminController.cadastrarFazenda(req, res);
});

module.exports = router;
