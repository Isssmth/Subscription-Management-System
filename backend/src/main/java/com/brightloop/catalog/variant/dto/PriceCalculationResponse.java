package com.brightloop.catalog.variant.dto;

import java.math.BigDecimal;
import java.util.List;

public class PriceCalculationResponse {

    private Long productId;
    private String productName;
    private BigDecimal baseSalesPrice;
    private BigDecimal totalVariantAddition;
    private BigDecimal finalPrice;
    private List<ProductVariantResponse> appliedVariants;

    public PriceCalculationResponse() {
    }

    public PriceCalculationResponse(Long productId, String productName, BigDecimal baseSalesPrice,
                                    BigDecimal totalVariantAddition, BigDecimal finalPrice,
                                    List<ProductVariantResponse> appliedVariants) {
        this.productId = productId;
        this.productName = productName;
        this.baseSalesPrice = baseSalesPrice;
        this.totalVariantAddition = totalVariantAddition;
        this.finalPrice = finalPrice;
        this.appliedVariants = appliedVariants;
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

    public BigDecimal getBaseSalesPrice() {
        return baseSalesPrice;
    }

    public void setBaseSalesPrice(BigDecimal baseSalesPrice) {
        this.baseSalesPrice = baseSalesPrice;
    }

    public BigDecimal getTotalVariantAddition() {
        return totalVariantAddition;
    }

    public void setTotalVariantAddition(BigDecimal totalVariantAddition) {
        this.totalVariantAddition = totalVariantAddition;
    }

    public BigDecimal getFinalPrice() {
        return finalPrice;
    }

    public void setFinalPrice(BigDecimal finalPrice) {
        this.finalPrice = finalPrice;
    }

    public List<ProductVariantResponse> getAppliedVariants() {
        return appliedVariants;
    }

    public void setAppliedVariants(List<ProductVariantResponse> appliedVariants) {
        this.appliedVariants = appliedVariants;
    }
}

