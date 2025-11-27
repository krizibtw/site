// Основной JavaScript для всего сайта

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initSmoothScroll();
    initFormValidation();
    initCartSystem();
    initActiveNav();
});

// Мобильное меню
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.querySelector('i').classList.toggle('fa-bars');
            this.querySelector('i').classList.toggle('fa-times');
        });
        
        // Закрытие меню при клике на ссылку
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.querySelector('i').classList.add('fa-bars');
                menuToggle.querySelector('i').classList.remove('fa-times');
            });
        });
        
        // Закрытие меню при клике вне его области
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.nav-links') && !event.target.closest('.menu-toggle')) {
                navLinks.classList.remove('active');
                menuToggle.querySelector('i').classList.add('fa-bars');
                menuToggle.querySelector('i').classList.remove('fa-times');
            }
        });
    }
}

// Плавная прокрутка
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Валидация формы
function initFormValidation() {
    const contactForm = document.getElementById('feedback-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const emailError = document.getElementById('email-error');
            let isValid = true;
            
            // Валидация email
            if (!validateEmail(email)) {
                emailError.style.display = 'block';
                isValid = false;
            } else {
                emailError.style.display = 'none';
            }
            
            if (isValid) {
                showNotification('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.', 'success');
                this.reset();
            }
        });
    }
}

// Валидация email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Система корзины
function initCartSystem() {
    updateCartCounter();
    
    // Создаем элемент корзины в навигации если его нет
    const navLinks = document.querySelector('.nav-links');
    const cartItem = document.querySelector('.cart-item');
    
    if (navLinks && !cartItem) {
        const cartLi = document.createElement('li');
        cartLi.className = 'cart-item';
        cartLi.innerHTML = `
            <a href="#" class="cart-link">
                <i class="fas fa-shopping-cart"></i>
                <span class="cart-counter">0</span>
            </a>
        `;
        navLinks.appendChild(cartLi);
        
        // Обработчик клика по корзине
        cartLi.querySelector('.cart-link').addEventListener('click', function(e) {
            e.preventDefault();
            showCartModal();
        });
    }
}

// Обновление счетчика корзины
function updateCartCounter() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCounter = document.querySelector('.cart-counter');
    const cartItem = document.querySelector('.cart-item');
    
    if (cartCounter) {
        cartCounter.textContent = totalItems;
    }
    
    if (cartItem) {
        cartItem.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

// Получение корзины из localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('gamegear-cart')) || [];
}

// Сохранение корзины в localStorage
function saveCart(cart) {
    localStorage.setItem('gamegear-cart', JSON.stringify(cart));
}

// Добавление товара в корзину
function addToCart(product) {
    let cart = getCart();
    
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += product.quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: product.quantity,
            image: product.image
        });
    }
    
    saveCart(cart);
    updateCartCounter();
    showNotification(`Товар "${product.name}" добавлен в корзину!`, 'success');
}

// Показать модальное окно корзины
function showCartModal() {
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const modalHTML = `
        <div class="modal-overlay">
            <div class="modal">
                <div class="modal-header">
                    <h3>Корзина</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    ${cart.length === 0 ? 
                        '<p class="empty-cart">Корзина пуста</p>' : 
                        cart.map(item => `
                            <div class="cart-item">
                                <img src="${item.image}" alt="${item.name}">
                                <div class="cart-item-info">
                                    <h4>${item.name}</h4>
                                    <p>${item.price} ₽ × ${item.quantity}</p>
                                </div>
                                <div class="cart-item-total">${item.price * item.quantity} ₽</div>
                                <button class="remove-from-cart" data-id="${item.id}">&times;</button>
                            </div>
                        `).join('')
                    }
                </div>
                <div class="modal-footer">
                    <div class="cart-total">
                        <strong>Итого: ${total} ₽</strong>
                    </div>
                    <div class="modal-actions">
                        <button class="btn btn-secondary" id="continue-shopping">Продолжить покупки</button>
                        ${cart.length > 0 ? '<button class="btn" id="checkout">Оформить заказ</button>' : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Обработчики событий для модального окна
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalClose = document.querySelector('.modal-close');
    const continueShopping = document.getElementById('continue-shopping');
    const checkout = document.getElementById('checkout');
    
    const closeModal = () => {
        modalOverlay.remove();
    };
    
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
    
    modalClose.addEventListener('click', closeModal);
    continueShopping.addEventListener('click', closeModal);
    
    if (checkout) {
        checkout.addEventListener('click', () => {
            showNotification('Функция оформления заказа в разработке!', 'warning');
        });
    }
    
    // Удаление товаров из корзины
    document.querySelectorAll('.remove-from-cart').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.getAttribute('data-id');
            removeFromCart(itemId);
            closeModal();
            showCartModal(); // Переоткрываем модальное окно с обновленной корзиной
        });
    });
}

// Удаление товара из корзины
function removeFromCart(itemId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== itemId);
    saveCart(cart);
    updateCartCounter();
    showNotification('Товар удален из корзины', 'success');
}

// Показать уведомление
function showNotification(message, type = 'success') {
    // Удаляем существующие уведомления
    document.querySelectorAll('.notification').forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Автоматическое скрытие через 4 секунды
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Активное состояние навигации при прокрутке
function initActiveNav() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    if (sections.length > 0 && navLinks.length > 0) {
        window.addEventListener('scroll', function() {
            let current = '';
            const scrollPosition = window.scrollY + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }
}

// Стили для модального окна корзины
const cartModalStyles = `
    <style>
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 20px;
        }
        
        .modal {
            background: white;
            border-radius: 10px;
            max-width: 500px;
            width: 100%;
            max-height: 80vh;
            display: flex;
            flex-direction: column;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        
        .modal-header {
            padding: 20px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .modal-header h3 {
            margin: 0;
            color: var(--dark);
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #666;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .modal-close:hover {
            color: var(--danger);
        }
        
        .modal-body {
            padding: 20px;
            flex: 1;
            overflow-y: auto;
        }
        
        .empty-cart {
            text-align: center;
            color: #666;
            font-style: italic;
        }
        
        .cart-item {
            display: flex;
            align-items: center;
            padding: 15px 0;
            border-bottom: 1px solid #eee;
            gap: 15px;
        }
        
        .cart-item:last-child {
            border-bottom: none;
        }
        
        .cart-item img {
            width: 60px;
            height: 60px;
            object-fit: cover;
            border-radius: 5px;
        }
        
        .cart-item-info {
            flex: 1;
        }
        
        .cart-item-info h4 {
            margin: 0 0 5px 0;
            font-size: 1rem;
        }
        
        .cart-item-info p {
            margin: 0;
            color: #666;
            font-size: 0.9rem;
        }
        
        .cart-item-total {
            font-weight: 600;
            color: var(--primary);
        }
        
        .remove-from-cart {
            background: none;
            border: none;
            color: #999;
            cursor: pointer;
            font-size: 1.2rem;
            padding: 5px;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
        }
        
        .remove-from-cart:hover {
            background: #f8f9fa;
            color: var(--danger);
        }
        
        .modal-footer {
            padding: 20px;
            border-top: 1px solid #eee;
        }
        
        .cart-total {
            text-align: right;
            margin-bottom: 15px;
            font-size: 1.2rem;
        }
        
        .modal-actions {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
        }
        
        @media (max-width: 480px) {
            .modal-actions {
                flex-direction: column;
            }
            
            .cart-item {
                flex-wrap: wrap;
            }
        }
    </style>
`;

// Добавляем стили для модального окна
document.head.insertAdjacentHTML('beforeend', cartModalStyles);
