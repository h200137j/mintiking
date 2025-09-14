// Form handling and document generation
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('documentForm');
    const documentType = document.getElementById('documentType');
    const quantity = document.getElementById('quantity');
    const unitPrice = document.getElementById('unitPrice');
    const priceSection = document.getElementById('pricePerUnit');
    const totalSection = document.getElementById('totalAmount');
    const calculatedTotal = document.getElementById('calculatedTotal');
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('documentDate').value = today;
    
    // Show/hide price fields based on document type
    documentType.addEventListener('change', function() {
        const isInvoice = this.value === 'invoice';
        priceSection.classList.toggle('hidden', !isInvoice);
        totalSection.classList.toggle('hidden', !isInvoice);
        if (isInvoice) {
            calculateTotal();
        }
    });
    
    // Calculate total amount when quantity or unit price changes
    [quantity, unitPrice].forEach(input => {
        input.addEventListener('input', calculateTotal);
    });
    
    // Calculate total amount
    function calculateTotal() {
        if (documentType.value === 'invoice') {
            const total = (parseFloat(quantity.value) || 0) * (parseFloat(unitPrice.value) || 0);
            calculatedTotal.textContent = total.toFixed(2);
        }
    }
    
    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Disable the submit button to prevent double submission
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Generating...';
        
        const formData = {
            type: documentType.value,
            date: document.getElementById('documentDate').value,
            quantity: quantity.value,
            unitPrice: unitPrice.value,
            total: calculatedTotal.textContent
        };
        
        console.log('Form submission started');
        console.log('Document type:', formData.type);
        
        try {
            // Create the document content directly in memory
            const docContainer = document.createElement('div');
            docContainer.className = 'container';
            console.log('Created container element');
            
            const docContent = document.createElement('div');
            docContent.className = 'invoice-card';
            docContent.id = formData.type === 'invoice' ? 'invoice' : 'delivery-note';
            console.log('Created content element with ID:', docContent.id);
            
            // Format date for display
            const displayDate = new Date(formData.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: '2-digit'
            });
            
            // Get the appropriate template content based on document type
            console.log('Fetching template:', formData.type === 'invoice' ? 'index.html' : 'delivery-note.html');
            const templateResponse = await fetch(formData.type === 'invoice' ? 'index.html' : 'delivery-note.html');
            
            if (!templateResponse.ok) {
                throw new Error(`Failed to fetch template: ${templateResponse.status} ${templateResponse.statusText}`);
            }
            
            const templateText = await templateResponse.text();
            console.log('Template fetched successfully, length:', templateText.length);
            
            const tempContainer = document.createElement('div');
            tempContainer.innerHTML = templateText;
            console.log('Template loaded into temporary container');
            
            // Get the main content div
            const mainContent = tempContainer.querySelector(formData.type === 'invoice' ? '#invoice' : '#delivery-note');
            if (!mainContent) {
                throw new Error('Template content not found');
            }
            
            // Update the content with form data
            const dateElement = mainContent.querySelector('.invoice-date .meta-value');
            if (dateElement) {
                dateElement.textContent = displayDate;
            }
            
            if (formData.type === 'invoice') {
                console.log('Processing invoice template');
                console.log('Form data:', formData);
                
                // Update invoice specific content
                const tableRow = mainContent.querySelector('.items-table tbody tr');
                console.log('Found table row:', !!tableRow);
                
                if (tableRow) {
                    try {
                        tableRow.innerHTML = `
                            <td>Ferro Chrome</td>
                            <td>${formData.quantity}</td>
                            <td>$${formData.unitPrice}</td>
                            <td>$${formData.total}</td>
                        `;
                        console.log('Updated table row successfully');
                    } catch (e) {
                        console.error('Error updating table row:', e);
                    }
                }
                
                // Update totals
                const totalsValues = mainContent.querySelectorAll('.totals-value');
                console.log('Found totals elements:', totalsValues.length);
                
                totalsValues.forEach((value, index) => {
                    try {
                        value.textContent = `$${formData.total}`;
                        console.log(`Updated total value ${index + 1}`);
                    } catch (e) {
                        console.error(`Error updating total value ${index + 1}:`, e);
                    }
                });
                
                // Log the final state of the invoice content
                console.log('Final invoice HTML:', mainContent.innerHTML);
            } else {
                // Update delivery note quantity
                const quantityCell = mainContent.querySelector('.items-table tbody tr td:nth-child(2)');
                if (quantityCell) {
                    quantityCell.textContent = formData.quantity;
                }
            }
            
            // Add the updated content to our document container
            docContent.innerHTML = mainContent.innerHTML;
            docContainer.appendChild(docContent);
            
            // Configure PDF options
            const options = {
                margin: [0.2, 0.2, 0.2, 0.2],
                filename: generateFilename(formData.type),
                image: { 
                    type: 'jpeg', 
                    quality: 0.95 
                },
                html2canvas: { 
                    scale: 1.8,
                    useCORS: true,
                    letterRendering: true,
                    allowTaint: true,
                    backgroundColor: '#ffffff'
                },
                jsPDF: { 
                    unit: 'in', 
                    format: 'a4', 
                    orientation: 'portrait' 
                }
            };
            
            // Add the container to the document temporarily
            document.body.appendChild(docContainer);
            
            console.log('Starting PDF generation');
            console.log('Document container HTML:', docContainer.innerHTML);
            
            try {
                // Generate and download PDF
                await html2pdf()
                    .set(options)
                    .from(docContainer)
                    .save()
                    .then(() => {
                        console.log('PDF generation completed successfully');
                    })
                    .catch(error => {
                        console.error('PDF generation error:', error);
                        throw error;
                    });
            } catch (error) {
                console.error('PDF generation failed:', error);
                throw error;
            } finally {
                // Remove the temporary container
                document.body.removeChild(docContainer);
                console.log('Temporary container removed');
            }
            
            showSuccess(`${formData.type === 'invoice' ? 'Invoice' : 'Delivery Note'} generated successfully!`);
        } catch (error) {
            console.error('Document generation failed:', error);
            showError('Failed to generate document. Please try again.');
        } finally {
            // Re-enable the submit button
            submitButton.disabled = false;
            submitButton.textContent = 'Generate Document';
        }
    });
});

/**
 * Generate a filename with timestamp
 * @param {string} type - Document type ('invoice' or 'delivery')
 * @returns {string} Formatted filename
 */
function generateFilename(type) {
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 19).replace(/:/g, '-');
    return `Mintiking-Supplies-${type === 'invoice' ? 'Invoice' : 'Delivery-Note'}-${timestamp}.pdf`;
}

/**
 * Display success message
 * @param {string} message - Success message to display
 */
function showSuccess(message) {
    showNotification(message, 'success');
}

/**
 * Display error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    showNotification(message, 'error');
}

/**
 * Display notification
 * @param {string} message - Message to display
 * @param {string} type - Type of notification ('success' or 'error')
 */
function showNotification(message, type) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 6px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        max-width: 300px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        ${type === 'success' ? 'background-color: #28a745;' : 'background-color: #dc3545;'}
    `;
    
    // Add to page and auto-remove
    document.body.appendChild(notification);
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 4000);
}