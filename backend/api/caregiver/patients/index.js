import { withApi } from "../../../src/lib/withApi.js";
import { listPatients } from "../../../src/controllers/caregiver.js";

export default withApi(
  "GET",
  async (req, res) => {
    res.json(await listPatients(req.caregiver._id));
  },
  { caregiver: true }
);
