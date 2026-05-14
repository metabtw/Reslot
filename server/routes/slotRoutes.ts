import express from "express";
import { getAllSlots, buySlot, getPortfolio, analyzeAndSell, seedSlots } from "../controllers/slotController.js";

const router = express.Router();

router.get("/", getAllSlots);
router.post("/seed", seedSlots);
router.post("/:id/buy", buySlot);
router.get("/portfolio/:userId", getPortfolio);
router.post("/:id/analyze-and-sell", analyzeAndSell);

export default router;
