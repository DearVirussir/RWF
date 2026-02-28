import React from 'react';
import { HeartPulse, GraduationCap, Briefcase, Utensils } from 'lucide-react';
import './KeyInitiatives.css';

const KeyInitiatives = () => {
    const initiatives = [
        {
            title: 'Ramadan Relief',
            description: 'Distributing food RASHAN to hundreds of widows and needy families, especially during the blessed month of Ramadan.',
            icon: <HeartPulse size={40} className="initiative-icon" />
        },
        {
            title: 'Livelihood Support',
            description: 'Empowering needy individuals by starting small businesses and providing tools for self-sufficiency and long-term stability.',
            icon: <Briefcase size={40} className="initiative-icon" />
        },
        {
            title: 'Monthly Food Support',
            description: 'Ensuring that poor families never go hungry by providing consistent monthly grocery supplies directly to their doorsteps.',
            icon: <Utensils size={40} className="initiative-icon" />
        },
        {
            title: 'Education for All',
            description: 'Supporting underprivileged children with scholarships and supplies to ensure access to quality education.',
            icon: <GraduationCap size={40} className="initiative-icon" />
        }
    ];

    return (
        <section id="initiatives" className="py-section">
            <div className="container">
                <h2 className="section-title">Key Initiatives</h2>

                <div className="initiatives-grid">
                    {initiatives.map((item, index) => (
                        <div key={index} className="initiative-card card">
                            <div className="icon-wrapper">
                                {item.icon}
                            </div>
                            <h3 className="initiative-title">{item.title}</h3>
                            <p className="initiative-desc">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default KeyInitiatives;
