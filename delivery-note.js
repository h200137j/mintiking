// PDF Export functionality for Delivery Note
document.addEventListener('DOMContentLoaded', function() {
    const downloadBtn = document.getElementById('downloadBtn');
    
    // Check if html2pdf is available
    if (typeof html2pdf === 'undefined') {
        showError('PDF export library is not available. Please check your internet connection.');
        downloadBtn.disabled = true;
        downloadBtn.textContent = 'PDF Export Unavailable';
        return;
    }
    
    // Add click event listener to download button
    downloadBtn.addEventListener('click', downloadDeliveryNotePDF);
});

/**
 * Main PDF export function
 * Generates and downloads the delivery note as a PDF file
 */
function downloadDeliveryNotePDF() {
    const deliveryNoteElement = document.getElementById('delivery-note');
    const downloadBtn = document.getElementById('downloadBtn');
    
    // Show loading state
    const originalText = downloadBtn.textContent;
    downloadBtn.disabled = true;
    downloadBtn.textContent = 'Generating PDF...';
    
    // Apply compact styles for PDF generation
    applyPDFStyles();
    
    // Configure html2pdf options for single-page delivery note output
    const options = {
        margin: [0.2, 0.2, 0.2, 0.2],
        filename: generateFilename(),
        image: { 
            type: 'jpeg', 
            quality: 0.95 
        },
        html2canvas: { 
            scale: 1.8,
            useCORS: true,
            letterRendering: true,
            allowTaint: false,
            backgroundColor: '#ffffff'
        },
        jsPDF: { 
            unit: 'in', 
            format: 'a4', 
            orientation: 'portrait'
        },
        pagebreak: { 
            mode: ['avoid-all'] 
        }
    };
    
    // Generate and download PDF
    html2pdf()
        .set(options)
        .from(deliveryNoteElement)
        .save()
        .then(() => {
            // Reset styles and button state
            resetStyles();
            downloadBtn.disabled = false;
            downloadBtn.textContent = originalText;
            showSuccess('Delivery Note PDF downloaded successfully!');
        })
        .catch((error) => {
            // Handle PDF generation errors
            console.error('PDF generation failed:', error);
            resetStyles();
            downloadBtn.disabled = false;
            downloadBtn.textContent = originalText;
            showError('Failed to generate PDF. Please try again.');
        });
}

/**
 * Apply compact styles for PDF generation
 */
function applyPDFStyles() {
    const deliveryNote = document.getElementById('delivery-note');
    deliveryNote.style.padding = '20px';
    
    // Header styles
    const header = document.querySelector('.invoice-header');
    if (header) {
        header.style.marginBottom = '25px';
        header.style.paddingBottom = '15px';
    }
    
    // Apply all the same styles as the invoice PDF
    const elements = {
        '.company-name': { fontSize: '2.2rem', marginBottom: '8px' },
        '.invoice-title': { fontSize: '1.3rem', marginBottom: '12px' },
        '.invoice-meta': { marginTop: '15px', gap: '30px' },
        '.meta-label': { fontSize: '0.9rem', marginBottom: '4px' },
        '.meta-value': { fontSize: '1.1rem' },
        '.section-title': { fontSize: '1rem', marginBottom: '10px', paddingBottom: '4px' },
        '.recipient-name': { fontSize: '1rem', marginBottom: '4px' },
        '.recipient-address': { fontSize: '0.9rem', marginBottom: '2px' },
        '.items-table': { marginTop: '15px' },
        '.items-table th, .items-table td': { padding: '10px 8px', fontSize: '0.9rem' },
        '.signatures-section': { marginTop: '30px', marginBottom: '20px' },
        '.signature-box': { padding: '15px', marginBottom: '10px' },
        '.signature-line': { marginTop: '40px', marginBottom: '10px' },
        '.notes-section': { fontSize: '0.9rem', padding: '15px' }
    };
    
    for (const [selector, styles] of Object.entries(elements)) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            Object.assign(element.style, styles);
        });
    }
}

/**
 * Reset styles after PDF generation
 */
function resetStyles() {
    const elements = document.querySelectorAll('#delivery-note *');
    elements.forEach(element => {
        element.style.cssText = '';
    });
}

/**
 * Generate a filename with timestamp for the PDF
 * @returns {string} Formatted filename
 */
function generateFilename() {
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 19).replace(/:/g, '-');
    return `Mintiking-Supplies-Delivery-Note-${timestamp}.pdf`;
}

/**
 * Display success message to user
 * @param {string} message - Success message to display
 */
function showSuccess(message) {
    showNotification(message, 'success');
}

/**
 * Display error message to user
 * @param {string} message - Error message to display
 */
function showError(message) {
    showNotification(message, 'error');
}

/**
 * Display notification to user
 * @param {string} message - Message to display
 * @param {string} type - Type of notification ('success' or 'error')
 */
function showNotification(message, type) {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add notification styles
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
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 4000);
}