import {Document} from 'mongoose';
export interface PriceItem{
  mAsset: string,
  priceUST: number,
  oraclePriceUST: number,
  premium : number,
  created_at : Date,
}

interface PriceModelInterface extends PriceItem, Document {}
export default PriceModelInterface

