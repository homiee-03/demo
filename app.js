// Firebase core + analytics (configuration must match exactly as provided).
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-analytics.js";
// Firebase Authentication module.
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCgiM5aNDDJhFHGG9-eK-lwAEPM3u4w448",
  authDomain: "sign-in-ae5ca.firebaseapp.com",
  projectId: "sign-in-ae5ca",
  storageBucket: "sign-in-ae5ca.firebasestorage.app",
  messagingSenderId: "976958705327",
  appId: "1:976958705327:web:d99ebeeb72154797d34e5a",
  measurementId: "G-66LVVCPBZ7",
};

// Initialize Firebase services.
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
void analytics;
const auth = getAuth(app);

// Grab UI elements.
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const signUpButton = document.getElementById("sign-up");
const signInButton = document.getElementById("sign-in");
const signOutButton = document.getElementById("sign-out");
const statusMessage = document.getElementById("status");

// Common Firebase Auth error messages for a friendly UI.
const errorMessages = {
  "auth/wrong-password": "Incorrect password. Please try again.",
  "auth/user-not-found": "No account found for that email.",
  "auth/weak-password": "Password should be at least 6 characters.",
  "auth/email-already-in-use": "That email is already in use.",
};

function setStatus(message, type = "info") {
  statusMessage.textContent = message;
  statusMessage.dataset.type = type;
}

function getCredentials() {
  return {
    email: emailInput.value.trim(),
    password: passwordInput.value,
  };
}

function validateCredentials({ email, password }) {
  if (!email || !password) {
    setStatus("Please enter both email and password.", "error");
    return false;
  }
  return true;
}

// Sign up new users with email and password.
signUpButton.addEventListener("click", async () => {
  const credentials = getCredentials();
  if (!validateCredentials(credentials)) return;

  try {
    const result = await createUserWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );
    setStatus(`Signed up as ${result.user.email}.`, "success");
  } catch (error) {
    const message = errorMessages[error.code] || error.message;
    setStatus(message, "error");
  }
});

// Sign in existing users with email and password.
signInButton.addEventListener("click", async () => {
  const credentials = getCredentials();
  if (!validateCredentials(credentials)) return;

  try {
    const result = await signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );
    setStatus(`Welcome back, ${result.user.email}!`, "success");
  } catch (error) {
    const message = errorMessages[error.code] || error.message;
    setStatus(message, "error");
  }
});

// Sign out current user.
signOutButton.addEventListener("click", async () => {
  try {
    await firebaseSignOut(auth);
    setStatus("Signed out successfully.", "success");
  } catch (error) {
    setStatus(error.message, "error");
  }
});

// Listen for authentication state changes to keep UI in sync.
onAuthStateChanged(auth, (user) => {
  if (user) {
    signOutButton.disabled = false;
    setStatus(`Signed in as ${user.email}.`, "success");
  } else {
    signOutButton.disabled = true;
    setStatus("Not signed in.", "info");
  }
});
