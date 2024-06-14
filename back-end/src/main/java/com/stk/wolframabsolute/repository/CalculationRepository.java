package com.stk.wolframabsolute.repository;

import com.stk.wolframabsolute.entity.Calculation;
import com.stk.wolframabsolute.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CalculationRepository extends JpaRepository<Calculation, Long> {
    List<Calculation> findByEmail(String email);
}
