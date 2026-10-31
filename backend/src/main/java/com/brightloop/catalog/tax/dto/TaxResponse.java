package com.brightloop.catalog.tax.dto;

import com.brightloop.catalog.tax.Tax;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TaxResponse {

    private Long id;
    private String name;
    private BigDecimal rate;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public TaxResponse() {
    }

    public static TaxResponse fromEntity(Tax tax) {
        TaxResponse res = new TaxResponse();
        res.setId(tax.getId());
        res.setName(tax.getName());
        res.setRate(tax.getRate());
        res.setActive(tax.isActive());
        res.setCreatedAt(tax.getCreatedAt());
        res.setUpdatedAt(tax.getUpdatedAt());
        return res;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

