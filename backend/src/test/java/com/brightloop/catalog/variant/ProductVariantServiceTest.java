package com.brightloop.catalog.variant;

import com.brightloop.catalog.product.Product;
import com.brightloop.catalog.product.ProductService;
import com.brightloop.catalog.product.ProductType;
import com.brightloop.catalog.variant.dto.PriceCalculationRequest;
import com.brightloop.catalog.variant.dto.PriceCalculationResponse;
import com.brightloop.catalog.variant.dto.ProductVariantRequest;
import com.brightloop.catalog.variant.dto.ProductVariantResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductVariantServiceTest {

    @Mock
    private ProductVariantRepository variantRepository;

    @Mock
    private ProductService productService;

    @InjectMocks
    private ProductVariantService variantService;

    private Product product;
    private ProductVariant odooVariant;
    private ProductVariant cloudStorageVariant;

    @BeforeEach
    void setUp() {
        product = new Product("Brightloop Core Subscription", ProductType.SERVICE,
                new BigDecimal("5000.00"), new BigDecimal("2000.00"), "Core service", true);
        product.setId(10L);

        odooVariant = new ProductVariant(product, "Odoo Brand Integration", new BigDecimal("560.00"));
        odooVariant.setId(101L);

        cloudStorageVariant = new ProductVariant(product, "Dedicated Cloud Storage", new BigDecimal("440.00"));
        cloudStorageVariant.setId(102L);
    }

    @Test
    void addVariant_ShouldAssociateWithProductAndReturnResponse() {
        when(productService.getProductEntity(10L)).thenReturn(product);
        when(variantRepository.save(any(ProductVariant.class))).thenReturn(odooVariant);

        ProductVariantRequest request = new ProductVariantRequest("Odoo Brand Integration", new BigDecimal("560.00"));
        ProductVariantResponse res = variantService.addVariant(10L, request);

        assertThat(res.getId()).isEqualTo(101L);
        assertThat(res.getName()).isEqualTo("Odoo Brand Integration");
        assertThat(res.getAdditionalPrice()).isEqualTo(new BigDecimal("560.00"));
    }

    @Test
    void calculatePrice_WithSingleVariant_ShouldAddPriceCorrectly() {
        // Example from spec: Odoo brand variant adds ₹560 to base sales price 5000 -> 5560
        when(productService.getProductEntity(10L)).thenReturn(product);
        when(variantRepository.findByProductIdAndIdIn(10L, List.of(101L)))
                .thenReturn(List.of(odooVariant));

        PriceCalculationRequest req = new PriceCalculationRequest(List.of(101L));
        PriceCalculationResponse response = variantService.calculatePrice(10L, req);

        assertThat(response.getBaseSalesPrice()).isEqualByComparingTo(new BigDecimal("5000.00"));
        assertThat(response.getTotalVariantAddition()).isEqualByComparingTo(new BigDecimal("560.00"));
        assertThat(response.getFinalPrice()).isEqualByComparingTo(new BigDecimal("5560.00"));
        assertThat(response.getAppliedVariants()).hasSize(1);
        assertThat(response.getAppliedVariants().get(0).getName()).isEqualTo("Odoo Brand Integration");
    }

    @Test
    void calculatePrice_WithMultipleVariants_ShouldSumAdditions() {
        when(productService.getProductEntity(10L)).thenReturn(product);
        when(variantRepository.findByProductIdAndIdIn(10L, List.of(101L, 102L)))
                .thenReturn(List.of(odooVariant, cloudStorageVariant));

        PriceCalculationRequest req = new PriceCalculationRequest(List.of(101L, 102L));
        PriceCalculationResponse response = variantService.calculatePrice(10L, req);

        // 5000 + 560 + 440 = 6000
        assertThat(response.getBaseSalesPrice()).isEqualByComparingTo(new BigDecimal("5000.00"));
        assertThat(response.getTotalVariantAddition()).isEqualByComparingTo(new BigDecimal("1000.00"));
        assertThat(response.getFinalPrice()).isEqualByComparingTo(new BigDecimal("6000.00"));
        assertThat(response.getAppliedVariants()).hasSize(2);
    }

    @Test
    void calculatePrice_WithoutVariants_ShouldReturnBaseSalesPrice() {
        when(productService.getProductEntity(10L)).thenReturn(product);

        PriceCalculationRequest req = new PriceCalculationRequest(List.of());
        PriceCalculationResponse response = variantService.calculatePrice(10L, req);

        assertThat(response.getBaseSalesPrice()).isEqualByComparingTo(new BigDecimal("5000.00"));
        assertThat(response.getTotalVariantAddition()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(response.getFinalPrice()).isEqualByComparingTo(new BigDecimal("5000.00"));
        assertThat(response.getAppliedVariants()).isEmpty();
    }
}

