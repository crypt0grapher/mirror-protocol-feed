import {Request, Response} from 'express';
import moment from 'moment';
import {parseAsync} from 'json2csv';
import {Price} from '../../models/Price';
import {mirrorObject} from '../../middleware/mirror';
import {PriceItem} from '../../interface/price';

interface GenericReply {
    msg: string;
    assets: Array<string>;
    activePageExport?: 'active';
}

interface PricesReply extends GenericReply {
    prices: null | Array<PriceItem>;
}

interface PriceReply extends GenericReply {
    price: null | PriceItem;
}

async function getAllPrices(req: Request, res: Response) {
    const contextData: PricesReply = {
        msg: 'No Prices Found',
        assets: mirrorObject.assetSymbols(),
        activePageExport: 'active',
        prices: null
    };
    try {
        contextData.prices = await Price.find({}).sort({ _id: -1 }).limit(100000);
        contextData.msg = 'Collected Price Feed From DB';
    } catch (error: unknown) {
        if (error instanceof Error)
            contextData.msg = error.message;
    }
    return res.render('prices/prices.pug', contextData)
}


async function getPriceById(req: Request, res: Response) {
    const priceId: string = req.params.id;
    const contextData: PriceReply = {
        msg: 'No Price Found',
        assets: mirrorObject.assetSymbols(),
        price: null
    }
    try {
        contextData.price = await Price.findById(priceId);
        contextData.msg = 'Price Found'
    } catch (error) {
        if (error instanceof Error)
            contextData.msg = error.message;
    }
    return res.render('prices/price-details.pug', contextData);
}

async function sendAllPricesCSV(req: Request, res: Response) {
    const contextData: PricesReply = {
        msg: 'No Prices Found',
        assets: mirrorObject.assetSymbols(),
        prices: null
    }
    try {
        const prices = await Price.find({});
        const priceFieldLabels = [
            {label: 'mAsset', value: 'mAsset'},
            {label: 'priceUST', value: 'priceUST'},
            {label: 'oraclePriceUST', value: 'oraclePriceUST'},
            {label: 'premium', value: 'premium'},
            {label: 'created_at', value: row => moment(row.created_at).format('YYYY-MM-DD hh:mm:ss')}
        ];

        const csvOptions = {
            fields: priceFieldLabels
        };
        const csvData = await parseAsync(prices, csvOptions);

        const currentTime = moment().format('YYYY-MM-DD_hh:mm:ss');
        const fileName = `Prices_${currentTime}.csv`;
        res.attachment(fileName);
        return res.send(csvData);
    } catch (error) {
        if (error instanceof Error)
            contextData.msg = error.message;
    }
    return res.render('prices/prices.pug', contextData)
}


const PricesController  = {
    showAllPrices: getAllPrices,
    getSinglePrice: getPriceById,
    sendAllCSV: sendAllPricesCSV
}

export default PricesController;
