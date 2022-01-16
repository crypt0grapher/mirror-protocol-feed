import {Router} from 'express';
import MongoPriceController from '../../controllers/api/price'

const mongoPriceRouter: Router = Router();

mongoPriceRouter.get("/", MongoPriceController.showAllPrices)
mongoPriceRouter.get("/:id", MongoPriceController.getSinglePrice)

export default mongoPriceRouter
