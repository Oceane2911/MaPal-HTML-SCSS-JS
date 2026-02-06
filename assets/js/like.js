// Attendre que le DOM et les icônes Ionicons soient complètement chargés
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(initializeLikeButtons, 100);
    // Si on est sur la page Ma PAL, charger les favoris
    if (window.location.pathname.includes('MaPal.html')) {
        setTimeout(loadFavorites, 200);
    }
});

function initializeLikeButtons() {
    const likeButtons = document.querySelectorAll('button');
    
    likeButtons.forEach(button => {
        const heartIcon = button.querySelector('ion-icon[name="heart"]');
        
        if (heartIcon) {
            button.style.cursor = 'pointer';
            
            // Vérifier si ce livre est déjà dans les favoris
            const bookCard = button.closest('.focus-gallery__item, .list-book__card');
            if (bookCard) {
                const bookTitle = bookCard.querySelector('h2').textContent.trim();
                const favorites = getFavorites();
                
                // Si le livre est dans les favoris, mettre le cœur en rouge
                if (favorites.some(fav => fav.title === bookTitle)) {
                    heartIcon.classList.remove('white');
                    heartIcon.classList.add('red');
                }
            }
            
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleLike(heartIcon, button);
            });
        }
    });
}

function toggleLike(icon, button) {
    const bookCard = button.closest('.focus-gallery__item, .list-book__card');
    
    if (!bookCard) return;
    
    // Récupérer les informations du livre
    const title = bookCard.querySelector('h2').textContent.trim();
    const description = bookCard.querySelector('.list-book__card__content__descript, .focus-gallery__item__content')?.textContent.trim() || '';
    const imgSrc = bookCard.querySelector('img')?.src || '';
    
    const bookData = {
        title: title,
        description: description,
        image: imgSrc
    };
    
    if (icon.classList.contains('white')) {
        // Changer en rouge et ajouter aux favoris
        icon.classList.remove('white');
        icon.classList.add('red');
        addToFavorites(bookData);
        console.log('Livre ajouté aux favoris:', title);
    } else if (icon.classList.contains('red')) {
        // Changer en blanc et retirer des favoris
        icon.classList.remove('red');
        icon.classList.add('white');
        removeFromFavorites(title);
        console.log('Livre retiré des favoris:', title);
        
        // Si on est sur la page Ma PAL, recharger la liste
        if (window.location.pathname.includes('MaPal.html')) {
            setTimeout(loadFavorites, 100);
        }
    } else {
        icon.classList.add('red');
        addToFavorites(bookData);
    }
}

// Récupérer les favoris depuis localStorage
function getFavorites() {
    const favorites = localStorage.getItem('bookFavorites');
    return favorites ? JSON.parse(favorites) : [];
}

// Ajouter un livre aux favoris
function addToFavorites(bookData) {
    let favorites = getFavorites();
    
    // Vérifier si le livre n'est pas déjà dans les favoris
    if (!favorites.some(fav => fav.title === bookData.title)) {
        favorites.push(bookData);
        localStorage.setItem('bookFavorites', JSON.stringify(favorites));
    }
}

// Retirer un livre des favoris
function removeFromFavorites(title) {
    let favorites = getFavorites();
    favorites = favorites.filter(fav => fav.title !== title);
    localStorage.setItem('bookFavorites', JSON.stringify(favorites));
}

// Charger et afficher les favoris sur la page Ma PAL
function loadFavorites() {
    const favorites = getFavorites();
    const listBook = document.querySelector('.list-book');
    
    if (!listBook) return;
    
    // Vider la liste actuelle (sauf si vous voulez garder les exemples)
    listBook.innerHTML = '';
    
    if (favorites.length === 0) {
        listBook.innerHTML = '<p style="text-align: center; color: #9CA3AF; padding: 40px; width: 100%;">Aucun livre dans votre PAL. Ajoutez des livres en cliquant sur les cœurs ❤️</p>';
        return;
    }
    
    // Créer une carte pour chaque favori
    favorites.forEach(book => {
        const card = createBookCard(book);
        listBook.appendChild(card);
    });
}

// Créer une carte de livre
function createBookCard(book) {
    const card = document.createElement('div');
    card.className = 'list-book__card';
    
    // Extraire juste le nom de fichier de l'URL complète
    const imagePath = book.image.includes('/') ? book.image.split('/').slice(-2).join('/') : book.image;
    
    card.innerHTML = `
        <div class="list-book__card__photo">
            <img src="assets/${imagePath}" alt="${book.title}">
        </div>
        <div class="list-book__card__content">
            <div class="list-book__card__content__title">
                <h2>${book.title}</h2>
                <button>
                    <ion-icon name="heart" class="red"></ion-icon>
                </button>
            </div>
            <p class="list-book__card__content__descript">${book.description}</p>
            <div class="list-book__card__content__btn">
                <a href="">
                    <p>Voir plus</p>
                    <ion-icon name="arrow-forward-outline"></ion-icon>
                </a>
            </div>
        </div>
    `;
    
    // Ajouter l'événement de clic au nouveau bouton
    setTimeout(() => {
        const button = card.querySelector('button');
        const heartIcon = button.querySelector('ion-icon[name="heart"]');
        
        button.style.cursor = 'pointer';
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleLike(heartIcon, button);
        });
    }, 100);
    
    return card;
}