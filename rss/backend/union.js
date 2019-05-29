import {Feed} from "feed";
import moment from "moment";

var dateFromObjectId = function (objectId) {
    return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
};
export let toFeed = function (result) {
    const feed = new Feed({
        title: "union",
        description: "This is union feed!",
        id: "http://union.yuanjingtech.com/",
        link: "http://union.yuanjingtech.com/",
        language: "en", // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
        image: "http://union.yuanjingtech.com/image.png",
        favicon: "http://union.yuanjingtech.com/favicon.ico",
        copyright: "All rights reserved 2019",
        // updated: new Date(2013, 6, 14), // optional, default = today
        // generator: "awesome", // optional, default = 'Feed for Node.js'
        feedLinks: {
            json: "https://union.yuanjingtech.com/json",
            atom: "https://union.yuanjingtech.com/atom"
        },
        author: {
            name: "lotosbin",
            email: "lotosbin@gmail.com",
            link: "https://union.yuanjingtech.com/johndoe"
        }
    });

    result.forEach(post => {
        feed.addItem({
            title: post.title,
            id: post.id,
            link: post.url,
            description: post.description,
            content: post.description,
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
            date: dateFromObjectId(post.id),
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