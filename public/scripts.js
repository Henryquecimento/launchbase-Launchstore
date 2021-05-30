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

  }
}

const PhotosUpload = {
  preview: document.querySelector('#photos-preview'),
  uploadLimit: 6,
  handleFilesUpload(event) {
    let { files: filesList } = event.target;

    if (PhotosUpload.hasLimit(event)) return

    Array.from(filesList).forEach(file => {
      const reader = new FileReader();

      reader.onload = () => {
        const image = new Image();
        image.src = String(reader.result);

        const div = PhotosUpload.createContainer(image);

        PhotosUpload.preview.appendChild(div);
      }

      reader.readAsDataURL(file);
    })
  },
  hasLimit(event) {
    const { uploadLimit } = PhotosUpload;
    const { files: filesList } = event.target;

    if (filesList.length > uploadLimit) {
      alert(`Envie no máximo ${uploadLimit} arquivos!`);

      event.preventDefault();

      return true;
    }

    return false;
  },
  createContainer(image) {
    const div = document.createElement('div');
    div.classList.add('photo');

    div.onclick = () => alert('Remover foto');

    div.appendChild(image);

    return div;

  }

}
