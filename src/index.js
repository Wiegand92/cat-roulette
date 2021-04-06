import React from 'react'
import reactDOM from 'react-dom'
import 'core-js/features/promise'
import 'regenerator-runtime/runtime'
import './styles/styles.scss'

import MainPage from './Components/MainPage'


const template = <MainPage />

reactDOM.render(template, document.getElementById('app'))