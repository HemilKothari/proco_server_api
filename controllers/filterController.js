const Filter = require('../models/Filter');

// Create a new filter
const createFilter = async (req, res) => {
  try {
    console.log("Creating a new filter with data:", req.body);

    const filter = new Filter(req.body); // Create a new filter from the request body
    const savedFilter = await filter.save(); // Save the filter to the database

    console.log("Filter created successfully:", savedFilter);
    res.status(200).json({
      message: 'Filter created successfully',
      data: savedFilter,
    });
  } catch (error) {
    console.error("Error creating filter:", error);
    res.status(500).json({
      message: 'Error creating filter',
      error: error.message,
    });
  }
};

// Get all filters
const getFilters = async (req, res) => {
  try {
    console.log("Fetching all filters");

    const filters = await Filter.find(); // Retrieve all filters from the database

    console.log("Filters fetched successfully:", filters);
    res.status(200).json({
      message: 'Filters fetched successfully',
      data: filters,
    });
  } catch (error) {
    console.error("Error fetching filters:", error);
    res.status(500).json({
      message: 'Error fetching filters',
      error: error.message,
    });
  }
};

// Get a filter by ID
const getFilterById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching filter with ID: ${id}`);

    const filter = await Filter.findById(id); // Find the filter by ID

    if (!filter) {
      console.log("Filter not found");
      return res.status(404).json({
        message: 'Filter not found',
      });
    }

    console.log("Filter fetched successfully:", filter);
    res.status(200).json({
      message: 'Filter fetched successfully',
      data: filter,
    });
  } catch (error) {
    console.error("Error fetching filter:", error);
    res.status(500).json({
      message: 'Error fetching filter',
      error: error.message,
    });
  }
};

// Update a filter
const updateFilter = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Updating filter with ID: ${id}`, req.body);

    const updatedFilter = await Filter.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Validate the updates
    });

    if (!updatedFilter) {
      console.log("Filter not found");
      return res.status(404).json({
        message: 'Filter not found',
      });
    }

    console.log("Filter updated successfully:", updatedFilter);
    res.status(200).json({
      message: 'Filter updated successfully',
      data: updatedFilter,
    });
  } catch (error) {
    console.error("Error updating filter:", error);
    res.status(500).json({
      message: 'Error updating filter',
      error: error.message,
    });
  }
};

// Delete a filter
const deleteFilter = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Deleting filter with ID: ${id}`);

    const deletedFilter = await Filter.findByIdAndDelete(id); // Delete the filter by ID

    if (!deletedFilter) {
      console.log("Filter not found");
      return res.status(404).json({
        message: 'Filter not found',
      });
    }

    console.log("Filter deleted successfully:", deletedFilter);
    res.status(200).json({
      message: 'Filter deleted successfully',
      data: deletedFilter,
    });
  } catch (error) {
    console.error("Error deleting filter:", error);
    res.status(500).json({
      message: 'Error deleting filter',
      error: error.message,
    });
  }
};

module.exports = {
  createFilter,
  getFilters,
  getFilterById,
  updateFilter,
  deleteFilter,
};
