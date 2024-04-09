import { useContext } from 'react';
import { Box, Button, FormControl, FormLabel, Heading, Input, Stack, useColorModeValue, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthProvider';

export default function Admin() {
  const { login, isLoggedIn } = useContext(AuthContext);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
      await login(username, password);
      toast({
        title: 'Logged in.',
        description: "You are now logged in.",
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Login failed.',
        description: "Please check your credentials and try again.",
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (isLoggedIn) {
    navigate('/');
    return null;
  }

  return (
    <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
      <Stack align={'center'}>
        <Heading fontSize={'4xl'}>Sign in to your account</Heading>
      </Stack>
      <Box
        rounded={'lg'}
        bg={useColorModeValue('white', 'gray.700')}
        boxShadow={'lg'}
        p={8}>
        <Stack spacing={4}>
          <form onSubmit={handleSubmit}>
            <FormControl id="username">
              <FormLabel>Username</FormLabel>
              <Input type="text" value={""} onChange={(e) => setUsername(e.target.value)} />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input type="password" value={""} onChange={(e) => setPassword(e.target.value)} />
            </FormControl>
            <Stack spacing={10}>
              <Button
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
                type="submit"
              >
                Sign in
              </Button>
            </Stack>
          </form>
        </Stack>
      </Box>
    </Stack>
  );
}