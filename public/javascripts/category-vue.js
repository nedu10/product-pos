Vue.options.delimiters = ['({(', ')})'];

new Vue({
    el: "#category-vue",
    data: {
        categoryError: [],
        displayCategoryError: false,
        category: {
            id: "",
            title: "",
            description: "",
            csrf: ""
        }
        
    },
    mounted(){
        console.log('are you sure you want to edit me >> ')

            //plain javascript
            var categoryTitle = document.querySelectorAll('.category_title')
            var categoryButton = document.querySelectorAll('.category-button')
            var categoryDescription = document.querySelectorAll('.category_description')
            var categoryId = document.querySelectorAll('.category_id')

            var vm = this
            for (let index = 0; index < categoryButton.length; index++) {
                let element = categoryButton[index];
                element.addEventListener('click', function(){
                    event.preventDefault()
                    console.log(categoryDescription[index].value)
                    console.log(categoryTitle[index].value)
                    console.log(categoryId[index].value)
                    vm.category.description = categoryDescription[index].value
                    vm.category.title = categoryTitle[index].value
                    vm.category.id = categoryId[index].value
                    // axios.post('/category_update/update',{ date: this.inventory.date, 
                    //     number_of_product: this.inventory.number_of_product, 
                    //     product: formProduct, 
                    //     _csrf: formHidden
                    // })
                    // .then(function (response) {
                    //     window.location.href = "/category"
                    // })
                    // .catch(function (error) {
                    //     console.log('err >> ', error.response)
                    //     vm.inventoryError = error.response.data.message
        
                    // });
                })
                
            }
    },
    methods: {
        editCategory(){
            this.categoryError = []
            this.displayCategoryError = false
            var categoryCsrf = document.querySelector('#category-csrf').value
            this.category.csrf = categoryCsrf
            if(!this.category.description || !this.category.title){
                this.categoryError = []
                this.displayCategoryError = true
                if (!this.category.title) {
                    this.categoryError.push('Category title is required')
                }
                if (!this.category.description) {
                    this.categoryError.push('Category description is required')
                }
            }
            else {
                console.log('category-csrf >> ',this.category.csrf)
                console.log('category_image >> ', this.$refs.category_image.files[0])
                var form_data = new FormData()
                form_data.append("category_title", this.category.title)
                form_data.append('category_description', this.category.description)
                form_data.append('category_id', this.category.id)
                form_data.append('category_image', (this.$refs.category_image.files[0]))
                console.log('formdata >> ', form_data);

                const vm = this
                axios.put('/category/update?_csrf='+this.category.csrf,form_data)
                .then(function (response) {
                    console.log(response)
                    window.location.href = "/category"
                })
                .catch(function (error) {
                    this.displayCategoryError = true
                    console.log('err >> ', error.response)
                    this.categoryError.push(error.response.data.message)
                });
            }
            
            
        }
        // log(){
        //     console.log(this.inventory)
        //     var formHidden = document.getElementById('form-hidden').value
        //     var formProduct = document.getElementById('form-product').value

        //     var vm = this
        //     this.inventoryError = ""
        //     axios.post('/product/inventory/create',{ date: this.inventory.date, 
        //         number_of_product: this.inventory.number_of_product, 
        //         product: formProduct, 
        //         _csrf: formHidden
        //     })
        //     .then(function (response) {
        //       window.location.href = "/product/view"
        //     })
        //     .catch(function (error) {
        //       console.log('err >> ', error.response)
        //       vm.inventoryError = error.response.data.message

        //     });
        // }
    }
})
