//! ***********************************Enhanced Code ********************************
//? Encapsulate all the functions and Variables
var pManger = {
    // ! ***********************************Add Products**********************************************
    productName: document.getElementById("productName"),
    productPrice: document.getElementById("productPrice"),
    productCategory: document.getElementById('productCat'),
    productDescription: document.getElementById('productDesc'),
    addBtn: document.getElementById("addBtn"),
    updateBtn: document.getElementById("updateBtn"),
    logoutBtn: document.getElementById("logOut"),
    localStorageName: "productStorage",
    emailInput: document.getElementById("Email"),
    searchTermValue: "",
    foundedItems: [],
    cloneFounded: [],
    pList: [],
    checkedList: [],
    indexing: 0,
    //! ***********************************functions*******************************************
    //? check if there is a local storage for the localStorageName or not  set local storage for the product
    invokedLocal: function () {
        if (localStorage.getItem(this.localStorageName) !== null) {
            this.pList = JSON.parse(localStorage.getItem(this.localStorageName));
            this.showProducts(this.pList);
        } else {
            this.pList = [];
        }
        this.showProducts(this.pList);
    },
    addProductStorage: function (pStorage) {
        localStorage.setItem(this.localStorageName, JSON.stringify(pStorage));
    },
    putEmailOnNav: function () {
        let userEmail = localStorage.getItem('isLoggedInEmail');
        this.emailInput.innerHTML = userEmail;
    },
    logOutOperation: function () {
        this.logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('isLoggedInEmail');
            this.showLoadingScreen();
        })
    },
    backToLogin: function () {
        if (localStorage.getItem('isLoggedInEmail') === null) {
            this.showLoadingScreen();
        }
    },
    showLoadingScreen: function () {
        const loadingScreen = document.getElementById('loadingScreen');
        const mainSection = document.querySelector('.mainSection');
        loadingScreen.classList.replace('d-none', 'd-flex');
        mainSection.classList.replace('visible', 'invisible');
        const currentPath = window.location.pathname;
        if ((currentPath).includes("LoginSys")){
            setTimeout(function () {
                window.location.replace("/LoginSys");
            }, 3000);
        }else{
            setTimeout(function () {
                window.location.replace("/");
            }, 3000);
        }
    },
    //! ***********************************Add Products************************************************
    // ? crate function to generate ids for evey product
    generateUniqueId: function () {
        return this.pList.length > 0 ? this.pList[this.pList.length - 1].id + 1 : 1;
    },
    //? create a function to add products and object to pList and add them to local storage
    addProducts: function () {
        //? check Validation before adding products
        if (this.validation()) {
            var products = {
                id: this.generateUniqueId(),
                pName: this.productName.value,
                pPrice: this.productPrice.value,
                pCategory: this.productCategory.value,
                pDescription: this.productDescription.value,
                pLastUpdate: this.currentMoment()
            }
            this.pList.push(products);
            this.addProductStorage(this.pList);
            this.updateInputValue();
            this.showProducts(this.pList);
            this.clearValidation();
            Swal.fire({
                title: 'Success!',
                text: 'Product Added Successfully',
                icon: 'success',
                background: '#121013ce',
                color: 'white',
                showConfirmButton: false,
                iconColor: '#9122f3',
                timer: 1000
            });
        } else {
            Swal.fire({
                title: 'Error!',
                text: 'Please fill all the fields',
                icon: 'warning',
                background: '#121013ce',
                color: 'white',
                iconColor: '#cb1375',
                confirmButtonColor: '#6b1e7b',
                cancelButtonColor: '#6b1e7b',
                confirmButtonText: 'Ok',
            })
        }
    },
    //! ***********************************Show Products*********************************************
    //? show products from local storage inside table in html
    showProducts: function (pShow) {
        let productList = pShow.length > 0 ? pShow : this.pList;
        let content = "";
        for (let i = 0; i < productList.length; i++) {
            let productName = productList[i].newProductName ? productList[i].newProductName : productList[i].pName;
            content += `
                <tr>
                    <th> <input type="checkbox" class="form-check-input non-click" id="checkBox${productList[i].id}" oninput="pManger.pushCheckedProduct(${productList[i].id})"> </th>
                    <th class="text-white fw-bold" scope="row "> ${i + 1}</th>
                    <td class="text-white fw-bold">${this.getHighlightedProductName(productName)}</td>
                    <td class="text-white fw-bold">${productList[i].pPrice}</td>
                    <td class="text-white fw-bold">${productList[i].pCategory}</td>
                    <td class="text-white fw-bold">${productList[i].pDescription}</td>
                    <td class="text-white fw-bold">${productList[i].pLastUpdate}</td>
                    <td> <button class="btn btn-warning btn-sm text-uppercase fw-bold" onclick="pManger.pullUpdateValue(${productList[i].id})"><i class="fa-solid fa-pen-to-square"></i></button> </td>
                    <td>
                        <button class="btn btn-danger btn-sm text-uppercase fw-bold" onclick="pManger.delCurrentProduct(${productList[i].id})">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </td>
                </tr>
            `;
        }
        document.getElementById("tbody").innerHTML = content;
    },
    getHighlightedProductName: function (productName) {
        if (this.searchTermValue !== "") {
            const regex = new RegExp(this.searchTermValue, "ig");
            return productName.replace(regex, match => `<span class="text-danger">${match}</span>`);
        }
        return productName;
    },
    //! ***********************************Add Update Inputs**********************************************
    updateInputValue: function (inputValue) {
        this.productName.value = inputValue ? inputValue.pName : '';
        this.productPrice.value = inputValue ? inputValue.pPrice : '';
        this.productCategory.value = inputValue ? inputValue.pCategory : "Select Category";
        this.productDescription.value = inputValue ? inputValue.pDescription : '';
    },
    //! ***********************************Delete  Product*************************************************
    //? create a function to delete all products
    dellAllProducts: function () {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This action will delete all products. This cannot be undone!',
            icon: 'warning',
            background: '#121013ce',
            color: 'white',
            showCancelButton: true,
            iconColor: '#cb1375',
            confirmButtonColor: '#6b1e7b',
            cancelButtonColor: '#6b1e7b',
            confirmButtonText: 'Yes, save changes!',
            cancelButtonText: 'No, cancel!'
        }).then((result) => {
            if (result.isConfirmed) {
                if (this.pList.length > 0) {
                    localStorage.clear();
                    this.pList = [];
                    this.showProducts(this.pList);
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'All products deleted',
                        icon: 'success',
                        background: '#121013ce',
                        color: 'white',
                        showConfirmButton: false,
                        iconColor: '#9122f3',
                        timer: 1500
                    });
                } else {
                    Swal.fire({
                        title: 'Error!',
                        text: 'There is no products to delete',
                        icon: 'warning',
                        background: '#121013ce',
                        color: 'white',
                        showConfirmButton: false,
                        iconColor: '#cb1375',
                        timer: 1500
                    });
                }
            }
        });
    },
    //? delete current product from local storage and send new plist to showProducts
    delCurrentProduct: function (id) {
        var productList = this.foundedItems.length > 0 ? this.foundedItems : this.pList;
        var indexToDelete = productList.findIndex(product => product.id === id);
        if (indexToDelete !== -1) {
            Swal.fire({
                title: 'Are you sure?',
                text: 'This action will delete the selected product. This cannot be undone!',
                icon: 'warning',
                background: '#121013ce',
                color: 'white',
                showCancelButton: true,
                iconColor: '#cb1375',
                confirmButtonColor: '#6b1e7b',
                cancelButtonColor: '#6b1e7b',
                confirmButtonText: 'Yes, save changes!',
                cancelButtonText: 'No, cancel!'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Remove the product from both the productList and pList
                    var deletedProduct = productList.splice(indexToDelete, 1)[0];
                    var pListIndexToDelete = this.pList.findIndex(product => product.id === id);
                    if (pListIndexToDelete !== -1) {
                        this.pList.splice(pListIndexToDelete, 1);
                    }
                    this.addProductStorage(this.pList);
                    this.searchTermValue = "";
                    document.getElementById('search').value = "";
                    this.searchProducts("");
                    this.showProducts(productList);
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'The selected product has been deleted.',
                        icon: 'success',
                        background: '#121013ce',
                        color: 'white',
                        showConfirmButton: false,
                        iconColor: '#9122f3',
                        timer: 1500
                    });
                }
            });
        } else {
            Swal.fire('Product not found.', '', 'error');
        }
    }
    ,
    //? push checked product to new list and delete checked product local storage and send new plist to showProducts
    pushCheckedProduct: function (iterator) {
        let checkedProduct = document.getElementById(`checkBox${iterator}`);
        checkedProduct.checked
            ? this.checkedList.push(this.pList.find(product => product.id === iterator))
            : this.checkedList = this.checkedList.filter(product => product.id !== iterator);
        this.checkedList.length > 0
            ? document.getElementById('delSelectBtn').classList.remove('disabled')
            : document.getElementById('delSelectBtn').classList.add('disabled')
    },
    delSelectedProducts: function () {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This action will delete selected products. This cannot be undone!',
            icon: 'warning',
            background: '#121013ce',
            color: 'white',
            showCancelButton: true,
            iconColor: '#cb1375',
            confirmButtonColor: '#6b1e7b',
            cancelButtonColor: '#6b1e7b',
            confirmButtonText: 'Yes, save changes!',
            cancelButtonText: 'No, cancel!'
        }).then((result) => {
            if (result.isConfirmed) {
                // Merge both pList and foundedItems arrays to create a unified list
                let productList = this.foundedItems.length > 0 ? [...this.foundedItems] : [...this.pList];
                // Remove checked products from the unified productList
                productList = productList.filter(product => !this.checkedList.includes(product));
                // If searching, update both pList and foundedItems arrays
                if (this.foundedItems.length > 0) {
                    this.pList = productList.filter(product => !product.newProductName);
                    this.foundedItems = productList.filter(product => product.newProductName);
                } else {
                    // If not searching, update only pList array
                    this.pList = productList;
                }
                // Clear newProductName property from pList items
                this.pList.forEach(product => delete product.newProductName);
                this.searchTermValue = "";
                document.getElementById('search').value = "";
                this.searchProducts("");
                this.addProductStorage(this.pList);
                this.checkedList = [];
                this.showProducts(productList);
                document.getElementById('delSelectBtn').classList.add('disabled');
                Swal.fire({
                    title: 'Deleted!',
                    text: 'The selected products have been deleted.',
                    icon: 'success',
                    background: '#121013ce',
                    color: 'white',
                    showConfirmButton: false,
                    iconColor: '#9122f3',
                    timer: 1500
                });
            } else {
                this.checkedList = [];
                document.getElementById('delSelectBtn').classList.add('disabled');
            }
        });
    },


    //! *******************************Update & Edit Product****************************
    //? pull all products values from showProducts and put them in updateInputValue 
    pullUpdateValue: function (currentIndex) {
        let productList = this.foundedItems.length > 0 ? this.foundedItems : this.pList;
        let productToUpdate = productList.find(product => product.id === currentIndex);
        this.updateInputValue(productToUpdate);
        this.addBtn.classList.add("d-none");
        this.updateBtn.classList.replace("d-none", "d-block");
        this.indexing = productList.indexOf(productToUpdate);
    },
    //? push new product values to pList and send new plist to showProducts and localStorage then clear inputs fields 
    pushUpdateValue: function () {
        if (this.validation()) {
            Swal.fire({
                title: 'Save Changes?',
                text: 'Are you sure you want to save the changes?',
                icon: 'warning',
                background: '#121013ce',
                color: 'white',
                showCancelButton: true,
                iconColor: '#cb1375',
                confirmButtonColor: '#6b1e7b',
                cancelButtonColor: '#6b1e7b',
                confirmButtonText: 'Yes, save changes!',
                cancelButtonText: 'No, cancel!'
            }).then((result) => {
                if (result.isConfirmed) {
                    let productList = this.foundedItems.length > 0 ? this.foundedItems : this.pList;
                    productList[this.indexing].pName = this.productName.value;
                    productList[this.indexing].pPrice = this.productPrice.value;
                    productList[this.indexing].pCategory = this.productCategory.value;
                    productList[this.indexing].pDescription = this.productDescription.value;
                    productList[this.indexing].pLastUpdate = this.currentMoment();
                    this.showProducts(productList);
                    this.addProductStorage(this.pList);
                    this.updateInputValue();
                    this.addBtn.classList.replace("d-none", "d-block");
                    this.updateBtn.classList.replace("d-block", "d-none");
                    this.clearValidation();
                    this.showProducts(this.pList);
                    this.searchProducts(this.searchTermValue);
                    Swal.fire({
                        title: 'Saved!',
                        text: 'The changes have been saved.',
                        icon: 'success',
                        background: '#121013ce',
                        color: 'white',
                        showConfirmButton: false,
                        iconColor: '#9122f3',
                        timer: 1500
                    });
                } else {
                    this.addBtn.classList.replace("d-none", "d-block");
                    this.updateBtn.classList.replace("d-block", "d-none");
                    this.updateInputValue();
                    this.clearValidation();
                }
            });
        }
    },
    //! ********************************Search for Product**********************************
    //? create a function to search products and highlight it by using regex to crate new object that substring term and replace product name with it and highlight it inside pName
    searchProducts: function (searchTerm) {
        this.searchTermValue = searchTerm.trim();
        this.foundedItems = [];

        if (this.searchTermValue !== "") {
            for (let i = 0; i < this.pList.length; i++) {
                if (new RegExp(this.searchTermValue, "ig").test(this.pList[i].pName)) {
                    this.foundedItems.push(this.pList[i]);
                }
            }
        }
        // ? Check if foundedItems is empty and display "No products found"
        if (this.foundedItems.length === 0 && this.searchTermValue !== "") {
            document.getElementById("tbody").innerHTML = `<tr><td colspan="9" class="text-center text-white">No products found</td></tr>`;
        } else {
            // ? Call showProducts with the foundedItems array if it's not empty,
            // ? otherwise show all products from pList
            this.showProducts(this.foundedItems.length > 0 ? this.foundedItems : this.pList);
        }
    },
    resetHighlight: function () {
        this.foundedItems = [];
        this.showProducts(this.pList);
    },
    //! ***************************Validation for Product****************************
    //? check function that receive 2 argument and return true or false & function check if input is empty or not
    checkValidate: function (vValue, regPattern) {
        return regPattern.test(vValue);
    },
    checkEmpty: function () {
        isNameEmpty = this.productName.value == "";
        isPriceEmpty = this.productPrice.value == "";
        isCategoryEmpty = this.productCategory.value == "Select Category";
        isDescriptionEmpty = this.productDescription.value == "";
        isNameEmpty ? this.productName.classList.remove("is-invalid") : null;
        isPriceEmpty ? this.productPrice.classList.remove("is-invalid") : null;
        isCategoryEmpty ? this.productCategory.classList.remove("is-invalid") : null;
        isDescriptionEmpty ? this.productDescription.classList.remove("is-invalid") : null;
    },
    //? function to check if all fields valid or not
    validation: function () {
        var regexName = /^[A-Z][a-z]{2,8}([0-9]){0,2}$/g
        var regexPrice = /^([1-9][0-9]{3}|10000)$/
        var regexDescription = /^[a-z0-9]{1,250}$/ig;
        var isNameValid = this.checkValidate(this.productName.value, regexName);
        var isPriceValid = this.checkValidate(this.productPrice.value, regexPrice);
        var isCategoryValid = this.productCategory.value !== "Select Category";
        var isDescriptionValid = this.checkValidate(this.productDescription.value, regexDescription);
        this.productName.classList.toggle("is-valid", isNameValid);
        this.productName.classList.toggle("is-invalid", !isNameValid);
        this.productPrice.classList.toggle("is-valid", isPriceValid);
        this.productPrice.classList.toggle("is-invalid", !isPriceValid);
        this.productCategory.classList.toggle("is-valid", isCategoryValid);
        this.productCategory.classList.toggle("is-invalid", !isCategoryValid);
        this.productDescription.classList.toggle("is-valid", isDescriptionValid);
        this.productDescription.classList.toggle("is-invalid", !isDescriptionValid);
        this.checkEmpty()
        return isNameValid && isPriceValid && isCategoryValid && isDescriptionValid;
    },
    clearValidation: function () {
        this.productName.classList.remove('is-valid');
        this.productPrice.classList.remove('is-valid');
        this.productCategory.classList.remove('is-valid');
        this.productDescription.classList.remove('is-valid');
    },
    //! ***********************************Add Date Of Edit************************************************
    currentMoment: () => { return moment().format("ddd,DMMMM,h:mmA"); },
}
pManger.invokedLocal();
pManger.putEmailOnNav();
pManger.logOutOperation();
pManger.backToLogin();
