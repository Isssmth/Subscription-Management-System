package com.brightloop.catalog.product;

import com.brightloop.auth.config.SecurityConfig;
import com.brightloop.auth.security.JwtAuthenticationFilter;
import com.brightloop.catalog.product.dto.ProductRequest;
import com.brightloop.catalog.product.dto.ProductResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityFilterAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(
        controllers = ProductController.class,
        excludeAutoConfiguration = {
                SecurityAutoConfiguration.class,
                SecurityFilterAutoConfiguration.class
        },
        excludeFilters = @ComponentScan.Filter(
                type = FilterType.ASSIGNABLE_TYPE,
                classes = {SecurityConfig.class, JwtAuthenticationFilter.class}
        )
)
@AutoConfigureMockMvc(addFilters = false)
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private ProductService productService;

    @Test
    void getAllProducts_ShouldReturnOk() throws Exception {
        Product product = new Product("Brightloop SaaS", ProductType.SERVICE,
                new BigDecimal("499.00"), new BigDecimal("100.00"), "Cloud", true);
        product.setId(1L);

        when(productService.getAllProducts(null, null, null))
                .thenReturn(List.of(ProductResponse.fromEntity(product)));

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Brightloop SaaS"))
                .andExpect(jsonPath("$[0].salesPrice").value(499.00));
    }

    @Test
    void createProduct_WithValidData_ShouldReturnCreated() throws Exception {
        Product product = new Product("Brightloop SaaS", ProductType.SERVICE,
                new BigDecimal("499.00"), new BigDecimal("100.00"), "Cloud", true);
        product.setId(1L);

        when(productService.createProduct(any(ProductRequest.class)))
                .thenReturn(ProductResponse.fromEntity(product));

        ProductRequest request = new ProductRequest("Brightloop SaaS", ProductType.SERVICE,
                new BigDecimal("499.00"), new BigDecimal("100.00"), "Cloud", true);

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("Brightloop SaaS"));
    }

    @Test
    void createProduct_WithNegativePrice_ShouldReturnBadRequest() throws Exception {
        ProductRequest invalidRequest = new ProductRequest("Invalid Product", ProductType.GOODS,
                new BigDecimal("-50.00"), new BigDecimal("10.00"), "Invalid", true);

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.salesPrice").exists());
    }

    @Test
    void createProduct_WithBlankName_ShouldReturnBadRequest() throws Exception {
        ProductRequest invalidRequest = new ProductRequest("", ProductType.GOODS,
                new BigDecimal("50.00"), new BigDecimal("10.00"), "Invalid", true);

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.name").exists());
    }
}
