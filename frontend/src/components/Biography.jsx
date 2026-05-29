import React from "react";

const Biography = ({ imageUrl }) => {
  return (
    <>
      <div className="container biography">
        <div className="banner">
          <img src={imageUrl} alt="about us" />
        </div>
        <div className="banner">
          <p>Biography</p>
          <h3>Who We Are</h3>
          
          <p>
            Welcome to ZeeCare Medical Institute, where compassionate care meets 
            cutting-edge technology. Established with a vision to provide 
            world-class healthcare, our institute has grown into a trusted 
            sanctuary for healing and wellness. 
          </p>
          <p>We are dedicated to excellence in patient care.</p>
          <p>Pioneering medical research and innovative treatments.</p>
          <p>
            Our dedicated team of specialized doctors, experienced nurses, and 
            compassionate support staff work tirelessly round the clock to ensure 
            your well-being. From advanced surgical procedures to comprehensive 
            rehabilitation programs, ZeeCare is equipped with state-of-the-art 
            facilities to address a wide spectrum of medical needs.
          </p>
          <p>Your health is our ultimate priority.</p>
          <p>Thank you for trusting ZeeCare!</p>
        </div>
      </div>
    </>
  );
};

export default Biography;