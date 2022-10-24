import express from 'express';
const router = express.Router();

export default router.get("/", (req, res) => {
  res.send({ response: "Server is up and running." }).status(200);
});
