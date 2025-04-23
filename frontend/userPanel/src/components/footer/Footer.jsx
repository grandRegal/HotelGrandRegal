import hotelLogo from '../../assets/images/hotelLogo.png';
import style from './Footer.module.css';
import fb from './assets/fb.png';
import insta from './assets/insta.png';
import x from './assets/x.png';
import wp from './assets/wp.png';
import link from './assets/link.png';

export default function Footer() {
    return (
        <footer id={style.footer}>
            <div id={style.footerContent}>
                <div id={style.brand}>
                    <img src={hotelLogo} alt="" />
                    <span>
                        Hotel Grand Regal
                    </span>
                </div>
                <div id={style.address}>
                    <span>88/7B/2A, NEAR EAGLE WAY BRIDGE, KOLHAPUR ROAD, ISLAMPUR, SANGLI-415409, MAHARASHTRA</span>
                    <hr />
                    <div>
                        <img src={fb} alt="" />
                        <img src={insta} alt="" />
                        <img src={x} alt="" />
                        <img src={wp} alt="" />
                    </div>
                    <a href='mailto:hotelgrandregal@gmail.com'>hotelgrandregal@gmail.com</a>
                    <address><a href="918421086416">8421086416</a>   <a href="918421086416">| 023422560000</a></address>
                </div>
                <div style={{display:"flex", flexWrap:"wrap", gap:"3em", justifyContent:"center"}}>
                    <div id={style.quickLinks}>
                        <span>
                            <img src={link} alt="" />
                            <h4>Quick Links</h4>
                        </span>
                        <ul>
                            <li>About Us</li>
                            <li>Blogs</li>
                            <li>Gallery</li>
                            <li>Feedback</li>
                            <li>Enquiry</li>
                        </ul>
                    </div>
                    <div id={style.belives}>
                        <span>
                            <img src={link} alt="" />
                            <h4>Our Belives</h4>
                        </span>
                        <p>
                            Lorem ipsum dolt fugaplaceat exercitationem incidunt molestiae alias, ipsa est dolorum deserunt vero? Harum, debitiam ixime mollitia!
                        </p>
                    </div>
                </div>
            </div>
            <p id={style.copyright}>&copy; 2025 Hotel Grand Regal.  All Rights Reserved.</p>
        </footer>
    );
}