import {BrowserRouter, Routes, Route} from 'react-router-dom' 
import Navbar from './components/Navbar'
// import Home from "./components/Home"
import Dine from "./components/Dine"
import Footer from "./components/Footer"
import PageNotFound from "./components/PageNotFound"

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div id = "mainContentDiv">
        <Routes>
            {/* <Route path="/" element={<Home />}/> */}
            <Route path="/Dine" element={<Dine />}/>
            <Route path="*" element={<PageNotFound />}/>
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
