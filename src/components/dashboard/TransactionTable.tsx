// Tabela de transações

import React from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { ArrowUpCircle, ArrowDownCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function TransactionTable() {
  const { transactions, deleteTransaction } = useFinance();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="stat-card animate-slide-up" style={{ animationDelay: '400ms' }}>
      <h3 className="text-lg font-display font-semibold text-card-foreground mb-4">
        Histórico de Transações
      </h3>

      <div className="overflow-x-auto custom-scrollbar">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead className="text-muted-foreground font-semibold">Tipo</TableHead>
              <TableHead className="text-muted-foreground font-semibold">Descrição</TableHead>
              <TableHead className="text-muted-foreground font-semibold">Categoria</TableHead>
              <TableHead className="text-muted-foreground font-semibold text-right">Valor</TableHead>
              <TableHead className="text-muted-foreground font-semibold">Data</TableHead>
              <TableHead className="text-muted-foreground font-semibold w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.slice(0, 8).map((transaction) => (
              <TableRow key={transaction.id} className="table-row-hover border-border">
                <TableCell>
                  {transaction.type === 'income' ? (
                    <ArrowUpCircle className="w-5 h-5 text-success" />
                  ) : (
                    <ArrowDownCircle className="w-5 h-5 text-destructive" />
                  )}
                </TableCell>
                <TableCell className="font-medium text-card-foreground">
                  {transaction.description}
                </TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-md bg-muted text-xs font-medium text-muted-foreground">
                    {transaction.category}
                  </span>
                </TableCell>
                <TableCell className={`text-right font-semibold ${
                  transaction.type === 'income' ? 'text-success' : 'text-destructive'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.value)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(transaction.date)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => deleteTransaction(transaction.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {transactions.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhuma transação registrada
        </div>
      )}
    </div>
  );
}
