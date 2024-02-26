import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from "@vercel/analytics/react"


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Analytics/>
    <SpeedInsights/>
    <App/>
  </React.StrictMode>
)
