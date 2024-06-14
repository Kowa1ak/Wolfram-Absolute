package com.stk.wolframabsolute;

import com.stk.wolframabsolute.calculations.MatrixOperations;
import edu.umd.cs.mtc.MultithreadedTest;
import edu.umd.cs.mtc.TestFramework;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class MatrixOperationsMultithreadedTCTest {
    private MatrixOperations matrixOperations;

    @BeforeEach
    void setUp() {
        matrixOperations = new MatrixOperations();
    }

    public class TransposeMatrixTest extends MultithreadedTest {
        private String result;

        @Override
        public void initialize() {
            String matrixString = "{1, 2, 3}, {4, 5, 6}, {7, 8, 9}";
            String expectedTransposedString = "{1.0, 4.0, 7.0}, {2.0, 5.0, 8.0}, {3.0, 6.0, 9.0}";
            result = MatrixOperations.transposeMatrix(matrixString, 3);
            assertEquals(expectedTransposedString, result);
        }

        public void thread1() throws InterruptedException {
            assertEquals(result, MatrixOperations.transposeMatrix("{1, 2, 3}, {4, 5, 6}, {7, 8, 9}", 3));
        }

        public void thread2() throws InterruptedException {
            assertEquals(result, MatrixOperations.transposeMatrix("{1, 2, 3}, {4, 5, 6}, {7, 8, 9}", 3));
        }

        @Override
        public void finish() {
            // Assertions can be placed here if needed
        }
    }

    @Test
    public void testConcurrentTransposeMatrix() throws Throwable {
        TestFramework.runOnce(new TransposeMatrixTest());
    }

    public class AddMatricesTest extends MultithreadedTest {
        private String result;

        @Override
        public void initialize() {
            String matrix1String = "{1, 2, 3}, {4, 5, 6}, {7, 8, 9}";
            String matrix2String = "{9, 8, 7}, {6, 5, 4}, {3, 2, 1}";
            String expectedSumString = "{10.0, 10.0, 10.0}, {10.0, 10.0, 10.0}, {10.0, 10.0, 10.0}";
            result = MatrixOperations.addMatrices(matrix1String, matrix2String, 3);
            assertEquals(expectedSumString, result);
        }

        public void thread1() throws InterruptedException {
            assertEquals(result, MatrixOperations.addMatrices("{1, 2, 3}, {4, 5, 6}, {7, 8, 9}", "{9, 8, 7}, {6, 5, 4}, {3, 2, 1}", 3));
        }

        public void thread2() throws InterruptedException {
            assertEquals(result, MatrixOperations.addMatrices("{1, 2, 3}, {4, 5, 6}, {7, 8, 9}", "{9, 8, 7}, {6, 5, 4}, {3, 2, 1}", 3));
        }

        @Override
        public void finish() {
            // Assertions can be placed here if needed
        }
    }

    @Test
    public void testConcurrentAddMatrices() throws Throwable {
        TestFramework.runOnce(new AddMatricesTest());
    }

    public class MultiplyMatricesTest extends MultithreadedTest {
        private String result;

        @Override
        public void initialize() {
            String matrix1String = "{1, 2}, {3, 4}";
            String matrix2String = "{2, 0}, {1, 2}";
            String expectedProductString = "{4.0, 4.0}, {10.0, 8.0}";
            result = MatrixOperations.multiplyMatrices(matrix1String, matrix2String, 3);
            assertEquals(expectedProductString, result);
        }

        public void thread1() throws InterruptedException {
            assertEquals(result, MatrixOperations.multiplyMatrices("{1, 2}, {3, 4}", "{2, 0}, {1, 2}", 3));
        }

        public void thread2() throws InterruptedException {
            assertEquals(result, MatrixOperations.multiplyMatrices("{1, 2}, {3, 4}", "{2, 0}, {1, 2}", 3));
        }

        @Override
        public void finish() {
            // Assertions can be placed here if needed
        }
    }

    @Test
    public void testConcurrentMultiplyMatrices() throws Throwable {
        TestFramework.runOnce(new MultiplyMatricesTest());
    }
}