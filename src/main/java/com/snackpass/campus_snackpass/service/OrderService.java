package com.snackpass.service;

import com.snackpass.entity.Order;
import com.snackpass.entity.OrderItem;
import com.snackpass.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public Order createOrder(Order order) {

        double total = 0;

        if (order.getItems() != null) {

            for (OrderItem item : order.getItems()) {

                double price =
                        item.getPrice() != null
                                ? item.getPrice()
                                : 0.0;

                int quantity =
                        item.getQuantity() != null
                                ? item.getQuantity()
                                : 1;

                double subtotal =
                        price * quantity;

                item.setPrice(price);
                item.setQuantity(quantity);
                item.setSubtotal(subtotal);

                total += subtotal;
            }
        }

        order.setTotalPrice(total);

        String token =
                "SNACK-" +
                        UUID.randomUUID()
                                .toString()
                                .substring(0, 8)
                                .toUpperCase();

        order.setOrderToken(token);

        order.setOrderTime(
                LocalDateTime.now()
        );

        return orderRepository.save(order);
    }
}