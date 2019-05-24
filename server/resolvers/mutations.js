import {addArticle, addFeed, markArticleSpam, readArticle, try_add_article_to_dataset} from "../service";
import {ARTICLE_ADDED, FEED_ADDED, pubsub} from "./common";
import {addFeedToStore} from "../store/service";

export const mutations = {
    addArticle: async (root, args, context) => {
        let article = await addArticle(args);
        if (!article) return null;
        if (!article.extra.updatedExisting) {
            pubsub.publish(ARTICLE_ADDED, {articleAdded: article});
        }
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
    markReadedBatch: async (root, {ids = []}, context) => {
        return Promise.all(ids.map(async id => {
            const article = await readArticle({id});
            // noinspection JSIgnoredPromiseFromCall
            try_add_article_to_dataset(article, "1");
            return article;
        }))
    },
    markSpam: async (root, args, context) => {
        const article = await markArticleSpam(args);
        // noinspection JSIgnoredPromiseFromCall
        try_add_article_to_dataset(article, "-1");
        return article;
    },
    markSpamBatch: async (root, {ids = []}, context) => {
        return Promise.all(ids.map(async id => {
            const article = await markArticleSpam({id});
            // noinspection JSIgnoredPromiseFromCall
            try_add_article_to_dataset(article, "-1");
            return article;
        }))
    },
};