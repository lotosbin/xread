// @flow
import {makeConnection} from "./relay";
import {addArticle, addFeed, getArticles, getFeed, getFeeds, getTags, getTopics, markArticleSpam, readArticle, try_add_article_to_dataset} from "./service";
import {PubSub} from "apollo-server";
import {addFeedToStore} from "./store/service";
import {tryCatch} from "ramda";
import type {TArticle} from "./service";

const ARTICLE_ADDED = "ARTICLE_ADDED";
const FEED_ADDED = "FEED_ADDED";
const pubsub = new PubSub();


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
        summary: ({summary}: TArticle) => {
            return (summary || "").replace(/<[^>]+>/g, "")
        },
        feed: ({feedId}: TArticle, args, {}) => {
            return getFeed(feedId)
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
        }
    },
    Feed: {
        articles: async (parent, args, context) => await makeConnection(getArticles)({...args, feedId: parent.id}),
    },
    Query: {
        articles: async (parent, args, context) => await makeConnection(getArticles)(args),
        feeds: async (parent, args, context) => await makeConnection(getFeeds)(args),
        tags: async (parent, args, context) => await makeConnection(getTags)(args),
        topics: async (parent, args, context) => await makeConnection(getTopics)(args),
        node: async (parent, {id, type}, context) => {
            if (type) {
                switch (type) {
                    case "Feed":
                        const feed = await getFeed(id);
                        if (feed) {
                            feed.id = feed._id;
                            feed.__type = "Feed";
                            return feed;
                        }
                        break;
                    case "Tag":
                        return ({id: id, name: id, __type: type || "Tag"});
                    case "Topic":
                        return ({id: id, name: id, __type: type || "Topic"});
                }
            }
            if (!(type && type !== "Feed")) {
                const feed = await getFeed(id);
                if (feed) {
                    feed.id = feed._id;
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
    Mutation: {
        addArticle: async (root, args, context) => {
            let article = await addArticle(args);
            pubsub.publish(ARTICLE_ADDED, {articleAdded: article});
            return article;
        },
        addFeed: async (root, args, context) => {
            let feed = await addFeed(args);
            pubsub.publish(FEED_ADDED, {feedAdded: feed});
            if (feed) {
                // noinspection JSIgnoredPromiseFromCall
                addFeedToStore(feed)
            }
            return feed;
        },
        markReaded: async (root, args, context) => {
            const article = await readArticle(args);
            // noinspection JSIgnoredPromiseFromCall
            try_add_article_to_dataset(article, "1");
            return article;
        },
        markSpam: async (root, args, context) => {
            const article = await markArticleSpam(args);
            // noinspection JSIgnoredPromiseFromCall
            try_add_article_to_dataset(article, "-1");
            return article;
        },
    },
    Subscription: {
        articleAdded: {
            // Additional event labels can be passed to asyncIterator creation
            subscribe: () => pubsub.asyncIterator([ARTICLE_ADDED]),
        },
        feedAdded: {
            // Additional event labels can be passed to asyncIterator creation
            subscribe: () => pubsub.asyncIterator([FEED_ADDED]),
        }
    },
};
export default resolvers;