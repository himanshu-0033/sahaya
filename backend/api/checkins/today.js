import { withApi } from "../../src/lib/withApi.js";
import { getToday } from "../../src/controllers/checkins.js";

export default withApi(
  "GET",
  async (req, res) => {
    res.json(await getToday(req.userId));
  },
  { auth: true }
);
