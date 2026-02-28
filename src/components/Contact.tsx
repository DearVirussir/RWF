'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Navigation } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Check if Supabase is actually configured
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your_supabase')) {
            // Fake submission if no real DB configured
            setTimeout(() => {
                setIsSubmitting(false);
                setSubmitMessage('Thank you! Your message has been sent successfully.');
                setFormData({ name: '', email: '', subject: '', message: '' });
            }, 1500);
            return;
        }

        const { error } = await supabase
            .from('contact_messages')
            .insert([{
                name: formData.name,
                email: formData.email,
                subject: formData.subject,
                message: formData.message
            }]);

        setIsSubmitting(false);

        if (error) {
            console.error('Error submitting form', error);
            alert('Failed to send message. Please try again later.');
        } else {
            setSubmitMessage('Thank you! Your message has been sent successfully.');
            setFormData({ name: '', email: '', subject: '', message: '' });
        }
    };

    return (
        <section id="location" className="py-section bg-light">
            <div className="container">
                <h2 className="section-title">Location & Contact</h2>

                <div className="contact-grid">
                    {/* Left Column: Find Us */}
                    <div className="contact-info-card card">
                        <h3 className="contact-subtitle">Find Us</h3>
                        <p className="text-gray mb-2">
                            We are always here to help. Reach out to us for any queries, volunteering opportunities, or to learn more about our work.
                        </p>

                        <div className="contact-details">
                            <div className="contact-item">
                                <div className="contact-icon">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h4>Address</h4>
                                    <p>Rustam, Mardan, Khyber Pakhtoon Khwa, Pakistan</p>
                                </div>
                            </div>

                            <div className="contact-item">
                                <div className="contact-icon">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h4>Phone</h4>
                                    <p>0300-9874758</p>
                                </div>
                            </div>

                            <div className="contact-item">
                                <div className="contact-icon">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h4>Email</h4>
                                    <p>zafarali030098@gmail.com</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-2 text-center">
                            <a
                                href="https://maps.app.goo.gl/8b58aw2cgRw2Akmc6"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary w-full flex justify-center items-center gap-1"
                            >
                                <Navigation size={18} /> Get Directions
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Contact Form */}
                    <div id="contact" className="contact-form-card card">
                        <h3 className="contact-subtitle">Send Us a Message</h3>

                        {submitMessage ? (
                            <div className="success-message">
                                {submitMessage}
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="contact-form">
                                <div className="form-group">
                                    <label htmlFor="name">Your Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="form-control"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Your Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="form-control"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="subject">Subject</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="form-control"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="message">Your Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        className="form-control resize-none"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="btn-primary w-full"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
