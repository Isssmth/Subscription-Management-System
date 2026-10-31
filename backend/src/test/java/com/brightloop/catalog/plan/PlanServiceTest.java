package com.brightloop.catalog.plan;

import com.brightloop.catalog.plan.dto.PlanRequest;
import com.brightloop.catalog.plan.dto.PlanResponse;
import com.brightloop.catalog.product.Product;
import com.brightloop.catalog.product.ProductService;
import com.brightloop.catalog.product.ProductType;
import com.brightloop.common.BusinessValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PlanServiceTest {

    @Mock
    private PlanRepository planRepository;

    @Mock
    private ProductService productService;

    @InjectMocks
    private PlanService planService;

    private Product product;
    private Plan plan;

    @BeforeEach
    void setUp() {
        product = new Product("Enterprise Plan", ProductType.SERVICE,
                new BigDecimal("999.00"), new BigDecimal("300.00"), "Software subscription", true);
        product.setId(5L);

        plan = new Plan(product, "Annual Enterprise", new BigDecimal("9999.00"),
                BillingFrequency.YEARLY, 1, LocalDate.of(2026, 1, 1), LocalDate.of(2026, 12, 31),
                false, true, true, true, true);
        plan.setId(50L);
    }

    @Test
    void createPlan_WithValidDates_ShouldSucceed() {
        when(productService.getProductEntity(5L)).thenReturn(product);
        when(planRepository.save(any(Plan.class))).thenReturn(plan);

        PlanRequest request = new PlanRequest();
        request.setProductId(5L);
        request.setName("Annual Enterprise");
        request.setPrice(new BigDecimal("9999.00"));
        request.setBillingFrequency(BillingFrequency.YEARLY);
        request.setMinimumQuantity(1);
        request.setAvailabilityStartDate(LocalDate.of(2026, 1, 1));
        request.setAvailabilityEndDate(LocalDate.of(2026, 12, 31));
        request.setAutoClose(false);
        request.setEarlyClosure(true);
        request.setPause(true);
        request.setRenewal(true);
        request.setActive(true);

        PlanResponse response = planService.createPlan(request);

        assertThat(response.getId()).isEqualTo(50L);
        assertThat(response.getName()).isEqualTo("Annual Enterprise");
        assertThat(response.getBillingFrequency()).isEqualTo(BillingFrequency.YEARLY);
        assertThat(response.isPause()).isTrue();
        assertThat(response.isEarlyClosure()).isTrue();
    }

    @Test
    void createPlan_WhenEndDateBeforeStartDate_ShouldThrowValidationException() {
        PlanRequest request = new PlanRequest();
        request.setProductId(5L);
        request.setName("Invalid Dates Plan");
        request.setPrice(new BigDecimal("500.00"));
        request.setBillingFrequency(BillingFrequency.MONTHLY);
        request.setMinimumQuantity(1);
        request.setAvailabilityStartDate(LocalDate.of(2026, 6, 1));
        request.setAvailabilityEndDate(LocalDate.of(2026, 5, 1)); // before start date!

        assertThatThrownBy(() -> planService.createPlan(request))
                .isInstanceOf(BusinessValidationException.class)
                .hasMessageContaining("Availability end date cannot be earlier than start date");

        verify(planRepository, never()).save(any());
    }
}

