'use client';

import React from 'react';
import { Download } from 'lucide-react';
import './Donation.css';

const Donation = () => {
    const qrCodeUrl = 'https://i.ibb.co/TBFWVHq1/Whats-App-Image-2026-02-28-at-11-10-12-AM.jpg';

    const handleDownloadQR = async () => {
        try {
            // Fetch the image to trigger a true download rather than navigation
            const response = await fetch(qrCodeUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'Rustam-Welfare-Foundation-EasyPaisa-QR.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to download image', error);
            // Fallback: open in new tab
            window.open(qrCodeUrl, '_blank');
        }
    };

    return (
        <section id="donate" className="py-section">
            <div className="container">
                <h2 className="section-title">Support Our Cause</h2>
                <p className="text-center text-gray mb-2" style={{ maxWidth: '800px', margin: '0 auto 3rem auto' }}>
                    Your generous contributions are the lifeline of our operations. They allow us to execute our programs and reach the most vulnerable segments of our society. Every donation, regardless of size, makes a tangible impact.
                </p>

                <div className="donation-grid">
                    {/* Left Column: EasyPaisa */}
                    <div className="donation-card outline-card flex flex-col">
                        <h3 className="donation-method-title text-green">Donate via EasyPaisa</h3>

                        <div className="easypaisa-content flex justify-between gap-2">
                            <div className="instructions-side">
                                <ol className="donation-steps">
                                    <li>Log in to your EasyPaisa app or dial *786#.</li>
                                    <li>Select "Send Money".</li>
                                    <li>Enter the mobile number: <span className="highlight-number">03405454966</span></li>
                                    <li>Enter the amount you wish to donate.</li>
                                    <li>Confirm the transaction.</li>
                                </ol>

                                <div className="account-details-box mt-2">
                                    <p className="label">EasyPaisa Account Number</p>
                                    <p className="value highlight-number">0340-5454966</p>
                                </div>
                            </div>

                            <div className="qr-side flex flex-col items-center">
                                <div className="qr-image-wrapper mb-1">
                                    <img
                                        src={qrCodeUrl}
                                        alt="EasyPaisa QR Code"
                                        className="qr-code-img"
                                        crossOrigin="anonymous"
                                    />
                                </div>
                                <button
                                    onClick={handleDownloadQR}
                                    className="btn-primary w-full flex justify-center items-center gap-1"
                                >
                                    <Download size={18} /> Download QR Code
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Bank Transfer */}
                    <div className="donation-card outline-card">
                        <h3 className="donation-method-title text-green">Direct Bank Transfer</h3>

                        <div className="bank-details mt-2">
                            <div className="detail-row">
                                <span className="label">Bank Name:</span>
                                <span className="value">XYZ Bank (Placeholder)</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Account Title:</span>
                                <span className="value">Rustam Welfare Foundation</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Account Number:</span>
                                <span className="value">1234-5678-9012-3456</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">IBAN:</span>
                                <span className="value">PK30 XYZB 1234 5678 9012 3456</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Branch Code:</span>
                                <span className="value">1234</span>
                            </div>
                        </div>

                        <div className="receipt-note mt-2">
                            <p>
                                <strong>Note:</strong> After making a bank transfer, please email a screenshot of the receipt or transaction ID to <a href="mailto:zafarali030098@gmail.com" className="text-green font-semibold">zafarali030098@gmail.com</a> along with your name so we can acknowledge your contribution.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Transparency Pledge */}
                <div className="transparency-pledge mt-2">
                    <h3>Our Transparency Pledge</h3>
                    <p>
                        Trust is the foundation of our relationship with donors. We guarantee that 100% of your donations are allocated efficiently towards our chosen causes. We maintain rigorous accounting standards and regularly publish reports on how funds are utilized.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Donation;
