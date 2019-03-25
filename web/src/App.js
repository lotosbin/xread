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
import {ApolloProvider as ApolloHooksProvider} from 'react-apollo-hooks';
import AppBar from './components/AppBar'

class App extends Component {
    render() {
        return (
            <ApolloProvider client={client}>
                <ApolloHooksProvider client={client}>
                    <Router>
                        <div className="App">
                            <AppBar/>
                            <Route exact path="/" component={Home}/>
                            <Route path="/article" component={Home}/>
                            <Route path="/article/all" component={Home}/>
                            <Route path="/feed" component={Feed}/>
                            <Route path="/tag" component={Tag}/>
                            <Route path="/topic" component={Topic}/>
                            <Route path="/store" component={Store}/>
                        </div>
                    </Router>
                </ApolloHooksProvider>
            </ApolloProvider>
        );
    }
}


export default App;
