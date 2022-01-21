FROM node:16

WORKDIR /opt/app

COPY package.json ./
COPY tsconfig.json ./
COPY .yarnrc.yml ./
COPY ./src ./src
COPY ./public ./public

RUN yarn install
RUN yarn set version stable

EXPOSE 3000

CMD ["yarn", "production"]
