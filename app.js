// Define the JerseyCustomizer class
        class JerseyCustomizer {
            constructor(containerElement, initialSettings = {}) {
                this.container = containerElement;
                this.jerseyImage = this.container.querySelector('#jerseyImage');
                this.jerseyName = this.container.querySelector('#jerseyName');
                this.jerseyNumber = this.container.querySelector('#jerseyNumber');
                this.customizationControls = document.getElementById('customizationControls');

                this.nameInput = document.getElementById('nameInput');
                this.numberInput = document.getElementById('numberInput');
                this.nameSizeInput = document.getElementById('nameSize');
                this.nameSizeValue = document.getElementById('nameSizeValue');
                this.numberSizeInput = document.getElementById('numberSize');
                this.numberSizeValue = document.getElementById('numberSizeValue');
                this.nameXPosInput = document.getElementById('nameXPos');
                this.nameXPosValue = document.getElementById('nameXPosValue');
                this.nameYPosInput = document.getElementById('nameYPos');
                this.nameYPosValue = document.getElementById('nameYPosValue');
                this.numberXPosInput = document.getElementById('numberXPos');
                this.numberXPosValue = document.getElementById('numberXPosValue');
                this.numberYPosInput = document.getElementById('numberYPos');
                this.numberYPosValue = document.getElementById('numberYPosValue');
                this.nameRotationInput = document.getElementById('nameRotation');
                this.nameRotationValue = document.getElementById('nameRotationValue');
                this.numberRotationInput = document.getElementById('numberRotation');
                this.numberRotationValue = document.getElementById('numberRotationValue');
                this.nameColorInput = document.getElementById('nameColor');
                this.numberColorInput = document.getElementById('numberColor');
                this.nameBoldBtn = document.getElementById('nameBold');
                this.nameItalicBtn = document.getElementById('nameItalic');
                this.numberBoldBtn = document.getElementById('numberBold');
                this.numberItalicBtn = document.getElementById('numberItalic');
                this.nameFontDisplay = document.getElementById('nameFontDisplay');
                this.nameSelectedFontText = document.getElementById('nameSelectedFontText');
                this.nameFontOptions = document.getElementById('nameFontOptions');
                this.numberFontDisplay = document.getElementById('numberFontDisplay');
                this.numberSelectedFontText = document.getElementById('numberSelectedFontText');
                this.numberFontOptions = document.getElementById('numberFontOptions');
                this.exportSettingsBtn = document.getElementById('exportSettingsBtn');
                this.importSettingsBtn = document.getElementById('importSettingsBtn');
                this.settingsOutput = document.getElementById('settingsOutput');
                this.settingsInput = document.getElementById('settingsInput');
                this.customizationSettingsHiddenInput = document.getElementById('customizationSettings');
                this.productIdHiddenInput = document.getElementById('productId');
                this.addToCartBtn = document.getElementById('addToCartBtn');

                this.googleFonts = [
                    'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Oswald',
                    'Playfair Display', 'Merriweather', 'PT Sans', 'Nunito', 'Quicksand'
                ];

                this.activeElement = null; // Element currently being dragged
                this.xOffset = 0; // Offset from element's top-left to mouse click
                this.yOffset = 0;

                this._initElements();
                this._initEventListeners();
                this.applySettings(initialSettings);
                this._updateHiddenSettings();
            }

            _initElements() {
                this.nameSizeValue.textContent = `${this.nameSizeInput.value}px`;
                this.numberSizeValue.textContent = `${this.numberSizeInput.value}px`;
                this.nameXPosValue.textContent = `${this.nameXPosInput.value}%`;
                this.nameYPosValue.textContent = `${this.nameYPosInput.value}%`;
                this.numberXPosValue.textContent = `${this.numberXPosInput.value}%`;
                this.numberYPosValue.textContent = `${this.numberYPosInput.value}%`;
                this.nameRotationValue.textContent = `${this.nameRotationInput.value}°`;
                this.numberRotationValue.textContent = `${this.numberRotationInput.value}°`;

                this._populateFontOptions(this.nameFontOptions, this.jerseyName, this.nameSelectedFontText);
                this._populateFontOptions(this.numberFontOptions, this.jerseyNumber, this.numberSelectedFontText);
            }

            _initEventListeners() {
                this.customizationControls.addEventListener('input', this._handleControlChange.bind(this));
                this.customizationControls.addEventListener('change', this._handleControlChange.bind(this));

                this.nameBoldBtn.addEventListener('click', () => { this._toggleStyle(this.jerseyName, 'fontWeight', 'bold', this.nameBoldBtn); this._updateHiddenSettings(); });
                this.nameItalicBtn.addEventListener('click', () => { this._toggleStyle(this.jerseyName, 'fontStyle', 'italic', this.nameItalicBtn); this._updateHiddenSettings(); });
                this.numberBoldBtn.addEventListener('click', () => { this._toggleStyle(this.jerseyNumber, 'fontWeight', 'bold', this.numberBoldBtn); this._updateHiddenSettings(); });
                this.numberItalicBtn.addEventListener('click', () => { this._toggleStyle(this.jerseyNumber, 'fontStyle', 'italic', this.numberItalicBtn); this._updateHiddenSettings(); });

                this.nameFontDisplay.addEventListener('click', (e) => this._toggleFontPicker(e, this.nameFontOptions, this.numberFontOptions));
                this.numberFontDisplay.addEventListener('click', (e) => this._toggleFontPicker(e, this.numberFontOptions, this.nameFontOptions));
                document.addEventListener('click', (e) => this._closeFontPickersOnClickOutside(e));

                this.jerseyName.addEventListener('mousedown', (e) => this._dragStart(e));
                this.jerseyNumber.addEventListener('mousedown', (e) => this._dragStart(e));

                this.exportSettingsBtn.addEventListener('click', () => this.settingsOutput.value = this.getSettings());
                this.importSettingsBtn.addEventListener('click', () => this._importSettingsFromTextArea());

                this.addToCartBtn.addEventListener('click', () => this._addToCart());

                window.addEventListener('load', () => setTimeout(() => this._updateSlidersFromCurrentStyle(), 100));
                window.addEventListener('resize', () => this._updateSlidersFromCurrentStyle());
            }

            _handleControlChange(e) {
                const target = e.target;

                if (target === this.nameInput) {
                    this.jerseyName.textContent = target.value.toUpperCase();
                } else if (target === this.numberInput) {
                    target.value = target.value.replace(/[^0-9]/g, '').substring(0, 2);
                    this.jerseyNumber.textContent = target.value;
                } else if (target === this.nameSizeInput) {
                    this.jerseyName.style.fontSize = `${target.value}px`;
                    this.nameSizeValue.textContent = `${target.value}px`;
                } else if (target === this.numberSizeInput) {
                    this.jerseyNumber.style.fontSize = `${target.value}px`;
                    this.numberSizeValue.textContent = `${target.value}px`;
                } else if (target === this.nameColorInput) {
                    this.jerseyName.style.color = target.value;
                } else if (target === this.numberColorInput) {
                    this.jerseyNumber.style.color = target.value;
                } else if (target === this.nameXPosInput) {
                    this._updatePosition(this.jerseyName, 'left', target.value, this.nameXPosValue);
                } else if (target === this.nameYPosInput) {
                    this._updatePosition(this.jerseyName, 'top', target.value, this.nameYPosValue);
                } else if (target === this.numberXPosInput) {
                    this._updatePosition(this.jerseyNumber, 'left', target.value, this.numberXPosValue);
                } else if (target === this.numberYPosInput) {
                    this._updatePosition(this.jerseyNumber, 'top', target.value, this.numberYPosValue);
                } else if (target === this.nameRotationInput) {
                    this._updateRotation(this.jerseyName, target.value, this.nameRotationValue);
                } else if (target === this.numberRotationInput) {
                    this._updateRotation(this.jerseyNumber, target.value, this.numberRotationValue);
                }
                
                this._updateHiddenSettings();
            }

            _updateHiddenSettings() {
                this.customizationSettingsHiddenInput.value = this.getSettings();
                this.settingsOutput.value = this.customizationSettingsHiddenInput.value;
            }

            _updateRotation(element, angle, valueSpan) {
                // Get the current transform string to preserve translateX
                const currentTransform = element.style.transform;
                // Use a regex to find the translateX part, defaulting to translateX(-50%) if not found
                const translateXMatch = currentTransform.match(/translateX\(([^)]+)\)/);
                const currentTranslateX = translateXMatch ? translateXMatch[0] : 'translateX(-50%)';

                element.style.transform = `${currentTranslateX} rotate(${angle}deg)`;
                valueSpan.textContent = `${angle}°`;
            }

            _toggleStyle(element, property, value, button) {
                const current = getComputedStyle(element)[property];
                element.style[property] = (current === value || (property === 'fontWeight' && current === '700')) ? 'normal' : value;
                button.classList.toggle('active', element.style[property] === value || (property === 'fontWeight' && getComputedStyle(element)[property] === '700'));
            }

            _updatePosition(element, prop, value, valueSpan) {
                element.style[prop] = `${value}%`;
                // Preserve rotation and ensure translateX(-50%) for position updates via sliders
                const currentTransform = element.style.transform;
                const rotateMatch = currentTransform.match(/rotate\(([^)]+)\)/);
                const currentRotate = rotateMatch ? rotateMatch[0] : 'rotate(0deg)';
                
                element.style.transform = `translateX(-50%) ${currentRotate}`;
                valueSpan.textContent = `${value}%`;
            }

            _populateFontOptions(fontOptionsContainer, targetElement, selectedFontTextSpan) {
                fontOptionsContainer.innerHTML = '';
                this.googleFonts.forEach(fontName => {
                    const optionDiv = document.createElement('div');
                    optionDiv.classList.add('font-option-item', 'text-gray-800', 'text-lg', 'font-medium', 'rounded-md');
                    optionDiv.textContent = fontName;
                    optionDiv.style.fontFamily = `'${fontName}', sans-serif`;
                    optionDiv.addEventListener('click', () => {
                        targetElement.style.fontFamily = `'${fontName}', sans-serif`;
                        selectedFontTextSpan.textContent = fontName;
                        fontOptionsContainer.classList.add('hidden');
                        this._updateHiddenSettings();
                    });
                    fontOptionsContainer.appendChild(optionDiv);
                });
            }

            _toggleFontPicker(e, currentPicker, otherPicker) {
                e.stopPropagation();
                currentPicker.classList.toggle('hidden');
                otherPicker.classList.add('hidden');
            }

            _closeFontPickersOnClickOutside(e) {
                if (!this.nameFontOptions.contains(e.target) && e.target !== this.nameFontDisplay) {
                    this.nameFontOptions.classList.add('hidden');
                }
                if (!this.numberFontOptions.contains(e.target) && e.target !== this.numberFontDisplay) {
                    this.numberFontOptions.classList.add('hidden');
                }
            }

            _getActualImageBounds() {
                const imgRect = this.jerseyImage.getBoundingClientRect();
                const previewRect = this.container.getBoundingClientRect();

                return {
                    left: imgRect.left - previewRect.left,
                    top: imgRect.top - previewRect.top,
                    right: imgRect.right - previewRect.left,
                    bottom: imgRect.bottom - previewRect.top,
                    width: imgRect.width,
                    height: imgRect.height
                };
            }

            _dragStart(e) {
                if (e.button !== 0) return;

                this.activeElement = e.target;
                const rect = this.activeElement.getBoundingClientRect();
                const parentRect = this.container.getBoundingClientRect();

                this.activeElement.style.transition = 'none'; // Temporarily disable transitions

                // Capture the current visual position and convert to pixels relative to parent
                const currentLeftPx = rect.left - parentRect.left;
                const currentTopPx = rect.top - parentRect.top;

                // Set style.left/top directly based on current visual position
                this.activeElement.style.left = `${currentLeftPx}px`;
                this.activeElement.style.top = `${currentTopPx}px`;
                this.activeElement.style.transform = 'none'; // Remove transform during drag for simpler pixel manipulation

                // Calculate the offset of the mouse click within the element's now top-left-based position
                this.xOffset = e.clientX - rect.left;
                this.yOffset = e.clientY - rect.top;

                document.addEventListener('mousemove', this._dragMoveHandler);
                document.addEventListener('mouseup', this._dragEndHandler);

                this.activeElement.style.cursor = 'grabbing';
                e.preventDefault();
            }

            _dragMoveHandler = (e) => {
                if (!this.activeElement) return;

                const parentRect = this.container.getBoundingClientRect();
                const imgBounds = this._getActualImageBounds();

                // Calculate proposed new top-left pixel position based on mouse movement
                let newX = e.clientX - parentRect.left - this.xOffset;
                let newY = e.clientY - parentRect.top - this.yOffset;

                // Clamp newX and newY to stay within image boundaries
                newX = Math.max(imgBounds.left, Math.min(newX, imgBounds.right - this.activeElement.offsetWidth));
                newY = Math.max(imgBounds.top, Math.min(newY, imgBounds.bottom - this.activeElement.offsetHeight));

                // Convert clamped pixel positions to percentages relative to parent's size
                // Note: For X-position, we convert the *center* of the element to percentage,
                // as the final `left` property combined with `translateX(-50%)` will position the center.
                const newXCenterPx = newX + (this.activeElement.offsetWidth / 2);
                const newXPercent = (newXCenterPx / parentRect.width) * 100;
                const newYPercent = (newY / parentRect.height) * 100;

                const isName = this.activeElement.dataset.element === 'name';
                const xSlider = isName ? this.nameXPosInput : this.numberXPosInput;
                const ySlider = isName ? this.nameYPosInput : this.numberYPosInput;
                const xValueSpan = isName ? this.nameXPosValue : this.numberXPosValue;
                const yValueSpan = isName ? this.nameYPosValue : this.numberYPosValue;

                // Update sliders directly, which handles the 0-100 clamping
                xSlider.value = Math.round(newXPercent);
                ySlider.value = Math.round(newYPercent);

                // Apply style based on the clamped slider values (percentages)
                this.activeElement.style.left = `${xSlider.value}%`;
                this.activeElement.style.top = `${ySlider.value}%`;
                // Keep transform off during drag; it will be reapplied at dragEnd
                this.activeElement.style.transform = 'none'; 

                // Update text display for sliders
                xValueSpan.textContent = `${xSlider.value}%`;
                yValueSpan.textContent = `${ySlider.value}%`;
            }

            _dragEndHandler = () => {
                if (this.activeElement) {
                    this.activeElement.style.transition = ''; // Re-enable CSS transitions

                    const isName = this.activeElement.dataset.element === 'name';
                    const rotationInput = isName ? this.nameRotationInput : this.numberRotationInput;
                    const currentRotation = rotationInput.value; // Get current rotation from slider

                    // Get the final percentages directly from the sliders which were updated during the drag
                    const finalLeftPercent = parseFloat(isName ? this.nameXPosInput.value : this.numberXPosInput.value);
                    const finalTopPercent = parseFloat(isName ? this.nameYPosInput.value : this.numberYPosInput.value);

                    this.activeElement.style.left = `${finalLeftPercent}%`;
                    this.activeElement.style.top = `${finalTopPercent}%`;
                    // Reapply transform with both translateX(-50%) and the current rotation
                    this.activeElement.style.transform = `translateX(-50%) rotate(${currentRotation}deg)`;
                    this.activeElement.style.cursor = 'grab'; // Reset cursor
                    this.activeElement = null; // Clear active element
                }
                document.removeEventListener('mousemove', this._dragMoveHandler);
                document.removeEventListener('mouseup', this._dragEndHandler);
                // No need to call _updateSlidersFromCurrentStyle() here as sliders are already synced
                this._updateHiddenSettings(); // Update hidden input after drag ends
            }

            _updateSlidersFromCurrentStyle() {
                // This function is mainly for initial setup or after applying settings from JSON
                const previewRect = this.container.getBoundingClientRect();

                const updateElementPositionSliders = (element, xSlider, ySlider, xValueSpan, yValueSpan) => {
                    const elementRect = element.getBoundingClientRect(); // Get the actual visual position

                    // Calculate center X and top Y in pixels relative to the preview container
                    const centerX_px = (elementRect.left - previewRect.left) + (elementRect.width / 2);
                    const topY_px = (elementRect.top - previewRect.top);

                    // Convert to percentage
                    const leftPercent = (centerX_px / previewRect.width) * 100;
                    const topPercent = (topY_px / previewRect.height) * 100;

                    // Update slider values and their text displays, clamping as per slider min/max
                    xSlider.value = Math.round(Math.max(xSlider.min, Math.min(leftPercent, xSlider.max)));
                    ySlider.value = Math.round(Math.max(ySlider.min, Math.min(topPercent, ySlider.max)));

                    xValueSpan.textContent = `${xSlider.value}%`;
                    yValueSpan.textContent = `${ySlider.value}%`;
                };

                updateElementPositionSliders(this.jerseyName, this.nameXPosInput, this.nameYPosInput, this.nameXPosValue, this.nameYPosValue);
                updateElementPositionSliders(this.jerseyNumber, this.numberXPosInput, this.numberYPosInput, this.numberXPosValue, this.numberYPosValue);
            }

            /**
             * Exports the current customization settings as a JSON string.
             * @returns {string} JSON string of current settings.
             */
            getSettings() {
                const nameStyle = getComputedStyle(this.jerseyName);
                const numberStyle = getComputedStyle(this.jerseyNumber);
                
                // Get current left/top percentages directly from sliders, as they reflect the live state
                const nameLeftPercent = parseFloat(this.nameXPosInput.value);
                const nameTopPercent = parseFloat(this.nameYPosInput.value);
                const numberLeftPercent = parseFloat(this.numberXPosInput.value);
                const numberTopPercent = parseFloat(this.numberYPosInput.value);

                // Extract rotation from the current transform property
                const getNameRotation = () => {
                    const transform = this.jerseyName.style.transform;
                    const match = transform.match(/rotate\((-?\d+\.?\d*)deg\)/);
                    return match ? parseFloat(match[1]) : 0;
                };
                const getNumberRotation = () => {
                    const transform = this.jerseyNumber.style.transform;
                    const match = transform.match(/rotate\((-?\d+\.?\d*)deg\)/);
                    return match ? parseFloat(match[1]) : 0;
                };


                const settings = {
                    name: {
                        text: this.jerseyName.textContent,
                        fontSize: parseFloat(nameStyle.fontSize),
                        color: nameStyle.color,
                        xPos: nameLeftPercent,
                        yPos: nameTopPercent,
                        rotation: getNameRotation(),
                        bold: nameStyle.fontWeight === 'bold' || parseFloat(nameStyle.fontWeight) >= 700,
                        italic: nameStyle.fontStyle === 'italic',
                        fontFamily: nameStyle.fontFamily.split(',')[0].replace(/['"]+/g, '').trim()
                    },
                    number: {
                        text: this.jerseyNumber.textContent,
                        fontSize: parseFloat(numberStyle.fontSize),
                        color: numberStyle.color,
                        xPos: numberLeftPercent,
                        yPos: numberTopPercent,
                        rotation: getNumberRotation(),
                        bold: numberStyle.fontWeight === 'bold' || parseFloat(numberStyle.fontWeight) >= 700,
                        italic: numberStyle.fontStyle === 'italic',
                        fontFamily: numberStyle.fontFamily.split(',')[0].replace(/['"]+/g, '').trim()
                    }
                };
                return JSON.stringify(settings, null, 2);
            }

            /**
             * Applies a given settings object to the jersey and updates UI controls.
             * @param {Object} settings - The settings object to apply.
             */
            applySettings(settings) {
                if (!settings || Object.keys(settings).length === 0) {
                    console.log("No settings provided or settings object is empty. Using default or current state.");
                    this._updateSlidersFromCurrentStyle();
                    return;
                }

                // Helper to apply transform properties, ensuring translateX(-50%) is always there
                const applyCombinedTransform = (element, rotationAngle) => {
                    element.style.transform = `translateX(-50%) rotate(${rotationAngle || 0}deg)`;
                };

                // Apply name settings
                if (settings.name) {
                    this.jerseyName.textContent = settings.name.text || 'PLAYER NAME';
                    this.jerseyName.style.fontSize = `${settings.name.fontSize || 40}px`;
                    this.jerseyName.style.color = settings.name.color || '#ffffff';
                    this.jerseyName.style.fontWeight = settings.name.bold ? 'bold' : 'normal';
                    this.jerseyName.style.fontStyle = settings.name.italic ? 'italic' : 'normal';
                    this.jerseyName.style.fontFamily = `'${settings.name.fontFamily || 'Roboto'}', sans-serif`;
                    this.jerseyName.style.left = `${settings.name.xPos || 50}%`;
                    this.jerseyName.style.top = `${settings.name.yPos || 45}%`;
                    applyCombinedTransform(this.jerseyName, settings.name.rotation); // Apply combined transform

                    // Update name UI controls
                    this.nameInput.value = settings.name.text;
                    this.nameSizeInput.value = settings.name.fontSize;
                    this.nameSizeValue.textContent = `${settings.name.fontSize}px`;
                    this.nameXPosInput.value = settings.name.xPos;
                    this.nameXPosValue.textContent = `${settings.name.xPos}%`;
                    this.nameYPosInput.value = settings.name.yPos;
                    this.nameYPosValue.textContent = `${settings.name.yPos}%`;
                    this.nameRotationInput.value = settings.name.rotation || 0;
                    this.nameRotationValue.textContent = `${settings.name.rotation || 0}°`;
                    this.nameColorInput.value = settings.name.color;
                    this.nameBoldBtn.classList.toggle('active', settings.name.bold);
                    this.nameItalicBtn.classList.toggle('active', settings.name.italic);
                    this.nameSelectedFontText.textContent = settings.name.fontFamily;
                }

                // Apply number settings
                if (settings.number) {
                    this.jerseyNumber.textContent = settings.number.text || '99';
                    this.jerseyNumber.style.fontSize = `${settings.number.fontSize || 100}px`;
                    this.jerseyNumber.style.color = settings.number.color || '#ffffff';
                    this.jerseyNumber.style.fontWeight = settings.number.bold ? 'bold' : 'normal';
                    this.jerseyNumber.style.fontStyle = settings.number.italic ? 'italic' : 'normal';
                    this.jerseyNumber.style.fontFamily = `'${settings.number.fontFamily || 'Roboto'}', sans-serif`;
                    this.jerseyNumber.style.left = `${settings.number.xPos || 50}%`;
                    this.jerseyNumber.style.top = `${settings.number.yPos || 30}%`;
                    applyCombinedTransform(this.jerseyNumber, settings.number.rotation); // Apply combined transform

                    // Update number UI controls
                    this.numberInput.value = settings.number.text;
                    this.numberSizeInput.value = settings.number.fontSize;
                    this.numberSizeValue.textContent = `${settings.number.fontSize}px`;
                    this.numberXPosInput.value = settings.number.xPos;
                    this.numberXPosValue.textContent = `${settings.number.xPos}%`;
                    this.numberYPosInput.value = settings.number.yPos;
                    this.numberYPosValue.textContent = `${settings.number.yPos}%`;
                    this.numberRotationInput.value = settings.number.rotation || 0;
                    this.numberRotationValue.textContent = `${settings.number.rotation || 0}°`;
                    this.numberColorInput.value = settings.number.color;
                    this.numberBoldBtn.classList.toggle('active', settings.number.bold);
                    this.numberItalicBtn.classList.toggle('active', settings.number.italic);
                    this.numberSelectedFontText.textContent = settings.number.fontFamily;
                }

                setTimeout(() => this._updateSlidersFromCurrentStyle(), 50);
            }

            _importSettingsFromTextArea() {
                try {
                    const settingsText = this.settingsInput.value;
                    if (!settingsText.trim()) {
                        alert("Import settings textarea is empty. Please paste valid JSON.");
                        return;
                    }
                    const parsedSettings = JSON.parse(settingsText);
                    this.applySettings(parsedSettings);
                    alert("Settings imported successfully!");
                } catch (error) {
                    console.error("Failed to parse or apply settings:", error);
                    alert("Error importing settings. Please ensure the JSON format is valid.");
                }
            }

            async _addToCart() {
                const productId = this.productIdHiddenInput.value;
                const customizationSettings = this.customizationSettingsHiddenInput.value;

                if (!customizationSettings) {
                    alert("Please customize your jersey before adding to cart.");
                    return;
                }

                const payload = {
                    productId: productId,
                    customization: JSON.parse(customizationSettings)
                };

                console.log("Simulating Add to Cart with payload:", payload);

                try {
                    // This is where your actual fetch request to your backend would go.
                    // For demonstration, we'll just show an alert and log.
                    // const response = await fetch('/api/cart', {
                    //     method: 'POST',
                    //     headers: {
                    //         'Content-Type': 'application/json',
                    //     },
                    //     body: JSON.stringify(payload),
                    // });
                    //
                    // if (response.ok) {
                    //     const result = await response.json();
                    //     alert(`Product added to cart! Response: ${JSON.stringify(result)}`);
                    // } else {
                    //     const errorText = await response.text();
                    //     alert(`Failed to add to cart: ${response.status} - ${errorText}`);
                    // }

                    alert("Product added to cart successfully! (Simulated)");
                    console.log("Simulated server response: { status: 'success', message: 'Item added to cart' }");

                } catch (error) {
                    console.error("Error adding to cart:", error);
                    alert("An error occurred while trying to add to cart. Please try again.");
                }
            }
        }
