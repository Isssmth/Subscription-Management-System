package com.brightloop.catalog.plan;

import com.brightloop.catalog.plan.dto.PlanRequest;
import com.brightloop.catalog.plan.dto.PlanResponse;
import com.brightloop.catalog.product.Product;
import com.brightloop.catalog.product.ProductService;
import com.brightloop.common.BusinessValidationException;
import com.brightloop.common.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PlanService {

    private final PlanRepository planRepository;
    private final ProductService productService;

    public PlanService(PlanRepository planRepository, ProductService productService) {
        this.planRepository = planRepository;
        this.productService = productService;
    }

    @Transactional(readOnly = true)
    public List<PlanResponse> getPlans(Long productId, Boolean active, BillingFrequency frequency, String query) {
        List<Plan> plans;
        if (productId != null || active != null || frequency != null || (query != null && !query.trim().isEmpty())) {
            String trimmedQuery = (query != null && !query.trim().isEmpty()) ? query.trim() : null;
            plans = planRepository.searchPlans(productId, active, frequency, trimmedQuery);
        } else {
            plans = planRepository.findAll();
        }

        return plans.stream()
                .map(PlanResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PlanResponse getPlanById(Long id) {
        Plan plan = planRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plan not found with id: " + id));
        return PlanResponse.fromEntity(plan);
    }

    public PlanResponse createPlan(PlanRequest request) {
        validatePlanDates(request);
        Product product = productService.getProductEntity(request.getProductId());

        Plan plan = new Plan();
        plan.setProduct(product);
        plan.setName(request.getName().trim());
        plan.setPrice(request.getPrice());
        plan.setBillingFrequency(request.getBillingFrequency());
        plan.setMinimumQuantity(request.getMinimumQuantity() != null ? request.getMinimumQuantity() : 1);
        plan.setAvailabilityStartDate(request.getAvailabilityStartDate());
        plan.setAvailabilityEndDate(request.getAvailabilityEndDate());
        plan.setAutoClose(request.getAutoClose() != null ? request.getAutoClose() : false);
        plan.setEarlyClosure(request.getEarlyClosure() != null ? request.getEarlyClosure() : false);
        plan.setPause(request.getPause() != null ? request.getPause() : false);
        plan.setRenewal(request.getRenewal() != null ? request.getRenewal() : true);
        plan.setActive(request.getActive() != null ? request.getActive() : true);

        Plan saved = planRepository.save(plan);
        return PlanResponse.fromEntity(saved);
    }

    public PlanResponse updatePlan(Long id, PlanRequest request) {
        validatePlanDates(request);
        Plan plan = planRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plan not found with id: " + id));

        if (!plan.getProduct().getId().equals(request.getProductId())) {
            Product newProduct = productService.getProductEntity(request.getProductId());
            plan.setProduct(newProduct);
        }

        plan.setName(request.getName().trim());
        plan.setPrice(request.getPrice());
        plan.setBillingFrequency(request.getBillingFrequency());
        plan.setMinimumQuantity(request.getMinimumQuantity() != null ? request.getMinimumQuantity() : 1);
        plan.setAvailabilityStartDate(request.getAvailabilityStartDate());
        plan.setAvailabilityEndDate(request.getAvailabilityEndDate());
        if (request.getAutoClose() != null) plan.setAutoClose(request.getAutoClose());
        if (request.getEarlyClosure() != null) plan.setEarlyClosure(request.getEarlyClosure());
        if (request.getPause() != null) plan.setPause(request.getPause());
        if (request.getRenewal() != null) plan.setRenewal(request.getRenewal());
        if (request.getActive() != null) plan.setActive(request.getActive());

        Plan saved = planRepository.save(plan);
        return PlanResponse.fromEntity(saved);
    }

    public PlanResponse toggleActive(Long id) {
        Plan plan = planRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plan not found with id: " + id));
        plan.setActive(!plan.isActive());
        Plan saved = planRepository.save(plan);
        return PlanResponse.fromEntity(saved);
    }

    public void deletePlan(Long id) {
        Plan plan = planRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plan not found with id: " + id));
        planRepository.delete(plan);
    }

    private void validatePlanDates(PlanRequest request) {
        if (request.getAvailabilityStartDate() != null && request.getAvailabilityEndDate() != null) {
            if (request.getAvailabilityEndDate().isBefore(request.getAvailabilityStartDate())) {
                throw new BusinessValidationException("Availability end date cannot be earlier than start date.");
            }
        }
    }
}

