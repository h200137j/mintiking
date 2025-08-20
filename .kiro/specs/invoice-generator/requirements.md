# Requirements Document

## Introduction

This feature involves creating a professional HTML-based invoice generator website that displays a pre-formatted invoice for Mintiking Suppliers and allows users to export it as a PDF. The website will feature a clean, modern design with proper styling and a functional PDF export capability using html2pdf.js library.

## Requirements

### Requirement 1

**User Story:** As a business user, I want to view a professionally formatted invoice on a web page, so that I can review the invoice details in a clean, readable format.

#### Acceptance Criteria

1. WHEN the page loads THEN the system SHALL display a centered invoice card on a light gray background
2. WHEN viewing the invoice THEN the system SHALL show "Mintiking Suppliers" as the company header
3. WHEN viewing the invoice THEN the system SHALL display recipient details for "Radar Castings, 1910 Pprotland Road, Heavy Industrial Site, Gweru"
4. WHEN viewing the invoice THEN the system SHALL use elegant fonts like Arial or Helvetica
5. WHEN viewing the invoice THEN the system SHALL include subtle borders and proper section headers for readability

### Requirement 2

**User Story:** As a business user, I want to see detailed item information in a table format, so that I can review the products, quantities, and pricing clearly.

#### Acceptance Criteria

1. WHEN viewing the invoice THEN the system SHALL display an item table with Description, Quantity, Price per unit, and Total columns
2. WHEN viewing the item table THEN the system SHALL show "Ferro Chrome" as the description
3. WHEN viewing the item table THEN the system SHALL show quantity of 3626
4. WHEN viewing the item table THEN the system SHALL show price per unit of $0.85
5. WHEN viewing the item table THEN the system SHALL show total of $3082.10
6. WHEN viewing the invoice THEN the system SHALL display VAT as $0

### Requirement 3

**User Story:** As a business user, I want to see payment details clearly displayed, so that I know where to send payment for the invoice.

#### Acceptance Criteria

1. WHEN viewing the invoice THEN the system SHALL display a Payment Details section at the bottom
2. WHEN viewing payment details THEN the system SHALL show Account Name as "Mintiking Suppliers Pvt Ltd"
3. WHEN viewing payment details THEN the system SHALL show Bank as "BancABC"
4. WHEN viewing payment details THEN the system SHALL show Account Number as "56802156602990"
5. WHEN viewing payment details THEN the system SHALL show Branch as "Kwekwe"

### Requirement 4

**User Story:** As a business user, I want to export the invoice as a PDF file, so that I can save, print, or share the invoice electronically.

#### Acceptance Criteria

1. WHEN viewing the invoice THEN the system SHALL display a "Download Invoice (PDF)" button
2. WHEN the user clicks the PDF download button THEN the system SHALL generate a PDF version of the entire invoice
3. WHEN generating the PDF THEN the system SHALL use html2pdf.js library for conversion
4. WHEN the PDF is generated THEN the system SHALL maintain the same formatting and styling as the web version
5. WHEN the PDF is generated THEN the system SHALL automatically download the file to the user's device

### Requirement 5

**User Story:** As a business user, I want the website to have a modern and professional appearance, so that it reflects well on my business when sharing invoices.

#### Acceptance Criteria

1. WHEN viewing the website THEN the system SHALL use a clean, modern design with proper spacing
2. WHEN viewing the invoice THEN the system SHALL display neat borders and professional styling
3. WHEN viewing the invoice THEN the system SHALL center the invoice card with appropriate margins
4. WHEN viewing the invoice THEN the system SHALL use consistent typography and color scheme
5. WHEN viewing the invoice THEN the system SHALL ensure all sections are clearly separated and organized