package com.brightloop.catalog.product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByActive(boolean active);

    @Query("SELECT p FROM Product p WHERE " +
           "(:query IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.notes) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:active IS NULL OR p.active = :active) AND " +
           "(:type IS NULL OR p.type = :type)")
    List<Product> searchProducts(@Param("query") String query,
                                @Param("active") Boolean active,
                                @Param("type") ProductType type);
}

