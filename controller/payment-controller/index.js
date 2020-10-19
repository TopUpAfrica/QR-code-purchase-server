const Data = require('../../data.json')

exports.QRCodePayment = async (req, res) => {
    try {

        let getUserWallet = Data.wallet.filter(item => item.user == req.body.user);
        let userWalletIndex = Data.wallet.findIndex(item => item.user == req.body.user);
        let productIndex = Data.products.findIndex(item => item.id == req.body.product)
        console.log(getUserWallet)
        if (getUserWallet.length == 0) {
            res.status(400).json({ message: 'Something goes wrong' })
        } else {
            console.log(req.body)
            console.log(getUserWallet[0].totalAmount)
            console.log(Number(req.body.payAmount))
            if (getUserWallet[0].totalAmount < Number(req.body.payAmount)) {
                res.status(400).json({ message: 'You have insificent balance' })
            } else {
                Data.wallet[userWalletIndex].totalAmount = Data.wallet[userWalletIndex].totalAmount - req.body.payAmount;
                let purchaseItem = {
                    user: req.body.user,
                    product: req.body.product,
                    purchaseDate: new Date()
                }
                Data.purchase.push(purchaseItem);
                let transiction = {
                    user: req.body.user,
                    product: req.body.product,
                    paymentType: 'Debt',
                    amount: req.body.payAmount
                }
                Data.trasection.push(transiction);
                console.log("productIndex", productIndex)
                console.log(Data.products[productIndex])
                Data.products[productIndex].isSold = true
                res.status(200).json({ message: 'Payment successfully pay' })
            }
        }

    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.checkIsProductAvaliable = async (req, res, next) => {
    try {
        let payload = req.query;
        let isProductAvaliable = Data.products.filter(item => item.id == payload.product);
        console.log(isProductAvaliable)
        if (isProductAvaliable.length > 0) {
            if (isProductAvaliable[0].isSold) {
                res.status(200).json({ message: 'This QR code is already soldout' })
            } else {
                res.status(200).json({ isSold: false })
            }
        } else {
            res.status(400).json({ message: 'Somthing went wrong' })
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}