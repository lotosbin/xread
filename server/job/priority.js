import {nextParsePriorityArticle, parsePriority, setArticlePriority} from "../service";
import * as R from "ramda";

let running = false;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function runParseArticlePriority() {
    if (running) return;
    running = true;
    try {
        let article = await nextParsePriorityArticle();
        while (article) {
            try {
                const priorities = await parsePriority(`${article.title}${article.summary || ""}${(article.feed || {}).title}`);
                await setArticlePriority(article.id, priorities);
                article = await nextParsePriorityArticle();
            } catch (e) {
                console.error(e.message, e);
            }
            await sleep(200);//防止 QPS 超限制
        }
    } catch (e) {
        console.error(e.message, e);
        await sleep(5000);
    } finally {
        running = false
    }
}
