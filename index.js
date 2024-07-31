const express = require('express')
const app = express()
const port = 3000
const uuid = require('uuid')
app.use(express.json())

const orders = []

const checkUserId = (req, res, next) => { /*CHECA ID QUE ESTA SENDO ENVIADA PELO ROUTE PARAMS E GUARDA A POSIÇÃO DO OBJETO NO ARRAY COM A ID EQUIVALENTE -ID E POSIÇÃO DO OBJETO NO ARRAY-*/

    const { id } = req.params

    const index = orders.findIndex(order => order.id === id)

    if (index < 0) { return res.status(404).json({ error: "User not found" }) }

    req.userId = id

    req.userIndex = index

    next()
}

const methodAndUrl = (req, res, next) => { /*INFORMA NO CONSOLE.LOG O MÉTODO HTTP SENDO UTILIZADO NO MOMENTO E TAMBÉM O ENDEREÇO DA URL -IDENTIFICAR MÉTODO E DADOS DA URL-*/

    console.log(`Método: ${req.method}, URL: ${req.url}`)

    next()
}

app.get('/orders', methodAndUrl, (req, res) => {  /*VISUALIZAÇÃO DOS PEDIDOS*/

    return res.status(200).json(orders)
})

app.post('/orders', methodAndUrl, (req, res) => {

    const { clientName, order, price, status } = req.body

    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(price);

    const newOrder = { id: uuid.v4(), clientName, order, price: formattedPrice, status }

    orders.push(newOrder)

    return res.status(201).json(newOrder)

})
                     /*ESSE MIDDLEWARE BASICAMENTE VAI CHECAR A ID QUE ESTA SENDO ENVIADA PELO ROUTE PARAMS E JÁ VAI IDENTIFICAR DENTRO DO ARRAY-BANCO DE DADOS O OBJETO COM A MESMA ID PARA PODER ALTERA-LO*/
app.put('/orders/:id', checkUserId, methodAndUrl, (req, res) => {

    const id = req.userId

    const index = req.userIndex

    const { clientName, order, price, status } = req.body

    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(price);

    const changedOrder = { id, clientName, order, price: formattedPrice, status }

    orders[index] = changedOrder

    return res.status(200).json(orders)
})

app.delete('/orders/:id', checkUserId, methodAndUrl, (req, res) => {

    const index = req.userIndex

    orders.splice(index, 1)

    return res.status(200).json({message:"Order Deleted"})
})

app.get('/orders/:id', checkUserId, methodAndUrl, (req, res) => {  /*VISUALIZAÇÃO DE PEDIDO ESPECÍFICO*/

    const index = req.userIndex

    const specificOrder = orders[index]

    return res.status(200).json(specificOrder)
})

app.patch('/orders/:id', checkUserId, methodAndUrl, (req, res) => {

    const index = req.userIndex

    orders[index].status = "Pronto"

    return res.status(200).json(orders[index])

})

app.listen(port, () => {
    console.log(`Server listening on port 🚀 ${port}`)
})