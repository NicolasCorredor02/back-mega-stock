/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
//* --------------------- CLIENTE ---------------------------------

// * --------------------- LOGICA PARA EL CARRITO CLIENTE ---------------------------------

const shoppingCart = 'shoppingCart'

/**
 * Funcion para inicializar el carrito de compras en caso de que no se encuentre creado
 */
function initShoppingCart () {
  if (!localStorage.getItem(shoppingCart)) {
    localStorage.setItem(shoppingCart, JSON.stringify([]))
  }
}

// /**
//  * @returns {Array} // Array de objetos en el carrito de compras
//  */
// const getShoppingCart = () => {
//   return JSON.parse(localStorage.getItem(shoppingCart))
// }

/**
 * @returns {Array} // Array de objetos que cuentan con minimo una unidad
 */
function getShoppingCartByAmount () {
  const cartByAmount = JSON.parse(localStorage.getItem(shoppingCart)).filter((object) => object.quantity >= 1)

  return cartByAmount
}

/**
 * @param {object} param
 */
function addToShoppingCart (object) {
  const currentCart = getShoppingCartByAmount()

  if (currentCart.some((item) => item._id === object._id)) {
    /**
       * Actualizar la cantidad del alimento en el carrito
       * 1. Se busca el indice del objeto que se quiere agregar al carrito, ya que, existe
       * 2. Se actualiza la cantidad en una unidad de este objeto del carrito
       * 3. Finalmente se actualiza el carrito del localStorage
      */
    const index = currentCart.findIndex((element) => element._id === object._id)
    currentCart[index].quantity++
    localStorage.setItem(shoppingCart, JSON.stringify(currentCart))

    Swal.fire({
      position: 'top-end',
      title: 'Product successfully added to Shopping Cart',
      icon: 'success',
      showConfirmButton: false,
      timer: 1500
    })
  } else {
    object.quantity = 1
    currentCart.push(object)
    localStorage.setItem(shoppingCart, JSON.stringify(currentCart))

    Swal.fire({
      position: 'top-end',
      title: 'Product successfully added to Shopping Cart',
      icon: 'success',
      showConfirmButton: false,
      timer: 1500
    })
  }
}

/**
*
* @param {number} id // id del objeto del cual se quiere aumentar la cantidad en una unidad
*/
function sumAmountCart (id) {
  const currentCart = getShoppingCartByAmount()

  if (currentCart.some((item) => item._id === id)) {
    /**
       * Actualizar la cantidad del alimento en el carrito
       * 1. Se busca el indice del objeto que se quiere remover del carrito, ya que, existe
       * 2. Se actualiza la cantidad en una unidad de este objeto del carrito
       * 3. Finalmente se actualiza el carrito del localStorage
      */
    const index = currentCart.findIndex((element) => element._id === id)
    currentCart[index].quantity++
    localStorage.setItem(shoppingCart, JSON.stringify(currentCart))
    cartLogic()
  } else {
    console.log('Error al aumentar cantidad del elemento en el carrito!')
  }
}

/**
* @param {number} param0 //id del objeto del cual se quiere disminuir la cantidad en una unidad
*/
function reduceAmountCart (id) {
  const currentCart = getShoppingCartByAmount()

  if (currentCart.some((item) => item._id === id)) {
    /**
       * Actualizar la cantidad del alimento en el carrito
       * 1. Se busca el indice del objeto que se quiere remover del carrito, ya que, existe
       * 2. Se actualiza la cantidad en una unidad de este objeto del carrito
       * 3. Finalmente se actualiza el carrito del localStorage
      */
    const index = currentCart.findIndex((element) => element._id === id)
    currentCart[index].quantity--
    localStorage.setItem(shoppingCart, JSON.stringify(currentCart))
    cartLogic()
  } else {
    console.log('Error al disminuir cantidad del elemento en el carrito!')
  }
}

/**
* @param {number} idItem // Se ingresa el id del objeto que se quiere eliminar el carrito de compras
*/
function removeFromShoppingCart (idItem) {
  const currentCart = getShoppingCartByAmount()
  const updateCart = currentCart.filter((object) => object._id !== idItem)
  localStorage.setItem(shoppingCart, JSON.stringify(updateCart))
  cartLogic()
}

/**
 * @param {array} shoppingCart // Ingresa el array de objetos del carrito para calcular el subtotal
 * @returns {number} // regresa el valor final de la sumatoria sobre los items del carrito
 */
function cartSubTotal () {
  const subTotal = getShoppingCartByAmount().reduce((accumulador, element) => accumulador + (element.price * element.quantity), 0).toFixed(2)
  return subTotal
}

