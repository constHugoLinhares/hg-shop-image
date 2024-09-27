// Armazena as imagens do cliente e do produto
let clientImages = [];
let productImages = [];

// Configura os eventos para arrastar e soltar imagens nas áreas específicas
document.getElementById('client-drop-area').addEventListener('dragover', (event) => {
    event.preventDefault();
});
document.getElementById('client-drop-area').addEventListener('drop', (event) => {
    event.preventDefault();
    handleFileDrop(event.dataTransfer.files, 'client');
});

document.getElementById('product-drop-area').addEventListener('dragover', (event) => {
    event.preventDefault();
});
document.getElementById('product-drop-area').addEventListener('drop', (event) => {
    event.preventDefault();
    handleFileDrop(event.dataTransfer.files, 'product');
});

// Botões de seleção de imagens para cliente e produto
document.getElementById('select-client-images').addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = (event) => {
        handleFileSelection(event.target.files, 'client');
    };
    input.click();
});

document.getElementById('select-product-images').addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = (event) => {
        handleFileSelection(event.target.files, 'product');
    };
    input.click();
});

// Função para lidar com o drop de arquivos
function handleFileDrop(files, type) {
    Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            addImageToDOM(e.target.result, type);
        };
        reader.readAsDataURL(file);
    });
}

// Função para lidar com a seleção de arquivos
function handleFileSelection(files, type) {
    Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            addImageToDOM(e.target.result, type);
        };
        reader.readAsDataURL(file);
    });
}

// Função para adicionar imagens ao DOM com botões de editar e excluir
function addImageToDOM(imageSrc, type) {
    const imgContainer = document.createElement('div');
    imgContainer.className = 'image-container';

    const imgElement = document.createElement('img');
    imgElement.src = imageSrc;
    imgContainer.appendChild(imgElement);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerText = 'Excluir';
    deleteBtn.onclick = function () {
        imgContainer.remove();
        removeImage(imageSrc, type);
    };

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.innerText = 'Editar';
    editBtn.onclick = function () {
        editImage(imageSrc, imgElement, type);
    };

    imgContainer.appendChild(deleteBtn);
    imgContainer.appendChild(editBtn);

    if (type === 'client') {
        document.getElementById('client-images').appendChild(imgContainer);
        clientImages.push(imageSrc);
    } else {
        document.getElementById('product-images').appendChild(imgContainer);
        productImages.push(imageSrc);
    }
}

// Função para remover a imagem do array correto
function removeImage(imageSrc, type) {
    if (type === 'client') {
        clientImages = clientImages.filter(img => img !== imageSrc);
    } else {
        productImages = productImages.filter(img => img !== imageSrc);
    }
}

// Função para editar uma imagem (substituir por uma nova)
function editImage(imageSrc, imgElement, type) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
            imgElement.src = e.target.result;
            // Atualiza a imagem no array correto
            if (type === 'client') {
                clientImages[clientImages.indexOf(imageSrc)] = e.target.result;
            } else {
                productImages[productImages.indexOf(imageSrc)] = e.target.result;
            }
        };
        reader.readAsDataURL(file);
    };
    input.click();
}

// Função para gerar o PDF
document.getElementById('generate-pdf').addEventListener('click', generatePDF);

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    clientImages.forEach((clientImage, index) => {
        const productImage = productImages[index] || '';

        doc.addImage(clientImage, 'JPEG', 10, 20 * index + 10, 50, 50); // Imagem do cliente
        if (productImage) {
            doc.addImage(productImage, 'JPEG', 70, 20 * index + 10, 50, 50); // Imagem do produto
        }
    });

    doc.save('comparacao.pdf');
}
