package com.brightloop.catalog.variant;

import com.brightloop.catalog.variant.dto.PriceCalculationRequest;
import com.brightloop.catalog.variant.dto.PriceCalculationResponse;
import com.brightloop.catalog.variant.dto.ProductVariantRequest;
import com.brightloop.catalog.variant.dto.ProductVariantResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products/{productId}/variants")
@CrossOrigin(origins = "*")
public class ProductVariantController {

    private final ProductVariantService variantService;

    public ProductVariantController(ProductVariantService variantService) {
        this.variantService = variantService;
    }

    @GetMapping
    public ResponseEntity<List<ProductVariantResponse>> getVariants(@PathVariable Long productId) {
        return ResponseEntity.ok(variantService.getVariantsByProductId(productId));
    }

    @GetMapping("/{variantId}")
    public ResponseEntity<ProductVariantResponse> getVariantById(
            @PathVariable Long productId,
            @PathVariable Long variantId) {
        return ResponseEntity.ok(variantService.getVariantById(variantId));
    }

    @PostMapping
    public ResponseEntity<ProductVariantResponse> addVariant(
            @PathVariable Long productId,
            @Valid @RequestBody ProductVariantRequest request) {
        ProductVariantResponse created = variantService.addVariant(productId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{variantId}")
    public ResponseEntity<ProductVariantResponse> updateVariant(
            @PathVariable Long productId,
            @PathVariable Long variantId,
            @Valid @RequestBody ProductVariantRequest request) {
        return ResponseEntity.ok(variantService.updateVariant(productId, variantId, request));
    }

    @DeleteMapping("/{variantId}")
    public ResponseEntity<Void> deleteVariant(
            @PathVariable Long productId,
            @PathVariable Long variantId) {
        variantService.deleteVariant(productId, variantId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/calculate-price")
    public ResponseEntity<PriceCalculationResponse> calculatePriceWithVariants(
            @PathVariable Long productId,
            @RequestBody(required = false) PriceCalculationRequest request) {
        return ResponseEntity.ok(variantService.calculatePrice(productId, request));
    }
}
