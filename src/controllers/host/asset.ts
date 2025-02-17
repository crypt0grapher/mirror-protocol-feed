import {Request, Response} from 'express';
import {Price} from '../../models/Price';
import {mirrorObject} from '../../middleware/mirror';

async function AssetChart(req: Request, res: Response) {
    const assetName: string = req.params.asset;
    const drawPrice: boolean = req.params.indicator == 'price';

    const assets = mirrorObject.assetSymbols();

    const baseTimeDB = await Price.aggregate([
        {$match: {mAsset: assetName}},
        {$group: {_id: null, minDate: {$min: '$created_at'}}}]).limit(1);
    const baseTime = baseTimeDB ? new Date(baseTimeDB[0].minDate).valueOf() : Date.now();

    //query mean and standard deviation
    let statQuery: any[] = [];
    let meanPremium = 0;
    let stdDev = 0;
    if (!drawPrice) {
        statQuery = await Price.aggregate([
            {$match: {mAsset: assetName}},
            {
                $group: {
                    _id: null,
                    meanPremium: {$avg: '$premium'},
                    stdDev: {$stdDevPop: '$premium'}
                }
            }]).limit(1);
        meanPremium = statQuery ? statQuery[0].meanPremium : 0;
        stdDev = statQuery ? statQuery[0].stdDev : 0;
    }

    const dataFeed1: { x: number, y: number }[] = [];
    const dataFeed2: { x: number, y: number }[] = [];
    const dataFeedExtremum1: { x: number, y: number }[] = [];
    const dataFeedExtremum2: { x: number, y: number }[] = [];
    const dataFeedExtremum3: { x: number, y: number }[] = [];

    const allDocuments = await Price.find({mAsset: assetName});
    for (const doc of allDocuments) {
        if (drawPrice) {
            dataFeed1.push({x: (doc.created_at.valueOf() - baseTime), y: doc.priceUST});
            dataFeed2.push({x: (doc.created_at.valueOf() - baseTime), y: doc.oraclePriceUST});
        } else {
            dataFeed1.push({x: (doc.created_at.valueOf() - baseTime), y: doc.premium});
            dataFeed2.push({x: (doc.created_at.valueOf() - baseTime), y: meanPremium});
            if (Math.abs(doc.premium as number) > Math.abs(meanPremium) + stdDev)
                dataFeedExtremum1.push({x: (doc.created_at.valueOf() - baseTime), y: doc.premium});
            if (Math.abs(doc.premium as number) > Math.abs(meanPremium) + 2 * stdDev)
                dataFeedExtremum2.push({x: (doc.created_at.valueOf() - baseTime), y: doc.premium});
            if (Math.abs(doc.premium as number) > Math.abs(meanPremium) + 3 * stdDev)
                dataFeedExtremum3.push({x: (doc.created_at.valueOf() - baseTime), y: doc.premium});
        }
    }

    const contextData = {
        hostName: req.hostname,
        assets: assets,
        asset: assetName,
        activePageAsset: 'active',
        baseTime: baseTime,
        dataColumn1: JSON.stringify(dataFeed1),
        dataColumn2: JSON.stringify(dataFeed2),
        dataColumnsExtremum1: '',
        dataColumnsExtremum2: '',
        dataColumnsExtremum3: ''
    };

    if (!drawPrice) {
        contextData.dataColumnsExtremum1 = JSON.stringify(dataFeedExtremum1);
        contextData.dataColumnsExtremum2 = JSON.stringify(dataFeedExtremum2);
        contextData.dataColumnsExtremum3 = JSON.stringify(dataFeedExtremum3);
        res.render('asset/assetPremium.pug', contextData)
    } else {
        res.render('asset/assetPrice.pug', contextData)
    }
}

const ControllerMethods = {
    renderAssetChart: AssetChart
}

export default ControllerMethods