/**
 * Funcion para limpiar el carrito de compras
 */
function clearShoppingCart () {
  localStorage.setItem(shoppingCart, JSON.stringify([]))
  cartLogic()
}

// * --------------------- LOGICA PARA ACTUALIZAR PRODUCTOS ---------------------------------
let currentProductId = null
let currentImages = []
const MAX_IMAGES = 5
// Carga de datos actuales al formulario
// eslint-disable-next-line no-unused-vars
async function updateProduct (pid) {
  currentProductId = pid

  try {
    const response = await fetch(
      `http://localhost:8080/api/admin/products/product/${pid}`
    )

    if (!response.ok) {
      throw new Error('Error processing the request')
    }

    const product = await response.json()

    // Carga de los datos del producto en el formulario
    document.getElementById('productTitle').value = product.title
    document.getElementById('productDescription').value = product.description
    document.getElementById('productCode').value = product.code
    document.getElementById('productPrice').value = product.price
    document.getElementById('productStock').value = product.stock
    document.getElementById('productCategory').value = product.category

    // Carga de imagenes
    currentImages = product.thumbnails || []
    displayExistingImages(currentImages)

    // Cambio del texto del boton del formulario
    const sumbitButton = document.querySelector(
      '#productForm button[type="submit"]'
    )
    sumbitButton.textContent = 'Update product'

    // Scroll al formulario para no perder la perspectiva
    document
      .getElementById('productForm')
      .scrollIntoView({ behavior: 'smooth' })
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'An error has occurred'
    })
  }
}

// Funcion para mostrar las imgenes del producto para eliminar o mantener
function displayExistingImages (images) {
  const previewContainer = document.getElementById('previewImages')
  previewContainer.innerHTML = '' // Limpieza en caso de que existan imagenes anteriormente

  images.forEach((imageUrl, index) => {
    const imageContainer = document.createElement('div')
    imageContainer.className = 'relative border rounded-lg overflow-hidden'
    imageContainer.dataset.imageIndex = index

    // Image
    const img = document.createElement('img')
    img.src = imageUrl
    img.alt = 'Product image'
    img.className = 'w-full h-32 object-cover'

    // Control overlay
    const overlay = document.createElement('div')
    overlay.className =
      'absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-2 flex justify-between'

    // Keep checkbox
    const keepContainer = document.createElement('div')
    keepContainer.className = 'flex items-center text-white'

    // Keep box
    const keepCheckBox = document.createElement('input')
    keepCheckBox.type = 'checkbox'
    keepCheckBox.checked = true
    keepCheckBox.className = 'mr-1 keep-image-checkbox'
    keepCheckBox.dataset.imageUrl = imageUrl

    // Keep Label
    const keepLabel = document.createElement('span')
    keepLabel.textContent = 'Keep'
    keepLabel.className = 'text-xs'

    // Integracion de las UI al keepContainer
    keepContainer.appendChild(keepCheckBox)
    keepContainer.appendChild(keepLabel)

    // Integracion de UI al Overlay
    overlay.appendChild(keepContainer)

    imageContainer.appendChild(img)
    imageContainer.appendChild(overlay)
    previewContainer.appendChild(imageContainer)
  })

  // Actualizacion de los archivos img
  updateFileInputStatus(images.length)
}

// Funcion para actualizar el estatus del imputArea
function updateFileInputStatus (currentImagesCount) {
  const dropArea = document.getElementById('dropImgesArea')
  const fileInputLabel = dropArea.querySelector('label')
  const remainingSlots = MAX_IMAGES - currentImagesCount

  if (remainingSlots <= 0) {
    fileInputLabel.classList.add('opacity-50', 'cursor-not-allowed')
    fileInputLabel.classList.remove('cursor-pointer')
    dropArea.querySelector('span:nth-child(2)').textContent =
      'Maximum images (5)'
    document.getElementById('fileInput').disabled = true
  } else {
    fileInputLabel.classList.remove('opacity-50', 'cursor-not-allowed')
    fileInputLabel.classList.add('cursor-pointer')
    dropArea.querySelector('span:nth-child(2)').textContent =
      'Drop images here or click to upload'
    dropArea.querySelector(
      'span:nth-child(3)'
    ).textContent = `(${remainingSlots} slots remaining)`
    document.getElementById('fileInput').disabled = true
  }
}

