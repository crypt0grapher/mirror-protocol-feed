import {Request, Response} from 'express';
import {Price} from '../../models/Price';
import {mirrorObject} from '../../middleware/mirror';

type PriceLine = {
    mAsset: string,
    priceUST: number,
    oraclePriceUST: number,
    premium: number,
    meanPremium: number,
    sd: number,
}

type Context = {
    msg: string,
    activePageDashboard: string,
    assets: Array<string>,
    prices: PriceLine[]
}

async function indexPage(req: Request, res: Response) {
    const contextData: Context = {
        msg: 'Dashboard',
        activePageDashboard: 'active',
        assets: mirrorObject.assetSymbols(),
        prices: []
    }

    for (const asset of contextData.assets) {
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
        const meanPremium = (statQuery && statQuery[0])? statQuery[0].meanPremium : 0;
        const stdDev = (statQuery && statQuery[0])? statQuery[0].stdDev : 0;

        const DBRowForAsset = await Price.find({mAsset: asset}).sort({'_id': -1}).limit(1);
        if (DBRowForAsset && DBRowForAsset[0]) {
            const OutputLineForAsset = {
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

