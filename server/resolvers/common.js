import {PubSub} from "apollo-server";
import type {TArticle} from "../service";

export const ARTICLE_ADDED = "ARTICLE_ADDED";
export const FEED_ADDED = "FEED_ADDED";
export const pubsub = new PubSub();
export type TArticleEdge = {
    node: TArticle
}
export type TArticleConnection = {
    edges: [TArticleEdge]
}