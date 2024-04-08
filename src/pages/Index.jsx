import { useState, useEffect } from "react";
import { Box, Button, FormControl, FormLabel, Input, Textarea, VStack, HStack, Text, Heading, useToast, Card, CardHeader, CardBody } from "@chakra-ui/react";
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
  const [promptName, setPromptName] = useState("");
  const [promptText, setPromptText] = useState("");
  const [editingPromptId, setEditingPromptId] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchPrompts(token);
    }
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

  const fetchPrompts = async (token) => {
    try {
      const response = await fetch(`${API_URL}/prompts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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

  const createPrompt = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/prompts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: { name: promptName, prompt: promptText } }),
      });

      if (response.ok) {
        const data = await response.json();
        setPrompts([...prompts, data.data]);
        setPromptName("");
        setPromptText("");
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
    } catch (error) {
      console.error("Error creating prompt:", error);
    }
  };

  const updatePrompt = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/prompts/${editingPromptId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: { name: promptName, prompt: promptText } }),
      });

      if (response.ok) {
        const data = await response.json();
        const updatedPrompts = prompts.map((prompt) => (prompt.id === editingPromptId ? data.data : prompt));
        setPrompts(updatedPrompts);
        setEditingPromptId(null);
        setPromptName("");
        setPromptText("");
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
        <Heading mb={4}>Login</Heading>
        <FormControl id="username" mb={4}>
          <FormLabel>Username</FormLabel>
          <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </FormControl>
        <FormControl id="password" mb={4}>
          <FormLabel>Password</FormLabel>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </FormControl>
        <Button onClick={login} mb={4}>
          Login
        </Button>
        <Text>
          Don't have an account?{" "}
          <Button as={Link} to="/register" variant="link">
            Register
          </Button>
        </Text>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Navbar onLogout={logout} />
      <VStack spacing={4} align="stretch">
        <FormControl id="promptName">
          <FormLabel>Prompt Name</FormLabel>
          <Input type="text" value={promptName} onChange={(e) => setPromptName(e.target.value)} />
        </FormControl>
        <FormControl id="promptText">
          <FormLabel>Prompt Text</FormLabel>
          <Textarea value={promptText} onChange={(e) => setPromptText(e.target.value)} />
        </FormControl>
        {editingPromptId ? <Button onClick={updatePrompt}>Update Prompt</Button> : <Button onClick={createPrompt}>Create Prompt</Button>}
      </VStack>
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
                <Text>{prompt.attributes.prompt}</Text>
                <HStack mt={4} justify="flex-end">
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditingPromptId(prompt.id);
                      setPromptName(prompt.attributes.name);
                      setPromptText(prompt.attributes.prompt);
                    }}
                  >
                    <FaEdit />
                  </Button>
                  <Button size="sm" onClick={() => deletePrompt(prompt.id)}>
                    <FaTrash />
                  </Button>
                </HStack>
              </CardBody>
            </Card>
          ))}
        </VStack>
        </Box>
    </Box>
  );
};

export default Index;
