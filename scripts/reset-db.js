import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Emptying database...');

  try {
    // Delete in order of dependencies (child first, then parent)
    const deletedOrderItems = await prisma.orderItem.deleteMany({});
    console.log(`Deleted ${deletedOrderItems.count} order items`);

    const deletedOrders = await prisma.order.deleteMany({});
    console.log(`Deleted ${deletedOrders.count} orders`);

    const deletedProducts = await prisma.product.deleteMany({});
    console.log(`Deleted ${deletedProducts.count} products`);

    const deletedUsers = await prisma.user.deleteMany({});
    console.log(`Deleted ${deletedUsers.count} users`);

    console.log('✅ Database emptied successfully');
  } catch (error) {
    console.error('Error emptying database:', error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
