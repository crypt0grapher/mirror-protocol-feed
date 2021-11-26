import {Router} from 'express';
import AssetController from'../../controllers/host/asset'

let AssetRouter: Router = Router();

AssetRouter.get("/:asset/:indicator", AssetController.renderAssetChart);

export default AssetRouter;
