import {MongoClient, ObjectId} from "mongodb";
import _ from 'lodash';

export let mongoConnectionString = process.env.MONGO;

export async function getArticles({first = 10, after, last, before}) {
    const database = await MongoClient.connect(mongoConnectionString, {useNewUrlParser: true});
    const query = {};
    if (after) {
        query._id = {$gt: new ObjectId(after)};
    }
    const limit = first + 1;
    const result = await database.db("xread").collection("article").find(query).sort({time: 1}).limit(limit).toArray();
    await database.close();
    result.forEach(it => it.id = it._id.toString());
    return result;
}

export async function getArticlesConnection({first = 10, after, last, before}) {
    const articles = await getArticles({first, after, last, before});
    return {
        pageInfo: {
            startCursor: _.chain(articles).map(it => it.id).first() || null,
            endCursor: _.chain(articles).map(it => it.id).last() || null,
            hasNextPage: !!(articles.length > first),
            hasPreviousPage: !!(after && articles.length),
        },
        edges: articles.map(it => ({cursor: it.id, node: it})) || []
    }
}
