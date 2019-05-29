import {mongoConnectionString} from "../service";
import {MongoClient} from "mongodb";

export async function getSeries(): Promise<Array<{ _id: string, title: string }>> {
    var allTags = await getAllSeries();
    return allTags.filter(it => !!it).map(it => ({_id: it, title: it}));
}

export async function getAllSeries(): Promise<Array<string>> {
    let database;
    try {
        database = await MongoClient.connect(mongoConnectionString, {useNewUrlParser: true});
        const response = await database.db("xread").collection("article").distinct("seriesId2");
        return response || [];
    } catch (e) {
        return [];
    } finally {
        if (database) {
            await database.close();
        }
    }
}