// document.addEventListener("DOMContentLoaded", () => {
//   // ===== UI STUFF =====
//   const mouseBg = document.querySelector(".mouse-bg");
//   if (mouseBg) {
//     document.addEventListener("mousemove", (e) => {
//       mouseBg.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
//     });
//   }

//   const hamburger = document.getElementById("hamburger");
//   const navLinks = document.querySelector(".nav-links");

//   if (hamburger && navLinks) {
//     hamburger.addEventListener("click", () => {
//       navLinks.classList.toggle("active");
//       hamburger.classList.toggle("active");
//     });
//   }

//   // ===== SIGNUP FORM =====
//   const form = document.getElementById("signup-form");
//   if (!form) return; // prevents crash on other pages

//   form.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const name = document.getElementById("name").value.trim();
//     const email = document.getElementById("email").value.trim();
//     const role = document.getElementById("role").value.trim();
//     const password1 = document.getElementById("password1").value;
//     const password2 = document.getElementById("password2").value;

//     if (password1 !== password2) {
//       alert("Passwords do not match");
//       return;
//     }

//     const payload = {
//       name,
//       email,
//       role,
//       password: password1
//     };

//     try {
//       const res = await fetch("http://127.0.0.1:8000/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload)
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         alert(data.detail || "Signup failed");
//         return;
//       }

//       // ✅ success → go to login
//       window.location.href = "login.html";

//     } catch (err) {
//       console.error(err);
//       alert("Backend not reachable");
//     }
//   });
// });


// document.addEventListener("DOMContentLoaded", () => {
//   const form = document.getElementById("login-form");
//   if (!form) return;

//   form.addEventListener("submit", async (e) => {
//     e.preventDefault(); // 🔐 stops URL params & reload

//     const email = document.getElementById("email").value.trim();
//     const password = document.getElementById("password").value;

//     const strongPwd =
//   password1.length >= 8 &&
//   /[A-Z]/.test(password1) &&
//   /[a-z]/.test(password1) &&
//   /[0-9]/.test(password1) &&
//   /[^A-Za-z0-9]/.test(password1);

// if (!strongPwd) {
//   alert("Password must be 8+ chars, include upper, lower, number & symbol");
//   return;
// }


//     try {
//       const res = await fetch("http://127.0.0.1:8000/token", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded"
//         },
//         body: new URLSearchParams({
//           username: email,   // OAuth2 expects `username`
//           password: password
//         })
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         alert(data.detail || "Login failed");
//         return;
//       }

//       // ✅ store token
//       localStorage.setItem("access_token", data.access_token);

//       // ✅ redirect AFTER success
//       window.location.href = "index.html";

//     } catch (err) {
//       console.error(err);
//       alert("Backend not reachable");
//     }
//   });
// });


// document.addEventListener("DOMContentLoaded", () => {
//   const form = document.getElementById("login-form");
//   if (!form) return;

//   form.addEventListener("submit", async (e) => {
//     e.preventDefault(); // stop normal submit (and avoid password in URL)

//     const email = document.getElementById("email")?.value?.trim() || "";
//     const password = document.getElementById("password")?.value || "";

//     // Optional: simple client-side sanity check (use `password` here)
//     if (!email || !password) {
//       alert("Please enter email and password.");
//       return;
//     }

//     // (Optional) password strength check for sign-up only; keep login simple:
//     // if (password.length < 8) { alert("Password must be at least 8 chars"); return; }

//     try {
//       const res = await fetch("http://127.0.0.1:8000/token", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded"
//         },
//         body: new URLSearchParams({
//           username: email,
//           password: password
//         }),
//         cache: "no-store" // avoid cached responses for auth calls
//       });

//       const data = await res.json().catch(() => ({ detail: "Invalid response" }));

//       if (!res.ok) {
//         alert(data.detail || `Login failed (${res.status})`);
//         return;
//       }

//       // store token and redirect
//       localStorage.setItem("access_token", data.access_token);
//       window.location.href = "index.html";
//     } catch (err) {
//       console.error("Login error:", err);
//       alert("Network error. Backend not reachable.");
//     }
//   });
// });

document.addEventListener("DOMContentLoaded", () => {
  // ===== UI =====
  const mouseBg = document.querySelector(".mouse-bg");
  if (mouseBg) {
    document.addEventListener("mousemove", (e) => {
      mouseBg.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });
  }

  const hamburger = document.getElementById("hamburger");
  const navLinks = document.querySelector(".nav-links");
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      hamburger.classList.toggle("active");
    });
  }

  const API_BASE = "http://127.0.0.1:8000"; // change if your API is elsewhere

  // ===== SIGNUP handler =====
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault(); // prevents default GET that places fields in URL

      const name = document.getElementById("name")?.value.trim() || "";
      const email = document.getElementById("email")?.value.trim() || "";
      const role = document.getElementById("role")?.value.trim() || "member";
      const password1 = document.getElementById("password1")?.value || "";
      const password2 = document.getElementById("password2")?.value || "";

      if (!name || !email || !password1) {
        alert("Name, email and password are required.");
        return;
      }
      if (password1 !== password2) {
        alert("Passwords do not match.");
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, role, password: password1 }),
          cache: "no-store"
        });

        // Defense: try to parse JSON, but handle non-JSON responses
        const payload = await res.json().catch(() => null);

        if (!res.ok) {
          // show backend message if present
          const msg = payload?.detail || payload?.message || `Register failed (${res.status})`;
          alert(msg);
          return;
        }

        // success: either redirect to login or auto-login
        alert("Registration successful. Redirecting to login...");
        window.location.href = "login.html";
      } catch (err) {
        console.error("Signup error:", err);
        alert("Network error. Backend not reachable.");
      }
    });
  }

  // ===== LOGIN handler =====
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email")?.value.trim() || "";
      const password = document.getElementById("password")?.value || "";

      if (!email || !password) {
        alert("Please enter email and password.");
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/token`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ username: email, password }),
          cache: "no-store"
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          const msg = data?.detail || `Login failed (${res.status})`;
          alert(msg);
          return;
        }

        // store token and redirect
        localStorage.setItem("access_token", data.access_token);
        window.location.href = "index.html";
      } catch (err) {
        console.error("Login error:", err);
        alert("Network error. Backend not reachable.");
      }
    });
  }
});