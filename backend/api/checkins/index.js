import { withApi } from "../../src/lib/withApi.js";
import { submitCheckIn } from "../../src/controllers/checkins.js";

export default withApi(
  "POST",
  async (req, res) => {
    const result = await submitCheckIn(req.userId, req.body?.responses);
    res.status(201).json(result);
  },
  { auth: true }
);
