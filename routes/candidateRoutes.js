const express = require('express');
const router = express.Router();

const fs = require('fs').promises;
const path = require('path');

const User = require('../models/user');
const { jwtAuthMiddleware } = require('../jwt');
const Candidate = require('../models/candidate');


// ==================== CHECK ADMIN ROLE ====================

const checkAdminRole = async (userID) => {
    try {
        const user = await User.findById(userID);

        if (!user) {
            return false;
        }

        return user.role === 'admin';

    } catch (err) {
        console.log(err);
        return false;
    }
};


// ==================== UPDATE CANDIDATE ====================

router.put('/:candidateID', jwtAuthMiddleware, async (req, res) => {
    try {

        // Check if logged-in user is admin
        const isAdmin = await checkAdminRole(req.user.id);

        if (!isAdmin) {
            return res.status(403).json({
                message: 'User does not have admin role'
            });
        }

        const candidateID = req.params.candidateID;

        const updatedCandidateData = req.body;

        const response = await Candidate.findByIdAndUpdate(
            candidateID,
            updatedCandidateData,
            {
                new: true,
                runValidators: true
            }
        );

        if (!response) {
            return res.status(404).json({
                error: 'Candidate not found'
            });
        }

        console.log('Candidate data updated');

        res.status(200).json(response);

    } catch (err) {
        console.log(err);

        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
});


// ==================== DELETE CANDIDATE ====================

router.delete('/:candidateID', jwtAuthMiddleware, async (req, res) => {
    try {

        // Check if logged-in user is admin
        const isAdmin = await checkAdminRole(req.user.id);

        if (!isAdmin) {
            return res.status(403).json({
                message: 'User does not have admin role'
            });
        }

        const candidateID = req.params.candidateID;

        const response = await Candidate.findByIdAndDelete(candidateID);

        if (!response) {
            return res.status(404).json({
                error: 'Candidate not found'
            });
        }

        console.log('Candidate deleted');

        res.status(200).json(response);

    } catch (err) {
        console.log(err);

        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
});


//     token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYmY2MGIzNWE2MjU1MTA2YjllODBjOCIsImlhdCI6MTc5MDkzMzE3OSwiZXhwIjoxNzkwOTYzMTc5fQ.pCc9RcZujgNGz7Z4FeHzO3pgcl
// ==================== VOTE COUNT ====================
router.get('/vote/count', async (req, res) => {
    try {

        const candidates = await Candidate
            .find()
            .sort({ voteCount: -1 });

        const voteRecord = candidates.map((data) => {
            return {
                party: data.party,
                count: data.voteCount
            };
        });

        return res.status(200).json(voteRecord);

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            error: 'Internal Server Error'
        });
    }
});


// ==================== START VOTING ====================
router.get('/vote/:candidateID', jwtAuthMiddleware, async (req, res) => {

    const candidateID = req.params.candidateID;
    const userId = req.user.id;

    try {

        const candidate = await Candidate.findById(candidateID);

        if (!candidate) {
            return res.status(404).json({
                message: 'Candidate not found'
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        if (user.role === 'admin') {
            return res.status(403).json({
                message: 'Admin is not allowed to vote'
            });
        }

        if (user.isVoted) {
            return res.status(400).json({
                message: 'You have already voted'
            });
        }

        candidate.votes.push({
            user: userId
        });

        candidate.voteCount++;

       await candidate.save();

user.isVoted = true;

await user.save();


// ==================== UPDATE JSON FILE ====================

const allCandidates = await Candidate.find().lean();

const jsonPath = path.join(
    __dirname,
    '../dummy data/sample_candiate.json'
);

console.log('JSON FILE PATH:', jsonPath);

await fs.writeFile(
    jsonPath,
    JSON.stringify(allCandidates, null, 4),
    'utf8'
);


return res.status(200).json({
    message: 'Vote recorded successfully'
});

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            error: 'Internal Server Error'
        });
    }
});


// ==================== GET ALL CANDIDATES ====================

router.get('/', async (req, res) => {
    try {

        // Get candidate name and party only
        const candidates = await Candidate.find(
    {},
    'name party age'
);



        // Return candidates
        res.status(200).json(candidates);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
});

// ADD CANDIDATE - ADMIN ONLY
router.post('/', jwtAuthMiddleware, async (req, res) => {
    try {
        const isAdmin = await checkAdminRole(req.user.id);

        if (!isAdmin) {
            return res.status(403).json({
                message: 'User does not have admin role'
            });
        }

        const { name, party, age } = req.body;

        if (!name || !party || !age) {
            return res.status(400).json({
                message: 'Name, party and age are required'
            });
        }

        const candidate = new Candidate({
            name,
            party,
            age,
            votes: [],
            voteCount: 0
        });

        const savedCandidate = await candidate.save();

        res.status(201).json(savedCandidate);

    } catch (err) {
        console.log(err);

        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
});

module.exports = router;



