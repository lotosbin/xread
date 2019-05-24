import gql from "graphql-tag";
import {useTranslation} from "react-i18next";
import {useMutation} from "react-apollo-hooks";
import {Button} from "@material-ui/core";
import React, {useContext} from "react";
import QueryContext from "../contexts/QueryContext";
import * as R from "ramda";

let mutationMarkSpam = gql`mutation markSpamBatch($ids:[String]) {
    markSpamBatch(ids:$ids){
        id
    }
}
`;
const ButtonAllMarkSpam = ({ids = []}: { ids: Array<string> }) => {
    const {t, ready} = useTranslation("", {useSuspense: false});
    const markSpam = useMutation(mutationMarkSpam);
    const {query, variables} = useContext(QueryContext);
    if (!ids.length) return null;
    return <Button onClick={() => {
        markSpam({
            variables: {ids: ids},
            // optimisticResponse: {
            //     __typename: "Mutation",
            //     markSpam: [{
            //         // __typename: "Article",
            //         id: id,
            //     }]
            // },
            update: (proxy, {data: {markSpamBatch = []}}) => {
                // Read the data from our cache for this query.
                console.dir(markSpamBatch);
                if (!query) return;
                const data = proxy.readQuery({query: query, variables: variables});
                // Add our comment from the mutation to the end.
                var src = [];
                if (data.node) {
                    //feed/tag/topic
                    src = data.node.articles.edges;
                } else {
                    src = data.articles.edges;
                }
                const find = R.filter(e => R.contains(e.node.id, markSpamBatch.map(it => it.id)))(src) || [];
                if (find.length) {
                    console.log(`find`);
                    if (data.node) {
                        data.node.articles.edges = R.without(find)(src);
                    } else {
                        data.articles.edges = R.without(find)(src);
                    }
                    // Write our data back to the cache.
                    proxy.writeQuery({query: query, data});
                }
            }
        });
    }} variant="outlined" color="secondary">{t('Mark All Spam')}</Button>
};
export default ButtonAllMarkSpam;