import { Router } from "express";
import { requireAuth, requireCaregiver } from "../middleware/auth.js";
import { listPatients, getPatientDetail } from "../controllers/caregiver.js";

const router = Router();
router.use(requireAuth, requireCaregiver);

router.get("/patients", async (req, res) => {
  res.json(await listPatients(req.caregiver._id));
});

router.get("/patients/:id", async (req, res) => {
  res.json(await getPatientDetail(req.caregiver._id, req.params.id));
});

export default router;
