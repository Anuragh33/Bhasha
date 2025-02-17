import { auth } from '@clerk/nextjs/server'

const authorisedUsers = ['user_2rCpjC3KrD9hGauCrfiW3vi5JDG']

export const getAdmin = async () => {
  const { userId } = await auth()

  if (!userId) return false

  return authorisedUsers.indexOf(userId) !== -1
}
