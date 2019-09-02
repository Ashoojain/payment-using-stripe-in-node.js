const express=require('express');
const  bodyparser=require('body-parser');
const exhbs=require('express-handlebars');
const key='secret'   //secret key of strip api
const stripe=require('stripe')(key);

const app=express();

const PORT=process.env.PORT || 5001;

app.engine('handlebars',exhbs({defaultLayout: 'main'}))
app.set('view engine','handlebars');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));

app.use(express.static(`${__dirname}/public`))

app.get('/',(req,res)=>{
    res.render('index');
})

app.post("/charge", (req, res) => {
    let amount = 500;

    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
    })
        .then(customer =>
            stripe.charges.create({
                amount,
                description: "Sample Charge",
                currency: "usd",
                customer: customer.id
            }))
        .then(charge => res.render('charge'))
        .catch(err => {
            console.log("Error:", err);
            // res.status(500).send({error: "Purchase Failed"});
        });
});
app.listen(PORT,(req,res)=>{
    console.log(`server connected ${PORT}`);
})