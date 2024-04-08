import { useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, Input, Textarea, Button } from "@chakra-ui/react";

const CreatePromptModal = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("");

  const handleSubmit = () => {
    onSubmit({ name, prompt });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Prompt</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>Name</FormLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Prompt</FormLabel>
            <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Create
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreatePromptModal;
