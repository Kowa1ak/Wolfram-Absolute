package com.stk.wolframabsolute.calculations;

import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
public class MatrixOperations {

    public static int[][] parseMatrix(String[] rowStrings, int numRows, int numCols) {
        int[][] matrix = new int[numRows][numCols];

        for (int i = 0; i < numRows; i++) {
            String[] elements = rowStrings[i].replaceAll("[{}]", "").split(",\\s*");
            for (int j = 0; j < numCols; j++) {
                matrix[i][j] = Integer.parseInt(elements[j]);
            }
        }

        return matrix;
    }

    public static String matrixToString(int[][] matrix) {
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < matrix.length; i++) {
            sb.append("{");
            for (int j = 0; j < matrix[i].length; j++) {
                sb.append(matrix[i][j]);
                if (j < matrix[i].length - 1) {
                    sb.append(", ");
                }
            }
            sb.append("}");
            if (i < matrix.length - 1) {
                sb.append(", ");
            }
        }

        return sb.toString();
    }

    public static String transposeMatrix(String matrixString, int numThreads) {
        String[] rowStrings = matrixString.split("\\},\\s*\\{");
        int numRows = rowStrings.length;
        int numCols = rowStrings[0].split(",").length;

        int[][] matrix = parseMatrix(rowStrings, numRows, numCols);

        int[][] transposedMatrix = new int[numCols][numRows];

        ExecutorService executor = Executors.newFixedThreadPool(numThreads);

        for (int i = 0; i < numCols; i++) {
            final int colIndex = i;
            executor.execute(() -> {
                for (int j = 0; j < numRows; j++) {
                    transposedMatrix[colIndex][j] = matrix[j][colIndex];
                }
            });
        }

        executor.shutdown();
        while (!executor.isTerminated()) {
            // Ожидание завершения всех потоков
        }

        return matrixToString(transposedMatrix);
    }

    public static String addMatrices(String matrix1String, String matrix2String, int numThreads) {
        String[] rowStrings1 = matrix1String.split("\\},\\s*\\{");
        String[] rowStrings2 = matrix2String.split("\\},\\s*\\{");
        int numRows = rowStrings1.length;
        int numCols = rowStrings1[0].split(",").length;

        int[][] matrix1 = parseMatrix(rowStrings1, numRows, numCols);
        int[][] matrix2 = parseMatrix(rowStrings2, numRows, numCols);

        int[][] resultMatrix = new int[numRows][numCols];

        ExecutorService executor = Executors.newFixedThreadPool(numThreads);

        for (int i = 0; i < numRows; i++) {
            final int rowIndex = i;
            executor.execute(() -> {
                for (int j = 0; j < numCols; j++) {
                    resultMatrix[rowIndex][j] = matrix1[rowIndex][j] + matrix2[rowIndex][j];
                }
            });
        }

        executor.shutdown();
        while (!executor.isTerminated()) {
        }

        return matrixToString(resultMatrix);
    }

    public static String multiplyMatrices(String matrix1String, String matrix2String, int numThreads) {
        String[] rowStrings1 = matrix1String.split("\\},\\s*\\{");
        String[] rowStrings2 = matrix2String.split("\\},\\s*\\{");
        int numRows1 = rowStrings1.length;
        int numCols1 = rowStrings1[0].split(",").length;
        int numRows2 = rowStrings2.length;
        int numCols2 = rowStrings2[0].split(",").length;

        int[][] matrix1 = parseMatrix(rowStrings1, numRows1, numCols1);
        int[][] matrix2 = parseMatrix(rowStrings2, numRows2, numCols2);

        if (numCols1 != numRows2) {
            throw new IllegalArgumentException("Matrix multiplication is impossible: wrong matrix sizes");
        }

        int[][] resultMatrix = new int[numRows1][numCols2];

        ExecutorService executor = Executors.newFixedThreadPool(numThreads);

        for (int i = 0; i < numRows1; i++) {
            final int rowIndex = i;
            executor.execute(() -> {
                for (int j = 0; j < numCols2; j++) {
                    for (int k = 0; k < numCols1; k++) {
                        resultMatrix[rowIndex][j] += matrix1[rowIndex][k] * matrix2[k][j];
                    }
                }
            });
        }

        executor.shutdown();
        while (!executor.isTerminated()) {
            // Ожидание завершения всех потоков
        }

        return matrixToString(resultMatrix);
    }

    public static String multiplyMatrixByScalar(String matrixString, int scalar) {
        String[] rowStrings = matrixString.split("\\},\\s*\\{"); // Разделение на строки матрицы
        int numRows = rowStrings.length;
        int numCols = rowStrings[0].split(",").length;

        int[][] matrix = parseMatrix(rowStrings, numRows, numCols);

        int[][] resultMatrix = new int[numRows][numCols];

        for (int i = 0; i < numRows; i++) {
            for (int j = 0; j < numCols; j++) {
                resultMatrix[i][j] = matrix[i][j] * scalar;
            }
        }

        return matrixToString(resultMatrix);
    }


}
