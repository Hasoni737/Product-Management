let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let count = document.getElementById("count");
let category = document.getElementById("category");
let submit = document.getElementById("submit");

// Get data in localStorage
let dataProduct;
if (localStorage.products != null) {
  //=> if localStorage has data, set data in array
  dataProduct = JSON.parse(localStorage.products);
} else {
  //=> if localStorage not has data, array empty
  dataProduct = [];
}

// Get total
function getTotal() {
  if (price.value != "") {
    let result = +price.value + +taxes.value + +ads.value - discount.value;
    total.innerHTML = result;
    total.style.backgroundColor = "#26af26";
  } else {
    total.innerHTML = "";
    total.style.backgroundColor = "#ff5549";
  }
}

// CREATE
submit.onclick = function () {
  if (title.value != "" && price.value != "") {
    let newProduct = {
      title: title.value,
      price: price.value,
      taxes: taxes.value || 0,
      ads: ads.value || 0,
      discount: discount.value || 0,
      total: total.innerHTML,
      count: count.value,
      category: category.value || "Unknown",
    };

    // Repeat products
    if (newProduct.count > 1) {
      for (let i = 0; i < newProduct.count; i++) {
        dataProduct.push(newProduct);
      }
    } else {
      dataProduct.push(newProduct);
    }

    //==> set product in localStorage
    localStorage.setItem("products", JSON.stringify(dataProduct));

    //==> clear data
    clearData();

    //==> show data in table
    showData(dataProduct);

    //==> delete label title
    let tabelTitle = document.querySelector("#labelTitle");
    if (tabelTitle != null) {
      tabelTitle.remove();
    }
    //==> delete label price
    let labelPrice = document.querySelector("#labelPrice");
    if (labelPrice != null) {
      labelPrice.remove();
    }
  };
};

// READ
showData(dataProduct);
function showData(array) {
  let tbody = document.querySelector(".content-table tbody");
  //==> Empty table
  tbody.innerHTML = "";
  //==> Make sure data not empty
  if (dataProduct != null || dataProduct != []) {
    //==> Loop on each product and add table
    for (let i = 0; i < dataProduct.length; i++) {
      let content = `
        <td>${i + 1}</td>
        <td>${array[i].title}</td>
        <td>${array[i].price}$</td>
        <td>${array[i].taxes}$</td>
        <td>${array[i].ads}$</td>
        <td>${array[i].discount}$</td>
        <td>${array[i].total}$</td>
        <td>${array[i].category}</td>
        <td id="action">
          <button id="update" onclick="updateProduct(${i})">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button id="delete" onclick="deleteProduct(${i})">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </td>
      `;
      //==> Create row html
      let product = document.createElement("tr");
      product.innerHTML = content;
      //==> Add product in tbdoy Html
      tbody.append(product);
    }
    if (dataProduct.length > 0) {
      let deleteAll = document.getElementById("deleteAll");
      deleteAll.innerHTML = `
        <h3>Products</h3>
        <button onclick="deleteAll()">Delete All (${dataProduct.length})</button>
      `;
    } else {
      deleteAll.innerHTML = "";
    }
  }
}

// UPDATE
function updateProduct(index) {
  //=> Put data in inputs
  title.value = dataProduct[index].title;
  price.value = dataProduct[index].price;
  taxes.value = dataProduct[index].taxes;
  ads.value = dataProduct[index].ads;
  discount.value = dataProduct[index].discount;
  count.style.display = "none";
  category.value = dataProduct[index].category;

  //=> Hide create button
  submit.style.display = "none";

  //=> Get total
  getTotal();

  //=> Create Update button
  updateBtn = document.createElement("div");
  updateBtn.innerHTML = "Update";
  updateBtn.classList.add("update_btn");

  //=> Push Update button in page
  inputs = document.querySelector(".inputs");
  inputs.append(updateBtn);

  //=> Scroll top
  scroll({
    top: 0,
    behavior: "smooth",
  });

  //=> make user not can update two product in same time
  document.querySelectorAll("td#action button").forEach(function(button) {
    button.style.pointerEvents = "none";
  });

  //=> Update data
  updateBtn.onclick = function () {
    //=> Change value data
    dataProduct[index].title = title.value;
    dataProduct[index].price = price.value;
    dataProduct[index].taxes = taxes.value || 0;
    dataProduct[index].ads = ads.value || 0;
    dataProduct[index].discount = discount.value || 0;
    dataProduct[index].total = total.innerHTML;
    dataProduct[index].category = category.value;

    //=> Show create button and Count input
    submit.style.display = "block";
    count.style.display = "block";

    //=> Remove update button
    updateBtn.remove();

    //=> Show data in page and save in localStorage
    showData(dataProduct);
    localStorage.products = JSON.stringify(dataProduct);

    //=> Clear inputs
    clearData();
  };
}

