// Firebase core + analytics (configuration must match exactly as provided).
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-analytics.js";
// Firebase Authentication module for email/password flows.
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
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

// Enable persistent login in local storage.
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.warn("Auth persistence error:", error);
});

// Cache UI elements.
const messageBox = document.getElementById("message");
const authTitle = document.getElementById("auth-title");
const authSubtitle = document.getElementById("auth-subtitle");
const screens = {
  login: document.getElementById("login-screen"),
  signup: document.getElementById("signup-screen"),
  reset: document.getElementById("reset-screen"),
  dashboard: document.getElementById("dashboard-screen"),
};
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const signupEmail = document.getElementById("signup-email");
const signupPassword = document.getElementById("signup-password");
const resetEmail = document.getElementById("reset-email");
const logoutButton = document.getElementById("logout");
const userEmailLabel = document.getElementById("user-email");

// Friendly auth messages for common errors.
const errorMessages = {
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/user-not-found": "No account found with that email.",
  "auth/wrong-password": "Incorrect password. Please try again.",
  "auth/email-already-in-use": "That email is already registered.",
  "auth/weak-password": "Password should be at least 6 characters.",
};

const screenTitles = {
  login: {
    title: "Sign in",
    subtitle: "Access your learning dashboard.",
  },
  signup: {
    title: "Create account",
    subtitle: "Get started with a new account.",
  },
  reset: {
    title: "Reset password",
    subtitle: "We will email you a reset link.",
  },
  dashboard: {
    title: "Dashboard",
    subtitle: "Your learning hub.",
  },
};

function setMessage(text, type = "info") {
  if (!text) {
    messageBox.textContent = "";
    messageBox.dataset.type = "info";
    messageBox.classList.add("hidden");
    return;
  }
  messageBox.textContent = text;
  messageBox.dataset.type = type;
  messageBox.classList.remove("hidden");
}

function showScreen(target) {
  Object.values(screens).forEach((screen) => screen.classList.remove("active"));
  screens[target].classList.add("active");
  authTitle.textContent = screenTitles[target].title;
  authSubtitle.textContent = screenTitles[target].subtitle;
}

function handleError(error) {
  const message = errorMessages[error.code] || error.message;
  setMessage(message, "error");
}

// Handle in-card screen navigation.
document.querySelectorAll("[data-target]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.target;
    showScreen(target.replace("-screen", ""));
    setMessage("");
  });
});

// Sign in flow.
screens.login.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = loginEmail.value.trim();
  const password = loginPassword.value;

  if (!email || !password) {
    setMessage("Enter your email and password.", "error");
    return;
  }

  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    setMessage(`Welcome back, ${result.user.email}!`, "success");
  } catch (error) {
    handleError(error);
  }
});

// Sign up flow.
screens.signup.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = signupEmail.value.trim();
  const password = signupPassword.value;

  if (!email || !password) {
    setMessage("Enter your email and password.", "error");
    return;
  }

  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    setMessage(`Account created for ${result.user.email}.`, "success");
  } catch (error) {
    handleError(error);
  }
});

// Reset password flow.
screens.reset.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = resetEmail.value.trim();

  if (!email) {
    setMessage("Enter your email to reset your password.", "error");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    setMessage("Password reset email sent successfully.", "success");
    showScreen("login");
  } catch (error) {
    handleError(error);
  }
});

// Sign out current user.
logoutButton.addEventListener("click", async () => {
  try {
    await firebaseSignOut(auth);
    setMessage("Signed out successfully.", "success");
    showScreen("login");
  } catch (error) {
    handleError(error);
  }
});

// Keep UI synced with auth state.
onAuthStateChanged(auth, (user) => {
  if (user) {
    userEmailLabel.textContent = `Logged in as ${user.email}`;
    showScreen("dashboard");
  } else {
    showScreen("login");
  }
});
