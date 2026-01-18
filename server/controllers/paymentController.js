import Razorpay from 'razorpay';
import { Donation } from '../models/Donation.js';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
  try {
    const { amount, userId } = req.body;
    const options = {
      amount: amount * 100, // Razorpay works in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Step 7 logic: Store data regardless of outcome
    await Donation.create({
      userId,
      amount,
      orderId: order.id,
      status: 'pending'
    });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Order creation failed" });
  }
};

export const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    await Donation.findOneAndUpdate(
      { orderId: razorpay_order_id },
      { status: 'success', paymentId: razorpay_payment_id }
    );
    res.status(200).json({ message: "Payment Verified" });
  } else {
    res.status(400).json({ message: "Invalid Signature" });
  }
};


export const handlePaymentFailure = async (req, res) => {
    try {
        const { orderId } = req.body;
        // Update status to 'failed' in DB if the payment modal is closed or fails
        await Donation.findOneAndUpdate(
            { orderId: orderId },
            { status: 'failed' }
        );
        res.status(200).json({ message: "Status updated to failed" });
    } catch (error) {
        res.status(500).json({ message: "Error updating status" });
    }
};