import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate, } from 'react-router-dom'
import axios from "axios"

import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'


const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'


export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => {
    /* ✨ implement */
    navigate("/")
  }
  const redirectToArticles = () => { /* ✨ implement */
    navigate("/articles")
  }

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token")
      // and a message saying "Goodbye!" should be set in its proper state.
      setMessage("Goodbye!")
      // In any case, we should redirect the browser back to the login screen,
      // using the helper above.
      redirectToLogin()
    }
  }

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    setMessage('')
    setSpinnerOn(true)

    /*
    console.log("username: ", username)
    console.log("password: ", password)
    */

    // and launch a request to the proper endpoint.
    axios.post(loginUrl, {
      username: username,
      password: password
    })
      .then(data => {
        // On success, we should set the token to local storage in a 'token' key,
        // put the server success message in its proper state, and redirect
        // to the Articles screen. Don't forget to turn off the spinner!

        //    console.log("LOGIN SUCCESS: ", data)
        localStorage.setItem("token", data.data.token)
        setMessage(data.data.message)
        setSpinnerOn(false)
        redirectToArticles()
      })
      .catch(err => {
        //       console.log("LOGIN EERROR: ", err)
        setMessage(err.message)
        setSpinnerOn(false)
        redirectToLogin()
      })
  }

  const getArticles = (msg) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    setMessage("")
    setSpinnerOn(true)
    // and launch an authenticated request to the proper endpoint.
    const token = localStorage.getItem("token")
    axios.get("http://localhost:9000/api/articles", {
      headers: {
        authorization: token
      }
    })
      .then(res => {
        // On success, we should set the articles in their proper state and
        // put the server success message in its proper state.
        //   console.log("Article Fetch SUCCESS: ", res)
        if (msg === undefined) {
          setMessage(res.data.message)
        } else {
          setMessage(msg)
        }
        setArticles(res.data.articles)
      })
      .catch(err => {
        // If something goes wrong, check the status of the response:
        // if it's a 401 the token might have gone bad, and we should redirect to login.
        // Don't forget to turn off the spinner!
        console.log("Article Fetch FAILED: ", err)
        setMessage(err.message)

        if (err.response.status.toString() == "401") {
          redirectToLogin()
        }
      })

    setSpinnerOn(false)
  }



  const postArticle = article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    setMessage("")
    setSpinnerOn(true)
    //console.log(article)

    const token = localStorage.getItem("token")
    //console.log(token)

    axios.post(articlesUrl, article, {
      headers: {
        authorization: token
      }
    })
      .then(res => {
        //  console.log("Post Article SUCCESS: ", res)
        setMessage(res.data.message)
        setSpinnerOn(false)
        getArticles(res.data.message)
      })
      .catch(err => {
        setMessage(err.response.message)
        // console.log("Post Article FAILED: ", err.message)
        setSpinnerOn(false)
      })

  }

  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    // You got this!
    setMessage("")
    setSpinnerOn(true)
    const token = localStorage.getItem("token")

    axios.put(`http://localhost:9000/api/articles/${article_id}`, article, {
      headers: {
        authorization: token
      }
    })
      .then(res => {
        //   console.log("Update Article SUCCESS: ", res)
        setMessage(res.data.message)
        setSpinnerOn(false)
        getArticles(res.data.message)
      })
      .catch(err => {
        //  console.log("Update Article FAILED: ", err.response.message)
        setMessage(err.response.message)
        setSpinnerOn(false)
      })
  }

  const deleteArticle = article_id => {
    // ✨ implement
    setMessage("")
    setSpinnerOn(true)

    const token = localStorage.getItem("token")
    // console.log(article_id)

    axios.delete(`http://localhost:9000/api/articles/${article_id}`, {
      headers: {
        authorization: token,
      }
    })
      .then(res => {
        setMessage(res.data.message)
        // console.log("Delete Article SUCCESS: ", res)
        setSpinnerOn(false)
        getArticles(res.data.message)

      })
      .catch(err => {
        // console.log(err)
        setMessage(err.response.message)
        //  console.log("Delete Article FAILED: ", err)
        setSpinnerOn(false)
      })

  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>

        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route exact path="articles"
            element={
              <>

                <ArticleForm
                  navigate={redirectToLogin}
                  currentArticle={currentArticleId}
                  postArticle={postArticle}
                  updateArticle={updateArticle}
                  setCurrentArticleId={setCurrentArticleId}
                />

                <Articles
                  navigate={redirectToLogin} getArticles={getArticles}
                  articles={articles}
                  currentArticleId={currentArticleId}
                  deleteArticle={deleteArticle}
                  setCurrentArticleId={setCurrentArticleId}
                />
              </>
            } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
