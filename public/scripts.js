const Mask = {
    apply(input, func) {
        setTimeout(function() {
            input.value = Mask[func](input.value); //Mask[func] === Mask.func
        }, 1);
    },
    formatBRL(value) {
        value = value.replace(/\D/g, "");
       
        return value = new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        }).format(Number(value/100));
    
    }
}