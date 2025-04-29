import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useEffect } from 'react';

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        if (!stripe || !elements) {
            console.error('Stripe not initialized');
        }
    }, [stripe, elements]);

    return (
        <div>
            <PaymentElement />
        </div>
    );
};

export default PaymentForm;