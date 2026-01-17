$(".menu > ul > li").click(function (e) {
    $(this).siblings().removeClass("active");

    $(this).toggleClass("active");

    $(this).find("ul").slideToggle();

    $(this).siblings().find("ul").slideUp();

    $(this).siblings().find("ul").find("li").removeClass("active");
});

$(".menu-btn").click(function () {
    $(".sidebar").toggleClass("active");
});


// document.addEventListener("DOMContentLoaded", async () => {
//     try {
//         const token = localStorage.getItem("token");

//         if (!token) return;

//         const res = await fetch("http://127.0.0.1:8000/auth/profile", {
//             headers: {
//                 Authorization: `Bearer ${token}`
//             }
//         });

//         const user = await res.json();

//         document.getElementById("userName").textContent =
//             `Welcome, ${user.name}`;

//         document.getElementById("userRole").textContent =
//             user.role;

//         // document.getElementById("welcomeUserName").textContent =
//         //     `Welcome, ${user.name}`;


//     } catch (err) {
//         console.error(err);
//     }
// });