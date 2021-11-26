import express from 'express';
import * as bodyParser from 'body-parser';
import IndexRouter from './routes/host';
import PriceRouter from './routes/host/export';
import AppKeys from './config/keys';
import mongoose from 'mongoose';
import AssetRouter from './routes/host/asset';

class TSNodeHostApp{
  constructor(){
    this.hostApp = express();
    this.bodyParserConfig();
    this.routeConfig();
    this.mongoDBSetup();
    this.staticFilesSetup();
  }

  public hostApp : express.Application;
  public mongoURL : string = AppKeys.mongoDBURL
  // public mongoURL : string = AppKeys.mongoDBDockerURL

  private bodyParserConfig(): void {
    this.hostApp.use(bodyParser.json());
    this.hostApp.use(bodyParser.urlencoded({extended : false}));
  }

  private routeConfig(): void {
    this.hostApp.use(IndexRouter);
    this.hostApp.use("/prices", PriceRouter);
    this.hostApp.use("/asset", AssetRouter);
  }

  private mongoDBSetup() : void{
    let MongoConnectionOptions = {};
    if (process.env.mongoDBauth == 'yes')
      MongoConnectionOptions = {
        "user": process.env.mongoDBUser,
        "pass": process.env.mongoDBPassword,
        "authSource": process.env.mongoDBauthSource
      }
    mongoose.connect(this.mongoURL, MongoConnectionOptions,
      (err) => {
        if (err){
          console.error("DB Error" , err);
        } else {
          console.log("Connected to MongoDB - Host App")
        }
      }
    )
  }

  private staticFilesSetup(){
    this.hostApp.use(express.static('public'));
    this.hostApp.locals.basedir =  '/public';
  }

}

export default new TSNodeHostApp().hostApp;
