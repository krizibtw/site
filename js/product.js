// JavaScript для страниц товаров

document.addEventListener('DOMContentLoaded', function() {
    initProductGallery();
    initProductQuantity();
    initProductTabs();
    initAddToCart();
});

// Галерея товара
function initProductGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('main-image');
    
    if (thumbnails.length > 0 && mainImage) {
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                const newSrc = this.getAttribute('data-image');
                
                // Плавная смена изображения
                mainImage.style.opacity = '0';
                
                setTimeout(() => {
                    mainImage.src = newSrc;
                    mainImage.style.opacity = '1';
                }, 200);
                
                // Обновление активного состояния
                document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
}

// Управление количеством товара
function initProductQuantity() {
    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.querySelector('.decrease');
    const increaseBtn = document.querySelector('.increase');
    
    if (quantityInput && decreaseBtn && increaseBtn) {
        decreaseBtn.addEventListener('click', () => {
            if (quantityInput.value > 1) {
                quantityInput.value = parseInt(quantityInput.value) - 1;
            }
        });
        
        increaseBtn.addEventListener('click', () => {
            if (quantityInput.value < 10) {
                quantityInput.value = parseInt(quantityInput.value) + 1;
            }
        });
        
        // Валидация ввода
        quantityInput.addEventListener('change', function() {
            let value = parseInt(this.value);
            
            if (isNaN(value) || value < 1) {
                this.value = 1;
            } else if (value > 10) {
                this.value = 10;
            } else {
                this.value = value;
            }
        });
        
        quantityInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    }
}

// Табы товара
function initProductTabs() {
    const tabs = document.querySelectorAll('.tab');
    
    if (tabs.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Обновление активного состояния табов
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                
                this.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
}

// Добавление в корзину
function initAddToCart() {
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const product = getProductData();
            addToCart(product);
        });
    }
}

// Получение данных товара
function getProductData() {
    const productTitle = document.querySelector('.product-title');
    const productPrice = document.querySelector('.product-price');
    const quantityInput = document.getElementById('quantity');
    const mainImage = document.getElementById('main-image');
    
    // Извлекаем цену как число
    const priceText = productPrice.textContent;
    const price = parseInt(priceText.replace(/[^\d]/g, ''));
    
    return {
        id: generateProductId(),
        name: productTitle ? productTitle.textContent : 'Товар',
        price: price,
        quantity: quantityInput ? parseInt(quantityInput.value) : 1,
        image: mainImage ? mainImage.src : 'images/placeholder.jpg'
    };
}

// Генерация ID товара
function generateProductId() {
    const path = window.location.pathname;
    const pageName = path.split('/').pop().replace('.html', '');
    return pageName + '-' + Date.now();
}
