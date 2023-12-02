const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const PORT = process.env.PORT || 8080;

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log(err));

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  confirmPassword: String,
  image: String,
  date:Date,
  login_count:Number,
  fail_count:Number
});


const locationSchema = new mongoose.Schema({
  name: String,
  coordinates: {
    type: [Number],
    index: '2dsphere', // Enables geospatial indexing
  },
});

const Location = mongoose.model('Location', locationSchema);
const location=new Location({"name":"2951 S King"})
// location.save();


const userModel = mongoose.model("user", userSchema);
var plotly = require('plotly')({"username": "pranavkaushik300", "apiKey": "N7KUhcbQ5Hl7xvR6QGqx", "host": "localhost", "port": 443})
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

app.get("/users", async (req, res) => {
  try {
    const users = await userModel.find({}, '-password -confirmPassword');
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.post('/api/locations/nearme', async (req, res) => {
  //const { longitude, latitude, radius } = req.query;

  try {
    // const locations = await Location.find({
    //   coordinates: {
    //     $nearSphere: {
    //       $geometry: {
    //         type: 'Point',
    //         coordinates: [parseFloat(longitude), parseFloat(latitude)],
    //       },
    //       $maxDistance: parseInt(radius),
    //     },
    //   },
    // });
      console.log(req.body)
    // res.json({ locations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Edit user information
app.put("/edit-user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const updatedUserData = req.body;

    const updatedUser = await userModel.findByIdAndUpdate(userId, updatedUserData, { new: true });
    
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found", alert: false });
    }

    res.json({ message: "User information updated successfully", alert: true });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add a new user
app.post("/add-user", async (req, res) => {
  try {
    const userData = new userModel(req.body);
    const savedData = await userData.save();
    res.json({ message: "User added successfully", alert: true });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a user
app.delete("/delete-user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const result = await userModel.findByIdAndDelete(userId);

    if (!result) {
      return res.status(404).json({ message: "User not found", alert: false });
    }

    res.json({ message: "User deleted successfully", alert: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/deleteProductByName/:productName", async (req, res) => {
  try {
    const productName = req.params.productName;

    // Check if the product name is provided
    if (!productName) {
      return res.status(400).json({ message: "Product name is required", alert: false });
    }

    // Find and delete the product
    const result = await productModel.findOneAndDelete({ name: productName });

    // Check if the product was found and deleted
    if (!result) {
      return res.status(404).json({ message: "Product not found", alert: false });
    }

    res.json({ message: "Product deleted successfully", alert: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: `Internal server error: ${error.message}`, alert: false });
  }
});
app.post("/signup", async (req, res) => {
    try {
      const { email } = req.body;
      
      const result = await userModel.findOne({ email: email });
      var currentDate = new Date();
      data=req.body;
      data['date']=currentDate;
      data['login_count']=0;
      data['fail_count']=0
      //console.log(data);
      if (result) {
        res.json({ message: "Email id is already registered", alert: false });
      } else {
        const userData = new userModel(data);
        const savedData = await userData.save();
        res.json({ message: "Successfully signed up", alert: true });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal server error", alert: false });
    }
  });

  app.get('/registration-charts', async (req, res) => {
    try {
      const weeklyData = await getUsersData('week');
      const monthlyData = await getUsersData('month');
      const yearlyData = await getUsersData('year');
  
      const weeklyChart = generateBarChart('Weekly Registrations', weeklyData);
      const monthlyChart = generateBarChart('Monthly Registrations', monthlyData);
      const yearlyChart = generateBarChart('Yearly Registrations', yearlyData);
  
      res.send(`<div>${weeklyChart}</div><div>${monthlyChart}</div><div>${yearlyChart}</div>`);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

// Function to Get Users Data
async function getUsersData(interval) {
  const currentDate = new Date();
  const startDate = new Date();

  switch (interval) {
    case 'week':
      startDate.setDate(currentDate.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(currentDate.getMonth() - 1);
      break;
    case 'year':
      startDate.setFullYear(currentDate.getFullYear() - 1);
      break;
    default:
      throw new Error('Invalid interval');
  }

  const usersData = await userModel.find({ date: { $gte: startDate, $lte: currentDate } }).exec();

  return usersData.length;
}

// Function to Generate Bar Chart
function generateBarChart(title, data) {
  const trace = {
    x: [title],
    y: [data],
    type: 'bar',
  };

  const layout = {
    title,
  };

  const chart = Plotly.plot([trace], layout);

  return chart;
}
  


  app.post("/login", async(req, res) => {
    
    const email = req.body.email;
    const password=req.body.password
    console.log(req.body.password);
    const result=await userModel.findOne({ email: email ,password:password});
    if (result) {
      result.login_count=result.login_count+1;
      await result.save();
      const dataSend = {
        _id: result._id,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
        image: result.image,
      };
      //console.log(dataSend);
      res.send({
        message: "Login is Successful",
        alert: true,
        data: dataSend,
      });
    } else {
      const result2=await userModel.findOne({ email: email });
      if(result2){
        result2.fail_count=result2.fail_count+1;
        await result2.save();
        res.send({
          message: "Password Incorrect",
          alert: false,
        });
      }
      else{
        res.send({
          message: "Email is not available, please sign up",
          alert: false,
        });
      }
    }
  });
  
  const schemaProduct = mongoose.Schema({
    name: String,
    category:String,
    image: String,
    price: String,
    description: String,
    purchaseCount:Number
  });

  const productModel = mongoose.model("product",schemaProduct)

  app.post("/uploadProduct",async(req,res)=>{
    //console.log(req.body)
    const val=req.body;
    val.purchaseCount=0
    const data = await productModel(val)
    const datasave = await data.save()
    res.send({message : "Upload successfully"})
})

app.get("/product",async(req,res)=>{
  const data = await productModel.find({})
  res.send(JSON.stringify(data))
})

const productSchema = new mongoose.Schema({
  productId:String,
  name: String,
  category: String,
  quantity: Number,
});


const paymentSchema = mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  cardNumber: String,
  expirationDate: String,
  cvv: String,
  products: Array,
});

const paymentModel = mongoose.model("payment", paymentSchema);


app.post("/submit-payment", async (req, res) => {
  try {
    const { name, email, phone, address, cardNumber, expirationDate, cvv, products } = req.body;

    // Create a new Payment document with product IDs
    // const payment = new paymentModel({
    //   name,
    //   email,
    //   phone,
    //   address,
    //   cardNumber,
    //   expirationDate,
    //   cvv,
    //   products
    // });
   console.log(products[0]._id);
   for(let i = 0; i < products.length; i++){
    const fetchedproduct=await productModel.findOne({_id:products[i]._id});
    fetchedproduct.purchaseCount=fetchedproduct.purchaseCount+1
   }
   
    // await payment.save();

    res.status(201).json({ message: 'Payment information saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Add this schema definition after your user and product schemas
const contactSchema = mongoose.Schema({
  name: String,
  email: String,
  message: String,
});

const contactModel = mongoose.model("contact", contactSchema);
// Add this after your existing endpoints
app.post("/submit-contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Create a new Contact document
    const contact = new contactModel({
      name,
      email,
      message,
    });

    // Save the contact form data to the database
    await contact.save();

    res.status(201).json({ message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(PORT, () => console.log("Server is running at port: " + PORT));