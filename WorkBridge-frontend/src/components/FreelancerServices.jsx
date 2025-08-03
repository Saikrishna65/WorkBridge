import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";

const FreelancerServices = () => {
  const { user } = useAppContext();
  const [services, setServices] = useState(user.services || []);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedService, setEditedService] = useState(null);

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditedService({ ...services[index] });
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditedService(null);
  };

  const handleSave = () => {
    const updated = [...services];
    const updatedService = {
      ...editedService,
      price: Number(editedService.price),
      revisions: Number(editedService.revisions),
    };
    updated[editingIndex] = updatedService;
    setServices(updated);
    setEditingIndex(null);
    setEditedService(null);

    // ✅ Print updated service to console
    console.log("Updated Service:", updatedService);
  };

  const handleChange = (field, value) => {
    setEditedService((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-4 md:p-10 space-y-6">
      <h2 className="text-2xl md:text-3xl font-semibold">My Services</h2>

      <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
        {user.services.map((service, index) => (
          <div
            key={index}
            className="bg-gray-200 w-full md:w-80 p-5 rounded-xl relative"
          >
            {editingIndex === index ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editedService.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full border rounded px-2 py-1"
                />
                <input
                  type="text"
                  value={editedService.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="w-full border rounded px-2 py-1"
                />
                <input
                  type="number"
                  value={editedService.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  className="w-full border rounded px-2 py-1"
                />
                <input
                  type="number"
                  value={editedService.revisions}
                  onChange={(e) => handleChange("revisions", e.target.value)}
                  className="w-full border rounded px-2 py-1"
                />
                <input
                  type="text"
                  value={editedService.deadline}
                  onChange={(e) => handleChange("deadline", e.target.value)}
                  className="w-full border rounded px-2 py-1"
                />
                <textarea
                  value={editedService.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="w-full border rounded px-2 py-1"
                />

                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={handleCancel}
                    className="px-3 py-1 text-sm bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-3 py-1 text-sm bg-black text-white rounded hover:bg-gray-800"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
                <p className="text-sm text-gray-500 capitalize mb-2">
                  Category: {service.category}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  Price: ₹{service.price}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  Revisions: {service.revisions}
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  Deadline: {service.deadline}
                </p>
                <p className="text-sm text-gray-700 mb-4">
                  {service.description}
                </p>

                <button
                  onClick={() => handleEdit(index)}
                  className="absolute top-3 right-3 px-3 py-1 text-sm bg-black text-white rounded hover:bg-gray-800"
                >
                  Edit
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FreelancerServices;
