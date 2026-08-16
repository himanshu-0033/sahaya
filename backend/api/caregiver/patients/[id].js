import { withApi } from "../../../src/lib/withApi.js";
import { getPatientDetail } from "../../../src/controllers/caregiver.js";

export default withApi(
  "GET",
  async (req, res) => {
    res.json(await getPatientDetail(req.caregiver._id, req.query.id));
  },
  { caregiver: true }
);
