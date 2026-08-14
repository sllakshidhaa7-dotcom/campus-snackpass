package com.snackpass.repository;

import com.snackpass.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository
        extends JpaRepository<Order, Long> {

    Order findByOrderToken(String orderToken);
}