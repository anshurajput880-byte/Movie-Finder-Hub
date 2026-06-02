import { Router, type IRouter } from "express";
import healthRouter from "./health";
import moviesRouter from "./movies";
import mediaRouter from "./media";

const router: IRouter = Router();

router.use(healthRouter);
router.use(moviesRouter);
router.use(mediaRouter);

export default router;
