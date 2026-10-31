package com.brightloop.catalog.plan;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlanRepository extends JpaRepository<Plan, Long> {

    List<Plan> findByProductId(Long productId);

    List<Plan> findByActive(boolean active);

    List<Plan> findByProductIdAndActive(Long productId, boolean active);

    @Query("SELECT p FROM Plan p WHERE " +
           "(:productId IS NULL OR p.product.id = :productId) AND " +
           "(:active IS NULL OR p.active = :active) AND " +
           "(:frequency IS NULL OR p.billingFrequency = :frequency) AND " +
           "(:query IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Plan> searchPlans(@Param("productId") Long productId,
                           @Param("active") Boolean active,
                           @Param("frequency") BillingFrequency frequency,
                           @Param("query") String query);
}

