import http.server
import socketserver
import os
import sys
import time

# Configuration du port
PORT = 8000

# Configuration du handler pour servir les fichiers statiques
Handler = http.server.SimpleHTTPRequestHandler

# Permettre la réutilisation du port
socketserver.TCPServer.allow_reuse_address = True

def start_server():
    try:
        # Création du serveur
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            print(f"Serveur démarré sur le port {PORT}")
            print(f"Vous pouvez accéder au site à l'adresse : http://localhost:{PORT}")
            print("Appuyez sur Ctrl+C pour arrêter le serveur")
            httpd.serve_forever()
    except OSError as e:
        if e.errno == 48:  # Port déjà utilisé
            print(f"Le port {PORT} est déjà utilisé. Tentative de redémarrage...")
            time.sleep(1)  # Attendre un peu que le port se libère
            start_server()  # Réessayer
        else:
            print(f"Erreur lors du démarrage du serveur : {e}")
            sys.exit(1)
    except KeyboardInterrupt:
        print("\nServeur arrêté.")
        sys.exit(0)

if __name__ == "__main__":
    start_server() 