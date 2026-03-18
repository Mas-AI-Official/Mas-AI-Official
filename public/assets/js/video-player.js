(function () {
    function formatTime(s) {
        s = Math.max(0, s | 0);
        const m = (s / 60) | 0;
        const r = (s % 60) | 0;
        return m + ":" + (r < 10 ? "0" + r : r);
    }

    function init(el) {
        const video = el.querySelector("video");
        const overlayPlay = el.querySelector(".overlay-play");
        const btnPlay = el.querySelector('[data-action="play"]');
        const btnMute = el.querySelector('[data-action="mute"]');
        const btnSpeed = el.querySelector('[data-action="speed"]');
        const btnFS = el.querySelector('[data-action="fs"]');
        const seek = el.querySelector(".seek");
        const vol = el.querySelector(".volume");
        const tNow = el.querySelector('[data-time="current"]');
        const tDur = el.querySelector('[data-time="duration"]');

        if (!video || !overlayPlay || !btnPlay) {
            console.warn("Video player: Missing required elements", { video: !!video, overlayPlay: !!overlayPlay, btnPlay: !!btnPlay });
            return;
        }

        const videoSrc = el.dataset.video;
        if (!videoSrc) {
            console.error("Video player: No data-video attribute found");
            return;
        }

        // Normalize video path - handle both absolute and relative paths
        let normalizedSrc = videoSrc;
        // If path starts with /, it's absolute - keep it
        // If not, it's relative - keep it as is to allow local file access
        if (normalizedSrc.startsWith('/') && !normalizedSrc.startsWith('http')) {
            // Keep absolute paths as is
        }

        console.log("Video player: Setting source to", normalizedSrc);

        // Set video source and handle errors gracefully
        video.src = normalizedSrc;

        // Handle video load errors - but don't prevent play button from working
        video.addEventListener('error', (e) => {
            const error = video.error;
            let errorMessage = 'Video not available';

            if (error) {
                switch (error.code) {
                    case MediaError.MEDIA_ERR_ABORTED:
                        errorMessage = 'Video loading was aborted';
                        break;
                    case MediaError.MEDIA_ERR_NETWORK:
                        errorMessage = 'Network error - check connection';
                        break;
                    case MediaError.MEDIA_ERR_DECODE:
                        errorMessage = 'Video format error';
                        break;
                    case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                        errorMessage = 'Video format not supported';
                        break;
                }
            }

            console.warn("⚠️ Video load error:", errorMessage, "Source:", normalizedSrc);
            console.warn("   This is expected if video files are not uploaded to the server.");
            console.warn("   Play button will still work, but video won't play until files are uploaded.");
        });

        // Log successful video load
        video.addEventListener('loadedmetadata', () => {
            console.log("✅ Video metadata loaded successfully:", normalizedSrc);
        });

        video.addEventListener('canplay', () => {
            console.log("✅ Video can start playing:", normalizedSrc);
        });

        const savedVol = +localStorage.getItem("contentops:vid:vol");
        if (!Number.isNaN(savedVol)) video.volume = Math.min(1, Math.max(0, savedVol));
        if (vol) vol.value = video.volume;

        const savedSpeed = +localStorage.getItem("contentops:vid:speed");
        const speeds = [1, 1.25, 1.5, 1.75, 2];
        let currentSpeedIndex = 0;
        if (!Number.isNaN(savedSpeed) && speeds.includes(savedSpeed)) {
            video.playbackRate = savedSpeed;
            currentSpeedIndex = speeds.indexOf(savedSpeed);
        } else {
            video.playbackRate = 1;
        }
        if (btnSpeed) {
            const speedText = btnSpeed.querySelector('.speed-text');
            if (speedText) speedText.textContent = video.playbackRate + 'x';
        }

        let seekDragging = false;
        let hasPlayedOnce = false;

        function setState() {
            el.classList.toggle("playing", !video.paused);
            el.classList.toggle("paused", video.paused);
            el.classList.toggle("muted", video.muted || video.volume === 0);

            if (!hasPlayedOnce || video.ended) {
                overlayPlay.style.display = "grid";
            } else {
                overlayPlay.style.display = "none";
            }
        }

        function togglePlay() {
            if (video.paused) {
                // Always attempt to play - let browser handle errors
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            hasPlayedOnce = true;
                            console.log("✅ Video playing successfully:", videoSrc);
                        })
                        .catch((error) => {
                            console.error("❌ Video play failed:", error);
                            console.error("   Source:", videoSrc);
                            console.error("   Error type:", error.name);
                            console.error("   Error message:", error.message);

                            // Show user-friendly message in overlay
                            if (overlayPlay) {
                                const originalContent = overlayPlay.innerHTML;
                                overlayPlay.innerHTML = `
                  ${originalContent}
                  <div style="color: #ff6b6b; margin-top: 1rem; font-size: 0.85rem; text-align: center; padding: 0.5rem;">
                    Video file not found. Please ensure videos are in the 'videos' folder.
                  </div>
                `;
                            }
                        });
                } else {
                    hasPlayedOnce = true;
                }
            } else {
                video.pause();
            }
        }

        overlayPlay.addEventListener("click", togglePlay);
        btnPlay.addEventListener("click", togglePlay);
        video.addEventListener("play", setState);
        video.addEventListener("pause", setState);
        video.addEventListener("ended", () => {
            hasPlayedOnce = false;
            video.currentTime = 0;
            video.pause();
            setState();
        });
        setState();

        video.addEventListener("loadedmetadata", () => {
            if (tDur) tDur.textContent = formatTime(video.duration);
        });

        video.addEventListener("timeupdate", () => {
            if (tNow) tNow.textContent = formatTime(video.currentTime);
            if (!seekDragging && video.duration && seek) {
                seek.value = (video.currentTime / video.duration) * 1000;
            }
        });

        if (seek) {
            seek.addEventListener("input", () => {
                if (!video.duration) return;
                seekDragging = true;
                const p = +seek.value / 1000;
                video.currentTime = p * video.duration;
                if (video.currentTime === 0 && !hasPlayedOnce) {
                    overlayPlay.style.display = "grid";
                } else if (hasPlayedOnce) {
                    overlayPlay.style.display = "none";
                }
            });
            seek.addEventListener("change", () => {
                seekDragging = false;
            });
        }

        if (vol) {
            vol.addEventListener("input", () => {
                video.volume = +vol.value;
                video.muted = (video.volume === 0);
                localStorage.setItem("contentops:vid:vol", video.volume.toFixed(2));
                setState();
            });
        }

        if (btnMute) {
            btnMute.addEventListener("click", () => {
                video.muted = !video.muted;
                if (!video.muted && video.volume === 0) {
                    video.volume = 0.4;
                    if (vol) vol.value = 0.4;
                }
                setState();
            });
        }

        if (btnSpeed) {
            btnSpeed.addEventListener("click", () => {
                currentSpeedIndex = (currentSpeedIndex + 1) % speeds.length;
                video.playbackRate = speeds[currentSpeedIndex];
                localStorage.setItem("contentops:vid:speed", video.playbackRate.toString());
                const speedText = btnSpeed.querySelector('.speed-text');
                if (speedText) speedText.textContent = video.playbackRate + 'x';
                btnSpeed.setAttribute('title', `Speed: ${video.playbackRate}x`);
            });
        }

        if (btnFS) {
            btnFS.addEventListener("click", () => {
                const container = el;
                if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
                    if (document.exitFullscreen) document.exitFullscreen();
                    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
                    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
                    else if (document.msExitFullscreen) document.msExitFullscreen();
                } else {
                    if (container.requestFullscreen) container.requestFullscreen();
                    else if (container.webkitRequestFullscreen) container.webkitRequestFullscreen();
                    else if (container.mozRequestFullScreen) container.mozRequestFullScreen();
                    else if (container.msRequestFullscreen) container.msRequestFullscreen();
                }
            });
        }

        el.tabIndex = 0;
        el.addEventListener("keydown", (e) => {
            switch (e.key.toLowerCase()) {
                case " ":
                case "enter":
                    e.preventDefault();
                    togglePlay();
                    break;
                case "arrowleft":
                    video.currentTime = Math.max(0, video.currentTime - 5);
                    break;
                case "arrowright":
                    video.currentTime = Math.min(video.duration || 0, video.currentTime + 5);
                    break;
                case "arrowup":
                    video.volume = Math.min(1, video.volume + 0.05);
                    if (vol) vol.value = video.volume;
                    setState();
                    break;
                case "arrowdown":
                    video.volume = Math.max(0, video.volume - 0.05);
                    if (vol) vol.value = video.volume;
                    setState();
                    break;
                case "m":
                    video.muted = !video.muted;
                    setState();
                    break;
                case "f":
                    if (btnFS) btnFS.click();
                    break;
            }
        });
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener("DOMContentLoaded", () => {
            const videos = document.querySelectorAll(".naturenlp-video");
            console.log("Found video players:", videos.length);
            videos.forEach((el, index) => {
                console.log(`Initializing video player ${index + 1}:`, el.dataset.video);
                init(el);
            });
        });
    } else {
        // DOM already loaded
        const videos = document.querySelectorAll(".naturenlp-video");
        console.log("Found video players:", videos.length);
        videos.forEach((el, index) => {
            console.log(`Initializing video player ${index + 1}:`, el.dataset.video);
            init(el);
        });
    }
})();
