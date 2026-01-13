// chaiii 

document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "http://127.0.0.1:8000";
  const token = localStorage.getItem("token");

  /* ======================
     UI EFFECTS
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
        const res = await fetch(`${API_BASE}/auth/token`, {
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
     PROFILE FETCH (DASHBOARD)
  ====================== */
  const profileName = document.getElementById("profile-name");
  const profileRole = document.getElementById("profile-role");

  if (profileName && profileRole && token) {
    fetch(`${API_BASE}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
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

  /* ======================
     PROFILE IMAGE UPLOAD
  ====================== */
  const uploadBtn = document.getElementById("upload-btn");
  const imageInput = document.getElementById("profile-image");

  if (uploadBtn && imageInput && token) {
    uploadBtn.addEventListener("click", async () => {
      if (!imageInput.files.length) {
        alert("Please select an image first.");
        return;
      }

      const formData = new FormData();
      formData.append("image", imageInput.files[0]);

      try {
        const res = await fetch(`${API_BASE}/auth/upload-profile-image`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        });

        if (!res.ok) {
          alert("Upload failed.");
          return;
        }

        alert("Profile image uploaded successfully.");

      } catch (err) {
        console.error(err);
        alert("Upload error.");
      }
    });
  }

});
