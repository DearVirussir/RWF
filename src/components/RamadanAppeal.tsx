'use client';

import React from 'react';
import './RamadanAppeal.css';
import { ShoppingBag, Utensils, Heart } from 'lucide-react';

const RamadanAppeal = () => {
    return (
        <section id="ramadan-appeal" className="ramadan-appeal-section py-section reveal">
            <div className="container">
                <div className="appeal-card glass animate-fade-in">
                    <div className="appeal-badge">Special Ramadan Appeal 2026</div>
                    
                    <div className="appeal-grid">
                        <div className="appeal-content">
                            <h2 className="appeal-title">Give Hope This Ramadan</h2>
                            <p className="appeal-description">
                                "The best charity is that given in Ramadan." Join us in our mission to bring joy and relief to those who need it most during this blessed month.
                            </p>
                            
                            <div className="appeal-stats">
                                <div className="appeal-stat-item">
                                    <div className="stat-icon"><ShoppingBag size={24} /></div>
                                    <div className="stat-info">
                                        <h4>Eid Shopping for 600+ Orphans</h4>
                                        <p>Goal: 2,000,000 PKR | Currently: 200,000 PKR</p>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: '10%' }}></div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="appeal-stat-item">
                                    <div className="stat-icon"><Utensils size={24} /></div>
                                    <div className="stat-info">
                                        <h4>Rashan Distribution</h4>
                                        <p>Target: 900+ Widows & Needy Families</p>
                                        <p className="status-note">Phase 1 Complete (7th Ramadan) | Phase 2 Upcoming (15th Ramadan)</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="appeal-footer">
                                <a href="#donate" className="btn-primary">
                                    <Heart size={18} className="mr-2" /> Donate to Ramadan Appeal
                                </a>
                            </div>
                        </div>
                        
                        <div className="appeal-visual">
                            <div className="visual-wrapper">
                                <img 
                                    src="https://i.ibb.co/QjDjVVZN/ramadan.jpg" 
                                    alt="Ramadan Charity" 
                                    className="appeal-img"
                                />
                                <div className="visual-overlay">
                                    <div className="overlay-text">
                                        <span>Targeting 900+ Widows</span>
                                        <span>Eid Clothes for 600+ Orphans</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RamadanAppeal;
