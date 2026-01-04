import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Paper,
  Stack,
  Chip,
  Snackbar,
  Fade,
  Tooltip,
  IconButton,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { CloudUpload, Close, Archive, UploadFile, ContentCopy } from "@mui/icons-material";
import { useDropzone, FileRejection } from "react-dropzone";
import { showDirectoryPicker } from "native-file-system-adapter";
import { hyperlink, messageLink } from "@discordjs/formatters";
import {
  getChannels,
  fetchMessageContent,
  deleteAttachments,
  createPost,
  postToThread,
  editPost,
} from "@/services/archiveService";
import type { ChannelInfo, MessageInfo, Workflow, LogEntry } from "@/types";
import { WorkflowAnalysisError } from "@/lib/errors";

function ArchiveManager() {
  // State for channel info
  const [channels, setChannels] = useState<ChannelInfo[]>([]);
  const [selectedChannelName, setSelectedChannelName] = useState("");
  const [selectedChannel, setSelectedChannel] = useState<ChannelInfo>();

  // State for the posting mode
  const [mode, setMode] = useState("");

  // State for form inputs
  const [threadTitle, setThreadTitle] = useState("");
  const [postThreadId, setPostThreadId] = useState("");
  const [editThreadId, setEditThreadId] = useState("");
  const [editMessageId, setMessageId] = useState("");

  const [messageContent, setMessageContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  // State for loading and errors
  const [loadingChannels, setLoadingChannels] = useState(true);
  const [loadingResize, setLoadingResize] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingFetchContent, setLoadingFetchContent] = useState(false);
  const [loadingDeleteAttachments, setLoadingDeleteAttachments] = useState(false);
  const [loadingWorkflow, setLoadingWorkflow] = useState(false);
  const [workflowProgress, setWorkflowProgress] = useState(0);
  const [workflowStatus, setWorkflowStatus] = useState("");
  const [analysisErrorsModal, setAnalysisErrorsModal] = useState<{
    open: boolean;
    errors: string[];
  }>({ open: false, errors: [] });
  type SnackbarSeverity = "success" | "info" | "warning" | "error";
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: SnackbarSeverity; key: number }>(
    {
      open: false,
      message: "",
      severity: "success",
      key: 0,
    }
  );

  function userLink(username: string, userId: string) {
    return hyperlink(username, `discord://-/users/${userId}`);
  }

  function processCustomMarkup(content: string) {
    if (!content) return content;
    return content.replaceAll(/@(.+?):(\d+)/g, (_, username, userId) => {
      return userLink(username, userId);
    });
  }

  const [logs, setLogs] = useState<LogEntry[]>([]);

  const showSnackbar = useCallback((message: string, severity: SnackbarSeverity = "success") => {
    setSnackbar(prev => ({
      open: true,
      message,
      severity,
      key: prev.key + 1,
    }));
  }, []);

  const addLog = useCallback((operation: string, { messageId, channelId, threadId, guildId }: MessageInfo) => {
    setLogs(prev => [
      {
        id: Date.now(),
        timestamp: new Date(),
        operation,
        messageId,
        threadId,
        channelId: channelId ?? threadId,
        guildId,
      },
      ...prev,
    ]);
  }, []);

  const loadChannels = useCallback(async () => {
    try {
      const channels = await getChannels();
      setChannels(channels);
    } catch (error) {
      console.error("Error loading channels:", error);
      showSnackbar("Failed to load channels", "error");
    } finally {
      setLoadingChannels(false);
    }
  }, [showSnackbar]);

  useEffect(() => {
    loadChannels();
  }, [loadChannels]);

  // Warn user before leaving if messageContent is not empty
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (messageContent.trim().length > 0 || loadingWorkflow) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [messageContent, loadingWorkflow]);

  // Update selected channel when channel name changes
  useEffect(() => {
    if (selectedChannelName && channels.length > 0) {
      const channel = channels.find(ch => ch.name === selectedChannelName);
      setSelectedChannel(channel);
    }
  }, [selectedChannelName, channels]);

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop(acceptedFiles: File[], fileRejections: FileRejection[]) {
      const maxFiles = 10;

      if (fileRejections.length > 0) {
        const reasons = fileRejections.map(({ file, errors }) => {
          const errorMessages = errors.map(e => e.message).join(", ");
          return `${file.name}: ${errorMessages}`;
        });
        showSnackbar(`Some files were rejected: ${reasons.join("; ")}`, "error");
        return;
      }

      if (acceptedFiles.length > maxFiles) {
        showSnackbar(`Too many files dropped. Discord allows a maximum of ${maxFiles} files per message.`, "error");
        return;
      }

      setFiles(acceptedFiles);
    },
    maxSize: 10 * 1024 * 1024, // 10 MB
    maxFiles: 10,
    multiple: true,
  });

  // Only allow numeric input for ID fields
  function handleNumericInput(setter: (value: string) => void) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replaceAll(/\D/g, "");
      setter(value);
    };
  }

  function handlePostPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const pastedText = e.clipboardData.getData("text");
    const ids = extractDiscordIds(pastedText);
    console.log(ids);
    if (ids.threadId) {
      setPostThreadId(ids.threadId);
      e.preventDefault();
    }
  }

  function handleEditPostPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const pastedText = e.clipboardData.getData("text");
    const ids = extractDiscordIds(pastedText);
    if (ids.threadId) {
      setEditThreadId(ids.threadId);
      setMessageId(ids.messageId || ids.threadId);
      e.preventDefault();
    }
  }

  function extractDiscordIds(input: string) {
    if (!input) return {};

    const match = input.trim().match(/\/channels\/\d+\/(\d+)(?:\/(\d+))?/);
    if (!match) return {};
    return { threadId: match[1] || "", messageId: match[2] || "" };
  }

  function handleTagSelect(tagName: string) {
    setSelectedTags(prev => {
      if (prev.includes(tagName)) {
        return prev.filter(t => t !== tagName);
      } else {
        return [...prev, tagName];
      }
    });
  }

  function loadImage(file: File) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve(img);
        URL.revokeObjectURL(img.src);
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  async function resizeImages(files: File[]) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Error while getting canvas context");
    }
    const resizedImageAspectRatio = 3 / 2;
    const resizedFiles = [];

    for (const file of files) {
      if (file.type.startsWith("image/")) {
        try {
          const img = await loadImage(file);

          let newWidth, newHeight;
          if (img.width > img.height) {
            newWidth = img.width * resizedImageAspectRatio;
            newHeight = img.height * resizedImageAspectRatio;
          } else {
            newWidth = img.width * resizedImageAspectRatio;
            newHeight = img.height * resizedImageAspectRatio;
          }

          canvas.width = newWidth;
          canvas.height = newHeight;

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, (canvas.width - img.width) / 2, (canvas.height - img.height) / 2, img.width, img.height);

          const blob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob(b => {
              if (b) {
                resolve(b);
              } else {
                reject(new Error("Failed to create blob from canvas"));
              }
            }, "image/png");
          });

          const resizedFile = new File([blob], file.name, { type: file.type });
          resizedFiles.push(resizedFile);
        } catch (error) {
          console.error(`Error resizing ${file.name}:`, error);
          resizedFiles.push(file);
        }
      } else {
        resizedFiles.push(file);
      }
    }
    return resizedFiles;
  }

  async function handleResizeImages() {
    if (!files.length) return;

    setLoadingResize(true);
    try {
      const resizedFiles = await resizeImages(files);
      setFiles(resizedFiles);
      showSnackbar("Images resized successfully!", "success");
    } catch (error) {
      console.error("Error resizing images:", error);
      showSnackbar("Failed to resize images", "error");
    } finally {
      setLoadingResize(false);
    }
  }

  async function handleFetchPostContent() {
    if (!editThreadId.trim() || !editMessageId.trim()) return;
    if (messageContent.trim().length > 0) {
      const confirmReplace = window.confirm(
        "There is already content in the message box. Do you want to replace it with the fetched content?"
      );
      if (!confirmReplace) return;
    }
    setLoadingFetchContent(true);
    try {
      const content = await fetchMessageContent(editThreadId, editMessageId);
      setMessageContent(content);
      setSnackbar({ open: true, severity: "success", message: "Message content fetched!", key: Date.now() });
    } catch (error) {
      setSnackbar({ open: true, severity: "error", message: error.message, key: Date.now() });
    } finally {
      setLoadingFetchContent(false);
    }
  }

  async function handleDeleteAttachments() {
    if (!editThreadId.trim() || !editMessageId.trim()) return;
    const confirmDelete = window.confirm(
      "Are you sure you want to delete all attachments from this post? This action cannot be undone."
    );
    if (!confirmDelete) return;
    setLoadingDeleteAttachments(true);
    try {
      const { messageId, threadId, guildId } = await deleteAttachments(editThreadId, editMessageId);
      setSnackbar({ open: true, severity: "success", message: "Attachments deleted successfully!", key: Date.now() });
      addLog("Deleted attachments", {
        messageId,
        threadId,
        channelId: threadId,
        guildId,
      });
    } catch (error) {
      setSnackbar({ open: true, severity: "error", message: error.message, key: Date.now() });
    } finally {
      setLoadingDeleteAttachments(false);
    }
  }

  async function handleSubmit() {
    try {
      setLoadingSubmit(true);

      const processedContent = processCustomMarkup(messageContent);

      if (mode === "create") {
        if (selectedChannel) {
          const result = await createPost(selectedChannel.name, threadTitle, processedContent, selectedTags, files);
          showSnackbar("Post created successfully!", "success");
          addLog(`Created post "${threadTitle}"`, result);
        } else {
          showSnackbar("No channel selected", "error");
        }
      } else if (mode === "post") {
        const result = await postToThread(postThreadId, processedContent, files);
        showSnackbar("Message posted successfully!", "success");
        addLog("Posted message to thread", result);
      } else if (mode === "edit") {
        const result = await editPost(editThreadId, editMessageId, processedContent, files);
        showSnackbar("Post updated successfully!", "success");
        addLog("Edited message", result);
      }
    } catch (error) {
      console.error("Error submitting:", error);
      showSnackbar(error.toString(), "error");
    } finally {
      setLoadingSubmit(false);
    }
  }

  async function handleRunWorkflow() {
    if (loadingWorkflow) return;

    try {
      const rootDirHandle = await showDirectoryPicker();

      let workflowFileHandle;
      try {
        workflowFileHandle = await rootDirHandle.getFileHandle("workflow.json");
      } catch {
        throw new Error("workflow.json file not found in selected directory");
      }

      const workflowFile = await workflowFileHandle.getFile();
      const workflowText = await workflowFile.text();
      let workflow: Workflow;
      try {
        workflow = JSON.parse(workflowText);
      } catch {
        throw new Error("Invalid JSON in workflow.json");
      }

      if (!workflow.tasks || !Array.isArray(workflow.tasks)) {
        throw new Error("Invalid workflow: missing tasks array");
      }

      const channelName = workflow.channel;
      if (!channelName) {
        throw new Error("Workflow must specify a channel");
      }

      const channel = channels.find(ch => ch.name === channelName);
      if (!channel) {
        throw new Error("Channel specified in the workflow not found");
      }

      const users = workflow.users;
      const usersRegex = users ? new RegExp(`@(${Object.keys(users).join("|")})`, "g") : null;

      setLoadingWorkflow(true);
      setWorkflowProgress(0);
      setWorkflowStatus("Analyzing workflow files...");

      function replaceMentions(content: string) {
        let processedContent = processCustomMarkup(content);

        if (users && usersRegex) {
          processedContent = processedContent.replaceAll(usersRegex, (_, username) => {
            const userId = users[username];
            return userLink(username, userId);
          });
        }

        return processedContent;
      }

      // Analyze all files before execution and cache them
      const analysisErrors: string[] = [];
      const contentCache = new Map<string, string>();
      const fileCache = new Map<string, File>();

      for (let i = 0; i < workflow.tasks.length; i++) {
        const task = workflow.tasks[i];
        const taskKey = `task_${i}`;

        let taskDirHandle;
        try {
          taskDirHandle = await rootDirHandle.getDirectoryHandle(task.folder);
        } catch {
          analysisErrors.push(`Task ${i + 1}: Folder "${task.folder}" not found`);
          continue;
        }

        if (task.tags && Array.isArray(task.tags)) {
          const availableTags = channel.tags || [];
          const invalidTags = task.tags.filter(tag => !availableTags.includes(tag));
          if (invalidTags.length > 0) {
            analysisErrors.push(`Task ${i + 1}: Invalid tag(s) "${invalidTags.join('", "')}"`);
          }
        }

        if (task.content_file) {
          try {
            const fileHandle = await taskDirHandle.getFileHandle(task.content_file);
            const file = await fileHandle.getFile();
            let content = await file.text();

            content = replaceMentions(content);

            if (content.length > 2000) {
              analysisErrors.push(
                `Task ${i + 1}: Content file "${task.content_file}" exceeds 2000 characters (${content.length} chars)`
              );
            }
            contentCache.set(`${taskKey}_content`, content);
          } catch {
            analysisErrors.push(`Task ${i + 1}: Content file "${task.content_file}" not found`);
          }
        } else if (task.content) {
          const content = replaceMentions(task.content);

          if (content.length > 2000) {
            analysisErrors.push(`Task ${i + 1}: Content exceeds 2000 characters (${content.length} chars)`);
          }
        }

        if (task.files && Array.isArray(task.files)) {
          for (const fileName of task.files) {
            try {
              const fileHandle = await taskDirHandle.getFileHandle(fileName);
              const file = await fileHandle.getFile();
              fileCache.set(`${taskKey}_file_${fileName}`, file);
            } catch {
              analysisErrors.push(`Task ${i + 1}: File "${fileName}" not found in folder "${task.folder}"`);
            }
          }
        }

        if (task.thread_messages && Array.isArray(task.thread_messages)) {
          for (let j = 0; j < task.thread_messages.length; j++) {
            const threadMsg = task.thread_messages[j];
            const msgKey = `${taskKey}_msg_${j}`;

            if (threadMsg.content_file) {
              try {
                const fileHandle = await taskDirHandle.getFileHandle(threadMsg.content_file);
                const file = await fileHandle.getFile();
                let content = await file.text();

                content = replaceMentions(content);

                if (content.length > 2000) {
                  analysisErrors.push(
                    `Task ${i + 1}, Message ${j + 1}: Content file "${
                      threadMsg.content_file
                    }" exceeds 2000 characters (${content.length} chars)`
                  );
                }
                contentCache.set(`${msgKey}_content`, content);
              } catch {
                analysisErrors.push(
                  `Task ${i + 1}, Message ${j + 1}: Content file "${threadMsg.content_file}" not found`
                );
              }
            } else if (threadMsg.content) {
              const content = replaceMentions(threadMsg.content);

              if (content.length > 2000) {
                analysisErrors.push(`Task ${i + 1}: Content exceeds 2000 characters (${content.length} chars)`);
              }
            }

            if (threadMsg.files && Array.isArray(threadMsg.files)) {
              for (const fileName of threadMsg.files) {
                try {
                  const fileHandle = await taskDirHandle.getFileHandle(fileName);
                  const file = await fileHandle.getFile();
                  fileCache.set(`${msgKey}_file_${fileName}`, file);
                } catch {
                  analysisErrors.push(
                    `Task ${i + 1}, Message ${j + 1}: File "${fileName}" not found in folder "${task.folder}"`
                  );
                }
              }
            }
          }
        }
      }

      if (analysisErrors.length > 0) {
        throw new WorkflowAnalysisError(analysisErrors);
      }

      setWorkflowStatus("Analysis complete. Starting workflow execution...");

      // Token replacement utilities
      const tokenRegex = /\{\{([^{}]+)\}\}/g;
      const tokensMap = new Map<string, MessageInfo>();
      const messagesWithTokens: Array<{
        threadId: string;
        messageId: string;
        originalContent: string;
        guildId: string;
      }> = [];

      const replaceTokens = (content: string) => {
        return content.replaceAll(tokenRegex, (match, token) => {
          const tokenData = tokensMap.get(token);
          if (tokenData) {
            return messageLink(tokenData.threadId, tokenData.messageId, tokenData.guildId);
          }
          return match;
        });
      };

      const threadMessagePromises: Promise<void>[] = [];

      // Execute all tasks
      for (let i = 0; i < workflow.tasks.length; i++) {
        const task = workflow.tasks[i];
        const taskKey = `task_${i}`;

        try {
          const progress = (i / workflow.tasks.length) * 100;
          setWorkflowProgress(progress);
          setWorkflowStatus(`Task ${i + 1}/${workflow.tasks.length}: ${task.thread_name}`);

          let content = contentCache.get(`${taskKey}_content`) || "";

          if (content && new RegExp(tokenRegex).test(content)) {
            content = replaceTokens(content);
          }

          let taskFiles: File[] = [];
          if (task.files && Array.isArray(task.files)) {
            for (const fileName of task.files) {
              const cachedFile = fileCache.get(`${taskKey}_file_${fileName}`);
              if (cachedFile) {
                taskFiles.push(cachedFile);
              }
            }

            if (task.resize_images && taskFiles.length > 0) {
              taskFiles = await resizeImages(taskFiles);
            }
          }

          const tags = task.tags;

          const mainResult = await createPost(channelName, task.thread_name, content, tags, taskFiles);
          addLog(`Created post "${task.thread_name}"`, mainResult);

          if (task.name) {
            tokensMap.set(task.name, mainResult);
          }

          // Check if content had unresolved tokens - if so, we need to edit it later
          const originalContent = contentCache.get(`${taskKey}_content`) || "";
          if (originalContent && new RegExp(tokenRegex).test(originalContent)) {
            const threadId = mainResult.threadId || mainResult.channelId || "";
            const messageId = mainResult.messageId;
            messagesWithTokens.push({ threadId, messageId, originalContent, guildId: mainResult.guildId });
          }

          if (task.thread_messages && Array.isArray(task.thread_messages)) {
            const threadId = mainResult.threadId || mainResult.channelId || "";
            const threadMessages = task.thread_messages;
            const threadName = task.thread_name;

            // Process thread messages in the background
            const threadPromise = (async () => {
              try {
                for (let j = 0; j < threadMessages.length; j++) {
                  const threadMsg = threadMessages[j];
                  const msgKey = `${taskKey}_msg_${j}`;

                  if (threadMsg.wait) {
                    const sevenMinutes = 7 * 60 * 1000;
                    await new Promise(resolve => setTimeout(resolve, sevenMinutes));
                  }

                  let msgContent = contentCache.get(`${msgKey}_content`) || threadMsg.content || "";
                  const originalMsgContent = msgContent;

                  if (msgContent && new RegExp(tokenRegex).test(msgContent)) {
                    msgContent = replaceTokens(msgContent);
                  }

                  const msgFiles: File[] = [];
                  if (threadMsg.files && Array.isArray(threadMsg.files)) {
                    for (const fileName of threadMsg.files) {
                      const cachedFile = fileCache.get(`${msgKey}_file_${fileName}`);
                      if (cachedFile) {
                        msgFiles.push(cachedFile);
                      }
                    }
                  }

                  if (msgContent || msgFiles.length > 0) {
                    const msgResult = await postToThread(threadId, msgContent, msgFiles);
                    addLog(`Posted message ${j + 1} to thread "${threadName}"`, {
                      ...mainResult,
                      threadId,
                      messageId: msgResult.messageId,
                    });

                    if (threadMsg.name) {
                      tokensMap.set(threadMsg.name, {
                        guildId: mainResult.guildId,
                        threadId,
                        messageId: msgResult.messageId,
                      });
                    }

                    if (originalMsgContent && new RegExp(tokenRegex).test(originalMsgContent)) {
                      messagesWithTokens.push({
                        threadId,
                        messageId: msgResult.messageId,
                        originalContent: originalMsgContent,
                        guildId: mainResult.guildId,
                      });
                    }
                  }
                }
              } catch (error) {
                console.error(`Error posting thread messages for "${threadName}":`, error);
                const errorMessage = error instanceof Error ? error.message : String(error);
                showSnackbar(`Error posting messages to "${threadName}": ${errorMessage}`, "error");
              }
            })();

            threadMessagePromises.push(threadPromise);
          }
        } catch (error) {
          console.error(`Error executing task ${i + 1}:`, error);
          const errorMessage = error instanceof Error ? error.message : String(error);
          showSnackbar(`Error in task ${i + 1}: ${errorMessage}`, "error");

          const shouldContinue = window.confirm(
            `Error in task "${task.thread_name}": ${errorMessage}\n\nContinue with remaining tasks?`
          );
          if (!shouldContinue) {
            break;
          }
        }
      }

      setWorkflowProgress(100);
      setWorkflowStatus("Main workflow completed! Waiting for background tasks...");

      if (threadMessagePromises.length > 0) {
        await Promise.all(threadMessagePromises);
      }

      if (messagesWithTokens.length > 0) {
        setWorkflowStatus("Resolving token references...");

        for (const msg of messagesWithTokens) {
          try {
            const finalContent = replaceTokens(msg.originalContent);

            if (finalContent !== msg.originalContent) {
              await editPost(msg.threadId, msg.messageId, finalContent, []);
              addLog("Resolved token references", {
                messageId: msg.messageId,
                threadId: msg.threadId,
                channelId: msg.threadId,
                guildId: msg.guildId,
              });
            }
          } catch (error) {
            console.error(`Error resolving tokens for message ${msg.messageId}:`, error);
          }
        }
      }

      setWorkflowStatus("All tasks completed!");
      showSnackbar("Workflow completed successfully!", "success");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      if (error instanceof WorkflowAnalysisError) {
        setAnalysisErrorsModal({ open: true, errors: error.errors });
        return;
      }

      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(errorMessage);
      showSnackbar(errorMessage, "error");
    } finally {
      setLoadingWorkflow(false);
      // Reset progress after a delay
      setTimeout(() => {
        setWorkflowProgress(0);
        setWorkflowStatus("");
      }, 3000);
    }
  }

  const isSubmitDisabled =
    !mode ||
    (!messageContent.trim() && files.length === 0) ||
    loadingSubmit ||
    (mode === "create" && (!threadTitle.trim() || !selectedChannel)) ||
    (mode === "post" && !postThreadId.trim()) ||
    (mode === "edit" && (!editThreadId.trim() || !editMessageId.trim()));

  return (
    <Fade in timeout={800}>
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 }, px: { xs: 1, sm: 3 } }}>
        <Box sx={{ mb: { xs: 3, sm: 4 }, textAlign: "center" }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 3,
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
              background: theme =>
                `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.success.main})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textAlign: "center",
            }}
          >
            Archive Manager
          </Typography>
        </Box>

        <Card>
          <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            {/* Action Selection */}
            <Box sx={{ mb: 3 }}>
              <Paper variant="outlined" sx={{ p: { xs: 1, sm: 2 }, borderRadius: 2 }}>
                <FormControl component="fieldset" fullWidth>
                  <RadioGroup value={mode} onChange={e => setMode(e.target.value)} sx={{ gap: 1 }}>
                    {/* Create Post Option */}
                    <Paper
                      variant="outlined"
                      sx={{
                        p: { xs: 1.5, sm: 2 },
                        borderRadius: 2,
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        border: "2px solid",
                        borderColor: mode === "create" ? "primary.main" : "divider",
                        backgroundColor: mode === "create" ? "primary.50" : "background.paper",
                        boxShadow: mode === "create" ? 2 : 0,
                        "&:hover": {
                          backgroundColor: "action.hover",
                          borderColor: "primary.main",
                          boxShadow: 1,
                        },
                      }}
                    >
                      <FormControlLabel
                        value="create"
                        control={<Radio />}
                        label={
                          <Box sx={{ ml: { xs: 0.5, sm: 1 } }}>
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: 600, fontSize: { xs: "0.95rem", sm: "1rem" } }}
                            >
                              Create a new post
                            </Typography>
                          </Box>
                        }
                      />
                      {mode === "create" && (
                        <Box sx={{ ml: { xs: 3, sm: 5 }, mt: 2 }}>
                          {/* Channel Selection */}
                          <FormControl fullWidth sx={{ mb: 2 }}>
                            <Select
                              value={selectedChannelName}
                              onChange={e => setSelectedChannelName(e.target.value)}
                              displayEmpty
                              sx={{ borderRadius: 2 }}
                              MenuProps={{
                                PaperProps: {
                                  style: {
                                    maxHeight: 300,
                                  },
                                },
                              }}
                              disabled={loadingChannels}
                              startAdornment={loadingChannels ? <CircularProgress size={20} sx={{ mr: 2 }} /> : null}
                            >
                              <MenuItem value="" disabled>
                                <em>{loadingChannels ? "Loading channels..." : "Select a channel..."}</em>
                              </MenuItem>
                              {!loadingChannels &&
                                channels.map(channel => (
                                  <MenuItem key={channel.name} value={channel.name}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                      <Archive fontSize="small" color="primary" />
                                      {channel.display_name}
                                    </Box>
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>

                          <TextField
                            fullWidth
                            label="Thread Title"
                            value={threadTitle}
                            onChange={e => setThreadTitle(e.target.value)}
                            variant="outlined"
                            sx={{ mb: 2 }}
                          />
                          {/* Tag Selector */}
                          {selectedChannel && selectedChannel.tags && (
                            <FormControl fullWidth sx={{ mb: 2 }}>
                              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
                                {selectedChannel.tags.map(tag => (
                                  <Chip
                                    key={tag}
                                    label={tag}
                                    clickable
                                    color={selectedTags.includes(tag) ? "primary" : "default"}
                                    variant={selectedTags.includes(tag) ? "filled" : "outlined"}
                                    onClick={() => handleTagSelect(tag)}
                                  />
                                ))}
                              </Box>
                            </FormControl>
                          )}
                        </Box>
                      )}
                    </Paper>

                    {/* Post in Thread Option */}
                    <Paper
                      variant="outlined"
                      sx={{
                        p: { xs: 1.5, sm: 2 },
                        borderRadius: 2,
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        border: "2px solid",
                        borderColor: mode === "post" ? "primary.main" : "divider",
                        backgroundColor: mode === "post" ? "primary.50" : "background.paper",
                        boxShadow: mode === "post" ? 2 : 0,
                        "&:hover": {
                          backgroundColor: "action.hover",
                          borderColor: "primary.main",
                          boxShadow: 1,
                        },
                      }}
                    >
                      <FormControlLabel
                        value="post"
                        control={<Radio />}
                        label={
                          <Box sx={{ ml: { xs: 0.5, sm: 1 } }}>
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: 600, fontSize: { xs: "0.95rem", sm: "1rem" } }}
                            >
                              Post inside a thread
                            </Typography>
                          </Box>
                        }
                      />
                      {mode === "post" && (
                        <Box sx={{ ml: { xs: 3, sm: 5 }, mt: 2 }}>
                          <TextField
                            fullWidth
                            type="text"
                            label="Thread ID"
                            value={postThreadId}
                            onChange={handleNumericInput(setPostThreadId)}
                            onPaste={handlePostPaste}
                            helperText="You can paste a Discord message URL or enter the thread ID directly"
                            inputMode="numeric"
                          />
                        </Box>
                      )}
                    </Paper>

                    {/* Edit Post Option */}
                    <Paper
                      variant="outlined"
                      onClick={() => setMode("edit")}
                      sx={{
                        p: { xs: 1.5, sm: 2 },
                        borderRadius: 2,
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        border: "2px solid",
                        borderColor: mode === "edit" ? "primary.main" : "divider",
                        backgroundColor: mode === "edit" ? "primary.50" : "background.paper",
                        boxShadow: mode === "edit" ? 2 : 0,
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "action.hover",
                          borderColor: "primary.main",
                          boxShadow: 1,
                        },
                      }}
                    >
                      <FormControlLabel
                        value="edit"
                        control={<Radio />}
                        label={
                          <Box sx={{ ml: { xs: 0.5, sm: 1 } }}>
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: 600, fontSize: { xs: "0.95rem", sm: "1rem" } }}
                            >
                              Edit an existing post
                            </Typography>
                          </Box>
                        }
                      />
                      {mode === "edit" && (
                        <Box sx={{ ml: { xs: 3, sm: 5 }, mt: 2 }}>
                          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                            <TextField
                              type="text"
                              label="Thread ID"
                              value={editThreadId}
                              onChange={handleNumericInput(setEditThreadId)}
                              onPaste={handleEditPostPaste}
                              sx={{ flex: 1 }}
                              inputMode="numeric"
                            />
                            <TextField
                              type="text"
                              label="Message ID"
                              value={editMessageId}
                              onChange={handleNumericInput(setMessageId)}
                              onPaste={handleEditPostPaste}
                              sx={{ flex: 1 }}
                              inputMode="numeric"
                            />
                          </Stack>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mt: 1, display: "block", fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
                          >
                            Paste a Discord message URL to auto-fill both fields, or enter IDs directly
                          </Typography>

                          {/* Action buttons for edit mode */}
                          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 3 }}>
                            <Button
                              variant="outlined"
                              color="info"
                              onClick={handleFetchPostContent}
                              disabled={!editThreadId.trim() || !editMessageId.trim() || loadingFetchContent}
                              size="medium"
                              sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                            >
                              {loadingFetchContent ? "Fetching..." : "Fetch Post Content"}
                            </Button>

                            <Button
                              variant="outlined"
                              color="error"
                              onClick={handleDeleteAttachments}
                              disabled={!editThreadId.trim() || !editMessageId.trim() || loadingDeleteAttachments}
                              size="medium"
                              sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                            >
                              {loadingDeleteAttachments ? "Deleting..." : "Delete Attachments"}
                            </Button>
                          </Stack>
                        </Box>
                      )}
                    </Paper>
                  </RadioGroup>
                </FormControl>
              </Paper>
            </Box>

            {/* Message Content Section*/}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Message Content"
                multiline
                rows={8}
                value={messageContent}
                onChange={e => setMessageContent(e.target.value)}
                variant="outlined"
                sx={{
                  "& textarea": {
                    resize: "vertical",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  },
                }}
              />
            </Box>

            {/* File Upload Section */}
            <Box sx={{ mb: 3 }}>
              <Box
                {...getRootProps()}
                sx={{
                  p: { xs: 2, sm: 3 },
                  borderRadius: 2,
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  border: `${isDragActive ? "3px" : "2px"} dashed`,
                  borderColor: isDragReject
                    ? "error.main"
                    : isDragAccept
                    ? "success.main"
                    : isDragActive
                    ? "primary.main"
                    : "divider",
                  backgroundColor: isDragReject
                    ? "error.50"
                    : isDragAccept
                    ? "success.50"
                    : isDragActive
                    ? "primary.50"
                    : "transparent",
                  outline: "none",
                  "&:hover": {
                    borderColor: "primary.main",
                    backgroundColor: "primary.50",
                  },
                }}
              >
                <input {...getInputProps()} />
                <Stack direction="column" spacing={2} alignItems="center" justifyContent="center">
                  <UploadFile
                    sx={{
                      fontSize: { xs: 40, sm: 48 },
                      color: isDragReject
                        ? "error.main"
                        : isDragAccept
                        ? "success.main"
                        : isDragActive
                        ? "primary.main"
                        : "text.secondary",
                      transition: "color 0.2s ease",
                    }}
                  />

                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: { xs: "1rem", sm: "1.1rem" },
                        fontWeight: 600,
                        color: isDragReject
                          ? "error.main"
                          : isDragAccept
                          ? "success.main"
                          : isDragActive
                          ? "primary.main"
                          : "text.primary",
                      }}
                    >
                      {isDragReject
                        ? "Some files are rejected"
                        : isDragAccept
                        ? "Drop files here"
                        : isDragActive
                        ? "Drop files here to upload them"
                        : "Attachments"}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" }, mt: 1 }}
                    >
                      {isDragActive
                        ? "Release to upload files"
                        : "Supports multiple files up to 10MB each (max 10 files)"}
                    </Typography>
                  </Box>

                  {!isDragActive && (
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                      <Button
                        variant="outlined"
                        startIcon={<CloudUpload />}
                        sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
                      >
                        Choose Files
                      </Button>

                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={e => {
                          e.stopPropagation();
                          handleResizeImages();
                        }}
                        disabled={loadingResize || !files.length || !files.some(file => file.type.startsWith("image/"))}
                        sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
                      >
                        {loadingResize ? (
                          <>
                            <CircularProgress size="1rem" sx={{ mr: 1 }} />
                            Resizing...
                          </>
                        ) : (
                          "Resize Images"
                        )}
                      </Button>
                    </Stack>
                  )}
                </Stack>

                {files.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {files.map((file, index) => (
                        <Tooltip key={file.name + index} title={file.name} arrow>
                          <Chip
                            label={file.name}
                            onDelete={() => {
                              setFiles(files.filter((_, i) => i !== index));
                            }}
                            deleteIcon={<Close />}
                            color="primary"
                            variant="outlined"
                            sx={{
                              maxWidth: { xs: 200, sm: 250 },
                              fontSize: { xs: "0.7rem", sm: "0.8rem" },
                            }}
                          />
                        </Tooltip>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Box>
            </Box>

            <Button
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
              sx={{
                py: { xs: 1.5, sm: 2 },
                fontSize: { xs: "0.95rem", sm: "1.1rem" },
              }}
            >
              {loadingSubmit ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  Processing...
                </Box>
              ) : !mode ? (
                "Select an action above to continue"
              ) : mode === "create" ? (
                "Create Post"
              ) : mode === "post" ? (
                "Send Message"
              ) : mode === "edit" ? (
                "Update Message"
              ) : (
                "Submit"
              )}
            </Button>
            <Divider sx={{ my: 2 }} />
            <Button
              fullWidth
              variant="outlined"
              onClick={handleRunWorkflow}
              disabled={loadingWorkflow || loadingChannels}
              sx={{
                py: { xs: 1.5, sm: 2 },
                fontSize: { xs: "0.95rem", sm: "1.1rem" },
              }}
            >
              {loadingWorkflow ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  Running Workflow...
                </Box>
              ) : (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Archive />
                  Run Workflow
                </Box>
              )}
            </Button>

            {/* Workflow Progress */}
            {(loadingWorkflow || workflowProgress > 0) && (
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ flex: 1, fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
                  >
                    {workflowStatus}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
                  >
                    {Math.round(workflowProgress)}%
                  </Typography>
                </Box>
                <LinearProgress variant="determinate" value={workflowProgress} sx={{ borderRadius: 1, height: 8 }} />
              </Box>
            )}
          </CardContent>
        </Card>

        <Snackbar
          key={snackbar.key}
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Logs Panel */}
        {logs.length > 0 && (
          <Card sx={{ mt: 3 }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Logs
              </Typography>
              <Stack spacing={1}>
                {logs.map((log, index) => {
                  const url = messageLink(log.threadId!, log.messageId!, log.guildId);
                  return (
                    <Fade in key={log.id} timeout={500} style={{ transformOrigin: "top" }}>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: index === 0 ? "success.50" : "background.paper",
                          transition: "background-color 1s ease",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            minHeight: 48,
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ minWidth: 100, alignSelf: "center" }}
                          >
                            {log.timestamp.toLocaleTimeString()}
                          </Typography>
                          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                            <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5, alignSelf: "flex-start" }}>
                              {log.operation}
                            </Typography>
                            {url && (
                              <Typography
                                variant="caption"
                                component="a"
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                  color: "primary.main",
                                  textDecoration: "none",
                                  "&:hover": { textDecoration: "underline" },
                                  wordBreak: "break-all",
                                  alignSelf: "flex-start",
                                }}
                              >
                                {url}
                              </Typography>
                            )}
                          </Box>
                          {url && (
                            <Tooltip title="Copy link" arrow>
                              <IconButton
                                size="small"
                                color="default"
                                onClick={() => {
                                  navigator.clipboard.writeText(url);
                                  setSnackbar(prev => ({
                                    ...prev,
                                    open: true,
                                    message: "Link copied to clipboard!",
                                    severity: "info",
                                    key: prev.key + 1,
                                  }));
                                }}
                                sx={{ ml: 1, alignSelf: "center" }}
                              >
                                <ContentCopy fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </Paper>
                    </Fade>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* Workflow Analysis Errors Modal */}
        <Dialog
          open={analysisErrorsModal.open}
          onClose={() => setAnalysisErrorsModal({ open: false, errors: [] })}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h6" component="span" sx={{ fontWeight: 600, color: "error.main" }}>
                Workflow Analysis Errors
              </Typography>
              <Chip label={`${analysisErrorsModal.errors.length} error(s)`} color="error" size="small" />
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Please fix the following errors in your workflow before running it:
            </Typography>
            <List dense>
              {analysisErrorsModal.errors.map((error, index) => (
                <ListItem
                  key={index}
                  sx={{
                    bgcolor: "error.50",
                    mb: 1,
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: "error.200",
                  }}
                >
                  <ListItemText
                    primary={error}
                    primaryTypographyProps={{
                      variant: "body2",
                      sx: { fontFamily: "monospace", fontSize: "0.875rem" },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button
              onClick={() => setAnalysisErrorsModal({ open: false, errors: [] })}
              variant="contained"
              color="primary"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Fade>
  );
}

export default ArchiveManager;
