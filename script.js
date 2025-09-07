// PDF Export functionality for Invoice Generator
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
    downloadBtn.addEventListener('click', downloadInvoicePDF);
});

/**
 * Main PDF export function
 * Generates and downloads the invoice as a PDF file
 */
function downloadInvoicePDF() {
    const invoiceElement = document.getElementById('invoice');
    const downloadBtn = document.getElementById('downloadBtn');
    
    // Show loading state
    const originalText = downloadBtn.textContent;
    downloadBtn.disabled = true;
    downloadBtn.textContent = 'Generating PDF...';
    
    // Apply compact styles for PDF generation
    applyPDFStyles();
    
    // Configure html2pdf options for single-page invoice output
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
        .from(invoiceElement)
        .save()
        .then(() => {
            // Reset styles and button state
            resetStyles();
            downloadBtn.disabled = false;
            downloadBtn.textContent = originalText;
            showSuccess('Invoice PDF downloaded successfully!');
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
    const invoice = document.getElementById('invoice');
    invoice.style.padding = '20px';
    
    // Header styles
    const header = document.querySelector('.invoice-header');
    if (header) {
        header.style.marginBottom = '25px';
        header.style.paddingBottom = '15px';
    }
    
    const companyName = document.querySelector('.company-name');
    if (companyName) {
        companyName.style.fontSize = '2.2rem';
        companyName.style.marginBottom = '8px';
    }
    
    const invoiceTitle = document.querySelector('.invoice-title');
    if (invoiceTitle) {
        invoiceTitle.style.fontSize = '1.3rem';
        invoiceTitle.style.marginBottom = '12px';
    }
    
    const invoiceMeta = document.querySelector('.invoice-meta');
    if (invoiceMeta) {
        invoiceMeta.style.marginTop = '15px';
        invoiceMeta.style.gap = '30px';
    }
    
    const metaLabels = document.querySelectorAll('.meta-label');
    metaLabels.forEach(label => {
        label.style.fontSize = '0.9rem';
        label.style.marginBottom = '4px';
    });
    
    const metaValues = document.querySelectorAll('.meta-value');
    metaValues.forEach(value => {
        value.style.fontSize = '1.1rem';
    });
    
    // Section styles
    const sections = document.querySelectorAll('.recipient-section, .items-section, .totals-section');
    sections.forEach(section => {
        section.style.marginBottom = '20px';
    });
    
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        title.style.fontSize = '1rem';
        title.style.marginBottom = '10px';
        title.style.paddingBottom = '4px';
    });
    
    // Recipient details
    const recipientNames = document.querySelectorAll('.recipient-name');
    recipientNames.forEach(name => {
        name.style.fontSize = '1rem';
        name.style.marginBottom = '4px';
    });
    
    const recipientAddresses = document.querySelectorAll('.recipient-address');
    recipientAddresses.forEach(address => {
        address.style.fontSize = '0.9rem';
        address.style.marginBottom = '2px';
    });
    
    // Table styles
    const itemsTable = document.querySelector('.items-table');
    if (itemsTable) {
        itemsTable.style.marginTop = '15px';
    }
    
    const tableCells = document.querySelectorAll('.items-table th, .items-table td');
    tableCells.forEach(cell => {
        cell.style.padding = '10px 8px';
        cell.style.fontSize = '0.9rem';
    });
    
    // Totals styles
    const totalsSection = document.querySelector('.totals-section');
    if (totalsSection) {
        totalsSection.style.paddingTop = '15px';
    }
    
    const totalsRows = document.querySelectorAll('.totals-row');
    totalsRows.forEach(row => {
        row.style.padding = '6px 0';
        row.style.fontSize = '0.9rem';
    });
    
    const totalFinal = document.querySelector('.total-final');
    if (totalFinal) {
        totalFinal.style.fontSize = '1.1rem';
        totalFinal.style.paddingTop = '12px';
        totalFinal.style.marginTop = '8px';
    }
    
    // Payment section
    const paymentSection = document.querySelector('.payment-section');
    if (paymentSection) {
        paymentSection.style.padding = '20px';
        paymentSection.style.marginBottom = '0';
    }
    
    const paymentRows = document.querySelectorAll('.payment-row');
    paymentRows.forEach(row => {
        row.style.padding = '4px 0';
        row.style.fontSize = '0.9rem';
    });
}

/**
 * Reset styles after PDF generation
 */
function resetStyles() {
    const invoice = document.getElementById('invoice');
    invoice.style.padding = '';
    
    // Reset all modified elements
    const elementsToReset = [
        '.invoice-header', '.company-name', '.invoice-title', '.invoice-meta',
        '.recipient-section', '.items-section', '.totals-section', '.section-title',
        '.items-table th', '.items-table td', '.totals-row', '.payment-section', '.payment-row'
    ];
    
    elementsToReset.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.style.cssText = '';
        });
    });
}

/**
 * Generate a filename with timestamp for the PDF
 * @returns {string} Formatted filename
 */
function generateFilename() {
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 19).replace(/:/g, '-');
    return `Mintiking-Supplies-Invoice-${timestamp}.pdf`;
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

/**
 * Feature detection for PDF generation support
 * @returns {boolean} True if PDF generation is supported
 */
function isPDFGenerationSupported() {
    return typeof html2pdf !== 'undefined' && 
           typeof html2canvas !== 'undefined';
}

// Export functions for potential future use
window.InvoiceGenerator = {
    downloadPDF: downloadInvoicePDF,
    isSupported: isPDFGenerationSupported
};