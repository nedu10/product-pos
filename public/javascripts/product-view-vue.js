
Vue.options.delimiters = ['({(', ')})'];

new Vue({
    el: "#product-view-vue",
    data: {
        value: true,
        inventory: {
            date: "",
            number_of_product: "",
        },
        inventoryError: ""
    },
    methods: {
        log(){
            console.log(this.inventory)
            var formHidden = document.getElementById('form-hidden').value
            var formProduct = document.getElementById('form-product').value

            var vm = this
            this.inventoryError = ""
            axios.post('/product/inventory/create',{ date: this.inventory.date, 
                number_of_product: this.inventory.number_of_product, 
                product: formProduct, 
                _csrf: formHidden
            })
            .then(function (response) {
              window.location.href = "/product/view"
            })
            .catch(function (error) {
              console.log('err >> ', error.response)
              vm.inventoryError = error.response.data.message

            });
        }
    }
})



//plain javascript
// var swapInventoryForm = document.querySelectorAll('.swapinventoryform')
// var inventoryForm = document.querySelectorAll('.inventoryform')
// var notInventoryForm = document.querySelectorAll('.notinventoryform')

// console.log(swapInventoryForm)

// for (let index = 0; index < swapInventoryForm.length; index++) {
//     let element = swapInventoryForm[index];
//     element.addEventListener('click', function(){
//         event.preventDefault()
//         inventoryForm[index].classList.toggle("d-none");
//         notInventoryForm[index].classList.toggle('d-none')
//         console.log(inventoryForm[index],notInventoryForm[index])
//     })
    
// }




