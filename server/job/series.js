import {addArticleSeries, nextParseSeriesArticle, parseArticleSeries} from "../services/article";

let running = false;


// QPS限制 5 request/second 1000/5= 200ms
export async function runParseArticleSeries() {
    if (running) return;
    running = true;
    let before = "";
    try {
        let article = await nextParseSeriesArticle(before);
        while (article) {
            before = article._id;
            const seriesId = await parseArticleSeries(article);
            await addArticleSeries(article._id, seriesId);

            article = await nextParseSeriesArticle(before);
            // await sleep(200);//防止 QPS 超限制
        }
    } catch (e) {
        console.error(e.message, e);
        // await sleep(5000);
    } finally {
        running = false
    }
}
