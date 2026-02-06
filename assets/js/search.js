const data = [
            { title: "Destin forge par le feu", description: "Au temps des dragons, les puissantes souveraines du clan Daercathian régnaient sur Tìr Teine. Mais la matriarchie a dépéri au profit d'une lignée de rois de plus en plus faibles, pervertie par les préceptes d'une religion oppressive. [...]" },
            { title: "Affronter la nuit", description: "Au temps des dragons, les puissantes souveraines du clanDaercathian régnaient sur Tìr Teine. Mais la matriarchie a dépéri au profit d'une lignée de rois de plus en plus faibles, pervertie par les préceptes d'une religion oppressive. [...]" },
            { title: "Assoiffés", description: "Seule mortelle dans une académie fréquentée par des créatures surnaturelles, comment Grace survivra-t-elle ?Mon monde a basculé le jour où j'ai atterri au lycée Katmere. Me voilà, simple mortelle, au milieude vampires, de loups-garous, et autres êtres surnaturels.[...]" },
            { title: "Promotion Funeste", description: "À la Scholomance, El, Orion et leurs camarades sont enfin en terminale, année sur laquelle plane le spectre de la remise des diplômes, rite de passage mortel... au sens propre.El est déterminée : ses amis et elle survivront. [...]" },
            { title: "Fourth Wings", description: "" },
            { title: "Le Prince Cruel", description: "" },
            { title: "Darkest Minds", description: "" },
            { title: "L'Empire de Ouragan", description: "" },
            { title: "La Guérisseuse de Royaume", description: "" },
        ];

        const searchInput = document.getElementById('searchInput');
        const clearBtn = document.getElementById('clearBtn');
        const resultsContainer = document.getElementById('resultsContainer');

        // Fonction pour mettre en surbrillance les termes recherchés
        function highlightText(text, query) {
            if (!query) return text;
            const regex = new RegExp(`(${query})`, 'gi');
            return text.replace(regex, '<span class="highlight">$1</span>');
        }

        // Fonction de recherche
        function performSearch(query) {
            // Nettoyer la requête
            query = query.trim().toLowerCase();

            // Si la requête est vide, cacher les résultats
            if (!query) {
                resultsContainer.classList.remove('show');
                resultsContainer.innerHTML = '';
                return;
            }

            // Filtrer les données
            const results = data.filter(item => {
                return item.title.toLowerCase().includes(query) || 
                       item.description.toLowerCase().includes(query);
            });

            // Afficher les résultats
            displayResults(results, query);
        }

        // Fonction pour afficher les résultats
        function displayResults(results, query) {
            resultsContainer.innerHTML = '';

            if (results.length === 0) {
                resultsContainer.innerHTML = '<div class="no-results">Aucun résultat trouvé</div>';
                resultsContainer.classList.add('show');
                return;
            }

            results.forEach(item => {
                const resultItem = document.createElement('div');
                resultItem.className = 'result-item';
                resultItem.innerHTML = `
                    <div class="result-title">${highlightText(item.title, query)}</div>
                    <div class="result-description">${highlightText(item.description, query)}</div>
                `;
                
                resultItem.addEventListener('click', () => {
                    searchInput.value = item.title;
                    resultsContainer.classList.remove('show');
                    alert(`Vous avez sélectionné : ${item.title}`);
                });

                resultsContainer.appendChild(resultItem);
            });

            resultsContainer.classList.add('show');
        }

        // Événement de saisie
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value;
            
            // Afficher/cacher le bouton de suppression
            if (query) {
                clearBtn.style.display = 'block';
            } else {
                clearBtn.style.display = 'none';
            }

            performSearch(query);
        });

        // Bouton de suppression
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            clearBtn.style.display = 'none';
            resultsContainer.classList.remove('show');
            resultsContainer.innerHTML = '';
            searchInput.focus();
        });

        // Fermer les résultats en cliquant à l'extérieur
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.container')) {
                resultsContainer.classList.remove('show');
            }
        });

        // Focus sur le champ de recherche au chargement
        searchInput.focus();