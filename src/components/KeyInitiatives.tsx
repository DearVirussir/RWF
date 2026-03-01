import React from 'react';
import { HeartPulse, GraduationCap, Briefcase, Utensils, Star, ShoppingBag, Truck, Stethoscope } from 'lucide-react';
import './KeyInitiatives.css';

const KeyInitiatives = () => {
    const initiatives = [
        {
            title: 'Small Business Stalls',
            description: 'We have already provided over 100 fully renovated and stocked stalls to deserving people, helping them earn a respectable living.',
            icon: <Star size={40} className="initiative-icon" />
        },
        {
            title: 'Widow Empowerment',
            description: 'Providing high-quality sewing machines to widows and needy women to help them start their own tailoring work from home.',
            icon: <ShoppingBag size={40} className="initiative-icon" />
        },
        {
            title: 'Financial Grants',
            description: 'Interest-free small grants for poor families to start micro-businesses, giving them a ladder out of poverty.',
            icon: <Briefcase size={40} className="initiative-icon" />
        },
        {
            title: 'Ramadan Packages',
            description: 'Distributing food RASHAN to hundreds of widows and needy families, especially during the blessed month of Ramadan.',
            icon: <HeartPulse size={40} className="initiative-icon" />
        },
        {
            title: 'Monthly Ration',
            description: 'Ensuring that poor families never go hungry by providing consistent monthly grocery supplies directly to their doorsteps.',
            icon: <Utensils size={40} className="initiative-icon" />
        },
        {
            title: 'Transport Support',
            description: 'Assisting breadwinners with Rickshaw repairs or providing cycle-stalls to ensure their daily income continues.',
            icon: <Truck size={40} className="initiative-icon" />
        },
        {
            title: 'Emergency Medical',
            description: 'Covering costs of critical surgeries and expensive life-saving medicines for those who cannot afford them.',
            icon: <Stethoscope size={40} className="initiative-icon" />
        },
        {
            title: 'Education Help',
            description: 'Supporting underprivileged children with fees, uniforms, and stationary to prevent them from dropping out of school.',
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
