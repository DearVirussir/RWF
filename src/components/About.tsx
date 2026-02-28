import React from 'react';
import './About.css';

const About = () => {
    return (
        <section id="about" className="py-section bg-light">
            <div className="container">
                <h2 className="section-title">About Us</h2>

                <div className="about-grid">
                    <div className="about-text-content">
                        <h3 className="section-subtitle">Our Mission</h3>
                        <p>
                            Rustam Welfare Foundation is dedicated to empowering the most vulnerable members of our society through education, healthcare, and emergency relief programs. We believe that collective community action has the power to break the cycle of poverty and bring sustainable, long-term change to those who need it most.
                        </p>
                        <p>
                            From providing clean drinking water to remote villages, to funding the education of deserving students who otherwise couldn't afford schooling, our focus remains on creating tangible, positive impacts in Khyber Pakhtoon Khwa and beyond.
                        </p>

                        <div className="founder-card card mt-2">
                            <div className="quote-mark">"</div>
                            <p className="founder-quote">
                                It is our moral and social duty to extend a helping hand to those in need. At Rustam Welfare Foundation, every effort is guided by this principle. We are committed to transparency and impactful work, and we thank our supporters for joining us on this journey of hope and service.
                            </p>
                            <div className="founder-info">
                                <div className="founder-details">
                                    <h4>Engr. Zafar Sabat Khiel</h4>
                                    <span className="founder-title">Founder</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="about-image-wrapper">
                        <img
                            src="https://i.ibb.co/LD9zWTFz/Whats-App-Image-2026-01-13-at-2-41-53-PM.jpg"
                            alt="Engr. Zafar Sabat Khiel"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
