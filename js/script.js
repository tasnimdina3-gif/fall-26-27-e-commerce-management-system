function readUsers() {
    let users = [];
    let count = localStorage.getItem("userCount");
    if (count === null) return users;
    count = Number(count);
    for (let i = 0; i < count; i++) {
        let user = {
            name: localStorage.getItem("user" + i + "_name"),
            email: localStorage.getItem("user" + i + "_email"),
            phone: localStorage.getItem("user" + i + "_phone"),
            gender: localStorage.getItem("user" + i + "_gender"),
            city: localStorage.getItem("user" + i + "_city"),
            address: localStorage.getItem("user" + i + "_address"),
            password: localStorage.getItem("user" + i + "_password"),
            type: localStorage.getItem("user" + i + "_type")
        };
        users.push(user);
    }
    return users;
}

function saveUsers(users) {
    localStorage.setItem("userCount", users.length);
    for (let i = 0; i < users.length; i++) {
        localStorage.setItem("user" + i + "_name", users[i].name);
        localStorage.setItem("user" + i + "_email", users[i].email);
        localStorage.setItem("user" + i + "_phone", users[i].phone);
        localStorage.setItem("user" + i + "_gender", users[i].gender);
        localStorage.setItem("user" + i + "_city", users[i].city);
        localStorage.setItem("user" + i + "_address", users[i].address);
        localStorage.setItem("user" + i + "_password", users[i].password);
        localStorage.setItem("user" + i + "_type", users[i].type);
    }
}

function validateSignupForm() {

    let ids = ["fullNameErr", "emailErr", "phoneErr", "genderErr",
        "cityErr", "addressErr", "passwordErr", "confirmPasswordErr", "termsErr"];
    for (let i = 0; i < ids.length; i++) {
        let span = document.getElementById(ids[i]);
        if (span !== null) span.innerHTML = "";
    }
    let oldMsg = document.getElementById("signupMessage");
    if (oldMsg !== null) oldMsg.innerHTML = "";

    let fullName = document.getElementById("fullName").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let gender = document.querySelector('input[name="gender"]:checked');
    let city = document.getElementById("city").value;
    let address = document.getElementById("address").value.trim();
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    let terms = document.getElementById("terms").checked;
    let userType = document.querySelector('input[name="userType"]:checked');

    let ok = true;

    function err(id, msg) {
        let span = document.getElementById(id);
        if (span === null) {
            span = document.createElement("span");
            span.id = id;
            span.style.color = "red";
            span.style.display = "block";
            span.style.fontSize = "0.85rem";
            let fieldId = id.replace("Err", "");
            let field = document.getElementById(fieldId);
            if (field === null && fieldId === "gender") field = document.getElementById("male");
            if (field !== null) field.parentNode.appendChild(span);
        }
        span.innerHTML = msg;
        ok = false;
    }

    if (fullName === "") err("fullNameErr", "Full name is required");
    else if (fullName.length < 3) err("fullNameErr", "At least 3 characters required");
    else if (/[0-9]/.test(fullName)) err("fullNameErr", "Full name cannot contain digits");

    if (email === "") err("emailErr", "Email is required");
    else if (email.indexOf("@") === -1 || email.indexOf(".") === -1)
        err("emailErr", "Enter a valid email");

    if (phone === "") err("phoneErr", "Phone is required");
    else if (phone.length !== 11 || isNaN(phone) || !phone.startsWith("01"))
        err("phoneErr", "11 digits starting with 01");

    if (!gender) err("genderErr", "Please select your gender");
    if (city === "") err("cityErr", "Please select a city");
    if (address === "") err("addressErr", "Address is required");

    if (password.length < 8) err("passwordErr", "Password must be at least 8 characters");
    if (password !== confirmPassword) err("confirmPasswordErr", "Passwords do not match");
    if (!terms) err("termsErr", "You must agree to the Terms and Privacy Policy");

    if (!ok) return false;

    let users = readUsers();
    for (let i = 0; i < users.length; i++) {
        if (users[i].email === email) {
            err("emailErr", "This email is already registered");
            return false;
        }
    }

    let newUser = {
        name: fullName,
        email: email,
        phone: phone,
        gender: gender.value,
        city: city,
        address: address,
        password: password,
        type: userType.value
    };
    users.push(newUser);
    saveUsers(users);

    let msg = document.getElementById("signupMessage");
    if (msg === null) {
        msg = document.createElement("p");
        msg.id = "signupMessage";
        msg.style.color = "green";
        msg.style.fontWeight = "bold";
        let form = document.getElementById("fullName").form;
        form.parentNode.insertBefore(msg, form.nextSibling);
    }
    msg.innerHTML = "Sign up successful. You can now login.";

    document.getElementById("fullName").form.reset();
    return false;
}

function readCart() {
    let cart = [];
    let count = localStorage.getItem("cartCount");
    if (count === null) return cart;
    count = Number(count);
    for (let i = 0; i < count; i++) {
        let item = {
            name: localStorage.getItem("cart" + i + "_name"),
            price: Number(localStorage.getItem("cart" + i + "_price")),
            qty: Number(localStorage.getItem("cart" + i + "_qty"))
        };
        cart.push(item);
    }
    return cart;
}

