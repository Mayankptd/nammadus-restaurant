console.log('may node be with you')
const MongoClient = require('mongodb').MongoClient;
const passport = require('passport');

const express=require('express');

 const bodyParser=require('body-parser'); 
 const path = require('path')
const app=express();


app.use(express.static('public'))
app.use('/css',express.static('/Users/hp/Desktop/project1/after'+'/public/css'))
app.use('/js',express.static('/Users/hp/Desktop/project1/after'+'/public/js'))
app.use('/images',express.static('/Users/hp/Desktop/project1/after'+'/public/images'))
app.use('/fonts',express.static('/Users/hp/Desktop/project1/after'+'/public/fonts'))
    
app.use(bodyParser.urlencoded({
    extended: true
}))

 


app.use(passport.initialize());

const url = 'mongodb://127.0.0.1:27017/Testl'
MongoClient.connect('mongodb://127.0.0.1:27017/Testl',{
    useUnifiedTopology: true 
})
.then(client =>
    {
    console.log('Connected to Database')
    const db = client.db('Testl')
    const Signup = db.collection('Signup')


    app.set('views', path.join(__dirname, 'views')) 
    app.set('view engine', 'ejs')

// Showing home page 
app.get('/', (req, res) => {
    res.sendFile('/Users/hp/Desktop/project1/after'+'/public/index.html')
  })
// Handling user signup 
  app.post("/signup",function(req,res)
  {
   Signup.insertOne(req.body)
    .then(result => {
console.log(result)
res.redirect('/')
  })
  .catch(error => console.error(error))
});


// Handling user login
app.post("/login",function(req,res,next)
{ 
    Signup.findOne({password:req.body.password , email:req.body.email}, (err, result) => {
  if (result) {
            res.render('Home',{
              key: Publishable_Key
            })
            
        }
    else{
      res.send("incorrect Email 0r Password")
    }
});
});



const Feedback = db.collection('Feedback')
app.post("/",function(req,res)
  {
    Feedback.insertOne(req.body)
    .then(result => {
console.log(result)
res.redirect('/')
  })
  .catch(error => console.error(error))     
});


const booking = db.collection('booking') 
var Publishable_Key = 'pk_test_51HjjIRDyeQ45rQ2b5xJ93gR7beeatM1dpQtCKrZouuZ6DiJq734Oob4jDBoyyjX2yPuT8ikrt3wvg35ki3GjCXf500zgwm70zu'
var Secret_Key = 'sk_test_51HjjIRDyeQ45rQ2beM8T6Of2qeK8cymO1JOoCzESA4KUMmnLOYKC53RD8AGPb9Jh5gtMRWrJzq2GtNCgnoMCt6VQ00VIhJrABE'

const stripe = require('stripe')('sk_test_51HjjIRDyeQ45rQ2beM8T6Of2qeK8cymO1JOoCzESA4KUMmnLOYKC53RD8AGPb9Jh5gtMRWrJzq2GtNCgnoMCt6VQ00VIhJrABE') 
app.use(bodyParser.urlencoded({extended:false})) 
app.use(bodyParser.json())

app.set('views', path.join(__dirname, 'views')) 
app.set('view engine', 'ejs') 



app.post("/book",function(req,res)
{
  booking.insertOne(req.body)
  .then(result => {
console.log(result)
res.send("Success")
})
.catch(error => console.error(error))     
});



app.post('/payment', function(req, res){ 

	// Moreover you can take more details from user 
	// like Address, Name, etc from form 
	stripe.customers.create({ 
		email: req.body.stripeEmail, 
		source: req.body.stripeToken, 
		name: 'Namadas', 
		address: { 
			line1: 'TC 9/4 Old MES colony', 
			postal_code: '452331', 
			city: 'Indore', 
			state: 'Madhya Pradesh', 
			country: 'India', 
		} 
	}) 
	.then((customer) => { 

		return stripe.charges.create({ 
			amount: 10000,	 // Charing Rs 100
			description: 'Web Development Product', 
			currency: 'INR', 
			customer: customer.id 
		}); 
	}) 
	.then((charge) => { 
		res.send("Successfully Book Table") // If no error occurs 
	}) 
	.catch((err) => { 
		res.send(err)	 // If some error occurs 
	}); 
}) 



app.listen(3000,function(){
    console.log('listening on 3000')
})
})
.catch(error=>console.error(error))