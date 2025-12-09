import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useCart from "../../../hooks/useCart";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const MobileBankingForm = ({ paymentMethod }) => {
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);
    const [paymentData, setPaymentData] = useState(null);
    const [walletNumber, setWalletNumber] = useState('');
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const [cart, refetch] = useCart();
    const navigate = useNavigate();

    const totalPrice = cart.reduce((total, item) => total + item.price, 0);

    const paymentMethodInfo = {
        bkash: {
            name: 'bKash',
            icon: '💸',
            color: 'pink',
            placeholder: '01XXXXXXXXX',
            instructions: 'Enter your bKash mobile number to proceed with payment'
        },
        nagad: {
            name: 'Nagad',
            icon: '📨',
            color: 'orange',
            placeholder: '01XXXXXXXXX',
            instructions: 'Enter your Nagad mobile number to proceed with payment'
        },
        rocket: {
            name: 'Rocket',
            icon: '🚀',
            color: 'purple',
            placeholder: '01XXXXXXXXX',
            instructions: 'Enter your Rocket mobile number to proceed with payment'
        },
        sslcommerz: {
            name: 'SSLCommerz',
            icon: '🏦',
            color: 'gray',
            placeholder: 'Enter Name', 
            instructions: 'You will be redirected to SSLCommerz payment gateway to complete your payment securely.'
        }
    };

    const info = paymentMethodInfo[paymentMethod];

    const handleSubmit = async (event) => {
        event.preventDefault();

        
        if (paymentMethod !== 'sslcommerz' && !walletNumber) {
            setError('Please enter your mobile wallet number');
            return;
        }

        setProcessing(true);
        setError('');

        try {
            
            const response = await axiosSecure.post('/create-payment-intent', {
                price: totalPrice,
                paymentMethod: paymentMethod
            });

            console.log('Payment intent response:', response.data);
            setPaymentData(response.data);

            
            if (paymentMethod === 'bkash' && response.data.bkashURL) {
                window.location.href = response.data.bkashURL;
            } else if (paymentMethod === 'nagad' && response.data.nagadData) {
                Swal.fire({
                    icon: 'info',
                    title: 'Redirecting to Nagad',
                    text: 'You will be redirected to Nagad payment gateway',
                    timer: 2000
                });
            } else if (paymentMethod === 'sslcommerz' && response.data.sslcommerzURL) {
                window.location.href = response.data.sslcommerzURL;
            } else if (paymentMethod === 'rocket') {
                await handleRocketPayment(response.data);
            }

        } catch (error) {
            console.error('Payment error:', error);
            setError(error.response?.data?.message || 'Failed to initialize payment. Please try again.');
            setProcessing(false);
        }
    };

    const handleRocketPayment = async (paymentData) => {
        
        const result = await Swal.fire({
            title: 'Rocket Payment Instructions',
            html: `
                <div class="text-left">
                    <p class="mb-2"><strong>Amount:</strong> ৳${totalPrice}</p>
                    <p class="mb-2"><strong>Merchant ID:</strong> ${paymentData.rocketData.merchantId}</p>
                    <p class="mb-4"><strong>Order ID:</strong> ${paymentData.orderId}</p>
                    <p class="mb-2">Please complete the payment using your Rocket app and enter the transaction ID below:</p>
                </div>
            `,
            input: 'text',
            inputPlaceholder: 'Enter Rocket Transaction ID',
            showCancelButton: true,
            confirmButtonText: 'Verify Payment',
            cancelButtonText: 'Cancel',
            inputValidator: (value) => {
                if (!value) {
                    return 'Please enter the transaction ID';
                }
            }
        });

        if (result.isConfirmed) {
            await savePayment({
                transactionId: result.value,
                orderId: paymentData.orderId,
                paymentMethod: 'rocket'
            });
        } else {
            setProcessing(false);
        }
    };

    const savePayment = async (paymentInfo) => {
        try {
            const payment = {
                email: user.email,
                price: totalPrice,
                transactionId: paymentInfo.transactionId,
                date: new Date(),
                cartIds: cart.map(item => item._id),
                menuItemIds: cart.map(item => item.menuId),
                status: 'pending',
                paymentMethod: paymentInfo.paymentMethod,
                orderId: paymentInfo.orderId
            };

            const res = await axiosSecure.post('/payments', payment);
            console.log('Payment saved:', res.data);

            if (res.data?.paymentResult?.insertedId) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Payment Successful!",
                    text: `Transaction ID: ${paymentInfo.transactionId}`,
                    showConfirmButton: false,
                    timer: 2000
                });
                refetch();
                navigate('/dashboard/paymentHistory');
            }
        } catch (error) {
            console.error('Error saving payment:', error);
            setError('Failed to save payment. Please contact support.');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex-shrink-0 text-4xl">
                        {info.icon}
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800">{info.name} Payment</h3>
                        <p className="text-sm text-gray-600">{info.instructions}</p>
                    </div>
                </div>

                {}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Items in cart:</span>
                        <span className="font-semibold">{cart.length}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total Amount:</span>
                        <span className={`text-${info.color}-600`}>৳{totalPrice.toFixed(2)}</span>
                    </div>
                </div>

                {}
                {paymentMethod !== 'sslcommerz' && (
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {info.name} Mobile Number
                        </label>
                        <input
                            type="tel"
                            value={walletNumber}
                            onChange={(e) => setWalletNumber(e.target.value)}
                            placeholder={info.placeholder}
                            className={`w-full border border-gray-300 rounded-md p-3 text-lg focus:ring-2 
                                     focus:ring-${info.color}-500 focus:border-${info.color}-500`}
                            pattern="[0-9]{11}"
                            maxLength="11"
                        />
                        <p className="text-xs text-gray-500 mt-1">Enter 11-digit mobile number</p>
                    </div>
                )}

                {}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {}
                <button
                    type="submit"
                    disabled={processing || (paymentMethod !== 'sslcommerz' && !walletNumber)}
                    className={`w-full bg-${info.color}-600 text-white py-3 px-6 rounded-lg font-semibold 
                             hover:bg-${info.color}-700 transition duration-200 disabled:bg-gray-400 
                             disabled:cursor-not-allowed shadow-lg`}
                >
                    {processing ? 'Processing...' : `Pay ৳${totalPrice.toFixed(2)} with ${info.name}`}
                </button>

                {}
                <div className={`mt-6 p-4 bg-${info.color}-50 border border-${info.color}-200 rounded-lg`}>
                    <p className={`text-sm text-${info.color}-800 font-semibold mb-2`}>
                        {info.name} Payment Process:
                    </p>
                    {paymentMethod === 'sslcommerz' ? (
                        <ol className={`text-xs text-${info.color}-700 list-decimal list-inside space-y-1`}>
                            <li>Click the pay button to proceed</li>
                            <li>You will be redirected to SSLCommerz secure gateway</li>
                            <li>Choose your preferred payment method (Card/Mobile/Net Banking)</li>
                            <li>Complete the payment securely</li>
                            <li>You will be redirected back automatically</li>
                        </ol>
                    ) : (
                        <ol className={`text-xs text-${info.color}-700 list-decimal list-inside space-y-1`}>
                            <li>Enter your {info.name} mobile number</li>
                            <li>Click the pay button to proceed</li>
                            <li>You will be redirected to {info.name} payment page</li>
                            <li>Enter your {info.name} PIN to complete payment</li>
                            <li>You will be redirected back after successful payment</li>
                        </ol>
                    )}
                </div>
            </div>
        </form>
    );
};

export default MobileBankingForm;
