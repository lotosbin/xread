import 'cross-fetch/polyfill';

const Koa = require('koa');
const app = new Koa();
import gql from "graphql-tag";
import client from "./apollo/client"
import moment from "moment";
import R from 'ramda';

const _ = require('koa-route');
import * as xread from './backend/xread';
import * as union from './backend/union';
const pets = {
    rest: async (ctx) => {
        //http://union.yuanjingtech.com/home/newjson?pagesize=100
        var url = ctx.request.query.url;
        var response = await fetch(url);
        var result = await response.json();
        console.log(result);
        var feed = union.toFeed(result);
        ctx.set('Content-type', 'application/xml');
        ctx.body = feed.atom1()
    },
    read: async (ctx) => {
        const result = await xread.getFromApi({priority: 1});
        const feed = xread.toFeed(result);

        // console.log(feed.rss2());
// Output: RSS 2.0

        console.log(feed.atom1());
// Output: Atom 1.0

        // console.log(feed.json1());
// Output: JSON Feed 1.0
        ctx.set('Content-type', 'application/xml');
        ctx.body = feed.atom1()
    },
    normal: async (ctx) => {
        const result = await xread.getFromApi({priority: 0});
        const feed = xread.toFeed(result);
        // console.log(feed.rss2());
// Output: RSS 2.0

        console.log(feed.atom1());
// Output: Atom 1.0

        // console.log(feed.json1());
// Output: JSON Feed 1.0
        ctx.set('Content-type', 'application/xml');
        ctx.body = feed.atom1()
    },
};

app.use(_.get('/rss/rest', pets.rest));
app.use(_.get('/rss/guess/read', pets.read));
app.use(_.get('/rss/', pets.normal));


app.listen(4001);
