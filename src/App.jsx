import React from "react"
import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import About from './pages/About'
import Profile from './pages/Profile'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Header from "./components/Header"
import Privateroute from "./components/Privateroute"
import CreateList from "./pages/CreateList"
import Details from "./pages/Details"
import Search from "./pages/Search"

function App() {

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/search" element={<Search/>}/>
        <Route element={<Privateroute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateList />} />
        </Route>
        <Route path="/listing/:id" element={<Details/>}/>
        <Route path="*" element={<h1>page not found</h1>} />
      </Routes>
    </>
  )
}

export default App