// Funcion para manejar el envio del formulario
async function handleFormSubmit (event) {
  event.preventDefault()

  // Se crea un objeto FormData para mostrar cómo se podrían preparar los datos
  const formData = new FormData()

  // Añadir los demás datos del formulario
  formData.append('title', document.getElementById('productTitle').value)
  formData.append(
    'description',
    document.getElementById('productDescription').value
  )
  formData.append('code', document.getElementById('productCode').value)
  formData.append('price', document.getElementById('productPrice').value)
  formData.append('stock', document.getElementById('productStock').value)
  formData.append('category', document.getElementById('productCategory').value)

  // Obtener imagenes para eliminar
  const imagesToDelete = []
  document
    .querySelectorAll('.keep-image-checkbox:not(:checked)')
    .forEach((checkbox) => {
      imagesToDelete.push(checkbox.dataset.imageUrl)
    })

  // Adicionar las imagenes a eliminar al form data
  formData.append('deleteImages', JSON.stringify(imagesToDelete))

  // Obtener las imagenes que se quiren agregar
  const fileInput = document.getElementById('fileInput')
  for (let i = 0; i < fileInput.files.length; i++) {
    formData.append('thumbnails', fileInput.files[i])
  }

  // Determinar si un create product o update product
  const isUpdate = currentProductId !== null
  const url = isUpdate
    ? `http://localhost:8080/api/admin/products/product/update/${currentProductId}`
    : 'http://localhost:8080/api/admin/products/product/add'
  const method = isUpdate ? 'PUT' : 'POST'

  try {
    Swal.fire({
      title: 'Loading...',
      text: 'Please wait while we process your request',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading()
      }
    })

    const response = await fetch(url, {
      method,
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error processing the request')
    }

    resetForm()
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: `An error has occurred: ${error.message}`
    })
  }
}

// eslint-disable-next-line no-unused-vars
async function handleDeletedProduct (productId) {
  const url = `http://localhost:8080/api/admin/products/product/delete?pid=${productId}`
  const method = 'DELETE'

  try {
    Swal.fire({
      title: 'Loading...',
      text: 'Please wait while we process your request',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading()
      }
    })

    const response = await fetch(url, {
      method
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error processing the request')
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: `An error has occurred: ${error.message}`
    })
  }
}

// Funcion para resetear el formulario
function resetForm () {
  document.getElementById('productForm').reset()
  document.getElementById('previewImages').innerHTML = ''
  currentProductId = null
  currentImages = []

  // Reset button text
  const submitButton = document.querySelector(
    '#productForm button[type="submit"]'
  )
  submitButton.textContent = 'Create Product'

  // Reset del status de los documentos
  updateFileInputStatus(0)
}

// Funcion para manejar las imagenes nuevas y el preview
function handleFileInput () {
  const fileInput = document.getElementById('fileInput')
  const files = fileInput.files

  if (files.length > 0) {
    // Validcaion para verificar si las imagenes supera el limete de 5
    const currentCount = document.querySelectorAll(
      '.keep-image-checkbox:checked'
    ).length
    const totalAfterUpload = currentCount + files.length

    if (totalAfterUpload > MAX_IMAGES) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `You can only have a maximum of ${MAX_IMAGES} images. Please select fewer images.`
      })
      fileInput.value = '' // Se limpia el input para agregar documentos
      return
    }

    // Preview de imagenes
    const previewContainer = document.getElementById('previewImages')

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Creacion de la imagen preview
      const imageContainer = document.createElement('div')
      imageContainer.className =
        'relative border rounded-lg overflow-hidden new-image'

      // Creacion del preview de la imagen
      const img = document.createElement('img')
      img.className = 'w-full h-32 object-cover'

      // Leer el documento
      const reader = new FileReader()
      reader.onload = function (e) {
        img.src = e.target.result
      }

      reader.readAsDataURL(file)

      // Añadir boton para remover para las nuevas imagenes
      const removeButton = document.createElement('button')
      removeButton.type = 'button'
      removeButton.className =
        'absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center'
      removeButton.innerHTML = '&times;'
      removeButton.addEventListener('click', function () {
        imageContainer.remove()
        updateFileInputStatus(
          document.querySelectorAll('.keep-image-checkbox:checked').length +
            document.querySelectorAll('.new-image').length -
            1
        )
      })

      imageContainer.appendChild(img)
      imageContainer.appendChild(removeButton)
      previewContainer.appendChild(imageContainer)
    }

    // Actualizacion del input de imagenes por status
    updateFileInputStatus(
      document.querySelectorAll('.keep-image-checkbox:checked').length +
        document.querySelectorAll('.new-image').length
    )
  }
}

//* ----------------- LOGICA PARA ACTUALIZAR CARTS  --------------

const shoppingCartAdmin = 'shoppingCartAdmin'

function initShoppingCartAdmin (currentCart) {
  localStorage.setItem(shoppingCartAdmin, JSON.stringify(currentCart))
}