function saveCart(cart) {
    localStorage.setItem("cartCount", cart.length);
    for (let i = 0; i < cart.length; i++) {
        localStorage.setItem("cart" + i + "_name", cart[i].name);
        localStorage.setItem("cart" + i + "_price", cart[i].price);
        localStorage.setItem("cart" + i + "_qty", cart[i].qty);
    }
}

function addToCart(name, price) {
    let cart = readCart();
    let found = false;

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].name === name) {
            cart[i].qty = cart[i].qty + 1;
            found = true;
        }
    }

    if (found === false) {
        cart.push({ name: name, price: price, qty: 1 });
    }

    saveCart(cart);
}

let productCards = document.querySelectorAll(".product-card");
for (let i = 0; i < productCards.length; i++) {
    let card = productCards[i];
    let addButton = card.querySelector("button");
    if (addButton === null) continue;

    addButton.addEventListener("click", function () {
        let name = card.querySelector("p").innerHTML.trim();
        let priceText = card.querySelector("h2").innerHTML;
        let price = Number(priceText.replace(/[^0-9.]/g, ""));

        addToCart(name, price);
        addButton.innerHTML = "Added ✓";
    });
}

function showCart() {
    let cart = readCart();
    let box = document.getElementById("cartItems");
    let total = 0;
    let html = "";

    for (let i = 0; i < cart.length; i++) {
        total = total + cart[i].price * cart[i].qty;

        html += '<p class="productNames">' + cart[i].name + "</p>";
        html += '<p class="productPrice">$' + cart[i].price + " x " + cart[i].qty +
            " = $" + (cart[i].price * cart[i].qty) + "</p>";
        html += '<button class="btnPlus">+</button> ';
        html += '<button class="btnMinus">-</button>';
    }

    if (cart.length === 0) {
        html = "<p>Your cart is empty.</p>";
    }

    box.innerHTML = html;
    document.getElementById("cartTotal").innerHTML = "$" + total;

    let plusButtons = box.querySelectorAll(".btnPlus");
    for (let i = 0; i < plusButtons.length; i++) {
        plusButtons[i].addEventListener("click", function () {
            let cart2 = readCart();
            cart2[i].qty = cart2[i].qty + 1;
            saveCart(cart2);
            showCart();
        });
    }

    let minusButtons = box.querySelectorAll(".btnMinus");
    for (let i = 0; i < minusButtons.length; i++) {
        minusButtons[i].addEventListener("click", function () {
            let cart2 = readCart();
            cart2[i].qty = cart2[i].qty - 1;

            if (cart2[i].qty === 0) {
                cart2.splice(i, 1);
            }

            saveCart(cart2);
            showCart();
        });
    }
}

if (document.getElementById("cartItems") !== null) {
    showCart();
}

function updateUserInfo() {
    let box = document.getElementById("userInfo");
    if (box === null) return;

    let loggedUser = localStorage.getItem("loggedInUser");

    if (loggedUser === null) {
        box.innerHTML =
            '<a href="login.html" class="btn btn-small btn-light">Login</a>' +
            '<a href="signup.html" class="btn btn-small">Sign Up</a>';
    } else {
        box.innerHTML =
            '<span style="color:white; font-weight:bold;">Hi, ' + loggedUser + '</span>' +
            '<button type="button" class="btn btn-small btn-danger" id="btnLogout">Logout</button>';

        document.getElementById("btnLogout").addEventListener("click", function () {
            localStorage.removeItem("loggedInUser");
            localStorage.removeItem("loggedInType");
            updateUserInfo();
        });
    }
}

updateUserInfo();

if (document.getElementById("selectedPaymentMethod") !== null) {

    document.querySelector('#BkashForm input[name="bkashOTP"]').id = "bkashOTP";

    let allForms = ["visaForm", "mastercardForm", "BkashForm", "NagadForm"];
    let paymentRadios = document.querySelectorAll('input[name="payment"]');

    function showForm(formId) {
        for (let i = 0; i < allForms.length; i++) {
            if (allForms[i] === formId) {
                document.getElementById(allForms[i]).style.display = "block";
            } else {
                document.getElementById(allForms[i]).style.display = "none";
            }
        }
    }

    showForm("");

    for (let i = 0; i < paymentRadios.length; i++) {
        paymentRadios[i].addEventListener("change", function () {
            showForm(this.value + "Form");
        });
    }

    for (let i = 0; i < allForms.length; i++) {
        let currentForm = document.querySelector("#" + allForms[i] + " form");
        if (currentForm === null) {
            continue;
        }

        currentForm.addEventListener("submit", function (event) {
            event.preventDefault();

            let fields = this.querySelectorAll("input[required]");
            for (let j = 0; j < fields.length; j++) {
                if (fields[j].value.trim() === "") {
                    alert("Please fill all fields");
                    return;
                }
            }

            alert("Payment successful");
            this.reset();
        });
    }
}