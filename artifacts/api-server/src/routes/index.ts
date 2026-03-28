import { Router, type IRouter } from "express";
import healthRouter from "./health";
import wilayasRouter from "./wilayas";
import categoriesRouter from "./categories";
import brandsRouter from "./brands";
import listingsRouter from "./listings";

const router: IRouter = Router();

router.use(healthRouter);
router.use(wilayasRouter);
router.use(categoriesRouter);
router.use(brandsRouter);
router.use(listingsRouter);

export default router;
