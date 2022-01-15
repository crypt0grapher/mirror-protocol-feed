## Mirror Protocol Price Feed
### APp
The app provides info on MAssets over time from [Mirror Protocol](https://mirrorprotocol.app/) on [Terra blockchain ](https://terra.money/).
[It shows](https://mirror.planeta.money/) the premium, mean, and standard deviation, and also charts for premium and prices for mAsset vs real Asset price, which provides arbitrage opportunities for traders.
bLuna price is also collected, "premium" is a simulation response of 1 minus how many bLuna can be bought for 1 uluna.  

### Frameworks
- Backend - Express 
- Frontend - **Pug** Templating Engine
- Database - MongoDB + Mongoose (ORM)
- FrontendDesign - Zurb Foundation
- CSV Libs - **JSON2CSV**
- Chart: **[TimeChart](https://github.com/huww98/TimeChart)**
- Terra.js, Mirror.js

### Architecture
The bundle basically consists of two Express.js apps running on Node.js: the API and the Host.
- **API** is a server polling Mirror protocol every 60 seconds and saving the feed to MongoDB database, extracts the data on request and generates HTML pages with Pug templates.
- **Host** is a simple HTML/TS application with Bootstrap v5 serving a minimal UI and user interaction.

### Installation
- Clone the repo.
- Install the bundle with `yarn` (or `npm install`).
- Make sure you got MongoDB instance running.
- Create `.env` file from `.env.example`. Just renaming the file will suffice.
- Enjoy, [http://localhost:3000](http://localhost:3000) by default.

### Using chart interface
With touch screen:
* 1 finger to pan
* 2 or more finger to pan and zoom

With mouse:
* Left button drag to pan
* wheel scroll translate X axis
* Alt + wheel scroll to translate Y axis
* Ctrl + wheel scroll to zoom X axis
* Ctrl + Alt + wheel scroll to zoom Y axis
* Hold Shift key to speed up translate or zoom 5 times

With trackpad:
* Pan X or Y direction to translate X axis
* Alt + Pan X/Y direction to translate X/Y axis
* Pinch to zoom X axis
* Alt + pinch to zoom Y axis
* Hold Shift key to speed up translate or zoom 5 times
