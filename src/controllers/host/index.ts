import {Request, Response} from 'express';
import {Price} from '../../models/Price';
import {mirrorObject} from '../../middleware/mirror';

async function indexPage(req: Request, res: Response) {


    let contextData: any = {
        msg: 'Dashboard',
        activePageDashboard: 'active',
        assets: mirrorObject.assetSymbols(),
        prices: []
    }

    for (let asset of contextData.assets) {
        //query mean and standard deviation
        const statQuery = await Price.aggregate([
            {$match: {mAsset: asset}},
            {
                $group: {
                    _id: null,
                    meanPremium: {$avg: '$premium'},
                    stdDev: {$stdDevPop: '$premium'}
                }
            }]).limit(1);
        let meanPremium = (statQuery && statQuery[0])? statQuery[0].meanPremium : 0;
        let stdDev = (statQuery && statQuery[0])? statQuery[0].stdDev : 0;

        let DBRowForAsset = await Price.find({mAsset: asset}).sort({'_id': -1}).limit(1);
        if (DBRowForAsset && DBRowForAsset[0]) {
            let OutputLineForAsset = {
                mAsset: DBRowForAsset[0].mAsset,
                priceUST: DBRowForAsset[0].priceUST,
                oraclePriceUST: DBRowForAsset[0].oraclePriceUST,
                premium: DBRowForAsset[0].premium,
                meanPremium: meanPremium,
                sd: stdDev};
            contextData.prices.push(OutputLineForAsset);
        }
    }

    res.render('index/home.pug', contextData)
}

const ControllerMethods = {
    renderIndexPage: indexPage
}

export default ControllerMethods

