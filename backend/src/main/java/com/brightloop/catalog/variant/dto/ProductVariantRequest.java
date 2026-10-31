package com.brightloop.catalog.variant.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class ProductVariantRequest {

    @NotBlank(message = "Variant name is required")
    private String name;

    @NotNull(message = "Additional price is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Additional price must be non-negative")
    private BigDecimal additionalPrice = BigDecimal.ZERO;

    public ProductVariantRequest() {
    }

    public ProductVariantRequest(String name, BigDecimal additionalPrice) {
        this.name = name;
        this.additionalPrice = additionalPrice != null ? additionalPrice : BigDecimal.ZERO;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getAdditionalPrice() {
        return additionalPrice;
    }

    public void setAdditionalPrice(BigDecimal additionalPrice) {
        this.additionalPrice = additionalPrice;
    }
}

