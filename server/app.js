require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoute");

const app = express();
app.use(express.json());
app.use(cors());
// Connect to MongoDB
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/auth", authRoutes);
app.use("/expenses", expenseRoutes);

const PORT = process.env.PORT || 3000;
const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'Expense Tracking API',
        version: '1.0.0',
        description: 'API for tracking user expenses and savings'
      }
    },
    apis: ['./routes/*.js']
  };
  
  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
