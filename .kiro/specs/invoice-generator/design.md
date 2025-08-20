# Design Document

## Overview

The invoice generator will be a single-page web application consisting of three main files: HTML for structure, CSS for styling, and JavaScript for PDF export functionality. The application will display a static invoice with predefined data and provide PDF export capabilities using the html2pdf.js library.

## Architecture

### File Structure
```
invoice-generator/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling
├── script.js           # JavaScript for PDF export
└── README.md           # Documentation
```

### Technology Stack
- **HTML5**: Semantic markup for invoice structure
- **CSS3**: Modern styling with flexbox/grid for layout
- **Vanilla JavaScript**: PDF export functionality
- **html2pdf.js**: Third-party library for HTML to PDF conversion (CDN)

## Components and Interfaces

### HTML Structure
The HTML will be organized into semantic sections:

1. **Document Container**: Main wrapper with centered layout
2. **Invoice Card**: White background container with shadow
3. **Header Section**: Company name and invoice title
4. **Recipient Section**: "Invoice To" details
5. **Item Table**: Product details in tabular format
6. **Totals Section**: Subtotal, VAT, and final total
7. **Payment Details**: Banking information
8. **Action Section**: PDF download button

### CSS Design System
- **Colors**: 
  - Background: Light gray (#f5f5f5)
  - Card: White (#ffffff)
  - Text: Dark gray (#333333)
  - Borders: Light gray (#e0e0e0)
  - Accent: Professional blue (#2c5aa0)
- **Typography**: Arial/Helvetica font stack
- **Spacing**: Consistent 16px base unit system
- **Layout**: Centered card design with max-width of 800px

### JavaScript Interface
```javascript
// Main PDF export function
function downloadInvoicePDF() {
    // Configure html2pdf options
    // Generate and download PDF
}

// Event listener setup
document.addEventListener('DOMContentLoaded', function() {
    // Bind PDF download button
});
```

## Data Models

### Invoice Data Structure
The invoice will contain static data embedded in HTML:

```javascript
const invoiceData = {
    company: {
        name: "Mintiking Suppliers"
    },
    recipient: {
        name: "Radar Castings",
        address: "1910 Pprotland Road, Heavy Industrial Site, Gweru"
    },
    items: [{
        description: "Ferro Chrome",
        quantity: 3626,
        pricePerUnit: 0.85,
        total: 3082.10
    }],
    vat: 0,
    paymentDetails: {
        accountName: "Mintiking Suppliers Pvt Ltd",
        bank: "BancABC",
        accountNumber: "56802156602990",
        branch: "Kwekwe"
    }
};
```

## Error Handling

### PDF Generation Errors
- **Network Issues**: Graceful fallback if CDN fails to load html2pdf.js
- **Browser Compatibility**: Feature detection for PDF generation support
- **Generation Failures**: User-friendly error messages if PDF creation fails

### Implementation Strategy
```javascript
// Check if html2pdf is available
if (typeof html2pdf === 'undefined') {
    // Show error message and disable PDF button
    showError('PDF export is currently unavailable');
    return;
}

// Wrap PDF generation in try-catch
try {
    await html2pdf().from(element).save();
} catch (error) {
    showError('Failed to generate PDF. Please try again.');
}
```

## Testing Strategy

### Manual Testing Checklist
1. **Visual Testing**:
   - Verify invoice displays correctly across different screen sizes
   - Check typography, spacing, and alignment
   - Validate color scheme and professional appearance

2. **Functionality Testing**:
   - Test PDF download button functionality
   - Verify PDF output matches web display
   - Test across different browsers (Chrome, Firefox, Safari, Edge)

3. **Content Validation**:
   - Verify all invoice data displays correctly
   - Check calculations (quantity × price = total)
   - Validate payment details accuracy

### Browser Compatibility
- **Primary Support**: Modern browsers (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)
- **PDF Library Support**: html2pdf.js compatibility requirements
- **Fallback Strategy**: Graceful degradation if PDF generation fails

## Implementation Notes

### html2pdf.js Configuration
The library will be configured with optimal settings for invoice generation:
- **Format**: A4 paper size
- **Orientation**: Portrait
- **Margins**: Standard business document margins
- **Quality**: High resolution for professional output
- **Filename**: Auto-generated with timestamp

### Responsive Design
While primarily designed for desktop viewing and PDF generation, the layout will be responsive:
- **Desktop**: Full-width centered card (max 800px)
- **Tablet**: Adjusted margins and spacing
- **Mobile**: Stacked layout with readable text sizes

### Performance Considerations
- **CDN Loading**: html2pdf.js loaded from reliable CDN
- **Lazy Loading**: PDF library only loaded when needed
- **Minimal Dependencies**: Keep the application lightweight
- **Fast Rendering**: Optimized CSS for quick initial load