/**
 * @returns {Array} // Array de objetos que cuentan con minimo una unidad
 */
function getShoppingCartByAmountAdmin () {
  const productsByAmount = JSON.parse(localStorage.getItem(shoppingCartAdmin)).products.filter((object) => object.quantity >= 1)

  const cartByAmount = {
    ...JSON.parse(localStorage.getItem(shoppingCartAdmin)),
    products: productsByAmount
  }
  return cartByAmount
}

function addToShoppingCartAdmin (object) {
  const currentCart = getShoppingCartByAmountAdmin()
  const { products } = getShoppingCartByAmountAdmin()

  if (products.some(({ product }) => product._id === object._id)) {
    /**
       * Actualizar la cantidad del alimento en el carrito
       * 1. Se busca el indice del objeto que se quiere agregar al carrito, ya que, existe
       * 2. Se actualiza la cantidad en una unidad de este objeto del carrito
       * 3. Finalmente se actualiza el carrito del localStorage
      */
    const index = products.findIndex(({ product }) => product._id === object._id)
    products[index].quantity++
    localStorage.setItem(shoppingCartAdmin, JSON.stringify({ ...currentCart, products }))

    Swal.fire({
      position: 'top-end',
      title: 'Product successfully added to Shopping Cart',
      icon: 'success',
      showConfirmButton: false,
      timer: 1500
    })

    cartLogicAdmin()
  } else {
    const newProduct = {
      product: object,
      quantity: 1
    }
    products.push(newProduct)
    localStorage.setItem(shoppingCartAdmin, JSON.stringify({ ...currentCart, products }))

    Swal.fire({
      position: 'top-end',
      title: 'Product successfully added to Shopping Cart',
      icon: 'success',
      showConfirmButton: false,
      timer: 1500
    })
    cartLogicAdmin()
  }
}

function sumAmountCartAdmin (id) {
  const currentCart = getShoppingCartByAmountAdmin()
  const { products } = getShoppingCartByAmountAdmin()

  if (products.some(({ product }) => product._id === id)) {
    /**
       * Actualizar la cantidad del alimento en el carrito
       * 1. Se busca el indice del objeto que se quiere remover del carrito, ya que, existe
       * 2. Se actualiza la cantidad en una unidad de este objeto del carrito
       * 3. Finalmente se actualiza el carrito del localStorage
      */
    const index = products.findIndex(({ product }) => product._id === id)
    products[index].quantity++
    localStorage.setItem(shoppingCartAdmin, JSON.stringify({ ...currentCart, products }))
    cartLogicAdmin()
  } else {
    console.log('Error al aumentar cantidad del elemento en el carrito!')
  }
}

function reduceAmountCartAdmin (id) {
  const currentCart = getShoppingCartByAmountAdmin()
  const { products } = getShoppingCartByAmountAdmin()

  if (products.some(({ product }) => product._id === id)) {
    /**
       * Actualizar la cantidad del alimento en el carrito
       * 1. Se busca el indice del objeto que se quiere remover del carrito, ya que, existe
       * 2. Se actualiza la cantidad en una unidad de este objeto del carrito
       * 3. Finalmente se actualiza el carrito del localStorage
      */
    const index = products.findIndex(({ product }) => product._id === id)
    products[index].quantity--
    localStorage.setItem(shoppingCartAdmin, JSON.stringify({ ...currentCart, products }))
    cartLogicAdmin()
  } else {
    console.log('Error al disminuir cantidad del elemento en el carrito!')
  }
}

function removeFromShoppingCartAdmin (idItem) {
  const currentCart = getShoppingCartByAmountAdmin()
  const { products } = getShoppingCartByAmountAdmin()
  const updateProducts = products.filter(({ product }) => product._id !== idItem)
  localStorage.setItem(shoppingCartAdmin, JSON.stringify({ ...currentCart, products: updateProducts }))
  cartLogicAdmin()
}

function cartSubTotalAdmin () {
  const { products } = getShoppingCartByAmountAdmin()
  const subTotal = products.reduce((accumulador, element) => accumulador + (element.product.price * element.quantity), 0).toFixed(2)
  return subTotal
}

function clearShoppingCartAdmin () {
  localStorage.removeItem(shoppingCartAdmin)
  cartLogicAdmin()
}

