const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}


document.addEventListener('DOMContentLoaded', () => { 
    fetchData()
    if(localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        paintCart()
    }
});
cards.addEventListener('click', e => {addCarrito(e)});
items.addEventListener('click', e => { btnAction (e)})

const fetchData = async () => {
    try {
        const res = await fetch('api.json')
        const data = await res.json()
       /*  console.log(data) */
       paintCards(data)
    } catch (error) {
        console.log(error)
    }
}

const paintCards = data => {
    data.forEach(item => {
        templateCard.querySelector('h5').textContent = item.title
        templateCard.querySelector('p').textContent = item.precio
        templateCard.querySelector('img').setAttribute('src', item.thumbnailUrl)
        templateCard.querySelector('.btn-dark').dataset.id = item.id

        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

const addCarrito = e => {
/*  console.log(e.target)
    console.log(e.target.classList.contains('btn-dark')) */
    if (e.target.classList.contains('btn-dark')) {
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = item => {
    /* console.log(objecto) */
    const producto = {
        id: item.querySelector('.btn-dark').dataset.id,
        title: item.querySelector('h5').textContent,
        precio: item.querySelector('p').textContent,
        cantidad: 1
    }


    if(carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito [producto.id] = {...producto}
    paintCart()
}

const paintCart = () => {
    /* console.log(cart) */
    items.innerHTML = ''

    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id,
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio

        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    paintFooter()

    localStorage.setItem('carrito', JSON.stringify(carrito))
}

const paintFooter = () => {

        footer.innerHTML = ''

        if(Object.keys(carrito).length === 0) {
            footer.innerHTML = `
            <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
            `
            return
        }

        const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad, 0)
        const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio, 0)

        templateFooter.querySelectorAll('td')[0].textContent = nCantidad
        templateFooter.querySelector('span').textContent = nPrecio

        const clone = templateFooter.cloneNode(true)
        fragment.appendChild(clone)

        footer.appendChild(fragment)

        const btnVaciar = document.getElementById('vaciar-carrito')
        
        btnVaciar.addEventListener('click', () => {
            carrito = {}
            paintCart()
        })
}

const btnAction = e => {
    /* console.log(e.target) */
    if(e.target.classList.contains('btn-info')) {
        console.log(carrito[e.target.dataset.id])
        /* carrito[e.target.dataset.id] */
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = {...producto}
        paintCart()
    }

    if(e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if(producto.cantidad === 0){
            delete carrito[e.target.dataset.id]
        }
        paintCart()
    }
    e.stopPropagation()
}