import { useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, Input, Textarea, Button } from "@chakra-ui/react";

const EditPromptModal = ({ isOpen, onClose, onSubmit, initialValues }) => {
  const [name, setName] = useState(initialValues.name || "");
  const [prompt, setPrompt] = useState(initialValues.prompt || "");

  const handleSubmit = () => {
    onSubmit({ name, prompt });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Prompt</ModalHeader>
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
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditPromptModal;
