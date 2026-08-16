import { withApi } from "../../src/lib/withApi.js";
import { signup } from "../../src/controllers/auth.js";

export default withApi("POST", async (req, res) => {
  const result = await signup(req.body || {});
  res.status(201).json(result);
});
