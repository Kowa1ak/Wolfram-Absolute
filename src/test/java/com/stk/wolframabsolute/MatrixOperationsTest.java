package com.stk.wolframabsolute;

import com.stk.wolframabsolute.calculations.MatrixOperations;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class MatrixOperationsTest {
    private MatrixOperations matrixOperations;

    @BeforeEach
    void setUp() {
        matrixOperations = new MatrixOperations();
    }

    @Test
    void testParseMatrix() {
        String[] rowStrings = {"{1, 2, 3}", "{4, 5, 6}", "{7, 8, 9}"};
        double[][] expectedMatrix = {
                {1.0, 2.0, 3.0},
                {4.0, 5.0, 6.0},
                {7.0, 8.0, 9.0}
        };
        double[][] result = MatrixOperations.parseMatrix(rowStrings, 3, 3);
        assertArrayEquals(expectedMatrix, result);
    }

    @Test
    void testMatrixToString() {
        double[][] matrix = {
                {1.0, 2.0, 3.0},
                {4.0, 5.0, 6.0},
                {7.0, 8.0, 9.0}
        };
        String expectedString = "{1.0, 2.0, 3.0}, {4.0, 5.0, 6.0}, {7.0, 8.0, 9.0}";
        String result = MatrixOperations.matrixToString(matrix);
        assertEquals(expectedString, result);
    }

    @Test
    void testTransposeMatrix() {
        String matrixString = "{1, 2, 3}, {4, 5, 6}, {7, 8, 9}";
        String expectedTransposedString = "{1.0, 4.0, 7.0}, {2.0, 5.0, 8.0}, {3.0, 6.0, 9.0}";
        String result = MatrixOperations.transposeMatrix(matrixString, 3);
        assertEquals(expectedTransposedString, result);
    }

    @Test
    void testAddMatrices() {
        String matrix1String = "{1, 2, 3}, {4, 5, 6}, {7, 8, 9}";
        String matrix2String = "{9, 8, 7}, {6, 5, 4}, {3, 2, 1}";
        String expectedSumString = "{10.0, 10.0, 10.0}, {10.0, 10.0, 10.0}, {10.0, 10.0, 10.0}";
        String result = MatrixOperations.addMatrices(matrix1String, matrix2String, 3);
        assertEquals(expectedSumString, result);
    }

    @Test
    void testMultiplyMatrices() {
        String matrix1String = "{1, 2}, {3, 4}";
        String matrix2String = "{2, 0}, {1, 2}";
        String expectedProductString = "{4.0, 4.0}, {10.0, 8.0}";
        String result = MatrixOperations.multiplyMatrices(matrix1String, matrix2String, 3);
        assertEquals(expectedProductString, result);
    }

    @Test
    void testMultiplyMatrixByScalar() {
        String matrixString = "{1, 2}, {3, 4}";
        double scalar = 2.0;
        String expectedProductString = "{2.0, 4.0}, {6.0, 8.0}";
        String result = MatrixOperations.multiplyMatrixByScalar(matrixString, scalar);
        assertEquals(expectedProductString, result);
    }

    @Test
    void testFindInverseMatrix() {
        String matrixString = "{4, 7}, {2, 6}";
        String expectedInverseString = "{0.6, -0.2}, {-0.7, 0.4}";
        String result = MatrixOperations.findInverseMatrix(matrixString, 2);
        assertEquals(expectedInverseString, result);
    }

    @Test
    void testFindInverseMatrixNotInvertible() {
        String matrixString = "{1, 2}, {2, 4}";
        String expectedError = "Error: Matrix is not invertible";
        String result = MatrixOperations.findInverseMatrix(matrixString, 2);
        assertEquals(expectedError, result);
    }
}