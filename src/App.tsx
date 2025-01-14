
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import DemoBook from "./pages/Home"


const App = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Home/>}/> */}
        <Route path="/" element={<DemoBook/>}/>
      </Routes>
    </Router>
  )
}

export default App
