module.exports = function Cart(oldCart) {
    this.cartItems = oldCart.cartItems || {}
    this.totalQty =  oldCart.totalQty || 0
    this.totalPrice = oldCart.totalPrice || 0

    this.add = function(item, item_id){
        var storedItem = this.cartItems[item_id]
        console.log('meeee')
        if (!storedItem){
            storedItem = this.cartItems[item_id] = {item: item, itemQty: 0, itemPrice: 0}
        }
        storedItem.itemQty += 1
        storedItem.itemPrice = storedItem.item.product_price_id.product_price * storedItem.itemQty
        this.totalPrice += storedItem.item.product_price_id.product_price
        this.totalQty++;
    }

    this.remove = function(item_id){
        var storedItem = this.cartItems[item_id]
        console.log('storedItem >> ',storedItem)
        this.totalPrice -= storedItem.itemPrice
        this.totalQty -= storedItem.itemQty
        delete this.cartItems[item_id]
        console.log('cartitems >> ',this.cartItems)
    }

    this.generateArray = function(){
        var cartArray = []
        for (const id in this.cartItems) {
            cartArray.push(this.cartItems[id])
        }
        return cartArray
    }
}