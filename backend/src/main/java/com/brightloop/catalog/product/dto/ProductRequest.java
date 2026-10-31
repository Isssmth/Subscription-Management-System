package com.brightloop.catalog.product.dto;

import com.brightloop.catalog.product.ProductType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class ProductRequest {

    @NotBlank(message = "Product name is required")
    private String name;

    @NotNull(message = "Product type is required")
    private ProductType type;

    @NotNull(message = "Sales price is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Sales price must be non-negative")
    private BigDecimal salesPrice;

    @NotNull(message = "Cost price is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Cost price must be non-negative")
    private BigDecimal costPrice;

    private String notes;

    private Boolean active = true;

    public ProductRequest() {
    }

    public ProductRequest(String name, ProductType type, BigDecimal salesPrice, BigDecimal costPrice, String notes, Boolean active) {
        this.name = name;
        this.type = type;
        this.salesPrice = salesPrice;
        this.costPrice = costPrice;
        this.notes = notes;
        this.active = active != null ? active : true;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ProductType getType() {
        return type;
    }

    public void setType(ProductType type) {
        this.type = type;
    }

    public BigDecimal getSalesPrice() {
        return salesPrice;
    }

    public void setSalesPrice(BigDecimal salesPrice) {
        this.salesPrice = salesPrice;
    }

    public BigDecimal getCostPrice() {
        return costPrice;
    }

    public void setCostPrice(BigDecimal costPrice) {
        this.costPrice = costPrice;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}

