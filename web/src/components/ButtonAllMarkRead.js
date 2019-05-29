import gql from "graphql-tag";
import {useTranslation} from "react-i18next";
import {useMutation} from "react-apollo-hooks";
import {Button} from "@material-ui/core";
import React, {useContext} from "react";
import _ from "lodash";
import QueryContext from "../contexts/QueryContext";

let mutationMarkRead = gql`mutation markRead($id:String) {
    markReaded(id:$id){
        id
    }
}
`;
const ButtonAllMarkRead = ({ids = [], read}: { ids: Array<string> }) => {
    const {t, ready} = useTranslation("", {useSuspense: false});
    const {query, variables} = useContext(QueryContext);
    const markRead = useMutation(mutationMarkRead);
    if (!ids.length) return null;
    return <Button onClick={() => {
        ids.forEach(id => markRead({
            variables: {id: id},
            optimisticResponse: {
                __typename: "Mutation",
                markReaded: {
                    __typename: "Article",
                    id: id,
                }
            },
            update: (proxy, {data: {markReaded: {id}}}) => {
                // Read the data from our cache for this query.
                if (!query) return;
                if (read === "unread") {
                    const data = proxy.readQuery({query: query, variables: variables});
                    if (data.node) {
                        const find = _.find(data.node.articles.edges || [], {node: {id: id}});
                        if (find) {
                            console.log(`find`);
                            data.node.articles.edges = _.without(data.node.articles.edges || [], find) || [];
                            // Write our data back to the cache.
                            proxy.writeQuery({query: query, data});
                        }
                    } else {
                        const find = _.find(data.articles.edges || [], {node: {id: id}});
                        if (find) {
                            console.log(`find`);
                            data.articles.edges = _.without(data.articles.edges || [], find) || [];
                            // Write our data back to the cache.
                            proxy.writeQuery({query: query, data});
                        }
                    }
                }
            }
        }));
    }} variant="outlined" color="primary">{t('Mark All Read')}</Button>
};
export default ButtonAllMarkRead;