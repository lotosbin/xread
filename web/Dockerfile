FROM node:8-alpine as builder
COPY . /src/
WORKDIR /src/
ARG REACT_APP_API_URL=http://localhost:4000/graphql
ARG REACT_APP_WEBSOCKET_URL=ws://localhost:4000/graphql
ENV REACT_APP_API_URL ${REACT_APP_API_URL}
ENV REACT_APP_WEBSOCKET_URL ${REACT_APP_WEBSOCKET_URL}
RUN echo "REACT_APP_API_URL=${REACT_APP_API_URL}"
RUN echo "REACT_APP_WEBSOCKET_URL=${REACT_APP_WEBSOCKET_URL}"
RUN yarn
RUN yarn build

FROM nginx:alpine
COPY --from=builder /src/build /usr/share/nginx/html
