import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";
import User from "@models/user";

export const GET = async (request, { params }) => {
  try {
    await connectToDB();

    // Check if params.id is a username or user ID
    let userId = params.id;
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      // If not a MongoDB ObjectId, treat as username
      const user = await User.findOne({ username: userId });
      if (!user) {
        return new Response("User not found", { status: 404 });
      }
      userId = user._id;
    }

    const prompts = await Prompt.find({
      creator: userId,
    }).populate("creator");

    return new Response(JSON.stringify(prompts), { status: 200 });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return new Response("Failed to fetch user posts", { status: 500 });
  }
};
