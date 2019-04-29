import React, {useState} from 'react';
import {Query} from "react-apollo";
import gql from "graphql-tag";
import {Link, Route, withRouter} from "react-router-dom";
import styles from "./Tag.module.css"
import {useQuery} from "react-apollo-hooks";
import TagArticleListContainer from "./components/TagArticleListContainer";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/Delete';

const query = gql`{
    tags{
        edges{
            node{
                id
                name
            }
        }
    }
}`;
const Tag = () => {

    const [keyword, setKeyword] = useState(null);
    let variables = {};
    const {data: {tags}, fetchMore, refetch, loading, error} = useQuery(query, {variables});
    if (loading) return (<p>Loading...</p>);
    if (error) return (<p>Error !!!</p>);
    var list = tags.edges.map(it => it.node);
    if (keyword) {
        list = list.filter(it => it.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1)
    }
    return <div className={styles.container}>
        <div className={styles.left}>
            <TextField
                label="Filter"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                margin="normal"
                variant="outlined"
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton aria-label="Toggle password visibility" onClick={() => setKeyword('')}>
                                <DeleteIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
            <div className={styles.tag_list}>
                {list.map(it => <div key={it.name} className={styles.tag}><Link to={`/tag/${it.name}`}>{it.name}</Link></div>)}
            </div>
        </div>
        <div className={styles.right}>
            <Route path="/tag/:tag" component={TagArticleListContainer}/>
        </div>
    </div>
};
export default withRouter(Tag);