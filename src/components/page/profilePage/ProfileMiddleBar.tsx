import { Box, Flex, Image, Tabs, Text } from '@chakra-ui/react';
import PopoverEditProfile from 'components/button/PopOverEditProfile';
import { getAllUsers } from 'features/dashboard/services/users.service';
import { getUserThread } from 'features/dashboard/services/thread.service';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserTypes } from 'types/users.types';
import { ThreadTypes } from 'types/threads.types';
import Cookies from 'js-cookie';

function ProfileMiddleBar() {
  const [value, setValue] = useState<string | null>('first');
  const [users, setUsers] = useState<UserTypes[]>([]);
  const [threads, setThreads] = useState<ThreadTypes[]>([]);
  const [isLoadingThreads, setIsLoadingThreads] = useState(true);

  useEffect(() => {
    retrieveUserProfile();
  }, []);

  const retrieveUserProfile = async () => {
    const token = Cookies.get('token');
    if (!token) {
      console.error('Token not found');
      return;
    }

    try {
      const decoded: { id: number } = JSON.parse(atob(token.split('.')[1]));
      const allUsers = await getAllUsers(token);
      const loggedInUser = allUsers.find((u: UserTypes) => u.id === decoded.id);
      setUsers(loggedInUser ? [loggedInUser] : []);

      if (loggedInUser) {
        fetchUserThreads(token, loggedInUser.id);
      }
    } catch (error) {
      console.error('Error in retrieveUserProfile:', error);
    }
  };

  const fetchUserThreads = async (token: string, userId: number) => {
    setIsLoadingThreads(true);
    try {
      const userThreads = await getUserThread(token, userId);
      setThreads(userThreads);
    } catch (error) {
      console.error('Error fetching user threads:', error);
    } finally {
      setIsLoadingThreads(false);
    }
  };

  return (
    <div>
      {users.length > 0 &&
        users.map((user) => (
          <Box py="2" px="5" key={user.id}>
            <Flex gap="3" align="center">
              <Link to="/">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
                  />
                </svg>
              </Link>
              <Text fontSize="18px" fontWeight="semibold">
                {user.profile?.[0]?.fullname}
              </Text>
            </Flex>
            <Box position="relative" mt="3">
              <Box position="relative">
                <Image
                  height="140px"
                  w="full"
                  borderRadius="7px"
                  src={user.profile?.[0]?.bannerImage}
                />
                <Image
                  src={user.profile?.[0]?.profileImage}
                  boxSize="80px"
                  borderRadius="full"
                  fit="cover"
                  alt=""
                  position="absolute"
                  top="97px"
                  left="10px"
                  border="4px solid"
                  borderColor="whiteAlpha.900"
                />
              </Box>
              <Box textAlign="right">
                <PopoverEditProfile transform="translate(-103%, -46%)" />
              </Box>
            </Box>
            <Box>
              <Text textAlign="left" mt="2" fontSize="20px" fontWeight="bold">
                {user.profile?.[0]?.fullname || 'Your Name'}
              </Text>
              <Text textAlign="left" fontSize="14px" color="gray.400">
                @{user.username || 'username'}
              </Text>
              <Text textAlign="left" fontSize="14px">
                {user.profile?.[0]?.bio || 'Your bio here...'}
              </Text>
              <Flex mt="2" gap="3">
                <Text className="text-[16px] font-normal text-gray-400">
                  <span className="text-white font-bold">
                    {user.followers?.length || 0}
                  </span>{' '}
                  Followers
                </Text>
                <Text className="text-[16px] font-normal text-gray-400">
                  <span className="text-white font-bold">
                    {user.following?.length || 0}
                  </span>{' '}
                  Following
                </Text>
              </Flex>
            </Box>
          </Box>
        ))}

      <Tabs.Root value={value} onValueChange={(e) => setValue(e.value)} mt="2">
        <Box width="100%">
          <Tabs.List display="flex" justifyContent="center" width="100%">
            <Box width="full" textAlign="center">
              <Tabs.Trigger
                value="first"
                style={{
                  display: 'inline-flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '40px',
                }}
              >
                All Post
              </Tabs.Trigger>
            </Box>
            <Box width="full" textAlign="center">
              <Tabs.Trigger
                value="second"
                style={{
                  display: 'inline-flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '40px',
                }}
              >
                Media
              </Tabs.Trigger>
            </Box>
          </Tabs.List>
        </Box>

        <Tabs.Content value="first">
          {isLoadingThreads ? (
            <Text>Loading threads...</Text>
          ) : threads && threads.length > 0 ? (
            threads.map((thread) => (
              <Box
                key={thread.id}
                borderBottom="1px solid"
                borderColor="gray.300"
              >
                <Box p="20px">
                  <Box display="flex" alignItems="start" gap="3">
                    <Image
                      src={thread.profile?.profileImage}
                      boxSize="40px"
                      borderRadius="full"
                      fit="cover"
                      alt=""
                    />
                    <Box display="flex" flexDirection="column">
                      <Box display="flex" gap="2">
                        <Text fontWeight="semibold">
                          {thread.profile?.fullname || 'Your Name'}
                        </Text>
                        <Text color="gray.400">
                          @{thread.author?.username || 'username'}{' '}
                          <span> • 17d</span>
                        </Text>
                      </Box>
                      <Link to={`/comment/${thread.id}`}>
                        <Text fontSize="14px" marginTop="2">
                          {thread.content}
                        </Text>
                        {thread.image && (
                          <img
                            src={thread.image}
                            alt=""
                            className="rounded-lg w-6/12 my-2"
                          />
                        )}
                      </Link>
                      <Box>
                        <Box
                          marginTop="2"
                          display="flex"
                          alignItems="center"
                          gap="3"
                        >
                          <Text display="flex" alignItems="center" gap="1">
                            <span className="text-[12px]">36 Likes</span>
                          </Text>
                          <Link
                            to={`/comment/${thread.id}`}
                            className="flex items-center gap-1 hover:text-[#817b7b]"
                          >
                            <span className="text-[12px] ">10 Replies</span>
                          </Link>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))
          ) : (
            <Text>No threads found.</Text>
          )}
        </Tabs.Content>

        <Tabs.Content value="second" py="1">
          <Text>Media Content Coming Soon</Text>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}

export default ProfileMiddleBar;
