package com.brightloop.catalog.product.dto;

import com.brightloop.catalog.product.Product;
import com.brightloop.catalog.product.ProductType;
import com.brightloop.catalog.variant.dto.ProductVariantResponse;
import com.brightloop.catalog.plan.dto.PlanResponse;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class ProductResponse {

    private Long id;
    private String name;
    private ProductType type;
    private BigDecimal salesPrice;
    private BigDecimal costPrice;
    private String notes;
    private boolean active;
    private int variantCount;
    private int planCount;
    private List<ProductVariantResponse> variants;
    private List<PlanResponse> plans;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ProductResponse() {
    }

    public static ProductResponse fromEntity(Product product) {
        return fromEntity(product, false);
    }

    public static ProductResponse fromEntity(Product product, boolean includeDetails) {
        ProductResponse res = new ProductResponse();
        res.setId(product.getId());
        res.setName(product.getName());
        res.setType(product.getType());
        res.setSalesPrice(product.getSalesPrice());
        res.setCostPrice(product.getCostPrice());
        res.setNotes(product.getNotes());
        res.setActive(product.isActive());
        res.setCreatedAt(product.getCreatedAt());
        res.setUpdatedAt(product.getUpdatedAt());

        if (product.getVariants() != null) {
            res.setVariantCount(product.getVariants().size());
            if (includeDetails) {
                res.setVariants(product.getVariants().stream()
                        .map(ProductVariantResponse::fromEntity)
                        .collect(Collectors.toList()));
            }
        } else {
            res.setVariantCount(0);
            res.setVariants(Collections.emptyList());
        }

        if (product.getPlans() != null) {
            res.setPlanCount(product.getPlans().size());
            if (includeDetails) {
                res.setPlans(product.getPlans().stream()
                        .map(PlanResponse::fromEntity)
                        .collect(Collectors.toList()));
            }
        } else {
            res.setPlanCount(0);
            res.setPlans(Collections.emptyList());
        }

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

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public int getVariantCount() {
        return variantCount;
    }

    public void setVariantCount(int variantCount) {
        this.variantCount = variantCount;
    }

    public int getPlanCount() {
        return planCount;
    }

    public void setPlanCount(int planCount) {
        this.planCount = planCount;
    }

    public List<ProductVariantResponse> getVariants() {
        return variants;
    }

    public void setVariants(List<ProductVariantResponse> variants) {
        this.variants = variants;
    }

    public List<PlanResponse> getPlans() {
        return plans;
    }

    public void setPlans(List<PlanResponse> plans) {
        this.plans = plans;
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

