# xread
another rss reader
react react-native graphql rss reader

qq群: 631376463

# DEV

- mongo
```bash
docker-compose up mongo
```
- server
```bash
BAIDU_AIP_APP_ID=... \
BAIDU_AIP_API_KEY=... \
BAIDU_AIP_SECRET_KEY=... \
STORE_API_GRAPHQL_URL=... \
MONGO=mongodb://localhost:27017 cd server && yarn start
```
- web
```
REACT_APP_API_URL=http://localhost:4000/graphql \
REACT_APP_WEBSOCKET_URL=ws://localhost:4000/graphql \
cd web && yarn start

API_URL=http://localhost:4000/graphql cd grab && yarn test
```
- nginx

- spider
```bash
API_URL=http://localhost:4000 cd spider && yarn start
```

- store
```bash
BAIDU_AIP_APP_ID=... \
BAIDU_AIP_API_KEY=... \
BAIDU_AIP_SECRET_KEY=... \
STORE=1 \
MONGO=mongodb://localhost:27017 cd server && yarn start
```
# chrome subscribe url
```
http://localhost:3000/#/spider/subscribe?url=%s
```
# arch
```
web     ----+
            |
app     -------query/mutation/subscription---->server(graphql)----query/mutation---> mongodb
            |                                          ^        |      |
desktop ----+                                         |         |  parse keywords/category on add article
                                                      |         |     |
                        spider----------mutation-------+        |      +--------->    baidu api
                                                                | 
                                                                +------remote-------store(graphql) same as server(graphql)
```

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
