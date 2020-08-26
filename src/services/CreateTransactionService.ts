// import AppError from '../errors/AppError';

import { getRepository, getCustomRepository } from 'typeorm';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';
import CreateCategoryService from './CreateCategoryService';
import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category_title: string;
}
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category_title,
  }: Request): Promise<Transaction> {
    const categoriesRepository = getRepository(Category);
    const transactionRepository = getCustomRepository(TransactionRepository);
    const createCategory = new CreateCategoryService();

    const { total } = await transactionRepository.getBalance();

    // Caso seja passado um valor maior doq o usuario tenha como total na conta.
    if (value > total && type === 'outcome') {
      throw new AppError('You dont have enough money');
    }

    // Se nao existir uma categoria com o title, vai ser criado uma nova categoria.
    const category =
      (await categoriesRepository.findOne({
        where: { title: category_title },
      })) || (await createCategory.execute({ title: category_title }));

    const category_id = category.id;

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
