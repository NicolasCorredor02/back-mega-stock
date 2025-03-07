/* eslint-disable no-undef */
//* --------------------- CLIENTE ---------------------------------

// * --------------------- LOGICA PARA ACTUALIZAR PRODUCTOS ---------------------------------
let currentProductId = null
let currentImages = []
const MAX_IMAGES = 5
// Carga de datos actuales al formulario
async function updateProduct (pid) {
  currentProductId = pid

  try {
    const response = await fetch(
      `http://localhost:8080/api/admin/product/${pid}`
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
    ? `http://localhost:8080/api/admin/products/update/${currentProductId}`
    : 'http://localhost:8080/api/admin/products/add'
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
      throw new Error('Error processing the request')
    }

    resetForm()
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: `An error has occurred: ${error}`
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
            document.querySelectorAll('.new-image').length - 1
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

// Eventos Socket
function socketEvents () {
  //* -------------- Conexion con el servidor Socket ------------
  // eslint-disable-next-line no-undef
  const socket = io('http://localhost:8080') // Por defecto trabaja con el puerto y el servidor levantado (localhost:8080) pero en caso de produccion se debe especificar el link del dominio o server

  // TODO Hacer Socket para update product
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

    // Ejecucion de la funcion para editar los botones de update del producto agregado
    updateEditButtons()

    Swal.fire({
      position: 'top-end',
      title: 'Product successfully added',
      icon: 'success',
      showConfirmButton: false,
      timer: 1000
    })
  })

  socket.on('socketError', (data) => {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: `${data.message}`
    })
  })
}

document.addEventListener('DOMContentLoaded', function () {
  // Funcion para escuchar los eventos de Socket
  socketEvents()

  // Envio de fomulario
  document.getElementById('productForm').addEventListener('submit', handleFormSubmit)

  // Cambio para el input de files
  document.getElementById('fileInput').addEventListener('change', handleFileInput)

  // Funcion para limpiar el formulario a traves del boton de Cancel
  document.getElementById('cancelForm').addEventListener('click', resetForm)

  // Inicializar el espacio de drag and drop
  initializeDragAndDrop()
})

function initializeDragAndDrop () {
  const dropArea = document.getElementById('dropImgesArea')
  const fileInput = document.getElementById('fileInput')

  // Prevent default behaviors
    // eslint-disable-next-line no-unexpected-multiline, no-sequences
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, preventDefaults, false)
    })

  function preventDefaults (e) {
    e.preventDefault()
    e.stopPropagation()
  }

  // Highlight drop area when file is dragged over
  ['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false)
  });

  ['dragleave', 'drop'].forEach(eventName => {
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

// Funcion para actualizar el parametro Update de la lista de productos
function updateEditButtons () {
  // Seleccion de todos botones en la tabla de productos
  const editButtons = document.querySelectorAll('button.text-blue-600')

  // Se añade envento del click para cada boton
  editButtons.forEach(button => {
    button.onclick = function (e) {
      e.preventDefault()
      const productId = this.closest('tr').id
      updateProduct(productId)
    }
  })
}
