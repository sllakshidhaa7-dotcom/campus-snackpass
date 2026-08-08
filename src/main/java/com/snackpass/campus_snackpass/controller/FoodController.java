package com.snackpass.controller;

import com.snackpass.entity.FoodItem;
import com.snackpass.repository.FoodItemRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/foods")
@CrossOrigin
public class FoodController {

    private final FoodItemRepository foodRepository;

    public FoodController(FoodItemRepository foodRepository) {
        this.foodRepository = foodRepository;
    }

    @GetMapping
    public List<FoodItem> getAllFoods() {
        return foodRepository.findAll();
    }
}