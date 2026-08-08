package com.snackpass.controller;

import com.snackpass.entity.Order;
import com.snackpass.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(
            @RequestBody Order order) {

        System.out.println("========== ORDER RECEIVED ==========");
        System.out.println("Items: " + order.getItems());

        if (order.getItems() != null) {

            order.getItems().forEach(item -> {

                System.out.println(
                        "Food: " + item.getFoodName()
                                + " | Price: " + item.getPrice()
                                + " | Quantity: " + item.getQuantity()
                );

            });
        }

        System.out.println("====================================");

        Order savedOrder =
                orderService.createOrder(order);

        return ResponseEntity.ok(savedOrder);
    }
}