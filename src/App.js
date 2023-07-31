import React from 'react'
import { useState,useEffect } from 'react'
import { BrowserRouter, Route,Switch, useHistory } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import StartPage from './pages/StartPage'
import Admin from './pages/Admin'
import Game from './components/Game'
import jwt from 'jsonwebtoken'
import PrivateRoute from './components/PrivateRoute'

const App = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [isAdmin, setIsAdmin] = useState(false);

	const history = useHistory()

	useEffect(() => {
		const token = localStorage.getItem('token')
		if (token) {
			const user = jwt.decode(token)
			if (!user) {
				localStorage.removeItem('token')
				history.replace('/signin')
			} else {
					setIsAuthenticated(true)
					if (localStorage.getItem("isAdmin") === "true"){
						setIsAdmin(true);
					}
            // setIsAdmin(localStorage.getItem("isAdmin") === "true");
        console.log("user detail----------------------",user)
			}
		}
	}, [])
console.log("isAuthenticated",isAuthenticated)
	
	return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={StartPage} />
          <Route path="/login" exact component={Login} />
          <Route path="/register" exact component={Register} />

          {isAdmin ? (
            // Admin Route
            <PrivateRoute
              path="/admin"
              component={Admin}
              isAuthenticated={isAuthenticated}
            />
          ) : (
            // Regular User Route
            <PrivateRoute
              path="/game"
              component={Game}
              isAuthenticated={isAuthenticated}
            />
          )}

          <PrivateRoute
            path="/game"
            component={Game}
            isAuthenticated={isAuthenticated}
          />

          {/* <Route path="/dashboard" exact component={Dashboard}
				// element={
        //       <Protected isSignedIn={isSignedIn}>
        //         <Dashboard />
        //       </Protected>
        //     } 
						/> */}
          {/* <Route path="/game" exact component={Game}
				// element={
        //       <Protected isSignedIn={isSignedIn}>
        //         <Game />
        //       </Protected>
        //     } 
						/> */}

          {/* {isSignedIn ? (
          <div className="d-grid mt-5">
            <button className="btn-danger" onClick={signout}>
              Sign out
            </button>
          </div>
        ) : (
          <div className="d-grid mt-5">
            <button className="btn-dark" onClick={signin}>
              Sign in
            </button>
          </div>
        )} */}
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App