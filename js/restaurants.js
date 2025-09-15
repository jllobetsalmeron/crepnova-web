// Datos de los restaurantes
const restaurants = [
    {
        id: 1,
        name: 'Crep Nova Bonanova',
        address: 'Passeig Bonanova 12, 08022 Barcelona',
        district: 'Sarrià-Sant Gervasi',
        phone: '93 211 55 97',
        schedule: 'Dilluns a Diumenge: 12:00 - 23:30',
        lat: 41.4054,
        lng: 2.1305,
        image: 'img/restaurant1.jpg',
        description: 'Al cor de Bonanova, oferim un espai acollidor amb terrassa i menjar casolà.'
    },
    {
        id: 2,
        name: 'Crep Nova Dr. Fleming',
        address: 'Doctor Fleming 15, 08017 Barcelona',
        district: 'Sarrià-Sant Gervasi',
        phone: '93 188 64 06',
        schedule: 'Dilluns a Diumenge: 12:00 - 23:30',
        lat: 41.3972,
        lng: 2.1223,
        image: 'img/restaurant2.jpg',
        description: 'A prop de l\'Hospital de Sant Joan de Déu, ideal per a una pausa amb menjar casolà.'
    },
    {
        id: 3,
        name: 'Crep Nova Muntaner',
        address: 'Muntaner 244, 08021 Barcelona',
        district: 'Sarrià-Sant Gervasi',
        phone: '93 315 38 90',
        schedule: 'Dilluns a Diumenge: 12:00 - 23:30',
        lat: 41.3956,
        lng: 2.1447,
        image: 'img/restaurant3.jpg',
        description: 'Al cor de Barcelona, prop de l\'Avinguda Diagonal.'
    },
    {
        id: 4,
        name: 'Crep Nova Pedralbes',
        address: 'Dr. August Pi i Sunyer 12, 08034 Barcelona',
        district: 'Les Corts',
        phone: '93 764 88 36',
        schedule: 'Dilluns a Diumenge: 12:00 - 23:30',
        lat: 41.3869,
        lng: 2.1180,
        image: 'img/restaurant4.jpg',
        description: 'A prop del Monestir de Pedralbes, un lloc perfecte per gaudir d\'un àpat en un entorn únic.'
    },
    {
        id: 5,
        name: 'Crep Nova Urgell',
        address: 'Compte d\'Urgell 280, 08036 Barcelona',
        district: 'Les Corts',
        phone: '93 688 69 58',
        schedule: 'Dilluns a Diumenge: 12:00 - 23:30',
        lat: 41.3858,
        lng: 2.1502,
        image: 'img/restaurant5.jpg',
        description: 'Al cor de Barcelona, proper a l\'Hospital Clínic.'
    },
    {
        id: 6,
        name: 'Crep Nova Sarrià',
        address: 'Passeig Bonanova 104, 08017 Barcelona',
        district: 'Sarrià-Sant Gervasi',
        phone: '93 205 96 46',
        schedule: 'Dilluns a Diumenge: 12:00 - 23:30',
        lat: 41.4002,
        lng: 2.1278,
        image: 'img/restaurant6.jpg',
        description: 'Al cor de Sarrià, amb un ambient acollidor i menjar casolà.'
    },
    {
        id: 7,
        name: 'Crep Nova Sant Cugat',
        address: 'Mercat de Torreblanca, 08172 St. Cugat',
        district: 'Sant Cugat',
        phone: '93 589 03 49',
        schedule: 'Dilluns a Diumenge: 12:00 - 23:30',
        lat: 41.4667,
        lng: 2.0833,
        image: 'img/restaurant7.jpg',
        description: 'Al mercat de Torreblanca, a Sant Cugat.'
    },
    {
        id: 8,
        name: 'Crep Nova La Maquinista',
        address: 'Potosí, 2 Local A-3, 08030 Barcelona',
        district: 'Sant Andreu',
        phone: '93 156 44 45',
        schedule: 'Dilluns a Diumenge: 12:00 - 23:30',
        lat: 41.4389,
        lng: 2.1967,
        image: 'img/restaurant8.jpg',
        description: 'Dins el centre comercial La Maquinista, ideal per a una pausa durant les compres.'
    },
    {
        id: 9,
        name: 'Crep Nova Diagonal',
        address: 'Avinguda Diagonal 372, 08037 Barcelona',
        district: 'Eixample',
        phone: '93 206 78 26',
        schedule: 'Dilluns a Diumenge: 12:00 - 23:30',
        lat: 41.3994,
        lng: 2.1748,
        image: 'img/restaurant9.jpg',
        description: 'A l\'avinguda Diagonal, proper a la Sagrada Família.'
    },
    {
        id: 10,
        name: 'Crep Nova Quevedo',
        address: 'Calle de Eloy Gonzalo 4, 28010 Madrid',
        district: 'Madrid',
        phone: '91 519 02 93',
        schedule: 'Dilluns a Diumenge: 12:00 - 23:30',
        lat: 40.4319,
        lng: -3.7038,
        image: 'img/restaurant10.jpg',
        description: 'Al cor de Madrid, al barri de Chamberí.'
    },
    {
        id: 11,
        name: 'Crep Nova Delivery Laforja',
        address: 'Laforja 132, 08021 Barcelona',
        district: 'Sarrià-Sant Gervasi',
        phone: '93 859 97 66',
        schedule: 'Dilluns a Diumenge: 12:00 - 23:30',
        lat: 41.3987,
        lng: 2.1389,
        image: 'img/restaurant11.jpg',
        description: 'Servei de delivery a la zona de Laforja.'
    },
    {
        id: 12,
        name: 'Crep Nova Delivery Esplugues',
        address: 'Carrer de Laureà Miró 221, 08950 Esplugues de Llobregat',
        district: 'Baix Llobregat',
        phone: '93 764 91 78',
        schedule: 'Dilluns a Diumenge: 12:00 - 23:30',
        lat: 41.3780,
        lng: 2.0878,
        image: 'img/restaurant12.jpg',
        description: 'Servei de delivery a Esplugues de Llobregat.'
    },
    {
        id: 13,
        name: 'Crep Nova Delivery Juan Bosco',
        address: 'Passeig Sant Joan Bosco 55, 08017 Barcelona',
        district: 'Sarrià-Sant Gervasi',
        phone: '93 127 40 85',
        schedule: 'Dilluns a Diumenge: 12:00 - 23:30',
        lat: 41.4008,
        lng: 2.1236,
        image: 'img/restaurant13.jpg',
        description: 'Servei de delivery a la zona de Sant Joan Bosco.'
    }
];

