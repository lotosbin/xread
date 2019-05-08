// @flow
import {MongoClient, ObjectId} from "mongodb";
import assert from "assert";
import type {TKeywordResult, TTopicResult} from "./baidu-aip-nlp";
import {keyword, topic} from "./baidu-aip-nlp";

import * as R from "ramda";
import {recommend_priority} from "./baidu-aip-easedl";

export let mongoConnectionString = process.env.MONGO;

export async function getFeed(id: string) {
    const database = await MongoClient.connect(mongoConnectionString, {useNewUrlParser: true});
    const result = await database.db("xread").collection("feed").findOne({_id: new ObjectId(id)});
    await database.close();
    if (result) result.id = result._id.toString();
    return result;
}

type TPage = {
    first: number;
    after: string;
    last: number;
    before: string;
}

export async function getFeeds({first, after, last, before}: TPage) {
    return await getList("feed", {first, after, last, before})
}

export async function addFeed({link, title}: { link: string, title: string }): Promise<any> {
    let database;
    try {
        database = await MongoClient.connect(mongoConnectionString, {useNewUrlParser: true});
        const filter = {link};
        const update = {$set: {link, title}};
        const response = await database.db("xread").collection("feed").updateOne(filter, update, {upsert: true});
        const result = await database.db("xread").collection("feed").findOne(filter);
        if (result) {
            result.id = result._id.toString();
        }
        return result;
    } catch (e) {
        console.log(e.message);
        return null;
    } finally {
        if (database) {
            await database.close();
        }
    }
}

type TGetArticlesArgs = {
    first: number;
    after: string;
    last: number;
    before: string;
    feedId: string;
    tag: string;
    topic: string;
    box: string;
    read: string;
}

export async function getArticles(args: TGetArticlesArgs) {
    console.log(`getArticles:args=${JSON.stringify(args)}`);
    let {first, after, last, before, feedId, tag, topic, box, read = "all", priority} = args;
    assert(!!first || !!last, "first or last should grate then 0");
    assert(!(!!first && !!last), 'first or last cannot set same time');
    const database = await MongoClient.connect(mongoConnectionString, {useNewUrlParser: true});
    const query = {};
    let sort;
    let limit;
    if (first) {
        sort = {_id: 1};
        limit = first;
        if (after) {
            query._id = {$gt: new ObjectId(after)};

        }
    } else {
        sort = {_id: -1};
        limit = last;
        if (before) {
            query._id = {$lt: new ObjectId(before)};
        }
    }
    if (feedId) {
        query.feedId = `${feedId}`
    }
    if (tag) {
        query.tags = tag;
    }
    if (topic) {
        query.topic = topic;
    }
    if (priority) {
        query.priority = priority;
    }
    switch (box) {
        case "inbox":
            query.spam = {$ne: true};
            break;
        case "spam":
            query.spam = true;
            break;
        default:
            break;
    }
    switch (read) {
        case "unread":
            query.read = {$ne: true};
            break;
        case "readed":
            query.read = true;
            break;
        default:
            break;
    }
    const result = await database.db("xread").collection("article").find(query).sort(sort).limit(limit).toArray();
    await database.close();
    result.forEach(it => it.id = it._id.toString());
    return result;
}

type TAddArticleArgs = {
    link: string;
    title: string;
    summary: string;
    time: string;
    feedId: string;
}

export async function addArticle({link, title, summary, time, feedId}: TAddArticleArgs) {
    let database;
    try {
        database = await MongoClient.connect(mongoConnectionString, {useNewUrlParser: true});
        const filter = {title, link};
        let update = {$set: {link, title, summary, time}};
        if (feedId) {
            update.$set.feedId = feedId;
        }
        const response = await database.db("xread").collection("article").updateOne(filter, update, {upsert: true});
        const result = await database.db("xread").collection("article").findOne(filter);
        if (result) {
            result.id = result._id.toString();
            // parseArticleKeywords(result).catch(error => console.error(error));
            parseArticleTopic(result)
        }
        return result;
    } catch (e) {
        console.log(e.message);
        return null;
    } finally {
        if (database) {
            await database.close();
        }
    }
}

type TId = { id: string };

export async function readArticle({id}: TId) {
    let database;
    try {
        database = await MongoClient.connect(mongoConnectionString, {useNewUrlParser: true});
        let filter = {_id: new ObjectId(id)};
        let update = {$set: {read: true}};
        const response = await database.db("xread").collection("article").updateOne(filter, update);
        const result = await database.db("xread").collection("article").findOne(filter);
        if (result) {
            result.id = result._id.toString();
        }
        return result;
    } finally {
        if (database) {
            await database.close();
        }
    }
}

export async function markArticleSpam({id}: TId) {
    let database;
    try {
        database = await MongoClient.connect(mongoConnectionString, {useNewUrlParser: true});
        let filter = {_id: new ObjectId(id)};
        let update = {$set: {spam: true}};
        const response = await database.db("xread").collection("article").updateOne(filter, update);
        const result = await database.db("xread").collection("article").findOne(filter);
        if (result) {
            result.id = result._id.toString();
        }
        return result;
    } finally {
        if (database) {
            await database.close();
        }
    }
}

export async function getTags(): Promise<Array<{ id: string, name: string }>> {
    var allTags = await getAllTags();
    return allTags.map(it => ({id: it, name: it}));
}

export async function getTopics(): Promise<Array<{ id: string, name: string }>> {
    var allTopics = await getAllTopics();
    return allTopics.map(it => ({id: it, name: it}));
}

