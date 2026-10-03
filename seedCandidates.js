const mongoose = require("mongoose");
require("dotenv").config();

const Candidate = require("./models/candidate");
const voteData = require("./dummy data/vote_data.json");

const mongoURL = process.env.MONGODB_URL_LOCAL;

const seedCandidates = async () => {
    try {
        await mongoose.connect(mongoURL);

        console.log("Connected to MongoDB");

        // Remove existing candidates
        await Candidate.deleteMany({});

        // Prepare candidates for MongoDB
        const candidates = voteData.map((candidate) => ({
            name: candidate.name,
            party: candidate.party,
            age: candidate.age,
            votes: [],
            voteCount: 0
        }));

        // Insert JSON candidates
        const insertedCandidates = await Candidate.insertMany(candidates);

        console.log(
            `${insertedCandidates.length} candidates inserted successfully`
        );

        insertedCandidates.forEach((candidate) => {
            console.log(
                `${candidate.name} - ${candidate.party} - Age: ${candidate.age}`
            );
        });

        await mongoose.connection.close();

        console.log("MongoDB connection closed");
        console.log("Candidate seeding completed successfully");

    } catch (error) {
        console.error("Error seeding candidates:", error);

        await mongoose.connection.close();

        process.exit(1);
    }
};

seedCandidates();