import type { ChannelInfo, MessageInfo } from "@/interfaces";

// Get all available channels from config
export async function getChannels() {
  try {
    const response = await fetch("/api/archive/channels");

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data.channels as ChannelInfo[];
  } catch (error) {
    console.error("Error fetching available channels:", error);
    throw error;
  }
}

// Fetch message content for a post
export async function fetchMessageContent(threadId: string, messageId: string) {
  try {
    const params = new URLSearchParams({
      threadId: threadId.trim(),
      messageId: messageId.trim(),
    });
    const response = await fetch(`/api/archive/message-content?${params}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data.content as string;
  } catch (error) {
    console.error("Error fetching message content:", error);
    throw error;
  }
}

// Delete all attachments from a post
export async function deleteAttachments(threadId: string, messageId: string) {
  try {
    const response = await fetch("/api/archive/delete-attachments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        threadId: threadId.trim(),
        messageId: messageId.trim(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data as MessageInfo;
  } catch (error) {
    console.error("Error deleting attachments:", error);
    throw error;
  }
}

// Create a new post (thread) in a channel
export async function createPost(
  channelName: string,
  threadName: string,
  content: string,
  tags: string[] = [],
  files: File[] = []
) {
  try {
    const formData = new FormData();
    formData.append("channelName", channelName);
    formData.append("threadName", threadName);
    formData.append("content", content);

    if (tags && tags.length > 0) {
      formData.append("tags", JSON.stringify(tags));
    }

    if (files && files.length > 0) {
      files.forEach(file => formData.append("files", file));
    }

    const response = await fetch(`/api/archive/create-post`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data as MessageInfo;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}

// Post a message to an existing thread
export async function postToThread(threadId: string, content: string, files: File[] = []) {
  try {
    const formData = new FormData();
    formData.append("threadId", threadId);
    formData.append("content", content);

    if (files.length > 0) {
      files.forEach(file => formData.append("files", file));
    }

    const response = await fetch(`/api/archive/post-to-thread`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data as MessageInfo;
  } catch (error) {
    console.error("Error posting to thread:", error);
    throw error;
  }
}

// Edit an existing post
export async function editPost(threadId: string, messageId: string, content: string, files: File[] = []) {
  try {
    const formData = new FormData();
    formData.append("threadId", threadId);
    formData.append("messageId", messageId);
    formData.append("content", content);

    if (files.length > 0) {
      files.forEach(file => formData.append("files", file));
    }

    const response = await fetch(`/api/archive/edit-post`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data as MessageInfo;
  } catch (error) {
    console.error("Error editing post:", error);
    throw error;
  }
}

// Delete a post
export async function deletePost(threadId: string, messageId: string) {
  try {
    const response = await fetch(`/api/archive/delete-post`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ threadId, messageId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data as MessageInfo;
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}
