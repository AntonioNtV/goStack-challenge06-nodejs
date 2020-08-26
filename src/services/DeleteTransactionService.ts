import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';

interface Request {
  transaction_id: string;
}
class DeleteTransactionService {
  public async execute({ transaction_id }: Request): Promise<void> {
    const transactionRepository = getRepository(Transaction);

    await transactionRepository.delete({ id: transaction_id });
  }
}

export default DeleteTransactionService;
