// @flow weak
import {makeConnection} from "../relay";
import type {TArticle, TSeries} from "../service";
import {getArticles, getFeed, getFeeds, getTags, getTopics} from "../service";
import {tryCatch} from "ramda";
import type {TArticleConnection} from "./common";
import {mutations} from "./mutations";
import {subscriptions} from "./subscriptions";
import {getSeries} from "../services/series";

const resolvers = {
    Node: {
        __resolveType: (obj, context, info) => {
            if (obj.__type) return obj.__type;
            if (obj.name) {
                return "Tag"
            } else if (obj.title) {
                if (obj.summary) {
                    return "Article"
                } else {
                    return "Feed"
                }
            }
            return null
        },
        __typename: (obj, context, info) => {
            if (obj.__type) return obj.__type;
            if (obj.name) {
                return "Tag"
            } else if (obj.title) {
                if (obj.summary) {
                    return "Article"
                } else {
                    return "Feed"
                }
            }
            return null
        },
    },
    Tag: {
        articles: async (parent, args, context) => {
            console.log(`Tag,parent=${JSON.stringify(parent)}`);
            return await makeConnection(getArticles)({...args, tag: parent.id});
        },
    },
    Topic: {
        articles: async (parent, args, context) => {
            console.log(`Topic,parent=${JSON.stringify(parent)}`);
            return await makeConnection(getArticles)({...args, topic: parent.id});
        },
    },
    Article: {
        id: (parent) => parent._id,
        summary: ({summary}: TArticle) => {
            return (summary || "").replace(/<[^>]+>/g, "")
        },
        feed: async ({feedId}: TArticle, args, {}) => {
            return await getFeed(feedId)
        },
        tags: async (article: TArticle,) => {
            if (article.tags) {
                return article.tags;
            }
            return [];
        },
        priority: async (article: TArticle) => {
            return article.priority ? article.priority : 0;
        },
        box: async (article: TArticle,) => {
            if (article.spam) return "spam";
            return "inbox"
        },
        series: async ({seriesId2: seriesId}: TArticle, args, context): Promise<any | null> => {
            console.log(`seriesId2:${seriesId}`);
            if (!seriesId) {
                return null
            }
            return {
                _id: seriesId,
                title: seriesId,
            }
        }
    },
    Series: {
        id: (parent) => parent._id,
        articles: async (series: TSeries, args, context): Promise<TArticleConnection> => {
            return makeConnection(getArticles)({...args, ...args.page, seriesId: series._id});
        }
    },
    Feed: {
        id: (parent) => parent._id,
        articles: async (parent, args, context) => await makeConnection(getArticles)({...args, feedId: parent.id}),
    },
    Query: {
        articles: async (parent, args, context) => await makeConnection(getArticles)(args),
        feeds: async (parent, args, context) => await makeConnection(getFeeds)(args),
        tags: async (parent, args, context) => await makeConnection(getTags)(args),
        series: async (parent, args, context) => await makeConnection(getSeries)(args),
        topics: async (parent, args, context) => await makeConnection(getTopics)(args),
        node: async (parent, {id, type}, context) => {
            if (type) {
                switch (type) {
                    case "Feed":
                        const feed: any = await getFeed(id);
                        if (feed) {
                            feed.__type = "Feed";
                            return feed;
                        }
                        break;
                    case "Tag":
                        return ({id: id, name: id, __type: type});
                    case "Topic":
                        return ({id: id, name: id, __type: type});
                    case "Series":
                        return ({_id: id, title: id, __type: type})
                }
            }
            if (!(type && type !== "Feed")) {
                const feed: any = await getFeed(id);
                if (feed) {
                    feed.__type = "Feed";
                    return feed;
                }
            }
            if (id)
                return ({id: id, name: id, __type: type || "Tag"});
            else
                return null
        },
    },
    Mutation: mutations,
    Subscription: subscriptions,
};
export default resolvers;