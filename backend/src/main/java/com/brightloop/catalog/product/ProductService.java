package com.brightloop.catalog.product;

import com.brightloop.catalog.product.dto.ProductRequest;
import com.brightloop.catalog.product.dto.ProductResponse;
import com.brightloop.common.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts(String query, Boolean active, ProductType type) {
        List<Product> products;
        if (query != null || active != null || type != null) {
            String trimmedQuery = (query != null && !query.trim().isEmpty()) ? query.trim() : null;
            products = productRepository.searchProducts(trimmedQuery, active, type);
        } else {
            products = productRepository.findAll();
        }

        return products.stream()
                .map(p -> ProductResponse.fromEntity(p, false))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        Product product = getProductEntity(id);
        return ProductResponse.fromEntity(product, true);
    }

    @Transactional(readOnly = true)
    public Product getProductEntity(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    public ProductResponse createProduct(ProductRequest request) {
        Product product = new Product();
        product.setName(request.getName().trim());
        product.setType(request.getType());
        product.setSalesPrice(request.getSalesPrice());
        product.setCostPrice(request.getCostPrice());
        product.setNotes(request.getNotes() != null ? request.getNotes().trim() : null);
        product.setActive(request.getActive() != null ? request.getActive() : true);

        Product saved = productRepository.save(product);
        return ProductResponse.fromEntity(saved, false);
    }

    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = getProductEntity(id);
        product.setName(request.getName().trim());
        product.setType(request.getType());
        product.setSalesPrice(request.getSalesPrice());
        product.setCostPrice(request.getCostPrice());
        product.setNotes(request.getNotes() != null ? request.getNotes().trim() : null);
        if (request.getActive() != null) {
            product.setActive(request.getActive());
        }

        Product saved = productRepository.save(product);
        return ProductResponse.fromEntity(saved, true);
    }

    public ProductResponse toggleActive(Long id) {
        Product product = getProductEntity(id);
        product.setActive(!product.isActive());
        Product saved = productRepository.save(product);
        return ProductResponse.fromEntity(saved, false);
    }

    public void deleteProduct(Long id) {
        Product product = getProductEntity(id);
        productRepository.delete(product);
    }
}

