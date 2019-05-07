import gql from "graphql-tag";
import {useTranslation} from "react-i18next";
import {useMutation} from "react-apollo-hooks";
import {Button} from "@material-ui/core";
import React, {useContext} from "react";
import _ from "lodash";
import QueryContext from "../contexts/QueryContext";

let mutationMarkSpam = gql`mutation markSpam($id:String) {
    markSpam(id:$id){
        id
    }
}
`;
const ButtonMarkSpam = ({id}) => {
    const {t, ready} = useTranslation("", {useSuspense: false});
    const markSpam = useMutation(mutationMarkSpam);
    const {query, variables} = useContext(QueryContext);
    return <Button onClick={() => markSpam({
        variables: {id: id},
        optimisticResponse: {
            __typename: "Mutation",
            markSpam: {
                __typename: "Article",
                id: id,
            }
        },
        update: (proxy, {data: {markSpam: {id}}}) => {
            // Read the data from our cache for this query.
            if (!query) return;
            const data = proxy.readQuery({query: query, variables: variables});
            // Add our comment from the mutation to the end.
            if (data.node) {
                //feed/tag/topic
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
    })} color="secondary">{t('Mark Spam')}</Button>
};
export default ButtonMarkSpam;