var express = require('express');
var router = express.Router();


// app.js already makes these routes start at /donate!

// Donation form.
router.get('/', function(req, res) {
    res.render('donate');
});


router.post('/', async (req, res, next) => {
    // TO ADD: data validation, storing errors in an `errors` variable!

    const name = req.body.name;
     const email = req.body.email;
     const amount = req.body.amount;



     if (true) { // Data is valid! //To do: Yemi to add correct condition here for the const here
         try {
            // Create a PI:
             const stripe = require('stripe')('sk_test_ldfaOKUKSr6Rwqy0GaPC0qCY00SQIN6ohx');
              const paymentIntent = await stripe.paymentIntents.create({
                  amount: amount * 100, // In cents
                  currency: 'usd',
                  receipt_email: email,
              });

              console.log("name :" + name + ", amount :" + amount + ", PaymentIntent :" + paymentIntent.client_secret);
                res.render('card', {name: name, amount: amount, intentSecret: paymentIntent.client_secret });

          } catch(err) {
              console.log('Error! ', err.message);
          }
         } else {
         res.render('donate', { title: 'Donate', errors: errors });
     }
});


// Thanks page.
router.post('/thanks', function(req, res) {
    res.render('thanks', { title: 'Thanks!' });
});


module.exports = router;