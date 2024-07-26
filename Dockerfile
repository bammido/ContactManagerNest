FROM node:18
WORKDIR /usr/src/contact_manager
COPY package.json .
RUN npm i
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["npm", "start"]