// Variables globales
let map;
let markers = [];
let activeRestaurantId = null;

// Inicialización cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el mapa
    initMap();
    
    // Cargar la lista de restaurantes
    loadRestaurants();
    
    // Configurar eventos de búsqueda y filtros
    setupEventListeners();
});

// Función para inicializar el mapa
function initMap() {
    // Coordenadas del centro de Barcelona
    const barcelona = { lat: 41.3874, lng: 2.1686 };
    
    // Crear el mapa centrado en Barcelona
    map = L.map('map').setView(barcelona, 13);
    
    // Añadir capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Añadir marcadores para cada restaurante
    addRestaurantsToMap();
}

// Función para añadir restaurantes al mapa
function addRestaurantsToMap() {
    // Limpiar marcadores existentes
    clearMarkers();
    
    // Añadir un marcador para cada restaurante
    restaurants.forEach(restaurant => {
        const marker = L.marker([restaurant.lat, restaurant.lng], {
            icon: L.divIcon({
                className: 'custom-marker',
                html: restaurant.id,
                iconSize: [30, 30],
                iconAnchor: [15, 30],
                popupAnchor: [0, -30]
            })
        });
        
        // Añadir popup con información básica
        marker.bindPopup(`
            <div class="map-popup">
                <h4>${restaurant.name}</h4>
                <p>${restaurant.address}</p>
                <p><i class="fas fa-phone"></i> ${restaurant.phone}</p>
                <button class="btn" onclick="focusOnRestaurant(${restaurant.id})">
                    Veure detalls
                </button>
            </div>
        `);
        
        // Añadir evento de clic al marcador
        marker.on('click', function() {
            // Resaltar el restaurante en la lista
            highlightRestaurantInList(restaurant.id);
        });
        
        // Añadir marcador al array de marcadores
        markers[restaurant.id] = marker;
        
        // Añadir marcador al mapa
        marker.addTo(map);
    });
}

// Función para limpiar todos los marcadores del mapa
function clearMarkers() {
    markers.forEach(marker => {
        if (marker) {
            map.removeLayer(marker);
        }
    });
    markers = [];
}

