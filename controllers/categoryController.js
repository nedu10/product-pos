const Category = require('../models/product/product-categories')
const Product = require('../models/product/products')

exports.getAdminCategory = (req, res, next) => {
    Category.find({})
    .exec()
    .then(response => {
        console.log(response)
        var successMsg = req.flash('success')[0]
        const category_list = response
        return res.render('admin/category/view-category', {
            title: 'project-pos',
            category_list: category_list.reverse(),
            csrfToken: req.csrfToken(),
            success_msg: successMsg,
            sidebar_active: {categories: true}
        })
    })
    .catch(err => {
        console.log(err)
        throw err
    })
    
}

exports.getCategory = (req, res, next) => {
    Category.find({})
    .exec()
    .then(response => {
        console.log(response)
        const category_list = response
        return res.render('user/category/view-category', {
            title: 'project-pos',
            category_list: category_list.reverse(),
            csrfToken: req.csrfToken(),
            sidebar_active: {categories_user: true}
        })
    })
    .catch(err => {
        console.log(err)
        throw err
    })
    
}

exports.getCreateCategory = (req, res, next) => {
    res.render('admin/category/create-category', {
        title: 'project-pos',
        csrfToken: req.csrfToken(),
        sidebar_active: {categories: true}
    })
}

exports.createCategory = (req, res, next) => {
    console.log('add categoriy logs >> ',req.body)
    console.log('files: ', req.file)
    var categoryError = []
    if (!req.body.category_description || !req.body.category_name  || !req.file) {
        if (!req.body.category_name) {
            categoryError.push('Category name is required')
        }
        if (!req.body.category_description) {
            categoryError.push('Category description is required')
        }
        if (!req.file) {
            categoryError.push('Category image is required')
        }
    
        req.body.errorMessage = categoryError
        return res.redirect('/category/create')
    }
    const newCategory = new Category({
        category_title: req.body.category_name,
        category_description: req.body.category_description,
        category_image: {
           image_name: req.file.originalname,
           image_path: 'uploaded-images/category-images/'+req.file.filename  
        }
    })
    newCategory.save()
    .then(response => {
        console.log(response)
        return res.redirect("/category")
    })
    .catch(err => {
        console.log(err)
        return err
    })
}

exports.deleteCategory = (req, res, next) => {
    console.log(req.params.category_id)
    Product.find({category_id: req.params.category_id})
    .exec()
    .then(response1 => {
        console.log(response1)
        if (response1.length  ==  0){
            Category.remove({_id: req.params.category_id})
            .then(response => {
                console.log(response)
                req.flash('success', `${req.params.category_title} Deleted Successfully`)
                res.redirect('/category')
            })
            .catch(err => {
                console.log(err)
                throw err
            })
        } else {
            for (let i = 0; i < response1.length; i++) {
                Product.remove({_id: response1[i]._id})
                .exec()
                .then(response2 => {
                    console.log(response2)
                    if (i == (response1.length - 1)) {
                        Category.remove({_id: req.params.category_id})
                        .then(response => {
                            console.log(response)
                            req.flash('success', `${req.params.category_title} Deleted Successfully`)
                            res.redirect('/category')
                        })
                        .catch(err => {
                            console.log(err)
                            throw err
                        })
                    }
                })
                .catch(err2 => {
                    console.log(err2)
                    throw err2
                })
                
            }
        }
    })
    .catch(err1 => {
        console.log(err1)
        throw err1
    })
    
}