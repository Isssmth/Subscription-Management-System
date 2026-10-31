package com.brightloop.catalog.tax;

import com.brightloop.catalog.tax.dto.TaxRequest;
import com.brightloop.catalog.tax.dto.TaxResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/taxes")
@CrossOrigin(origins = "*")
public class TaxController {

    private final TaxService taxService;

    public TaxController(TaxService taxService) {
        this.taxService = taxService;
    }

    @GetMapping
    public ResponseEntity<List<TaxResponse>> getAllTaxes(@RequestParam(required = false) Boolean activeOnly) {
        return ResponseEntity.ok(taxService.getAllTaxes(activeOnly));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaxResponse> getTaxById(@PathVariable Long id) {
        return ResponseEntity.ok(taxService.getTaxById(id));
    }

    @PostMapping
    public ResponseEntity<TaxResponse> createTax(@Valid @RequestBody TaxRequest request) {
        TaxResponse created = taxService.createTax(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaxResponse> updateTax(
            @PathVariable Long id,
            @Valid @RequestBody TaxRequest request) {
        return ResponseEntity.ok(taxService.updateTax(id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TaxResponse> toggleTaxStatus(@PathVariable Long id) {
        return ResponseEntity.ok(taxService.toggleActive(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTax(@PathVariable Long id) {
        taxService.deleteTax(id);
        return ResponseEntity.noContent().build();
    }
}

