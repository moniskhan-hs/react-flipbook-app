
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import DemoBook from "./pages/Demo"
import Home from "./pages/Home"


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/demo" element={<DemoBook/>}/>
      </Routes>
    </Router>
  )
}

export default App
