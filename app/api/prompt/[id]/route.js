import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";

// GET (read)

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const prompt = await Prompt.findById(params.id).populate("creator");
    if (!prompt) return new Response("Prompt not found", { status: 404 });
    return new Response(JSON.stringify(prompt), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch prompt", { status: 500 });
  }
};

//PATCH (update)

export const PATCH = async (req, { params }) => {
  const { prompt, tag } = await req.json();

  try {
    await connectToDB();
    const existingPrompt = await Prompt.findById(params.id);
    if (!existingPrompt)
      return new Response("Prompt not found", { status: 404 });
    existingPrompt.prompt = prompt;
    existingPrompt.tag = tag;
    await existingPrompt.save();
    return new Response(JSON.stringify(existingPrompt), { status: 200 });
  } catch (error) {
    return new Response("Failed to update prompt", { status: 500 });
  }
};

//DELETE (delete)

export const DELETE = async (request, { params }) => {
  try {
    await connectToDB();

    // Check if the prompt exists
    const prompt = await Prompt.findById(params.id);
    if (!prompt) {
      return new Response("Prompt not found", { status: 404 });
    }

    // Delete the prompt
    await Prompt.findByIdAndDelete(params.id);

    return new Response("Prompt deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting prompt:", error);
    return new Response("Failed to delete prompt", { status: 500 });
  }
};
