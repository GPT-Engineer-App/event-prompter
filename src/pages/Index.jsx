import { useState, useEffect } from "react";
import { Box, Button, FormControl, FormLabel, Input, Textarea, VStack, HStack, Text, Heading, useToast, Card, CardHeader, CardBody, useDisclosure } from "@chakra-ui/react";
import CreatePromptModal from "../components/CreatePromptModal";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import Navbar from "../components/Navbar";

const API_URL = "http://localhost:1337/api";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("kristian2");
  const [password, setPassword] = useState("");
  const [prompts, setPrompts] = useState([]);

  const [editingPromptId, setEditingPromptId] = useState(null);
  const toast = useToast();
  const { isOpen: isCreatePromptOpen, onOpen: onCreatePromptOpen, onClose: onCreatePromptClose } = useDisclosure();

  useEffect(() => {
    fetchPrompts();
  }, []);

  const login = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/local`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier: username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.jwt);
        setIsLoggedIn(true);
        fetchPrompts(data.jwt);
        toast({
          title: "Login successful",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Login failed",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const register = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/local/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        toast({
          title: "Registration successful",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Registration failed",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const fetchPrompts = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await fetch(`${API_URL}/prompts`, { headers });

      if (response.ok) {
        const data = await response.json();
        setPrompts(data.data);
      } else {
        console.error("Failed to fetch prompts");
      }
    } catch (error) {
      console.error("Error fetching prompts:", error);
    }
  };

  const updatePrompt = async (promptId, updatedPrompt) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/${promptId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: updatedPrompt }),
      });

      if (response.ok) {
        const data = await response.json();
        const updatedPrompts = prompts.map((prompt) => (prompt.id === promptId ? data.data : prompt));
        setPrompts(updatedPrompts);
        setEditingPromptId(null);
        toast({
          title: "Prompt updated",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Failed to update prompt",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error updating prompt:", error);
    }
  };

  const deletePrompt = async (promptId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/prompts/${promptId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const updatedPrompts = prompts.filter((prompt) => prompt.id !== promptId);
        setPrompts(updatedPrompts);
        toast({
          title: "Prompt deleted",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Failed to delete prompt",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error deleting prompt:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setPrompts([]);
  };

  if (!isLoggedIn) {
    return (
      <Box p={4}>
        <Navbar />
        <Box mt={8}>
          <VStack spacing={4} align="stretch">
            <Heading size="md" mb={4}>
              Prompts
            </Heading>
            {prompts.map((prompt) => (
              <Card key={prompt.id}>
                <CardHeader>
                  <Heading size="md">{prompt.attributes.name}</Heading>
                </CardHeader>
                <CardBody>
                  <Text whiteSpace="pre-wrap">{prompt.attributes.prompt}</Text>
                </CardBody>
              </Card>
            ))}
          </VStack>
        </Box>
        <Text mt={4}>
          <Button as={Link} to="/admin" variant="link">
            Login
          </Button>{" "}
          to create and manage prompts.
        </Text>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Navbar onLogout={logout} />
      {isLoggedIn && (
        <VStack spacing={4} align="stretch">
          <Button onClick={onCreatePromptOpen}>Create Prompt</Button>
        </VStack>
      )}
      <Box mt={8}>
        <VStack spacing={4} align="stretch">
          <Heading size="md" mb={4}>
            Prompts
          </Heading>
          {prompts.map((prompt) => (
            <Card key={prompt.id}>
              <CardHeader>
                <Heading size="md">{prompt.attributes.name}</Heading>
              </CardHeader>
              <CardBody>
                <Text whiteSpace="pre-wrap">{prompt.attributes.prompt}</Text>
                {isLoggedIn && (
                  <HStack mt={4} justify="flex-end">
                    <Button
                      size="sm"
                      onClick={() => {
                        setEditingPromptId(prompt.id);
                      }}
                    >
                      <FaEdit />
                    </Button>
                    <Button size="sm" onClick={() => deletePrompt(prompt.id)}>
                      <FaTrash />
                    </Button>
                  </HStack>
                )}
              </CardBody>
            </Card>
          ))}
        </VStack>
      </Box>
      <CreatePromptModal
        isOpen={isCreatePromptOpen}
        onClose={onCreatePromptClose}
        onSubmit={async (newPrompt) => {
          const token = localStorage.getItem("token");
          const response = await fetch(`${API_URL}/prompts`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ data: newPrompt }),
          });

          if (response.ok) {
            const data = await response.json();
            setPrompts((prevPrompts) => [...prevPrompts, data.data]);
            toast({
              title: "Prompt created",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
          } else {
            toast({
              title: "Failed to create prompt",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          }
          onCreatePromptClose();
        }}
      />
    </Box>
  );
};

export default Index;