// Función para cargar la lista de restaurantes
function loadRestaurants(filteredRestaurants = restaurants) {
    const restaurantsList = document.getElementById('restaurantsList');
    
    // Limpiar lista actual
    restaurantsList.innerHTML = '';
    
    if (filteredRestaurants.length === 0) {
        restaurantsList.innerHTML = '<div class="no-results">No s\'han trobat restaurants amb aquests criteris de cerca.</div>';
        return;
    }
    
    // Añadir cada restaurante a la lista
    filteredRestaurants.forEach(restaurant => {
        const restaurantElement = createRestaurantElement(restaurant);
        restaurantsList.appendChild(restaurantElement);
        
        // Añadir evento de clic al restaurante para alternar la selección
        restaurantElement.addEventListener('click', function() {
            // Usamos highlightRestaurantInList para manejar tanto la selección como la deselección
            if (restaurantElement.classList.contains('active')) {
                highlightRestaurantInList(restaurant.id); // Esto la deseleccionará
            } else {
                highlightRestaurantInList(restaurant.id); // Esto la seleccionará
                focusOnMap(restaurant.lat, restaurant.lng);
            }
        });
    });
    
    // Resaltar el primer restaurante por defecto
    if (filteredRestaurants.length > 0) {
        highlightRestaurantInList(filteredRestaurants[0].id);
    }
}

// Función para crear un elemento de restaurante
function createRestaurantElement(restaurant) {
    // Crear el elemento del restaurante
    const element = document.createElement('div');
    element.className = 'restaurant-item';
    element.dataset.id = restaurant.id;
    
    // Crear el HTML del restaurante con atributos de traducción
    element.innerHTML = `
        <div class="restaurant-header">
            <h3>${restaurant.name}</h3>
        </div>
        <div class="restaurant-details">
            <p><i class="fas fa-map-marker-alt"></i> ${restaurant.address}</p>
            <p><i class="fas fa-phone"></i> Telèfon: ${restaurant.phone}</p>
            <p><i class="far fa-clock"></i> Horari: ${restaurant.schedule}</p>
            <p class="restaurant-description">${restaurant.description}</p>
            <div class="restaurant-actions">
                <a href="tel:${restaurant.phone.replace(/\s/g, '')}" class="btn">
                    <i class="fas fa-phone"></i> Trucar
                </a>
            </div>
        </div>
    `;
    
    return element;
}

// Función para resaltar o deseleccionar un restaurante en la lista
function highlightRestaurantInList(restaurantId) {
    const selectedRestaurant = document.querySelector(`.restaurant-item[data-id="${restaurantId}"]`);
    
    // Si el restaurante ya está activo, lo deseleccionamos
    if (activeRestaurantId === restaurantId) {
        if (selectedRestaurant) {
            selectedRestaurant.classList.remove('active');
        }
        updateActiveMarker(null);
        activeRestaurantId = null;
        return;
    }
    
    // Quitar la clase 'active' de todos los restaurantes
    document.querySelectorAll('.restaurant-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Añadir la clase 'active' al restaurante seleccionado
    if (selectedRestaurant) {
        selectedRestaurant.classList.add('active');
        selectedRestaurant.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // Actualizar el marcador activo en el mapa
    updateActiveMarker(restaurantId);
    
    // Actualizar el restaurante activo
    activeRestaurantId = restaurantId;
}

// Función para actualizar el marcador activo en el mapa
function updateActiveMarker(restaurantId) {
    // Si no hay ID, solo reseteamos todos los marcadores
    if (restaurantId === null || restaurantId === undefined) {
        markers.forEach((marker, id) => {
            if (marker) {
                const markerElement = marker.getElement();
                if (markerElement) {
                    markerElement.className = 'custom-marker';
                }
            }
        });
        return;
    }
    
    // Resetear todos los marcadores
    markers.forEach((marker, id) => {
        if (marker) {
            const markerElement = marker.getElement();
            if (markerElement) {
                markerElement.className = 'custom-marker';
            }
        }
    });
    
    // Resaltar el marcador activo
    const activeMarker = markers[restaurantId];
    if (activeMarker) {
        const markerElement = activeMarker.getElement();
        if (markerElement) {
            markerElement.className = 'custom-marker active';
        }
    }
}

// Función para centrar el mapa en una ubicación específica
function focusOnMap(lat, lng) {
    map.flyTo([lat, lng], 16, {
        duration: 1,
        easeLinearity: 0.25
    });
}

// Función para centrarse en un restaurante específico (desde el popup del mapa)
function focusOnRestaurant(restaurantId) {
    const restaurant = restaurants.find(r => r.id === restaurantId);
    if (restaurant) {
        highlightRestaurantInList(restaurantId);
        focusOnMap(restaurant.lat, restaurant.lng);
    }
}

// Función para configurar los event listeners
function setupEventListeners() {
    // Búsqueda por texto
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', filterRestaurants);
    }
    
    // Filtro por distrito
    const districtFilter = document.getElementById('districtFilter');
    if (districtFilter) {
        districtFilter.addEventListener('change', filterRestaurants);
    }
}

// Función para filtrar restaurantes según los criterios de búsqueda
function filterRestaurants() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const district = document.getElementById('districtFilter').value;
    
    const filtered = restaurants.filter(restaurant => {
        const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm) ||
                            restaurant.address.toLowerCase().includes(searchTerm) ||
                            restaurant.district.toLowerCase().includes(searchTerm);
        
        const matchesDistrict = !district || restaurant.district === district;
        
        return matchesSearch && matchesDistrict;
    });
    
    // Recargar la lista con los restaurantes filtrados
    loadRestaurants(filtered);
    
    // Actualizar marcadores en el mapa
    updateMapMarkers(filtered);
}

