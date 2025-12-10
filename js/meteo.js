function Meteo(commune) {

    // Sans accent, sans Majuscule
    const communeFormatted = commune.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

    const urlAPI = 'https://www.prevision-meteo.ch/services/json/'
    const mainElt = document.getElementById('main')
    
    // Afficher le chargement
    mainElt.innerHTML = `
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Chargement...</span>
            </div>
            <p class="mt-3">Chargement de la météo...</p>
        </div>
    `

    fetch(urlAPI + communeFormatted)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Une erreur s\'est produite')
            }
            return response.json()
        })

        .then((myData) => {
            // Récupérer les 7 jours (jour 0 à jour 4 disponibles dans l'API, on prend ce qu'il y a)
            const jours = []
            for (let i = 0; i <= 6; i++) {
                if (myData['fcst_day_' + i]) {
                    jours.push(myData['fcst_day_' + i])
                }
            }

            mainElt.innerHTML = ''

            // Le titre
            const h2Elt = document.createElement('h2')
            h2Elt.classList.add('text-center', 'my-4')
            h2Elt.innerHTML = `<i class="bi bi-geo-alt-fill"></i> Météo pour ${myData.city_info.name}`
            mainElt.appendChild(h2Elt)

            // Conteneur des cartes
            const rowElt = document.createElement('div')
            rowElt.classList.add('row', 'g-3', 'my-3')
            mainElt.appendChild(rowElt)

            for (let jour of jours) {
                // Colonne responsive
                let colElt = document.createElement('div')
                colElt.classList.add('col-6', 'col-sm-4', 'col-md-3', 'col-lg')
                rowElt.appendChild(colElt)

                // Carte météo
                let cardElt = document.createElement('div')
                cardElt.classList.add('weather-card', 'text-center')
                colElt.appendChild(cardElt)

                // Jour
                let h3Elt = document.createElement('h3')
                h3Elt.textContent = jour.day_long
                cardElt.appendChild(h3Elt)

                // Date
                let dateElt = document.createElement('small')
                dateElt.classList.add('text-muted', 'd-block', 'mb-2')
                dateElt.textContent = jour.date
                cardElt.appendChild(dateElt)

                // Icône météo
                let imageElt = document.createElement('img')
                imageElt.setAttribute('src', jour.icon_big)
                imageElt.setAttribute('alt', jour.condition)
                cardElt.appendChild(imageElt)

                // Condition
                let conditionElt = document.createElement('p')
                conditionElt.classList.add('mb-2', 'small')
                conditionElt.textContent = jour.condition
                cardElt.appendChild(conditionElt)

                // Températures
                let tempsElt = document.createElement('p')
                tempsElt.classList.add('temp', 'mb-0')
                tempsElt.innerHTML = `<span class="temp-min">${jour.tmin}°</span> / <span class="temp-max">${jour.tmax}°</span>`
                cardElt.appendChild(tempsElt)
            }
        })

        .catch((error) => {
            mainElt.innerHTML = `
                <div class="text-center py-5">
                    <i class="bi bi-exclamation-triangle text-warning" style="font-size: 4rem;"></i>
                    <p class="mt-3">Pas de météo disponible pour <strong>${commune}</strong></p>
                    <p class="text-muted">Essayez avec une autre commune</p>
                </div>
            `
        })
}