package com.brightloop.catalog.tax.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class TaxRequest {

    @NotBlank(message = "Tax name is required")
    private String name;

    @NotNull(message = "Tax rate is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Tax rate must be non-negative")
    @DecimalMax(value = "100.0", inclusive = true, message = "Tax rate cannot exceed 100%")
    private BigDecimal rate;

    private Boolean active = true;

    public TaxRequest() {
    }

    public TaxRequest(String name, BigDecimal rate, Boolean active) {
        this.name = name;
        this.rate = rate;
        this.active = active != null ? active : true;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getRate() {
        return rate;
    }

    public void setRate(BigDecimal rate) {
        this.rate = rate;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}

