// Manejar el cambio de header al hacer scroll
window.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header.header');
    
    // Solo si estamos en la página de inicio
    if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
        // Función para manejar el scroll
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.remove('header--transparent');
                header.classList.add('header--sticky');
            } else {
                header.classList.remove('header--sticky');
                header.classList.add('header--transparent');
            }
        };

        // Asegurarse de que el header tenga la clase transparente al cargar
        header.classList.add('header--transparent');
        
        // Escuchar el evento de scroll
        window.addEventListener('scroll', handleScroll);
        
        // Ejecutar una vez al cargar para verificar la posición inicial
        handleScroll();
    } else {
        // Para otras páginas que no sean la de inicio
        header.classList.add('header--sticky');
    }
});

// Función para el menú móvil
function toggleMenu() {
    const menuToggle = document.querySelector('.menuToggle');
    const navigation = document.querySelector('nav');
    menuToggle.classList.toggle('active');
    navigation.classList.toggle('active');
}
