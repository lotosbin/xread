// @flow
import 'cross-fetch/polyfill';
import Parser from "rss-parser";
import {add, list} from "./service";

const parser = new Parser();

class IArticle {
}

export async function runTask(feedLink, feedId) {
    try {
        const articles = await fetchFeed({}, feedLink);
        articles.forEach(article => add({...article, feedId}));
    } catch (e) {
        console.error(e)
    }
}

export async function fetchFeed({openid, unionid, first, after, last, before}, feedUrl): Promise<[IArticle]> {
    console.log(`getArticles3`);
    const feed = await parser.parseURL(feedUrl);
    return feed.items.map((it) => ({
        id: it.guid,
        link: it.link,
        summary: it.content,
        tags: (it.categories || []).map((category) => ({id: "", name: category})),
        time: it.pubDate,
        title: it.title,
    }));
}

const cron = require('node-cron');
let running = false;
let run = function () {
    !running && list().then(feeds => Promise.all(feeds.map(it => runTask(it.link, it.id)))).then(() => running = false).catch(() => running = false)
};
run();
cron.schedule('* */1 * * *', () => {
    console.log(`${Date().toString()}:running every 1 hour`);
    run();
});