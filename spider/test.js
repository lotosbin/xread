import {fetchFeed, runTask} from "./index";
import {add, list} from "./service";

// (async () => {
//     const articles = await fetchFeed({}, "https://rsshub.app/readhub/category/daily");
//     console.dir(articles);
//     articles.forEach(article => add(article));
// })();


list().then(feeds => {
    console.log(JSON.stringify(feeds));
    list().then(feeds => Promise.all(feeds.map(it => runTask(it.link, it.id))))
});