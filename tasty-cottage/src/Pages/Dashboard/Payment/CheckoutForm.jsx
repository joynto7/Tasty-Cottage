import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useCart from "../../../hooks/useCart";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const CheckoutForm = ({ paymentMethod = 'stripe' }) => {
    const [error, setError] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [processing, setProcessing] = useState(false);
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const [cart, refetch] = useCart();
    const navigate = useNavigate();

    const totalPrice = cart.reduce((total, item) => total + item.price, 0);

    useEffect(() => {
        if (totalPrice > 0) {
            axiosSecure.post('/create-payment-intent', {
                price: totalPrice,
                paymentMethod: paymentMethod
            })
                .then(res => {
                    console.log(res.data);
                    if (res.data.clientSecret) {
                        setClientSecret(res.data.clientSecret);
                    }
                })
                .catch(error => {
                    console.error('Error creating payment intent:', error);
                    setError('Failed to initialize payment. Please try again.');
                });
        }
    }, [axiosSecure, totalPrice]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const card = elements.getElement(CardElement);

        if (card === null) {
            return;
        }

        setProcessing(true);
        setError('');

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card
        });

        if (error) {
            console.log('Payment error:', error);
            setError(error.message);
            setProcessing(false);
            return;
        } else {
            console.log('Payment method:', paymentMethod);
        }

        
        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: card,
                billing_details: {
                    email: user?.email || 'anonymous',
                    name: user?.displayName || 'anonymous'
                }
            }
        });

        if (confirmError) {
            console.log('Confirm error:', confirmError);
            setError(confirmError.message);
            setProcessing(false);
            return;
        }

        console.log('Payment intent:', paymentIntent);

        if (paymentIntent.status === 'succeeded') {
            setTransactionId(paymentIntent.id);

            
            const payment = {
                email: user.email,
                price: totalPrice,
                transactionId: paymentIntent.id,
                date: new Date(),
                cartIds: cart.map(item => item._id),
                menuItemIds: cart.map(item => item.menuId),
                status: 'pending'
            };

            const res = await axiosSecure.post('/payments', payment);
            console.log('Payment saved:', res.data);

            if (res.data?.paymentResult?.insertedId) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Payment Successful!",
                    text: `Transaction ID: ${paymentIntent.id}`,
                    showConfirmButton: false,
                    timer: 2000
                });
                refetch();
                navigate('/dashboard/paymentHistory');
            }
        }

        setProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Payment Details</h3>

                {}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Items in cart:</span>
                        <span className="font-semibold">{cart.length}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total Amount:</span>
                        <span className="text-green-600">${totalPrice.toFixed(2)}</span>
                    </div>
                </div>

                {}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Information
                    </label>
                    <div className="border border-gray-300 rounded-md p-4 bg-white">
                        <CardElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: '16px',
                                        color: '#424770',
                                        '::placeholder': {
                                            color: '#aab7c4',
                                        },
                                    },
                                    invalid: {
                                        color: '#9e2146',
                                    },
                                },
                            }}
                        />
                    </div>
                </div>

                {}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {}
                {transactionId && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                        Payment successful! Transaction ID: {transactionId}
                    </div>
                )}

                {}
                <button
                    type="submit"
                    disabled={!stripe || !clientSecret || processing}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold 
                             hover:bg-blue-700 transition duration-200 disabled:bg-gray-400 
                             disabled:cursor-not-allowed shadow-lg"
                >
                    {processing ? 'Processing...' : `Pay $${totalPrice.toFixed(2)}`}
                </button>

                {}
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800 font-semibold mb-2">Test Card:</p>
                    <p className="text-xs text-yellow-700">Card: 4242 4242 4242 4242</p>
                    <p className="text-xs text-yellow-700">Exp: Any future date | CVC: Any 3 digits</p>
                </div>
            </div>
        </form>
    );
};

export default CheckoutForm;
