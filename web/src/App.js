import React, {Component} from 'react';
import './App.css';
import {ApolloProvider} from "react-apollo";
import client from './apollo/client';
import {HashRouter as Router, Route, Link} from "react-router-dom";
import Home from "./Home";
import Feed from "./Feed";
import styles from "./App.module.css";

class App extends Component {
    render() {
        return (
            <ApolloProvider client={client}>
                <Router>
                    <div className="App">
                        <div className={styles.nav}>
                            <div className={styles.nav_item}><Link to="/">Home</Link></div>
                            <div className={styles.nav_item}><Link to="/feed">Feed</Link></div>
                        </div>
                        <Route exact path="/" component={Home}/>
                        <Route path="/feed" component={Feed}/>
                    </div>
                </Router>
            </ApolloProvider>
        );
    }
}


export default App;
