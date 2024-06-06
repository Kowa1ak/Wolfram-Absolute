package com.stk.wolframabsolute;

import com.google.code.tempusfugit.concurrency.annotations.Concurrent;
import com.google.code.tempusfugit.concurrency.annotations.Repeating;
import com.google.code.tempusfugit.concurrency.annotations.Intermittent;
import com.stk.wolframabsolute.calculations.MatrixOperations;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class MatrixOperationsConcurrencyTest {
    private MatrixOperations matrixOperations;

    @BeforeEach
    void setUp() {
        matrixOperations = new MatrixOperations();
    }

    @Test
    @Concurrent(count = 10)
    @Repeating(repetition = 100)
    void testConcurrentTransposeMatrix() {
        String matrixString = "{1, 2, 3}, {4, 5, 6}, {7, 8, 9}";
        String expectedTransposedString = "{1.0, 4.0, 7.0}, {2.0, 5.0, 8.0}, {3.0, 6.0, 9.0}";
        String result = MatrixOperations.transposeMatrix(matrixString, 3);
        assertEquals(expectedTransposedString, result);
    }

    @Test
    @Concurrent(count = 10)
    @Repeating(repetition = 100)
    void testConcurrentAddMatrices() {
        String matrix1String = "{1, 2, 3}, {4, 5, 6}, {7, 8, 9}";
        String matrix2String = "{9, 8, 7}, {6, 5, 4}, {3, 2, 1}";
        String expectedSumString = "{10.0, 10.0, 10.0}, {10.0, 10.0, 10.0}, {10.0, 10.0, 10.0}";
        String result = MatrixOperations.addMatrices(matrix1String, matrix2String, 3);
        assertEquals(expectedSumString, result);
    }

    @Test
    @Concurrent(count = 10)
    @Repeating(repetition = 100)
    void testConcurrentMultiplyMatrices() {
        String matrix1String = "{1, 2}, {3, 4}";
        String matrix2String = "{2, 0}, {1, 2}";
        String expectedProductString = "{4.0, 4.0}, {10.0, 8.0}";
        String result = MatrixOperations.multiplyMatrices(matrix1String, matrix2String, 3);
        assertEquals(expectedProductString, result);
    }
}