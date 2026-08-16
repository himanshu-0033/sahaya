import { withApi } from "../../src/lib/withApi.js";
import { getHistory } from "../../src/controllers/checkins.js";

export default withApi(
  "GET",
  async (req, res) => {
    res.json(await getHistory(req.userId));
  },
  { auth: true }
);
