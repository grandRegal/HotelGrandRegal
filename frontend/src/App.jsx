import {BrowserRouter, Routes, Route} from 'react-router-dom';
// import TrialElement from './components/slideshow/SlideShow.jsx';
import TrialElement from './components/frame/Frame.jsx';

import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import Home from './pages/home/Home';
import { useState } from 'react';
import Dine from './pages/dine/Dine';
import Rooms from './pages/rooms/Rooms';
import Banquet from './pages/banquet/Banquet';
import Contact from './pages/contact/Contact';
// import About from './pages/about/About';
// import Gallery from './pages/gallery/Gallery';
// import Feedback from './pages/feedback/Feedback';
import PageNotFound from './pages/badRequest/PageNotFound';

import BlogCard from './components/blogCard/BlogCard';



import img1 from './assets/demoImages/1.jpeg';
import img2 from './assets/demoImages/2.jpeg';
import img3 from './assets/demoImages/3.jpeg';
import img4 from './assets/demoImages/4.jpeg';
import img5 from './assets/demoImages/5.jpeg';



function App() {  return (
    <BrowserRouter>
      <Navbar />
      <div id = "mainContentDiv">
        <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/test" element={<BlogCard img1 = {img1} img2 = {img2} blog1 = "hi" blog2 = "hello"/>}/>
            <Route path="/dine" element={<Dine />}/>
            <Route path="/rooms" element={<Rooms />}/>
            <Route path="/Banquet-hall" element={<Banquet />}/>
            <Route path="/contact-us" element={<Contact />}/>
            {/*<Route path="/about" element={<About />}/>
            <Route path="/gallery" element={<Gallery />}/>
            <Route path="/feedback" element={<Feedback />}/>*/}
            <Route path="*" element={<PageNotFound />}/>
        </Routes>
      </div>
      {/* <Footer /> */}
    </BrowserRouter>
  );
}

export default App;
