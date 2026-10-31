package com.brightloop.catalog.variant;

import com.brightloop.catalog.product.Product;
import com.brightloop.catalog.product.ProductService;
import com.brightloop.catalog.variant.dto.PriceCalculationRequest;
import com.brightloop.catalog.variant.dto.PriceCalculationResponse;
import com.brightloop.catalog.variant.dto.ProductVariantRequest;
import com.brightloop.catalog.variant.dto.ProductVariantResponse;
import com.brightloop.common.BusinessValidationException;
import com.brightloop.common.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductVariantService {

    private final ProductVariantRepository variantRepository;
    private final ProductService productService;

    public ProductVariantService(ProductVariantRepository variantRepository, ProductService productService) {
        this.variantRepository = variantRepository;
        this.productService = productService;
    }

    @Transactional(readOnly = true)
    public List<ProductVariantResponse> getVariantsByProductId(Long productId) {
        // Validate product exists
        productService.getProductEntity(productId);
        return variantRepository.findByProductId(productId).stream()
                .map(ProductVariantResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProductVariantResponse getVariantById(Long variantId) {
        ProductVariant variant = variantRepository.findById(variantId)
                .orElseThrow(() -> new ResourceNotFoundException("Variant not found with id: " + variantId));
        return ProductVariantResponse.fromEntity(variant);
    }

    public ProductVariantResponse addVariant(Long productId, ProductVariantRequest request) {
        Product product = productService.getProductEntity(productId);

        ProductVariant variant = new ProductVariant();
        variant.setProduct(product);
        variant.setName(request.getName().trim());
        variant.setAdditionalPrice(request.getAdditionalPrice() != null ? request.getAdditionalPrice() : BigDecimal.ZERO);

        ProductVariant saved = variantRepository.save(variant);
        return ProductVariantResponse.fromEntity(saved);
    }

    public ProductVariantResponse updateVariant(Long productId, Long variantId, ProductVariantRequest request) {
        productService.getProductEntity(productId);
        ProductVariant variant = variantRepository.findById(variantId)
                .orElseThrow(() -> new ResourceNotFoundException("Variant not found with id: " + variantId));

        if (!variant.getProduct().getId().equals(productId)) {
            throw new BusinessValidationException("Variant " + variantId + " does not belong to product " + productId);
        }

        variant.setName(request.getName().trim());
        if (request.getAdditionalPrice() != null) {
            variant.setAdditionalPrice(request.getAdditionalPrice());
        }

        ProductVariant saved = variantRepository.save(variant);
        return ProductVariantResponse.fromEntity(saved);
    }

    public void deleteVariant(Long productId, Long variantId) {
        productService.getProductEntity(productId);
        ProductVariant variant = variantRepository.findById(variantId)
                .orElseThrow(() -> new ResourceNotFoundException("Variant not found with id: " + variantId));

        if (!variant.getProduct().getId().equals(productId)) {
            throw new BusinessValidationException("Variant " + variantId + " does not belong to product " + productId);
        }

        variantRepository.delete(variant);
    }

    @Transactional(readOnly = true)
    public PriceCalculationResponse calculatePrice(Long productId, PriceCalculationRequest request) {
        Product product = productService.getProductEntity(productId);
        BigDecimal basePrice = product.getSalesPrice();
        BigDecimal totalAddition = BigDecimal.ZERO;
        List<ProductVariantResponse> appliedVariants = new ArrayList<>();

        if (request != null && request.getVariantIds() != null && !request.getVariantIds().isEmpty()) {
            List<ProductVariant> variants = variantRepository.findByProductIdAndIdIn(productId, request.getVariantIds());
            for (ProductVariant v : variants) {
                totalAddition = totalAddition.add(v.getAdditionalPrice());
                appliedVariants.add(ProductVariantResponse.fromEntity(v));
            }
        }

        BigDecimal finalPrice = basePrice.add(totalAddition);

        return new PriceCalculationResponse(
                product.getId(),
                product.getName(),
                basePrice,
                totalAddition,
                finalPrice,
                appliedVariants
        );
    }
}
