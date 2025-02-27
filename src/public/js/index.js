//* --------------------- CLIENTE ---------------------------------

document.addEventListener("DOMContentLoaded", function (params) {
  //* -------------- Conexion con el servidor Socket ------------
  const socket = io("http://localhost:8080"); //Por defecto trabaja con el puerto y el servidor levantado (localhost:8080) pero en caso de produccion se debe especificar el link del dominio o server

  //* ------------- ESCUCHAR EVENTO DE NUEVO PRODUCTO -----------
  const productsList = document.getElementById("productsList");
  socket.on("addProduct", (product) => {
    const newProductHTML = `
      <tr id={{id}} class="hover:bg-gray-50">
              <td class="px-6 py-4">${product.id}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <img
                  src=''
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
                <button
                  class="text-blue-600 hover:text-blue-900 mr-2"
                >Edit</button>
                <button class="text-red-600 hover:text-red-900">Delete</button>
              </td>
            </tr>
    `;

    productsList.insertAdjacentHTML("afterbegin", newProductHTML);

    Swal.fire({
      position: "top-end",
      title: "Product successfully added",
      icon: "success",
      showConfirmButton: false,
      timer: 1000,
    });
  });

  socket.on("socketError", (data) => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: `${data.message}`,
    });
  });

  //* --------- FORMULARIO DE REGISTRO DE PRODUCTOS ---------
  const dropImgesArea = document.getElementById("dropImgesArea");
  const fileInput = document.getElementById("fileInput");
  const previewImages = document.getElementById("previewImages");
  const form = document.getElementById("productForm");

  // Array para almacenar los archivos de imagen
  let uploadedFiles = [];

  // Evento encadenado para abrir el selector de archivos al hacer clic en el área
  dropImgesArea.addEventListener(
    "click",
    function (e) {
      e.stopPropagation();
      fileInput.click();
    },
    { once: false }
  );

  // Prevenir comportamiento por defecto para el drag & drop
  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    dropImgesArea.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  // Manejar el evento de soltar archivos
  dropImgesArea.addEventListener("drop", handleDrop, false);

  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
  }

  // Manejar la selección de archivos con el input
  fileInput.addEventListener("change", function () {
    handleFiles(this.files);
  });

  function handleFiles(files) {
    files = [...files];
    files.forEach(previewFile);
  }

  function previewFile(file) {
    // Verificar que sea una imagen
    if (!file.type.match("image.*")) {
      alert("Please upload images only");
      return;
    }

    uploadedFiles.push(file);

    const reader = new FileReader();

    reader.onload = function (e) {
      const imgContainer = document.createElement("div");
      imgContainer.className = "relative group";

      const img = document.createElement("img");
      img.src = e.target.result;
      img.className = "h-32 w-full object-cover rounded-lg";
      img.title = file.name;

      const removeBtn = document.createElement("button");
      removeBtn.className =
        "absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hidden group-hover:block";
      removeBtn.innerHTML = "&times;";
      removeBtn.addEventListener("click", function () {
        // Encontrar el índice del archivo y eliminarlo del array
        const index = uploadedFiles.indexOf(file);
        if (index > -1) {
          uploadedFiles.splice(index, 1);
        }
        imgContainer.remove();
      });

      imgContainer.appendChild(img);
      imgContainer.appendChild(removeBtn);
      previewImages.appendChild(imgContainer);
    };

    reader.readAsDataURL(file);
  }

  // Manejar el envío del formulario
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Se crea un objeto FormData para mostrar cómo se podrían preparar los datos
    const formData = new FormData();

    // Añadir todos los archivos
    uploadedFiles.forEach((file, index) => {
      formData.append("thumbnails", file);
    });

    // Añadir los demás datos del formulario
    formData.append("title", document.getElementById("productTitle").value);
    formData.append(
      "description",
      document.getElementById("productDescription").value
    );
    formData.append("code", document.getElementById("productCode").value);
    formData.append("price", document.getElementById("productPrice").value);
    formData.append("stock", document.getElementById("productStock").value);
    formData.append(
      "category",
      document.getElementById("productCategory").value
    );

    try {
      Swal.fire({
        title: "Loading...",
        text: "Please wait while we process your request",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await fetch(
        "http://localhost:8080/api/admin/products/add",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Error processing the request");
      }

      form.reset();
      uploadedFiles = [ ];
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "An error has occurred",
      });
    }
  });
});
