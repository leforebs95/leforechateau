import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '../../lib/stripe';
import { getSession } from 'next-auth/react';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getSession({ req });
    const { amount, bookingDetails } = req.body;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      // Save booking details and user info in metadata
      metadata: {
        bookingId: bookingDetails.id,
        userId: session?.user?.id || 'guest',
        checkIn: bookingDetails.start_date,
        checkOut: bookingDetails.end_date,
        guests: bookingDetails.number_of_guests,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    const error = err as Error;
    console.error('Error creating payment intent:', error);
    res.status(500).json({ message: error.message });
  }
} 