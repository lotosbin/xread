import {MongoClient, ObjectId} from "mongodb";
import type {TArticle} from "../service";
import {mongoConnectionString} from "../service";
import * as R from "ramda";

export async function nextParseSeriesArticle({before}: { before: string }): Promise<TArticle> {
    console.log(`nextParseSeriesArticle:before=${before}`);
    let database;
    try {
        database = await MongoClient.connect(mongoConnectionString, {useNewUrlParser: true});
        const filter = {
            title:{$regex:/([\（\(][一二三四五六七八九十]+[\）\)])/m},
            seriesId2: {$exists: false}
        };
        if (before) {
            filter._id = {$lt: new ObjectId(before)}
        }
        const articles = await database.db("xread").collection("article").find(filter).sort({_id: -1}).limit(1).toArray();
        const result = R.head(articles);
        console.debug(`nextParseSeriesArticle:${JSON.stringify(result)}`);
        return result;
    } finally {
        if (database) {
            await database.close();
        }
    }
}

export async function addArticleSeries(id: string, seriesId: string) {
    console.log(`addArticleSeries:id=${id},seriesId=${seriesId}`);
    let database;
    try {
        database = await MongoClient.connect(mongoConnectionString, {useNewUrlParser: true});
        let update = {$set: {seriesId2: seriesId}};
        const response = await database.db("xread").collection("article").updateOne({_id: new ObjectId(id)}, update);
    } finally {
        if (database) {
            await database.close();
        }
    }
}

export async function parseArticleSeries(article: TArticle): Promise<string | null> {
    return parseSeries(article.title || "");
}

export async function parseSeries(title: string): Promise<string | null> {
    try {
        const regex = /([\s\S]*)([\（\(][一二三四五六七八九十]+[\）\)])([\s\S]*)/m;
        const match = title.match(regex);
        console.log(JSON.stringify(match));
        if (match && match.length === 4) {
            return match[1]
        }
        return null
    } catch (e) {
        console.error(e);
        return null
    }
}
