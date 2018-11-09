Vue.options.delimiters = ['({(', ')})'];

new Vue({
    el: "#admin-product-view-vue",
    data: {
        productError: [],
        displayProductError: false,
        product: {
            id: "",
            name: "",
            price: "",
            price_id: "",
            short_description: "",
            description: "",
            csrf: "",
            product_image: {}

        }
        
    },
    mounted(){
        console.log('a edit me >> ')

            //plain javascript
            this.product.csrf = document.querySelector('#edit-product-csrf').innerText
            var productEditButton = document.querySelectorAll('.product-button')
            var productTitle = document.querySelectorAll('.product-title')
            var ProductShortDescription = document.querySelectorAll('.product-short-description')
            var ProductDescription = document.querySelectorAll('.product-description')
            var productPrice = document.querySelectorAll('.product-price')
            var productPriceId = document.querySelectorAll('.product-price-id')
            var productId = document.querySelectorAll('.product-id')

            var vm = this
            for (let index = 0; index < productEditButton.length; index++) {
                let element = productEditButton[index];
                element.addEventListener('click', function(){
                    event.preventDefault()
                    console.log(productId[index].innerText)
                    vm.product.id = productId[index].innerText
                    vm.product.description = ProductDescription[index].innerText
                    vm.product.name = productTitle[index].innerText
                    vm.product.price = productPrice[index].innerText
                    vm.product.price_id = productPriceId[index].innerText
                    vm.product.short_description = ProductShortDescription[index].innerText
                })
                
            }
    },
    methods: {
        editProduct(){
            this.productError = []
            this.displayProductError = false

            if(!this.product.short_description ||
                 !this.product.name ||
                 !this.product.price || 
                 !this.$refs.product_image.files[0]
                 ){
                this.productError = []
                this.displayProductError = true
                if (!this.product.name) {
                    this.productError.push('product title is required')
                }
                if (!this.product.short_description) {
                    this.productError.push('product short description is required')
                }
                if (!this.product.price) {
                    this.productError.push('product price is required')
                }
                if (!this.$refs.product_image.files[0]) {
                    this.productError.push('product Image is required')
                }
            }
            else {
                console.log('product_image >> ', this.$refs.product_image.files[0])
                var product_form_data = new FormData()
                product_form_data.append("product_title", this.product.name)
                product_form_data.append('product_short_description', this.product.short_description)
                product_form_data.append('product_description', this.product.description)
                product_form_data.append('product_price', this.product.price)
                product_form_data.append('product_price_id', this.product.price_id)
                product_form_data.append('product_image', (this.$refs.product_image.files[0]))
                console.log('formdata >> ', product_form_data);

                const vm = this
                axios.put('/product/'+this.product.id+'/update?_csrf='+this.product.csrf, product_form_data)
                .then(function (response) {
                    console.log(response)
                    window.location.href = "/product/admin-view"
                })
                .catch(function (error) {
                    this.displayCategoryError = true
                    console.log('err >> ', error.response)
                    this.categoryError.push(error.response.data.message)
                });
            }
            
            
        } 
    }
})
