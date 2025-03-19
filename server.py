from flask import Flask, request, jsonify, send_from_directory, render_template
import os
from werkzeug.utils import secure_filename
import subprocess
import json
from datetime import datetime
import uuid
import logging
from flask_cors import CORS

app = Flask(__name__, static_url_path='', static_folder='.')
CORS(app)

# Configuration
UPLOAD_FOLDER = 'temp/uploads'
OUTPUT_FOLDER = 'temp/output'
ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov', 'mkv', 'webm'}
MAX_CONTENT_LENGTH = 2 * 1024 * 1024 * 1024  # 2GB

# Création des dossiers temporaires s'ils n'existent pas
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('conversion.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_output_path(original_filename, format, preset):
    """Génère un nom de fichier unique pour la sortie"""
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    unique_id = str(uuid.uuid4())[:8]
    filename = secure_filename(original_filename)
    base_name = os.path.splitext(filename)[0]
    return os.path.join(OUTPUT_FOLDER, f"{base_name}_{timestamp}_{unique_id}.{format}")

def get_video_info(input_path):
    """Récupère les informations de la vidéo"""
    try:
        cmd = ['ffprobe', '-v', 'quiet', '-print_format', 'json', '-show_format', '-show_streams', input_path]
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode != 0:
            logger.error(f"Erreur ffprobe: {result.stderr}")
            return None
            
        probe = json.loads(result.stdout)
        video_stream = next((s for s in probe['streams'] if s['codec_type'] == 'video'), None)
        
        if not video_stream:
            return None
            
        return {
            'width': int(video_stream.get('width', 0)),
            'height': int(video_stream.get('height', 0)),
            'duration': float(probe['format'].get('duration', 0)),
            'size': os.path.getsize(input_path),
            'format': probe['format'].get('format_name', '')
        }
    except Exception as e:
        logger.error(f"Erreur lors de la récupération des informations vidéo: {str(e)}")
        return None

def convert_video(input_path, output_path, options):
    """Convertit la vidéo selon les options spécifiées"""
    try:
        # Construire la commande ffmpeg
        cmd = ['ffmpeg', '-i', input_path]
        
        # Ajouter les options de redimensionnement
        if options['resolution'] != 'original':
            if 'x' in options['resolution']:
                width, height = map(int, options['resolution'].split('x'))
                cmd.extend(['-vf', f'scale={width}:{height}'])
        
        # Ajouter les options de qualité
        quality_presets = {
            'high': ['-crf', '20', '-preset', 'slow'],
            'medium': ['-crf', '23', '-preset', 'medium'],
            'low': ['-crf', '28', '-preset', 'fast']
        }
        
        quality = options.get('quality', 'medium')
        cmd.extend(quality_presets[quality])
        
        # Ajouter les options audio
        cmd.extend(['-c:a', 'aac', '-b:a', '192k'])
        
        # Ajouter le chemin de sortie et les options de remplacement
        cmd.extend(['-y', output_path])
        
        # Exécuter la commande
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode != 0:
            logger.error(f"Erreur ffmpeg: {result.stderr}")
            return False
            
        return True
    except Exception as e:
        logger.error(f"Erreur lors de la conversion: {str(e)}")
        return False

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/assets/<path:path>')
def serve_assets(path):
    return send_from_directory('assets', path)

@app.route('/modules/<path:path>')
def serve_modules(path):
    if path.endswith('/'):
        path += 'index.html'
    elif not '.' in path:
        path += '/index.html'
    return send_from_directory('modules', path)

@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        if 'video' not in request.files:
            logger.error("Aucun fichier n'a été envoyé")
            return jsonify({'error': 'Aucun fichier n\'a été envoyé'}), 400
        
        file = request.files['video']
        if file.filename == '':
            logger.error("Aucun fichier sélectionné")
            return jsonify({'error': 'Aucun fichier sélectionné'}), 400
        
        if not allowed_file(file.filename):
            logger.error(f"Format de fichier non supporté: {file.filename}")
            return jsonify({'error': 'Format de fichier non supporté'}), 400

        filename = secure_filename(file.filename)
        input_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(input_path)
        
        logger.info(f"Fichier sauvegardé: {input_path}")
        
        video_info = get_video_info(input_path)
        if not video_info:
            logger.error("Impossible de lire les informations de la vidéo")
            return jsonify({'error': 'Impossible de lire les informations de la vidéo'}), 400

        return jsonify({
            'success': True,
            'filename': filename,
            'info': video_info
        })
    except Exception as e:
        logger.error(f"Erreur lors du téléversement: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/convert', methods=['POST'])
def convert():
    try:
        if not request.is_json:
            return jsonify({'error': 'Le contenu doit être au format JSON'}), 415

        data = request.get_json()
        if not data or 'filename' not in data or 'options' not in data:
            return jsonify({'error': 'Données manquantes'}), 400

        filename = secure_filename(data['filename'])
        input_path = os.path.join(UPLOAD_FOLDER, filename)
        if not os.path.exists(input_path):
            return jsonify({'error': 'Fichier non trouvé'}), 404

        # Vérifier que le format de sortie est valide
        output_format = data['options'].get('format', 'mp4').lower()
        if output_format not in ALLOWED_EXTENSIONS:
            return jsonify({'error': f'Format de sortie non supporté: {output_format}'}), 400

        # Générer le nom du fichier de sortie
        output_filename = get_output_path(filename, output_format, data['options'].get('preset', 'custom'))
        
        # Convertir la vidéo
        success = convert_video(input_path, output_filename, data['options'])
        if not success:
            return jsonify({'error': 'Erreur lors de la conversion'}), 500

        # Récupérer les informations de la vidéo convertie
        output_info = get_video_info(output_filename)
        if not output_info:
            return jsonify({'error': 'Erreur lors de la récupération des informations de la vidéo convertie'}), 500

        # Retourner les informations de la vidéo convertie
        return jsonify({
            'success': True,
            'filename': os.path.basename(output_filename),
            'format': output_format,
            'quality': data['options'].get('quality', 'high'),
            'resolution': data['options'].get('resolution', 'original'),
            'aspectRatio': data['options'].get('aspectRatio', 'original'),
            'info': output_info
        })

    except Exception as e:
        logger.error(f"Erreur lors de la conversion: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/download/<path:filename>')
def download_file(filename):
    try:
        return send_from_directory(OUTPUT_FOLDER, filename, as_attachment=True)
    except Exception as e:
        logger.error(f"Erreur lors du téléchargement: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.errorhandler(413)
def too_large(e):
    return jsonify({'error': 'Le fichier est trop volumineux'}), 413

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True) 