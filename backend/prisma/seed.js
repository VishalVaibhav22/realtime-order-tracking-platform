require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
    adapter,
});

async function main() {
    console.log("Seeding database...");

    // Clear existing data in dependency order.
    await prisma.locationHistory.deleteMany();
    await prisma.order.deleteMany();
    await prisma.driverProfile.deleteMany();
    await prisma.user.deleteMany();

    // Customers
    const customer1 = await prisma.user.create({
        data: {
            name: "Vishal",
            email: "vishal@example.com",
            passwordHash: "seeded-password",
            role: "CUSTOMER",
        },
    });

    const customer2 = await prisma.user.create({
        data: {
            name: "Rahul",
            email: "rahul@example.com",
            passwordHash: "seeded-password",
            role: "CUSTOMER",
        },
    });

    // Drivers
    const driverUser1 = await prisma.user.create({
        data: {
            name: "Amit",
            email: "amit@example.com",
            passwordHash: "seeded-password",
            role: "DRIVER",
            driverProfile: {
                create: {
                    vehicleNumber: "PB10AB1234",
                    isAvailable: true,
                },
            },
        },
        include: {
            driverProfile: true,
        },
    });

    const driverUser2 = await prisma.user.create({
        data: {
            name: "Rohan",
            email: "rohan@example.com",
            passwordHash: "seeded-password",
            role: "DRIVER",
            driverProfile: {
                create: {
                    vehicleNumber: "PB10CD5678",
                    isAvailable: true,
                },
            },
        },
        include: {
            driverProfile: true,
        },
    });

    // Admin
    const admin = await prisma.user.create({
        data: {
            name: "Admin",
            email: "admin@example.com",
            passwordHash: "seeded-password",
            role: "ADMIN",
        },
    });

    // Orders
    const order1 = await prisma.order.create({
        data: {
            customerId: customer1.id,
            status: "PLACED",
            pickupAddress: "Thapar Institute of Engineering and Technology",
            pickupLatitude: 30.3561,
            pickupLongitude: 76.3647,
            destinationAddress: "Patiala Railway Station",
            destinationLatitude: 30.3398,
            destinationLongitude: 76.3869,
        },
    });

    const order2 = await prisma.order.create({
        data: {
            customerId: customer2.id,
            driverId: driverUser1.driverProfile.id,
            status: "IN_TRANSIT",
            pickupAddress: "Patiala Bus Stand",
            pickupLatitude: 30.3431,
            pickupLongitude: 76.3835,
            destinationAddress: "Chandigarh Gate, Patiala",
            destinationLatitude: 30.3456,
            destinationLongitude: 76.3921,
        },
    });

    console.log("Seed completed.");
    console.log({
        customers: [customer1.email, customer2.email],
        drivers: [driverUser1.email, driverUser2.email],
        admin: admin.email,
        orders: [order1.id, order2.id],
    });
}

main()
    .catch((error) => {
        console.error("Seed failed:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
    