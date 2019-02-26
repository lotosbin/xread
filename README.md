# xread
another rss reader
react react-native graphql rss reader

# DEV

```bash
docker-compose up 

BAIDU_AIP_APP_ID=... \
BAIDU_AIP_API_KEY=... \
BAIDU_AIP_SECRET_KEY=... \
MONGO=mongodb://localhost:27017 cd server && yarn start

REACT_APP_API_URL=http://localhost:4000/graphql \
REACT_APP_WEBSOCKET_URL=ws://localhost:4000/graphql \
cd web && yarn start

API_URL=http://localhost:4000/graphql cd grab && yarn test
```
- spider
```bash
API_URL=http://localhost:4000 cd spider && yarn start
```
# chrome subscribe url
```
http://localhost:3000/#/spider/subscribe?url=%s
```
# arch

web     ----+
            |
app     -------query/mutation/subscription---->server(graphql)----query/mutation---> mongodb
            |                                          ^                |
desktop ----+                                          |             parse keywords/category on add article
                                                       |                |
                        spider      ----mutation-------+                +--------->    baidu api

# deploy

```bash
git clone --depth 1 https://github.com/lotosbin/xread.git
```

docker-compose.yml
replace server ip in service web environment
```bash
docker-compose up -d
```

# data storage
```yaml
services:
  mongo:
    image: mongo
    volumes:
      - ./mongo/data/db:/data/db
```
