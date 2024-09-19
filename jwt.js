const jwt = require('jsonwebtoken');

// JWT secret key (store this in environment variables in a real app)
const JWT_SECRET = 'your_jwt_secret';


// Function to generate a JWT token
const createToken = (user) => {
  return jwt.sign(
    { id:user._id,email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '1h' } // Token expires in 1 hour
  );
};

// Function to verify a JWT token
const verifyToken = (req, res, next) => {
    // Get token from the Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    const token = authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'
  
    // Verify the token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Token is not valid' });
      }
  
      // Store the decoded token data (such as user ID, role) in request object
      req.user = decoded;
  
      // Proceed to the next middleware/controller
      next();
    });
  };


  const adminValidation = (req, res, next) => {
    // Get the token from the headers
    const token = req.headers.authorization;
  
  
    // Check if the token exists
    if (!token) {
      return res.status(401).json({ message: "Authorization token missing" });
    }
  
    // Split the token if it contains "Bearer " and get the token part
    const actualToken = token.split(" ")[1];
  
  
    try {
      // Decode the token using jwt.decode (you don't need to manually split)
      const decodedToken = jwt.decode(actualToken);
      
  
      // Check the role from the decoded token
      const role = decodedToken.role;
      // If the role is "admin", allow the request to proceed
      if (role === "admin") {
        next();
      } else {
        // If not an admin, return permission error
        return res.status(403).json({
          message: "Permission not granted. Only admins are allowed to perform this operation"
        });
      }
    } catch (error) {
      return res.status(400).json({ message: "Invalid token", error });
    }
  };
  
  module.exports = adminValidation;
  

module.exports = {  createToken, verifyToken ,adminValidation};
