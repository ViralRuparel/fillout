import { Router } from "express";
const router = Router();

router.use(async function (req, res, next) {
  //use req, res as required.
  next();
});

export default router;
