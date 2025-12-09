const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const SSLCommerzPayment = require('sslcommerz-lts');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();
const port = process.env.PORT || 3000;


app.use(cors({
  origin: [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gjeqnpv.mongodb.net/tastyCottageDB?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

async function run() {
  try {
    await client.connect();

    const db = client.db("CottageDB");
    const userCollection = db.collection("users");
    const menuCollection = db.collection("menu");
    const reviewCollection = db.collection("reviews");
    const cartCollection = db.collection("carts");
    const bookingCollection = db.collection("bookings");




    app.post('/jwt', async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
      res.send({ token });


    })



    const verifyToken = (req, res, next) => {
      if (!req.headers.authorization) {
        return res.status(401).send({ message: 'unauthorized access' });
      }
      const token = req.headers.authorization.split(' ')[1];

      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).send({ message: 'unauthorized access' })
        }
        req.decoded = decoded;
        next();
      });
    };



    const verifyAdmin = async (req, res, next) => {
      const email = req.decoded.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      const isAdmin = user?.role === 'admin';
      if (!isAdmin) {
        return res.status(403).send({ message: 'forbidden access' })
      }
      next();
    }




    app.get('/users', verifyToken, verifyAdmin, async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    app.get('/users/admin/:email', verifyToken, async (req, res) => {

      const email = req.params.email;
      if (email !== req.decoded.email) {
        return res.status(403).send({ message: 'forbidden access' })
      }

      const query = { email: email };
      const user = await userCollection.findOne(query);
      let admin = false;
      if (user) {
        admin = user.role === 'admin';

      }
      res.send({ admin });

    })

    app.post('/users', async (req, res) => {
      const user = req.body;


      const query = { email: user.email }
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: 'User already exists', insertedId: null })
      }



      const result = await userCollection.insertOne(user);
      res.send(result);
    })





    app.patch('/users/admin/:id', verifyToken, verifyAdmin, async (req, res) => {
      const id = req.params.id;

      try {

        const filter = { _id: new ObjectId(id) };

        const updatedDoc = {
          $set: {
            role: 'admin'
          }
        };

        const result = await userCollection.updateOne(filter, updatedDoc);

        if (result.modifiedCount === 0) {
          return res.status(404).send({ message: "User not found or already admin" });
        }

        res.send(result);

      } catch (error) {
        console.error("Error setting user as admin:", error);
        res.status(500).send({ message: "Server error during update." });
      }
    });

    app.delete('/users/:id', verifyToken, verifyAdmin, async (req, res) => {
      const id = req.params.id;

      try {
        const query = { _id: new ObjectId(id) };

        const result = await userCollection.deleteOne(query);

        if (result.deletedCount === 0) {
          return res.status(404).send({ message: "User not found." });
        }

        res.send(result);

      } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send({ message: "Server error during user deletion." });
      }
    });


    app.get('/menu', async (req, res) => {
      try {
        const result = await menuCollection.find().toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching menu:", error);
        res.status(500).send({ message: "Server error fetching menu" });
      }
    })

    app.post('/menu', verifyToken, verifyAdmin, async (req, res) => {
      const item = req.body;
      const result = await menuCollection.insertOne(item);
      res.send(result);
    })


    app.delete('/menu/:id', verifyToken, verifyAdmin, async (req, res) => {
      const id = req.params.id;

      if (!id || id.length !== 24) {
        return res.status(400).send({ message: "Invalid item ID provided" });
      }
      try {
        const query = { _id: new ObjectId(id) }
        const result = await menuCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        console.error("Delete operation failed:", error);
        res.status(500).send({ message: "Server error during deletion." });
      }
    })

    app.get('/reviews', async (req, res) => {
      try {
        const result = await reviewCollection.find().toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).send({ message: "Server error fetching reviews" });
      }
    })

    app.post('/reviews', verifyToken, async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    })







    app.get('/carts', verifyToken, async (req, res) => {
      try {
        const email = req.query.email;


        if (email !== req.decoded.email) {
          return res.status(403).send({ message: 'forbidden access' });
        }

        const query = { email: email };
        const result = await cartCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).send({ message: "Server error fetching cart" });
      }
    });

    app.post('/carts', verifyToken, async (req, res) => {
      try {
        const cartItem = req.body;


        if (cartItem.email !== req.decoded.email) {
          return res.status(403).send({ message: 'forbidden access' });
        }

        const result = await cartCollection.insertOne(cartItem);
        res.send(result);
      } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).send({ message: "Server error adding to cart" });
      }
    })

    app.delete('/carts/:id', verifyToken, async (req, res) => {
      try {
        const id = req.params.id;

        if (!id || id.length !== 24) {
          return res.status(400).send({ message: "Invalid cart item ID" });
        }

        const query = { _id: new ObjectId(id) };
        const result = await cartCollection.deleteOne(query);

        if (result.deletedCount === 0) {
          return res.status(404).send({ message: "Cart item not found" });
        }

        res.send(result);
      } catch (error) {
        console.error("Error deleting cart item:", error);
        res.status(500).send({ message: "Server error deleting cart item" });
      }
    })


    app.get('/bookings', verifyToken, async (req, res) => {
      const email = req.query.email;
      let query = {};
      if (email) {
        query = { email: email };
      }
      const result = await bookingCollection.find(query).toArray();
      res.send(result);
    });

    app.patch('/bookings/:id', verifyToken, async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          status: req.body.status
        }
      };
      const result = await bookingCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    app.post('/bookings', verifyToken, async (req, res) => {
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
      res.send(result);
    });

    app.delete('/bookings/:id', verifyToken, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookingCollection.deleteOne(query);
      res.send(result);
    });



    const axios = require('axios');
    const paymentCollection = db.collection("payments");



    let bkashToken = null;
    let bkashTokenExpiry = null;

    const getBkashToken = async () => {
      try {

        if (bkashToken && bkashTokenExpiry && Date.now() < bkashTokenExpiry) {
          return bkashToken;
        }


        const response = await axios.post(
          `${process.env.BKASH_BASE_URL}/checkout/token/grant`,
          {
            app_key: process.env.BKASH_APP_KEY,
            app_secret: process.env.BKASH_APP_SECRET
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'username': process.env.BKASH_USERNAME,
              'password': process.env.BKASH_PASSWORD
            }
          }
        );

        bkashToken = response.data.id_token;

        bkashTokenExpiry = Date.now() + (55 * 60 * 1000);

        return bkashToken;
      } catch (error) {
        console.error('bKash token error:', error.response?.data || error.message);
        throw new Error('Failed to get bKash token');
      }
    };

    const createBkashPayment = async (amount, orderId) => {
      try {
        const token = await getBkashToken();

        const response = await axios.post(
          `${process.env.BKASH_BASE_URL}/checkout/payment/create`,
          {
            mode: '0011',
            payerReference: ' ',
            callbackURL: `${process.env.FRONTEND_URL}/payment-callback/bkash`,
            amount: amount.toString(),
            currency: 'BDT',
            intent: 'sale',
            merchantInvoiceNumber: orderId
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token,
              'X-APP-Key': process.env.BKASH_APP_KEY
            }
          }
        );

        return response.data;
      } catch (error) {
        console.error('bKash payment creation error:', error.response?.data || error.message);
        throw new Error('Failed to create bKash payment');
      }
    };

    const executeBkashPayment = async (paymentID) => {
      try {
        const token = await getBkashToken();

        const response = await axios.post(
          `${process.env.BKASH_BASE_URL}/checkout/payment/execute`,
          { paymentID },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token,
              'X-APP-Key': process.env.BKASH_APP_KEY
            }
          }
        );

        return response.data;
      } catch (error) {
        console.error('bKash payment execution error:', error.response?.data || error.message);
        throw new Error('Failed to execute bKash payment');
      }
    };

    const queryBkashPayment = async (paymentID) => {
      try {
        const token = await getBkashToken();

        const response = await axios.post(
          `${process.env.BKASH_BASE_URL}/checkout/payment/query`,
          { paymentID },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token,
              'X-APP-Key': process.env.BKASH_APP_KEY
            }
          }
        );

        return response.data;
      } catch (error) {
        console.error('bKash payment query error:', error.response?.data || error.message);
        throw new Error('Failed to query bKash payment');
      }
    };



    const crypto = require('crypto');

    const generateNagadSignature = (data) => {
      const privateKey = process.env.NAGAD_PRIVATE_KEY;
      const sign = crypto.createSign('SHA256');
      sign.update(data);
      sign.end();
      return sign.sign(privateKey, 'base64');
    };

    const createNagadPayment = async (amount, orderId) => {
      try {
        const timestamp = Date.now().toString();
        const merchantId = process.env.NAGAD_MERCHANT_ID;

        const sensitiveData = {
          merchantId: merchantId,
          datetime: timestamp,
          orderId: orderId,
          challenge: crypto.randomBytes(20).toString('hex')
        };

        const signature = generateNagadSignature(JSON.stringify(sensitiveData));

        const response = await axios.post(
          `${process.env.NAGAD_BASE_URL}/check-out/initialize/${merchantId}/${orderId}`,
          {
            dateTime: timestamp,
            sensitiveData: Buffer.from(JSON.stringify(sensitiveData)).toString('base64'),
            signature: signature
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-KM-Api-Version': 'v-0.2.0',
              'X-KM-IP-V4': '103.100.100.1',
              'X-KM-Client-Type': 'PC_WEB'
            }
          }
        );

        return response.data;
      } catch (error) {
        console.error('Nagad payment creation error:', error.response?.data || error.message);
        throw new Error('Failed to create Nagad payment');
      }
    };


    const verifyNagadPayment = async (paymentRef) => {
      try {
        return { status: 'Success', paymentRef };
      } catch (error) {
        console.error('Nagad payment verification error:', error.message);
        throw new Error('Failed to verify Nagad payment');
      }
    };



    const createRocketPayment = async (amount, orderId) => {
      try {
        return {
          success: true,
          merchantId: process.env.ROCKET_MERCHANT_ID,
          orderId: orderId,
          amount: amount,
          instructions: 'Please send payment to Rocket merchant account and provide transaction ID'
        };
      } catch (error) {
        console.error('Rocket payment creation error:', error.message);
        throw new Error('Failed to create Rocket payment');
      }
    };




    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    app.post('/create-payment-intent', async (req, res) => {
      try {
        const { price, paymentMethod = 'stripe' } = req.body;
        const amount = parseFloat(price);

        if (!amount || amount <= 0) {
          return res.status(400).send({ message: 'Invalid amount' });
        }


        const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;


        switch (paymentMethod) {
          case 'stripe':
            const stripeAmount = parseInt(amount * 100);
            const paymentIntent = await stripe.paymentIntents.create({
              amount: stripeAmount,
              currency: 'usd',
              payment_method_types: ['card']
            });

            return res.send({
              paymentMethod: 'stripe',
              clientSecret: paymentIntent.client_secret,
              amount: amount,
              currency: 'USD'
            });

          case 'bkash':
            const bkashResult = await createBkashPayment(amount, orderId);
            return res.send({
              paymentMethod: 'bkash',
              orderId: orderId,
              paymentID: bkashResult.paymentID,
              bkashURL: bkashResult.bkashURL,
              amount: amount,
              currency: 'BDT'
            });

          case 'nagad':
            const nagadResult = await createNagadPayment(amount, orderId);
            return res.send({
              paymentMethod: 'nagad',
              orderId: orderId,
              nagadData: nagadResult,
              amount: amount,
              currency: 'BDT'
            });

          case 'rocket':
            const rocketResult = await createRocketPayment(amount, orderId);
            return res.send({
              paymentMethod: 'rocket',
              orderId: orderId,
              rocketData: rocketResult,
              amount: amount,
              currency: 'BDT'
            });

            return res.send({
              paymentMethod: 'stripe',
              clientSecret: paymentIntent.client_secret,
              amount: amount,
              currency: 'USD'
            });
        }
      } catch (error) {
        console.error('Payment intent creation error:', error.message);
        res.status(500).send({
          message: 'Failed to create payment intent',
          error: error.message
        });
      }
    });


    app.post('/execute-bkash-payment', async (req, res) => {
      try {
        const { paymentID } = req.body;

        if (!paymentID) {
          return res.status(400).send({ message: 'Payment ID is required' });
        }

        const result = await executeBkashPayment(paymentID);
        res.send(result);
      } catch (error) {
        console.error('bKash execution error:', error.message);
        res.status(500).send({
          message: 'Failed to execute bKash payment',
          error: error.message
        });
      }
    });


    app.post('/ssl-payment-success/:tranId', async (req, res) => {
      const tranId = req.params.tranId;
      console.log("SSL Payment Success:", tranId);


      const payment = {
        transactionId: tranId,
        status: 'success',
        paymentMethod: 'sslcommerz',
        date: new Date()
      };

      const result = await paymentCollection.insertOne(payment);


      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard/paymentHistory`);
    });

    app.post('/ssl-payment-fail/:tranId', async (req, res) => {
      const tranId = req.params.tranId;
      console.log("SSL Payment Failed:", tranId);
      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard/payment?error=payment_failed`);
    });

    app.post('/ssl-payment-cancel/:tranId', async (req, res) => {
      const tranId = req.params.tranId;
      console.log("SSL Payment Cancelled:", tranId);
      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard/payment?error=payment_cancelled`);
    });


    app.post('/verify-mobile-payment', async (req, res) => {
      try {
        const { paymentMethod, paymentID, paymentRef } = req.body;

        let result;
        switch (paymentMethod) {
          case 'bkash':
            result = await queryBkashPayment(paymentID);
            break;
          case 'nagad':
            result = await verifyNagadPayment(paymentRef);
            break;
          case 'rocket':
            result = { status: 'Success', message: 'Rocket payment verified' };
            break;
          default:
            return res.status(400).send({ message: 'Invalid payment method' });
        }

        res.send(result);
      } catch (error) {
        console.error('Payment verification error:', error.message);
        res.status(500).send({
          message: 'Failed to verify payment',
          error: error.message
        });
      }
    });



    app.get('/payments/:email', verifyToken, async (req, res) => {
      const query = { email: req.params.email }
      if (req.params.email !== req.decoded.email) {
        return res.status(403).send({ message: 'forbidden access' });
      }
      const result = await paymentCollection.find(query).toArray();
      res.send(result);
    })

    app.post('/payments', async (req, res) => {
      const payment = req.body;
      const paymentResult = await paymentCollection.insertOne(payment);


      console.log('payment info', payment);
      const query = {
        _id: {
          $in: payment.cartIds.map(id => new ObjectId(id))
        }
      };

      const deleteResult = await cartCollection.deleteMany(query);

      res.send({ paymentResult, deleteResult });
    })


    app.get('/admin-stats', verifyToken, verifyAdmin, async (req, res) => {
      const users = await userCollection.estimatedDocumentCount();
      const menuItems = await menuCollection.estimatedDocumentCount();
      const orders = await paymentCollection.estimatedDocumentCount();



      const result = await paymentCollection.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: '$price'
            }
          }
        }
      ]).toArray();

      const revenue = result.length > 0 ? result[0].totalRevenue : 0;

      res.send({
        users,
        menuItems,
        orders,
        revenue
      })
    })




    app.get('/order-stats', verifyToken, verifyAdmin, async (req, res) => {
      const result = await paymentCollection.aggregate([
        {
          $unwind: '$menuItemIds'
        },
        {
          $lookup: {
            from: 'menu',
            let: { menuItemId: { $toObjectId: '$menuItemIds' } },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$_id', '$$menuItemId']
                  }
                }
              }
            ],
            as: 'menuItems'
          }
        },
        {
          $unwind: '$menuItems'
        },
        {
          $group: {
            _id: '$menuItems.category',
            quantity: { $sum: 1 },
            revenue: { $sum: '$menuItems.price' }
          }
        },
        {
          $project: {
            _id: 0,
            category: '$_id',
            quantity: '$quantity',
            revenue: '$revenue'
          }
        }
      ]).toArray();

      console.log('Order Stats Result:', result);
      res.send(result);
    })


    app.get('/user-stats', verifyToken, async (req, res) => {
      const email = req.query.email;
      if (!email) {
        return res.send({ payment: 0, reviews: 0, cartItems: 0, orders: 0 });
      }

      const query = { email: email };

      const paymentCount = await paymentCollection.countDocuments(query);
      const reviewsCount = await reviewCollection.countDocuments(query);
      const cartCount = await cartCollection.countDocuments(query);


      const payments = await paymentCollection.find(query).toArray();
      const totalSpent = payments.reduce((total, item) => total + item.price, 0);

      res.send({
        payment: totalSpent,
        reviews: reviewsCount,
        cartItems: cartCount,
        orders: paymentCount
      });
    });
    let menuCache = null;
    let menuCacheTime = null;
    const CACHE_DURATION = 5 * 60 * 1000;


    app.post('/chat', async (req, res) => {
      const { message } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).send({ message: "Gemini API key not configured" });
      }

      try {
        if (!menuCache || Date.now() - menuCacheTime > CACHE_DURATION) {
          menuCache = await menuCollection.find().toArray();
          menuCacheTime = Date.now();
        }


        const menuContext = menuCache.map(item =>
          `${item.name}: $${item.price} (${item.category}) - ${item.recipe}`
        ).join('\n');

        const systemPrompt = `You are a helpful assistant for Tasty Cottage, a restaurant. 
        Use the following menu information to answer customer questions. 
        If the answer is not in the menu, politely say you don't know.
        
        Menu:
        ${menuContext}`;


        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const chat = model.startChat({
          history: [
            {
              role: "user",
              parts: [{ text: systemPrompt }],
            },
            {
              role: "model",
              parts: [{ text: "Understood. I am ready to answer questions about the Tasty Cottage menu." }],
            },
          ],
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const reply = response.text();

        res.send({ reply });

      } catch (error) {
        console.error("Chatbot error:", error.message);


        try {
          const lowerMessage = message.toLowerCase();
          const menuItems = menuCache || await menuCollection.find().toArray();


          const matchedItems = menuItems.filter(item =>
            lowerMessage.includes(item.name.toLowerCase()) ||
            lowerMessage.includes(item.category.toLowerCase())
          );

          let reply;
          if (matchedItems.length > 0) {
            const itemDetails = matchedItems.map(item =>
              `• ${item.name} ($${item.price}): ${item.recipe}`
            ).join('\n');
            reply = `I'm currently offline, but I found these items for you:\n${itemDetails}`;
          } else {
            reply = `I'm currently offline and couldn't find any specific menu items matching your request. Please try asking for a specific dish.`;
          }

          res.send({ reply });
        } catch (fallbackError) {
          console.error("Fallback error:", fallbackError);
          res.status(500).send({ message: "Chat service temporarily unavailable" });
        }
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log("✅ Successfully connected to MongoDB!");



  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}


