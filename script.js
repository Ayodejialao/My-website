// script.js

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    const imageUpload = document.getElementById('imageUpload');
    const videoUpload = document.getElementById('videoUpload');
    const galleryGrid = document.getElementById('galleryGrid');

    // function to create gallery item from file
    function createMediaItem(file, type) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'gallery-item';

                let mediaEl;
                if (type === 'image') {
                    mediaEl = document.createElement('img');
                    mediaEl.src = e.target.result;
                    mediaEl.alt = file.name;
                } else {
                    mediaEl = document.createElement('video');
                    mediaEl.src = e.target.result;
                    mediaEl.controls = false; // clean look, autoplay on hover? we keep muted loop
                    mediaEl.loop = true;
                    mediaEl.muted = true;
                    mediaEl.playsInline = true;
                    mediaEl.poster = 'https://placehold.co/600x400/1e293b/white?text=video';
                }

                mediaEl.classList.add('gallery-media');

                const captionDiv = document.createElement('div');
                captionDiv.className = 'gallery-caption';
                const nameSpan = document.createElement('span');
                // trim file name
                let shortName = file.name.length > 20 ? file.name.substring(0, 16) + '…' : file.name;
                nameSpan.textContent = shortName;
                const iconI = document.createElement('i');
                iconI.className = type === 'image' ? 'fas-regular fa-image' : 'fas-regular fa-circle-play';
                captionDiv.appendChild(nameSpan);
                captionDiv.appendChild(iconI);

                itemDiv.appendChild(mediaEl);
                itemDiv.appendChild(captionDiv);
                resolve(itemDiv);
            };
            reader.readAsDataURL(file);
        });
    }

    // handle image upload (multiple)
    if (imageUpload) {
        imageUpload.addEventListener('change', async (e) => {
            const files = Array.from(e.target.files);
            for (let file of files) {
                if (file.type.startsWith('image/')) {
                    const item = await createMediaItem(file, 'image');
                    galleryGrid.prepend(item); // newest first
                }
            }
            imageUpload.value = ''; // allow re-upload of same files later
        });
    }

    // handle video upload
    if (videoUpload) {
        videoUpload.addEventListener('change', async (e) => {
            const files = Array.from(e.target.files);
            for (let file of files) {
                if (file.type.startsWith('video/')) {
                    const item = await createMediaItem(file, 'video');
                    galleryGrid.prepend(item);
                }
            }
            videoUpload.value = '';
        });
    }

    // optional: make videos play on hover (nice modern touch)
    if (galleryGrid) {
        galleryGrid.addEventListener('mouseover', (e) => {
            const video = e.target.closest('video');
            if (video) {
                video.play().catch(() => {});
            }
        });
        galleryGrid.addEventListener('mouseout', (e) => {
            const video = e.target.closest('video');
            if (video) {
                video.pause();
            }
        });
    }
});