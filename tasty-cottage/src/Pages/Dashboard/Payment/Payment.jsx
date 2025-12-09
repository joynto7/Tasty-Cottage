import React, { useState } from 'react';
import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import MobileBankingForm from './MobileBankingForm';


const stripePromise = loadStripe(import.meta.env.VITE_PAYMENT_GATEWAY_PK);

const Payment = () => {
    const [selectedMethod, setSelectedMethod] = useState('');

    const paymentMethods = [
        {
            id: 'stripe',
            name: 'Credit/Debit Card',
            description: 'Pay with Visa, Mastercard, or American Express',
            icon: '💳',
            color: 'bg-blue-50 border-blue-200 hover:border-blue-400'
        },
        {
            id: 'bkash',
            name: 'bKash',
            description: 'Pay with your bKash mobile wallet',
            icon: '💸',
            color: 'bg-pink-50 border-pink-200 hover:border-pink-400'
        },
        {
            id: 'nagad',
            name: 'Nagad',
            description: 'Pay with your Nagad mobile wallet',
            icon: '📨',
            color: 'bg-orange-50 border-orange-200 hover:border-orange-400'
        },
        {
            id: 'rocket',
            name: 'Rocket',
            description: 'Pay with your Rocket mobile wallet',
            icon: '🚀',
            color: 'bg-purple-50 border-purple-200 hover:border-purple-400'
        },
        {
            id: 'sslcommerz',
            name: 'SSLCommerz',
            description: 'Pay with Cards, Mobile Banking, or Net Banking',
            icon: '🏦',
            color: 'bg-gray-50 border-gray-200 hover:border-gray-400'
        }
    ];


    return (
        <div>
            <SectionTitle heading="Payment" subHeading="Choose your payment method" />

            <div className="p-8 max-w-6xl mx-auto">
                {!selectedMethod ? (
                    
                    <div>
                        <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
                            Select Payment Method
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {paymentMethods.map((method) => {
                                return (
                                    <div
                                        key={method.id}
                                        onClick={() => setSelectedMethod(method.id)}
                                        className={`${method.color} border-2 rounded-lg p-6 cursor-pointer 
                                                  transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex-shrink-0 text-4xl">
                                                {method.icon}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-xl font-bold text-gray-800">{method.name}</h4>
                                                <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                                            </div>
                                            <div className="text-2xl text-gray-400">→</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    
                    <div>
                        <button
                            onClick={() => setSelectedMethod('')}
                            className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 
                                     font-semibold transition-colors"
                        >
                            ← Back to payment methods
                        </button>

                        {selectedMethod === 'stripe' ? (
                            <Elements stripe={stripePromise}>
                                <CheckoutForm paymentMethod="stripe" />
                            </Elements>
                        ) : (
                            <MobileBankingForm paymentMethod={selectedMethod} />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Payment;
