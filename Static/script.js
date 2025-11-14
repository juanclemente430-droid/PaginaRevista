// Sistema de usuarios simulado (en una app real, esto sería una base de datos)
let users = JSON.parse(localStorage.getItem('duolingo_users') || '{}');
let currentUser = localStorage.getItem('current_user');

// Datos de progreso del usuario actual
let userProgress = {
    completedLessons: [],
    currentLesson: 0,
    exp: 0,
    streak: 1,
    gems: 505,
    hearts: 5
};

// Verificar si el DOM está listo
function waitForDOM(callback) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        callback();
    }
}

// Cargar progreso del usuario actual
function loadUserProgress() {
    if (currentUser && users[currentUser]) {
        userProgress = users[currentUser].progress;
        updateUI();
    }
}

// Guardar progreso del usuario actual
function saveUserProgress() {
    if (currentUser) {
        users[currentUser].progress = userProgress;
        localStorage.setItem('duolingo_users', JSON.stringify(users));
    }
}

// Actualizar interfaz con datos del usuario
function updateUI() {
    // Verificar que los elementos existan antes de actualizarlos
    const streakElement = document.querySelector('.stat-item:nth-child(2)');
    const gemsElement = document.querySelector('.stat-item:nth-child(3)');
    const heartsElement = document.querySelector('.stat-item:nth-child(4)');
    
    if (streakElement) streakElement.innerHTML = `🔥 ${userProgress.streak}`;
    if (gemsElement) gemsElement.innerHTML = `💎 ${userProgress.gems}`;
    if (heartsElement) heartsElement.innerHTML = `❤️ ${userProgress.hearts}`;
    
    // Actualizar primer item
    const firstItem = document.querySelector('.first-lesson-item');
    if (firstItem) {
        if (userProgress.completedLessons.includes(0)) {
            firstItem.classList.add('completed');
            firstItem.classList.remove('active');
        } else {
            firstItem.classList.add('active');
            firstItem.classList.remove('completed');
        }
    }
    
    // Actualizar lecciones restantes (empezando desde index 1)
    const lessons = document.querySelectorAll('.lesson-item');
    lessons.forEach((lesson, index) => {
        const lessonIndex = index + 1; // Ajustar índice porque el primer item ya no está aquí
        if (userProgress.completedLessons.includes(lessonIndex)) {
            lesson.classList.add('completed');
            lesson.classList.remove('active');
        } else if (lessonIndex === userProgress.currentLesson) {
            lesson.classList.add('active');
            lesson.classList.remove('completed');
        } else {
            lesson.classList.remove('completed', 'active');
        }
    });

    // Mostrar/ocultar botón de crear perfil
    const profileCard = document.querySelector('.profile-card');
    if (profileCard && currentUser) {
        profileCard.innerHTML = `
            <div class="card-title">¡Hola ${currentUser}! 👋</div>
            <p>Progreso guardado automáticamente</p>
            <button onclick="logout()" style="background: #ff4b4b; color: white; border: none; padding: 10px 20px; border-radius: 8px; margin-top: 10px; cursor: pointer;">CERRAR SESIÓN</button>
        `;
    }
}

function showLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'none';
    }
    // Limpiar campos
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    if (username) username.value = '';
    if (password) password.value = '';
}

function login() {
    const usernameElement = document.getElementById('username');
    const passwordElement = document.getElementById('password');
    
    if (!usernameElement || !passwordElement) {
        console.error('Elementos de login no encontrados');
        return;
    }
    
    const username = usernameElement.value.trim();
    const password = passwordElement.value.trim();

    if (!username || !password) {
        alert('Por favor, completa todos los campos');
        return;
    }

    if (users[username] && users[username].password === password) {
        currentUser = username;
        localStorage.setItem('current_user', currentUser);
        loadUserProgress();
        closeModal();
        alert(`¡Bienvenido de vuelta, ${username}! 🎉`);
    } else {
        alert('Usuario o contraseña incorrectos');
    }
}

function register() {
    const usernameElement = document.getElementById('username');
    const passwordElement = document.getElementById('password');
    
    if (!usernameElement || !passwordElement) {
        console.error('Elementos de registro no encontrados');
        return;
    }
    
    const username = usernameElement.value.trim();
    const password = passwordElement.value.trim();

    if (!username || !password) {
        alert('Por favor, completa todos los campos');
        return;
    }

    if (users[username]) {
        alert('Este usuario ya existe');
        return;
    }

    users[username] = {
        password: password,
        progress: {
            completedLessons: [],
            currentLesson: 0,
            exp: 0,
            streak: 1,
            gems: 505,
            hearts: 5
        }
    };

    localStorage.setItem('duolingo_users', JSON.stringify(users));
    currentUser = username;
    localStorage.setItem('current_user', currentUser);
    loadUserProgress();
    closeModal();
    alert(`¡Cuenta creada exitosamente! Bienvenido ${username} 🎉`);
}

function logout() {
    currentUser = null;
    localStorage.removeItem('current_user');
    location.reload();
}

function startLesson() {
    if (!currentUser) {
        showLoginModal();
        return;
    }

    // Completar lección actual
    if (!userProgress.completedLessons.includes(userProgress.currentLesson)) {
        userProgress.completedLessons.push(userProgress.currentLesson);
        userProgress.exp += 10;
        userProgress.gems += 5;
        userProgress.currentLesson++;
        saveUserProgress();
        updateUI();
        alert('¡Lección completada! +10 EXP 🎉');
    } else {
        alert('¡Ya completaste esta lección!');
    }
}

function createProfile() {
    showLoginModal();
}

// Función para inicializar eventos interactivos
function initializeInteractiveElements() {
    // Animación sutil para los elementos de navegación
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
        });
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });

    // Efecto de clic en los botones
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Efecto ripple
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255,255,255,0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.remove();
                }
            }, 600);
        });
    });

    // Añadir eventos de clic a las lecciones
    const firstItem = document.querySelector('.first-lesson-item');
    if (firstItem) {
        firstItem.addEventListener('click', () => startLesson());
    }

    const lessonItems = document.querySelectorAll('.lesson-item');
    lessonItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            if (!currentUser) {
                showLoginModal();
                return;
            }
            // Lógica para iniciar lecciones específicas
            console.log(`Lección ${index + 2} clickeada`);
        });
    });

    // Cerrar modal con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// Inicialización principal
function initializeApp() {
    console.log('🚀 Inicializando aplicación Duolingo...');
    
    // Cargar progreso del usuario
    loadUserProgress();
    
    // Inicializar elementos interactivos
    initializeInteractiveElements();
    
    console.log('✅ Aplicación inicializada correctamente');
}

// Inicializar cuando el DOM esté listo
waitForDOM(initializeApp);

// También inicializar cuando la ventana cargue completamente (respaldo)
window.addEventListener('load', function() {
    // Solo ejecutar si no se ha inicializado ya
    if (!window.duolingoInitialized) {
        initializeApp();
        window.duolingoInitialized = true;
    }
});