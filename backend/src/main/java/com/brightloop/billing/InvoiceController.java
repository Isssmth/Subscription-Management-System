package com.brightloop.billing;

import java.util.List;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "*")
public class InvoiceController {

    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    // Create invoice
    @PostMapping
    public Invoice createInvoice(@RequestBody Invoice invoice) {
        return invoiceService.createInvoice(invoice);
    }

    // Get all invoices
    @GetMapping
    public List<Invoice> getAllInvoices() {
        return invoiceService.getAllInvoices();
    }

    // Get invoice by ID
    @GetMapping("/{id}")
    public Invoice getInvoiceById(@PathVariable Long id) {
        return invoiceService.getInvoiceById(id);
    }

    // Update invoice
    @PutMapping("/{id}")
    public Invoice updateInvoice(
            @PathVariable Long id,
            @RequestBody Invoice invoice) {
        return invoiceService.updateInvoice(id, invoice);
    }

    // Delete invoice
    @DeleteMapping("/{id}")
    public String deleteInvoice(@PathVariable Long id) {
        invoiceService.deleteInvoice(id);
        return "Invoice deleted successfully";
    }
}