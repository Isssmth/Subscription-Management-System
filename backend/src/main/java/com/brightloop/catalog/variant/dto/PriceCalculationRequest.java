package com.brightloop.catalog.variant.dto;

import java.util.List;

public class PriceCalculationRequest {

    private List<Long> variantIds;

    public PriceCalculationRequest() {
    }

    public PriceCalculationRequest(List<Long> variantIds) {
        this.variantIds = variantIds;
    }

    public List<Long> getVariantIds() {
        return variantIds;
    }

    public void setVariantIds(List<Long> variantIds) {
        this.variantIds = variantIds;
    }
}

