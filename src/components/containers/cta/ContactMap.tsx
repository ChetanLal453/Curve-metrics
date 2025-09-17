import React from "react";

const ContactMap = () => {
  return (
    <div className="google__map-area pt-120">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24122.08247991234!2d79.073929!3d21.145800!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4c5e4c1e8f8a3%3A0x58b7d1e963d8b28a!2sNagpur%2C%20Maharashtra%2C%20India!5e0!3m2!1sen!2sin!4v1694950000000!5m2!1sen!2sin"
        width="100%"
        height="450"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Nagpur Map"
      ></iframe>
    </div>
  );
};

export default ContactMap;
