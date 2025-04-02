import SlideShow from "../../components/slideShowCont/SlideShowCont";
import BlogCard from "../../components/blogCard/BlogCard";

import {banquetData} from '../../utils/StaticDataFetcher';
import {getTarrif, getBanquetMenu} from '../../utils/DynamicDataFetcher';

import blog from './blog.module.css';
import tarrifBox from './tarrifBox.module.css';
import { useState } from "react";

import menuStyle from './menuStyle.module.css';

import Popup from '../../components/popup/Popup'

function TarrifBox({tarrif}){
    const [slided, setSlided ]= useState(true);
    const [menuShown, setMenuShown] = useState(null);

    const Menu = ({menu})=>{
        const [selectedCat, setSelectedCat] = useState(0);
        return (
            <div className={menuStyle.container}>
                <ul className={menuStyle.catHolder}>
                    {
                        menu.map((item, index)=>
                            <li className={selectedCat== index ? menuStyle.selected  : ""} onClick={()=>setSelectedCat(index)}>{item.cat}</li>
                        )
                    }
                </ul>
                <div className={menuStyle.menuBox}>
                    <img src={menu[selectedCat].thumbnail} alt="" />
                    <ul>
                        {
                            menu[selectedCat].items.map((item)=>
                                <li>
                                    {item}
                                </li>
                            )
                        }
                    </ul>
                </div>
            </div>
        );
    }

    const TarrifView = ({plan, list})=>{
        return(
            <div style={{height:"max-content", width:"max-content", display:"flex", alignItems:"center"}}>
                 <div className={`${tarrifBox.menuHolder} ${menuShown == null ? " " : menuShown ? tarrifBox.show : tarrifBox.hide}`}>
                    <button className={tarrifBox.showBtn} onClick={()=>setMenuShown(true)}>View Menu</button>
                    <div className={tarrifBox.menuBox}>
                        <button className={tarrifBox.hideBtn} onClick={()=>setMenuShown(false)}>Hide Menu</button>
                        <div className={tarrifBox.content}>
                            <Menu menu = {getBanquetMenu()}/>
                        </div>
                    </div>
                </div>
                <div className={tarrifBox.tarrifView}>
                <h3 className={tarrifBox.header}>
                    {plan} Plan
                </h3>
                <div className={tarrifBox.inclutionBox}>
                {
                    list.map((item)=>
                        <div className={tarrifBox.inclution}>
                            <img src={item.logo} alt="" />
                            <label htmlFor="">{item.label}</label>
                        </div>
                    )
                }
                </div>
            </div>
            </div>
        )
    }

    return (
        <div className={tarrifBox.container}>
            <button className={tarrifBox.controller} onClick={()=>{setSlided((pre)=>!pre); setMenuShown(null)}}>
                <span style={{ color: slided ? "#0c0000" : "white" }}>Veg</span>
                <span style={{ color: slided ? "white" : "#0c0000" }}>Non Veg</span>
                <div className={`${tarrifBox.slider} ${slided ? tarrifBox.right : tarrifBox.left}`}></div>
            </button>
            <div className={tarrifBox.tarrifList}>
                {
                    slided ? 
                    tarrif.veg.map((plans)=>
                        <TarrifView plan = {plans.name} list = {plans.list}/>
                    ):
                    tarrif.nonveg.map((plans)=>
                        <TarrifView plan = {plans.name} list = {plans.list}/>
                    )
                }
            </div>
        </div>
    );
}

export default function (){
    const [popUp, setPopup] = useState(null);
    const [largeImg, setLargeImg] = useState(null);

    const GalleryBox = ({imgs})=>{
        return (
            <div className={blog.galleryBox}>
                {
                    imgs.map((img)=>
                        <img src={img} alt=""/>
                    )
                }
            </div>
        );
    }
    const Blog = ({content}) =>{
        return (
            <div className={blog.container}>
                <p className={blog.overview}>{content.overview}</p>
                <div className={blog.featureBox}>
                    {
                        content.features.map((feature)=>
                            <div className={blog.feature}>
                                <img src={feature.logo} alt="" />
                                <span>{feature.label}</span>
                            </div>
                        )
                    }
                </div>
                <span className={blog.rate}>Rs <span>10000</span> + Catering Charges</span>
                <div className={blog.buttons}>
                    <button className={blog.btn1} onClick={()=>setPopup(<GalleryBox imgs = {content.gallery}/>)}>View Gallery</button>
                    <button className={blog.btn2}>Book Now</button>
                </div>
            </div>
        );
    }
    return (
        <div>
            {popUp ? <Popup component={() => { return popUp }} onClose={() => { setPopup(null) }} /> : ""}
            <SlideShow gallery={banquetData.slideShow.gallery} content={banquetData.slideShow.body} />
            <h1 style={{textAlign:"center", margin:"80px 80px 20px 80px", color:"white", textShadow:"0px 0px 5px black", fontSize:"clamp(20px, 5vw ,30px)"}}>Celebrate With<br/></h1>
            <BlogCard img1 = {banquetData.blogCard.img1} img2 = {banquetData.blogCard.img2} blog1 = {<Blog content = {banquetData.blogCard.blog1}/>} blog2 = {<Blog content = {banquetData.blogCard.blog2}/>}/>
            <h1 style={{textAlign:"center", margin:"80px 80px 20px 80px", color:"white", textShadow:"0px 0px 5px black", fontSize:"clamp(20px, 5vw ,30px)"}}>Our Catering Plans<br/></h1>
            <TarrifBox tarrif={getTarrif()}/>
        </div>
    );
}