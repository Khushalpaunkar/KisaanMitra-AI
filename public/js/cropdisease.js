document.addEventListener("DOMContentLoaded", () => {

    // =========================================================
    // ELEMENTS
    // =========================================================

    const imageInput =
        document.getElementById("cropImage");

    const takePhotoBtn =
        document.getElementById("takePhotoBtn");

    const cameraStatus =
        document.getElementById("cameraStatus");

    const uploadZone =
        document.getElementById("uploadZone");

    const uploadPlaceholder =
        document.getElementById("uploadPlaceholder");

    const imagePreview =
        document.getElementById("imagePreview");

    const previewImage =
        document.getElementById("previewImage");

    const removeImage =
        document.getElementById("removeImage");

    const diseaseForm =
        document.getElementById("diseaseForm");

    const analyzeBtn =
        document.getElementById("analyzeBtn");

    const buttonText =
        document.getElementById("buttonText");

    const buttonLoading =
        document.getElementById("buttonLoading");

    const cameraModal =
        document.getElementById("cameraModal");

    const cameraVideo =
        document.getElementById("cameraVideo");

    const cameraCanvas =
        document.getElementById("cameraCanvas");

    const cameraMessage =
        document.getElementById("cameraMessage");

    const capturePhotoBtn =
        document.getElementById("capturePhotoBtn");

    const closeCameraBtn =
        document.getElementById("closeCameraBtn");

    const cancelCameraBtn =
        document.getElementById("cancelCameraBtn");

    const switchCameraBtn =
        document.getElementById("switchCameraBtn");

    let cameraStream = null;
    let cameraFacingMode = "environment";


    // =========================================================
    // IMAGE VALIDATION
    // =========================================================

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    const maxFileSize =
        5 * 1024 * 1024;


    // =========================================================
    // SHOW IMAGE PREVIEW
    // =========================================================

    function setCameraStatus(message, isError = false) {

        if (!cameraStatus) return;

        cameraStatus.textContent = message;
        cameraStatus.classList.toggle("is-error", isError);
        cameraStatus.hidden = !message;

    }


    function isValidImage(file) {

        if (!file || !allowedTypes.includes(file.type)) {
            alert("Please upload JPG, PNG or WEBP image.");
            return false;
        }

        if (file.size > maxFileSize) {
            alert("Image size must be less than 5MB.");
            return false;
        }

        return true;
    }


    function assignImageFile(file) {

        if (!imageInput || !isValidImage(file)) return false;

        try {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            imageInput.files = dataTransfer.files;
        } catch (error) {
            console.error("Image assignment error:", error);
            alert("This browser could not prepare the selected image.");
            return false;
        }

        return showImagePreview(file);
    }


    function setCameraMessage(message, isError = false) {

        if (!cameraMessage) return;

        cameraMessage.textContent = message;
        cameraMessage.classList.toggle("is-error", isError);
        cameraMessage.hidden = !message;

    }


    function stopCameraStream() {

        if (cameraStream) {
            cameraStream.getTracks().forEach((track) => track.stop());
            cameraStream = null;
        }

        if (cameraVideo) {
            cameraVideo.pause();
            cameraVideo.srcObject = null;
        }

                    }


    function closeCameraModal() {

        stopCameraStream();
        setCameraMessage("");

        if (cameraModal) {
            cameraModal.hidden = true;
            document.body.classList.remove("camera-open");
        }

    }


    async function updateSwitchCameraAvailability() {

        if (!switchCameraBtn) return;

        if (!navigator.mediaDevices.enumerateDevices) {
            switchCameraBtn.hidden = true;
            return;
        }

        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const cameras = devices.filter((device) => device.kind === "videoinput");
            switchCameraBtn.hidden = cameras.length < 2;
        } catch (error) {
            switchCameraBtn.hidden = true;
        }

    }


    async function openCameraModal() {

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setCameraStatus("Live camera is not supported in this browser. Please upload a photo instead.", true);
            return;
        }

        if (!cameraModal || !cameraVideo) return;

        cameraModal.hidden = false;
        document.body.classList.add("camera-open");
        setCameraMessage("Requesting camera access...");

        try {
            cameraStream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: { facingMode: { ideal: cameraFacingMode } }
            });

            cameraVideo.srcObject = cameraStream;
            await cameraVideo.play();
            await updateSwitchCameraAvailability();
            setCameraMessage("");

        } catch (error) {
            console.error("Camera access error:", error);

            const message = error.name === "NotAllowedError" || error.name === "PermissionDeniedError"
                ? "Camera permission was denied. Allow camera access in your browser settings, or upload a photo instead."
                : error.name === "NotFoundError"
                    ? "No camera was found on this device. Please upload a photo instead."
                    : "The camera could not be opened. Check that it is not being used by another app.";

            setCameraMessage(message, true);
            stopCameraStream();
        }

    }


    function capturePhoto() {

        if (!cameraVideo || !cameraCanvas || !cameraVideo.videoWidth) {
            setCameraMessage("The camera is still starting. Please try again.", true);
            return;
        }

        cameraCanvas.width = cameraVideo.videoWidth;
        cameraCanvas.height = cameraVideo.videoHeight;

        const context = cameraCanvas.getContext("2d");
        context.drawImage(cameraVideo, 0, 0, cameraCanvas.width, cameraCanvas.height);

        cameraCanvas.toBlob((blob) => {
            if (!blob) {
                setCameraMessage("The photo could not be captured. Please try again.", true);
                return;
            }

            const file = new File([blob], `crop-camera-${Date.now()}.jpg`, {
                type: "image/jpeg",
                lastModified: Date.now()
            });

            if (assignImageFile(file)) {
                closeCameraModal();
                setCameraStatus("Photo captured successfully.");
            }
        }, "image/jpeg", 0.92);

    }


    async function switchCamera() {

        if (!cameraStream) return;

        cameraFacingMode = cameraFacingMode === "environment" ? "user" : "environment";
        stopCameraStream();
        await openCameraModal();

    }


    function showImagePreview(file) {

        if (!file) return;


        const reader =
            new FileReader();


        reader.onload = function (event) {

            previewImage.src =
                event.target.result;

            uploadPlaceholder.hidden =
                true;

            imagePreview.hidden =
                false;

            uploadZone.classList.add(
                "has-image"
            );

        };


        reader.readAsDataURL(file);

        return true;
    }


    // =========================================================
    // IMAGE SELECT
    // =========================================================

    if (imageInput) {

        imageInput.addEventListener(
            "change",
            function () {

                const file =
                    this.files[0];

                if (!file) return;


                const isValid =
                    assignImageFile(file);


                if (!isValid) {

                    this.value = "";

                    resetImagePreview();
                }

            }
        );

    }


    // =========================================================
    // LIVE CAMERA
    // =========================================================

    if (takePhotoBtn) {

        takePhotoBtn.addEventListener("click", async function (event) {

            event.preventDefault();
            event.stopPropagation();
            setCameraStatus("");

            await openCameraModal();

        });

    }


    if (capturePhotoBtn) {
        capturePhotoBtn.addEventListener("click", capturePhoto);
    }

    if (closeCameraBtn) {
        closeCameraBtn.addEventListener("click", closeCameraModal);
    }

    if (cancelCameraBtn) {
        cancelCameraBtn.addEventListener("click", closeCameraModal);
    }

    if (switchCameraBtn) {
        switchCameraBtn.addEventListener("click", switchCamera);
    }

    if (cameraModal) {
        cameraModal.addEventListener("click", (event) => {
            if (event.target.matches("[data-camera-close]")) {
                closeCameraModal();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && !cameraModal.hidden) {
                closeCameraModal();
            }
        });
    }


    // =========================================================
    // RESET IMAGE
    // =========================================================

    function resetImagePreview() {

        if (imageInput) {
            imageInput.value = "";
        }

        if (previewImage) {
            previewImage.src = "";
        }

        if (imagePreview) {
            imagePreview.hidden = true;
        }

        if (uploadPlaceholder) {
            uploadPlaceholder.hidden = false;
        }

        if (uploadZone) {
            uploadZone.classList.remove(
                "has-image"
            );
        }

    }


    // =========================================================
    // REMOVE IMAGE
    // =========================================================

    if (removeImage) {

        removeImage.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                resetImagePreview();

            }
        );

    }


    // =========================================================
    // DRAG & DROP
    // =========================================================

    if (uploadZone) {

        uploadZone.addEventListener(
            "dragover",
            function (event) {

                event.preventDefault();

                uploadZone.classList.add(
                    "dragging"
                );

            }
        );


        uploadZone.addEventListener(
            "dragleave",
            function () {

                uploadZone.classList.remove(
                    "dragging"
                );

            }
        );


        uploadZone.addEventListener(
            "drop",
            function (event) {

                event.preventDefault();

                uploadZone.classList.remove(
                    "dragging"
                );


                const file =
                    event.dataTransfer.files[0];

                if (!file) return;

                assignImageFile(file);

            }
        );

    }


    // =========================================================
    // FORM SUBMIT
    // =========================================================

    if (diseaseForm) {

        diseaseForm.addEventListener(
            "submit",
            function (event) {

                if (
                    !imageInput ||
                    !imageInput.files.length
                ) {

                    event.preventDefault();

                    alert(
                        "Please upload a crop image first."
                    );

                    return;
                }


                if (analyzeBtn) {
                    analyzeBtn.disabled = true;
                }


                if (buttonText) {
                    buttonText.hidden = true;
                }


                if (buttonLoading) {
                    buttonLoading.hidden = false;
                }

            }
        );

    }

    window.addEventListener("pagehide", stopCameraStream);


    // =========================================================
    // MARKDOWN AI RESULT
    // =========================================================

    const rawAiResult =
        document.getElementById("rawAiResult");

    const formattedResult =
        document.getElementById("formattedResult");


    if (
        rawAiResult &&
        formattedResult
    ) {

        const markdownText =
            rawAiResult.value.trim();


        if (!markdownText) {

            formattedResult.innerHTML =
                "<p>AI response उपलब्ध नाही.</p>";

            return;
        }


        try {

            // Configure Markdown

            marked.setOptions({
                breaks: true,
                gfm: true
            });


            // Convert Markdown → HTML

            const html =
                marked.parse(markdownText);


            // Sanitize generated HTML

            const safeHTML =
                DOMPurify.sanitize(html);


            // Display formatted result

            formattedResult.innerHTML =
                safeHTML;

        } catch (error) {

            console.error(
                "Markdown rendering error:",
                error
            );


            // Fallback

            formattedResult.textContent =
                markdownText;

        }

    }

});