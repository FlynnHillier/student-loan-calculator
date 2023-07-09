import React from 'react'
import '../styles/home.css'
import InputInterface from '../components/InputInterface'
import GraphDisplay from '../components/GraphDisplay'

const Home = () => {
  return (
    <div className="home view">
        <GraphDisplay/>
        <InputInterface/>
    </div>
  )
}

export default Home