// DELETE
function deleteProduct(index) {
  let confirmationDelet = document.querySelector(".confirmationDelete");
  let spanTitle = document.querySelector(".confirmationDelete p span");
  let yes = document.querySelector(".confirmationDelete #yes");
  let no = document.querySelector(".confirmationDelete #no");
  confirmationDelet.style.display = "flex";
  spanTitle.innerHTML = dataProduct[index].title;
  yes.onclick = function () {
    //=> delete product in array
    dataProduct.splice(index, 1);
    //=> Update localStorage
    localStorage.products = JSON.stringify(dataProduct);
    showData(dataProduct);
    confirmationDelet.style.display = "none";
  };
  no.onclick = function () {
    confirmationDelet.style.display = "none";
  };
}

// SEARCH
let searchMood = "title";
function getSearchMood(id) {
  //=> Get input
  let search = document.querySelector("#search");

  // If mood search by title
  if(id === "searchTitle") {
    searchMood = "title";
    search.placeholder = "Search By Title";
  }

  //=> If mood search by category
  else if (id === "searchCategory") {
    searchMood = "category";
    search.placeholder = "Search By Category";
  };

  //=> Focus in input
  search.focus();
  //=> Emptyed input
  search.value = "";
  //=> Show products
  showData(dataProduct);
};
function searchProduct(value) {
  //=> Search by Title
  if(searchMood == "title") {
    //=> Filter products and return prudcts includes value
    let productsTitle = dataProduct.filter(function(product) {
      if(product.title.toLowerCase().includes(value.toLowerCase())) {
        return product;
      };
    });

    //=> Show data in table
    showData(productsTitle);
  }
  //=> Search by Category
  else if(searchMood == "category") {
    //=> Filter products and return prudcts includes value
    let productsCategory = dataProduct.filter(function(product) {
      if(product.category.toLowerCase().includes(value.toLowerCase())) {
        return product;
      };

    });

    //=> Show data in table
    showData(productsCategory);
  };
};

// Clear inputs
function clearData() {
  title.value = "";
  price.value = "";
  taxes.value = "";
  ads.value = "";
  discount.value = "";
  total.innerHTML = "";
  total.style.backgroundColor = "#ff5549";
  count.value = "";
  category.value = "";
};

// Delete All
function deleteAll() {
  let form = document.createElement("div");
  form.innerHTML = `
  <div class="confirmationDeleteAll">
      <div class="text">
        <div class="icon">
          <i class="fa-solid fa-trash-can"></i>
        </div>
        <h3>Deleting All Products</h3>
        <p>Are you sure you want to delete <span>All Products</span>?</p>
      </div>
      <div class="action">
        <button id="yes">Yes, delete All Products</button>
        <button id="no">No, keep All Products</button>
      </div>
    </div>
  `;
  // Append form in page
  document.body.append(form);
  // Select element
  let confirmationDeletAll = document.querySelector(".confirmationDeleteAll");
  let yes = document.querySelector(".confirmationDeleteAll #yes");
  let no = document.querySelector(".confirmationDeleteAll #no");
  // If user click yes delete all products
  yes.onclick = function () {
    dataProduct.splice(0);
    localStorage.clear();
    showData();
    document.getElementById("deleteAll").innerHTML = "";
    confirmationDeletAll.remove();
  };
  // If user click no cancel delete all products
  no.onclick = function () {
    confirmationDeletAll.remove();
  };
}

// Clean data