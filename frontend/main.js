// document.addEventListener("DOMContentLoaded", () => {
//   // ===== UI =====
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

//   const API_BASE = "http://127.0.0.1:8000"; // change if your API is elsewhere

//   // ===== SIGNUP handler =====
//   const signupForm = document.getElementById("signup-form");
//   if (signupForm) {
//     signupForm.addEventListener("submit", async (e) => {
//       e.preventDefault(); // prevents default GET that places fields in URL

//       const name = document.getElementById("name")?.value.trim() || "";
//       const email = document.getElementById("email")?.value.trim() || "";
//       const role = document.getElementById("role")?.value.trim() || "member";
//       const password1 = document.getElementById("password1")?.value || "";
//       const password2 = document.getElementById("password2")?.value || "";

//       if (!name || !email || !password1) {
//         alert("Name, email and password are required.");
//         return;
//       }
//       if (password1 !== password2) {
//         alert("Passwords do not match.");
//         return;
//       }

//       try {
//         const res = await fetch(`${API_BASE}/register`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ name, email, role, password: password1 }),
//           cache: "no-store"
//         });

//         // Defense: try to parse JSON, but handle non-JSON responses
//         const payload = await res.json().catch(() => null);

//         if (!res.ok) {
//           // show backend message if present
//           const msg = payload?.detail || payload?.message || `Register failed (${res.status})`;
//           alert(msg);
//           return;
//         }

//         // success: either redirect to login or auto-login
//         alert("Registration successful. Redirecting to login...");
//         window.location.href = "login.html";
//       } catch (err) {
//         console.error("Signup error:", err);
//         alert("Network error. Backend not reachable.");
//       }
//     });
//   }

//   // ===== LOGIN handler =====
//   const loginForm = document.getElementById("login-form");
//   if (loginForm) {
//     loginForm.addEventListener("submit", async (e) => {
//       e.preventDefault();

//       const email = document.getElementById("email")?.value.trim() || "";
//       const password = document.getElementById("password")?.value || "";

//       if (!email || !password) {
//         alert("Please enter email and password.");
//         return;
//       }

//       try {
//         const res = await fetch(`${API_BASE}/token`, {
//           method: "POST",
//           headers: { "Content-Type": "application/x-www-form-urlencoded" },
//           body: new URLSearchParams({ username: email, password }),
//           cache: "no-store"
//         });

//         const data = await res.json().catch(() => null);

//         if (!res.ok) {
//           const msg = data?.detail || `Login failed (${res.status})`;
//           alert(msg);
//           return;
//         }

//         // store token and redirect
//         // localStorage.setItem("access_token", data.access_token);
//         localStorage.setItem("token", data.access_token);
//         window.location.href = "dashboard.html";
//       } catch (err) {
//         console.error("Login error:", err);
//         alert("Network error. Backend not reachable.");
//       }
//     });
//   }

//   fetch("http://127.0.0.1:8000/auth/profile", {
//   headers: {
//     "Authorization": `Bearer ${localStorage.getItem("token")}`
//   }
// })

// const formData = new FormData();
// formData.append("image", file);

// fetch("/auth/upload-profile-image", {
//   method: "POST",
//   headers: {
//     "Authorization": `Bearer ${token}`
//   },
//   body: formData
// });


// });

document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "http://127.0.0.1:8000";
  const token = localStorage.getItem("token");

  /* ======================
     UI EFFECTS (SAFE)
  ====================== */
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

  /* ======================
     SIGNUP
  ====================== */
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const role = document.getElementById("role").value.trim() || "member";
      const password1 = document.getElementById("password1").value;
      const password2 = document.getElementById("password2").value;

      if (!name || !email || !password1) {
        alert("All required fields must be filled.");
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
          body: JSON.stringify({
            name,
            email,
            role,
            password: password1
          })
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.detail || "Signup failed.");
          return;
        }

        alert("Signup successful. Please log in.");
        window.location.href = "login.html";

      } catch (err) {
        console.error(err);
        alert("Backend not reachable.");
      }
    });
  }

  /* ======================
     LOGIN
  ====================== */
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      if (!email || !password) {
        alert("Email and password required.");
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({
            username: email,
            password: password
          })
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.detail || "Invalid credentials.");
          return;
        }

        localStorage.setItem("token", data.access_token);
        window.location.href = "dashboard.html";

      } catch (err) {
        console.error(err);
        alert("Backend not reachable.");
      }
    });
  }

  /* ======================
     AUTH-GATED UI
  ====================== */
  const notice = document.getElementById("notice");
  if (notice && token) {
    fetch(`${API_BASE}/verify-token`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error();
        notice.style.display = "block";
      })
      .catch(() => {
        localStorage.removeItem("token");
        notice.style.display = "none";
      });
  }

  /* ======================
     PROFILE FETCH (DASHBOARD ONLY)
  ====================== */
  const profileName = document.getElementById("profile-name");
  const profileRole = document.getElementById("profile-role");

  if (profileName && profileRole && token) {
    fetch(`${API_BASE}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        profileName.textContent = data.name;
        profileRole.textContent = data.role;
      })
      .catch(() => {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        window.location.href = "login.html";
      });
  }

});
