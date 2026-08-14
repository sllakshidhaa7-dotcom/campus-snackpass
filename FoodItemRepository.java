package com.snackpass.repository;

import com.snackpass.entity.FoodItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FoodItemRepository
        extends JpaRepository<FoodItem, Long> {
}