// Función para actualizar los marcadores en el mapa según los filtros
function updateMapMarkers(filteredRestaurants) {
    // Ocultar todos los marcadores
    markers.forEach(marker => {
        if (marker) {
            map.removeLayer(marker);
        }
    });
    
    // Mostrar solo los marcadores de los restaurantes filtrados
    filteredRestaurants.forEach(restaurant => {
        const marker = markers[restaurant.id];
        if (marker) {
            marker.addTo(map);
        }
    });
    
    // Ajustar la vista del mapa para mostrar todos los marcadores visibles
    if (filteredRestaurants.length > 0) {
        const group = new L.featureGroup(
            filteredRestaurants.map(restaurant => markers[restaurant.id]).filter(Boolean)
        );
        
        if (filteredRestaurants.length === 1) {
            // Si solo hay un resultado, centrar en ese punto con zoom cercano
            map.flyTo(
                [filteredRestaurants[0].lat, filteredRestaurants[0].lng],
                16,
                { duration: 1 }
            );
        } else if (filteredRestaurants.length > 0) {
            // Si hay varios resultados, ajustar la vista para mostrarlos todos
            map.fitBounds(group.getBounds().pad(0.1), { maxZoom: 15 });
        }
    }
}

// Función para obtener la ubicación del usuario
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                
                // Centrar el mapa en la ubicación del usuario
                map.flyTo([userLat, userLng], 15);
                
                // Añadir marcador de la ubicación del usuario
                L.marker([userLat, userLng], {
                    icon: L.divIcon({
                        className: 'user-location-marker',
                        html: '<i class="fas fa-user"></i>',
                        iconSize: [30, 30],
                        iconAnchor: [15, 30]
                    })
                }).addTo(map);
                
                // Opcional: Ordenar restaurantes por distancia
                sortRestaurantsByDistance(userLat, userLng);
            },
            error => {
                console.error('Error al obtener la ubicación:', error);
                // Mostrar un mensaje al usuario o usar una ubicación por defecto
            }
        );
    } else {
        alert('La geolocalización no es soportada por tu navegador.');
    }
}

// Función para ordenar restaurantes por distancia a la ubicación del usuario
function sortRestaurantsByDistance(userLat, userLng) {
    // Calcular distancia para cada restaurante
    const restaurantsWithDistance = restaurants.map(restaurant => {
        const distance = calculateDistance(
            userLat, 
            userLng, 
            restaurant.lat, 
            restaurant.lng
        );
        
        return {
            ...restaurant,
            distance: distance
        };
    });
    
    // Ordenar por distancia (más cercano primero)
    restaurantsWithDistance.sort((a, b) => a.distance - b.distance);
    
    // Recargar la lista con los restaurantes ordenados
    loadRestaurants(restaurantsWithDistance);
}

// Función para calcular la distancia entre dos coordenadas (fórmula del semiverseno)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return distance;
}

// Función auxiliar para convertir grados a radianes
function toRad(degrees) {
    return degrees * (Math.PI / 180);
}

// Hacer la función accesible globalmente
window.focusOnRestaurant = focusOnRestaurant;

// Opcional: Añadir botón de ubicación
function addLocationButton() {
    const locationButton = document.createElement('button');
    locationButton.id = 'locationButton';
    locationButton.className = 'btn';
    locationButton.innerHTML = '<i class="fas fa-location-arrow"></i> Troba el més proper';
    locationButton.onclick = getUserLocation;
    
    const filters = document.querySelector('.filters');
    if (filters) {
        filters.appendChild(locationButton);
    }
}

// Inicializar el botón de ubicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    addLocationButton();
    
    // Escuchar cambios de idioma
    document.addEventListener('languageChanged', function() {
        // Recargar los restaurantes para actualizar los textos traducidos
        const currentFilter = document.getElementById('districtFilter').value;
        const currentSearch = document.getElementById('searchInput').value.toLowerCase();
        filterRestaurants();
    });
});
