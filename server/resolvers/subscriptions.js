import {ARTICLE_ADDED, FEED_ADDED, pubsub} from "./common";

export const subscriptions = {
    articleAdded: {
        // Additional event labels can be passed to asyncIterator creation
        subscribe: () => pubsub.asyncIterator([ARTICLE_ADDED]),
    },
    feedAdded: {
        // Additional event labels can be passed to asyncIterator creation
        subscribe: () => pubsub.asyncIterator([FEED_ADDED]),
    }
};