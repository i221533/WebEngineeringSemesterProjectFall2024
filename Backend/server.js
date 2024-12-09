const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes=require('./routes/productRoutes')
const cartRoutes = require('./routes/cartRoutes');
const paymenRoute=require('./routes/paymentRoute')
const { GoogleGenerativeAI } = require('@google/generative-ai');

const EMAIL_USER="i221533@nu.edu.pk"
const EMAIL_PASS="2249263@Bilal"
const nodemailer = require('nodemailer');
dotenv.config();
connectDB();
const cors = require('cors');
const path = require('path');


const app = express();
// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());
app.use(express.json());
// Increase the limit to 50MB (you can adjust as needed)
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));
// Routes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/subscribe', productRoutes);
app.use('/api/payment_route',paymenRoute);
app.use('/api/cart', cartRoutes);

// Set up EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const API_KEY = 'AIzaSyDOvKbepNgmHoL8I3FODYD8KD9EzzlGqpk';

// Helper function to clean and format the response
const formatResponse = (response) => {
  if (typeof response === 'string') {
    return response
      .replace(/\*\*|\*/g, '') // Remove bold or italic markers
      .replace(/\n/g, ' ') // Replace newlines with spaces for smooth formatting
      .split(/\.\s+/) // Split into sentences using period and whitespace
      .map((sentence) => {
        const trimmedSentence = sentence.trim();
        return trimmedSentence.length > 0
          ? `\u2022 ${trimmedSentence.charAt(0).toUpperCase()}${trimmedSentence.slice(1)}` // Add bullet points and capitalize first letter
          : '';
      })
      .filter((sentence) => sentence.length > 0) // Remove empty lines
      .join('\n\n'); // Join sentences with double line breaks for separation
  }
  return response;
};

app.post('/generate', async (req, res) => {
  console.log("Backend request received");
  const { message } = req.body;

  console.log(message);

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    // Generate the content from the AI model
    const result = await model.generateContent(message);

    // Log the response from Gemini API for debugging
    console.log(result);

    // Extract the content correctly
    const candidates = result.response.candidates;
    if (candidates && candidates.length > 0) {
      const content = candidates[0].content || '';

      // If content is a function, call it to get the actual response text
      const geminiResponse = typeof content === 'function' ? content() : content;

      console.log(" response:", geminiResponse);
      // Handle cases where the response contains parts (array with text objects)
      if (geminiResponse && geminiResponse.parts && geminiResponse.parts.length > 0) {
        const responseText = geminiResponse.parts[0].text || '';

        // Format and send the response back to the client
        const formattedResponse = formatResponse(responseText);
        console.log("Generated response:", formattedResponse);
        res.json({ response: formattedResponse });
      } else {
        console.error('No valid content or parts found in the response.');
        res.status(500).json({ error: 'No valid content or parts found in the response from Gemini API' });
      }
    } else {
      console.error('No candidates found in the response.');
      res.status(500).json({ error: 'No candidates found in the response from Gemini API' });
    }
  } catch (error) {
    // Log any error that occurs and send a failure response
    console.error('Error during API call:', error);
    res.status(500).json({ error: 'Failed to generate response from Gemini API' });
  }
});
app.post('/api/email', async (req, res) => {
    const { email, name, orderId, total } = req.body;
    console.log(email);
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false,
        },
        port: 465, // Change to 465 for SSL
    secure: true, // Use true for SSL
        connectionTimeout: 5000, // Add a longer timeout (in milliseconds)
    });
    const mailOptions = {
        from: EMAIL_USER,
        to: email,
        subject: `Order Confirmation - Order #${orderId}`,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
                <h2 style="text-align: center; color: #4CAF50;">Thank You for Your Order!</h2>
                <p>Hi <b>${name}</b>,</p>
                <p>Your order <b>#${orderId}</b> has been successfully placed. We will notify you once it is shipped.</p>
                <h3>Order Summary:</h3>
                <ul style="list-style: none; padding: 0;">
                    <li><b>Order ID:</b> ${orderId}</li>
                    <li><b>Total Amount:</b> $${total}</li>
                </ul>
                <p>If you have any questions, feel free to contact us.</p>
                <hr>
                <p style="text-align: center;">&copy; 2024 Your Company Name. All Rights Reserved.</p>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully', info });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email', details: error.message });
    }
});




const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
