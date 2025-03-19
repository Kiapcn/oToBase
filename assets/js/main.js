// Script principal

// Gestion de la navigation active et du menu mobile
document.addEventListener('DOMContentLoaded', () => {
    // Récupérer le chemin actuel
    const currentPath = window.location.pathname;
    
    // Mettre à jour le lien actif dans la navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // Gestion du menu mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    function toggleMenu() {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }

    menuToggle.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    // Fermer le menu quand on clique sur un lien
    document.querySelectorAll('.sidebar a').forEach(link => {
        link.addEventListener('click', () => {
            if (sidebar.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Fermer le menu lors du redimensionnement de la fenêtre
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });
});

// Console Matrix globale
class MatrixConsole {
    constructor() {
        this.createConsole();
        this.createToggleButton();
        this.interceptConsole();
        this.addKeyboardShortcut();
        this.showWelcomeMessage();
    }

    createConsole() {
        this.console = document.createElement('div');
        this.console.className = 'matrix-console';
        
        // Ajouter un en-tête à la console
        const header = document.createElement('div');
        header.className = 'console-header';
        header.innerHTML = 
            '<div class="console-title">Console Matrix</div>' +
            '<div class="console-controls">' +
            '<span class="console-help" title="Ctrl + \` pour afficher/masquer">?</span>' +
            '<span class="console-clear" title="Effacer la console">×</span>' +
            '</div>';
        this.console.appendChild(header);

        // Conteneur pour les messages
        this.messagesContainer = document.createElement('div');
        this.messagesContainer.className = 'console-messages';
        this.console.appendChild(this.messagesContainer);

        document.body.appendChild(this.console);

        // Gestionnaire pour effacer la console
        header.querySelector('.console-clear').addEventListener('click', () => {
            this.messagesContainer.innerHTML = '';
            this.log('Console effacée');
        });

        // Gestionnaire pour l'aide
        header.querySelector('.console-help').addEventListener('click', () => {
            this.log('=== Aide de la Console Matrix ===');
            this.log('1. Utilisez Ctrl + ` ou le bouton en bas à droite pour afficher/masquer la console');
            this.log('2. Cliquez sur × pour effacer la console');
            this.log('3. Les messages sont colorés selon leur type (info, warning, error)');
            this.log('4. La console conserve les 100 derniers messages');
        });
    }

    createToggleButton() {
        this.toggleButton = document.createElement('button');
        this.toggleButton.className = 'matrix-console-toggle';
        this.toggleButton.innerHTML = '<i class="fas fa-terminal"></i>';
        this.toggleButton.title = 'Afficher/Masquer la Console Matrix (Ctrl + \`)';
        document.body.appendChild(this.toggleButton);
        
        this.toggleButton.addEventListener('click', () => this.toggle());
    }

    showWelcomeMessage() {
        this.log('=== Console Matrix initialisée ===');
        this.log('Utilisez le bouton en bas à droite ou Ctrl + ` pour afficher/masquer la console');
        this.log('Cette console affiche les logs, avertissements et erreurs de l\'application');
        this.log('Cliquez sur ? pour afficher l\'aide');
        this.log('----------------------------------------');
    }

    addKeyboardShortcut() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === '`') {
                this.toggle();
                e.preventDefault();
            }
        });
    }

    toggle() {
        this.console.classList.toggle('active');
        this.toggleButton.classList.toggle('active');
        
        if (this.console.classList.contains('active')) {
            this.log('Console affichée');
        }
    }

    log(message, type = 'info') {
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        const time = new Date().toLocaleTimeString();
        entry.innerHTML = 
            '<span class="log-time">[' + time + ']</span>' +
            '<span class="log-type">[' + type.toUpperCase() + ']</span>' +
            '<span class="log-message">' + message + '</span>';
        this.messagesContainer.appendChild(entry);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;

        // Limiter le nombre d'entrées à 100
        if (this.messagesContainer.children.length > 100) {
            this.messagesContainer.removeChild(this.messagesContainer.firstChild);
        }
    }

    interceptConsole() {
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        
        console.log = (...args) => {
            this.log(args.join(' '));
            originalLog.apply(console, args);
        };
        
        console.error = (...args) => {
            this.log(args.join(' '), 'error');
            originalError.apply(console, args);
        };
        
        console.warn = (...args) => {
            this.log(args.join(' '), 'warning');
            originalWarn.apply(console, args);
        };
    }
}

// Initialiser la console sur toutes les pages
document.addEventListener('DOMContentLoaded', () => {
    window.matrixConsole = new MatrixConsole();
    
    // Logs de test
    console.log('Page chargée avec succès');
    console.warn('Ceci est un avertissement de test');
    console.error('Ceci est une erreur de test');
});