async function updateCart (cid) {
  try {
    const response = await fetch(`http://localhost:8080/api/admin/carts/cart/${cid}`)

    if (!response.ok) {
      throw new Error('Error processing the request')
    }

    const cart = await response.json()

    initShoppingCartAdmin(cart) // Se crea el carrito en el Local Sotrage que se quiere actualizar

    document.getElementById('firstNameAdmin').value = cart.user_info.first_name
    document.getElementById('lastNameAdmin').value = cart.user_info.last_name
    document.getElementById('emailAdmin').value = cart.user_info.email
    document.getElementById('phoneAdmin').value = cart.user_info.phone
    document.getElementById('idNumberAdmin').value = cart.user_info.id_number

    // Se renderizan los productos del carrito que se quiere actualizar
    cartLogicAdmin()
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'An error has occurred'
    })
  }
}

function cartLogicAdmin () {
  const shoppingCartList = document.getElementById('shoppingCartListAdmin')
  const shoppingCartSubTotalField = document.getElementById('shoppingCartSubTotalAdmin')

  // Funcion para cargar y renderizar los productos del localStorage
  function loadShoppingCartAdmin () {
    const shoppingCartSubTotalValue = cartSubTotalAdmin() // Se recupera el subtotal del carrito del localStorage Admin
    const shoppingCart = getShoppingCartByAmountAdmin() // Se recupera el carrito del localStorage Admin

    shoppingCartSubTotalField.innerHTML = ''

    shoppingCartSubTotalValue > 0 ? shoppingCartSubTotalField.textContent = `$ ${shoppingCartSubTotalValue}` : shoppingCartSubTotalField.textContent = '$ 0.00'

    // Se borra el contenido anterior de la lista de productos del carrito
    shoppingCartList.innerHTML = ''

    if (shoppingCart.length === 0) {
      shoppingCartList.innerHTML = '<p>There are no products in the cart</p>'
      return
    }

    // Se renderiza cada producto que se encuentra en el carrito del LocalStorage
    shoppingCart.products.forEach(({ product, quantity }) => {
      const productContainer = document.createElement('tr')
      productContainer.classList.add('hover:bg-gray-50')
      productContainer.innerHTML = `
          <td class="px-6 py-4 whitespace-nowrap">
            <img
            src=${product.thumbnails[0]}
            alt='${product.title}'
            class="h-10 w-10 rounded-full"
            />
          </td>
          <td class="px-6 py-4">${product.title}</td>
          <td class="px-6 py-4">$${product.price}</td>
          <td class="px-6 py-4">${product.category}</td>
          <td class="flex items-center gap-3 px-2 py-4">
            <button onclick="reduceAmountCartAdmin('${product._id}')" class="w-10 h-10 bg-red-600 text-white text-lg font-semibold rounded-lg cursor-pointer">-</button>
            <p>${quantity}</p>
            <button onclick="sumAmountCartAdmin('${product._id}')" class="w-10 h-10 bg-green-600 text-white text-lg font-semibold rounded-lg cursor-pointer">+</button>
            <button onclick="removeFromShoppingCartAdmin('${product._id}')" class="h-10 bg-red-600 px-2 font-semibold text-white rounded-lg cursor-pointer">Remove</button>
          </td>
        `
      shoppingCartList.appendChild(productContainer)
    })
  }

  // Cargar shopping cart admin initial
  loadShoppingCartAdmin()
}

//* ------------------ LOGICA PARA ACTUALIZAR EL CARRITO EL LA DB -------------
// Funcion para resetear el formulario del cart del Admin
function resetFormCartAdmin () {
  document.getElementById('cartAdminForm').reset()
  clearShoppingCartAdmin()
  cartLogic()
}

