import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createCustomer } from "@/lib/actions/customers";
import { CustomerForm } from "@/components/customer-form";
import { PageHeader } from "@/components/page-header";

export default function NewCustomerPage() {
  return (
    <div className="max-w-2xl">
      <Link
        href="/customers"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        顧客一覧へ戻る
      </Link>
      <PageHeader title="新規顧客" description="新しい顧客を登録します" />
      <CustomerForm action={createCustomer} submitLabel="登録する" />
    </div>
  );
}
