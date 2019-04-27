import React from 'react';
import './App.css';
import {ApolloProvider} from "react-apollo";
import client from './apollo/client';
import {HashRouter as Router, Route} from "react-router-dom";
import Home from "./Home";
import Feed from "./Feed";
import Tag from "./Tag";
import Topic from "./Topic";
import {ApolloProvider as ApolloHooksProvider} from 'react-apollo-hooks';
import AppBar from './components/AppBar'
import {Advice} from "./components/Advice";

function App() {
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
                        <Advice/>
                    </div>
                </Router>
            </ApolloHooksProvider>
        </ApolloProvider>
    );
}


export default App;
