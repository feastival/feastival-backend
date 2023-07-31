import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

// Function to create or update data using upsert operation
async function upsertData(data: any) {
    try {
        let statusConnect = {};
        if (data.status) {
            // If status is provided, try to find the status by name
            const status = await prisma.status.findUnique({
                where: { name: data.status },
            });

            if (status) {
                // If status is found, use its ID to connect
                statusConnect = { connect: { id: status.id } };
            } else {
                // If status is not found, create a new status and connect it
                const newStatus = await prisma.status.create({
                    data: { name: data.status },
                });
                statusConnect = { connect: { id: newStatus.id } };
            }
        }

        let organizerConnect = {};
        if (data.organizer) {
            // If organizer ID or email is provided, try to find the user by ID or email
            const organizer = await prisma.user.findUnique({
                where: { username: data.organizer as string },
            });
            console.log(data.organizer)

            if (organizer) {
                // If organizer is found, use its ID to connect
                organizerConnect = { connect: { id: organizer.id } };
            } else {
                // If organizer is not found, create a new user and connect it
                const organizerName = data.organizer as string;
                console.log('Organizer is', organizerName);
                const email = `${organizerName.toLowerCase().replace(/ /g, '')}@festival.fun`;
                console.log(email);

                const newOrganizer = await prisma.user.upsert({
                    where: { email }, // Use email as the unique identifier
                    update: {}, // No need to update anything
                    create: { id: uuidv4(), email, username: organizerName.toLowerCase().replace(/ /g, ''), password: 'password' },
                });
                organizerConnect = { connect: { id: newOrganizer.id } };
            }
        }

        const upsertedData = await prisma.event.upsert({
            where: { id: data.id },
            create: {
                id: uuidv4(),
                ...data,
                status: statusConnect,
                artists: {
                    connectOrCreate: data.artist?.map((artistName) => ({
                        where: { name: artistName },
                        create: { name: artistName },
                    })),
                },
                organizer: organizerConnect,
                genre: {
                    connectOrCreate: data.genre?.map((genreName) => ({
                        where: { name: genreName },
                        create: { name: genreName },
                    })),
                },
                location: {
                    create: data.location,
                },
            },
            update: {
                ...data,
                status: statusConnect,
                artists: {
                    connectOrCreate: data.artist?.map((artistName) => ({
                        where: { name: artistName },
                        create: { name: artistName },
                    })),
                },
                organizer: organizerConnect,
                genre: {
                    connectOrCreate: data.genre?.map((genreName) => ({
                        where: { name: genreName },
                        create: { name: genreName },
                    })),
                },
                location: {
                    create: data.location,
                },
            },
        });

        console.log('Upsert result:', upsertedData);
    } catch (error) {
        console.error('Upsert failed:', error);
    }
}

// Seed data
(async () => {
    try {
        const eventData = {
            id: uuidv4(), // Automatically generate UUIDv4 for the id field
            name: "KUDUS | ISYANA: THE 4TH ALBUM SHOWCASE LIVE ON TOUR",
            imageUrl: "https://s3-ap-southeast-1.amazonaws.com/loket-production-sg/images/banner/20230713211702_64b0075e19b9c.jpg",
            description: `ISYANA: THE 4TH ALBUM SHOWCASE LIVE ON TOUR KUDUS.
The long-awaited fourth studio album, self-titled ISYANA is an extension of the latest EP, a turning and burning point of her life. Despite the perplexing journey, she remains true, vulnerable, and honest in her stories. Isyana Sarasvati converse through classical rock, electronic tunes, and distortions of melodies. A roller coaster of emotion through an evolution of virtuous sounds.
This intimate showcase of ISYANA, which integrates a mind-blowing stage act with stunning visuals and lighting, is an opportunity that cannot be missed. All of this will be brought closer to you in July and August.`,
            startedAt: new Date("2023-08-01T08:00:00.000Z"),
            finishedAt: new Date("2023-08-01T11:00:00.000Z"),
            price: 179000,
            status: 'Finished',
            genre: ["Classical Rock", "Electronic", "Pop"],
            artists: ["Isyana Sarasvati"],
            organizer: "SKY Entertainment",
            location: {
                venue: "Auditorium Universitas Muria",
                address: "Jl. Lkr. Utara, Kayuapu Kulon, Gondangmanis, Kec. Bae",
                mapsURL: "https://goo.gl/maps/n6Vc9nNtzqNKJ7dc9",
                province: "Jawa Tengah",
                city: "Kudus",
                street: "Jl. Lkr. Utara, Kayuapu Kulon",
                postalCode: "59327",
                latitude: -6.784,
                longitude: 110.866,
            },
        };

        await upsertData(eventData);
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
})();