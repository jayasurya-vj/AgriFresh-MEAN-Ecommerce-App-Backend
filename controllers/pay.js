import Stripe from "stripe";
import { Cart } from "../model/cart.js";
import { User } from "../model/user.js";
import { Order } from "../model/order.js";

function lineItem(name, unit_amount, quantity) {
  let price_data = {
    currency: 'eur',
    product_data: {
      name: name,
    },
    unit_amount: unit_amount * 100
  };
  return { price_data, quantity }
}

const stripe = Stripe(process.env.STRIPE_KEY);


const payWithStripe = (req, res, next) => {
  try {
    Cart.find({ creator: req.userData.userId }).populate('item')

      .then(cartItems => {

        let lineItems = cartItems.map(cItem => {
          return lineItem(cItem.item.name, cItem.item.price, cItem.quantity);
        })
        const session = stripe.checkout.sessions.create({
          customer_email: req.userData.email,
          payment_method_types: ['card', 'ideal'],
          shipping_address_collection: {
            allowed_countries: ['NL', 'DE', 'FR'],
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
                  amount: 1000,
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

          line_items: lineItems,
          mode: "payment",
          success_url: `http://localhost:5000/api/payment/success?session_id={CHECKOUT_SESSION_ID}`,  //&order=${JSON.stringify(req.body.order)}
          cancel_url: `http://localhost:5000/cart`,
        }).then(data => {
          res.json({ message: 'Success', data: data, url: data.url });
        }).catch(err => {
          res.status(500).json({ message: 'Payment Failed', error: err });
        });
      }).catch(err => {
        res.status(500).json({ message: 'Payment Failed', error: err });
      });;
  } catch (err) {
    res.status(500).json({ message: 'Payment Failed', error: err })
  }
}

const paymentSuccess = (req, res, next) => {
  let { session_id } = req.query;
  stripe.checkout.sessions.retrieve(session_id)
    .then(result => {
      User.findOne({ email: result.customer_email })
        .then(user => {
          Cart.find({ creator: user._id })
            .then(cartItems => {

              let orderedItems = cartItems.map(cItem => {
                return {item: cItem.item, quantity: cItem.quantity}
              });
              let shipping_details=result.shipping_details;
  
              const order=new Order({
                orderedItems,
                shipping_details,
                amount_subtotal: result.amount_subtotal/100,
                amount_total: result.amount_total/100,
                amount_shipping: result.total_details ? result.total_details.amount_shipping : 0,
                payment_status: result.payment_status || result.payment_status/100,
                created_at: Date.now(),
                creator: user._id
              });
              order.save().then(  data =>{
                Cart.deleteMany({creator:user._id}).then(deleteResult=>{
                  console.log(deleteResult);
                  res.redirect("http://localhost:5000/orders?orderplaced=true");
                });                
              });
            });
        }).catch(err => {
          res.status(500).json({ message: 'Payment Failed', error: err });
        });
    });
}


export const payController = { payWithStripe, paymentSuccess };




