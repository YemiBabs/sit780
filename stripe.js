async function asyncCall () {

    try {
        const stripe = require('stripe')('pk_test_853qy8se4d90x2LxszV5GAi700pL7qNzqY');
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 1477, // $14.77, an easily identifiable amount
            currency: 'usd',
        });
        console.log('Worked! ', paymentIntent.id);
    } catch (err) {
        console.log('Error! ', err.message);
    }
}

asyncCall()