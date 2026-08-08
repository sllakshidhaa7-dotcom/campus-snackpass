package com.snackpass.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "food_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FoodItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String category;

    private double price;

    private String description;

    private String image;
}