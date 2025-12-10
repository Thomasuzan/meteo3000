fetch('https://geo.api.gouv.fr/departements')
    .then((response) => {
        if (!response.ok) {
            throw new Error('Une erreur s\'est produite')
        }
        return response.json()
    })

    .then((myData) => {

        const departementElt = document.getElementById('departement')
        const communeElt = document.getElementById('commune')
        
        for (let option of myData) {
            let optionElt = document.createElement('option')
            optionElt.textContent = option.nom
            optionElt.setAttribute('value', option.code)
            departementElt.appendChild(optionElt)
        }

        departementElt.addEventListener('change', (e) => {
            let numeroDepartement = e.target.value
            
            // Activer le select commune
            communeElt.disabled = false
            communeElt.innerHTML = '<option selected disabled>Chargement...</option>'
            
            fetch('https://geo.api.gouv.fr/departements/' + numeroDepartement + '/communes')
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Une erreur s\'est produite')
                    }
                    return response.json()
                })
                .then((myData) => {
                    // Trier par nom
                    myData.sort((a, b) => a.nom.localeCompare(b.nom))
                    
                    communeElt.innerHTML = ''
                    let optionDefault = document.createElement('option')
                    optionDefault.textContent = 'Choisir une commune'
                    optionDefault.setAttribute('selected', 'selected')
                    optionDefault.setAttribute('disabled', 'disabled')
                    communeElt.appendChild(optionDefault)
                    
                    for (let option of myData) {
                        let optionElt = document.createElement('option')
                        optionElt.textContent = option.nom
                        optionElt.setAttribute('value', option.nom)
                        communeElt.appendChild(optionElt)
                    }
                })
        })

        communeElt.addEventListener('change', (e) => {
            Meteo(e.target.value)
        })

    })
    .catch((error) => {
        console.error('Erreur lors du chargement des départements:', error)
    })