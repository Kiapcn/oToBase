class VideoTool {
    constructor() {
        this.dropZone = document.querySelector('.drop-zone');
        this.fileInput = document.querySelector('.file-input');
        this.previewZone = document.querySelector('.preview-zone');
        this.videoPreview = null;
        this.conversionOptions = document.getElementById('conversionOptions');
        this.progressZone = document.getElementById('progressZone');
        this.progressBar = document.getElementById('progressBar');
        this.progressText = document.getElementById('progressText');
        this.progressStatus = document.getElementById('progressStatus');
        this.convertButton = document.getElementById('convertButton');
        this.resetButton = document.getElementById('resetButton');
        
        this.currentFile = null;
        this.isUploading = false;
        this.hasUploadedFile = false;
        this.presets = {
            'instagram-story': {
                format: 'mp4',
                quality: 'high',
                resolution: '1080x1920',
                aspectRatio: '9:16'
            },
            'instagram-post': {
                format: 'mp4',
                quality: 'high',
                resolution: '1080x1080',
                aspectRatio: '1:1'
            },
            'tiktok': {
                format: 'mp4',
                quality: 'high',
                resolution: '1080x1920',
                aspectRatio: '9:16'
            },
            'youtube': {
                format: 'mp4',
                quality: 'high',
                resolution: '1920x1080',
                aspectRatio: '16:9'
            },
            'youtube-shorts': {
                format: 'mp4',
                quality: 'high',
                resolution: '1080x1920',
                aspectRatio: '9:16'
            }
        };

        this.currentPlatform = '';
        this.convertedFiles = [];
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        if (this.dropZone) {
            this.dropZone.addEventListener('dragover', (e) => this.handleDragOver(e));
            this.dropZone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
            this.dropZone.addEventListener('drop', (e) => this.handleDrop(e));
            
            // Ajouter l'écouteur pour le bouton de fichier après sa création
            const fileInput = this.dropZone.querySelector('.file-input');
            if (fileInput) {
                fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
            }
        }
        
        // Ajouter les écouteurs pour les boutons de préréglage
        document.querySelectorAll('.preset-button').forEach(button => {
            button.addEventListener('click', () => this.handlePresetSelect(button.dataset.preset));
        });
        
        // Gestion de la conversion
        if (this.convertButton) {
            this.convertButton.addEventListener('click', () => this.handleConversion());
        }
        
        if (this.resetButton) {
            this.resetButton.addEventListener('click', () => this.resetTool());
        }
    }

    handleDragOver(e) {
        if (this.isUploading) return;
        e.preventDefault();
        e.stopPropagation();
        this.dropZone.classList.add('drag-over');
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        this.dropZone.classList.remove('drag-over');
    }

    handleDrop(e) {
        if (this.isUploading) return;
        e.preventDefault();
        e.stopPropagation();
        this.dropZone.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.uploadFile(files[0]);
        }
    }

    handleFileSelect(e) {
        if (this.isUploading) return;
        const files = e.target.files;
        if (files.length > 0) {
            this.uploadFile(files[0]);
        }
    }

    async uploadFile(file) {
        if (this.isUploading || this.hasUploadedFile) {
            this.showError('Une vidéo est déjà en cours de traitement. Veuillez d\'abord la convertir ou la supprimer.');
            return;
        }

        // Vérifier si le fichier est une vidéo
        if (!file.type.startsWith('video/')) {
            this.showError('Veuillez sélectionner un fichier vidéo valide.');
            return;
        }

        // Vérifier la taille du fichier (max 2GB)
        if (file.size > 2 * 1024 * 1024 * 1024) {
            this.showError('Le fichier est trop volumineux (maximum 2GB).');
            return;
        }

        try {
            this.isUploading = true;
            this.updateUploadUI(true);

            const formData = new FormData();
            formData.append('video', file);

            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                this.currentFile = {
                    filename: data.filename,
                    info: data.info
                };
                this.updateVideoInfo(file, data.info);
                this.showPreview(file);
                this.updateProgress(100, 'Téléversement terminé !');
                this.hasUploadedFile = true;
                setTimeout(() => {
                    this.progressZone.classList.add('hidden');
                    this.updateUploadUI(false);
                    this.isUploading = false;
                }, 1000);
            } else {
                throw new Error(data.error || 'Erreur lors du téléversement');
            }
        } catch (error) {
            this.showError(`Erreur: ${error.message}`);
            this.isUploading = false;
            this.updateUploadUI(false);
        }
    }

    updateUploadUI(isUploading) {
        if (!this.dropZone) return;

        if (isUploading) {
            this.dropZone.classList.add('uploading');
            this.dropZone.innerHTML = `
                <div class="upload-content">
                    <div class="spinner"></div>
                    <h2>Téléversement en cours...</h2>
                    <p>Veuillez patienter</p>
                </div>
            `;
        } else {
            this.dropZone.classList.remove('uploading');
            this.dropZone.innerHTML = `
                <div class="upload-content">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <h2>Déposez votre vidéo ici</h2>
                    <p>ou</p>
                    <label class="upload-button">
                        Parcourir
                        <input type="file" class="file-input" accept="video/*" hidden>
                    </label>
                    <p class="upload-info">Formats acceptés : MP4, MOV, AVI, MKV</p>
                    <p class="upload-info">Taille maximale : 2 GB</p>
                </div>
            `;
            
            // Réinitialiser l'écouteur d'événements pour le nouveau input file
            const fileInput = this.dropZone.querySelector('.file-input');
            if (fileInput) {
                fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
            }
        }
    }

    updateVideoInfo(file, info) {
        // Supprimer les post-its existants
        const existingPostits = document.querySelector('.postits-container');
        if (existingPostits) {
            existingPostits.remove();
        }

        // Désactiver la zone de dépôt
        this.dropZone.style.pointerEvents = 'none';
        this.dropZone.style.opacity = '0.5';

        // Créer le conteneur des post-its s'il n'existe pas
        const postitsContainer = document.createElement('div');
        postitsContainer.className = 'postits-container';
        this.dropZone.parentNode.insertBefore(postitsContainer, this.dropZone.nextSibling);

        // Créer le post-it pour la vidéo
        const postit = document.createElement('div');
        postit.className = 'video-postit';
        
        // Créer l'en-tête du post-it
        const header = document.createElement('div');
        header.className = 'video-postit-header';
        
        const title = document.createElement('h3');
        title.textContent = file.name;
        
        const expandButton = document.createElement('button');
        expandButton.className = 'expand-button';
        expandButton.innerHTML = '&#x26F6;';
        
        header.appendChild(title);
        header.appendChild(expandButton);
        
        // Créer le conteneur de prévisualisation
        const previewContainer = document.createElement('div');
        previewContainer.className = 'video-preview-container';
        
        // Créer l'élément vidéo
        const video = document.createElement('video');
        video.controls = true;
        video.preload = 'metadata';
        video.muted = false;
        video.playsInline = true;
        video.autoplay = false;
        video.crossOrigin = 'anonymous';
        
        // Créer une URL sécurisée pour la vidéo
        const videoUrl = URL.createObjectURL(file);
        video.src = videoUrl;
        
        // Gérer les événements de la vidéo
        video.addEventListener('loadedmetadata', () => {
            URL.revokeObjectURL(videoUrl);
            video.muted = false;
        });

        video.addEventListener('error', (e) => {
            console.error('Erreur de chargement vidéo:', e);
            this.showError('Erreur lors du chargement de la vidéo');
        });

        video.addEventListener('canplay', () => {
            video.muted = false;
        });
        
        previewContainer.appendChild(video);
        
        // Créer le conteneur d'informations
        const infoContainer = document.createElement('div');
        infoContainer.className = 'video-info';
        
        // Formater la taille en MB
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        
        // Formater la durée
        const duration = Math.round(info.duration);
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        const durationStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        infoContainer.innerHTML = `
            <p><strong>Nom:</strong> ${file.name}</p>
            <p><strong>Format:</strong> ${info.format.toUpperCase()}</p>
            <p><strong>Taille:</strong> ${sizeMB} MB</p>
            <p><strong>Durée:</strong> ${durationStr}</p>
            <p><strong>Dimensions:</strong> ${info.width}x${info.height}</p>
        `;
        
        // Assembler le post-it
        postit.appendChild(header);
        postit.appendChild(previewContainer);
        postit.appendChild(infoContainer);
        
        // Ajouter le post-it au conteneur
        postitsContainer.appendChild(postit);
        
        // Créer l'overlay
        let overlay = document.querySelector('.overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'overlay';
            document.body.appendChild(overlay);
        }
        
        // Gérer l'expansion du post-it
        let isExpanded = false;
        expandButton.addEventListener('click', () => {
            isExpanded = !isExpanded;
            postit.classList.toggle('expanded');
            overlay.classList.toggle('visible');
            
            if (isExpanded) {
                video.play().catch(e => console.error('Erreur de lecture:', e));
            } else {
                video.pause();
            }
        });
        
        // Fermer le post-it quand on clique sur l'overlay
        overlay.addEventListener('click', () => {
            if (isExpanded) {
                isExpanded = false;
                postit.classList.remove('expanded');
                overlay.classList.remove('visible');
                video.pause();
            }
        });
        
        // Afficher les options de conversion
        this.conversionOptions.classList.remove('hidden');
    }

    showPreview(file) {
        const videoURL = URL.createObjectURL(file);
        this.videoPreview = document.createElement('video');
        this.videoPreview.controls = true;
        this.videoPreview.preload = 'metadata';
        this.videoPreview.muted = false;
        this.videoPreview.playsInline = true;
        this.videoPreview.autoplay = false;
        this.videoPreview.crossOrigin = 'anonymous';
        this.videoPreview.src = videoURL;
        this.videoPreview.onloadedmetadata = () => {
            URL.revokeObjectURL(videoURL);
        };
        this.videoPreview.addEventListener('error', (e) => {
            console.error('Erreur de chargement vidéo:', e);
            this.showError('Erreur lors du chargement de la vidéo');
        });
        this.videoPreview.addEventListener('canplay', () => {
            this.videoPreview.muted = false;
        });
        this.previewZone.appendChild(this.videoPreview);
    }

    handlePresetSelect(preset) {
        // Retirer la classe active de tous les boutons
        document.querySelectorAll('.preset-button').forEach(button => {
            button.classList.remove('active');
        });
        
        // Ajouter la classe active au bouton sélectionné
        const selectedButton = document.querySelector(`[data-preset="${preset}"]`);
        if (selectedButton) {
            selectedButton.classList.add('active');
        }

        const settings = this.presets[preset];
        if (settings) {
            // Mettre à jour les options
            document.getElementById('outputFormat').value = settings.format;
            document.getElementById('quality').value = settings.quality;
            document.getElementById('resolution').value = settings.resolution;
            document.getElementById('aspectRatio').value = settings.aspectRatio;
            
            // Stocker la plateforme sélectionnée
            this.currentPlatform = preset;
            
            // Afficher les options avancées
            const advancedOptions = document.querySelector('.advanced-options');
            advancedOptions.classList.add('visible');
        }
    }

    async handleConversion() {
        if (!this.currentFile) {
            this.showError('Veuillez d\'abord sélectionner une vidéo.');
            return;
        }

        const selectedPreset = document.querySelector('.preset-button.active');
        let options = {};

        if (selectedPreset) {
            // Utiliser les options du preset sélectionné
            const presetName = selectedPreset.dataset.preset;
            options = { ...this.presets[presetName] };
        } else {
            // Utiliser les options personnalisées
            options = {
                format: document.getElementById('outputFormat').value,
                quality: document.getElementById('quality').value,
                resolution: document.getElementById('resolution').value,
                aspectRatio: document.getElementById('aspectRatio').value
            };
        }

        try {
            this.disableButtons();
            this.showProgress(0, "Préparation de la conversion...");

            const response = await fetch('/convert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    filename: this.currentFile.filename,
                    options: options
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erreur lors de la conversion');
            }

            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Échec de la conversion');
            }

            this.addConvertedFile(data);
            
            const downloadBtn = document.querySelector('.download-button');
            if (downloadBtn) {
                downloadBtn.href = `/download/${data.filename}`;
                downloadBtn.style.display = 'block';
            }

            this.showProgress(100, "Conversion terminée !");
            this.showSuccessMessage("Conversion réussie !");
        } catch (error) {
            console.error('Erreur de conversion:', error);
            this.showErrorMessage(error.message || "Une erreur est survenue lors de la conversion");
        } finally {
            this.enableButtons();
            this.hideProgress();
        }
    }

    addConvertedFile(data) {
        // Supprimer les anciens post-its de vidéos converties
        const existingConvertedPostits = document.querySelectorAll('.video-postit.converted');
        existingConvertedPostits.forEach(postit => postit.remove());

        // Créer le conteneur de post-its s'il n'existe pas
        let postitsContainer = document.querySelector('.postits-container');
        if (!postitsContainer) {
            postitsContainer = document.createElement('div');
            postitsContainer.className = 'postits-container';
            this.previewZone.appendChild(postitsContainer);
        }

        // Créer le post-it
        const postit = document.createElement('div');
        postit.className = 'video-postit converted';
        
        // Créer l'en-tête du post-it
        const header = document.createElement('div');
        header.className = 'video-postit-header';
        
        const title = document.createElement('h3');
        title.textContent = 'Vidéo convertie';
        
        const expandBtn = document.createElement('button');
        expandBtn.className = 'expand-button';
        expandBtn.innerHTML = '&#x26F6;';
        
        header.appendChild(title);
        header.appendChild(expandBtn);
        
        // Créer le conteneur de prévisualisation
        const previewContainer = document.createElement('div');
        previewContainer.className = `video-preview-container ${data.options?.preset || ''}`;
        
        // Créer l'élément vidéo
        const video = document.createElement('video');
        video.controls = true;
        video.muted = false;
        video.preload = 'metadata';
        video.innerHTML = 'Votre navigateur ne prend pas en charge la lecture de vidéos.';
        
        // Créer la source de la vidéo
        const source = document.createElement('source');
        source.src = `/download/${data.filename}`;
        source.type = `video/${data.format}`;
        video.appendChild(source);
        
        previewContainer.appendChild(video);
        
        // Créer le conteneur d'informations
        const infoContainer = document.createElement('div');
        infoContainer.className = 'video-info';
        
        // Ajouter les informations de la vidéo
        const info = data.info || {};
        infoContainer.innerHTML = `
            <p><strong>Nom:</strong> ${data.filename}</p>
            <p><strong>Format:</strong> ${data.format.toUpperCase()}</p>
            <p><strong>Qualité:</strong> ${data.quality}</p>
            <p><strong>Résolution:</strong> ${data.resolution}</p>
            <p><strong>Ratio:</strong> ${data.aspectRatio}</p>
            ${info.duration ? `<p><strong>Durée:</strong> ${Math.round(info.duration)}s</p>` : ''}
            ${info.size ? `<p><strong>Taille:</strong> ${Math.round(info.size / 1024 / 1024 * 100) / 100} MB</p>` : ''}
        `;
        
        // Créer le bouton de téléchargement
        const downloadBtn = document.createElement('a');
        downloadBtn.href = `/download/${data.filename}`;
        downloadBtn.className = 'download-button';
        downloadBtn.innerHTML = '<i class="fas fa-download"></i> Télécharger';
        downloadBtn.download = data.filename;
        
        // Assembler le post-it
        postit.appendChild(header);
        postit.appendChild(previewContainer);
        postit.appendChild(infoContainer);
        postit.appendChild(downloadBtn);
        
        // Ajouter le post-it au conteneur
        postitsContainer.appendChild(postit);
        
        // Gérer l'expansion du post-it
        let isExpanded = false;
        
        expandBtn.addEventListener('click', () => {
            isExpanded = !isExpanded;
            postit.classList.toggle('expanded', isExpanded);
            if (isExpanded) {
                video.play();
            } else {
                video.pause();
            }
        });
        
        // Gérer les erreurs de chargement de la vidéo
        video.addEventListener('error', () => {
            console.error('Erreur de chargement de la vidéo');
            this.showErrorMessage("Impossible de charger la vidéo convertie");
        });
    }

    disableButtons() {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.disabled = true;
            button.classList.add('disabled');
        });
    }

    enableButtons() {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.disabled = false;
            button.classList.remove('disabled');
        });
    }

    showProgress(progress, message) {
        let progressContainer = document.querySelector('.progress-container');
        if (!progressContainer) {
            progressContainer = document.createElement('div');
            progressContainer.className = 'progress-container';
            this.previewZone.appendChild(progressContainer);
        }

        progressContainer.innerHTML = `
            <div class="progress-bar">
                <div class="progress-bar-fill" style="width: ${progress}%"></div>
            </div>
            <div class="progress-text">${message}</div>
        `;
    }

    hideProgress() {
        const progressContainer = document.querySelector('.progress-container');
        if (progressContainer) {
            progressContainer.remove();
        }
    }

    showErrorMessage(message) {
        let errorMessage = document.querySelector('.error-message');
        if (!errorMessage) {
            errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            this.previewZone.appendChild(errorMessage);
        }
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        
        // Masquer le message d'erreur après 5 secondes
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }

    showSuccessMessage(message) {
        let successMessage = document.querySelector('.success-message');
        if (!successMessage) {
            successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            this.previewZone.appendChild(successMessage);
        }
        successMessage.textContent = message;
        successMessage.style.display = 'block';
        
        // Masquer le message de succès après 3 secondes
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);
    }

    updateProgress(progress, status) {
        this.progressBar.style.width = `${progress}%`;
        this.progressText.textContent = `${Math.round(progress)}%`;
        this.progressStatus.textContent = status;
    }

    showError(message) {
        const postit = this.createPostit('Erreur', message, 'error');
        document.body.appendChild(postit);
        
        // Supprimer automatiquement après 5 secondes si non étendu
        setTimeout(() => {
            if (!postit.classList.contains('expanded')) {
                postit.remove();
            }
        }, 5000);
    }

    showSuccess(message) {
        const postit = this.createPostit('Succès', message, 'success');
        document.body.appendChild(postit);
        
        // Supprimer automatiquement après 5 secondes si non étendu
        setTimeout(() => {
            if (!postit.classList.contains('expanded')) {
                postit.remove();
            }
        }, 5000);
    }

    formatFileSize(bytes) {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }

        return `${size.toFixed(1)} ${units[unitIndex]}`;
    }

    formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = Math.floor(seconds % 60);

        const parts = [];
        if (hours > 0) parts.push(`${hours}h`);
        if (minutes > 0 || hours > 0) parts.push(`${minutes}m`);
        parts.push(`${remainingSeconds}s`);

        return parts.join(' ');
    }

    resetTool() {
        // Réinitialiser l'interface
        this.currentFile = null;
        this.isUploading = false;
        this.hasUploadedFile = false;
        
        // Réactiver la zone de dépôt
        this.dropZone.style.pointerEvents = 'auto';
        this.dropZone.style.opacity = '1';
        
        this.updateUploadUI(false);
        
        // Supprimer les post-its
        const postitsContainer = document.querySelector('.postits-container');
        if (postitsContainer) {
            postitsContainer.remove();
        }
        
        // Cacher les options de conversion
        this.conversionOptions.classList.add('hidden');
        this.progressZone.classList.add('hidden');
        
        // Réinitialiser les options
        document.getElementById('outputFormat').value = 'mp4';
        document.getElementById('quality').value = 'high';
        document.getElementById('resolution').value = 'original';
        document.getElementById('aspectRatio').value = 'original';
        
        // Retirer la classe active de tous les boutons
        document.querySelectorAll('.preset-button').forEach(button => {
            button.classList.remove('active');
        });
        
        // Cacher les options avancées
        const advancedOptions = document.querySelector('.advanced-options');
        if (advancedOptions) {
            advancedOptions.classList.remove('visible');
        }
        
        // Activer le bouton de conversion
        this.convertButton.disabled = false;
    }

    createPostit(title, content, type = 'info') {
        const postit = document.createElement('div');
        postit.className = `message-postit ${type}`;
        
        // Générer une rotation aléatoire entre -3 et 3 degrés
        const rotation = (Math.random() * 6 - 3).toFixed(1);
        postit.style.transform = `rotate(${rotation}deg)`;
        
        // Générer une position aléatoire dans la zone visible
        const maxRight = window.innerWidth - 350; // 350px est la largeur approximative du post-it
        const maxBottom = window.innerHeight - 200; // 200px est la hauteur minimale pour voir le post-it
        const right = Math.random() * (maxRight - 20) + 20;
        const bottom = Math.random() * (maxBottom - 20) + 20;
        
        postit.style.right = `${right}px`;
        postit.style.bottom = `${bottom}px`;
        
        postit.innerHTML = `
            <div class="message-postit-header">
                <span class="message-postit-title">${title}</span>
                <button class="message-postit-close"><i class="fas fa-times"></i></button>
            </div>
            <div class="message-postit-content">${content}</div>
        `;

        // Rendre le post-it déplaçable
        this.makePostitDraggable(postit);

        // Ajouter les événements
        postit.addEventListener('click', () => {
            postit.classList.toggle('expanded');
        });

        postit.querySelector('.message-postit-close').addEventListener('click', (e) => {
            e.stopPropagation();
            postit.remove();
        });

        return postit;
    }

    makePostitDraggable(postit) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = postit.querySelector('.video-postit-header, .message-postit-header');
        
        if (!header) return;
        
        header.style.cursor = 'move';
        header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            // Position initiale du curseur
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            // Calculer la nouvelle position
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            
            // Définir la nouvelle position
            const newTop = postit.offsetTop - pos2;
            const newLeft = postit.offsetLeft - pos1;
            
            // Vérifier les limites de l'écran
            const maxX = window.innerWidth - postit.offsetWidth;
            const maxY = window.innerHeight - postit.offsetHeight;
            
            postit.style.top = `${Math.min(Math.max(0, newTop), maxY)}px`;
            postit.style.left = `${Math.min(Math.max(0, newLeft), maxX)}px`;
            postit.style.right = 'auto';
            postit.style.bottom = 'auto';
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
}

// Initialiser l'outil vidéo
document.addEventListener('DOMContentLoaded', () => {
    new VideoTool();
}); 