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
    uploadLimit: 6,
    handleFilesUpload(event) {
        const { files: filesList } = event.target;
        const { uploadLimit } = PhotosUpload;

        if (filesList.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} arquivos!`);

            event.preventDefault();

            return
        }
    }
}