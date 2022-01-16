import {Request, Response} from 'express';
import {Price} from '../../models/Price';

async function getAllPrices(req: Request, res: Response) {
    const priceFindOptions: any = {};
    const jsonResp: any = {
        msg: 'Prices Found',
        method: `${req.method}`,
        data: null
    };
    let httpStatus = 200;

    try {
        jsonResp.data = await Price.find(priceFindOptions).limit(10000);
        jsonResp.success = true;
    } catch (error) {
        jsonResp.msg = error;
        jsonResp.success = false;
        httpStatus = 500
    }
    return res.status(httpStatus).json(jsonResp)
}

async function getPriceById(req: Request, res: Response) {
    const priceId: string = req.params.id;
    const jsonResp: any = {
        msg: 'Price Found',
        method: `${req.method}`,
    }
    let httpStatus = 200;

    try {
        jsonResp.data = await Price.findById(priceId)
        jsonResp.success = true;
    } catch (error) {
        jsonResp.msg = error;
        jsonResp.success = false;
        httpStatus = 500;
    }
    return res.status(httpStatus).json(jsonResp);
}


const ControllerMethods: any = {
    showAllPrices: getAllPrices,
    getSinglePrice: getPriceById,
}

export default ControllerMethods;
