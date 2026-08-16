import { withApi } from "../../src/lib/withApi.js";
import { login } from "../../src/controllers/auth.js";

export default withApi("POST", async (req, res) => {
  res.json(await login(req.body || {}));
});
