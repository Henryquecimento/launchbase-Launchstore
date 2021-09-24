const Mask = {
  apply(input, func) {
    setTimeout(function () {
      input.value = Mask[func](input.value); //Mask[func] === Mask.func
    }, 1);
  },
  formatBRL(value) {
    value = value.replace(/\D/g, "");

    return value = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(Number(value / 100));

  },
  cpfCnpj(value) {
    value = value.replace(/\D/g, "");

    if (value.length > 14) value = value.slice(0, -1);

    if (value.length > 11) {

      value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d)/, "$1.$2.$3/$4-$5");

    } else {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d)/, "$1.$2.$3-$4");
    }

    return value;
  },
  cep(value) {
    value = value.replace(/\D/g, "");

    if (value.length > 8) value = value.slice(0, -1);

    value = value.replace(/(\d{5})(\d)/, "$1-$2");

    return value;
  }
}

const PhotosUpload = {
  input: "",
  preview: document.querySelector('#photos-preview'),
  uploadLimit: 6,
  files: [],
  handleFilesUpload(event) {
    const { files: fileList } = event.target;
    PhotosUpload.input = event.target;

    if (PhotosUpload.hasLimit(event)) {
      PhotosUpload.updateFilesInput();

      return;
    }

    Array.from(fileList).forEach(file => {

      PhotosUpload.files.push(file);

      const reader = new FileReader();

      reader.onload = () => {
        const image = new Image();
        image.src = String(reader.result);

        const div = PhotosUpload.createContainer(image);

        PhotosUpload.preview.appendChild(div);
      }

      reader.readAsDataURL(file);
    })

    PhotosUpload.updateFilesInput();

  },
  hasLimit(event) {
    const { uploadLimit, input, preview } = PhotosUpload;
    const { files: fileList } = input;

    if (fileList.length > uploadLimit) {
      alert(`Envie no máximo ${uploadLimit} fotos!`);

      event.preventDefault();

      return true;
    }

    const photosDiv = [];
    preview.childNodes.forEach(item => {
      if (item.classList && item.classList.value == "photo") {
        photosDiv.push(item);
      }
    });

    const totalPhotos = fileList.length + photosDiv.length;
    if (totalPhotos > uploadLimit) {
      alert(`Você atingiu o limite máximo de fotos!`);
      event.preventDefault();

      return true;
    }

    return false;
  },
  getAllFiles() {
    const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer();

    PhotosUpload.files.forEach(file => dataTransfer.items.add(file));

    return dataTransfer.files;
  },
  createContainer(image) {
    const div = document.createElement('div');
    div.classList.add('photo');

    div.onclick = PhotosUpload.removePhoto

    div.appendChild(image);

    div.appendChild(PhotosUpload.getRemoveButton());

    return div;

  },
  getRemoveButton() {
    const button = document.createElement('i');
    button.classList.add('material-icons');
    button.innerHTML = "delete_forever";

    return button;
  },
  removePhoto(event) {
    const photoDiv = event.target.parentNode; //Event.target -> i // parentNode -> div class='photo'

    const newPhotos = Array.from(PhotosUpload.preview.children).filter(file => {
      if (file.classList.contains('photo') && !file.getAttribute('id')) return true; //filter only the new photos added
    });
    const index = newPhotos.indexOf(photoDiv);
    PhotosUpload.files.splice(index, 1); //removing ONE element
    PhotosUpload.updateFilesInput(); // Updating te FileList

    photoDiv.remove();
  },
  removeOldPhoto(event) {
    const photoDiv = event.target.parentNode;

    if (photoDiv.id) {
      const removedFiles = document.querySelector('input[name="removed_files"]');

      if (removedFiles) {
        removedFiles.value += `${photoDiv.id},`
      }
    }

    photoDiv.remove();
  },
  updateFilesInput() {
    PhotosUpload.input.files = PhotosUpload.getAllFiles();
  }
}

const ImageGallery = {
  highlight: document.querySelector('.gallery .highlight > img'),
  previews: document.querySelectorAll('.gallery-preview img'),
  setImage(event) {
    const { target } = event;

    ImageGallery.previews.forEach(preview => preview.classList.remove('active'));
    target.classList.add('active');

    ImageGallery.highlight.src = target.src;
    Lightbox.image.src = target.src;

  }
}

const Lightbox = {
  target: document.querySelector('.lightbox-target'),
  image: document.querySelector('.lightbox-target img'),
  closeButton: document.querySelector('.lightbox-target a.lightbox-close'),
  open() {
    Lightbox.target.style.opacity = 1;
    Lightbox.target.style.top = 0;
    Lightbox.target.style.botton = 0;
    Lightbox.closeButton.style.top = 0;
  },
  close() {
    Lightbox.target.style.opacity = 0;
    Lightbox.target.style.top = "-100%";
    Lightbox.target.style.botton = "initial";
    Lightbox.closeButton.style.top = "-80px";
  }
}

const Validate = {
  apply(input, func) {
    Validate.clearErrors(input);

    let results = Validate[func](input.value);
    input.value = results.value;

    if (results.error) {
      Validate.displayErrors(input, results.error);
    }
  },
  displayErrors(input, error) {
    const div = document.createElement("div");
    div.classList.add('error'),

      div.innerHTML = error;

    input.parentNode.appendChild(div);

    input.focus();
  },
  clearErrors(input) {
    const errorDiv = input.parentNode.querySelector('.error');

    if (errorDiv) errorDiv.remove();
  },
  isEmail(value) {
    let error = null;
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    if (!value.match(mailFormat)) {
      error = "Invalid Email";
    }

    return {
      error,
      value
    }
  },
  isCpfCnpj(value) {
    let error = null;

    const cleanValues = value.replace(/\D/g, "");

    if (cleanValues.length > 11 && cleanValues.length !== 14) {
      error = "Invalid CNPJ";
    } else if (value.length < 12 && cleanValues.length !== 11) {
      error = "Invalid CPF";
    }

    return {
      error,
      value
    }
  },
  isCep(value) {
    let error = null;

    const cleanValues = value.replace(/\D/g, "");

    if (cleanValues.length !== 8) {
      error = "Invalid CEP";
    }

    return {
      error,
      value
    }
  },
  allFields(event) {
    const items = document.querySelectorAll('.item input, .item select, .item textarea')

    for (item of items) {
      if (item.value == "") {
        const message = document.createElement('div');
        message.classList.add('messages');
        message.classList.add('error');
        message.style.position = 'fixed';
        message.innerHTML = 'All the fields must be filled!';

        document.querySelector('body').append(message);

        event.preventDefault();
      }
    }
  }
}