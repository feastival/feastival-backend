import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs/promises';

const prisma = new PrismaClient();

// Function to create or update data using upsert operation
async function upsertData(data) {
    try {
        for (const eventData of data) {
            let statusConnect = {};
            if (eventData.status) {
                // If status is provided, try to find the status by name
                const status = await prisma.status.findUnique({
                    where: { name: eventData.status },
                });

                if (status) {
                    // If status is found, use its ID to connect
                    statusConnect = { connect: { id: status.id } };
                } else {
                    // If status is not found, create a new status and connect it
                    const newStatus = await prisma.status.create({
                        data: { name: eventData.status },
                    });
                    statusConnect = { connect: { id: newStatus.id } };
                }
            }

            const artistArray = Array.isArray(eventData.artists) ? eventData.artists : [eventData.artists];
            const artistConnectOrCreate = artistArray.map((artistName) => ({
                where: { name: artistName },
                create: { name: artistName },
              }));

            const genreConnectOrCreate = eventData.genre
                ? eventData.genre.map((genreName) => ({
                    where: { name: genreName },
                    create: { name: genreName },
                }))
                : [];

            let organizerConnect = {};
            if (eventData.organizer) {
                // If organizer ID or email is provided, try to find the user by ID or email
                const organizer = await prisma.user.findUnique({
                    where: { username: eventData.organizer as string },
                });

                if (organizer) {
                    // If organizer is found, use its ID to connect
                    organizerConnect = { connect: { id: organizer.id } };
                } else {
                    // If organizer is not found, create a new user and connect it
                    const organizerName = eventData.organizer as string;
                    const email = `${organizerName.toLowerCase().replace(/ /g, '')}@festival.fun`;

                    const newOrganizer = await prisma.user.upsert({
                        where: { email }, // Use email as the unique identifier
                        update: {}, // No need to update anything
                        create: { id: uuidv4(), email, username: organizerName, password: 'password' },
                    });
                    organizerConnect = { connect: { id: newOrganizer.id } };
                }
            }

            const upsertedData = await prisma.event.upsert({
                where: { id: eventData.id },
                create: {
                    id: uuidv4(),
                    ...eventData,
                    status: statusConnect,
                    artists: { connectOrCreate: artistConnectOrCreate },
                    organizer: organizerConnect,
                    genre: { connectOrCreate: genreConnectOrCreate },
                    location: {
                        create: eventData.location,
                    },
                },
                update: {
                    ...eventData,
                    status: statusConnect,
                    artists: { connectOrCreate: artistConnectOrCreate },
                    organizer: organizerConnect,
                    genre: { connectOrCreate: genreConnectOrCreate },
                    location: {
                        create: eventData.location,
                    },
                },
            });

            console.log('Upsert result:', upsertedData);
        }
    } catch (error) {
        console.error('Upsert failed:', error);
    }
}

// Seed data
(async () => {
    try {
        // Read data from data.json
        const rawData = await fs.readFile('prisma/data.json', 'utf-8');
        let eventDataArray = JSON.parse(rawData);

        // Generate and assign id for each event
        eventDataArray = eventDataArray.map((event) => ({
            ...event,
            id: uuidv4(),
        }));

        // Call the upsertData function with the eventDataArray
        await upsertData(eventDataArray);
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
})();