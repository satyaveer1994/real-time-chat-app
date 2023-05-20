const userModel = require("../models/user");
const firebaseAdmin = require("firebase-admin");
const serviceAccount = require("./Home/Downloads/serviceAccountKey.json");
//Initialize Firebase Admin SDK with your credentials

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});

// Sign up a user using their Google account
const signup = async (req, res) => {
  const { idToken } = req.body;

  try {
    // Verify the Google ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email } = decodedToken;

    // Check if the user already exists in the database
    const existingUser = await userModel.findOne({ uid });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists." });
    }

    // Create a new user in the database
    const newUser = await userModel.create({ uid, email });

    res
      .status(201)
      .json({ message: "User signed up successfully", data: newUser });
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ error: "Failed to sign up." });
  }
};

// Sign in a user using their Google account
const signin = async (req, res) => {
  const { idToken } = req.body;

  try {
    // Verify the Google ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid } = decodedToken;

    // Check if the user exists in the database
    const user = await userModel.findOne({ uid });
    if (!user) {
      return res
        .status(401)
        .json({ error: "User not found. Please sign up first." });
    }

    // Generate a custom token for the user
    const customToken = await admin.auth().createCustomToken(uid);

    res.status(200).json({ customToken });
  } catch (error) {
    console.error("Error signing in:", error);
    res.status(500).json({ error: "Failed to sign in." });
  }
};

// Log out a user
const logout = (req, res) => {
  const { customToken } = req.body;

  admin
    .auth()
    .revokeRefreshTokens(customToken)
    .then(() => {
      res.status(200).json({ message: "User logged out successfully." });
    })
    .catch((error) => {
      console.error("Error logging out:", error);
      res.status(500).json({ error: "Failed to log out." });
    });
};

module.exports = { signup, signin, logout };
