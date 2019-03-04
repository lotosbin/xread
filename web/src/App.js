import React, {Component} from 'react';
import './App.css';
import {ApolloProvider} from "react-apollo";
import client from './apollo/client';
import {HashRouter as Router, Route, Link, Redirect} from "react-router-dom";
import Home from "./Home";
import Feed from "./Feed";
import styles from "./App.module.css";
import Tag from "./Tag";
import Store from "./Store";
import Topic from "./Topic";

class App extends Component {
    render() {
        return (
            <ApolloProvider client={client}>
                <Router>
                    <div className="App">
                        <div className={styles.nav}>
                            <div className={styles.nav_item}><Link to="/article">Home</Link></div>
                            <div className={styles.nav_item}><Link to="/feed">Feed</Link></div>
                            <div className={styles.nav_item}><Link to="/topic">Topic</Link></div>
                            <div className={styles.nav_item}><Link to="/tag">Tag</Link></div>
                            <div className={styles.nav_item}><Link to="/store">Store</Link></div>
                        </div>
                        <Route exact path="/" component={Home}/>
                        <Route path="/article" component={Home}/>
                        <Route path="/feed" component={Feed}/>
                        <Route path="/tag" component={Tag}/>
                        <Route path="/topic" component={Topic}/>
                        <Route path="/store" component={Store}/>
                    </div>
                </Router>
            </ApolloProvider>
        );
    }
}


export default App;
