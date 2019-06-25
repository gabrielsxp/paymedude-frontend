import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import SignUp from '../components/SignUp';
import SignIn from '../components/SignIn';
import Landing from '../components/Landing';
import Dashboard from '../components/Dashboard';
import Profile from '../components/Profile';
import CreatePost from '../components/CreatePost';
import Content from '../components/Content';
import Creators from '../components/Creators';
import PublicProfile from '../components/PublicProfile';
import Navigation from '../components/Navigation';
import axios from '../axios';
import { connect } from 'react-redux';
import { isAuthenticated, getUserData } from '../services/auth';


const PrivateRoute = ({ component: Component = null, render: Render = null, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            isAuthenticated() ? (
                Render ? (
                    Render(props)
                ) : Component ? (
                    <Component {...props} />
                ) : null
            ) : (
                    <Redirect to={{ pathname: '/signin', state: { from: props.location } }} />
                )
        }
    />
);

class Routes extends React.Component {
    componentWillMount() {
        if(this.props.auth){
            let userData = JSON.parse(getUserData());
            let user = isAuthenticated() ? userData : null;
            axios.get('/me')
            .then((response) => {
                let newUser = response.data.user;
                if(user !== newUser){
                    this.props.userChanged();
                    this.props.saveUser(newUser);
                }
            })
        }
    }
    render() {
        return <Router>
            <Navigation />
            <Switch>
                <Route path="/" exact component={Landing}></Route>
                <Route path="/signup" exact render={props => !isAuthenticated() ? <SignUp {...props}/> : <Redirect to={{ pathname: '/dashboard', state: { from: props.location } }} />}></Route>
                <Route path="/signin" exact render={props => !isAuthenticated() ? <SignIn {...props}/> : <Redirect to={{ pathname: '/dashboard', state: { from: props.location } }} />}></Route>
                <Route path="/creators" exact component={Creators}></Route>
                <Route path="/profile/:user" exact component={PublicProfile}></Route>
                <PrivateRoute path="/account/:username" exact component={Profile}></PrivateRoute>
                <PrivateRoute path="/posts/new" exact component={CreatePost}></PrivateRoute>
                <PrivateRoute path="/dashboard" exact component={Dashboard}></PrivateRoute>
                <PrivateRoute path="/main" exact component={Content}></PrivateRoute>
            </Switch>
        </Router>
    }
}

const mapStateToProps = state => ({
    user: state.user,
    auth: state.auth,
    userChanged: state.userChanged
});

const mapDispatchToProps = dispatch => {
    return {
        saveUser: user => dispatch({ type: 'SAVE_USER', user }),
        userChanged: () => dispatch({ type: 'USER_CHANGED' })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Routes);