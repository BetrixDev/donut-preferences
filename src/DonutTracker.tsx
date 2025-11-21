import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../convex/_generated/dataModel";

export function DonutTracker() {
  const friends = useQuery(api.friends.list) || [];
  const donuts = useQuery(api.donuts.list) || [];
  const [newFriendName, setNewFriendName] = useState("");
  const [selectedFriend, setSelectedFriend] = useState<Id<"friends"> | null>(
    null
  );

  const addFriend = useMutation(api.friends.add);
  const updateDonutPreference = useMutation(api.friends.updateDonutPreference);
  const removeFriend = useMutation(api.friends.remove);

  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFriendName.trim()) return;

    try {
      await addFriend({ name: newFriendName.trim() });
      setNewFriendName("");
      toast.success("Friend added!");
    } catch {
      toast.error("Failed to add friend");
    }
  };

  const handleDonutSelection = async (
    friendId: Id<"friends">,
    donutName: string
  ) => {
    try {
      await updateDonutPreference({ friendId, donutName });
      toast.success("Donut preference updated!");
    } catch {
      toast.error("Failed to update preference");
    }
  };

  const handleRemoveFriend = async (friendId: Id<"friends">) => {
    try {
      await removeFriend({ friendId });
      toast.success("Friend removed");
    } catch {
      toast.error("Failed to remove friend");
    }
  };

  return (
    <div className="space-y-8">
      {/* Add Friend Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Add a Friend
        </h2>
        <form onSubmit={(e) => void handleAddFriend(e)} className="flex gap-3">
          <input
            type="text"
            value={newFriendName}
            onChange={(e) => setNewFriendName(e.target.value)}
            placeholder="Friend's name"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-medium"
          >
            Add Friend
          </button>
        </form>
      </div>

      {/* Friends List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Friends & Their Donut Preferences
        </h2>

        {friends.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No friends added yet. Add some friends to track their donut
            preferences!
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {friends.map((friend) => (
              <div
                key={friend._id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg text-gray-800">
                    {friend.name}
                  </h3>
                  <button
                    onClick={() => void handleRemoveFriend(friend._id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>

                {friend.favoriteDonut ? (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-1">
                      Favorite Donut:
                    </p>
                    <div className="flex items-center gap-2 p-2 bg-pink-50 rounded-lg">
                      {(() => {
                        const favoriteDonut = donuts.find(
                          (d) => d.name === friend.favoriteDonut
                        );
                        return favoriteDonut?.image ? (
                          <img
                            src={favoriteDonut.image}
                            alt={friend.favoriteDonut}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl">🍩</span>
                        );
                      })()}
                      <span className="font-medium text-pink-700">
                        {friend.favoriteDonut}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm mb-3">
                    No donut preference set
                  </p>
                )}

                <button
                  onClick={() =>
                    setSelectedFriend(
                      selectedFriend === friend._id ? null : friend._id
                    )
                  }
                  className="w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                >
                  {selectedFriend === friend._id ? "Cancel" : "Change Donut"}
                </button>

                {selectedFriend === friend._id && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {donuts.map((donut) => (
                      <button
                        key={donut._id}
                        onClick={() => {
                          void handleDonutSelection(friend._id, donut.name);
                          setSelectedFriend(null);
                        }}
                        className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:bg-pink-50 hover:border-pink-300 transition-colors text-sm"
                      >
                        {donut.image ? (
                          <img
                            src={donut.image}
                            alt={donut.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-lg">🍩</span>
                        )}
                        <span className="truncate">{donut.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
