const $products = document.querySelector(".products");
const $registerForm = document.querySelector("#register__form");
const $loginForm = document.querySelector("#login__form");
const $email = document.querySelector("#email");
const $username = document.querySelector("#username");
const $password = document.querySelector("#password");
const $firstname = document.querySelector("#firstname");
const $lastname = document.querySelector("#lastname");
const $city = document.querySelector("#city");
const $street = document.querySelector("#street");
const $number = document.querySelector("#number");
const $zipcode = document.querySelector("#zipcode");
const $lat = document.querySelector("#lat");
const $long = document.querySelector("#long");
const $phone = document.querySelector("#phone");
const $loginUsername = document.querySelector("#login__username");
const $loginPassword = document.querySelector("#login__password");

//------------Ro'yhatdan o'tish --------
$registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  fetch("https://fakestoreapi.com/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: $email.value,
      username: $username.value,
      password: $password.value,
      name: {
        firstname: $firstname.value,
        lastname: $lastname.value,
      },
      address: {
        city: $city.value,
        street: $street.value,
        number: $number.value,
        zipcode: $zipcode.value,
        geolocation: {
          lat: $lat.value,
          long: $long.value,
        },
      },
      phone: $phone.value,
    }),
  })
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
      // alert("Muvofaqiyatli ro'yhatdan o'tdingiz");
      alert(
        `Muvofaqiyatli ro'yhatdan o'tdingiz sizning ID raqamingiz: ${json.id}`
      );
    });
});

//-----------Tizimga kirish-------------
$loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  fetch("https://fakestoreapi.com/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: $loginUsername.value,
      password: $loginPassword.value,
    }),
  })
    .then((res) => res.json())
    // .then((json) => console.log(json))
    .then((data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
        if (localStorage.getItem("token")) {
          console.log(window.location.href);
          window.location.href = "/profile.html";
        }
      }
    })
    .catch((err) => console.error(err));
});

if (localStorage.getItem("token")) {
  console.log(window.location.href);
  window.location.href = "/profile.html";
}

//-------- 15tadan ko'p harfni kesadi...
function truncateWords(str) {
  if (str.split("").length > 15) {
    return str.split("").slice(0, 15).join("") + "...";
  }
  return str;
}

//-------------- Rating qilish YULDUZCHALARNI-------
function displayhtml(rate) {
  let textHtml = "";
  for (var star = 1; star <= 5; star++) {
    var class_name = "";
    if (Math.ceil(rate) >= star) {
      class_name = "text-warning";
    } else {
      class_name = "text-light";
    }

    textHtml += '<i class="fas fa-star ' + class_name + ' mr-1"></i>';
  }
  return textHtml;
}

//----------Produktni HTML ga chiqarish function----
function displayProducts(products) {
  products.forEach((prod) => {
    const produciEl = document.createElement("div");
    produciEl.classList.add("product");
    produciEl.innerHTML = `
      <div class="image__cover-inner">
            <img
              src="${prod.image}"
              class="image_cover"
            />
            <div class="image__cover--darkened"></div>
          </div>
          <div class="product__info">
            <div class="product__price">$${prod.price}</div>
            <div class="product__title">${truncateWords(prod.title)}</div>
            <div class="croduct__blog">
              <div class="product__category">${prod.category}</div>
              <div>
                ${displayhtml(prod.rating.rate)}
              </div>
            </div>
            <button id="${prod.id}" class="delete-btn">Delete product</button>
          </div>
      `;
    $products.appendChild(produciEl);
  });
}

//----------API dan products chiqarish-----------
fetch("https://fakestoreapi.com/products")
  .then((response) => response.json())
  // .then((data) => console.log(data))
  .then((data) => {
    displayProducts(data);
  });

$products.addEventListener("click", (e) => {
  console.log(e.target.id);
  if (e.target.className == "delete-btn") {
    const deletConfirm = confirm("O'chirishga rozimisiz?");
    if (deletConfirm) {
      fetch(`https://fakestoreapi.com/products/${e.target.id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((json) => {
          console.log(json);
          alert(`${json.id} : ID raqamli product o'chirildi`);
        });
    }
  }
});