async function handleUpdateCartSubmit () {
  console.log('Entra a funcion handle')

  const { _id } = getShoppingCartByAmountAdmin()

  console.log('Current cart to update:', _id)

  const userInfo = {
    first_name: document.getElementById('firstNameAdmin').value,
    last_name: document.getElementById('lastNameAdmin').value,
    email: document.getElementById('emailAdmin').value,
    phone: document.getElementById('phoneAdmin').value,
    id_number: parseInt(document.getElementById('idNumberAdmin').value)
  }

  const currentShoppingCart = getShoppingCartByAmountAdmin() // Obtener el cart del localStorage
  const propRequired = ['_id'] // Campo que se tomaran de cada product del cart

  // Array de products para crear el cart al cliente
  const shoppingCartFormated = currentShoppingCart.products.map(({ product, quantity }) => {
    const formatedProduct = {
      quantity
    }

    propRequired.forEach((prop) => {
      formatedProduct[prop] = product[prop]
    })
    return formatedProduct
  }).map(({ _id: value, ...rest }) => ({
    ...rest,
    product: value
  }))

  console.log('products formated:', shoppingCartFormated)

  const formCartAdmin = {
    user_info: userInfo,
    status: document.getElementById('statusAdmin').value,
    products: shoppingCartFormated,
    sub_total: parseFloat(cartSubTotalAdmin())
  }

  const cartDataJSON = JSON.stringify(formCartAdmin)

  console.log('Form data:', cartDataJSON)

  try {
    Swal.fire({
      title: 'Loading...',
      text: 'Please wait while we process your request',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading()
      }
    })

    const response = await fetch(`http://localhost:8080/api/admin/carts/cart/update/${_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: cartDataJSON
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error processing the request')
    }

    Swal.fire({
      position: 'top-end',
      title: 'Cart successfully updated',
      icon: 'success',
      showConfirmButton: false,
      timer: 1500
    })

    // Se resetea el formualario y el localStorage del Admin
    resetFormCartAdmin()
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: `An error has occurred: ${error.message}`
    })
  }
}

//* ------------------ LOGICA PARA BORRAR EL CARRITO EL LA DB -------------
async function handleDeleteCartSubmit (cartId) {
  const url = `http://localhost:8080/api/admin/carts/cart/delete?cid=${cartId}`
  const method = 'DELETE'

  try {
    Swal.fire({
      title: 'Loading...',
      text: 'Please wait while we process your request',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading()
      }
    })

    const response = await fetch(url, {
      method
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error processing the request')
    }

    Swal.fire({
      position: 'top-end',
      title: 'Cart successfully deleted',
      icon: 'success',
      showConfirmButton: false,
      timer: 1500
    })
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: `An error has occurred: ${error.message}`
    })
  }
}

// Eventos Socket
function socketEvents () {
  //* -------------- Conexion con el servidor Socket ------------
  // eslint-disable-next-line no-undef
  const socket = io('http://localhost:8080') // Por defecto trabaja con el puerto y el servidor levantado (localhost:8080) pero en caso de produccion se debe especificar el link del dominio o server

  // TODO Revisar problema en el uso del input file porque solo sirve cuando se actualiza la pagina o cuando se carga por primera vez

  //* ------------- ESCUCHAR EVENTO DE NUEVO PRODUCTO -----------
  const productsList = document.getElementById('productsList')
  socket.on('addProduct', (product) => {
    const newProductHTML = `
        <tr id=${product._id} class="hover:bg-gray-50">
                <td class="px-6 py-4">${product._id}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <img
                    src=${product.thumbnails[0]}
                    alt=${product.title}
                    class="h-10 w-10 rounded-full"
                  />
                </td>
                <td class="px-6 py-4">${product.title}</td>
                <td class="px-6 py-4">${product.description}</td>
                <td class="px-6 py-4">${product.code}</td>
                <td class="px-6 py-4">$${product.price}</td>
                <td class="px-6 py-4">${product.stock}</td>
                <td class="px-6 py-4">${product.category}</td>
                <td class="px-6 py-4">
                  <button class="text-blue-600 hover:text-blue-900 mr-2">Edit</button>
                  <button class="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
      `

    productsList.insertAdjacentHTML('afterbegin', newProductHTML)

    Swal.fire({
      position: 'top-end',
      title: 'Product successfully added',
      icon: 'success',
      showConfirmButton: false,
      timer: 1000
    })
  })

  //* ------------- ESCUCHAR EVENTO DE ACTUALIZACION DE PRODUCTO -----------
  socket.on('productUpdated', (updatedProduct) => {
    const productToUpdate = document.getElementById(`${updatedProduct._id}`)

    const productUpdated = `<tr id=${updatedProduct._id} class="hover:bg-gray-50">
    <td class="px-6 py-4">${updatedProduct._id}</td>
    <td class="px-6 py-4 whitespace-nowrap">
    <img
    src=${updatedProduct.thumbnails[0]}
    alt=${updatedProduct.title}
    class="h-10 w-10 rounded-full"
    />
    </td>
    <td class="px-6 py-4">${updatedProduct.title}</td>
    <td class="px-6 py-4">${updatedProduct.description}</td>
    <td class="px-6 py-4">${updatedProduct.code}</td>
    <td class="px-6 py-4">$${updatedProduct.price}</td>
    <td class="px-6 py-4">${updatedProduct.stock}</td>
    <td class="px-6 py-4">${updatedProduct.category}</td>
    <td class="px-6 py-4">
    <button class="text-blue-600 hover:text-blue-900 mr-2">Edit</button>
    <button class="text-red-600 hover:text-red-900">Delete</button>
    </td>
    </tr>`
    // Se inserta el nuevo elemento antes del elemento antiguo que se remplaza
    productToUpdate.insertAdjacentHTML('beforebegin', productUpdated)

    // Se elimina el producto antiguo de la lista
    productToUpdate.parentNode.removeChild(productToUpdate)

    // Ejecucion de la funcion para editar los botones de update del producto actualizado
    // updateEditButtons()

    // Ejecucion de la funcion para editar los botones de delete del producto agregado
    // updateDeleteButtons()

    Swal.fire({
      position: 'top-end',
      title: 'Product successfully updated',
      icon: 'success',
      showConfirmButton: false,
      timer: 1000
    })
  })

  //* ------------- ESCUCHAR EVENTO DELETE DE PRODUCTO -----------
  socket.on('productDeleted', (idProductToDelete) => {
    const productToDelete = document.getElementById(`${idProductToDelete}`)

    // Se elimina el producto de la lista
    productToDelete.parentNode.removeChild(productToDelete)

    Swal.fire({
      position: 'top-end',
      title: 'Product successfully deleted',
      icon: 'success',
      showConfirmButton: false,
      timer: 1000
    })
  })

  //* ------------- ESCUCHAR EVENTO DE ERROR -----------
  socket.on('socketError', (data) => {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: `${data.message}`
    })
  })
}

