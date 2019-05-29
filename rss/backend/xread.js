import gql from "graphql-tag";
import client from "../apollo/client"
import moment from "moment";
import R from 'ramda';
const fragment_article_list_item = gql`fragment fragment_article_list_item on Article{
    id
    title
    summary
    link
    time
    tags
    box
    priority
    feed{
        id
        title
        link
    }
}`;
let query = gql`query articles($cursor: String="",$box:String="all",$read:String="all",$priority:Int,$score:Float) {
    articles(last:100,before: $cursor,box:$box,read:$read,priority:$priority,search:{
        score:$score
    }) {
        pageInfo{
            startCursor
            endCursor
            hasNextPage
            hasPreviousPage
        }
        edges{
            cursor
            node{
                ...fragment_article_list_item
            }
        }
    }
}
${fragment_article_list_item}
`;
import {Feed} from "feed";

export let getFromApi = async function ({priority = 0}) {
    const variables = {tag: null, cursor: null, read: "all", priority: priority, box: "inbox"};
    const result = await client.query({query, variables});
    console.log(result);
    return result;
};
export let toFeed = function (result) {
    const feed = new Feed({
        title: "xRead",
        description: "This is xread feed!",
        id: "http://www.xread.yuanjingtech.com/",
        link: "http://www.xread.yuanjingtech.com/",
        language: "en", // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
        image: "http://www.xread.yuanjingtech.com/image.png",
        favicon: "http://www.xread.yuanjingtech.com/favicon.ico",
        copyright: "All rights reserved 2019",
        // updated: new Date(2013, 6, 14), // optional, default = today
        // generator: "awesome", // optional, default = 'Feed for Node.js'
        feedLinks: {
            json: "https://www.xread.yuanjingtech.com/json",
            atom: "https://www.xread.yuanjingtech.com/atom"
        },
        author: {
            name: "lotosbin",
            email: "lotosbin@gmail.com",
            link: "https://www.xread.yuanjingtech.com/johndoe"
        }
    });

    result.data.articles.edges.map(it => it.node).forEach(post => {
        feed.addItem({
            title: post.title,
            id: post.id,
            link: post.link,
            description: post.summary,
            content: post.summary,
            // author: [
            //     {
            //         name: "Jane Doe",
            //         email: "janedoe@example.com",
            //         link: "https://example.com/janedoe"
            //     },
            //     {
            //         name: "Joe Smith",
            //         email: "joesmith@example.com",
            //         link: "https://example.com/joesmith"
            //     }
            // ],
            // contributor: [
            //     {
            //         name: "Shawn Kemp",
            //         email: "shawnkemp@example.com",
            //         link: "https://example.com/shawnkemp"
            //     },
            //     {
            //         name: "Reggie Miller",
            //         email: "reggiemiller@example.com",
            //         link: "https://example.com/reggiemiller"
            //     }
            // ],
            date: moment(post.time),
            // image: post.image
        });
    });

    // feed.addCategory("Technologie");

    // feed.addContributor({
    //     name: "Johan Cruyff",
    //     email: "johancruyff@example.com",
    //     link: "https://example.com/johancruyff"
    // });
    return feed;
};



