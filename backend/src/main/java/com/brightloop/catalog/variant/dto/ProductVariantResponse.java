package com.brightloop.catalog.variant.dto;

import com.brightloop.catalog.variant.ProductVariant;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ProductVariantResponse {

    private Long id;
    private Long productId;
    private String productName;
    private String name;
    private BigDecimal additionalPrice;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ProductVariantResponse() {
    }

    public static ProductVariantResponse fromEntity(ProductVariant variant) {
        ProductVariantResponse res = new ProductVariantResponse();
        res.setId(variant.getId());
        if (variant.getProduct() != null) {
            res.setProductId(variant.getProduct().getId());
            res.setProductName(variant.getProduct().getName());
        }
        res.setName(variant.getName());
        res.setAdditionalPrice(variant.getAdditionalPrice());
        res.setCreatedAt(variant.getCreatedAt());
        res.setUpdatedAt(variant.getUpdatedAt());
        return res;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
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

