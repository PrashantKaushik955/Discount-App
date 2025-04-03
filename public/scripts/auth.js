// Signup Form Submission
document.getElementById("signupForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const password = document.getElementById("password").value;
  const isAdmin = document.getElementById("role").value;

  try {
    const response = await fetch("http://3.110.55.9:9000/api/v1/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, password, isAdmin }),
    });

    const result = await response.json();
    if (response.ok) {
      alert("Signup successful. Please check your email for OTP verification.");
      window.location.href = "verify-otp.html";
    } else {
      alert(result.message || "Signup failed. Please try again.");
    }
  } catch (error) {
    console.error("Error during signup:", error);
  }
});

// Login Form Submission
document.getElementById("loginForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://3.110.55.9:9000/api/v1/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

      const result = await response.json();
      // Debug the response to ensure `user.id` is included
      console.log("Login response:", result);
    if (response.ok) {
      alert("Login successful!");

      // Save access token and user ID in localStorage
      localStorage.setItem("token", result.accessToken); // Save JWT token
      localStorage.setItem("userId", result.user.id); // Save user ID from server response

      window.location.href = "index.html"; // Redirect to product page
    } else {
      alert(result.message || "Login failed. Please try again.");
    }
  } catch (error) {
    console.error("Error during login:", error);
  }
});

// OTP Verification Form Submission
document.getElementById("otpForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const otp = document.getElementById("otp").value;

  try {
    const response = await fetch("http://3.110.55.9:9000/api/v1/user/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const result = await response.json();
    if (response.ok) {
      alert("OTP verified successfully! Redirecting to login...");
      window.location.href = "login.html"; // Redirect to login page after successful verification
    } else {
      alert(result.message || "Invalid OTP. Please try again.");
    }
  } catch (error) {
    console.error("Error during OTP verification:", error);
  }
});

// Resend OTP Button Click
document.getElementById("resendOTP")?.addEventListener("click", async () => {
  const email = document.getElementById("email").value;

  if (!email) {
    alert("Please enter your email before resending OTP.");
    return;
  }

  try {
    const response = await fetch("http://3.110.55.9:9000/api/v1/user/resend-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();
    if (response.ok) {
      alert("OTP resent successfully. Please check your email.");
    } else {
      alert(result.message || "Failed to resend OTP. Please try again.");
    }
  } catch (error) {
    console.error("Error during OTP resend:", error);
  }
});
