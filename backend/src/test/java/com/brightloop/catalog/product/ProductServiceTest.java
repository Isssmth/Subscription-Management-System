package com.brightloop.catalog.product;

import com.brightloop.catalog.product.dto.ProductRequest;
import com.brightloop.catalog.product.dto.ProductResponse;
import com.brightloop.common.ResourceNotFoundException;
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
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    private Product testProduct;

    @BeforeEach
    void setUp() {
        testProduct = new Product("Odoo ERP Suite", ProductType.SERVICE,
                new BigDecimal("12000.00"), new BigDecimal("5000.00"),
                "Enterprise Resource Planning", true);
        testProduct.setId(1L);
    }

    @Test
    void createProduct_ShouldSaveAndReturnResponse() {
        ProductRequest req = new ProductRequest("Odoo ERP Suite", ProductType.SERVICE,
                new BigDecimal("12000.00"), new BigDecimal("5000.00"), "Enterprise Resource Planning", true);

        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        ProductResponse response = productService.createProduct(req);

        assertThat(response).isNotNull();
        assertThat(response.getName()).isEqualTo("Odoo ERP Suite");
        assertThat(response.getSalesPrice()).isEqualTo(new BigDecimal("12000.00"));
        assertThat(response.getType()).isEqualTo(ProductType.SERVICE);
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    void getProductById_WhenFound_ShouldReturnProduct() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));

        ProductResponse response = productService.getProductById(1L);

        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getName()).isEqualTo("Odoo ERP Suite");
    }

    @Test
    void getProductById_WhenNotFound_ShouldThrowException() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.getProductById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Product not found");
    }

    @Test
    void getAllProducts_ShouldReturnList() {
        when(productRepository.findAll()).thenReturn(List.of(testProduct));

        List<ProductResponse> list = productService.getAllProducts(null, null, null);

        assertThat(list).hasSize(1);
        assertThat(list.get(0).getName()).isEqualTo("Odoo ERP Suite");
    }

    @Test
    void toggleActive_ShouldInvertStatus() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));
        when(productRepository.save(any(Product.class))).thenAnswer(i -> i.getArgument(0));

        ProductResponse response = productService.toggleActive(1L);

        assertThat(response.isActive()).isFalse();
    }
}