process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  try {
    await client.close();
    console.log('✅ MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  try {
    await client.close();
    console.log('✅ MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});


run()
  .then(() => {

    app.get('/', (req, res) => {
      res.send('cottage is running');
    });


    const store_id = process.env.STORE_ID;
    const store_passwd = process.env.STORE_PASSWORD;
    const is_live = false;

    const initializeSSLCommerzPayment = async (amount, orderId, customerInfo) => {
      const data = {
        total_amount: amount,
        currency: 'BDT',
        tran_id: orderId,
        success_url: `${process.env.VITE_API_URL || 'http://localhost:5000'}/ssl-payment-success/${orderId}`,
        fail_url: `${process.env.VITE_API_URL || 'http://localhost:5000'}/ssl-payment-fail/${orderId}`,
        cancel_url: `${process.env.VITE_API_URL || 'http://localhost:5000'}/ssl-payment-cancel/${orderId}`,
        ipn_url: `${process.env.VITE_API_URL || 'http://localhost:5000'}/ssl-payment-ipn`,
        shipping_method: 'Courier',
        product_name: 'Food Items',
        product_category: 'Food',
        product_profile: 'general',
        cus_name: customerInfo.name || 'Customer',
        cus_email: customerInfo.email || 'customer@example.com',
        cus_add1: 'Dhaka',
        cus_add2: 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: '01711111111',
        cus_fax: '01711111111',
        ship_name: 'Customer Name',
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
      };

      const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
      try {
        const apiResponse = await sslcz.init(data);
        return apiResponse.GatewayPageURL;
      } catch (error) {
        console.error("SSLCommerz Init Error:", error);
        throw error;
      }
    };


    app.listen(port, () => {
      console.log(`🚀 cottage is running on port ${port}`);
    });
  })
  .catch(console.dir);