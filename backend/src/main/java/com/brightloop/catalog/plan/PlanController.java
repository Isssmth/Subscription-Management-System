package com.brightloop.catalog.plan;

import com.brightloop.catalog.plan.dto.PlanRequest;
import com.brightloop.catalog.plan.dto.PlanResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plans")
@CrossOrigin(origins = "*")
public class PlanController {

    private final PlanService planService;

    public PlanController(PlanService planService) {
        this.planService = planService;
    }

    @GetMapping
    public ResponseEntity<List<PlanResponse>> getPlans(
            @RequestParam(required = false) Long productId,
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) BillingFrequency frequency,
            @RequestParam(required = false) String query) {
        return ResponseEntity.ok(planService.getPlans(productId, active, frequency, query));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlanResponse> getPlanById(@PathVariable Long id) {
        return ResponseEntity.ok(planService.getPlanById(id));
    }

    @PostMapping
    public ResponseEntity<PlanResponse> createPlan(@Valid @RequestBody PlanRequest request) {
        PlanResponse created = planService.createPlan(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlanResponse> updatePlan(
            @PathVariable Long id,
            @Valid @RequestBody PlanRequest request) {
        return ResponseEntity.ok(planService.updatePlan(id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<PlanResponse> togglePlanStatus(@PathVariable Long id) {
        return ResponseEntity.ok(planService.toggleActive(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlan(@PathVariable Long id) {
        planService.deletePlan(id);
        return ResponseEntity.noContent().build();
    }
}