//* ------------------ LOGICA PARA EL CARRITO CLIENT -------------

function cartLogic () {
  const shoppingCartList = document.getElementById('shoppingCartList')
  const shoppingCartSubTotalField = document.getElementById('shoppingCartSubTotal')

  // Funcion para cargar y renderizar los productos del localStorage
  function loadShoppingCart () {
    const shoppingCart = getShoppingCartByAmount() // Se recupera el carrito del localStorage
    const shoppingCartSubTotalValue = cartSubTotal() // Se recupera el subtotal del carrito del localStorage

    shoppingCartSubTotalField.innerHTML = ''

    shoppingCartSubTotalValue > 0 ? shoppingCartSubTotalField.textContent = `$ ${shoppingCartSubTotalValue}` : shoppingCartSubTotalField.textContent = '$ 0.00'

    // Se borra el contenido anterior de la lista de productos del carrito
    shoppingCartList.innerHTML = ''

    if (shoppingCart.length === 0) {
      shoppingCartList.innerHTML = '<p>There are no products in the cart</p>'
      return
    }

    // Se renderiza cada producto que se encuentra en el carrito del LocalStorage
    shoppingCart.forEach((product) => {
      const productContainer = document.createElement('tr')
      productContainer.classList.add('hover:bg-gray-50')
      productContainer.innerHTML = `
          <td class="px-6 py-4 whitespace-nowrap">
            <img
            src=${product.thumbnails[0]}
            alt='${product.title}'
            class="h-10 w-10 rounded-full"
            />
          </td>
          <td class="px-6 py-4">${product.title}</td>
          <td class="px-6 py-4">$${product.price}</td>
          <td class="px-6 py-4">${product.category}</td>
          <td class="flex items-center gap-3 px-2 py-4">
            <button onclick="reduceAmountCart('${product._id}')" class="w-10 h-10 bg-red-600 text-white text-lg font-semibold rounded-lg cursor-pointer">-</button>
            <p>${product.quantity}</p>
            <button onclick="sumAmountCart('${product._id}')" class="w-10 h-10 bg-green-600 text-white text-lg font-semibold rounded-lg cursor-pointer">+</button>
            <button onclick="removeFromShoppingCart('${product._id}')" class="h-10 bg-red-600 px-2 font-semibold text-white rounded-lg cursor-pointer">Remove</button>
          </td>
        `
      shoppingCartList.appendChild(productContainer)
    })
  }

  // Cargar shopping cart initial
  loadShoppingCart()
}

