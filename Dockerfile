FROM node as debug
# creo /work e faccio cd /work
WORKDIR /work/ 
VOLUME /work/ 
RUN npm install -g nodemon


ENTRYPOINT [ "nodemon","--inspect=0.0.0.0" ]

FROM node:12.4.0-alpine as prod

WORKDIR /work/
COPY ./package.json /work/package.json
COPY ./package-lock.json /work/package-lock.json
RUN npm install
COPY . /work/

CMD node .