import { Test, TestingModule } from '@nestjs/testing';
import { RecipeService } from './recipe.service';
import { getModelToken } from '@nestjs/mongoose';
import { ReviewService } from '../review/review.service';
import { Recipe } from './recipe.schema';
import { UnauthorizedException } from '@nestjs/common';
import { RecipeCategory } from '@avans-nx-workshop/shared/api';

describe('RecipeService', () => {
  let recipeService: RecipeService;
  let recipeModelMock: any;
  let reviewServiceMock: any;

  beforeEach(async () => {
    recipeModelMock = jest.fn().mockImplementation(function (data) {
      return {
        ...data,
        save: jest.fn().mockResolvedValue({
          ...data,
          _id: '1',
          createdAt: new Date(),
        }),
      };
    });
  
    recipeModelMock.find = jest.fn();
    recipeModelMock.findById = jest.fn();
    recipeModelMock.findByIdAndUpdate = jest.fn();
    recipeModelMock.findByIdAndDelete = jest.fn();
  
    reviewServiceMock = {
      getAverageRating: jest.fn(),
    };
  
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipeService,
        {
          provide: getModelToken(Recipe.name),
          useValue: recipeModelMock,
        },
        {
          provide: ReviewService,
          useValue: reviewServiceMock,
        },
      ],
    }).compile();
  
    recipeService = module.get<RecipeService>(RecipeService);
  });
  
  it('should be defined', () => {
    expect(recipeService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new recipe', async () => {
      const recipeData = {
        title: 'Test Recipe',
        description: 'This is a test recipe',
        category: RecipeCategory.DESSERT,
        ingredients: [{ name: 'Sugar', amount: '100g' }],
        steps: [{ instruction: 'Mix ingredients' }],
        cookingTime: 30,
        userid: '123',
      };
  
      const result = await recipeService.create(recipeData);
  
      expect(result).toEqual(
        expect.objectContaining({
          ...recipeData,
          _id: '1',
          createdAt: expect.any(Date),
        }),
      );
      expect(recipeModelMock).toHaveBeenCalledWith(recipeData); // Controleer constructor-aanroep
    });
  });
  

  describe('findAll', () => {
    it('should return all recipes with average ratings', async () => {
      const recipes = [
        { _id: '1', title: 'Recipe 1', userid: '123', toObject: jest.fn().mockReturnValue({ title: 'Recipe 1' }) },
      ];
      const averageRating = 4.5;

      recipeModelMock.find.mockReturnValueOnce({ exec: jest.fn().mockResolvedValue(recipes) });
      reviewServiceMock.getAverageRating.mockResolvedValueOnce(averageRating);

      const result = await recipeService.findAll();
      expect(result).toEqual([{ title: 'Recipe 1', averageRating }]);
      expect(recipeModelMock.find).toHaveBeenCalled();
      expect(reviewServiceMock.getAverageRating).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a recipe if user is authorized', async () => {
      const recipeData = { title: 'Updated Recipe' };
      const existingRecipe = { _id: '1', title: 'Old Recipe', userid: '123' };

      recipeModelMock.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(existingRecipe),
      });
      recipeModelMock.findByIdAndUpdate.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue({ ...existingRecipe, ...recipeData }),
      });

      const result = await recipeService.update('1', recipeData, '123');
      expect(result).toEqual({ ...existingRecipe, ...recipeData });
      expect(recipeModelMock.findByIdAndUpdate).toHaveBeenCalledWith('1', recipeData, { new: true });
    });

    it('should throw an UnauthorizedException if user is not authorized', async () => {
      const existingRecipe = { _id: '1', title: 'Old Recipe', userid: '123' };

      recipeModelMock.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(existingRecipe),
      });

      await expect(recipeService.update('1', { title: 'New Title' }, '456')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('delete', () => {
    it('should delete a recipe if user is authorized', async () => {
      const existingRecipe = { _id: '1', title: 'Recipe', userid: '123' };

      recipeModelMock.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(existingRecipe),
      });
      recipeModelMock.findByIdAndDelete.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(existingRecipe),
      });

      const result = await recipeService.delete('1', '123');
      expect(result).toBe(true);
      expect(recipeModelMock.findByIdAndDelete).toHaveBeenCalledWith('1');
    });

    it('should throw an UnauthorizedException if user is not authorized', async () => {
      const existingRecipe = { _id: '1', title: 'Recipe', userid: '123' };

      recipeModelMock.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(existingRecipe),
      });

      await expect(recipeService.delete('1', '456')).rejects.toThrow(UnauthorizedException);
    });
  });
});
