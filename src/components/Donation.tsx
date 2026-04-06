'use client';

import React, { useState } from 'react';
import { Download, Copy, Check } from 'lucide-react';
import './Donation.css';

const Donation = () => {
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const bankDetails = [
        { label: 'Bank Name', value: 'United Bank Limited (UBL)', field: 'bank' },
        { label: 'Account Title', value: 'Zafar Ali', field: 'title' },
        { label: 'Account Number', value: '0002 3369 3042', field: 'account' },
        { label: 'IBAN', value: 'PK89 UNIL 0109 0002 3369 3042', field: 'iban' },
        { label: 'Branch Code', value: '0109', field: 'branch' },
    ];

    const handleCopy = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

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
                                    <li>
                                        Enter the mobile number:{' '}
                                        <span className="highlight-number inline-flex items-center gap-1">
                                            03405454966
                                            <button
                                                onClick={() => handleCopy('03405454966', 'easypaisa-1')}
                                                className="copy-btn flex items-center"
                                                title="Copy Mobile Number"
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-green)', padding: '0 0.2rem' }}
                                            >
                                                {copiedField === 'easypaisa-1' ? <Check size={16} /> : <Copy size={16} />}
                                            </button>
                                        </span>
                                    </li>
                                    <li>Enter the amount you wish to donate.</li>
                                    <li>Confirm the transaction.</li>
                                </ol>

                                <div className="account-details-box mt-2">
                                    <p className="label">EasyPaisa Account Number</p>
                                    <div className="flex items-center gap-1">
                                        <p className="value highlight-number" style={{ margin: 0 }}>0340-5454966</p>
                                        <button
                                            onClick={() => handleCopy('03405454966', 'easypaisa-2')}
                                            className="copy-btn flex items-center"
                                            title="Copy Account Number"
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-green)', padding: '0.2rem' }}
                                        >
                                            {copiedField === 'easypaisa-2' ? <Check size={16} /> : <Copy size={16} />}
                                        </button>
                                    </div>
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
                            {bankDetails.map((detail) => (
                                <div className="detail-row flex justify-between items-center mb-1" key={detail.field} style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '0.4rem' }}>
                                    <span className="label font-semibold">{detail.label}:</span>
                                    <div className="value-group flex items-center gap-1">
                                        <span className="value">{detail.value}</span>
                                        <button
                                            onClick={() => handleCopy(detail.value, detail.field)}
                                            className="copy-btn flex items-center"
                                            title={`Copy ${detail.label}`}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-green)', padding: '0.2rem' }}
                                        >
                                            {copiedField === detail.field ? <Check size={16} /> : <Copy size={16} />}
                                        </button>
                                    </div>
                                </div>
                            ))}
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
