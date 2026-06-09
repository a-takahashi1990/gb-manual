import { PrismaClient, Role, ProjectStatus, Priority } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 シードデータを投入します...");

  // --- 管理者ユーザー ---
  const adminPassword = await bcrypt.hash("admin1234", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "管理者",
      email: "admin@example.com",
      password: adminPassword,
      role: Role.admin,
    },
  });
  console.log(`✅ 管理者ユーザー: ${admin.email}`);

  // --- メンバーユーザー（担当者の例） ---
  const memberPassword = await bcrypt.hash("member1234", 10);
  const member = await prisma.user.upsert({
    where: { email: "member@example.com" },
    update: {},
    create: {
      name: "山田 太郎",
      email: "member@example.com",
      password: memberPassword,
      role: Role.member,
    },
  });
  console.log(`✅ メンバーユーザー: ${member.email}`);

  // --- 顧客マスタ（2件） ---
  const customerA = await prisma.customer.upsert({
    where: { id: "seed-customer-a" },
    update: {},
    create: {
      id: "seed-customer-a",
      name: "佐藤 花子",
      company: "株式会社サクラ商事",
      email: "sato@sakura-corp.example.com",
      phone: "03-1234-5678",
      memo: "主要取引先。月次で定例MTGあり。",
    },
  });

  const customerB = await prisma.customer.upsert({
    where: { id: "seed-customer-b" },
    update: {},
    create: {
      id: "seed-customer-b",
      name: "鈴木 一郎",
      company: "ミライテック株式会社",
      email: "suzuki@mirai-tech.example.com",
      phone: "06-9876-5432",
      memo: "新規開拓。レスポンス早め。",
    },
  });
  console.log(`✅ 顧客: ${customerA.company}, ${customerB.company}`);

  // --- 案件（3件） ---
  await prisma.project.upsert({
    where: { id: "seed-project-1" },
    update: {},
    create: {
      id: "seed-project-1",
      title: "コーポレートサイトリニューアル",
      description: "サクラ商事の公式サイトを全面リニューアル。デザイン刷新とCMS導入を含む。",
      status: ProjectStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      dueDate: new Date("2026-07-31"),
      customerId: customerA.id,
      assigneeId: member.id,
      createdById: admin.id,
    },
  });

  await prisma.project.upsert({
    where: { id: "seed-project-2" },
    update: {},
    create: {
      id: "seed-project-2",
      title: "業務管理アプリ要件定義",
      description: "ミライテック向け社内業務アプリの要件定義フェーズ。ヒアリングと仕様策定。",
      status: ProjectStatus.TODO,
      priority: Priority.MEDIUM,
      dueDate: new Date("2026-08-15"),
      customerId: customerB.id,
      assigneeId: admin.id,
      createdById: admin.id,
    },
  });

  await prisma.project.upsert({
    where: { id: "seed-project-3" },
    update: {},
    create: {
      id: "seed-project-3",
      title: "月次レポート自動化",
      description: "既存の手作業レポートをスクリプトで自動生成する。",
      status: ProjectStatus.DONE,
      priority: Priority.LOW,
      dueDate: new Date("2026-05-30"),
      customerId: customerA.id,
      assigneeId: member.id,
      createdById: admin.id,
    },
  });
  console.log("✅ 案件 3件");

  // --- サンプルコメント ---
  await prisma.comment.create({
    data: {
      content: "初回ヒアリング完了しました。来週デザイン案を共有します。",
      projectId: "seed-project-1",
      userId: member.id,
    },
  });

  console.log("🎉 シード完了！");
  console.log("------------------------------------------");
  console.log("ログイン情報:");
  console.log("  管理者  : admin@example.com  / admin1234");
  console.log("  メンバー: member@example.com / member1234");
  console.log("------------------------------------------");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
