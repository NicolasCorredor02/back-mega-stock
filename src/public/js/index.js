//* --------------------- CLIENTE ---------------------------------
//* ----------------- FORMULARIO DE REGISTRO DE PRODUCTOS ----------------------
document.addEventListener("DOMContentLoaded", function (params) {
  //* Conexion con el servidor Socket
  const socket = io("http://localhost:8080"); //Por defecto trabaja con el puerto y el servidor levantado (localhost:8080) pero en caso de produccion se debe especificar el link del dominio o server

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
  form.addEventListener("submit", function (e) {
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

    // Para demostración, mostramos los datos en la consola
    console.log("Formulario enviado con éxito");

    // Envio del form data por medio del socket hacia el servidor
    socket.emit("addProduct", formData);

    // En un caso real, aquí enviarías formData al servidor
    // usando fetch o axios

    // Ejemplo:
    // fetch('/api/products', {
    //   method: 'POST',
    //   body: formData
    // })
    // .then(response => response.json())
    // .then(data => {
    //   console.log('Producto guardado:', data);
    //   form.reset();
    //   preview.innerHTML = '';
    //   uploadedFiles = [];
    // })
    // .catch(error => {
    //   console.error('Error:', error);
    // });

    // Para la demostración, simplemente reiniciamos el formulario
    // alert("Producto añadido con éxito (simulación)");
    // form.reset();
    // preview.innerHTML = "";
    // uploadedFiles = [];
  });
});
