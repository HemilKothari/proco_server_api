const Job = require("../models/Job");

module.exports = {
    createJob: async (req, res) => {
        const newJob = new Job(req.body);

        try {
            const savedJob = await newJob.save();
            const { __v, updatedAt, ...newJobInfo } = savedJob._doc;
            res.status(200).json(newJobInfo)
        } catch (error) {
            res.status(500).json(error)
        }
    },


    updateJob: async (req, res) => {
        try {
            const updatedJob = await Job.findByIdAndUpdate(
                req.params.id, {
                $set: req.body
            }, { new: true });

            const { password, __v, createdAt, ...job } = updatedJob._doc;

            res.status(200).json({ ...job });
        } catch (err) {
            res.status(500).json(err)
        }
    },

    deleteJob: async (req, res) => {
        try {
            await Job.findByIdAndDelete(req.params.id)
            res.status(200).json("Job Successfully Deleted")
        } catch (error) {
            res.status(500).json(error)
        }
    },

    getJob: async (req, res) => {
        try {
            const job = await Job.findById(req.params.id);
            const { __v, createdAt, ...jobData } = job._doc;
            res.status(200).json(jobData)
        } catch (error) {
            res.status(500).json(error)
        }
    },


    getAllJobs: async (req, res) => {
        const recent = req.query.new;
        try {
            let jobs;
            if (recent) {
                jobs = await Job.find().sort({ createdAt: -1 }).limit(2)
            } else {
                jobs = await Job.find()
            }
            res.status(200).json(jobs)
        } catch (error) {
            res.status(500).json(error)
        }
    },

    searchJobs: async (req, res) => {
        try {
            const results = await Job.aggregate(
                [
                    {
                        $search: {
                            index: "jobsearch",
                            text: {
                                query: req.params.key,
                                path: {
                                    wildcard: "*"
                                }
                            }
                        }
                    }
                ]
            )
            res.status(200).send(results);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getUserJobs: async (req, res) => {
        console.log('getUserJobs function called with agentId:', req.params.id); // Debug log
        try {
            // Ensure agentId is in correct format
            const agentId = req.params.agentId;
    
            // Find jobs associated with the provided agentId
            const jobs = await Job.find({ agentId: agentId });
    
            // If no jobs are found, return a 404 response
            if (!jobs.length) {
                console.log(`No jobs found for agentId: ${agentId}`); // Debug log
                return res.status(404).json({ message: "No jobs found for this user." });
            }
    
            // Return the found jobs
            res.status(200).json(jobs);
        } catch (error) {
            // Log the error for debugging
            console.error('Error fetching user jobs:', error);
    
            // Return a 500 Internal Server Error response
            res.status(500).json({ error: "Internal server error." });
        }
    }, 
   
   /*filterJobs: async (req, res) => {
        try {
            const { areas, opportunityTypes, locationType, distance, state, country } = req.body;

            // Build the query dynamically based on the filters
            const query = {};

            if (areas && areas.length > 0) {
                query.area = { $in: areas };
            }

            if (opportunityTypes && opportunityTypes.length > 0) {
                query.opportunityType = { $in: opportunityTypes };
            }

            if (locationType === "City" && distance) {
                query.distance = { $lte: distance }; // Ensure to have a distance field in the schema
            }

            if (locationType === "State" && state) {
                query.state = state;
            }

            if (locationType === "Country" && country) {
                query.country = country;
            }

            // Execute the query
            const filteredJobs = await Job.find(query);

            if (!filteredJobs.length) {
                return res.status(404).json({ message: "No jobs found matching the filters." });
            }

            res.status(200).json(filteredJobs);
        } catch (error) {
            console.error("Error filtering jobs:", error);
            res.status(500).json({ error: "Internal server error." });
        }
    },
*/
    // Other functions remain unchanged...
}

    
