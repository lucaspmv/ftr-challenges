import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { Wallet, ArrowUpCircle, ArrowDownCircle, Plus, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/stat-card';
import { TransactionRow } from '@/components/transaction-row';
import { CategoryTag } from '@/components/category-tag';
import { TransactionDialog } from '@/components/transaction-dialog';
import { EmptyState } from '@/components/empty-state';
import { DASHBOARD } from '@/graphql/dashboard';
import { formatBRL } from '@/lib/format';
import type { CategoryColor } from '@/lib/colors';

export default function Dashboard() {
  const { data, loading } = useQuery(DASHBOARD);
  const [open, setOpen] = useState(false);

  const stats = data?.dashboard;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard icon={Wallet} label="Saldo total" value={stats ? formatBRL(stats.totalBalance) : '—'} />
        <StatCard icon={ArrowUpCircle} label="Receitas do mês" accent="success" value={stats ? formatBRL(stats.monthIncome) : '—'} />
        <StatCard icon={ArrowDownCircle} label="Despesas do mês" accent="danger" value={stats ? formatBRL(stats.monthExpense) : '—'} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="rounded-2xl bg-white shadow-sm lg:col-span-2">
          <header className="flex items-center justify-between p-5 pb-3">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Transações recentes</h2>
            <Link to="/transacoes" className="inline-flex items-center gap-1 text-sm font-medium text-brand-base">
              Ver todas <ChevronRight className="size-3" />
            </Link>
          </header>
          {loading ? null : (stats?.recentTransactions.length ?? 0) === 0 ? (
            <EmptyState title="Nenhuma transação ainda" action={<Button onClick={() => setOpen(true)} className="bg-brand-base hover:bg-brand-dark"><Plus className="size-4" /> Nova transação</Button>} />
          ) : (
            <>
              {stats!.recentTransactions.map((t) => <TransactionRow key={t.id} transaction={t} />)}
              <div className="border-t border-gray-100 px-5 py-3">
                <Button variant="ghost" onClick={() => setOpen(true)} className="text-brand-base">
                  <Plus className="size-4" /> Nova transação <ChevronRight className="size-3" />
                </Button>
              </div>
            </>
          )}
        </section>

        <section className="rounded-2xl bg-white shadow-sm">
          <header className="flex items-center justify-between border-b border-gray-100 p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Categorias</h2>
            <Link to="/categorias" className="inline-flex items-center gap-1 text-sm font-medium text-brand-base">
              Gerenciar <ChevronRight className="size-3" />
            </Link>
          </header>
          {loading ? null : (stats?.categoriesSummary.length ?? 0) === 0 ? (
            <EmptyState title="Nenhuma categoria ainda" />
          ) : (
            <ul>
              {stats!.categoriesSummary.map((s) => (
                <li key={s.category.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-gray-100 px-5 py-3 last:border-b-0">
                  <CategoryTag color={s.category.color as CategoryColor} label={s.category.title} />
                  <span className="text-sm text-gray-500 whitespace-nowrap">{s.count} {s.count === 1 ? 'item' : 'itens'}</span>
                  <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">{formatBRL(s.totalAmount)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <TransactionDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
