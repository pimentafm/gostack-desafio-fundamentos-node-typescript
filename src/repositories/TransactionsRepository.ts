import Transaction from '../models/Transaction';

interface CreateTransaction {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

enum TransactionType {
  income = 'income',
  outcome = 'outcome',
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  private calculateBalance(operator: TransactionType): number {
    return this.transactions
      .filter(t => t.type === operator)
      .reduce((accumulated, transaction) => accumulated + transaction.value, 0);
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const income = this.calculateBalance(TransactionType.income);
    const outcome = this.calculateBalance(TransactionType.outcome);
    const total = income - outcome;

    const balance: Balance = { income, outcome, total };

    return balance;
  }

  public create({ title, value, type }: CreateTransaction): Transaction {
    const transaction = new Transaction({ title, value, type });

    const { total } = this.getBalance();
    if (type === TransactionType.outcome && total < value) {
      throw Error('Cannot create outcome transaction without a valid balance');
    }

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
