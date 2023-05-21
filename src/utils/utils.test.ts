import { it, expect } from 'vitest';
import { cloneElement } from '@/utils/utils';

it('should return element equal to input', () => {
    // Arrange
    const elementToClone = [1, 2];
    const expectedResult = [1, 2];
 
    // Act
    const result = cloneElement(elementToClone);
 
    // Assert
    expect(result).toEqual(expectedResult);
 });