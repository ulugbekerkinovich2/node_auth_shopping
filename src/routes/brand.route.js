const {Router} = require("express");
const router = Router();
const { getBrands, createBrand } = require("../controllers/brand.controller");

router.get("/", getBrands);
router.post('/', createBrand)

module.exports = router;