export async function getAllTags(): Promise<Array<string>> {
    let database;
    try {
        database = await MongoClient.connect(mongoConnectionString, {useNewUrlParser: true});
        const response = await database.db("xread").collection("article").distinct("tags");
        return response || [];
    } catch (e) {
        return [];
    } finally {
        if (database) {
            await database.close();
        }
    }
}

export async function getAllTopics(): Promise<Array<string>> {
    let database;
    try {
        database = await MongoClient.connect(mongoConnectionString, {useNewUrlParser: true});
        const response = await database.db("xread").collection("article").distinct("topic");
        return response || [];
    } catch (e) {
        return [];
    } finally {
        if (database) {
            await database.close();
        }
    }
}

async function addArticleKeywords(id: string, tags: Array<string>) {
    console.log(`addArticleKeywords:id=${id},tags=${tags.join(",")}`);
    let database;
    try {
        database = await MongoClient.connect(mongoConnectionString, {useNewUrlParser: true});
        let update = {$addToSet: {tags: {$each: tags}}};
        const response = await database.db("xread").collection("article").updateOne({_id: new ObjectId(id)}, update);
    } finally {
        if (database) {
            await database.close();
        }
    }
}

export async function setArticlePriority(id: string, priority: number) {
    let database;
    try {
        database = await MongoClient.connect(mongoConnectionString, {useNewUrlParser: true});
        let update = {$set: {priority: priority}};
        const response = await database.db("xread").collection("article").updateOne({_id: new ObjectId(id)}, update);
    } finally {
        if (database) {
            await database.close();
        }
    }
}

async function addArticleTopic(id: string, tag: string) {
    console.log(`addArticleTopic:id=${id},tag=${tag}`);
    let database;
    try {
        database = await MongoClient.connect(mongoConnectionString, {useNewUrlParser: true});
        let update = {$set: {topic: tag}};
        const response = await database.db("xread").collection("article").updateOne({_id: new ObjectId(id)}, update);
    } finally {
        if (database) {
            await database.close();
        }
    }
}

export type TArticle = {
    id: string;
    feed: {
        title: string
    };
    summary: string;
    title: string;
}

export async function parseArticleKeywords(article: TArticle) {
    const result: TKeywordResult = await keyword(article.summary || "", article.title || "");
    if (result.items) {
        let tags: Array<string> = result.items.map(it => it.tag);
        await addArticleKeywords(article.id, tags);
        return tags;
    }
    return []
}

export async function nextParseKeywordsArticle(): Promise<TArticle> {
    let database;
    try {
        database = await MongoClient.connect(mongoConnectionString, {useNewUrlParser: true});
        const articles = await database.db("xread").collection("article").find({tags: {$exists: false}, priority: {$exists: false}}).sort({_id: -1}).limit(1).toArray();
        const result = R.head(articles);
        if (result) {
            result.id = result._id.toString();
        }
        console.debug(`nextParseKeywordsArticle:${JSON.stringify(result)}`);
        return result;
    } finally {
        if (database) {
            await database.close();
        }
    }
}

export async function nextParsePriorityArticle(): Promise<TArticle> {
    let database;
    try {
        database = await MongoClient.connect(mongoConnectionString, {useNewUrlParser: true});
        const articles = await database.db("xread").collection("article").find({spam: {$ne: true}, priority: {$exists: false}}).sort({_id: -1}).limit(1).toArray();
        const result = R.head(articles);
        if (result) {
            result.id = result._id.toString();
        }
        console.debug(`nextParsePriorityArticle:${JSON.stringify(result)}`);
        return result;
    } finally {
        if (database) {
            await database.close();
        }
    }
}

export async function parseArticlePriority(article: TArticle): Promise<number> {
    return await parsePriority(`${article.title}${article.summary}${(article.feed || {}).title}`);
}

/**
 * @see http://ai.baidu.com/docs#/EasyDL_TEXT_API/top
 * */
export async function parsePriority(text: string): Promise<number> {
    if (text.length > 4096) {
        console.warn(`parsePriority: text is large then 4096`)
    }
    const json = await recommend_priority(text.slice(0, 4096));
    const item = R.reduce(R.maxBy(R.prop('score')), {name: 0, score: 0}, json.result || []);
    const priority = parseInt(item.name);
    console.debug(`parsePriority:text=${text},priority=${priority}`);
    return priority;
}

export async function parseArticleTopic(article: TArticle): Promise<string | null> {
    try {
        const result: TTopicResult = await topic(article.summary || "", article.title || "");
        if (result.item && result.item.lv1_tag_list && result.item.lv1_tag_list.length) {
            const tag: string = result.item.lv1_tag_list[0].tag;
            await addArticleTopic(article.id, tag);
            return tag;
        }
        return null
    } catch (e) {
        console.error(e);
        return null
    }
}


export async function getList(collectionName: string, {first, after, last, before}: TPage) {
    assert(!!first || !!last, "first or last should grate then 0");
    assert(!(!!first && !!last), 'first or last cannot set same time');
    const database = await MongoClient.connect(mongoConnectionString, {useNewUrlParser: true});
    const query = {};
    let sort;
    let limit;
    if (first) {
        sort = {_id: 1};
        limit = first;
        if (after) {
            query._id = {$gt: new ObjectId(after)};

        }
    } else {
        sort = {_id: -1};
        limit = last;
        if (before) {
            query._id = {$lt: new ObjectId(before)};
        }
    }

    const result = await database.db("xread").collection(collectionName).find(query).sort(sort).limit(limit).toArray();
    await database.close();
    result.forEach(it => it.id = it._id.toString());
    return result;
}
