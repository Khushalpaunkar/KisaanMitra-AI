document.addEventListener("DOMContentLoaded", () => {

    // =========================================================
    // ELEMENTS
    // =========================================================

    const imageInput =
        document.getElementById("cropImage");

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

    function showImagePreview(file) {

        if (!file) return;


        // File type validation

        if (!allowedTypes.includes(file.type)) {

            alert(
                "Please upload JPG, PNG or WEBP image."
            );

            return false;
        }


        // File size validation

        if (file.size > maxFileSize) {

            alert(
                "Image size must be less than 5MB."
            );

            return false;
        }


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
                    showImagePreview(file);


                if (!isValid) {

                    this.value = "";

                    resetImagePreview();
                }

            }
        );

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


                if (!allowedTypes.includes(file.type)) {

                    alert(
                        "Please upload JPG, PNG or WEBP image."
                    );

                    return;
                }


                if (file.size > maxFileSize) {

                    alert(
                        "Image size must be less than 5MB."
                    );

                    return;
                }


                try {

                    const dataTransfer =
                        new DataTransfer();

                    dataTransfer.items.add(file);

                    imageInput.files =
                        dataTransfer.files;

                    imageInput.dispatchEvent(
                        new Event("change", {
                            bubbles: true
                        })
                    );

                } catch (error) {

                    console.error(
                        "Drag & drop error:",
                        error
                    );

                }

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