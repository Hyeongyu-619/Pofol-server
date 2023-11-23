FROM ubuntu:22.04

RUN apt update && apt install -y \
    wget \
    curl \
    build-essential \
    && curl -sL https://deb.nodesource.com/setup_18.x -o nodesource_setup.sh \
    && bash nodesource_setup.sh \
    && apt install -y nodejs

RUN npm install -g typescript

WORKDIR /root/expressapp/

COPY ./ ./

RUN npm install \
    && npm install mongoose \
    && npm audit fix \
    && npm install -g pm2

RUN npm run build

CMD ["pm2-runtime", "start", "npm", "--name", "pofol", "--", "run", "start"]