//* ------------------ LOGICA PARA CRER EL CARRITO EL LA DB -------------
async function handleCreateCartSubmit (event) {
  // Funcion para resetear el formulario del cart
  function resetFormCartClient () {
    document.getElementById('cartClientForm').reset()
  }

  event.preventDefault()

  // Objeto para almacenar las url de fetch
  // const urls = {
  //   address: '',
  //   paymenMethod: '',
  //   cart: ''
  // }

  // FormData para crear la nueva direccion en la DB
  // const formAddressClient = new FormData()

  // formAddressClient.append('street', document.getElementById('streetClient').value)
  // formAddressClient.append('city', document.getElementById('cityClient').value)
  // formAddressClient.append('sate', document.getElementById('stateClient').value)
  // formAddressClient.append('postal_code', document.getElementById('postalCodeClient').value)
  // formAddressClient.append('country', document.getElementById('countryClient').value)

  // FormData para crear el nuevo metodo de pago en la DB
  // const formPaymentMethodClient = new FormData()

  // Creacion del obj user_info necesario para crear el cart
  const userInfo = {
    first_name: document.getElementById('firstNameClient').value,
    last_name: document.getElementById('lastNameClient').value,
    email: document.getElementById('emailClient').value,
    phone: document.getElementById('phoneClient').value,
    id_number: parseInt(document.getElementById('idNumberClient').value)
  }

  const currentShoppingCart = getShoppingCartByAmount() // Obtener el cart del localStorage
  const propsRequired = ['_id', 'quantity'] // Campos que se tomaran de cada product del cart

  // Array de products para crear el cart al cliente
  const shoppingCartFormated = currentShoppingCart.map((product) => {
    const formatedProduct = {}

    propsRequired.forEach((prop) => {
      formatedProduct[prop] = product[prop]
    })
    return formatedProduct
  }).map(({ _id: value, ...rest }) => ({
    ...rest,
    product: value
  }))

  const formCartClient = {
    user_type: 'guest',
    user_info: userInfo,
    address: '67dc92a7366b4a45dfa08053',
    payment_method: '67ddba8c8a525755ebb8aae5',
    status: 'active',
    products: shoppingCartFormated,
    sub_total: parseFloat(cartSubTotal())
  }

  const cartDataJSON = JSON.stringify(formCartClient)

  console.log('Form data:', cartDataJSON)

  try {
    Swal.fire({
      title: 'Loading...',
      text: 'Please wait while we process your request',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading()
      }
    })

    const response = await fetch('http://localhost:8080/api/admin/carts/cart/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // ¡Este header es clave!
      },
      body: cartDataJSON
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error processing the request')
    }

    Swal.fire({
      position: 'top-end',
      title: 'Cart successfully created',
      icon: 'success',
      showConfirmButton: false,
      timer: 1500
    })

    // Se limpia el carrito del localStorage
    clearShoppingCart()

    // Se resetea el formualario
    resetFormCartClient()
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: `An error has occurred: ${error.message}`
    })
  }
}

document.addEventListener('DOMContentLoaded', function () {
  //* ----------------- EVENTOS PARA CART CLIENT EN LOCALSTORAGE -----
  // Se ejecuta la fucnion para inicializar el carrito de compras en el locaStorage
  initShoppingCart()

  //* ---------------- EVENTOS PARA SOCKET.IO -------------------
  // Funcion para escuchar los eventos de Socket
  socketEvents()

  //* ------------- EVENTOS PARA CART DE CLIENT -------------------
  cartLogic()
  document.getElementById('cartClientForm').addEventListener('submit', handleCreateCartSubmit)

  //* ------------- EVENTOS PARA CART DE ADMIN -------------------
  cartLogicAdmin()
  // Evento para escuchar el click del boton del formulario de update cart para limpiar el form
  document.getElementById('cancelUpdateCardForm').addEventListener('click', resetFormCartAdmin)
  //* ------------- EVENTOS PARA PRODUCTOS ADMIN -------------------
  // Envio de fomulario para crear productos
  document
    .getElementById('productForm')
    .addEventListener('submit', handleFormSubmit)

  // Cambio para el input de files
  document
    .getElementById('fileInput')
    .addEventListener('change', handleFileInput)

  // Funcion para limpiar el formulario a traves del boton de Cancel
  document.getElementById('cancelForm').addEventListener('click', resetForm)

  // Inicializar el espacio de drag and drop
  initializeDragAndDrop()
})

function initializeDragAndDrop () {
  const dropArea = document.getElementById('dropImgesArea')
  const fileInput = document
    .getElementById('fileInput')

    // eslint-disable-next-line no-unexpected-multiline, no-sequences
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
      dropArea.addEventListener(eventName, preventDefaults, false)
    })

  function preventDefaults (e) {
    e.preventDefault()
    e.stopPropagation()
  }

  // Highlight drop area when file is dragged over
  ['dragenter', 'dragover'].forEach((eventName) => {
    dropArea.addEventListener(eventName, highlight, false)
  });

  ['dragleave', 'drop'].forEach((eventName) => {
    dropArea.addEventListener(eventName, unhighlight, false)
  })

  function highlight () {
    dropArea.classList.add('border-blue-500', 'bg-blue-50')
  }

  function unhighlight () {
    dropArea.classList.remove('border-blue-500', 'bg-blue-50')
  }

  // Manejador para los archivos soltados
  dropArea.addEventListener('drop', handleDrop, false)

  function handleDrop (e) {
    const dt = e.dataTransfer
    fileInput.files = dt.files
    handleFileInput()
  }
}
