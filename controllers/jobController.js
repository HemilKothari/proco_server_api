const Job = require("../models/Job");

module.exports = {
  createJob: async (req, res) => {
    const newJob = new Job(req.body);

    try {
      const savedJob = await newJob.save();
      const { __v, updatedAt, ...newJobInfo } = savedJob._doc;
      res.status(200).json(newJobInfo);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  updateJob: async (req, res) => {
    try {
      const updatedJob = await Job.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );

      const { password, __v, createdAt, ...job } = updatedJob._doc;

      res.status(200).json({ ...job });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  deleteJob: async (req, res) => {
    try {
      await Job.findByIdAndDelete(req.params.id);
      res.status(200).json("Job Successfully Deleted");
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getJob: async (req, res) => {
    try {
      const job = await Job.findById(req.params.id);
      const { __v, createdAt, ...jobData } = job._doc;
      res.status(200).json(jobData);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getAllJobs: async (req, res) => {
    const recent = req.query.new;
    try {
      let jobs;
      if (recent) {
        jobs = await Job.find().sort({ createdAt: -1 }).limit(2);
      } else {
        jobs = await Job.find();
      }
      res.status(200).json(jobs);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  searchJobs: async (req, res) => {
    try {
      const results = await Job.aggregate([
        {
          $search: {
            index: "jobsearch",
            text: {
              query: req.params.key,
              path: {
                wildcard: "*",
              },
            },
          },
        },
      ]);
      res.status(200).send(results);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getUserJobs: async (req, res) => {
    console.log("getUserJobs function called with agentId:", req.params.id); // Debug log
    try {
      // Ensure agentId is in correct format
      const agentId = req.params.agentId;

      // Find jobs associated with the provided agentId
      const jobs = await Job.find({ agentId: agentId });

      // If no jobs are found, return a 404 response
      if (!jobs.length) {
        console.log(`No jobs found for agentId: ${agentId}`); // Debug log
        return res
          .status(404)
          .json({ message: "No jobs found for this user." });
      }

      // Return the found jobs
      res.status(200).json(jobs);
    } catch (error) {
      // Log the error for debugging
      console.error("Error fetching user jobs:", error);

      // Return a 500 Internal Server Error response
      res.status(500).json({ error: "Internal server error." });
    }
  },
  getSwipedUsers: async (req, res) => {
    try {
      const job = await Job.findById(req.params.id);

      if (!job) {
        return res.status(404).json({ message: "No jobs found" });
      }
      await job.populate("swipedUsers", [
        "username",
        "location",
        "skills",
        "profile",
      ]);
      if (!job.swipedUsers) {
        return res.status(404).json({ message: "No swiped users found" });
      }

      res.status(200).json(job.swipedUsers);
    } catch (error) {
      console.error("Error fetching swiped users:", error);
      res.status(500).json({ message: "Internal server error", error });
    }
  },

  addSwipedUser: async (req, res) => {
    try {
      const { jobId, userId } = req.body; // Extract jobId and userId from request body

      const updatedJob = await Job.findByIdAndUpdate(
        jobId,
        { $addToSet: { swipedUsers: userId } },
        { new: true }
      );

      if (!updatedJob) {
        return res.status(404).json({ message: "Job not found" });
      }

      res.status(200).json({
        message: "User swiped successfully",
        swipedUsers: updatedJob.swipedUsers,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getMatchedUsers: async (req, res) => {
    try {
      const job = await Job.findById(req.params.id);

      if (!job) {
        return res.status(404).json({ message: "No jobs found" });
      }
      await job.populate("matchedUsers", [
        "username",
        "location",
        "skills",
        "profile",
      ]);
      if (!job.matchedUsers) {
        return res.status(404).json({ message: "No matched users found" });
      }

      res.status(200).json(job.matchedUsers);
    } catch (error) {
      console.error("Error fetching matched users:", error);
      res.status(500).json({ message: "Internal server error", error });
    }
  },

  addMatchedUser: async (req, res) => {
    try {
      const { jobId, userId } = req.body; // Extract jobId and userId from request body

      const updatedJob = await Job.findByIdAndUpdate(
        jobId,
        { $addToSet: { matchedUsers: userId } },
        { new: true }
      );

      if (!updatedJob) {
        return res.status(404).json({ message: "Job not found" });
      }

      res.status(200).json({
        message: "User matched successfully",
        matchedUsers: updatedJob.matchedUsers,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
