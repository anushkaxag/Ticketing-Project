FROM node:alpine

WORKDIR /app
COPY package.json .
# --omit=dev - doesn't install dev. dependency while building docker image
RUN npm install --omit=dev
COPY . .

CMD ["npm", "start"]