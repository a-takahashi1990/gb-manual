import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { updateCustomer } from "@/lib/actions/customers";
import { CustomerForm } from "@/components/customer-form";
import { PageHeader } from "@/components/page-header";

export const dynamic = "force-dynamic";

export default async function EditCustomerPage({
  params,
}: {
  params: { id: string };
}) {
  const customer = await prisma.customer.findUnique({
    where: { id: params.id },
  });
  if (!customer) notFound();

  const updateWithId = updateCustomer.bind(null, customer.id);

  return (
    <div className="max-w-2xl">
      <Link
        href="/customers"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        顧客一覧へ戻る
      </Link>
      <PageHeader title="顧客を編集" />
      <CustomerForm
        action={updateWithId}
        defaults={{
          name: customer.name,
          company: customer.company,
          email: customer.email,
          phone: customer.phone,
          memo: customer.memo,
        }}
        submitLabel="保存する"
      />
    </div>
  );
}
