package com.brightloop.billing;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;

    public InvoiceService(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }

    // Create a new invoice
    public Invoice createInvoice(Invoice invoice) {
        return invoiceRepository.save(invoice);
    }

    // Get all invoices
    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    // Get invoice by ID
    public Invoice getInvoiceById(Long id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
    }

    // Update an invoice
    public Invoice updateInvoice(Long id, Invoice updatedInvoice) {
        Invoice invoice = getInvoiceById(id);

        invoice.setStatus(updatedInvoice.getStatus());
        invoice.setDueDate(updatedInvoice.getDueDate());
        invoice.setSubtotal(updatedInvoice.getSubtotal());
        invoice.setTaxAmount(updatedInvoice.getTaxAmount());
        invoice.setDiscountAmount(updatedInvoice.getDiscountAmount());
        invoice.setTotalAmount(updatedInvoice.getTotalAmount());
        invoice.setPaidAmount(updatedInvoice.getPaidAmount());

        return invoiceRepository.save(invoice);
    }

    // Delete an invoice
    public void deleteInvoice(Long id) {
        Invoice invoice = getInvoiceById(id);
        invoiceRepository.delete(invoice);
    }
}