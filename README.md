# xread
another rss reader

# DEV

```bash
docker-compose up 
MONGO=mongodb://localhost:27017 cd server && yarn start
REACT_APP_API_URL=http://localhost:4000/graphql REACT_APP_WEBSOCKET_URL=ws://localhost:4000/graphql cd web && yarn start
API_URL=http://localhost:4000/graphql cd grab && yarn test
```