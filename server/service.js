import {MongoClient, ObjectId} from "mongodb";
import assert from "assert";

export let mongoConnectionString = process.env.MONGO;

export async function getArticles({first, after, last, before}) {
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

    const result = await database.db("xread").collection("article").find(query).sort(sort).limit(limit).toArray();
    await database.close();
    result.forEach(it => it.id = it._id.toString());
    return result;
}

export async function addArticle({link, title, summary, time}) {
    let database;
    try {
        database = await MongoClient.connect(mongoConnectionString, {useNewUrlParser: true});
        const filter = {title, link};
        const update = {$set: {link, title, summary, time}};
        const response = await database.db("xread").collection("article").updateOne(filter, update, {upsert: true});
        const result = await database.db("xread").collection("article").findOne(filter);
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