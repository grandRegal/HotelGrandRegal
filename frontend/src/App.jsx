import Navbar from './components/Navbar'
import {BrowserRouter, Routes, Route} from 'react-router-dom' 
// import Home from "/components.Home"
import Footer from "./components/Footer"
import PageNotFound from "./components/PageNotFound"

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div id = "mainContentDiv">
        <Routes>
            <Route path="/" element={<h1 >hi</h1>}/>
            <Route path="*" element={<PageNotFound />}/>
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
