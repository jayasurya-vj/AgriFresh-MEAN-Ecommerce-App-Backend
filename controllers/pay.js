import {User} from "../model/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Stripe from "stripe";

const stripe = Stripe(process.env.STRIPE_KEY);



const payWithStripe = (req, res, next) => { 
    try {
        // Create a checkout session with Stripe
        const session = stripe.checkout.sessions.create({
          customer_email: 'jayasurya.vj143@gmail.com',
          payment_method_types: ['card', 'ideal'],
          shipping_address_collection: {
            allowed_countries: ['NL', 'DE', 'FR' ],
          },
          shipping_options: [
            {
              shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: {
                  amount: 0,
                  currency: 'eur',
                },
                display_name: 'Free shipping',
                // Delivers between 2-3 business days
                delivery_estimate: {
                  minimum: {
                    unit: 'day',
                    value: 2,
                  },
                  maximum: {
                    unit: 'day',
                    value: 3,
                  },
                }
              }
            },
            {
              shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: {
                  amount: 1500,
                  currency: 'eur',
                },
                display_name: 'Express delivery',
                delivery_estimate: {
                  minimum: {
                    unit: 'hour',
                    value: 1,
                  },
                  maximum: {
                    unit: 'hour',
                    value: 2,
                  },
                }
              }
            },
          ],
          // For each item use the id to get it's information
          // Take that information and convert it to Stripe's format
          line_items: [{
            price_data: {
              currency: 'eur',
              product_data: {
                name: 'T-shirt',
              },
              unit_amount: 2000,
            },
            quantity: 1,
          },
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: 'Shorts',
              },
              unit_amount: 4000,
            },
            quantity: 3,
          }],
          mode: "payment",
          // Set a success and cancel URL we will send customers to
          // These must be full URLs
          // In the next section we will setup CLIENT_URL
          success_url: `http://localhost:5000/api/payment/success?session_id={CHECKOUT_SESSION_ID}`,  //&order=${JSON.stringify(req.body.order)}
          cancel_url: `http://localhost:4200/cart`,
        }).then( data=>{
            console.log(data);
            res.json({message:'Success',data:data, url: data.url });
        }).catch(err=>{
            res.status(500).json({message:'Payment Failed',error:err});
          });
      } catch (err) {
        // If there is an error send it to the client
        res.status(500).json({message:'Payment Failed',error:err})
      }
}

const paymentSuccess = (req, res, next) => { 
  let {session_id} = req.query;
  stripe.checkout.sessions.retrieve(session_id)
  .then(data=> {  console.log(data); res.redirect("http://localhost:4200/shop"); });  
}
// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_32bd8377bb8196752a4b9d6ef16789cece1eabe394c0d4de492a7b0eda6491f0";

const stripeWebhook = (req, res, next) => { 
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log(event);
  } catch (err) {
    console.log(err);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  console.log(event.data.object);
  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      {const paymentIntent = event.data.object;
       
      // Then define and call a function to handle the event payment_intent.succeeded
      break;}
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send("hello");
}


export const payController = {payWithStripe,paymentSuccess,stripeWebhook};

// AD,
// AT,
// BE,
// BG,
// HR,
// CY,
// CZ,
// DK,
// EE,
// FO,
// FI,
// FR,
// DE,
// GI,
// GR,
// GL,
// GG,
// VA,
// HU,
// IS,
// IE,
// IM,
// IL,
// IT,
// JE,
// LV,
// LI,
// LT,
// LU,
// MT,
// MC,
// NL,
// NO,
// PL,
// PT,
// RO,
// PM,
// SM,
// SK,
// SI,
// ES,
// SE,
// TR,
// GB


