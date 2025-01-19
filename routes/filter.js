const router = require("express").Router();
const filterController = require("../controllers/filterController");

const { verifyTokenAndAgent } = require("../middleware/verifyToken");

// CREATE FILTER
router.post("/", filterController.createFilter);

// UPDATE FILTER
router.put("/:id",  filterController.updateFilter);

// DELETE FILTER
router.delete("/:id",  filterController.deleteFilter);

// GET FILTER BY ID
router.get("/:id", filterController.getFilterById);

// GET ALL FILTERS
//router.get("/",verifyTokenAndAgent, filterController.getAllFilters);
router.get("/:id", filterController.getFilters);




module.exports = router;
