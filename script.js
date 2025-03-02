$(document).ready(function () {
    // Navbar functionality
    $('.navbar .dropdown-item').on('click', function (e) {
        var $el = $(this).children('.dropdown-toggle');
        var $parent = $el.offsetParent(".dropdown-menu");
        $(this).parent("li").toggleClass('open');

        if (!$parent.parent().hasClass('navbar-nav')) {
            if ($parent.hasClass('show')) {
                $parent.removeClass('show');
                $el.next().removeClass('show');
                $el.next().css({"top": -999, "left": -999});
            } else {
                $parent.parent().find('.show').removeClass('show');
                $parent.addClass('show');
                $el.next().addClass('show');
                $el.next().css({"top": $el[0].offsetTop, "left": $parent.outerWidth() - 4});
            }
            e.preventDefault();
            e.stopPropagation();
        }
    });

    $('.navbar .dropdown').on('hidden.bs.dropdown', function () {
        $(this).find('li.dropdown').removeClass('show open');
        $(this).find('ul.dropdown-menu').removeClass('show open');
    });

    // Shopping Cart Functionality
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    updateCartDisplay();

    // Add to Cart button click handler
    $('.add-to-cart').click(function() {
        const name = $(this).data('name');
        const price = parseFloat($(this).data('price'));
        
        // Check if item already exists in cart
        const existingItem = cartItems.find(item => item.name === name);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push({
                name: name,
                price: price,
                quantity: 1
            });
        }
        
        // Save to localStorage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        
        // Update cart display
        updateCartDisplay();
    });

    // Remove from cart handler
    $(document).on('click', '.remove-from-cart', function() {
        const index = $(this).data('index');
        cartItems.splice(index, 1);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCartDisplay();
    });

    // Checkout button click handler
    $('#checkout-btn').click(function() {
        if (cartItems.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        window.location.href = 'cart-checkout.html';
    });

    // Function to update cart display
    function updateCartDisplay() {
        const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
        $('#cart-count').text(cartCount);

        // Update cart dropdown
        const cartList = $('#cart-items');
        cartList.empty();

        let total = 0;
        cartItems.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            cartList.append(`
                <li class="mb-2">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            ${item.name}
                            <br>
                            <small>Quantity: ${item.quantity}</small>
                        </div>
                        <div class="text-right">
                            <div>₱${itemTotal.toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                            <button class="btn btn-sm btn-danger remove-from-cart" data-index="${index}">Remove</button>
                        </div>
                    </div>
                </li>
            `);
        });

        $('#cart-total').text(total.toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2}));
    }
});

// Slideshow functionality
let slideIndex = 0;
let slideInterval;

function showSlides() {
    const slidesWrapper = document.querySelector('.slides-wrapper');
    const slides = document.querySelectorAll('.mySlides');
    const dots = document.querySelectorAll('.dot');
    
    if (!slides.length) return;

    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1; }

    // Update transform for sliding effect
    slidesWrapper.style.transform = `translateX(${-(slideIndex - 1) * 100}%)`;

    // Update dots
    dots.forEach((dot, index) => {
        dot.className = dot.className.replace(" active", "");
        if (index === slideIndex - 1) {
            dot.className += " active";
        }
    });
}

function plusSlides(n) {
    clearInterval(slideInterval);
    const slides = document.querySelectorAll('.mySlides');
    slideIndex = (slideIndex + n - 1 + slides.length) % slides.length + 1;
    showSlides();
    startAutoSlide();
}

function currentSlide(n) {
    clearInterval(slideInterval);
    slideIndex = n;
    showSlides();
    startAutoSlide();
}

function startAutoSlide() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
    slideInterval = setInterval(showSlides, 3000);
}

// Initialize slideshow when document is ready
document.addEventListener("DOMContentLoaded", function() {
    if (document.querySelector('.slideshow-container')) {
        // Show first slide immediately
        slideIndex = 0;
        showSlides();
        startAutoSlide();
        
        // Make functions globally available for onclick events
        window.plusSlides = plusSlides;
        window.currentSlide = currentSlide;
    }
});
