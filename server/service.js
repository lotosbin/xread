// @flow
import {MongoClient, ObjectId} from "mongodb";
import assert from "assert";
import {keyword} from "./baidu-aip-nlp";
import type {TKeywordResult} from "./baidu-aip-nlp";

export let mongoConnectionString = process.env.MONGO;

export async function getFeed(id) {
    const database = await MongoClient.connect(mongoConnectionString, {useNewUrlParser: true});
    const result = await database.db("xread").collection("feed").findOne({_id: new ObjectId(id)});
    await database.close();
    if (result) result.id = result._id.toString();
    return result;
}

export async function getFeeds({first, after, last, before}) {
    return await getList("feed", {first, after, last, before})
}

export async function addFeed({link, title}) {
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

export async function getArticles(args) {
    console.log(`getArticles:args=${JSON.stringify(args)}`)
    let {first, after, last, before, feedId, tag} = args;
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
        query.feedId = feedId;
    }
    if (tag) {
        query.tags = tag;
    }
    const result = await database.db("xread").collection("article").find(query).sort(sort).limit(limit).toArray();
    await database.close();
    result.forEach(it => it.id = it._id.toString());
    return result;
}

export async function addArticle({link, title, summary, time, feedId}) {
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

export async function getTags(): { id: string, name: string } {
    var allTags = await getAllTags();
    return allTags.map(it => ({id: it, name: it}));
}

export async function getAllTags(): Array<string> {
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

async function addArticleKeywords(id: string, tags: Array<string>) {
    console.log(`addArticleKeywords:id=${id},tags=${tags.join(",")}`);
    if (!(tags && tags.length)) {
        return;
    }
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

export async function parseArticleKeywords(article) {
    const result: TKeywordResult = await keyword(article.summary || "", article.title || "");
    if (result.items && result.items.length) {
        let tags: Array<string> = result.items.map(it => it.tag);
        await addArticleKeywords(article.id, tags);
        return tags;
    }
    return []
}

export async function getList(collectionName: String, {first, after, last, before}) {
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
