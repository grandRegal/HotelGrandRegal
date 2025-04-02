import style from './Contact.module.css';
import { useState } from "react";

import fb from './assets/fb.png';
import insta from './assets/insta.png';
import x from './assets/x.png';
import wp from './assets/wp.png';

function FAQ() {
  return (
    <div className={style.faqContainer}>
      <h1>Frequently Asked Question</h1>
      <div>
        <details>
          <summary>Is Hotel Clean ?</summary>
          <p>Definately Not Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut vero fugiat, libero nobis, iure non consectetur veritatis numquam molestias laborum dolore, repellendus tempora sequi ea.</p>
        </details>
        <details>
          <summary>Is Hotel Clean ?</summary>
          <p>Definately Not Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut vero fugiat, libero nobis, iure non consectetur veritatis numquam molestias laborum dolore, repellendus tempora sequi ea.</p>
        </details>
        <details>
          <summary>Is Hotel Clean ?</summary>
          <p>Definately Not Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut vero fugiat, libero nobis, iure non consectetur veritatis numquam molestias laborum dolore, repellendus tempora sequi ea.</p>
        </details>
        <details>
          <summary>Is Hotel Clean ?</summary>
          <p>Definately Not Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut vero fugiat, libero nobis, iure non consectetur veritatis numquam molestias laborum dolore, repellendus tempora sequi ea.</p>
        </details>
        <details>
          <summary>Is Hotel Clean ?</summary>
          <p>Definately Not Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut vero fugiat, libero nobis, iure non consectetur veritatis numquam molestias laborum dolore, repellendus tempora sequi ea.</p>
        </details>
        <details>
          <summary>Is Hotel Clean ?</summary>
          <p>Definately Not Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut vero fugiat, libero nobis, iure non consectetur veritatis numquam molestias laborum dolore, repellendus tempora sequi ea.</p>
        </details>

      </div>
    </div>
  );
}

function ContactDetails() {
  return (
    <div className={style.super}>
      <h1 className={style.header}>Contact Us</h1>
      <div className={style.contactContainer}>
        <iframe
          className={style.mapBox}
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3814.539804686025!2d74.2528906742846!3d17.046228612545356!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc1c1d4e3a71047%3A0x2f476f0ce7761473!2sGrand%20Regal!5e0!3m2!1sen!2sin!4v1741021812475!5m2!1sen!2sin"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade">
        </iframe>
        <div className={style.addressHolder}>
          <div className={style.address}>
            <span>88/7B/2A, NEAR EAGLE WAY BRIDGE, KOLHAPUR ROAD, ISLAMPUR, SANGLI-415409, MAHARASHTRA</span>
            <hr />
            <div className={style.sMedia}>
              <a href=''><img src={fb} alt="" /></a>
              <a href=''><img src={insta} alt="" /></a>
              <a href=''><img src={x} alt="" /></a>
              <a href=''><img src={wp} alt="" /></a>
            </div>
            <a href='mailto:hotelgrandregal@gmail.com'>hotelgrandregal@gmail.com</a>
            <span className={style.mob}><a href="918421086416">8421086416</a>   <a href="918421086416">| 023422560000</a></span>
          </div>
        </div>
      </div>
    </div>
  );
}

function EnquiryForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    enquiryReason: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Enquiry Submitted:", formData);
  };

  return (
    <form className={style.form} onSubmit={handleSubmit}>
          <h1>Enquiry Form</h1>
          <div className={style.groupHolder}>
            <div className={style.formGroup}>
              <label>First Name:</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
            </div>

            <div className={style.formGroup}>
              <label>Last Name:</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>
          </div>

          <div className={style.groupHolder}>
            <div className={style.formGroup}>
              <label>Mobile Number:</label>
              <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required />
            </div>

            <div className={style.formGroup}>
              <label>Email:</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
          </div>

          <div className={style.formGroup}>
            <label>Enquiry Reason:</label>
            <select name="enquiryReason" value={formData.enquiryReason} onChange={handleChange} required>
              <option value="">Select a reason</option>
              <option value="General Query">General Query</option>
              <option value="Support">Support</option>
              <option value="Feedback">Feedback</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className={style.formGroup}>
            <label>Enquiry Message:</label>
            <textarea name="message" value={formData.message} onChange={handleChange} required rows={5} />
          </div>

          <button type="submit" className={style.submitButton}>Submit</button>
        </form>
  );
};

export default function () {
  return (
    <div className={style.parent}>
      <FAQ />
      <ContactDetails />
      <EnquiryForm />
    </div>
  );
}